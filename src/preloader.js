const connectServer = require("./connect.js");
const renderUI = require("./renderer.js");

function generateInstance(name, photoSrc, funcSrc) {
  const instance = document.createElement("div");
  instance.className = "app-container";

  const photo = document.createElement("img");
  photo.className = "photo";
  photo.src = photoSrc;
  photo.onclick = funcSrc;

  const text = document.createElement("div");
  text.innerText = name;
  text.className = "text";

  instance.appendChild(photo);
  instance.appendChild(text);

  return instance;
}

function appendInstance(instance) {
  return document.getElementById("app").appendChild(instance);
}

function pullAndGenerateData() {
  let data = localStorage.getItem("data");
  data = JSON.parse(data);

  if (!data) {
    localStorage.setItem("data", JSON.stringify([]));
    return;
  }

  for (const i of data) {
    appendInstance(
      generateInstance(i.name, i.photoSrc, connectServer(i))
    );
  }
}

function generateButton(name, photoSrc, funcSrc) {
  const button = document.createElement("div");
  button.className = "header-button";

  const photo = document.createElement("img");
  photo.className = "photo";
  photo.src = photoSrc;

  photo.onclick = funcSrc;

  button.appendChild(photo);

  return button;
}

function appendButton(button) {
  return document.getElementsByClassName("header")[0].appendChild(button);
}

window.addEventListener("DOMContentLoaded", () => {
  renderUI();

  pullAndGenerateData();
  appendButton(
    generateButton("Add", "plus.png", function () {
      const newWindow = window.open(
        "extras/add/index.html",
        "addPage",
        "width=400, height=300"
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
