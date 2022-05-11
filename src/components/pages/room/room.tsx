import React from "react";
import Canvas from "../../utils/room/three/canvas";
import SEO from "../../utils/room/main/seo/seo";

export default function Room(): JSX.Element {
  return (
    <>
      {/*<SEO title="Home" />*/}
      <div id="scene-container" style={{ height: "100vh", width: "100%" }}>
        <Canvas />
      </div>
    </>
  );
}
