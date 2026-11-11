import {
  GOOGLE_MAPS_URL,
  GOOGLE_RATING_LABEL,
  GOOGLE_REVIEWS_HEADING,
  GOOGLE_REVIEWS_URL,
  type GoogleReview,
} from "./reviews";

export function GoogleRatingBadge() {
  return (
    <a className="google-badge" href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
      {GOOGLE_RATING_LABEL}
    </a>
  );
}

function ReviewCard({ review }: { review: GoogleReview }) {
  const textId = `review-text-${review.id}`;
  return (
    <figure className="review-card">
      <p className="review-stars" aria-label="Оценка 5 из 5">
        <span aria-hidden="true">★★★★★</span>
      </p>
      <blockquote>
        <p className="review-text" id={textId}>
          {review.text}
        </p>
      </blockquote>
      <details className="review-fold">
        <summary aria-controls={textId}>
          <span className="review-fold-more">читать целиком</span>
          <span className="review-fold-less">свернуть</span>
        </summary>
      </details>
      <figcaption>
        <strong>{review.name}</strong>
        {review.tour ? <span>{review.tour}</span> : null}
      </figcaption>
    </figure>
  );
}

export function GoogleReviewsBlock({
  reviews,
  headingId = "reviews-title",
  className = "",
}: {
  reviews: GoogleReview[];
  headingId?: string;
  className?: string;
}) {
  const classes = ["reviews-block", className].filter(Boolean).join(" ");
  return (
    <section className={classes} aria-labelledby={headingId}>
      <div className="reviews-head">
        <h2 id={headingId}>Отзывы в Google</h2>
        <p className="reviews-score">{GOOGLE_REVIEWS_HEADING}</p>
      </div>
      <div className="review-scroller">
        {reviews.map((review) => (
          <ReviewCard review={review} key={review.id} />
        ))}
      </div>
      <a className="button button-outline reviews-all" href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener">
        Все отзывы в Google
      </a>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var root=document.currentScript.parentElement;function fit(){root.querySelectorAll(".review-card").forEach(function(card){var text=card.querySelector(".review-text");var fold=card.querySelector(".review-fold");if(!text||!fold||fold.open)return;fold.hidden=text.scrollHeight<=text.clientHeight+1;});}fit();window.addEventListener("load",fit);window.addEventListener("resize",fit);})();`,
        }}
      />
    </section>
  );
}
