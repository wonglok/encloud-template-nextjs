import {
  Color,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SphereBufferGeometry,
} from "three";

export const title = "core";

export const effect = async (node) => {
  let { scene, camera, renderer, raycaster } = node.userData;

  node.out0.pulse({
    a: "b",
  });

  let mat = new MeshStandardMaterial({
    color: new Color("#ff0000"),
    metalness: 1.0,
    roughness: 0.4,
  });

  node.pickers.appSettings.color1.stream((value) => {
    mat.color.setStyle(value); //.offsetHSL(0.1, 0, 0);
  });

  let geo = new SphereBufferGeometry(1, 32, 32);

  let mesh = new Mesh(geo, mat);

  scene.add(mesh);
  node.onClean(() => {
    scene.remove(mesh);
  });
};

//
