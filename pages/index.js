import { Box, OrbitControls, Sphere } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Head from "next/head";
import { useEffect } from "react";
import { initFnc } from "../pages-code/ENCloud/ENCloud";
import { EnvMap } from "../pages-code/EnvMap/EnvMap";

// import styles from "../styles/Home.module.css";

export default function Home() {
  useEffect(() => {
    initFnc();
  }, []);

  return (
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
  );
}
