from fastapi import FastAPI, Request, HTTPException, Body, UploadFile, File, Form
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import boto3
import os
from bson import ObjectId
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Response, Depends
from pydantic import BaseModel

load_dotenv()

# AWS setup
s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name="us-east-1"
)
BUCKET_NAME = "redpitaya-experiments-data"

app = FastAPI()

# Allow frontend (like React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Use ["http://localhost:3000"] for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_URI)
db = client["redpitaya"]
datasets_collection = db["datasets"]
categories_collection = db["categories"]
datafiles_collection = db["datafiles"]
users_collection = db["user"]

def serialize_document(doc):
    doc["_id"] = str(doc["_id"])
    if "created_at" in doc and isinstance(doc["created_at"], datetime):
        doc["created_at"] = doc["created_at"].isoformat()
    return doc

def serialize_user(doc):
    return {
        "_id": str(doc["_id"]),
        "name": doc["name"],
        "email": doc["email"],
        "role": doc.get("role", "Student")
    }

@app.get("/")
async def home():
    return {"message": "✅ FastAPI is running..."}

@app.get("/datasets")
async def get_datasets():
    cursor = datasets_collection.find({})
    return [serialize_document(doc) async for doc in cursor]

@app.get("/categories")
async def get_categories():
    cursor = categories_collection.find({})
    return [serialize_document(doc) async for doc in cursor]

@app.get("/datafiles")
async def get_datafiles():
    cursor = datafiles_collection.find({})
    return [serialize_document(doc) async for doc in cursor]

@app.get("/categories/by-dataset/{dataset_name}")
async def get_categories_by_dataset(dataset_name: str):
    cursor = categories_collection.find({"dataset": dataset_name})
    return [serialize_document(doc) async for doc in cursor]

@app.get("/datafiles/by-dataset-and-category")
async def get_datafiles_by_dataset_and_category(dataset: str, category: str):
    datafiles = await datafiles_collection.find({"dataset": dataset, "category": category}).to_list(length=None)
    return [serialize_document(doc) for doc in datafiles]

@app.post("/register")
async def register_user(user: dict = Body(...)):
    if await users_collection.find_one({"email": user["email"]}):
        raise HTTPException(status_code=400, detail="Email already registered")

    user_data = {
        "name": user["name"],
        "email": user["email"],
        "password": user["password"],  # ⚠️ Later: hash this!
        "role": "Student"
    }
    result = await users_collection.insert_one(user_data)
    user_data["_id"] = str(result.inserted_id)
    return {"message": "User registered successfully", "user": serialize_user(user_data)}

class LoginRequest(BaseModel):
    email: str
    password: str


@app.post("/login")
async def login_user(user: LoginRequest, response: Response):
    # ✅ Look up user by email in MongoDB
    user_in_db = await users_collection.find_one({"email": user.email})
    
    # ✅ Validate password (plaintext check for now — should be hashed!)
    if not user_in_db or user_in_db["password"] != user.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # ✅ Set session cookie with user's email (for simplicity)
    response.set_cookie(
        key="session",
        value=user.email,
        httponly=True,
        samesite="Lax"
    )

    return {
        "user": {
            "name": user_in_db["name"],
            "role": user_in_db["role"],
        }
    }

@app.get("/me")
async def get_current_user(request: Request):
    email = request.cookies.get("session")

    if not email:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user = await users_collection.find_one({"email": email})

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    # Remove sensitive fields like password
    user["_id"] = str(user["_id"])  # Convert ObjectId to string
    user.pop("password", None)      # Remove password from response

    return user


@app.post("/logout")
async def logout_user(response: Response):  # <-- add response here
    response.delete_cookie("session")
    return {"message": "Logged out successfully"}

@app.post("/add-dataset")
async def add_dataset(request: Request):
    data = await request.json()
    if await datasets_collection.find_one({"name": data["name"]}):
        raise HTTPException(status_code=400, detail="Dataset name already exists")

    dataset = {"name": data["name"], "author": data["author"], "created_at": datetime.utcnow()}
    await datasets_collection.insert_one(dataset)

    try:
        s3.put_object(Bucket=BUCKET_NAME, Key=f"{data['name']}/")
    except Exception as e:
        print("❌ S3 Error:", e)
        return JSONResponse(status_code=500, content={"detail": "Dataset saved, but failed to create S3 folder."})

    return {"message": "Dataset created successfully"}

@app.post("/add-category")
async def add_category(request: Request):
    data = await request.json()
    existing = await categories_collection.find_one({"name": data["name"], "dataset": data["dataset"]})
    if existing:
        raise HTTPException(status_code=400, detail="Category already exists for this dataset")

    category = {
        "name": data["name"],
        "dataset": data["dataset"],
        "author": data["author"],
        "created_at": datetime.utcnow()
    }
    await categories_collection.insert_one(category)

    try:
        s3.put_object(Bucket=BUCKET_NAME, Key=f"{data['dataset']}/{data['name']}/")
    except Exception as e:
        print("❌ S3 Error while creating category folder:", e)
        return JSONResponse(status_code=500, content={"detail": "Category saved, but failed to create S3 folder."})

    return {"message": "Category created successfully"}

@app.post("/upload-file")
async def upload_file(
    file: UploadFile = File(...),
    dataset: str = Form(...),
    category: str = Form(...),
    author: str = Form(...)
):
    s3_key = f"{dataset}/{category}/{file.filename}"
    try:
        s3.upload_fileobj(file.file, BUCKET_NAME, s3_key)
        await datafiles_collection.insert_one({
            "name": file.filename,
            "dataset": dataset,
            "category": category,
            "created_at": datetime.utcnow(),
            "author": author
        })
        return {"message": "File uploaded successfully"}
    except Exception as e:
        print("❌ Upload Error:", e)
        raise HTTPException(status_code=500, detail="Upload failed")

@app.get("/datafiles/by-author/{author_name}")
async def get_datafiles_by_author(author_name: str):
    cursor = datafiles_collection.find({"author": author_name})
    return [serialize_document(doc) async for doc in cursor]

@app.get("/datafiles/category-count/by-dataset/{dataset_name}")
async def get_file_count_per_category(dataset_name: str):
    pipeline = [
        {"$match": {"dataset": dataset_name}},
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$project": {"category": "$_id", "count": 1, "_id": 0}}
    ]
    result = await datafiles_collection.aggregate(pipeline).to_list(length=None)
    return result

from fastapi import Query
from datetime import datetime
from fastapi import HTTPException

@app.get("/datafiles/by-date-range")
async def get_datafiles_by_date_range(
    from_date: str = Query(..., alias="from"),
    to_date: str = Query(..., alias="to"),
    dataset: str = Query(None)
):
    try:
        from_dt = datetime.strptime(from_date, "%Y-%m-%d").date()
        to_dt = datetime.strptime(to_date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format.")

    query = {}
    if dataset:
        query["dataset"] = { "$regex": f"^{dataset}$", "$options": "i" }

    cursor = datafiles_collection.find(query)
    raw_results = [serialize_document(doc) async for doc in cursor]

    # ✅ Filter by date only (compare date part)
    results = []
    for doc in raw_results:
        try:
            doc_date = datetime.fromisoformat(doc["created_at"]).date()
            if from_dt <= doc_date <= to_dt:
                results.append(doc)
        except Exception as e:
            print(f"❌ Skipping invalid date: {doc.get('created_at')} → {e}")

    print(f"✅ Final matched count: {len(results)}")
    return results
