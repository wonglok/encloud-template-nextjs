import {
  Color,
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
  PlaneBufferGeometry,
} from "three";
import { CylinderInfo } from "./cylinder";

export const title = "plane";

export const effect = async (node) => {
  let { scene, camera, renderer, raycaster, mouse } = node.userData;

  let info = new CylinderInfo({
    count: 60,
    numSides: 3,
    subdivisions: 350,
    openEnded: true,
  });

  scene.add(info.preview);

  node.onLoop((tt, dt) => {
    info.preview.material.uniforms.time.value += dt;
  });

  node.onClean(() => {
    scene.remove(info.preview);
  });

  //
};

//
//
//
