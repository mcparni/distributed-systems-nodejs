# Distributed Systems NodeJS

You need to have <a href="https://nodejs.org/en/">NodeJS</a> installed.

## Installation

1. Clone the repo:  
   `$ git clone https://github.com/mcparni/distributed-systems-nodejs.git`
2. Change into directory:  
   `$ cd distributed-systems-nodejs`
3. Install dependencies:  
   `$ npm install`
4. Open three terminal windows/tabs on current directory.

- Window 1: `$ node index.js 1 3000`
- Window 2: `$ node index.js 2 3001`
- Window 3: `$ node index.js 3 3002`

5. Send messages between clients. To get online/offline status of each client send message 'status'.  

## Logging
Each client logs messages to file, client_{1|2|3}.log  

## Test with random messages

Open three terminal windows/tabs on current directory.

- Window 1: `$ node index.js 1 3000`
- Window 2: `$ node index.js 2 3001`
- Window 3: `$ node index.js 3 3002 tester`

Change test configurations (payload and number of messages) in index.js file.

## Screenshots
Can be found in <a href="https://github.com/mcparni/distributed-systems-nodejs/blob/master/demo.pdf">demo.pdf</a>.
