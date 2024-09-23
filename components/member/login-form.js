import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import GoogleLogin from "@/components/member/google-login";
import styles from "@/styles/Member.module.css";

export default function LoginForm({ show, onClose, showAutoModal }) {
  const { login } = useAuth();
  const [loginInput, setLoginInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { success, message } = await login(loginInput, passwordInput);
    if (success) {
      onClose(); // 關閉 LoginForm
      showAutoModal(message);
    } else {
      setLoginError(message);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setLoginError(""); // 在輸入時重置錯誤訊息
  };

  useEffect(() => {
    if (show) {
      setLoginInput("");
      setPasswordInput("");
      setLoginError("");
    }
  }, [show]);

  return (
    <>
      <Modal
        show={show}
        onHide={onClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">帳號登入</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="login">
              <Form.Label>帳號</Form.Label>
              <Form.Control
                type="text"
                placeholder="輸入遊戲帳號"
                value={loginInput}
                onChange={handleInputChange(setLoginInput)}
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>密碼</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="輸入遊戲密碼"
                  value={passwordInput}
                  onChange={handleInputChange(setPasswordInput)}
                  autoComplete="off"
                />
                <Button
                  variant={showPassword ? "success" : "outline-primary"}
                  className="border"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "隱藏密碼" : "顯示密碼"}
                >
                  {showPassword ? "隱藏" : "顯示"}
                </Button>
              </div>
            </Form.Group>
            {loginError && (
              <Alert variant="danger" role="alert">
                {loginError}
              </Alert>
            )}
            <div className="mb-4 mx-2 d-flex justify-content-end">
              <Link
                href="/member/forget-password-step1"
                className="text-primary"
                onClick={onClose}
              >
                忘記密碼？
              </Link>
            </div>
            <div className="d-flex justify-content-center mb-4">
              <Button type="submit" className="btn btn-primary">
                登入
                <div className="button__horizontal"></div>
                <div className="button__vertical"></div>
              </Button>
            </div>
            <div className="d-flex justify-content-center">
              <span className="align-middle text-white">還沒有帳號嗎？</span>
              <Link
                className="text-primary"
                href="/member/register"
                onClick={onClose}
              >
                立即註冊
              </Link>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div
            className={`col-12 d-flex justify-content-center text-secondary ${styles["text-line"]}`}
          >
            <h6>更多登入方式</h6>
          </div>
          <div className="col-12 d-flex justify-content-center">
            <GoogleLogin showAutoModal={showAutoModal} onCloseModal={onClose} />
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
