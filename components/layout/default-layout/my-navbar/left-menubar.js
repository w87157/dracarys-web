import Link from "next/link";
import styles from "./menubar.module.scss";

const menuItems = [
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
      { id: 24, label: "相關影片", href: "/forum/livestream" },
    ],
  },
];

export default function LeftMainMenu({ currentRoute = "/" }) {
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
