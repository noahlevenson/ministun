"use strict";

const dgram = require("dgram");

let u4server, u6server;

const mConfig = {
	port: 3478,
	ipv4: true,
	ipv6: true
};

class MStunHeader {
	static K_HDR_LEN = 20;
	static K_MAGIC = new Buffer.from([0x21, 0x12, 0xA4, 0x42]);
	static K_MAGIC_OFF = [4, 8];
	static K_TYPE_OFF = [0, 2];
	static K_ID_OFF = [8, 20];
	static K_LEN_OFF = [2, 4];

	static K_MSG_TYPE = {
		BINDING_REQUEST: 0,     
		BINDING_INDICATION: 1,   
		BINDING_SUCCESS_RESPONSE: 2,
		BINDING_ERROR_RESPONSE: 3,
		MALFORMED: 4
	};

	static K_MSG_TYPE_TABLE = new Map([
		[new Buffer.from([0x00, 0x01]).toString("hex"), this.K_MSG_TYPE.BINDING_REQUEST],
		[new Buffer.from([0x00, 0x11]).toString("hex"), this.K_MSG_TYPE.BINDING_INDICATION],
		[new Buffer.from([0x01, 0x01]).toString("hex"), this.K_MSG_TYPE.BINDING_SUCCESS_RESPONSE],
		[new Buffer.from([0x01, 0x11]).toString("hex"), this.K_MSG_TYPE.BINDING_ERROR_RESPONSE]
	]);

	// TODO: Validation
	constructor(type, len, magic, id) {
		this.type = type;
		this.len = len;
		this.magic = magic;
		this.id = id;
	}

	static isValidMsb(buf) {
		for (let i = 0; i < 2; i += 1) {
			if (mCheckBit(buf, 0, i) !== 0) {
				return false;
			}
		}

		return true;
	}

	static isValidMagic(magic) {
		return mCompareBuf(magic, this.K_MAGIC);
	}

	static decodeType(type) {
		const dtype = this.K_MSG_TYPE_TABLE.get(type.toString('hex'));

		if (dtype !== undefined) {
			return dtype;
		}
		
		return this.K_MSG_TYPE_TABLE.MALFORMED;
	}

	static decodeLen(len) {
		return len[0];
	}
}

class MStunAttr {
	// TODO: Validation
	constructor(type, len, val) {
		this.type = type;
		this.len = len;
		this.val = val;
	}

	static K_TYPE_OFF = [0, 4]; 

	static K_ATTR_TYPE = {
		RESERVED_0000: 0,
		MAPPED_ADDRESS: 1,
		RESERVED_0002: 3,
		RESERVED_0003: 4,
		RESERVED_0004: 5,
		RESERVED_0005: 6,
		USERNAME: 7,
		RESERVED_0007: 8,
		MESSAGE_INTEGRITY: 9,
		ERROR_CODE: 10,
		UNKNOWN_ATTRIBUTES: 11,
		RESERVED_000B: 12,
		REALM: 13,
		NONCE: 14,
		XOR_MAPPED_ADDRESS: 15,
		SOFTWARE: 16,
		ALTERNATE_SERVER: 17,
		FINGERPRINT: 18,
		MALFORMED: 19
	};

	static K_ATTR_TYPE_TABLE = new Map([
		[new Buffer.from([0x00, 0x00]).toString("hex"), {type: this.K_ATTR_TYPE.RESERVED_0000, copt: false}],
		[new Buffer.from([0x00, 0x01]).toString("hex"), {type: this.K_ATTR_TYPE.MAPPED_ADDRESS, copt: false}],
		[new Buffer.from([0x00, 0x02]).toString("hex"), {type: this.K_ATTR_TYPE.RESERVED_0002, copt: false}],
		[new Buffer.from([0x00, 0x03]).toString("hex"), {type: this.K_ATTR_TYPE.RESERVED_0003, copt: false}],
		[new Buffer.from([0x00, 0x04]).toString("hex"), {type: this.K_ATTR_TYPE.RESERVED_0004, copt: false}],
		[new Buffer.from([0x00, 0x05]).toString("hex"), {type: this.K_ATTR_TYPE.RESERVED_0005, copt: false}],
		[new Buffer.from([0x00, 0x06]).toString("hex"), {type: this.K_ATTR_TYPE.USERNAME, copt: false}],
		[new Buffer.from([0x00, 0x07]).toString("hex"), {type: this.K_ATTR_TYPE.RESERVED_0007, copt: false}],
		[new Buffer.from([0x00, 0x08]).toString("hex"), {type: this.K_ATTR_TYPE.MESSAGE_INTEGRITY, copt: false}],
		[new Buffer.from([0x00, 0x09]).toString("hex"), {type: this.K_ATTR_TYPE.ERROR_CODE, copt: false}],
		[new Buffer.from([0x00, 0x0A]).toString("hex"), {type: this.K_ATTR_TYPE.UNKNOWN_ATTRIBUTES, copt: false}],
		[new Buffer.from([0x00, 0x0B]).toString("hex"), {type: this.K_ATTR_TYPE.RESERVED_000B, copt: false}],
		[new Buffer.from([0x00, 0x14]).toString("hex"), {type: this.K_ATTR_TYPE.REALM, copt: false}],
		[new Buffer.from([0x00, 0x15]).toString("hex"), {type: this.K_ATTR_TYPE.NONCE, copt: false}],
		[new Buffer.from([0x00, 0x20]).toString("hex"), {type: this.K_ATTR_TYPE.XOR_MAPPED_ADDRESS, copt: false}],
		[new Buffer.from([0x80, 0x22]).toString("hex"), {type: this.K_ATTR_TYPE.SOFTWARE, copt: true}],
		[new Buffer.from([0x80, 0x23]).toString("hex"), {type: this.K_ATTR_TYPE.ALTERNATE_SERVER, copt: true}],
		[new Buffer.from([0x80, 0x28]).toString("hex"), {type: this.K_ATTR_TYPE.FINGERPRINT, copt: true}]
	]);

	static decodeType(type) {
		const dtype = this.K_ATTR_TYPE_TABLE.get(type.toString('hex'));

		if (dtype !== undefined) {
			return dtype;
		}
		
		return this.K_MSG_TYPE_TABLE.MALFORMED;
	}
}

class MStunMsg {
	constructor() {
		this.hdr = null;
		this.attr = [];
	}

	static from(buf) {
		if (!Buffer.isBuffer(buf) || buf.length < MStunHeader.K_HDR_LEN || !MStunHeader.isValidMsb(buf)) {
			return null;
		}

		const magic = buf.slice(MStunHeader.K_MAGIC_OFF[0], MStunHeader.K_MAGIC_OFF[1]);

		if (!MStunHeader.isValidMagic(magic)) {
			return null;
		}

		const type = buf.slice(MStunHeader.K_TYPE_OFF[0], MStunHeader.K_TYPE_OFF[1]);

		if (MStunHeader.decodeType(type) === MStunHeader.K_MSG_TYPE.MALFORMED) {
			return null;
		}

		const id = buf.slice(MStunHeader.K_ID_OFF[0], MStunHeader.K_ID_OFF[1]);
		const len = buf.slice(MStunHeader.K_LEN_OFF[0], MStunHeader.K_LEN_OFF[1]);
		const dlen = MStunHeader.decodeLen(len);

		if (dlen !== MStunHeader.K_HDR_LEN - buf.length) {
			return null;
		}

		const msg = new this;
		
		if (dlen > 0) {
			// Validate attributes, create MStunAttr objects, push em into this.attr
		}

		msg.hdr = new MStunHeader(type, len, magic, id);
		return msg;
	}

	// TODO: Write me
	static serialize() {

	}
}

function mCheckBit(buffer, idx, bit) {
	let mask = Buffer.alloc(1);

	mask[0] = 0b10000000;
	mask[0] >>>= bit;

	return (buffer[idx] & mask[0]) !== 0 ? 1 : 0;
}

function mCompareBuf(a, b) {
	if (a.length !== b.length) {
		return false;
	}

	for (let i = 0; i < a.length; i += 1) {
		if (a[i] != b[i]) {
			return false;
		}
	}	

	return true;
}

if (mConfig.ipv4) {
	u4server = dgram.createSocket("udp4");

	u4server.on("listening", () => {
		const address = u4server.address();
		console.log(`Server (IPv4) listening on ${address.address}:${address.port}`);
	});

	u4server.on("message", (msg, rinfo) => {
		console.log(`Received msg: ${msg.toString()} from ${rinfo.address}:${rinfo.port}`);

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