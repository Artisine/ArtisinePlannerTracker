
export const alphabet = "abcdefghijklmnopqrstuvwxyz";
export const numbers = "0123456789";




export async function run_SHA256_onString(str) {
	const buffer = await window.crypto.subtle.digest("SHA-256", new TextEncoder("utf-8").encode(str));
	return Array.prototype.map.call(new Uint8Array(buffer), (x)=>(("00"+x.toString(16)).slice(-2))).join("");
}

export async function RandomAlphabetString(numberOfChars = 8) {
	let output = "";
	for (let i=0; i<numberOfChars; i+=1) {
		output += alphabet[Math.floor(Math.random() * alphabet.length)];
	}
	return Promise.resolve(output);
}

/**
 * 
 * @param {Date} dateTime 
 * @param {string} accountName 
 * @returns string;
 */
export async function CreateSnowflake(dateTime, accountName) {
	// const dateTimeUTCMs = dateTime.getUTCMilliseconds();
	// const sha256_time = await run_SHA256_onString(`${dateTimeUTCMs}`);
	// const sha256_accountName = await run_SHA256_onString(`${accountName}`);
	// const output = sha256_time + sha256_accountName;
	// const output = await run_SHA256_onString(sha256_time + sha256_accountName);

	const output = await RandomAlphabetString(8);
	
	return `${output}`;
}



export function BubbleSort(inputArr) {
	const workArr = Array.from(inputArr);
	for (let k=0; k<workArr.length; k+=1) {
		for (let i=0; i<workArr.length-1; i+=1) {
			if (workArr[i+1] < workArr[i]) {
				[workArr[i+1], workArr[i]] = [workArr[i], workArr[i+1]];
				console.log(workArr);
			}
		}
	}
	// console.log(workArr);
	return workArr;
}


export function Wait(ms) {
	return new Promise((resolve, reject) => {
		if (ms > 0) {
			setTimeout(()=>{
				resolve(ms);
			}, ms);
		} else {
			reject(`Argument ms was le 0. Must be gt 0.`);
		}
	});
}




// end of file