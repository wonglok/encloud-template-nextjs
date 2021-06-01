import { Object3D, Vector3 } from "three";

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
  });

  node.on("top-right-click", () => {
    o3d.visible = !o3d.visible;
  });

  //
  node.onClean(() => {
    noodle.cleanUpScene();
  });
};
