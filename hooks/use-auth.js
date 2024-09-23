import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const storageKey = "user-auth";
const initUserData = {
  login: "",
  name: "",
  email: "",
  google_uid: "",
  photo_url: "",
  diamond: 0,
};

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [auth, setAuth] = useState(initUserData);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const login = async (login, password) => {
    try {
      const r = await fetch("http://localhost:8080/member/login-jwt", {
        method: "POST",
        body: JSON.stringify({ login, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await r.json();
      if (result.success) {
        localStorage.setItem(storageKey, JSON.stringify(result.data));
        setAuth(result.data);
        return { success: true, message: "登入成功" };
      } else {
        return {
          success: false,
          message: result.message || "輸入的帳號或密碼有誤",
        };
      }
    } catch (ex) {
      return { success: false, message: "發生錯誤，請稍後再試" };
    }
  };

  const logout = () => {
    localStorage.removeItem(storageKey);
    setAuth(initUserData);
    return { success: true, message: "登出成功" };
  };

  const register = async (login, email, name, password, otp, diamond) => {
    try {
      const r = await fetch("http://localhost:8080/member/register", {
        method: "POST",
        body: JSON.stringify({ login, email, name, password, otp, diamond }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await r.json();
      if (result.success) {
        localStorage.setItem(storageKey, JSON.stringify(result.data));
        setAuth(result.data);
        return { success: true, message: "註冊成功" };
      } else {
        return { success: false, message: result.message || "註冊失敗" };
      }
    } catch (error) {
      console.error("發送驗證碼失敗:", error);
      return { success: false, message: "發送驗證碼失敗" };
    }
  };

  const sendOtpCode = async (email) => {
    try {
      const r = await fetch("http://localhost:8080/member/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await r.json();
      if (result.success) {
        return {
          success: true,
          message: "驗證碼已發送",
          expires_time: result.expires_time,
        };
      } else {
        return { success: false, message: result.message || "驗證碼發送失敗" };
      }
    } catch (error) {
      console.error("發送驗證碼失敗", error);
    }
  };

  const sendURLEmail = async (email) => {
    try {
      const r = await fetch("http://localhost:8080/member/send-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await r.json();
      if (result.success) {
        return {
          success: true,
          message: "驗證碼已發送",
        };
      } else {
        return { success: false, message: result.message || "驗證碼發送失敗" };
      }
    } catch (error) {
      console.error("發送驗證碼失敗", error);
    }
  };

  const getAuthHeader = () => {
    if (auth.token) {
      return {
        Authorization: `Bearer ${auth.token}`,
      };
    } else {
      return {};
    }
  };

  // 更新鑽石
  const updateDiamonds = useCallback((newDiamonds) => {
    setAuth((prevAuth) => {
      const updatedAuth = { ...prevAuth, diamond: newDiamonds };
      localStorage.setItem(storageKey, JSON.stringify(updatedAuth));
      return updatedAuth;
    });
  }, []);

  const googleLogin = async (code) => {
    try {
      const response = await fetch(
        "http://localhost:8080/member/google-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        localStorage.setItem(storageKey, JSON.stringify(result.data));
        setAuth(result.data); // 更新 auth 狀態
        return { success: true, message: "登入成功" };
      } else {
        console.error("登入失敗:", data.message);
        return { success: false, message: "登入失敗" };
      }
    } catch (error) {
      console.error("Error:", error);
      return { success: false, message: "登入失敗" };
    }
  };

  const uploadProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("login", auth.login);

    try {
      const response = await fetch(
        "http://localhost:8080/member/upload-photo",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.token}`, // 確保 Bearer 包含在字符串中
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("網絡響應錯誤");
      }

      const result = await response.json();
      if (result.success) {
        // 更新會員資料中的圖片 URL
        setAuth((prevAuth) => ({
          ...prevAuth,
          photo_url: result.data.photo_url,
        }));
        localStorage.setItem(
          storageKey,
          JSON.stringify({ ...auth, photo_url: result.data.photo_url })
        );
        return { success: true, message: "圖片上傳成功" };
      } else {
        return { success: false, message: result.message || "圖片上傳失敗" };
      }
    } catch (error) {
      console.error("圖片上傳失敗:", error);
      return { success: false, message: "圖片上傳失敗" };
    }
  };

  useEffect(() => {
    const str = localStorage.getItem(storageKey);
    if (!str) {
      setIsAuthReady(true);
      return;
    }

    try {
      const data = JSON.parse(str);
      if (data.login && data.token) {
        setAuth(data);
        setIsAuthReady(true);
      }
    } catch (error) {
      console.error("Error parsing auth data from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isAuthReady) {
      localStorage.setItem(storageKey, JSON.stringify(auth));
    }
  }, [auth, isAuthReady]);

  useEffect(() => {
    const fetchDiamonds = async () => {
      try {
        const response = await fetch("http://localhost:8080/member/user");
        const data = await response.json();
        if (data.length) {
          const currentUser = data.find((user) => user.login === auth.login);
          if (currentUser) {
            updateDiamonds(currentUser.diamond);
          }
        }
      } catch (error) {
        console.error("獲取鑽石數量時發生錯誤:", error);
      }
    };

    if (auth.login) {
      fetchDiamonds(); // 初次加載時獲取鑽石數量
      // const intervalId = setInterval(fetchDiamonds, 15000); // 每分鐘檢查一次鑽石數量

      // return () => clearInterval(intervalId); // 組件卸載時清除定時器
    }
  }, [auth.login, updateDiamonds]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        isAuthReady,
        login,
        logout,
        register,
        sendOtpCode,
        sendURLEmail,
        getAuthHeader,
        updateDiamonds,
        googleLogin,
        uploadProfilePicture,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
