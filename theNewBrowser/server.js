const { DiodeConnection, BindPort } = require('diodejs');
const express = require('express');

var connection = null;
var portForward = null;
async function createDiodeConnection(address) {
  const host = 'us2.prenet.diode.io';
  const port = 41046;
  const certPath = 'device_certificate.pem';

  if (!connection) {

    connection = new DiodeConnection(host, port, certPath);
    await connection.connect();

    portForward = new BindPort(connection, 1438, 8080, address);
    await portForward.bind();
  console.log('Diode connection created');
  }
}

const app = express();
const PORT = 3325;

app.get('/connect/:address', async (req, res) => {
  const address = req.params.address;
  await createDiodeConnection(address);
  res.send(`Connected to ${address}`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
