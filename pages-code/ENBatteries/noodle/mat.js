import {
  Color,
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
  SphereBufferGeometry,
  Vector3,
} from "three";

import { FolderName } from ".";
export const title = `${FolderName}.mat`;

export const effect = async (node) => {
  let scene = await node.ready.scene;
  let camera = await node.ready.camera;
  let renderer = await node.ready.gl;
  let raycaster = await node.ready.raycaster;
  let mouse = await node.ready.mouse;

  //
  //
};
