const { Crypto } = require('@peculiar/webcrypto');
const { cryptoProvider, X509CertificateGenerator, BasicConstraintsExtension, KeyUsagesExtension, KeyUsageFlags } = require('@peculiar/x509');
const { DiodeConnection, DiodeRPC, makeReadable } = require('diodejs');
const fs = require('fs');
async function generateDeviceCertificate() {
  // Set up the WebCrypto provider
  const crypto = new Crypto();
  cryptoProvider.set(crypto);

  // Define the ECDSA algorithm with the secp256k1 curve
  const algorithm = {
    name: 'ECDSA',
    namedCurve: 'K-256', // secp256k1 curve
  };

  // Generate a key pair
  const keys = await crypto.subtle.generateKey(
    algorithm,
    true, // Keys should be extractable
    ['sign', 'verify']
  );
  const { privateKey, publicKey } = keys;

  // Create a self-signed X.509 certificate
  const certificate = await X509CertificateGenerator.createSelfSigned({
    serialNumber: '01', // Serial number for the certificate
    name: 'CN=Device', // Common name for the certificate
    notBefore: new Date(), // Valid from the current date
    notAfter: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1-year validity
    signingAlgorithm: algorithm,
    keys: { privateKey, publicKey }, // Use the generated keys
    extensions: [
      new BasicConstraintsExtension(false, undefined, true), // Basic constraints extension
      new KeyUsagesExtension(KeyUsageFlags.digitalSignature, true), // Key usages
    ],
  });

  // Convert the certificate to PEM format
  const pemCertificate = certificate.toString('pem');

  // convert the private key to pem format
    const pemPrivateKey = Buffer.from(await crypto.subtle.exportKey('pkcs8', privateKey)).toString('base64');

    fs.writeFileSync('device_certificate.pem', `-----BEGIN PRIVATE KEY-----\n${pemPrivateKey}\n-----END PRIVATE KEY-----\n${pemCertificate}`);
    
}
