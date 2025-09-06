"use client";

import { useState } from "react";
import { DashboardEkspor } from "@/components/dashboard/ekspor/DashboardEkspor";

export default function ReportingDashboard() {
  const [activeTab, setActiveTab] = useState("smkhp");

  return (
    <div>
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        {[
          { id: "smkhp", label: "SMKHP" },
          { id: "primer", label: "Primer" },
          { id: "skp", label: "SKP" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      {activeTab === "smkhp" && (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 space-y-6 xl:col-span-12">
            <DashboardEkspor />
            {/* <MonthlySalesChart /> */}
          </div>
          {/* <div className="col-span-12 xl:col-span-5">
            <MonthlyTarget />
          </div> */}
        </div>
      )}

      {activeTab === "primer" && (
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Dashboard Primer</h2>
          <p>Isi konten khusus Primer di sini...</p>
        </div>
      )}

      {activeTab === "skp" && (
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Dashboard SKP</h2>
          <p>Isi konten khusus SKP di sini...</p>
        </div>
      )}
    </div>
  );
}
