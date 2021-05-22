import { waitForTruth } from "./ENCloud";
import { ENMini } from "./ENMini";
import { getID, makeShallowStore } from "./ENUtils";

export class ENRuntime {
  constructor({ userData = {}, enBatteries = [], autoStart = true }) {
    this.mini = new ENMini();
    this.projectJSON = false;
    this.autoStart = autoStart;
    this.enBatteries = enBatteries;
    this.userData = userData;
    this.promise = this.setup();
  }
  async setup() {
    //
    this.projectJSON = await waitForTruth();

    //
    let activeListener = new Map();

    //
    let runtimes = [];
    let nowSignature = "a";
    let lastSignature = "b";
    let getSignature = () => {
      return JSON.stringify({
        blockers: this.projectJSON.blockers,
        ports: this.projectJSON.ports,
        connections: this.projectJSON.connections,
      });
    };

    let handleArrival = ({ detail }) => {
      this.projectJSON = detail;

      //
      let pickers = this.projectJSON.pickers;

      //
      pickers.forEach((moduleObj) => {
        moduleObj.pickers.forEach((pickerItem) => {
          if (activeListener.has(`${moduleObj.title}/${pickerItem.title}`)) {
            window.dispatchEvent(
              new CustomEvent(`${moduleObj.title}/${pickerItem.title}`, {
                detail: pickerItem,
              })
            );
          }
        });
      });

      if (lastSignature !== nowSignature) {
        nowSignature = getSignature();
        lastSignature = nowSignature;

        window.dispatchEvent(new CustomEvent("hot-swap-graph"));
      }
    };

    window.addEventListener("project-arrive", handleArrival, false);
    this.mini.onClean(() => {
      window.removeEventListener("project-arrive", handleArrival);
    });

    let handleSwap = () => {
      //
      runtimes.forEach(({ mini }) => {
        mini.clean();
      });

      runtimes.forEach((val) => {
        runtimes.splice(
          runtimes.findIndex((r) => r._id === val._id),
          1
        );
      });

      runtimes.push(
        new CodeRuntime({
          parent: this,
        })
      );
    };

    window.addEventListener("hot-swap-graph", handleSwap, false);
    this.mini.onClean(() => {
      window.removeEventListener("hot-swap-graph", handleSwap);
    });

    let makePicker = (moduleTitle) => {
      let stream = (pickerTitle, fnc = () => {}) => {
        if (!activeListener.has(`${moduleTitle}/${pickerTitle}`)) {
          activeListener.set(`${moduleTitle}/${pickerTitle}`, true);
        }

        let hPicker = ({ detail }) => {
          //
          fnc(detail.value, detail);
        };
        window.addEventListener(`${moduleTitle}/${pickerTitle}`, hPicker);
        this.mini.onClean(() => {
          window.removeEventListener(`${moduleTitle}/${pickerTitle}`, hPicker);
        });
      };

      let pickerAPI = {
        get: (tgOBJ, key) => {
          let pickerSet = this.projectJSON.pickers.find(
            (e) => e.title === moduleTitle
          );
          if (!pickerSet) {
            throw new Error("cant find picker module", moduleTitle);
          }

          let obj = pickerSet.pickers.find((e) => e.title === key);

          obj.stream = (fnc) => {
            return stream(key, fnc);
          };

          return obj;
        },
      };

      return new Proxy({}, pickerAPI);
    };

    let PickerCache = new Map();

    let pickerModAPI = {
      get: (obj, key) => {
        let pickers = this.projectJSON.pickers;
        if (pickers.map((e) => e.title).includes(key)) {
          if (PickerCache.has(key)) {
            return PickerCache.get(key);
          }
          let api = makePicker(key);
          PickerCache.set(key, api);
          return api;
        } else {
          throw new Error("No picker found");
        }
      },
    };

    let pickers = new Proxy({}, pickerModAPI);

    let core = {
      pickers,
      mini: this.mini,
    };
    this.core = core;

    let rAFID = 0;
    let rAF = () => {
      rAFID = requestAnimationFrame(rAF);
      this.mini.work();
    };
    this.mini.onClean(() => {
      cancelAnimationFrame(rAFID);
    });
    if (this.autoStart) {
      rAFID = requestAnimationFrame(rAF);
    }

    //
    //
    // ==-------
    // // example code
    // let settings = pickers.appSettings;
    // settings.color1.stream((value, object) => {
    //   console.log(value, object);
    // });
    // settings.color2.stream((value, object) => {
    //   console.log(value, object);
    // });
    // settings.color3.stream((value, object) => {
    //   console.log(value, object);
    // });
    // console.log("value", settings.color1.value);
    // // ==-------
    //
    //

    //
    return this;
  }
}

export class CodeRuntime {
  constructor({ parent }) {
    this._id = getID();
    this.parent = parent;
    let self = this;

    this.mini = new ENMini({ name: "runtime" });
    this.mini.set("parent", parent);
    parent.mini.onLoop(() => {
      this.mini.work();
    });

    parent.mini.onClean(() => {
      this.mini.clean();
    });

    let blockers = this.parent.projectJSON.blockers;
    let connections = this.parent.projectJSON.connections;
    let ports = this.parent.projectJSON.ports;

    connections.forEach((conn) => {
      let handlConn = ({ detail }) => {
        window.dispatchEvent("i" + conn.input._id, { detail });
      };
      window.addEventListener("o" + conn.output._id, handlConn);
      window.removeEventListener("o" + conn.output._id, handlConn);
    });

    blockers.forEach((b) => {
      console.log("CodeBlockerRuntime", b.title);
      let uFunc = parent.enBatteries.find((f) => f.title === b.title);
      let portsAPIMap = new Map();
      ports
        .filter((e) => e.blockerID === b._id)
        .filter((e) => e.type === "input")
        .map((e, idx) => {
          let api = {
            stream: (onReceive) => {
              window.addEventListener("i" + e._id, onReceive);
              this.mini.onClean(() => {
                window.removeEventListener("i" + e._id, onReceive);
              });
            },
            get wait() {
              return new Promise((resolve) => {
                let hh = ({ detail }) => {
                  resolve(detail);
                };
                window.addEventListener("i" + e._id, hh);
                self.mini.onClean(() => {
                  window.removeEventListener("i" + e._id, hh);
                });
              });
            },
          };

          portsAPIMap.set(`i${idx}`, api);

          return e;
        });

      ports
        .filter((e) => e.blockerID === b._id)
        .filter((e) => e.type === "output")
        .map((e, idx) => {
          let api = {
            pulse: (data) => {
              window.dispatchEvent(
                new CustomEvent("o" + e._id, { detail: data })
              );
            },
          };
          portsAPIMap.set(`o${idx}`, api);

          return e;
        });

      if (uFunc && uFunc.setup) {
        uFunc.setup(
          new Proxy(
            {
              ...this.parent.core,
              parent: this.parent,
              mini: this.mini,
            },
            {
              get: (obj, key) => {
                if (key.indexOf("i") === 0 && !isNaN(key[1])) {
                  return portsAPIMap.get(key);
                }
                if (key.indexOf("o") === 0 && !isNaN(key[1])) {
                  return portsAPIMap.get(key);
                }

                return obj[key];
              },
            }
          )
        );
      }
    });
  }
}
//

//

//

//

//
