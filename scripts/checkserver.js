const net = require('net');
const process = require('process');

const check = () => {
  const socket = new net.Socket();

  const onError = () => {
    socket.destroy();
    setTimeout(check, 1000);
  };

  socket.setTimeout(1000);
  socket.once('error', onError);
  socket.once('timeout', onError);

  socket.connect(5000, "127.0.0.1", () => {
    socket.end();
    process.exit(0);
  });
}

check();
