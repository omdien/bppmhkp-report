"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type Periode = {
  startDate: string; // format YYYY-MM-DD
  endDate: string;   // format YYYY-MM-DD
};

type PeriodeContextType = {
  periode: Periode;
  setPeriode: (p: Periode) => void;
};

// default periode (supaya periode tidak pernah undefined)
const defaultPeriode: Periode = {
  startDate: "2025-01-01",
  endDate: "2025-12-31",
};

const PeriodeContext = createContext<PeriodeContextType | undefined>(undefined);

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
  if (!context) {
    throw new Error("usePeriode must be used within a PeriodeProvider");
  }
  return context;
};
