export default class CookieManager {
	constructor() {
		let bestScore = this.getCookie("bestScore");
		if (bestScore) {
			this.bestScore = bestScore;

		} else {
			this.bestScore = 0;
			this.storeObject("bestScore", this.bestScore)
		}

		let defaultSettings = {
			sound: true,
			tutorial: false
		}

		let settings = this.getCookie("settings");
		if (settings) {
			this.settings = settings;

			for (const key in defaultSettings) {
				const element = defaultSettings[key];
				if (this.settings[key] === undefined) {
					this.settings[key] = element;
					this.storeObject("settings", this.settings)
				}
			}
		} else {
			this.settings = defaultSettings
			this.storeObject("settings", this.settings)
		}
	}
	wipeData() {
		this.resetCookie();
		window.localStorage.clear();
		window.location.reload();
	}
	updateSettings(data) {
		for (const key in data) {
			const element = data[key];
			this.settings[key] = element;
		}
		this.storeObject("settings", this.settings);
	}
	createCookie(name, value, days) {
		let sValue = JSON.stringify(value);
		try {
			window.localStorage.setItem(name, sValue)
		} catch (e) {
			// alert(sValue)
			//  	alert(e)
		}
	}
	getCookie(name) {
		return JSON.parse(window.localStorage.getItem(name))//(result === null) ? null : result[1];
	}
	storeObject(name, value) {
		window.localStorage.setItem(name, JSON.stringify(value))
	}
	resetCookie() {
		for (var i in window.localStorage) {
			window.localStorage.removeItem(i);
		}
	}
}