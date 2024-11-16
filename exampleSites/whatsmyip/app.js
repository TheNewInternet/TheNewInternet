// app.js

const express = require('express');
const requestIp = require('request-ip');

const app = express();
const PORT = 3000;

// Middleware to retrieve client IP
app.use(requestIp.mw());

// Define a route to display the IP address with styling
app.get('/', (req, res) => {
  const clientIp = req.clientIp;

  // HTML content with embedded CSS
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Your IP Address</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background-color: #f0f0f0;
          font-family: Arial, sans-serif;
        }
        .ip-container {
          text-align: center;
          padding: 20px;
          border: 2px solid #f15d2e;
          border-radius: 10px;
          background-color: #fff3e0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .ip-address {
          color: #f15d2e;
          font-size: 7em;
          margin-top: 10px;
        }
        .label {
          font-size: 8em;
          color: #333;
        }
      </style>
    </head>
    <body>
      <div class="ip-container">
        <div class="label">Your IP Address is:</div>
        <div class="ip-address">${clientIp}</div>
      </div>
    </body>
    </html>
  `;

  res.send(htmlContent);
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});
