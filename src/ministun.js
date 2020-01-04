"use strict";

const dgram = require("dgram");
const { MStunMsg } = require("./mmsg.js");
const { MStunHeader } = require("./mhdr.js");
const { MStunAttr } = require("./mattr.js");

class Ministun {
	// TODO: Make args do something
	constructor(addr = null, port = 3478, ipv4 = true, ipv6 = false, log = console.log) {
		this.u4server = null;
		this.u6server = null;
	}

	start() {
		const mConfig = {
			port: 3478,
			ipv4: true,
			ipv6: false // ipv6 handles ipv4 traffic as well
		};

		if (mConfig.ipv4) {
			this.u4server = dgram.createSocket("udp4");

			this.u4server.on("listening", () => {
				const address = this.u4server.address();
				console.log(`Server (IPv4) listening on ${address.address}:${address.port}`);
			});

			this.u4server.on("message", this.onMessage);

			this.u4server.bind(mConfig.port);
		}

		if (mConfig.ipv6) {
			this.u6server = dgram.createSocket("udp6");

			this.u6server.on("listening", () => {
				const address = this.u6server.address();
				console.log(`Server (IPv6) listening on ${address.address}: ${address.port}`);
			});

			this.u6server.on("message", (msg, rinfo) => {
				console.log(`Received msg: ${msg} from ${rinfo.address}:${rinfo.port}`);
			});

			this.u6server.bind(mConfig.port);
		}
	}

	stop() {

	}

	onMessage(msg, rinfo) {
		console.log(`Received msg: ${msg.toString()} from ${rinfo.address}:${rinfo.port}`);

		const stunMsg = MStunMsg.from(msg);

		// Create a new stun message to send back
		const attrs = [
			new MStunAttr(MStunAttr.K_ATTR_TYPE.XOR_MAPPED_ADDRESS, [MStunAttr.K_ADDR_FAMILY[rinfo.family], rinfo.address, rinfo.port]),
			new MStunAttr(MStunAttr.K_ATTR_TYPE.SOFTWARE)
		];

		const myHdr = new MStunHeader(MStunHeader.K_MSG_TYPE.BINDING_SUCCESS_RESPONSE, MStunMsg.attrByteLength(attrs), stunMsg.hdr.id);
		const returnMsg = new MStunMsg(myHdr, attrs);

		this.send(returnMsg.serialize(), rinfo.port, rinfo.address, (err) => {
		 	console.log(`sent: ${rinfo.address} ${rinfo.port}`)
		});
	}
}

const server = new Ministun();
server.start();
