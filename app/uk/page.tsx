import type { Metadata } from "next";
import { SpainWithEvaPage } from "../page";

export const metadata: Metadata = {
  title: "SpainWithEva | Екскурсії та подорожі Іспанією",
  description:
    "Ненудні приватні екскурсії, авторські тури, Шлях Сантьяго та організація подорожей усією Іспанією.",
};

export default function UkrainianHome() {
  return <SpainWithEvaPage locale="uk" />;
}
