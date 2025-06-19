"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Table from "@/components/Table";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Link from "next/link";
import FormModal from "@/components/FormModal";
import withAuth from "@/utils/withAuth";

const columns = [
    {
        header: "Category Name",
        accessor: "name",
        className: "hidden md:table-cell",
    },
    {
        header: "Author",
        accessor: "author",
        className: "hidden md:table-cell",
    },
    {
        header: "Dataset",
        accessor: "dataset",
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

const CategoryListPage = () => {
    const role = "admin"; // Example hardcoded role
    const searchParams = useSearchParams();
    const dataset = searchParams.get("dataset");
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (dataset) {
            fetch(`http://localhost:8000/categories/by-dataset/${dataset}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log("📦 Categories:", data);
                    setCategories(data);
                    setLoading(false);
                });
        }
    }, [dataset]);

    const renderRow = (item: any) => (
        <tr
            key={item._id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
        >
            <Link href={`/list/datafiles?dataset=${dataset}&category=${item.name}`}>
                <td className="p-4">{item.name}</td>
            </Link>

            <td className="hidden md:table-cell">{item.author}</td>
            <td className="hidden md:table-cell">{item.dataset}</td>
            <td className="hidden md:table-cell">
                {item.created_at?.split("T")[0]}
            </td>
            <td className="hidden md:table-cell">
                {item.created_at?.split("T")[1]?.slice(0, 8)}
            </td>
            <td>
                <div className="flex items-center gap-2">
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
                    Categories in <span className="text-lamaPurple">{dataset}</span>
                </h1>
                <div className="flex items-center gap-4">
                    <TableSearch />
                    {role === "admin" && (
                        <Link href="/list/categories/add">
                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                                <Image src="/create.png" alt="" width={14} height={14} />
                            </button>
                        </Link>
                    )}
                </div>
            </div>

            {/* LIST */}
            {loading ? (
                <p className="text-gray-500">Loading categories...</p>
            ) : categories.length === 0 ? (
                <p className="text-gray-500">No categories found.</p>
            ) : (
                <Table columns={columns} renderRow={renderRow} data={Array.isArray(categories) ? categories : []} />
            )}


        </div>
    );
};

export default withAuth(CategoryListPage);
