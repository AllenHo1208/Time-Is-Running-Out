var request = require('request');
var fParam = require('jquery-param');
var oUnsplashPhotoSearcher = (function () {
	function getPhotoSearchUrl(nWhichPage) {
		return 'https://api.unsplash.com/search/photos?' + fParam({
			query: 'trending',
			per_page: 30, // by observation, maximum no. per_page == 30
			page: nWhichPage,
			client_id: '<UNSPLASH_API_CLIENT_ID>'
		});
	}
	function searchPhotos(nWhichPage, fCallback) {
		request.get(getPhotoSearchUrl(nWhichPage), function (err, res, sJson) {
			var pPhotos = [];
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
			fCallback(pPhotos, oJson.total_pages);
		});
	}

	let m_nCurrentPage = 1, m_nTotalPages = 1;
	return {
		search: function (fCallback) {
			searchPhotos(m_nCurrentPage % m_nTotalPages + 1, function (pPhotos, nTotalPages) {
				m_nCurrentPage++;
				m_nTotalPages = nTotalPages;
				fCallback(pPhotos);
			});
		}
	};
})();

module.exports = oUnsplashPhotoSearcher;