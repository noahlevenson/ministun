"use strict";

const assert = require("assert");
const { MStunAttr } = require("../src/mattr.js"); 
const { MStunMsg } = require("../src/mmsg.js"); 

(function from() {
	// Binding request
	const res1 = MStunMsg.from(Buffer.from([0x00, 0x01, 0x00, 0x00, 0x21, 0x12, 0xA4, 0x42, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B]));
	assert.strictEqual(res1 === null, false);
	assert.strictEqual(typeof res1, "object");
	assert.strictEqual(res1.hdr === null, false);
	assert.strictEqual(typeof res1, "object");
	assert.strictEqual(Array.isArray(res1.attrs), true);
	assert.strictEqual(res1.attrs.length, 0);

	assert.strictEqual(Buffer.isBuffer(res1.hdr.type), true);
	assert.strictEqual(res1.hdr.type.length, 2);
	assert.strictEqual(res1.hdr.type[0], 0x00);
	assert.strictEqual(res1.hdr.type[1], 0x01);

	assert.strictEqual(Buffer.isBuffer(res1.hdr.len), true);
	assert.strictEqual(res1.hdr.len.length, 2);
	assert.strictEqual(res1.hdr.len[0], 0x00);
	assert.strictEqual(res1.hdr.len[1], 0x00);

	assert.strictEqual(Buffer.isBuffer(res1.hdr.magic), true);
	assert.strictEqual(res1.hdr.magic.length, 4);
	assert.strictEqual(res1.hdr.magic[0], 0x21);
	assert.strictEqual(res1.hdr.magic[1], 0x12);
	assert.strictEqual(res1.hdr.magic[2], 0xA4);
	assert.strictEqual(res1.hdr.magic[3], 0x42);

	assert.strictEqual(Buffer.isBuffer(res1.hdr.id), true);
	assert.strictEqual(res1.hdr.id.length, 12);

	for (let i = 0; i < res1.hdr.id.length; i += 1) {
		assert.strictEqual(res1.hdr.id[i], i);
	}

	// Buffer of bad data
	const res2 = MStunMsg.from(Buffer.from([0x00, 0x01, 0x00, 0x0A, 0x21, 0x12, 0xA4, 0x42, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B]));
	assert.strictEqual(res2 === null, true);

	// Non-buffer
	const res3 = MStunMsg.from("Sup dog it's me a STUN message");
	assert.strictEqual(res3 === null, true);

	// TODO: Binding request with attrs

	// TODO: RFC 3489 compliance
})();

(function _attrByteLength() {
	const attrs = [
		new MStunAttr({type: MStunAttr.K_ATTR_TYPE.SOFTWARE}),
		new MStunAttr({type: MStunAttr.K_ATTR_TYPE.UNKNOWN_ATTRIBUTES, args: [[Buffer.from([0xDE, 0xAD]), Buffer.from([0x69, 0x69])]]})
	];

	const res1 = MStunMsg._attrByteLength(attrs);
	assert.strictEqual(res1, 40);
})();