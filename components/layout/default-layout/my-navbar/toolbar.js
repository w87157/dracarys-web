import React, { useState, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import Link from "next/link";
import Image from "next/image";
import { userIcon, diamondIcon } from "@/asset/icon";
import AutoCloseModal from "@/components/AutoCloseModalComponent";
import LoginForm from "@/components/member/login-form";
import styles from "./toolbar.module.scss";

export default function Toolbar() {
  const { auth, logout, uploadProfilePicture } = useAuth();
  const { clearCart, clearShopFavorites } = useCart();

  const [isAutoModal, setIsAutoModal] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

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
    clearCart();
    clearShopFavorites();
    showAutoModal(message);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // 檢查文件類型
      if (!file.type.startsWith("image/")) {
        showAutoModal("請上傳有效的圖像文件");
        return;
      }

      // 調用上傳圖片的函數，並傳遞文件
      const result = await uploadProfilePicture(file);
      if (result.success) {
        showAutoModal("圖片上傳成功");
      } else {
        showAutoModal("圖片上傳失敗");
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <ul
      className={`navbar-nav mb-2 mb-lg-0 position-absolute top-50 end-0 translate-middle-y ${styles.toolbar}`}
    >
      {auth.login ? (
        <>
          <li className="nav-item dropdown">
            <Link
              className="nav-link dropdown-toggle"
              href="#"
              id="toolbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <Image
                src={userIcon}
                alt="使用者圖示"
                objectFit="cover"
                width={30}
                height={30}
              />
            </Link>
            <ul
              className="dropdown-menu dropdown-menu-dark dropdown-menu-end bg-dark p-4 mw-100"
              aria-labelledby="toolbarDropdown"
            >
              <li className="d-flex flex-column align-items-center">
                <div
                  className="d-flex justify-content-center align-items-center"
                  onClick={triggerFileInput}
                  style={{
                    width: "120px",
                    height: "120px",
                    position: "relative",
                    cursor: "pointer",
                    marginBottom: "0.5rem", // 調整圖片和文字之間的間距
                  }}
                >
                  <Image
                    src={auth.photo_url || userIcon}
                    className="rounded-circle"
                    alt="使用者圖示"
                    layout="fill"
                    objectFit="cover"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </div>
                <div className="text-center mb-2">{auth.name}</div>
              </li>
              <li className="d-flex justify-content-center align-items-center text-primary">
                <Image
                  className="col-2 me-2"
                  src={diamondIcon}
                  width={20}
                  height={20}
                  alt="diamond"
                />
                {auth.diamond}
                <Link
                  href="/shop/recharge"
                  className="link-light fs-small ms-2"
                >
                  (儲值)
                </Link>
              </li>
              <hr />
              <li>
                <Link
                  href="/art-gallery/dashboard"
                  className="dropdown-item text-center"
                >
                  藝術儀表板
                </Link>
              </li>
              <li>
                <Link
                  href="/forum/forumarea/my-article"
                  className="dropdown-item text-center"
                >
                  文章列表
                </Link>
              </li>
              <hr />
              <li>
                <Link
                  className="dropdown-item text-center"
                  href="#/"
                  onClick={handleLogout}
                >
                  登出
                </Link>
              </li>
            </ul>
          </li>
        </>
      ) : (
        <>
          <button
            type="button"
            className="btn"
            onClick={showLoginModal} // 開啟 LoginForm 模態框
          >
            <Image src={userIcon} alt="使用者圖示" width={30} height={30} />
          </button>
        </>
      )}

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
    </ul>
  );
}
