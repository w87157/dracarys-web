import { useRouter } from "next/router";
import Navbar from "./my-navbar";
import IndexNavbar from "./my-navbar/index_navbar";
import Footer from "./footer";

export default function DefaultLayout({ children }) {
  const router = useRouter();
  const isHomePage = router.pathname === "/";

  return (
    <>
      {isHomePage ? <IndexNavbar /> : <Navbar />}
      <main>{children}</main>
      <Footer />
    </>
  );
}
