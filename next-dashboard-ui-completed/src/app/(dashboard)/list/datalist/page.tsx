"use client";

import { useState } from "react";
import { useDataset } from "@/context/DatasetContext";

import Announcements from "@/components/Announcements";
import EventCalendar from "@/components/EventCalendar";
import DataBarChart from "@/components/DataBarChart";
import DateTotalUploads from "@/components/DateTotalUploads";
import DateLineChart from "@/components/DateLineChart";
import DateRecentUploads from "@/components/DateRecentUploads";
import DatasetSelector from "@/components/DatasetSelector";
import CategoryBox from "@/components/DateCategoryBox";
import DateRangePicker from "@/components/DateRangePicker";
import withAuth from "@/utils/withAuth";
import DownloadGuide from "@/components/DownloadGuide";

const DataListPage = () => {
  const { selectedDataset } = useDataset();
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const isValid = selectedDataset && fromDate && toDate;

  return (
    <div className="p-4 grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Filters */}
      <div className="col-span-2 bg-white p-4 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">🔍 Filter Data</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DatasetSelector />
          <div className="grid grid-cols-2 gap-4">
            <DateRangePicker
              fromDate={fromDate}
              toDate={toDate}
              setFromDate={setFromDate}
              setToDate={setToDate}
            />
          </div>
        </div>
      </div>

      {/* Upload Count */}
      {isValid && (
        <div className="bg-white p-4 rounded-2xl shadow-md">
          <h3 className="text-md font-semibold text-gray-700 mb-2">📊 Upload Count</h3>
          <p className="text-gray-500 text-sm mb-1">
            Uploads from {fromDate} to {toDate}
          </p>
          <DateTotalUploads
            fromDate={fromDate}
            toDate={toDate}
            dataset={selectedDataset}
          />
        </div>
      )}

      {/* Guide Message */}
      <div className="col-span-3">
        <DownloadGuide
          dataset={selectedDataset}
          fromDate={fromDate}
          toDate={toDate}
          category={selectedCategory}
        />
      </div>

      {/* Categories */}
      <div className="col-span-3 bg-white p-4 rounded-2xl shadow-md">
        <h3 className="text-md font-semibold mb-2">📂 Categories in <span className="text-blue-500">{selectedDataset}</span></h3>
        <CategoryBox onSelectCategory={setSelectedCategory} />
      </div>

      {/* File Uploads */}
      <div className="col-span-2 bg-white p-4 rounded-2xl shadow-md">
        <h3 className="text-md font-semibold text-gray-700 mb-2">🗃️ File Uploads</h3>
        {isValid ? (
          <DateRecentUploads
            fromDate={fromDate}
            toDate={toDate}
            dataset={selectedDataset}
            category={selectedCategory}
          />
        ) : (
          <div className="text-gray-400">Select filters to view uploads.</div>
        )}
      </div>

      {/* Upload Graph */}
      {isValid && (
        <div className="bg-white p-4 rounded-2xl shadow-md">
          <h3 className="text-md font-semibold text-gray-700 mb-2">📈 Uploads Over Time</h3>
          <DateLineChart
            fromDate={fromDate}
            toDate={toDate}
            dataset={selectedDataset}
          />
        </div>
      )}
    </div>
  );
};

export default withAuth(DataListPage);