// pages/index.tsx
import { useEffect, Suspense } from "react";
import ShopHorizonScroll from "@/components/top-page/shop-horizon-scroll";
import ProductArea from "@/components/top-page/product-area";
import styles from "@/styles/Home.module.css";
import Slider from "react-slick";
import ForumIndex from "@/components/top-page/forum";
import settings from "@/config/settings";
import Link from "next/link";
import IndexArtSec from "@/components/art-gallery/index-art-sec";
import Float from "@/components/float-button/circle-badge";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import dynamic from "next/dynamic";
import RenderModel from "@/components/RenderModel";
import LoadingAnime from "@/components/loading-anime/loading-anime";
import LiveCircleBadge from "@/components/float-button/circle-badge";

const Dragon = dynamic(
  () => import("@/components/models/Dragon").then((mod) => mod.Model),
  {
    ssr: false,
  }
);

const Carousel = dynamic(() => import("@/components/carousel"), {
  ssr: false,
  // loading: () => <LoadingAnime />,
});

const slides = [
  { image: "/gif/1.webp", text: "" },
  { image: "/gif/2.webp", text: "" },
  { image: "/gif/3.webp", text: "" },
  { image: "/gif/4.webp", text: "" },
  { image: "/gif/5.webp", text: "" },
];

const HomePage = () => {
  useEffect(() => {
    document.title = "Dragonfire & Sorcery";
  }, []);

  return (
    <>
      <section className={styles.bannerSection}>
        <Carousel slides={slides} />
        <div className="w-100 h-screen">
          <RenderModel className="">
            <Dragon />
          </RenderModel>
        </div>
      </section>

      {/* art-gallery start */}
      <section>
        <IndexArtSec />
      </section>
      {/* art-gallery end */}

      <ForumIndex />

      {/* <ShopHorizonScroll /> */}
      <ProductArea />

      <div className={styles.floatingButton}>
        <Float />
      </div >
    </>
  );
};

export default HomePage;
