/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, BrowserView } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import fs from 'fs';
//spawn a new process to run "node server"
const { spawn } = require('child_process');

//spawn a new process to run "node server"
const server = spawn('node', ['server.js']);

server.stdout.on('data', (data: any) => {
  console.log(`stdout: ${data}`);
});


const asn1js = require('asn1js');
const pkijs = require('pkijs');
const elliptic = require('elliptic');
const crypto = require('crypto');
const { Certificate, AttributeTypeAndValue, AlgorithmIdentifier, PublicKeyInfo, PrivateKeyInfo } = pkijs;



class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

function bufferToArrayBuffer(buf: any) {
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

ipcMain.on('store-private-key', async (event, privateKeyHex) => {

  // Convert hex private key to Buffer
  const privateKeyBuffer = Buffer.from(privateKeyHex, 'hex');

  // Initialize elliptic curve
  const ec = new elliptic.ec('secp256k1');

  // Generate key pair from private key
  const keyPair = ec.keyFromPrivate(privateKeyBuffer);

  // Get public key in uncompressed format
  const publicKeyHex = keyPair.getPublic(false, 'hex');
  const publicKeyBuffer = Buffer.from(publicKeyHex, 'hex');

  // Create AlgorithmIdentifier for secp256k1
  const algorithmIdentifier = new AlgorithmIdentifier({
      algorithmId: '1.2.840.10045.2.1', // id-ecPublicKey OID
      algorithmParams: new asn1js.ObjectIdentifier({ value: '1.3.132.0.10' }) // secp256k1 OID
  });

  // Create SubjectPublicKeyInfo
  const subjectPublicKeyInfo = new PublicKeyInfo({
      algorithm: algorithmIdentifier,
      subjectPublicKey: new asn1js.BitString({ valueHex: bufferToArrayBuffer(publicKeyBuffer) })
  });

  // Construct ECPrivateKey structure
  // ECPrivateKey ::= SEQUENCE {
  //   version        INTEGER { ecPrivkeyVer1(1) } (ecPrivkeyVer1),
  //   privateKey     OCTET STRING,
  //   parameters [0] ECParameters {{ NamedCurve }} OPTIONAL,
  //   publicKey  [1] BIT STRING OPTIONAL
  // }

  // Create parameters [0] IMPLICIT ECParameters
  const parameters = new asn1js.ObjectIdentifier({ value: '1.3.132.0.10' });
  parameters.idBlock.tagClass = 3; // context-specific
  parameters.idBlock.tagNumber = 0; // [0]
  parameters.idBlock.isConstructed = false; // primitive

  // Create publicKey [1] IMPLICIT BIT STRING
  const publicKeyBitString = new asn1js.BitString({ valueHex: bufferToArrayBuffer(publicKeyBuffer) });
  publicKeyBitString.idBlock.tagClass = 3; // context-specific
  publicKeyBitString.idBlock.tagNumber = 1; // [1]
  publicKeyBitString.idBlock.isConstructed = false; // primitive

  // Construct ECPrivateKey sequence
  const ecPrivateKey = new asn1js.Sequence({
      value: [
          new asn1js.Integer({ value: 1 }), // version
          new asn1js.OctetString({ valueHex: bufferToArrayBuffer(privateKeyBuffer) }), // privateKey
          parameters,
          publicKeyBitString
      ]
  });

  const ecPrivateKeyBuffer = ecPrivateKey.toBER(false);

  // Create PrivateKeyInfo for the private key
  const privateKeyInfo = new PrivateKeyInfo({
      version: 0,
      privateKeyAlgorithm: algorithmIdentifier,
      privateKey: new asn1js.OctetString({ valueHex: ecPrivateKeyBuffer })
  });

  // Create a new certificate
  const certificate = new Certificate();

  // Set serial number
  certificate.serialNumber = new asn1js.Integer({ value: 1 });

  // Set issuer and subject (self-signed)
  const commonName = 'example.org';
  const attrTypeAndValue = new AttributeTypeAndValue({
      type: '2.5.4.3', // Common Name OID
      value: new asn1js.Utf8String({ value: commonName })
  });
  certificate.issuer.typesAndValues.push(attrTypeAndValue);
  certificate.subject.typesAndValues.push(attrTypeAndValue);

  // Set validity period
  certificate.notBefore.value = new Date();
  certificate.notAfter.value = new Date();
  certificate.notAfter.value.setFullYear(certificate.notBefore.value.getFullYear() + 1);

  // Assign SubjectPublicKeyInfo
  certificate.subjectPublicKeyInfo = subjectPublicKeyInfo;

  // Set signature algorithm (ECDSA with SHA-256)
  const ecdsaWithSHA256OID = '1.2.840.10045.4.3.2'; // ECDSA with SHA-256 OID
  const signatureAlgorithm = new AlgorithmIdentifier({
      algorithmId: ecdsaWithSHA256OID,
      algorithmParams: new asn1js.Null()
  });
  certificate.signatureAlgorithm = signatureAlgorithm;
  certificate.tbsSignature = signatureAlgorithm;

  // Manually sign the certificate using elliptic
  (async () => {
      // Encode TBS (To Be Signed) certificate
      const tbs = certificate.encodeTBS().toBER(false);

      // Hash TBS certificate using SHA-256
      const hash = crypto.createHash('sha256').update(Buffer.from(tbs)).digest();

      // Sign the hash using the private key
      const signature = keyPair.sign(hash);

      // Encode signature components (r and s) into ASN.1 sequence
      const rBuffer = Buffer.from(signature.r.toArrayLike(Uint8Array, 'be', 32));
      const sBuffer = Buffer.from(signature.s.toArrayLike(Uint8Array, 'be', 32));

      const rInteger = new asn1js.Integer({ valueHex: bufferToArrayBuffer(rBuffer) });
      const sInteger = new asn1js.Integer({ valueHex: bufferToArrayBuffer(sBuffer) });

      const asn1Signature = new asn1js.Sequence({ value: [rInteger, sInteger] });
      const signatureValueBuffer = Buffer.from(asn1Signature.toBER(false));

      // Set signatureValue
      certificate.signatureValue = new asn1js.BitString({ valueHex: bufferToArrayBuffer(signatureValueBuffer) });

      // Export the certificate to DER format
      const certDer = certificate.toSchema(true).toBER(false);

      // Convert DER to PEM format
      const certPem = '-----BEGIN CERTIFICATE-----\n' +
          (Buffer.from(certDer).toString('base64').match(/.{0,64}/g)?.join('\n') || '') +
          '-----END CERTIFICATE-----\n';

      // Export the private key to DER format
      const privateKeyDer = privateKeyInfo.toSchema(true).toBER(false);

      // Convert DER to PEM format
      const privateKeyPem = '-----BEGIN PRIVATE KEY-----\n' +
          Buffer.from(privateKeyDer).toString('base64').match(/.{0,64}/g)?.join('\n') || '' +
          '-----END PRIVATE KEY-----\n';

      // Output the certificate and private key
      // console.log(certPem);
      // console.log(privateKeyPem);

      // Write the certificate with private key to a file if not already exists
      if (!fs.existsSync('device_certificate.pem'))
      fs.writeFileSync('device_certificate.pem', privateKeyPem + certPem);

  })();

});

ipcMain.on('create-diode-connection', async (event, address) => {
  try {
    // send request to http://localhost:3325/connect/:address
    const response = await fetch(`http://localhost:3325/connect/${address}`);
    event.reply('create-diode-connection-success');
  } catch (error) {
    console.error("Error creating Diode connection:", error);
    if (error instanceof Error) {
      event.reply('create-diode-connection-failure', error.message);
    } else {
      event.reply('create-diode-connection-failure', String(error));
    }
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      devTools: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  app.on('web-contents-created', (e, wc) => {
		// wc: webContents of <webview> is now under control
		wc.setWindowOpenHandler((handler) => {
				return {action : "allow"}; // deny or allow
		});
	});

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((details) => {
    return {
      action: 'allow',
      createWindow: (options) => {
        const browserView = new BrowserView(options)
        mainWindow?.addBrowserView(browserView)
        browserView.setBounds({ x: 0, y: 0, width: 640, height: 480 })
        return browserView.webContents
      }
    }
  })

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
