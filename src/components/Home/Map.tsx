"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import indonesiaGeoJson from "@/constant/38-Provinsi-Indonesia.json";
import { usePeriode } from "@/context/PeriodeContext";
import ReportService, {
  PropinsiIzinPivot,
} from "@/services/ReportServices";
import "leaflet/dist/leaflet.css";

import type {
  Feature,
  FeatureCollection,
  Geometry,
  GeoJsonProperties,
} from "geojson";
import type { Layer } from "leaflet";

// ✅ Type properties GeoJSON
type ProvinceProperties = GeoJsonProperties & {
  PROVINSI?: string;
  KODE_PROV?: string | number;
  kode_prov?: string | number;
  Kd_Prov?: string | number;
  _pivot?: PropinsiIzinPivot | null;
};

// ⬅️ Dynamic import components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const GeoJSON = dynamic(
  () => import("react-leaflet").then((mod) => mod.GeoJSON),
  { ssr: false }
);

export default function MapIndonesiaLeaflet() {
  const [propinsiData, setPropinsiData] = useState<PropinsiIzinPivot[]>([]);
  const { periode, setPeriode } = usePeriode();
  const { startDate, endDate } = periode;

  // ----- Fetch Pivot -----
  useEffect(() => {
    fetchPropinsiPivot(startDate, endDate);
  }, [startDate, endDate]);

  const fetchPropinsiPivot = async (startDate: string, endDate: string) => {
    try {
      const result = await ReportService.getPropinsiIzin(startDate, endDate);
      setPropinsiData(result);
    } catch (err) {
      console.error("Gagal fetch propinsi pivot:", err);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value;
    // Set periode ke awal tahun dan akhir tahun yang dipilih
    setPeriode({
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`,
    });
  };

  // ----- Quick lookup map -----
  const pivotMap = useMemo(() => {
    const m = new Map<number, PropinsiIzinPivot>();
    propinsiData.forEach((p) => {
      const k = Number(p.kode_propinsi);
      if (!Number.isNaN(k)) m.set(k, p);
    });
    return m;
  }, [propinsiData]);

  // ----- Merge Pivot ke GeoJSON -----
  const mergedGeoJson: FeatureCollection<Geometry, ProvinceProperties> =
    useMemo(() => {
      const data: FeatureCollection<Geometry, ProvinceProperties> = JSON.parse(
        JSON.stringify(indonesiaGeoJson)
      );
      data.features.forEach((feature) => {
        const kodeRaw =
          feature.properties?.KODE_PROV ??
          feature.properties?.kode_prov ??
          feature.properties?.Kd_Prov;
        const kodeNum = Number(kodeRaw);
        const pivot = !Number.isNaN(kodeNum)
          ? pivotMap.get(kodeNum) ?? null
          : null;
        feature.properties = {
          ...feature.properties,
          _pivot: pivot,
        };
      });
      return data;
    }, [pivotMap]);

  const geoJsonStyle = {
    color: "#2563eb",
    weight: 1,
    fillColor: "#93c5fd",
    fillOpacity: 0.5,
  };

  const onEachProvince = (
    feature: Feature<Geometry, ProvinceProperties>,
    layer: Layer
  ) => {
    const { PROVINSI, _pivot } = feature.properties ?? {};
    const pivot: PropinsiIzinPivot | null = _pivot ?? null;
    const logoSrc = `/report/images/propinsi/${pivot?.kode_propinsi}.png`;

    const data = {
      CPIB: pivot?.CPIB ?? 0,
      CBIB: pivot?.CBIB ?? 0,
      CPPIB: pivot?.CPPIB ?? 0,
      CPOIB: pivot?.CPOIB ?? 0,
      "CPIB KAPAL": pivot?.CBIB_Kapal ?? 0,
      CDOIB: pivot?.CDOIB ?? 0,
    };

    const popupContent = `
    <div style="font-family: 'Inter', sans-serif; min-width: 200px; padding: 5px;">
      <div style="display: flex; align-items: center; gap: 10px; border-bottom: 2px solid #2563eb; padding-bottom: 8px; margin-bottom: 10px;">
        <img src="${logoSrc}" 
             alt="Logo ${PROVINSI}" 
             onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Logo_Kementerian_Kelautan_dan_Perikanan.png/1200px-Logo_Kementerian_Kelautan_dan_Perikanan.png'"
             style="width: 35px; height: auto; object-fit: contain;" />
        <div>
          <span style="font-size: 11px; color: #64748b; text-transform: uppercase;">Provinsi</span><br/>
          <strong style="font-size: 15px; color: #0f172a;">${PROVINSI ?? "-"}</strong>
        </div>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        ${Object.entries(data)
        .map(([label, value]) => `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 5px 0; color: #475569;">${label}</td>
            <td style="padding: 5px 0; text-align: right; font-weight: bold; color: #2563eb;">${value}</td>
          </tr>`).join("")}
      </table>
    </div>`;

    layer.bindPopup(popupContent, { maxWidth: 300 });
  };

  return (
    <div className="relative w-full h-screen flex flex-col bg-slate-50 overflow-hidden">

      {/* 🟢 OVERLAY JUDUL & FILTER - GLASSMORPHISM UI */}
      <div className="absolute top-[14vh] left-0 right-0 z-[1000] flex flex-col items-center pointer-events-none px-4">
        <div className="bg-white/70 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl shadow-blue-900/10 border border-white/50 flex flex-col md:flex-row items-center gap-4 pointer-events-auto transition-all duration-500 hover:bg-white/80">

          {/* Bagian Judul */}
          <div className="flex items-center gap-3 border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:pr-6">
            <div className="w-1.5 h-8 bg-blue-600 rounded-full hidden md:block"></div>
            <h1 className="text-sm md:text-base lg:text-lg font-extrabold text-slate-800 uppercase tracking-tight leading-tight text-center md:text-left">
              Peta Sebaran Penerbitan Sertifikasi Mutu <br className="hidden md:block" />
              <span className="text-blue-600">BPPMHKP</span>
            </h1>
          </div>

          {/* Bagian Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pilih Tahun</span>
            <div className="relative">
              <select
                className="appearance-none bg-blue-50 border border-blue-100 text-blue-700 font-bold rounded-xl pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer shadow-sm transition-all"
                value={startDate.split('-')[0]} // Ambil tahun dari string "YYYY-MM-DD"
                onChange={handleYearChange} // Fungsi handler yang baru
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-blue-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 🔵 MAP CONTAINER */}
      <div className="flex-grow w-full h-full pt-[12vh]">
        <MapContainer
          center={[-2, 118]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <GeoJSON
            data={mergedGeoJson}
            style={() => geoJsonStyle}
            onEachFeature={onEachProvince}
            key={JSON.stringify(propinsiData.map((p) => p.kode_propinsi))}
          />
        </MapContainer>
      </div>

    </div>
  );
}