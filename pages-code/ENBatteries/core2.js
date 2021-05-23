import {
  Color,
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
  SphereBufferGeometry,
  Vector3,
} from "three";

export const title = "core2";

export const effect = async (node) => {
  let { scene, camera, renderer, raycaster, mouse } = node.userData;

  let mat = new MeshStandardMaterial({
    color: new Color("#ff0000"),
    metalness: 1.0,
    roughness: 0.4,
    transparent: true,
    opacity: 0.5,
    flatShading: true,
    side: DoubleSide,
  });

  node.pickers.appSettings.color2.stream((value) => {
    mat.color.setStyle(value); //.offsetHSL(0.1, 0, 0);
  });

  let geo = new SphereBufferGeometry(1, 32, 32);
  let mesh = new Mesh(geo, mat);
  mesh.scale.z = 0.5;
  mesh.scale.multiplyScalar(0.33);

  node.onLoop((t, dt) => {
    mesh.rotation.y += Math.sin(t) * dt * 1.0 * Math.PI;
    mesh.rotation.z += Math.cos(t) * dt * Math.PI;
  });

  scene.add(mesh);
  node.onClean(() => {
    scene.remove(mesh);
  });

  let desintaion = new Vector3();

  node.in0.stream((ev) => {
    if (ev && ev.point) {
      desintaion.copy(ev.point);
    }
  });

  node.onLoop(() => {
    mesh.position.lerp(desintaion, 0.05);
  });
};
