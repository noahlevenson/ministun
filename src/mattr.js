const MTypeData = require("./mcontainer.js").MTypeData;

class MStunAttr {
	// TODO: Validation
	constructor(type, len, val) {
		this.type = type;
		this.len = len;
		this.val = val;
	}

	static K_TYPE_OFF = [0, 2]; 
	static K_LEN_OFF = [2, 4];

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
		[new Buffer.from([0x00, 0x00]).toString("hex"), new MTypeData(this.K_ATTR_TYPE.RESERVED_0000, false, new Buffer.from([0x00, 0x00]))],
		[new Buffer.from([0x00, 0x01]).toString("hex"), new MTypeData(this.K_ATTR_TYPE.MAPPED_ADDRESS, false, new Buffer.from([0x00, 0x01]))],
		[new Buffer.from([0x00, 0x02]).toString("hex"), new MTypeData(this.K_ATTR_TYPE.RESERVED_0002, false, new Buffer.from([0x00, 0x02]))],
		[new Buffer.from([0x00, 0x03]).toString("hex"), new MTypeData(this.K_ATTR_TYPE.RESERVED_0003, false, new Buffer.from([0x00, 0x03]))],
		[new Buffer.from([0x00, 0x04]).toString("hex"), new MTypeData(this.K_ATTR_TYPE.RESERVED_0004, false, new Buffer.from([0x00, 0x04]))],
		[new Buffer.from([0x00, 0x05]).toString("hex"), new MTypeData(this.K_ATTR_TYPE.RESERVED_0005, false, new Buffer.from([0x00, 0x05]))],
		[new Buffer.from([0x00, 0x06]).toString("hex"), new MTypeData(this.K_ATTR_TYPE.USERNAME, false, new Buffer.from([0x00, 0x06]))],
		[new Buffer.from([0x00, 0x07]).toString("hex"), new MTypeData(this.K_ATTR_TYPE.RESERVED_0007, false, new Buffer.from([0x00, 0x07]))],
		[new Buffer.from([0x00, 0x08]).toString("hex"), new MTypeData(this.K_ATTR_TYPE.MESSAGE_INTEGRITY, false, new Buffer.from([0x00, 0x08]))],
		[new Buffer.from([0x00, 0x09]).toString("hex"), new MTypeData(this.K_ATTR_TYPE.ERROR_CODE, false, new Buffer.from([0x00, 0x09]))],
		[new Buffer.from([0x00, 0x0A]).toString("hex"), new MTypeData(this.K_ATTR_TYPE.UNKNOWN_ATTRIBUTES, false, new Buffer.from([0x00, 0x0A]))],
		[new Buffer.from([0x00, 0x0B]).toString("hex"), new MTypeData(this.K_ATTR_TYPE.RESERVED_000B, false, new Buffer.from([0x00, 0x0B]))],
		[new Buffer.from([0x00, 0x14]).toString("hex"), new MTypeData(this.K_ATTR_TYPE.REALM, false, new Buffer.from([0x00, 0x14]))],
		[new Buffer.from([0x00, 0x15]).toString("hex"), new MTypeData(this.K_ATTR_TYPE.NONCE, false, new Buffer.from([0x00, 0x15]))],
		[new Buffer.from([0x00, 0x20]).toString("hex"), new MTypeData(this.K_ATTR_TYPE.XOR_MAPPED_ADDRESS, false, new Buffer.from([0x00, 0x20]))],
		[new Buffer.from([0x80, 0x22]).toString("hex"), new MTypeData(this.K_ATTR_TYPE.SOFTWARE, true, new Buffer.from([0x80, 0x22]))],
		[new Buffer.from([0x80, 0x23]).toString("hex"), new MTypeData(this.K_ATTR_TYPE.ALTERNATE_SERVER, true, new Buffer.from([0x80, 0x23]))],
		[new Buffer.from([0x80, 0x28]).toString("hex"), new MTypeData(this.K_ATTR_TYPE.FINGERPRINT, true, new Buffer.from([0x80, 0x28]))]
	]);

	static K_ADDR_FAMILY = {
		IPv4: 0,
		IPv6: 1
	};

	static K_ADDR_FAMILY_TABLE = new Map([
		[new Buffer.from([0x01]).toString("hex"), {fam: this.K_ADDR_FAMILY.IPv4, size: 4}],
		[new Buffer.from([0x02]).toString("hex"), {fam: this.K_ADDR_FAMILY.IPv6, size: 16}]
	]);

	static decType(type) {
		const dtype = this.K_ATTR_TYPE_TABLE.get(type.toString("hex"));

		if (dtype !== undefined) {
			return dtype;
		}
		
		return {type: this.K_ATTR_TYPE.MALFORMED, copt: null, buf: null};
	}

	static decLen(len) {
		const buf = Uint8Array.from(len);
		const view = new Uint16Array(buf.buffer);
		return view[0];
	}

	static enType(type) {

	}

	static enLen(len) {
		return mInt2Buf16(len); 
	}

	static enMappedAddr(fam, addr, port) {

	}
}

module.exports.MStunAttr = MStunAttr;