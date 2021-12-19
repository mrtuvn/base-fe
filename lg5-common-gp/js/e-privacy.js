var ePrivacyCookies;
/*BTOBGLOBAL-41 20200422 add*/
var geoIpType;
/*//BTOBGLOBAL-41 20200422 add*/

$(document).ready(function(){
	if(!$('html').data('countrycode') || $('html').data('countrycode')=='') {
		return false;
	}
	ePrivacyCookies = {
		countrycode : $('html').data('countrycode').toUpperCase(),
		$implicit : document.getElementById('agreeCookie'),
		$explicit : document.getElementById('eprivacyCookie'),
		cookies : [],
		cookieListURL : null,
		isToggleBtn : null,
		bannerType : 'N', // N (none), I(implicit), E(explicit), S(single)
		infoHTML : '',
		$focusObj : null,
		geoIpItem : ($(document.getElementById('agreeCookie')).length>0 && $(document.getElementById('eprivacyCookie')).length>0) ? true:false,
		bannerV2 : ($('.cookie-banner').length>0 && $('.cookie-banner').hasClass("cookie-eu")) ? true : false, //LGEGMC-279
		bannerGr : ($('.cookie-banner').length>0 && $('.cookie-banner').hasClass("cookie-gr")) ? true : false,		
		modalPopUp :document.getElementById('modal_cookie_set'),//LGEGMC-279
		geoIpEuUrl: '/global/mkt/ajax/retrieveGeoIpEuFlag',//LGEGMC-279  
		getCookie : function(name) {
			if ($.cookie(name)) {
				return decodeURIComponent($.cookie(name));
			} else {
				$.cookie(name);
			}
		},
		setCookie : function (name, value) {
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
		},		
		setSessionCookie : function (name, value) {
			var lh = location.host;
			var mydomain = '.lg.com';
			if(lh.indexOf('lge.com')>=0) {
				mydomain = '.lge.com';
			} else if(lh.indexOf('localhost')>=0) {
				mydomain = 'localhost';
			}
			var domain = {
				path: '/',
				domain: mydomain
			};
			
			$.cookie(name, encodeURIComponent(value), domain);
		},
		referrerUrlSet : function(){
			var self = this; 
			var referrer;
			if(self.getCookie(self.countrycode+'_referrerUrl') =='' || typeof self.getCookie(self.countrycode+'_referrerUrl') == 'undefined'){
				referrer = document.referrer;
				if(referrer.indexOf("/"+self.countrycode.toLowerCase())<0){
					_dl.referrer = referrer;
				}
			}else{
				referrer = self.getCookie(self.countrycode+'_referrerUrl')
				_dl.referrer = referrer;
			}
			var lh = location.host;
			var mydomain = '.lg.com';
			if(lh.indexOf('lge.com')>=0) {
				mydomain = '.lge.com';
			} else if(lh.indexOf('localhost')>=0) {
				mydomain = 'localhost';
			}
			var domain = {
				path: '/',
				domain: mydomain
			};
			$.removeCookie(self.countrycode+'_referrerUrl',domain)
		},
		/*BTOBGLOBAL-41 20200422 add*/
		geoIpEu : function() {
			var self = this; 
			(ePrivacyCookies.bannerV2 && !ePrivacyCookies.geoIpItem)? ePrivacyCookies.geoIpEuUrl='/global/mkt/ajax/retrieveGeoIpEuFlag?query_type=gdpr':'';
			//var url = "/lg5-common-gp/data-ajax/mkt/retrieveGeoIpEuFlag.json"; 
			var url = ePrivacyCookies.geoIpEuUrl;
			if(window.location.href.indexOf('/oauth/') >=0) {
				var outhCookieListURL = ($('.cookie-banner').length>0) ? $('.cookie-banner').data('cookie-list') : null;
				if(outhCookieListURL.indexOf('wdev50.lg.com')>=0) {
					url="https://wdev50.lg.com"+ePrivacyCookies.geoIpEuUrl;
				} else if(outhCookieListURL.indexOf('wwwstg.lg.com')>=0) {
					url="https://wwwstg.lg.com"+ePrivacyCookies.geoIpEuUrl;
				} else if(outhCookieListURL.indexOf('www.lg.com')>=0){
					url="https://www.lg.com"+ePrivacyCookies.geoIpEuUrl;
				}else{
					url="https://"+window.location.host+ePrivacyCookies.geoIpEuUrl;
				}
			}
		
			$.ajax({
				type:"post",
				url: url,
				dataType: "json",
				xhrFields: {
					withCredentials: true
				},
				//jsonp: "callback",
				success: function(data) {
					var _geoIpEuFlag = data.data[0].geoIpEuFlag;
					(self.countrycode.toLowerCase()=='fr')? _geoIpEuFlag='Y': _geoIpEuFlag;
					(_geoIpEuFlag =="Y") ? geoIpType="_explict" : (ePrivacyCookies.bannerV2 && !ePrivacyCookies.geoIpItem)? geoIpType="_explictArgee" : geoIpType='_implict' ;
					if(geoIpType=='_explictArgee'){
						$('.cookie-banner').css('display','none');
					}
					ePrivacyCookies.init();
				},
				error: function(request,status,error) {
					console.log("status: "+status);
					console.log("error: "+error);
				}
			});
		},
		/*//BTOBGLOBAL-41 20200422 add*/
		init : function() {
			if($('body').hasClass('iw-fullscreen-edit')) return false; // edit view on teamsite
			
			var self = this;
			self.cookieListURL = ($('.cookie-banner').length>0) ? $('.cookie-banner').data('cookie-list') : null;
			/*BTOBGLOBAL-41 20200422 modify*/
			if((!self.geoIpItem && $(self.$implicit).length>0) || (self.geoIpItem && geoIpType =="_implict")) {
				// implicit
				self.cookieName = self.countrycode+'_agreeCookie';
				self.bindCookieBanner('implicit');
				self.initCookieBanner('implicit');
				if($(self.$implicit).data('privacy-type')=="strict") {
					self.bannerType = 'S';
				} else {
					self.bannerType = 'I';
				}
				self.infoHTML = ($(self.$implicit).find('template').length>0) ? $(self.$implicit).find('template').clone().html() : '';
				if($(self.$implicit).length>0 && $(self.$explicit).length>0){
					$(self.$explicit).remove();
				}
                                self.referrerUrlSet(); //LGEGMC-2239 
			} else if((!self.geoIpItem && $(self.$explicit).length>0) || (self.geoIpItem && geoIpType =="_explict")) {
				// explicit
				/* LGEGMC-279 20200610 modify*/
				/* LGEUA-172 Start */
				self.isToggleBtn = ($(self.$explicit).find('button.toggle-setting-area,a.toggle-setting-area').length>0 || !!$(self.$explicit).hasClass('close-more')) ? true:false;
				/* LGEUA-172 End */
					
				$(self.$explicit).find('.more ul li.detail-option-key').each(function() {
					var className = $(this).attr('class');
					/* LGEGMC-279, LGETR-53 20200724 modify*/
					if((self.countrycode.toLowerCase()=='it'|| self.countrycode.toLowerCase()=='tr') && $(this).find('.toggle-active-button button').hasClass('hidden')){
						$(this).addClass("hidden");
					}
					/* LGEGMC-279, LGETR-53  20200724 modify*/
					if(className.indexOf('LGCOM_') != -1) {
						var regExp = /detail-option-key ([A-Z]\w+).*/g;

						// push to self.cookies
						self.cookies.push(self.countrycode+'_'+$.trim(className.replace(regExp, '$1')));
					}
				});
				self.bindCookieBanner('explicit');
				self.initCookieBanner('explicit');
				self.infoHTML = $(self.$explicit).find('template').clone().html();
				self.bannerType = 'E';
				/* LGEGMC-1964 */
				if(geoIpType=="_explictArgee" && self.getCookie(self.countrycode+'_eCookieOpenFlag') != 'false'){
					self.setCookie(self.countrycode+'_referrerUrl', document.referrer);
					$(self.$explicit).find('button.accept-all').trigger('click');
				}else{
					self.referrerUrlSet();
				}
				/* LGEGMC-1964 */
				// removeCookieList
				if(self.cookieListURL != null) self.controlCookieList();
				if($(self.$implicit).length>0 && $(self.$explicit).length>0){
					$(self.$implicit).remove();
				}
			}else{
				self.referrerUrlSet();
			}
			/*//BTOBGLOBAL-41 20200422 modify*/
			console.log('ePrivacy Banner Type', self.bannerType);
			self.loadJS();

			/* LGEUK-114 20200722 add */
			self.loadIntercomJS();
			/*// LGEUK-114 20200722 add */
			
			/* LGECS-229 20210719 add */
			self.loadZendeskJS();
			/* LGECS-229 20210719 add */
			
			$(window).on('resize load', function() {

				if($('.eprivacy-layer').length>0) $('.eprivacy-layer').remove();
				/*LGEGMC-525 add*/
				if($('.eprivacy-tooltip').length>0){
					$(self.modalPopUp).hide();
					$(".sec-section").hide();
					$('.page-cookie-view').unwrap();
					$(self.modalPopUp).removeClass('page-cookie-view');
					($(".sec-section").hasClass('visible')) ? $(".sec-section").removeClass('visible'):'';
				}
				/*//LGEGMC-525 add*/
				ePrivacyCookies.setCookieEuHeight(); // banner height
			});
			var inithtml=$(self.modalPopUp).find('.sec-section ul').clone(true);
			$(inithtml).find('li').each(function(){
				var className = $(this).attr('class');
				if(className.indexOf('LGCOM_') != -1) {
						var regExp = /detail-option-key ([A-Z]\w+).*/g;
						$(this).attr('data-inx',$(".cookie-eu .more .inner ul").find('li.'+$.trim(className.replace(regExp, '$1'))).index()-$(".cookie-eu .more .inner ul").find('li.hidden').length);
						if($(".cookie-eu .more .inner ul").find('li.'+$.trim(className.replace(regExp, '$1'))).find(".toggle-active-button button").hasClass("hidden")){
							$(this).find(".toggle-active-button button").addClass("hidden");
							if(self.countrycode.toLowerCase()=='it'|| self.countrycode.toLowerCase()=='tr'){ //LGETR-53 modify
								$(this).css('display','none');
							}
						}
					}
			})
			$(inithtml).find('li').each(function(){
				var _inx= Number($(this).attr('data-inx'))+1;
				if(_inx==1){
					$(this).prependTo($(inithtml))
				}else{
					$(this).insertBefore($(inithtml).find('li[data-inx='+_inx+']'))
				}
			})
			$(self.modalPopUp).find('.sec-section ul').html($(inithtml));
		},
		setCookieEuHeight : function(){
			// banner height
			if ( ($('.cookie-eu-get-height').length>0) && ($('.cookie-eu').length>0) ){
				setTimeout(function() {
					$('.cookie-eu-get-height').height( $('.cookie-eu').height() );
					if($('.cookie-eu').css('display') == 'none'){
						$('.cookie-eu-get-height').css('height','0');
					}
				}, 100);
			}
		},
		loadJS : function() {
		/*LGEES-15 modify*/
			var self = this;
			if($('.eprivacy-load-js').length>0 && (ePrivacyCookies.get('LGCOM_IMPROVEMENTS')||self.countrycode=='ES')) {
				$('.eprivacy-load-js').each(function() {
						if(self.countrycode=='ES' && $(this).attr("id")!="bvScript" && !ePrivacyCookies.get('LGCOM_IMPROVEMENTS')){
						return;
					}
					var url = $(this).data('url');
					var d = document,
						s = d.createElement('script'),
						b = d.body || d.getElementsByTagName("body")[0];
					// LGEUK-130,LGEPL-470 START
					if($(this).hasClass("inlineScript")){
						s.text=$(this).text();
						as = {
								"type": "text/javascript"
							};
					}else if($(this).data('url').indexOf("youreko") >= 0||$(this).data('url').indexOf("bvapi") >= 0){//LGEITF-397
						as = {
							"src": url,
							"defer" : ""
						};
					} else {
						as = {
								"src": url
							};
					}
					// LGEUK-130,LGEPL-470 END
					for (var i in as) {
						s.setAttribute(i, as[i]);
					}
					b.appendChild(s);
					// 20200325 START : 박지영 - 삭제 
					// $(this).remove();
					// 20200325 END
				});
			}
		},
		/* LGEUK-114 20200722 add */
		loadIntercomJS : function() {
			var self = this;
			if($('.eprivacy-load-intercom').length>0 && (ePrivacyCookies.get('LGCOM_IMPROVEMENTS'))) {
				$('.eprivacy-load-intercom').each(function() {
						if(!ePrivacyCookies.get('LGCOM_IMPROVEMENTS')){
						return;
					}
					
					/* LGECZ-169 : 20210714 add */
					if(self.countrycode.toLowerCase()=='cz' && $('.navigation').hasClass('b2b')) return;
					/*//LGECZ-169 : 20210714 add */
											
					var url = $(this).data('url');
					var d = document,
						s = d.createElement('script'),
						b = d.body || d.getElementsByTagName("body")[0],
					as = {
						"src": url
					};
					for (var i in as) {
						s.setAttribute(i, as[i]);
					}
					b.appendChild(s);
				});
			} else if($('.eprivacy-load-traffic').length>0 && (ePrivacyCookies.get('LGCOM_ANALYSIS_OF_SITE'))){
				/* LGECZ-31 20200918 add */
				$('.eprivacy-load-traffic').each(function() {
					if(!ePrivacyCookies.get('LGCOM_ANALYSIS_OF_SITE')){
						return;
					}
					var url = $(this).data('url');
					var d = document,
						s = d.createElement('script'),
						b = d.body || d.getElementsByTagName("body")[0],
					as = {
						"src": url
					};
					for (var i in as) {
						s.setAttribute(i, as[i]);
					}
					b.appendChild(s);
				});
			}else if($('.eprivacy-load-convert').length>0 && (ePrivacyCookies.get('LGCOM_ANALYSIS_OF_SITE'))){
					$('.eprivacy-load-convert').each(function() {
						if(!ePrivacyCookies.get('LGCOM_ANALYSIS_OF_SITE')){
							return;
						}
						var url = $(this).data('url');
						var d = document,
							s = d.createElement('script'),
							b = d.head || d.getElementsByTagName("head")[0],
						as = {
							"src": url
						};
						for (var i in as) {
							s.setAttribute(i, as[i]);
						}
						b.appendChild(s);
					});
				}
			},
			/* LGEIS-336 20210223 ADD */
	     
		/*// LGEUK-114 20200722 add */
		loadJS_Each : function(url, target) {
			var d = document,
				s = d.createElement('script'),
				b = target ? $(target).eq(0).get(0) : d.body || d.getElementsByTagName("body")[0],
			as = {
				"src": url
			};
			for (var i in as) {
				s.setAttribute(i, as[i]);
			}
			b.appendChild(s);
		},
		/* LGECS-229 20210719 add */
		loadZendeskJS : function() {
			/*LGEES-15 modify*/
			var self = this;
			
			if($('.eprivacy-load-js-zendesk').length>0 && ePrivacyCookies.get('LGCOM_IMPROVEMENTS')){
				$('.eprivacy-load-js-zendesk').each(function() {
					if(!ePrivacyCookies.get('LGCOM_IMPROVEMENTS')){
						return;
					}
					// LGEITF-438 start
					var url_pre = $(this).data('jsurl-pre');
					var	d_pre = document,
						s_pre = d_pre.createElement('script'),
						b_pre = d_pre.body || d_pre.getElementsByTagName("body")[0],
						as_pre = {
							"src": url_pre
						};
					for (var i in as_pre) {
						s_pre.setAttribute(i, as_pre[i]);
					}
					b_pre.appendChild(s_pre);
					
					var url = $(this).data('url');
					var d = document,
						s = d.createElement('script'),
						b = d.body || d.getElementsByTagName("body")[0],
						as = {
							"id":"ze-snippet",
							"src": url
						};
					for (var i in as) {
						s.setAttribute(i, as[i]);
					}
					if(b.appendChild(s)){
						url = $(this).data('jsurl');
						d = document;
						s = d.createElement('script');
						b = d.body || d.getElementsByTagName("body")[0];
						as = {
							"src": url
						};
						for (var i in as) {
							s.setAttribute(i, as[i]);
						}
						b.appendChild(s);
					}
					// LGEITF-438 end
				});
			}
		},
		/* LGECS-229 20210719 add */
		view : function(n, c, $obj) {
			var self = this;
			// self.infoHTML
			if(n=='click') {
				// layer
				//var $target = $(':focus');
				var $target = $(event.target) ? $(event.target) : $(':focus');
				//console.log($target.prop('tagName'));
				if($target.attr('class') && $target.attr('class').indexOf('active-result') != -1) {
					if($target.closest('.chosen-container').length>0) {
						$target = $target.closest('.chosen-container');
					}
				}
				if($target.closest('.swatch').length > 0) $target = $target.closest('.swatch');
				if($target.length>0) {
					var l = $target.offset().left + ($target.outerWidth()/2),
						t = $target.offset().top,
						t2 = $target.offset().top + $target.outerHeight();
					self.$focusObj = $target;
					if($('.eprivacy-layer').length>0) $('.eprivacy-layer').remove();
					/*LGEGMC-525 modify*/
					if($('.eprivacy-tooltip').length>0){
						$(self.modalPopUp).hide();
						$(".sec-section").hide();
						$('.page-cookie-view').unwrap();
						$(self.modalPopUp).removeClass('page-cookie-view left right');
						($(".sec-section").hasClass('visible')) ? $(".sec-section").removeClass('visible'):'';
					}
					if(!self.bannerV2){
						$('body').prepend($('<div>'+self.infoHTML+'</div>').find('.eprivacy-layer').get(0).outerHTML);
						var $eLayer = $('.eprivacy-layer');
					}else{
						var $innerLayer = $(self.modalPopUp).addClass("page-cookie-view center").show();
						$innerLayer.wrapAll('<div class="eprivacy-tooltip"></div>')
						t= t- $innerLayer.height();
						$('body').prepend($('.eprivacy-tooltip'));
						var $eLayer = $('.eprivacy-tooltip');
						
					}
					$eLayer.css({'left':l, 'top':(t-15)}).attr('tabindex', 0).focus();
					var initTop= parseInt($(".eprivacy-tooltip").css('top'));
					
					$eLayer.find('.toggle-setting-area').off('click').on('click', function(e) {
						e.preventDefault();
						if(!$(".sec-section").hasClass('visible')){
							/* LGEFR-254 Start */
							if(initTop-$(".sec-section").outerHeight()-parseInt($(".sec-section").css('margin-top')) < 0){
								$(".eprivacy-tooltip").animate({
									top : parseInt($(".eprivacy-tooltip").css('top'))
									},200, function() {
										
									  });
							}else{
								$(".eprivacy-tooltip").animate({
									top : initTop-$(".sec-section").outerHeight()-parseInt($(".sec-section").css('margin-top'))
									},200, function() {
										
									  });
							}
							/* LGEFR-254 End */
							$(".sec-section").slideDown(200);
							$(".sec-section").addClass('visible');
						}else{
							$(".eprivacy-tooltip").animate({
								top : initTop
								},200, function() {
									
								  });
							$(".sec-section").slideUp(200);
							$(".sec-section").removeClass('visible');
						}
						//$(".eprivacy-tooltip").animate({'top':parseInt($(".eprivacy-tooltip").css('top'))-$(".sec-section").outerHeight()-parseInt($(".sec-section").css('margin-top'))});
					})
					$eLayer.find('.btn-cover button')
						.on('click', function(e) {
							e.preventDefault();
							$('.eprivacy-layer').remove();
							ePrivacyCookies.$focusObj.focus();
						}).on('blur', function(e) {
							e.preventDefault();
							$('.eprivacy-layer a').eq(0).focus();
						});
					$eLayer.find('.description a').on('click', function(e) {
						e.preventDefault();
						$('html, body').stop().animate({scrollTop : 0}, 300, function(){
							ePrivacyCookies.openCookieBanner();
						});
					});
					if(!self.bannerV2){
						var layerSizeDiv= $eLayer.find('.eprivacy-message-wrap');
					}else{
						var layerSizeDiv= $eLayer.find('.page-cookie-view');
					}
					var layerL = (!self.bannerV2)? layerSizeDiv.offset().left:layerSizeDiv.offset().left,
						layerR = layerL + layerSizeDiv.outerWidth(),
						layerT = layerSizeDiv.offset().top,
						layerB = layerSizeDiv.offset().top + layerSizeDiv.outerHeight();
						if(layerL < 0) {
							layerSizeDiv.removeClass('center right').addClass('left');
						} else if(layerR > $(window).width()) {
							layerSizeDiv.removeClass('center left').addClass('right');
						}
						if(layerT < 0) {
							layerSizeDiv.removeClass('above').addClass('below').parent().css('top', (t2+15));
						}
					/*LGEGMC-525 modify*/
				}
			} else {
				// load
				if(self.bannerV2){
					self.infoHTML = $(self.$explicit).find('template').clone().html();
				}

				// load 
				if($obj.length>0) {
					$obj.html($('<div>'+self.infoHTML+'</div>').find('.cookie-permit-msg').get(0).outerHTML);
					$obj.find('.cookie-permit-msg').removeClass('small').addClass(c);
					$obj.find('.cookie-permit-msg .info-text a').on('click', function(e) {
						e.preventDefault();
						if($(this).closest('.modal').length>0 && !!$(this).closest('.modal').attr('id')) {
							$('#'+$(this).closest('.modal').attr('id')).modal('hide');
						}
						$('html, body').stop().animate({scrollTop : 0}, 300, function(){
							ePrivacyCookies.openCookieBanner();
						});
					});
				}
			}
		},
		get : function(txt) {
			var self = this;
			/*BTOBGLOBAL-41 20200422 modify*/
			if((self.bannerV2 || self.geoIpItem) && typeof geoIpType=='undefined'){
				if(self.getCookie(self.countrycode+'_agreeCookie')== 'Y' || self.getCookie(self.countrycode+'_'+txt) == 'Y'){
					return true;
				}else{
					return false;
				}
			} 
			/*//BTOBGLOBAL-41 20200422 modify*/
			if($('body').hasClass('iw-fullscreen-edit')) {
				return true;
			} else if(self.bannerType=='N' || self.bannerType=='I') {
				return true;
			} else if (self.bannerType=='S') {
				if(self.getCookie(self.countrycode+'_agreeCookie') != 'Y') { // != Y
					return false;
				} else {
					return true;
				}
			} else if (self.bannerType=='E') {
				if(self.getCookie(self.countrycode+'_'+txt) == 'Y') {
					return true;
				// do not check default value in admin site
				//} else if(!self.getCookie(self.countrycode+'_'+txt) && $(self.$explicit).find('.'+txt+' .toggle-active-button button').hasClass('active')) {
				//	return true;
				} else {
					return false;
				}
			}
		},
		initCookieBanner : function(mode) {
			var self = this;
			if(mode=='implicit') {
				// implicit
				if(self.getCookie(self.cookieName) == 'Y') {
					$(self.$implicit).removeClass('active');
					/* LGEGMC-194 : 20200514 add */
					if($(self.$implicit).data('privacy-type')=="strict" && self.getCookie(self.countrycode+'_implicitStrictOpenFlag') == 'true'){
						$(self.$implicit).addClass('active');
						console.log('  ');
					}
					/*// LGEGMC-194 : 20200514 add */
				} else {
					$(self.$implicit).addClass('active');
				}
			} if(mode=='explicit') {
				// explicit
				for(var i=0;i<self.cookies.length;i++) {
					var cookieName = self.cookies[i];
					var btn = $(self.$explicit).find('.'+self.cookies[i].replace(self.countrycode+'_', '') + ' .toggle-active-button');
					var modalbtn = $(self.modalPopUp).find('.'+self.cookies[i].replace(self.countrycode+'_', '') + ' .toggle-active-button');
                    var checkBox = $(self.$explicit).find('.'+self.cookies[i].replace(self.countrycode+'_', '') + ' .checkbox-box'); /* LGEGR-141*/
					var msgActive = btn.data('active-text')||checkBox.data('active-text'),
						msgDisactive = btn.data('disactive-text')||checkBox.data('disactive-text');
						if(self.getCookie(cookieName) == 'Y' || (self.bannerV2 && btn.find('button').hasClass("hidden"))||(self.getCookie(cookieName)!= 'N'&&btn.find('button').hasClass("active"))) { //LGEPL-452
							btn.find('button').addClass('active').find('> span').text(msgActive);
							// LGEES-15 20200519 add
							btn.find('button').attr('title', msgActive);
							modalbtn.find('button').addClass('active').find('> span').text(msgActive);
							if(self.cookies[i].indexOf('LGCOM_NECESSARY') == -1) {
								checkBox.find(':checkbox').addClass('active').prop('checked', true);
							}
						} else {
							btn.find('button').removeClass('active').find('> span').text(msgDisactive);
							// LGEES-15 20200519 add
							btn.find('button').attr('title', msgDisactive);
							modalbtn.find('button').removeClass('active').find('> span').text(msgDisactive);
							if(self.cookies[i].indexOf('LGCOM_NECESSARY') == -1) {
								checkBox.find(':checkbox').removeClass('active').prop('checked', false);;
							}
						}
				}
				if(self.getCookie(self.countrycode+'_eCookieOpenFlag') == 'false') {
					// If there are no .toggle-setting-area buttons, the selection below should also be opened.
					if(self.isToggleBtn) $(self.$explicit).addClass('ready');
					else $(self.$explicit).addClass('ready more');
				} else {
					// If there are no .toggle-setting-area buttons, the selection below should also be opened.
					if(self.isToggleBtn) $(self.$explicit).addClass('ready active');
					else $(self.$explicit).addClass('ready active more');
					if(geoIpType!="_explictArgee"){
						ePrivacyCookies.setCookieEuHeight();
					}
					// dimmed
					if($(self.$explicit).data('privacy-type')=="strict" && geoIpType!='_explictArgee') {
						$('body').append('<div class="dimmed" style="position:fixed;z-index:10000;top:0;left:0;width:100%;height:100%;background:#000;opacity:0.5;"></div>');
					}
					if(self.countrycode.toLowerCase()=='fr') {
						$('body').css({'position':'fixed', 'width':'100%'});
						$('body').on('scroll touchmove mousewheel', function(e){
							e.preventDefault();
						});
					}
				}
				/* LGEGMC-279 20200610 add*/
				/* LGEUA-172 Start */
				if(self.countrycode.toLowerCase()!='uk' && self.countrycode.toLowerCase()!='nl' && self.countrycode.toLowerCase()!='be_fr' && self.countrycode.toLowerCase()!='fr' && self.countrycode.toLowerCase()!='ua'){
				/* LGEUA-172 End */
					if(self.bannerV2 && ($(self.$explicit).find(".more ul li").not('.hidden').find('.toggle-active-button button.active').length==$(self.$explicit).find('.detail-option-key').not('.hidden').length)){
						$(self.$explicit).find('.default').css('display','none');
					}
				}
				/* //LGEGMC-279 20200610 add*/

				if(self.isToggleBtn) {
					/* LGEGMC-279 20200610 modify*/
					$(self.$explicit).find('button.toggle-setting-area,a.toggle-setting-area').attr('aria-expanded', false);
				}
				$(self.$explicit).find('.default button').attr('aria-expanded', false);
			}
		},
		implictClose : function(){
			var self = this;
			if(!self.getCookie(self.countrycode+'_agreeCookie') && $(self.$implicit).data('privacy-type')=="strict") {
				setTimeout(function() {
					location.reload();
				}, 100);
			}
			$(self.$implicit).removeClass('active');
			self.setCookie(self.cookieName, 'Y');
			$('.eprivacy-layer').remove();
			/*LGEGMC-525 add*/
			if($('.eprivacy-tooltip').length>0){
				$(self.modalPopUp).hide();
				$(".sec-section").hide();
				$('.page-cookie-view').unwrap();
				$(self.modalPopUp).removeClass('page-cookie-view');
				($(".sec-section").hasClass('visible')) ? $(".sec-section").removeClass('visible'):'';
			}
			/*LGEGMC-525 add*/
			/* LGEGMC-194 : 20200514 add */
			if($(self.$implicit).data('privacy-type')=="strict"){				
				self.setCookie(self.countrycode+'_implicitStrictOpenFlag', false);
			}
			/*// LGEGMC-194 : 20200514 add */
		},
		/* LGEGMC-194 : 20200514 add */
		implictStrictClose : function(){
			var self = this;
			if(!self.getCookie(self.countrycode+'_agreeCookie') && $(self.$implicit).data('privacy-type')=="strict") {
				setTimeout(function() {
					location.reload();
				}, 100);
				self.setCookie(self.cookieName, 'Y');
				self.setCookie(self.countrycode+'_implicitStrictOpenFlag', true);
			}
		},
		/*// LGEGMC-194 : 20200514 add */
		bindCookieBanner : function(mode) {
			var self = this;
			if(mode=='implicit') {
				// implicit
					
				// close layer
				$(self.$implicit).find('.close a').on('click', function(e) {
					e.preventDefault();
					self.implictClose();
				});
				/* LGEGMC-194 : 20200514 add */
				/*if(self.geoIpItem){
					$(document).off('click scroll').on('click scroll', function(e) {
						if($(e.target).hasClass('slide-pause')){
							return false;
						}else if($(self.$implicit).find(e.target).length>0){
							return true;
						}else{
							self.implictClose();
						}
					});
				}*/				
				if($(self.$implicit).data('privacy-type')=="strict") {
					$(document).ready(function () {
						$(window).on('click mousewheel DOMMouseScroll wheel touchmove', function(e){
							if(e.originalEvent == undefined){
								return false;
							}else if($(self.$implicit).find(e.target).length>0){
								return true;
							}else{
								self.implictStrictClose();
							}
						});
					});
				}
				/*// LGEGMC-194 : 20200514 add */
			} if(mode=='explicit') {
				// explicit

				var msgActive = $('.toggle-active-button[data-active-text]').eq(0).data('active-text'),
					msgDisactive = $('.toggle-active-button[data-disactive-text]').eq(0).data('disactive-text');
				if(ePrivacyCookies.bannerV2&& geoIpType !='_explictArgee'){
					for(var i=0;i<self.cookies.length;i++) {
						var cookieName = self.cookies[i];
						if(self.cookies[i].indexOf('LGCOM_NECESSARY') == -1) {
							if($(self.$explicit).find('.'+self.cookies[i].replace(self.countrycode+'_', '') + ' .toggle-active-button button').hasClass('active')) {
								if(typeof self.getCookie(cookieName)=='undefined'){
									self.setCookie(cookieName, 'Y');
								
								}
							}
						}
					}
				} 
				// open layer
				$(self.$explicit).find('.default button').on('click', function(e) {
					e.preventDefault();
					$(this).attr('aria-expanded', true);
					// If there are no .toggle-setting-area buttons, the selection below should also be opened.
					if(self.isToggleBtn) $(self.$explicit).addClass('active');
					else $(self.$explicit).addClass('active more');
					$('.eprivacy-layer').remove();
					/*LGEGMC-525 add*/
					if($('.eprivacy-tooltip').length>0){
						$(self.modalPopUp).hide();
						$(".sec-section").hide();
						$('.page-cookie-view').unwrap();
						$(self.modalPopUp).removeClass('page-cookie-view');
						($(".sec-section").hasClass('visible')) ? $(".sec-section").removeClass('visible'):'';
					}
					/*LGEGMC-525 add*/
					ePrivacyCookies.setCookieEuHeight();
				});
				// close layer
				$(self.$explicit).find('.close a').on('click', function(e) {
					e.preventDefault();
					$(self.$explicit).removeClass('active more');
					$('.eprivacy-layer').remove();
					/*LGEGMC-525 add*/
						if($('.eprivacy-tooltip').length>0){
						$(self.modalPopUp).hide();
						$(".sec-section").hide();
						$('.page-cookie-view').unwrap();
						$(self.modalPopUp).removeClass('page-cookie-view');
						($(".sec-section").hasClass('visible')) ? $(".sec-section").removeClass('visible'):'';
					}
					/*LGEGMC-525 add*/
					if(!self.getCookie(self.countrycode+'_eCookieOpenFlag') && $(self.$explicit).data('privacy-type')=="strict") {
						setTimeout(function() {
							location.reload();
						}, 100);
					}
					self.setCookie(self.countrycode+'_eCookieOpenFlag', false);
				});
				/*LGEES-15 modify*/
				if($(self.$explicit).data('privacy-type')=="strict") {
					//console.log('strict');
					$(self.$explicit).find('.close').remove();
					$(self.$explicit).find('.submit button:last').on('blur', function() {
						//console.log('blur');
						if(!self.getCookie(self.countrycode+'_eCookieOpenFlag')) {
							$(self.$explicit).find(':focusable').eq(0).focus();
						}
					});
					$(self.$explicit).find('.open button:last').on('blur', function(e) {
						if($(self.$explicit).hasClass('more')) {
							return true;
						} else {
							if(!self.getCookie(self.countrycode+'_eCookieOpenFlag')) {
								$(self.$explicit).find(':focusable').eq(0).focus();
							}
						}
					});
				}
				/*//LGEES-15 modify*/
				// more layer
				/* LGEGMC-279 20200610 modify*/
				$(self.$explicit).find('button.toggle-setting-area,a.toggle-setting-area').on('click', function(e) {
					e.preventDefault();
					$('.eprivacy-layer').remove();
					
					if($(self.$explicit).hasClass('more')) {
						$(self.$explicit).removeClass('more');
						$(this).addClass('closed');
						$(this).attr('aria-expanded', false);
					} else {
						$(self.$explicit).addClass('more');
						$(this).removeClass('closed');
						$(this).attr('aria-expanded', true);
					}
					if($('.eprivacy-layer').length>0) $('.eprivacy-layer').remove();
					/*LGEGMC-525 add*/
					if($('.eprivacy-tooltip').length>0){
						$(self.modalPopUp).hide();
						$(".sec-section").hide();
						$('.page-cookie-view').unwrap();
						$(self.modalPopUp).removeClass('page-cookie-view');
						($(".sec-section").hasClass('visible')) ? $(".sec-section").removeClass('visible'):'';
					}
					/*LGEGMC-525 add*/
					ePrivacyCookies.setCookieEuHeight(); // banner height
				});
				// toggle button
				/* LGEGR-141 */
				$(self.$explicit).find('.toggle-active-button button,.checkbox-box [type=checkbox]').on('click', function(e) {
					if($(this).prop("type")!="checkbox"){
						e.preventDefault();
					}
					$('.eprivacy-layer').remove();
					
					var className = $(this).closest('li').attr('class');
					if(className.indexOf('LGCOM_') != -1) {
						var regExp = /detail-option-key ([A-Z]\w+).*/g;
					}
					if((ePrivacyCookies.bannerGr||self.countrycode.toLowerCase()=='pl') && $.trim(className.replace(regExp, '$1')).indexOf('LGCOM_NECESSARY') != -1){//LGEPL-452
						return false;
					}
					if($(this).hasClass('active')){
						$(this).removeClass('active').find('> span').text(msgDisactive);
						// LGEES-15 20200519 add
						$(this).attr('title', msgDisactive);
						$(self.modalPopUp).find('.'+$.trim(className.replace(regExp, '$1'))+' .toggle-active-button button').removeClass('active').find('> span').text(msgDisactive);
					} else {
						$(this).addClass('active').find('> span').text(msgActive);
						// LGEES-15 20200519 add
						$(this).attr('title', msgActive);
						$(self.modalPopUp).find('.'+$.trim(className.replace(regExp, '$1'))+' .toggle-active-button button').addClass('active').find('> span').text(msgActive);
					}
					
				});
				$(self.modalPopUp).find('.toggle-active-button button').on('click', function(e) {
				        /*LGEPL-452 start*/
					var className = $(this).closest('li').attr('class');
					if(self.countrycode.toLowerCase()=='pl' && $.trim(className.replace(regExp, '$1')).indexOf('LGCOM_NECESSARY') != -1){
						return false;
					}
					if($(this).hasClass('active')) {
						$(this).removeClass('active').find('> span').text(msgDisactive);
					} else {
						$(this).addClass('active').find('> span').text(msgActive);
					}
					/*LGEPL-452 end*/
					
					if(className.indexOf('LGCOM_') != -1) {
						var regExp = /detail-option-key ([A-Z]\w+).*/g;
						$(self.$explicit).find('.'+$.trim(className.replace(regExp, '$1'))+'').find('.toggle-active-button button').trigger("click");
					}
				});
				// plus minus button for mobile view
				$(self.$explicit).find('.toggle-open-button button').on('click', function(e) {
					e.preventDefault();
					$('.eprivacy-layer').remove();
					/*LGEGMC-525 add*/
					if($('.eprivacy-tooltip').length>0){
						$(self.modalPopUp).hide();
						$(".sec-section").hide();
						$('.page-cookie-view').unwrap();
						$(self.modalPopUp).removeClass('page-cookie-view');
						($(".sec-section").hasClass('visible')) ? $(".sec-section").removeClass('visible'):'';
					}
					/*LGEGMC-525 add*/
					$(this).closest('li').toggleClass('active');
				});
				/* LGEGMC-279 20200616 modify*/
				$(self.modalPopUp).find('button.accept-all,a.comment-accept-all').on('click', function(e) {
					$(self.modalPopUp).find('.detail-option-key').not('.hidden').find('.toggle-active-button button').not('.hidden').each(function() {
						$(this).addClass('active').find('> span').text(msgActive);
					});
					$(self.$explicit).find('button.accept-all').trigger('click');
				});
				$(self.modalPopUp).find('.submit button').on('click', function(e) {
					$(self.$explicit).find('.submit button.save-submit').trigger('click');
				});
				/* //LGEGMC-279 20200616 modify*/
				// accept all cookies
				$(self.$explicit).find('button.accept-all,a.comment-accept-all').on('click', function(e) {
					e.preventDefault();
					/* LGEGR-141 */
					$(self.$explicit).find('.detail-option-key').not('.hidden').find('.toggle-active-button button,.checkbox-box [type=checkbox]').not('.hidden').each(function() {
						if($(this).prop("type")=="checkbox"){
							$(this).prop('checked', true);
						}
						$(this).addClass('active').find('> span').text(msgActive);
					});
					$('.eprivacy-layer').remove();
					/*LGEGMC-525 add*/
					if($('.eprivacy-tooltip').length>0){
						$(self.modalPopUp).hide();
						$(".sec-section").hide();
						$('.page-cookie-view').unwrap();
						$(self.modalPopUp).removeClass('page-cookie-view');
						($(".sec-section").hasClass('visible')) ? $(".sec-section").removeClass('visible'):'';
					}
					/*LGEGMC-525 add*/
					setTimeout(function() {
						$(self.$explicit).find('.submit button.save-submit').trigger('click');
					}, 300);
				});
				/* LGEES-15 20200529 Modify */
				// reject all 
				$(self.$explicit).find('button.reject-all').on('click', function(e) { 
					e.preventDefault(); 
					$(self.$explicit).find('.detail-option-key').not('.hidden').find('.toggle-active-button button').not('.hidden').each(function() { 
						$(this).removeClass('active').find('> span').text(msgDisactive); 
						$(this).attr('title', msgDisactive); 
					}); 
					$('.eprivacy-layer').remove();
					/*LGEGMC-525 add*/
					if($('.eprivacy-tooltip').length>0){
						$(self.modalPopUp).hide();
						$('.page-cookie-view').unwrap();
					}
					/*LGEGMC-525 add*/
					setTimeout(function() { 
						$(self.$explicit).find('.submit button.save-submit').trigger('click'); 
					}, 300); 
				}); 
				/* //LGEES-15 20200529 Modify */
				/* LGEGMC-346 20200616 modify*/
				$(self.modalPopUp).find('button.reject-all,a.comment-reject-all').off('click').on('click', function(e) {
					e.preventDefault(); 
					$(self.modalPopUp).find('.detail-option-key').not('.hidden').find('.toggle-active-button button.active').not('.hidden').each(function() { 
						$(this).click(); 
					}); 
					$(self.modalPopUp).find('.submit button').eq(0).trigger('click'); 
					//$('.eprivacy-layer').remove(); 
				//	setTimeout(function() { 
				//		$(self.modalPopUp).find('.submit button').eq(0).trigger('click'); 
				//	}, 1000); 

				});
				/* //LGEGMC-346 20200616 modify*/
				// apply all
				$(self.$explicit).find('.submit button.apply-all').on('click', function(e) {
					e.preventDefault();
					$('.eprivacy-layer').remove();
					/*LGEGMC-525 add*/
					if($('.eprivacy-tooltip').length>0){
						$(self.modalPopUp).hide();
						$('.page-cookie-view').unwrap();
					}
					/*LGEGMC-525 add*/
					var obj = $(self.$explicit).find('.detail-option-key').not('.hidden').find('.toggle-active-button button').not('.hidden');
					var len = obj.length;
					var len2 = 0;
					obj.each(function() {
						if($(this).hasClass('active')) len2++;
					});
					if(len==len2) {
						obj.each(function() {
							$(this).removeClass('active').find('> span').text(msgDisactive);
						});
					} else {
						obj.each(function() {
							$(this).addClass('active').find('> span').text(msgActive);
						});
					}
				});
				// save button
				$(self.$explicit).find('.submit button.save-submit').on('click', function(e) {
					var _tmpCnt = false;
					e.preventDefault();
					$('.eprivacy-layer').remove();
                                        //LGEGMC-2239 s
					if(document.referrer.indexOf(document.domain)<0||document.referrer.indexOf("/"+self.countrycode.toLowerCase())<0){
							self.setCookie(self.countrycode+'_referrerUrl', document.referrer);
					}else if(typeof _dl.referrer !=='undefined' && _dl.referrer.indexOf(document.domain)<0){
						self.setCookie(self.countrycode+'_referrerUrl', _dl.referrer);
					}
					//LGEGMC-2239 e
					/*LGEGMC-525 add*/
					if($('.eprivacy-tooltip').length>0){
						$(self.modalPopUp).hide();
						$('.page-cookie-view').unwrap();
					}
					/*LGEGMC-525 add*/
					for(var i=0;i<self.cookies.length;i++) {
						var cookieName = self.cookies[i];
						if(self.cookies[i].indexOf('LGCOM_NECESSARY') == -1) {
							if($(self.$explicit).find('.'+self.cookies[i].replace(self.countrycode+'_', '') + ' .toggle-active-button button').hasClass('active')||$(self.$explicit).find('.'+self.cookies[i].replace(self.countrycode+'_', '') + ' .checkbox-box [type=checkbox]').hasClass('active')) { /* LGEGR-141 */
								self.setCookie(cookieName, 'Y');
							} else {
								if(geoIpType=="_explictArgee"){
									self.setCookie(cookieName, 'Y');
								}else{
									self.setCookie(cookieName, 'N');
								}
								_tmpCnt = true;
							}
						}
					}
					if(_tmpCnt && ePrivacyCookies.bannerV2 && self.countrycode.toLowerCase()!='fr' ){
						self.setSessionCookie(self.countrycode+'_eCookieOpenFlag', false);
					} else{
						self.setCookie(self.countrycode+'_eCookieOpenFlag', false);
					}
					
					if(self.cookieListURL != null) self.controlCookieList(); // for debug

					if(!DEBUG) {
						setTimeout(function() {
							location.reload();
						}, 300);
					}
				});
				/* LGEGMC-279 20200611 add*/
				$(document).find('.cookie-policy-setting button, .footer-bottom-box [data-link-name=cookie]').on('click', function(e) {
					e.preventDefault();
					/*LGEGMC-525 add*/
						if($('.eprivacy-tooltip').length>0){
						$(self.modalPopUp).hide();
						$(".sec-section").hide();
						$('.page-cookie-view').unwrap();
						$(self.modalPopUp).removeClass('page-cookie-view');
						($(".sec-section").hasClass('visible')) ? $(".sec-section").removeClass('visible'):'';
					}
					/*LGEGMC-525 add*/
					$('#modal_cookie_set').modal('show');
						$('#modal_cookie_set').not('.page-cookie-view').find(".toggle-setting-area").on('click', function(e) {
						$(".sec-section").toggleClass('more');
					});
					$('body').css('overflow', 'auto');
					if(isMobile){
						$('body').css('position','static');
					}
				})
				/* LGEGMC-279 20200611 add*/
				/* LGEGR-141 */
				$(self.$explicit).find('.detail-option-collspace button').on('click', function(e) {
					$(this).removeClass('active').siblings('button').addClass('active');
					if($(this).attr('class')=='btn-open'){
						$('#detail_desc').addClass('active')
					}else{
						$('#detail_desc').removeClass('active')
					}
				})
				/* LGEGR-141 */
			}
		},
		openCookieBanner :function() {
			var self = this;
			if($(self.$implicit).length>0) {
				$(self.$implicit).addClass('active').attr('tabindex', 0).focus();
			} else if($(self.$explicit).length>0) {
				// If there are no .toggle-setting-area buttons, the selection below should also be opened.
				if(self.isToggleBtn) $(self.$explicit).addClass('ready active').attr('tabindex', 0).focus();
				else $(self.$explicit).addClass('ready active more').attr('tabindex', 0).focus();
			}
			if($('.eprivacy-layer').length>0) $('.eprivacy-layer').remove();
			/*LGEGMC-525 add*/
			if($('.eprivacy-tooltip').length>0){
				$(self.modalPopUp).hide();
				$(".sec-section").hide();
				$('.page-cookie-view').unwrap();
				$(self.modalPopUp).removeClass('page-cookie-view');
				($(".sec-section").hasClass('visible')) ? $(".sec-section").removeClass('visible'):'';
			}
			/*LGEGMC-525 add*/
		},
		oldCookie : '',
		removeCookie : function (name, mydomain, mypath, httpOnly, secureFlag) {
			if(httpOnly != 'Y') {
				if(ePrivacyCookies.oldCookie != 'name') {
					ePrivacyCookies.oldCookie = name;
					var domain = {
						path: mypath,
						domain: mydomain
					};
					if(secureFlag=='Y') {
						domain.secure = true;
					}
					if(mydomain == '.lg.com' || mydomain == 'lg.com' || mydomain == '.lge.com' || mydomain == 'lge.com') {
						// true
						/* LGEUK-114 20200722 modify */
						if(getCookie(name) && getCookie(name) != '' || getCookie(name) != 'undefined') {
						/*// LGEUK-114 20200722 modify */
							var r1 = $.removeCookie(name, domain);
							if(DEBUG) console.log('- ', name, domain, ' ... ', 'same - ', r1, '... check ... ', (!getCookie(name) ? 'no-cookie' : getCookie(name)));
						} else {
							if(DEBUG) console.log('%c- '+name+' ... '+'same - '+'no-cookie', 'color: #999');
						}
					} else if(window.location.hostname == mydomain || mydomain == 'www.lg.com') {
						if(getCookie(name) && getCookie(name) != '') {
							var r2 = $.removeCookie(name, {path: mypath});
							if(DEBUG) console.log('- ', name, ' ... ', 'path only ('+mypath+') - ', r2, '... check ... ', (!getCookie(name) ? 'no-cookie' : getCookie(name)));
						} else {
							if(DEBUG) console.log('%c- '+name+' ... '+'path only - '+'no-cookie', 'color: #999');
						}
					} else {
						// fail
						var d = new Date();
						d.setDate(d.getDate() - 1);
						document.cookie = name + "=" + ";expires=" + d.toGMTString() + "; path="+mypath+"; domain=" + mydomain + "";
						if(DEBUG) console.log('- ', name, domain, d.toGMTString(), '... check ... ', (!getCookie(name) ? 'no-cookie' : getCookie(name)));
					}
				}
			}
		},
		controlCookieList : function() {
			var self = this;
			var url = self.cookieListURL;
			if(window.location.href.indexOf('/oauth/') >=0) {
				// signin page
				$.ajax({
					type:"post",
					url: url,
					dataType: "json",
					xhrFields: {
						withCredentials: true
					},
					//jsonp: "callback",
					success: function(data) {
						ePrivacyCookies.checkRemoveCookie(data);
						// LGEITF-182 Start
						if(data.data[0].treasureDataFlag){
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
				// others
				ajax.call(url, {pageUrl: window.location.pathname}, 'json', function(data){
					ePrivacyCookies.checkRemoveCookie(data);
					
					// LGEITF-182 Start
					if(data.data[0].treasureDataFlag){
						treasureDataFlag = data.data[0].treasureDataFlag;
					}
					// LGEITF-182 End
				});
			}
		},
		checkRemoveCookie : function(data) {
			if(DEBUG) console.log('check Cookies ...');
			if(data) {
				var cookieList = data.data[0];
				if(DEBUG) console.log('%c -- Start -- ', 'color: #fff; background: #000; font-size:24px;');
				for(var key in cookieList) {
					// 20200317 START 박지영 : 중복 변수 수정 등
					var category = 'LGCOM_'+key.toUpperCase();
					// 20200610 START 박지영 - IE main 에서 path 추가된 쿠키 잘 안 읽히는 case 예외 처리 
					if((category!='LGCOM_HOMEUSECOOKIELIST' && category!='LGCOM_PIXELURLFLAG' && category!='LGCOM_NECESSARY' && !ePrivacyCookies.get(category)) || DEBUG) { // = false or DEBUG mode
					// 20200610 END
						// remove the cookie list
						if(DEBUG) console.log('%c'+category+'', 'color: #008000; font-size:12px; font-weight:bold;');
						var len = cookieList[key].length;
						for(var i=0;i<len;i++) {
							var name = cookieList[key][i].cookieName;
							if(name && name.indexOf('_LGCOM_') == -1 && name.indexOf('eCookieOpenFlag') == -1 && name.indexOf('agreeCookie') == -1) {
								if(name.indexOf('**') >= 0) {
									var dc = document.cookie.split(';');
									for(var j=0;j<dc.length;j++) {
										var n = document.cookie.split(';')[j].split('=')[0];
										if(n.indexOf(name.replace('**', '')) >= 0) {
											//console.log(n, name, '--', name.replace('**', ''), '--', n.indexOf(name.replace('**', '')));
											ePrivacyCookies.removeCookie(n, cookieList[key][i].cookieDomain, cookieList[key][i].path, cookieList[key][i].httpOnlyFlag, cookieList[key][i].secureFlag);
										} else {
											// none
											//ePrivacyCookies.removeCookie(name, cookieList[key][i].cookieDomain, cookieList[key][i].path, cookieList[key][i].httpOnlyFlag, cookieList[key][i].secureFlag);
										}
									}
								} else {
									ePrivacyCookies.removeCookie(name, cookieList[key][i].cookieDomain, cookieList[key][i].path, cookieList[key][i].httpOnlyFlag, cookieList[key][i].secureFlag);
								}
							}
						}
					}
				// 20200317 END
				}
				if(DEBUG) console.log('%c -- END -- ', 'color: #fff; background: #000; font-size:12px;');
				/* LGEIS-10 20200330 LGEMS-12 20200423 modify*/
				if(cookieList.pixelUrlFlag.pixelUrlFlag && cookieList.pixelUrlFlag.pixelUrlFlag == 'Y') {
					if(ePrivacyCookies.get('LGCOM_ADVERTISING')) {
						USE_FBQ = true;
						if(typeof cookieList.pixelUrlFlag.pixelUrlType!='undefined'&& cookieList.pixelUrlFlag.pixelUrlType!=''){
							USE_NEW_FBQ = cookieList.pixelUrlFlag.pixelUrlType;
						}else{
							USE_NEW_FBQ = '';
						}
					} else {
						USE_FBQ = false;
						USE_NEW_FBQ = '';
					}
				} else {
					USE_FBQ = false;
					USE_NEW_FBQ = '';
				}
				/* //LGEIS-10 20200330,LGEMS-12 20200423 modify*/
				// 20200611 START 박지영 - IE main 에서 path 추가된 쿠키 잘 안 읽히는 case 예외 처리 

				if(cookieList.homeUseCookieList !== undefined) {
					var clist = cookieList.homeUseCookieList;
					addHomeCookie(clist);
				}
				// 20200611 END
			}
		}
	};
	/*BTOBGLOBAL-41 20200422 modify*/
	//ePrivacyCookies.init();
	if(($(ePrivacyCookies.$implicit).length>0 && $(ePrivacyCookies.$explicit).length>0) || ePrivacyCookies.bannerV2){
		ePrivacyCookies.geoIpEu();
	}else{
		ePrivacyCookies.init();
	}
	/*BTOBGLOBAL-41 20200422 modify*/
	
	

	// 아래 2개 함수는 GTM에 정의되어 있는 함수인데, 쿠키 셋팅에 따라 실행되지 않도록 변경함
	if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_ADVERTISING')) {
	} else {
		fbq = function() {
			if(DEBUG) console.log('fbq is not working');
			return false;
		};
		ttdWTB = function() {
			if(DEBUG) console.log('ttdWTB is not working');
			return false;
		};
	}

	// GP Modify | 2019-12-23 | GR | wonyeop
	var cookieAnimation = {
		$button : null,
		$banner : null,
		init : function(){
			this.$button = $('[data-cookie-object=button]');
			this.$banner = $('#eprivacyCookie');
			this.event();
		},
		event : function(){
			var self = this;
			this.$button.on('click', function(){
				$('html, body').stop().animate({scrollTop : 0}, 300, function(){
					self.$banner.addClass('active');
				});
			});
		}
	};
	cookieAnimation.init();
	// GP Modify | 2019-12-23 | GR | wonyeop
});
