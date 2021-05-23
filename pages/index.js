import { Box, OrbitControls, Sphere } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { ENRuntime } from "../pages-code/ENCloudSDK/ENRuntime";
import { EnvMap } from "../pages-code/EnvMap/EnvMap";
let loadBattriesInFolder = () => {
  let enBatteries = [];
  let reqq = require.context("../pages-code/ENBatteries/", true, /\.js$/);
  let keys = reqq.keys();
  keys.forEach((key) => {
    enBatteries.push(reqq(key));
  });
  return enBatteries;
};

let loadProjectJSON = () => {
  return {
    published: true,
    displayName: "encloud-template-nextjs",
    _id: "60a6ebc7d80d490008f8ab95",
    username: "wonglok831",
    userID: "609b49ad59f39c00098c34ea",
    slug: "encloud-template-nextjs",
    created_at: "2021-05-20T23:07:51.465Z",
    updated_at: "2021-05-20T23:18:41.392Z",
    __v: 0,
    largeString:
      '{"_id":"60a6ebc7d80d490008f8ab95","blockers":[],"ports":[],"connections":[],"pickers":[]}',
  };
};

function EffectNode() {
  let three = useThree();
  useEffect(() => {
    let enRunTime = new ENRuntime({
      projectJSON: loadProjectJSON(),
      enBatteries: loadBattriesInFolder(),
      userData: {
        ...three,
      },
    });

    return () => {
      enRunTime.mini.clean();
    };
  }, []);

  return <group></group>;
}

//

export default function Home() {
  return (
    <div className={"h-full w-full"}>
      <Head>
        <title>Your Brand New Site</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Canvas>
        {/*  */}
        <EffectNode></EffectNode>

        {/*  */}
        <directionalLight
          position={[10, 10, 10]}
          intensity={0.1}
        ></directionalLight>

        {/*  */}
        <ambientLight intensity={0.1}></ambientLight>

        {/*  */}
        <EnvMap></EnvMap>

        {/* <Sphere position-x={-1} args={[1, 25, 25]}>
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
        </Box> */}

        <OrbitControls></OrbitControls>
      </Canvas>
    </div>
  );
}
