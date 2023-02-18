/**
 * ministun: Zero dependency STUN server for Node.js
 *
 * by Noah Levenson <noahlevenson@gmail.com>
 * 
 * mutil.js 
 * Utility functions
 */

const net = require("net");

class MUtil {
	// TODO: Validation
	// Network byte order (big endian)
	static _int2Buf16(int) {
		const buf = Buffer.alloc(2);

		buf[0] = 0xFF & (int >>> 8);
		buf[1] = 0xFF & int;

		return buf;
	}

	// Little endian addressing
	static _getBit(buffer, idx, off) {
		let mask = Buffer.alloc(1);

		mask[0] = 0x01;
		mask[0] <<= off;

		return (buffer[idx] & mask[0]) !== 0 ? 1 : 0;
	}

	static _compareBuf(a, b) {
		if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
			return false
		}

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

	// TODO: Validation
	static _ipv4Str2Buf32(str) {
		return Buffer.from(str.split(".").map((n) => { 
			return parseInt(n); 
		}));
	}

	// TODO: Validation
	static _ipv6Str2Buf128(str) {
		const buf = Buffer.alloc(16);
		const arr = str.split(":");
		const len = arr.length - 1;
		let i = 0;

		// It's an ipv4 mapped ipv6 address
		if (net.isIPv4(arr[len]) && arr[len - 1].toUpperCase() === "FFFF") {
			while (i < 10) buf[i++] = 0;
			buf[i++] = 0xff;
			buf[i++] = 0xff;
			arr[len].split(".").forEach(n => buf[i++] = parseInt(n));
			return buf;
		}

		let didExpansion = false;
		let missing = 8 - arr.length;
		for (var p of arr) {
			if (p === '') {
				if (didExpansion) {
					buf[i++] = 0;
					buf[i++] = 0;
				} else {
					didExpansion = true;
					while (missing-- >= 0) {
						buf[i++] = 0;
						buf[i++] = 0;
					}
				}
			} else if (p.length === 4) {
				buf[i++] = parseInt(p.slice(0, 2), 16);
				buf[i++] = parseInt(p.slice(2, 4), 16);
			} else if (p.length === 3) {
				buf[i++] = parseInt(p.slice(0, 1), 16);
				buf[i++] = parseInt(p.slice(1, 3), 16);
			} else if (p.length) {
				buf[i++] = 0;
				buf[i++] = parseInt(p, 16);
			} else {
				buf[i++] = 0;
				buf[i++] = 0;
			}
		}

		return buf;
	}
}

module.exports.MUtil = MUtil;