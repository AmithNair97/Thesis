"use client";
import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";

interface FilePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileUrl: string;
}

const ExcelPreviewModal = ({ isOpen, onClose, fileUrl }: FilePreviewModalProps) => {
    const [data, setData] = useState<any[][]>([]);
    const [rawText, setRawText] = useState<string>("");

    useEffect(() => {
        const loadFile = async () => {
            try {
                console.log("🔄 Fetching file from:", fileUrl);
                const res = await fetch(fileUrl);
                if (!res.ok) {
                    console.error("❌ Failed to fetch file. Status:", res.status);
                    return;
                }

                const blob = await res.blob();
                const extension = fileUrl.split(".").pop()?.toLowerCase();
                console.log("📄 File extension:", extension);

                if (extension === "xlsx") {
                    const arrayBuffer = await blob.arrayBuffer();
                    const workbook = XLSX.read(arrayBuffer, { type: "array" });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const parsed = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    console.log("📊 Parsed .xlsx:", parsed);
                    if (Array.isArray(parsed)) setData(parsed as any[][]);
                    setRawText("");
                } else if (extension === "csv") {
                    const text = await blob.text();
                    const parsed = Papa.parse<string[]>(text, { header: false });
                    console.log("📈 Parsed .csv:", parsed.data);
                    if (Array.isArray(parsed.data)) setData(parsed.data as any[][]);
                    setRawText("");
                } else if (extension === "txt") {
                    const text = await blob.text();
                    console.log("📃 Raw .txt content:", text);
                    setRawText(text);
                    setData([]);
                } else {
                    console.warn("⚠️ Unsupported file extension:", extension);
                }
            } catch (error) {
                console.error("🚨 Error during file preview:", error);
            }
        };

        if (isOpen) loadFile();
    }, [fileUrl, isOpen]);

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-5xl max-h-[90vh] overflow-auto rounded bg-white p-6 shadow-lg">
                    <Dialog.Title className="text-lg font-bold mb-4">File Preview</Dialog.Title>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-black"
                    >
                        ✖
                    </button>

                    {rawText ? (
                        <pre className="whitespace-pre-wrap text-sm">{rawText}</pre>
                    ) : data.length > 0 ? (
                        <>
                            <table className="w-full table-auto text-sm">
                                <thead>
                                    <tr>
                                        {data[0]?.slice(0, 20).map((_: any, i: number) => (
                                            <th key={i} className="px-2 py-1 border font-semibold">Col {i + 1}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.slice(1, 50).map((row: any[], idx: number) => (
                                        <tr key={idx}>
                                            {row.slice(0, 20).map((val, i) => (
                                                <td key={i} className="px-2 py-1 border">{String(val)}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <p className="text-gray-400 text-xs mt-2">
                                Preview limited to first 50 rows and 20 columns
                            </p>
                        </>
                    ) : (
                        <p className="text-gray-500">Loading or no data available.</p>
                    )}

                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default ExcelPreviewModal;
