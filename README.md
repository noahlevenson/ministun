# ministun

[![Build Status](https://travis-ci.com/noahlevenson/ministun.svg?token=K7qYwxmEyNTnFvh71KfW&branch=master)](https://travis-ci.com/noahlevenson/ministun)

STUN (Session Traversal Utilities for NAT) is a simple protocol. A STUN implementation should be simple too.

ministun is a **zero dependency** STUN server for Node.js. It implements "Basic Server Behavior" as defined by [section 13](https://tools.ietf.org/html/rfc5389#section-13) of [RFC 5389](https://tools.ietf.org/html/rfc5389), including backwards compatibility with [RFC 3489](https://tools.ietf.org/html/rfc3489). 

### Requirements
Node.js >= 12.14.0

### Installation
```
npm i ministun
```

### Usage
```javascript
const Ministun = require("ministun");

const config = {
	udp4: true,
	udp6: true,
	port: 3478,
	log: console.log,
	err: console.err,
	sw: true
};

const server = new Ministun(config);

async function startServer() {
	await server.start();
}

async function stopServer() {
	await server.stop();
}
```

### Configuration
- **udp4**: *bool* (Default: `true`)<br>
Support UDP over IPv4?

- **udp6**: *bool* (Default: `true`)<br>
Support UDP over IPv6?

- **port**: *number* (Default: `3478`)<br>
Port number

- **log**: *function || null* (Default: `console.log`)<br>
Log messages will be passed to this function as arg 0, null = no message logging 

- **err**: *function || null* (Default: `console.err`)<br>
Error messages will be passed to this function as arg 0, null = no error logging 

- **sw**: *bool* (Default: `true`)<br>
Send the SOFTWARE attribute with response messages? 

### TODO
Better test coverage
