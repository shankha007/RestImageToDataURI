const express = require('express');
const app = express();
const port = 3000;
const nodeHtmlToImage = require('./node_to_html.js');

async function node2html(handle,message,font){
return nodeHtmlToImage({
  output: './output.jpeg',
  type: 'jpeg',
  puppeteerArgs: {},
  html: `<!DOCTYPE html>
  <html lang="en" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title>Message Container</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css">
      <style>
      body {
        height: 800px;
        width: 800px;
      }

      #message-snapshot-snippet {
        position: relative;
      }
      #icon {
        position: absolute;
        margin-left: 400px;
        margin-top: 130px;
      }
      
      #message-text {
        top: 50%;
        left:50%;
        color: #fff;
        transform: translate(-50%, -50%);
        width: 500px;
        font-family: 'Verdana',Helvetica, sans-serif;
        font-size: {{fontSize}}em;
        text-align: center;
        position: absolute;
      }
      
      #message-snapshot-profile-url {
        font-family: 'Verdana',Helvetica, sans-serif;
        text-align: center;
        bottom:140px;
        left: 50%;
        color: #fff;
        transform: translateX(-50%);
        position: absolute;
      }
      </style>
    </head>
    <body>
      <div id="message-snapshot-snippet" style="width: 800px; height: 800px; word-wrap: break-word;">
        <i class="cuttlefish big icon" id="icon"></i>
        <svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" id="logo">
          <g transform="translate(300,300)">
            <path
              d="M162.9,-189.9C207,-157,236,-101.9,242.2,-45.8C248.5,10.4,232.1,67.4,202,113.9C171.9,160.4,128.2,196.2,77.6,215.7C27,235.2,-30.4,238.4,-87.2,224.4C-144,210.3,-200.2,179.2,-227.4,131.5C-254.6,83.9,-252.9,19.8,-238.6,-38.8C-224.4,-97.4,-197.7,-150.6,-155.8,-183.9C-114,-217.2,-57,-230.6,1.2,-232C59.4,-233.4,118.7,-222.8,162.9,-189.9Z"
              fill="#0695f5" />
          </g>
        </svg>
          <div id="message-text">
            <p id="message-snapshot-text">{{messageText}}</p>
          </div>
          <br>
          <p id="message-snapshot-profile-url">https://curiousmsg.com/{{handleName}}</p>
      </div>
    </body>
  </html>`,
  content: {handleName: handle, messageText: message, fontSize: font}
})
}

function textToFont(len) {
  var dynamicTextSizing=3.5;
  if(len>=36 && len<=90)
      dynamicTextSizing=3;
  else if(len>=91 && len<=240)
      dynamicTextSizing=2;
  else if(len>240)
      dynamicTextSizing=1.6;
  return dynamicTextSizing;
}

app.get('/',  async (req, res) => {
  var handle = req.query.handle;
  var message = req.query.message;
  var font = textToFont(message.length);
  var imageInMemory = await node2html(handle,message,font).then();
  const base64Image = new Buffer.from(imageInMemory).toString('base64');
  const dataURI = 'data:image/jpeg;base64,' + base64Image;
  res.send(dataURI);
});
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
