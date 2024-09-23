import React from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { useGoogleLogin } from "@react-oauth/google";
import { googleIcon } from "@/asset/icon";

export default function GoogleLogin({
  showAutoModal,
  onCloseModal = () => {},
}) {
  const { googleLogin } = useAuth();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      googleLogin(codeResponse.code)
        .then((response) => {
          if (response.success) {
            onCloseModal(); // 關閉login modal
            showAutoModal(response.message);
          } else {
            console.error("Google Login Error:", response.message);
          }
        })
        .catch((err) => {
          console.error("Google Login Error:", err);
          showAutoModal("Google 登入失敗");
        });
    },
    onError: (err) => {
      console.error("Login Failed:", err);
      showAutoModal("Google 登入失敗");
    },
    flow: "auth-code",
  });

  return (
    <button
      type="button"
      className="btn border border-2 border-secondary rounded-circle"
      onClick={() => handleGoogleLogin()}
      style={{ width: "50px", height: "50px" }}
    >
      <Image
        src={googleIcon}
        alt="Google Icon"
        width={30}
        height={30}
        className="d-block mx-auto"
        style={{ paddingTop: "0px" }}
      />
    </button>
  );
}
