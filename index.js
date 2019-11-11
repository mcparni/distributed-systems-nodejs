const express = require('express')
const app = express();
const axios = require('axios');
const bodyParser  = require('body-parser');
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const args = process.argv.slice(2);
const client = args[0];
const port = args[1];

const node1Url = "http://localhost:3000/";
const node2Url = "http://localhost:3001/";
const node3Url = "http://localhost:3002/";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/', (req, res) => {  
  console.log(req.body.msg);
  //res.send(req.body.msg);
  return res.sendStatus(200);
})

postToNode1 = (msg) => {
  return axios.post(node1Url, { msg: msg },{'X-Requested-With': 'XMLHttpRequest'}); 
}

postToNode2 = (msg) => {
  return axios.post(node2Url, { msg: msg },{'X-Requested-With': 'XMLHttpRequest'}); 
}

postToNode3 = (msg) => {
  return axios.post(node3Url, { msg: msg },{'X-Requested-With': 'XMLHttpRequest'}); 
}

const send = (msg) => {
  axios.all([postToNode1(msg), postToNode2(msg), postToNode3(msg)])
  .then(responseArr => {
    //this will be executed only when all requests are complete
   // console.log(': ', responseArr[0]);
   // console.log(': ', responseArr[1]);
   // console.log(': ', responseArr[2]);
  })
  .catch((error) => {
    //console.error(error);
  })
}



rl.on('line', function (msg) {
  if(msg.toLowerCase() === "quit") {
    console.log('Exit');
    process.exit(0);
  } else {
      send(`from client ${client} :${msg}`);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
  //prompt();
})
