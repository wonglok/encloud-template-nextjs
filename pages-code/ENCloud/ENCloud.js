import { makeShallowStore, getID, LambdaClient } from "./ENUtils.js";
import SimplePeer from "simple-peer";

export const FallBackJSON = {
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

export const BASEURL_REST = "https://prod-rest.realtime.effectnode.com";
export const BASEURL_WS = `wss://prod-ws.realtime.effectnode.com`;

export const projectID = FallBackJSON._id;
export const username = FallBackJSON.username;
export const userID = FallBackJSON.userID;

export const ProjectStatus = makeShallowStore({
  raw: false,
  json: false,
  socket: false,
});

export const downloadJSON = () => {
  return fetch(`${BASEURL_REST}/project?action=get-one-of-published`, {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({ _id: projectID }),
    method: "POST",
    mode: "cors",
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      //
      let json = JSON.parse(data.largeString);
      return {
        raw: data,
        json: json,
      };
    });
};

export const waitGet = (getFn, resFn) => {
  let tt = setInterval(() => {
    let res = getFn();
    if (res) {
      clearInterval(tt);
      resFn(res);
    }
  });
};

export const initFnc = () => {
  downloadJSON()
    .then(({ raw, json }) => {
      ProjectStatus.raw = raw;
      ProjectStatus.json = json;
      console.log("downloaded JSON");
    })
    .then(() => {
      let socket = (ProjectStatus.socket = new LambdaClient({
        url: BASEURL_WS,
      }));

      let userID = "TruthReceiver" + (Math.random() * 100000000).toFixed(0);

      let setupTruthReceiver = async () => {
        let peer = new SimplePeer({
          initiator: true,
          trickle: false,
        });

        peer.once("signal", (sig) => {
          socket.send({
            action: "signal",
            roomID: projectID,
            userID,
            connectionID: socket.connID,
            signal: sig,
          });
          console.log(sig);
        });

        socket.once("signal", ({ connectionID, signal, userID }) => {
          if (
            connectionID === socket.connID &&
            userID === "TruthProvider" &&
            !peer.destroyed
          ) {
            peer.signal(signal);
          }
        });

        // socket.once("connect", () => {
        //   console.log("connected");
        // });

        peer.once("close", () => {
          peer.destroyed = true;
        });

        peer.once("error", () => {
          peer.destroyed = true;
        });

        peer.once("connect", () => {
          console.log("[P2P]: TruthRreceiver OK");
        });

        peer.on("data", (buffer) => {
          if (peer.destroyed) {
            return;
          }
          let str = buffer.toString();
          let obj = JSON.parse(str);

          let json = JSON.parse(obj.largeString);
          ProjectStatus.raw = obj;
          ProjectStatus.json = json;

          truthHasArrived();
          // console.log("arrived");
        });
      };

      socket.on("join-room", (e) => {
        socket.connID = e.connectionID;
        setupTruthReceiver();
        // console.log("join-room", socket.connID, userID);
      });

      socket.on("bridge-project-room", (ev) => {
        console.log("bridge-project-room", ev);

        let json = JSON.parse(ev.project.largeString);
        ProjectStatus.raw = ev.project;
        ProjectStatus.json = json;

        truthHasArrived();
      });

      socket.on("encloud-ready", () => {
        socket.send({
          action: "join-room",
          roomID: projectID,
          userID,
        });
      });

      socket.send({
        action: "join-room",
        roomID: projectID,
        userID,
      });
    })
    .catch((e) => {
      ProjectStatus.raw = FallBackJSON;
      if (FallBackJSON.largeString) {
        try {
          ProjectStatus.json = JSON.parse(FallBackJSON.largeString);
        } catch (e) {
          console.log(e);
          ProjectStatus.json = false;
        }
      } else {
        ProjectStatus.json = false;
      }
      truthHasArrived();
    });
};

const truthHasArrived = () => {
  window.dispatchEvent(
    new CustomEvent("project-truth-arrive", {
      detail: JSON.parse(JSON.stringify(ProjectStatus)),
    })
  );
};
