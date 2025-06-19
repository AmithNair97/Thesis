"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

type Props = {
  fromDate: string | null;
  toDate: string | null;
  dataset: string | null;
};

export default function DateTotalUploads({ fromDate, toDate, dataset }: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!fromDate || !toDate || !dataset) return;

    axios.get(`http://localhost:8000/datafiles/by-date-range?from=${fromDate}&to=${toDate}&dataset=${dataset}`)
      .then((res) => {
        setCount(res.data.length);
      });
  }, [fromDate, toDate, dataset]);

  return (
    <div className="...">
      <h3>Uploads from {fromDate} to {toDate}</h3>
      <p className="text-3xl font-bold">{count}</p>
    </div>
  );
}

