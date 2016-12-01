const viewports = [
	{
		width: 1440,
		height: 1220
	},
	{
		width: 1220,
		height: 980
	},
	{
		width: 980,
		height: 740
	},
	{
		width: 740,
		height: 490
	},
	{
		width: 490,
		height: 740
	}
];

const smoke = require('./test/smoke.js');

const urls = [];

const config = {
	defaults: {
		page: {
			headers: {
				"Cookie": "next-flags=ads:off,cookieMessage:off; secure=true"
			}
		},
		timeout: 50000
	},
	urls: [],
	exceptions: []
}

smoke.forEach((smokeConfig) => {
	for (url in smokeConfig.urls) {

		let isException = false;

		config.exceptions.forEach((path) => {
			isException = isException || url.indexOf(path) !== -1;
		});

		if (smokeConfig.urls[url] !== 200 || url === '/__health' || isException) {
			continue;
		}

		const thisUrl = {
			url: process.env.TEST_URL + url
		}

		if (smokeConfig.headers) {
			thisUrl.headers = smokeConfig.headers
		}

		urls.push(thisUrl)
	}
});


for (viewport of viewports) {
	for (url of urls) {
		url.viewport = viewport;
		config.urls.push(url);
	}
}

module.exports = config;
fas