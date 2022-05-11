import { useTexture } from "@react-three/drei";
import React from "react";
import { MeshBasicMaterial, PlaneGeometry, sRGBEncoding, Texture } from "three";

// this seems like a generic interface (maybe move it to a generic folder?)
// todo: extract this
interface PaintingProps {
  url: string;
  id: number;
}

const Painting = ({ url = "", id }: PaintingProps): JSX.Element => {
  const texture = useTexture(url);
  texture.encoding = sRGBEncoding;
  const geometry = new PlaneGeometry(3, 3);
  const material = new MeshBasicMaterial({
    map: texture,
  });

  const addition =
    id % 2 === 0 ? Math.ceil(id / 2) * 4 : -Math.ceil(id / 2) * 4;

  // the next values are hardcoded just for the demo
  // ideally we should have them as props + useHelper hook for the box
  // todo: refactor
  return (
    <>
      <mesh
        position={[-5.5 + addition, 1.6, -5.7]}
        args={[geometry, material]}
      />
      <mesh position={[-5.51 + addition, 1.61, -5.76]}>
        <boxGeometry args={[1.1, 1.4, 0.1]} />
        <meshStandardMaterial color="PeachPuff" />
      </mesh>
    </>
  );
};
export default Painting;
