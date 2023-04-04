import axios from "axios";

export default class Weather {
	static async get(city: string): Promise<[number, number, number]> {
		const request = await axios.get(
			"https://wttr.in/" + `${city}` + "?format=j1"
		);

		const weather = request.data.weather[0];

		return [weather.avgtempC, weather.mintempC, weather.maxtempC];
	}

	static async check(city: string): Promise<boolean> {
		try {
			await axios.get("https://wttr.in/" + `${city}` + "?format=j1");

			return true;
		} catch {
			return false;
		}
	}

	static async calendar(city: string): Promise<[[number, number, number]]> {
		const request = await axios.get(
			"https://wttr.in/" + `${city}` + "?format=j1"
		);

		const week = request.data.weather;

		console.log(week);

		return [
			week.map(
				(x: { avgtempC: number; mintempC: number; maxtempC: number }) => [
					x.avgtempC,
					x.mintempC,
					x.maxtempC,
				]
			),
		];
	}
}
