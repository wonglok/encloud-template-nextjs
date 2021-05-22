export const title = "core";

export const effect = async (node) => {
  let sender = {
    a: "b",
  };
  console.log(sender);
  node.out0.pulse(sender);

  //
};
