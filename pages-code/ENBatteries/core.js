export const title = "core";

export const effect = async (node) => {
  let messageToBeSent = {
    a: "b",
  };

  console.log("messageToBeSent", messageToBeSent);
  node.out0.pulse(messageToBeSent);

  node.pickers.appSettings.slider1.stream((value) => {
    console.log(value);
  });

  console.log(node.pickers.appSettings.slider1.value);

  console.log(node.userData);

  node.onClean(() => {});
  //
};

//
