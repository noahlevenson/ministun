const { MStunHeader } = require("./mhdr.js");

class MStunMsg {
	constructor(hdr = null, attrs = []) {
		this.hdr = hdr;
		this.attr = attrs;
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

		if (MStunHeader.decType(type) === MStunHeader.K_MSG_TYPE.MALFORMED) {
			return null;
		}

		const id = buf.slice(MStunHeader.K_ID_OFF[0], MStunHeader.K_ID_OFF[1]);
		const len = buf.slice(MStunHeader.K_LEN_OFF[0], MStunHeader.K_LEN_OFF[1]);
		const dlen = MStunHeader.decLen(len);

		if (dlen !== buf.length - MStunHeader.K_HDR_LEN) {
			return null;
		}

		const msg = new this;
		
		if (dlen > 0) {
			// Validate attributes, create MStunAttr objects, push em into this.attr
		}

		msg.hdr = MStunHeader.from(type, len, id, magic);
		return msg;
	}

	static attrByteLength(attrs) {
		return attrs.reduce((sum, attr) => {
			return sum + attr.length();
		}, 0);
	}

	serialize() {
		return Buffer.concat([this.hdr.serialize(), Buffer.concat(this.attr.map((attr) => { return attr.serialize(); }))]);
	}
}

module.exports.MStunMsg = MStunMsg;