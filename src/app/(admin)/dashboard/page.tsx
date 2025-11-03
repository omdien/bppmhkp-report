"use client";

import { useState } from "react";

// import dynamic from "next/dynamic";

import { DashboardEkspor } from "@/components/dashboard/ekspor/DashboardEkspor";
import { DashboardPrimer} from "@/components/dashboard/primer/DahsboardPrimer";
import { DashboardSKP } from "@/components/dashboard/skp/DashboardSKP";
// const DashboardSKP = dynamic(
//   () => import("@/components/dashboard/skp/DashboardSKP"),
//   { ssr: false } 
// );

// const DashboardEkspor = dynamic(() => import("@/components/dashboard/ekspor/DashboardEkspor"), { ssr: false });
// const DashboardPrimer = dynamic(() => import("@/components/dashboard/primer/DahsboardPrimer"), { ssr: false });
// const DashboardSKP = dynamic(() => import("@/components/dashboard/skp/DashboardSKP"), { ssr: false });

export default function ReportingDashboard() {
  const [activeTab, setActiveTab] = useState("primer");

  return (
    <div>
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        {[
          { id: "primer", label: "Primer" },
          { id: "skp", label: "SKP" },
          { id: "smkhp", label: "SMKHP" }
          
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs Content */}

      {activeTab === "primer" && (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 space-y-6 xl:col-span-12">
            <DashboardPrimer />
          </div>
        </div>
      )}

      {activeTab === "skp" && (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 space-y-6 xl:col-span-12">
            <DashboardSKP />
          </div>
        </div>
      )}

      {activeTab === "smkhp" && (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 space-y-6 xl:col-span-12">
            <DashboardEkspor />
          </div>
        </div>
      )}

    </div>
  );
}
