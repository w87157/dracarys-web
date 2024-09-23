import type { NextPageWithLayout } from "@/pages/_app";
import HomePage from "@/components/live";
import { enableMapSet } from "immer";
import Article from "@/components/live/article";

enableMapSet();

const Index: NextPageWithLayout = (props) => {
  return (
    <>
      <div
        style={{
          backgroundImage: 'url("/background/dragon-bg.jpg")',
          backgroundPosition: "center",
          padding: "1px",
          height: "100vh"
        }}
      >
        <HomePage name="" />
      </div>
    </>
  );
};

export default Index;
