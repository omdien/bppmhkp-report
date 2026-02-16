"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type Periode = {
  startDate: string; // format YYYY-MM-DD
  endDate: string;   // format YYYY-MM-DD
};

type PeriodeContextType = {
  periode: Periode;
  setPeriode: React.Dispatch<React.SetStateAction<Periode>>;
};

// --- Logika Tahun Berjalan ---
const currentYear = new Date().getFullYear();

// default periode: 01-01 s/d 31-12 tahun berjalan
const defaultPeriode: Periode = {
  startDate: `${currentYear}-01-01`,
  endDate: `${currentYear}-12-31`,
};
// -----------------------------

const PeriodeContext = createContext<PeriodeContextType | null>(null);

export const PeriodeProvider = ({ children }: { children: ReactNode }) => {
  const [periode, setPeriode] = useState<Periode>(defaultPeriode);

  return (
    <PeriodeContext.Provider value={{ periode, setPeriode }}>
      {children}
    </PeriodeContext.Provider>
  );
};

export const usePeriode = () => {
  const context = useContext(PeriodeContext);
  if (!context) throw new Error("usePeriode must be used within a PeriodeProvider");
  return context;
};