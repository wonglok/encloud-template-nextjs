import { Box, OrbitControls, Sphere } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { ENRuntime } from "../pages-code/ENCloud/ENRuntime";
import { EnvMap } from "../pages-code/EnvMap/EnvMap";
import path from "path";
// import styles from "../styles/Home.module.css";

let enBatteries = [];
let r = require.context("../pages-code/ENBatteries/", true, /js$/);

let keys = r.keys();
keys.forEach((key) => {
  enBatteries.push({
    // title: path.basename(key).replace(".js", ""),
    ...r(key),
  });
});

if (module.hot) {
  module.hot.dispose(() => {
    window.location.reload();
  });
}

console.log(enBatteries);

export default function Home() {
  let ref = useRef();
  let [ready, setReady] = useState(false);
  useEffect(() => {
    ref.current = new ENRuntime({
      userData: {
        //
      },
      enBatteries,
    });

    ref.current.promise.then(() => {
      setReady(true);
    });
    //
    return () => {
      ref.current.mini.clean();
    };
  }, []);

  return (
    ready && (
      <div className={"h-full w-full"}>
        <Head>
          <title>Your Brand New Site</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Canvas>
          <directionalLight
            position={[10, 10, 10]}
            intensity={0.1}
          ></directionalLight>

          <ambientLight intensity={0.1}></ambientLight>

          <EnvMap></EnvMap>

          <Sphere position-x={-1} args={[1, 25, 25]}>
            <meshStandardMaterial
              metalness={0.9}
              roughness={0.1}
            ></meshStandardMaterial>
          </Sphere>

          <Box position-x={1} args={[2, 2, 2, 25, 25, 25]}>
            <meshStandardMaterial
              metalness={0.9}
              roughness={0.1}
            ></meshStandardMaterial>
          </Box>

          <OrbitControls></OrbitControls>
        </Canvas>
      </div>
    )
  );
}
