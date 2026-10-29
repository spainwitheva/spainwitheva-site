import type { Metadata } from "next";
import { SpainWithEvaPage } from "../page";

export const metadata: Metadata = {
  title: "SpainWithEva | Private Tours and Travel in Spain",
  description:
    "Private tours, bespoke journeys, the Camino de Santiago and tailor-made travel throughout Spain.",
};

export default function EnglishHome() {
  return <SpainWithEvaPage locale="en" />;
}
