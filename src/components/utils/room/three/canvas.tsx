import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader as CanvasLoader, Preload } from "@react-three/drei";
import { Mesh } from "three";
import Controls from "./controls";
import Painting from "./painting";
import Gallery from "./gallery";

const IndexPage = (): JSX.Element => {
  const [floor, setFloor] = useState<Mesh>();

  return (
    <>
      <Canvas>
        <ambientLight />
        <Suspense fallback={null}>
          <Controls floor={floor} />
          <Painting name="samodiva" />
          <Gallery setFloor={setFloor} />
          <Preload all />
        </Suspense>
      </Canvas>
      <CanvasLoader
        barStyles={{ height: "10px" }}
        dataStyles={{ fontSize: "14px" }}
        dataInterpolation={(percent): string =>
          `Loading ${percent.toFixed(0)}%`
        }
      />
    </>
  );
};

export default IndexPage;
