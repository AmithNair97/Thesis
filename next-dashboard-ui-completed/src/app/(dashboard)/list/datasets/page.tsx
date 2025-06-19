"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import withAuth from "@/utils/withAuth";

const columns = [
  {
    header: "Name",
    accessor: "name",
  },
  {
    header: "Author",
    accessor: "author",
    className: "hidden md:table-cell",
  },
  {
    header: "Date",
    accessor: "created_at",
    className: "hidden md:table-cell",
  },
  {
    header: "Time",
    accessor: "created_at",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const DatasetListPage = () => {
  const [datasets, setDatasets] = useState<any[]>([]);

  // 🔒 TEMP: Commented login logic, using static role
  // const [role, setRole] = useState("");
  // useEffect(() => {
  //   const storedUser = sessionStorage.getItem("user");
  //   if (storedUser) {
  //     const parsed = JSON.parse(storedUser);
  //     setRole(parsed.role);
  //   }
  // }, []);
  
  const role = "Admin"; // ✅ Hardcoded temporarily

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const res = await fetch("http://localhost:8000/datasets");
        const data = await res.json();
        setDatasets(data);
      } catch (err) {
        console.error("Failed to fetch datasets", err);
      }
    };

    fetchDatasets();
  }, []);

  const renderRow = (item: any) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <Link href={`/list/categories?dataset=${item.name}`}>
        <td className="p-4 cursor-pointer">{item.name}</td>
      </Link>
      <td className="hidden md:table-cell">{item.author}</td>
      <td className="hidden md:table-cell">
        {item.created_at?.split("T")[0]}
      </td>
      <td className="hidden md:table-cell">
        {item.created_at?.split("T")[1]?.slice(0, 8)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "Admin" && (
            <FormModal table="dataset" type="delete" id={item._id} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="relative bg-white p-4 rounded-md flex-1 m-4 mt-0 overflow-hidden">
      {/* Watermark */}
      <Image
        src="/uni.png"
        alt="Watermark"
        width={260}
        height={260}
        className="absolute bottom-6 right-6 opacity-30 pointer-events-none z-0"
      />

      {/* Main Content */}
      <div className="relative z-10">
        {/* TOP */}
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">All Datasets</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />
            <div className="flex items-center gap-4 self-end">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                <Image src="/sort.png" alt="" width={14} height={14} />
              </button>
              {role === "Admin" && (
                <Link href="/list/datasets/add">
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                    <Image src="/create.png" alt="" width={14} height={14} />
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* TABLE */}
        <Table columns={columns} renderRow={renderRow} data={datasets} />
      </div>
    </div>
  );
};

export default withAuth(DatasetListPage);
