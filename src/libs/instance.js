const connectServer = require("./connect.js");

const defaultProfile = "data:image/png;base64,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";

module.exports = {
  generateInstance(name, photoSrc, funcSrc) {
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
  },
  
  appendInstance(instance) {
    return document.getElementById("app").appendChild(instance);
  },
  
  pullAndGenerateData() {
    let data = localStorage.getItem("data");
    data = JSON.parse(data);
  
    if (!data) {
      localStorage.setItem("data", JSON.stringify([]));
      return;
    }
  
    for (const index in data) {
      const i = data[index];

      if (i.photoSrc == "photo.png") {
        console.log("INFO: Converting '%s' to new photo source", i.name);
        data[index].photoSrc = defaultProfile;
        localStorage.setItem("data", JSON.stringify(data));
      }

      if (typeof i.defaultPort != "string" && typeof i.defaultPort != "number") {
        console.log("INFO: Converting '%s' to use new port system", i.name);
        
        data[index].defaultPort = "";
        localStorage.setItem("data", JSON.stringify(data));
      }

      module.exports.appendInstance(
        module.exports.generateInstance(i.name, data[index].photoSrc, connectServer(i))
      );
    }
  },
  
  generateButton(name, photoSrc, funcSrc) {
    const button = document.createElement("div");
    button.className = "header-button";
  
    const photo = document.createElement("img");
    photo.className = "photo";
    photo.src = photoSrc;
  
    button.onclick = funcSrc;

    const text = document.createElement("span");
    text.innerText = name;
    text.className = "text";

    button.appendChild(photo);
    button.appendChild(text);
  
    return button;
  },
  
  appendButton(button) {
    return document.getElementsByClassName("header")[0].appendChild(button);
  }
}