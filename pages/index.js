import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import Head from "next/head";
import { useEffect } from "react";
import { ENRuntime, BASEURL_REST } from "../pages-code/ENCloudSDK/ENRuntime";
import { EnvMap } from "../pages-code/EnvMap/EnvMap";
import { Bloom } from "../pages-code/Bloom/Bloom";

let getProjectJSON = () => {
  return {
    published: true,
    displayName: "encloud-template-nextjs",
    _id: "60a6ebc7d80d490008f8ab95",
    username: "wonglok831",
    userID: "609b49ad59f39c00098c34ea",
    slug: "encloud-template-nextjs",
    created_at: "2021-05-20T23:07:51.465Z",
    updated_at: "2021-05-26T01:37:33.796Z",
    __v: 0,
    largeString:
      '{"_id":"60a6ebc7d80d490008f8ab95","blockers":[{"_id":"_3t5xs1ff71m297xsba","position":[252.76804316967952,-0.0000012207032540345608,10.44691969525463],"title":"happyshare.demo"}],"ports":[{"_id":"_mhmyeendbd4o8fa1ro","type":"input","idx":0,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_q2ycc50q1ucs4f9o9q","type":"input","idx":1,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_ozd23z5qresgggrz3r","type":"input","idx":2,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_avsez3ymam81g7h25w","type":"input","idx":3,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_5xghxiw252kuiye7fb","type":"input","idx":4,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_24whgtq7il2nxm984b","type":"output","idx":0,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_ljixqp7nj3kny8dgbz","type":"output","idx":1,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_u16smodxl4ckgmmluh","type":"output","idx":2,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_soamjj1qrfkdbtr7tn","type":"output","idx":3,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_4nh7b4sx43zoxubs8a","type":"output","idx":4,"blockerID":"_3t5xs1ff71m297xsba"}],"connections":[],"pickers":[]}',
  };
};

let loadBattriesInFolder = () => {
  let enBatteries = [];
  let reqq = require.context("../pages-code/ENBatteries/", true, /\.js$/);
  let keys = reqq.keys();
  keys.forEach((key) => {
    enBatteries.push(reqq(key));
  });

  return enBatteries;
};

function EffectNode({ projectJSON }) {
  let three = useThree();
  useEffect(() => {
    let enRunTime = new ENRuntime({
      projectJSON: projectJSON,
      enBatteries: loadBattriesInFolder(),
      userData: {},
    });

    Object.entries(three).forEach(([key, value]) => {
      enRunTime.mini.set(key, value);
    });

    return () => {
      enRunTime.mini.clean();
    };
  }, []);

  return <group></group>;
}

export async function getStaticProps(context) {
  let project = getProjectJSON();
  let projectID = project._id;
  let buildTimeCache = await fetch(
    `${BASEURL_REST}/project?action=get-one-of-published`,
    {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({ _id: projectID }),
      method: "POST",
      mode: "cors",
    }
  )
    //
    .then((res) => {
      return res.json();
    });

  return {
    props: {
      buildTimeCache,
    }, // will be passed to the page component as props
  };
}

export default function Home({ buildTimeCache }) {
  return (
    <div className={"h-full w-full"}>
      <Head>
        <title>Your Brand New Site</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Canvas>
        {/*  */}
        <EffectNode
          projectJSON={buildTimeCache || getProjectJSON()}
        ></EffectNode>

        {/*  */}
        <directionalLight
          position={[10, 10, 10]}
          intensity={0.1}
        ></directionalLight>

        {/*  */}
        <ambientLight intensity={0.1}></ambientLight>

        {/*  */}
        <EnvMap></EnvMap>

        <Bloom></Bloom>

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
