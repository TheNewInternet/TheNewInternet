# theNewInternet

theNewInternet is a decentralized, censorship-resistant platform that enables private, blockchain-driven web browsing and publishing. It consists of two main components:

1. **theNewPublisher**: A CLI tool for web publishers to share locally hosted applications securely, with access restricted to whitelisted users or open to the public.
2. **theNewBrowser**: A blockchain-integrated web browser that allows users to access whitelisted content using wallet authentication, ensuring privacy and security.

---

## **Features**
- Decentralized communication via Diode Network Nodes
- Secure, wallet-based authentication using Web3Auth
- Privacy-first design with no IP address exchange
- Flexible access control via whitelist or public settings
- Easy-to-use CLI tool for publishing and browser for accessing content

---

## **Setup and Usage**

### **1. theNewPublisher**
This CLI tool allows you to publish applications running on your local device. 

#### **Steps to Run**
```bash
cd theNewPublisher
npm install
node publisherCLI.js
```
- Enter the port of the application you wish to publish.
- Choose between "whitelisted" (restricted access) or "public" (open access).

### **2. theNewBrowser**
The browser enables users to securely access content shared via theNewPublisher.

#### **Steps to Run**
```bash
cd theNewBrowser
npm install
npm start
```
- Log in using Web3Auth to generate a blockchain wallet.
- Enter the blockchain address of the site you want to access in the browser's address bar.

### **3. Test with Example Site**
You can test theNewInternet functionality with an example site.

#### **Steps to Run**
```bash
cd exampleSites/whatsmyip
npm install
node app.js
```
- This will start a simple "What's My IP" application.
- Use theNewPublisher to publish it, then access it via theNewBrowser.

## **Technical Overview**
Web3Auth: Used for wallet creation and secure authentication.
Diode Network Nodes: Facilitate decentralized P2P communication with TLS encryption.
CLI Tool: Simplifies application sharing and whitelist management.
Custom Browser: Built using Electron.js for seamless integration with blockchain-based authentication.

## **Boilerplate Used**
- [Electron React Boilerplate](
    https://github.com/electron-react-boilerplate/electron-react-boilerplate
    ): Used for theNewBrowser development.

---

Enjoy theNewInternet! If you encounter any issues or have suggestions, feel free to open an issue or reach out.
