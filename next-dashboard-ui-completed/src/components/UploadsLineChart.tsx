"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Define type for chart data
type UploadData = {
  date: string;
  count: number;
};

export default function UploadsLineChart() {
  const [data, setData] = useState<UploadData[]>([]);

  useEffect(() => {
    axios.get("http://localhost:8000/datafiles").then((res) => {
      const grouped: { [key: string]: number } = {};

      res.data.forEach((file: any) => {
        const dateOnly = file.created_at?.split("T")[0];
        if (dateOnly) {
          grouped[dateOnly] = (grouped[dateOnly] || 0) + 1;
        }
      });

      const result: UploadData[] = Object.entries(grouped).map(([date, count]) => ({
        date,
        count,
      }));

      // Sort by date
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setData(result);
    });
  }, []);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 transition-all hover:shadow-2xl">
      <h3 className="text-md font-semibold mb-4 text-gray-800">📈 Uploads Over Time</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
