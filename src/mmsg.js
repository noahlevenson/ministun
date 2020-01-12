const { MStunHeader } = require("./mhdr.js");

class MStunMsg {
	constructor({hdr = null, attrs = [], rfc3489 = false} = {}) {
		this.hdr = hdr;
		this.attrs = attrs;
		this.rfc3489 = rfc3489;
	}

	static from(buf) {
		if (!Buffer.isBuffer(buf) || buf.length < MStunHeader.K_HDR_LEN || !MStunHeader.isValidMsb(buf)) {
			return null;
		}

		const type = buf.slice(MStunHeader.K_TYPE_OFF[0], MStunHeader.K_TYPE_OFF[1]);

		if (MStunHeader.decType(type) === MStunHeader.K_MSG_TYPE.MALFORMED) {
			return null;
		}

		const id = buf.slice(MStunHeader.K_ID_OFF[0], MStunHeader.K_ID_OFF[1]);
		const len = buf.slice(MStunHeader.K_LEN_OFF[0], MStunHeader.K_LEN_OFF[1]);
		const msglen = MStunHeader.decLen(len);
		const attrslen = buf.length - MStunHeader.K_HDR_LEN;

		if (msglen !== attrslen) {
			return null;
		}

		const attrs = [];

		// Messages may possess unknown attributes, so we won't validate
		if (msglen > 0) {
			let attrptr = MStunHeader.K_HDR_LEN;

			while (attrptr < attrslen) {
				const atype = buf.slice(attrptr + MStunAttr.K_TYPE_OFF[0], attrptr + MStunAttr.K_TYPE_OFF[1]);
				const alen = buf.slice(attrptr + MStunAttr.K_LEN_OFF[0], MStunAttr.K_LEN_OFF[1]);
				const alendec = MStunAttr.decLen(alen);
				const aval = buf.slice(attrptr + MStunAttr.K_LEN_OFF[1], attrptr + alendec);
				
				attrs.push(MStunAttr.from(atype, alen, aval));
				attrptr += alendec
			}
		}

		const magic = buf.slice(MStunHeader.K_MAGIC_OFF[0], MStunHeader.K_MAGIC_OFF[1]);
		
		const msg = new this({
			hdr: MStunHeader.from(type, len, id, magic),
			attrs: attrs,
			rfc3489: !MStunHeader.isValidMagic(magic)
		});
		
		return msg;
	}

	static attrByteLength(attrs) {
		return attrs.reduce((sum, attr) => {
			return sum + attr.length();
		}, 0);
	}

	serialize() {
		return Buffer.concat([this.hdr.serialize(), Buffer.concat(this.attrs.map((attr) => { 
			return attr.serialize(); 
		}))]);
	}
}

module.exports.MStunMsg = MStunMsg;