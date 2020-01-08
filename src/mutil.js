class MUtil {
	// TODO: Validate arg < 0xFFFF?
	static int2Buf16(int) {
		const buf = Buffer.alloc(2);

		buf[0] = 0xFF & (int >>> 8);
		buf[1] = 0xFF & int;

		return buf;
	}

	static getBit(buffer, idx, off) {
		let mask = Buffer.alloc(1);

		mask[0] = 0b10000000;
		mask[0] >>>= off;

		return (buffer[idx] & mask[0]) !== 0 ? 1 : 0;
	}

	static compareBuf(a, b) {
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
	static ipv4Str2Buf32(str) {
		const buf = Buffer.from(str.split(".").map((n) => {
			return parseInt(n);
		}));	

		return buf;
	}

	// TODO: Validation
	static ipv6Str2Buf128(str) {
		const arr = str.split(":");
		
		// It's an ipv4 mapped ipv6 address
		if (arr[arr.length - 2].toUpperCase() === "FFFF" && arr[arr.length - 1].includes(".")) {
			arr[arr.length - 1] = arr[arr.length - 1].split(".").map((n) => {
				return parseInt(n).toString(16).padStart(2, "0");
			}).join("");
		}

		const hs = arr.join("");
		const buf = Buffer.alloc(16);

		let i = hs.length - 2;
		let j = buf.length - 1;

		while (i >= 0) {
			buf[j] = parseInt(hs.substring(i, i + 2), 16);

			i -= 2;
			j -= 1;
		}

		return buf;
	}
}

module.exports.MUtil = MUtil;