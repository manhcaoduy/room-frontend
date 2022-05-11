import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader as CanvasLoader, Preload } from "@react-three/drei";
import { Mesh } from "three";
import Controls from "./controls";
import Painting from "./painting";
import Gallery from "./gallery";

interface Props {
  itemUrls: string[];
}

const IndexPage = (props: Props): JSX.Element => {
  const { itemUrls } = props;

  const [floor, setFloor] = useState<Mesh>();

  return (
    <>
      <Canvas>
        <ambientLight />
        <Suspense fallback={null}>
          <Controls floor={floor} />
          {itemUrls.map((itemUrl, index) => {
            return (
              <>
                <Painting url={itemUrl} id={index} />
              </>
            );
          })}
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
