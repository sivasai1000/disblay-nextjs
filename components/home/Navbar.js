import Link from "next/link";
import "@/css/LandingPage.css";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg landing-navbar">
      <div className="container d-flex text-start justify-content-between">

        {/* Logo */}
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <img
            src="/assets/img/disblaylogo.svg"
            alt="logo"
            className="landing-logo me-2"
          />
        </Link>

        <div className="d-flex ms-auto align-items-center">

          {/* FIXED — Link styled like a button */}
          <Link
            href="/getenroll"
            className="btn landing-btn-outlines px-4 me-3"
            style={{
              color: "#505050",
              fontSize: "16px",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Create Business For Others
          </Link>

          {/* Watch video modal button */}
          <button
            className="btn landing-btn-watch px-4"
            data-bs-toggle="modal"
            data-bs-target="#videoModal"
          >
            Watch How it Works
          </button>

        </div>
      </div>
    </nav>
  );
}
