const connectServer = require("./libs/connect.js");
const renderUI = require("./libs/renderer.js");

const calcHeight = require("./libs/calcHeight.js");

const { generateInstance, appendInstance, pullAndGenerateData, generateButton, appendButton } = require("./libs/instance.js");

window.addEventListener("DOMContentLoaded", () => {
  renderUI();

  pullAndGenerateData();
  appendButton(
    generateButton("Add", "plus.png", function () {
      const newWindow = window.open(
        "extras/add/index.html",
        "addPage",
        "width=400, height=" + calcHeight(300)
      );

      const timer = setInterval(function () {
        if (newWindow.closed) {
          clearInterval(timer);

          document.getElementById("app").innerHTML = "";
          pullAndGenerateData();
        }
      }, 100);
    })
  );
});
