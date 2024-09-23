import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import Link from "next/link";
import { userIcon, diamondIcon } from "@/asset/icon";
import AutoCloseModal from "@/components/AutoCloseModalComponent";
import LoginForm from "@/components/member/login-form";
import styles from "./my-offcanvas.module.scss";

const menuItems = [
  {
    id: 4,
    label: "個人管理",
    href: "/#",
    children: [
      { id: 42, label: "藝術儀表板", href: "/art-gallery/dashboard" },
      { id: 43, label: "文章列表", href: "/forum/forumarea/my-article" },
    ],
  },
  {
    id: 1,
    label: "藝術走廊",
    href: "/art-gallery",
    children: [
      { id: 12, label: "活動消息", href: "/art-gallery" },
      { id: 13, label: "我要報名", href: "/art-gallery/register" },
      { id: 14, label: "投票專區", href: "/art-gallery/vote" },
      { id: 15, label: "歷屆作品", href: "/art-gallery/artwork" },
    ],
  },
  {
    id: 2,
    label: "論壇",
    href: "/forum",
    children: [
      { id: 22, label: "新聞/官方活動", href: "/forum/news" },
      { id: 23, label: "討論區", href: "/forum/forumarea" },
      { id: 24, label: "精選實況", href: "/forum/livestream" },
    ],
  },
  {
    id: 3,
    label: "商店",
    href: "/shop",
    children: [
      { id: 32, label: "shop", href: "/shop" },
      { id: 33, label: "cart", href: "/shop/shopping-cart" },
      { id: 34, label: "record", href: "/shop/record" },
    ],
  },
  {
    id: 5,
    label: "儲值",
    href: "/shop/recharge",
  },
];

export default function MyOffcanvas() {
  const [offcanvas, setOffcanvas] = useState(null);
  const { auth, logout } = useAuth();
  const [isAutoModal, setIsAutoModal] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [message, setMessage] = useState("");

  // LoginForm
  const showLoginModal = () => {
    setIsLoginModal(true);
  };

  const closeLoginModal = () => {
    setIsLoginModal(false);
  };

  // Auto Modal
  const showAutoModal = (message) => {
    setMessage(message);
    setIsAutoModal(true);
  };

  const closeAutoModal = () => {
    setIsAutoModal(false);
  };

  const handleLogout = () => {
    const { message } = logout();
    handleHideOffcanvas();
    showAutoModal(message);
  };

  const handleLogin = () => {
    handleHideOffcanvas();
    showLoginModal();
  };

  const handleHideOffcanvas = () => {
    if (offcanvas) {
      offcanvas.hide();
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const bootstrap = require("bootstrap/dist/js/bootstrap");
      const offcanvasElement = document.getElementById("offcanvasNavbar");
      if (offcanvasElement) {
        const offcanvasInstance = new bootstrap.Offcanvas(offcanvasElement);
        setOffcanvas(offcanvasInstance);
      }
    }
  }, []);

  return (
    <>
      <div
        className="offcanvas offcanvas-end bg-dark border-0"
        tabIndex="-1"
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
        style={{ zIndex: "1051" }}
      >
        <div className="offcanvas-header bg-primary">
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body p-0">
          <div className="accordion" id="accordion">
            <div className="accordion-item border-0">
              <ul className="d-flex align-items-center list-unstyled border-bottom px-5 py-3">
                <li>
                  <div className="text-center">
                    <div
                      className="d-inline-block position-relative"
                      style={{ width: "100px", height: "100px" }}
                    >
                      <Image
                        src={auth.photo_url || userIcon}
                        className="rounded-circle"
                        alt="使用者圖示"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className="text-light mt-2">{auth.name || "訪客"}</div>
                  </div>
                </li>
                <li className="d-flex align-items-center ms-auto">
                  <Image
                    className="me-2"
                    src={diamondIcon}
                    width={20}
                    height={20}
                    alt="diamond"
                  />
                  <span className="text-white">{auth.diamond}</span>
                </li>
              </ul>
            </div>
            {menuItems.map((item) =>
              auth.login || item.label !== "個人管理" ? (
                <div
                  className="accordion-item border-0 border-bottom"
                  key={item.id}
                >
                  {item.children ? (
                    <>
                      <h2
                        className="accordion-header border-bottom"
                        id={`heading-${item.id}`}
                      >
                        <button
                          className="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse-${item.id}`}
                          aria-expanded="true"
                          aria-controls={`collapse-${item.id}`}
                        >
                          {item.label}
                        </button>
                      </h2>
                      <div
                        id={`collapse-${item.id}`}
                        className="accordion-collapse collapse"
                        aria-labelledby={`heading-${item.id}`}
                        data-bs-parent="#accordion"
                      >
                        <div className="accordion-body">
                          {item.children.map((child) => (
                            <div
                              className={`${styles.accordion_noarrow}`}
                              key={child.id}
                            >
                              <Link
                                className="accordion-button text-white text-decoration-none border-bottom border-secondary"
                                href={child.href}
                                onClick={handleHideOffcanvas}
                              >
                                {child.label}
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <h2
                      className={`accordion-header ${styles.accordion_noarrow}`}
                      id={`heading-${item.id}`}
                    >
                      <Link
                        className="accordion-button text-decoration-none"
                        href={item.href}
                        onClick={handleHideOffcanvas}
                      >
                        {item.label}
                      </Link>
                    </h2>
                  )}
                </div>
              ) : null
            )}
          </div>
          <div className="col-12 mt-5">
            {auth.login ? (
              <>
                <button
                  className="btn btn-secondary w-100"
                  type="button"
                  onClick={handleLogout}
                  style={{ boxShadow: "none" }}
                >
                  登出
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-secondary w-100"
                  type="button"
                  onClick={handleLogin}
                  style={{ boxShadow: "none" }}
                >
                  登入
                </button>
              </>
            )}
          </div>
        </div>

        {/* Add To List Modal */}
        <AutoCloseModal
          show={isAutoModal}
          onClose={closeAutoModal}
          message={message}
        />

        {/* LoginForm Modal */}
        <LoginForm
          show={isLoginModal}
          onClose={closeLoginModal}
          showAutoModal={showAutoModal}
        />
      </div>
    </>
  );
}
