import Link from "next/link";
import styles from "./menubar.module.scss";

// 說明:
// 選單客製化以靜態方式、移至config檔案或寫死(hard code)來產生是常見
// 選單項目定義在這裡，下面元件程式碼會自動產生對應的dom
// id是作key用的，不重覆即可
// 有下拉的選單需要加一個children的陣列屬性
const menuItems = [
  {
    id: 3,
    label: "商店",
    href: "/shop",
    children: [
      { id: 32, label: "商品一覽", href: "/shop" },
      { id: 33, label: "購物車", href: "/shop/shopping-cart" },
      { id: 34, label: "購買紀錄", href: "/shop/record/#purchaseHistory" },
    ],
  },
  {
    id: 4,
    label: "儲值",
    href: "/shop/recharge",
  },
];

export default function RightMainMenu({ currentRoute = "/" }) {
  return (
    <>
      <ul className="navbar-nav">
        {menuItems.map((v) => {
          // 用children判斷是否有下拉選單
          if (!v.children) {
            return (
              <li className="nav-item" style={{ width: 100 }} key={v.id}>
                <Link
                  className={`nav-link text-center ${
                    currentRoute === v.href
                      ? "active " + styles["custom-active"]
                      : ""
                  }`}
                  aria-current="page"
                  href={v.href}
                >
                  {v.label}
                </Link>
              </li>
            );
          }

          // 以下為有dropmenu(下拉選單)的選單項目的jsx
          return (
            <li
              className={`nav-item dropdown ${styles["dropdown"]}`}
              key={v.id}
              style={{ width: 100 }}
            >
              <Link
                // 尋找是否有符合 currentRoute 的 children href
                className={`nav-link text-center ${
                  v.children.find((v) => v.href === currentRoute)
                    ? "active " + styles["custom-active"]
                    : ""
                }`}
                href={v.href}
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {v.label}
              </Link>
              <ul
                className={`dropdown-menu bg-dark ${styles["slideIn"]} ${styles["dropdown-menu"]}`}
              >
                {v.children.map((v2) => {
                  return (
                    <li key={v2.id}>
                      <Link
                        className={`dropdown-item ${
                          currentRoute === v2.href ? "active" : ""
                        }`}
                        href={v2.href}
                      >
                        {v2.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </>
  );
}
