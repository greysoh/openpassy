const net = require("net");
const ws = require("ws");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

  for (i of data) {
    // Good luck reading this code.
    // :3

    appendInstance(
      generateInstance(i.name, i.photoSrc, async function () {
        let password = null;

        try {
          document.getElementById("textData").innerText = "Connecting...";

          let isFrFrReady = false;

          const wss = new ws.WebSocket(i.url);
          wss.on("open", async function () {
            document.getElementById("textData").innerText =
              "Connected. Running tests...";

            wss.send("Accept: IsPassedWS");

            wss.on("message", async function (data) {
              const strData = data.toString();

              if (data == "AcceptResponse IsPassedWS: true") {
                document.getElementById("textData").innerText =
                  "Requesting data...";

                const newWindow = window.open(
                  "extras/password/index.html",
                  "addPage",
                  "width=400, height=307"
                );

                while (!newWindow.closed) {
                  await sleep(100);
                }

                password = localStorage.getItem("passwordData");
                localStorage.removeItem("passwordData");

                wss.send("Accept: Bearer " + password);

                isFrFrReady = true;
              } else if (data == "AcceptResponse Bearer: true") {
                wss.close();
              } else if (data == "AcceptResponse Bearer: false") {
                wss.close();
                alert("Invalid password!\n\n");

                throw "SafeException: Invalid password";
              }

              console.log(strData);
            });
          });

          while (!isFrFrReady) {
            await sleep(100);
          }

          const port = getRandomInt(10000, 65535);

          const server = net.createServer();
          server.listen(port);

          console.log("Up @ localhost:" + port);

          document.getElementById("textData").innerText =
            "Listening on localhost:" + port;

          server.on("connection", function (socket) {
            console.log(
              "CONNECTED: " + socket.remoteAddress + ":" + socket.remotePort
            );

            let isReady = false;
            const bufferPackets = [];

            const wss = new ws.WebSocket(i.url);

            wss.on("close", function () {
              socket.end();
            });
  
            socket.on("close", function() {
              wss.close();
            })

            wss.on("open", function () {
              socket.on("data", (data) => {
                if (!isReady) {
                  bufferPackets.push(data);
                } else {
                  console.log(data);
                  wss.send(data);
                }
              });

              wss.on("message", function (data) {
                const strData = data.toString();
                console.log(strData);

                if (!isReady) {
                  if (strData == "AcceptResponse Bearer: false") {
                    socket.end();
                    wss.close();
                    alert("Invalid password!\n\n");
                  } else if (strData == "Passy: Connected") {
                    isReady = true;

                    for (i in bufferPackets) {
                      wss.send(bufferPackets[i]);
                    }
                  }
                } else {
                  socket.write(data);
                }
              });

              wss.send("Accept: Bearer " + password);
            });
          });

          server.on("error", (e) => {
            if (e.code === "EADDRINUSE") {
              console.log("Address in use, retrying...");
              setTimeout(() => {
                server.close();
                server.listen(port);
              }, 1000);
            } else {
              console.error(e);
              alert("Internal server error\n\n" + e);
            }
          });
        } catch (e) {
          if (e.toString().startsWith("SafeException")) {
            console.warn(e);
            return;
          }

          console.error(e);
          alert(`Error!\n${e}\n`);
        }
      })
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

  const text = document.createElement("span");
  text.className = "text";
  text.innerText = name;

  button.appendChild(photo);
  button.appendChild(text);

  return button;
}

function appendButton(button) {
  return document.getElementsByClassName("header")[0].appendChild(button);
}

window.addEventListener("DOMContentLoaded", () => {
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
