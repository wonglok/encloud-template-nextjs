import {
  Color,
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  SphereBufferGeometry,
  Vector3,
} from "three";

import { FolderName } from ".";
import { Noodle } from "./classes/Noodle";
export const title = `${FolderName}.main`;

export const effect = async (node) => {
  let scene = await node.ready.scene;
  let camera = await node.ready.camera;
  let renderer = await node.ready.gl;
  let raycaster = await node.ready.raycaster;
  let mouse = await node.ready.mouse;

  let o3d = new Object3D();
  scene.add(o3d);

  let noodle = new Noodle({
    o3d,
    onLoop: (v) => {
      node.onLoop(v);
    },
    pathVec3: [
      new Vector3(1, 0, 0),
      new Vector3(-1, 1, 0),
      new Vector3(1, -1, 0),
      new Vector3(-1, 0, 0),
    ],
  });
  node.onClean(() => {
    noodle.cleanUpScene();
  });
};
