import type { NextPageWithLayout } from "@/pages/_app";
import Article from "@/components/live/article";
import PullPage from "@/components/live/webrtc-pull";
import { useRouter } from "next/router";

const Pull: NextPageWithLayout = () => {
  const router = useRouter();
  const { roomId = "" } = router.query;
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
        <PullPage roomId={roomId as string} />
      </div>
    </>
  );
};

export default Pull;
