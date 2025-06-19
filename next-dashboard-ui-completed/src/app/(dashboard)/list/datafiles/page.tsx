"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import FormModal from "@/components/FormModal";
import Image from "next/image";
import ExcelPreviewModal from "@/components/ExcelPreviewModal";
import withAuth from "@/utils/withAuth";


const DatafilesListPage = () => {
  const role = "admin"; // Example hardcoded role
  const searchParams = useSearchParams();
  const dataset = searchParams.get("dataset");
  const category = searchParams.get("category");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState("");
  const [datafiles, setDatafiles] = useState([]);


  useEffect(() => {
    if (dataset && category) {
      fetch(`http://localhost:8000/datafiles/by-dataset-and-category?dataset=${dataset}&category=${category}`)
        .then((res) => res.json())
        .then((data) => {
          setDatafiles(data);
          setLoading(false);
        });
    }
  }, [dataset, category]);
  

  const columns = [
    { header: "File Name", accessor: "name" },
    { header: "S3 Link", accessor: "link", className: "hidden md:table-cell" },
    { header: "Date", accessor: "created_at", className: "hidden md:table-cell" },
    { header: "Time", accessor: "created_at", className: "hidden md:table-cell" },
    { header: "Author", accessor: "author", className: "hidden md:table-cell" },
    { header: "Actions", accessor: "actions", className: "text-center" }, // ✅ Added dummy accessor
  ];
  
  const handleViewClick = (url: string) => {
    setSelectedFileUrl(url);
    setIsModalOpen(true);
  };

  const renderRow = (item: any) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="p-4">{item.name}</td>
      <td className="hidden md:table-cell">
        <a
          href={encodeURI(`https://redpitaya-experiments-data.s3.us-east-1.amazonaws.com/${dataset}/${category}/${item.name}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Download File
        </a>
      </td>


      <td className="hidden md:table-cell">
        {item.created_at?.split("T")[0]}
      </td>
      <td className="hidden md:table-cell">
        {item.created_at?.split("T")[1]?.slice(0, 8)}
      </td>
      <td className="hidden md:table-cell">{item.author}</td>

      <td>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewClick(`https://redpitaya-experiments-data.s3.us-east-1.amazonaws.com/${dataset}/${category}/${item.name}`)}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky"
          >
            <Image src="/view.png" alt="view" width={16} height={16} />
          </button>

          {role === "admin" && (
            <FormModal table="dataset" type="delete" id={item._id} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="hidden md:block text-lg font-semibold">
          Datafiles in <span className="text-lamaPurple">{dataset}</span> /{" "}
          <span className="text-lamaPurple">{category}</span>
        </h1>
        <div className="flex items-center gap-4">
          <TableSearch />
        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-gray-500">Loading datafiles...</p>
      ) : datafiles.length === 0 ? (
        <p className="text-gray-500">No datafiles found.</p>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={Array.isArray(datafiles) ? datafiles : []} />
      )}

    
      <ExcelPreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fileUrl={selectedFileUrl}
      />

    </div>
  );
};

export default withAuth(DatafilesListPage);

import * as XLSX from "xlsx";

const handleViewFile = async (url: string) => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const arrayBuffer = await blob.arrayBuffer();

    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log("Parsed Excel Data:", jsonData);

    // TODO: You can store this in state and display in a modal/table
    alert("Check console for parsed Excel data.");
  } catch (err) {
    console.error("Failed to load Excel file:", err);
  }
};
