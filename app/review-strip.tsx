import {
  GOOGLE_MAPS_URL,
  GOOGLE_RATING_LABEL,
  GOOGLE_REVIEW_SOURCE,
  type GoogleReview,
} from "./reviews";

export function GoogleRatingBadge() {
  return (
    <a className="google-badge" href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
      {GOOGLE_RATING_LABEL}
    </a>
  );
}

export function ReviewStrip({ reviews }: { reviews: GoogleReview[] }) {
  return (
    <section className="tp-block" aria-labelledby="reviews-title">
      <h2 id="reviews-title">Отзывы</h2>
      <GoogleRatingBadge />
      <div className="review-scroller">
        {reviews.map((review) => (
          <figure className="review-card" key={review.name}>
            <blockquote>{review.text}</blockquote>
            <figcaption>
              <strong>{review.name}</strong>
              <span>{GOOGLE_REVIEW_SOURCE}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
