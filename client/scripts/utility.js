

export class BNF_Parser {

	static ProductionRules = new Set();


	static CheckIfDatagramIsValid(datagram) {
		const procedureDef = {
			"procedure": {
				"identifier": {
					"EXIT": "EXIT",
					"parameters": {
						"lbracket": "(",
						"parameter": [["parameter"], ["parameter", ";"]],
						"rbracket": ")",
						"EXIT": "EXIT"
					}
				}
			}
		};
		// this is not going to be efficient for larger production rule units.
	}
	static DefineRule(name, flowDatagram) {
		this.ProductionRules.add(name, flowDatagram);
	}
};




export async function run_SHA256_onString(str) {
	const buffer = await window.crypto.subtle.digest("SHA-256", new TextEncoder("utf-8").encode(str));
	return Array.prototype.map.call(new Uint8Array(buffer), (x)=>(("00"+x.toString(16)).slice(-2))).join("");
}


/**
 * 
 * @param {Date} dateTime 
 * @param {string} accountName 
 * @returns string;
 */
export async function CreateSnowflake(dateTime, accountName) {
	const dateTimeUTCMs = dateTime.getUTCMilliseconds();
	const sha256_time = await run_SHA256_onString(`${dateTimeUTCMs}`);
	const sha256_accountName = await run_SHA256_onString(`${accountName}`);
	const output = sha256_time + sha256_accountName;
	// const output = await run_SHA256_onString(sha256_time + sha256_accountName);
	return `${output}`;
}



