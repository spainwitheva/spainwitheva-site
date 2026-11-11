/**
 * Короткая ссылка на отзывы Google и две цитаты для страниц экскурсий.
 * В schema.org отзывы не кладём: Google не принимает самодельный
 * aggregateRating / review для LocalBusiness.
 * GOOGLE_MAPS_URL остаётся в sameAs как профиль на Картах.
 */

export const GOOGLE_MAPS_URL = "https://maps.google.com/?cid=10197345996895462953";
export const GOOGLE_REVIEWS_URL = "https://maps.app.goo.gl/YqFXduUcaWz6ovzn9";
export const GOOGLE_RATING_LABEL = "★ 5,0 · 40 отзывов в Google";

export type TourQuote = {
  name: string;
  text: string;
};

/** Elena Shi, отрывок. Слова дословные. */
export const madridQuote: TourQuote = {
  name: "Elena Shi",
  text: "Прекрасно провели время, узнали много интересных фактов о Мадриде, которые не прочтёшь нигде.",
};

/**
 * Jeyla Huseynova, отрывок. Слова дословные.
 * Пробелы вокруг запятых приведены к обычным: пробел после, не перед.
 */
export const toledoQuote: TourQuote = {
  name: "Jeyla Huseynova",
  text: "Интересно, душевно, множество интересных фактов, историй, о которых мало кто расскажет",
};
