"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import indonesiaGeoJson from "@/constant/38-Provinsi-Indonesia.json";
import type {
  Feature,
  FeatureCollection,
  Geometry,
  GeoJsonProperties,
} from "geojson";
import type { Layer } from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Props dari parent (Dashboard.tsx)
interface PetaSebaranSKPProps {
  rekapProvinsi: {
    provinsi_id: string;
    provinsi: string;
    jumlah: number;
  }[];
}

// ✅ Dynamic import supaya aman di Next.js
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

export default function PetaSebaranSKP({ rekapProvinsi }: PetaSebaranSKPProps) {
  // ----- Buat lookup map (provinsi_id → jumlah SKP)
  const jumlahMap = useMemo(() => {
    const map = new Map<number, { provinsi: string; jumlah: number }>();
    rekapProvinsi.forEach((item) => {
      map.set(Number(item.provinsi_id), {
        provinsi: item.provinsi,
        jumlah: item.jumlah,
      });
    });
    return map;
  }, [rekapProvinsi]);

  // ----- Merge jumlah SKP ke GeoJSON -----
  const mergedGeoJson: FeatureCollection<Geometry, GeoJsonProperties> =
    useMemo(() => {
      const data = JSON.parse(JSON.stringify(indonesiaGeoJson));
      data.features.forEach((feature: any) => {
        const kode =
          feature.properties?.KODE_PROV ??
          feature.properties?.kode_prov ??
          feature.properties?.Kd_Prov;
        const info = jumlahMap.get(Number(kode));
        feature.properties = {
          ...feature.properties,
          _jumlah: info?.jumlah ?? 0,
          _provinsi: info?.provinsi ?? feature.properties?.PROVINSI ?? "-",
        };
      });
      return data;
    }, [jumlahMap]);

  // ----- Warna berdasarkan jumlah SKP -----
  const getColor = (jumlah: number) => {
    if (jumlah > 500) return "#1e3a8a"; // biru tua
    if (jumlah > 200) return "#3b82f6"; // biru sedang
    if (jumlah > 100) return "#60a5fa"; // biru muda
    if (jumlah > 50) return "#93c5fd";  // sangat muda
    return "#dbeafe"; // abu kebiruan
  };

  const geoJsonStyle = (feature: Feature<Geometry, GeoJsonProperties>) => ({
    color: "white",
    weight: 1,
    fillColor: getColor(feature.properties?._jumlah ?? 0),
    fillOpacity: 0.8,
  });

  // ----- Event tiap provinsi -----
  const onEachProvince = (
    feature: Feature<Geometry, GeoJsonProperties>,
    layer: Layer
  ) => {
    const prov = feature.properties?._provinsi ?? "-";
    const jumlah = feature.properties?._jumlah ?? 0;

    const popupContent = `
      <div>
        <strong>Provinsi:</strong> ${prov}<br/>
        <strong>Jumlah SKP:</strong> ${jumlah}
      </div>
    `;

    layer.bindPopup(popupContent);

    layer.on("mouseover", () => {
      (layer as L.Path).setStyle({
        weight: 2,
        fillColor: "orange",
        fillOpacity: 0.9,
      });
    });
    layer.on("mouseout", () => {
      (layer as L.Path).setStyle(geoJsonStyle(feature));
    });
  };

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden shadow bg-white">
      <MapContainer
        center={[-2, 118]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <GeoJSON
          data={mergedGeoJson}
          style={geoJsonStyle}
          onEachFeature={onEachProvince}
          key={rekapProvinsi.map((p) => p.provinsi_id).join(",")}
        />
      </MapContainer>
    </div>
  );
}
