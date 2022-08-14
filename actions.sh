npm install

if [ "$RUNNER_OS" == "Linux" ]; then
  npm run build-linux
  mv OpenPassy-linux-x64.zip OpenPassy-Linux-x64.zip
elif [ "$RUNNER_OS" == "Windows" ]; then
  npm run build-windows
  move OpenPassy-win32-x64.zip OpenPassy-Windows-x64.zip
else
  echo "$RUNNER_OS not supported"
  exit 1
fi
