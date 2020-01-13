"use strict";

const dgram = require("dgram");
const { MStunMsg } = require("./mmsg.js");
const { MStunHeader } = require("./mhdr.js");
const { MStunAttr } = require("./mattr.js");

class Ministun {
	constructor({port = 3478, udp4 = true, udp6 = true, log = console.log, err = console.error} = {}) {
		if (!port || (!udp4 && !udp6)) {
			return null;
		}

		this.udp4 = udp4;
		this.udp6 = udp6;
		this.port = port;
		this.log = log;
		this.err = err;
		this.socket = null;
	}

	start() {
		if (this.udp4 && this.udp6) {
			this.socket = dgram.createSocket("udp6");
		} else if (this.udp4) {
			this.socket = dgram.createSocket("udp4");
		} else {
			this.socket = dgram.createSocket({type: "udp6", ipv6Only: true});
		}

		this.socket.on("listening", () => {
			const addr = this.socket.address();
			this.lout(`Listening for STUN clients on ${addr.address}:${addr.port}\n`);
		});

		this.socket.on("message", this.onMessage.bind(this));
		this.socket.bind(this.port);
		this.lout(`ministun starting...\n`);
	}

	stop() {
		this.socket.on("close", () => {
			this.lout(`ministun stopped\n`);
		});

		this.socket.close();
	}

	lout(msg) {
		if (this.log === null) {
			return;
		}

		this.log(`[${new Date().toISOString()}] ${msg}`);
	}

	lerr(msg) {
		if (this.err === null) {
			return;
		}

		this.err(`[${new Date().toISOString()}] ${msg}`);
	}

	onMessage(msg, rinfo) {
		const inMsg = MStunMsg.from(msg);

		if (inMsg === null) {
			return;
		}

		// For compliance with RFCs 5389 and 3489, we return an error response for any unknown comprehension required attrs
		const badAttrTypes = [];

		inMsg.attrs.forEach((attr) => {
			if (MStunAttr.decType(attr.type).type === MStunAttr.K_ATTR_TYPE.MALFORMED && MStunAttr.isCompReq(attr.type)) {
				badAttrTypes.push(attr.type);
			}
		});

		if (badAttrTypes.length > 0) {
			const attrs = [
				new MStunAttr(MStunAttr.K_ATTR_TYPE.ERROR_CODE, [420]),
				new MStunAttr(MStunAttr.K_ATTR_TYPE.UNKNOWN_ATTRIBUTES, [badAttrTypes])
			];

			const outHdr = new MStunHeader(MStunHeader.K_MSG_TYPE.BINDING_ERROR_RESPONSE, MStunMsg.attrByteLength(attrs), inMsg.hdr.id);
			const outMsg = new MStunMsg({
				hdr: outHdr, 
				attrs: attrs
			});

			this.send(outMsg, rinfo);
		}

		if (MStunHeader.decType(inMsg.hdr.type).type === MStunHeader.K_MSG_TYPE.BINDING_REQUEST) {
			this.lout(`Binding request received from ${rinfo.address}:${rinfo.port}\n`);

			const mtype = !inMsg.rfc3489 ? MStunAttr.K_ATTR_TYPE.XOR_MAPPED_ADDRESS : MStunAttr.K_ATTR_TYPE.MAPPED_ADDRESS;

			const attrs = [
				new MStunAttr(mtype, [MStunAttr.K_ADDR_FAMILY[rinfo.family], rinfo.address, rinfo.port, inMsg.hdr.id]),
				new MStunAttr(MStunAttr.K_ATTR_TYPE.SOFTWARE)
			];

			const outHdr = new MStunHeader(MStunHeader.K_MSG_TYPE.BINDING_SUCCESS_RESPONSE, MStunMsg.attrByteLength(attrs), inMsg.hdr.id);
			const outMsg = new MStunMsg({
				hdr: outHdr, 
				attrs: attrs
			});

			this.send(outMsg, rinfo);
		}
	}

	send(stunMsgObj, rinfo) {
		this.socket.send(stunMsgObj.serialize(), rinfo.port, rinfo.address, (err) => {
			if (err) {
				this.lerr(`Socket send error (${rinfo.address}:${rinfo.port}): ${err}\n`);
			 	return;
			}

			// TODO: Interpret the message type from the stunMsgObj and log a useful message about successfully sending it
		});
	}
}

const server = new Ministun();
server.start();