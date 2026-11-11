import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TourPageView } from "../../../tour-page";
import { tourMetadata } from "../../../tour-seo";
import { getTour, tourPages } from "../../../tours-data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return tourPages.map((tour) => ({ slug: tour.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) return {};
  return tourMetadata(tour);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) notFound();
  return <TourPageView tour={tour} />;
}
