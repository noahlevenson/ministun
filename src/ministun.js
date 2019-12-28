"use strict";

const dgram = require("dgram");
const { MStunMsg } = require("./mmsg.js");
const { MStunHeader } = require("./mhdr.js");
const { MStunAttr } = require("./mattr.js");

const { mInt2Buf16 } = require("./mutil.js"); 

let u4server, u6server;

const mConfig = {
	port: 3478,
	ipv4: true,
	ipv6: false // ipv6 handles ipv4 traffic as well
};

if (mConfig.ipv4) {
	u4server = dgram.createSocket("udp4");

	u4server.on("listening", () => {
		const address = u4server.address();
		console.log(`Server (IPv4) listening on ${address.address}:${address.port}`);
	});

	u4server.on("message", (msg, rinfo) => {
		console.log(`Received msg: ${msg.toString()} from ${rinfo.address}:${rinfo.port}`);

		const stunMsg = MStunMsg.from(msg);

		// Create a new stun message to send back
		const attrs = [new MStunAttr(MStunAttr.K_ATTR_TYPE.MAPPED_ADDRESS, [MStunAttr.K_ADDR_FAMILY[rinfo.family], rinfo.address, rinfo.port])];

		const myHdr = new MStunHeader(MStunHeader.K_MSG_TYPE.BINDING_SUCCESS_RESPONSE, MStunMsg.attrByteLength(attrs), stunMsg.hdr.id);
		
		const returnMsg = new MStunMsg(myHdr, attrs);

		u4server.send(returnMsg.serialize(), rinfo.port, rinfo.address, (err) => {
		 	console.log(`sent: ${rinfo.address} ${rinfo.port}`)
		});
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
