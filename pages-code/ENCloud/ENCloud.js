import { makeShallowStore, getID } from "./ENUtils.js";

export const FallBackJSON = {
  published: true,
  displayName: "encloud-template-nextjs",
  _id: "60a6ebc7d80d490008f8ab95",
  username: "wonglok831",
  userID: "609b49ad59f39c00098c34ea",
  slug: "encloud-template-nextjs",
  created_at: "2021-05-20T23:07:51.465Z",
  updated_at: "2021-05-20T23:17:38.098Z",
  __v: 0,
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
    })
    .then(() => {
      ProjectStatus.socket = new LambdaClient({
        url: ws,
      });

      let userID = "userUpdateOnSave" + (Math.random() * 100000000).toFixed(0);
      socket.send({
        action: "join-room",
        roomID: projectID,
        userID,
      });

      socket.on("join-room", (e) => {
        // console.log(e.connectionID);
        socket.connID = e.connectionID;
        console.log("joined-room", socket.connID, userID);
      });

      socket.on("bridge-project-room", (ev) => {
        //
        console.log("bridge-project-room", ev);

        let json = JSON.parse(ev.project.largeString);

        ProjectStatus.raw = ev.project;
        ProjectStatus.json = json;
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
      }
      ProjectStatus.json = false;
    });
};

initFnc();
