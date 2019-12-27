const { MTypeData } = require("./mcontainer.js");
const { mInt2Buf16, mGetBit, mCompareBuf} = require("./mutil.js");

class MStunAttr {
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
		[new Buffer.from([0x00, 0x01]).toString("hex"), new MTypeData(this.K_ATTR_TYPE.MAPPED_ADDRESS, false, new Buffer.from([0x00, 0x01]), this.enMappedAddr)],
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
		IPv6: 1,
		MALFORMED: 2
	};

	static K_ADDR_FAMILY_TABLE = new Map([
		[new Buffer.from([0x01]).toString("hex"), new MTypeData(this.K_ADDR_FAMILY.IPv4, 4, new Buffer.from([0x01]))],
		[new Buffer.from([0x02]).toString("hex"), new MTypeData(this.K_ADDR_FAMILY.IPv6, 16, new Buffer.from([0x02]))]
	]);

	// TODO: Validation
	constructor(type = null, args = []) {
		if (type === null) {
			this.type = null;
			this.args = [];
			return;
		}

		this.type = MStunAttr.enType(type);
		this.val = Array.from(MStunAttr.K_ATTR_TYPE_TABLE.values())[type].f(...args);
		this.len = MStunAttr.enLen(this.val.length);
	}

	static decType(type) {
		const dtype = this.K_ATTR_TYPE_TABLE.get(type.toString("hex"));

		if (dtype !== undefined) {
			return dtype;
		}
		
		return new MTypeData(this.K_ATTR_TYPE.MALFORMED);
	}

	// TODO: Validate input
	static decLen(len) {
		const buf = Uint8Array.from(len);
		buf.reverse();

		const view = new Uint16Array(buf.buffer);
		return view[0];
	}

	static decFam(fam) {
		const dfam = this.K_ADDR_FAMILY_TABLE.get(fam.toString("hex"));

		if (dfam !== undefined) {
			return dfam;
		}

		return new MTypeData(this.K_ADDR_FAMILY.MALFORMED);
	}

	// TODO: Validate input
	static enType(type) {
		const tdata = Array.from(this.K_ATTR_TYPE_TABLE.values())[type];
		return tdata.bin;
	}

	// TODO: Validate input
	static enLen(len) {
		return mInt2Buf16(len); 
	}

	// TODO: Validate input
	static enFam(fam) {
		const tdata = Array.from(this.K_ADDR_FAMILY_TABLE.values())[fam];
		return tdata.bin;
	}

	// TODO: Validate input
	static enMappedAddr(famType, addrStr, portInt) {
		const famData = Array.from(MStunAttr.K_ADDR_FAMILY_TABLE.values())[famType];

		const zero = Buffer.alloc(1);
		const fam = MStunAttr.enFam(famType);
		const port = mInt2Buf16(portInt);
		let addr;

		if (famType === MStunAttr.K_ADDR_FAMILY.IPv4) {
			addr = Buffer.from(addrStr.split(".").map((n) => {
				return parseInt(n);
			}));
		} else if (famType === MStunAttr.K_ADDR_FAMILY.IPv6) {
			// TODO: Handle this case
		}

		return Buffer.concat([zero, fam, port, addr]);
	}

	length() {
		return (this.type.length + this.len.length + this.val.length);
	}

	serialize() {
		return Buffer.concat([this.type, this.len, this.val]);
	}
}

module.exports.MStunAttr = MStunAttr;