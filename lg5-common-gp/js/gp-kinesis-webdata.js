/* 
 *******************************************************************************
 * CSR No.        DATE              AUTHOR             DESCRIPTION
 *******************************************************************************
 *PJTREGULATION-1 2020/05/29        Chowhiwon         규제대응 프로젝트
 *******************************************************************************
 * 
 * */

 if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function () {
        document.removeEventListener("DOMContentLoaded", arguments.callee, false);
        kinesisPutWebData();
    }, false);
}

// Internet Explorer
else if (document.attachEvent) {
    document.attachEvent("onreadystatechange", function () {
        if (document.readyState === "complete") {
            document.detachEvent("onreadystatechange", arguments.callee);
            kinesisPutWebData();
        }
    });
} //DOM이 모두 로드 되었을 때 function domReady () { //처리할 내용 }

function kinesisPutWebData() {
	var classification = getClassificationCode();
    
	var checkLocale = document.getElementById('kinesislocale').value;
	var cookieLocale = getCookie('KINESIS_COOKIE_LOCALE');
	var dupFlag = 'N';

	var cookieArr = []; 
	if(cookieLocale != ''){
		cookieArr = cookieLocale.split(',');
	}
    
	if(cookieArr.length > 0){
        for(var i = 0; i < cookieArr.length; i++){
        	if(cookieArr[i] == checkLocale){
                dupFlag = 'Y';
        	}
        }

        if(dupFlag != 'Y'){
        	if(cookieArr.length == 0){
        		cookieLocale = checkLocale
        	}else{
        		cookieLocale += ',';
        	    cookieLocale += checkLocale;
        	}
        	kinesisSetCookie('KINESIS_COOKIE_LOCALE',cookieLocale);
        }
	}else{
		kinesisSetCookie('KINESIS_COOKIE_LOCALE',document.getElementById('kinesislocale').value);
	}
	
    var reqData = {
        origin: document.getElementById('kinesisorigin').value,
        locale: document.getElementById('kinesislocale').value,
        requestedUrl: window.location.href,
        requestedDomain : window.location.host,
        status: kinesisGetStatusCode(),
        cookies: kinesisGetCookie(),
        requestedDate: kinesisRequestedDate(),
        utcRequestedDate : kinesisUtcRequestedDate(),
        buCode: getBuCode(),
		superCategory:getSuperCategory(),
		category:getCategory(),
		micrositeFlag:isMicroSite(),
        referrer: document.referrer,
        cmpid: kinesisGetCampaignId(),
        classficationLevel1 : classification.level1,
        classficationLevel2 : classification.level2,
        classficationLevel3 : classification.level3,
        templateFlag: isTemplate() 
    };
    var reqDataString = JSON.stringify(reqData) + '\n';
    var kinesis = new AWS.Kinesis({region: 'ap-northeast-2', accessKeyId: 'AKIA3VZCBYUAU7UIMHR2', secretAccessKey: '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'});
    var params = {
        Data: reqDataString, 
        PartitionKey: 'Kine-LGCOM', 
        StreamName: 'KDS-LGE-LEGALCHK-PROD-WEBUSE' 
    };

    kinesis.putRecord(params, function(err, data) {
        console.log('put result');
        if (err) {
            // an error occurred
            console.log(err, err.stack);
        } else {
            // successful response
            console.log(data);
        }
    });
}

function kinesisRequestedDate() {
    var cd = new Date();
    var dateStr = cd.getFullYear();
    dateStr += '-' + ('0' + (cd.getMonth() + 1)).slice(-2);
    dateStr += '-' + ('0' + cd.getDate()).slice(-2);

    dateStr += ' ' + ('0' + cd.getHours()).slice(-2);
    dateStr += ':' + ('0' + cd.getMinutes()).slice(-2);
    dateStr += ':' + ('0' + cd.getSeconds()).slice(-2);
    dateStr += '.' + ('00' + cd.getMilliseconds()).slice(-3);

    return dateStr;
}

function kinesisUtcRequestedDate() {
	var cd = new Date();
    var dateStr = cd.getUTCFullYear();
    dateStr += '-' + ('0' + (cd.getUTCMonth() + 1)).slice(-2);
    dateStr += '-' + ('0' + cd.getUTCDate()).slice(-2);

    dateStr += ' ' + ('0' + cd.getUTCHours()).slice(-2);
    dateStr += ':' + ('0' + cd.getUTCMinutes()).slice(-2);
    dateStr += ':' + ('0' + cd.getUTCSeconds()).slice(-2);
    dateStr += '.' + ('00' + cd.getUTCMilliseconds()).slice(-3);

    return dateStr;
}

function getBuCode(){
	var serviceType = '';
	var pageType = '';
	var buCode = '';
	
	if(typeof standardData != 'undefined'){
		serviceType = standardData.siteType.toLowerCase();
		pageType = standardData.pageType.toLowerCase();
	}else{
		serviceType = window.location.href.split('/')[4].toLowerCase();
		pageType = _dl.page_name.page_purpose.toLowerCase();
	}
	
	if(typeof _dl.page_name.bu != 'undefined' && _dl.page_name.bu != ''){
		if(pageType == 'compare'){
			buCode = 'compare';
		}else{
			buCode = _dl.page_name.bu;
		}
	}else{
		if('b2b' == serviceType ){
			buCode = serviceType;
		}else if('cs' == pageType){
			buCode = 'support';
		}else if('home' == pageType){
			buCode = 'home';
		}else if('compare' == pageType){
			buCode = 'compare';
		}else{
			buCode = '';
		}
	}
	
	return buCode.toUpperCase();
}

function getSuperCategory(){
	var superCategory = _dl.page_name.super_category;
	if(null==superCategory||'' ==superCategory){
		superCategory = '';
	}
	return superCategory.toUpperCase();
}

function getCategory(){
	var category = _dl.page_name.category;
	if(null==category||'' ==category){
		category = '';
	}
	return category.toUpperCase();
}

function getClassificationCode(){
	var classificationCode = [];
	
	if(typeof standardData != 'undefined'){
		classificationCode.level1 = standardData.level1;
		classificationCode.level2 = standardData.level2;
		classificationCode.level3 = standardData.level3;
	}else{
		classificationCode.level1 = '';
		classificationCode.level2 = '';
		classificationCode.level3 = '';
	}
	
	return classificationCode;
}

function isMicroSite(){
	var pagePurpose = _dl.page_name.page_purpose;
	if(null==pagePurpose||'' ==pagePurpose){
		isMicroSite = 'N';
	}else{
		if('microsite'==pagePurpose){
			isMicroSite = 'Y';
		}else{
			isMicroSite = 'N';
		}	
	}
	return isMicroSite;
}

function isTemplate(){
	isTemplate = 'N';
	
	if($('body').find('.iw_placeholder').length > 0){
		isTemplate = 'Y';
	}
	
	return isTemplate;
}

function kinesisGetCookie(){
	var cookie = {};
	var cookieArray = document.cookie.split(";");
	var cookies = new StringBuffer();
	for(var i = 0; i < cookieArray.length; i++){
		var cookieTmp = cookieArray[i].split("=");
		var cKey = cookieTmp[0].trim();
		var cValue = cookieTmp[1].trim();
		var filter = /LGCOM_IMPROVEMENTS|LGCOM_SOCIAL_MEDIA|LGCOM_ANALYSIS_OF_SITE|LGCOM_ADVERTISING|eCookieOpenFlag|KINESIS_COOKIE_LOCALE/;
		if(filter.test(cookieTmp[0]) == true){
			cookies.append(cKey + "=" + cValue + "; ");
			if(i == cookieArray.length -1){
				cookies.append(cKey + "=" + cValue);
			}
		}else{
			cookies.append(cKey + "; ");
			if(i == cookieArray.length -1){
				cookies.append(cKey);
			}
		}
	}
	return cookies.toString();
}

function kinesisSetCookie(name, value) {
	var lh = location.host;
	var mydomain = '.lg.com';
	if(lh.indexOf('lge.com')>=0) {
		mydomain = '.lge.com';
	} else if(lh.indexOf('localhost')>=0) {
		mydomain = 'localhost';
	}
	var domain = {
		path: '/',
		domain: mydomain,
		expires : 365
	};
	
	$.cookie(name, encodeURIComponent(value), domain);
}

function getCookie(name){
    var cookieValue=null;
    if(document.cookie){
        var array=document.cookie.split((escape(cookieName)+'='));
        if(array.length >= 2){
            var arraySub=array[1].split(';');
            cookieValue=unescape(arraySub[0]);
        }
    }
    return cookieValue;
}

var StringBuffer = function() {
    this.buffer = new Array();
};
StringBuffer.prototype.append = function(str) {
    this.buffer[this.buffer.length] = str;
};
StringBuffer.prototype.toString = function() {
    return this.buffer.join("");
};

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
}

function kinesisGetCampaignId(){
	var params = location.search.substr(location.search.indexOf("?") + 1);
	var cmpid = '';
	var tmpList = [];
    params = params.split("&");

    for(var j = 0; j < params.length; j++){
        var temp = params[j].split("=");
        if(temp[0] == 'cmpid'){
            if(temp[1] == '?cmpid'){
               tmpList.push(temp[temp.length-1]);   
            }else{
               tmpList.push(temp[1]); 
            }
            break;
        }
    }
    
    if(typeof tmpList[0] != 'undefined'){
    	cmpid = tmpList[0];
    }
    
    return cmpid;
}

function kinesisGetStatusCode(){
	var status = '';
	if(typeof _dl.error_type != 'undefined'){
		status = _dl.error_type.split(':')[0];
	}
	
	return status;
}