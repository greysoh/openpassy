const os = require("os");

module.exports = function(height) {
  if (os.platform() == "darwin") {
    return height;
  } else {
    return height + 68;
  }
}