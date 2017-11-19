var request = require('request');
var fParam = require('jquery-param');
var oUnsplashPhotoSearcher = (function () {

	var nPageSize = 1;

	function getPhotoSearchUrl(nPage) {
		return 'https://api.unsplash.com/search/photos?' + fParam({
			query: 'trending',
			per_page: 30, // by observation, maximum no. per_page == 30
			page: nPage,
			client_id: '<UNSPLASH_API_CLIENT_ID>'
		});
	}
	function searchPhotos(nPage, fCallback) {
		request.get(getPhotoSearchUrl(nPage), function (err, res, sJson) {
			var pPhotos = []
			if (err) {
				console.error('Encounter Error when searching photos from Unsplash.');
				fCallback(pPhotos);
				return;
			}
			if (sJson === 'Rate Limit Exceeded') {
				console.warn(sJson);
				fCallback(pPhotos);
				return;
			}
			var oJson = null;
			try {
				oJson = JSON.parse(sJson);
			} catch (e) {
				console.error(e);
				fCallback(pPhotos);
				return;
			}
			if (!Array.isArray(oJson.results)) {
				console.warn('oJson.results is not an array.');
				fCallback(pPhotos);
				return;
			}
			oJson.results.forEach(function (result) {
				pPhotos.push({
					photoUrl: {
						raw: result.urls.raw,
						regular: result.urls.regular
					},
					photographer: {
						name: result.user.name,
						profile: result.links.html + '?utm_source=Time_Is_Running_Out&utm_medium=referral&utm_campaign=api-credit'
					},
					source: {
						name: 'Unsplash',
						url: 'https://unsplash.com/?utm_source=Time_Is_Running_Out&utm_medium=referral&utm_campaign=api-credit'
					}
				});
			});
			nPageSize = Math.ceil(oJson.total / oJson.total_pages);
			fCallback(pPhotos);
		});
	}

	var oRandomPage = (function () {
		var myMax, myMin;
		return {
			generate: function () {
				return Math.floor(Math.random() * (myMax - myMin + 1)) + myMin;
			},
			set: function (max, min) {
				myMax = max;
				myMin = min;
			}
		}
	})();

	return {
		search: function (fCallback) {
			searchPhotos(oRandomPage.generate(), fCallback);
		},
		initPageSize: function () {
			searchPhotos(1, function (pPhotos) {
				oRandomPage.set(nPageSize, 1);
			});
		}
	};
})();

oUnsplashPhotoSearcher.initPageSize();

module.exports = oUnsplashPhotoSearcher;