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

    const CPPIB = pivot?.CPPIB ?? 0;
    const CPIB = pivot?.CPIB ?? 0;
    const CPOIB = pivot?.CPOIB ?? 0;
    const CDOIB = pivot?.CDOIB ?? 0;
    const CBIB = pivot?.CBIB ?? 0;
    const CBIB_KAPAL = pivot?.CBIB_Kapal ?? 0;

    const popupContent = `
    <div>
      <strong>SERTIFIKASI BPPMHKP</strong><br/>
      <strong>Tahun 2025</strong><br/>
      <strong>Provinsi: ${PROVINSI ?? "-"}</strong><br/>
      CPIB: ${CPIB}<br/>
      CBIB: ${CBIB}
      CPPIB: ${CPPIB}<br/>
      CPOIB: ${CPOIB}<br/>
      CPIB KAPAL: ${CBIB_KAPAL}<br/>
      CDOIB: ${CDOIB}<br/>
    </div>
  `;

    layer.bindPopup(popupContent);

    // ✅ Narrowing jadi Path
    layer.on("mouseover", () => {
      (layer as L.Path).setStyle({
        fillColor: "orange",
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
