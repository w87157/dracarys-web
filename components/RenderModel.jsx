// RenderModel.jsx
"use client";
import { Environment, Html, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import clsx from "clsx";
import React, { Suspense } from "react";
import LoadingAnime from "@/components/loading-anime/loading-anime";

const RenderModel = ({ children, className }) => {
  function Loader() {
    const { progress } = useProgress();
    return (
      <Html center>
        <div className="loader-container">
          <div className="loader-progress"  style={{ color: 'darkred'}}>{progress.toFixed(2)}%</div>
        </div>
        <LoadingAnime size={200} color="darkred" className="text-danger"/>
      </Html>
    );
  }

  return (
    <Canvas
      className={clsx("w-screen h-screen z-1 relative", className)}
      style={{ height: "100vh", width: "" }}
      shadows={false}
      dpr={[1, 2]}
    >
      <Suspense fallback={<Loader />}>{children}</Suspense>
      <Environment preset="dawn" />
    </Canvas>
  );
};

export default RenderModel;
