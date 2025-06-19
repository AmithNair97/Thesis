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

type Props = {
  fromDate: string | null;
  toDate: string | null;
  dataset: string | null;
};

type UploadData = {
  date: string;
  count: number;
};

export default function DateLineChart({ fromDate, toDate, dataset }: Props) {
  const [data, setData] = useState<UploadData[]>([]);

  useEffect(() => {
  if (!fromDate || !toDate || !dataset) return;

  axios
    .get(`http://localhost:8000/datafiles/by-date-range?from=${fromDate}&to=${toDate}&dataset=${dataset}`)
    .then((res) => {
      console.log("🟢 Raw API Data:", res.data);

      const from = new Date(fromDate);
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999); // include full day

      const grouped: { [key: string]: number } = {};

      res.data.forEach((file: any) => {
        const fileDate = new Date(file.created_at);
        const dateOnly = fileDate.toISOString().split("T")[0];

        console.log(`🟡 Checking file: ${file.name}`);
        console.log("File created_at:", fileDate.toISOString());
        console.log("From:", from.toISOString(), "To:", to.toISOString());

        if (fileDate >= from && fileDate <= to) {
          grouped[dateOnly] = (grouped[dateOnly] || 0) + 1;
        } else {
          console.log("🔴 Skipped (out of range)");
        }
      });

      const result: UploadData[] = Object.entries(grouped).map(
        ([date, count]) => ({ date, count })
      );

      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setData(result);
    });
}, [fromDate, toDate, dataset]);


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
