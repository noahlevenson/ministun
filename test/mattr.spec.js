const assert = require("assert");
const { MStunAttr } = require("../src/mattr.js"); 

(function _isCompReq() {
	assert.throws(() => {
		MStunAttr._isCompReq(0x80)
	});

	assert.throws(() => {
		MStunAttr._isCompReq(Buffer.from([0x80]));
	});

	const res1 = MStunAttr._isCompReq(Buffer.from([0x00, 0x00]));
	assert.strictEqual(res1, false);

	const res2 = MStunAttr._isCompReq(Buffer.from([0x80, 0x00]));
	assert.strictEqual(res2, true);
})();

(function _decType() {
	assert.throws(() => {
		MStunAttr._decType(0x0001);
	});

	assert.throws(() => {
		MStunAttr._decType(Buffer.from([0x80]));
	});

	const res1 = MStunAttr._decType(Buffer.from([0x00, 0x0C]));
	assert.strictEqual(res1.type, MStunAttr.K_ATTR_TYPE.MALFORMED);

	const res2 = MStunAttr._decType(Buffer.from([0x00, 0x09]));
	assert.strictEqual(res2.type, MStunAttr.K_ATTR_TYPE.ERROR_CODE);
})();

(function _decLen() {
	assert.throws(() => {
		MStunAttr._decLen(0x10);
	});

	assert.throws(() => {
		MStunAttr._decLen(Buffer.from([0x04]));
	});

	const res1 = MStunAttr._decLen(Buffer.from([0x00, 0x10]));
	assert.strictEqual(res1, 16);
})();

(function _decFam() {
	assert.throws(() => {
		MStunAttr._decFam(0x01);
	});

	assert.throws(() => {
		MStunAttr._decFam(Buffer.from([0x01, 0x02]));
	});

	const res1 = MStunAttr._decFam(Buffer.from([0x01]));
	assert.strictEqual(res1.type, MStunAttr.K_ADDR_FAMILY.IPv4);

	const res2 = MStunAttr._decFam(Buffer.from([0x0F]));
	assert.strictEqual(res2.type, MStunAttr.K_ADDR_FAMILY.MALFORMED);
})();

(function _enType() {
	assert.throws(() => {
		MStunAttr._enType(Buffer.from([0x00, 0x01]));
	});

	assert.throws(() => {
		MStunAttr._enType("2");
	});

	assert.throws(() => {
		MStunAttr._enType(18);
	});

	const res1 = MStunAttr._enType(17);
	assert.strictEqual(res1.length, 2);
	assert.strictEqual(res1[0], 0x80);
	assert.strictEqual(res1[1], 0x28);
})();

(function _enLen() {
	assert.throws(() => {
		MStunAttr._enLen(Buffer.from([0x00, 0x20]));
	});

	assert.throws(() => {
		MStunAttr._enLen("32");
	});

	const res1 = MStunAttr._enLen(32);
	assert.strictEqual(res1.length, 2);
	assert.strictEqual(res1[0], 0x00);
	assert.strictEqual(res1[1], 0x20);
})();

(function _enFam() {
	assert.throws(() => {
		MStunAttr._enFam(Buffer.from([0x01]));
	});

	assert.throws(() => {
		MStunAttr._enLen("1");
	});

	const res1 = MStunAttr._enFam(1);
	assert.strictEqual(res1.length, 1);
	assert.strictEqual(res1[0], 0x02);
})();

(function _enMappedAddr() {
	const res1 = MStunAttr._enMappedAddr(1, "::FFFF:127.0.0.1", 65535, false);
	const exp1 = Buffer.from([0x00, 0x02, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x7F, 0x00, 0x00, 0x01]);

	assert.strictEqual(res1.length, exp1.length);

	for (let i = 0; i < res1.length; i += 1) {
		assert.strictEqual(res1[i], exp1[i]);
	}

	const res2 = MStunAttr._enMappedAddr(0, "127.0.0.1", 65535, false);
	const exp2 = Buffer.from([0x00, 0x01, 0xFF, 0xFF, 0x7F, 0x00, 0x00, 0x01]);

	assert.strictEqual(res2.length, exp2.length);

	for (let i = 0; i < res2.length; i += 1) {
		assert.strictEqual(res2[i], exp2[i]);
	}

	const res3 = MStunAttr._enMappedAddr(1, "::FFFF:127.0.0.1", 65535, true, Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C]));
	const exp3 = Buffer.from([0x00, 0x02, 0xDE, 0xED, 0x21, 0x12, 0xA4, 0x42, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0xF8, 0xF7, 0x76, 0x0A, 0x0B, 0x0D]);

	assert.strictEqual(res3.length, exp3.length);

	for (let i = 0; i < res3.length; i += 1) {
		assert.strictEqual(res3[i], exp3[i]);
	}

	const res4 = MStunAttr._enMappedAddr(0, "127.0.0.1", 65535, true);
	const exp4 = Buffer.from([0x00, 0x01, 0xDE, 0xED, 0x5E, 0x12, 0xA4, 0x43]);

	assert.strictEqual(res4.length, exp4.length);

	for (let i = 0; i < res4.length; i += 1) {
		assert.strictEqual(res4[i], exp4[i]);
	}
})();

(function _enErorCode() {
	const res1 = MStunAttr._enErrorCode(420);
	const exp1 = Buffer.from([0x00, 0x00, 0x04, 0x14, 0x55, 0x6E, 0x6B, 0x6E, 0x6F, 0x77, 0x6E, 0x20, 0x41, 0x74, 0x74, 0x72, 0x69, 0x62, 0x75, 0x74, 0x65]);

	assert.strictEqual(res1.length, exp1.length);

	for (let i = 0; i < res1.length; i += 1) {
		assert.strictEqual(res1[i], exp1[i]);
	}
})();

(function _enUnknownAttr() {
	const res1 = MStunAttr._enUnknownAttr([Buffer.from([0x00, 0xFF]), Buffer.from([0x7F, 0x7F]), Buffer.from([0x05, 0x06])]);
	const exp1 = Buffer.from([0x00, 0xFF, 0x7F, 0x7F, 0x05, 0x06, 0x00, 0x00]);

	assert.strictEqual(res1.length, exp1.length);

	for (let i = 0; i < res1.length; i += 1) {
		assert.strictEqual(res1[i], exp1[i]);
	}
})();

(function _enSoftware() {
	const res1 = MStunAttr._enSoftware("333");
	assert.strictEqual(res1.length, 4);

	const res2 = MStunAttr._enSoftware("999999999");
	assert.strictEqual(res2.length, 12);

	const res3 = MStunAttr._enSoftware("Hello this is a bunch of characters (40)");
	assert.strictEqual(res3.length, 40);
})();