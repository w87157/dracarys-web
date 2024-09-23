import { useEffect, useState } from "react";
import { AppProps } from "next/app";
import { Provider } from "react-redux";
import { useRouter } from "next/router";
import store from "@/lib/store";
import { NetworkProvider } from "@/components/live/_nextwork";
import AuthContext, { AuthContextProvider } from "@/hooks/use-auth";
import "@/styles/globals.scss";
import "@/styles/header.scss";
import { SaveProvider } from "@/hooks/use-save";
import { LikeProvider } from "@/hooks/use-like";
import { VoteProvider } from "@/hooks/use-vote";
import { CartProvider } from "@/hooks/use-cart";
import "aos/dist/aos.css"; // Animate On Scroll
import AOS from "aos"; // Animate On Scroll
import DefaultLayout from "@/components/layout/default-layout";
import type { NextPage } from "next";
import ClickSpark from "@/components/click-spark";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoadingAnimeDragon from "@/components/loading-anime";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    typeof document !== undefined
      ? require("bootstrap/dist/js/bootstrap")
      : null;
    document.title = "Dragonfire & Sorcery";
  }, []);

  // useEffect(() => {
  //   // 要document物件出現後才能導入 bootstrap的js函式庫
  //   import("bootstrap/dist/js/bootstrap");
  // }, []);

  // Animate On Scroll
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  // 使用預設排版檔案，對應 `components/layout/default-layout/index.js`
  const getLayout =
    Component.getLayout || ((page) => <DefaultLayout>{page}</DefaultLayout>);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <>
      {loading && <LoadingAnimeDragon />}
      <GoogleOAuthProvider clientId="939294988879-d1qnubdjc216j259s8nqvn5bj2bnfpth.apps.googleusercontent.com">
        <VoteProvider>
          <LikeProvider>
            <SaveProvider>
              <Provider store={store}>
                <AuthContextProvider>
                  <CartProvider>
                    <NetworkProvider>
                      <ClickSpark />
                      {getLayout(<Component {...pageProps} />)}
                    </NetworkProvider>
                  </CartProvider>
                </AuthContextProvider>
              </Provider>
            </SaveProvider>
          </LikeProvider>
        </VoteProvider>
      </GoogleOAuthProvider>
    </>
  );
}
