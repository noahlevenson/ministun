const assert = require("assert");
const { MUtil } = require("../src/mutil.js"); 

(function _int2Buf16() {
	const res1 = MUtil._int2Buf16(255);
	assert.strictEqual(Buffer.isBuffer(res1), true)
	assert.strictEqual(res1.length, 2);
	assert.strictEqual(res1[0], 0x00);
	assert.strictEqual(res1[1], 0xFF);

	const res2 = MUtil._int2Buf16(8);
	assert.strictEqual(Buffer.isBuffer(res2), true);
	assert.strictEqual(res2.length, 2);
	assert.strictEqual(res2[0], 0x00);
	assert.strictEqual(res2[1], 0x08);

	const res3 = MUtil._int2Buf16(1000);
	assert.strictEqual(Buffer.isBuffer(res3), true);
	assert.strictEqual(res3.length, 2);
	assert.strictEqual(res3[0], 0x03);
	assert.strictEqual(res3[1], 0xE8);

	const res4 = MUtil._int2Buf16(10000);
	assert.strictEqual(Buffer.isBuffer(res4), true);
	assert.strictEqual(res4.length, 2);
	assert.strictEqual(res4[0], 0x27);
	assert.strictEqual(res4[1], 0x10);
})();

(function _getBit() {
	const buf = Buffer.from([0xFF, 0x01, 0xA0, 0xC3, 0x00]);
	
	const golden0 = "11111111";

	for (let i = 0; i < golden0.length; i += 1) {
		assert.strictEqual(MUtil._getBit(buf, 0, i), parseInt(golden0[7 - i]));
	}

	const golden1 = "00000001";

	for (let i = 0; i < golden1.length; i += 1) {
		assert.strictEqual(MUtil._getBit(buf, 1, i), parseInt(golden1[7 - i]));
	}

	const golden2 = "10100000";

	for (let i = 0; i < golden2.length; i += 1) {
		assert.strictEqual(MUtil._getBit(buf, 2, i), parseInt(golden2[7 - i]));
	}

	const golden3 = "11000011";

	for (let i = 0; i < golden3.length; i += 1) {
		assert.strictEqual(MUtil._getBit(buf, 3, i), parseInt(golden3[7 - i]));
	}

	const golden4 = "00000000";

	for (let i = 0; i < golden4.length; i += 1) {
		assert.strictEqual(MUtil._getBit(buf, 4, i), parseInt(golden4[7 - i]));
	}
})();

(function _compareBuf() {
	const buf = Buffer.from([0x00, 0x24, 0x0A, 0xDD]);
	const notabuf = [0x00, 0x24, 0x0A, 0xDD];

	const res1 = MUtil._compareBuf(notabuf, buf);
	assert.strictEqual(res1, false);

	const res2 = MUtil._compareBuf(buf, notabuf);
	assert.strictEqual(res2, false);

	const res3 = MUtil._compareBuf(buf, Buffer.from(notabuf));
	assert.strictEqual(res3, true);

	const res4 = MUtil._compareBuf(buf, Buffer.concat([Buffer.from(notabuf), Buffer.from([0x00])]));
	assert.strictEqual(res4, false);

	const res5 = MUtil._compareBuf(Buffer.from([0x00, 0x24]), buf);
	assert.strictEqual(res5, false);
})();

(function _ipv4Str2Buf32() {
	const str1 = "127.0.0.1";
	
	const res1 = MUtil._ipv4Str2Buf32(str1);
	assert.strictEqual(Buffer.isBuffer(res1), true);
	assert.strictEqual(res1.length, 4);
	assert.strictEqual(res1[0], 0x7F);
	assert.strictEqual(res1[1], 0x00);
	assert.strictEqual(res1[2], 0x00);
	assert.strictEqual(res1[3], 0x01);
})();

(function _ipv6Str2Buf128() {
	const str1 = "::1";
	const golden1 = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]);

	const res1 = MUtil._ipv6Str2Buf128(str1);
	
	assert.strictEqual(Buffer.isBuffer(res1), true);
	assert.strictEqual(res1.length, golden1.length);

	for (let i = 0; i < res1.length; i += 1) {
		assert.strictEqual(res1[i], golden1[i]);
	}

	const str2 = "::FFFF:127.0.0.1";
	const golden2 = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x7F, 0x00, 0x00, 0x01]);

	const res2 = MUtil._ipv6Str2Buf128(str2);
	
	assert.strictEqual(Buffer.isBuffer(res2), true);
	assert.strictEqual(res2.length, golden2.length);

	for (let i = 0; i < res2.length; i += 1) {
		assert.strictEqual(res2[i], golden2[i]);
	}

	const str3 = "::ffff:127.0.0.1";
	const golden3 = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x7F, 0x00, 0x00, 0x01]);

	const res3 = MUtil._ipv6Str2Buf128(str3);
	
	assert.strictEqual(Buffer.isBuffer(res3), true);
	assert.strictEqual(res3.length, golden3.length);

	for (let i = 0; i < res3.length; i += 1) {
		assert.strictEqual(res3[i], golden3[i]);
	}

	const str4 = "2001:0db8:85a3:0000:0000:8a2e:0370:7334";
	const golden4 = Buffer.from([0x20, 0x01, 0x0D, 0xB8, 0x85, 0xA3, 0x00, 0x00, 0x00, 0x00, 0x8A, 0x2E, 0x03, 0x70, 0x73, 0x34]);

	const res4 = MUtil._ipv6Str2Buf128(str4);
	
	assert.strictEqual(Buffer.isBuffer(res4), true);
	assert.strictEqual(res4.length, golden4.length);

	for (let i = 0; i < res4.length; i += 1) {
		assert.strictEqual(res4[i], golden4[i]);
	}
})();