const assert = require("assert");
const { MStunAttr } = require("../src/mattr.js"); 

function _isCompReq() {
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
}

function _decType() {
	assert.throws(() => {
		MStunAttr._decType(0x1011);
	});

	assert.throws(() => {
		MStunAttr._decType(Buffer.from([0x80]));
	});

	const res1 = MStunAttr._decType(Buffer.from([0x00, 0x0C]));
	assert.strictEqual(res1.type, MStunAttr.K_ATTR_TYPE.MALFORMED);

	const res2 = MStunAttr._decType(Buffer.from([0x00, 0x09]));
	assert.strictEqual(res2.type, MStunAttr.K_ATTR_TYPE.ERROR_CODE);
}

function _decLen() {
	assert.throws(() => {
		MStunAttr._decLen(0x1011);
	});

	assert.throws(() => {
		MStunAttr._decLen(Buffer.from([0x04]));
	});

	const res1 = MStunAttr._decLen(Buffer.from([0x00, 0x0F]));
	assert.strictEqual(res1, 15);
}

function _decFam() {
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
}

function _enType() {
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
}

function _enLen() {
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
}

function _enFam() {
	assert.throws(() => {
		MStunAttr._enFam(Buffer.from([0x01]));
	});

	assert.throws(() => {
		MStunAttr._enLen("1");
	});

	const res1 = MStunAttr._enFam(1);
	assert.strictEqual(res1.length, 1);
	assert.strictEqual(res1[0], 0x02);
}

_isCompReq();
_decType();
_decLen();
_decFam();
_enType();
_enLen();
_enFam();