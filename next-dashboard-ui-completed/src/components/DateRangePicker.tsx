// components/DateRangePicker.tsx
import React from "react";

const DateRangePicker = ({ fromDate, toDate, setFromDate, setToDate }: any) => {
  return (
    <div className="flex gap-4 items-center mb-4">
      <div>
        <label className="block text-sm">From:</label>
        <input
          type="date"
          value={fromDate || ""}
          onChange={(e) => setFromDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>
      <div>
        <label className="block text-sm">To:</label>
        <input
          type="date"
          value={toDate || ""}
          onChange={(e) => setToDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
