import { GOOGLE_RATING_LABEL, GOOGLE_REVIEWS_URL, type TourQuote } from "./reviews";

export function GoogleRatingBadge() {
  return (
    <a className="google-badge" href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener">
      {GOOGLE_RATING_LABEL}
    </a>
  );
}

export function TourQuoteBlock({ quote }: { quote: TourQuote }) {
  return (
    <figure className="tour-quote">
      <blockquote>
        <p>{quote.text}</p>
      </blockquote>
      <figcaption>{`— ${quote.name}, Google`}</figcaption>
      <GoogleRatingBadge />
    </figure>
  );
}
