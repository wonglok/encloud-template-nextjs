import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { ENRuntime, BASEURL_REST } from "../pages-code/ENCloudSDK/ENRuntime";
import { EnvMap } from "../pages-code/EnvMap/EnvMap";
import { Bloom } from "../pages-code/Bloom/Bloom";

let getProjectJSON = () => {
  // if (process.env.NODE_ENV === "development") {
  //   return {
  //     published: true,
  //     displayName: "nextjs-starter",
  //     _id: "60b06bee4567ac0abc8f046b",
  //     username: "wonglok831",
  //     userID: "609f0aa05603931c51736417",
  //     slug: "nextjs-starter",
  //     created_at: "2021-05-28T04:05:02.090Z",
  //     updated_at: "2021-05-28T04:10:32.425Z",
  //     __v: 0,
  //     largeString:
  //       '{"_id":"60b06bee4567ac0abc8f046b","blockers":[{"_id":"_3t5xs1ff71m297xsba","position":[243.89086578359573,-0.000001220703140347723,-260.239349903874],"title":"demo.plane-disabled"},{"_id":"_129m8jqpaz8v1r3lzw","position":[624.71068668196,-0.000001220703140347723,-249.98821242602472],"title":"demo.sweet-disabled"},{"_id":"_xyco7tly0675hmz5ip","position":[987.9415786990636,-0.000001220703296667125,-68.8435526551333],"title":"noodle.main-disabled"},{"_id":"_a6cyrmuaf0e6i9sw5u","position":[887.5251921101772,-6.879781498201793e-14,309.83781391692025],"title":"noodle.story"}],"ports":[{"_id":"_mhmyeendbd4o8fa1ro","type":"input","idx":0,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_q2ycc50q1ucs4f9o9q","type":"input","idx":1,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_ozd23z5qresgggrz3r","type":"input","idx":2,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_avsez3ymam81g7h25w","type":"input","idx":3,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_5xghxiw252kuiye7fb","type":"input","idx":4,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_24whgtq7il2nxm984b","type":"output","idx":0,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_ljixqp7nj3kny8dgbz","type":"output","idx":1,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_u16smodxl4ckgmmluh","type":"output","idx":2,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_soamjj1qrfkdbtr7tn","type":"output","idx":3,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_4nh7b4sx43zoxubs8a","type":"output","idx":4,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_muiwdmf8t4zhvouafp","type":"input","idx":0,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_ew5otaq3oo0j4mozdf","type":"input","idx":1,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_isle7qkkuq3ux6lp9n","type":"input","idx":2,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_ckr15blt1i0579yh1o","type":"input","idx":3,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_9ibtts3ofwstsr9yf5","type":"input","idx":4,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_w1l0flt2vqsotdsuh4","type":"output","idx":0,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_8kprxvylyob2ycxqhl","type":"output","idx":1,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_vz6ot3rnzjzr0moma1","type":"output","idx":2,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_uvj35cypedomsec1cm","type":"output","idx":3,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_p5bc3xn2x0zbsxrcpp","type":"output","idx":4,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_tee3f0ojsnpf3awgys","type":"input","idx":0,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_ul30rkwx88tm7pkoqd","type":"input","idx":1,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_fb1ztds2al12o0hyy7","type":"input","idx":2,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_k5n3zaeunzzzumng39","type":"input","idx":3,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_hrr93z755r7j9xjgpv","type":"input","idx":4,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_j2os2vew2ttoi8ah99","type":"output","idx":0,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_knhqk6z0wjcle42pet","type":"output","idx":1,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_4dfpqtho79575t6e8c","type":"output","idx":2,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_0uucr4ky6q87323uzt","type":"output","idx":3,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_8rfa2mzo0faiewmwhd","type":"output","idx":4,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_9ijm4i4mxujt4ue8py","type":"input","idx":0,"blockerID":"_a6cyrmuaf0e6i9sw5u"},{"_id":"_l1g5ce3ctnkzm7l10u","type":"input","idx":1,"blockerID":"_a6cyrmuaf0e6i9sw5u"},{"_id":"_5og63gdhec13mjjgil","type":"input","idx":2,"blockerID":"_a6cyrmuaf0e6i9sw5u"},{"_id":"_uyygxx5y4zv91gd533","type":"input","idx":3,"blockerID":"_a6cyrmuaf0e6i9sw5u"},{"_id":"_snr8gvu0tg2eb7s5aq","type":"input","idx":4,"blockerID":"_a6cyrmuaf0e6i9sw5u"},{"_id":"_14forpd6h6kyui8xbm","type":"output","idx":0,"blockerID":"_a6cyrmuaf0e6i9sw5u"},{"_id":"_wweacq0yx1o0u1tw17","type":"output","idx":1,"blockerID":"_a6cyrmuaf0e6i9sw5u"},{"_id":"_fzis576lxhuckr6vyy","type":"output","idx":2,"blockerID":"_a6cyrmuaf0e6i9sw5u"},{"_id":"_wnxvoeqa5rkzx70wiv","type":"output","idx":3,"blockerID":"_a6cyrmuaf0e6i9sw5u"},{"_id":"_mdxew830yxdu1v2l81","type":"output","idx":4,"blockerID":"_a6cyrmuaf0e6i9sw5u"}],"connections":[{"_id":"_xbz9uc42vf7idzqo7o","input":{"_id":"_muiwdmf8t4zhvouafp","type":"input","idx":0,"blockerID":"_129m8jqpaz8v1r3lzw"},"output":{"_id":"_24whgtq7il2nxm984b","type":"output","idx":0,"blockerID":"_3t5xs1ff71m297xsba"}}],"pickers":[]}',
  //   };
  // }

  return {
    published: true,
    displayName: "encloud-template-nextjs",
    _id: "60a6ebc7d80d490008f8ab95",
    username: "wonglok831",
    userID: "609b49ad59f39c00098c34ea",
    slug: "encloud-template-nextjs",
    created_at: "2021-05-20T23:07:51.465Z",
    updated_at: "2021-05-27T02:31:42.702Z",
    __v: 0,
    largeString:
      '{"_id":"60a6ebc7d80d490008f8ab95","blockers":[{"_id":"_3t5xs1ff71m297xsba","position":[225.1904773223522,-0.000001220703197191142,4.078623450698803],"title":"demo.plane"},{"_id":"_129m8jqpaz8v1r3lzw","position":[574.0255800058212,-9.610988275081548e-16,4.328404321431947],"title":"demo.sweet"},{"_id":"_xyco7tly0675hmz5ip","position":[927.3608198868295,-0.000001220703140347723,-3.229549711242844],"title":"noodle.main"}],"ports":[{"_id":"_mhmyeendbd4o8fa1ro","type":"input","idx":0,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_q2ycc50q1ucs4f9o9q","type":"input","idx":1,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_ozd23z5qresgggrz3r","type":"input","idx":2,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_avsez3ymam81g7h25w","type":"input","idx":3,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_5xghxiw252kuiye7fb","type":"input","idx":4,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_24whgtq7il2nxm984b","type":"output","idx":0,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_ljixqp7nj3kny8dgbz","type":"output","idx":1,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_u16smodxl4ckgmmluh","type":"output","idx":2,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_soamjj1qrfkdbtr7tn","type":"output","idx":3,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_4nh7b4sx43zoxubs8a","type":"output","idx":4,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_muiwdmf8t4zhvouafp","type":"input","idx":0,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_ew5otaq3oo0j4mozdf","type":"input","idx":1,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_isle7qkkuq3ux6lp9n","type":"input","idx":2,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_ckr15blt1i0579yh1o","type":"input","idx":3,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_9ibtts3ofwstsr9yf5","type":"input","idx":4,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_w1l0flt2vqsotdsuh4","type":"output","idx":0,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_8kprxvylyob2ycxqhl","type":"output","idx":1,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_vz6ot3rnzjzr0moma1","type":"output","idx":2,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_uvj35cypedomsec1cm","type":"output","idx":3,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_p5bc3xn2x0zbsxrcpp","type":"output","idx":4,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_tee3f0ojsnpf3awgys","type":"input","idx":0,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_ul30rkwx88tm7pkoqd","type":"input","idx":1,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_fb1ztds2al12o0hyy7","type":"input","idx":2,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_k5n3zaeunzzzumng39","type":"input","idx":3,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_hrr93z755r7j9xjgpv","type":"input","idx":4,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_j2os2vew2ttoi8ah99","type":"output","idx":0,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_knhqk6z0wjcle42pet","type":"output","idx":1,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_4dfpqtho79575t6e8c","type":"output","idx":2,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_0uucr4ky6q87323uzt","type":"output","idx":3,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_8rfa2mzo0faiewmwhd","type":"output","idx":4,"blockerID":"_xyco7tly0675hmz5ip"}],"connections":[{"_id":"_xbz9uc42vf7idzqo7o","input":{"_id":"_muiwdmf8t4zhvouafp","type":"input","idx":0,"blockerID":"_129m8jqpaz8v1r3lzw"},"output":{"_id":"_24whgtq7il2nxm984b","type":"output","idx":0,"blockerID":"_3t5xs1ff71m297xsba"}}],"pickers":[]}',
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
      try {
        return res.json();
      } catch (e) {
        return false;
      }
    })
    .catch(() => {
      return false;
    });

  return {
    props: {
      buildTimeCache,
    }, // will be passed to the page component as props
  };
}

function EffectNodeSyncState({ enRunTime }) {
  useFrame((st, dt) => {
    Object.entries(st).forEach(([key, value]) => {
      enRunTime.env.set(key, value);
    });
    //
    enRunTime.env.set("dt", dt);
    return () => {};
  }, []);

  return <group></group>;
}

//
// function makeEventReactive ({ enRunTime, key: event }) {
//   let [st, setSt] = useState(0);
//   useEffect(() => {
//     let hh = () => {
//       setSt((s) => s + 1);
//     };
//     enRunTime.on(event, hh);
//     return () => {
//       enRunTime.off(event, hh);
//     };
//   });
//   return null;
// }
//

function EffectNodeOverlay({ enRunTime }) {
  return (
    <>
      <div className="absolute top-0 right-0 h-20 w-20 bg-white">
        <button
          style={{
            color: "black",
          }}
          onClick={() => {
            enRunTime.emit("top-right-click", {});
          }}
        >
          Toggle Yellow Lines
        </button>
      </div>
    </>
  );
}

export default function Home({ buildTimeCache }) {
  let [enRunTime, setRuntime] = useState(false);

  useEffect(() => {
    let enRunTime = new ENRuntime({
      projectJSON: buildTimeCache || getProjectJSON(),
      enBatteries: loadBattriesInFolder(),
      userData: {},
    });

    setRuntime(enRunTime);

    enRunTime.ready.node123.then(console.log);

    return () => {
      enRunTime.mini.clean();
    };
  }, []);

  return (
    <div className={"h-full w-full"}>
      <Head>
        <title>Your Brand New Site</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {enRunTime && (
        <>
          <Canvas
            dpr={typeof window !== "undefined" ? window.devicePixelRatio : 1.0}
          >
            <EffectNodeSyncState enRunTime={enRunTime}></EffectNodeSyncState>

            <directionalLight
              position={[10, 10, 10]}
              intensity={0.1}
            ></directionalLight>

            <ambientLight intensity={0.1}></ambientLight>

            <EnvMap></EnvMap>

            <Bloom></Bloom>

            <OrbitControls></OrbitControls>
          </Canvas>

          <EffectNodeOverlay enRunTime={enRunTime}></EffectNodeOverlay>
        </>
      )}
    </div>
  );
}
