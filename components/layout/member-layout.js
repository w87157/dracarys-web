import Navbar from "./default-layout/my-navbar";
import Footer from "./default-layout/footer";
import styles from "@/styles/Member.module.css";

export default function MemberLayout({ children }) {
  return (
    <>
      <div className="position-relative">
        <Navbar />
        <main className={`flex-shrink-0 py-5 ${styles.background}`}>
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
