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
	// TODO: Validate arg < 0xFFFF?
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

	// Can we assume that dgram delivers only valid ipv4 strings and avoid performing validation here?
	static _ipv4Str2Buf32(str) {
		return Buffer.from(str.split(".").map((n) => { 
			return parseInt(n); 
		}));
	}

	// Can we assume that dgram delivers only valid ipv6 strings and avoid performing validation here?
	static _ipv6Str2Buf128(str) {
		const arr = str.split(":");
		const len = arr.length - 1;

		// It's an ipv4 mapped ipv6 address
		if (net.isIPv4(arr[len]) && arr[len - 1].toUpperCase() === "FFFF") {
			arr[len] = arr[len].split(".").map((n) => {
				return parseInt(n).toString(16).padStart(2, "0");
			}).join("");
		}

		const hs = arr.join("");
		const buf = Buffer.alloc(16);

		for (let i = hs.length - 2, j = buf.length - 1; i >= 0; i -= 2, j -= 1) {
			buf[j] = parseInt(hs.substring(i, i + 2), 16);
		}

		return buf;
	}
}

module.exports.MUtil = MUtil;