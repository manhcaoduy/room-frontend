import React, { useEffect, useRef } from "react";
import { Mesh, Object3D } from "three";
import {
  PointerLockControls,
  DeviceOrientationControls,
  DeviceOrientationControlsProps,
} from "@react-three/drei";
import Config from "../config";
import { useThree } from "@react-three/fiber";
import useMovement from "./hooks/useMovement";
interface ControlsProps {
  floor?: Mesh;
}

const Controls = ({ floor }: ControlsProps): JSX.Element => {
  const defaultCamera = useThree(({ camera }) => camera);
  const deviceOrientationControls = useRef<DeviceOrientationControlsProps>();
  const hasCursor = matchMedia("(pointer:fine)").matches;

  useEffect(() => {
    defaultCamera.position.set(0, Config.player.personHeight, 0);
    if (hasCursor) return;

    const reConnectListeners = (): void => {
      if (!deviceOrientationControls.current) return;

      if (typeof deviceOrientationControls.current.disconnect === "function")
        deviceOrientationControls.current.disconnect();
      if (typeof deviceOrientationControls.current.connect === "function")
        deviceOrientationControls.current.connect();
    };
    document.addEventListener("touchend", reConnectListeners, { once: true });
  }, []);

  useMovement({
    object: defaultCamera as Object3D,
    floor,
  });

  return hasCursor ? (
    <PointerLockControls />
  ) : (
    <DeviceOrientationControls
      screenOrientation={90}
      // ref={deviceOrientationControls}
    />
  );
};

export default Controls;
