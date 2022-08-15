const net = require("net");
const ws = require("ws");

const calcHeight = require("./calcHeight.js");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = (i) => {
  return async function () {
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
              "width=400, height=" + calcHeight(300)
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

        socket.on("close", function () {
          wss.close();
        });

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

                for (const j in bufferPackets) {
                  wss.send(bufferPackets[j]);
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
  };
};
