export const title = "core2";

export const effect = async (node) => {
  node.in0.stream((v) => {
    console.log("stream", v);
  });

  let val = await node.in0.ready;
  console.log("in0-val", val);
};
