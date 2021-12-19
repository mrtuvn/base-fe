// ajax default send type setting
var commonSendType = 'post';
// grid
if(location.port == '3000') $('body').addClass('show-grid');

var treasureDataFlag; // LGEITF-182
var digitalDataLayer = [];
// for debug
var DEBUG = false;
function debugMarkup() {
	DEBUG = true;
	$('.component').each(function() {
		var $obj = $(this);
		var css=$obj.attr('class').replace('component ', '').substr(0,7);
		if($(this).parent().is('.component-wrap')) {
			$(this).parent().css({'outline':'2px dashed rgb(14, 222, 51)'}).append('<div style="position:absolute;right:0;top:0;padding:0 20px;background:rgb(14, 222, 51);opacity:0.5;text-transform:none;color:#fff;z-index:1000;">'+css+'</div>').find('.component').css({'border':'2px dashed  #03A9F4'});
		} else {
			$(this).css({'outline':'2px dashed #03A9F4'}).append('<div style="position:absolute;right:0;top:0;padding:0 20px;background:#03A9F4;opacity:0.5;text-transform:none;color:#fff;z-index:1000;">'+css+'</div>');
		}
	});
	$('h1, h2, h3, h4, h5, h6').each(function() {
		$(this).css({'outline':'5px dashed red'});
	});
	$('body').append("<style>h1:before {content:'h1';color:red;font-size:12px;font-weight:700;position:absolute;margin:0 0 0 -30px;}h2:before {content:'h2';color:red;font-size:12px;font-weight:700;position:absolute;margin:0 0 0 -30px;}h3:before {content:'h3';color:red;font-size:12px;font-weight:700;position:absolute;margin:0 0 0 -30px;}h4:before {content:'h4';color:red;font-size:12px;font-weight:700;position:absolute;margin:0 0 0 -30px;}h5:before {content:'h5';color:red;font-size:12px;font-weight:700;position:absolute;margin:0 0 0 -30px;}h6:before {content:'h6';color:red;font-size:12px;font-weight:700;position:absolute;margin:0 0 0 -30px;}</style>");
}
var testCookie = function() {
	console.log('s_ppv', getCookie("s_ppv"));
	debugMarkup();
	setTimeout(function() {
		ePrivacyCookies.controlCookieList();
	}, 100);
	setTimeout(function() {
		console.log('s_ppv', getCookie("s_ppv"));
	}, 1500);
};

var COUNTRY_CODE = $('html').data('countrycode'), // e.g) ch_de
	LANGUAGE_CODE = $('html').attr('lang'),
	DIRECTION_CODE = $('html').attr('dir'),
	OBS_LOGIN_FLAG = $('.navigation').data('obs'),
	USE_FBQ = false,
	// 20200429 START 박지영 - rtl 추가
	ISRTL = ($('html[dir=rtl]').length>0) ? true : false,
	// 20200429 END
	USE_NEW_FBQ = false;//LGEIS-10 20200327 add
	if(!OBS_LOGIN_FLAG) OBS_LOGIN_FLAG = 'N';

// PJTOBS-32 Start 
	var ISVIP = false;
// PJTOBS-32 End
	var SIGN_IN_STATUS = 'N'; //LGEDE-354

// 20200611 START 박지영 - IE main 에서 path 추가된 쿠키 잘 안 읽히는 case 예외 처리
/* 20201012 SSO domain 추가  */
var agent = navigator.userAgent.toLowerCase();
var ISMS = ((navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1) || (window.navigator.userAgent.indexOf("Edge") > -1))  ? true : false, // ie or edge
	ISMAIN = (location.pathname === '/'+COUNTRY_CODE.toLowerCase()) ? true : false,
	ISSSO = (location.host === 'ssodev.lg.com' || location.host === 'sso.lg.com') ? true : false,
	HOMEUSECOOKIELIST = new Array(),
	CANGETCART = true;

if(ISMAIN && ISMS) CANGETCART = false;
/* 20201012 SSO domain 추가  */
if(ISSSO) CANGETCART = false;
// 20200611 END

// browser supported check (popup)
var browse_check = function () {
	if (!document.getElementById("modal_browse_supported_guide")) return false;

	var browser_ver = navigator.userAgent,
		filter = /(msie) [2-9]/i;

	var _this = browse_check,
		layer = {
			popup_layer: document.getElementById("modal_browse_supported_guide"),
			popup_back_layer: document.getElementById("modal-background"),
			popup_close: document.getElementById("modal-layer-close")
		},
		classSet = {
			activate: "active",
			popup_layer: "broswe-check-popup-layer",
			popup_back_layer: "modal-background"
		};

	_this.init = function () {
		if (browser_ver.search(filter) !== -1) {
			//console.log("ie lower case");
			_this.layer_active();
		}
		_this.addEvent();
	};

	_this.addEvent = function () {
		layer.popup_back_layer.onclick = function () {
			_this.layer_close();
		};
		layer.popup_close.onclick = function () {
			_this.layer_close();
		};
	};

	_this.layer_active = function () {
		layer.popup_layer.className = classSet.popup_layer + " " + classSet.activate;
		layer.popup_back_layer.className = classSet.popup_back_layer + " " + classSet.activate;
	};

	_this.layer_close = function () {
		if (layer.popup_layer.className.indexOf("active") > 1) {
			layer.popup_layer.className = classSet.popup_layer;
			layer.popup_back_layer.className = classSet.popup_back_layer;
		}
	};
	_this.init();
};
browse_check();

// isInScreen
var isInScreen = function(t, b) {
	var sTop = $(window).scrollTop();
	var bTop = $(window).scrollTop() + $(window).height();
	if(((t>sTop || b<bTop) && !(t>bTop || b<sTop)) || (t<sTop && b>bTop)) {
		return true;
	} else {
		return false;
	}
};

// 20200611 START 박지영 - IE main 에서 path 추가된 쿠키 잘 안 읽히는 case 예외 처리 
// addHomeCookie
var addHomeCookie = function(data) {
	HOMEUSECOOKIELIST.LG5_RecentlyView = data.LG5_RecentlyView;
	HOMEUSECOOKIELIST.LG5_CompareCart = data.LG5_CompareCart;
	HOMEUSECOOKIELIST.LG5_CartID = data.LG5_CartID;
	HOMEUSECOOKIELIST.LG5_SearchResult = data.LG5_SearchResult;

	CANGETCART = true;
	
	/* 20201012 SSO domain 추가  */
	if((OBS_LOGIN_FLAG=='Y' && ISMAIN && ISMS) || (OBS_LOGIN_FLAG=='Y' && ISSSO)) {
			setTimeout(function() {
				// get the number of items in the cart
				if(addToCart) addToCart.init();
			}, 100);
	}
}
// 20200611 END

// Scripts that prevent users from entering script code
var xssfilter = function (content, isHTML) {
	if(typeof content == 'string' || isHTML) {
		// Do not change the running order below.
		var returnTxt =  content.replace(/%3C/g, '').replace(/%3E/g, '') // <와 > 삭제 (for url)
						.replace(/javascript%3A/gi, '') // javascript: 을 삭제 (for url, 대소문자 구분없이)
						.replace(/%22/g, '').replace(/%27/g, '') // "와 '를 삭제 (for url)
						.replace(/¼/g, '<').replace(/¾/g, '>')
						.replace(/\+ADw\-/g, '<').replace(/\+AD4\-/g, '>')
						.replace(/\0/gi, ' ').replace(/&#x09;/g, '').replace(/&#x0A;/g, '').replace(/&#x0D;/g, '') // 공백 대체 문자 제거
						.replace(/j( *	*\\*<*>*|\/\*.*\*\/)a( *	*\\*<*>*|\/\*.*\*\/)v( *	*\\*<*>*|\/\*.*\*\/)a( *	*\\*<*>*|\/\*.*\*\/)s( *	*\\*<*>*|\/\*.*\*\/)c( *	*\\*<*>*|\/\*.*\*\/)r( *	*\\*<*>*|\/\*.*\*\/)i( *	*\\*<*>*|\/\*.*\*\/)p( *	*\\*<*>*|\/\*.*\*\/)t( *	*\\*<*>*|\/\*.*\*\/):/gi, '') // javascript: 제거 (대소문자 구분 없이)
						.replace(/v( *	*\\*<*>*|\/\*.*\*\/)b( *	*\\*<*>*|\/\*.*\*\/)s( *	*\\*<*>*|\/\*.*\*\/)c( *	*\\*<*>*|\/\*.*\*\/)r( *	*\\*<*>*|\/\*.*\*\/)i( *	*\\*<*>*|\/\*.*\*\/)p( *	*\\*<*>*|\/\*.*\*\/)t( *	*\\*<*>*|\/\*.*\*\/):/gi, '') // vbscript: 제거 (대소문자 구분 없이)
						.replace(/l( *	*\\*<*>*|\/\*.*\*\/)i( *	*\\*<*>*|\/\*.*\*\/)v( *	*\\*<*>*|\/\*.*\*\/)e( *	*\\*<*>*|\/\*.*\*\/)s( *	*\\*<*>*|\/\*.*\*\/)c( *	*\\*<*>*|\/\*.*\*\/)r( *	*\\*<*>*|\/\*.*\*\/)i( *	*\\*<*>*|\/\*.*\*\/)p( *	*\\*<*>*|\/\*.*\*\/)t( *	*\\*<*>*|\/\*.*\*\/):/gi, '') // livescript: 제거 (대소문자 구분 없이)
						.replace(/e( *	*\\*<*>*|\/\*.*\*\/)x( *	*\\*<*>*|\/\*.*\*\/)p( *	*\\*<*>*|\/\*.*\*\/)r( *	*\\*<*>*|\/\*.*\*\/)e( *	*\\*<*>*|\/\*.*\*\/)s( *	*\\*<*>*|\/\*.*\*\/)s( *	*\\*<*>*|\/\*.*\*\/)i( *	*\\*<*>*|\/\*.*\*\/)o( *	*\\*<*>*|\/\*.*\*\/)n( *	*\\*<*>*|\/\*.*\*\/)\(/gi, '') // expression( 제거 (대소문자 구분 없이)
						.replace(/&#[x]*[0-9]+/gi, '.') // encoding 방지
						.replace(/<script.+\/script>/gi, '') // script로 시작해서 /script로 끝나는 태그 제거 (대소문자 구분없이)
						.replace(/String\.fromCharCode/gi, '')
						.replace(/Set\.constructor/gi, '')
						.replace(/FSCommand/gi, '')
						.replace(/seekSegmentTime/gi, '')
						.replace(/eval\(/gi, '')
						.replace(/window\.on.+/gi, '')
						;

		// tag
		returnTxt = returnTxt.replace(/<link./gi, '').replace(/<\/link>/gi, '')
						.replace(/<script./gi, '').replace(/<\/script>/gi, '')
						.replace(/<style./gi, '').replace(/<\/style>/gi, '')
						.replace(/<meta./gi, '').replace(/<\/meta>/gi, '')
						.replace(/<object./gi, '').replace(/<\/object>/gi, '')
						.replace(/<embed./gi, '').replace(/<\/embed>/gi, '')
						.replace(/<iframe./gi, '').replace(/<\/iframe>/gi, '')
						.replace(/<applet./gi, '').replace(/<\/applet>/gi, '')
						.replace(/<base./gi, '').replace(/<\/base>/gi, '')
						.replace(/<frameset./gi, '').replace(/<\/frameset>/gi, '')
						.replace(/<xml./gi, '').replace(/<\/xml>/gi, '')
						;

		// form, input
		if(isHTML=='form') {
			returnTxt = returnTxt.replace(/(\%20| |	|\\|\/|\"|\'|\.)+on[a-z]+\=/gi, '');
			//returnTxt = returnTxt.replace(/(\%20| |	|\\|\/|\"|\'|\.)+on[a-z]+(!?)[a-z]+\=/gi, '');
			returnTxt = returnTxt.replace(/\(/g, '').replace(/\)/g, '');
		} else {
			returnTxt = returnTxt.replace(/(\%20| |	|\\|\/|\"|\'|\.+)on([a-z]+\=)/gi, '$1&#111;n$2');
		}

		// <와 > 제거
		if(!isHTML || isHTML=='form') {
			returnTxt = returnTxt.replace(/</g, '').replace(/>/g, '')
						.replace(/&lt/gi, '').replace(/&gt/gi, '')
						;
		}

		//console.log('XSS :', typeof content, content, returnTxt);
		return returnTxt;
	} else if (typeof content == 'object') {
		$.each(content, function(key, value) {
			content[key]=xssfilter(value);
		});
		return content;
	} else {
		return content;
	}
};

// price
// LGEGMC-1475 FR추가
// LGEGMC-1518 CZ추가
var countriesPriceCommonMinJsTestValue='1';
var countriesPrice1 = 'cz, fr, pl, ru';  // , 를 공백으로 변경	
// 20200421 START 박지영 tr 추가  LGEDE-240 DE추가, LGEGMC-2049 Start
var countriesPrice2 = 'it, vn, tr, de, cl'; // , 를 dot으로 변경
// 20200421 END, LGEGMC-2049 End
// 20200511 START 박지영 ca_en, ca_fr 추가
// 20200601 START 박지영 sa, sa_en 추가
// 20200603 START 박지영 sa, sa_en 삭제, redmine 8063 - 콤마 다시 사용
/* LGEAU-542 AU 국가 제거 */
var countriesPrice3 = 'in, tw, th, ca_en, ca_fr'; // , 를 사용하지 않음
/* //LGEAU-542 AU 국가 제거 */
// 20200603 END
// 20200601 END
// 20200511 END
var changeFormatPrice = function(num) {
	if(num==0) return 0;
	num = parseFloat(num);
	if(isNaN(num)) return 0;
	var reg = /(^[+-]?\d+)(\d{3})/;
	var n = (num + '');
	var cc = COUNTRY_CODE.toLowerCase();
	if(countriesPrice1.indexOf(cc) != -1) {
		while (reg.test(n)) n = n.replace(reg, '$1' + ' ' + '$2');
	} else if(countriesPrice2.indexOf(cc) != -1) {
		while (reg.test(n)) n = n.replace(reg, '$1' + '.' + '$2');
	} else if(countriesPrice3.indexOf(cc) != -1) {
		// do nothing
	} else {
		// else
		while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');
	}
	return n;
};
//LGEDE-240 DE국가 추가
//LGEGMC-1475 FR추가
// LGEGMC-1518 CZ추가
var countryiesPriceCent1 = 'cz, fr, it, pl, de';   // 소수점을 , 로 변경
// 20200421 START 박지영 tr 추가 
var countryiesPriceCent2 = 'in, tw, th, vn, tr'; // 소수점 사용하지 않음
// 20200421 END
var changeFormatPriceCent = function(num) {
	var n='';
	// 20200316 START 박지영 null이 string으로 들어오는 경우 발생
	if(num!='null' && num!=null && num!='') {
	// 20200316 END
		var cc = COUNTRY_CODE.toLowerCase();
		if(countryiesPriceCent1.indexOf(cc) != -1) {
			n = ',' + num;
		} else if(countryiesPriceCent2.indexOf(cc) != -1) {
			n='';
		} else {
			// else // dot 사용
			n='.'+num;
		}
	}
	return n;
};
var changeFormatFullPrice = function(price, cent) {
	return changeFormatPrice(price) + changeFormatPriceCent(cent);
};

// test
//COUNTRY_CODE = 'it';
var countryUnitObsFlag;  // LGEKZ-111
var obsUnitcountry;
var obsUnitCookieExpires;
/* BTOBGLOBAL-409 20210310 add */
if (COUNTRY_CODE == 'global'){
	if($(".navigation").hasClass("b2b")){
		$('head').prepend('<script type="text/javascript">var _elqQ = _elqQ || [];_elqQ.push(["elqSetSiteId", "2523692"]);_elqQ.push(["elqTrackPageView", window.location.href]);(function () {function async_load() {var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;s.src = "//img03.en25.com/i/elqCfg.min.js";var x = document.getElementsByTagName("script")[0]; x.parentNode.insertBefore(s, x);}if (window.addEventListener) window.addEventListener("DOMContentLoaded", async_load, false);else if (window.attachEvent) window.attachEvent("onload", async_load); })();</script>');
	}
}
/* //BTOBGLOBAL-409 20210310 add */

/* BTOBGLOBAL-423, PJTROLLOUT21-7, BTOBGLOBAL-559 start */
if (COUNTRY_CODE != 'global') {
	var eloquaCountries = ['africa','africa_fr','ar','br','ca_en','ca_fr','cac','cac_en','cl','cn','co','cz','eastafrica','eg_en','hu','id','levant_ar','levant_en','mx','pe','ph','pl','sa','sa_en','th','tr','ua','vn','za','ae','ae_ar','au','in','nz','uk'];
	if (eloquaCountries.indexOf(COUNTRY_CODE) >= 0) {
		if ($(".navigation").hasClass("b2b")) {
			$('head').prepend('<script type="text/javascript">var _elqQ = _elqQ || [];_elqQ.push(["elqSetSiteId", "2523692"]);_elqQ.push(["elqTrackPageView", window.location.href]);(function () {function async_load() {var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;s.src = "//img03.en25.com/i/elqCfg.min.js";var x = document.getElementsByTagName("script")[0]; x.parentNode.insertBefore(s, x);}if (window.addEventListener) window.addEventListener("DOMContentLoaded", async_load, false);else if (window.attachEvent) window.attachEvent("onload", async_load); })();</script>');
		}
	}
}
/* BTOBGLOBAL-423, PJTROLLOUT21-7, BTOBGLOBAL-559 end */

// adobe
function findPrice($obj) {
	var cc = COUNTRY_CODE.toLowerCase();
	var va = $obj.closest('.item').find('.products-info .price-area .purchase-price .price').text(); // for product list, mylg > my product
	if (!va) va = $obj.closest('.bundle').find('.purchase-price .price').text(); // for GPC0006
	if (!va) va = $obj.closest('.pdp-info').find('.price-area .purchase-price .price').text(); // for pdp summary (GPC0009)
	if (!va) va = $obj.closest('.model-info').find('.selling-price').text(); // for GPC0023
	if (!va) va = $obj.closest('.item').find('.price-area .purchase-price .price').text(); // for GPC0058
	if (!va) va = $obj.closest('li').find('.hidden-price').text(); // for gnb search
	if (!va) va = String($obj.data('price')); // for gnb search preview
	// for GPC0011
	if (!va && $obj.closest('.GPC0011').length>0){
		va = $('.GPC0009').find('.pdp-info').find('.price-area .purchase-price').eq(0).find('.price').text();
	}
	if (!va || va=="undefined") va = '';
	//va = va.replace(/[\{\}\[\]\/?,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, '');
	// price 되돌림 (세자리수 콤마 제거)
	if(countriesPrice1.indexOf(cc) != -1) {
		va = va.replace(/ /gi, '');
	} else if(countriesPrice2.indexOf(cc) != -1) {
		va = va.replace(/\./gi, '');
	} else if(countriesPrice3.indexOf(cc) != -1) {
	} else {
		va = va.replace(/,/gi, '');
	}
	// cent 되돌림 (소수점을 dot로 변경)
	if(countryiesPriceCent1.indexOf(cc) != -1) {
		va = va.replace(/,/gi, '.');
	} else if(countryiesPriceCent2.indexOf(cc) != -1) {
	} else {
	}
	// number로 변경
	va = va.replace(/[^0-9\.]/gi, ''); // 숫자와 dot을 제외한 나머지 모두 삭제
	va = Number(va);
	console.log('	adobe-price:', va);
	return va;
}
function getStepProductCode() {
	var code;
	if($('#modelSummary').length>0) code = $('#modelSummary').data('adobe-salesmodelcode');
	if(!code) code='';
	return code;
}
function changeTitleFormat(title) {
	// Please do not modify any spaces in the code below.
	//return $.trim(title.toLowerCase().replace(/[^a-z0-9_ ]/gi, "")).replace(/ /gi, "_").replace(/_+/gi, "_");
	var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^+<>®™@\#$%&\\\=\(\'\"]/gi;
	title = $.trim(title).toLowerCase().replace(regExp, "").replace(/\-/gi, "_").replace(/_+/gi, "_").replace(/ +/gi, "_");
	return title;
}
function adobeSatellite(name, param) {
	console.log('adobe code : ' + name, param);
	if (typeof _satellite != 'undefined' && typeof _satellite.track == 'function' && typeof _dl !== 'undefined') {
		_satellite.track(name, param);
	}
}
function adobeTrackEvent(name, param) {
	console.log('adobe code : ' + name, param);
	if (typeof _trackEvent == 'function' && typeof _dl !== 'undefined') {
		_trackEvent(
			$.extend(_dl, param)
		);
	}
}

/* LGEGMC-455 20200722 add*/
function findSalesSuffixCode($obj) {
    var va = $obj.closest('.item').find('a.visual[data-adobe-salessuffixcode]').data('adobe-salessuffixcode'); // for product list
    if (!va) va = $obj.closest('.bundle').find('a[data-adobe-salessuffixcode]').data('adobe-salessuffixcode'); // for GPC0006
    if (!va) va = $obj.closest('.GPC0009').data('adobe-salessuffixcode'); // for GPC0009
    if (!va) va = $obj.closest('.GPC0023').find('.model-info').data('adobe-salessuffixcode'); // for GPC0023
    if (!va) va = $obj.closest('.item').find('.img a[data-adobe-salessuffixcode]').data('adobe-salessuffixcode'); // for GPC0058
    if (!va) va = $obj.closest('li').find('.txt > a').data('adobe-salessuffixcode'); // for gnb search
    if (!va) va = $obj.closest('.match-product-list').find('.product-image').data('adobe-salessuffixcode'); //for search preview 
    // for GPC0011
    if (!va && $obj.closest('.GPC0011').length){
        va = $('.GPC0009').data('adobe-salessuffixcode');
    }
  //PJTPLP-10 WISH
	if (!va) va = $obj.closest('[data-wish-basic-info]').data('adobe-salessuffixcode'); // WISH TRACKING COMMON
    va = va || '';
    console.log('    adobe-salessuffixcode:', va);
    return va;
}

function findSalesModel($obj) {
	var suffix = findSalesSuffixCode($obj);
	return (findSalesModelCode($obj) + (suffix ? '.' : '') + suffix);
}
/* //LGEGMC-455 20200722 add*/

function findModelName($obj) {
	var va = $obj.closest('.item').find('a.visual[data-adobe-modelname]').data('adobe-modelname'); // for product list
	if (!va) va = $obj.closest('.bundle').find('a[data-adobe-modelname]').data('adobe-modelname'); // for GPC0006
	if (!va) va = $obj.closest('.GPC0009').data('adobe-modelname'); // for GPC0009
	if (!va) va = $obj.closest('.GPC0023').find('.model-info').data('adobe-modelname'); // for GPC0023
	if (!va) va = $obj.closest('.item').find('.img a[data-adobe-modelname]').data('adobe-modelname'); // for GPC0058
	if (!va) va = $obj.closest('li').find('.txt > a').data('adobe-modelname'); // for gnb search
	if (!va) va = $obj.closest('.match-product-list').find('.product-image').data('adobe-modelname'); //for search preview 
	// for GPC0011
	if (!va && $obj.closest('.GPC0011').length>0){
		va = $('.GPC0009').data('adobe-modelname');
	}
	//PJTPLP-10 WISH
	if (!va) va = $obj.closest('[data-wish-basic-info]').data('adobe-modelname'); // WISH TRACKING COMMON
	
	if (!va || va=="undefined") va = '';
	console.log('	adobe-modelName:', va);
	return va;
}
function findSalesModelCode($obj) {
	var va = $obj.closest('.item').find('a.visual[data-adobe-salesmodelcode]').data('adobe-salesmodelcode'); // for product list
	if (!va) va = $obj.closest('.bundle').find('a[data-adobe-salesmodelcode]').data('adobe-salesmodelcode'); // for GPC0006
	if (!va) va = $obj.closest('.GPC0009').data('adobe-salesmodelcode'); // for GPC0009
	if (!va) va = $obj.closest('.GPC0023').find('.model-info').data('adobe-salesmodelcode'); // for GPC0023
	if (!va) va = $obj.closest('.item').find('.img a[data-adobe-salesmodelcode]').data('adobe-salesmodelcode'); // for GPC0058
	if (!va) va = $obj.closest('li').find('.txt > a').data('adobe-salesmodelcode'); // for gnb search
	if (!va) va = $obj.closest('.match-product-list').find('.product-image').data('adobe-salesmodelcode'); //for search preview 
	// for GPC0011
	if (!va && $obj.closest('.GPC0011').length>0){
		va = $('.GPC0009').data('adobe-salesmodelcode');
	}
	//PJTPLP-10 WISH
	if (!va) va = $obj.closest('[data-wish-basic-info]').data('adobe-salesmodelcode'); // WISH TRACKING COMMON
	
	if (!va || va=="undefined") va = '';
	console.log('	adobe-salesModelCode:', va);
	return va;
}
function findModelCount($obj) {
	var va = 1;
	if($obj.closest('.GPC0010').length>0) num = $obj.closest('.GPC0010').find('.selected-items .selected-number .number').text();
	console.log('	adobe-count:', va);
	return va;
}
//where to buy
$('body').on('click', '.where-to-buy', function () {
	/* LGEMS-20, LGEMS-38 Start   */
	if (!$(this).closest(".component").hasClass("GPC0009") || $(".tab-menu-belt").length==0 || $(this).hasClass("wtb-external")) { /*LGEGMC-1319 20210318 modify */
	/* LGEMS-20, LGEMS-38 End  */
	adobeTrackEvent('where-to-buy', {
		/* LGEGMC-1279 2021.03.12 start */
		//아래 주석 두 줄이 원본
		//products: [{sales_model_code : findSalesModel($(this)), model_name: findModelName($(this))}], /* LGEGMC-455 20200722 modify */
		//page_event: {where_to_buy_click: true}
		products: [{
			level1 : $(this).attr('data-buname-one'),
			level2 : $(this).attr('data-buname-two'),
			level3 : $(this).attr('data-buname-three'),
			sales_model_code : $(this).attr('data-model-salesmodelcode'),
			model_name : $(this).attr('data-sku'),
			bu : $(this).attr('data-buname-one')
		}],
		page_event: {wtb_click: true}
		/* LGEGMC-1279 2021.03.12 end */
	});
	
	/* LGEGMC-1279 2021.03.12 start */
    //dataLayer.push({'event': 'wtb_click'});
	/* LGEGMC-1279 2021.03.17 start */
	var modelYear = nvl($(this).attr('data-model-year'), '');
	if (modelYear == '') {
		modelYear = $('.btn.where-to-buy').attr('data-model-year');
	}
	/* LGEGMC-1279 2021.03.17 end */
	var price = "";
	price = $(this).attr('data-price');
	if(price == '.' || price == '.00' || price == '0.0' || price == '0'){
		price = "";
	} 
	var msrp = "";
	msrp = $(this).attr('data-msrp');
	if($(this).closest('.GPC0011').length>0){
		msrp = nvl($('.js-compare').attr('data-msrp'), '');
		if(msrp == '.' || msrp == '.00' || msrp == '0.0' || msrp == '0'){
			msrp = "";
		} 
	} else{
		msrp = $(this).attr('data-msrp');
	}
	if(msrp == '.' || msrp == '.00' || msrp == '0.0' || msrp == '0'){
		msrp = "";
	} 
	var cartBtn = '';
	if($(this).closest('.GPC0011').length>0){
		if( $('.GPC0009').find('.add-to-cart').length>0){
			cartBtn = 'Y'
		} else{
			cartBtn = 'N'
		}
	} else if($(this).closest('.GPC0007').length>0 || $(this).closest('.GPC0026').length>0 ){
		if($(this).parent('.button').find('.add-to-cart').hasClass('active')){
			cartBtn = 'Y'
		} else{
			cartBtn = 'N'
		}
	} else{
		if($(this).parent('.button').find('.add-to-cart').length>0){
			cartBtn = 'Y'
		} else{
			cartBtn = 'N'
		}
	}
	dataLayer.push({
		'event'			: 'wtb_click',
		'superCategory'	: $(this).attr('data-super-category-name'),
		'category'		: $(this).attr('data-buname-two'),
		'subcategory'	: $(this).attr('data-buname-three'),
		'modelYear'		: modelYear, /* LGEGMC-1279 2021.03.17 modify */
		'modelName'		: $(this).attr('data-sku'),
		'modelCode'		: $(this).attr('data-model-id'),
		'salesModelCode': $(this).attr('data-model-salesmodelcode'),
		'sku'			: $(this).attr('data-sku'),
		'suffix'        : $(this).attr('data-model-suffixcode'),
		'bu'            : $(this).attr('data-buname-one'),
		'price'         : price,
		'currencyCode'  : $('.currency-code').val(),
		'dimension185'  : $('.navigation').attr('data-obs-group'),
		'metric4'       : msrp,
		'cart_btn'      : cartBtn
 	});
	console.log('click.where-to-buy');
	/* LGEGMC-1279 2021.03.12 end */
		 
	if(USE_FBQ){
		try {
			console.log('run fbq');
			//LGESG-64 modify
			if(COUNTRY_CODE.toLowerCase() == 'sg' && USE_NEW_FBQ == '' ) {
				console.log('run fbq FindLocation');
				if(typeof fbq=='function') fbq('track','FindLocation');
			} else {
				/*LGEIS-10 20200327 LGEMS-12 20200423 modify*/
				if(USE_NEW_FBQ!==''){
					console.log('run new fbq : ' + USE_NEW_FBQ);
					if(typeof fbq=='function') fbq('track', "\'"+USE_NEW_FBQ+"\'");
				}else{
						if(typeof fbq=='function') fbq('track','Purchase');
						console.log('run fbq Purchase');
				}
				/*//LGEIS-10 20200327,LGEMS-12 20200423 modify*/

			}
		} catch(err) {
			
		}
	}
	/* LGEMS-20, LGEMS-38 Start   */
	}
	/* LGEMS-20, LGEMS-38 End   */
	if($(this).closest('.GPC0009').length>0) {
		$('.GPC0011').find('a.where-to-buy').eq(0).click();
	}
});
// LGEGMC-1279 start
// buy now
$('body').on('click', '.in-buynow', function () {
	if ($(this).hasClass('pre-order') == false) {
		adobeTrackEvent('buy-now', {
			products: [{
				level1 : $(this).attr('data-buname-one'),
				level2 : $(this).attr('data-buname-two'),
				level3 : $(this).attr('data-buname-three'),
				sales_model_code : $(this).attr('data-model-salesmodelcode'),
				model_name : $(this).attr('data-sku'),
				bu : $(this).attr('data-buname-one')
			}],
			page_event: {buy_now_click: true}
		});
		
		var price = "";
		price = $(this).attr('data-price');
		if(price == '.' || price == '.00' || price == '0.0' || price == '0'){
			price = "";
		} 
		var msrp = "";
		msrp = $(this).attr('data-msrp');
		if(msrp == '.' || msrp == '.00' || msrp == '0.0' || msrp == '0'){
			msrp = "";
		} 
	    //dataLayer.push({'event': 'buy_now_click'});
		dataLayer.push({
			'event'			: 'buy_now_click',
			'superCategory'	: $(this).attr('data-category-name'),
			'category'		: $(this).attr('data-buname-two'),
			'subcategory'	: $(this).attr('data-buname-three'),
			'modelYear'		: $(this).attr('data-model-year'),
			'modelName'		: $(this).attr('data-sku'),
			'modelCode'		: $(this).attr('data-model-id'),
			'salesModelCode': $(this).attr('data-model-salesmodelcode'),
			'sku'			: $(this).attr('data-sku'),
			'suffix'        : $(this).attr('data-model-suffixcode'),
			'bu'            : $(this).attr('data-buname-one'),
			'price'         : price,
			'currencyCode'  : $('.currency-code').val(),
			'dimension185'  : $('.navigation').attr('data-obs-group'),
			'metric4'       : msrp
		});
		console.log('click.in-buynow');
	}
});

// LGEGMC-1279 end
// inquiry to buy
$('body').on('click', '.inquiry-to-buy', function () {
	adobeTrackEvent('inquiry-to-buy', {
		// LGEGMC-585
		level1 : (typeof standardData === "undefined") ? '' : standardData.level1,
		level2 : (typeof standardData === "undefined") ? '' : standardData.level2,
		level3 : (typeof standardData === "undefined") ? '' : standardData.level3,
		sales_model_code: findSalesModel($(this)),
		// LGEGMC-585 End
		products: [{sales_model_code : findSalesModel($(this)), model_name: findModelName($(this))}], /* LGEGMC-455 20200722 modify */
		page_event: {inquiry_to_buy_click: true}
	});
});
/* LGEID-32 Start */
//gp-gnb-inquiry-to-buy
$('body').on('click', '.gp-gnb-inquiry-to-buy', function () {
	if(COUNTRY_CODE.toLowerCase()  == 'id'  ) {
		console.log('run fbq');
		console.log('run fbq Contact');
		if(typeof fbq=='function') fbq('track','Contact');
	}
	// LGEGMC-585
	adobeTrackEvent('inquiry-to-buy', {
		level1 : (typeof standardData === "undefined") ? '' : standardData.level1,
		level2 : (typeof standardData === "undefined") ? '' : standardData.level2,
		level3 : (typeof standardData === "undefined") ? '' : standardData.level3,
		sales_model_code: findSalesModel($(this)),
		products: [{sales_model_code : findSalesModel($(this)), model_name: findModelName($(this))}], /* LGEGMC-455 20200722 modify */
		page_event: {inquiry_to_buy_click: true}
	});
	// LGEGMC-585 End
});
/* LGEID-32 End */
// find a dealer
$('body').on('click', '.find-a-dealer', function () {
	adobeTrackEvent('find-a-dealer', {
		products: [{sales_model_code : findSalesModel($(this)), model_name: findModelName($(this))}], /* LGEGMC-455 20200722 modify */
		page_event: {find_a_dealer_click: true}
	});
});
// PJTPLP-10 GILS
/* data-page-event 정의
*/

$('body').on('click', '[data-adobe-tracking-wish="Y"]', function () {
	if($('#tempData').length == 0) $('body').append($('<div id="tempData">'));
	var el_tempData = $('#tempData');
	var page_event  = {};
	if(typeof $(this).attr('data-page-event') == 'undefined'){
		console.log('check page event');
		return;
	}
	var dataLayerPageEvent = $(this).attr('dataLayer-page-event');
	var pageEventStr = $(this).attr('data-page-event');
	page_event[$(this).attr('data-page-event')] = true;
	var productMeta = getProductMeta(this);
	//PJTGADL-2
	var dataLayerMeta = getDataLayerMeta(this);
	if(pageEventStr == 'plp_wish_icon_select' || pageEventStr == 'plp_wish_icon_unselect' || pageEventStr == 'pdp_wish_icon_select' || pageEventStr == 'pdp_wish_icon_unselect'){
		return;
	}
	
	adobeTrackEvent(pageEventStr, {
		products: [
			productMeta
		]
		,page_event: page_event
	});
	
	//PJTGADL-2
	if(pageEventStr == 'pdp_share_copyicon' || pageEventStr == 'plp_share_copyicon' ){
		var dataLayerpushData =  $.extend({
			'event': 'share_product_click',
			},dataLayerMeta);
			dataLayer.push(dataLayerpushData);
	} else if(pageEventStr == 'mylg_wish_btn_wtb' || pageEventStr == 'mywish_btn_wtb' || pageEventStr == 'mywish_btn_buynow' || pageEventStr == 'mylgWishBtnBuynow'){
		var dataLayerpushData =  $.extend({
			'event': dataLayerPageEvent,
			},dataLayerMeta);
			dataLayer.push(dataLayerpushData);
	}
	
	//PJTGADL-2
	function getDataLayerMeta(elObj){
		var dataLayer = {};
		 switch(pageEventStr){
		    case 'mylg_wish_btn_wtb' : 
		    case 'mywish_btn_buynow' :    
		    case 'mylgWishBtnBuynow' :
		    case 'mywish_btn_wtb'    :
	    	var price = "";
	    	price = $(elObj).attr('data-price');
	    	if($(elObj).attr('data-price') == '.' || $(elObj).attr('data-price') == '.00' || $(elObj).attr('data-price') == '0.0' || $(elObj).attr('data-price') == '0'){
	    		price = "";
	    	} 
	    	var msrp = "";
	    	msrp = $(elObj).attr('data-msrp');
	    	if($(elObj).attr('data-msrp') == '.' || $(elObj).attr('data-msrp') == '.00' || $(elObj).attr('data-msrp') == '0.0' || $(elObj).attr('data-msrp') == '0'){
	    		msrp = "";
	    	} 
	    	var cartBtn = '';
	    	if($(this).parents('.wish-buy').find('.add-to-cart').length>0){
	    		cartBtn = 'Y'
	    	} else{
	    		cartBtn = 'N'
	    	}
	    	var modelYear = nvl($(elObj).attr('data-model-year'), '');
			dataLayer['superCategory'] = $(elObj).attr('data-category-name');
			dataLayer['category'] = $(elObj).attr('data-buname-two');
			dataLayer['subcategory'] =  $(elObj).attr('data-buname-three');
			dataLayer['modelYear']	= modelYear;
			dataLayer['modelName']	=$(elObj).attr('data-sku');
			dataLayer['modelCode']	= $(elObj).attr('data-model-id');
			dataLayer['salesModelCode'] = $(elObj).attr('data-model-salesmodelcode');
			dataLayer['sku'] = $(elObj).attr('data-sku');
			dataLayer['suffix']  = $(elObj).attr('data-model-suffixcode');
			dataLayer['bu']  = $(elObj).attr('data-buname-one');
			dataLayer['price']  = price;
			dataLayer['currencyCode']  = $('.currency-code').val();
			dataLayer['dimension185']  = $('.navigation').attr('data-obs-group');
			dataLayer['metric4']  = msrp;
			if(pageEventStr=='mylg_wish_btn_wtb' || pageEventStr=='mywish_btn_wtb'){
		    dataLayer['cart_btn']  = cartBtn;
			}
			 el_tempData.data({'dataLayer':dataLayer});
		        break;
		    case 'pdp_share_copyicon' :
		    	var price = "";
		    	price = $(elObj).closest('.GPC0009').find('.js-compare').attr('data-price');
		    	if(price == '.' || price == '.00' || price == '0.0' || price== '0'){
		    		price = "";
		    	} 
		    	var msrp = "";
		    	msrp = $(elObj).closest('.GPC0009').find('.js-compare').attr('data-msrp');
		    	if(msrp == '.' || msrp == '.00' || msrp == '0.0' || msrp == '0'){
		    		msrp = "";
		    	} 
		    	var modelYear = $(elObj).closest('.GPC0009').find('.js-compare').attr('data-model-year');
				dataLayer['superCategory'] = $(elObj).closest('.GPC0009').find('.js-compare').attr('data-super-category-name');
				dataLayer['category'] = $(elObj).closest('.GPC0009').find('.js-compare').attr('data-category-name');
				dataLayer['subcategory'] =  $(elObj).closest('.GPC0009').find('.js-compare').attr('data-sub-category-name');
				dataLayer['modelYear']	= modelYear;
				dataLayer['modelName']	=$(elObj).closest('.GPC0009').find('.js-compare').attr('data-model-name');
				dataLayer['modelCode']	= $(elObj).closest('.GPC0009').find('.js-compare').attr('data-model-id');
				dataLayer['salesModelCode'] = $(elObj).closest('.GPC0009').find('.js-compare').attr('data-model-salesmodelcode');
				dataLayer['sku'] = $(elObj).closest('.GPC0009').find('.js-compare').attr('data-sku');
				dataLayer['suffix']  = $(elObj).closest('.GPC0009').find('.js-compare').attr('data-model-suffixcode');
				dataLayer['bu']  = $(elObj).closest('.GPC0009').find('.js-compare').attr('data-bu');
				dataLayer['snsType'] = $(elObj).text();
				dataLayer['price']  = price;
				dataLayer['currencyCode']  = $('.currency-code').val();
				dataLayer['dimension185']  = $('.navigation').attr('data-obs-group');
				dataLayer['metric4']  = msrp;
				 el_tempData.data({'dataLayer':dataLayer});
			        break;	
		    case 'plp_share_copyicon' :
		    	var price = "";
		    	price = $(elObj).closest('.js-model').find('.js-compare').attr('data-price');
		    	if(price == '.' || price == '.00' || price == '0.0' || price== '0'){
		    		price = "";
		    	} 
		    	var msrp = "";
		    	msrp = $(elObj).closest('.js-model').find('.js-compare').attr('data-msrp');
		    	if(msrp == '.' || msrp == '.00' || msrp == '0.0' || msrp == '0'){
		    		msrp = "";
		    	} 
		    	var modelYear =$(elObj).closest('.js-model').find('.js-compare').attr('data-model-year');
				dataLayer['superCategory'] = $(elObj).closest('.js-model').find('.js-compare').attr('data-super-category-name');
				dataLayer['category'] = $(elObj).closest('.js-model').find('.js-compare').attr('data-category-name');
				dataLayer['subcategory'] =  $(elObj).closest('.js-model').find('.js-compare').attr('data-sub-category-name');
				dataLayer['modelYear']	= modelYear;
				dataLayer['modelName']	=$(elObj).closest('.js-model').find('.js-compare').attr('data-model-name');
				dataLayer['modelCode']	= $(elObj).closest('.js-model').find('.js-compare').attr('data-model-id');
				dataLayer['salesModelCode'] = $(elObj).closest('.js-model').find('.js-compare').attr('data-model-salesmodelcode');
				dataLayer['sku'] = $(elObj).closest('.js-model').find('.js-compare').attr('data-sku');
				dataLayer['suffix']  = $(elObj).closest('.js-model').find('.js-compare').attr('data-model-suffixcode');
				dataLayer['bu']  = $(elObj).closest('.js-model').find('.js-compare').attr('data-bu');
				dataLayer['snsType'] = $(elObj).text();
				dataLayer['price']  = price;
				dataLayer['currencyCode']  = $('.currency-code').val();
				dataLayer['dimension185']  = $('.navigation').attr('data-obs-group');
				dataLayer['metric4']  = msrp;
				 el_tempData.data({'dataLayer':dataLayer});
			        break;
		    case 'mylg_wish_deleted_popup_close' :
		    case 'mylg_wish_deleted_popup_confirm' :
		    case 'mywish_deleted_popup_close' :
		    case 'mywish_deleted_popup_confirm' :
		    case 'plp_wish_signin' :
		    case 'plp_wish_signin_close' :
		    case 'pdp_wish_signin' :
		    case 'pdp_wish_signin_close' :
		    	dataLayer = el_tempData.data();
		        break;
		default : 
		var modelYear = nvl($(elObj).attr('data-model-year'), '');
		var price = "";
    	price = $(elObj).attr('data-price');
    	if(price == '.' || price == '.00' || price == '0.0' || price== '0'){
    		price = "";
    	} 
    	var msrp = "";
    	msrp = $(elObj).attr('data-msrp');
    	if(msrp == '.' || msrp == '.00' || msrp == '0.0' || msrp == '0'){
    		msrp = "";
    	} 
			dataLayer['superCategory'] = $(elObj).attr('data-super-category-name');
			dataLayer['category'] = $(elObj).attr('data-category-name');
			dataLayer['subcategory'] =  $(elObj).attr('data-sub-category-name');
			dataLayer['modelYear']	= modelYear;
			dataLayer['modelName']	=$(elObj).attr('data-model-name');
			dataLayer['modelCode']	= $(elObj).attr('data-model-id');
			dataLayer['salesModelCode'] = $(elObj).attr('data-model-salesmodelcode');
			dataLayer['sku'] = $(elObj).attr('data-sku');
			dataLayer['suffix']  = $(elObj).attr('data-model-suffixcode');
			dataLayer['bu']  = $(elObj).attr('data-bu');
			dataLayer['price']  = price;
			dataLayer['currencyCode']  = $('.currency-code').val();
			dataLayer['dimension185']  = $('.navigation').attr('data-obs-group');
			dataLayer['metric4']  =msrp;
			 el_tempData.data({'dataLayer':dataLayer});
		        break;
		 }
			return el_tempData.data('dataLayer');
	}
	//PJTGADL-2

	function getProductMeta(elObj){
	    var $basicInfoEl = $(elObj).closest('[data-wish-basic-info]');
	    var product = {};
	    switch(pageEventStr){
	    case 'mylg_wish_deleted_popup_close' :
	    case 'mylg_wish_deleted_popup_confirm' :
	    case 'mywish_deleted_popup_close' :
	    case 'mywish_deleted_popup_confirm' :
	    case 'plp_wish_signin' :
	    case 'plp_wish_signin_close' :
	    case 'pdp_wish_signin' :
	    case 'pdp_wish_signin_close' :
	        product = el_tempData.data();
	        break;
	    default : 
	    	product['sales_model_code'] = findSalesModel($(elObj));
		    product['model_name'] = findModelName($(elObj));
	    	product['bu'] = typeof $basicInfoEl.data('adobe-bu') == 'undefined' ? '' : $basicInfoEl.data('adobe-bu').toLowerCase();
	        product['super_category'] = typeof $basicInfoEl.data('adobe-super-category') == 'undefined' ? '' : $basicInfoEl.data('adobe-super-category');
	        product['category'] = typeof $basicInfoEl.data('adobe-category') == 'undefined' ? '' : $basicInfoEl.data('adobe-category');
	        // product['sub_category'] = typeof $basicInfoEl.data('adobe-sub-category') == 'undefined' ? '' : $basicInfoEl.data('adobe-sub-category');
	        if(pageEventStr == 'plp_share_copyicon' || pageEventStr == 'pdp_share_copyicon'){
	            product['copy_icon'] = $(elObj).data('adobe-copy-icon');	
	        }
	        // Mobile일 경우에만 사용하기 위한 추가
	        if($(window).width()<768) {
	        	var $btnListChange = $('.btn-listChange');
		        if($btnListChange.length > 0){
		        	var listChangeData = 'list_change_to_2';
		        	if($btnListChange.hasClass('act')){
		        		listChangeData = 'list_change_to_1';
		        	}
		        	product['list_change'] = listChangeData;
		        }
	        }
	        el_tempData.data({'product':product});
	        break;
	    }
	    return el_tempData.data('product');
	}
});

// 20201126 PJTPLP-10 관련 추가
//$('body').on('click', '[data-sc-item="mylg_wish_view_all"],[data-sc-item="mywish_btn_back"],[data-sc-item="mywish_paging_view"]', function () {
$('body').on('click', '[data-sc-item="mylg_wish_view_all"],[data-sc-item="mywish_btn_back"],[data-sc-item="mywish_paging_view"],[data-sc-item="plp_btn_list_change_to_1"],[data-sc-item="plp_btn_list_change_to_2"]', function () {
	var pageEvent = $(this).attr('data-sc-item');
	var productMeta = {};
	productMeta[pageEvent] = true;
	adobeTrackEvent(pageEvent, {
		products: [
			{}
		]
		,page_event: productMeta
	});
});

$('body').on('plp_wish_icon_select', '#tempData', function (e) {
	var page_event  = {};
	var pageEventStr = e.type;
	page_event[pageEventStr] = true;
	var productMeta = $(this).data('product');
	//PJTGADL-2
	var dataLayerMeta = $(this).data('dataLayer');
	adobeTrackEvent(pageEventStr, {
		products: [
			productMeta
		]
		,page_event: page_event
	});
	//PJTGADL-2
	var dataLayerpushData =  $.extend({
		'event': 'add_to_wishlist_click',
		},dataLayerMeta);
		dataLayer.push(dataLayerpushData);
});
$('body').on('plp_wish_icon_unselect', '#tempData', function (e) {
	var page_event  = {};
	var pageEventStr = e.type;
	page_event[pageEventStr] = true;
	var productMeta = $(this).data('product');
	//PJTGADL-2
	var dataLayerMeta = $(this).data('dataLayer');
	
	adobeTrackEvent(pageEventStr, {
		products: [
			productMeta
		]
		,page_event: page_event
	});
	//PJTGADL-2
	var dataLayerpushData =  $.extend({
		'event': 'remove_from_wishlist_click',
		},dataLayerMeta);
		dataLayer.push(dataLayerpushData);
});
$('body').on('plp_wish_no_signin', '#tempData', function (e) {
	var page_event  = {};
	var pageEventStr = e.type;
	page_event[pageEventStr] = true;
	var productMeta = $(this).data('product');
	
	adobeTrackEvent(pageEventStr, {
		products: [
			productMeta
		]
		,page_event: page_event
	});
});



$('body').on('pdp_wish_icon_select', '#tempData', function (e) {
	var page_event  = {};
	var pageEventStr = e.type;
	page_event[pageEventStr] = true;
	var productMeta = $(this).data('product');
	//PJTGADL-2
	var dataLayerMeta = $(this).data('dataLayer');
	
	adobeTrackEvent(pageEventStr, {
		products: [
			productMeta
		]
		,page_event: page_event
	});
	//PJTGADL-2
	var dataLayerpushData =  $.extend({
		'event': 'add_to_wishlist_click',
	},dataLayerMeta);
		dataLayer.push(dataLayerpushData);
});

$('body').on('pdp_wish_icon_unselect', '#tempData', function (e) {
	var page_event  = {};
	var pageEventStr = e.type;
	page_event[pageEventStr] = true;
	var productMeta = $(this).data('product');
	//PJTGADL-2
	var dataLayerMeta = $(this).data('dataLayer');
	
	adobeTrackEvent(pageEventStr, {
		products: [
			productMeta
		]
		,page_event: page_event
	});
	var dataLayerpushData =  $.extend({
		'event': 'remove_from_wishlist_click',
	},dataLayerMeta);
		dataLayer.push(dataLayerpushData);
	
});

$('body').on('pdp_wish_no_signin', '#tempData', function (e) {
	var page_event  = {};
	var pageEventStr = e.type;
	page_event[pageEventStr] = true;
	var productMeta = $(this).data('product');
	//PJTGADL-2
	var dataLayerMeta = $(this).data('dataLayer');
	
	adobeTrackEvent(pageEventStr, {
		products: [
			productMeta
		]
		,page_event: page_event
	});
});
// PJTPLP-10 GILS

// for responsive
var mql = {
	maxXs: window.matchMedia('(max-width: 575px)'),
	minSm: window.matchMedia('(min-width: 576px)'),
	sm: window.matchMedia('(min-width: 576px) and (max-width: 767px)'),
	maxSm: window.matchMedia('(max-width: 767px)'),
	minMd: window.matchMedia('(min-width: 768px)'),
	md: window.matchMedia('(min-width: 768px) and (max-width: 991px)'),
	maxMd: window.matchMedia('(max-width: 991px)'),
	minLg: window.matchMedia('(min-width: 992px)'),
	maxLg: window.matchMedia('(max-width: 1199px)'),
	lg: window.matchMedia('(min-width: 992px) and (max-width: 1199px)'),
	minXl: window.matchMedia('(min-width: 1200px)')
};
// Slick arrow html (WA-Common-Slick)
 var previousTxt = $('.navigation').data('previous') ? $('.navigation').data('previous') : 'Previous';
 var nextTxt = $('.navigation').data('next') ? $('.navigation').data('next') : 'Next';
var carouselOptions = {
	squarePrev: '<button type="button" class="slick-prev type-square" aria-label="previousTxt">'+previousTxt+'</button>',
	squareNext: '<button type="button" class="slick-next type-square" aria-label="'+nextTxt+'">'+nextTxt+'</button>',
	bigAnglePrev: '<button type="button" class="slick-prev" aria-label="'+previousTxt+'">'+previousTxt+' <span class="icon" aria-hidden="true"><svg width="23px" height="40px"><path fill-rule="evenodd" fill="currentColor" d="M21.577,2.477 L3.668,19.984 L21.577,37.491 C22.160,38.061 22.160,38.985 21.577,39.555 C20.994,40.126 20.048,40.126 19.465,39.555 L0.726,21.238 C0.634,21.181 0.534,21.140 0.454,21.061 C0.150,20.764 0.013,20.373 0.025,19.984 C0.013,19.595 0.150,19.204 0.454,18.907 C0.535,18.828 0.635,18.786 0.728,18.729 L19.465,0.412 C20.048,-0.158 20.994,-0.158 21.577,0.412 C22.160,0.983 22.160,1.908 21.577,2.477 Z"/></svg></span></button>',
	bigAngleNext: '<button type="button" class="slick-next" aria-label="'+nextTxt+'">'+nextTxt+' <span class="icon" aria-hidden="true"><svg width="23px" height="40px"><path fill-rule="evenodd" fill="currentColor" d="M21.546,21.061 C21.466,21.140 21.366,21.181 21.274,21.238 L2.535,39.555 C1.952,40.126 1.006,40.126 0.423,39.555 C-0.161,38.985 -0.161,38.061 0.423,37.491 L18.332,19.984 L0.423,2.477 C-0.161,1.908 -0.161,0.983 0.423,0.412 C1.006,-0.158 1.952,-0.158 2.535,0.412 L21.272,18.729 C21.365,18.786 21.465,18.828 21.546,18.907 C21.849,19.204 21.987,19.595 21.975,19.984 C21.987,20.373 21.849,20.764 21.546,21.061 Z"/></svg></span></button>'
};
// Scripts that convert svg files to online-svg
var initSVG = function () {
	$('img.inline-svg').not('.lazyload').inlineSVG({
		beforeReplace: function ($img, $svg, next) {
			$svg.find("path").removeAttr("class").removeAttr("id").removeAttr("data-name");
			$svg.find("defs").remove();
			next();
		}
	});
};
// Get Cookie
var getCookie = function (name) {
	// 20200611 START 박지영 - IE main 에서 path 추가된 쿠키 잘 안 읽히는 case 예외 처리 
	var c = (!!$.cookie(name)) ? decodeURIComponent($.cookie(name)) : '';
	/* 20201012 SSO domain 추가  */
	if(ISMAIN || ISSSO) {
		if(name == 'LG5_RecentlyView' || name == 'LG5_CompareCart' || name == 'LG5_CartID' || name == 'LG5_SearchResult') {
			if(HOMEUSECOOKIELIST[name] !== undefined && c === '') {
				c = HOMEUSECOOKIELIST[name];
			}
		}
	}
	return c;
	// 20200611 END
};
var defaultPath = '/';
if(location.port == "3000") { // localhost gulp
	defaultPath = '/html';
} else if (location.href.indexOf('/lg5-common-gp/html/') > 0) { // dev html
	defaultPath = '/lg5-common-gp';
} else if (window.location.href.indexOf('/oauth/') >= 0) {
	defaultPath = '/oauth';
} else { // dev, stg, www
	defaultPath = '/'+COUNTRY_CODE.toLowerCase();
}
// Save Cookie, LGEKZ-111
var setCookie = function (name, val, domainFlag,expires) {
	var lh = location.host;
	var mydomain = '.lg.com';
	if(lh.indexOf('lge.com')>=0) {
		mydomain = '.lge.com';
	} else if(lh.indexOf('localhost')>=0) {
		mydomain = 'localhost';
	}

	var domain = {path: defaultPath};
	
	
	// 20200416 START 박지영 - search b2b 
	if (name=='LG5_B2B_CompareCart' || name=='LG5_CompareCart' || name == 'LG5_RecentlyView' || name == 'LG5_SearchResult' || name=='LG5_B2B_SearchResult' || domainFlag == true) {
		domain = {
			path: defaultPath,
			domain: mydomain
		};
	}
	/* LGEKZ-111 Start*/
	if(expires != undefined && expires != ''){
		domain.expires=expires;
	}
	if(name=='LG5_UNIT_OBS_FLAG'){
		domain.path = '/'+COUNTRY_CODE.toLowerCase();
	}
	/* LGEKZ-111 End*/
	// 20200511 START 구유정 || noMoreToday_covid 추가
	if(name=="noMoreToday" || name=="noMoreToday_covid"|| name=="noMoreToday_notiPop") {
		/*LGEGMC-279 20200721*/
		if(COUNTRY_CODE!='in'&&name!="noMoreToday"){
			domain.expires=1;
		}
		/*LGEGMC-279 20200721*/
	}
	// 20200511 END 구유정 || noMoreToday_covid 추가
	if(name=='LG5_SupportSearch' || name=='LG5_RememberAccount' || name=='LG5_RecentlyView' || name=='LG5_CST_RecentlyView' || name=='LG5_ReviewHelpful' || name == 'LG5_SearchResult' || name=='LG5_B2B_SearchResult') {
		domain.expires=30;
	}
	// 20200416 END

	//if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
		$.cookie(name, encodeURIComponent(val), domain);
	//} else {
	//	ePrivacyCookies.view('click');
	//	return false;
	//}

	// 20200611 START 박지영 - IE main 에서 path 추가된 쿠키 잘 안 읽히는 case 예외 처리 
	if(name == 'LG5_RecentlyView' || name == 'LG5_CompareCart' || name == 'LG5_CartID' || name == 'LG5_SearchResult') {
		HOMEUSECOOKIELIST[name] = val;
	}
	// 20200611 END
};
// Remove Cookie
var removeCookie = function (name, domainFlag) {
	var lh = location.host;
	var mydomain = '.lg.com';
	if(lh.indexOf('lge.com')>=0) {
		mydomain = '.lge.com';
	} else if(lh.indexOf('localhost')>=0) {
		mydomain = 'localhost';
	}
	var domain = {path: defaultPath};
	// 20200427 START 박지영 - search b2b 수정
	if (name=='LG5_B2B_CompareCart' || name=='LG5_CompareCart' || name == 'LG5_RecentlyView' || name == 'LG5_SearchResult' || name=='LG5_B2B_SearchResult' || domainFlag == true) {
	// 20200427 END
		domain = {
			path: defaultPath,
			domain: mydomain
		};
	}
	$.removeCookie(name, domain);
};

// live chat
var prepareLiveChat = function() {
	if($('.live-chat > a').length>0) {
		//var cc = COUNTRY_CODE.toLowerCase();
		/*
		// 15번 컴포넌트 HTML 로 이동
		if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
			// for RU, KZ, UA
			if(cc=='ru' || cc=='kz' || cc=='ua') {
				(function() {
					var lt = document.createElement('script');
						lt.type = 'text/javascript';
						lt.async = true;
						lt.src = '//cs15.livetex.ru/js/client.js';
					var sc = document.getElementsByTagName('script')[0];
					if (sc) sc.parentNode.insertBefore(lt, sc); else document.documentElement.firstChild.appendChild(lt);
				})();
			}
		}
		*/
		$('.live-chat > a').not('.js-popup').on('click', function(e) {
			var cc = COUNTRY_CODE.toLowerCase();
			if(cc=='ru' || cc=='kz' || cc=='ua' || cc=='uz' || cc=='uz_ru') {
				e.preventDefault();
				if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
					if(LiveTex && typeof LiveTex.showWelcomeWindow == 'function') {
						// RU, KZ, UA
						LiveTex.showWelcomeWindow();
					}
				} else {
					ePrivacyCookies.view('click');
				}
			// 20200409 START 박지영 VN livechat
			} else if (cc=='vn') {
				e.preventDefault();
				if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
					if(typeof($.cookie("VN_open_chat"))==="undefined"){
						$.cookie("VN_open_chat","Y", { path: '/' });
					}
					var pname = ((document.title != '') ? document.title : document.querySelector('h1').innerHTML);
					var ga = document.createElement('script');
						ga.async = 1;
						ga.src = 'https://live.vnpgroup.net/js/web_client_box.php?hash=83ed899d26f9aa8bf6979adf7b43bac9&data=eyJzc29faWQiOjQ4NDA1MzUsImhhc2giOiJmOTE5Y2Y1OTdkZDdhMDNhODhiNGFmZmMzMWQ3Y2U2OSJ9&pname=' + pname;
					var s = document.getElementsByTagName('script');
						s[0].parentNode.insertBefore(ga, s[0]);
				} else {
					ePrivacyCookies.view('click');
				}
			// 20200409 END
			}
		});
	}
};
prepareLiveChat();
/*LGEGMC-1035 start*/
var energylabelTooltip = function () {
	$(document).on('click', '.energy-label-wrap .label-link', function (e) {
		e.preventDefault();
	});
	$(document).on('keyup , keydown', '.energy-label-wrap', function(e){
	    if(e.type == 'keyup'){
	        if($(e.target).length < 0){
	            $(this).removeClass('keyMove');
	        } else{
	            $(this).addClass('keyMove');
	        }
	    }
	    if(e.type == 'keydown'){
	        if(e.keyCode == 9){
	            if(e.target.className == 'link-text link-text-eu') {
	                $(this).removeClass('keyMove');
	            }
	        }
	        if(e.shiftKey && e.keyCode == 9){
	            $(this).removeClass('keyMove');
	        }    
	    }
	});	
}
/*LGEGMC-1035 end*/
// pop-up
var winowPop = function () {
	//var popup = document.getElementsByClassName('js-popup');
	//$(popup).on('click', function (e) {
	$(document).on('click', 'a.js-popup', function(e){
		e.preventDefault();
		e.stopImmediatePropagation();
		var cc = COUNTRY_CODE.toLowerCase();

		var target = this.getAttribute('href'),
			popupWidth = parseInt(this.getAttribute('data-width')),
			popupHeight = parseInt(this.getAttribute('data-height')),
			screenWidth = parseInt(screen.width),
			screenHeight = parseInt(screen.height),
			intLeft = Math.floor((screenWidth - popupWidth) / 2),
			intTop = Math.floor((screenHeight - popupHeight) / 2);

		if (intLeft < 0) intLeft = 0;
		if (intTop < 0) intTop = 0;

		// 20200325 START 박지영 : 쿠키 배너 셋팅에 따라 기능 막았던 것 제거
		if(target.indexOf('boldchat.com')>0) { //  && $(this).parent().is('.live-chat')
			/*
			LiveChat 
			- ro 인 경우 (단순 팝업), 나머지 국가는 pageViewer 체크함
			- boldChatFlag 가 Blod-A 인 경우
			- boldChatFlag 가 Blod-B 인 경우
			- 나머지
			*/
			// live chat (de, fr, gr, pt, uk ..)
			var currUrl = document.location.href;
			window.open(((window.pageViewer && pageViewer.link) || function(link){return link;})(target + '&vr=&vn=&vi=&ve=&vp=&iq=&curl=' + '&url=' + escape(currUrl)), 'Chat893536861983465199', 'width=' + popupWidth + ',height=' + popupHeight + ',left=' + intLeft + ',top=' + intTop + ',history=no,resizable=no,status=no,scrollbars=yes,menubar=no');
		} else if(target.indexOf('velaro.com')>0) { //  && $(this).parent().is('.live-chat')
			// ca_en, ca_fr
			window.open(target, '_blank', 'width=' + popupWidth + ',height=' + popupHeight + ',left=' + intLeft + ',top=' + intTop + ',history=no,resizable=no,status=no,scrollbars=yes,menubar=no');
		} else if ($(this).attr('data-link-name') == 'live_chat' && cc!='it' && cc!='pl') {
			window.open(target, '_blank', 'width=' + popupWidth + ',height=' + popupHeight + ',left=' + intLeft + ',top=' + intTop + ',history=no,resizable=no,status=no,scrollbars=yes,menubar=no');
		} else {
			window.open(target, '_blank', 'width=' + popupWidth + ',height=' + popupHeight + ',left=' + intLeft + ',top=' + intTop + ',history=no,resizable=no,status=no,scrollbars=yes,menubar=no');
		}
		// 20200325 END
	});
};
var openWin = function(url, target, width, height) {
	var opt = {
		url		: url || "#",
		target	: target || "_blank",
		width	: width || "600",
		height	: height || "800"
	};
	var winX =  window.screenX || window.screenLeft || 0;
	var winY = window.screenY || window.screenTop || 0;
	var intLeft = Math.max(winX + Math.floor((screen.availWidth - opt.width) / 2), 0);
	var intTop = Math.max(winY + Math.floor((screen.availHeight - opt.height) / 2), 0);
	var winObj;
	winObj = window.open(opt.url, opt.target, 'width=' + opt.width + ',height=' + opt.height + ',left=' + intLeft + ',top=' + intTop + ',history=no,resizable=no,status=no,scrollbars=yes,menubar=no');
};
var getUrlParams = function() {
    var params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { params[key] = value; });
    return params;
};

// tooltip
var tooltipActive = function () {
	var tooltip = document.getElementsByClassName('js-tooltip');
	var tooltipClose = document.getElementsByClassName('tooltip-close');

	$(tooltip).off('click').on('click', function (e) {
		e.preventDefault();
		if ($(this).next('.tooltip-area').css('display') != 'block') {
			$('.tooltip-area').hide();
			$(this).next('.tooltip-area').show();
			// 화면 왼쪽 밖으로 나가는 경우 처리
			if(parseInt($(this).next('.tooltip-area').offset().left) < 0) {
				$(this).next('.tooltip-area').addClass('out');
			}
		} else {
			$(this).focus();
			$(this).next('.tooltip-area').hide();
		}
	});
	$(tooltipClose).off('click').on('click', function (e) {
		e.preventDefault();
		$(this).closest('.tooltip-wrap').find('.js-tooltip').focus();
		$(this).closest('.tooltip-area').hide();
	});
	$(window).resize(function () {
		$('.tooltip-area').hide();
	}).resize();
};
// count the number
var checkTextLength = function (obj, count) {
	var max = parseInt(obj.attr('maxlength'));
	var mathNonByte = obj.siblings('.char-count').attr('data-non-byte'); // LGEKZ-55
	/*
	obj.on('keyup, input', function () {
		var type = obj.val().length;
		var remain = max - type;
		count.text(remain);
		var str1 = obj.val();
		var str2 = "";
		if (remain <= 1) {
			str2 = str1.substr(0, max);
		}
	});
	*/
	obj.off('keyup input').on('keyup input', function (e) {
		var tgField = e.currentTarget;
		var byteTotal = 0;
		var tmpByte = 0;
		var strLen = 0;
		var c;
		for (var i = 0; i < tgField.value.length; i++) {
			c = escape(tgField.value.charAt(i));
			// LGEKZ-55 Start
			if(mathNonByte == 'Y'){
				tmpByte ++;
			}else{
				if (c.length == 1) {
					tmpByte++;
				} else if (c.indexOf("%u") != -1) {
					// byte 조정
					tmpByte += 3;
				} else {
					tmpByte++;
				}
			}
			// LGEKZ-55 End

			if (tmpByte > max) {
				strLen = i;
				break;
			} else {
				byteTotal = tmpByte;
			}
		}
		if (strLen) {
			tgField.value = tgField.value.substring(0, strLen);
		}
		count.text(Math.max(0, max-byteTotal));
	});
};

// Script to prevent multiple calls of url once called in ajax call
var ajax = {
	cacheParams: [],
	cacheDatas: [],
	// default : cached data
	call: function (paramURL, param, type, callback, sType, progressiveTarget) {

		var dataType = type ? type : 'json';
		var sendType = sType ? sType : commonSendType;
		var pTarget = progressiveTarget;
		var isFormData = param instanceof FormData;

		var stringParam = param && param != null ? jQuery.param(param) : "";

		$.ajax({
			type: sendType,
			url: paramURL,
			// async: false,
			dataType: type,
			data: xssfilter(param),
			contentType: isFormData ? false : 'application/x-www-form-urlencoded; charset=UTF-8',
			xhrFields: (window.location.href.indexOf('/oauth/') !== -1) ? {withCredentials: true} : '',
			processData: isFormData ? false : true,
			beforeSend: function () {
				// caching check;
				var idx = (sendType == 'post') ? ajax.cacheParams.indexOf(this.url + '?' + stringParam) : ajax.cacheParams.indexOf(this.url);
				if (idx >= 0) {
					data = ajax.cacheDatas[idx];
					callback(data, this);
					return false;
				}
				if (pTarget) {
					// console.log('loading', $(pTarget).attr('class'));
					$(pTarget).trigger('ajaxLoadBefore');
				}
			},
			success: function (d) {
				if (dataType == 'json') {
					if (typeof d === "string") {
						d = $.parsejson(d);
					}
				}
				if (d.status != "success" && (d.message != null && d.message != "")) { // error msg
					ajax.popupErrorMsg(d.message);
					d = false;
				} else { // pass data
					// check cached data
					if (sendType == 'post') ajax.cacheParams.push(this.url + '?' + stringParam);
					else ajax.cacheParams.push(this.url);

					// caching data
					ajax.cacheDatas.push(d);

				}
				// finish ajax loading
				if (pTarget) {
					$(pTarget).trigger('ajaxLoadEnd');
				}
				callback(d, this);
			},
			error: function (request, status, error) {
				console.log("status: " + status);
				console.log("error: " + error);
				if (pTarget) {
					$(pTarget).trigger('ajaxLoadEnd');
				}
				callback(false, this);
				ajax.popupErrorMsg(error);
			}
		});
	},
	// Scripts used when caching is disabled
	noCacheCall: function (paramURL, param, type, callback, sType, progressiveTarget, async) {
		var dataType = type ? type : 'json';
		var sendType = sType ? sType : commonSendType;
		var pTarget = progressiveTarget;
		var isFormData = param instanceof FormData;

		$.ajax({
			type: sendType,
			url: paramURL,
			async: async || true,
			dataType: type,
			data: xssfilter(param),
			cache: false,
			contentType: isFormData ? false : 'application/x-www-form-urlencoded; charset=UTF-8',
			processData: isFormData ? false : true,
			beforeSend: function () {
				if (pTarget) {
					// console.log('loading', $(pTarget).attr('class'));
					$(pTarget).trigger('ajaxLoadBefore');
				}
			},
			success: function (d) {
				if (dataType == 'json') {
					if (typeof d === "string") {
						d = $.parsejson(d);
					}
				}
				// error msg
				if (d.status != "success" && (d.message != null && d.message != "")) {
					ajax.popupErrorMsg(d.message);
					d = false;
				}

				if (pTarget) {
					$(pTarget).trigger('ajaxLoadEnd');
				}
				callback(d, this);
			},
			error: function (request, status, error) {
				console.log("status: " + status);
				console.log("error: " + error);
				if (pTarget) {
					$(pTarget).trigger('ajaxLoadEnd');
				}
				callback(false, this);
				ajax.popupErrorMsg(error);
			}
		});
	},
	popupErrorMsg: function (msg) {
		if(!$.trim(msg)) return false;
		console.log(msg);
		/*
		if (document.querySelectorAll('meta[name="v-mode"][content="author"]').length == 0) {
			var errorMsg = document.getElementById("serverErrorMsg");
			if (!errorMsg) {
				var html = '<div class="modal modal-simple fade" id="serverErrorMsg" tabindex="-1" role="dialog" data-backdrop="false"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-body"><div class="simple-content-box"><div class="content-paragraph">' + msg + '</div></div></div><div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal">Close</button></div></div></div></div>';
				$('body').append(html);
				errorMsg = document.getElementById("serverErrorMsg");
				$(errorMsg).modal("show");
			} else if (!$(errorMsg).hasClass('show')) {
				errorMsg.querySelector('.content-paragraph').innerHTML = msg;
				$(errorMsg).modal("show");
			}
		}
		*/
	}
};
$('body').on({
	'ajaxLoadBefore':function(e){
		e.stopPropagation();
		$(this).append('<div class="loading-circle"><div class="lds-dual-ring"></div></div>');
	},
	'ajaxLoadEnd':function(e){
		e.stopPropagation();
		$(this).find('.loading-circle').remove();
	}
});
// 20200416 START 박지영 - loading img 추가
$('.GPC0003 .component-inner-box, .GPC0004 .component-inner-box, .GPC0020 .find-a-dealer-wrap, .GPC0064, .GPC0114, .GPC0102 .map-container, .GPC0108 .map-container, .GPC0113 .map-container, .GPC0116 .map-container, .GPC0118 .map-container').on({
	'ajaxLoadBefore':function(e){
		e.stopPropagation();
		$(this).append('<div class="loading-circle"><div class="lds-dual-ring"></div></div>');
	},
	'ajaxLoadEnd':function(e){
		e.stopPropagation();
		$(this).find('.loading-circle').remove();
	}
});
// 20200416 END

// Script used to change options of select by calling ajax
(function ($) {
	$.fn.drawAjaxOptions = function (options) {
		var _this = this.get(0);
		var $this = $(this);
		var opt = $.extend({
			setTarget: null,
			url: null,
			dynamicParam: false,
			param: {},
			addParam: [],
			keyName: null,
			keyValue: null,
			empty: function () {
			},
			notEmpty: function () {
			},
			callback: function () {
			}
		}, options, $this.data());

		var category = {
			initialized: false,
			init: function () {
				if (!category.initialized) {
					category.addEvent();
					category.initialized = true;
				}
			},
			creatOptions: function (t, dataObj) {
				var html = '';
				// selectbox placeholder
				html += '<option value="" disabled selected>' + t.getAttribute('data-placeholder') + '</option>';

				if (opt.dataArray) {
					dataObj = dataObj.data instanceof Array ? dataObj.data[0] : dataObj;
					//console.log(dataObj);
					dataObj = dataObj[opt.dataArray];
				}
				if ((JSON.stringify(dataObj) == '{}' || dataObj.length == 0) || JSON.stringify(dataObj) == undefined) {
					$(t).html(html);
					t.setAttribute('disabled', 'disabled');
					$this.trigger('options.empty');
				} else {
					for (var key in dataObj) {
						var text, val;

						if (typeof dataObj[key] == "object") {
							if(opt.keyName != null && opt.keyValue != null) {
								// has option key names
								var currentKey = dataObj[key];
								text = currentKey[opt.keyName];
								val = currentKey[opt.keyValue];
							}else {
								// default
								for (var k in dataObj[key]) {
									text = dataObj[key][k];
									val = k;
								}
							}

						} else {
							text = dataObj[key],
								val = key; // jshint ignore:line
						}

						if (val == null || val == '') {
							html += '<option value="' + val + '" disabled>' + text + '</option>';
						} else {
							html += '<option value="' + val + '">' + text + '</option>';
						}
					}
					$(t).html(html);
					$this.trigger('options.notEmpty');
					t.removeAttribute('disabled');
					/* PJTERAP-1 Start, 조회 카테고리 영역  show */
					var pageFlag = $('#mylgProductPageType').val() != null && $('#mylgProductPageType').val() != undefined && $('#mylgProductPageType').val() == 'ocr';
					if(pageFlag){
						$(t).closest('div').show();
					}
					/* PJTERAP-1 End */
				}
				$(t).trigger('chosen:updated');
			},
			changeEventFnc: function (e, f) {
				if(f == true) return false;
				var check = jQuery().checkValidation != undefined && $(e.currentTarget).checkValidation({onlyBoolean: true});
				if (e.currentTarget.type.indexOf("select") >= 0 || check) {
					var _param = opt.param;
					if (opt.dynamicParam == true) {
						_param = e.currentTarget.getAttribute('data-param');
						_param = _param ? _param : {};
					}

					if (typeof _param != 'string') {
						_param = $.param(_param);
					}

					var optionParam = $(e.currentTarget).find("option").eq(e.currentTarget.selectedIndex).data();
					optionParam = optionParam ? jQuery.param(optionParam) : "";

					var param = $(e.currentTarget).serialize() + "&" + _param + "&" + optionParam;
					// 추가 카테고리값 필요할시 
					if ( !!opt.addParam.length ){							
						$.each( opt.addParam, function(){
							param += "&" + $(this).serialize();
						});
					}
					var url = opt.url;
					// var data = ajax.call(url, param);
					ajax.noCacheCall(url, param, 'json', function (data) {
						if (data) {
							category.creatOptions(opt.setTarget, data);
							opt.callback(data);
						}
					});
					$(opt.setTarget).trigger('chosen:updated');
				}
			},
			addEvent: function () {
				if (_this.type.indexOf("select") >= 0) {
					$this.on({
						'change.base': category.changeEventFnc
					});
				} else {
					$this.on({
						'blur.base': category.changeEventFnc
					});
				}
				$this.on({
					'options.empty': opt.empty,
					'options.notEmpty': opt.notEmpty
				});
			}
		};

		return this.each(function () {
			category.init();
		});
	};
})(jQuery);

// form
var setForm = function () {
	var target = document.getElementsByTagName('form');
	for (var i = 0; i < target.length; i++) {
		var _this = target[i];
		var method = _this.getAttribute('data-ajax-method');
		method = method ? method : commonSendType;
		_this.removeAttribute('data-ajax-method');

		$(_this).data('ajaxMethod', method);
	}
};

//LGEGMC-1118 Start
var cesPop = function (e) {
	
	$(document).on('click', 'a.lg_x_ces2021', function(e){
		e.preventDefault();
		var _this = $(this);
		var redirectUrl = _this.data('url');
		
		window.open(redirectUrl, '_blank');
		
	});
	
}
// LGEGMC-1118 End
// LGENL-123 s
var bvTrackingCookies = function (e) {
	const bvCookieConsent = document.createElement('meta')
	if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_ANALYSIS_OF_SITE')) {
		// Create the bv:cookies meta element
		bvCookieConsent.name = 'bv:cookies'
		bvCookieConsent.content = 'true'
		document.head.appendChild(bvCookieConsent)
	}else{
		bvCookieConsent.name = 'bv:cookies'
		bvCookieConsent.content = 'false'
		document.head.appendChild(bvCookieConsent)
	}
}
// LGENL-123 e

//LGEITF-376 START
var getAccessToken = function (){
	
	var url = '/'+COUNTRY_CODE.toLowerCase()+'/mkt/ajax/commonmodule/getAccessToken';
	
	$.ajax({
		type:"post",
		url: url,
		dataType: "json",
		success: function(data) {
			
			console.log("getAccessToken call!");
			
			if(data.authToken != ""){
				
				sessionStorage.setItem('ACCESS_TOKEN', data.authToken);

			} else {
				
				sessionStorage.setItem('ACCESS_TOKEN', ''); 
				
			}
			
		},
		error: function(request,status,error) {
			sessionStorage.setItem('ACCESS_TOKEN', '');
			console.log("getAccessToken^^status: "+status);
			console.log("getAccessToken^^error: "+error);
		}
	});
};
getAccessToken();
//LGEITF-376 END

// init
$(document).ready(function () {
	initSVG();
	winowPop();
	tooltipActive();
	setForm();
	energylabelTooltip();
	cesPop();
	// LGENL-123 s
	if(COUNTRY_CODE.toLowerCase() == 'nl'){
		if(typeof ePrivacyCookies!='undefined') {
			bvTrackingCookies();
		} else {
			setTimeout(function() {
				bvTrackingCookies();
			}, 300);
		}
	}
	// LGENL-123 e
	
	//PJTMEMBERSHIP-1
	if($('body .my-coupon').length > 0){
		$('body .my-coupon').on('click', '.coupon-poplink', function () {
			var popUpArea = $('.modal.modal-couponinfos.fade');
			//welcome coupon
			popUpArea.find('.modal-cp-top .modal-cp-title').text($(this).closest('.coupon-flipped').find('.coupon-title').text());
			//amount (5% off)
			popUpArea.find('.modal-cp-top h3').html($(this).closest('.coupon-flipped').find('.coupon-name').html());
			//description
			popUpArea.find('.modal-cp-top .modal-cp-txt').text($(this).closest('.coupon-flipped').find('.coupon-txt').text());
			//coupon code
			popUpArea.find('.modal-cp-bottom .modal-cp-code').text($(this).closest('.coupon-flipped').find('.coupon-code').text());
			//coupon speech
			popUpArea.find('.modal-cp-bottom .modal-cp-speech').text($(this).closest('.coupon-flipped').find('.coupon-speech').text());
			//coupon-date
			popUpArea.find('.modal-cp-bottom .modal-cp-date').text($(this).closest('.coupon-flipped').find('.coupon-date').text());
		});
	}
});

// search box common script
var searchCommon = [],
	searchInit = function () {
		$('.search-common').each(function (idx) {
			var $searchCommon = $(this);
			if ($searchCommon.data('searchIdx') == undefined) {
				idx = searchCommon.length;

				this.setAttribute('data-search-idx', idx);
				searchCommon[idx] = {
					//$obj : $(document.querySelector('.search-common')),
					$obj: $searchCommon,
					canFocus: 0,
					canSubmit: 0,
					canCookie: 0,
					minLength: 0,
					cookieName: '',
					action: '',
					max: 10,
					functionName: '',
					$layer: null,
					$input: null,
					$recentArea: null,
					$resultArea: null,
					$template: null,
					$btnSubmit: '',
					$btnClose: '',
					init: function () {
						var el = this.$obj;
						this.canFocus = el.data('canfocus');
						this.canSubmit = el.data('cansubmit');
						this.cookieName = el.data('cookiename');
						this.functionName = el.data('function');
						this.minLength = el.data('minlength') ? el.data('minlength') : 1;
						this.$layer = el.find('.search-layer');
						this.$input = el.find('.search-common-input');
						this.$recentArea = this.$layer.find('.recent-suggested-type');
						this.$resultArea = this.$layer.find('.search-result-list');
						this.$autoArea = this.$layer.find('.autoName-area');
						this.$template = this.$layer.find('template');
						this.action = el.attr('action');
						this.max = el.data('max');
						this.$btnSubmit = el.find('a.submit').length ? el.find('a.submit') : el.find('input.submit'); // LGECI-379
						this.$btnClose = el.find('.link-close');
						if (this.cookieName) {
							this.canCookie = 1;
						}
						// Recent, Focus and Input must be run when layer exists
						if (this.$layer.length > 0) {
							this.bindInput();
							if (this.canFocus > 0) {
								this.bindFocus();
							} else {
								// hide see more
								this.$resultArea.find('.search-result-seemore').hide();
								this.bindNoFocus();
							}
							// If layer exists in mobile, float to top in focus
							/*
							if ('ontouchstart' in window) {
								this.$input.on('focus', function() {
									//searchCommon[idx].$obj.addClass('fixed');
									$('body').addClass('floating-search');
								});
								// close
								this.$input.on('blur', function() {
									searchCommon[idx].$obj.removeClass('fixed');
									$('body').removeClass('band-scroll');
								});
							}
							*/
							// Find all focusable children

							var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

							if(!$('.navigation').hasClass('mobile-device')) { // do not remove 'if', because android bug
								// 20200406 START 박지영 || search input에서 키보드 포커스 처리 수정 [redmine #5487]
								/*
								this.$input.on('blur', function(e) {
									e.preventDefault();
									var close = $(this).closest('.search-common').find('.search-layer .predictive-search:visible').find('.search-footer-area a.link-close');
									if(close && close.length>0) {
										close.focus();
									}
								});
								*/
								this.$input.on('keydown', function(e){
									if (e.keyCode === 9) {
										if (e.shiftKey) {
											$('.search-area .search-layer').removeClass('active');
											/* LGECI-258 20201221 add */
										// } else {
											// var layer = $(this).closest('.search-common').find('.search-layer');
											// if(layer.hasClass('active')) {
											// 	e.preventDefault();
											// 	var close = layer.find('.predictive-search:visible').find('.search-footer-area a.link-close');
											// 	if(close && close.length>0) {
											// 		close[0].focus();
											// 	}
											// }
											/* //LGECI-258 20201221 add */
										}
									}
								});
								// 20200406 END
							}

							this.$layer.on({
								keydown: function(e){
									// Convert NodeList to Array
									var focusableElements = e.currentTarget.querySelectorAll(focusableElementsString);
									focusableElements = Array.prototype.slice.call(focusableElements);
									var firstTabStop = focusableElements[0];
									var lastTabStop = focusableElements[focusableElements.length - 1];
									// Check for TAB key press
									if (e.keyCode === 9) {
										// SHIFT + TAB
										if (e.shiftKey) {
											if (document.activeElement === firstTabStop) {
												e.preventDefault();
												lastTabStop.focus();
											}
										// TAB
										} else {
											if (document.activeElement === lastTabStop) {
												e.preventDefault();
												/* LGECI-258 20201221 add */
												// Suggested Searches - 1st item.focus() 삭제, close 클릭 기능과 동일하게 focus out + search-common-input으로 focus
												if(searchCommon[idx].$btnSubmit.length>0) searchCommon[idx].$input.focus();
												var thisLayer = searchCommon[idx].$layer;
												setTimeout(function() {
													thisLayer.removeClass('active');
												}, 100);
												/* //LGECI-258 20201221 add */
											}
										}
									}
									// ESCAPE
									if (e.keyCode === 27) {
										closeModal();
									}
								}
							}, '.predictive-search');
						}
						this.$btnClose.on('click', function (e) {
							e.preventDefault();
							// 20200525 START 박지영 : IE에서 close 클릭시 닫기가 잘 안되는 버그 수정
							// 20200406 START 박지영 || close 버튼 선택시 입력단으로 focus 수정 [redmine #5487]
							if(searchCommon[idx].$btnSubmit.length>0) searchCommon[idx].$input.focus();
							// 20200406 END
							var thisLayer = searchCommon[idx].$layer;
							setTimeout(function() {
								thisLayer.removeClass('active');
							}, 100);
							// 20200525 END
						});

						// Submit
						this.bindSubmit();

						// Close search layer
						$('body').on('click touchend', function (event) {
							if (!$(event.target).parents('.search-area')[0]) {
								searchCommon[idx].$layer.removeClass('active');
							}
						});
						// Close the search layer when blur event occurs at the end of the search layer
						this.$recentArea.find('ul.list:last-child li:last-child a').on('blur', function () {
							searchCommon[idx].$layer.removeClass('active');
						});
						this.$resultArea.find('.search-result-seemore a').on('blur', function () {
							searchCommon[idx].$layer.removeClass('active');
						});

						// init
						this.$input.data('oldtext', ''); // for ie11 bug
					},
					bindNoFocus: function () {
						if($('.search-model-result').length>0) {
							// manuals and documents, software and drivers page only
							this.$input.on('focus', function (e) {
								e.preventDefault();
								if (!searchCommon[idx].$layer.hasClass('active')) {
									searchCommon[idx].$layer.addClass('active');
								}
							});
						}
					},
					bindFocus: function () {
						this.$input.on('focus', function (e) {
							e.preventDefault();
							// check the cookie
							var recentCookieTxt;
							var recentCookieArr;
							if (this.canCookie == 1) {
								recentCookieTxt = getCookie(searchCommon[idx].cookieName);
								if (recentCookieTxt == undefined) recentCookieTxt = '';
								recentCookieArr = recentCookieTxt.split('|');
								if (recentCookieTxt == '') {
									removeCookie(searchCommon[idx].cookieName);
								}
							}
							// open the layer
							if (!searchCommon[idx].$layer.hasClass('active')) {
								searchCommon[idx].$layer.addClass('active');
							}
							searchCommon[idx].doRecent();
						});
					},
					bindInput: function () {
						this.$input.on('input', function (e) {
							// check the cookie
							var recentCookieTxt;
							var recentCookieArr;
							if (this.canCookie == 1) {
								recentCookieTxt = getCookie(searchCommon[idx].cookieName);
								recentCookieArr = recentCookieTxt.split('|');
								if (recentCookieTxt == '') {
									removeCookie(searchCommon[idx].cookieName);
								}
							}
							// check the input's value
							if (searchCommon[idx].$input.val() == '' && (searchCommon[idx].$input.data('oldtext') != searchCommon[idx].$input.val())) {
								searchCommon[idx].doRecent();
								// open the layer
								if (!searchCommon[idx].$layer.hasClass('active')) {
									searchCommon[idx].$layer.addClass('active');
								}
							} else if (searchCommon[idx].minLength <= searchCommon[idx].$input.val().length) {
								searchCommon[idx].doResult();
								// open the layer
								if (!searchCommon[idx].$layer.hasClass('active')) {
									searchCommon[idx].$layer.addClass('active');
								}
							}
							searchCommon[idx].$input.data('oldtext', searchCommon[idx].$input.val());
						});
						// REQ-022 : 스크립트 추가 시작
						this.$input.on('focus', function(e) {
							if(searchCommon[idx].$input.closest('.GPC0009').length>0) {
								searchCommon[idx].doResult();
								// open the layer
								if (!searchCommon[idx].$layer.hasClass('active')) {
									searchCommon[idx].$layer.addClass('active');
								}
							}
						});
						// REQ-022 : 스크립트 추가 끝
					},
					bindSubmit: function () {
						this.$btnSubmit.on('click', function (e) {
							e.preventDefault();
							if ($(this).closest('.parts-accessories').length > 0) {
								// for parts & accessories
								adobeTrackEvent('parts-accessories-search', {
									search_keyword: $(this).siblings('.search-common-input').val(),
									search_type: "support:parts_accessories",
									page_event: {onsite_search: true}
								});
							}
							searchCommon[idx].doSubmit();
						});
					},
					bindClickKeyword: function () {
						searchCommon[idx].$recentArea.find('ul.list li a').not('.delete').off('click', '**').on('click', function (e) {
							e.preventDefault();
							// Adding a value to the search input and Submit Form
							var searchTxt = xssfilter($(this).find('.product-name').text(), 'form');
							searchCommon[idx].$input.val(searchTxt);
							searchCommon[idx].doSubmit();
						});
					},
					bindDeleteKeyword: function () {
						searchCommon[idx].$recentArea.find('ul.list li a.delete').off('click', '**').on('click', function (e) {
							e.preventDefault();
							var searchTxt = xssfilter($(this).parent().find('.product-name').text(), 'form'),
								recentNoResult = searchCommon[idx].$recentArea.find('.not-result.recent-keyword'),
								recentList = searchCommon[idx].$recentArea.find('ul.list.recent-keyword');
							//console.log('test1');
							if (searchCommon[idx].canCookie == 1) {
								//console.log('test2');
								searchCommon[idx].deleteCookieList(searchTxt);
							}
							// Remove this in the list
							$(this).closest('li').remove();
							if (searchCommon[idx].$recentArea.find('ul.list.recent-keyword li').length <= 0) {
								recentNoResult.show();
								recentList.empty().hide();
							}
						});
					},
					//PJTSEARCH-1 START
					doSetAutoCookie: function () {
						this.$autoArea.find('ul li a').on('click', function (e) {
							e.preventDefault();
							var keyword ='';
							if($(this).find('.product-name').text() != ''){
								keyword = $(this).find('.product-name').text();
							}else{
								keyword = $(e.target).text();
							}
							if ($.trim(keyword) != '') {
								if (searchCommon[idx].canCookie == 1) searchCommon[idx].addCookieList(keyword);
							}
							
							var linkUrl = $(this).attr('data-keyword-search-url');
							var page = $(this).attr('data-keyword-search');
							var target = $(this).attr('target');
							if(typeof target == 'undefined' || target == ''){
								target = '_self';
							}
							
							aLinkPost(linkUrl, page,target);
							//window.location.href = $(this).attr('href');
						});
					},
					doSetMatchModelClick : function(){
						this.$autoArea.find('.success-item a.product-page-linker').on("click", function(e){
							e.preventDefault();
							var keyword = $(this).find('.model-display-name').text();
							if ($.trim(keyword) != '') {
								if (searchCommon[idx].canCookie == 1) searchCommon[idx].addCookieList(keyword);
							}
							
							var linkUrl = $(this).attr('data-keyword-search-url');
							var page = $(this).attr('data-keyword-search');
							var target = $(this).attr('target');
							if(typeof target == 'undefined' || target == ''){
								target = '_self';
							}
							
							aLinkPost(linkUrl, page, target);
							//window.location.href = $(this).attr('href');
						});
						this.$autoArea.find('.success-image a').on("click", function(e){
							e.preventDefault();
							var keyword = $(this).parent().attr('data-adobe-modelname');
							if ($.trim(keyword) != '') {
								if (searchCommon[idx].canCookie == 1) searchCommon[idx].addCookieList(keyword);
							}
							
							var linkUrl = $(this).attr('data-keyword-search-url');
							var page = $(this).attr('data-keyword-search');
							var target = $(this).attr('target');
							if(typeof target == 'undefined' || target == ''){
								target = '_self';
							}
							
							aLinkPost(linkUrl, page, target);
							//window.location.href = $(this).attr('href');
						});
					},
					//PJTSEARCH-1 END
					doSubmit: function (noRefresh) {
						var searchTxt = xssfilter(this.$input.val(), 'form');
						this.$input.val(searchTxt);
						//PJTSEARCH-1 START
						if($('.success-seacrh-inner a div.model-display-name').length > 0){
							if (!this.$obj.is('.auto-validation-form')) {
								if ($.trim(searchTxt) != '') {
									if (this.canCookie == 1) this.addCookieList(searchTxt);
								}
							}
							
							var linkUrl = $('.success-seacrh-inner a.product-page-linker').attr('data-keyword-search-url');
							var page = $('.success-seacrh-inner a.product-page-linker').attr('data-keyword-search');
							var target = $('.success-seacrh-inner a.product-page-linker').attr('target');
							if(typeof target == 'undefined' || target == ''){
								target = '_self';
							}
							
							aLinkPost(linkUrl, page, target);
							//window.location.href = $('.success-seacrh-inner a.product-page-linker').attr('href');
							return false;
						}
						
						if($('#searchByKeyword').attr('auto-url') != undefined && $('#searchByKeyword').attr('auto-url') != ''){
							if (!this.$obj.is('.auto-validation-form')) {
								if ($.trim(searchTxt) != '') {
									if (this.canCookie == 1) this.addCookieList(searchTxt);
								}
							}
							
							var linkUrl = $('#searchByKeyword').attr('auto-url');
							var page = $('#keywordSearch').val();
							var target = '_self';
							
							aLinkPost(linkUrl, page, target);
							//window.location.href = $('#searchByKeyword').attr('auto-url');
							return false;
						}
						//PJTSEARCH-1 END
						if (!this.$obj.is('.auto-validation-form')) {
							if ($.trim(searchTxt) != '') {
								if (this.canCookie == 1) this.addCookieList(searchTxt);
								var noSubmitArea = this.$resultArea.find('.no-submit');
								if (this.canSubmit == 1 && noRefresh != true) {
									if($('.resource-search-form-wrap').length>0 && $('.results-summary').length>0) {
										// CS Help Library, CS Video Tutorials
										adobeTrackEvent('cs-onsite-search', {search_keyword : searchCommon[idx].$obj.find('.search-input input[type=text]').val(), page_event : {onsite_search : true}});
									}
									this.$obj.submit();
								} else {
									noSubmitArea.show();
									if($('.search-model-result').length>0) {
										// manuals and documents, software and drivers page only
										if (this.canFocus <= 0) {
											if (!searchCommon[idx].$layer.hasClass('active')) {
												searchCommon[idx].$layer.addClass('active');
											}
										}
									}
									return false;
								}
							} else {
								return false;
							}
						} else {
							this.$obj.submit();
						}
					},
					doResult: function () {
						this.$resultArea.show();
						this.$recentArea.hide();
						var noSubmitArea = this.$resultArea.find('.no-submit'),
							url = this.$input.data('predictive-url'),
							searchTxt = {};

						if(this.$resultArea.closest('.GPC0009').length>0) {
							searchTxt.searchModel = xssfilter(this.$input.val(), 'form');
							searchTxt.modelId=this.$obj.find('input[name=modelId]').val();
						} else {
							searchTxt.search = xssfilter(this.$input.val(), 'form');
						}
						// BTOBGLOBAL-567
						if(this.$input.data('predictive-super-category-id') !== undefined) {
							searchTxt.superCategoryId = this.$input.data('predictive-super-category-id');
						}
						// BTOBGLOBAL-567 End

						noSubmitArea.hide();
						//PJTSEARCH-1 START
						var searchBizType = 'B2C';
						if($('.navigation').attr('class').indexOf('b2c') == -1){
							searchBizType = 'B2B';
						}
						searchTxt.type = searchBizType;

						if($('.autoName-box').length){
							searchTxt.searchResultFlag = "Y";
						}
						//PJTSEARCH-1 END
						
						// ajax call
						ajax.call(url, searchTxt, 'json', function (data, _this) {
							if(data.data) {
								searchCommon[idx].ajaxSuccess(data.data[0], _this);
							} else {
								searchCommon[idx].ajaxSuccess(data, _this);
							}
						});
					},
					doRecent: function () {
						if (this.canFocus == 1) this.$recentArea.show();
						this.$resultArea.hide();
						// check the cookie
						if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
							var recentCookieTxt;
							var recentCookieArr;
							if (this.canCookie == 1) {
								recentCookieTxt = getCookie(this.cookieName);
								if (recentCookieTxt == undefined) recentCookieTxt = '';
								recentCookieArr = recentCookieTxt.split('|');
								if (recentCookieTxt == '') {
									removeCookie(this.cookieName);
								}
								var recentNoResult = searchCommon[idx].$recentArea.find('.not-result.recent-keyword'),
									recentList = searchCommon[idx].$recentArea.find('ul.list.recent-keyword');
								//console.log(recentCookieArr);
								if (recentCookieTxt == 'undefined' || recentCookieTxt == '') {
									recentNoResult.show();
									recentList.empty().hide();
								} else {
									if (recentCookieTxt == '') {
										recentNoResult.show();
										recentList.empty().hide();
									} else {
										var list = '';
										for (var i = 0; i < recentCookieArr.length; i++) {
											list = list + '<li><a href="#"><strong class="product-name">' + recentCookieArr[i] + '</strong></a><a href="#" class="delete"><span class="icon"></span><span class="sr-only">Delete</span></a></li>';
										}
										recentNoResult.hide();
										recentList.html(list).show();
										this.bindDeleteKeyword();
									}
								}
								this.bindClickKeyword();
								// show recent head
								this.$recentArea.find('.search-head').eq(0).show();
							} else {
								searchCommon[idx].$recentArea.find('.not-result.recent-keyword').hide();
								searchCommon[idx].$recentArea.find('ul.list.recent-keyword').empty().hide();
								// hide recent head
								this.$recentArea.find('.search-head').eq(0).hide();
							}
						} else {
							var $obj = this.$recentArea.find('ul.list.recent-keyword');
							$obj.siblings('.not-result.recent-keyword').hide();
							ePrivacyCookies.view('load', 'small', $obj);
						}
					},
					addCookieList: function (searchTxt) {
						// add searchTxt in cookie list
						var recentCookieTxt = getCookie(this.cookieName);
						if (recentCookieTxt == undefined) recentCookieTxt = '';
						var recentCookieArr = recentCookieTxt.split('|');

						// Clear duplicate values on array
						var isDup = recentCookieArr.indexOf(searchTxt);
						if (isDup > -1) recentCookieArr.splice(isDup, 1);

						// If you have five search terms, delete the oldest one.
						if(recentCookieArr.length>=5) {
							recentCookieArr.pop();
						}

						// Add new value to the front of the array
						if (recentCookieTxt == 'undefined' || recentCookieTxt == '') recentCookieArr = [searchTxt];
						else recentCookieArr.unshift(searchTxt);

						// set Cookie
						if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
							setCookie(this.cookieName, recentCookieArr.join('|'));
						}
					},
					deleteCookieList: function (searchTxt) {
						// delete searchTxt in cookie list
						var recentCookieTxt = getCookie(this.cookieName);
						if (recentCookieTxt == undefined) recentCookieTxt = '';
						var recentCookieArr = recentCookieTxt.split('|');
						// delete searchTxt from array
						var isTxt = recentCookieArr.indexOf(searchTxt);
						if (isTxt > -1) recentCookieArr.splice(isTxt, 1);

						// set Cookie
						if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
							if (recentCookieArr.length > 0) {
								setCookie(this.cookieName, recentCookieArr.join('|'));
							} else {
								removeCookie(this.cookieName);
							}
						} else {
							removeCookie(this.cookieName);
						}
					},
					ajaxSuccess: function (data, _this) {
						var seemore = searchCommon[idx].$resultArea.find('.search-result-seemore');
						if (!data.link || data.link == '') {
							seemore.hide();
						} else {
							seemore.show().find('a').attr('href', data.link);
						}
						
						/* PJTERAP-1 Start, ocr 제품등록 페이지 판단(thumbnail 추가) */
						var pageFlag = $('#mylgProductPageType').val() != null && $('#mylgProductPageType').val() != undefined && $('#mylgProductPageType').val() == 'ocr';
						var recentNoResult = searchCommon[idx].$resultArea.find('.not-result');
						if(pageFlag){
							resultList = searchCommon[idx].$resultArea.find('ul.list-item');
						}else{
							resultList = searchCommon[idx].$resultArea.find('ul.list');
						}
						/* PJTERAP-1 End */
						//LGEJP-396
						var obuCodeList = $('input[name="obuCodeList"]').val();
						if(obuCodeList != 'undefined' && obuCodeList != null && obuCodeList != '' ){
							obuCodeList  =	obuCodeList.split(',');		
						}
									
						if (data.Flag == 'N') {
							recentNoResult.show();
							resultList.hide();
							//PJTSEARCH-1 START
							var autoLen = data.autoData ? data.autoData.length : '';
							var autoList = searchCommon[idx].$resultArea.find('.autoName-list');
							var autoNotReult = searchCommon[idx].$resultArea.find('.not-result.recent-keyword');
							if(autoLen != '' && autoLen>0){
								autoList.show();
								autoNotReult.hide();
							}else{
								autoList.hide();
								autoNotReult.show();
							}
							//PJTSEARCH-1 END
						} else {
							recentNoResult.hide();
							resultList.show();
							var len = data.predictive ? data.predictive.length : '';
							//PJTSEARCH-1 Add
							var autoLen = data.autoData ? data.autoData.length : '';
							html = '';
							html2 = '';
							html3 = '';
							if (len > 0 || autoLen > 0) {
								if (len > this.max) len = this.max;

								if (this.$template[0] != undefined) {
									var template = this.$template;
									//PJTSEARCH-1 START
									for(var i=0; i < this.$template.length; i++){
										template = this.$template.get(i);
										this.$template.find('script').remove();
										
										if(template.id == 'automaticTemplate' && autoLen != ''){
											var searchTxt = xssfilter(this.$input.val(), 'form');
											for (var j = 0; j < autoLen; j++) {
												var _templateMarkup = $(template).clone().html();
												var target = '';
												if(data.autoData[j].linkTarget == 0){
													target = '_self';
												}else{
													target = '_blank';
												}
												
												var sitemapName = data.autoData[j].sitemapName;
												
												if(j == 0){
													if(sitemapName.toLowerCase() == searchTxt.toLowerCase()){
														$('#searchByKeyword').attr('auto-url', data.autoData[j].linkPath);
													}else{
														$('#searchByKeyword').removeAttr('auto-url');
													}
												}
												
												sitemapName = data.autoData[j].sitemapName;
												var matchText = sitemapName.match(new RegExp(searchTxt, "i"));
												sitemapName = sitemapName.replace(matchText,"\<span\>"+matchText+"\<\/span\>");
												
												_templateMarkup = _templateMarkup.replace('*linkPath*', data.autoData[j].linkPath)
												.replace('*target*', target)
												.replace('*sitemapName*', sitemapName);
												
												html2 = html2 + (_templateMarkup);
											}
											
										}else if(template.id == 'searchMatchedProductTemplate' && data.matchedModelFlag == 'Y'){
												var _templateMarkup = $(template).clone().html();
												
												var wtbExterNalCheck = function(data){
													if(data.wtbExternalLinkUseFlag=="Y" && data.wtbExternalLinkUrl != null && data.wtbExternalLinkUrl != '' && data.wtbExternalLinkName != null && data.wtbExternalLinkName != ''){
														return "in-buynow";
													}else{
														return "where-to-buy";
													}
												};
												
												//버튼 area check
												var atcBtnType = data.matchedModelInfo[0].addToCartBtnType;
												var wtbBtnType = data.matchedModelInfo[0].wtbBtnType;
												var addToCartUrl = "";
												var wtbUrl = "";
												var atcActive = "";
												var wtbActive = "";
												var iqActive = "";
												var ftdActive = "";
												
												if(data.matchedModelInfo[0].addToCartBtnFlag == 'Y'){
													atcActive = "active";
													
													if(atcBtnType == 'preOrder'){
														addToCartUrl = data.matchedModelInfo[0].addToCartUrl;
													}else if(atcBtnType == 'addToCart'){
														addToCartUrl = data.matchedModelInfo[0].addToCartUrl;
													}else if(atcBtnType == 'buyNow'){
														addToCartUrl = data.matchedModelInfo[0].buyNowUrl;
													}else if(atcBtnType == 'reseller'){
														addToCartUrl = data.matchedModelInfo[0].resellerLinkUrl;
													}else if(atcBtnType == 'productSupport'){
														addToCartUrl = data.matchedModelInfo[0].productSupportUrl;
													}
												}
												
												if(data.matchedModelInfo[0].wtbBtnFlag == 'Y'){
													wtbActive = "active";
													
													if(wtbBtnType == 'wtb'){
														wtbUrl = data.matchedModelInfo[0].whereToBuyUrl;
													}else if(wtbBtnType == 'external'){
														wtbUrl = data.matchedModelInfo[0].wtbExternalLinkUrl;
													}
												}
												
												if(data.matchedModelInfo[0].inquiryBtnFlag == 'Y'){
													iqActive = "active";
												}
												
												if(data.matchedModelInfo[0].findTheDealerBtnFlag == 'Y'){
													//ftdActive = "active";
												}
												
												var manualTag = "";
												var softwareTag = "";
												var requestRepairTag = "";
												var registerProductTag = "";
												//PJTSEARCH-1_slick start
												if(data.matchedModelInfo[0].manualUrl != undefined && data.matchedModelInfo[0].manualUrl != null && data.matchedModelInfo[0].manualUrl != ''){
													manualTag = "<li><a href='"+data.matchedModelInfo[0].manualUrl+"'><img src='/lg5-common-gp/images/common/icons/manuals.svg' alt='Manuals' aria-hidden='true'/><p>"+data.matchedModelInfo[0].manualText+"</p></a></li>";
												}
												
												if(data.matchedModelInfo[0].softwareUrl != undefined && data.matchedModelInfo[0].softwareUrl != null && data.matchedModelInfo[0].softwareUrl != ''){
													softwareTag = "<li><a href='"+data.matchedModelInfo[0].softwareUrl+"'><img src='/lg5-common-gp/images/common/icons/software.svg' alt='Software Drivers' aria-hidden='true'/><p>"+data.matchedModelInfo[0].softwareText+"</p></a></li>";
												}
												
												if(data.matchedModelInfo[0].requestaRepairUrl != undefined && data.matchedModelInfo[0].requestaRepairUrl != null && data.matchedModelInfo[0].requestaRepairUrl != ''){
													requestRepairTag = "<li><a href='"+data.matchedModelInfo[0].requestaRepairUrl+"'><img src='/lg5-common-gp/images/common/icons/requestrepair.svg' alt='Request Repair' aria-hidden='true'/><p>"+data.matchedModelInfo[0].requestaRepairText+"</p></a></li>";
												}
												
												var registeraProductUrl = "";
												if(_dl.isLogin == 'Y' && data.matchedModelInfo[0].registeraProductUrl != ''){
													registeraProductUrl = data.matchedModelInfo[0].registeraProductUrl;
												}else if(_dl.isLogin != 'Y' && data.matchedModelInfo[0].registeraProductUrl != ''){
													registeraProductUrl = "\/"+_dl.country_code+"\/mylg\/login?state="+data.matchedModelInfo[0].registeraProductUrl;
												}
												
												if(registeraProductUrl != ''){
													registerProductTag = "<li><a href='"+registeraProductUrl+"'><img src='/lg5-common-gp/images/common/icons/regist-product.svg' alt='Register a Product' aria-hidden='true'/><p>"+data.matchedModelInfo[0].registeraProductText+"</p></a></li>";
												}
												//PJTSEARCH-1_slick end
												_templateMarkup = _templateMarkup.replace(/\*imageAltText\*/g, (data.matchedModelInfo[0].imageAltText != null) ? data.matchedModelInfo[0].imageAltText : '')
												.replace(/\*mediumImageAddr\*/g, data.matchedModelInfo[0].mediumImageAddr)
												.replace(/\*modelId\*/g, data.matchedModelInfo[0].modelId)
												.replace(/\*modelUrlPath\*/g, data.matchedModelInfo[0].modelUrlPath)
												.replace(/\*modelName\*/g, data.matchedModelInfo[0].modelName)
												.replace(/\*userFriendlyName\*/g, data.matchedModelInfo[0].userFriendlyName == null ? '' : data.matchedModelInfo[0].userFriendlyName.replace(/\"/g, "''"))
												.replace(/\*whereToBuyFlag\*/g, data.matchedModelInfo[0].wtbBtnFlag)
												.replace(/\*whereToBuyUrl\*/g, wtbUrl)
												.replace(/\*wtbBtnMsg\*/g, data.matchedModelInfo[0].wtbBtnMsg)
												.replace(/\*findTheDealerFlag\*/g, data.matchedModelInfo[0].findTheDealerBtnFlag)
												.replace(/\*findTheDealerUrl\*/g, data.matchedModelInfo[0].findTheDealerUrl)
												.replace(/\*findTheDealerBtnMsg\*/g, data.matchedModelInfo[0].findTheDealerBtnMsg)
												.replace(/\*addToCartFlag\*/g, data.matchedModelInfo[0].addToCartBtnFlag)
												.replace(/\*addToCartUrl\*/g, addToCartUrl)
												.replace(/\*addToCartBtnMsg\*/g, data.matchedModelInfo[0].addToCartBtnMsg)
												.replace(/\*inquiryToBuyUrl\*/g, data.matchedModelInfo[0].inquiryToBuyUrl)
												.replace(/\*inquiryToBuyFlag\*/g, data.matchedModelInfo[0].inquiryBtnFlag)
												.replace(/\*salesModelCode\*/g, data.matchedModelInfo[0].salesModelCode)
												.replace(/\*salesSuffixCode\*/g, data.matchedModelInfo[0].salesSuffixCode)
												.replace(/\*buName1\*/g, data.matchedModelInfo[0].buName1)
												.replace(/\*buName2\*/g, data.matchedModelInfo[0].buName2)
												.replace(/\*buName3\*/g, nvl(data.matchedModelInfo[0].buName3,''))
												.replace(/\*superCategoryName\*/g, data.matchedModelInfo[0].superCategoryName)
												.replace(/\*bizType\*/g, data.matchedModelInfo[0].bizType)
												.replace(/\*wtbClass\*/g, wtbExterNalCheck(data.matchedModelInfo[0]))
												.replace(/\*atcActive\*/g, atcActive)
												.replace(/\*wtbActive\*/g, wtbActive)
												.replace(/\*iqActive\*/g, iqActive)
												.replace(/\*ftdActive\*/g, ftdActive)
												.replace(/\*manualTag\*/g, manualTag)
												.replace(/\*softwareTag\*/g, softwareTag)
												.replace(/\*requestRepairTag\*/g, requestRepairTag)
												.replace(/\*registerProductTag\*/g, registerProductTag)
												.replace(/\*pspUrl\*/g, data.matchedModelInfo[0].pspUrl)
											    .replace(/\*atcClass\*/g, data.matchedModelInfo[0].obsBuynowFlag == 'Y' ? 'in-buynow' : 'pre-order');
								
											html3 = html3 + (_templateMarkup);
										}else if (template.id == 'relatedTemplate'){
											for (var j = 0; j < len; j++) {
												var _templateMarkup = $(template).clone().html();
												
												_templateMarkup = _templateMarkup.replace('*url*', data.predictive[j].url)
												.replace('*model*', data.predictive[j].model)
												.replace('*name*', data.predictive[j].name)
												.replace('*category*', data.predictive[j].category);
												
												html = html + (_templateMarkup);
											}
										}
										
										
									}
									
									var autoListArea = searchCommon[idx].$resultArea.find('ul.autoName-list');
									if(autoListArea != undefined){
										autoListArea.html(html2);
									}
									var matchedProductResultArea = searchCommon[idx].$resultArea.find('div.success-seacrh-inner');
									if(matchedProductResultArea != undefined){
										matchedProductResultArea.html(html3);
										searchCommon[idx].doSetMatchModelClick();
										var btnList = matchedProductResultArea.find(".btn-area a");
										for(var i = 0; i < btnList.length; i++){
											if(data.matchedModelInfo[0].wtbExternalLinkUseFlag == 'Y' && $(btnList[i]).hasClass('in-buynow') && data.matchedModelInfo[0].wtbExternalLinkUrl != ""){
												$(btnList[i]).attr('data-link-name',"buy_now");
												$(btnList[i]).removeAttr('data-sc-item');
												if(data.matchedModelInfo[0].wtbExternalLinkSelfFlag != 'Y'){
													$(btnList[i]).attr("target" , "_blank");
													$(btnList[i]).attr("title" , data.matchedModelInfo[0].btnNewLinkTitle);
												}
											}
											if(data.matchedModelInfo[0].btnColorChange == 'Y'){
												if($(btnList[i]).hasClass("btn-primary")){
													$(btnList[i]).removeClass("btn-primary");
													$(btnList[i]).addClass("btn-outline-secondary");
												}else{
													$(btnList[i]).removeClass("btn-outline-secondary");
													$(btnList[i]).addClass("btn-primary");
												}
											}
										}
										//PJTSEARCH-1_slick start
										setTimeout(function() {
											var $obj = $('.success-etc ul');
											var $slick = null;
											var slideInit = function() {
												$slick = $obj.slick({
													infinite: false,
													slidesToShow: 3,
													slidesToScroll: 3,
													variableWidth: true,
													arrows : true,
													dots: false,
													responsive: [
														{
															breakpoint: 1024,
															settings: {
																slidesToShow: 1,
																slidesToScroll: 1
															}
														}
													]	
												});
											}
											$obj.filter('.slick-initialized').slick('unslick');
											slideInit()
										}, 100);
									}
									//PJTSEARCH-1_slick end
									var autoList = searchCommon[idx].$resultArea.find('.autoName-list');
									var autoHead = searchCommon[idx].$resultArea.find('.autoName-box .search-head');
									var autoNotReult = searchCommon[idx].$resultArea.find('.not-result.recent-keyword');
									var matchedSuccess = searchCommon[idx].$resultArea.find('.autoName-box .success-seacrh');
									if(data.matchedModelFlag == 'Y'){
										autoHead.hide();
										autoList.hide();
										autoNotReult.hide();
										matchedSuccess.show();
										$('#searchByKeyword').removeAttr('auto-url');
									}else if(data.matchedModelFlag != 'Y'){
										autoHead.show();
										if(autoLen == ''){
											autoList.hide();
											autoNotReult.show();
											$('#searchByKeyword').removeAttr('auto-url');
										}else{
											autoList.show();
											autoNotReult.hide();
											if(len == ''){
												recentNoResult.show();
												autoNotReult.hide();
											}
										}
										matchedSuccess.hide();
									}
									//PJTSEARCH-1

								} else {
									for (var i = 0; i < len; i++) {

										var tempCateHTML = '';
										/*LGEMS-213 add*/ 
										if(data.predictive[i].supercate) tempCateHTML = tempCateHTML + ' data-supercategory='+data.predictive[i].supercate;
										else if(data.predictive[i].cs_super_category_id) tempCateHTML = tempCateHTML + ' data-supercategory='+data.predictive[i].cs_super_category_id;
										if(data.predictive[i].cate) tempCateHTML = tempCateHTML + ' data-category='+data.predictive[i].cate;
										else if(data.predictive[i].cs_category_id) tempCateHTML = tempCateHTML + ' data-category='+data.predictive[i].cs_category_id;
										if(data.predictive[i].subcate) tempCateHTML = tempCateHTML + ' data-subcategory='+data.predictive[i].subcate;
										else if(data.predictive[i].cs_sub_category_id) tempCateHTML = tempCateHTML + ' data-subcategory='+data.predictive[i].cs_sub_category_id;
										//LGEJP-396
										if(obuCodeList != 'undefined' && obuCodeList != null && obuCodeList != '' ){
											var obuFlag = false;
											for(var j = 0; j < obuCodeList.length; j++){
												if(obuCodeList[j] == data.predictive[i].obu_code ){
													obuFlag = true;
												}
											  }
											}
											
										    var obuName = obuFlag ? data.predictive[i].model : data.predictive[i].model_code;
										    if(obuName == undefined || obuName == ''){
										    	obuName = data.predictive[i].model;
										    }
										if (data.predictive[i].model && !data.helpModelFlag) { // model search 
											//LGEJP-52 ADD
											if(COUNTRY_CODE.toLowerCase() == 'jp'){// <span class="product-name"></span> 제거
												if(pageFlag){ //PJTERAP-1
													html = html + '<li><a rel="nofollow" href="' + data.predictive[i].url +'"'+tempCateHTML+'><div class="model-name" style="display:none">' + data.predictive[i].model + '</div><div class="list-box"><div class="pd-img"><img data-src="'+data.predictive[i].cs_model_image_path+'" src="'+data.predictive[i].cs_model_image_path+'" class="mCS_img_loaded lazyloaded" alt="" data-loaded="true"></div><div class="pd-list-info"><p class="pd-list-num">'+obuName+'</p><p class="pd-list-name">'+data.predictive[i].name+'</p></div></div></a></li>';
												}else{
													html = html + '<li><a rel="nofollow" href="' + data.predictive[i].url + '"'+tempCateHTML+'><span class="model-name">' + obuName + '</span><span class="category-name">' + data.predictive[i].category + '</span></a></li>';
												}
											} else{
												if(pageFlag){ //PJTERAP-1
													html = html + '<li><a rel="nofollow" href="' + data.predictive[i].url +'"'+tempCateHTML+'><div class="model-name" style="display:none">' + data.predictive[i].model + '</div><div class="list-box"><div class="pd-img"><img data-src="'+data.predictive[i].cs_model_image_path+'" src="'+data.predictive[i].cs_model_image_path+'" class="mCS_img_loaded lazyloaded" alt="" data-loaded="true"></div><div class="pd-list-info"><p class="pd-list-num">'+obuName+'</p><p class="pd-list-name">'+data.predictive[i].name+'</p></div></div></a></li>';
												}else{
													html = html + '<li><a rel="nofollow" href="' + data.predictive[i].url + '"'+tempCateHTML+'><span class="model-name">' + obuName + '</span><span class="product-name">' + data.predictive[i].name + '</span><span class="category-name">' + data.predictive[i].category + '</span></a></li>';
												}
											}
										}
										else if(data.helpModelFlag){ // <span class="model-name"></span> 제거
											html = html + '<li><a rel="nofollow" href="' + data.predictive[i].url + '"'+tempCateHTML+'><span class="product-name">' + data.predictive[i].name + '</span><span class="category-name">' + data.predictive[i].category + '</span></a></li>'; //LGEBR-126

										}
										else if(data.helpModelFlag){ // <span class="model-name"></span> 제거
											html = html + '<li><a rel="nofollow" href="' + data.predictive[i].url + '"'+tempCateHTML+'><span class="product-name">' + data.predictive[i].name + '</span><span class="category-name">' + data.predictive[i].category + '</span></a></li>'; //LGEBR-126
										}
										else {
											html = html + '<li><a rel="nofollow" href="' + data.predictive[i].url + '"'+tempCateHTML+'><span class="model-name">' + data.predictive[i].content + '</span><span class="product-name">' + data.predictive[i].name + '</span><span class="category-name">' + data.predictive[i].category + '</span></a></li>';
										}
								   }
								}		
								resultList.html(html);
								//PJTSEARCH-1 add
								searchCommon[idx].doSetAutoCookie();
								if (this.functionName && this.functionName != '') {
									resultList.find('li a').on('click', function (e) {
										e.preventDefault();
										var model = $(this).find('.model-name').text();
										var category = $(this).data('category');
										var subcategory = $(this).data('subcategory');
										var functionNameText = searchCommon[idx].functionName;
										if(functionNameText) {
											if(functionNameText=="pickerBox.model") {
												// CS Software & Drivers, CS Manuals & Documents
												new Function(functionNameText + '("' + model + '", "'+category+'", "'+subcategory+'")')(); // jshint ignore:line
												$(this).closest('form.search-common').find('.search-input input[type=text]').val($(this).find('.model-name').text());
												// CS Software & Drivers, CS Manuals & Documents : Search
												adobeTrackEvent('cs-onsite-search', {search_keyword : searchCommon[idx].$obj.find('.search-input input[type=text]').val(), page_event : {onsite_search : true}});
											} else {
												new Function(functionNameText + '()')(); // jshint ignore:line
											}
										}
										searchCommon[idx].$layer.removeClass('active');
									});
								}
								var $resultValue = searchCommon[idx].$layer.find('.results .value');
								if ($resultValue.length > 0) {
									$resultValue.text(data.predictive.length);
								}
							} else {
								recentNoResult.show();
								resultList.hide();
								var $resultValue1 = searchCommon[idx].$layer.find('.results .value');
								if ($resultValue1.length > 0) {
									$resultValue1.text('0');
								}
								var autoList = searchCommon[idx].$resultArea.find('.autoName-list');
								if(autoList.length > 0){
									autoList.hide();
								}
							}
						}
					}
				};
				searchCommon[idx].init();
			}
		});
	};
(function ($) {
	if (!document.querySelector('.search-common')) return false;
	searchInit();
})(jQuery);


/*
**jquery datepicker
*/
// 20200408 START 오샘 || localeOption 추가
var defaultOptions = {
	isRTL : ($('[dir=rtl]').length>0) ? true : false,
	// 20200409 START 박지영 : date picker 옵션 추가
	prevText : previousTxt,
	nextText : nextTxt,
	dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // default = 영문
	monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	// 20200409 END
	showOtherMonths: true,
	// 20200408 START 박지영 : date picker 옵션 수정
	changeYear: true,
	// 20200408 END
	// 20200603 START 박지영 : 현재 년도 +10~-100까지 출력하도록 수정
	yearRange: 'c-100:c+10',
	// 20200603 END
	beforeShow: function () {
		if (!('ontouchstart' in window)) {
			$(window).on({
				resize: function () {
					$('.run-datepicker').datepicker('hide').blur();
					$(window).off('resize');
				}
			});
		}
	}
};
var localeOptions = {
	ru:{
		monthNames: [ "Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь" ],
		monthNamesShort: [ "Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек" ],
		dayNames: [ "воскресенье","понедельник","вторник","среда","четверг","пятница","суббота" ],
		dayNamesShort: [ "вск","пнд","втр","срд","чтв","птн","сбт" ],
		dayNamesMin: [ "Вс","Пн","Вт","Ср","Чт","Пт","Сб" ],
		firstDay: 1,
	},
	cz:{
		monthNames: [ "leden","únor","březen","duben","květen","červen","červenec","srpen","září","říjen","listopad","prosinec"]
	},
	sk:{
		monthNames: [ "január","február","marec","apríl","máj","jún","júl","august","september","october","november","december"]
	},	
	kz:{ //LGEKZ-130 START
		monthNames: [ "Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"]
	} //LGEKZ-130 END
};

var runDatepicker;
(function ($) {
	runDatepicker = function () {
		var dps = document.querySelectorAll('.datepicker-wrap');

		$(dps).each(function () {
			if(!$(this).find(".run-datepicker").length){
				return true;
			}else if($(this).find(".run-datepicker").hasClass("hasDatepicker")){
				return true;
			}else if($(this).closest('template').length){
				return true;
			}
			
			var el = this; // this
			var $calander = $(el).find('.run-datepicker'); // this
			var dayNames = $calander.get(0).getAttribute('data-day-names');
			// 20200429 START 박지영 : JS lint 수정
			if (dayNames) {
				var split1 = dayNames.match(/,|\/|-|\|/);
				dayNames = dayNames.match(/,|\/|-|\|/) ? dayNames.split(split1) : null;
				defaultOptions.dayNamesMin = dayNames;
			}
			// 20200409 START 박지영 : date picker 옵션 추가
			var monthNames = $calander.get(0).getAttribute('data-month-names');
			if (monthNames) {
				var split2 = monthNames.match(/,|\/|-|\|/);
				monthNames = monthNames.match(/,|\/|-|\|/) ? monthNames.split(split2) : null;
				defaultOptions.monthNames = monthNames;
			}
			// 20200429 END
			var yearSuffix = $calander.get(0).getAttribute('data-year-suffix');
			if(yearSuffix) {
				defaultOptions.yearSuffix = yearSuffix;
			}
			// 20200409 END
			defaultOptions.dateFormat = $calander.get(0).getAttribute('data-date-format');

			$calander.datepicker(
				$.extend(defaultOptions, localeOptions[COUNTRY_CODE] || {})
			);
			// .datepicker("setDate", new Date())
			$(el).find('.datepicker-trigger').on({
				click: function (e) {
					e.preventDefault();
					$calander.datepicker('show');
				}
			});
		});
	};
	runDatepicker();
})(jQuery);
// 20200408 END 오샘 || localeOption 추가

// tab Scripts
(function ($) {
	if (!document.querySelector('.tabs-type-liner') && !document.querySelector('.tabs-type-rect') && !document.querySelector('.tabs-type-line-box') && !document.querySelector('.tabs-type-vertical') ) return false;

	var $tabs = $('.tabs-type-liner, .tabs-type-rect, .tabs-type-line-box, .tabs-type-vertical');
	var tabLengthCount = 0;
	var $tabVertical = $(".tab-vertical");
	$tabVertical.length && $(function(){
		$tabVertical.mCustomScrollbar();
	});
	/*
	var fixScrollPos = function($obj) {
		// scroll
		if($obj.closest('.has-scroll').length>0) {
			var cont = $obj.closest('.has-scroll');
			var contBox = cont.find('.mCustomScrollBox');
			var thisLeft = $obj.offset().left;
			var thisRight = $obj.offset().left + $obj.outerWidth();
			var isRTL = ($('[dir=rtl]').length>0) ? true : false;

			if(isRTL) {
				if(thisRight > (contBox.offset().left + contBox.outerWidth())) { // right side
					cont.find('.js-tab-guide-outer').mCustomScrollbar("scrollTo", $obj.offset().left - cont.find('.mCSB_container').offset().left);
				} else if(thisLeft < contBox.offset().left) { // left side
					var d = ($(window).width() < 768) ? 0:30;
					var st = Math.ceil(Math.abs(parseInt(cont.find('.mCSB_container').css('left'))) + $obj.outerWidth() - ($(window).width() - $obj.offset().left - cont.find(".tab-scroll-controller").children().first().innerWidth()));
					cont.find('.js-tab-guide-outer').mCustomScrollbar("scrollTo", st+d);
				}
			} else {
				if(thisLeft < contBox.offset().left) { // left side
					cont.find('.js-tab-guide-outer').mCustomScrollbar("scrollTo", $obj.offset().left - cont.find('.mCSB_container').offset().left);
				} else if(thisRight > (contBox.offset().left + contBox.outerWidth())) { // right side
					var d = ($(window).width() < 768) ? 0:30;
					var st = Math.ceil(Math.abs(parseInt(cont.find('.mCSB_container').css('left'))) + $obj.outerWidth() - ($(window).width() - $obj.offset().left - cont.find(".tab-scroll-controller").children().first().innerWidth()));
					cont.find('.js-tab-guide-outer').mCustomScrollbar("scrollTo", st+d);
				}
			}
		}
	}
	*/
	$tabs.each(function () {
		// 20200406 START 이상현 - tab ui 인터랙션 수정
		if($(this).hasClass('js-tab')){
			// pre setting
			$(this).find('[role="tab"]').not('.active').attr('tabindex', -1);
			$(this).closest('.tab-wrap').find('.tab-scroll-controller').children().attr('tabindex', -1);

			// key interaction
			$(this).find('[role="tab"]').on('keydown.test', function(e){
				var isRTL = ($('[dir=rtl]').length>0) ? true : false;
				var _this = $(this);
				if(e.keyCode === 39 || e.keyCode === 40){ // right
					if($(this).parent().next().find('[role="tab"]').length > 0){
						//$(this).parent().next().siblings().find('[role="tab"]').attr({'tabindex' : -1});
						$(this).parent().next().find('[role="tab"]').attr({'tabindex' : 0}).focus();
						_this.attr({'tabindex' : -1});
					}
				}else if(e.keyCode === 37 || e.keyCode === 38){ // left
					if($(this).parent().prev().find('[role="tab"]').length > 0){
						//$(this).parent().next().siblings().find('[role="tab"]').attr({'tabindex' : -1});
						$(this).parent().prev().find('[role="tab"]').attr({'tabindex' : 0}).focus();
						_this.attr({'tabindex' : -1});
					}
				}else if(e.keyCode === 36){ // home
					e.preventDefault();
					$(this).closest('[role="tablist"]').find('[role="tab"]').eq(0).attr({'tabindex' : 0}).focus();//.trigger('click');
					_this.attr({'tabindex' : -1});
					return false;
				}else if(e.keyCode === 35){ // end 
					e.preventDefault();
					$(this).closest('[role="tablist"]').find('[role="tab"]').eq( $(this).closest('[role="tablist"]').find('[role="tab"]').length - 1 ).attr({'tabindex' : 0}).focus();//.trigger('click');
					_this.attr({'tabindex' : -1});
					return false;
				}else if(e.keyCode === 32){	// space
					e.preventDefault();
					$(this).trigger('click');
				}
			});
		}
		// 20200406 END
		$(this).find('a').on('click', function (e) {
			// click tabs

			/* LGEIN-111 20200728 add */
			var $a = $(this);
			if ($a.filter('[data-flag-blank][target="_blank"]').length) {
				return;
			}
			/* //LGEIN-111 20200728 add */

			e.preventDefault();
			if ($a.attr('href').indexOf('/') != -1) {
				location.href = $a.attr('href');
			} else {
				var target = '#' + $a.attr('href').split('#')[1];
				var $parent = $a.closest('.tabs-type-liner, .tabs-type-rect, .tabs-type-line-box, .tabs-type-vertical');
				// change tab design
				$a.addClass('active');
				$parent.find('a').not($a).removeClass('active').attr('aria-selected', false);
				$a.addClass('active').attr('aria-selected', true);
				// 20200406 START 이상현 - tab ui 인터랙션 수정
				if($a.closest('.js-tab').length>0){
					$parent.find('[role="tab"]').not($a).attr('tabindex', -1);
					$a.attr('tabindex', 0);
				}
				// 20200406 END
				// toggle selected tab area
				if (target != "#" && $(target).get(0)) {
					var tclass = $(target).attr('class').replace(' active', '').split(' ')[0];
					var target2 = ($parent.parents().find('.' + tclass).length > 0) ? $parent.parents().find('.' + tclass) : $parent.parent().parent().find('.' + tclass);
					if (target2.length == 0 && $parent.closest('.tab-wrap').length > 0) {
						var $parent2 = $parent.closest('.tab-wrap');
						target2 = ($parent2.parent().find('.' + tclass).length > 0) ? $parent2.parent().find('.' + tclass) : $parent2.parent().parent().find('.' + tclass);
					}
					var parentType = 1;
					if ($parent.closest('.track-repair-signin').length > 0) {
						// track repair signin
						target2 = $parent.closest('.track-repair-signin').find('.' + tclass);
						parentType = 2;
					} else if ($parent.closest('.component').length > 0) {
						// components (all)
						parentType = 3;
						target2 = $parent.closest('.component').find('.' + tclass);
						if ($(target).find('.slick-slider').length > 0) {
							setTimeout(function () {
								$(target).css({"opacity": 0});
								target2.removeClass('active');
								$(target).addClass('active');
								setTimeout(function () {
									$(target).find('.slick-slider').css({'width': '100%'}).slick('setPosition');
									$(target).animate({'opacity': 1}, 200);
								}, 200);
							}, 200);
						} else {
							target2.removeClass('active');
							$(target).addClass('active');
						}
						if(typeof runBVStaticPLP != 'undefined') runBVStaticPLP($(target));
					}
					if (parentType < 3) {
						target2.removeClass('active');
						$(target).addClass('active');
					}
				}

				// scroll
				// 20200511 START 이상현 - 선택한 tab이 늘 정위치에 오도록 수정
				setActiveScroll($a.closest(".tab-outer"))
				// 20200511 END
				//fixScrollPos($a);
			}
		});
	});
})(jQuery);

// Scripts that run on designed input=file
var bindFileUpload;
(function ($) {
	bindFileUpload = function ($el) {
		var $file = $el || $('.delivery-part').not('.available');
		if ($file.length >= 1) {
			$file.each(function () {
				var _this = this;
				$(this).addClass('available');
				var $inputTxt = $(this).find('.file-name-expose'),
					$inputFile = $(this).find('.replace-file-input input[type=file]');

				// Print file name when file is attached
				$(_this).on({
					change: function (e) {
						var fileName;
						var delTarget = e.delegateTarget;
						var _$inputTxt = $(delTarget).find('input.file-name-expose');

						if(e.currentTarget.files[0]) {
							var deleteText = _$inputTxt.attr('data-delete-title') ? _$inputTxt.attr('data-delete-title') : 'Delete';
							if (window.FileReader) {
								fileName = $(e.currentTarget)[0].files[0].name;
							} else {
								fileName = $(e.currentTarget).val().split('/').pop().split('\\').pop();
							}
							_$inputTxt.focus().val(fileName);
							$(delTarget).addClass('attached');

							if (!$(delTarget).find('div.file-name-expose').get(0)) {
								_$inputTxt.wrap('<div class="file-name-expose"></div>');
								$(delTarget).find('div.file-name-expose').append('<a class="delete" href="#"><span class="icon"></span><span class="sr-only">' + xssfilter(deleteText) + '</span></a>');
							}
						}else {
							fileName = $(e.currentTarget).val().split('/').pop().split('\\').pop();
							$(e.currentTarget).closest('.field-block').removeClass('error');
							_$inputTxt.focus().val('');
						}
					}
				}, 'input[type=file]');

				$(_this).on({
					click: function (e) {
						e.preventDefault();
						var delTarget = e.delegateTarget;
						$(delTarget).removeClass('attached');
						$(delTarget).find('input').val('');

						/* PJTEXTENDEDWTY-4 Start */
						if($('.extended-warranty').find('.btn.step-complete').length > 0){
							$('.extended-warranty').find('.btn.step-complete').prop("disabled",true);
						}
						/* PJTEXTENDEDWTY-4 End */
						// Remove error class when file is deleted
						$(delTarget).closest('.error').removeClass('error');
					}
				}, '.delete');

				// Pre-treat capacity limits to prevent arbitrary changes
				if ($inputFile.data('max')) {
					var max = $inputFile.data('max');
					$inputFile.removeAttr('data-max');
					$inputFile.data('max', max);
				}

				// Pre-process file extension limit values to prevent arbitrary changes
				if ($inputFile.data('extension')) {
					var extension = $inputFile.data('extension');
					$inputFile.removeAttr('data-extension');
					$inputFile.data('extension', extension);
				}
			});
		}
	};
	bindFileUpload();
})(jQuery);

// modal
$(function () {
	// fix modal for ie9
	var isIE = window.ActiveXObject || "ActiveXObject" in window;
	if (isIE) {
		$('.modal').removeClass('fade');
	}
});

// print
var runPrint;
(function ($) {
	runPrint = function () {
		if (!document.querySelector('.page-print') && !document.querySelector('.page-print')) return false;
		var $printPage = $('.page-print');
		$printPage.off().on('click', function (e) {
			e.preventDefault();

			if($('.request-repair-completion').length>0) {
				// request repair
				adobeTrackEvent('cs-repair-print', {page_event : {print_repair_request : true}});
			} else if($('.dispatch-portal-completion').length>0) {
				// dispatch portal
				adobeTrackEvent('cs-repair-print', {page_event : {print_repair_request : true}});
			} else if($('.request-ra-completion').length>0) {
				// request ra
				adobeTrackEvent('cs-repair-print', {page_event : {print_repair_request : true}});
			} else if($('.request-swap-completion').length>0) {
				// request swap
				adobeTrackEvent('cs-repair-print', {page_event : {print_repair_request : true}});
			} else if ($('.repair-info-wrap').length>0) {
				// track repair detail
				adobeTrackEvent('cs-repair-print', {page_event : {print_repair_request : true}});
			} else if ($('.email-result').length>0) {
				// email result
				adobeTrackEvent('cs-repair-print', {page_event : {print_repair_request : true}});
			}

			var modal = $(e.currentTarget).parents('.modal').get(0);
			if (modal) {
				//console.log('1');
				var divToPrint = modal;
				var newWin = window.open('', 'Print-Window');
				newWin.document.open();
				newWin.document.write('<html><body onload="window.print()"><link rel="stylesheet" href="/lg5-common-gp/css/modal-print.min.css" type="text/css" /><div class="modal">' + divToPrint.innerHTML + '</div></body></html>');
				setTimeout(function() {
					newWin.document.close();
					setTimeout(function () {
						newWin.close();
					}, 10);
				}, 200);
			} else {
				window.print();
			}
		});
	};
	runPrint();
})(jQuery);

// scroll tab
// WA-Common-Tab : mobile용 tab scroll guide 삭제
var tabMktControll;
(function ($) {
	// WA-Common-Tab : mobile용 tab scroll guide 삭제
	// tabGuideActive = function () {
	// 	var $guide = $('.js-tab-guide-outer');
	// 	for (var i = 0; i < $guide.length; i++) {
	// 		var $this = $guide.eq(i);
	// 		var arrow = '<div class="arrow"></div>';
	// 		if ($this.outerWidth() < $this.find('.js-tab-guide-inner').outerWidth()) {
	// 			$this.append(arrow);
	// 		}
	// 	}
	// 	$guide.off().on({
	// 		touchend: function () {
	// 			$(this).find('.arrow').addClass('js-fade');
	// 		}
	// 	});
	// };
	// if ('ontouchstart' in window && mql.maxXs.matches) {
	// 	$(window).on({
	// 		'orientationchange.tab': function () {
	// 			tabGuideActive();
	// 		}
	// 	});
	// 	tabGuideActive();
	// }

	tabMktControll = function () {
		// WA-Common-Tab : tab scroll button 추가를 위한 CSS 수정;
		var $mktTab = $('.js-tab-controll, .js-tab-controll-type2');
		$mktTab.on({
			click: function (e) {
				var current = e.currentTarget,
					scroll = e.delegateTarget.querySelector('.js-tab-guide-outer');
				// .mCustomScrollbar('scrollTo','+=300');
				// this.mcs.topPct
				if ($(current).is('.scroll-left')) {
					$(scroll).mCustomScrollbar('scrollTo', '+=300');
				} else if ($(current).is('.scroll-right')) {
					$(scroll).mCustomScrollbar('scrollTo', '-=300');
				}
			}
		}, 'button');

		$mktTab.find('.js-tab-guide-outer').on({
			scrolled: function () {
				var $wrap = $(this).closest('.js-tab-controll, .js-tab-controll-type2'); // WA-Common-Tab
				$wrap.find('.scroll-left').removeAttr('disabled');
				$wrap.find('.scroll-right').removeAttr('disabled');
			},
			totalScroll: function () {
				var $wrap = $(this).closest('.js-tab-controll, .js-tab-controll-type2'); // WA-Common-Tab
				$wrap.find('.scroll-left').removeAttr('disabled');
				$wrap.find('.scroll-right').attr('disabled', 'disabled');
			},
			totalScrollBack: function () {
				var $wrap = $(this).closest('.js-tab-controll, .js-tab-controll-type2'); // WA-Common-Tab
				$wrap.find('.scroll-left').attr('disabled', 'disabled');
				$wrap.find('.scroll-right').removeAttr('disabled');
			}
		});

		$mktTab.find('.js-tab-guide-outer').trigger('totalScrollBack');
	};
	// WA-Common-Tab : 모바일에서도 tabMktControll 활성화되도록 수정
	// if (!('ontouchstart' in window && mql.maxXs.matches)) {
	// 	tabMktControll();
	// }
	tabMktControll();
	// //js-tab-controll
})(jQuery);

// ie browser form attribute polyfill
(function () {
	// Via Modernizr
	function formAttributeSupport() {
		var form = document.createElement("form"),
			input = document.createElement("input"),
			div = document.createElement("div"),
			id = "formtest" + (new Date().getTime()),
			attr,
			bool = false;

		form.id = id;
		// IE6/7 confuses the form idl attribute and the form content attribute
		if (document.createAttribute) {
			attr = document.createAttribute("form");
			attr.nodeValue = id;
			input.setAttributeNode(attr);
			div.appendChild(form);
			div.appendChild(input);

			document.documentElement.appendChild(div);

			bool = form.elements.length === 1 && input.form == form;

			div.parentNode.removeChild(div);
		}

		return bool;
	}

	if (!formAttributeSupport()) {
		$(document)
			.on("click", "[type=submit][form]", function (event) {
				event.preventDefault();
				var formId = $(this).attr("form"),
					$form = $("#" + formId).submit();
			})
			.on("keypress", "form input", function (event) {
				var $form;
				if (event.keyCode == 13) {
					$form = $(this).parents("form");
					if ($form.find("[type=submit]").length == 0 &&
						$("[type=submit][form=" + $(this).attr("form") + "]").length > 0) {
						$form.submit();
					}
				}
			});
	}
}());

// PJTOBS-32 , PJTOBSB2E-3 Start 
function getAllPrice() {
	var models = new Array();
	// For products with a total class in price-area, buttons are only displayed on the screen if they have an active class
	// GPC0003, GPC0004, GPC0007, GPC0012, GPC0026, Compare, Search (B2C, B2B, No Result, Single B2C, Single B2B, View All B2C, View All B2B)
	var $productsInfo = $('.products-info');
	for(var i=0;i<$productsInfo.length;i++) {
		var model = $productsInfo.eq(i).attr('data-model-id') ? $productsInfo.eq(i).attr('data-model-id') : '';
		if(model!='') models.push(model);
	}
	// GPC0006, GPC0021
	var $bundle = $('.bundle');
	for(var i=0;i<$bundle.length;i++) {
		var model = $bundle.eq(i).attr('data-model-id') ? $bundle.eq(i).attr('data-model-id') : '';
		if(model!='') models.push(model);
	}
	// GPC0058
	var $infoArea = $('.info-area');
	for(var i=0;i<$infoArea.length;i++) {
		var model = $infoArea.eq(i).attr('data-model-id') ? $infoArea.eq(i).attr('data-model-id') : '';
		if(model!='') models.push(model);
	}
	// GPC0082
	var $modelInfo = $('.model-info');
	for(var i=0;i<$modelInfo.length;i++) {
		var model = $modelInfo.eq(i).attr('data-model-id') ? $modelInfo.eq(i).attr('data-model-id') : '';
		if(model!='') models.push(model);
	}
	// GPC0009
	var $pdpInfo = $('.pdp-sideInfo');
	for(var i=0;i<$pdpInfo.length;i++) {
		var model = $pdpInfo.eq(i).attr('data-wish-model-id') ? $pdpInfo.eq(i).attr('data-wish-model-id') : '';
		if(model!='') models.push(model);
	}
	
	// Sorting and deduplication 
	var r = models.slice().sort(function(a,b){return a - b}).reduce(function(a,b){if (a.slice(-1)[0] !== b) a.push(b);return a;},[]);
	return r.join(',');
}
//PJTOBSB2E-3 End
function setVipPrice(item, priceOrg, pricePromo, legal, vipPriceText, previousPriceText, memo, emiMsg, afterPay,limitSaleCondition, limitSaleText) {
	
	$('.price-area').addClass('vip-price-area');
	
	//vip price 변경 대상 : 형제에 price-vip-Installment,.price-pdp-Installment 있다
	var vip_change_componentArr = ['.GPC0003','.GPC0004','.GPC0007','.GPC0009','.GPC0026','.GPC0082','.GPC0132','.compare-wrap','.search-result-view-all','.search-result-products-wrap','.search-result-business-products-wrap'];
	
	$(vip_change_componentArr.join(',')).find('.price-area').removeClass('vip-price-area');
	
	for(var i =0;i<item.length;i++) {
		if(DEBUG) console.log('setVipPrice', item.length, priceOrg, pricePromo, legal, vipPriceText, previousPriceText, memo);
		var priceArea = item.eq(i);
		if(priceArea.hasClass('total')) {
			// price-area has a total class
			// GPC0004, GPC0007, GPC0026, Search (B2C, B2B, No Result, Single B2C, Single B2B, View All B2C, View All B2B)
			
			if(priceArea.hasClass('type-default') || priceArea.hasClass('type-promotion')) {
				// type-default (price), type-promotion (promotion price)
				if(!pricePromo || pricePromo=="0" || pricePromo==null || pricePromo=="" || pricePromo==0) {
					priceArea
						.addClass('type-default')
						.removeClass('type-promotion')
						.find('.purchase-price .price .number').text(priceOrg);
					if(priceArea.find('.purchase-price .vip-price').length==0) {
						priceArea.find('.purchase-price').prepend('<div class="vip-price"><span class="name"></span></div>');
					}
					priceArea.find('.purchase-price .vip-price .name').text(vipPriceText);
				} else {
					priceArea
						.removeClass('type-default')
						.addClass('type-promotion')
						.find('.purchase-price .price .number').text(pricePromo);
					priceArea.find('.product-price .price .number').text(priceOrg);
					if(legal==null) priceArea.find('.product-price .legal').text('');
					else priceArea.find('.product-price .legal').html(legal);		// LGEIS-229 change how discounts are shown
					if(priceArea.find('.purchase-price .vip-price').length==0) {
						priceArea.find('.purchase-price').prepend('<div class="vip-price"><span class="name"></span></div>');
					}
					priceArea.find('.purchase-price .vip-price .name').text(vipPriceText);
				}
			} else {
				priceArea.find('.vip-price').remove();
			}
		} else {
			// price-area does not have total class
			// GPC0003, GPC0006, GPC0009, GPC0010, GPC0012, GPC0021, GPC0058, GPC0082, My Product > Accessories, Compare
			if(priceArea.find('.purchase-price').length>0) {
				if(priceArea.closest('.GPC0082').length>0) {
					// GPC0082
					if(!pricePromo || pricePromo=="0" || pricePromo==null || pricePromo=="" || pricePromo==0) {
						priceArea.find('.selling-price .number').text(priceOrg);
						if(priceArea.find('.selling-price .vip-price').length==0) {
							priceArea.find('.selling-price').prepend('<div class="vip-price"><span class="name"></span></div>');
						}
						priceArea.find('.selling-price .vip-price .name').text(vipPriceText);
						priceArea.find('.production-price').remove();
					} else {
						priceArea.find('.selling-price .number').text(pricePromo);
						if(priceArea.find('.selling-price .vip-price').length==0) {
							priceArea.find('.selling-price').prepend('<div class="vip-price"><span class="name"></span></div>');
						}
						priceArea.find('.selling-price .vip-price .name').text(vipPriceText);
						priceArea.find('.production-price').remove();
						priceArea.find('.purchase-price').append('<div class="production-price"><del class="price" aria-label=""></del> <div class="legal"></div></div>');
                        priceArea.find('.purchase-price .production-price .price')
									.append(priceArea.find('.selling-price').html())
									.attr('aria-label', previousPriceText);
                        priceArea.find('.purchase-price .production-price .vip-price').remove();
						priceArea.find('.purchase-price .production-price .price .number').text(priceOrg);
						priceArea.find('.purchase-price .production-price .legal').html(legal);		// LGEIS-229 change how discounts are shown
					}
				} else {
					if(!pricePromo || pricePromo=="0" || pricePromo==null || pricePromo=="" || pricePromo==0) {
						priceArea.find('.purchase-price .price .number').text(priceOrg);
						priceArea.find('.purchase-price .price .num').text(priceOrg); // for GPC0009
						if(priceArea.find('.purchase-price .vip-price').length==0) {
							priceArea.find('.purchase-price').prepend('<div class="vip-price"><span class="name"></span></div>');
						}
						priceArea.find('.purchase-price .vip-price .name').text(vipPriceText);
						priceArea.removeClass('type-promotion');
						priceArea.find('.product-price').remove();
					} else {
						priceArea.find('.purchase-price .price .number').text(pricePromo);
						priceArea.find('.purchase-price .price .num').text(pricePromo); // for GPC0009
						if(priceArea.find('.purchase-price .vip-price').length==0) {
							priceArea.find('.purchase-price').prepend('<div class="vip-price"><span class="name"></span></div>');
						}
						priceArea.find('.purchase-price .vip-price .name').text(vipPriceText);
						priceArea.find('.product-price').remove();
						priceArea.append('<div class="product-price"><del class="price" aria-label=""></del> <div class="legal"></div></div>');
						priceArea.find('.product-price .price').append(priceArea.find('.purchase-price .price').html());
						priceArea.find('.product-price .price').attr('aria-label', previousPriceText);
						priceArea.find('.product-price .price .number').text(priceOrg);
						priceArea.find('.product-price .price .num').text(priceOrg); // for GPC0009
						priceArea.find('.product-price .legal').html(legal);		// LGEIS-229 change how discounts are shown
						priceArea.addClass('type-promotion');
					}
				}
			}
			if(priceArea.closest('.GPC0009').length>0) {
				// for GPC0011 in PDP
				if(!pricePromo || pricePromo=="0" || pricePromo==null || pricePromo=="" || pricePromo==0) {
					$('.GPC0011 .product-simple-info .product-selling-price .price .number').text(priceOrg);
				} else {
					$('.GPC0011 .product-simple-info .product-selling-price .price .number').text(pricePromo);
				}
			}
		}
		//1차 적용 예외 처리
		if(priceArea.siblings( '.price-vip-Installment,.price-pdp-Installment').length > 0){
			priceArea.find('.vip-price').remove();
			
			// PJTLIMITQTY-5
			if(priceArea.siblings( '.price-vip-Installment,.price-pdp-Installment').find('.price-vip p').length > 0) {
				priceArea.siblings( '.price-vip-Installment,.price-pdp-Installment').find('.price-vip p').text(vipPriceText);
			} else {
				priceArea.siblings( '.price-vip-Installment,.price-pdp-Installment').find('.price-vip').text(vipPriceText);
			}
			//LGEAU-378 START
			if(COUNTRY_CODE.toLowerCase() == 'au'){
				priceArea.siblings( '.price-vip-Installment,.price-pdp-Installment').find('.price-afterpay').html('');
				if(afterPay <= 3000 && afterPay > 0){
					priceArea.siblings( '.price-vip-Installment,.price-pdp-Installment').find('.price-afterpay').prop('href', '#modal-afterPay').addClass('afterpay-installment').removeAttr('style');
				}else{
					priceArea.siblings( '.price-vip-Installment,.price-pdp-Installment').find('.price-afterpay').removeAttr('href').removeClass('afterpay-installment').prop('style','display:none;');
				}
				priceArea.siblings( '.price-vip-Installment,.price-pdp-Installment').find('.price-afterpay').html(emiMsg);
			} else {
			// LGEITF-444
			priceArea.siblings( '.price-vip-Installment,.price-pdp-Installment').find('.price-installment, .price-installment-text').html('');
			priceArea.siblings( '.price-vip-Installment,.price-pdp-Installment').find('.price-installment, .price-installment-text').html(emiMsg); 
			// LGEITF-444 End
			}
			//LGEAU-378 END
		}
		//GPC0082 예외처리
		if(priceArea.find('.price-pdp-Installment').length > 0 && priceArea.closest('.GPC0082').length>0){
			priceArea.find('.vip-price').remove();
			priceArea.find('.price-pdp-Installment').find('.price-vip').text(vipPriceText);

			//LGEAU-378 START
			if(COUNTRY_CODE.toLowerCase() == 'au'){
				priceArea.find('.price-pdp-Installment').find('.price-afterpay').html('');
				if(afterPay <= 3000 && afterPay > 0){
					priceArea.siblings( '.price-vip-Installment,.price-pdp-Installment').find('.price-afterpay').prop('href', '#modal-afterPay').addClass('afterpay-installment').removeAttr('style');
				}else{
					priceArea.siblings( '.price-vip-Installment,.price-pdp-Installment').find('.price-afterpay').removeAttr('href').removeClass('afterpay-installment').prop('style','display:none;');
				}
				priceArea.find('.price-pdp-Installment').find('.price-afterpay').html(emiMsg);
			}else{
			// LGEITF-444
			priceArea.find('.price-pdp-Installment').find('.price-installment, .price-installment-text').html(''); 
			priceArea.find('.price-pdp-Installment').find('.price-installment, .price-installment-text').html(emiMsg);
			// LGEITF-444 End
			}
			//LGEAU-378 END
		}
		//PJTLIMITQTY_EXTEND
		if(limitSaleCondition == 'Y'){
			priceArea.find('.purchase-price .vip-price .name').text(limitSaleText);
			priceArea.siblings('.price-vip-Installment,.price-pdp-Installment').find('.price-vip').text(limitSaleText);
		}
		if((priceArea.closest('.GPC0058').length>0 || priceArea.closest('.GPC0006').length>0 || priceArea.closest('.GPC0021').length>0)) {
			if(limitSaleCondition == 'Y'){
				priceArea.find('.vip-price').remove();
			}else{
				priceArea.find('.price-vip-Installment').remove();
			}
			
		}
	}
}
/* LGEKZ-111 Start*/
function fetchVipPrice(countryUnitObsFlag) {
	var url = $('.navigation').data('vip-url');
		if((url && ISVIP) || (url && countryUnitObsFlag!= undefined)) {
        //<#-- PJTMEMBERSHIP-1 START -->
		//PJTMEMBERSHIP-4 조건변경 VIP로그인시 B2C상품에 대해서도 멤버십 텍스트 노출
        /*if(ISVIP){
        	$('.member-point,.member-price,.pre-member-point').hide();
        }*/
        //<#-- PJTMEMBERSHIP-1 END -->	
		var models = getAllPrice();
		if(models.length>0) {
			$('body').trigger('ajaxLoadBefore');
			ajax.call(url, {modelList: models}, 'json', function (data) {
				var vipPriceText = data.data[0].productMessages.vipPriceMessage;
				var previousPriceText = data.data[0].productMessages.previousPriceText;
				//PJTLIMITQTY_EXTEND
				var limitSaleTitle = data.data[0].productMessages.limitSaleTitle;
				if(data.data[0].productList.length>0) {
					for(var i=0;i<data.data[0].productList.length;i++) {
						var p = data.data[0].productList[i];
						var priceOrg = changeFormatFullPrice(p.rPrice, p.rPriceCent);
						var pricePromo = changeFormatFullPrice(p.rPromoPrice, p.rPromoPriceCent);
						//PJTLIMITQTY_EXTEND
						var limitSaleConditionFlag =  p.vipPriceFlag == 'N' && p.obsLimitSale == 'Y' && p.limitSaleUseFlag == 'Y' ? 'Y' : 'N';
						// LGEAU-452 START
						if(p.vipPriceFlag == 'Y') {
							//PJTMEMBERSHIP-4 조건변경 VIP로그인시 B2C상품에 대해서도 멤버십 텍스트 노출
							if($('.GPC0009').length>0){
								$('.member-point,.member-price,.pre-member-point').hide();
							}
							$('.products-info[data-model-id='+p.modelId+']').find('.member-text').hide();
							//PJTMEMBERSHIP-4 조건변경 
							var legal = p.discountMsg == null ? '' : p.discountMsg.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');		// LGEIS-229 change how discounts are shown
							var target1 =  $('.add-to-cart[data-model-id='+p.modelId+'] , .re-stock-alert[data-model-id='+p.modelId+']').closest('.button').siblings('.price-area'); 
							var target2 =  $('.price-area[data-model-id='+p.modelId+']'); // for GPC0012
							var target3 =  $('.add-to-cart[data-model-id='+p.modelId+'] , .re-stock-alert[data-model-id='+p.modelId+']').closest('.btn-type-box').siblings('.price-area'); // for GPC0006, GPC0021
							var target4 =  $('.add-to-cart[data-model-id='+p.modelId+'] , .re-stock-alert[data-model-id='+p.modelId+']').closest('.btn-area').siblings('.price-area'); // for GPC0082
							var target5 =  $('.add-to-cart[data-model-id='+p.modelId+'] , .re-stock-alert[data-model-id='+p.modelId+']').closest('.button').siblings('.price-wt-box').find('.price-area');
							if(target1.length>0) setVipPrice(target1, priceOrg, pricePromo, legal, vipPriceText, previousPriceText, p.modelId + '/' + 'fetchVipPrice',p.emiMsg,p.afterPay,limitSaleConditionFlag,limitSaleTitle);
							if(target2.length>0) setVipPrice(target2, priceOrg, pricePromo, legal, vipPriceText, previousPriceText, p.modelId + '/' + 'fetchVipPrice',p.emiMsg,p.afterPay,limitSaleConditionFlag,limitSaleTitle);
							if(target3.length>0) setVipPrice(target3, priceOrg, pricePromo, legal, vipPriceText, previousPriceText, p.modelId + '/' + 'fetchVipPrice',p.emiMsg,p.afterPay,limitSaleConditionFlag,limitSaleTitle);
							if(target4.length>0) setVipPrice(target4, priceOrg, pricePromo, legal, vipPriceText, previousPriceText, p.modelId + '/' + 'fetchVipPrice',p.emiMsg,p.afterPay,limitSaleConditionFlag,limitSaleTitle);
							if(target5.length>0) setVipPrice(target5, priceOrg, pricePromo, legal, vipPriceText, previousPriceText, p.modelId + '/' + 'fetchVipPrice',p.emiMsg,p.afterPay,limitSaleConditionFlag,limitSaleTitle);
						}else if(p.vipPriceFlag == 'N' && countryUnitObsFlag!= undefined){
							var legal = p.discountMsg == null ? '' : p.discountMsg.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');
							var target1 =  $('.add-to-cart[data-model-id='+p.modelId+'] , .re-stock-alert[data-model-id='+p.modelId+']').closest('.button').siblings('.price-area'); 
							var target2 =  $('.price-area[data-model-id='+p.modelId+']'); // for GPC0012
							var target3 =  $('.add-to-cart[data-model-id='+p.modelId+'] , .re-stock-alert[data-model-id='+p.modelId+']').closest('.btn-type-box').siblings('.price-area'); // for GPC0006, GPC0021
							var target4 =  $('.add-to-cart[data-model-id='+p.modelId+'] , .re-stock-alert[data-model-id='+p.modelId+']').closest('.btn-area').siblings('.price-area'); // for GPC0082
							var target5 =  $('.add-to-cart[data-model-id='+p.modelId+'] , .re-stock-alert[data-model-id='+p.modelId+']').closest('.button').siblings('.price-wt-box').find('.price-area'); 
							var target6 =  $('.re-stock-alert[data-model-id='+p.modelId+']').closest('.button').siblings('.price-wt-box').find('.price-area');
							if(countryUnitObsFlag=='N'){
								if(target1.length>0) (priceOrg==0 && pricePromo==0) ? target1.hide() : setVipPrice(target1, priceOrg, pricePromo, legal, '', '', p.modelId + '/' + 'countryUnitObsFlag',p.emiMsg,p.afterPay,limitSaleConditionFlag,limitSaleTitle);
								if(target2.length>0) (priceOrg==0 && pricePromo==0) ? target2.hide() : setVipPrice(target2, priceOrg, pricePromo, legal, '', '', p.modelId + '/' + 'countryUnitObsFlag',p.emiMsg,p.afterPay,limitSaleConditionFlag,limitSaleTitle);
								if(target3.length>0) (priceOrg==0 && pricePromo==0) ? target3.hide() : setVipPrice(target3, priceOrg, pricePromo, legal, '', '', p.modelId + '/' + 'countryUnitObsFlag',p.emiMsg,p.afterPay,limitSaleConditionFlag,limitSaleTitle);
								if(target4.length>0) (priceOrg==0 && pricePromo==0) ? target4.hide() : setVipPrice(target4, priceOrg, pricePromo, legal, '', '', p.modelId + '/' + 'countryUnitObsFlag',p.emiMsg,p.afterPay,limitSaleConditionFlag,limitSaleTitle);
								if(target5.length>0) (priceOrg==0 && pricePromo==0) ? target5.hide() : setVipPrice(target5, priceOrg, pricePromo, legal, '', '', p.modelId + '/' + 'countryUnitObsFlag',p.emiMsg,p.afterPay,limitSaleConditionFlag,limitSaleTitle);
								if(target6.length>0) (priceOrg==0 && pricePromo==0) ? target6.hide() : setVipPrice(target6, priceOrg, pricePromo, legal, '', '', p.modelId + '/' + 'countryUnitObsFlag',p.emiMsg,p.afterPay,limitSaleConditionFlag,limitSaleTitle);
							}else{
								if(target1.length>0) (priceOrg==0 && pricePromo==0) ? target1.hide() : setVipPrice(target1, priceOrg, pricePromo, legal, '', previousPriceText, p.modelId + '/' + 'countryUnitObsFlag',p.emiMsg,p.afterPay,limitSaleConditionFlag,limitSaleTitle);
								if(target2.length>0) (priceOrg==0 && pricePromo==0) ? target2.hide() : setVipPrice(target2, priceOrg, pricePromo, legal, '', previousPriceText, p.modelId + '/' + 'countryUnitObsFlag',p.emiMsg,p.afterPay,limitSaleConditionFlag,limitSaleTitle);
								if(target3.length>0) (priceOrg==0 && pricePromo==0) ? target3.hide() : setVipPrice(target3, priceOrg, pricePromo, legal, '', previousPriceText, p.modelId + '/' + 'countryUnitObsFlag',p.emiMsg,p.afterPay,limitSaleConditionFlag,limitSaleTitle);
								if(target4.length>0) (priceOrg==0 && pricePromo==0) ? target4.hide() : setVipPrice(target4, priceOrg, pricePromo, legal, '', previousPriceText, p.modelId + '/' + 'countryUnitObsFlag',p.emiMsg,p.afterPay,limitSaleConditionFlag,limitSaleTitle);
								if(target5.length>0) (priceOrg==0 && pricePromo==0) ? target5.hide() : setVipPrice(target5, priceOrg, pricePromo, legal, '', '', p.modelId + '/' + 'countryUnitObsFlag',p.emiMsg,p.afterPay,limitSaleConditionFlag,limitSaleTitle);
								if(target6.length>0) (priceOrg==0 && pricePromo==0) ? target6.hide() : setVipPrice(target6, priceOrg, pricePromo, legal, '', '', p.modelId + '/' + 'countryUnitObsFlag',p.emiMsg,p.afterPay,limitSaleConditionFlag,limitSaleTitle);
							}
						}
						// LGEAU-452 END
						
						//PJTOBSB2E-3 Start
						var addToCartText = data.data[0].productMessages.addToCartBtnNm;
						var buyNowText = data.data[0].productMessages.buyNowBtnNm;
						var btnLinkTitleText = data.data[0].productMessages.btnNewLinkTitle;
						var resellerText = data.data[0].productMessages.resellerBtnNm;
						var productSupportText = data.data[0].productMessages.productSupportBtnNm;
						var whereToBuyText = data.data[0].productMessages.whereToBuyBtnNm;
						var preOrderText = data.data[0].productMessages.preOrderBtnNm;
						var obsBuyNowText = data.data[0].productMessages.buyNowBtnNm2; // PJTB2BOBS-1
						
						//RED btn
						if(p.obsPreOrderFlag == 'Y'){
							if(p.obsBuyNowFlag == 'Y'){
								$('.add-to-cart[data-model-id='+p.modelId+']').addClass('active').data('model-id', p.modelId).attr('href', p.modelUrlPath).text(preOrderText).removeAttr('target, title');
							}else{
								$('.add-to-cart[data-model-id='+p.modelId+']').addClass('active').data('model-id', p.modelId).attr('data-obs-pre-order-start-date', p.obsPreOrderStartDate).attr('data-obs-pre-order-end-date', p.obsPreOrderEndDate).attr('href', '#').text(preOrderText).attr('role', 'button').removeAttr('target, title');
							}
						}
						else if(p.addToCartFlag != "N"){
							if(p.addToCartFlag == 'Y'){
								if(p.obsBuyNowFlag == 'Y'){
									/* LGEAU-522 Start */
									var btnText = !!$('.add-to-cart[data-model-id='+p.modelId+']').parents('.GPC0009').length ? addToCartText : obsBuyNowText;
									$('.add-to-cart[data-model-id='+p.modelId+']').addClass('active').data('model-id', p.modelId).attr('href', p.modelUrlPath).text(btnText).removeAttr('target, title'); // PJTB2BOBS-1
									/* LGEAU-522 End */
								}else{
									$('.add-to-cart[data-model-id='+p.modelId+']').addClass('active').data('model-id', p.modelId).attr('data-model-sku', p.modelName).attr('data-model-salesmodelcode', p.salesModelCode+"."+p.salesSuffixCode).attr('data-biztype', p.bizType).attr('data-buname-one', p.buName1).attr('data-buname-two', p.buName2).attr('data-buname-three', nvl(p.buName3,'') || '').attr('data-category-name', p.superCategoryName).attr('data-price', (nvl(p.rPrice,'')+'.'+nvl(p.rPriceCent,'00') || '')).attr('href', '#').text(addToCartText).attr('role', 'button').removeAttr('target, title');
								}
							}else if(p.addToCartFlag == 'S'){
								$('.add-to-cart[data-model-id='+p.modelId+']').addClass('active').data('model-id', p.modelId).attr('data-model-sku', p.modelName).attr('data-model-salesmodelcode', p.salesModelCode+"."+p.salesSuffixCode).attr('data-biztype', p.bizType).attr('data-buname-one', p.buName1).attr('data-buname-two', p.buName2).attr('data-buname-three', nvl(p.buName3,'') || '').attr('data-category-name', p.superCategoryName).attr('data-price', (nvl(p.rPrice,'')+'.'+nvl(p.rPriceCent,'00') || '')).attr('href', '#').text(addToCartText).attr('role', 'button').removeAttr('target, title');
							}
						}else if(p.buyNowFlag == 'Y' || p.buyNowFlag == 'L'){
							if(p.eCommerceTarget == '_blank'){
								$('.add-to-cart[data-model-id='+p.modelId+']').addClass('active').data('model-id', p.modelId).attr('href', p.buyNowUrl).text(buyNowText).removeAttr('role').attr('target', '_blank').attr('title', btnLinkTitleText);
							}else{
								$('.add-to-cart[data-model-id='+p.modelId+']').addClass('active').data('model-id', p.modelId).attr('href', p.buyNowUrl).text(buyNowText).removeAttr('role').removeAttr('target, title');
							}
						}else if(p.resellerBtnFlag == 'Y'){
							$('.add-to-cart[data-model-id='+p.modelId+']').addClass('active').data('model-id', p.modelId).attr('href', p.resellerLinkUrl).text(resellerText).removeAttr('role').attr('target', '_blank').attr('title', newLinkTitleText);
						}else if(p.productSupportFlag == 'Y'){
							$('.add-to-cart[data-model-id='+p.modelId+']').addClass('active').data('model-id', p.modelId).attr('href', p.productSupportUrl).text(productSupportText).removeAttr('role').removeAttr('target, title');
						}else{
							$('.add-to-cart[data-model-id='+p.modelId+']').removeClass('active');
						}
						if(countryUnitObsFlag!= undefined && countryUnitObsFlag=="N"){
						 	if(!p.reStockAlertFlag || p.reStockAlertFlag!='Y') {
							$('.re-stock-alert[data-model-id='+p.modelId+']').remove();
						 	$('.products-info[data-model-id='+p.modelId+']').find('.stock-area').removeClass('out-of-stock').empty()
						 	}
						 	$('.add-to-cart[data-model-id='+p.modelId+']').removeClass('active').remove();
						}
						
						//WTB btn
						if(p.whereToBuyFlag == 'Y' && p.whereToBuyUrl != null && p.whereToBuyUrl != ''){
							$('.add-to-cart[data-model-id='+p.modelId+']').siblings('.where-to-buy').addClass('active').attr('href', p.whereToBuyUrl).text(whereToBuyText);
							$('.add-to-cart[data-model-id='+p.modelId+']').siblings('.where-to-buy').removeAttr('target, title');
						}else if(p.wtbExternalLinkUseFlag == 'Y' && p.wtbExternalLinkUrl != null && p.wtbExternalLinkUrl != '' && p.wtbExternalLinkName != null && p.wtbExternalLinkName != '') {
							//LGEGMC-2202 START
							$('.add-to-cart[data-model-id='+p.modelId+']').siblings('.in-buynow').addClass('active').attr('href', p.wtbExternalLinkUrl).text(p.wtbExternalLinkName).attr('data-link-name', 'buy_now').removeAttr('data-sc-item');
							if(p.wtbExternalLinkSelfFlag == 'Y'){
								$('.add-to-cart[data-model-id='+p.modelId+']').siblings('.in-buynow').removeAttr('target, title');
							}else{
								$('.add-to-cart[data-model-id='+p.modelId+']').siblings('.in-buynow').attr('target', '_blank').attr('title', btnLinkTitleText);
							}
							//LGEGMC-2202 START
						}else{
							$('.add-to-cart[data-model-id='+p.modelId+']').siblings('.where-to-buy').removeClass('active');
						}
						//PJTOBSB2E-3 End
						// PJTLIMITQTY-4
						if($('.GPC0009').length > 0 && ISVIP && p.vipPriceFlag == 'Y') {
							/*$('.GPC0009 #limitTitleAreaVip').show();
							$('.GPC0009 #limitTitleArea').remove();*/
							//PJTLIMITQTY_EXTEND (GPC0021,GPC0006 추가시 모델아이디 혼용 방지)
							if($('.pdp-sideInfo[data-wish-model-id='+p.modelId+']').length > 0){
								$('.GPC0009 .price-vip').show();
								$('.GPC0009 .price-limited').hide();
							}
						}
						//PJTLIMITQTY_EXTEND
						if(limitSaleConditionFlag == 'Y'){ 
							$('.products-info[data-model-id='+p.modelId+']').find('.price-vip-Installment .price-vip').text(limitSaleTitle);
							$('.price-area[data-model-id='+p.modelId+']').find('.price-pdp-Installment .price-vip').text(limitSaleTitle);
						}
					}
				}
			}, commonSendType,$('body'));
		}
	}
}
/* LGEKZ-111 Start*/
// PJTOBS-32 End

//LGCOMSM-51 START
/* 현재 obsMembershipPrice 존재 하는 GPC0007,GPC0009 한정 적용 확산 시 다른 영역 추가 예정  */
function fetchInstallmentMember(loginChek){
	
	var url = '/'+COUNTRY_CODE.toLowerCase()+'/mkt/ajax/commonmodule/getInstallmentMemberInfo';
	var models = getAllPrice();
	
	if(loginChek == true){
		if(models.length > 0){
			$.ajax({
				type:"post",
				url: url,
				data : {modelList : models},
				dataType: "json",
				success: function(data) {
					
					if(data.productList.length>0) {
						for(var i=0;i<data.productList.length;i++) {
							var p = data.productList[i];
							
							if(data.obsInstallmentMemberFlag == 'Y' && (p.obsMembershipPrice != null && p.obsMembershipPrice != '' && p.emiMemberMsgText !=null && p.emiMemberMsgText !='')){
									var target1 =  $('.add-to-cart[data-model-id='+p.modelId+']').closest('.button').siblings('.price-area'); 
									var target2 =  $('.GPC0007 .price-area[data-model-id='+p.modelId+']');
									
									if(target1.length>0) setInstallmentMember(target1,p.emiMemberMsgText);
									if(target2.length>0) setInstallmentMember(target2,p.emiMemberMsgText);
									
							}
						}
					}
				},
				error: function(request,status,error) {
					console.log("error : " +error);
				}
			});
		}
	}
	
}

function setInstallmentMember(item,emiMemberMsgText){
	
	for(var i =0;i<item.length;i++) {
		var priceArea = item.eq(i);
		
		if(priceArea.siblings( '.price-vip-Installment,.price-pdp-Installment').length > 0){
			
			priceArea.siblings( '.price-vip-Installment,.price-pdp-Installment').find('.price-installment, .price-installment-text').html('');
			priceArea.siblings( '.price-vip-Installment,.price-pdp-Installment').find('.price-installment, .price-installment-text').html(emiMemberMsgText);
			
		}
		
		//GPC0082 예외처리
		if(priceArea.find('.price-pdp-Installment').length > 0 && priceArea.closest('.GPC0082').length>0){
			
			priceArea.find('.price-pdp-Installment').find('.price-installment, .price-installment-text').html(''); 
			priceArea.find('.price-pdp-Installment').find('.price-installment, .price-installment-text').html(emiMemberMsgText);
			
		}
	}
	
}
//LGCOMSM-51 END

/* LGEKZ-111 Start*/
obsSelectCountry = function(flag,logincheck){
	if(!document.querySelector('.obsSelectCountry')) return false;
			var $obsCountry =$('.obsSelectCountry');
			countryUnitObsFlag = flag;
			var obsUnit = {
				cookieName: 'LG5_UNIT_OBS_FLAG',
				defaultCountry : $obsCountry.data("defaultCountry"),
				cookieExpiresName:'LG5_UNIT_OBS_EXPIRES',
			};
			var logoutUrl;
			var stateUrl = location.pathname;
			var accFlag = false;
			if(stateUrl.indexOf('/my-lg')>-1||stateUrl.indexOf('/mylg')>-1){
				stateUrl = '/'+COUNTRY_CODE.toLowerCase();
				accFlag = true;
			}
			init = function(){
				var obsCookie = getCookie(obsUnit.cookieName);
				var obsFlag = flag;
				var obsCountry = obsUnitcountry;
				if(logincheck){
					$(".after-login").find('li').each(function(i){
						if($(this).find("a").attr('href') != undefined && $(this).find("a").attr('href').indexOf('/logout')>-1){
							logout = $(this).find("a").attr('href');
							logoutUrl= logout.substring(0,logout.indexOf('?'));
							return logoutUrl;
						}
					})
				}
				if(countryUnitObsFlag == 'N'){
					$('.navigation .right-btm').find('.cart').remove();
					$('.navigation .for-mobile .right').find('.cart').remove()
				}else if(countryUnitObsFlag == 'Y'){
					$('.navigation .right-btm').find('.cart').removeClass('hide');
					$('.navigation .for-mobile .right').find('.cart').removeClass('hide');
				}
				if($('.obsSelectCountry').find('li a[data-country='+obsCountry+']').length>0 || obsFlag=='Y'){
				//if(((obsCookie !=null && obsCookie !="")|| obsFlag=='Y') && $obsCountry.length){
					$obsCountry.find('li').removeClass('active').attr("aria-checked", false);
					$obsCountry.find('li a[data-country='+obsCountry+']').parent().addClass('active').attr("aria-checked", true);
					$("#countryOptionsArea,#countryOptionSelect").find('img').attr("src",$obsCountry.find('li a[data-country='+obsCountry+'] img').attr('src'));
					$("#countryOptionsArea,#countryOptionSelect").find('img').attr("alt",$obsCountry.find('li a[data-country='+obsCountry+'] img').attr('alt'))
					$("#countryOptionSelect").find('.flag').after($obsCountry.find('li a[data-country='+obsCountry+'] img').attr('alt'));
					$("#countryOptionsArea,#countryOptionSelect").removeClass('hide');
				}else{
					$("#countryOptionsArea,#countryOptionSelect").find('img').attr("src",$obsCountry.find('li.active').find('a img').attr('src'));
					$("#countryOptionsArea,#countryOptionSelect").find('img').attr("alt",$obsCountry.find('li.active').find('a img').attr('alt'))
					$("#countryOptionSelect").find('.flag').after($obsCountry.find('li.active').find('a img').attr('alt'));
					obsSelectCountryPopup();
				}
				/* LGEKZ-103 s*/
			    if(countryUnitObsFlag!= undefined && countryUnitObsFlag=="N"){
			    	$('.product-selling-price .product-price').hide();
			    	$('.GPC0009 .dot-text').addClass("active");
			    }
			    if(stateUrl.indexOf('/oauth/') >= 0){
			    	$obsCountry.remove()
			    }
			    /* LGEKZ-103 e*/
				addEvent();
			},
			addEvent = function(){
				$obsCountry.find('li a').on({
					click: function(e){
						var _this = e.currentTarget;
						var selectCountry = $(_this).data('country');

						if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
								var cookieExpires = getCookie(obsUnit.cookieExpiresName);
							var expireDate = new Date();
							var expiredays= parseInt(obsUnitCookieExpires);
							expireDate = new Date(parseInt(expireDate.getTime() / 86400000) * 86400000 + 54000000); 
						    if ( expireDate > new Date() )  
						    {  
						    expiredays = expiredays - 1;  
						    }  
						    expireDate.setDate(expireDate.getDate() + expiredays);
							if(obsUnit.defaultCountry.indexOf(selectCountry)>-1){
								setCookie(obsUnit.cookieName, 'Y:'+selectCountry+'', true, (cookieExpires=='Y')? expireDate:'');
								setTimeout(function() {
									location.reload();
								}, 100);
							}else{
								setCookie(obsUnit.cookieName, 'N:'+selectCountry+'', true, (cookieExpires=='Y')? expireDate:'');
								setTimeout(function() {
									if(logincheck){
										location.href = logoutUrl+'?state='+stateUrl;
									}else{
										location.reload();
									}
								}, 100);
								
							}
						}else{
							ePrivacyCookies.view('click');
						}
					}
				});
				
			},
			obsSelectCountryPopup = function(){
				var url =$obsCountry.data('countryPopUrl');
				$('body').trigger('ajaxLoadBefore');
				$.ajax({
						type: 'get',
						url: url,
						xhrFields: (window.location.href.indexOf('/oauth/') !== -1) ? {withCredentials: true} : '',
						dataType: 'html',
						success: function (html) {
							$('body').trigger('ajaxLoadEnd');
							$('#modal_choose_your_country').remove();
							$('body').append(html);
							$('#modal_choose_your_country').modal();
							var modalCountry_el = $('.modal-choose-your-country');
							if($(modalCountry_el).length > 0){
								$(modalCountry_el).find('.country-options a').on('click', function(e){
									e.preventDefault();
									var chkCountryChoose = $(this).parent('li').hasClass('active');
									if (!chkCountryChoose) {
										$('.country-options li').removeClass('active').attr("aria-checked", false);
										$(this).parent('li').addClass('active').attr("aria-checked", true);
									} else {
										$(this).parent('li').removeClass('active').attr("aria-checked", false);
									};
								});
								$(modalCountry_el).on("click", ".modal-footer button", function(e){
									e.preventDefault();
									if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
										var selectCountry = $(modalCountry_el).find('.country-options li.active a').data('country');
										if(selectCountry== undefined||selectCountry==''){
											$(modalCountry_el).find('.country-options').addClass('error');
											return false;
										}else{
											$(modalCountry_el).find('.country-options').removeClass('error');
										}
										if(typeof selectCountry != 'undefined' && selectCountry !==''){
											var expireDate = new Date();
											var expiredays= parseInt(obsUnitCookieExpires);
											if($(modalCountry_el).find("#checkNoShowToday").prop("checked")){
												expireDate = new Date(parseInt(expireDate.getTime() / 86400000) * 86400000 + 54000000); 
											    if ( expireDate > new Date() )  
											    {  
											    expiredays = expiredays - 1;  
											    }  
											    expireDate.setDate(expireDate.getDate() + expiredays);
												setCookie(obsUnit.cookieExpiresName, 'Y', true, expireDate);
											}
											if(obsUnit.defaultCountry.indexOf(selectCountry)>-1){
												setCookie(obsUnit.cookieName, 'Y:'+selectCountry+'', true, $(modalCountry_el).find("#checkNoShowToday").prop("checked")? expireDate :'');
												setTimeout(function() {
													location.reload();
												}, 100);
											}else{
												setCookie(obsUnit.cookieName, 'N:'+selectCountry+'', true, $(modalCountry_el).find("#checkNoShowToday").prop("checked")? expireDate :'');
												setTimeout(function() {
													if(logincheck){
														location.href = logoutUrl+'?state='+stateUrl;
													}else{
														location.reload();
													}
												}, 100);
											}
										}
									} else {
										if($(modalCountry_el).find("#checkNoShowToday").prop("checked")){
											ePrivacyCookies.view('click');	
										}
									}
								});
							}
							
							
						},
						error: function (request, status, error) {
							$('body').trigger('ajaxLoadEnd');
							console.log("status: " + status);
							console.log("error: " + error);
						}
					});
			}
			init();
		}
/* LGEKZ-111 Start*/

function loginCheck() {
	var $nav = $('.navigation');
	if ($nav.length > 0 && (window.location.href.indexOf('/oauth/') == -1 || document.querySelector('.obsSelectCountry'))) {
		var loginURL = $nav.eq(0).data('login-check'); /* LGEKZ-111 */
		//var loginURL = '/lg5-common-gp/data-ajax/mkt/loginInfo.json'
		/* LGEGMC-221 Start */
		var loginState = 'N';
		_dl.isLogin = loginState;
		/* LGEGMC-221 End */
		if (loginURL) {
			//var token = getCookie('ACCESS_TOKEN');
			//if(token) {
				var scrollToTop = function ($obj) {
					var t = $obj.closest('.navigation').offset().top;
					//console.log(t);
					$('html, body').stop().animate({scrollTop: t}, 300);
				};
				ajax.call(loginURL, {}, 'json', function (data) {
					//PJTGADL-2
					/* PJTB2BOBS-1 Start */
					if(!!data.user){
						if(!!data.user.group){
							$nav.attr('data-obs-group',data.user.group);
						} else{
							$nav.attr('data-obs-group','B2C');
						}
					}else{
						$nav.attr('data-obs-group','B2C');
					}
					/* PJTB2BOBS-1 End */
					
					//console.log(data);
					/* LGEKZ-111 Start*/
					if(data.obsUnitcountry != undefined){
						obsUnitcountry = data.obsUnitcountry;
					}
					if (data.countryUnitObsFlag != undefined){
						obsSelectCountry(data.countryUnitObsFlag,data.loginCheck)
						obsUnitCookieExpires = data.obsUnitCookieExpires
					}
					/* LGEKZ-111 End*/
					if (data.loginCheck == true) {
						var name = data.user.name;
						var snsType = data.snsType;
						_dl.loginType = snsType;
						/* LGEGMC-221 Start*/
						var userId = data.user.emailAddr;
						
						if(userId != ''){
							loginState = 'Y';
							SIGN_IN_STATUS = 'Y'; //LGEDE-354
							_dl.uid = SHA256(userId);
							_dl.isLogin = loginState;
						}
						/* LGEGMC-221 End*/

						// LGEGMC-2434 Start
						// vip price 에서 할당하는 customer group의 정의가 OBS 할부계산기 요건과 달라 신규로 loginInfo의 origin data 정의
						// 로그인 시에만 loginInfo의 실제 user.group값 할당
						$nav.attr('data-obs-origin-group',data.user.group);
						// LGEGMC-2434 End

						// PJTOBS-30 Start
						// grade와 coupon이 늦게 로딩되는 경우를 방지하기 위해 ajax 호출을 분리함.
						if($nav.find('.box-obs').length == 0 || data.obsLoginFlag != 'Y' || !data.obsGradeCouponAjaxUrl) {
							$nav.find('.box-obs').remove();
						} else {
							// HTML에 .box-obs 가 존재하고, JSON에 data.obsGradeCouponAjaxUrl가 존재하는 경우
							ajax.call(data.obsGradeCouponAjaxUrl, {}, 'json', function (data) {
								if(data.obsGradeUseFlag != 'Y' && data.obsCouponUseFlag != 'Y') {
									$nav.find('.box-obs').remove();
								} else {
									// obsGradeUseFlag와 obsCouponUseFlag 중 하나 이상이 Y인 경우
									var $obsBox = $nav.find('.box-obs');
									if(data.obsGradeUseFlag=='Y') {
										$obsBox.find('> a .rate').text(data.customerGnb.grade);
										$obsBox.find('.box-point .number').text(data.customerGnb.available_point);
										if(data.obsCouponUseFlag == 'Y') {
											$obsBox.find('.box-coupon .number').text(data.customerGnb.coupon_count);
										} else {
											$obsBox.find('.box-coupon').remove();
										}
									} else {
										$obsBox.find('> a').remove();
										$obsBox.find('.box-point').remove();
										if(data.obsCouponUseFlag == 'Y') {
											$obsBox.find('.box-coupon .number').text(data.customerGnb.coupon_count);
										} else {
											$obsBox.find('.box-coupon').remove();
										}
									}
									$obsBox.addClass('active');
								}
							}, commonSendType);
						}
						// PJTOBS-30 End

						// PJTOBS-32 Start 

						if(data.user.group && data.user.group!='B2C' && data.user.group!='' && data.user.group!=null) {
							ISVIP = true;
							var url = data.vipPriceAjaxUrl ? data.vipPriceAjaxUrl : '';
							$('.navigation').data('vip-url', url);
							fetchVipPrice((data.countryUnitObsFlag != undefined)?data.countryUnitObsFlag:'');/* LGEKZ-111 */

							// PJTOBS-31 Start
							if($('.GPC0010').length>0 && typeof packageComponent != 'undefined') {
								packageComponent.applyVIPPrice();
							}
							// PJTOBS-31 End
							if($('.compare-wrap').length==0 && !!$('.GPC0007').data('ready-vip-load')) {
								$('#categoryFilterForm').trigger('submit');
							}
						}else if(data.loginCheck == true && data.obsLoginFlag == 'Y' && data.obsInstallmentMemberFlag == 'Y' && $('.GPC0007,.GPC0009').length > 0){
							//LGCOMSM-51 START
							fetchInstallmentMember(data.loginCheck);
							//LGCOMSM-51 END
						}
						// PJTOBS-32 End
						
						/* LGEGMC-1415 : 20210524 add */
						if(!ISVIP && $('.GPC0026').data('vip-use-flag') == 'Y' ){
							if($('.GPC0026').data('promotion-index-url') != '' && $('.GPC0026').data('promotion-index-url') != 'component-promotion-index-url'){
								window.location.href = $('.GPC0026').data('promotion-index-url'); 
							}else{
								window.location.href = '/'+COUNTRY_CODE.toLowerCase(); 
							}
						}
						/*// LGEGMC-1415 : 20210524 add */
						
						// desktop
						$nav.find('.for-desktop .right-btm .login').addClass('logged').find('.after-login .welcome .name').text(name);
						// mobile
						$nav.find('.for-mobile .menu .mylg .login').addClass('logged').find('.after-login .name').text(name);
						$nav.find('.for-mobile .nav-wrap .right .login').addClass('logged'); //LGEGMC-777 add
						$nav.find('.for-mobile .menu .mylg ').next().find('.welcome .name').text(name);
						// bind click event
						$nav.find('.for-mobile .menu .mylg .login.logged,.for-mobile .nav-wrap .right .login.logged').find('>a.after-login').on('click', function (e) {
							e.preventDefault();
							/*LGEGMC-777*/
							if($(this).parents(".right").length){
								$nav.find('.for-mobile .menu>a').trigger("click");
							}
							/*//LGEGMC-777*/
							var targetID = $(this).attr('href').split('#')[1];
							if (targetID && targetID.length > 0) {
								var $target = $(this).closest('.navigation').find('#' + targetID);
								var $mobileNav = $nav.find('.for-mobile');
								var $mobileDepth1 = $mobileNav.find('.depth1-m');
								var $mobileTopMenu = $mobileNav.find('.top-link');
								var $mobileMyLG = $mobileNav.find('.mylg');
								$target.addClass('active');
								$mobileDepth1.removeClass('active');
								$mobileDepth1.siblings(".language").removeClass('active');
								$mobileDepth1.siblings(".country").removeClass('active'); // LGEGMC-1473
								$mobileTopMenu.removeClass('active');
								$mobileMyLG.removeClass('active');
								// PJTOBS 20200701 Start
								$mobileDepth1.siblings('.box-obs').removeClass('active');
								// PJTOBS 20200701 End
								/*LGEGMC-777*/
								if($(this).parents(".right").length){
									$target.find(".back").hide();
								}else{
									$target.find(".back").show();
								}
								/*//LGEGMC-777*/
								scrollToTop($(this));
							}
						});
						// page url ? LoginFlag=Y
						var currentUrl = window.location.href;
						if(currentUrl.indexOf('LoginFlag=Y') != -1) {
							adobeSatellite('set_member_id', {'member_id' : data.user.userId});
							if(history.replaceState) {
								history.replaceState({login:'login'}, '', currentUrl.replace('?LoginFlag=Y', '').replace('&LoginFlag=Y', ''));
							}
						}
							/* LGEKZ-111 Start*/
						if (data.countryUnitObsFlag != undefined){
							var url = data.vipPriceAjaxUrl ? data.vipPriceAjaxUrl : '';
							$('.navigation').data('vip-url', url);
							fetchVipPrice(data.countryUnitObsFlag);
						}
						/* LGEKZ-111 Start*/
						
						//LGEGMC-1415 Start
						if(ISVIP){
							var vipIconCheck = document.getElementsByClassName('login logged');
							for(var i = 0; i < vipIconCheck.length; i++){
								/* PJTB2BOBS-1 Start */
								if(data.user.group == 'B2B'){
									vipIconCheck[i].className += " is-vip-b2b";
								}else{
									vipIconCheck[i].className += " is-vip";
								}
								/* PJTB2BOBS-1 End */
							}
							if($('.GPC0045 .unit-box-wrap .vipUser').length > 0){
	                            var iconListcheckText = $('.GPC0045').attr('class');
	                            var iconListcheckLength = parseInt(iconListcheckText.substr(iconListcheckText.length - 1),10)+1;
	                            var resultText = "icn-img"+iconListcheckLength+"s-txt"+iconListcheckLength;
	                            $('.GPC0045').attr('class',"component GPC0045 "+resultText);
	                            $('.GPC0045 .unit-box-wrap .vipUser').attr('style','');
					    	}
							/* LGEGMC-1415 Start : VIP Promotion Setting */
						}					  
						//LGEGMC-1415 End
					}else{
						/* LGEKZ-111 Start*/
						if (data.countryUnitObsFlag != undefined){
							var url = data.vipPriceAjaxUrl ? data.vipPriceAjaxUrl : '';
							$('.navigation').data('vip-url', url);
							fetchVipPrice(data.countryUnitObsFlag);
						}
						/* LGEKZ-111 Start*/
						
						/* LGEGMC-1415 : 20210524 add */
						if($('.GPC0026').data('vip-use-flag') == 'Y'){
							if($('.GPC0026').data('promotion-index-url') != '' && $('.GPC0026').data('promotion-index-url') != 'component-promotion-index-url'){
								window.location.href = $('.GPC0026').data('promotion-index-url'); 
							}else{
								window.location.href = '/'+COUNTRY_CODE.toLowerCase(); 
							}
						}
						/*// LGEGMC-1415 : 20210524 add */						
					}
					
					// for obs menu
					if (data.obsLoginFlag != "Y" || data.obsLoginFlag != "S") {
						//console.log($nav.find('.obs-menu'));
						$nav.find('.obs-menu').remove();
					}
					
					//LGEDE-354 start					
					if ($('.GPC0007,.GPC0009').length>0) {						
						$('.GPC0007').find('.tag-content').find('[data-user-type=""]').removeClass('d-none');
						$('.GPC0009').find('.info-top .flag').find('[data-user-type=""]').removeClass('d-none');
						
						$('.GPC0007').find('.tag-content').find('[data-user-type=ALL]').removeClass('d-none');
						$('.GPC0009').find('.info-top .flag').find('[data-user-type=ALL]').removeClass('d-none');
						
						if(SIGN_IN_STATUS == 'Y' && ISVIP){
							$('.GPC0007').find('.tag-content').find('[data-user-type=VIP]').removeClass('d-none');
							$('.GPC0009').find('.info-top .flag').find('[data-user-type=VIP]').removeClass('d-none');
						/* LGEDE-422 Start //Non-vip and Non-login */ 
						}else {
							$('.GPC0007').find('.tag-content').find('[data-user-type=NON_VIP]').removeClass('d-none');
							$('.GPC0009').find('.info-top .flag').find('[data-user-type=NON_VIP]').removeClass('d-none');
						}
						/* LGEDE-422 End */
					}					
					//LGEDE-354 end
					
					
				}, commonSendType);
			//}
		}else{
			/* LGEITF-532 Start */					
			if ($('.GPC0007,.GPC0009').length>0) {						
				$('.GPC0007').find('.tag-content').find('[data-user-type=""]').removeClass('d-none');
				$('.GPC0009').find('.info-top .flag').find('[data-user-type=""]').removeClass('d-none');
				
				$('.GPC0007').find('.tag-content').find('[data-user-type=ALL]').removeClass('d-none');
				$('.GPC0009').find('.info-top .flag').find('[data-user-type=ALL]').removeClass('d-none');
				
				$('.GPC0007').find('.tag-content').find('[data-user-type=NON_VIP]').removeClass('d-none');
				$('.GPC0009').find('.info-top .flag').find('[data-user-type=NON_VIP]').removeClass('d-none');				
			}					
			/* LGEITF-532 End */
		}
	}
}

//LGEGMC-221 Start Sha 256 변환 함수 
function SHA256(s){
      
    var chrsz   = 8;
    var hexcase = 0;
  
    function safe_add (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
      
    function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
    function R (X, n) { return ( X >>> n ); }
    function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
    function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
    function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
    function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
    function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
    function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
      
    function core_sha256 (m, l) {
             
        var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1,
            0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
            0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786,
            0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
            0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147,
            0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
            0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B,
            0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
            0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A,
            0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
            0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
 
        var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 
                   0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
 
        var W = new Array(64);
        var a, b, c, d, e, f, g, h, i, j;
        var T1, T2;
  
        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;
      
        for ( var i = 0; i<m.length; i+=16 ) {
            a = HASH[0];
            b = HASH[1];
            c = HASH[2];
            d = HASH[3];
            e = HASH[4];
            f = HASH[5];
            g = HASH[6];
            h = HASH[7];
  
            for ( var j = 0; j<64; j++) {
                if (j < 16) W[j] = m[j + i];
                else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
  
                T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                T2 = safe_add(Sigma0256(a), Maj(a, b, c));
  
                h = g;
                g = f;
                f = e;
                e = safe_add(d, T1);
                d = c;
                c = b;
                b = a;
                a = safe_add(T1, T2);
            }
  
            HASH[0] = safe_add(a, HASH[0]);
            HASH[1] = safe_add(b, HASH[1]);
            HASH[2] = safe_add(c, HASH[2]);
            HASH[3] = safe_add(d, HASH[3]);
            HASH[4] = safe_add(e, HASH[4]);
            HASH[5] = safe_add(f, HASH[5]);
            HASH[6] = safe_add(g, HASH[6]);
            HASH[7] = safe_add(h, HASH[7]);
        }
        return HASH;
    }
      
    function str2binb (str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for(var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
        }
        return bin;
    }
      
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
  
        for (var n = 0; n < string.length; n++) {
  
            var c = string.charCodeAt(n);
  
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
  
        }
  
        return utftext;
    }
      
    function binb2hex (binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for(var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
            hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
        }
        return str;
    }
      
    s = Utf8Encode(s);
    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
      
}
//LGEGMC-221 End Sha 256 변환 함수 

// navigation
(function () {
	if (!document.querySelector('.navigation')) return false;

	// navigation
	var $nav = $('.navigation');
	if ($nav.length > 0) {

		// desktop view
		// gnb
		// 202004069 START 박지영 - 태블릿에서 sublayer 링크 클릭시 페이지 이동 안했던 오류 수정
		var $depthLink = $nav.find('.depth1 > li > a, .depth2 > li > a');
		// 202004069 END
		var $scrollBtn = $nav.find('.depth1 .scroll .scroll-left a, .depth1 .scroll .scroll-right a');
		var $icons = $nav.find('.right-btm .icons, .right .icons');
		var $iconBtn = $icons.find('>div>a, >li>a');
		// 20200527 START 박지영 : 불필요한 코드 삭제
		//var $searchInput = $nav.find('.search .search-input input.input');
		// 20200527 END
		var $searchForms = $nav.find('.gnb-search-form');
		var $mobLanguageSelector = $nav.find(".for-mobile").find(".language");
		var $mobCountrySelector = $nav.find(".for-mobile").find(".country"); // LGEGMC-1473
		var isMouseOver = false;

		$searchForms.on('submit', function(e) {
			var searchTxt = $(this).find('.search-input input[type=text]').val();
			$(this).find('.search-input input[type=text]').val(xssfilter(searchTxt, 'form'));
			if(searchTxt!=xssfilter(searchTxt)) {
				$(this).submit();
			}
		});
		// bind click event
		$depthLink.on('touch click', function (e) {
			if ('ontouchstart' in document.documentElement) {
				e.preventDefault();
				//console.log('test1');
				$(this).trigger('focus');
			} else {
				//console.log('test2');
				return true;
			}
		});
		$depthLink.on('focus mouseenter', function (e) {
			e.preventDefault();
			if ($(this).is($scrollBtn)) return false;
			var _this = $(this);

			isMouseOver = true;
			//setTimeout(function() {
				// 20200421 START 박지영 - 불필요한 스크립트 삭제
				//if(!isMouseOver) return false;
				// 20200421 END

				var $contain = _this.closest('ul'); // depth1 or depth2
				$contain.find('li a').not(_this).removeClass('active');
				_this.addClass('active');

				// close search lyaer
				$nav.find('.search-result-layer').removeClass('active');

				// control right area
				$icons.find('.gnb-login').removeClass('active');

				var $window = $(window).width();

				if ($contain.hasClass('depth1')) {

					// controlArrow
					controlScrollX(window.matchMedia('(min-width: 768px) and (max-width: 1325px)')); // 초기 실행
					controlArrow('none');

					// slick
					var dt = 768;
					if (dt < $window) {
						//var target = '#'+_this.attr('href').split('#')[1];
						var target = '#' + _this.data('id');
						if ($(target).find('.slick-slider').length > 0) {
							_this.parent().find('.feature-box').get(0).slick.setPosition();
						}
						if (_this.hasClass('active')) {
							if (_this.next().find('.slick-dot-wrap .slide-pause').hasClass('pause')) {
								return;
							} else {
								_this.next().find('.slick-dot-wrap .slide-pause').trigger('click');
							}
						}
					}
				}

				function isEmpty(el) {
					return !$.trim(el.html());
				}

				if ($contain.hasClass('depth2')) {
					// menu
					$contain.closest('.depth1').find('>li').not($contain.closest('li')).find('> a').removeClass('active');
					$contain.closest('li').find('> a').addClass('active');

					// slick
					if (!isEmpty(_this.parent().find('.sublayer .sublayer-inner .columns'))) {
						var dt2 = 768;
						if (dt2 < $window) {
							if (_this.parent().find('.feature-box').length > 0) {
								_this.parent().find('.feature-box').get(0).slick.setPosition();
							}
							$nav.find('.depth2').find('.slick-initialized').slick('slickPause');
							$nav.find('.depth2').find('.slick-dot-wrap .slide-pause').removeClass('pause').addClass('play').text(_this.attr('data-title-play'));
							if ($nav.find('.slick-dot-wrap .slide-pause').hasClass('pause')) {
								$nav.find('.slick-dot-wrap .slide-pause.pause').trigger('click');
							}
							if (_this.hasClass('active')) {
								if (_this.next().find('.slick-dot-wrap .slide-pause').hasClass('pause')) {
									//return;
								} else {
									_this.next().find('.slick-dot-wrap .slide-pause').trigger('click');
								}
							}
						}
					}
				}
			//}, 100);
		});
		var get2DepthWidth = function() {
			var $obj = $nav.find('.depth2');
			var sumWidth=0;
			var len = $obj.find('>li').length;
			for(var i=0;i<len;i++) {
				var sw = parseInt($obj.find('>li').eq(i).outerWidth()); //+ parseInt($obj.find('>li').eq(i).css('margin-left')) + parseInt($obj.find('>li').eq(i).css('margin-right'));
				sumWidth=sumWidth+parseInt(sw);
			}
			return sumWidth;
		};
		// 2depth x-scroll
		$scrollBtn.on('click', function (e) {
			e.preventDefault();
			var currentLeft = $nav.find('.depth2').data('transform');
			var transformLeft = 0;
			if(!currentLeft) currentLeft = 0;

			// 20200601 START 박지영 - GNB RTL 동작 수정
			if ($(this).parent().hasClass('scroll-left')) {
				if(ISRTL) transformLeft = currentLeft + 300;
				else transformLeft = currentLeft - 300;
			} else {
				if(ISRTL) transformLeft = currentLeft - 300;
				else transformLeft = currentLeft + 300;
			}
			// 20200601 END
			if(transformLeft<0) transformLeft=0;
			controlArrow(transformLeft);
		});
		// 2depth x-scroll arrow
		var controlArrow = function (num) {
			var w = parseInt($(window).width());
			var ulWidth = w-30-140;
			var $obj = $nav.find('.depth2');
			var sumWidth=get2DepthWidth();
			if(num == 'none' && !$obj.data('transform')) {
				// 20200601 START 박지영 - GNB RTL 동작 수정
				if(ISRTL) {
					$obj.siblings('.scroll-right').hide();
					if(ulWidth < sumWidth) {
						$obj.siblings('.scroll-left').show();
					} else {
						$obj.siblings('.scroll-left').hide();
					}
				} else {
					$obj.siblings('.scroll-left').hide();
					if(ulWidth < sumWidth) {
						$obj.siblings('.scroll-right').show();
					} else {
						$obj.siblings('.scroll-right').hide();
					}
				}
				// 20200601 END
			} else if(num != 'none') {
				if(num<0) num=0;
				// 20200601 START 박지영 - GNB RTL 동작 수정
				if(num > (sumWidth-ulWidth)) {
					num = (sumWidth-ulWidth);
					if(ISRTL) {
						$obj.siblings('.scroll-left').hide();
					} else {
						$obj.siblings('.scroll-right').hide();
					}
				} else {
					if(ISRTL) {
						$obj.siblings('.scroll-left').show();
					} else {
						$obj.siblings('.scroll-right').show();
					}
				}
				if(ISRTL) $obj.find('> li > a').css('transform', 'translatex('+(num)+'px)');
				else $obj.find('> li > a').css('transform', 'translatex('+(num*-1)+'px)');
				$obj.data('transform', num);

				//console.log(num);
				if(ISRTL) {
					if(num > 0) {
						$obj.siblings('.scroll-right').show();
					} else {
						$obj.siblings('.scroll-right').hide();
					}
				} else {
					if(num > 0) {
						$obj.siblings('.scroll-left').show();
					} else {
						$obj.siblings('.scroll-left').hide();
					}
				}
				// 20200601 END
			}
		};
		var controlScrollX = function (e) {
			if (e.matches) {
				var ulWidth = parseInt($(window).width())-30-140;
				var sumWidth=get2DepthWidth();
				var $obj = $nav.find('.depth2');
				// 20200601 START 박지영 - GNB RTL 동작 수정
				if(!$obj.data('transform')) {
					if(ISRTL) {
						$obj.siblings('.scroll-right').hide();
						if(ulWidth < sumWidth) {
							$obj.siblings('.scroll-left').show();
						} else {
							$obj.siblings('.scroll-left').hide();
						}
					} else {
						$obj.siblings('.scroll-left').hide();
						if(ulWidth < sumWidth) {
							$obj.siblings('.scroll-right').show();
						} else {
							$obj.siblings('.scroll-right').hide();
						}
					}
				}
				// 20200601 END
			} else {
				$nav.find('.scroll-left, .scroll-right').hide();
				$nav.find('.depth2').data('transform', 0);
				$nav.find('.depth2 > li > a').removeAttr('style');
			}
		};
		window.matchMedia('(min-width: 768px) and (max-width: 1325px)').addListener(controlScrollX);
		// mouse out
		$nav.on('mouseleave', function (e) {
			e.preventDefault();
			isMouseOver = false;
			var $target = $(e.target);
			// 20200421 START 박지영 - GNB레이어 간혹 안 닫히던 버그 수정 (redmine 6035)
			if ($target.hasClass('scroll') || $target.hasClass('depth2') || $target.hasClass('sublayer-inner') || $target.hasClass('sublayer') || $target.hasClass('navi-top') || $target.closest('.sublayer-inner').length>0) {
			// 20200421 END
				$depthLink.removeClass('active');
			}
			var $window = $(window).width();
			var dt = 768;
			if (dt <= $window) {
				if ($(this).find('.slick-dot-wrap .slide-pause').hasClass('pause')) {
					$(this).find('.slick-dot-wrap .slide-pause.pause').trigger('click');
				}
			}
			//console.log(e.target);
		});
		$nav.find('.navi-top').on('mouseenter', function (e) {
			e.preventDefault();
			isMouseOver = false;
			$depthLink.removeClass('active');
		});
		// right icons and search
		$iconBtn.on('click focus mouseenter', function (e) {
			e.preventDefault();
			var $others = $(this).closest('.icons').find('>div>a, >li>a');
			$others.not($(this)).next('div').removeClass('active');
			if ($(this).next('div').length > 0) {
				if ($(this).parent().hasClass('search') && e.type != "click") {
					return false;
				} else {
					$(this).next('div').addClass('active');
				}
				if ($(this).parent().hasClass('search')) {
					$(this).next('.gnb-search-layer').find('.search-input input.input').focus();
				}
			} else {
				if(e.type=='click') {
					/*LGEGMC-777*/
					if($(this).hasClass("after-login")&&$(this).parents(".for-mobile").length){
						return true;
					}else{
						location.href=$(this).attr('href');
					}
					/*//LGEGMC-777*/
				}
				return true;
			}
			// close menu layer
			if ($nav.find('.depth1 > li > a.active, .depth2 li > a.active').length > 0) {
				$nav.find('.depth1 > li > a.active, .depth2 li > a.active').removeClass('active');
			}
			// LGEGMC-1473 start
			if ($(this).parent('li').hasClass('country')) {
				$('#countryOptionsArea').attr('aria-expanded', 'true');
			} else {
				$('#countryOptionsArea').attr('aria-expanded', 'false');
			}
			// LGEGMC-1473 end

		});
		$icons.on('mouseleave', function (e) {
			e.preventDefault();
			//console.log(e.target);
			// 20200527 START 박지영 : 불필요한 변수 삭제로 인한 조건문 수정
			if (!$(e.target).hasClass('login')) {
			// 20200527 END
				var $others = $(this).find('>div>a+div, >li>a+div');
				$others.removeClass('active');
			}
			// LGEGMC-1473 start
			$('#countryOptionsArea').attr('aria-expanded', 'false');
			// LGEGMC-1473 end
		});
		// 20200527 START 박지영 : 불필요한 코드 삭제
		/*
		$searchInput.off().on('keyup input', function (e) {
			e.preventDefault();

			// close other layer
			$nav.find('.for-desktop .left-btm ul.depth1>li>a.active').removeClass('active');
			$nav.find('.for-desktop .left-btm ul.depth2 li>a').removeClass('active');

			var $searchForm = $(this).closest('.search').find('.gnb-search-form');
			var txt = $(this).val();
			var url = $(this).data('predictive-url');
			var param = $searchForm.serialize();
			if (txt.length >= 1) {
				ajax.call(url, param, 'html', function (data, _this) {
					if (!data || data == '') {
						$searchForm.find('.search-result-layer').removeClass('active').empty();
					} else {
						$searchForm.find('.search-result-layer').addClass('active').html(data);
						$searchForm.find('.search-result-layer').find('.search-layer .enhanced-products ul li .txt a.product').off('click').on('click', function() {
							adobeTrackEvent('gnb-search-product', {search_keyword : $(this).closest('.gnb-search-form').find('.search-input input').val(), page_event : {predictive_search_click : true}});
						});
					}
				});
			} else {
				$searchForm.find('.search-result-layer').removeClass('active').empty();
			}
		});
		*/
		// 20200527 END
		$('body').on('click touchend', function (e) {
			if (!$(e.target).parents('.navigation')[0]) {
				$nav.find('.gnb-search-layer.active').removeClass('active');
			}
		});
		$searchForms.on('click', '.search-result-layer .close', function(e) {
			//$(this).closest('.search').find('.gnb-search-form .search-result-layer').removeClass('active').empty();
			$searchForms.find('.search-submit input.submit').focus();
		});
		$searchForms.find('.search-submit input.submit').on('focus', function(e) {
			$(this).closest('.search').find('.gnb-search-form .search-result-layer').removeClass('active').empty();
		});
		// close sublayer
		$nav.on('click', '.sublayer .close a', function (e) {
			e.preventDefault();
			$(this).closest('.sublayer').parent().find('>a').removeClass('active');
		});

		// feature box
		var featureSlick = function () {
			var $featureObj = $nav.find('.gnb-feature');
			/* LGEIN-554 Start */
			var countryCode = $('html').data('countrycode'),
				slideDirLtr = countryCode == 'in' ? true : false;
			/* //LGEIN-554 End */

			$featureObj.each(function () {
				var _this = $(this);
				// 20200512 START 박지영 - gnb > feature product > 1개 초과일때 dot, arrow 출력되지 않도록 수정
				var slickOption = {
					listStyle: true, // WA-Common-Slick
					autoplay: true,
					autoplaySpeed: 5000,
					infinite: slideDirLtr, // WA-Common-Slick, LGEIN-554
					slidesToShow: 1,
					slidesToScroll: 1,
					arrows: true,
					dots: true,
					appendDots: $(this).find('.dot-box')
				}
				if($(this).find('.feature-box .item').length<=1) {
					slickOption.arrows = false;
					slickOption.dots = false;
					$(this).find('.feature-box + .slick-dot-wrap').hide();
				}
				$(this).find('.feature-box').slick(slickOption);
				$(this).find('.slide-pause').on('click', function () {
					if ($(this).hasClass('pause')) {
						$(this).removeClass('pause').addClass('play');
						$(this).text($(this).attr('data-title-play'));
						_this.find('.feature-box').slick('slickPause');
					} else {
						$(this).removeClass('play').addClass('pause');
						$(this).text($(this).attr('data-title-stop'));
						_this.find('.feature-box').slick('slickPlay');
					}
				});
				// $(this).find('.slick-dot-wrap .slide-pause').trigger('click');
				// 20200512 END
			});
		};
		featureSlick();

		// mobile view
		var scrollToTop = function ($obj) {
			var t = $obj.closest('.navigation').offset().top;
			//console.log(t);
			$('html, body').stop().animate({scrollTop: t}, 300);
		};
		// close search layer in mobile view
		$nav.find('.gnb-search-layer .search-close a').off('click').on('click', function (e) {
			e.preventDefault();
			$(this).closest('.gnb-search-layer').removeClass('active');
		});
		// bind click event in mobile view
		var $mobileNav = $nav.find('.for-mobile');
		var $mobileMenu = $mobileNav.find('.menu');
		var $mobileDepth1 = $mobileNav.find('.depth1-m');
		var $mobileTopMenu = $mobileNav.find('.top-link');
		var $mobileMyLG = $mobileNav.find('.mylg');
		var $mobileBack = $mobileNav.find('.back');
		//var $mobileLogged = $mobileNav.find('.mylg .login.logged');
		// PJTOBS 20200701 Start
		var $mobileOBSMenu = $mobileNav.find(".menu-wrap > .box-obs"); // menu-wrap 바로 하위의 box-obs
		// PJTOBS 20200701 End
		var $mobileExpand = $mobileNav.find('.depth2-m .expand');
		$mobileMenu.find('>a').on('click', function (e) {
			e.preventDefault();
			$("body").toggleClass("m-menu-open"); // LGEGMC-2101
			$(this).parent().toggleClass('open').find('.menu-wrap').toggleClass('active');
			if($nav.find('.for-mobile').find('.bg-drop').length==0) {
				$(this).parent().append('<div class="bg-drop"></div>');
			}

			// active current page
			if($nav.find('.for-mobile').find('.current-page').length==1) {
				var $currMenu = $nav.find('.for-mobile').find('.current-page');
				if($currMenu.is('.type2') || $currMenu.closest('.type3').length>0 || $currMenu.is('.expand')) {
					$currMenu.closest('.sublayer-m').addClass('active').siblings().removeClass('active');
					if($currMenu.closest('.sub').length>0) {
						$currMenu.closest('.sub').prev().addClass('active').siblings().removeClass('active');
					}
				} else if($currMenu.parent().parent().is('.type1')) {

				}
			} else {
				$mobileDepth1.addClass('active');
				$mobileTopMenu.addClass('active');
				$mobileMyLG.addClass('active');
				$(this).parent().find('.sublayer-m').removeClass('active');
			}

			// PJTOBS 20200714 Start
			toggleOBSLinker();
			// PJTOBS 20200714 End

			scrollToTop($(this));
		});
		$mobileMenu.on('touch click', '.bg-drop', function(e) {
			e.preventDefault();
			$("body").removeClass("m-menu-open"); // LGEGMC-2101
			$mobileMenu.removeClass('open').find('.menu-wrap').removeClass('active');
			scrollToTop($(this));
		});
		// laguage DOM toggle
		var toggleLanguageLinker = function (){
			if($mobLanguageSelector.length > 0){
				if( $mobileDepth1.hasClass("active") ){
					$mobLanguageSelector.addClass("active");
				}else if( $nav.find('.sublayer-m').hasClass("active") ){
					$mobLanguageSelector.removeClass("active");
				}
			}
		};
		// LGEGMC-1473 start
		// country DOM toggle
		var toggleCountryLinker = function (){
			if($mobCountrySelector.length > 0){
				if( $mobileDepth1.hasClass("active") ){
					$mobCountrySelector.addClass("active");
				}else if( $nav.find('.sublayer-m').hasClass("active") ){
					$mobCountrySelector.removeClass("active");
				}
			}
		};
		// LGEGMC-1473 end
		// PJTOBS 20200701 Start
		var toggleOBSLinker = function() {
			if($mobileOBSMenu.length>0) {
				if( $mobileDepth1.hasClass("active") ){
					$mobileOBSMenu.addClass("active");
				}else if( $nav.find('.sublayer-m').hasClass("active") ){
					$mobileOBSMenu.removeClass("active");
				}
			}
		};
		// PJTOBS 20200701 End
		$mobileDepth1.siblings('.language').children("a").on('click', function (e) {
			e.preventDefault();
			var $target = $('#langOptions');
			$mobileDepth1.removeClass('active');
			$mobileTopMenu.removeClass('active');
			$mobileMyLG.removeClass('active');
			$target.addClass('active');
			toggleLanguageLinker();
			// PJTOBS 20200701 Start
			toggleOBSLinker();
			// PJTOBS 20200701 End
				toggleCountryLinker(); //LGEGMC-1473
			scrollToTop($(this));
		});
		// LGEGMC-1473 start
		$mobileDepth1.siblings('.country').find("a").on('click', function (e) {
			e.preventDefault(); 
			if(window.location.href.indexOf('/oauth/') == -1){
				var $target = $('#countryOptions');
				$mobileDepth1.removeClass('active');
				$mobileTopMenu.removeClass('active');
				$mobileMyLG.removeClass('active');
				$target.addClass('active');
				toggleLanguageLinker();
				toggleOBSLinker();
				toggleCountryLinker(); //LGEGMC-1473 
				scrollToTop($(this));
			}
		});

		// LGEGMC-1473 end
		// category menu toggle
		$mobileDepth1.find('>li>a').on('click', function (e) {
			e.preventDefault();
			var url = $(this).attr('href');
			var targetID = url.split('#')[1];
			if (targetID && targetID.length > 0) {
				var $target = $('#' + targetID);
				if($target.length>0) {
					$mobileDepth1.removeClass('active');
					$mobileTopMenu.removeClass('active');
					$mobileMyLG.removeClass('active');
					$target.addClass('active');
					// LGEGMC-2101 Start
					if ($target.find('.slick-slider').length > 0) {
						$target.find('.feature-box').get(0).slick.setPosition();
						if ($target.find('.slick-dot-wrap .slide-pause').hasClass('pause')) {
							return;
						} else {
							$target.find('.slick-dot-wrap .slide-pause').trigger('click');
						}

						// mobile depth2-m > featured slick slide > font style - none block bug issue
						var $featuredBox = $target.find('.featured-product');
						$featuredBox.find('.slick-track').attr('style','width:270px');
						$featuredBox.find('.slick-current.slick-active').attr('style','width:270px');
					}
					// LGEGMC-2101 End
					toggleLanguageLinker();
					// PJTOBS 20200701 Start
					toggleOBSLinker();
					// PJTOBS 20200701 End
					toggleCountryLinker(); //LGEGMC-1473 
					scrollToTop($(this));
				} else {
					if($(this).attr('target') && $(this).attr('target')=='_blank') {
						window.open(url);
					} else {
						window.location.href = url;
					}
				}
			} else {
				if($(this).attr('target') && $(this).attr('target')=='_blank') {
					window.open(url);
				} else {
					window.location.href = url;
				}
			}
		});
		$mobileBack.find('>a').on('click', function (e) {
			e.preventDefault();
			$mobileDepth1.addClass('active');
			$mobileTopMenu.addClass('active');
			$mobileMyLG.addClass('active');
			$(this).closest('.sublayer-m').removeClass('active');
			toggleLanguageLinker();
			// PJTOBS 20200701 Start
			toggleOBSLinker();
			// PJTOBS 20200701 End
			toggleCountryLinker(); //LGEGMC-1473
			scrollToTop($(this));
		});
		$mobileExpand.find('>a').on('click', function (e) {
			e.preventDefault();
			$(this).parent().toggleClass('active');
		});
		loginCheck();

		// navSearch
		var navSearch = function(){
			var root_node = document.getElementById("navigation_search");
			if(!root_node){return false;}
			var $navSearchWindow = $(root_node);
			var p = navSearch.prototype;
			var bizType = ( $nav && $nav.hasClass('b2b') ) ? 'B2B' : 'B2C'; //PJTGLONEW-1 add
		
			p.cookieName = ( $nav && $nav.hasClass('b2b') ) ? 'LG5_B2B_SearchResult' : 'LG5_SearchResult';
			p.elements = {
				keeping : function(){
					// static view
					// this.$pre_keyword = $navSearchWindow.find(".pre-keyword");
					this.$navSearchForm = $navSearchWindow.find("#navigationSearchForm");
					this.$searchInputField = this.$navSearchForm.find(".input-field");
					this.$useInputKeyword = this.$navSearchForm.find("#useInputKeyword");
					this.$btnSearchSubmit = this.$navSearchForm.find("#searchByKeyword");
					this.$autoSearchArea = this.$navSearchForm.find(".autoName-area");
					this.$autoNameBox = this.$navSearchForm.find(".autoName-box");
					this.$autoSearchList = this.$autoSearchArea.find(".autoName-list");
					this.$matchedModelArea = this.$navSearchForm.find(".success-seacrh");
					this.$modelBtnArea = this.$matchedModelArea.find('.btn-area');
					// dynamic view
					// primary
					this.$primaryView = $navSearchWindow.find(".keyword-field");
					this.$rollingArea = this.$primaryView.find(".rolling-keyword-area");
					this.$rollingBelt = this.$primaryView.find(".rolling-keyword-group");
					this.$recentlyList = this.$primaryView.find(".recenlty-keyword-list");
					this.$mostSearchedGroup = this.$primaryView.find(".most-searched-board");
					// secondary
					this.$secondaryView = $navSearchWindow.find(".result-area");
					this.$matchProductList = this.$secondaryView.find(".match-product-list");
					this.$categorizedList = this.$secondaryView.find(".categorized-results-list");
					this.$similarMapping = $navSearchWindow.find(".similar-mapping");
					// see all results
					this.$seeAllResults = this.$secondaryView.find('.match-keyword-count');
				},
			};
			p.searchContents = {
				url : $(root_node).data("child-html"),
				param : {bizType},
				type : "html",
				action : function(response){
					$navSearchWindow.html(response);
					//p.init();
					p.elements.keeping();
					p.view__preset();
					//p.event__navSearchWindow_open();
					p.event__navSearchWindow_close();
					p.event__inputField();
					p.event__clear();
					p.event__resize();
					p.event__submit();
					p.event__submit_trigger();
					p.event_autoClick_trigger();
					p.floatingWindow(true);
					p.view__active();
					if(typeof scrollDesign == 'function') scrollDesign();
					$navSearchWindow.attr('tabindex', 0).focus();
					/* LGECI-318 s*/
					if(COUNTRY_CODE.toLowerCase() == 'ca_en'||COUNTRY_CODE.toLowerCase() == 'ca_fr'){
						p.elements.$useInputKeyword.focus();
					}
					/* LGECI-318 e*/
					//$('#useInputKeyword').focus();
				},
				call : function(){
					$.ajax({
						type: 'post',
						url: this.url,
						dataType: this.type,
						data: xssfilter(this.param),
						xhrFields: {
							withCredentials: true
						},
						success: function (d) {
							p.searchContents.action(d);
						},
						error: function (request, status, error) {
							console.log("status: " + status);
							console.log("error: " + error);
						}
					});
					/*
					ajax.call(
						this.url,
						this.param,
						this.type,
						this.action,
						'',
						'body'
					);
					*/
				},
			};
			p.searchResults = {
				templetes : {
					matchProduct : "htmlString",
					category : "htmlString", 
					autoData : "htmlString",  //PJTSEARCH-1 add
					matchedData : "htmlString" //PJTSEARCH-1 add
				},
				url : null,
				param : {},
				type : "json",
				action : function(response){
					// variable
					var searchValue = xssfilter( p.elements.$useInputKeyword.val() );
					// running this action check
					var typingErrorCheck = response.typingError.similarFlag;
					//PJTSEARCH-1 start
					if(response.autoData != undefined){
						var autoTotal = response.autoData.autoTotal;
						var autoArr = response.autoData.autoArr;
						var autoArrLength = autoArr.length;
						var autoResult = "";
						var autoList = "";
						var autoDataResult = function(){
							for(var i=0; i<autoArrLength; i++){
								var data = autoArr[i];
								var target = '';
								if(data.linkTarget == 0){
									target = '_self';
								}else{
									target = '_blank';
								}
								
								var autoKeyword = data.sitemapName;
//								var regex = new RegExp(searchValue,"g");
								var matchText = autoKeyword.match(new RegExp(searchValue, "i"));
								autoKeyword = autoKeyword.replace(matchText, "\<span\>" + matchText + "\<\/span\>");
								
								if(i == 0){
									var sitemapName = data.sitemapName;
									if(sitemapName.toLowerCase() == searchValue.toLowerCase()){
										$('#searchByKeyword').attr('auto-url', data.linkPath);
									}else{
										if($('#searchByKeyword').attr('auto-url') != undefined){
											$('#searchByKeyword').removeAttr('auto-url');
										}
									}
								}
								
								autoResult = p.searchResults.templetes.autoData
											.replace(/\*autoDataName\*/g, autoKeyword)
											.replace(/\*autoDataUrl\*/g, data.linkPath)
											.replace(/\*target\*/g, target)
											;
								autoList += autoResult;
							}
							// finish off
							p.elements.$autoSearchList.html(autoList);
							p.elements.$autoNameBox.mCustomScrollbar("update");
						};
						
						p.elements.$autoSearchArea.addClass("active");
						autoDataResult();
						
					}else{
						p.elements.$autoSearchArea.removeClass("active");
					}
					
					if(response.matchedData != undefined){
						var data = response.matchedData;
						var matchedFlag = data.matchedModelFlag;
						var matchedResult = "";
						var atcActive = "";
						var wtbActive = "";
						var iqActive = "";
						var ftdActive = "";
						
						//버튼 area check
						if(data.addToCartBtnFlag == 'Y'){
							atcActive = "active";
						}
						
						if(data.wtbBtnFlag == 'Y'){
							wtbActive = "active";
						}
						
						if(data.inquiryBtnFlag == 'Y'){
							iqActive = "active";
						}
						
						if(data.findTheDealerBtnFlag == 'Y'){
							//ftdActive = "active";
						}
						
						// support 영역 check
						var manualTag = "";
						var softwareTag = "";
						var requestRepairTag = "";
						var registerProductTag = "";
						
						if(data.manualUrl != undefined && data.manualUrl != null && data.manualUrl != ''){
							manualTag = "<li><a href='"+data.manualUrl+"'><img src='/lg5-common-gp/images/common/icons/manuals.svg' alt='Manuals' aria-hidden='true'/><p>"+data.manualText+"</p></a></li>";
						}
						
						if(data.softwareUrl != undefined && data.softwareUrl != null && data.softwareUrl != ''){
							softwareTag = "<li><a href='"+data.softwareUrl+"'><img src='/lg5-common-gp/images/common/icons/software.svg' alt='Software Drivers' aria-hidden='true'/><p>"+data.softwareText+"</p></a></li>";
						}
						
						if(data.requestaRepairUrl != undefined && data.requestaRepairUrl != null && data.requestaRepairUrl != ''){
							requestRepairTag = "<li><a href='"+data.requestaRepairUrl+"'><img src='/lg5-common-gp/images/common/icons/requestrepair.svg' alt='Request Repair' aria-hidden='true'/><p>"+data.requestaRepairText+"</p></a></li>";
						}
						
						var registeraProductUrl = "";
						if(_dl.isLogin == 'Y' && data.registeraProductUrl != ''){
							registeraProductUrl = data.registeraProductUrl;
						}else if(_dl.isLogin != 'Y' && data.registeraProductUrl != ''){
							registeraProductUrl = "\/"+_dl.country_code+"\/mylg\/login?state="+data.registeraProductUrl;
						}
						
						if(registeraProductUrl != ''){
							registerProductTag = "<li><a href='"+registeraProductUrl+"'><img src='/lg5-common-gp/images/common/icons/regist-product.svg' alt='Register a Product' aria-hidden='true'/><p>"+data.registeraProductText+"</p></a></li>";
						}
						
						if(matchedFlag == 'Y'){
							matchedResult = p.searchResults.templetes.matchedData
							.replace(/\*imageAltText\*/g, (data.imageAltText != null) ? data.imageAltText : '')
							.replace(/\*mediumImageAddr\*/g, data.mediumImageAddr)
							.replace(/\*modelId\*/g, data.modelId)
							.replace(/\*modelUrlPath\*/g, data.modelUrlPath)
							.replace(/\*modelName\*/g, data.modelName)
							.replace(/\*userFriendlyName\*/g, data.userFriendlyName == null ? '' : data.userFriendlyName.replace(/\"/g, "''"))
							.replace(/\*modelYear\*/g, data.modelYear) /* LGEGMC-1279 : 2021.03.12 add */
							.replace(/\*buName1\*/g, data.buName1)
							.replace(/\*buName2\*/g, data.buName2)
							.replace(/\*buName3\*/g, nvl(data.buName3,''))
							.replace(/\*superCategoryName\*/g, data.superCategoryName)
							.replace(/\*bizType\*/g, data.bizType)
							.replace(/\*priceValue\*/g, (nvl(data.obsSellingPrice,'') || ''))
							.replace(/\*salesModelCode\*/g, data.salesModelCode)
							.replace(/\*salesSuffixCode\*/g, data.salesSuffixCode)
							.replace(/\*addToCartBtnFlag\*/g, data.addToCartBtnFlag)
							.replace(/\*addToCartBtnMsg\*/g, data.addToCartBtnMsg)
							.replace(/\*wtbBtnFlag\*/g, data.wtbBtnFlag)
							.replace(/\*wtbBtnMsg\*/g, data.wtbBtnMsg)
							.replace(/\*findTheDealerBtnFlag\*/g, data.findTheDealerBtnFlag)
							.replace(/\*findTheDealerBtnMsg\*/g, data.findTheDealerBtnMsg)
							.replace(/\*inquiryBtnFlag\*/g, data.inquiryBtnFlag)
							.replace(/\*inquiryBtnMsg\*/g, data.inquiryBtnMsg)
							.replace(/\*addToCartUrl\*/g, data.addToCartUrl)
							.replace(/\*inquiryToBuyUrl\*/g, data.inquiryToBuyUrl)
							.replace(/\*whereToBuyUrl\*/g, data.whereToBuyUrl)
							.replace(/\*findTheDealerUrl\*/g, data.findTheDealerUrl)
							.replace(/\*atcActive\*/g, atcActive)
							.replace(/\*wtbActive\*/g, wtbActive)
							.replace(/\*iqActive\*/g, iqActive)
							.replace(/\*ftdActive\*/g, ftdActive)
							.replace(/\*manualTag\*/g, manualTag)
							.replace(/\*softwareTag\*/g, softwareTag)
							.replace(/\*requestRepairTag\*/g, requestRepairTag)
							.replace(/\*registerProductTag\*/g, registerProductTag)
							.replace(/\*pspUrl\*/g, data.pspLink)
							;
							
							p.elements.$matchedModelArea.html(matchedResult);
							p.event_matchModelClick_trigger();
							
							var btnColorChange = data.btnColorChange;
							var btnList = p.elements.$matchedModelArea.find(".btn-area a");
							for(var i = 0; i < btnList.length; i++){
								if(btnColorChange == 'Y'){
									if($(btnList[i]).hasClass("btn-primary")){
										$(btnList[i]).removeClass("btn-primary");
										$(btnList[i]).addClass("btn-outline-secondary");
									}else{
										$(btnList[i]).removeClass("btn-outline-secondary");
										$(btnList[i]).addClass("btn-primary");
									}
								}
							}
							
							setTimeout(function() {
								var $obj = $('.success-etc ul');
								var $slick = null;
								var slideInit = function() {
									$slick = $obj.slick({
										infinite: false,
										slidesToShow: 3,
										slidesToScroll: 3,
										variableWidth: true,
										arrows : true,
										dots: false,
										responsive: [
											{
												breakpoint: 1024,
												settings: {
													slidesToShow: 1,
													slidesToScroll: 1
												}
											}
										]	
									});
								}
								$obj.filter('.slick-initialized').slick('unslick');
								slideInit()
							}, 100);
							
							$('#autoResult').remove();
							p.elements.$autoSearchArea.addClass("active");
							p.elements.$autoNameBox.addClass("gang-success");
							p.elements.$autoNameBox.mCustomScrollbar("destroy");
						}else{
							p.elements.$autoNameBox.removeClass("gang-success");
							p.elements.$autoNameBox.mCustomScrollbar("init")
						}
					}
					p.elements.$autoSearchArea.find('.link-close').off('click').on('click', function(e) {
						e.preventDefault();
						setTimeout(function() {
							p.elements.$autoSearchArea.removeClass('active');
						}, 100);
					});
					//PJTSEARCH-1 End
		
					if(response.data.products !== undefined){
						// match product list
						var productMsg = response.data.productMessages;
						var productDataSets = response.data.products;
						var productDataLength = productDataSets.length;
						var resultList = "";
						var exposeItem = "";
						// categorized list
						var categories = response.data.categories;
						var categoryLength = categories.length;
						var categoryList = "";
						var category = "";
						// see all results
						var seeAllResultsLength = response.data.seeAllResults.cnt;
						var seeAllResultsURL = response.data.seeAllResults.url;
		
						var matchProductResult = function(){
							// button code
							var cartBtnFlagCheck = function(data){
								// PJTOBSB2E-3 Start
								if(data.obsPreOrderInventoryDateFlag === 'Y' && data.obsPreOrderFlag === 'Y'){
									return "Y";
								// PJTOBSB2E-3 End
								}else if(data.addToCartFlag !== "N"){
									if(data.addToCartFlag === 'S' || data.addToCartFlag === 'Y'){
										return data.addToCartFlag;
									}
								}else if(data.bookOnlineFlag === "Y"){
									return data.bookOnlineFlag;
								}else if(data.buyNowFlag === 'L' || data.buyNowFlag === "Y" ){
									return data.buyNowFlag;
								// 20200506 START 박지영 - flag 명 변경
								}else if(data.resellerBtnFlag === "Y"){
									return data.resellerBtnFlag;
								// 20200506 END
								}else if(data.productSupportFlag === "Y"){
									return data.productSupportFlag;
								}else{
									return "N";
								}
							};
							var wtbBtnFlagCheck = function(data){
								if(data.whereToBuyFlag=="Y" && data.whereToBuyFlag != null && data.whereToBuyFlag != ''){
									return data.whereToBuyFlag;
								}else if(data.wtbExternalLinkUseFlag=="Y" && data.wtbExternalLinkUseFlag != null && data.wtbExternalLinkUseFlag != ''){
									return data.wtbExternalLinkUseFlag;
								}else{
									return "N";
								}
							};
							// 20200423 START 이상현 - gnb search ui 변경 
							var softwareFlagCheck = function(data){
								if(data.softwareLinkFlag !== "Y"){
									return "N";
								}else{
									return "Y";
								}
							};
							var manualFlagCheck = function(data){
								// 20200427 START 이상현 - gnb search - CA manual link 출력 오류 수정
								if(data.manualLinkFlag !== "Y"){
								// 20200427 END
									return "N";
								}else{
									return "Y";
								}
							};
							// 20200423 END
							
							//LGEGMC-2202 START
							var wtbExterNalCheck = function(data){
								if(data.wtbExternalLinkUseFlag=="Y" && data.wtbExternalLinkUrl != null && data.wtbExternalLinkUrl != '' && data.wtbExternalLinkName != null && data.wtbExternalLinkName != ''){
									return "in-buynow";
								}else{
									return "where-to-buy";
								}
							};
							//LGEGMC-2202 END
							
							var btnAttributes = {
								addToCart : {
									className : "add-to-cart",
									btnOpt : function(data){
										return {
											"data-model-id" : data.modelId,
											"role" : "button",
											"href" : "#",
										};
									},
									linkOpt : function(data){
										if(data.addToCartFlag === "L"){
											return {
												"data-model-id" : data.modelId,
												"href" : "#",
												"data-keyword-search-url" : data.obsProductUrl,
												"title" : data.btnNewLinkTitle,
												"target" : "_blank",
											};
										}else{
											return {
												"data-model-id" : data.modelId,
												"href" : "#",
												"data-keyword-search-url" : data.obsProductUrl,
												"title" : data.btnNewLinkTitle,
											};
										}
									},
									localLinkOpt : function(data, keyName){
										// 20200506 START 박지영 - flag 명 변경
										if(data.resellerBtnFlag === "Y"){
										// 20200506 END
											// 20200601 START 박지영 : reseller 버튼 사용하는 경우 (il) 스크립트 수정
											return {
												"data-model-id" : data.modelId,
												"href" : "#",
												"data-keyword-search-url" : data[keyName + "LinkUrl"],
												"target" :'_blank',
												"title" : data.btnNewLinkTitle,
											};
											// 20200601 END
										}else if(data.ecommerceTarget === "_blank"){
											return {
												"data-model-id" : data.modelId,
												"href" : "#",
												"data-keyword-search-url" : data[keyName + "Url"],
												"target" : data.ecommerceTarget,
												"title" : data.btnNewLinkTitle,
											};
										}
										return {
											"data-model-id" : data.modelId,
											"href" : "#",
											"data-keyword-search-url" : data[keyName + "Url"],
										};
									},
									inBtnOpt : function(data){
										return {
											"data-model-id" : data.modelId,
											"href" : "#",
											"data-keyword-search-url" : data.modelUrlPath,
										};
									},
									externalBtnKeys : [
										"obsProduct",
										"bookOnline",
										"buyNow",
										"reseller",
										"productSupport"
									],
									// PJTOBSB2E-3 Start
									preOrderOpt : function(data){
										if(data.obsBuynowFlag == 'Y'){
											return {
												"data-model-id" : data.modelId,
												"href" : "#",
												"data-keyword-search-url" : data.modelUrlPath,
												"data-obs-pre-order-start-date" : data.obsPreOrderStartDate,
												"data-obs-pre-order-end-date" : data.obsPreOrderEndDate,
												"data-obs-pre-order-flag" : "Y"
											};
										}else{
											return {
												"data-model-id" : data.modelId,
												"role" : "button",
												"href" : "#",
												"data-obs-pre-order-start-date" : data.obsPreOrderStartDate,
												"data-obs-pre-order-end-date" : data.obsPreOrderEndDate,
												"data-obs-pre-order-flag" : "Y"
											};
										}
									}
									// PJTOBSB2E-3 End
								},
								whereToBuy : {
									className : "where-to-buy",
									pdpOpt : function(data){
										return {
											"href" : "#",
											"data-keyword-search-url" : data.whereToBuyUrl,
										};
									},
									externalBtnKeys : [
										"wtbExternalLink"
									]
								},
								findTheDealer : {
									className : "find-a-dealer",
									linkOpt : function(data){
										return {
											"href" : "#",
											"data-keyword-search-url" : data.findTheDealerUrl,
										};
									}
								},
								inquiryToBuy : {
									className : "inquiry-to-buy",
									linkOpt : function(data){
										return {
											"href" : "#",
											"data-keyword-search-url" : data.inquiryToBuyUrl,
										};
									}
								// 20200423 START 이상현 - gnb search ui 변경 
								},
								software : {
									className : "software",
									linkOpt : function(data){
										return {
											"href" : "#",
											"data-keyword-search-url" : data.softwareLinkUrl,
										};
									}
								},
								manual : {
									className : "manual",
									linkOpt : function(data){
										return {
											"href" : "#",
											"data-keyword-search-url" : data.manualLinkUrl,
										};
									}
								},
								// 20200423 END
								//LGEGMC-2202 START
								whereToBuyExt : {
									className : "in-buynow",
									externalOpt : function(data){
										if(data.wtbExternalLinkSelfFlag === "Y"){
											return {
												"href" : "#",
												"data-keyword-search-url" : data.wtbExternalLinkUrl,
												"data-link-name" : "buy_now",
											};
										}else{
											return {
												"href" : "#",
												"data-keyword-search-url" : data.wtbExternalLinkUrl,
												"target" : "_blank",
												"title" : data.btnNewLinkTitle,
												"data-link-name" : "buy_now",
											};
										}
									},
									externalBtnKeys : [
										"wtbExternalLink"
									]
								}
								//LGEGMC-2202 END
							};
							var keyArray = Object.keys(btnAttributes);
							var ButtonConstructor = function Button(name, parent_node){
								this.obj = btnAttributes[name];
								Button.prototype.parent = parent_node;
								Button.prototype.pushData = function(attributes, text){
									var $elem = $(Button.prototype.parent).find("." + this.obj.className);
									$elem.attr(attributes);
									if(text === null || typeof(text) === "string"){
										$elem.text(text);
									}
									return false;
								};
							};
							// push json data to temeplete
							if(productDataLength > 6){
								productDataLength = 6;
							}
							for(var i=0; i<productDataLength; i++){
								var data = productDataSets[i];
								exposeItem = p.searchResults.templetes.matchProduct
											.replace(/\*imageAltText\*/g, (data.imageAltText != null) ? data.imageAltText : '')
											.replace(/\*mediumImageAddr\*/g, data.mediumImageAddr)
											.replace(/\*modelId\*/g, data.modelId)
											.replace(/\*modelUrlPath\*/g, data.modelUrlPath)
											.replace(/\*modelName\*/g, data.modelName)
											// 20200325 START 박지영 - ufn 따옴표 처리
											// 20200512 START 박지영 - ufn null 처리
											.replace(/\*userFriendlyName\*/g, data.userFriendlyName == null ? '' : data.userFriendlyName.replace(/\"/g, "''"))
											// 20200512 END
											// 20200325 END
											.replace(/\*whereToBuyFlag\*/g, wtbBtnFlagCheck(data))
											.replace(/\*findTheDealerFlag\*/g, data.findTheDealerFlag)
											.replace(/\*inquiryToBuyFlag\*/g, data.inquiryToBuyFlag)
											.replace(/\*addToCartFlag\*/g, cartBtnFlagCheck(data))
											// 20200423 START 이상현 - gnb search ui 변경
											.replace(/\*softwareLinkFlag\*/g, softwareFlagCheck(data))
											.replace(/\*manualLinkFlag\*/g, manualFlagCheck(data))
											// 20200423 END
											.replace(/\*salesModelCode\*/g, data.salesModelCode)
											.replace(/\*salesSuffixCode\*/g, data.salesSuffixCode)
											.replace(/\*modelYear\*/g, data.modelYear) /* LGEGMC-1279 : 2021.03.12 add */
											.replace(/\*buName1\*/g, data.buName1)
											.replace(/\*buName2\*/g, data.buName2)
											.replace(/\*buName3\*/g, nvl(data.buName3,''))
											.replace(/\*superCategoryName\*/g, data.superCategoryName)
											.replace(/\*bizType\*/g, data.bizType)
											.replace(/\*priceValue\*/g, (nvl(data.obsSellingPrice,'') || ''))
								            //LGEGMC-712 ADD
											//PJTOBSB2E-3 Start
											.replace(/\*obsPreOrderStartDate\*/g, data.obsPreOrderStartDate)
											.replace(/\*obsPreOrderEndDate\*/g, data.obsPreOrderEndDate)
											//PJTOBSB2E-3 End
											//LGEGMC-2202 START
											.replace(/\*wtbClass\*/g, wtbExterNalCheck(data))
											.replace(/\*msrp\*/g, nvl(data.msrp,'0'));
											//LGEGMC-2202 END
								// to element node
								var $exposeItem = $(exposeItem);
		
								// button attribute push
								var $btnArea = $exposeItem.find(".btn-area");
		
								var cart = new ButtonConstructor(keyArray[0], $btnArea);
								var WTBuy = new ButtonConstructor(keyArray[1], $btnArea);
								var dealer = new ButtonConstructor(keyArray[2], $btnArea);
								var ITBuy = new ButtonConstructor(keyArray[3], $btnArea);
								// 20200423 START 이상현 - gnb search ui 변경
								var software = new ButtonConstructor(keyArray[4], $btnArea);
								var manual = new ButtonConstructor(keyArray[5], $btnArea);
								// 20200423 END
								//LGEGMC-2202 START
								var wtbExt = new ButtonConstructor(keyArray[6], $btnArea);
								//LGEGMC-2202 START
								
								//LGEVN-80
								var obsBuynowFlag = $('#obsBuynowFlag').val();
								// add to cart
								// PJTOBSB2E-3 Start
								if(data.obsPreOrderInventoryDateFlag === 'Y' && data.obsPreOrderFlag === 'Y'){
									cart.pushData(cart.obj.preOrderOpt(data), productMsg.preOrderBtnNm);
								// PJTOBSB2E-3 End
								}else if(data.addToCartFlag !== "N"){
									// 통합 OBS
									if(data.addToCartFlag === 'Y'){
										if(obsBuynowFlag == 'Y'){
											cart.pushData(cart.obj.inBtnOpt(data), productMsg.buyNowBtnNm);
										}else{
											cart.pushData(cart.obj.btnOpt(data), productMsg.addToCartBtnNm);
										}
										// Standalone OBS
									}else if(data.addToCartFlag === 'S'){
										cart.pushData(cart.obj.btnOpt(data), productMsg.addToCartBtnNm);
									}else{
										// not work
									}
								}else if(data.bookOnlineFlag === "Y"){
									cart.pushData(
										cart.obj.localLinkOpt(data, cart.obj.externalBtnKeys[1]),
										productMsg[cart.obj.externalBtnKeys[1] + "BtnNm"]
									);
								}else if(data.buyNowFlag === "Y" || data.buyNowFlag === "L"){
									cart.pushData(
										cart.obj.localLinkOpt(data, cart.obj.externalBtnKeys[2]),
										productMsg[cart.obj.externalBtnKeys[2] + "BtnNm"]
									);
									// Local OBS
								// 20200506 START 박지영 - flag 명 변경
								}else if(data.resellerBtnFlag === "Y"){
								// 20200506 END
									cart.pushData(
										cart.obj.localLinkOpt(data, cart.obj.externalBtnKeys[3]),
										productMsg[cart.obj.externalBtnKeys[3] + "BtnNm"]
									);
								}else if(data.productSupportFlag === "Y"){
									cart.pushData(
										cart.obj.localLinkOpt(data, cart.obj.externalBtnKeys[4]),
										productMsg[cart.obj.externalBtnKeys[4] + "BtnNm"]
									);
								}else{
									// no work;
								}
		
								// Where to buy
								if(data.whereToBuyFlag=="Y" && data.whereToBuyFlag != null && data.whereToBuyFlag != ''){
									WTBuy.pushData(WTBuy.obj.pdpOpt(data), productMsg.whereToBuyBtnNm);
								// 20200413 START 박지영 - gnb search layer 의 wtb 버튼 스크립트 수정
								}else if(data.wtbExternalLinkUseFlag=="Y" && data.wtbExternalLinkUrl != null && data.wtbExternalLinkUrl != '' && data.wtbExternalLinkName != null && data.wtbExternalLinkName != ''){
									//LGEGMC-2202 START
									$btnArea.find('a.in-buynow').removeAttr('data-sc-item');
									wtbExt.pushData(wtbExt.obj.externalOpt(data), data.wtbExternalLinkName);
									//LGEGMC-2202 END
								// 20200413 END
								}else{
									// no work;
								}
		
								// Find a dealer
								// dealer.pushData(dealer.obj.linkOpt(data), productMsg.findTheDealerBtnNm);
		
								// inquiry to buy
								ITBuy.pushData(ITBuy.obj.linkOpt(data), productMsg.inquiryToBuyBtnNm);
								// 20200423 START 이상현 - gnb search ui 변경
								// software
								software.pushData(software.obj.linkOpt(data), productMsg.softwareLinkBtnNm);
								// manual
								manual.pushData(manual.obj.linkOpt(data), productMsg.manualLinkBtnNm);
								// 20200423 END
								// restore HTMLString
								exposeItem = $exposeItem[0].outerHTML;
								resultList += exposeItem;
							}
							// finish off
							p.elements.$matchProductList.find(".list-wrap").html("<ul>" + resultList + "</ul>");
							p.elements.$matchProductList.find("[data-btn-flag='N']").remove();
							// 20200527 START 박지영 : adobe 코드 추가
//							p.elements.$matchProductList.find('ul li a.product-page-linker').off('click').on('click', function() {
//								adobeTrackEvent('gnb-search-product', {search_keyword : $('#useInputKeyword').val(), page_event : {predictive_search_click : true}});
//							});
							p.elements.$matchProductList.find('ul li a.product-page-linker').off('click').on('click', function(e) {
								e.preventDefault();
								adobeTrackEvent('gnb-search-product', {search_keyword : $('#useInputKeyword').val(), page_event : {predictive_search_click : true}});
								var keyword = $(this).find('.model-display-name').text();
								p.searchNavSetCookie(keyword);
								window.location.href = $(this).attr('href');
							});
							// 20200527 END
						};
						var categorizedResult = function(){
							for(var i=0; i<categoryLength; i++){
								var data = categories[i];
								var queryFactor = "?";
								if(data.resultPageUrl.indexOf("?") >= 0){
									queryFactor = "&";
								}
								category = p.searchResults.templetes.category
											.replace(/\*title\*/g, data.categoryName)
											.replace(/\*count\*/g, data.matchCount)
											.replace(/\*resultPageUrl\*/g, data.resultPageUrl + queryFactor + "search=" + searchValue)
											;
								categoryList += category;
							}
							// finish off
							p.elements.$categorizedList.html("<ul>" + categoryList + "</ul>");
						};
		
						p.elements.$secondaryView.addClass("active");
						p.elements.$similarMapping.removeClass("active");
						p.elements.$primaryView.removeClass("active");
						matchProductResult();
						categorizedResult();
						
						$('.search-window-wrap .add-to-cart[data-obs-pre-order-flag=Y]').addClass('pre-order'); // PJTOBSB2E-3 add

						// see all results
						p.elements.$seeAllResults.attr('href', seeAllResultsURL).find('.count').text(seeAllResultsLength);

					}else if(typingErrorCheck === "Y"){
						// similar mapping
						var similarWord = response.typingError.similar;
						var similarUrl = response.typingError.url;
		
						p.elements.$similarMapping.find(">a").attr('href', similarUrl);
						p.elements.$similarMapping.find(".suggestion").text(similarWord);
						p.elements.$primaryView.removeClass("active");
						p.elements.$secondaryView.removeClass("active");
						p.elements.$similarMapping.addClass("active");
					}else{
						p.elements.$secondaryView.removeClass("active");
						p.elements.$primaryView.addClass("active");
						p.elements.$similarMapping.removeClass("active");
						return false;
					}
				},
				call : function(){
					this.url = p.elements.$navSearchForm.data("ajax-url");
					// 20200423 START 이상현 - gnb search ui 변경
					this.param = xssfilter(p.elements.$navSearchForm.serialize());
					// 20200423 END
					$.ajax({
						type: 'post',
						url: this.url,
						dataType: this.type,
						data: xssfilter(this.param),
						xhrFields: {
							withCredentials: true
						},
						success: function (d) {
							p.searchResults.action(d);
						},
						error: function (request, status, error) {
							console.log("status: " + status);
							console.log("error: " + error);
						}
					});
					/*
					ajax.call(
						this.url,
						this.param,
						this.type,
						this.action
					);
					*/
				},
			};
			p.recommended = {
				rolling : {
					duration : 3000,
					act : function(){
						var $tg = p.elements.$rollingBelt;
						var currentItem = $tg.find(".hidden-keyword");
						var currentCopy = currentItem.clone().attr("class", "rolling-keyword");
						var roll = function (distance){
							$tg.append(currentCopy);
							setTimeout(function(){
								$tg.css({
									"transform" :  "translateY(" + -distance + "px)",
									"transition" : "transform 400ms ease"
								});
								currentItem.next().removeClass("highlight");
								currentItem.next().next().addClass("highlight");
								setTimeout(function(){
									$tg.css({
										"transform" :  "translateY(0)",
										"transition" : ""
									});
									currentItem.removeClass("hidden-keyword");
									currentItem.next().addClass("hidden-keyword");
									currentItem.remove();
								}, 400);
							}, p.recommended.rolling.duration);
						};
						// rolling
						if($tg.children().length > 1){
							var distance = parseInt( window.getComputedStyle(document.querySelector(".hidden-keyword"), null).getPropertyValue("height") );
							if(currentCopy.text() !== $tg.children().last().text()){
								roll(distance);
							}else{
								return;
							}
						}else{
							return;
						}
					},
					call : null,
				},
			};
			p.recentlySearched = {
				toggleBtn : function(){
					var $list = p.elements.$recentlyList;
					var listLength = p.elements.$recentlyList.find("ul").children().length;
					var $tgBtn = $list.find(".btn-clear");
					if(listLength > 0){
						$tgBtn.addClass("active");
					}else{
						$tgBtn.removeClass("active");
					}
				},
				append : function(){
					var recentList = getCookie(p.cookieName) ? getCookie(p.cookieName).split('|') : null;
					var tmpHTML='';
					if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
						if(recentList && recentList.length>0) {
							var num = recentList.length;
							if(num>4) num = 4;
							for(var i=0;i<num;i++) {
								tmpHTML += '<li><a href="#" data-keyword="true" data-internal-search="your_recent_searches">'+xssfilter(recentList[i])+'</a></li>'; //LGEGMC-1430
							}
							p.elements.$recentlyList.find("ul").addClass('active').html(tmpHTML).siblings('.no-history').removeClass('active');
						}
					} else {
						var headTxt = p.elements.$recentlyList.find('.head').clone();
						p.elements.$recentlyList.empty().append(headTxt).append('<div class="temp-area"></div>');
						ePrivacyCookies.view('load', 'small', p.elements.$recentlyList.find(".temp-area"));
					}
				}
			};
			p.mostSearched = {
				outflowChecker : function(){
					var $container = p.elements.$mostSearchedGroup;
					$container.find(".word-tag").each(function(idx, elem){
						var containerBottom = $container.offset().top + $container.height();
						var elemBottom = 0;
						$(elem).removeClass("cutoff");
						setTimeout(function(){
							elemBottom = $(elem).offset().top + $(elem).height();
							if( elemBottom >= containerBottom ){
								$(elem).addClass("cutoff");
							}
						}, 300);
					});
				}
			};
			p.view__preset = function(){
				var templetes = this.searchResults.templetes;
				templetes.matchProduct = $navSearchWindow.find("#searchProductListTemplate").clone().html();
				templetes.category = $navSearchWindow.find("#searchCategoryTemplate").clone().html();
				templetes.autoData = $navSearchWindow.find("#autoDataTemplate").clone().html(); //PJTSEARCH-1 add
				templetes.matchedData = $navSearchWindow.find("#matchedModelTemplate").clone().html(); //PJTSEARCH-1 add
				$navSearchWindow.find("template").remove();
			};
			p.view__active = function(){
				this.recentlySearched.append();
				this.recentlySearched.toggleBtn();
				this.mostSearched.outflowChecker();
				this.recommended.rolling.call = setInterval(p.recommended.rolling.act, p.recommended.rolling.duration);
				// 20200309 START 이상현 - 스크롤 바 제거
				// this.elements.$matchProductList.mCustomScrollbar('update');
				// 20200309 END
			};
			p.view__reset = function(){
				this.elements.$useInputKeyword.val("");
				this.elements.$searchInputField.removeClass("is-typing");
				this.elements.$primaryView.addClass("active");
				this.elements.$secondaryView.removeClass("active");
				this.elements.$similarMapping.removeClass("active");
			};
			p.floatingWindow = function(status){
				if(status){
					$navSearchWindow.addClass("active");
					$("body").addClass("band-scroll");
					var naviType = 'B2C';
					if($('.navigation').is('.b2b')) {
						naviType = 'B2B';
					}
					navigationSearchForm.type.value = naviType;
				}else{
					$navSearchWindow.removeClass("active");
					$("body").removeClass("band-scroll");
				}
			};
			// p.event__navSearchWindow_open = function(){
			// 	$nav.find('.for-desktop .right-btm .+ a, .for-mobile .nav-wrap .right .search a').off('touch click mousedown').on("click", function(e){
			// 		e.preventDefault();
			// 		p.floatingWindow(true);
			// 		p.view__active();
			// 		if(typeof scrollDesign == 'function') scrollDesign();
			// 	});
			// };
			p.event__navSearchWindow_close = function(){
				var closeAction = function(){
					p.floatingWindow(false);
					p.view__reset();
					clearInterval(p.recommended.rolling.call);
				};
				var keyBinder = function(event, keyValue){
					if(event.keyCode === keyValue){
						event.preventDefault();
						closeAction();
					}
				// 20200317 START 박지영 : 세미콜론 추가
				};
				// 20200317 END
				// default ui : close btn's click or focusout
				$navSearchWindow.find(".btn-close-search-window").on({
					"click" : function(e){
						e.preventDefault();
						closeAction();
					},
					"keydown" : function(e){
						if(e.shiftKey !== true){
							keyBinder(e, 9);
						}
					}
				});
				// key event
				$navSearchWindow.on("keydown.close_navSearch", function(e){
					keyBinder(e, 27);	// esc key close

					if( $(this).is(':focus') || $(this).find('#useInputKeyword').is(':focus') ){
						if(e.shiftKey === true){
							keyBinder(e, 9);
						}
					}
				});

				// $navSearchWindow.on("keydown.close_navSearch", function(e){
				// 	if( $navSearchWindow.is(':focus') || $navSearchWindow.find(".btn-close-search-window").is(':focus') ){
				// 		if(e.keyCode === 9){
				// 			$navSearchWindow.find("input[name=search]").focus();
				// 		}
				// 	}
				// 	if(e.keyCode === 27){
				// 		event.preventDefault();
				// 		closeAction();
				// 	}
				// });
			};
			p.event__inputField = function(){
				var _ = p.elements;
				_.$useInputKeyword.on({
					"input" : function(e){
						var searchWord = $.trim(e.target.value);
						if( searchWord.length > 0 ) {
							_.$primaryView.removeClass("active");
							_.$searchInputField.addClass("is-typing");
							p.searchResults.call();
						}else{
							_.$primaryView.addClass("active");
							_.$secondaryView.removeClass("active");
							_.$similarMapping.removeClass("active");
							_.$searchInputField.removeClass("is-typing");
							//PJTSEARCH-1 add
							_.$autoSearchArea.removeClass("active");
						}
					},
					// 20200309 START 이상현- console 제거
					// "focus" : function(){
					// 	console.log("have");
					// }
					// 20200309 END 
				});
			};
			p.event__clear = function(){
				// clear view
				this.elements.$searchInputField.find(".btn-clear-input").on("click", function(e){
					e.preventDefault();
					p.view__reset();
					p.recommended.rolling.call = setInterval(p.recommended.rolling.act, p.recommended.rolling.duration);
					//PJTSEARCH-1 add
					p.elements.$autoSearchArea.removeClass("active");
				});
				// clear recently searched
				this.elements.$recentlyList.find(".clear-recently-list").on("click", function(e){
					e.preventDefault();
					p.elements.$recentlyList.find("ul").empty().removeClass("active");
					p.elements.$recentlyList.find(".no-history").addClass("active");
					p.recentlySearched.toggleBtn();
					// cookie
					removeCookie(p.cookieName, true);
				});
			};
			p.event__resize = function(){
				// 20200309 START 이상현 - 스크롤 바 제거 
				// match product list - scroll bar
				// var scrollbarDisabled = function(e){
				// 	if(e.matches){
				// 		p.elements.$matchProductList.mCustomScrollbar('update');
				// 		p.elements.$matchProductList.mCustomScrollbar('disable', true);
				// 	}
				// }
				// var scrollbarAble = function(e){
				// 	if(e.matches){
				// 		p.elements.$matchProductList.mCustomScrollbar('update');
				// 	}
				// }
				// mql.minLg.addListener(scrollbarDisabled);
				// mql.md.addListener(scrollbarAble);
				// mql.maxSm.addListener(scrollbarDisabled);
				// 20200309 END 
				// most searched - check area size
				$(window).on("resize", function(){
					p.mostSearched.outflowChecker();
				});
			};
			p.event__submit = function(){
				//console.log(this.elements.$navSearchForm);
				this.elements.$navSearchForm.on('doSubmit', function(e) {
					e.preventDefault();
					// add searchTxt in cookie list
					var searchTxt = xssfilter($.trim(p.elements.$useInputKeyword.val()));
					if(searchTxt=='') return false;
					var recentCookieTxt = getCookie(p.cookieName);
					if (recentCookieTxt == undefined) recentCookieTxt = '';
					var recentCookieArr = recentCookieTxt.split('|');
					// Clear duplicate values on array
					var isDup = recentCookieArr.indexOf(searchTxt);
					if (isDup > -1) recentCookieArr.splice(isDup, 1);
					// If you have five search terms, delete the oldest one.
					if(recentCookieArr.length>=4) {
						recentCookieArr.pop();
					}
					// Add new value to the front of the array
					if (recentCookieTxt == 'undefined' || recentCookieTxt == '') recentCookieArr = [searchTxt];
					else recentCookieArr.unshift(searchTxt);
		
					// set Cookie
					if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
						setCookie(p.cookieName, recentCookieArr.join('|'), true);
					}
					
					//PJTSEARCH-1
					if($('.gang-success .success-seacrh-inner a div.model-display-name').length > 0){
						var linkUrl = $('.success-seacrh-inner a.product-page-linker').attr('data-keyword-search-url');
						var page = $('.success-seacrh-inner a.product-page-linker').attr('data-keyword-search');
						var target = $('.success-seacrh-inner a.product-page-linker').attr('target');
						if(typeof target == 'undefined' || target == ''){
							target = '_self';
						}
						
						aLinkPost(linkUrl, page, target);
						//window.location.href = $('.success-seacrh-inner a.product-page-linker').attr('href');
						return false;
					}
					if($('#searchByKeyword').attr('auto-url') != undefined && $('#searchByKeyword').attr('auto-url') != ''){
						var linkUrl = $('#searchByKeyword').attr('auto-url');
						var page = 'GNB_Search';
						var target = '_self';
						aLinkPost(linkUrl,page,target);
						//window.location.href = $('#searchByKeyword').attr('auto-url');
						return false;
					}
					//PJTSEARCH-1
					p.elements.$navSearchForm.submit();
				});
		
				this.elements.$btnSearchSubmit.on('click', function(e) {
					e.preventDefault();
					p.elements.$navSearchForm.trigger('doSubmit');
				});
			};
			p.event__submit_trigger = function(){
				$navSearchWindow.on("click", "[data-keyword=true]", function(e){
					e.preventDefault();
					var keyword = $(this).text();
					p.elements.$useInputKeyword.val(keyword);
					p.elements.$navSearchForm.trigger('doSubmit');
				});
			};
			//PJTSEARCH-1 START
			p.event_autoClick_trigger = function(){
				p.elements.$autoSearchList.on("click", function(e){
					e.preventDefault();
					var keyword = $(e.target).text();
					p.searchNavSetCookie(keyword);
					
					var linkUrl = $(e.target).attr('data-keyword-search-url');
					var page = $(e.target).attr('data-keyword-search');
					var target = $(e.target).attr('target');
					if(typeof target == 'undefined' || target == ''){
						target = '_self';
					}
					
					aLinkPost(linkUrl, page, target);
					//window.location.href = $(e.target).attr('href');
				});
			};
			p.event_matchModelClick_trigger = function(){
				p.elements.$matchedModelArea.find('.success-item a.product-page-linker').on("click", function(e){
					e.preventDefault();
					var keyword = $(this).find('.model-display-name').text();
					p.searchNavSetCookie(keyword);
					
					var linkUrl = $(this).attr('data-keyword-search-url');
					var page = $(this).attr('data-keyword-search');
					var target = $(this).attr('target');
					if(typeof target == 'undefined' || target == ''){
						target = '_self';
					}
					
					aLinkPost(linkUrl, page, target);
					//window.location.href = $(this).attr('href');
				});
			};
			p.searchNavSetCookie = function(text){
				if(text=='' || text == undefined) return false;
				var recentCookieTxt = getCookie(p.cookieName);
				
				if (recentCookieTxt == undefined) recentCookieTxt = '';
				var recentCookieArr = recentCookieTxt.split('|');
				
				// Clear duplicate values on array
				var isDup = recentCookieArr.indexOf(text);
				if (isDup > -1) recentCookieArr.splice(isDup, 1);
				// If you have five search terms, delete the oldest one.
				if(recentCookieArr.length>=4) {
					recentCookieArr.pop();
				}
				// Add new value to the front of the array
				if (recentCookieTxt == 'undefined' || recentCookieTxt == '') recentCookieArr = [text];
				else recentCookieArr.unshift(text);
				// set Cookie
				if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
					setCookie(p.cookieName, recentCookieArr.join('|'), true);
				}
			};
			//PJTSEARCH-1 END
			/*
			p.event = function(){
				this.event__navSearchWindow_open();
				this.event__navSearchWindow_close();
				this.event__inputField();
				this.event__clear();
				this.event__resize();
				this.event__submit();
				this.event__submit_trigger();
			};
			p.init = function(){
				this.elements.keeping();
				this.view__preset();
				this.event();
			};
			*/
		};
		navSearch();
		$nav.find('.for-desktop .right-btm .icons .search > a, .for-mobile .icons .search > a').off('touch click mousedown').on('click', function(e) {//LGEGMC-777 add
			e.preventDefault();
			// 20200326 START 박지영 gnb search layer에 role 추가
			$('#navigation_search').attr('role', 'dialog');
			// 20200326 END
			navSearch.prototype.searchContents.call();
			return false;
		});
	}
}());

// top btn
(function () {
	if (!document.querySelector('.floating-menu')) return false;

	var floatingMenu = function () {
		var $this = $(".floating-menu"),
			p = floatingMenu.prototype;

		p.init = function () {
			this.elements.$toTop.on("click", function (e) {
				e.preventDefault();
				$("html, body").stop().animate({
					scrollTop: 0
				}, 600);
			});
			$(window).on("scroll", function () {
				var scrollPos = $(window).scrollTop(),
					h = $('header.navigation').outerHeight();
				if (!$this.hasClass('call-yet') && (scrollPos <= h)) {
					$this.addClass("call-yet");
				} else if ($this.hasClass('call-yet') && (scrollPos > h)) {
					$this.removeClass("call-yet");
				}
			});
		};
		p.elements = {
			$toTop: $this.find(".back-to-top"),
			$chatbot: $this.find(".chatbot-linker")
		};
		p.init();
	};
	floatingMenu();
}());

// footer
(function ($) {
	// go to Select Your Region page
	$('.footer-box form.country-information>a').on('click', function(e) {
		e.preventDefault();
		$(this).closest('form').submit();
	});

	// toggle footer menu
	var appFooter = function () {
		var footerObj = $('.footer-main-contents');
		var footerTarget = footerObj.find('.visible-mobile');
		var footerDepth1 = footerTarget.find('.has-category');
		footerDepth1.on('click', function (e) {
			if ($(this).hasClass('on')) {
				return true;
			} else {
				$(this).addClass('on');
				$(this).next().slideDown(200);
				$(this).append('<a href="#" class="button-layer"></a>');
				layerButton();
				return false;
			}
		});
		footerObj.find('.footer-bottom .bottom-links .links-right').each(function() {
			if($(this).find('> a').length>0) {
				$(this).closest('.footer-bottom').addClass('banner-count'+$(this).find('> a').length);
			}
		
		});
	};
	var layerButton = function () {
		$('.button-layer').off("click").on('click', function () {
			$(this).parent().removeClass('on');
			$(this).parent().next().slideUp(200);
			$(this).off("click").remove();
			return false;
		});
	};
	appFooter();

})(jQuery);

// Share
(function ($) {
	if (!document.querySelector('.share-common') && !document.getElementById('modal_help_library')) return false;
	initShareCommon = function () {
		var shareObj = $('.share-common');
		var sharePrint = shareObj.find('.article-print');
		var shareEmail = shareObj.find('.article-email');
		var shareLink = shareObj.find('.article-link');
		var shareSms = shareObj.find('.article-sms');
		//share
		var shareFB = shareObj.find('.share-facebook');
		var shareTW = shareObj.find('.share-twitter');
		var sharePI = shareObj.find('.share-pinterest');
		var shareVK = shareObj.find('.share-vk');
		var shareOK = shareObj.find('.share-ok');
		var shareLI = shareObj.find('.share-linkedin');
		var shareWB = shareObj.find('.share-weibo');
		var shareWE = shareObj.find('.share-wechat');
		//question section
		var shareModal = $('#modal_resource_search_copylink');

		// for touch device
		if ('ontouchstart' in document.documentElement) {
			shareObj.find('.external-link.mobile-only').css('display', 'inline-block');
		}

		// for wechat
		if(shareWE.length>0) {
			if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_SOCIAL_MEDIA')) {
				window._bd_share_config = {
					"common": {
						bdSnsKey: {},
						bdText: $(".bdsharebuttonbox").data("text"),
						bdMiniList: !1,
						bdUrl: $(".bdsharebuttonbox").data("url"),
						bdPic: "",
						bdSize: "32"
					},
					"share": {}
				};
				with(document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = '/cn/baidumap/baiduShare-master/static/api/js/share.js?v=89860593.js'];
			}
		}

		$(document)
			.on("click", "[type=submit][form]", function (event) {
				event.preventDefault();
				var formId = $(this).attr("form"),
					$form = $("#" + formId).submit();
			})
			.on("keypress", "form input", function (event) {
				var $form;
				if (event.keyCode == 13) {
					$form = $(this).parents("form");
					if ($form.find("[type=submit]").length == 0 &&
						$("[type=submit][form=" + $(this).attr("form") + "]").length > 0) {
						$form.submit();
					}
				}
			});

		// adobe
		function adobeShare(obj, name) {
			// for PDP
			if ($('.GPC0009').length>0) {
				adobeTrackEvent('share-print', {
					products: [{sales_model_code : $('.GPC0009').data('adobe-salesmodelcode'), model_name: $('.GPC0009').data('adobe-modelname')}],
					social_service_name: name,
					page_event: {sns_share: true}
				});
			} else {
				adobeTrackEvent('sns-share', {social_service_name: name, page_event: {sns_share: true}});
			}
		}
		sharePrint.off('click').on('click', function (e) {
			e.preventDefault();
			adobeShare($(this), 'print');
			window.print();
		});
		shareEmail.off('click').on('click', function (e) {
			e.preventDefault();
			adobeShare($(this), 'email');
			var title = encodeURIComponent(document.title),
				hashCheck = new RegExp(/\#$/g);
			if(hashCheck.test(location.href)) {
				url = encodeURIComponent(location.href.replace(/\#$/g, ''));
			}else {
				url = encodeURIComponent(location.href);
			}

			if($(this).closest('.modal').length>0 && $(this).parent().find('.article-link').length>0) {
				// help library in modal (ex. symptoms)
				url = $(this).parent().find('.article-link').attr('data-url');
			}

			var mailto = 'mailto:?subject=' + title + '&body=' + url;
			location.href = mailto;
		});
		shareLink.off('click').on('click', function (e) {
			e.preventDefault();
			adobeShare($(this), 'link');
			//var ClipboardCopy = location.href;
			//url = $(this).data('url');
			url = this.dataset.copyUrl;
			Clipboard.copy(url);
			shareModal.find('.modal-url').text(url);
		});
		shareSms.off('click').on('click', function (e) {
			e.preventDefault();
			adobeShare($(this), 'sms');
		});
		shareFB.off('click').on('click', function (e) {
			e.preventDefault();
			adobeShare($(this), 'facebook');
			url = $(this).data('url');
			sendShareFb(url);
		});
		shareTW.off('click').on('click', function (e) {
			e.preventDefault();
			adobeShare($(this), 'twitter');
			url = $(this).data('url');
			title = $(this).data('title');
			via = $(this).data('via');

			// converting short Url script
			var shortUrl = e.currentTarget.getAttribute("data-short-url");
			if(shortUrl && shortUrl != null) {
				sendShareTw(shortUrl, title, via);
			}else {
				var ajaxData = $(this).closest(".sns-share").data();
				if(ajaxData.paramName) {
					var shortUrlParam = ajaxData.paramName+"="+url;
					var ajaxUrl = 'https://www.lg.com/common/shorturl/getShortUrl.lgajax';
					if(ajaxData.getUrl) {
						ajaxUrl = ajaxData.getUrl;
					}
					$.ajax({
						type: "GET",
						timeout: 5e4,
						url: ajaxUrl,
						data: shortUrlParam,
						dataType: "jsonp",
						jsonp: "callback",
						success: $.proxy(function(data) {
							sendShareTw(data.shortUrl, title, via);
							//console.log(data);
						}, this)
					});
				}else {
					sendShareTw(url, title, via);
				}
			}
		});
		sharePI.off('click').on('click', function (e) {
			e.preventDefault();
			adobeShare($(this), 'pinterest');
			url = $(this).data('url');
			title = $(this).data('title');
			image = $(this).data('image');
			sendSharePi(url, title, image);
		});
		shareVK.off('click').on('click', function (e) {
			e.preventDefault();
			adobeShare($(this), 'vk');
			url = $(this).data('url');
			title = $(this).data('title');
			sendShareVk(url, title);
		});
		shareOK.off('click').on('click', function (e) {
			e.preventDefault();
			adobeShare($(this), 'ok');
			url = $(this).data('url');
			sendShareOk(url);
		});
		shareLI.off('click').on('click', function (e) {
			e.preventDefault();
			adobeShare($(this), 'linkedin');
			url = $(this).data('url');
			sendShareLi(url);
		});
		shareObj.find('.share-linkdin').off('click').on('click', function (e) {
			e.preventDefault();
			adobeShare($(this), 'linkedin');
			url = $(this).data('url');
			sendShareLi(url);
		});
		shareWB.off('click').on('click', function (e) {
			e.preventDefault();
			adobeShare($(this), 'weibo');
			url = $(this).data('url');
			title = $(this).data('title');
			image = $(this).data('image');
			sendShareWb(url, title, image);
		});
		var nIntervId;
		shareWE.off('click').on('click', function (e) {
			// Only CN
			e.preventDefault();
			adobeShare($(this), 'wechat');

			if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_SOCIAL_MEDIA')) {
				url = $(this).data('url');
				text = $(this).data('text');
				$('body').trigger('ajaxLoadBefore');

				// 20200429 START 박지영 - JSLint 수정
				var loadDOM = function() {
					if ($('#bdshare_weixin_qrcode_dialog').length > 0) {
						clearInterval(nIntervId);
						newWindow(true);
					}
				};
				var newWindow = function(isFirst) {
					$('#bdshare_weixin_qrcode_dialog').find('.bd_weixin_popup_close').hide();
					if(isFirst) {
						$('#bdshare_weixin_qrcode_dialog').css({ 
							position : 'static',
							left : 0,
							top : 0,
							width: 'auto',
							height: 'auto'
						}).wrapAll('<div />');
					}
					var myWindow, htmlTag = '';
					if ('ontouchstart' in window) {
						myWindow = window.open('', '_blank');
						htmlTag += '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, minimal-ui">';
					} else {
						var popupX = (window.screen.width/2) - (300 / 2);
						var popupY= (window.screen.height/2) - (330 / 2);
						myWindow = window.open('', 'wechat', 'directories=no, menubar=no, status=no, location=no, toolbar=no, width=300, height=330, left='+popupX+', top='+popupY);
					}
					myWindow.document.getElementsByTagName('html')[0].innerHTML = '';

					htmlTag += '<title>Wechat</title>';
					htmlTag += '<link rel="stylesheet" type="text/css" href="http://bdimg.share.baidu.com/static/api/css/weixin_popup.css"></head>';
					htmlTag += $('#bdshare_weixin_qrcode_dialog').parent('div').html();

					myWindow.document.getElementsByTagName('html')[0].innerHTML = htmlTag;

					setTimeout(function() {
						$('#bdshare_weixin_qrcode_dialog').addClass('hide');
						$('body').trigger('ajaxLoadEnd');
					}, 300);
				};
				// 20200429 END
				if ($('#bdshare_weixin_qrcode_dialog').length == 0 && !nIntervId) {
					if(typeof window._bd_share_main == 'object') {
						nIntervId = setInterval(loadDOM, 1000);
					} else {
						console.log('Error : Failed to load share.js.');
						$('body').trigger('ajaxLoadEnd');
					}
				} else {
					newWindow(false);
				}
			} else {
				ePrivacyCookies.view('click');
			}
		});

		function openSns(url) {
			// 20200309 START 박지영 - sns share 레이어 띄울때 쿠키를 사용하지 않으므로 아래 내용 변경
			//if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_SOCIAL_MEDIA')) {
				// Cookie 사용 가능 시 실행할 스크립트
				var winObj;
				var popupX = (window.screen.width/2) - (600 / 2);
				var popupY= (window.screen.height/2) - (800 / 2);
				winObj = window.open(url, 'New Window', 'width=600, height=800,scrollbars=yes, left='+popupX+', top='+popupY);
				// 20200427 박지영 - SNS 팝업 띄우고 나면 레이어 닫기 
				// if($('.sns-area .list').length>0) $('.sns-area .list').removeClass('active'); //PJTPLP-10 SNS툴팁 유지
				// 20200427 END
			//} else {
				// Cookie 사용 불가
				// - click : 고정값
			//	ePrivacyCookies.view('click');
			//}
			// 20200309 END
		}

		function sendShareFb(url) {
			var shareurl = (url) ? url : document.location.href;
			url = "http://www.facebook.com/sharer/sharer.php?u=" + shareurl;
			openSns(url);
		}

		function sendShareTw(url, title, via) {
			var shareurl = (url) ? url : document.location.href;
			var text = (title) ? title : $("head title").text();
			var via2 = (via) ? via : 'LGUS';
			url = "https://twitter.com/intent/tweet?url=" + shareurl + "&text=" + encodeURIComponent(text) + "&via=" + via2;
			openSns(url);
		}

		function sendSharePi(url, title, image) {
			var shareurl = (url) ? url : document.location.href;
			var text = (title) ? title : $("head title").text();
			var img = (image) ? image : $("meta[property='og:image']").attr('content');
			url = "http://www.pinterest.com/pin/create/button/?url=" + encodeURIComponent(shareurl) + "&media=" + encodeURIComponent(img) + "&description=" + encodeURIComponent(text);
			openSns(url);
		}

		function sendShareVk(url, title) {
			var shareurl = (url) ? url : document.location.href;
			var text = (title) ? title : $("head title").text();
			url = "https://share.yandex.net/go.xml?service=vkontakte&url=" + shareurl + "&title=" + encodeURIComponent(text);
			openSns(url);
		}

		function sendShareOk(url) {
			var shareurl = (url) ? url : document.location.href;
			url = "https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=" + shareurl + '&feature=share';
			openSns(url);
		}

		function sendShareLi(url) {
			var shareurl = (url) ? url : document.location.href;
			url = "https://www.linkedin.com/shareArticle?url=" + shareurl;
			openSns(url);
		}

		function sendShareWb(url, title, image) {
			var shareurl = (url) ? url : document.location.href;
			var text = (title) ? title : $("head title").text();
			var img = (image) ? image : $("meta[property='og:image']").attr('content');
			url = 'http://service.weibo.com/share/share.php?title=' + text + '&url=' + shareurl + '&pic=' + img;
			openSns(url);
		}
		window.Clipboard = (function (window, document, navigator) {
			var textArea,
				copy;

			function isOS() {
				return navigator.userAgent.match(/ipad|iphone/i);
			}

			function createTextArea(text) {
				textArea = document.createElement('textArea');
				textArea.value = text;
				textArea.style.position = 'fixed';
				textArea.style.top = '0';
				textArea.style.left = '0';
				textArea.style.opacity = '0.0001';
				textArea.style.width = '100%';
				textArea.style.height = '100%';
				textArea.style.padding = '0';
				textArea.style.pointerEvents = "none";
				textArea.style.fontSize = '16px';


				document.body.appendChild(textArea);
			}

			function selectText() {
				var range,
					selection;

				if (isOS()) {
					range = document.createRange();
					range.selectNodeContents(textArea);
					selection = window.getSelection();
					selection.removeAllRanges();
					selection.addRange(range);
					textArea.setSelectionRange(0, 999999);
				} else {
					textArea.select();
				}
			}

			function copyToClipboard() {
				document.execCommand('copy');
				document.body.removeChild(textArea);
			}

			copy = function (text) {
				createTextArea(text);
				selectText();
				copyToClipboard();
			};
			return {
				copy: copy
			};
		})(window, document, navigator);

		//PLTPJP-4 개선으로 다르게 이벤트 처리 GPC0007::GPC0026
		if(shareObj.find('.sns-inner ul.sns-share').length>0 && !(shareObj.parents('.GPC0007').length > 0 || shareObj.parents('.GPC0026').length > 0 || shareObj.parents('.GPC0009').length > 0 || shareObj.parents('.GPC0132').length > 0 || shareObj.parents('.GPC0134').length > 0 || shareObj.parents('.GPC0142').length > 0)) {
			// for layer
			shareObj.find('.sns-inner ul.sns-share li:last-child a').on('blur', function() {
				$(this).closest('.list').removeClass('active');
			});
		}
		//PJTPLP-10 GILS GPC0009 SNS툴팁 유지하기 위해 위 소스 GPC0026 추가
	};
	initShareCommon();
})(jQuery);

// Script to run before and After Printing
(function () {
	// Script to run before printing
	var beforePrint = function () {
		// lazyload image
		if ($('img.lazyload').length > 0) {
			$('img.lazyload').each(function () {
				$(this).attr('src', $(this).data('src')).removeClass('lazyload').addClass('lazyloaded');
			});
		}
	};
	// Script to run after printing
	var afterPrint = function () {
		// alert('Functionality to run after printing');
	};
	if (window.matchMedia) {
		var mediaQueryList = window.matchMedia('print');
		mediaQueryList.addListener(function (mql) {
			if (mql.matches) {
				beforePrint();
			} else {
				afterPrint();
			}
		});
	}
	window.onbeforeprint = beforePrint;
	window.onafterprint = afterPrint;
}());

// ESC key control
(function () {
	$(document).keyup(function (e) {
		if (e.keyCode == 27) { // escape key maps to keycode `27`
			// Close GNB Layer
			$('.navigation .for-desktop ul.depth1 li>a, .navigation .for-desktop ul.depth2 li>a, .navigation .gnb-login, .navigation .gnb-search-layer, .navigation .for-mobile .menu .menu-wrap').removeClass('active');
			$('.navigation .for-mobile .menu').removeClass('open');
			// Close Search Layer
			$('.search-area .search-layer').removeClass('active');
			// Close Tooltip Layer
			$('.tooltip-area').removeAttr('style');
			// video layer
			$('.video-modal').remove();
		}
	});
}());

// HTML Open Error
function htmlOpenError(htmldowntime, htmlopentime) {
	if ($('#htmlOpenError').length > 0) {
		if (htmldowntime) $('#htmlOpenError .htmldowntime').html(xssfilter(htmldowntime));
		if (htmlopentime) $('#htmlOpenError .htmlopentime').html(xssfilter(htmlopentime));
		$('#htmlOpenError').modal();
	}
}

// pagination branch
var isMobile;
(function ($) {
	isMobile = $('header.navigation').is('.mobile-device');
	var $pagination = $('.pagination'),
		$expander = $('.expander');
	if ($pagination.length > 0 && $expander.length > 0) {
		// 20200429 START 박지영 - 768 미만에서만 expander 사용 (for iPad)
		if (isMobile && $(window).width()<768) {
			$pagination.hide();
			if($pagination.find('ul li').length>1) $expander.show();
		} else {
			$pagination.show();
			$expander.hide();
		}
		// 20200429 END
	}
})(jQuery);

// fbq function - where to buy button
(function ($) {
	var loadFbqJs = function(cookieCheck) {
		var run = function() {
			// Some pages require you to execute the fbq function when you click the where to buy button.
			if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_ADVERTISING')) {
				if(!USE_FBQ) {
					var url = $('.navigation').data('fbq-url');
					if(!!url && url!='') {
						/* 20201012 SSO domain 추가  */
						if(ISSSO){
							$.ajax({
								type:"post",
								url: url,
								param: {pageUrl: window.location.pathname},
								dataType: "json",
								xhrFields: {
									withCredentials: true
								},
								success: function(data) {

									if(data.data[0].homeUseCookieList !== undefined) {
										var clist = data.data[0].homeUseCookieList;
										addHomeCookie(clist);
									}
									
									// LGEITF-182 Start
									if(data.data[0].treasureDataFlag) {
										treasureDataFlag = data.data[0].treasureDataFlag;
									}
									// LGEITF-182 End
									
								},
								error: function(request,status,error) {
									console.log("status: "+status);
									console.log("error: "+error);
								}
							});
						} else {
							
							ajax.call(url, {pageUrl: window.location.pathname}, 'json', function (data) {
								if(data.data[0].pixelUrlFlag.pixelUrlFlag == 'Y') {
									USE_FBQ = true;
								} else {
									USE_FBQ = false;
								}
								/*LGEIS-10 20200327, LGEMS-12 20200423 add*/
								if(data.data[0].pixelUrlFlag.pixelUrlType !== '') {
									USE_NEW_FBQ = data.data[0].pixelUrlFlag.pixelUrlType;
								} else {
									USE_NEW_FBQ = '';
								}
								/*//LGEIS-10 20200327 , LGEMS-12 20200423 add*/
	
								// 20200611 START 박지영 - IE main 에서 path 추가된 쿠키 잘 안 읽히는 case 예외 처리 
								if(data.data[0].homeUseCookieList !== undefined) {
									var clist = data.data[0].homeUseCookieList;
									addHomeCookie(clist);
								}
								// 20200611 END
								
								// LGEITF-182 Start
								if(data.data[0].treasureDataFlag) {
									treasureDataFlag = data.data[0].treasureDataFlag;
								}
								// LGEITF-182 End
							});
						}	
					}
				}
			}
		};
		if(!cookieCheck) {
			// cookieCheck가 false이면 바로 실행
			run();
		} else {
			// cookieCheck가 true이면, eprivacy.js가 로드 된 후에 실행
			if(typeof ePrivacyCookies!='undefined') {
				run();
			} else {
				setTimeout(function() {
					loadFbqJs(true);
				}, 300);
			}
		}
	};
	if(!USE_FBQ) {
		if($('.cookie-banner').length>0) {
			var banner = $('.cookie-banner');
			if(banner.hasClass('agree-cookie') && banner.data('privacy-type')=='static') {
				// 암묵적이면서 Static인 경우 쿠키 막지 않음
				loadFbqJs(false);
			} else if (banner.hasClass('agree-cookie') && banner.data('privacy-type')=='strict') {
				// 암묵적이면서 Strict인 경우, eprivacy cookie setting 에 의해 막는 경우가 발생하기 때문에 체크를 위해 ePrivacyCookies가 존재 해야 함.
				if(typeof ePrivacyCookies=='undefined') {
					loadFbqJs(true);
				} else {
					loadFbqJs(false);
				}
			} else {
				// 쿠키 배너가 명시적인 경우는 e-privacy.js 의 controlCookieList 에서 가져온 json 내에 존재함.
			}
		} else {
			loadFbqJs(false);
		}
	}
})(jQuery);

// skip to contents
(function ($) {
	// init
	if($('#content').length == 0) {
		var $navWrap = $('.navigation').closest('.container-fluid');
		var $navWrap2 = $('.navigation').closest('.iw_component');
		if ($navWrap.siblings('.container-fluid').length > 0) {
			var $target = $navWrap.next().find('div').not('div[id]').eq(0);
			if($target.hasClass('add-filter')) $target = $target.next();
			$target.attr('id', 'content');
		} else if ($navWrap2.siblings('.iw_component').length > 0) {
			var $target2 = $navWrap2.next().find('div').not('div[id]').eq(0);
			if($target2.hasClass('add-filter')) $target2 = $target2.next();
			$target2.attr('id', 'content');
		} else {
			var $target3 = $('.navigation').next().find('div').not('div[id]').not('.breadcrumb').eq(0);
			$target3.attr('id', 'content');
		}
	}
	if($('#lgAccHelp').length == 0) {
		// 개발에서 web accessibility 페이지를 구분할 수 있는 방법이 없어서, 스크립트로 id 처리함.
		var link = $('a[href=\"https://'+document.domain+'/'+$('html').data('countrycode')+'/webaccessibility\"]').eq(0);
		link.attr('id', 'lgAccHelp');
	}
	// click
	var $obj = $('.skip_nav a');
	$obj.off('off').on('click', function (e) {
		if($(this).attr('href').indexOf('#') == -1) return true;
		e.preventDefault();
		if($(this).closest('.navigation').length>0) {
			// gnb
			$(this).closest('li').find('>a').removeClass('active');
		} else {
			// top
			var link = $(this).attr('href').split('#')[1];
			if ($('#'+link).length > 0) {
				//$('#'+link).eq(0).attr('tabindex', 0).focus();
				// $('#'+link).trigger('click');

				// LGECI-259 Start
				// if(link=='lgAccHelp') {
				// 	window.location.href = $('#lgAccHelp').attr('href');
				// } else {
				// LGECI-259 End
					$('#'+link).eq(0).attr('tabindex', 0).focus();
				// } // LGECI-259 
				/*
				if(link=='lgAccHelp' && $('.GPC0022.active').length>0) {
					$('.GPC0022.active').removeClass('showing');
				}
				*/
			// LGECI-259 Start
			}else if(link=='footer'){
				$('.footer-box').eq(0).attr('tabindex', 0).focus();
			// LGECI-259 End
			}
		}
	});
})(jQuery);

// page count
(function ($) {
	// usage
	// <div class="js-page-count" data-count-url="/data-ajax/mkt/pageCount.json" data-param="modelId=testmodelId"></div>
	var $el = $('.js-page-count');
	if ($el.length > 0) {
		$el.each(function () {
			var url = $(this).data('count-url');
			var param = $(this).data('param');
			if (url && param) {
				ajax.call(url, param, 'json', function (data) {
					// do nothing
				});
			}
		});
	}
})(jQuery);

// adobe (cs > psp page > download)
(function ($) {
	if($('.support-downloads').length>0) {
		$obj=$('.support-downloads .list>li .name a.link-text');
		$obj.on('click', function() {
			var fileName = "";
			if($(this).closest('li').hasClass('manuals')) {
				// cs > psp page > Manuals & Documents
				var $pobj = $('.support-product-area .text-block .model');
				var tempname = $pobj.text();
				if($pobj.find('.name').length>0) tempname = tempname.replace($pobj.find('.name').text(), '');
				fileName = changeTitleFormat($(this).closest('li').find('.type').text()) + ':' + changeTitleFormat(tempname) + ':' + changeTitleFormat($(this).text());
				adobeTrackEvent('cs-psp-download', {download_file_type : "manuals_documents", download_file_name: fileName, page_event : {cs_file_download : true}});
			} else if($(this).closest('li').hasClass('software')) {
				// cs > psp page >Software & Drivers
				var $pobj2 = $('.support-product-area .text-block .model');
				var tempname2 = $pobj2.text();
				if($pobj2.find('.name').length>0) tempname2 = tempname2.replace($pobj2.find('.name').text(), '');
				fileName = changeTitleFormat($(this).closest('li').find('.type').text()) + ':' + changeTitleFormat(tempname2) + ':' + changeTitleFormat($(this).text());
				adobeTrackEvent('cs-psp-download', {download_file_type : "software_drivers", download_file_name: fileName, page_event : {cs_file_download : true}});
			}
		});
	}
})(jQuery);

// adobe (cs > dispatch portal > sign out)
(function ($) {
	$('.user-info-wrap .extra-area a.btn-exception-outline-xs').click(function() {
		adobeTrackEvent('cs-dispatch-portal-signout', {page_event : {partner_sign_out : true}});
	});
})(jQuery);

// bv (apps, es, mx, dk, fi, no, se, br, au, cl) : JS 호출만으로 동작
// bv2 (display, for de, fr, uk, ca_en, ca_fr) : 아래 스크립트 실행 시켜 줘야 함
var bvContainerCount = 0;
var runBVStaticPLP = function($target) {
	//console.log('runBVStaticPLP');
	if(!$target) return false;
	var run = function($target) {
		//console.log('run bv...');
		$target.each(function() {
			if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
				var $obj = $(this);
				if($obj.find('.rating[data-modelid]').not('.loaded').length>0) {
					if(typeof $BV == 'object') {
						var sctxt = '';
						$obj.find('.rating[data-modelid]').not('.loaded').each(function() {
							// 20200406 START 박지영 - 버그 수정
							var pid = $(this).attr('data-modelid');
							var url = $(this).find('a').attr('href');//.replace('#reviews', '#pdp_review');
							if(sctxt == '') sctxt += "'" + pid + "':{url:'" + url + "'}";
							else sctxt += ",'" + pid + "':{url:'" + url + "'}";
							$(this).addClass('loaded').removeAttr('itemprop').removeAttr('itemscope').removeAttr('itemtype').attr('id', 'BVRRInlineRating-'+bvContainerCount+'-'+pid).empty();
							// 20200406 END
						});
						if(sctxt != '') {
							sctxt = "$BV.ui( 'rr', 'inline_ratings', {productIds : {" + sctxt + "}, containerPrefix:'BVRRInlineRating-"+bvContainerCount+"'});";
							new Function(sctxt)(); // jshint ignore:line
						}
						bvContainerCount++;
					}
				}
			}
		});
	};
	// 20200325 START 박지영 - BV2 JS 로딩 체크 수정
	var check = function($obj) {
		setTimeout(function() {
			if(typeof $BV == 'object') {
				run($obj);
			} else {
				check($obj);
			}
		}, 300);
	};
	if($('#bvScript').length>0) {
		if(typeof $BV == 'object') {
			run($target);
		} else {
			check($target);
		}
	}
	// 20200325 END
};

// chatbot Vieeye (for HU,BG,HR,RS) in some pages
(function () {
	if($('#chatbotVieeye').length>0) {
		var c = COUNTRY_CODE.toLowerCase();
		var run = function() {
			console.log('run VIECHATBOT');
			if(c=='hu') VIECHATBOT.start();
			else if (c=='bg') VIECHATBOT.start({host: 'https://bg.lgchatbot-bot.vieeye.hu', lang: 'bg'});
			// 20200309 START 박지영 - 챗봇 host 수정
			else if (c=='hr') VIECHATBOT.start({host: 'https://hr.lgchatbot-bot.vieeye.hu', lang: 'hr'});
			else if (c=='rs') VIECHATBOT.start({host: 'https://rs.lgchatbot-bot.vieeye.hu', lang: 'sr'});
			// 20200309 END
		};
		var check = function() {
			if(typeof VIECHATBOT != 'undefined' && typeof ePrivacyCookies!='undefined') {
				if(ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
					run();
				}
			} else {
				setTimeout(function() {
					check();
				}, 300);
			}
		};
		if($('.cookie-banner').length>0) {
			var banner = $('.cookie-banner');
			if(banner.hasClass('agree-cookie') && banner.data('privacy-type')=='static') {
				// 암묵적이면서 Static인 경우 쿠키 막지 않음
				run();
			} else {
				// eprivacy cookie setting 에 의해 막는 경우가 발생하기 때문에 체크를 위해 ePrivacyCookies가 존재 해야 함.
				check();
			}
		} else {
			run();
		}
	}
})();


// Shoppilot Guide (RU)
// https://aplaut.com/docs/developers/api-reference/app_js.html#%D0%B2%D0%B8%D0%B4%D0%B6%D0%B5%D1%82

// ru review (list)
// 20200429 JSLint 수정
var ruProductList = [];
// 20200429 END
var ruProductListIdx = 0;
var getProductsNameRU = function() {
	var $obj = $('.rating-ru-box');
	if($obj.length>0) {
		$obj.each(function() {
			// 20200408 START 박지영 : RU review - model name에 공백이 들어있는 경우 처리
			var product = $(this).find('span').attr('data-shoppilot') ? $(this).find('span').attr('data-shoppilot').replace(' ', '-').toLowerCase() : '';
			if(ruProductList.join(',').indexOf(product) == -1) {
				ruProductList[ruProductListIdx] = product;
				ruProductListIdx++;
			}
			// 20200408 END
		});
		return ruProductList;
	} else {
		return null;
	}
};
var renderListingInlineRatingsRU = function(product_ids) {
	var run = function() {
		if(product_ids != null) {
			if(typeof Shoppilot == 'object') {
				var MultiWidget = Shoppilot.require('multi_widget');
				var ProductWidget = Shoppilot.require('product_widget');
				var widgets = product_ids.map(function (product_id) {
					return new ProductWidget({
						name: 'listing-inline-rating',
						container: '.rating-ru-box span[data-shoppilot='+product_id+']',
						product_id: product_id
					});
				});
				MultiWidget.render(widgets);
			} else {
				setTimeout(function() {
					run();
				}, 500);
			}
		}
	};
	run();
};

//LGEGMC-712
function nvl(str, defaultStr){
	var check = str+"";
	var result = "";
	check = check.trim()
	if(check=="" || check==null || check == "null" || check=="undefined"){
		result = defaultStr;
	}else{
		result = check;
	}
	return result ;
}

(function($) {
	window._shoppilot = window._shoppilot || [];
	_shoppilot.push(['_addStyles', 'widgets']);
	// for pdp (ru)
	if($('.GPC0009').length>0 && $('#shoppilot-inline-rating-container').length>0) { 
		_shoppilot.push(['_setProductId', $('.GPC0009 .model-name').eq(0).text().toLowerCase()]);
		_shoppilot.push(['_addProductWidget', 'product-reviews', '#shoppilot-product-reviews-container']);
		_shoppilot.push(['_addProductWidget', 'inline-rating', '#shoppilot-inline-rating-container']);
		_shoppilot.push(['_addProductWidget', 'inline-rating', '#shoppilot-inline-rating-container2']);
	}
	// for List
	renderListingInlineRatingsRU(getProductsNameRU());
})(jQuery);


/* LGEGMC-234 20200526 add */ /* BTOBGLOBAL-79 20200602 modify */
$(function(){
	if ( $('.container-fluid:has(.navigation)').length && !$('main').length ) {
		$('.container-fluid:has(.navigation) ~ div, .container-fluid.iw_section:has(.navigation) ~ section').not(':has(.footer-box)').wrapAll('<main></main>');
	}
});
/* //LGEGMC-234 20200526 add */ /* //BTOBGLOBAL-79 20200602 modify */

/* LGEBR-75 20200604 add */
jQuery.cachedScript = function( url, options ) {
 
	// Allow user to set any option except for dataType, cache, and url
	options = $.extend( options || {}, {
	  dataType: "script",
	  cache: true,
	  url: url
	});
   
	// Use $.ajax() since it is more flexible than $.getScript
	// Return the jqXHR object so we can chain callbacks
	return jQuery.ajax( options );
};
/* //LGEBR-75 20200604 add */

/* LGECI-163 20200819 add */
var caenReg = /^\/ca_en\/(mobile|cell-phones|cell-phones\/lg-lmg900um2-illusion-sunset)$/;
var cafrReg = /^\/ca_fr\/(mobiles|telephones-mobiles|telephones-mobiles\/lg-lmg900um2-illusion-solaire)$/;
if(caenReg.test(location.pathname) || cafrReg.test(location.pathname)){
	$('head').prepend('<script async src="https://www.googletagmanager.com/gtag/js?id=DC-9878050"></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag("js", new Date());gtag("config", "DC-9878050");</script>');
}

/*LGECI-247 20201217 add*/
if (COUNTRY_CODE == 'ca_en' || COUNTRY_CODE == 'ca_fr') {
	var caSource = location.pathname;
	var caTarget = ["/ca_en/connected-at-home",
				   "/ca_en/washing-machines/lg-wm4500hba",
				   "/ca_fr/laveuses/lg-wm4500hba",
				   "/ca_en/refrigerators/lg-lrmvs3006s",
				   "/ca_fr/refrigerateurs/lg-lrmvs3006s",
				   "/ca_en/dryers/lg-dlex4500b",
				   "/ca_fr/secheuses/lg-dlex4500b",
				   "/ca_en/tvs/lg-OLED65CXPUA",
				   "/ca_fr/tvs/lg-OLED65CXPUA",
				   "/ca_en/wall-ovens-ranges/lg-LREL6325F",
				   "/ca_fr/cuisinieres/lg-LREL6325F",
				   "/ca_en/dishwashers/lg-LDT7808SS",
				   "/ca_fr/lave-vaisselle/lg-LDT7808SS"];
	for (var i=0; i<caTarget.length; i++) {
		if (caSource == caTarget[i]) {
			$('head').prepend('<script async src="https://www.googletagmanager.com/gtag/js?id=DC-9878050"></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag("js", new Date());gtag("config", "DC-9878050");</script>');
		}
	}
}
/*LGECI-247 20201217 add*/

emiPop = {
		callEmiPop: function(url, model, modelPrice) { //LGEGMC-1791
			$.ajax({
					type: 'post',
					url: url,
					dataType: 'html',
					data: xssfilter({modelId:model}),
					success: function (html) {
						$('body').trigger('ajaxLoadEnd');
						$('#modal_with_pay,#modal_with_pay_hu,#modal_afterpay').remove(); //LGEGMC-1791,LGEAU-378
						$('body').append(html);
						/*LGEGMC-1791*/
						if(COUNTRY_CODE=='hu'){
							var $obj = $('body').find('#acco-cetlemmel');
							if(modelPrice>=50000 && modelPrice<=2000000){
								if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')){
										$('body').find('#iframeCal').attr('src',$(html).find('#iframeCal').data('src')+'?modelPrice='+modelPrice);
								}else{
									ePrivacyCookies.view('load', 'small', $obj);
								}
							}else{
								$("#modal_with_pay_hu").find(".item-infomation li").eq(0).hide()
							}
						}
						$('#modal_with_pay,#modal_with_pay_hu,#modal_afterpay').modal(); //LGEAU-378
						/*LGEGMC-1791*/
						
						/* LGEGMC-2068 Start */
						if(emiPop.checkUserStatus() == "ie"){
							$('.emi-ie').show();
							$('.emi-non-ie').hide();
						}else{
							$('.emi-ie').hide();
							$('.emi-non-ie').show();
						}
						if(!!$('.iframe-wrap').length){
							$('.iframe-wrap').each(function(){
								if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')){
									$(this).find('[id*=iframeArea]').attr('src', $(this).find('[id*=iframeArea]').data('src'));
								}else{
									ePrivacyCookies.view('load', 'small', $(this));
								}
							});
						}
						/* LGEGMC-2068 End */
					},
					error: function (request, status, error) {
						$('body').trigger('ajaxLoadEnd');
						console.log("status: " + status);
						console.log("error: " + error);
					}
				});
		},
		init: function() {
			$('body').off('click.price-installment').on('click.price-installment','a.price-installment,a.afterpay-installment', function(e) {
				e.preventDefault();
				var url = $(this).data('emiPopupUrl'); //url admin code/message - > Configuration Code Management emi_popup_url
				var modelId = $(this).data('model-id');
				/*LGEGMC-1791*/
				var modelPrice = 0;
				if(COUNTRY_CODE=='hu'){
					modelPrice = ($(this).parents('.pdp-info').length >0)? $(this).parents('.pdp-info').find(".purchase-price .number").text().replace(",","").replace(/\s/gi, "") : $(this).parents('.products-info').find(".purchase-price .number").text().replace(",","").replace(/\s/gi, "");
				}
				/*//LGEGMC-1791*/

				// LGEGMC-2434 Start
				var modalType = $(this).attr('href');
				if(modalType=='#blank_calculator'){ 
					var groupCheck = $('.navigation').data('obsOriginGroup'),
						sku = $(this).data('calculatorSalesCode'),
						obsGroup = groupCheck ? groupCheck : '',
						url = $(this).data('calculatorUrl')+'?sku='+sku+'&customer_group='+obsGroup,
						isDesktop = $('.navigation .for-desktop').is(':visible');

						if(isDesktop){
							var popupX = (window.screen.width/2) - (710 / 2),
							popupY = (window.screen.height/2) - (640 / 2),
							popOption = 'width=710, height=640,scrollbars=yes, left='+popupX+', top='+popupY;
						}
						window.open(url, '_blank', popOption);
				}else{
					/*
					// adobe
					if($('.GPC0009').length>0) {
						var pid2 = $('.GPC0009').data('product-id');
						if(pid2 != modelId) {
							adobeTrackEvent('re-stock-alert', {
								products: [{
									sales_model_code : findSalesModel($(this)),  LGEGMC-455 20200722 modify 
									model_name: findModelName($(this))
								}], cross_sell_product :pid2, page_event: {re_stock_alert: true}
							});
						} else {
							adobeTrackEvent('re-stock-alert', {
								products: [{
									sales_model_code : findSalesModel($(this)),  LGEGMC-455 20200722 modify 
									model_name: findModelName($(this))
								}], page_event: {re_stock_alert: true}
							});
						}
					} else {
						adobeTrackEvent('re-stock-alert', {
							products: [{
								sales_model_code : findSalesModel($(this)),  LGEGMC-455 20200722 modify 
								model_name: findModelName($(this))
							}], page_event: {re_stock_alert: true}
						});
					}*/
					$('body').trigger('ajaxLoadBefore');
					emiPop.callEmiPop(url, modelId,modelPrice);  //LGEGMC-1791
				}
				// LGEGMC-2434 End
			});
		},
		/* LGEGMC-2068 Start */
		checkUserStatus : function(){
			//check browser
			var isie=(/msie/i).test(navigator.userAgent); //ie
			var isie6=(/msie 6/i).test(navigator.userAgent); //ie 6
			var isie7=(/msie 7/i).test(navigator.userAgent); //ie 7
			var isie8=(/msie 8/i).test(navigator.userAgent); //ie 8
			var isie9=(/msie 9/i).test(navigator.userAgent); //ie 9
			var isfirefox=(/firefox/i).test(navigator.userAgent); //firefox
			var isapple=(/applewebkit/i).test(navigator.userAgent); //safari,chrome
			var isopera=(/opera/i).test(navigator.userAgent); //opera
			var isios=(/(ipod|iphone|ipad)/i).test(navigator.userAgent);//ios
			var isipad=(/(ipad)/i).test(navigator.userAgent);//ipad
			var isandroid=(/android/i).test(navigator.userAgent);//android

			if(isie7 || isie8 || isie9){
				isie6=false;
			}
			if(isie9){
				isie=false;
			}

			var device;
			if( /*isapple || */ isios || isandroid){
				device = "Mobile";
			}else if (isipad){
				device = "Tablet";
			}else{
				device = "Pc";
			}

			//check browser
			var a = navigator.userAgent.toLowerCase();
			var b,v;
			if(a.indexOf("safari/") > -1) {
				b = "safari";
				var s = a.indexOf("version/");
				var l = a.indexOf(" ", s);
				v = a.substring(s+8, l);
			}
			if(a.indexOf("chrome/") > -1) {
				b = "chrome";
				var ver = /[ \/]([\w.]+)/.exec(a)||[];
				v = ver[1];
			}
			if(a.indexOf("firefox/") > -1) {
				b = "firefox";
				var ver = /(?:.*? rv:([\w.]+)|)/.exec(a)||[];
				v = ver[1];
			}
			if(a.indexOf("opera/") > -1) {
				b = "opera";
				var ver = /(?:.*version|)[ \/]([\w.]+)/.exec(a)||[];
				v = ver[1];
			}
			if((a.indexOf("msie") > -1) || (a.indexOf(".net") > -1)) {
				b = "ie";
				var ver = /(?:.*? rv:([\w.]+))?/.exec(a)||[];
				if(ver[1])
					v = ver[1];
				else{
					var s = a.indexOf("msie");
					var l = a.indexOf(".", s);
					v = a.substring(s+4, l);
				}
			}
			
			return b;
		}
		/* LGEGMC-2068 End */
	};
emiPop.init();
/*LGECI-247 20201217 add*/

/* LGEFR-254 : 20210329 add */
$(function(){
	$(document).ready(function(){
		//PJTMEMBERSHIP-1 추가/변경
		var $nav = $('.navigation');
		var bizType = ( $nav && $nav.hasClass('b2b') ) ? 'B2B' : 'B2C';
		var param = "bizType="+bizType+"&locationPath="+window.location.pathname;
		//PJTMEMBERSHIP-1 추가 끝
		var url = '/'+COUNTRY_CODE.toLowerCase()+'/mkt/ajax/retrieveGnbNoticeHtml';
		//PJTMEMBERSHIP-1 param 셋팅 (null -> param)
		ajax.call(url, param, 'json', function (data) {
			if(!data) return false;
			
			if(data.data[0].gnbNoticeHtml != undefined){
				$('header.navigation').after(data.data[0].gnbNoticeHtml);
				
				var gnbNotice = {
					$banner : $('.header-notice-popup'),
					$closeBtn : $('.header-notice-popup .btn-hide-section'),
					expiresDate : $('.header-notice-popup').data('expires') ? $('.header-notice-popup').data('expires'):  '12',
					cookieName : COUNTRY_CODE.toUpperCase()+'_gnbNoticeOpenFlag',
					init : function(){
						var self = this;
						self.initBanner();
						self.addEvent();					
					},
					initBanner : function(){
						var self = this;
						/* LGECZ-150 : 20210601 add */
						if(self.getCookie(self.cookieName) == 'true' || $('.navigation').eq(0).find('.logged .after-login').length>0){
						/*// LGECZ-150 : 20210601 add */
							self.$banner.removeClass('active');
						}else{
							self.$banner.addClass('active');
						}
					},
					addEvent : function(){
						var self = this;
						self.$closeBtn.on('click', function(e){
							e.preventDefault();
							if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
								self.setCookie(gnbNotice.cookieName, true);
								self.$banner.removeClass('active');
							}else{
								console.log('');
								ePrivacyCookies.view('click');
							}
						});
					},
					getCookie : function(name){
						if($.cookie(name)){
							return decodeURIComponent($.cookie(name))
						}else{
							$.cookie(name);
						}
					},
					setCookie : function(name, value){
						var lh = location.host;
						var mydomain = '.lg.com';
						if(lh.indexOf('lge.com')>=0){
							mydomain = '.lge.com';
						}else if(lh.indexOf('localhost') >= 0){
							mydomain = 'localhost';
						}
						var date = new Date();
						date.setTime(date.getTime() + (gnbNotice.expiresDate*60*60*1000)); // 12
						var domain = {
							path : '/',
							domain : mydomain,
							expires : date
						}
	
						$.cookie(name, encodeURIComponent(value), domain);
					}
				}
				gnbNotice.init();
			}
			
			//PJTMEMBERSHIP-1 (멤버십)
			if(data.data[0].gnbLineBannerNoticeHtml != undefined){
				if($('.gnb-bottom-banner').length == 0){
				$('header.navigation').after(data.data[0].gnbLineBannerNoticeHtml);
				var gnbLineBannerNotice = {
						$banner : $('.gnb-bottom-banner'),
						$closeBtn : $('.gnb-bottom-banner .close-bnr'),
						expiresDate : $('.gnb-bottom-banner').data('expires') ? $('.gnb-bottom-banner').data('expires'):  '12',
						cookieName : COUNTRY_CODE.toUpperCase()+'_gnbLineBannerNoticeOpenFlag',
						init : function(){
							var self = this;
							self.initBanner();
							self.addEvent();					
						},
						initBanner : function(){
							var self = this;
							if(self.getCookie(self.cookieName) == 'true'){
								self.$banner.hide();
							}else{
								self.$banner.show();
							}
						},
						addEvent : function(){
							var self = this;
							self.$closeBtn.on('click', function(e){
								e.preventDefault();
								if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
									self.setCookie(gnbLineBannerNotice.cookieName, true);
									self.$banner.hide();
								}else{
									console.log('');
									ePrivacyCookies.view('click');
								}
							});
						},
						getCookie : function(name){
							if($.cookie(name)){
								return decodeURIComponent($.cookie(name))
							}else{
								$.cookie(name);
							}
						},
						setCookie : function(name, value){
							var lh = location.host;
							var mydomain = '.lg.com';
							if(lh.indexOf('lge.com')>=0){
								mydomain = '.lge.com';
							}else if(lh.indexOf('localhost') >= 0){
								mydomain = 'localhost';
							}
							var date = new Date();
							date.setTime(date.getTime() + (gnbLineBannerNotice.expiresDate*60*60*1000)); // 12
							var domain = {
								path : '/',
								domain : mydomain,
								expires : date
							}
							$.cookie(name, encodeURIComponent(value), domain);
						}
					}
				gnbLineBannerNotice.init();
				}
			}
			//PJTMEMBERSHIP-1(멤버십)
			
			// LGEGMC-2020
			if(data.data[0].gnbStandardBannerTopHtml != undefined){
				if($('.gnb-notice-banner-wrap').length == 0){
					$('header.navigation').before(data.data[0].gnbStandardBannerTopHtml);
					
					var gnbStandardBannerTop = {
						$banner : $('.gnb-notice-banner-wrap'),
						$closeBtn : $('.gnb-notice-banner-wrap .btn-banner-close'),
						expiresDate : $('.gnb-notice-banner-wrap').data('expires') ? $('.gnb-notice-banner-wrap').data('expires'):  '12',
						cookieName : COUNTRY_CODE.toUpperCase()+'_gnbStandardBannerTopOpenFlag',
						init : function(){
							var self = this;
							self.initBanner();
							self.addEvent();
						},
						initBanner : function(){
							var self = this;
							if(self.getCookie(self.cookieName) == 'true'){
								self.$banner.hide();
							}else{
								self.$banner.show();
								if( $('.gnb-notice-banner-wrap').length > 0 ) {
									$("#eprivacyCookie").addClass("has-gnb-notice-banner");
									ePrivacyCookies.setCookieEuHeight();
								}
							}
						},
						addEvent : function(){
							var self = this;
							self.$closeBtn.on('click', function(e){
								e.preventDefault();
								if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
									self.setCookie(gnbStandardBannerTop.cookieName, true);
									self.$banner.hide();
								}else{
									console.log('');
									ePrivacyCookies.view('click');
								}
							});
						},
						getCookie : function(name){
							if($.cookie(name)){
								return decodeURIComponent($.cookie(name))
							}else{
								$.cookie(name);
							}
						},
						setCookie : function(name, value){
							var lh = location.host;
							var mydomain = '.lg.com';
							if(lh.indexOf('lge.com')>=0){
								mydomain = '.lge.com';
							}else if(lh.indexOf('localhost') >= 0){
								mydomain = 'localhost';
							}
							var date = new Date();
							date.setTime(date.getTime() + (gnbStandardBannerTop.expiresDate*60*60*1000)); // 12
							var domain = {
								path : '/',
								domain : mydomain,
								expires : date
							}
							
							$.cookie(name, encodeURIComponent(value), domain);
						}
					}
					gnbStandardBannerTop.init();
				}
			}
			
			if(data.data[0].gnbStandardBannerHtml != undefined){
				if($('.gnb-standard-banner-wrap').length == 0){
					$('header.navigation').after(data.data[0].gnbStandardBannerHtml);
					
					var gnbStandardBanner = {
						$banner : $('.gnb-standard-banner-wrap'),
						$closeBtn : $('.gnb-standard-banner-wrap .btn-banner-close'),
						expiresDate : $('.gnb-standard-banner-wrap').data('expires') ? $('.gnb-standard-banner-wrap').data('expires'):  '12',
						cookieName : COUNTRY_CODE.toUpperCase()+'_gnbStandardBannerOpenFlag',
						init : function(){
							var self = this;
							self.initBanner();
							self.addEvent();
						},
						initBanner : function(){
							var self = this;
							if(self.getCookie(self.cookieName) == 'true'){
								self.$banner.hide();
							}else{
								self.$banner.show();
							}
						},
						addEvent : function(){
							var self = this;
							self.$closeBtn.on('click', function(e){
								e.preventDefault();
								if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
									self.setCookie(gnbStandardBanner.cookieName, true);
									self.$banner.hide();
								}else{
									console.log('');
									ePrivacyCookies.view('click');
								}
							});
						},
						getCookie : function(name){
							if($.cookie(name)){
								return decodeURIComponent($.cookie(name))
							}else{
								$.cookie(name);
							}
						},
						setCookie : function(name, value){
							var lh = location.host;
							var mydomain = '.lg.com';
							if(lh.indexOf('lge.com')>=0){
								mydomain = '.lge.com';
							}else if(lh.indexOf('localhost') >= 0){
								mydomain = 'localhost';
							}
							var date = new Date();
							date.setTime(date.getTime() + (gnbStandardBanner.expiresDate*60*60*1000)); // 12
							var domain = {
								path : '/',
								domain : mydomain,
								expires : date
							}
							
							$.cookie(name, encodeURIComponent(value), domain);
						}
					}
					gnbStandardBanner.init();
				}
			}
			
			// Standard Banner Carousel Script
			if(document.querySelector('.standard-banner-box')) {
				var standardBannerTaget = $('.standard-banner-box .standard-banner-list.opt-fade');
				
				createStandardBanner( standardBannerTaget );
				
				function createStandardBanner( standardBanner ){
					var $standardBanner = $(standardBanner),
						$standardBannerBox = $standardBanner.closest('.standard-banner-box');
					$standardBanner.slick({
						infinite: true,
						fade: true,
						adaptiveHeight: true,
						// vertical: true,
						autoplay: true,
						touchMove: false,
						swipe: false,
						speed: 600,
						autoplaySpeed: 5000,
						appendArrows: $standardBanner.next('.carousel-btn-wrap'),
						prevArrow: carouselOptions.squarePrev, // common.js variable
						nextArrow: carouselOptions.squareNext // common.js variable
						// add custom pause btn
					});
					
					var currentSlide,
						slidesCount, 
						totalCount = $standardBannerBox.find('.banner-item:not(.slick-cloned)').length,
						sliderCounter = $standardBannerBox.find('.banner-count');
					
					if(totalCount>1){
						$(sliderCounter).text('1 / ' +totalCount);
					}
					
					var updateSliderCounter = function(slick, currentIndex) {
						currentSlide = slick.slickCurrentSlide() + 1;
						slidesCount = slick.slideCount;
						
						if(slidesCount>1){
							$(sliderCounter).text(currentSlide + ' / ' +slidesCount);
						}
					};
					
					$standardBanner.on('init', function(event, slick) {
						updateSliderCounter(slick);
					});
					
					$standardBanner.on('afterChange', function(event, slick, currentSlide) {
						updateSliderCounter(slick, currentSlide);
					});
					
					var $pausePosition = $standardBanner[0].slick.$prevArrow;
					$pausePosition.after('<button class="slick-pause type-square" aria-label="Pause" type="button">Pause</button>');
					$pausePosition.after('<button class="slick-play type-square" aria-label="Play" type="button">Play</button>');
					
					var $pause = $standardBannerBox.find('.slick-pause'),
						$play = $standardBannerBox.find('.slick-play');
					
					$standardBannerBox.find('.slick-pause').on({
						click: function(){
							if(!$standardBannerBox.hasClass('paused')) {
								$standardBanner.slick('slickPause');
								$standardBannerBox.addClass('paused');
								$play.focus();
							}
						}
					});
					$standardBannerBox.find('.slick-play').on({
						click: function(){
							if($standardBannerBox.hasClass('paused')) {
								$standardBanner.slick('slickPlay');
								$standardBannerBox.removeClass('paused');
								$pause.focus();
							}
						}
					});
				}
				$('.gnb-standard-banner-wrap .btn-banner-close').on({
					click: function(){
						$('.gnb-standard-banner-wrap').hide();
					}
				});
				$('.gnb-notice-banner-wrap .btn-banner-close').on({
					click: function(){
						$('.gnb-notice-banner-wrap').hide();
					}
				});
			}
			// LGEGMC-2020 End
			
		});
	});
});
/*// LGEFR-254 : 20210329 add */
$('body').on('click', '.find-a-dealer ,.inquiry-to-buy', function () {
	var modelYear = nvl($(this).attr('data-model-year'), '');
	var msrp = nvl($(this).attr('data-msrp'), '');
	if(msrp == '.' || msrp == '.00' || msrp == '0.0' || msrp == '0'){
		msrp = "";
	} 
	if($(this).closest('.GPC0011').length>0){
		if(modelYear == ''){
		modelYear = $('.js-compare').attr('data-model-year');	
		}
		var msrp = nvl($('.js-compare').attr('data-msrp'), '');
		if(msrp == '.' || msrp == '.00' || msrp == '0.0' || msrp == '0'){
			msrp = "";
		} 
	}
	var category = nvl($(this).attr('data-category-name'), '');
	var subCategory = nvl($(this).attr('data-sub-category-name'), '');
	var className = $(this).attr('class');
	var price = nvl($(this).attr('data-price'), '');
	if(price == '.' || price == '.00' || price == '0.0' || price == '0'){
		price = "";
	} 
	var eventName = '';
	if(className.indexOf('find-a-dealer')!=-1){
		eventName = 'find_dealer_click';
	} else{
		eventName = 'inquiry_to_buy_click';
	}
	dataLayer.push({
		'event'			: eventName,
		'superCategory'	: $(this).attr('data-super-category-name'),
		'category'		: category,
		'subcategory'	: subCategory,
		'modelYear'		: modelYear,
		'modelName'		: $(this).attr('data-model-name'),
		'modelCode'		: $(this).attr('data-model-id'),
		'salesModelCode': $(this).attr('data-model-salesmodelcode'),
		'sku'			: $(this).attr('data-sku'),
		'suffix'        : $(this).attr('data-model-suffixcode'),
		'bu'            : $(this).attr('data-bu'),
		'price'         : price,
		'currencyCode'  : $('.currency-code').val(),
		'dimension185'  : $('.navigation').attr('data-obs-group'),
		'metric4'       : msrp
	});
		console.log(eventName);
	});
/*// PJTGADL-2 : 20210412 add */
$('body').on('click', '.re-stock-alert', function () {
	var modelYear = nvl($(this).attr('data-model-year'), '');
	if (modelYear == '') {
		modelYear = $('.btn.re-stock-alert').attr('data-model-year');
	}
	var price = nvl($(this).attr('data-price'), '');
	if(price == '.' || price == '.00' || price == '0.0' || price == '0'){
		price = "";
	} 
	var msrp = nvl($(this).attr('data-msrp'), '');
	if(msrp == '.' || msrp == '.00' || msrp == '0.0' || msrp == '0'){
		msrp = "";
	} 
	dataLayer.push({
		'event'			: 'move_to_stock_request_click',
		'superCategory'	: $(this).attr('data-super-category-name'),
		'category'		: $(this).attr('data-category-name'),
		'subcategory'	: $(this).attr('data-sub-category-name'),
		'modelYear'		: modelYear,
		'modelName'		: $(this).attr('data-model-name'),
		'modelCode'		: $(this).attr('data-model-id'),
		'salesModelCode': $(this).attr('data-model-salesmodelcode'),
		'sku'			: $(this).attr('data-sku'),
		'suffix'        : $(this).attr('data-model-suffixcode'),
		'bu'            : $(this).attr('data-bu'),
		'price'         : price,
		'currencyCode'  : $('.currency-code').val(),
		'dimension185'  : $('.navigation').attr('data-obs-group'),
		'metric4'       : msrp
	});
	console.log('move_to_stock_request_click');
	});
	

/*// PJTGADL-2 : 20210331 add */
$('body').on('click', '.js-compare', function () {
	var modelYear = nvl($(this).attr('data-model-year'), '');
	var className = $(this).attr('class');
	var eventName = '';
	if(className.indexOf('added')!=-1){
		eventName = 'remove_to_compare_click';
	} else{
		eventName = 'add_to_compare_click';
	}
	var price = nvl($(this).attr('data-price'), '');
	if(price == '.' || price == '.00' || price == '0.0' || price == '0'){
		price = "";
	} 
	var msrp = nvl($(this).attr('data-msrp'), '');
	if(msrp == '.' || msrp == '.00' || msrp == '0.0' || msrp == '0'){
		msrp = "";
	} 
	dataLayer.push({
		'event'			: eventName,
		'superCategory'	: $(this).attr('data-super-category-name'),
		'category'		: $(this).attr('data-category-name'),
		'subcategory'	: $(this).attr('data-sub-category-name'),
		'modelYear'		: modelYear,
		'modelName'		: $(this).attr('data-model-name'),
		'modelCode'		: $(this).attr('data-model-id'),
		'salesModelCode': $(this).attr('data-model-salesmodelcode'),
		'sku'			: $(this).attr('data-sku'),
		'suffix'        : $(this).attr('data-model-suffixcode'),
		'bu'            : $(this).attr('data-bu'),
		'price'         : price,
		'currencyCode'  : $('.currency-code').val(),
		'dimension185'  : $('.navigation').attr('data-obs-group'),
		'metric4'       : msrp
	});
	console.log(eventName);
	});

$('body').on('click', '.remove', function () {
	var modelYear = nvl($(this).attr('data-model-year'), '');
	var price = nvl($(this).attr('data-price'), '');
	if(price == '.' || price == '.00' || price == '0.0' || price == '0'){
		price = "";
	} 
	var msrp = nvl($(this).attr('data-msrp'), '');
	if(msrp == '.' || msrp == '.00' || msrp == '0.0' || msrp == '0'){
		msrp = "";
	} 
	dataLayer.push({
		'event'			: 'remove_to_compare_click',
		'superCategory'	: $(this).attr('data-super-category-name'),
		'category'		: $(this).attr('data-category-name'),
		'subcategory'	: $(this).attr('data-sub-category-name'),
		'modelYear'		: modelYear,
		'modelName'		: $(this).attr('data-model-name'),
		'modelCode'		: $(this).attr('data-model-id'),
		'salesModelCode': $(this).attr('data-model-salesmodelcode'),
		'sku'			: $(this).attr('data-sku'),
		'suffix'        : $(this).attr('data-model-suffixcode'),
		'bu'            : $(this).attr('data-bu'),
		'price'         : price,
		'currencyCode'  : $('.currency-code').val(),
		'dimension185'  : $('.navigation').attr('data-obs-group'),
		'metric4'       : msrp
	});
	console.log('remove_to_compare_click');
	});

//LGEGMC-1430 start
/*
data-internal-search="direct_searches",
data-internal-search="your_recent_searches",
data-internal-search="most_searched"
*/
$('body').on('click', '[data-internal-search]', function () {
	var searchType = nvl($(this).attr('data-internal-search'), '');
	adobeTrackEvent('interanl-search', {
		sk_location: searchType,
		page_event: {interanl_search_click: true}
	});
});

/*
data-internal-tab-search="consumer_products",
data-internal-tab-search="business_products",
data-internal-tab-search="promotions",
data-internal-tab-search="discover",
data-internal-tab-search="support",
data-internal-tab-search="resources",
data-internal-tab-search="articles",
data-internal-tab-search="related_contents",
data-internal-tab-search="news_blogs",
data-internal-tab-search="resource_download"
*/
$('body').on('click', '[data-internal-tab-search]', function () {
	var tabType = nvl($(this).attr('data-internal-tab-search'), '');
	adobeTrackEvent('interanl-tab-search', {
		search_results_tab_name: tabType,
		page_event: {internal_search_result_tab_click: true}
	});
});
//LGEGMC-1430 end
/*// PJTGADL-2 : 20210416 add */
$('body').on('click', '.spec-menu ,.ico-file-pdf', function () {
	if($(this).closest('.GPC0013').length>0){
	var className = $(this).attr('class');
	var eventName = '';
	if(className.indexOf('spec-menu')!=-1){
		eventName = 'print_spec_click';
	} else{
		eventName = 'pdf_download_click';
	}
	var price = '';
	price = $('.js-compare').attr('data-price');
	if(price == '.' || price == '.00' || price == '0.0' || price == '0'){
		price = "";
	} 
	var msrp = nvl($('.js-compare').attr('data-msrp'), '');
	if(msrp == '.' || msrp == '.00' || msrp == '0.0' || msrp == '0'){
		msrp = "";
	} 
	var suffixCode = $('.js-compare').attr('data-model-suffixcode');
	var modelCode = $('.js-compare').attr('data-model-id');
	if(eventName=='pdf_download_click'){
		dataLayer.push({
			'event'			: eventName,
			'superCategory'	: _dl.page_name.super_category,
			'category'		: standardData.level2,
			'subcategory'	: standardData.level3,
			'modelYear'		: _dl.page_name.model_year,
			'modelName'		: _dl.products[0].model_name,
			'modelCode'		: modelCode,
			'salesModelCode': _dl.products[0].sales_model_code,
			'sku'			: _dl.page_name.sku,
			'suffix'        : suffixCode,
			'fileName'      : $(this).attr('data-original'),
			'fileType'      : 'Product Detail Sheet',
			'bu'            : standardData.level1,
			'price'         : price,
			'currencyCode'  : $('.currency-code').val(),
			'dimension185'  : $('.navigation').attr('data-obs-group'),
			'metric4'       : msrp
			
		});
	} else{
		dataLayer.push({
			'event'			: eventName,
			'superCategory'	: _dl.page_name.super_category,
			'category'		: standardData.level2,
			'subcategory'	: standardData.level3,
			'modelYear'		: _dl.page_name.model_year,
			'modelName'		: _dl.products[0].model_name,
			'modelCode'		: modelCode,
			'salesModelCode': _dl.products[0].sales_model_code,
			'sku'			: _dl.page_name.sku,
			'suffix'        : suffixCode,
			'bu'            : standardData.level1,
			'price'         : price,
			'currencyCode'  : $('.currency-code').val(),
			'dimension185'  : $('.navigation').attr('data-obs-group'),
			'metric4'       : msrp
		});
	}
	console.log(eventName);
	}
	});

$('body').on('click', '.fiche.type-product , .label.type-none, .link-text-uk , .link-text-eu', function () {
	var className = $(this).attr('class');
	var fileType = '';
	var modelYear  = '';
	if(className.indexOf('fiche type-product')!=-1){
		fileType = 'Product Sheet';
	} else{
		fileType = 'Energy Saving';
	}
	var price = '';
	if($(this).closest(".component").hasClass("GPC0058") || $(this).closest(".component").hasClass("GPC0082") || $(this).closest(".compare-wrap").hasClass("compare-wrap")){
		modelYear = nvl($(this).attr('data-model-year'), '');
		price = nvl($(this).attr('data-price'), '');
		if(price == '.' || price == '.00' || price == '0.0' || price == '0'){
			price = "";
		} 
		var msrp = nvl($(this).attr('data-msrp'), '');
		if(msrp == '.' || msrp == '.00' || msrp == '0.0' || msrp == '0'){
			msrp = "";
		} 
		dataLayer.push({
			'event'			: 'pdf_download_click',
			'superCategory'	: $(this).attr('data-super-category-name'),
			'category'		: $(this).attr('data-category-name'),
			'subcategory'	: $(this).attr('data-sub-category-name'),
			'modelYear'		: modelYear,
			'modelName'		: $(this).attr('data-model-name'),
			'modelCode'		: $(this).attr('data-model-id'),
			'salesModelCode': $(this).attr('data-model-salesmodelcode'),
			'sku'			: $(this).attr('data-sku'),
			'suffix'        : $(this).attr('data-model-suffixcode'),
			'fileName'      : $(this).attr('data-original'),
			'fileType'      : fileType,
			'bu'            : $(this).attr('data-bu'),
			'price'         : price,
			'currencyCode'  : $('.currency-code').val(),
			'dimension185'  : $('.navigation').attr('data-obs-group'),
			'metric4'       : msrp
		});
	} else if($(this).closest(".component").hasClass("GPC0009")){
		modelYear = nvl($(this).closest('.pdp-info').find('.js-compare').attr('data-model-year'), '');
		price = nvl($(this).closest('.pdp-info').find('.js-compare').attr('data-price'), '');
		if(price == '.' || price == '.00' || price == '0.0' || price == '0'){
			price = "";
		} 
		var msrp = nvl($(this).closest('.pdp-info').find('.js-compare').attr('data-msrp'), '');
		if(msrp == '.' || msrp == '.00' || msrp == '0.0' || msrp == '0'){
			msrp = "";
		} 
			dataLayer.push({
				'event'			: 'pdf_download_click',
				'superCategory'	: $(this).closest('.pdp-info').find('.js-compare').attr('data-super-category-name'),
				'category'		: $(this).closest('.pdp-info').find('.js-compare').attr('data-category-name'),
				'subcategory'	: $(this).closest('.pdp-info').find('.js-compare').attr('data-sub-category-name'),
				'modelYear'		: modelYear,
				'modelName'		: $(this).closest('.pdp-info').find('.js-compare').attr('data-model-name'),
				'modelCode'		: $(this).closest('.pdp-info').find('.js-compare').attr('data-model-id'),
				'salesModelCode': $(this).closest('.pdp-info').find('.js-compare').attr('data-model-salesmodelcode'),
				'sku'			: $(this).closest('.pdp-info').find('.js-compare').attr('data-sku'),
				'suffix'        : $(this).closest('.pdp-info').find('.js-compare').attr('data-model-suffixcode'),
				'fileName'      : $(this).closest('a').attr('data-original'),
				'fileType'      : fileType,
				'bu'            : $(this).closest('.pdp-info').find('.js-compare').attr('data-bu'),
				'price'         : price,
				'currencyCode'  : $('.currency-code').val(),
				'dimension185'  : $('.navigation').attr('data-obs-group'),
				'metric4'       : msrp
			});
		}  else if($(this).closest(".component").hasClass("GPC0011")){
		modelYear = nvl($(this).closest('a').attr('data-model-year'), '');
		price = nvl($(this).closest('a').attr('data-price'), '');
		if(price == '.' || price == '.00' || price == '0.0' || price == '0'){
			price = "";
		} 
		var msrp = nvl($(this).closest('a').attr('data-msrp'), '');
		if(msrp == '.' || msrp == '.00' || msrp == '0.0' || msrp == '0'){
			msrp = "";
		} 
			dataLayer.push({
				'event'			: 'pdf_download_click',
				'superCategory'	: $(this).closest('a').attr('data-super-category-name'),
				'category'		: $(this).closest('a').attr('data-category-name'),
				'subcategory'	: $(this).closest('a').attr('data-sub-category-name'),
				'modelYear'		: modelYear,
				'modelName'		: $(this).closest('a').attr('data-model-name'),
				'modelCode'		: $(this).closest('a').attr('data-model-id'),
				'salesModelCode': $(this).closest('a').attr('data-model-salesmodelcode'),
				'sku'			: $(this).closest('a').attr('data-sku'),
				'suffix'        : $(this).closest('a').attr('data-model-suffixcode'),
				'fileName'      : $(this).closest('a').attr('data-original'),
				'fileType'      : fileType,
				'bu'            : $(this).closest('a').attr('data-bu'),
				'price'         : price,
				'currencyCode'  : $('.currency-code').val(),
				'dimension185'  : $('.navigation').attr('data-obs-group'),
				'metric4'       : msrp
			});
		}  else{
			var price = (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-price') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-price') : $(this).closest('.item.js-model').find('.js-compare').attr('data-price');
			var msrp = (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-msrp') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-msrp') : $(this).closest('.item.js-model').find('.js-compare').attr('data-msrp');
			if(msrp == '.' || msrp == '.00' || msrp == '0.0' || msrp == '0'){
				msrp = "";
			} 
			if(price == '.' || price == '.00' || price == '0.0' || price == '0'){
				price = "";
			} 
			dataLayer.push({
				'event'			: 'pdf_download_click',
				'superCategory'	: (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-super-category-name') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-super-category-name') : $(this).closest('.item.js-model').find('.js-compare').attr('data-super-category-name'),
				'category'		: (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-category-name') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-category-name') : $(this).closest('.item.js-model').find('.js-compare').attr('data-category-name'),
				'subcategory'	: (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-sub-category-name') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-sub-category-name') : $(this).closest('.item.js-model').find('.js-compare').attr('data-sub-category-name'),
				'modelYear'		: (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-model-year') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-model-year') : $(this).closest('.item.js-model').find('.js-compare').attr('data-model-year'),
				'modelName'		: (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-model-name') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-model-name') : $(this).closest('.item.js-model').find('.js-compare').attr('data-model-name'),
				'modelCode'		: (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-model-id') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-model-id') : $(this).closest('.item.js-model').find('.js-compare').attr('data-model-id'),
				'salesModelCode': (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-model-salesmodelcode') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-model-salesmodelcode') : $(this).closest('.item.js-model').find('.js-compare').attr('data-model-salesmodelcode'),
				'sku'			: (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-sku') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-sku') : $(this).closest('.item.js-model').find('.js-compare').attr('data-sku'),
				'suffix'        : (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-model-suffixcode') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-model-suffixcode') : $(this).closest('.item.js-model').find('.js-compare').attr('data-model-suffixcode'),
				'fileName'      : $(this).closest('a').attr('data-original'),
				'fileType'      : fileType,
				'bu'            : (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-bu') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-bu') : $(this).closest('.item.js-model').find('.js-compare').attr('data-bu'),
				'price'         : price,
			    'currencyCode'  : $('.currency-code').val(),
			    'dimension185'  : $('.navigation').attr('data-obs-group'),
				'metric4'       : msrp
			});
		}
	console.log('pdf_download_click');
	});
/*// PJTGADL-2 : 20210429 add */
$('body').on('click', '.star-area,.write-a-review,.btn-popup-review', function () {
	var modelYear = nvl($(this).attr('data-model-year'), '');
	var className = $(this).attr('class');
	var eventName = '';
	var price = '';
	price = $(this).attr('data-price');
	if($(this).attr('data-price') == '.' || $(this).attr('data-price') == '.00' || $(this).attr('data-price') == '0.0' || $(this).attr('data-price') == '0'){
		price = "";
	} 
	var msrp = $(this).attr('data-msrp');
	if($(this).attr('data-msrp') == '.' || $(this).attr('data-msrp') == '.00' || $(this).attr('data-msrp') == '0.0' || $(this).attr('data-msrp') == '0'){
		msrp = "";
	} 
	if(className.indexOf('star-area')!=-1){
		eventName = 'move_to_review_click';
	} else{
		eventName = 'move_to_write_review_click';
	}
	if(eventName=='move_to_review_click'){
		dataLayer.push({
			'event'			: eventName,
			'superCategory'	: $(this).attr('data-super-category-name'),
			'category'		: $(this).attr('data-category-name'),
			'subcategory'	: $(this).attr('data-sub-category-name'),
			'modelYear'		: modelYear,
			'modelName'		: $(this).attr('data-model-name'),
			'modelCode'		: $(this).attr('data-model-id'),
			'salesModelCode': $(this).attr('data-model-salesmodelcode'),
			'sku'			: $(this).attr('data-sku'),
			'suffix'        : $(this).attr('data-model-suffixcode'),
			'bu'            : $(this).attr('data-bu'),
			'overallScore'  : $(this).attr('data-model-overallscore'),
			'reviewCnt'     : $(this).attr('data-model-reviewCnt'),
			'price'         : price,
			'currencyCode'  : $('.currency-code').val(),
			'dimension185'  : $('.navigation').attr('data-obs-group'),
			'metric4'       : msrp
		});
	} else{
		dataLayer.push({
			'event'			: eventName,
			'superCategory'	: $(this).attr('data-super-category-name'),
			'category'		: $(this).attr('data-category-name'),
			'subcategory'	: $(this).attr('data-sub-category-name'),
			'modelYear'		: modelYear,
			'modelName'		: $(this).attr('data-model-name'),
			'modelCode'		: $(this).attr('data-model-id'),
			'salesModelCode': $(this).attr('data-model-salesmodelcode'),
			'sku'			: $(this).attr('data-sku'),
			'suffix'        : $(this).attr('data-model-suffixcode'),
			'bu'            : $(this).attr('data-bu'),
			'price'         : price,
			'currencyCode'  : $('.currency-code').val(),
			'dimension185'  : $('.navigation').attr('data-obs-group'),
			'metric4'       : msrp
		});
	}
	console.log(eventName);
	});
	

//LGEGMC-1430 start
/*
data-internal-search="direct_searches",
data-internal-search="your_recent_searches",
data-internal-search="most_searched"
*/
$('body').on('click', '[data-internal-search]', function () {
	var searchType = nvl($(this).attr('data-internal-search'), '');
	adobeTrackEvent('interanl-search', {
		sk_location: searchType,
		page_event: {interanl_search_click: true}
	});
});

/*
data-internal-tab-search="consumer_products",
data-internal-tab-search="business_products",
data-internal-tab-search="promotions",
data-internal-tab-search="discover",
data-internal-tab-search="support",
data-internal-tab-search="resources",
data-internal-tab-search="articles",
data-internal-tab-search="related_contents",
data-internal-tab-search="news_blogs",
data-internal-tab-search="resource_download"
*/
$('body').on('click', '[data-internal-tab-search]', function () {
	var tabType = nvl($(this).attr('data-internal-tab-search'), '');
	adobeTrackEvent('interanl-tab-search', {
		search_results_tab_name: tabType,
		page_event: {internal_search_result_tab_click: true}
	});
});
//LGEGMC-1430 end

// LGEGMC-945 Start
/* 선택한 카테고리 정보에 따른 bu 정보를 가져와 adobe Tracking*/
function sendPostMessage(categoryId, categoryName, funcType){
	console.log('sendPostMessage() call');
	console.log('funcType : '+ funcType);
	if(funcType == 'change'){
		if(typeof standardData != 'undefined'){
			if(categoryId){
				var url = '/'+COUNTRY_CODE.toLowerCase()+'/mkt/ajax/retrieveCategoryBuInfo?bizType=B2B&categoryId='+categoryId;
				$.ajax({
					type:"post",
					url: url,
					dataType: "json",
					async: false,
					xhrFields: {
						withCredentials: true
					},
					success: function(data) {
						standardData.level1 = data.data[0].buName.buName1;
						standardData.level2 = data.data[0].buName.buName2;
						standardData.level3 = data.data[0].buName.buName3;
						
						var paramName = 'inquiry_to_buy_product_solution_select';
						var param = {};
						param.page_event={};
						
						param.level1 = (typeof standardData === "undefined") ? '' : standardData.level1;
						param.level2 = (typeof standardData === "undefined") ? '' : standardData.level2;
						param.level3 = (typeof standardData === "undefined") ? '' : standardData.level3;
						
						param[paramName] = categoryName;
						param.page_event[paramName] = true;
						adobeTrackEvent(paramName, param);
					},
					error: function(request,status,error) {
						console.log("status: "+status);
						console.log("error: "+error);
					}
				});
			}
		}
	}
}
// LGEGMC-945 End

/*// PJTGADL-2 : 20210525 add */
$('body').on('click', '.add-to-cart:not(.in-buynow)', function () { // LGEGMC-1841 add
	var preorderFlag = $(this).is('[data-obs-pre-order-start-date]');
	var _this = $(this);
	var eventName ='';
	var modelYear  = '';
	var price = '';
	price = $(this).attr('data-price');
	if(_this.closest('.GPC0011').length){
		_this = $('.GPC0009').find('.button a.add-to-cart');
	}
	if(_this.attr('data-price') == '.' || _this.attr('data-price') == '.00' || _this.attr('data-price') == '0.0' || _this.attr('data-price') == '0'){
		price = "";
	} 
	var msrpPrice = _this.attr('data-msrp');
	if(_this.attr('data-msrp') == '.' || _this.attr('data-msrp') == '.00' || _this.attr('data-msrp') == '0.0' || _this.attr('data-msrp') == '0'){
		msrpPrice = "";
	} 
	if(preorderFlag){
		eventName = 'pre_order_click';
	} else{
		eventName = 'add_to_cart_click';
	}
	if($(this).closest(".component").hasClass("GPC0058") || $(this).closest(".component").hasClass("GPC0082") || $(this).closest(".compare-wrap").hasClass("compare-wrap")){
		modelYear = nvl($(this).attr('data-model-year'), '');
		dataLayer.push({
			'event'			: eventName,
			'superCategory'	: $(this).attr('data-category-name'),
			'category'		: $(this).attr('data-buname-two'),
			'subcategory'	: $(this).attr('data-buname-three'),
			'modelYear'		: modelYear,
			'modelName'		: $(this).attr('data-sku'),
			'modelCode'		: $(this).attr('data-model-id'),
			'salesModelCode': $(this).attr('data-model-salesmodelcode'),
			'sku'			: $(this).attr('data-sku'),
			'suffix'        : $(this).attr('data-model-suffixcode'),
			'price'         : price,
			'currencyCode'  : $('.currency-code').val(),
			'bu'            : $(this).attr('data-buname-one'),
			'dimension185'  : $('.navigation').attr('data-obs-group'),
			'metric4'       : msrpPrice,
			'cart_btn'      : 'Y'
		});
		digitalDataLayer.push({
			'event'			: eventName,
			'superCategory'	: $(this).attr('data-category-name'),
			'category'		: $(this).attr('data-buname-two'),
			'subcategory'	: $(this).attr('data-buname-three'),
			'modelYear'		: modelYear,
			'modelName'		: $(this).attr('data-sku'),
			'modelCode'		: $(this).attr('data-model-id'),
			'salesModelCode': $(this).attr('data-model-salesmodelcode'),
			'sku'			: $(this).attr('data-sku'),
			'suffix'        : $(this).attr('data-model-suffixcode'),
			'price'         : price,
			'currencyCode'  : $('.currency-code').val(),
			'bu'            : $(this).attr('data-buname-one'),
			'dimension185'  : $('.navigation').attr('data-obs-group'),
			'metric4'       : msrpPrice,
			'cart_btn'      : 'Y'
		});
	} else if($(this).closest(".component").hasClass("GPC0009")){
		modelYear = nvl($(this).closest('.pdp-info').find('.js-compare').attr('data-model-year'), '');
			dataLayer.push({
				'event'			: eventName,
				'superCategory'	: $(this).closest('.pdp-info').find('.js-compare').attr('data-super-category-name'),
				'category'		: $(this).closest('.pdp-info').find('.js-compare').attr('data-category-name'),
				'subcategory'	: $(this).closest('.pdp-info').find('.js-compare').attr('data-sub-category-name'),
				'modelYear'		: modelYear,
				'modelName'		: $(this).closest('.pdp-info').find('.js-compare').attr('data-model-name'),
				'modelCode'		: $(this).closest('.pdp-info').find('.js-compare').attr('data-model-id'),
				'salesModelCode': $(this).closest('.pdp-info').find('.js-compare').attr('data-model-salesmodelcode'),
				'sku'			: $(this).closest('.pdp-info').find('.js-compare').attr('data-sku'),
				'suffix'        : $(this).closest('.pdp-info').find('.js-compare').attr('data-model-suffixcode'),
				'price'         : price,
				'currencyCode'  : $('.currency-code').val(),
				'bu'            : $(this).closest('.pdp-info').find('.js-compare').attr('data-bu'),
				'dimension185'  : $('.navigation').attr('data-obs-group'),
				'metric4'       : msrpPrice,
				'cart_btn'      : 'Y'
			});
			digitalDataLayer.push({
				'event'			: eventName,
				'superCategory'	: $(this).closest('.pdp-info').find('.js-compare').attr('data-super-category-name'),
				'category'		: $(this).closest('.pdp-info').find('.js-compare').attr('data-category-name'),
				'subcategory'	: $(this).closest('.pdp-info').find('.js-compare').attr('data-sub-category-name'),
				'modelYear'		: modelYear,
				'modelName'		: $(this).closest('.pdp-info').find('.js-compare').attr('data-model-name'),
				'modelCode'		: $(this).closest('.pdp-info').find('.js-compare').attr('data-model-id'),
				'salesModelCode': $(this).closest('.pdp-info').find('.js-compare').attr('data-model-salesmodelcode'),
				'sku'			: $(this).closest('.pdp-info').find('.js-compare').attr('data-sku'),
				'suffix'        : $(this).closest('.pdp-info').find('.js-compare').attr('data-model-suffixcode'),
				'price'         : price,
				'currencyCode'  : $('.currency-code').val(),
				'bu'            : $(this).closest('.pdp-info').find('.js-compare').attr('data-bu'),
				'dimension185'  : $('.navigation').attr('data-obs-group'),
				'metric4'       : msrpPrice,
				'cart_btn'      : 'Y'
			});
		}  else if($(this).closest(".component").hasClass("GPC0011")){
			var modelYear = nvl($(this).attr('data-model-year'), '');
			if (modelYear == '') {
				modelYear = $('.js-compare').attr('data-model-year');
			}
			dataLayer.push({
				'event'			: eventName,
				'superCategory'	: $(this).attr('data-category-name'),
				'category'		: $(this).attr('data-buname-two'),
				'subcategory'	: $(this).attr('data-buname-three'),
				'modelYear'		: modelYear,
				'modelName'		: $(this).attr('data-sku'),
				'modelCode'		: $(this).attr('data-model-id'),
				'salesModelCode': $(this).attr('data-model-salesmodelcode'),
				'sku'			: $(this).attr('data-sku'),
				'suffix'        : $(this).attr('data-model-suffixcode'),
				'price'         : price,
				'currencyCode'  : $('.currency-code').val(),
				'bu'            : $(this).attr('data-buname-one'),
				'dimension185'  : $('.navigation').attr('data-obs-group'),
				'metric4'       : msrpPrice,
				'cart_btn'      : 'Y'
			});
			digitalDataLayer.push({
				'event'			: eventName,
				'superCategory'	: $(this).attr('data-category-name'),
				'category'		: $(this).attr('data-buname-two'),
				'subcategory'	: $(this).attr('data-buname-three'),
				'modelYear'		: modelYear,
				'modelName'		: $(this).attr('data-sku'),
				'modelCode'		: $(this).attr('data-model-id'),
				'salesModelCode': $(this).attr('data-model-salesmodelcode'),
				'sku'			: $(this).attr('data-sku'),
				'suffix'        : $(this).attr('data-model-suffixcode'),
				'price'         : price,
				'currencyCode'  : $('.currency-code').val(),
				'bu'            : $(this).attr('data-buname-one'),
				'dimension185'  : $('.navigation').attr('data-obs-group'),
				'metric4'       : msrpPrice,
				'cart_btn'      : 'Y'
			});
		} else if($(this).closest(".component").hasClass("GPC0102")){
			var price = $('.GPC0009').find('.add-to-cart').attr('data-price');
			if( price == '.' || price == '.00' || price == '0.0' || price == '0'){
				price = "";
			} 
			var msrpPrice = $('.GPC0009').find('.add-to-cart').attr('data-msrp');
			if( msrpPrice == '.' || msrpPrice == '.00' || msrpPrice == '0.0' || msrpPrice == '0'){
				msrpPrice = "";
			} 
			dataLayer.push({
				'event'			: eventName,
				'superCategory'	: $('.GPC0009').find('.add-to-cart').attr('data-category-name'),
				'category'		: $('.GPC0009').find('.add-to-cart').attr('data-buname-two'),
				'subcategory'	: $('.GPC0009').find('.add-to-cart').attr('data-buname-three'),
				'modelYear'		: $('.GPC0009').find('.add-to-cart').attr('data-model-year'),
				'modelName'		: $('.GPC0009').find('.add-to-cart').attr('data-sku'),
				'modelCode'		: $('.GPC0009').find('.add-to-cart').attr('data-model-id'),
				'salesModelCode': $('.GPC0009').find('.add-to-cart').attr('data-model-salesmodelcode'),
				'sku'			: $('.GPC0009').find('.add-to-cart').attr('data-sku'),
				'suffix'        : $('.GPC0009').find('.add-to-cart').attr('data-model-suffixcode'),
				'price'         : price,
				'currencyCode'  : $('.currency-code').val(),
				'bu'            : $('.GPC0009').find('.add-to-cart'),
				'dimension185'  : $('.navigation').attr('data-obs-group'),
				'metric4'       : msrpPrice,
				'cart_btn'      : 'Y'
			});
			digitalDataLayer.push({
				'event'			: eventName,
				'superCategory'	: $('.GPC0009').find('.add-to-cart').attr('data-category-name'),
				'category'		: $('.GPC0009').find('.add-to-cart').attr('data-buname-two'),
				'subcategory'	: $('.GPC0009').find('.add-to-cart').attr('data-buname-three'),
				'modelYear'		: $('.GPC0009').find('.add-to-cart').attr('data-model-year'),
				'modelName'		: $('.GPC0009').find('.add-to-cart').attr('data-sku'),
				'modelCode'		: $('.GPC0009').find('.add-to-cart').attr('data-model-id'),
				'salesModelCode': $('.GPC0009').find('.add-to-cart').attr('data-model-salesmodelcode'),
				'sku'			: $('.GPC0009').find('.add-to-cart').attr('data-sku'),
				'suffix'        : $('.GPC0009').find('.add-to-cart').attr('data-model-suffixcode'),
				'price'         : price,
				'currencyCode'  : $('.currency-code').val(),
				'bu'            : $('.GPC0009').find('.add-to-cart'),
				'dimension185'  : $('.navigation').attr('data-obs-group'),
				'metric4'       : msrpPrice,
				'cart_btn'      : 'Y'
			});
			
		}  else if($('.match-product-list').length > 0){
			dataLayer.push({
				'event'			: eventName,
				'superCategory'	: $(this).attr('data-category-name'),
				'category'		: $(this).attr('data-buname-two'),
				'subcategory'	: $(this).attr('data-buname-three'),
				'modelYear'		: $(this).attr('data-model-year'),
				'modelName'		: $(this).attr('data-sku'),
				'modelCode'		: $(this).attr('data-model-id'),
				'salesModelCode': $(this).attr('data-model-salesmodelcode'),
				'sku'			: $(this).attr('data-sku'),
				'suffix'        : $(this).attr('data-model-suffixcode'),
				'price'         : price,
				'currencyCode'  : $('.currency-code').val(),
				'bu'            : $(this).attr('data-buname-one'),
				'dimension185'  : $('.navigation').attr('data-obs-group'),
				'metric4'       : msrpPrice,
				'cart_btn'      : 'Y'
			    });
			digitalDataLayer.push({
				'event'			: eventName,
				'superCategory'	: $(this).attr('data-category-name'),
				'category'		: $(this).attr('data-buname-two'),
				'subcategory'	: $(this).attr('data-buname-three'),
				'modelYear'		: $(this).attr('data-model-year'),
				'modelName'		: $(this).attr('data-sku'),
				'modelCode'		: $(this).attr('data-model-id'),
				'salesModelCode': $(this).attr('data-model-salesmodelcode'),
				'sku'			: $(this).attr('data-sku'),
				'suffix'        : $(this).attr('data-model-suffixcode'),
				'price'         : price,
				'currencyCode'  : $('.currency-code').val(),
				'bu'            : $(this).attr('data-buname-one'),
				'dimension185'  : $('.navigation').attr('data-obs-group'),
				'metric4'       : msrpPrice,
				'cart_btn'      : 'Y'
			    });
		
           }  else{
			dataLayer.push({
				'event'			: eventName,
				'superCategory'	: (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-super-category-name') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-super-category-name') : $(this).closest('.item.js-model').find('.js-compare').attr('data-super-category-name'),
				'category'		: (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-category-name') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-category-name') : $(this).closest('.item.js-model').find('.js-compare').attr('data-category-name'),
				'subcategory'	: (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-sub-category-name') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-sub-category-name') : $(this).closest('.item.js-model').find('.js-compare').attr('data-sub-category-name'),
				'modelYear'		: (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-model-year') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-model-year') : $(this).closest('.item.js-model').find('.js-compare').attr('data-model-year'),
				'modelName'		: (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-model-name') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-model-name') : $(this).closest('.item.js-model').find('.js-compare').attr('data-model-name'),
				'modelCode'		: (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-model-id') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-model-id') : $(this).closest('.item.js-model').find('.js-compare').attr('data-model-id'),
				'salesModelCode': (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-model-salesmodelcode') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-model-salesmodelcode') : $(this).closest('.item.js-model').find('.js-compare').attr('data-model-salesmodelcode'),
				'sku'			: (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-sku') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-sku') : $(this).closest('.item.js-model').find('.js-compare').attr('data-sku'),
				'suffix'        : (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-model-suffixcode') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-model-suffixcode') : $(this).closest('.item.js-model').find('.js-compare').attr('data-model-suffixcode'),
				'bu'            : (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-bu') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-bu') : $(this).closest('.item.js-model').find('.js-compare').attr('data-bu'),
				'price'         : price,
			    'currencyCode'  : $('.currency-code').val(),
			    'dimension185'  : $('.navigation').attr('data-obs-group'),
				'metric4'       : msrpPrice,
				'cart_btn'      : 'Y'
			});
			digitalDataLayer.push({
				'event'			: eventName,
				'superCategory'	: (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-super-category-name') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-super-category-name') : $(this).closest('.item.js-model').find('.js-compare').attr('data-super-category-name'),
				'category'		: (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-category-name') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-category-name') : $(this).closest('.item.js-model').find('.js-compare').attr('data-category-name'),
				'subcategory'	: (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-sub-category-name') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-sub-category-name') : $(this).closest('.item.js-model').find('.js-compare').attr('data-sub-category-name'),
				'modelYear'		: (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-model-year') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-model-year') : $(this).closest('.item.js-model').find('.js-compare').attr('data-model-year'),
				'modelName'		: (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-model-name') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-model-name') : $(this).closest('.item.js-model').find('.js-compare').attr('data-model-name'),
				'modelCode'		: (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-model-id') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-model-id') : $(this).closest('.item.js-model').find('.js-compare').attr('data-model-id'),
				'salesModelCode': (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-model-salesmodelcode') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-model-salesmodelcode') : $(this).closest('.item.js-model').find('.js-compare').attr('data-model-salesmodelcode'),
				'sku'			: (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-sku') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-sku') : $(this).closest('.item.js-model').find('.js-compare').attr('data-sku'),
				'suffix'        : (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-model-suffixcode') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-model-suffixcode') : $(this).closest('.item.js-model').find('.js-compare').attr('data-model-suffixcode'),
				'bu'            : (typeof $(this).closest('.item.js-model').find('.js-compare').attr('data-bu') == 'undefined') ? $(this).closest('.products-info').find('.js-compare').attr('data-bu') : $(this).closest('.item.js-model').find('.js-compare').attr('data-bu'),
				'price'         : price,
			    'currencyCode'  : $('.currency-code').val(),
			    'dimension185'  : $('.navigation').attr('data-obs-group'),
				'metric4'       : msrpPrice,
				'cart_btn'      : 'Y'
			});
		}
	console.log(eventName);
	});
$('body').on('click', '.product-enquiry', function () {
	var price = '';
	price = $('.js-compare').attr('data-price');
	if(price == '.' || price == '.00' || price == '0.0' || price == '0'){
		price = "";
	} 
	var msrp = nvl($('.js-compare').attr('data-msrp'), '');
	if(msrp == '.' || msrp == '.00' || msrp == '0.0' || msrp == '0'){
		msrp = "";
	} 
	var cartBtn = '';
	if($(this).parent('.button').find('.add-to-cart').length>0){
		cartBtn = 'Y'
	} else{
		cartBtn = 'N'
	}
	var suffixCode = $('.js-compare').attr('data-model-suffixcode');
	var modelCode = $('.js-compare').attr('data-model-id');
		dataLayer.push({
			'event'			: 'move_to_cs_enquiry',
			'superCategory'	: _dl.page_name.super_category,
			'category'		: standardData.level2,
			'subcategory'	: standardData.level3,
			'modelYear'		: _dl.page_name.model_year,
			'modelName'		: _dl.products[0].model_name,
			'modelCode'		: modelCode,
			'salesModelCode': _dl.products[0].sales_model_code,
			'sku'			: _dl.page_name.sku,
			'suffix'        : suffixCode,
			'bu'            : standardData.level1,
			'price'         : price,
			'currencyCode'  : $('.currency-code').val(),
			'dimension185'  : $('.navigation').attr('data-obs-group'),
			'metric4'       : msrp,
			'cart_btn'      : cartBtn
		});
		
	console.log('move_to_cs_enquiry');
	});

/*// PJTGADL-2 : 20210331 add */
$('body').on('click', '.add-to-compare, .remove-to-compare', function () {
	var modelYear = nvl($(this).attr('data-model-year'), '');
	var className = $(this).attr('class');
	var eventName = '';
	if(className.indexOf('add-to-compare')!=-1){
		eventName = 'add_to_compare_click';
	} else{
		eventName = 'remove_to_compare_click';
	}
	var price = nvl($(this).attr('data-price'), '');
	if(price == '.' || price == '.00' || price == '0.0' || price == '0'){
		price = "";
	} 
	var msrp = nvl($(this).attr('data-msrp'), '');
	if(msrp == '.' || msrp == '.00' || msrp == '0.0' || msrp == '0'){
		msrp = "";
	} 
	dataLayer.push({
		'event'			: eventName,
		'superCategory'	: $(this).attr('data-super-category-name'),
		'category'		: $(this).attr('data-category-name'),
		'subcategory'	: $(this).attr('data-sub-category-name'),
		'modelYear'		: modelYear,
		'modelName'		: $(this).attr('data-model-name'),
		'modelCode'		: $(this).attr('data-model-id'),
		'salesModelCode': $(this).attr('data-model-salesmodelcode'),
		'sku'			: $(this).attr('data-sku'),
		'suffix'        : $(this).attr('data-model-suffixcode'),
		'bu'            : $(this).attr('data-bu'),
		'price'         : price,
		'currencyCode'  : $('.currency-code').val(),
		'dimension185'  : $('.navigation').attr('data-obs-group'),
		'metric4'       : msrp
	});
	console.log(eventName);
	});
/*// PJTGADL-2 : 20210525 add */

//PJTSEARCH-1 start
$('body').on('click', '[data-keyword-search-url]', function () {
	var form = document.createElement('form');
	var param = new Array();
	var input = new Array();
	
	if($(this).hasClass('inquiry-to-buy') || $(this).hasClass('inquiry')){
		var url = $(this).attr('data-keyword-search-url');
		var page = $(this).attr('data-keyword-search');
		if(url.indexOf('?') == -1){
			url = url + '?srchFlag=Y&srchPage='+page;
		}else{
			url = url + '&srchFlag=Y&srchPage='+page;
		}
		
		window.location.href = url;
	}else{
		var url = $(this).attr('data-keyword-search-url');
		var page = $(this).attr('data-keyword-search');
		var target = $(this).attr('target');
		
		if(typeof target !== 'undefined' && target == '_blank'){
			form.target = '_blank';
		}
		
		form.action = url;
		form.method = 'post';
		
		param.push(['srchFlag','Y']);
		param.push(['srchPage', page])
		
		for(var i = 0; i < param.length; i++){
			input[i] = document.createElement('input');
			input[i].setAttribute('type','hidden');
			input[i].setAttribute('name',param[i][0]);
			input[i].setAttribute('value',param[i][1]);
			form.appendChild(input[i]);
		}
		document.body.appendChild(form);
		form.submit();
	}
	
});

function aLinkPost(url, page, target) {
	var form = document.createElement('form');
	var param = new Array();
	var input = new Array();
	var flag = 'Y';
	
	if(typeof url === "undefined" || url == ''){
		url = '';
		page = '';
		flag = '';
	}
	
	if(typeof target !== "undefined" || target != ''){
		if(target == '_blank'){
			form.action = '_blank';
		}
	}
	
	form.action = url;
	form.method = 'post';
	
	param.push(['srchFlag',flag]);
	param.push(['srchPage', page])
	
	for(var i = 0; i < param.length; i++){
		input[i] = document.createElement('input');
		input[i].setAttribute('type','hidden');
		input[i].setAttribute('name',param[i][0]);
		input[i].setAttribute('value',param[i][1]);
		form.appendChild(input[i]);
	}
	document.body.appendChild(form);
	form.submit();
}
//PJTSEARCH-1 end
