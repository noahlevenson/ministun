const { MUtil } = require("./mutil.js"); 
const { MTypeData } = require("./mcontainer.js");

class MStunHeader {
	static K_HDR_LEN = 20;
	static K_ID_LEN = 12;
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
		[new Buffer.from([0x00, 0x01]).toString("hex"), new MTypeData(this.K_MSG_TYPE.BINDING_REQUEST, new Buffer.from([0x00, 0x01]))],
		[new Buffer.from([0x00, 0x11]).toString("hex"), new MTypeData(this.K_MSG_TYPE.BINDING_INDICATION, new Buffer.from([0x00, 0x11]))],
		[new Buffer.from([0x01, 0x01]).toString("hex"), new MTypeData(this.K_MSG_TYPE.BINDING_SUCCESS_RESPONSE, new Buffer.from([0x01, 0x01]))],
		[new Buffer.from([0x01, 0x11]).toString("hex"), new MTypeData(this.K_MSG_TYPE.BINDING_ERROR_RESPONSE, new Buffer.from([0x01, 0x11]))]
	]);

	// TODO: Validation
	constructor({type = null, len = null, id = null, magic = MStunHeader.K_MAGIC} = {}) {
		this.type = type ? MStunHeader.enType(type) : type;
		this.len = len ? MStunHeader.enLen(len) : len;
		this.magic = Buffer.from(magic);
		this.id = id ? Buffer.from(id) : id;
	}

	// TODO: Validation
	static from({type = null, len = null, id = null, magic = MStunHeader.K_MAGIC} = {}) {
		const hdr = new this;

		hdr.type = type;
		hdr.len = len;
		hdr.magic = magic;
		hdr.id = id;
	
		return hdr;
	}

	static isValidMsb(buf) {
		if (MUtil.getBit(buf, 0, 6) !== 0 || MUtil.getBit(buf, 0, 7) !== 0) {
			return false;
		}

		return true;
	}

	static isValidMagic(magic) {
		return MUtil.compareBuf(magic, this.K_MAGIC);
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
		buf.reverse();
		
		const view = new Uint16Array(buf.buffer);
		return view[0];
	}

	// TODO: Validate input
	static enType(type) {
		const tdata = Array.from(this.K_MSG_TYPE_TABLE.values())[type];
		return tdata.bin;
	}

	static enLen(len) {
		return MUtil.int2Buf16(len); 
	}

	serialize() {
		return Buffer.concat([this.type, this.len, this.magic, this.id]);
	}
}

module.exports.MStunHeader = MStunHeader;