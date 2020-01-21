const assert = require("assert");
const { MStunHeader } = require("../src/mhdr.js"); 

(function _isValidMsb() {
	assert.throws(() => {
		MStunHeader._isValidMsb(0x00);
	});

	const res1 = MStunHeader._isValidMsb(Buffer.from([0x00]));
	assert.strictEqual(res1, true);

	const res2 = MStunHeader._isValidMsb(Buffer.from([0xF0]));
	assert.strictEqual(res2, false);
})();

(function _isValidMagic() {
	const res1 = MStunHeader._isValidMagic([0x21, 0x12, 0xA4, 0x42]);
	assert.strictEqual(res1, false);

	const res2 = MStunHeader._isValidMagic(Buffer.from([0x21, 0x12, 0xA4, 0x41]));
	assert.strictEqual(res2, false);

	const res3 = MStunHeader._isValidMagic(Buffer.from([0x21, 0x12, 0xA4, 0x42]));
	assert.strictEqual(res3, true);
})();

(function _decType() {
	assert.throws(() => {
		MStunHeader._decType(0x1011);
	});

	assert.throws(() => {
		MStunHeader._decType(Buffer.from([0x00]));
	});

	const res1 = MStunHeader._decType(Buffer.from([0x11, 0x11]));
	assert.strictEqual(res1.type, MStunHeader.K_MSG_TYPE.MALFORMED);

	const res2 = MStunHeader._decType(Buffer.from([0x00, 0x01]));
	assert.strictEqual(res2.type, MStunHeader.K_MSG_TYPE.BINDING_REQUEST);
})();

(function _decLen() {
	assert.throws(() => {
		MStunHeader._decLen(0x10);
	});

	assert.throws(() => {
		MStunHeader._decLen(Buffer.from([0x04]));
	});

	const res1 = MStunHeader._decLen(Buffer.from([0x00, 0x10]));
	assert.strictEqual(res1, 16);
})();

(function _enType() {
	assert.throws(() => {
		MStunHeader._enType(Buffer.from([0x01, 0x01]));
	});

	assert.throws(() => {
		MStunHeader._enType("2");
	});

	assert.throws(() => {
		MStunHeader._enType(4);
	});

	const res1 = MStunHeader._enType(2);
	assert.strictEqual(res1.length, 2);
	assert.strictEqual(res1[0], 0x01);
	assert.strictEqual(res1[1], 0x01);
})();

(function _enLen() {
	assert.throws(() => {
		MStunHeader._enLen(Buffer.from([0x00, 0x20]));
	});

	assert.throws(() => {
		MStunHeader._enLen("32");
	});

	const res1 = MStunHeader._enLen(32);
	assert.strictEqual(res1.length, 2);
	assert.strictEqual(res1[0], 0x00);
	assert.strictEqual(res1[1], 0x20);
})();