import type { NextPageWithLayout } from "@/pages/_app";
import PushPage from "@/components/live/webrtc-push";
import { enableMapSet } from "immer";
import Article from "@/components/live/article";

enableMapSet();

const Push: NextPageWithLayout = (props) => {
  return (
    <>
      <div
        style={{
          backgroundImage: 'url("/background/dragon-bg.jpg")',
          backgroundPosition: "center",
          paddingTop: "15px",
          height: "100vh"
        }}
      >
        <PushPage name="" />
        {/* <Article/> */}
      </div>
    </>
  );
};

export default Push;
