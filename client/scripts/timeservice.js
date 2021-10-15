

export default class TimeService {
	static GetTimestampNow() {
		return Date.now();
	}

	static GetHumanReadableTimeFrom(inputTimestampMs, config={} ) {
		const keepAsSeconds = (config.keepAsSeconds) ? (true) : (false);
		const keepAsMinutesAfterOneHour = (config.keepAsMinutesAfterOneHour) ? (true) : (false);
		const roundDownTo = (config.roundDownTo !== undefined) ? (config.roundDownTo) : (1);

		let outputString = "";

		const seconds = inputTimestampMs / 1000;
		const minutes = seconds / 60;
		const hours = seconds / 3600;
		const days = hours / 24;

		if (hours > 24) {
			const remainingHours = hours - Math.floor(days)*24;
			const remainingMinutes = minutes - Math.floor(remainingHours)*60;
			const remainingSeconds = seconds - Math.floor(remainingMinutes)*60;
			outputString = `${days}d ${remainingHours.toFixed(roundDownTo)}h ${remainingMinutes.toFixed(roundDownTo)}m ${remainingSeconds.toFixed(roundDownTo)}s`;
		} else if (minutes > 60) {
			// const remainingSeconds = seconds - Math.floor(remainingMinutes)*60;
			const remainingMinutes = minutes - Math.floor(hours)*60;
			const remainingSeconds = seconds - Math.floor(hours)*3600 - Math.floor(minutes)*60;
			outputString = `${hours.toFixed(0)}h ${remainingMinutes.toFixed(0)}m ${remainingSeconds.toFixed(roundDownTo)}s`;
		} else if (seconds > 60) {
			const remainingSeconds = seconds - Math.floor(minutes)*60;
			outputString = `${minutes.toFixed(0)}m ${remainingSeconds.toFixed(roundDownTo)}s`;
		} else if (keepAsSeconds) {
			outputString = `${seconds}s`;
		}

		return outputString;
	}


};

// end of file