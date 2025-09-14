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

// default periode
const defaultPeriode: Periode = {
  startDate: "2025-01-01",
  endDate: "2025-12-31",
};

// buat context
const PeriodeContext = createContext<PeriodeContextType | null>(null);

// provider
export const PeriodeProvider = ({ children }: { children: ReactNode }) => {
  const [periode, setPeriode] = useState<Periode>(defaultPeriode);

  return (
    <PeriodeContext.Provider value={{ periode, setPeriode }}>
      {children}
    </PeriodeContext.Provider>
  );
};

// custom hook
export const usePeriode = () => {
  const context = useContext(PeriodeContext);
  if (!context) throw new Error("usePeriode must be used within a PeriodeProvider");
  return context;
};
