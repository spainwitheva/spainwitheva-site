import type { Metadata } from "next";
import { SpainWithEvaPage } from "../page";

export const metadata: Metadata = {
  title: "SpainWithEva | Visitas privadas y viajes por España",
  description: "Visitas privadas, viajes a medida, Camino de Santiago y organización de vacaciones por toda España.",
};

export default function SpanishHome() {
  return <SpainWithEvaPage locale="es" />;
}
