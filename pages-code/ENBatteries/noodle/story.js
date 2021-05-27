import { Object3D, Vector3 } from "three";

import { FolderName } from ".";
import { Story } from "./classes/Story";
export const title = `${FolderName}.story`;

export const effect = async (node) => {
  let scene = await node.ready.scene;
  let camera = await node.ready.camera;
  let renderer = await node.ready.gl;
  let raycaster = await node.ready.raycaster;
  let mouse = await node.ready.mouse;

  let o3d = new Object3D();
  scene.add(o3d);

  let noodle = new Story({
    o3d,
    onLoop: (v) => {
      node.onLoop(v);
    },
  });

  //
  node.onClean(() => {
    noodle.cleanUpScene();
  });
};
