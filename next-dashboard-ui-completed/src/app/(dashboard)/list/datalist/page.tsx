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


const DataListPage = () => {
    const { selectedDataset } = useDataset();
    const [fromDate, setFromDate] = useState<string | null>(null);
    const [toDate, setToDate] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);


    const isValid = selectedDataset && fromDate && toDate;

    return (
        <div className="p-4 flex gap-4 flex-col lg:flex-row">
            {/* LEFT SECTION */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
                {/* Dataset and Date Filters */}
                <DatasetSelector />
                <DateRangePicker
                    fromDate={fromDate}
                    toDate={toDate}
                    setFromDate={setFromDate}
                    setToDate={setToDate}
                />

                {/* Category Display */}
                {selectedDataset ? (
                    <CategoryBox onSelectCategory={setSelectedCategory} />

                ) : (
                    <div className="text-gray-500 italic">Please select a dataset to view categories.</div>
                )}

                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isValid ? (
                        <DateTotalUploads
                            fromDate={fromDate}
                            toDate={toDate}
                            dataset={selectedDataset}
                        />
                    ) : (
                        <div className="col-span-full text-gray-400">
                            Select dataset and date range to view upload stats.
                        </div>
                    )}
                </div>

                {/* Recent Uploads */}
                {isValid ? (
                    <DateRecentUploads
                        fromDate={fromDate}
                        toDate={toDate}
                        dataset={selectedDataset}
                        category={selectedCategory}
                    />

                ) : (
                    <div className="text-gray-400 mt-2">Select dataset and date range to view recent uploads.</div>
                )}
            </div>
        </div>
    );
};

export default withAuth(DataListPage);
