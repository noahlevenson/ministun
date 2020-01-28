# ministun

[![Build Status](https://travis-ci.com/noahlevenson/ministun.svg?token=K7qYwxmEyNTnFvh71KfW&branch=master)](https://travis-ci.com/noahlevenson/ministun)

STUN is a simple protocol. A STUN implementation should be simple too.

ministun is a **zero dependency** STUN server. It implements "Basic Server Behavior"<sup>1</sup> as defined by [section 13](https://tools.ietf.org/html/rfc5389#section-13) of [RFC 5389](https://tools.ietf.org/html/rfc5389), including backwards compatibility with [RFC 3489](https://tools.ietf.org/html/rfc3489). 

Developed with WebRTC p2p in mind, it was designed as a way to easily add STUN services to distributed hash table bootstrap nodes.

ministun is deployed as a standalone public STUN server here: *stun.noahlevenson.com:3478*

In the future, ministun could evolve to provide a more robust implementation of [RFC 5389](https://tools.ietf.org/html/rfc5389), including client functions.

<sup>1</sup> Since ministun is focused on STUN services for WebRTC, it currently lacks support for STUN over TCP. (Browsers [seem to](https://groups.google.com/forum/#!topic/discuss-webrtc/IIrakQPaSw0) implement their STUN clients for WebRTC over UDP only).

### Installation
```
npm i ministun
```

### Usage
```javascript
const Ministun = require("ministun");

const config = {
	udp4: true,
	upd6: true
	port: 3478,
	log: null,
	err: null,
	sw: true
}

const server = new Ministun(config);

async function startServer() {
	await server.start();
}

async function stopServer() {
	await server.stop();
}
```