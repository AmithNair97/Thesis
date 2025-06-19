"use client";

import { useEffect, useState } from "react";
import Announcements from "@/components/Announcements";
import EventCalendar from "@/components/EventCalendar";
import DataBarChart from "@/components/DataBarChart";
import UploadsLineChart from "@/components/UploadsLineChart";
import RecentUploads from "@/components/RecentUploads";
import TotalUploads from "@/components/TotalUploads";
import DatasetSelector from "@/components/DatasetSelector";
import CategoryBox from "@/components/CategoryBox";
import ProtectedPage from "@/components/ProtectedPage";

const AdminPage = () => {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);


  return (
    <ProtectedPage>
      <div className="p-4 flex flex-col gap-4">
        {/* ✅ Top User Info */}
        {user && (
          <div className="bg-gray-100 p-3 rounded-xl text-gray-700 font-medium shadow-sm">
            👋 Welcome, <span className="text-blue-600">{user.name}</span> ({user.role})
          </div>
        )}

        <div className="flex gap-4 flex-col lg:flex-row">
          {/* LEFT SIDE */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {/* Only allow non-students to choose dataset */}
            {user?.role !== "Student" && <DatasetSelector />}
            <CategoryBox />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <TotalUploads type="today" />
              <TotalUploads type="week" />
              <TotalUploads type="month" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UploadsLineChart />
              <DataBarChart />
            </div>
            <RecentUploads />
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <EventCalendar />
            <Announcements />
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
};

export default AdminPage;
