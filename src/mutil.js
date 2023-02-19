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
		// Expand the double colon if it exists
		str = str.replace("::", `::${":".repeat(7 - str.match(/:/g).length)}`);
		// Expand leading zeroes in each hextet
		const hextets = str.split(":").map(h => h.padStart(4, "0"));
		
		// It's an IPv4 mapped IPv6 address
		if (net.isIPv4(hextets[hextets.length - 1]) && 
			hextets[hextets.length - 2].toUpperCase() === "FFFF") {
			const buf = Buffer.alloc(16);
			buf.writeUInt32BE(0xFFFF, 8);
			MUtil._ipv4Str2Buf32(hextets[hextets.length - 1]).copy(buf, 12);
			return buf
		}
		
		// It's a regular IPv6 address
		return Buffer.from(hextets.join(""), "hex");
	}
}

module.exports.MUtil = MUtil;
