const assert = require("assert");
const p = require("child_process");
const { Ministun } = require("../src/ministun.js");
const { MStunMsg } = require("../src/mmsg.js");
const { MStunHeader } = require("../src/mhdr.js");

function udp4() {
	return new Promise((resolve, reject) => {
		const server = new Ministun({udp4: true, udp6: false});
		server.start();

		setTimeout(() => {
			// Test standard binding request
			const rhdr = new MStunHeader({
				type: MStunHeader.K_MSG_TYPE.BINDING_REQUEST, 
				len: 0, 
				id: Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C])
			});

			const rmsg = new MStunMsg({hdr: rhdr});

			p.exec(`echo ${rmsg.serialize().toString("hex")} | xxd -r -p | nc -u4 -w 3 -p 50000 127.0.0.1 3478 | xxd -p -c 256`, (err, stdout, stderr) => {
				if (err) {
					throw new Error("Couldn't send test message via netcat");
				}

				const res = Buffer.from(stdout, "hex");

				const golden = Buffer.from([
					0x01, 0x01, 0x00, 0x29, 0x21, 0x12, 0xA4, 0x42, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 
					0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x00, 0x20, 0x00, 0x08, 0x00, 0x01, 0xE2, 0x42, 0x5E, 0x12, 
					0xA4, 0x43, 0x80, 0x22, 0x00, 0x19, 0x6D, 0x69, 0x6E, 0x69, 0x73, 0x74, 0x75, 0x6E, 0x20, 
					0x62, 0x79, 0x20, 0x4E, 0x6F, 0x61, 0x68, 0x20, 0x4C, 0x65, 0x76, 0x65, 0x6E, 0x73, 0x6F, 
					0x6E
				]);

				assert.strictEqual(res.length, golden.length);

				for (let i = 0; i < res.length; i += 1) {
					assert.strictEqual(res[i], golden[i]);
				}

				// Test receiving some buffer of bad data
				const badstuff = Buffer.from([0x01, 0x01, 0x00, 0x29, 0x21, 0x12, 0xA4, 0x42, 0x00, 0x00, 0xFF, 0xFF, 0xDA, 0x10, 0x00, 0x03, 0xFF, 0x73, 0x20, 0x19]);
				
				p.exec(`echo ${badstuff.toString("hex")} | xxd -r -p | nc -u4 -w 3 -p 50000 127.0.0.1 3478 | xxd -p -c 256`, (err, stdout, stderr) => {
					if (err) {
						throw new Error("Couldn't send test message via netcat");
					}

					const res = Buffer.from(stdout, "hex");
					assert.strictEqual(res.length, 0);

					// TODO: Send a binding request with some bad attrs

					server.stop();
					resolve();
				});
			});
		}, 3000);
	});
}

(async function runTests() {
	await udp4();
})();