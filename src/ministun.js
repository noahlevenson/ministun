"use strict";

const dgram = require("dgram");
const { MStunMsg } = require("./mmsg.js");
const { MStunHeader } = require("./mhdr.js");
const { MStunAttr } = require("./mattr.js");

let u4server, u6server;

const mConfig = {
	port: 3478,
	ipv4: true,
	ipv6: true
};

console.log(MStunHeader.enType(MStunHeader.K_MSG_TYPE.BINDING_INDICATION));

if (mConfig.ipv4) {
	u4server = dgram.createSocket("udp4");

	u4server.on("listening", () => {
		const address = u4server.address();
		console.log(`Server (IPv4) listening on ${address.address}:${address.port}`);
	});

	u4server.on("message", (msg, rinfo) => {
		console.log(`Received msg: ${msg.toString()} from ${rinfo.address}:${rinfo.port}`);

		console.log(rinfo);
		const myMsg = MStunMsg.from(msg);
		console.log(myMsg);
	});

	u4server.bind(mConfig.port);
}

if (mConfig.ipv6) {
	u6server = dgram.createSocket("udp6");

	u6server.on("listening", () => {
		const address = u6server.address();
		console.log(`Server (IPv6) listening on ${address.address}: ${address.port}`);
	});

	u6server.on("message", (msg, rinfo) => {
		console.log(`Received msg: ${msg} from ${rinfo.address}:${rinfo.port}`);
	});

	u6server.bind(mConfig.port);
}