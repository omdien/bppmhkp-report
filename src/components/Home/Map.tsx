"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import indonesiaGeoJson from "@/constant/38-Provinsi-Indonesia.json";
// import PublicService, { PropinsiIzinPivot } from "@/services/PublicService";
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

// ✅ bikin type untuk properties yang sudah ditambahin pivot
type ProvinceProperties = GeoJsonProperties & {
  PROVINSI?: string;
  KODE_PROV?: string | number;
  kode_prov?: string | number;
  Kd_Prov?: string | number;
  _pivot?: PropinsiIzinPivot | null;
};

// ⬅️ dynamic import react-leaflet supaya aman di Next.js
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
  const [startDate] = useState("2025-01-01");
  const [endDate] = useState("2025-12-31");

  // ----- Fetch Pivot -----
  useEffect(() => {
    fetchPropinsiPivot(startDate, endDate);
  }, [startDate, endDate]);

  const fetchPropinsiPivot = async (startDate: string, endDate: string) => {
    try {
      const result = await ReportService.getPropinsiIzin(startDate, endDate);
      console.log("✅ Berhasil fetch propinsi pivot:", result);
      setPropinsiData(result);
    } catch (err) {
      console.error("Gagal fetch propinsi pivot:", err);
    }
  };

  // ----- quick lookup map (key = numeric kode propinsi) -----
  const pivotMap = useMemo(() => {
    const m = new Map<number, PropinsiIzinPivot>();
    propinsiData.forEach((p) => {
      const k = Number(p.kode_propinsi);
      if (!Number.isNaN(k)) m.set(k, p);
    });
    return m;
  }, [propinsiData]);

  // ----- merge pivot into geojson -----
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
    color: "blue",
    weight: 1,
    fillColor: "lightblue",
    fillOpacity: 0.6,
  };

  const onEachProvince = (
    feature: Feature<Geometry, ProvinceProperties>,
    layer: Layer
  ) => {
    const { PROVINSI, _pivot } = feature.properties ?? {};
    const pivot: PropinsiIzinPivot | null = _pivot ?? null;

    // Nilai default 0 jika data null/undefined
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
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Logo_Kementerian_Kelautan_dan_Perikanan.png/1200px-Logo_Kementerian_Kelautan_dan_Perikanan.png" 
             alt="Logo" style="width: 30px; height: auto;" />
        <div>
          <span style="font-size: 12px; color: #64748b;">Propinsi :</span><br/>
          <strong style="font-size: 16px; color: #0f172a;">${PROVINSI ?? "-"}</strong>
        </div>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        ${Object.entries(data)
        .map(
          ([label, value]) => `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 4px 0; color: #475569;">${label}</td>
            <td style="padding: 4px 0; text-align: right; font-weight: bold; color: #2563eb;">${value}</td>
          </tr>
        `
        )
        .join("")}
      </table>
      
      <div style="margin-top: 10px; font-size: 11px; text-align: center; color: #94a3b8; font-style: italic;">
        Data diperbarui secara real-time
      </div>
    </div>
  `;

    layer.bindPopup(popupContent, {
      maxWidth: 300,
      className: "custom-leaflet-popup", // Kita bisa tambahkan styling di global CSS
    });

    // Event Mouseover/Mouseout tetap sama
    layer.on("mouseover", () => {
      (layer as L.Path).setStyle({
        fillColor: "#3b82f6",
        fillOpacity: 0.8,
      });
    });

    layer.on("mouseout", () => {
      (layer as L.Path).setStyle(geoJsonStyle);
    });
  };

  return (
    <div className="relative w-full h-screen flex justify-center flex-col bg-slate-100">
      <MapContainer
        center={[-2, 118]}
        zoom={5}
        style={{ height: "600px", width: "100%" }}
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
  );
}
