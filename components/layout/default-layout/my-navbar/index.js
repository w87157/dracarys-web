import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import LeftMenubar from "./left-menubar";
import RightMenubar from "./right-menubar";
import Toolbar from "./toolbar";
import MyOffcanvas from "./my-offcanvas";

export default function MyNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef(null);
  const [navHeight, setNavHeight] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header>
        {isScrolled && <div style={{ height: navHeight }}></div>}

        <nav
          ref={navRef}
          className={`navbar navbar-expand-lg navbar-dark bg-dark  ${
            isScrolled ? "fixed-top" : "position-relative"
          }`}
          style={{ zIndex: "1050" }}
        >
          <div className="container-fluid">
            <Link className="d-lg-none" href="/" style={{ width: 50 }}>
              <Image
                src="/logo.svg"
                className="align-middle"
                alt="Logo"
                width={50}
                height={50}
              />
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasNavbar"
              aria-controls="offcanvasNavbar"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <div className="w-100 d-flex justify-content-center position-relative">
                <LeftMenubar />
                <div className="navbar-brand m-0" style={{ width: 150 }}>
                  <Link
                    className="d-none d-lg-block position-absolute top-100 start-50 translate-middle bg-dark rounded-circle"
                    href="/"
                    style={{ width: 100 }}
                  >
                    <Image
                      src="/logo.svg"
                      className="align-middle"
                      alt="Logo"
                      width={100}
                      height={100}
                    />
                  </Link>
                </div>
                <RightMenubar />
                <Toolbar />
              </div>
            </div>
          </div>
        </nav>

        <MyOffcanvas />
      </header>
    </>
  );
}
