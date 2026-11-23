import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container not-found">
      <p className="eyebrow">404</p>
      <h1 className="headline">The page you&apos;re looking for can&apos;t be found.</h1>
      <p className="subhead">
        Check the web address and try again, or browse selected web projects and native Windows tools.
      </p>
      <div className="not-found__actions">
        <Link className="btn btn--primary" href="/work">
          Browse work <span aria-hidden="true" className="chevron">›</span>
        </Link>
        <Link className="btn btn--secondary" href="/">
          Return home
        </Link>
      </div>
    </div>
  );
}
