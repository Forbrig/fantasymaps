"use client";

import { ReactNode } from "react";
import { MapProvider as ReactMapGLProvider } from "react-map-gl/maplibre";
import { MapProvider } from "@/context/MapProvider/MapProvider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ReactMapGLProvider>
      <MapProvider>{children}</MapProvider>
    </ReactMapGLProvider>
  );
}
