var BG_UPDATE_TIMEOUT = 500;

// create n invisible element
$('body').append('<div id="invisibleEl"></div>');
var oInvisibleEl = $('#invisibleEl').css({
	'display': 'none',
});

function showToast(sText, fCallback) {
	var oToast = $('#toast');
	oToast.text(sText);
	oToast.addClass('show');
	setTimeout(function () {
		oToast.removeClass('show');
		if (fCallback) { fCallback(); }
	}, 2000);
}

// Use Local Images
var oLocalBgChanger = (function () {
	var pPhotos = [];
	['../images/natural.jpg', '../images/cloud.jpg', '../images/island.jpg', '../images/colorful.jpg', '../images/lighthouse.jpg'].forEach(function (sLocalPhotoUrls) {
		pPhotos.push({
			photoUrl: {
				raw: sLocalPhotoUrls,
				regular: sLocalPhotoUrls
			},
			photographer: {
				name: 'Unknown',
				profile: 'https://www.bing.com/images/search?q=scenary'
			},
			source: {
				name: 'Bing Images',
				url: 'https://www.bing.com/images/search?q=scenary'
			}
		});
	});
	var oPhotoHistory = {
		prev: [],
		current: pPhotos[0],
		next: []
	};

	function updateCssHtml(oPhoto) {
		oInvisibleEl.css({
			'background-image': 'url(' + oPhoto.photoUrl[$('.hiResSwitch label input').is(":checked") ? 'raw' : 'regular'] + ')'
		});
		setTimeout(function () {
			$('.bgimg').css({
				'background-image': 'url(' + oPhoto.photoUrl[$('.hiResSwitch label input').is(":checked") ? 'raw' : 'regular'] + ')'
			});
			$('#photoAttribution').html('Photo by ' + '<a href="' + oPhoto.photographer.profile + '">' + oPhoto.photographer.name + '</a>' + ' / <a href="' + oPhoto.source.url + '">' + oPhoto.source.name + '</a>');
		}, BG_UPDATE_TIMEOUT);
	}
	return {
		change: function () {
			if (oPhotoHistory.next.length > 0) {
				var oPhoto = oPhotoHistory.next.shift();
				updateCssHtml(oPhoto);
				oPhotoHistory.prev.push(oPhotoHistory.current);
				oPhotoHistory.current = oPhoto;
			} else {
				var max = pPhotos.length - 1, min = 0, nRandom = Math.floor(Math.random() * (max - min + 1)) + min;
				var oPhoto = pPhotos[nRandom];
				updateCssHtml(oPhoto);
				oPhotoHistory.prev.push(oPhotoHistory.current);
				oPhotoHistory.current = oPhoto;
			}
		},
		changeBack: function () {
			if (oPhotoHistory.prev.length > 0) {
				var oPhoto = oPhotoHistory.prev.pop();
				updateCssHtml(oPhoto);
				oPhotoHistory.next.push(oPhotoHistory.current);
				oPhotoHistory.current = oPhoto;
			} else {
				showToast('No more preivous background.');
			}
		}
	};
})();

// Use Unsplash Images
var oBgChanger = (function () {
	var pPhotos = [];
	var oPhotoHistory = {
		prev: [],
		current: {
			photoUrl: {
				raw: '/images/natural.jpg',
				regular: '/images/natural.jpg'
			},
			photographer: {
				name: 'Unknown',
				profile: 'https://www.bing.com/images/search?q=scenary'
			},
			source: {
				name: 'Bing Images',
				url: 'https://www.bing.com/images/search?q=scenary'
			}
		},
		next: []
	};

	function searchUnsplashPhotos(updateCssHtml) {
		$.get('/searchUnsplashPhotos', function (oResult, sStatus) {
			pPhotos = oResult;
			if (pPhotos.length > 0) {
				updateCssHtml();
			} else {
				showToast('No Unsplash photos can be found, use default background photos instead.', function () {
					oBgChanger = oLocalBgChanger;
					oBgChanger.change();
				});
			}
		}, 'json');
	}

	function updateCssHtml(oPhoto) {
		oInvisibleEl.css({
			'background-image': 'url(' + oPhoto.photoUrl[$('.hiResSwitch label input').is(":checked") ? 'raw' : 'regular'] + ')'
		});
		setTimeout(function () {
			$('.bgimg').css({
				'background-image': 'url(' + oPhoto.photoUrl[$('.hiResSwitch label input').is(":checked") ? 'raw' : 'regular'] + ')'
			});
			$('#photoAttribution').html('Photo by ' + '<a href="' + oPhoto.photographer.profile + '">' + oPhoto.photographer.name + '</a>' + ' / <a href="' + oPhoto.source.url + '">' + oPhoto.source.name + '</a>');
		}, BG_UPDATE_TIMEOUT);
	}

	return {
		change: function () {
			if (pPhotos.length === 0) {
				searchUnsplashPhotos(function () {
					var max = pPhotos.length - 1, min = 0, nRandom = Math.floor(Math.random() * (max - min + 1)) + min;
					var oPhoto = pPhotos.splice(nRandom, 1)[0];
					updateCssHtml(oPhoto);
					oPhotoHistory.prev.push(oPhotoHistory.current);
					oPhotoHistory.current = oPhoto;
				});
			} else {
				if (oPhotoHistory.next.length > 0) {
					var oPhoto = oPhotoHistory.next.shift();
					updateCssHtml(oPhoto);
					oPhotoHistory.prev.push(oPhotoHistory.current);
					oPhotoHistory.current = oPhoto;
				} else {
					var max = pPhotos.length - 1, min = 0, nRandom = Math.floor(Math.random() * (max - min + 1)) + min;
					var oPhoto = pPhotos.splice(nRandom, 1)[0];
					updateCssHtml(oPhoto);
					oPhotoHistory.prev.push(oPhotoHistory.current);
					oPhotoHistory.current = oPhoto;
				}
			}
		},
		changeBack: function () {
			if (oPhotoHistory.prev.length > 0) {
				var oPhoto = oPhotoHistory.prev.pop();
				updateCssHtml(oPhoto);
				oPhotoHistory.next.push(oPhotoHistory.current);
				oPhotoHistory.current = oPhoto;
			} else {
				showToast('No more preivous background.');
			}
		}
	};
})();

// Manual Change Background
$('#changeBgBtn').on('click', function () {
	oBgChanger.change();
});

// create a simple instance, by default, it only adds horizontal recognizers
var oHammer = new Hammer($('.bgimg')[0]);
// listen to events...
oHammer.on("swiperight", function (e) {
	oBgChanger.change();
});
oHammer.on("swipeleft", function (e) {
	oBgChanger.changeBack();
});

// Auto Change Background
var fAutoChangeBgInterval = null;
$('#autoChangeBgBtn input').change(function () {
	if (this.checked) {
		fAutoChangeBgInterval = setInterval(function () {
			oBgChanger.change();
		}, 1000 * 60 * 10);
	} else {
		clearInterval(fAutoChangeBgInterval);
	}
});
$('#autoChangeBgBtn input').click(); // Check it programmically to invoke the change event listener; must call this after the declaration of change event listener