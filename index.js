const express = require('express')
const app = express()
const axios = require('axios')
const bodyParser = require('body-parser')
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
const args = process.argv.slice(2)
const client = args[0]
const port = args[1]
//Open two clients without and one with this argument set 'true'
const testerClient = args[2]

// Test messages configurations
const base = 'WHAT A COOL COURSE THIS IS'
const numberOfMsg = 50
const payload = 10

const node1Url = 'http://localhost:3000/'
const node2Url = 'http://localhost:3001/'
const node3Url = 'http://localhost:3002/'

let START_TIME
let END_TIME

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/', (req, res) => {
  console.log(req.body.msg)
  if (req.body.msg.includes('START')) {
    START_TIME = process.hrtime()
  }
  if (req.body.msg.includes('END')) {
    logTestResult()
  }
  return res.sendStatus(200)
})

const logTestResult = () => {
  END_TIME = process.hrtime()
  console.log(`<---- TEST RESULT ----> \n 
              Test for ${numberOfMsg} messages with payload of ${payload} took \n
              ${END_TIME[0] * 1000 +
                END_TIME[1] / 1000000 -
                START_TIME[0] * 1000 +
                START_TIME[1] / 1000000} millisecond`)
}

postToNode1 = msg => {
  return axios.post(
    node1Url,
    { msg: msg },
    { 'X-Requested-With': 'XMLHttpRequest' }
  )
}

postToNode2 = msg => {
  return axios.post(
    node2Url,
    { msg: msg },
    { 'X-Requested-With': 'XMLHttpRequest' }
  )
}

postToNode3 = msg => {
  return axios.post(
    node3Url,
    { msg: msg },
    { 'X-Requested-With': 'XMLHttpRequest' }
  )
}

const send = msg => {
  axios
    .all([postToNode1(msg), postToNode2(msg), postToNode3(msg)])
    .then(responseArr => {
      //this will be executed only when all requests are complete
      // console.log(': ', responseArr[0]);
      // console.log(': ', responseArr[1]);
      // console.log(': ', responseArr[2]);
    })
    .catch(error => {
      //console.error(error);
    })
}

const generateRandomMessages = (base, length, numberOfMsg) => {
  let messages = ['START']
  console.log('MESSAGE nro 1 --->', messages[0])
  while (messages.length < numberOfMsg) {
    let message = ''
    for (let i = 0; i < length; i++) {
      message = message.concat(
        base
          .split('')
          .sort(() => {
            return 0.5 - Math.random()
          })
          .join('')
      )
    }
    messages = messages.concat(message)
  }
  return messages.concat('END')
}

if (testerClient === 'true') {
  const randomMessage = generateRandomMessages(base, payload, numberOfMsg)
  randomMessage.forEach(msg => {
    send(`from client ${client} :${msg}`)
  })
} else {
  rl.on('line', function(msg) {
    if (msg.toLowerCase() === 'quit') {
      process.exit(0)
    } else {
      send(`from client ${client} :${msg}`)
    }
  })
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
  //prompt();
})
