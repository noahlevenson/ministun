// TODO: Validate arg < 0xFFFF?
function mInt2Buf16(int) {
	const buf = Buffer.alloc(2);

	buf[0] = 0xFF & (int >>> 8);
	buf[1] = 0xFF & int;

	return buf;
}

function mGetBit(buffer, idx, off) {
	let mask = Buffer.alloc(1);

	mask[0] = 0b10000000;
	mask[0] >>>= off;

	return (buffer[idx] & mask[0]) !== 0 ? 1 : 0;
}

function mCompareBuf(a, b) {
	if (a.length !== b.length) {
		return false;
	}

	for (let i = 0; i < a.length; i += 1) {
		if (a[i] != b[i]) {
			return false;
		}
	}	

	return true;
}

module.exports.mInt2Buf16 = mInt2Buf16;
module.exports.mGetBit = mGetBit;
module.exports.mCompareBuf = mCompareBuf;