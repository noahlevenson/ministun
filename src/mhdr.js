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
			if (mGetBit(buf, 0, i) !== 0) {
				return false;
			}
		}

		return true;
	}

	static isValidMagic(magic) {
		return mCompareBuf(magic, this.K_MAGIC);
	}

	static decType(type) {
		const dtype = this.K_MSG_TYPE_TABLE.get(type.toString("hex"));

		if (dtype !== undefined) {
			return dtype;
		}
		
		return this.K_MSG_TYPE.MALFORMED;
	}

	static decLen(len) {
		const buf = Uint8Array.from(len);
		const view = new Uint16Array(buf.buffer);
		return view[0];
	}

	static enLen(len) {
		return mInt2Buf16(len); 
	}
}

module.exports.MStunHeader = MStunHeader;