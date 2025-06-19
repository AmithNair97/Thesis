"use client";

import { useEffect, useState } from "react";
import withAuth from "@/utils/withAuth";

function ProfilePage() {
  const [user, setUser] = useState({ name: "", email: "", role: "Admin" });
  const [datafiles, setDatafiles] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const u = sessionStorage.getItem("user");
    if (u) setUser(JSON.parse(u));

    fetch("http://localhost:8000/datafiles")
      .then((res) => res.json())
      .then((files) => setDatafiles(files.filter((f: any) => f.author === JSON.parse(u!).name)));
  }, []);

  return (
    <div className="p-6 bg-[#F7F8FA] min-h-screen">
      <h2 className="text-xl font-semibold mb-4">👤 Profile Overview</h2>

      {/* Top Boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* User Details */}
        <div className="bg-white p-4 shadow-md rounded-md">
          <h3 className="font-bold mb-2">Details</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email || "-"}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>

        {/* Recent Actions */}
        <div className="bg-white p-4 shadow-md rounded-md">
          <h3 className="font-bold mb-2">🕓 Recent Actions</h3>
          <ul className="list-disc list-inside text-sm text-gray-700">
            <li>Logged in</li>
            <li>Uploaded new data files</li>
            <li>Created new dataset</li>
          </ul>
        </div>
      </div>

      {/* Uploaded Files */}
      <div className="bg-white p-4 shadow-md rounded-md">
        <h3 className="font-bold mb-2">📄 Files Uploaded by You</h3>
        <ul className="list-disc ml-5 text-sm text-blue-600">
          {(showAll ? datafiles : datafiles.slice(0, 5)).map((file, index) => (
            <li key={index}>
              <a
                href={`/list/datafiles?dataset=${file.dataset}&category=${file.category}`}
                className="hover:underline"
              >
                {file.name} ({file.dataset} / {file.category})
              </a>
            </li>
          ))}
        </ul>

        {datafiles.length > 5 && (
          <button
            className="text-xs text-blue-500 mt-2 hover:underline"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show less ▲" : "Show more ▼"}
          </button>
        )}
      </div>
    </div>
  );
}

export default withAuth(ProfilePage);
