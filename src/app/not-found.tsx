import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found">
      <p className="eyebrow">404 / No page here</p>
      <h1>That frame is empty.</h1>
      <div className="not-found__actions">
        <Link className="button button--primary" href="/work">
          Browse the work <span aria-hidden="true">↗</span>
        </Link>
        <Link className="text-link" href="/">
          Return home <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </div>
  );
}
