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
const base = 'ABC'
// 1-500
const numberOfMsg = 500
// 1-1000
const payload = 10

const node1Url = 'http://localhost:3000/'
const node2Url = 'http://localhost:3001/'
const node3Url = 'http://localhost:3002/'

let START_TIME
let END_TIME
let MSG_COUNTER = 0

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const generateRandomMessages = (base, length) => {
  let messages = []
  let numerator = 0
  while (messages.length < 1000) {
    let message = ''
    numerator++
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
    messages = messages.concat(message.concat(` MSG #: ${numerator}`))
  }
  return messages
}

const randomMessages = generateRandomMessages(base, payload)

app.post('/', (req, res) => {
  MSG_COUNTER++
  console.log(req.body.msg)
  if (MSG_COUNTER === 1) {
    START_TIME = process.hrtime()
  }
  if (MSG_COUNTER === numberOfMsg) {
    logTestResult()
    process.exit()
  }
  return res.sendStatus(200)
})

const logTestResult = () => {
  END_TIME = process.hrtime()
  console.log(`                        <---- TEST RESULT ----> \n 
              Test with ${numberOfMsg} messages and payload of ${payload} took \n
              ${END_TIME[0] * 1000 +
                END_TIME[1] / 1000000 -
                START_TIME[0] * 1000 +
                START_TIME[1] / 1000000} milliseconds`)
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

if (testerClient === 'tester') {
  randomMessages.forEach(msg => {
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
