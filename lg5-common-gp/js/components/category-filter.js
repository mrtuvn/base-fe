var filter, plp, filter2, plp2;
function initWhiteSpace(){
	(function(){
		
		// 2020.10.06 PJTPLP
		if($('.GPC0007').length>0) {
			var $objGroup = $('.GPC0007').find('.model-group');
			$objGroup.each(function() {
				var _this = $(this);
				var obj_ea = _this.find('a').length;
				var group_width = $objGroup.width();
				var obj_width = _this.find('a').outerWidth(true);
				var obj_etc = (obj_ea - 1) * 4; // LGETW-256 : margin 값 계산 수정
				if(obj_ea * obj_width + obj_etc > group_width){
					_this.addClass('limited');
					if(!_this.find('button').hasClass('btn-limited')){
						_this.append('<button class="btn-limited">'+ '(' + obj_ea + ')' +'</button>')
						_this.find('button').on('click', function(e){
							if ($(window).width() < 768){
								_this.toggleClass('open');
								if(_this.hasClass('open')){
									$('.model-group').removeClass('open')
									_this.addClass('open');
								} else{
									_this.removeClass('open');
								}
							}
						});
					}
				} else{
					_this.removeClass('limited');
					_this.find('.btn-limited').remove();
				}
			});
		}
		
		// review btn Action Add (view all or view more)
		if($('.GPC0026 .list-box .btn-popup-review').length > 0){
			var $reviewBtn = $(document).find('[data-review-event-click]');
			$reviewBtn.on('click', function(e) {
				var $obj = $(this);
				var productId = $obj.attr('data-review-model-id');
				var model = $obj.attr('data-review-model-id');
				var eventType = $obj.attr('data-review-event-click');
				switch(eventType){
				case 'BV' :
					e.preventDefault();
					$BV.ui('rr','submit_review', {productId : model});
					break;
				case 'LGCOM' :
					 writeReview.init($obj);
					break;
				case 'SP' :
					break;
				case 'CENEO' :
					break;
				default :
					break;
				}
			});
		}
		//LGEBR-747
		(function($){
			var $tmpl = $('#pdpFloatingIconTemplate');
			$tmpl.length && $($tmpl[0].innerHTML).find('.btn-whatsapp').click(function(e){
				var $this = $(this);
				var btnLink = $this.data('float-btn-link');
				btnLink && openWin(btnLink, '', $this.data('width') , $this.data('height'));
			}).end().appendTo('body').show();
		}(jQuery));
		//LGEBR-747
		if(isMobile && $('.GPC0076-whatsapp').length > 0){
			$('.GPC0076-whatsapp').remove();
		}
		var $snsArea = $('.pd-share');
		$snsArea.find('.sns').off().on('click', function(e){
			e.preventDefault();
			var $snsLayer = $(this).parents('.pd-share').find('.list');
			if($snsLayer.hasClass('active')) {
				$snsLayer.removeClass('active');
			} else {
				$('.pd-share').find('.list').removeClass('active');
				$snsLayer.addClass('active');
			}
			
		});
		$snsArea.find('.plp-snsClose button').off().on('click', function(e){
			e.preventDefault();
			$snsArea.find('.list').removeClass('active');
		});
		
		
		if($('.GPC0026').length > 0) {
			initShareCommon();
		}
		
		if($('#result-box-aria').length > 0) {
			var winW = $(window).width();
			setTimeout(function() {
				if(winW < 769 && $(".product-list-box").hasClass('rows')){
					var _this = $('.model-buy');
					$.each(_this, function (i) {
						if(_this.eq(i).find(".price-area").css('height') === "0px" && _this.eq(i).find(".price-vip-Installment").css('height') === "0px" && _this.eq(i).find(".stock-area").css('height') === "0px"){
							$(this).hide();
						} else{
							if(_this.eq(i).find(".promotion-text").length == 0 && _this.eq(i).find(".promotion-text").css('height') === "0px") {
								$(this).hide();
							} else {
								$(this).show();
							}
						}
					})
				} else{
					$(".model-buy").show();
				}
			}, 100);
		}
		
		
		$('[data-category-id]').each(function(){
			var categoryId = $(this).attr('data-category-id');
		 	var tagVal =  $(this).attr('data-tag-content-area-yn');
		 	var modelVal =  $(this).attr('data-model-brand-area-yn');
		 	var promotionVal =  $(this).attr('data-promotion-area-yn');
		 	var priceVal =  $(this).attr('data-price-area-yn');
		 	var reviewVal =  $(this).attr('data-review-area-yn');
			var energyVal =  $(this).attr('data-energy-fiche-yn');
			var siblingVal = $(this).attr('data-sibling-area-yn');
			var campaignVal = $(this).attr('data-campaign-area-yn');
			var emiVal = $(this).attr('data-emi-msg-area-yn');
			var emiUseFlag = $(this).attr('data-emi-use-flag');
			//LGEGMC-1406 
			var specMsgVal = $(this).attr('data-spec-msg-flag-area-yn');
			//PJTLIMITQTY_EXTEND
			var limitSaleAreaVal = $(this).attr('data-limitSale-area-yn');
			var limitSaleUseFlag = $(this).attr('data-limitSale-use-flag');
			//PJTLIMITQTY_EXTEND
			var selector = '[categoryId="{{categoryId}}"]'.replace('{{categoryId}}' ,categoryId);
		 	if(tagVal == 'N'){
		 		$(selector).find("[data-white-type='tagContentAreaYn']").remove();
		 	}
		 	if(modelVal == 'N'){
		 		$(selector).find("[data-white-type='modelBrandAreaYn']").remove();
		 	}
		 	if(priceVal == 'N'){
				if(priceVal == 'N' && promotionVal == 'N'){
					$(selector).find("[data-white-type='priceAreaYn']").remove();
				}
				if(priceVal == 'N' && promotionVal == 'Y' ){
					$(selector).find("[data-white-type='priceAreaYn']").find('.price-area').remove();
					$(selector).find("[data-white-type='priceAreaYn']").addClass('only-prm');
				}
			}
			if(priceVal == 'Y'){
				if(priceVal == 'Y' && promotionVal == 'N'){
					$(selector).find("[data-white-type='promotionAreaYn']").remove();
				}
			}
		 	if(reviewVal == 'N'){
		 		$(selector).find("[data-white-type='reviewAreaYn']").remove();
		 	}
		 	if(energyVal == 'N'){
		 		$(selector).find("[data-white-type='energyFicheAreaYn']").remove();
			 }
			 if(siblingVal == 'N'){
		 		$(selector).find("[data-white-type='siblingAreaYn']").remove();
			 }
		 	if(campaignVal == 'N') {
		 		$(selector).find("[data-white-type='campaignAreaYn']").remove();
		 	}
		 	
		 	//LGEGMC-1406
		 	if(specMsgVal == 'N') {
		 		$(selector).find("[data-white-type='specMsgFlagAreaYn']").remove();
		 	}
		 	
		 	var $modelButtonEl = $(selector).find('.products-info .model-button .button');
			$modelButtonEl.addClass('only-button');
			$modelButtonEl.each(function(){
				if($(this).find('a.active').length > 1){
					$modelButtonEl.removeClass('only-button');
					return;
				}
			});
			
			var $modelBuy = $(selector).find("[data-white-type='priceAreaYn']");
			if((emiVal == 'Y' && emiUseFlag== 'Y') || (limitSaleAreaVal == 'Y' && limitSaleUseFlag == 'Y')){
				$(selector).find("[data-white-type='priceAreaYn']").addClass('has-topInfo');
			}
		 	
	 	});
	})();
	var $item_width = $('.list-box').find('li > .item').outerWidth();
	if ($(window).width() < 767 || isMobile){
		$('.pd-share').find('.list').addClass('mobileSns');
	} else{
		$('.pd-share').find('.list').css('width', $item_width);
		$('.pd-share').find('.list').removeClass('mobileSns');
	}
	
	//<#-- PJTMEMBERSHIP-1 START -->
	if($('.GPC0007 [data-membership-display-flag=Y]').length > 0){
		$('.GPC0007 .model-buy').addClass('has-member');
	}
}
$(document).ready(function(){

	// GPC0007 + GPC0134의 경우 처리를 위한 추가 조건 및 세팅
	if($("#result-box-aria").length > 0) {
		if(!document.getElementById('categoryCurFilterForm')) return false;
		// PLP + Curation Page share 관련하여 filter logic 안 타게 변경
		setCookie('LG5_filter', '');
	}
	
	if($("#categoryFilterForm").length > 0) {
		if(!document.getElementById('categoryFilterForm')) return false;
	}

	var removeTxt = $('.apply-filters').attr('data-title-close') ? $('.apply-filters').attr('data-title-close') : 'remove';

	// page history
	var pageHistory = {
		usePage: false,
		cookieName: 'LG5_PageHistory',
		getHistory: function() {
			return getCookie(pageHistory.cookieName);
		},
		setHistory: function(va) {
			// view all, pageing
			if(pageHistory.usePage) {
				var cookieText;
				if(va=='view-all') {
					cookieText = location.pathname + '=viewAll';
				} else {
					//cookieText = location.pathname + '=' + $(filter.el).find('input[type=hidden][name=page]').val();
					// Use for PJTCUR-3
					if($("#result-box-aria").length > 0) {
						cookieText = location.pathname + '=' + $(filter2.el).find('input[type=hidden][name=page]').val();
					}
					if($("#categoryFilterForm").length > 0) {
						cookieText = location.pathname + '=' + $(filter.el).find('input[type=hidden][name=page]').val();
					}
				}
				if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
					setCookie(pageHistory.cookieName, cookieText);
				}
			}
		},
		removeHistory: function() {
			// reset, filter chane, sort
			if(pageHistory.usePage) {
				if(pageHistory.getHistory()) {
					removeCookie(pageHistory.cookieName);
				}
			}
		},
		runHistory: function() {
			if(pageHistory.usePage) {
				var ctext = pageHistory.getHistory();
				if(!!ctext) {
					var cookiePath = ctext.split(','),
						cate,
						page;
					for(var key in cookiePath) {
						cate = cookiePath[key].split('=')[0];
						page = cookiePath[key].split('=')[1];
					}
					if(cate==location.pathname) {
						if(page=='viewAll') {
							if($("#categoryFilterForm").length > 0) {
								$(filter.el).find('input[type=hidden][name=viewAll]').val('Y');
								$(filter.el).find('input[type=hidden][name=page]').val('viewAll');
							}
							// Use for PJTCUR-3
							if($("#result-box-aria").length > 0) {
								$(filter2.el).find('input[type=hidden][name=viewAll]').val('Y');
								$(filter2.el).find('input[type=hidden][name=page]').val('viewAll');
							}
							//setTimeout(function() {
								//$('#resultProductList .result-info a.view-all').click();
							//}, 500);
						} else {
							if(typeof Number(page) == 'number') {
								if($("#categoryFilterForm").length > 0) {
									$(filter.el).find('input[type=hidden][name=page]').val(page);
								}
								// Use for PJTCUR-3
								if($("#result-box-aria").length > 0) {
									$(filter2.el).find('input[type=hidden][name=page]').val(page);
								}
							}
							//setTimeout(function() {
							//	if(typeof Number(page) == 'number') {
									//$('#resultAppendTarget .pagination ul li').eq(page-1).find('button').click();
							//	}
							//}, 500);
						}
					} else {
						pageHistory.removeHistory();
					}
				}
			}
		},
		init: function() {
			// Runs in GPC0007 component only
			if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
				if($('.GPC0007').length>0) {
					pageHistory.usePage = true;
				}
			}
		}
	};
	pageHistory.init();

	if($('[name=bundlesOnly]').length>0 && $('[name=bundlesOnly]').parent().find('.filter-cnt').text()=='(0)') {
		$('[name=bundlesOnly]').prop('disabled', true);
	}
	if($('[name=promotionsOnly]').length>0 && $('[name=promotionsOnly]').parent().find('.filter-cnt').text()=='(0)') {
		$('[name=promotionsOnly]').prop('disabled', true);
	}
	if($('[name=obsOnly]').length>0 && $('[name=obsOnly]').parent().find('.filter-cnt').text()=='(0)') {
		$('[name=obsOnly]').prop('disabled', true);
	}
	
	if($("#categoryFilterForm").length > 0) {
	// filter box function
	filter = {
		el: document.getElementById('categoryFilterForm'),
		result: document.getElementById('resultAppendTarget'),
		template: null,
		pageTemplate: null,
		banner: document.querySelector('.result-box .banner-box'),
		initial: null,
		// filter box folding script
		ui: {
			el: {
				open: document.querySelector('.filter-open-box'),
				close: document.querySelector('.filter-result'),
				fieldset: null
			},
			init: function(){
				initWhiteSpace();
				var _this = filter.ui.el;
				// 20200325 START 박지영 : fieldset 대신 클래스명으로 변경
				_this.fieldset = filter.el.querySelectorAll('.option-box');
				// 20200325 END
				
				$(_this.open).on({
					click: function(e){
						e.preventDefault();
						if(!$(filter.el).is(':visible')){ 
							$(filter.el).addClass('open'); 
							$(this).hide();
							$(_this.close).find('a').focus();
							/* 20191002 : LGEUS-12351 add */ 
							if($(".GPC0007").length > 0){ 
							$(".GPC0007 .filter-open-floating").addClass("no-floating"); 
							} 
							/* //20191002 : LGEUS-12351 add */ 
							// LGEGMC-526
							if($(".GPC0026").length > 0){
								$(".GPC0026 .filter-open-floating").addClass("no-floating");
							}
							// LGEGMC-526 End
							// PJTPROCOM-3
							
						}else{ 
							$(filter.el).hide();
						}
					}
				});
				$(_this.close).on({
					click: function(e){
						e.preventDefault();
						var state = $(filter.el).css('display');
						if($(filter.el).is(':visible')){ 
							$(filter.el).removeClass('open'); 
							$(_this.open).show();
							$(_this.open).find('a').focus();
							/* 20191002 : LGEUS-12351 add */ 
							if($(".GPC0007").length > 0){ 
							$(".GPC0007 .filter-open-floating").removeClass("no-floating"); 
							} 
							/* //20191002 : LGEUS-12351 add */ 
							// LGEGMC-526
							if($(".GPC0026").length > 0){
								$(".GPC0026 .filter-open-floating").removeClass("no-floating");
							}
							// LGEGMC-526 End
							// PJTPROCOM-3
						}
					}
				});
				// fieldset folding script
				$(_this.fieldset).on({
					click: function(e){	
						e.preventDefault();
						var parent_box = e.delegateTarget;
						if ($(parent_box).is(".open")){
							$(parent_box).removeClass("open").addClass("close");
							$(e.currentTarget).attr('aria-expanded', false);
						} else {
							$(parent_box).removeClass("close").addClass("open");
							$(e.currentTarget).attr('aria-expanded', true);
						}
					}
				}, '.btn-list');
				/* 20191002 : LGEUS-12351 add */ 
				if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
					if($(".GPC0007").length > 0 || $(".GPC0026").length > 0){ 
						var	filterLine = parseInt( $(".GPC0007, .GPC0026").find(".product-list-box").offset().top );
						var filterTopLine = parseInt( $(".GPC0007, .GPC0026").offset().top );
						$(window).on("resize", function(){
							filterLine = parseInt( $(".GPC0007, .GPC0026").find(".product-list-box").offset().top );
							return filterLine;
						});	
						$(window).on('load scroll', function(){
							filterLine = parseInt($(".GPC0007, .GPC0026").find(".product-list-box").offset().top );
							var scrollPos =  $(window).scrollTop();
							var isFilterFloating = false;
							if($(".GPC0007 .filter-open-floating").length>0 && !$(".GPC0007 .filter-open-floating").attr("class").match("no-floating") ||
							   $(".GPC0026 .filter-open-floating").length>0 && !$(".GPC0026 .filter-open-floating").attr("class").match("no-floating")) {
								isFilterFloating = true;
							}
							if(scrollPos >= parseInt(filterLine) && isFilterFloating){
								if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
									$(".GPC0007, .GPC0026").find('.filter-open-floating').removeClass("float-fix").addClass("float-active");
									if($(".eprivacy-cookie").hasClass('cookie-eu') && $('.cookie-banner').hasClass('ready') && ($('html').attr('data-countrycode') == 'uk' || $('html').attr('data-countrycode') == 'fr' || $('html').attr('data-countrycode') == 'nl' || $('html').attr('data-countrycode') == 'be_fr')){
										if($('.eprivacy-cookie').css('display') == 'none' ){
											$(".cookie-eu-get-height").css("height","0");
											$(".filter-open-floating").removeClass('hasCookie');
										} else{
											$(".filter-open-floating").addClass('hasCookie');
										}
									} else {
										$(".filter-open-floating").removeClass('hasCookie');
									}
								}
							}else{
								if ($(".GPC0007 #categoryFilterForm, .GPC0026 #categoryFilterForm").attr("class").match("open")) {
									$(".GPC0007, .GPC0026").find('.filter-open-floating').addClass("no-floating");
								} else {
									$(".GPC0007, .GPC0026").find('.filter-open-floating').removeClass("float-active");
								}
							}
						});
						$(".GPC0007 .filter-open-floating .floating-filter").on({
							click:function(e){
								e.preventDefault();
								if($(this).attr("class").match("active")){
									$(this).removeClass("active");
									$(".GPC0007 #categoryFilterForm").removeClass("open");
									$('.GPC0007 .filter-open-box').css("display","block");
									$(".GPC0007 .filter-open-floating").removeClass("no-floating");
									$(".GPC0007 .result-box .sort-box").css("display","block");
									$(".filter-box .float-filter-result").css("display","none");
									$(".filter-box .filter-result").css("display","block");
									filterTopLine = parseInt( $(".GPC0007").offset().top );
									$(window).scrollTop(filterTopLine);
								}else{
									$(this).addClass("active");
									$(".GPC0007 #categoryFilterForm").addClass("open");
									$('.GPC0007 .filter-open-box').css("display","none");
									$(".GPC0007 .filter-open-floating").addClass("no-floating");
									$(".GPC0007 .result-box .sort-box").css("display","none");
									$(".filter-box .float-filter-result").css("display","block");
									$(".filter-box .filter-result").css("display","none");
									filterTopLine = parseInt( $(".GPC0007").offset().top );
									$(window).scrollTop(filterTopLine);
								}
							}
						});

						// LGEGMC-526
						$(".GPC0026 .filter-open-floating .floating-filter").on({
							click:function(e){
								e.preventDefault();
								if($(this).attr("class").match("active")){
									$(this).removeClass("active");
									$(".GPC0026 #categoryFilterForm").removeClass("open");
									$('.GPC0026 .filter-open-box').css("display","block");
									$(".GPC0026 .filter-open-floating").removeClass("no-floating");
									$(".GPC0026 .result-box .sort-box").css("display","block");
									$(".filter-box .float-filter-result").css("display","none");
									$(".filter-box .filter-result").css("display","block");
									filterTopLine = parseInt( $(".GPC0026").offset().top );
									$(window).scrollTop(filterTopLine);
								}else{
									$(this).addClass("active");
									$(".GPC0026 #categoryFilterForm").addClass("open");
									$('.GPC0026 .filter-open-box').css("display","none");
									$(".GPC0026 .filter-open-floating").addClass("no-floating");
									$(".GPC0026 .result-box .sort-box").css("display","none");
									$(".filter-box .float-filter-result").css("display","block");
									$(".filter-box .filter-result").css("display","none");
									filterTopLine = parseInt( $(".GPC0026").offset().top );
									$(window).scrollTop(filterTopLine);
								}
							}
						});
						// LGEGMC-526 End
						
						// PJTPROCOM-3
						
						// PJTPROCOM-3 End
						
						$('.GPC0007 .filter-open-floating .float-sort-box .sort-select .sortBy').on({
							change: function(e){
								if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
									var _this = e.currentTarget;
									var sort = _this.options[_this.selectedIndex].value;
									var sortTxt = changeTitleFormat($(this).find('option').eq(_this.selectedIndex).text());
									plp.el.form.sort.value = sort;
									plp.el.form.page.value = 1;
									/* BTOBGLOBAL-434 : 20210408 add */
									if(COUNTRY_CODE.toLowerCase()=='global' && $('.navigation').hasClass('b2b') && isMobile){
										filter.result.querySelector('.expander button').value = 2;
									}
									/*// BTOBGLOBAL-434 : 20210408 add */
									pageHistory.removeHistory();
									$(plp.el.form).submit();
									$('.GPC0007 .filter-open-floating .floating-filter').removeClass("active");
									$(".GPC0007 #categoryFilterForm").removeClass("open");
									$('.GPC0007 .filter-open-box').css("display","block");
									$(".GPC0007 .filter-open-floating").removeClass("no-floating");
									$(".GPC0007 .result-box .sort-box").css("display","block");
									$(".filter-box .float-filter-result").css("display","none");
									$(".filter-box .filter-result").css("display","block");
									$('.result-box .sort-box .sort-select').find('select option[value="'+sort+'"]').prop("selected",true);
									$('.result-box .sort-box .sort-select').find('.chosen-single span').text($(this).find('option').eq(_this.selectedIndex).text());
									$('html, body').animate({
										scrollTop: $(plp.el.scrollTarget).closest('.component').offset().top
									}, 500);
									adobeTrackEvent('product-list-sort', {sort_option : sortTxt, page_event : {product_sort : true}});
								} else {
									ePrivacyCookies.view('click');
								}
							}
						});

						// LGEGMC-526
						$('.GPC0026 .filter-open-floating .float-sort-box .sort-select .sortBy').on({
							change: function(e){
								if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
									var _this = e.currentTarget;
									var sort = _this.options[_this.selectedIndex].value;
									var sortTxt = changeTitleFormat($(this).find('option').eq(_this.selectedIndex).text());
									plp.el.form.sort.value = sort;
									plp.el.form.page.value = 1;
									/* BTOBGLOBAL-434 : 20210408 add */
									if(COUNTRY_CODE.toLowerCase()=='global' && $('.navigation').hasClass('b2b') && isMobile){
										filter.result.querySelector('.expander button').value = 2;
									}
									/*// BTOBGLOBAL-434 : 20210408 add */
									pageHistory.removeHistory();
									$(plp.el.form).submit();
									$('.GPC0026 .filter-open-floating .floating-filter').removeClass("active");	
									$(".GPC0026 #categoryFilterForm").removeClass("open");
									$('.GPC0026 .filter-open-box').css("display","block");
									$(".GPC0026 .filter-open-floating").removeClass("no-floating");
									$(".GPC0026 .result-box .sort-box").css("display","block");
									$(".filter-box .float-filter-result").css("display","none");
									$(".filter-box .filter-result").css("display","block");
									$('.result-box .sort-box .sort-select').find('select option[value="'+sort+'"]').prop("selected",true);
									$('.result-box .sort-box .sort-select').find('.chosen-single span').text($(this).find('option').eq(_this.selectedIndex).text());
									$('html, body').animate({
										scrollTop: $(plp.el.scrollTarget).closest('.component').offset().top
									}, 500);
									adobeTrackEvent('product-list-sort', {sort_option : sortTxt, page_event : {product_sort : true}});
								} else {
									ePrivacyCookies.view('click');
								}
							}
						});
						// LGEGMC-526 End
						
						// PJTPROCOM-3
						
						// PJTPROCOM-3 End
					} 
				}
				/* //20191002 : LGEUS-12351 add */ 
			}
		},
		// jquery ui slider field function
		slider: {
			el: null,
			value: null, // Array inputed in filter markup
			init: function(){
				var _this = filter.slider;
				_this.value = dragbarVal;
				_this.el = filter.el.querySelectorAll('.slider-wrap');
				
				for (var i = 0; i < _this.el.length; i++) {
					var __this = _this.el[i];
					var range = __this.querySelector('.slider-range'),
						matchArray = _this.value[__this.getAttribute('data-value')],
						max = matchArray.length-1;

					$(range).data('matchArray', matchArray)
						.slider({
							range: true,
							min: 0,
							max: max,
							values: [0, max],
							slide: _this.slide,
							change: _this.change,
						}).data("ui-slider")._slide();

					// 2019-11-11 : added for accessiblity
					$(range).find('.ui-slider-handle').eq(0).attr('aria-label', range.getAttribute('data-min'));
					$(range).find('.ui-slider-handle').eq(1).attr('aria-label', range.getAttribute('data-max'));
					// 2019-11-11 : added for accessiblity end
				}
			},
			slide: function( event, ui ) {
				// 20200311 START 박지영 Slider에서 같은 값 선택 가능하도록 수정
				//if(ui.values[0] == ui.values[1]) return false;
				// 20200311 END

				// 20200406 START 박지영 : 둘다 Min 혹은 둘다 Max를 선택할 수 없도록 수정
				var num = $(this).data('matchArray').length - 1;
				if(ui.values[0]==0 && ui.values[1] == 0) return false;
				if(ui.values[0]==num && ui.values[1] == num) return false;
				// 20200406 END

				if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')||COUNTRY_CODE.toLowerCase()=='es'|| COUNTRY_CODE.toLowerCase()=='uk') {

					// 20200311 START 박지영 Slider에 aria-valuemin, aria-valuemax, aria-valuenow 추가
					var $wrap = $(this).parents('.slider-wrap'),
						_matchArray = $(this).data('matchArray'),
						minKey = Object.keys(_matchArray[ui.values[0]]),
						maxKey = Object.keys(_matchArray[ui.values[1]]),
						min = Object.keys(_matchArray[1]),
						max = Object.keys(_matchArray[_matchArray.length-2]);

					var box = {
						$min: $wrap.find('.min-box'),
						$max: $wrap.find('.max-box')
					};

					box.$min.find('span').text(minKey);
					box.$max.find('span').text(maxKey);
					$wrap.find('.ui-slider-handle').eq(0).attr('aria-valuetext',minKey).attr('aria-valuemin', min).attr('aria-valuemax', max).attr('aria-valuenow', minKey);
					$wrap.find('.ui-slider-handle').eq(1).attr('aria-valuetext',maxKey).attr('aria-valuemin', min).attr('aria-valuemax', max).attr('aria-valuenow', maxKey);
					// 20200311 END
					box.$min.find('input').val(_matchArray[ui.values[0]][minKey]);
					box.$max.find('input').val(_matchArray[ui.values[1]][maxKey]);

				} else {
					return false;
				}
			},
			change: function(event, ui){
				$(this).trigger('change', [ui]);
			},
			setSlider: function(){
				var _this = filter.slider;
				if($(_this.el).is('div')) {
					for (var i = 0; i < _this.el.length; i++) {
						var __this = _this.el[i],
							__range = $(__this).find('.slider-range');

						var valueIndex = {
							min: $(__this).find('.min-box input').data('index'),
							max: $(__this).find('.max-box input').data('index')
						};
						valueIndex = {
							min: valueIndex.min ? valueIndex.min : 0,
							max: valueIndex.max ? valueIndex.max : $(__range).slider("option", "max")
						};
						$(__this).find('.slider-range')
							.slider('values', [valueIndex.min, valueIndex.max]).data("ui-slider")._slide();
					}
				}
			},
			indexOfValue: function(arr, val){
				for (var i = 0; i < arr.length; i++) {
					var _obj = arr[i];
					for(var key in _obj) {
						if(_obj[key] == val) {
							return i;
						}
					}
				}
			}
		},
		// auto field save
		cookie: {
			name: 'LG5_filter',
			cont: null,
			bake: function(param){
				var _this = filter.cookie;
				var page = location.pathname;
				// Remove unnecessary fields before baking cookies
				param = param.replace(/\&/g,'|').replace(/\=/g,':');
				
				var paramArray = param.indexOf('|') > -1 ? param.split('|') : [param];
				var i = 0;
				while ( i < paramArray.length) {
					var _param = paramArray[i];
					if(_param.split(':')[1] == '' || _param.split(':')[1] == undefined) {
						paramArray.splice(i, 1);
					}else {
						i++;
					}
				}

				if(!_this.cont) {
					_this.cont = [];
				}

				var mergeParam = paramArray.join("|"),
					ac = page+'='+mergeParam,
					idx = _this.returnData();

				if(mergeParam != "") {
					if(idx >= 0) {
						_this.cont[idx] = ac;
					}else {
						_this.cont.push(ac);
					}
				}else {
					if(idx >= 0) {
						_this.cont.splice(idx, 1);
					}
				}

				if(_this.cont.join('') == "") {
					removeCookie(_this.name, true);
				}else {
					/*LGEES-15 modify*/
					if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS') ||COUNTRY_CODE.toLowerCase()=='es') {
						setCookie(_this.name, _this.cont.join(','), true);
					}
				}
			},
			get: function(){
				var _this = filter.cookie;
				var ac = getCookie(_this.name) ? getCookie(_this.name) : [];
				if(ac !== undefined) {
					ac = ac.indexOf(',') > -1 ? ac.split(',') : [ac];
					_this.cont = ac;
					var idx = _this.returnData();
					if(idx >= 0) {
						ac = ac[idx].split('=')[1];
						return ac;
					}
				}
			},
			returnData: function(){
				var _this = filter.cookie;
				var page = location.pathname;
				if(_this.cont) {
					var idx = -1;
					for (var j = 0; j < _this.cont.length; j++) {
						var c = _this.cont[j];
						if(c.indexOf(page) >= 0) {
							idx = j;
							break;
						}
					}
					return idx;
				}
			},
			reset: function(){
				var _this = filter.cookie;
				_this.bake('');
			}
		},
		init: function(){
			filter.initial = $(filter.el).serialize();
			filter.template = $('#productTemplate').clone().html();
			
			// 2020.10.06 PJTPLP WhiteSpace
			if($('.GPC0007').length>0 ||$('.GPC0026').length>0) {
				filter.labelUseFlag = $('#whiteSpaceFlag').attr('data-label-use-flag');
				filter.useLabelIcon = $('#whiteSpaceFlag').attr('data-use-label-icon');
				filter.reviewType   = $('#reviewDefaultData').attr('data-reviewtype');
				// 2021.03.11 PJTCUR add start
				filter.resultType   = $('#whiteSpaceFlag').attr('data-resultType');
				// 2021.03.11 PJTCUR add end
				filter.loginUseFlag = $('#reviewDefaultData').attr('data-login-use-flag');
				filter.reviewLoginUrl = $('#reviewDefaultData').attr('data-review-login-url');
				filter.dataCheck      = $('#reviewDefaultData').attr('data-check');
				filter.domain		 = $('#reviewDefaultData').attr('data-domain');
			}
			filter.pageTemplate = $('#paginationTemplate').clone().html();
			$('#productTemplate').remove();
			$('#paginationTemplate').remove();

			filter.ui.init(); // mobile ui events setting

			if(typeof dragbarVal != 'undefined') {
				filter.slider.init();
			}

			if(typeof filter.el.length == "object") {
				var itemLength;
				if(isMobile) {
					itemLength = filter.el.length.getAttribute('data-mobile');
				}else {
					itemLength = filter.el.length.getAttribute('data-desktop');
				}
				filter.el.length.value = itemLength;
			}

			// var param = filter.cookie.get();
			var param = filter.getParam();
			if(pageHistory.getHistory()) {
				filter.addEvent();
				pageHistory.runHistory();
				//console.log(param);
				if(param) {
					/* BTOBGLOBAL-434 : 20210408 modify */
					if(COUNTRY_CODE.toLowerCase()=='global' && $('.navigation').hasClass('b2b')){
						if(isMobile){
							filter.setInput(param, true, true);
						}else{
							filter.setInput(param, true);
						}
					}else{
						filter.setInput(param);
					}
					/*// BTOBGLOBAL-434 : 20210408 modify */
				} else {
					var page = $(filter.el).find('input[type=hidden][name=page]').val();
					if(page == 'viewAll') {
						setTimeout(function() {
							$('#resultProductList .result-info a.view-all').trigger('click');
						}, 300);
					} else if(parseInt(page) > 1) {
						setTimeout(function() {
							$('#resultAppendTarget .pagination ul li').eq(parseInt(page)-1).find('button').trigger('click');
						}, 300);
					}
					/* BTOBGLOBAL-434 : 20210414 add */
					if(COUNTRY_CODE.toLowerCase()=='global' && $('.navigation').hasClass('b2b') && isMobile){
						filter.loadPLP(event, true, true);
					}
					/*// BTOBGLOBAL-434 : 20210414 add */
				}
			} else if(param && $('.compare-wrap').length==0){
				/* BTOBGLOBAL-434 : 20210414 modify */
				if(COUNTRY_CODE.toLowerCase()=='global' && $('.navigation').hasClass('b2b') && isMobile){
					filter.setInput(param, null, true);
				}else{
					filter.setInput(param);
				}
				/*// BTOBGLOBAL-434 : 20210414 modify */
			}else {
				filter.addEvent();
				// PJTOBS-32 Start
                if(ISVIP) {
                    // Just run
                    $('#categoryFilterForm').trigger('submit');
                } else {
                    // Waiting for loginCheck()
                    $('.GPC0007').data('ready-vip-load', true);
                }
                // PJTOBS-32 End
			}

			runBVStaticPLP($(filter.result));
			var $modelButtonEl = $('.products-info .model-button .button');
			// 2021.01.20 View all 버튼 영역 문제로 인한 추가
			$modelButtonEl.removeClass('only-button');
			$modelButtonEl.addClass('only-button');
			$modelButtonEl.each(function(){
				if($(this).find('a.active').length > 1){
					$modelButtonEl.removeClass('only-button');
					return;
				}
			});
			/* 2020.10.12 PJTPLP 수정(filter-length : 0일 경우 */
			if($('.GPC0007').length >0  || $(".GPC0026").length > 0) {
				$(window).on('scroll', function() {
					if ($(window).width() < 767){
						$('.float-sort-box').each(function() {
							if($('.sort-select').find('.sort-inner').length > 0) {
								
							} else {
								$(this).remove();
							}
						});
					}
				});
			}
		},
		getParam: function(){
			// filter.cookie.get()
			var result;
			/* LGEGMC-754 : 20201119 add */
			var paramFilter = $(".GPC0007").find('input[name="paramFilter"]').val();
			if (typeof paramFilter!="undefined" && paramFilter!=null && paramFilter!="") {
				var param = paramFilter;
				result = '';
				var cnt = 0;
				if(param.length>0) {
					var hasURLFilter = true;
					var arr = param.split('&');
					for(var i=0;i<arr.length;i++) {
						var name = arr[i].split('=')[0];
						var val = arr[i].split('=')[1];
						
						if(typeof $('#categoryFilterForm').find('[name='+name+']')[0] !="undefined" ){
							if($('#categoryFilterForm').find('[name='+name+']')[0].type == 'checkbox' || !!$('#categoryFilterForm').find('[name='+name+']').parents('.slider-wrap').length) {
								hasURLFilter = false;
								console.log($('#categoryFilterForm').find('[name='+name+']'));
								if(cnt != 0){
									result += '|';
								}
								result += name + ':' + val;
								cnt++;
							}
						}						
					}
					if(hasURLFilter) {
						result = filter.cookie.get();
					}
				}
			}else if(location.search.length>0) {
			/*// LGEGMC-754 : 20201119 add */
				result = location.search.replace('?', '');
				if(result.length>0) {
					var hasURLFilter = true;
					var arr = result.split('&');
					for(var i=0;i<arr.length;i++) {
						var name = arr[i].split('=')[0];
						if($('[name='+name+']').length == 0) {
							hasURLFilter = false;
						}
					}
					if(hasURLFilter) {
						// Process if the URL contains filter data
						result = result.replace(/\&/g,'|').replace(/\=/g,':').replace(/\?/g, '');
					} else {
						result = filter.cookie.get();
					}
				}
			}else {
				result = filter.cookie.get();
			}
			
			/* 20200909 : LGEAE-113 add */
			var defaultFilter = $(".GPC0007").find('input[name="defaultFilter"]').val();
			if (typeof defaultFilter!="undefined" && defaultFilter!=null && defaultFilter!="") {
				if(typeof result=="undefined" || result==null || result==""){
					result = defaultFilter;
				}
			}
			/* 20200909 : LGEAE-113 add */
			
			// LGEGMC-526
			var defaultFilter = $(".GPC0026").find('input[name="defaultFilter"]').val();
			if (typeof defaultFilter!="undefined" && defaultFilter!=null && defaultFilter!="") {
				if(typeof result=="undefined" || result==null || result==""){
					result = defaultFilter;
				}
			}
			// LGEGMC-526 End
			
			// PJTPROCOM-3
			// PJTPROCOM-3 End

			return result;
		},
		setInput: function(param, pageFlag, initMobile){ //BTOBGLOBAL-434 : 20210408 modify
			if(!param) return false;

			var paramArray = param.indexOf('|') > -1 ? param.split('|') : [param];
			var ignore = ['categoryId', 'subCategoryId', 'status', 'sort', 'page'];
			var form = filter.el;

			//console.log(paramArray);

			for (var i = 0; i < paramArray.length; i++) {
				var _param = paramArray[i].split(':');
				if(ignore.indexOf(_param[0]) == -1) {
					var $input = $(form).find('input[name="'+_param[0]+'"]');

					if(!$input.get(0)) {
						// filter.reset();
						return false;
					}

					var type = $input.get(0).type;
					if(type == "checkbox") {
						
						/* 20200909 : LGEAE-113 add */
						// apply filter
						var _this = $input.filter('[value="'+_param[1]+'"]');
						if (_this.length == 0) continue;
						
						var selected = _this.get(0);
						selected.setAttribute('checked', 'checked');
						/* 20200909 : LGEAE-113 add */
						
						var val = _this.parent().find('.text .name').length>0 ? changeTitleFormat(_this.parent().find('.text .name').text()) : changeTitleFormat(_this.parent().find('.text').text());
						var relVal2 = (_this.parent().find('.text .filter-cnt').length==0)?_this.parent().find('.text').text():_this.parent().find('.text').text().replace(_this.parent().find('.text .filter-cnt').text(),'');
						var checkName = _this.attr('name');
						if(!val || val=="") {
							// for color
							val = changeTitleFormat(_this.attr('title'));
							relVal2 = _this.attr('title');
						}
						if(_this.prop('checked')) {
							var $filter_icon2 = "<span data-filter-name='"+checkName+"' data-filter-value='"+_this.val()+"'>"+relVal2+" <a href='#'><span class=\"sr-only\">"+removeTxt+"</span></a>";
							if($('.GPC0007 .apply-filters span').length == 0){
								$('.GPC0007 .apply-filters a.link-text').addClass('active');
							}
							$('.GPC0007 .apply-filters .link-text').before($filter_icon2);
							$('.GPC0007 .apply-filters span[data-filter-value='+_this.val()+'] a').one('click',function(e){ // jslint ignore:line
								e.preventDefault();
								if($(this).parent().attr('data-filter-value')!=='Y'){
									$('.GPC0007 #categoryFilterForm input[value='+$(this).parent().attr('data-filter-value')+']').click();
								}else{
									$('.GPC0007 #categoryFilterForm input[name='+$(this).parent().attr('data-filter-name')+']').click();								
								}
							});

							// LGEGMC-526
							if($('.GPC0026 .apply-filters span').length == 0){
								$('.GPC0026 .apply-filters a.link-text').addClass('active');
							}
							$('.GPC0026 .apply-filters .link-text').before($filter_icon2);
							$('.GPC0026 .apply-filters span[data-filter-value='+_this.val()+'] a').one('click',function(e){ // jslint ignore:line
								e.preventDefault();
								if($(this).parent().attr('data-filter-value')!=='Y'){
									$('.GPC0026 #categoryFilterForm input[value='+$(this).parent().attr('data-filter-value')+']').click();
								}else{
									$('.GPC0026 #categoryFilterForm input[name='+$(this).parent().attr('data-filter-name')+']').click();
								}
							});
							// LGEGMC-526 End
							
							// PJTPROCOM-3
							
							// PJTPROCOM-3 END
						}

					}else { // slider
						// set hidden input
						$input.get(0).value = _param[1];

						// set Slider
						var $slider = $input.parents('.slider-wrap'); 
						if($slider.length>0) {
							var sliderType = $slider.attr('data-value');
							var index = filter.slider.indexOfValue(filter.slider.value[$slider.attr('data-value')], _param[1]);
							$input.data('index', index);

							// apply filter
							for(var key in dragbarVal[sliderType][index]) {
								$input.data('val', key);
							}
							var _this2 = $slider.find('.slider-range');
							var val1 = _this2.siblings().find(".min-box input").data('val');
							var val2 = _this2.siblings().find(".max-box input").data('val');
							if(!val1) val1 = Object.keys(dragbarVal[sliderType][0]).join('');
							if(!val2) val2 = Object.keys(dragbarVal[sliderType][dragbarVal[sliderType].length-1]).join('');
							var relVal = _this2.parent().siblings('.title').find('strong').text()+" : "+val1+"-"+val2;
							if($('.GPC0007 .apply-filters span[data-filter-value='+sliderType+']').length > 0){
								var _targetTxt = $('.GPC0007 .apply-filters span[data-filter-value='+sliderType+']');
								_targetTxt.contents().filter(function(){return this.nodeType == 3;})[0].nodeValue = relVal;
							}else{
								var $filter_icon = "<span data-filter-value='"+sliderType+"'>"+relVal+" <a href='#'><span class=\"sr-only\">"+removeTxt+"</span></a></span>";
								$('.GPC0007 .apply-filters .link-text').before($filter_icon);
								$('.GPC0007 .apply-filters span[data-filter-value='+sliderType+'] a').one('click',function(e){ // jslint ignore:line
									e.preventDefault();
									// 20200325 START 박지영 : slider의 min, max 텍스트 초기화 안되는 오류 수정
									var fv = $(this).parent().attr('data-filter-value');
									var options = $('.GPC0007 .slider-wrap[data-value="'+fv+'"] .slider-range').slider('option');
									$('.GPC0007 .slider-wrap[data-value="'+fv+'"] input').val('').removeData('index');
									$('.GPC0007 .slider-wrap[data-value="'+fv+'"] .min-box span').text(Object.keys(dragbarVal[fv][options.min])[0]);
									$('.GPC0007 .slider-wrap[data-value="'+fv+'"] .max-box span').text(Object.keys(dragbarVal[fv][options.max])[0]);
									// 20200325 END
									$(this).parent().remove();
								});
							}
							if($('.GPC0007 .apply-filters span').length != 0){
								$('.GPC0007 .apply-filters a.link-text').addClass('active');
							}else{
								$('.GPC0007 .apply-filters a.link-text').removeClass('active');
							}

							// LGEGMC-526
							if($('.GPC0026 .apply-filters span[data-filter-value='+sliderType+']').length > 0){
								var _targetTxt = $('.GPC0026 .apply-filters span[data-filter-value='+sliderType+']');
								_targetTxt.contents().filter(function(){return this.nodeType == 3;})[0].nodeValue = relVal;
							}else{
								var $filter_icon = "<span data-filter-value='"+sliderType+"'>"+relVal+" <a href='#'><span class=\"sr-only\">"+removeTxt+"</span></a></span>";
								$('.GPC0026 .apply-filters .link-text').before($filter_icon);
								$('.GPC0026 .apply-filters span[data-filter-value='+sliderType+'] a').one('click',function(e){ // jslint ignore:line
									e.preventDefault();
									// 20200325 START 박지영 : slider의 min, max 텍스트 초기화 안되는 오류 수정
									var fv = $(this).parent().attr('data-filter-value');
									var options = $('.GPC0026 .slider-wrap[data-value="'+fv+'"] .slider-range').slider('option');
									$('.GPC0026 .slider-wrap[data-value="'+fv+'"] input').val('').removeData('index');
									$('.GPC0026 .slider-wrap[data-value="'+fv+'"] .slider-range').slider('values',[options.min, options.max]);
									$('.GPC0026 .slider-wrap[data-value="'+fv+'"] .min-box span').text(Object.keys(dragbarVal[fv][options.min])[0]);
									$('.GPC0026 .slider-wrap[data-value="'+fv+'"] .max-box span').text(Object.keys(dragbarVal[fv][options.max])[0]);
									// 20200325 END
									$(this).parent().remove();
								});
							}
							if($('.GPC0026 .apply-filters span').length != 0){
								$('.GPC0026 .apply-filters a.link-text').addClass('active');
							}else{
								$('.GPC0026 .apply-filters a.link-text').removeClass('active');
							}
							// LGEGMC-526 End
							
							// PJTPROCOM-3
							
							// PJTPROCOM-3 End
						}
					}
				}
			}
			filter.slider.setSlider();
			filter.addEvent();
			/* BTOBGLOBAL-434 : 20210408 modify */
			if(COUNTRY_CODE.toLowerCase()=='global' && $('.navigation').hasClass('b2b')){
				filter.loadPLP(null, pageFlag, initMobile);
			}else{
				filter.loadPLP();
			}
			/*// BTOBGLOBAL-434 : 20210408 modify */
		},
		activateInput: function(enableList){
			if(typeof enableList === 'undefined') return false;
			var _enableList = enableList;
			var form = filter.el;

			var $labels = $(form).find('label');
			// for (var ix = 0; ix < $labels.length; ix++) {
			// 	var _$label = $labels.eq(ix);
			// 	_$label.addClass('disabled').find('input').attr('disabled','disabled');
			// }
			if(_enableList != '') {
				for (var i = 0; i < _enableList.length; i++) {
					var keyId = _enableList[i].facetValueId;
					var _$faceInput = $(form).find('input[value="'+keyId+'"]'),
					_$faceLabel = _$faceInput.parents('label');
					/*LGEUS-11780 20190805 add */
					_$faceLabel.find('.filter-cnt').text('('+_enableList[i].modelCount+')'); 
					/*LGEUS-11780 20190805 add */
					// _$faceInput.removeAttr('disabled');
					// _$faceLabel.removeClass('disabled');
					if( _enableList[i].enable.toUpperCase() == "N"){
						_$faceInput.attr('disabled', 'disabled');
						_$faceLabel.addClass('disabled');
					}else {
						_$faceInput.removeAttr('disabled');
						_$faceLabel.removeClass('disabled');
					}
				}
			}
		}, 
		
		createProductItem: function(productList, productMessages, data){
			var html = [];
			if(productList != null && productList.length > 0){ // compareFilter.jsp template
				var emiMsgAreaYn = productList[0].emiMsgAreaYn;
				//PJTLIMITQTY_EXTEND
				var limitSaleAreaYn = productList[0].limitSaleAreaYn;
				//PJTLIMITQTY_EXTEND
				if(emiMsgAreaYn == 'Y' || limitSaleAreaYn == 'Y'){
					filter.template = filter.template.replace('*isHasTopInfo*','has-topInfo');
				}else{
					filter.template = filter.template.replace('*isHasTopInfo*','');
				}
			}
			if($('.GPC0007').length>0 ||$('.GPC0026').length>0) {
				var ynProductTag = "N";
				var ynBrandTag = "N";
				var ynSibling = "N";
				var ynEnergyLabel = "N";
				var ynPrice = "N";
				/* 2020.10.12 PJTPLP 수정 */
				var ynReviewRating = "N";
				var labelUseFlag = filter.labelUseFlag;
				var useLabelIcon = filter.useLabelIcon;
				// PJTPROCOM-3 ADD
				var reviewType = filter.reviewType;
				var loginUseFlag = filter.loginUseFlag;
				var reviewLoginUrl = filter.reviewLoginUrl;
				var dataCheck = filter.dataCheck;
				var tmpDomain = filter.domain;
				// PJTCUR-3 add
				var resultType = filter.resultType;
				if(resultType == "min") {
					labelUseFlag = "N";
					useLabelIcon = "N";
				}
			}
			//LGEGMC-177
			for (var i = 0; i < productList.length; i++) {
				//PJTCUR-3 add
				if($('.GPC0134').length > 0 || $('.GPC0142').length > 0) {
					if(i == 0) {
						$('#whiteSpaceData [data-category-id]').attr("data-category-id", $("input[name='curationId']").val());
						$('#whiteSpaceData [data-tag-content-area-yn]').attr("data-tag-content-area-yn", productList[i].tagContentAreaYn);
						$('#whiteSpaceData [data-model-brand-area-yn]').attr("data-model-brand-area-yn", productList[i].modelBrandAreaYn);
						$('#whiteSpaceData [data-price-area-yn]').attr("data-price-area-yn", productList[i].priceAreaYn);
						$('#whiteSpaceData [data-promotion-area-yn]').attr("data-promotion-area-yn", productList[i].promotionAreaYn);
						$('#whiteSpaceData [data-reivew-area-yn]').attr("data-review-area-yn", productList[i].reviewAreaYn);
						$('#whiteSpaceData [data-energy-fiche-yn]').attr("data-energy-fiche-yn", productList[i].energyFicheAreaYn);
						$('#whiteSpaceData [data-campaign-area-yn]').attr("data-campaign-area-yn", productList[i].campaignAreaYn);
						$('#whiteSpaceData [data-btn-area-yn]').attr("data-btn-area-yn", productList[i].btnAreaYn);
						$('#whiteSpaceData [data-emi-msg-area-yn]').attr("data-emi-msg-area-yn", productList[i].emiMsgAreaYn);
                        $('#whiteSpaceData [data-emi-use-flag]').attr("data-emi-use-flag", productList[i].emiUseFlag);
						$('#whiteSpaceData [data-spec-msg-flag-area-yn]').attr("data-spec-msg-flag-area-yn", productList[i].specMsgFlagAreaYn);
						$('#resultAppendTarget').attr("categoryId", $("input[name='curationId']").val());
					}
				}
				var p = productList[i],
					template = filter.template;
				//LGEGMC-1406
				var specMsg = $("#specMsg").val();
				//PJTGADL-2 
				var priceValue = "";
				if(p.rPromoPrice != null && p.rPromoPrice != "" && p.rPromoPrice != 'null'){
					priceValue = p.rPromoPrice+"."+nvl(p.rPromoPriceCent,'00');
				} else{
					priceValue = nvl(p.rPrice,'')+"."+nvl(p.rPriceCent,'00');
				}
				/*LGECZ-199 s*/
				var havSiblingModels = p.siblingModels && p.siblingModels.length > 0;
				var siblingModelTotalFlag = $("#siblingModelTotalFlag").val();
				
				if(siblingModelTotalFlag=='Y'&&havSiblingModels){
					if(p.starRatingValue == null){
						p.reviewRatingStar2 = '0'
					}else{
						p.reviewRatingStar2 = p.starRatingValue
					}
				}
				if(siblingModelTotalFlag=='Y'&&havSiblingModels){
					if(p.starRatingValue == null){
						p.reviewRating = '0'
					}else{
						p.reviewRating = p.participantCount
					}
				}
				if(siblingModelTotalFlag=='Y'&&havSiblingModels){
					if(p.starRatingValue == null){
						p.reviewRatingPercent = '0'
					}else{
						p.reviewRatingPercent = p.starRatingPercent
					}
				}
				/*LGECZ-199 e*/
				template = template.replace(/\*modelId\*/g, p.modelId)
								.replace(/\*modelName\*/g, p.modelName)
								.replace(/\*modelName_toLowerCase\*/g, p.modelName.toLowerCase())
								.replace(/\*imageAltText\*/g, (p.imageAltText != null) ? p.imageAltText : '')
								// 20200325 START 박지영 - ufn 따옴표 처리
								.replace(/\*userFriendlyName\*/g, p.userFriendlyName == null ? '' : p.userFriendlyName.replace(/\"/g, "''"))
								// 20200325 END
								.replace(/\*salesModelCode\*/g, p.salesModelCode)
								.replace(/\*modelUrlPath\*/g, p.modelUrlPath)
								.replace(/\*mediumImageAddr\*/g, p.mediumImageAddr)
								.replace(/\*smallImageAddr\*/g, p.smallImageAddr)
								.replace(/\*productTag1\*/g, p.productTag1)
								.replace(/\*productTag2\*/g, p.productTag2)
								.replace(/\*productTag1UserType\*/g, p.productTag1UserType) /* LGEDE-354 */
								.replace(/\*productTag2UserType\*/g, p.productTag2UserType) /* LGEDE-354 */
								.replace(/\*whereToBuyUrl\*/g, p.whereToBuyUrl)
								.replace(/\*inquiryToBuyUrl\*/g, p.inquiryToBuyUrl)
								.replace(/\*findTheDealerUrl\*/g, p.findTheDealerUrl)
								.replace(/\*promotionText\*/g, p.promotionText ? p.promotionText : "")
								/* LGEPL-80 */
								.replace(/\*promotionLinkUrl\*/g, p.promotionLinkUrl ? p.promotionLinkUrl : "")
								// PJTOBS 20200703 Start 
								.replace(/\*reStockAlertUrl\*/g, p.reStockAlertUrl ? p.reStockAlertUrl : "")
								// PJTOBS 20200703 End
								/* LGEUS-12083 : 20190826 add */
								.replace(/\*rDiscountedPrice\*/g, p.rDiscountedPrice ? changeFormatPrice(p.rDiscountedPrice) : 'null')
								.replace(/\*rDiscountedPriceCent\*/g, p.rDiscountedPriceCent)
								/* //LGEUS-12083 : 20190826 add */
								/* in-house review rating add */
								.replace(/\*reviewRatingStar2\*/g, p.reviewRatingStar2)
								.replace(/\*reviewRating\*/g, p.reviewRating)
								.replace(/\*reviewRatingPercent\*/g, p.reviewRatingPercent)
								/* // in-house review rating add */
								.replace(/\*siblingType\*/g, p.siblingType)
								.replace(/\*discountedRate\*/g, p.discountedRate)
								.replace(/\*retailerPricingText\*/g, p.retailerPricingText)
								.replace(/\*salesSuffixCode\*/g, (p.salesSuffixCode || ''))/* LGEGMC-455 20200717 add */
								.replace(/\*modelYear\*/g, (nvl(p.modelYear,'') || '')) /* LGEGMC-1279 : 2021.03.12 add */
								.replace(/\*buName1\*/g, (p.buName1 || ''))
								.replace(/\*buName2\*/g, (p.buName2 || ''))
								.replace(/\*buName3\*/g, (nvl(p.buName3,'') || ''))
								.replace(/\*bizType\*/g, (p.bizType || ''))
								.replace(/\*superCategoryName\*/g, (p.superCategoryName || ''))
								.replace(/\*categoryName\*/g, (p.categoryName || ''))
								.replace(/\*categoryEngName\*/g, (p.categoryEngName || ''))
								.replace(/\*priceValue\*/g, priceValue) /* LGEGMC-712 20201020 add */
								.replace(/\*salesSuffixCode\*/g, (p.salesSuffixCode || ''))  /* LGEGMC-455 20200717 add */
								/* PJTPLP-10 (황규하) wish 기능 추가 START */
								.replace(/\*wishTotalCnt\*/g, p.wishTotalCnt)
								.replace(/\*pdFav\*/g, p.myWishCnt == 'Y' ? 'pd-fav on' : 'pd-fav')
								.replace(/\*icoFav\*/g, p.myWishCnt == 'Y' ? 'ico-fav on' : 'ico-fav')
								.replace(/\*ariaChecked\*/g, p.myWishCnt == 'Y' ? 'true' : 'false')
								.replace(/\*modelCopyUrl\*/g, p.modelUrlPath)
								.replace(/\*categoryName\*/g, p.categoryName)
								/* PJTPLP-10 (황규하) wish 기능 추가 END */
								//PJTOBSB2E-3 Start
								.replace(/\*obsPreOrderStartDate\*/g, p.obsPreOrderStartDate)
								.replace(/\*obsPreOrderEndDate\*/g, p.obsPreOrderEndDate)
								.replace(/\*emiPopUrl\*/g, p.obsEmiMsgFlag == 'Y' && p.emiPopUrl != null ? p.emiPopUrl : '')
								.replace(/\*emiMsg\*/g, p.obsEmiMsgFlag == 'Y' && p.emiMsg != null && p.emiMsg != '' ? p.emiMsg : '')
								//PJTOBSB2E-3 End 
								.replace(/\*calculatorSalesCode\*/g, (p.salesModelCode != null && p.salesModelCode != "") && (p.salesSuffixCode != null && p.salesSuffixCode != "") ? p.salesModelCode+"."+p.salesSuffixCode : p.salesModelCode) // LGEGMC-2434, LGEGMC-2589
								//LGEGMC-1406
								.replace(/\*specMsg\*/g, p.specMsgFlag == 'Y' ? "<p>"+specMsg+"</p>" : '')
								//PJTOBSB2E-3 End
								.replace(/\*msrp\*/g, nvl(p.msrp,'0'))
								.replace(/\*membershipPrice\*/g, changeFormatFullPrice(p.rMembershipPrice, p.rMembershipPriceCent)) /* PJTMEMBERSHIP-4 */
								.replace(/\*membershipDisplayFlag\*/g, p.membershipDisplayFlag) /* PJTMEMBERSHIP-4 */
								.replace(/\*cheaperPrice\*/g, changeFormatFullPrice(p.cheaperPrice, p.cheaperPriceCent)) /* LGEGMC-1973 */
								.replace(/\*cheaperPriceFlag\*/g, p.cheaperPriceFlag) /* LGEGMC-1973 */
								.replace(/\*afterPayInstallMent\*/g, p.obsEmiMsgFlag == 'Y' && p.emiMsg != null && p.emiMsg != '' && (p.afterPay <= 3000 && p.afterPay > 0) ? 'afterpay-installment" href="#modal-afterpay' : '" style="display:none;')/* LGEAU-378 add */
								.replace(/\*wtbClass\*/g,(p.wtbExternalLinkUseFlag =="Y" && p.wtbExternalLinkUrl != null && p.wtbExternalLinkUrl != '' && p.wtbExternalLinkName != null && p.wtbExternalLinkName != '') ? 'in-buynow' : 'where-to-buy') //LGEGMC-2202
								;
				
				//LGEGMC-177
				//LGESR-72
				var pdfDownloadFile = $("#pdfDownloadFile").val();
				var rsProductFicheDownload = $("#rsProductFicheDownload").val();
				var rsUseFlag = p.rsUseFlag;
				if(rsUseFlag == "Y"){
					pdfDownloadFile = rsProductFicheDownload;
				}
				//LGESR-72
				var productFicheDownload = $("#productFicheDownload").val();
				var productFichehtml = "<a href='#' adobe-click='pdp-file-down-click' data-doc='"+ p.productFicheDocId +"' data-file='" + p.productFicheFileName + "' data-original='" + p.productFicheOriginalName + "' data-category='' title='" + pdfDownloadFile + "' class='link-text'>"
    			+ "<span class='fiche type-product'>" + productFicheDownload + "</span>"
    			+ "</a>";
				/*LGEGMC-1035 start*/
				if($('html').attr('data-countrycode') == 'uk'){
					if(p.energyLabel != "" && p.energyLabel != "N" && p.energyLabel != null && p.energyLabelDocId !=null && p.energyLabelDocId !="" && p.energyLabelFileName != null && p.energyLabelFileName != "" && p.energyLabelOriginalName !=null
							&& p.energyLabelOriginalName !="" && p.energyLabelImageAddr !=null && p.energyLabelImageAddr !="" && p.energyLabelName !=null && p.energyLabelName !="" && p.fEnergyLabelFileName!= null && p.fEnergyLabelDocId!= null && p.fEnergyLabelDocId!= ""&&p.fEnergyLabelFileName!='' && p.fEnergyLabelOriginalName !=null&& p.fEnergyLabelOriginalName !=''){
						var energyLabelhtml = "<div class='energy-label-wrap'><a href='#' class='label-link'><span class='label'><img src='"+ p.energyLabelImageAddr +"' alt='"+ p.energyLabelName +"'></span></a>"
						var energyLabelImagehtml = "<div class='tooltip-link'><div class='tolltip-inner'>";
						if(p.fEnergyLabelFileName!= null && p.fEnergyLabelDocId!= null && p.fEnergyLabelDocId!= ""&&p.fEnergyLabelFileName!='' && p.fEnergyLabelOriginalName !=null&& p.fEnergyLabelOriginalName !=''){
							energyLabelImagehtml += "<a href='#' class='link-text link-text-uk' adobe-click='pdp-file-down-click' data-doc='" + p.fEnergyLabelDocId + "' data-file='" + p.fEnergyLabelFileName + "' data-original='" + p.fEnergyLabelOriginalName + "'  data-category='' title='" + pdfDownloadFile + "'>"+$("#pdfDownloadFileUk").val()+"</a>";
						}
					energyLabelImagehtml += "<a href='#' class='link-text link-text-eu' adobe-click='pdp-file-down-click' data-doc='" + p.energyLabelDocId + "' data-file='" + p.energyLabelFileName + "' data-original='" + p.energyLabelOriginalName + "'  data-category='' title='" + pdfDownloadFile + "'>"+$("#pdfDownloadFileEu").val()+"</a></div></div></div>"
					}else{
						var energyLabelhtml = "<a href='#' adobe-click='pdp-file-down-click' data-doc='" + p.energyLabelDocId + "' data-file='" + p.energyLabelFileName + "' data-original='" + p.energyLabelOriginalName + "' class='link-text' data-category='' title='" + pdfDownloadFile + "'>"
						+ "<span class='label type-none'>";
						var energyLabelImagehtml = "<img src='"+ p.energyLabelImageAddr +"' alt='"+ p.energyLabelName +"'></span></a>";
					}
				}else{
					var energyLabelhtml = "<a href='#' adobe-click='pdp-file-down-click' data-doc='" + p.energyLabelDocId + "' data-file='" + p.energyLabelFileName + "' data-original='" + p.energyLabelOriginalName + "' class='link-text' data-category='' title='" + pdfDownloadFile + "'>"
					+ "<span class='label type-none'>";
					var energyLabelImagehtml = "<img src='"+ p.energyLabelImageAddr +"' alt='"+ p.energyLabelName +"'></span></a>";
				}
				/*LGEGMC-1035 end*/
				if(p.productFicheFileName !="" && p.productFicheOriginalName !="" && p.productFicheFileName != null && p.productFicheOriginalName !=null && p.productFicheDocId !=null && p.productFicheDocId != ""){
					template = template.replace(/\*productFileName\*/g,productFichehtml);
					if($('.GPC0007').length>0 ||$('.GPC0026').length>0) {
						ynEnergyLabel = "Y";
					}
				} else{
					template = template.replace(/\*productFileName\*/g,"");
				}
				if(p.energyLabel != "" && p.energyLabel != "N" && p.energyLabel != null && p.energyLabelDocId !=null && p.energyLabelDocId !="" && p.energyLabelFileName != null && p.energyLabelFileName != "" && p.energyLabelOriginalName !=null
						&& p.energyLabelOriginalName !="" && p.energyLabelImageAddr !=null && p.energyLabelImageAddr !="" && p.energyLabelName !=null && p.energyLabelName !=""){
					template = template.replace(/\*energyLabel\*/g,energyLabelhtml);
					template = template.replace(/\*energyLabelImage\*/g,energyLabelImagehtml);
					if($('.GPC0007').length>0 ||$('.GPC0026').length>0) {
						ynEnergyLabel = "Y";
					}
				} else{
					template = template.replace(/\*energyLabelImage\*/g, "");
					template = template.replace(/\*energyLabel\*/g,"");
				} 
				
				if($('.GPC0026').length > 0) {
					template = 	template.replace(/\*linkUrl\*/g, p.linkUrl)
										.replace(/\*urlTarget\*/g, p.urlTarget)
										.replace(/\*btnName\*/g, p.btnName)
										.replace(/\*startDate\*/g, p.startDate)
										.replace(/\*endDate\*/g, p.endDate)
										.replace(/\*tooltipBody\*/g, p.tooltipBody)
					;
				}
				
				var $template = $(template),
					$keyBlocks = $template.find('*[data-key]'),
					$loopBlocks = $template.find('*[data-loop]');
				
				// LGEPL-80 START
				var opensTarget = $("#opensTarget").val();
				if(p.externalLinkTarget && p.externalLinkTarget=="New") {
					$template.find('.promotion-text a').attr('target', '_blank').attr('title', opensTarget);
				}
				// LGEPL-80 END

				for (var i1 = 0; i1 < $keyBlocks.length; i1++) {
					var $currentKeyBlock = $keyBlocks.eq(i1),
						key = $currentKeyBlock.get(0).getAttribute('data-key'),
						val = p[key];
					if(!val || (val == null || val == "N")) {
						if($currentKeyBlock.is('.btn')) {
							$currentKeyBlock.removeClass('active');
						}else {
							var countryCode = $('[data-countrycode]').attr('data-countrycode');
							//PJTLIMITQTY-1 ADD
                            //PJTLIMITQTY_EXTEND ADD
							if($('.GPC0007').length > 0 || $('.GPC0026').length > 0){
								if((p.obsLimitSale == 'Y' && p.limitSaleUseFlag == 'Y') || (p.obsPreOrderFlag == "Y" || p.obsPreOrderRSAFlag == "Y")){
									$keyBlocks.closest('p').addClass('tag-imp');
									if(p.vipPriceFlag != 'Y' && p.obsLimitSale == 'Y' && p.limitSaleUseFlag == 'Y') {
										$template.find('.price-vip').text(p.limitSaleTitle);
									}
								}
								
								if($template.find('.model-buy').length > 0 && (p.obsLimitSale == 'Y' && p.limitSaleUseFlag == 'Y')){
									if($template.find('.only-price').length > 0){
										$template.find('.model-buy').removeClass('only-price');	
									}
								}
							}
							if((key == 'productTag1' ||  key == 'productTag2') && ($('.GPC0007').length>0 ||$('.GPC0026').length>0)) {
								$currentKeyBlock.closest('p').remove();
							}else{
								$currentKeyBlock.remove();
							}
						}
					}else {
						if($currentKeyBlock.is('.btn')) {
							$currentKeyBlock.addClass('active');
						}else{
                            //PJTLIMITQTY_EXTEND ADD
							if(($('.GPC0007').length > 0 || $('.GPC0026').length > 0) && p.limitSaleUseFlag == 'Y'){
								if(p.obsLimitSale == 'Y'){
									$keyBlocks.closest('p').addClass('tag-imp');
									if(p.vipPriceFlag != 'Y') {
										$template.find('.price-vip').text(p.limitSaleTitle);
									}
								}
								
								if($template.find('.model-buy').length > 0){
									if($template.find('.only-price').length > 0){
										$template.find('.model-buy').removeClass('only-price');	
									}
								}
							}
						}
					}


					
				}

				// in-house reivew rating star - ie fix
				/*LGECZ-199 s*/
				$template.find('.rating:not(.siblingModelTotal) .carmine-star').css({
					width: p.reviewRatingPercent+"%"
				});
				$template.find('.rating.siblingModelTotal .carmine-star').css({
					width:  p.starRatingPercent+"%"
				});
				/*LGECZ-199 e*/
				
				if($('.GPC0026').length > 0) {
					// PJTPROCOM-3 ADD
					var $campaignArea = $template.find('.btn-campaign-box');
					var campaignLinkBtn = $campaignArea.find('template[data-campaignbtn="LINK"]').clone().html();
					
					var $ratingArea = $template.find('.has-review-pop');
					var reviewBtnBV = $ratingArea.find('template[data-review-btn-type="BV"]').clone().html();
					var reviewBtnLGCOM = $ratingArea.find('template[data-review-btn-type="LGCOM"]').clone().html();
					var reviewBtnSP = $ratingArea.find('template[data-review-btn-type="SP"]').clone().html();
					var reviewBtnCENEO = $ratingArea.find('template[data-review-btn-type="CENEO"]').clone().html();
					var reviewBtnTxt = $ratingArea.attr('data-review-btn-text');
					var chkWriteReview = $('#reviewDefaultData').attr('data-check');
					var reviewLoginUrl = $('#reviewDefaultData').attr('data-review-login-url');
					
					var tmpText = "";
					var tmpBtnText = "";
					var tmpUrlTarget= "_blank";
					var tmpTooltipDate = "";
					var tmpBtnNameFontOpt = "";
					var tmpTooltipBodyFontOpt = "";
					
					if(p.urlTarget == "S") tmpUrlTarget = "_self";
					tmpTooltipDate = p.startDate + "-" + p.endDate;
					
					if(p.btnNameFontOpt == "I") tmpBtnNameFontOpt = " text-italic";
					if(p.btnNameFontOpt == "B") tmpBtnNameFontOpt = " text-bold";
					if(p.tooltipBodyFontOpt == "I") tmpTooltipBodyFontOpt = " text-italic";
					if(p.tooltipBodyFontOpt == "B") tmpTooltipBodyFontOpt = " text-bold";
					
					if(p.campaignUseFlag == "Y") {
						tmpText = "<a href='" + p.linkUrl + "' role='button' class='btn-campaign' target='" + tmpUrlTarget + "'>";
						tmpText = tmpText + "<div class='title-campaign'>";
						tmpText = tmpText + "<div class='campaign-txt" + tmpBtnNameFontOpt + "'>" + p.btnName + "</div>";
						tmpText = tmpText + "<div class='campaign-day'>" + tmpTooltipDate + "</div>";
						tmpText = tmpText + "</div>";
						if(p.tooltipBody != null && p.tooltipBody != '') {
							tmpText = tmpText + "<div class='campaign-banner'>";
							tmpText = tmpText + "<p class='campaign-info"+ tmpTooltipBodyFontOpt + "'>" + p.tooltipBody + "</p>";
							tmpText = tmpText + "</div>";
						}
						tmpText = tmpText + "</a>";
						campaignLinkBtn = campaignLinkBtn.replace(/\*alinktext\*/g,tmpText);
						$campaignArea.append(campaignLinkBtn);
					} else {
						$campaignArea.addClass('hidden');
					}
					
					if(p.reviewBtnUseFlag == "Y" && p.reviewUseFlag == "Y") {
						if(reviewType == "BV" || reviewType == "BV2") {
							tmpBtnText = "<a href='#' data-toggle='modal' role='button' data-review-event-click='BV' class='btn-popup-review' data-review-model-id='" + p.modelId + "' data-adobe-tracking-wish='Y' data-page-event='promotion_plp_review_move'>" + reviewBtnTxt + "</a>";
							reviewBtnBV = reviewBtnBV.replace(/\*reviewBtnText\*/g, tmpBtnText);
							$ratingArea.append(reviewBtnBV);
						} else if(reviewType == "LGCOM") {
							//PJTGADL-2
							tmpBtnText = "<a href='#' data-toggle='modal' role='button' data-review-event-click='LGCOM' class='btn-popup-review' data-review-model-id='" + p.modelId + "' data-bu= '" + p.buName1 + "' data-super-category-name= '" + p.superCategoryName + "' data-category-name= '" + p.buName2 + "' data-sub-category-name= '" + p.buName3 + "' data-model-year= '" + p.modelYear + "' data-model-name= '" + p.modelName + "' data-model-salesmodelcode= '" + p.salesModelCode + "' data-sku= '" + p.modelName + "' data-model-suffixcode= '" + p.salesSuffixCode  + "' data-model-id= '" + p.modelId  + "' data-model-overallscore= '" + p.reviewRatingStar2  + "' data-model-reviewCnt= '" + p.reviewRating  + "' data-review-login-url= '" + reviewLoginUrl + "' data-review-participantCount= '" + p.reviewRating + "' data-review-starRatingPercent='" + p.reviewRatingPercent + "' data-review-starRatingValue='" + p.reviewRatingStar2 + "' data-check='" + chkWriteReview + "' data-adobe-tracking-wish='Y' data-page-event='promotion_plp_review_move'>" + reviewBtnTxt + "</a>";
							reviewBtnLGCOM = reviewBtnLGCOM.replace(/\*reviewBtnText\*/g, tmpBtnText);
							$ratingArea.append(reviewBtnLGCOM);
						} else if(reviewType == "SP") {
							tmpBtnText = "<a href='" + p.modelUrlPath + "'#pdp_review' data-review-event-click='SP' data-review-model-id='" + p.modelId + "' class='btn-popup-review' data-adobe-tracking-wish='Y' data-page-event='promotion_plp_review_move'>" + reviewBtnTxt + "</a>";
							reviewBtnSP = reviewBtnSP.replace(/\*reviewBtnText\*/g, tmpBtnText);
							$ratingArea.append(reviewBtnSP);
						} else if(reviewType == "CENEO") {
							tmpBtnText = "<a href='" + p.modelUrlPath + "'#pdp_review' data-review-event-click='CENEO' data-review-model-id='" + p.modelId + "' class='btn-popup-review' data-adobe-tracking-wish='Y' data-page-event='promotion_plp_review_move'>" + reviewBtnTxt + "</a>";
							reviewBtnCENEO = reviewBtnCENEO.replace(/\*reviewBtnText\*/g, tmpBtnText);
							$ratingArea.append(reviewBtnCENEO);
						}
					}
				}

				// sibling target check
				if(p.target && p.target.toUpperCase() == "SELF") {
					$template.find('.item.js-model').addClass('self');
				}else {
					$template.find('.item.js-model').removeClass('self');
				}
				
				
				// price setting
				$priceArea = $template.find('.price-area.total');
				if($priceArea.length!=0) {
					$priceArea.removeClass('type-none type-default type-msrp type-promotion type-text');
					if(p.modelStatusCode=='DISCONTINUED') {
						// do nothing
					} else if(p.retailerPricingFlag == "Y") {
						// type text
						$priceArea.addClass('type-text');
						$priceArea.find('.text').text(p.retailerPricingText);
					// 20200514 START 박지영 : 조건문에서 promotionPrice 제거
					} else if(p.rPromoPrice != null && p.rPrice != null && p.rPromoPrice != '' && p.rPrice != '') {
					// 20200514 END
						// type promotion
						$priceArea.addClass('type-promotion');
						var price = changeFormatFullPrice(p.rPromoPrice, p.rPromoPriceCent);
						var pricePromo = changeFormatFullPrice(p.rPrice, p.rPriceCent);
						$priceArea.find('.purchase-price .price .number').text(price);
						$priceArea.find('.product-price .price .number').text(pricePromo);
						$priceArea.find('.product-price .legal').html(p.discountMsg == null ? '' : p.discountMsg.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>'));		// LGEIS-229 change how discounts are shown
					} else {
						if(p.bizType=="B2B" && p.obsLoginFlag != "Y") { // PJTB2BOBS-1
							if(p.rPrice != null && p.rPrice != '') {
								// type b2b
								var price1 = changeFormatFullPrice(p.rPrice, p.rPriceCent);
								$priceArea.addClass('type-msrp');
								$priceArea.find('.purchase-price .price .number').text(price1);
							}
						} else {
							if(p.rPrice != null && p.rPrice != '') {
								// type default
								var price2 = changeFormatFullPrice(p.rPrice, p.rPriceCent);
								$priceArea.addClass('type-default');
								$priceArea.find('.purchase-price .price .number').text(price2);
							}
						}
					}
					// PJTOBS-32 Start
					if(ISVIP) $priceArea.addClass('vip-price-area');
					//PJTLIMITQTY_EXTEND
					var limitSaleConditionFlag =  p.vipPriceFlag == 'N' && p.obsLimitSale == 'Y' && p.limitSaleUseFlag == 'Y' ? 'Y' : 'N';
					if(p.vipPriceFlag == 'Y') {
						var priceOrg = changeFormatFullPrice(p.rPrice, p.rPriceCent);
						var pricePromo = changeFormatFullPrice(p.rPromoPrice, p.rPromoPriceCent);
						var legal = p.discountMsg == null ? '' : p.discountMsg.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');		// LGEIS-229 change how discounts are shown
						var vipPriceText = productMessages.vipPriceMessage;
						var previousPriceText = productMessages.previousPriceText;
						var emiMsgText = p.obsEmiMsgFlag == 'Y' && p.emiMsg != null && p.emiMsg != '' ? p.emiMsg : '';
						
						setVipPrice($priceArea, priceOrg, pricePromo, legal, vipPriceText, previousPriceText, p.modelId + '/' + 'category-filter.js',emiMsgText,p.afterPay, limitSaleConditionFlag, p.limitSaleTitle);
					}else if(SIGN_IN_STATUS == 'Y' && p.emiMemberMsg != null && p.emiMemberMsg != '' && $('.GPC0007').length > 0){
						//LGCOMSM-51 START
						setInstallmentMember($priceArea,p.emiMemberMsg);
						//LGCOMSM-51 END
					}
					if($('.GPC0007,.GPC0026,.GPC0132,.GPC0009').length>0) {
						if($priceArea.siblings( '.price-vip-Installment,.price-pdp-Installment').length > 0){
							$priceArea.removeClass('vip-price-area');	
						}
						
					}
					// PJTOBS-32 End
				}
				
				// 2020.09.28 PJTPLP ADD START
				// 2020.10.05 PJTPLP MODIFY START
				if($('.GPC0007').length>0 ||$('.GPC0026').length>0) {
					if(labelUseFlag == "Y" && useLabelIcon == "Y") {
						var $labelList = $template.find('.label-list .label-inner ul');
						var labelAward = $labelList.find('template[data-label-type="AWARD"]').clone().html();
						var labelFeature = $labelList.find('template[data-label-type="FEATURE"]').clone().html();
						var labelDelivery = $labelList.find('template[data-label-type="DELIVERY"]').clone().html();
						var labelWarranty = $labelList.find('template[data-label-type="WARRANTY"]').clone().html();
						var labelBullet = $labelList.find('template[data-label-type="BULLET"]').clone().html();
						//LGEDE-220
						if($('.GPC0007').length > 0){
						var labelShippingFlag = $labelList.find('template[data-label-type="SHIPPINGFLAG"]').clone().html();
						var labelDeliveryFlag = $labelList.find('template[data-label-type="DELIVERYFLAG"]').clone().html();
						var labelInstallationFlag = $labelList.find('template[data-label-type="INSTALLATIONFLAG"]').clone().html();
						var keyfeatureFlag = $labelList.find('template[data-label-type="KEYFEATUREFLAG"]').clone().html(); //LGEIN-399 : 20210607 add
                         }  
						var labelIconMap = p.labelIconMap;
						for(var cnt = 0; cnt < labelIconMap.length; cnt++) {
							var tmpLabelAward = labelAward;
							var tmpLabelFeature = labelFeature;
							var tmpLabelDelivery = labelDelivery;
							var tmpLabelWarranty = labelWarranty;
							var tmpLabelBullet = labelBullet;
							//LGEDE-220
							if($('.GPC0007').length > 0){
							var tmpLabelShippingFlag = labelShippingFlag;
							var tmpLabelDeliveryFlag = labelDeliveryFlag;
							var tmpLabelInstallationFlag = labelInstallationFlag;
							var tmpLabelKeyfeatureFlag = keyfeatureFlag; //LGEIN-399 : 20210607 add
							}
							var tmpText = "";
						/* 2020.10.12 PJTPLP 수정 */
							if(labelIconMap[cnt].shortDescType == 'AWARD' || labelIconMap[cnt].shortDescType == 'FEATURE') {
								if(labelIconMap[cnt].cssFontBold=="Y" && labelIconMap[cnt].cssFontItalic=="Y") {
									tmpText = "<li data-adobe-tracking-wish='Y' data-page-event='plp_labelicon' class='text-all'>";
								} else if(labelIconMap[cnt].cssFontBold=="Y") {
									tmpText = "<li data-adobe-tracking-wish='Y' data-page-event='plp_labelicon' class='text-bold'>";
								} else if(labelIconMap[cnt].cssFontItalic=="Y") {
									tmpText = "<li data-adobe-tracking-wish='Y' data-page-event='plp_labelicon' class='text-italic'>";
								} else {
									tmpText = "<li data-adobe-tracking-wish='Y' data-page-event='plp_labelicon'>";
								}
								if(labelIconMap[cnt].linkUrl != null && labelIconMap[cnt].linkUrl != '') {
									tmpText = tmpText + "<a href='" +  labelIconMap[cnt].linkUrl + "' ";
									if(labelIconMap[cnt].linkOpt == "S") {
										tmpText = tmpText + "target='_self' data-adobe-tracking-wish='Y' data-page-event='plp-labelicon'>";
									} else if(labelIconMap[cnt].linkOpt == "B") {
										tmpText = tmpText + "target='_blank' data-adobe-tracking-wish='Y' data-page-event='plp-labelicon'>";
									}
								}
								if(labelIconMap[cnt].imagePathAddr != '' && labelIconMap[cnt].imagePathAddr != null) {
									tmpText = tmpText + "<img src='" + labelIconMap[cnt].imagePathAddr + "' alt='" + labelIconMap[cnt].altText + "' aria-hidden='true'>"
											+ "<p>" + labelIconMap[cnt].shortDesc + "</p>";
									if(labelIconMap[cnt].linkUrl != null && labelIconMap[cnt].linkUrl != '') {
										tmpText = tmpText + "</a>"
									}
									tmpText = tmpText + "</li>";
									tmpLabelAward = tmpLabelAward.replace(/\*shortDesc\*/g,tmpText);
									$labelList.append(tmpLabelAward);
								} else {
									tmpText = tmpText + "<p>" + labelIconMap[cnt].shortDesc + "</p>";
									if(labelIconMap[cnt].linkUrl != null && labelIconMap[cnt].linkUrl != '') {
										tmpText = tmpText + "</a>"
									}
									tmpText = tmpText + "</li>";
									tmpLabelFeature = tmpLabelFeature.replace(/\*shortDesc\*/g,tmpText);
									$labelList.append(tmpLabelFeature);
								}
							} else if(labelIconMap[cnt].shortDescType == 'DELIVERY') {
								tmpLabelDelivery = tmpLabelDelivery.replace(/\*shortDesc\*/g,labelIconMap[cnt].shortDesc);
								$labelList.append(tmpLabelDelivery);
							} else if(labelIconMap[cnt].shortDescType == 'WARRANTY') {
								tmpLabelWarranty = tmpLabelWarranty.replace(/\*shortDesc\*/g,labelIconMap[cnt].shortDesc);
								$labelList.append(tmpLabelWarranty);
							} //LGEDE-220
							  else if(labelIconMap[cnt].shortDescType == 'SHIPPINGFLAG') {
								  if($('.GPC0007').length > 0){
								tmpLabelShippingFlag = tmpLabelShippingFlag.replace(/\*shortDesc\*/g,labelIconMap[cnt].shortDesc);
								$labelList.append(tmpLabelShippingFlag);
								  }
							} else if(labelIconMap[cnt].shortDescType == 'DELIVERYFLAG') {
								if($('.GPC0007').length > 0){
								tmpLabelDeliveryFlag = tmpLabelDeliveryFlag.replace(/\*shortDesc\*/g,labelIconMap[cnt].shortDesc);
								$labelList.append(tmpLabelDeliveryFlag);
								}
							} else if(labelIconMap[cnt].shortDescType == 'INSTALLATIONFLAG') {
								if($('.GPC0007').length > 0){
								tmpLabelInstallationFlag = tmpLabelInstallationFlag.replace(/\*shortDesc\*/g,labelIconMap[cnt].shortDesc);
								$labelList.append(tmpLabelInstallationFlag);
								}
							}
							 //LGEDE-220
							  else if(labelIconMap[cnt].shortDescType == 'BULLET') {
								tmpLabelBullet = tmpLabelBullet.replace(/\*shortDesc\*/g,labelIconMap[cnt].shortDesc);
								$labelList.append(tmpLabelBullet);
							/* LGEIN-399 : 20210607 add */
							}  else if(labelIconMap[cnt].shortDescType == 'KEYFEATUREFLAG') {
								if($('.GPC0007').length > 0){
									if(labelIconMap[cnt].cssFontBold=="Y" && labelIconMap[cnt].cssFontItalic=="Y") {
										tmpText = "text-all";
									} else if(labelIconMap[cnt].cssFontBold=="Y") {
										tmpText = "text-bold";
									} else if(labelIconMap[cnt].cssFontItalic=="Y") {
										tmpText = "text-italic";
									} else {
										tmpText = "";
									}
									tmpLabelKeyfeatureFlag = tmpLabelKeyfeatureFlag.replace(/\*shortDesc\*/g,labelIconMap[cnt].shortDesc).replace(/\*cssFont\*/g,tmpText);
									$labelList.append(tmpLabelKeyfeatureFlag);
								}
							}
							/*// LGEIN-399 : 20210607 add */
							else {
								
							}
						}
						// 2020.10.05 PJTPLP MODIFY END
						var $tempThinqSignatureFlag = $template.find('.model-brand');
						var thinqFlag = $tempThinqSignatureFlag.find('template[data-thinqFlag]').clone().html();
						var signatureFlag = $tempThinqSignatureFlag.find('template[data-signatureFlag]').clone().html();
						if(p.signatureFlag == "Y") {
							$tempThinqSignatureFlag.append(signatureFlag+" ");
							ynBrandTag = "Y";
						}
						if(p.thinqFlag == "Y") {
							$tempThinqSignatureFlag.append(thinqFlag+" ");
							ynBrandTag = "Y";
						}
						// WhiteSpace 관련 수정
						if(p.productTag1 != null || p.productTag1 != "" || p.productTag2 != null || p.productTag2 != "") {
							ynProductTag = "Y";
						}
					}
				}
				// 2020.09.28 PJTPLP ADD END 
				
				// siblingModels
				var $sibling = $template.find('.model-group .inner');
				var siblingTypeclass;
				if(p.siblingType && p.siblingType != null) {
					siblingTypeclass = (p.siblingType.toLowerCase() == "color") ? "color" : "size";
					// 2020.10.06 // WhiteSpace 관련 수정
					if($('.GPC0007').length>0 ||$('.GPC0026').length>0) {
						ynSibling = "Y";
					}
				}else {
					siblingTypeclass = null;
				}
				
				
				if((havSiblingModels && siblingTypeclass != null) && $sibling.get(0)) {
					var siblingItem = $template.find('.model-group .'+siblingTypeclass).clone().html(),
						siblingAriaTxt = $template.find('.model-group .'+siblingTypeclass).clone().attr('aria-label'),
						siblingMarkup = [];

					for (var _j = 0; _j < p.siblingModels.length; _j++) {
						var sbModel = p.siblingModels[_j];
						var item = siblingItem.replace(/\*siblingCode\*/g, sbModel.siblingCode)
											.replace(/\*siblingValue\*/g, sbModel.siblingValue)
											.replace(/\*subModelId\*/g, sbModel.modelId);
						if(sbModel.modelId != p.modelId) {
							item = item.replace('active', '');
						}else {
							var $item = $(item);
							$item.attr('aria-checked', true);
							item = $item.get(0).outerHTML;
						}
						siblingMarkup += item;
					}
					$sibling.append(siblingMarkup);
					$template.find('.model-group .inner').attr('aria-label', siblingAriaTxt);
				// 20200316 START 박지영 : aria 오류 방지
				} else {
					$sibling.removeAttr('role');
				// 20200316 END
				}

				// rolling image
				if(p.modelRollingImgList && p.modelRollingImgList != null) {
					$template.find('.visual img.pc').addClass('js-thumbnail-loop').attr('data-img-list', p.modelRollingImgList);
				}

				// PJTOBS 20200703 Start
				// re stock alert
				var $stockArea = $template.find('.stock-area');
				/*if((!p.reStockAlertFlag || p.reStockAlertFlag!='Y') && $stockArea.length>0) {
					$stockArea.removeClass('out-of-stock').empty();
				}*/
				//PJTLIMITQTY-1 START
				if((!p.reStockAlertFlag || p.reStockAlertFlag!='Y') && $stockArea.length>0) {
					if(($('.GPC0007').length > 0 || $('.GPC0026').length > 0) && p.limitSaleUseFlag == 'Y' && p.obsLimitSale == 'Y'){
						if(p.obsInventoryFlag == 'Y'){
							$stockArea.removeClass('out-of-stock').empty();
						}else{
							$stockArea.find('.text').text(productMessages.limitSaleSoldOutText);
						}
					}else{
						$stockArea.removeClass('out-of-stock').empty();
					}
				}else{
					if(($('.GPC0007').length > 0 || $('.GPC0026').length > 0) && p.limitSaleUseFlag == 'Y' && p.obsLimitSale == 'Y'){
						$stockArea.find('.text').text(productMessages.limitSaleSoldOutText);
					}
				}
				//PJTLIMITQTY-1 END
				
				// PJTOBS 20200703 End

				// buttons
				// PJTOBS 20200703 Start
				if($template.find('.button a.re-stock-alert').length>0) {
					if((!p.reStockAlertFlag || p.reStockAlertFlag!='Y')) {
						$template.find('.button a.re-stock-alert').removeClass('active');
					} else {
						$template.find('.button a.re-stock-alert').addClass('active');
					}
				}
				// PJTOBS 20200703 End
				if(p.obsPreOrderFlag == 'Y'){ //PJTOBS/2020/PJTOBSB2E-6 GILS
					if(p.obsBuynowFlag == 'Y'){
						$template.find('.button a.add-to-cart').addClass('active').data('model-id', p.modelId).attr('href', p.modelUrlPath).text(productMessages.preOrderBtnNm).removeAttr('target, title')
						.addClass('pre-order').attr('data-obs-pre-order-start-date',p.obsPreOrderStartDate).attr('data-obs-pre-order-end-date',p.obsPreOrderEndDate)
						;
					}else{
						$template.find('.button a.add-to-cart').addClass('active').data('model-id', p.modelId).attr('href', '#').text(productMessages.preOrderBtnNm).attr('role', 'button').removeAttr('target, title')
						.addClass('pre-order').attr('data-obs-pre-order-start-date',p.obsPreOrderStartDate).attr('data-obs-pre-order-end-date',p.obsPreOrderEndDate)
						;						
					}
					
				}else if(p.addToCartFlag!="N") {
					if(p.addToCartFlag == 'Y') {
						// LGEIN-125, LGEIN-155, LGEVN-80
						if(p.obsBuynowFlag == 'Y'){
							// 통합 OBS
							var buynow = $('#buynow').val();
							$template.find('.button a.add-to-cart').addClass('active').data('model-id', p.modelId).attr('href', p.modelUrlPath).text(buynow).removeAttr('target, title');
						} else{
							// 통합 OBS
							$template.find('.button a.add-to-cart').addClass('active').data('model-id', p.modelId).attr('href', '#').text(productMessages.addToCartBtnNm).attr('role', 'button').removeAttr('target, title');
						}
					} else if(p.addToCartFlag == 'S') {
						// Standalone OBS
						$template.find('.button a.add-to-cart').addClass('active').data('model-id', p.modelId).attr('href', '#').text(productMessages.addToCartBtnNm).attr('role', 'button').removeAttr('target, title');
					}
				} else if(p.buyNowFlag=="Y" || p.buyNowFlag=="L") { // buyNowFlag==Y : book online 포함
					if(p.ecommerceTarget == '_blank') {
						$template.find('.button a.add-to-cart').addClass('active').addClass('in-buynow').data('model-id', p.modelId).attr('href', p.buyNowUrl).text(productMessages.buyNowBtnNm).removeAttr('role').attr('target', '_blank').attr('title', productMessages.btnNewLinkTitle);//LGEGMC-1567
						/*LGEGMC-1841 s*/
						if(p.addToCartFlag=="N"){
							$template.find('.button a.add-to-cart').data('link-name','buy_now').attr('data-link-name','buy_now');	
						}
						/*LGEGMC-1841 e*/
					}else {
						$template.find('.button a.add-to-cart').addClass('active').addClass('in-buynow').data('model-id', p.modelId).attr('href', p.buyNowUrl).text(productMessages.buyNowBtnNm).removeAttr('role').removeAttr('target, title');//LGEGMC-1567
					}
				// 20200506 START 박지영 - flag 명 변경
				} else if (p.resellerBtnFlag=="Y") {
				// 20200506 END
					$template.find('.button a.add-to-cart').addClass('active').data('model-id', p.modelId).attr('href', p.resellerLinkUrl).text(productMessages.resellerBtnNm).removeAttr('role').attr('target', '_blank').attr('title', productMessages.btnNewLinkTitle);
				} else if (p.productSupportFlag=="Y") {
					$template.find('.button a.add-to-cart').addClass('active').data('model-id', p.modelId).attr('href', p.productSupportUrl).text(productMessages.productSupportBtnNm).removeAttr('role').removeAttr('target, title');
				} else {
					$template.find('.button a.add-to-cart').removeClass('active');
				}
				// WTB btn
				if(p.whereToBuyFlag=="Y" && p.whereToBuyUrl != null && p.whereToBuyUrl != '') {
					// go to pdp page
					$template.find('.button a.where-to-buy').addClass('active').attr('href', p.whereToBuyUrl).text(productMessages.whereToBuyBtnNm);
					$template.find('.button a.where-to-buy').removeAttr('target, title');
				// 20200410 START 박지영 - wtb external link 변경
				} else if(p.wtbExternalLinkUseFlag=="Y" && p.wtbExternalLinkUrl != null && p.wtbExternalLinkUrl != '' && p.wtbExternalLinkName != null && p.wtbExternalLinkName != '') {
					// go to external link
					//LGEGMC-2202, LGEAU-522 START
					$template.find('.button a.in-buynow:not(.add-to-cart)').addClass('active').attr('href', p.wtbExternalLinkUrl).text(p.wtbExternalLinkName).attr('data-link-name', 'buy_now').removeAttr('data-sc-item');
					if(p.wtbExternalLinkSelfFlag == 'Y') {
						$template.find('.button a.in-buynow:not(.add-to-cart)').removeAttr('target, title');
					} else {
						$template.find('.button a.in-buynow:not(.add-to-cart)').attr('target', '_blank').attr('title', productMessages.btnNewLinkTitle);
					}
					//LGEGMC-2202, LGEAU-522 END
				// 20200410 END
				} else {
					$template.find('.button a.where-to-buy').removeClass('active');
				}
				// Find a dealer btn
				if(p.findTheDealerFlag=="Y" && p.findTheDealerUrl != null && p.findTheDealerUrl != '') {
					$template.find('.button a.find-a-dealer').addClass('active').attr('href', p.findTheDealerUrl).text(productMessages.findTheDealerBtnNm);
				} else {
					$template.find('.button a.find-a-dealer').removeClass('active');
				}
				// inquiry to buy btn
				if(p.inquiryToBuyFlag=="Y" && p.inquiryToBuyUrl != null && p.inquiryToBuyUrl != '') {
					$template.find('.button a.inquiry-to-buy').addClass('active').attr('href', p.inquiryToBuyUrl).text(productMessages.inquiryToBuyBtnNm);
				} else {
					$template.find('.button a.inquiry-to-buy').removeClass('active');
				}
				
				$template.find('template').remove();
				if(i == 0){ // accessiblity focus item
					$template.addClass('first-item');
				}
				/* 2020.10.12 PJTPLP 수정 */
				if((p.rPrice != 0 && p.rPrice != null) || (p.rPromoPrice != 0 && p.rPromoPrice != null) || p.retailerPricingFlag == "Y" || p.reStockAlertFlag == "Y") {
					ynPrice = "Y";
				}
				if((p.reviewRating != "0" && p.reviewRating != null) || (p.reviewRatingStar != "0" && p.reviewRatingStar != null) || (p.reviewRatingStar2 != "0.0" && p.reviewRatingStar2 != null)
					|| (p.reviewRatingPercent != "0" && p.reviewRatingPercent != null)) {
					ynReviewRating = "Y"
				}
				
				//LGEDE-354 start
				$template.find('.tag-content').find('[data-user-type=""]').removeClass('d-none');
				$template.find('.tag-content').find('[data-user-type=ALL]').removeClass('d-none');
				if(SIGN_IN_STATUS == 'Y' && ISVIP){
					$template.find('.tag-content').find('[data-user-type=VIP]').removeClass('d-none');
				/* LGEDE-422 Start //Non-vip and Non-login */ 
				}else{
					$template.find('.tag-content').find('[data-user-type=NON_VIP]').removeClass('d-none');
				}
				/* LGEDE-422 End */ 
				//LGEDE-354 end
				
				/* LGETR-228,LGEITF-541 Start */
				if(!!data){
					if(data.recommendedRetailRriceInfo == 'Y' && (!!p.rPromoPrice || !!p.rPrice )){
						$template.find('.recommended-retail-price').show();
					}else{
						$template.find('.recommended-retail-price').hide();
					}
				}else{
					$template.find('.recommended-retail-price').hide();
				}
				/* LGETR-228,LGEITF-541 End */
				
				template = $template.get(0).outerHTML;
				html += template;
			}
			
			// 2020.10.06 PJTPLP WhiteSpace
			if($('.GPC0007').length>0 ||$('.GPC0026').length>0) {
				var template = html;
				var $template = $(template);
				var $modelButtonEl = $template.find('.products-info .model-button .button');
				$modelButtonEl.removeClass('only-button');
				$modelButtonEl.addClass('only-button');
				$modelButtonEl.each(function(){
					if($(this).find('a.active').length > 1){
						$modelButtonEl.removeClass('only-button');
					return;
					}
				});
				template = $template.get();
				html = template;
			}
			
			return html;
		},
		loadPLP: function(e, pageFlag, initMobile){ // BTOBGLOBAL-434 : 20210408 modify
			var form = filter.el;
			var isExpander = $(form).data('focus') == true;
			var url = form.action;
			if(e && e.type == 'submit') {
				e.preventDefault(); // if page change
			/* BTOBGLOBAL-434 : 20210408 modify */
			}else if(pageFlag) {
				//page
			}
			/* BTOBGLOBAL-434 : 20210408 modify */
			else if(form.page) {
				form.page.value = 1; // if filter option change
				/* BTOBGLOBAL-434 : 20210408 add */
				if(COUNTRY_CODE.toLowerCase()=='global' && $('.navigation').hasClass('b2b') && isMobile){
					filter.result.querySelector('.expander button').value = 2;
				}
				/*// BTOBGLOBAL-434 : 20210408 add */
			}

			var param = xssfilter($(form).serialize()),
				//cookieParam = $(form).find('fieldset').serialize(); // IE doesn't support this.
				// 20200325 START 박지영 : fieldset 대신 클래스명으로 변경
				cookieParam = $(form).find('.option-box input').serialize();
				// 20200325 END

			/* BTOBGLOBAL-434 : 20210414 add */
			if(!!initMobile){
				param = param + '&initMobile=Y';
			}
			/*// BTOBGLOBAL-434 : 20210414 add */
			
			ajax.call(url, param, 'json', function(d){
				var data;
				if(d && d.data) data = d.data instanceof Array ? d.data[0] : d.data;
				if(d.status == "success" && data) {

					// reset no-contents area
					if($(filter.result.querySelector('.no-content')).is(':visible')) {
						$(filter.result).children().removeAttr('style');
					}

					data.productList = data.productList && data.productList != null ? data.productList : []; 
					data.multiCategorys = data.multiCategorys && data.multiCategorys != null ? data.multiCategorys : []; 
					/* LGEUS-11775 : 20190807 add, LGEUS-11780 20190812 add */ 
					if(data.promotionTotalCount != null && filter.el.querySelector('input[type=checkbox][name=promotionsOnly]') != null  && data.promotionTotalCount == 0){
						var promotionsOnlySelector1 = filter.el.querySelector('input[type=checkbox][name=promotionsOnly]');
						promotionsOnlySelector1.setAttribute("disabled",'disabled');
						promotionsOnlySelector1.parentNode.classList.add("disabled");
						$(promotionsOnlySelector1).siblings('.filter-cnt').text('('+data.promotionTotalCount+')');
					}else if(data.promotionTotalCount != null && filter.el.querySelector('input[type=checkbox][name=promotionsOnly]') != null  && data.promotionTotalCount > 0){
						var promotionsOnlySelector2 = filter.el.querySelector('input[type=checkbox][name=promotionsOnly]');
						promotionsOnlySelector2.removeAttribute("disabled");
						promotionsOnlySelector2.parentNode.classList.remove("disabled");
						$(promotionsOnlySelector2).siblings('.filter-cnt').text('('+data.promotionTotalCount+')');
					}
					
					if(data.obsTotalCount != null && filter.el.querySelector('input[type=checkbox][name=obsOnly]') != null  && data.obsTotalCount == 0){
						var obsOnlySelector1 = filter.el.querySelector('input[type=checkbox][name=obsOnly]');
						obsOnlySelector1.setAttribute("disabled",'disabled');
						obsOnlySelector1.parentNode.classList.add("disabled");
						$(obsOnlySelector1).siblings('.filter-cnt').text('('+data.obsTotalCount+')');
					}else if(data.obsTotalCount != null && filter.el.querySelector('input[type=checkbox][name=obsOnly]') != null  && data.obsTotalCount > 0){
						var obsOnlySelector2 = filter.el.querySelector('input[type=checkbox][name=obsOnly]');
						obsOnlySelector2.removeAttribute("disabled");
						obsOnlySelector2.parentNode.classList.remove("disabled");
						$(obsOnlySelector2).siblings('.filter-cnt').text('('+data.obsTotalCount+')');
					}
					
					if(data.bundlesTotalCount != null && filter.el.querySelector('input[type=checkbox][name=bundlesOnly]') != null  && data.bundlesTotalCount == 0){
						var bundlesOnlySelector1 = filter.el.querySelector('input[type=checkbox][name=bundlesOnly]');
						bundlesOnlySelector1.setAttribute("disabled",'disabled');
						bundlesOnlySelector1.parentNode.classList.add("disabled");
						$(bundlesOnlySelector1).siblings('.filter-cnt').text('('+data.bundlesTotalCount+')');
					}else if(data.bundlesTotalCount != null && filter.el.querySelector('input[type=checkbox][name=bundlesOnly]') != null  && data.bundlesTotalCount > 0){
						var bundlesOnlySelector2 = filter.el.querySelector('input[type=checkbox][name=bundlesOnly]');
						bundlesOnlySelector2.removeAttribute("disabled");
						bundlesOnlySelector2.parentNode.classList.remove("disabled");
						$(bundlesOnlySelector2).siblings('.filter-cnt').text('('+data.bundlesTotalCount+')');
					}
					/* LGEUS-11775 : 20190807 add, LGEUS-11780 20190812 add */ 
					//if(data.productList.length > 0 || data.multiCategorys.length == 1) {
					if($(filter.result.querySelector('.promotion-wrapper')).length==0 && (data.productList.length > 0 || data.multiCategorys.length == 1)) {
						// normal product list & single promotion list
						//var data =  d.data instanceof Array ? d.data[0] : d.data,
						//	html;
						var html;

						// if single promotion type
						var singleTotalCount = 0;
						if(data.multiCategorys && data.multiCategorys.length == 1) {
							singleTotalCount = data.totalCount;
							var singleCate = data.multiCategorys,
								filterEnableList = data.filterEnableList;
							data = singleCate instanceof Array ? singleCate[0] : singleCate;
							data.filterEnableList = filterEnableList;
						}

						// make markup
						//console.log(data);
						html = filter.createProductItem(data.productList, d.data[0].productMessages, data);

						var pageInfo = data.pageInfo;
						if(isExpander) { // mobile append list
							$(filter.result.querySelector('.pagination')).hide();

							$(filter.result.querySelector('.list-box')).append(html);
							bindImgError();
							runBVStaticPLP($(filter.result));
							if(typeof renderListingInlineRatingsRU != 'undefined') renderListingInlineRatingsRU(getProductsNameRU());
							var pageVisible = pageInfo && pageInfo.view == "Y";
							if(pageVisible && pageInfo.page < pageInfo.pageCount) {
								filter.result.querySelector('.expander button').value = pageInfo.page+1;
								$(filter.result.querySelector('.expander')).show();
							}else {
								$(filter.result.querySelector('.expander')).hide();
							}
						}else {
							$(filter.result.querySelector('.expander')).hide();

							$(filter.result.querySelector('.list-box')).html(html);
							bindImgError();
							runBVStaticPLP($(filter.result));
							if(typeof renderListingInlineRatingsRU != 'undefined') renderListingInlineRatingsRU(getProductsNameRU());
							if(data.totalCount) {
								$('#resultProductList .result-number').text(data.totalCount);
							} else if(singleTotalCount){
								$('#resultProductList .result-number').text(singleTotalCount);
							}
							/* 20191111 : LGEUS-11779 add */
							if($('#categoryFilterForm input[type=checkbox]:checked').length == 0 && $('#categoryFilterForm .slider-wrap input[value!=""]').length == 0){
								$('#resultProductList .result-info .total2').hide();
								$('#resultProductList .result-info .total1').show();
							}else{
								$('#resultProductList .result-info .total2').show();
								$('#resultProductList .result-info .total1').hide();
							}
							/* //20191111 : LGEUS-11779 add */
							
							/* LGEGMC-754 : 20201123 add */
							if(Number($('#resultProductList .total2 .result-number-total').text()) < Number($('#resultProductList .total2 .result-number').text())){
								$('#resultProductList .total2 .result-number-total').text(Number($('#resultProductList .total2 .result-number').text()));
							}
							/*// LGEGMC-754 : 20201123 add */
							// setting pagination
							if(pageInfo && pageInfo.view == "Y") {
								if(filter.result.querySelector('.pagination')){
									var pageMarkup = [];
									for (var pageIdx = pageInfo.loopStart; pageIdx <= pageInfo.loopEnd; pageIdx++) {
										/* LGEGMC-754 : 20201123 modify */
										var _pageItem = filter.pageTemplate? filter.pageTemplate :'<li><button type="button" value=""></button></li>' ;
										/*// LGEGMC-754 : 20201123 modify */
										_pageItem = $(_pageItem).get(0);
										var _pageButton = _pageItem.querySelector('button');
										_pageButton.value = pageIdx;
										_pageButton.innerHTML = pageIdx;
										if(pageIdx.toString() == pageInfo.page) {
											_pageButton.setAttribute('class', 'active');
											// WA-GPC0007-01 : aria-current 추가
											_pageButton.setAttribute('aria-current', 'page');
										}
										if(filter.result.querySelector('.pagination').getAttribute('data-aria-pattern')) {
											var _ariaText = filter.result.querySelector('.pagination').getAttribute('data-aria-pattern').replace(/\#/g, pageIdx);
											_pageButton.setAttribute('aria-label', _ariaText);
										}
										pageMarkup += _pageItem.outerHTML;
									}
									$(filter.result.querySelector('.pagination ul')).html(pageMarkup); 

									filter.result.querySelector('.pagination .prev').disabled = !pageInfo.leftPage;
									filter.result.querySelector('.pagination .next').disabled = !pageInfo.rightPage;
									filter.result.querySelector('.pagination .prev').value = pageInfo.page-1;
									filter.result.querySelector('.pagination .next').value = pageInfo.page+1;
									$(filter.result.querySelector('.pagination')).show();
								}else if(filter.result.querySelectorAll('.btn-area').length > 0){
									filter.result.querySelector('.btn-area .prev').disabled = !pageInfo.leftPage;
									filter.result.querySelector('.btn-area .next').disabled = !pageInfo.rightPage;
									$(filter.result.querySelector('.btn-area')).show();
								}
								
								/* LGEGMC-754 : 20201123 add */
								if(!!!filter.result.querySelector('.pagination')){
									//list-box
									var prevFlag = '';
									var nextFlag = '';
									if(pageInfo.leftPage != true) prevFlag = ' disabled';
									if(pageInfo.rightPage != true) nextFlag = ' disabled';
									
									var pageTemplate = '';
									var pageMarkup = [];
									pageTemplate += '<div class="pagination" role="navigation" aria-label="'+ $('input[name=component-Pagination]').val() +'" data-aria-pattern="'+ $('input[name=component-page]').val() +' #">';
									pageTemplate += '<button type="button" value="1" class="prev" aria-label="'+ $('input[name=component-previousPage]').val() +'"'+prevFlag+'>'+ $('input[name=component-prev]').val() +'</button>';		
									
									pageTemplate += '<ul>';
									for (var pageIdx = pageInfo.loopStart; pageIdx <= pageInfo.loopEnd; pageIdx++) {
										var _pageItem = '<li><button type="button" value=""></button></li>';
										_pageItem = $(_pageItem).get(0);
										var _pageButton = _pageItem.querySelector('button');
										_pageButton.value = pageIdx;
										_pageButton.innerHTML = pageIdx;
										if(pageIdx.toString() == pageInfo.page) {
											_pageButton.setAttribute('class', 'active');
											// WA-GPC0007-01 : aria-current 추가
											_pageButton.setAttribute('aria-current', 'page');
										}
										pageMarkup += _pageItem.outerHTML;
									}
									pageTemplate += pageMarkup;
									pageTemplate += '</ul>';						
									pageTemplate += '<button type="button" value="2" class="next" aria-label="'+ $('input[name=component-nextPage]').val() +'"'+nextFlag+'>'+ $('input[name=component-next]').val() +'</button>';						
									pageTemplate += '</div>';
									$('#resultAppendTarget .list-box').after(pageTemplate);
								}
								
								if(pageInfo.loopStart != pageInfo.loopEnd && !!!filter.result.querySelector('.expander')) {
									var pageTemplate = '';
									pageTemplate += '<div class="expander">';
									pageTemplate += '<button type="button" class="btn btn-outline-secondary btn-sm" value="2">'+ $('input[name=component-loadMore]').val() +'</button>';
									pageTemplate += '</div>';
									$('#resultAppendTarget .list-box').after(pageTemplate);
								}
								/* LGEGMC-754 : 20201123 add */
								
								if(isMobile && pageInfo.loopStart != pageInfo.loopEnd) {
									$(filter.result.querySelector('.pagination')).hide();
									$(filter.result.querySelector('.expander')).show();
								}
								if($('.compare-wrap').length>0) {
									// for compare product
									if(pageInfo.page <= 1) {
										filter.result.querySelector('.btn-area .prev').disabled = true; // disabled
									} else {
										filter.result.querySelector('.btn-area .prev').disabled = false; // enabled
									}
									if(pageInfo.page == pageInfo.loopEnd) {
										filter.result.querySelector('.btn-area .next').disabled = true; // disabled
									} else {
										filter.result.querySelector('.btn-area .next').disabled = false; // enabled
									}
								}
								/* BTOBGLOBAL-434 : 20210414 add */
								if(!!initMobile){									
									filter.result.querySelector('.expander button').value = Number($(filter.el).find('input[type=hidden][name=page]').val()) + 1;
								}
								/*// BTOBGLOBAL-434 : 20210414 add */
							}else {
								$(filter.result.querySelector('.pagination')).hide();
								// .btn-area should not be hidden in compare product page.
								if($('.compare-wrap').length==0) {
									// for plp page
									$(filter.result.querySelector('.btn-area')).hide();
								} else {
									// for compare product
									filter.result.querySelector('.btn-area .prev').disabled = !pageInfo.leftPage;
									filter.result.querySelector('.btn-area .next').disabled = !pageInfo.rightPage;
									$(filter.result.querySelector('.btn-area')).show();
								}
							}

							filter.activateInput(data.filterEnableList);
							plp.mediaBranch(window.matchMedia('(max-width: 1069px)'));
							plp.addAriaDescribedby();
						}
						
						$(form).data('focus', false);
						$(filter.el).trigger('appended');

						if(e && e.type == 'submit') {
							// if event type is page change
							var _focusItem = filter.result.querySelector(".first-item");
							//$(_focusItem).find("a, button").eq(0).focus();
							$(_focusItem).removeClass("first-item");
						}

						//if(typeof runEcorebates !== "undefined") {
						//	if($.isFunction(runEcorebates)) runEcorebates();
						//}
						
					}else if(data.multiCategorys.length >= 1) {
						// multi promotion category
						$(filter.result.querySelector('.promotion-wrapper')).html('');
						for (var i = 0; i < data.multiCategorys.length; i++) {
							var promoTemplate = $('#promotionTemplate').clone().html(),
								p = data.multiCategorys[i];

							// LGEGMC-526
							var pHtml = filter.createProductItem(p.productList, data.productMessages);
							var productListHtml = "";
							for (var h=0; h<pHtml.length; h++) {
								productListHtml += pHtml[h].outerHTML;
							}
							// LGEGMC-526

							promoTemplate = promoTemplate.replace(/\*categoryName\*/g, p.categoryName)
												.replace(/\*categoryId\*/g, p.categoryId)
												.replace(/\*viewAllAjaxUrl\*/g, p.viewAllAjaxUrl)
												.replace(/\*productList\*/g, productListHtml) // LGEGMC-526
												.replace(/\*modelCopyUrl\*/g, p.modelUrlPath);

							var $promoTemplate = $(promoTemplate);

							// LGEGMC-526
							if(!p.viewAllAjaxUrl || p.viewAllAjaxUrl == null) {
								$promoTemplate.find('.list-more').removeAttr('data-url');
							}
							
							// pagination (view all)
							if(isMobile) {
								if(pHtml.length<3) {
									$promoTemplate.removeClass("close").addClass("open");
								}
							}else {
								if(pHtml.length<4) {
									$promoTemplate.removeClass("close").addClass("open");
								}
							}
							// LGEGMC-526 End

							$(filter.result.querySelector('.promotion-wrapper')).append($promoTemplate.get(0).outerHTML);
							bindImgError();
							runBVStaticPLP($(filter.result));
							if(typeof renderListingInlineRatingsRU != 'undefined') renderListingInlineRatingsRU(getProductsNameRU());
							filter.activateInput(data.filterEnableList);
							plp.mediaBranch(window.matchMedia('(max-width: 1069px)'));
							plp.addAriaDescribedby();
						}
						
						// LGEGMC-526
						if(data.totalCount) {
							$('#resultProductList .result-number').text(data.totalCount);
						}

						if($('#categoryFilterForm input[type=checkbox]:checked').length == 0 && $('#categoryFilterForm .slider-wrap input[value!=""]').length == 0){
							$('#resultProductList .result-info .total2').hide();
							$('#resultProductList .result-info .total1').show();
						}else{
							$('#resultProductList .result-info .total2').show();
							$('#resultProductList .result-info .total1').hide();
						}
						// LGEGMC-526 End
					}else {
						// empty data;
						$(filter.result.querySelector('.no-content')).show()
							.siblings().hide();
						$('.result-number').text('0');
						//LGEUS-11780 20190812 add
						filter.activateInput(data.filterEnableList);
						//LGEUS-11780 20190812 add
					}

					if(thumbnailLoop) $(filter.result).trigger('thumbnailCarousel');
					/* LGEBE-4 : 20200608 add */
					pdp_where.init();
					/*// LGEBE-4 : 20200608 add */

					// PJTOBS-32 Start
					if(ISVIP && $('input[name=vipPriceOnly]').length>0 && data.obsVipTotalCount>0 && data.vipPriceOnlyFlag == 'Y') { //LGEDE-365 : 20210713 modify
						var $vipOnly = $('input[name=vipPriceOnly]');
						$vipOnly.closest('li').removeAttr('hidden');
						$vipOnly.siblings('.text').find('.filter-cnt').text('('+data.obsVipTotalCount+')');
					}
					// PJTOBS-32 End
					//GPC Compare list whitespace 반영
					if($(".result-box").hasClass('compare-list')){
						console.log(data.productList[0].priceAreaYn ,data.productList[0].promotionAreaYn)
						if(data.productList[0].priceAreaYn == 'Y'&& data.productList[0].promotionAreaYn == 'N' ) {
							setTimeout(function() {
								$('.promotion-text').remove();
								$('.model-buy').addClass('only-price');
								
							}, 200);
						}
						if(data.productList[0].priceAreaYn == 'N' && data.productList[0].promotionAreaYn == 'Y' ) {
							setTimeout(function() {
								$('.price-area').remove();
								$('.model-buy').addClass('only-prm');
								
							}, 200);
						} 
						if(data.productList[0].priceAreaYn == 'N' && data.productList[0].promotionAreaYn == 'N' ) {
							setTimeout(function() {
								$('.model-buy').remove();
								
							}, 200);
						}  
						if(data.productList[0].siblingAreaYn == 'N') {
							setTimeout(function() {
								$('.model-group').remove();
								
							}, 200);
						}
					}
							
				}

				if(!e || e.type != 'submit') {
					// if filter option change
					filter.cookie.bake(cookieParam);
				}

				// clear hidden input
				//if(form.viewAll) {
				//	form.viewAll.value = "";
				//}
				if(form.length) {
					form.length.disabled = false;
				}

				$('body').trigger('initialized-plp');
				initWhiteSpace();
				if($('.share-common').length > 0){
					initShareCommon();
				}
				var $objGroup = $('.GPC0007, .GPC0026').find('.model-group');
				$objGroup.each(function() {
					var _this = $(this);
					var obj_ea = _this.find('a').length;
					var group_width = $objGroup.width();
					var obj_width = _this.find('a').outerWidth(true);
					var obj_etc = (obj_ea - 1) * 4; // LGETW-256 : margin 값 계산 수정
					if(obj_ea * obj_width + obj_etc > group_width){
						_this.addClass('limited');
						if(!_this.find('button').hasClass('btn-limited')){
							_this.append('<button class="btn-limited">'+ '(' + obj_ea + ')' +'</button>')
							_this.find('button').on('click', function(e){
								if ($(window).width() < 768){
									_this.toggleClass('open');
									if(_this.hasClass('open')){
										$('.model-group').removeClass('open')
										_this.addClass('open');
									} else{
										_this.removeClass('open');
									}
								}
							});
						}
					} else{
						_this.removeClass('limited');
						_this.find('.btn-limited').remove();
					}
				});
				$(window).on('scroll' ,function(){
					if ($(window).width() < 767){
						$('.label-inner').each( function(i){
							var srlTop = $(window).scrollTop();
							var winH = $(window).innerHeight();
							var harf_pos = winH / 2;
							var obj_pos = $(this).offset().top + harf_pos;
							if( srlTop + winH > obj_pos ){
								$(this).addClass("act");
								$(this).removeClass("imp");
								$(this).parent('.label-list').find('button').attr('disabled', true)
							}  else{
								$(this).removeClass("act");
								$(this).parent('.label-list').find('button').attr('disabled', false)
							}
						});
					} 
				});
				var $item_width = $('.list-box').find('li > .item').outerWidth();
					if ($(window).width() < 767 || isMobile){
					$('.pd-share').find('.list').addClass('mobileSns')
				} else{
					$('.pd-share').find('.list').css('width', $item_width);
					$('.pd-share').find('.list').removeClass('mobileSns')
				}

				if($('.GPC0026 .list-box .btn-popup-review').length > 0){
					var $reviewBtn = $(document).find('[data-review-event-click]');
					$reviewBtn.on('click', function(e) {
						var $obj = $(this);
						var productId = $obj.attr('data-review-model-id');
						var model = $obj.attr('data-review-model-id');
						var eventType = $obj.attr('data-review-event-click');
						
						switch(eventType){
						case 'BV' :
							e.preventDefault();
							$BV.ui('rr','submit_review', {productId : model});
							break;

						case 'LGCOM' :
							 writeReview.init($obj);
							break;

						case 'SP' :
							break;

						case 'CENEO' :
							break;

						default :
							break;
						}
					});
				}
			}, null, 'body');

			if(filter.initial == param) {
				// if the initial Form data is the same as this Form data
				$(filter.banner).show();
			}else {
				$(filter.banner).hide();
			}			
			/* LGECI-260 201229 add :: [web accessibility] paging num tab -> focus to list first item */
			/* BTOBGLOBAL-434 : 20210414 modify */
			if(!isMobile){
				$(filter.result).find("a, button").eq(0).focus();
			}
			/*// BTOBGLOBAL-434 : 20210414 modify */
			/* //LGECI-260 201229 add */
		},
		// GPC0026 multi category View All (.list-more)
		viewAllPromotionPLP: function(e, isWholeBtn){
			var $closest = $(e.currentTarget).closest('.promotion-box'),
				$listMore = $(e.currentTarget).closest('.list-more'),
				url = $listMore.get(0).getAttribute('data-url'),
				dataParam = $listMore.data();
				// dataParam = $.param($(filter.el).serializeArray()) + $.param($listMore.data());

			delete dataParam.url;

			var newParam = $(filter.el).serialize().replace(/\&filterCategoryId=[A-Z]+[0-9]+/g, '') + '&filterCategoryId='+$listMore.data('category-id');

			//dataParam = $.param(dataParam) + "&" + $(filter.el).serialize();
			dataParam = $.param(dataParam) + "&" + newParam;

			// find auto focusing item
			var $focusItem = $closest.find(".list-box li:visible:last").next();
			if(url && url != null) {
				ajax.call(url, xssfilter(dataParam), 'json', function(d){
					var data;

					if(d && d.data) data = d.data instanceof Array ? d.data[0] : d.data;

					// json에서 multiCategorys: [] 로 출력되는 경우 오류 방지
					data.productList = !data.productList ? ((!data.multiCategorys[0]) ? data.multiCategorys : data.multiCategorys[0].productList) : data.productList;
					if(data.productList) {
						//var data =  d.data instanceof Array ? d.data[0] : d.data,
						var html = filter.createProductItem(data.productList, data.productMessages);

						// append item markup
						$closest.find('.list-box').append(html)
							.find(".first-item").removeClass("first-item");
						initWhiteSpace();
						bindImgError();
						runBVStaticPLP($(filter.result));
						if(typeof renderListingInlineRatingsRU != 'undefined') renderListingInlineRatingsRU(getProductsNameRU());
						// open promotion box
						$closest.addClass('open');

						// focusing item
						if(!isWholeBtn) { // if top of view all button
							$focusItem.find("a, button").eq(0).focus();
						}else {
							$(filter.result).find("a, button").eq(0).focus();
						}

						if(thumbnailLoop) $(filter.result).trigger('thumbnailCarousel');
					}
				}, null, 'body');
				if($('.visual').hasClass('hasThumbnail')){
					setTimeout(function(){
						$('.visual').addClass('hasThumbnail');
					}, 300);
				}
			}else {
				$closest.addClass('open');

				// focusing item
				if(!isWholeBtn) {
					$focusItem.find("a, button").eq(0).focus();
				}else {
					$(filter.result).find("a, button").eq(0).focus();
				}
			}
		},
		reset: function(e){
			/*LGEES-15 modify*/
			if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')||COUNTRY_CODE.toLowerCase()=='es' || COUNTRY_CODE.toLowerCase()=='uk') {
				var form = filter.el;
				// if(window.history.pushState) {
				// 	window.history.pushState({},'','?');
				// }else {
				// 	location.search = '';
				// }
				
				filter.removeEvent();
				filter.cookie.reset();

				$(form).find('input:checked').removeAttr('checked');
				$(form).find('.slider-wrap input').val('').removeData('index');
				filter.slider.setSlider();

				pageHistory.removeHistory();

				/* 20191111 : LGEUS-11779 add */
				$('.GPC0007 .apply-filters span').remove();
				$('.GPC0007 .apply-filters a.link-text').removeClass('active');
				/* //20191111 : LGEUS-11779 add */
				// LGEGMC-526
				$('.GPC0026 .apply-filters span').remove();
				$('.GPC0026 .apply-filters a.link-text').removeClass('active');
				// LGEGMC-526 End
				// PJTPROCOM-3
				// PJTPROCOM-3 End
				if($('.eprivacy-tooltip').length>0){
					$("#modal_cookie_set").hide();
					$('.page-cookie-view').unwrap();
					$("#modal_cookie_set").removeClass('page-cookie-view');
				}
				setTimeout(function() {
					filter.addEvent();
					filter.loadPLP();
				}, 100);
			} else {
				ePrivacyCookies.view('click');
			}
		},
		removeEvent: function(){
			// 20200316 START 박지영 compare.js에서 bind한 appended 이벤트를 삭제 하지 않도록 수정
			$(filter.el).off('submit change reset');
			// 20200316 END
		},
		addEvent: function(){
			$(filter.el).off('submit').on({ /* BTOBGLOBAL-434 : 20210414 modify */
				submit: filter.loadPLP
			});
			$(filter.el).off('change').on({ /* BTOBGLOBAL-434 : 20210414 modify */
				change: function(event, ui) {
						/*LGEES-15 modify*/ 
					if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS') ||COUNTRY_CODE.toLowerCase()=='es' || COUNTRY_CODE.toLowerCase()=='uk') {
						if(ui && ui.handle) {
							var min= $(this).siblings().find('.min-box input').get(0),
								max = $(this).siblings().find('.max-box input').get(0);

							var inputArray = [min, max],
								idx = ui.handleIndex;

							if(inputArray[idx].value && inputArray[idx].value != inputArray[idx].getAttribute('data-old')) {
								var v = (idx==0) ? ($(this).siblings().find('.min-box span').text().replace(/[^0-9.]/g,'')) : ($(this).siblings().find('.max-box span').text().replace(/[^0-9.]/g,''));
								adobeTrackEvent('product-list-filter', {filter_name : inputArray[idx].getAttribute('name')+"_"+v, page_event : {filter_apply : true}});
							}
							
							inputArray[idx].setAttribute('data-old', inputArray[idx].value);

							if($(this).siblings().find('.min-box input').val()=="" && $(this).siblings().find('.max-box input').val()==""){
								$('.GPC0007 .apply-filters span[data-filter-value='+$(this).parent().attr('data-value')+']').remove();
							}else{
								var relVal = $(this).parent().siblings('.title').find('strong').text()+" : "+$(this).siblings().find(".min-box span").text()+"-"+$(this).siblings().find(".max-box span").text();						
								var checkName = $(this).attr('name');
								if($('.GPC0007 .apply-filters span[data-filter-value='+$(this).parent().attr('data-value')+']').length != 0){
									var _targetTxt = $('.GPC0007 .apply-filters span[data-filter-value='+$(this).parent().attr('data-value')+']');
									_targetTxt.contents().filter(function(){return this.nodeType == 3;})[0].nodeValue = relVal;
								}else{
									var $filter_icon = "<span data-filter-name='"+checkName+"' data-filter-value='"+$(this).parent().attr('data-value')+"'>"+relVal+" <a href='#'><span class=\"sr-only\">"+removeTxt+"</span></a></span>";
									$('.GPC0007 .apply-filters .link-text').before($filter_icon);		
									$('.GPC0007 .apply-filters span[data-filter-value='+$(this).parent().attr('data-value')+'] a').one('click',function(e){
										e.preventDefault();
										// 20200325 START 박지영 : slider의 min, max 텍스트 초기화 안되는 오류 수정
										var fv = $(this).parent().attr('data-filter-value');
										var options = $('.GPC0007 .slider-wrap[data-value="'+fv+'"] .slider-range').slider('option');
										$('.GPC0007 .slider-wrap[data-value="'+fv+'"] input').val('').removeData('index');
										$('.GPC0007 .slider-wrap[data-value="'+fv+'"] .slider-range').slider('values',[options.min, options.max]);
										$('.GPC0007 .slider-wrap[data-value="'+fv+'"] .min-box span').text(Object.keys(dragbarVal[fv][options.min])[0]);
										$('.GPC0007 .slider-wrap[data-value="'+fv+'"] .max-box span').text(Object.keys(dragbarVal[fv][options.max])[0]);
										// 20200325 END
										$(this).parent().remove();
									});
								}
							}
							if($('.GPC0007 .apply-filters span').length != 0){
								$('.GPC0007 .apply-filters a.link-text').addClass('active');
							}else{
								$('.GPC0007 .apply-filters a.link-text').removeClass('active');
							}

							// LGEGMC-526
							if($(this).siblings().find('.min-box input').val()=="" && $(this).siblings().find('.max-box input').val()==""){
								$('.GPC0026 .apply-filters span[data-filter-value='+$(this).parent().attr('data-value')+']').remove();
							}else{
								var relVal = $(this).parent().siblings('.title').find('strong').text()+" : "+$(this).siblings().find(".min-box span").text()+"-"+$(this).siblings().find(".max-box span").text();
								var checkName = $(this).attr('name');
								if($('.GPC0026 .apply-filters span[data-filter-value='+$(this).parent().attr('data-value')+']').length != 0){
									var _targetTxt = $('.GPC0026 .apply-filters span[data-filter-value='+$(this).parent().attr('data-value')+']');
									_targetTxt.contents().filter(function(){return this.nodeType == 3;})[0].nodeValue = relVal;
								}else{
									var $filter_icon = "<span data-filter-name='"+checkName+"' data-filter-value='"+$(this).parent().attr('data-value')+"'>"+relVal+" <a href='#'><span class=\"sr-only\">"+removeTxt+"</span></a></span>";
									$('.GPC0026 .apply-filters .link-text').before($filter_icon);		
									$('.GPC0026 .apply-filters span[data-filter-value='+$(this).parent().attr('data-value')+'] a').one('click',function(e){
										e.preventDefault();
										// 20200325 START 박지영 : slider의 min, max 텍스트 초기화 안되는 오류 수정
										var fv = $(this).parent().attr('data-filter-value');
										var options = $('.GPC0026 .slider-wrap[data-value="'+fv+'"] .slider-range').slider('option');
										$('.GPC0026 .slider-wrap[data-value="'+fv+'"] input').val('').removeData('index');
										$('.GPC0026 .slider-wrap[data-value="'+fv+'"] .slider-range').slider('values',[options.min, options.max]);
										$('.GPC0026 .slider-wrap[data-value="'+fv+'"] .min-box span').text(Object.keys(dragbarVal[fv][options.min])[0]);
										$('.GPC0026 .slider-wrap[data-value="'+fv+'"] .max-box span').text(Object.keys(dragbarVal[fv][options.max])[0]);
										// 20200325 END
										$(this).parent().remove();
									});
								}
							}
							if($('.GPC0026 .apply-filters span').length != 0){
								$('.GPC0026 .apply-filters a.link-text').addClass('active');
							}else{
								$('.GPC0026 .apply-filters a.link-text').removeClass('active');
							}
							// LGEGMC-526 End
							
							// PJTPROCOM-3
							
							// LGEGMC-526 End
						} else {
							var name = changeTitleFormat($(this).closest('.option-box').find('.title strong').text());
							var val = $(this).parent().find('.text .name').length>0 ? changeTitleFormat($(this).parent().find('.text .name').text()) : changeTitleFormat($(this).parent().find('.text').text());
							var relVal2 = ($(this).parent().find('.text .filter-cnt').length==0)?$(this).parent().find('.text').text():$(this).parent().find('.text').text().replace($(this).parent().find('.text .filter-cnt').text(),'');
							var checkName = $(this).attr('name');
							if(!val || val=="") {
								// for color
								val = changeTitleFormat($(this).attr('title'));
								relVal2 = $(this).attr('title');
							}

							// LGEGMC-526, LGEGMC-1183 Start
							if($(this).prop('checked')) {
								/*// PJTGADL-2 : 20210421 add */
								var count = $(this).parent().find('.text .filter-cnt').text();
								count = count.replace("(" , "");
								count = count.replace(")" , "");
								dataLayer.push({
									'event'			: 'search_filter_click',
									'searchWords'	:   relVal2,
									'resultProductCnt' : count,
								});
								console.log('search_filter_click');
								var $filter_icon2 = "<span data-filter-name='"+checkName+"' data-filter-value='"+$(this).val()+"'>"+relVal2+" <a href='#'><span class=\"sr-only\">"+removeTxt+"</span></a>";
								if($('.GPC0007 .apply-filters span').length == 0){
									$('.GPC0007 .apply-filters a.link-text').addClass('active');
								}
								$('.GPC0007 .apply-filters .link-text').before($filter_icon2);
								$('.GPC0007 .apply-filters span[data-filter-value='+$(this).val()+'] a').one('click',function(e){
									e.preventDefault();
								if($(this).parent().attr('data-filter-value')!=='Y'){
										$('.GPC0007 #categoryFilterForm input[value="'+$(this).parent().attr('data-filter-value')+'"]').click();
									}else{
										$('.GPC0007 #categoryFilterForm input[name="'+$(this).parent().attr('data-filter-name')+'"]').click();
									}
								});

								if($('.GPC0026 .apply-filters span').length == 0){
									$('.GPC0026 .apply-filters a.link-text').addClass('active');
								}
								$('.GPC0026 .apply-filters .link-text').before($filter_icon2);
								$('.GPC0026 .apply-filters span[data-filter-value='+$(this).val()+'] a').one('click',function(e){
									e.preventDefault();
								if($(this).parent().attr('data-filter-value')!=='Y'){
										$('.GPC0026 #categoryFilterForm input[value="'+$(this).parent().attr('data-filter-value')+'"]').click();
									}else{
										$('.GPC0026 #categoryFilterForm input[name="'+$(this).parent().attr('data-filter-name')+'"]').click();
									}
								});

								if(name && val) {
									adobeTrackEvent('product-list-filter', {filter_name : name+"_"+val, page_event : {filter_apply : true}});
								} else if (val) {
									adobeTrackEvent('product-list-filter', {filter_name : val, page_event : {filter_apply : true}});
								}
							} else {
								if($(this).val() != '') {
									$('.GPC0007 .apply-filters span[data-filter-value='+$(this).val()+']').remove();
									$('.GPC0026 .apply-filters span[data-filter-value='+$(this).val()+']').remove();
								}
								if($('.GPC0007 .apply-filters span').length == 0){
									$('.GPC0007 .apply-filters a.link-text').removeClass('active');
								}

								if($('.GPC0026 .apply-filters span').length == 0){
									$('.GPC0026 .apply-filters a.link-text').removeClass('active');
								}
							}
							// LGEGMC-526, LGEGMC-1183 End
						}
						/* BTOBGLOBAL-434 : 20210408 modify */						
						if(COUNTRY_CODE.toLowerCase()=='global' && $('.navigation').hasClass('b2b') && event.originalEvent == undefined){
							if(isMobile){
								filter.loadPLP(event, true, true);
							}else{
								filter.loadPLP(event, true);
							}														
						}else{
							if(plp.el.form.viewAll) plp.el.form.viewAll.value = '';
							pageHistory.removeHistory();
							filter.loadPLP();
						}
						/*// BTOBGLOBAL-434 : 20210408 modify */
						if($('.eprivacy-tooltip').length>0){
							$("#modal_cookie_set").hide();
							$('.page-cookie-view').unwrap();
							$("#modal_cookie_set").removeClass('page-cookie-view');
						}
					} else {
						ePrivacyCookies.view('click');
						if($(this).prop('checked')) {
							$(this).prop('checked', false);
						}
					}
				}
			}, 'input, .slider-range');
			$(filter.el).off('reset').on({ /* BTOBGLOBAL-434 : 20210414 modify */
				reset: filter.reset
			});
			$('.GPC0007 .apply-filters .link-text').off('click').on('click',function(e){ /* BTOBGLOBAL-434 : 20210414 modify */
				e.preventDefault();
				/* BTOBGLOBAL-434 : 20210414 modify */
				if(COUNTRY_CODE.toLowerCase()=='global' && $('.navigation').hasClass('b2b')){
					$(filter.el)[0].reset();
				}else{
					$(filter.el).find('.etc-box button[type="reset"]').trigger('click');
				}
				/*// BTOBGLOBAL-434 : 20210414 modify */
			});
			// LGEGMC-526
			$('.GPC0026 .apply-filters .link-text').off('click').on('click',function(e){ /* BTOBGLOBAL-434 : 20210414 modify */
				e.preventDefault();
				/* BTOBGLOBAL-434 : 20210414 modify */
				if(COUNTRY_CODE.toLowerCase()=='global' && $('.navigation').hasClass('b2b')){
					$(filter.el)[0].reset();
				}else{
					$(filter.el).find('.etc-box button[type="reset"]').trigger('click');
				}
				/*// BTOBGLOBAL-434 : 20210414 modify */
			});
			// LGEGMC-526 End
			// PJTPROCOM-3
			// PJTPROCOM-3 End
		}
	};

	// PLP pagination & sorting function
	plp = {
		el: {
			list: document.getElementById('resultProductList'),
			scrollTarget: document.getElementById('resultAppendTarget'),
			form: document.getElementById('categoryFilterForm')
		},
		init: function(){
			var _this = plp;
			plp.addEvent();
			_this.mediaBranch(window.matchMedia('(max-width: 1069px)'));

			_this.addAriaDescribedby();
		},
		addAriaDescribedby: function(){
			var _this = plp;
			var waNumber = 0;
			$(_this.el.list).find('.list-box .item').each(function() {
				var $target;
				if($(this).find('.model-name a') && !$(this).find('.model-name a').is(':empty')) {
					$target = $(this).find('.model-name a');
				}
				if($target) {
					$target.attr('id', 'wa_PLP_'+waNumber);
					$(this).find('a.btn').attr('aria-describedby', 'wa_PLP_'+waNumber);
					$(this).find('a.js-compare').attr('aria-describedby', 'wa_PLP_'+waNumber).attr('role', 'button');
					waNumber++;
				}
			});
		},
		mediaBranch: function(e, rebuild) {
			if($('.promotion-box').length>0) {
				var _this = plp;
				var l = _this.el.list.querySelectorAll('.promotion-box');
				var leng = filter.el.querySelectorAll('.option-box').length;
				
				leng = leng > 0 ? 3 : 4;

				if (e.matches) { // mobile;
					for (var i = 0; i < l.length; i++) {
						var _l = l[i];
						if(2 >= _l.querySelectorAll('.list-box li').length) {
							$(_l).addClass('js-open');
						}else {
							$(_l).removeClass('js-open');
						}
					}
				} else { 
					for (var j = 0; j < l.length; j++) {
						var _lj = l[j];
						if(leng >= _lj.querySelectorAll('.list-box li').length) {
							$(_lj).addClass('js-open');
						}else {
							$(_lj).removeClass('js-open');
						}
					}
				}
			}
		},
		addEvent: function(){
			var _this = this;
			$(plp.el.list).off('click').on({ /* BTOBGLOBAL-434 : 20210414 modify */
				click: function(e){
					e.preventDefault();
					if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')  ||COUNTRY_CODE.toLowerCase()=='uk') {
						var page;
						if($(e.currentTarget).closest('.expander')[0]) { // lead more button
							page = e.currentTarget.value;
							$(plp.el.form).data('focus', true);
						}else { // general page button
							page = $(e.currentTarget).is('a') ? e.currentTarget.getAttribute('href') : e.currentTarget.value;

							var pagePosition = "";
							if($(e.currentTarget).is(".prev")) {
								pagePosition = "L";
							}else if($(e.currentTarget).is(".next")){
								pagePosition = "R";
							}
							plp.el.form.pagePosition.value = pagePosition;

							$('html, body').animate({
								scrollTop: $(plp.el.list).offset().top
							}, 500);
							$(plp.el.form).data('focus', false);
						}

						// multi-promotion view all button (multi-promotion page does not have a pagination)
						if($('.promotion-wrapper .list-more').length > 0) {
							// trigger all of view-all button click event
							$('.promotion-wrapper .list-more a:visible').trigger('click', [true]);
						// general view all button
						}else {
							if($(e.currentTarget).is('.view-all')) {
								if(plp.el.form.viewAll) plp.el.form.viewAll.value = "Y";
								plp.el.form.length.disabled = true;
								plp.el.form.page.value = 'viewAll';
							}else {
								//if(plp.el.form.viewAll) plp.el.form.viewAll.value = "N";
								plp.el.form.length.disabled = false;
								plp.el.form.page.value = page;
							}
							$(plp.el.form).submit();
							//filter.loadPLP(); XXX

							// 20200421 START 박지영 - view all 클릭시 읽어주도록 수정
							// WA
							if($(e.currentTarget).is('.view-all')) {
								var viewAllMsg = $('.view-all').siblings('.msg-sort').text() || 'All products are shown.';
								$('.view-all').siblings('.msg-sort').text(viewAllMsg);
							}
							// 20200421 END
						}

						if($(e.currentTarget).is('.view-all')) {
							pageHistory.setHistory('view-all');
						} else if($(e.currentTarget).is('.pagination a') || $(e.currentTarget).is('.pagination button')) {
							pageHistory.setHistory();
						/* BTOBGLOBAL-434 : 20210414 add */
						}else if(COUNTRY_CODE.toLowerCase()=='global' && $('.navigation').hasClass('b2b') && $(e.currentTarget).is('.expander button')){
							pageHistory.setHistory();
						}
						/*// BTOBGLOBAL-434 : 20210414 add */
						if($('.eprivacy-tooltip').length>0){
							$("#modal_cookie_set").hide();
							$('.page-cookie-view').unwrap();
							$("#modal_cookie_set").removeClass('page-cookie-view');
						}
						
						if($('.visual').hasClass('hasThumbnail')){
							setTimeout(function(){
								$('.visual').addClass('hasThumbnail');
							}, 300);
						}
					} else {
						ePrivacyCookies.view('click');
					}
				}
			}, '.pagination a, .pagination button, a.view-all, .expander button');
			$(plp.el.list).on({
				change: function(e){
					if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS') ||COUNTRY_CODE.toLowerCase()=='uk') {
						var _this = e.currentTarget;
						var sort = _this.options[_this.selectedIndex].value;
						var sortTxt = changeTitleFormat($(this).find('option').eq(_this.selectedIndex).text());
						plp.el.form.sort.value = sort;
						plp.el.form.page.value = 1;
						/* BTOBGLOBAL-434 : 20210408 add */
						if(COUNTRY_CODE.toLowerCase()=='global' && $('.navigation').hasClass('b2b') && isMobile){
							filter.result.querySelector('.expander button').value = 2;
						}
						/*// BTOBGLOBAL-434 : 20210408 add */

						pageHistory.removeHistory();

						$(plp.el.form).submit();
						//filter.loadPLP(); XXX
						$('html, body').animate({
							//scrollTop: $(plp.el.scrollTarget).offset().top
							//scrollTop: $(_this).offset().top
							//scrollTop: $(filter.el).offset().top
							scrollTop: $(plp.el.scrollTarget).closest('.component').offset().top
						}, 500);
						/* 20191002 : LGEUS-12351 add  */ 
						if($(".GPC0007").length > 0){  
							$('.GPC0007 .filter-open-floating .float-sort-box .sort-select').find('select option[value="'+sort+'"]').prop("selected",true);  
						}  
						// 20200421 START 박지영 - sort by 클릭시 읽어주도록 수정
						// LGEGMC-526
						if($(".GPC0026").length > 0){
							$('.GPC0026 .filter-open-floating .float-sort-box .sort-select').find('select option[value="'+sort+'"]').prop("selected",true);
						}
						// LGEGMC-526 End
						// LGEGMC-526
						// LGEGMC-526 End
						// WA
						var sortMsg = $('#sortBy').siblings('.msg-sort').text().replace(/\*msg\*/g, sortTxt) || 'Results are sorted by '+sortTxt;
						$('#sortBy').siblings('.msg-sort').text(sortMsg);
						// 20200421 END

						/* //20191002 : LGEUS-12351 add */  
						adobeTrackEvent('product-list-sort', {sort_option : sortTxt, page_event : {product_sort : true}});
						if($('.eprivacy-tooltip').length>0){
							$("#modal_cookie_set").hide();
							$('.page-cookie-view').unwrap();
							$("#modal_cookie_set").removeClass('page-cookie-view');
						}
					} else {
						ePrivacyCookies.view('click');
					}
				}
			}, '#sortBy');

			// only multi promotion page
			$(plp.el.list).on({
				// click: function(e){
				// 	var closest = $(e.currentTarget).closest('.promotion-box');
				// 	closest.addClass('open');
				// }
				click: filter.viewAllPromotionPLP
			
			}, '.promotion-box .list-more a');
			
			
			window.matchMedia('(max-width: 1069px)').addListener(_this.mediaBranch);
		}
	};
	}
	
	// Using for PJTCUR-3
	if($("#result-box-aria").length > 0) {
		filter2 = {
			el: document.getElementById('categoryCurFilterForm'),
			result: document.getElementById('resultCurAppendTarget'),
			template: null,
			pageTemplate: null,
			banner: document.querySelector('.result-box .banner-box'),
			initial: null,
			// filter box folding script
			ui: {
				el: {
					open: document.querySelector('.filter-open-box'),
					close: document.querySelector('.filter-result'),
					fieldset: null
				},
				init: function(){
					initWhiteSpace();
					var _this = filter2.ui.el;
					// 20200325 START 박지영 : fieldset 대신 클래스명으로 변경
					_this.fieldset = filter2.el.querySelectorAll('.option-box');
					// 20200325 END
					
					$(_this.open).on({
						click: function(e){
							e.preventDefault();
							if(!$(filter2.el).is(':visible')){ 
								$(filter2.el).addClass('open'); 
								$(this).hide();
								$(_this.close).find('a').focus();
								/* 20191002 : LGEUS-12351 add */ 
								if($(".GPC0007").length > 0){ 
								$(".GPC0007 .filter-open-floating").addClass("no-floating"); 
								} 
								/* //20191002 : LGEUS-12351 add */ 
								// LGEGMC-526
								if($(".GPC0026").length > 0){
									$(".GPC0026 .filter-open-floating").addClass("no-floating");
								}
								// LGEGMC-526 End
								// PJTPROCOM-3
								
							}else{ 
								$(filter2.el).hide();
							}
						}
					});
					$(_this.close).on({
						click: function(e){
							e.preventDefault();
							var state = $(filter2.el).css('display');
							if($(filter2.el).is(':visible')){ 
								$(filter2.el).removeClass('open'); 
								$(_this.open).show();
								$(_this.open).find('a').focus();
								/* 20191002 : LGEUS-12351 add */ 
								if($(".GPC0007").length > 0){ 
								$(".GPC0007 .filter-open-floating").removeClass("no-floating"); 
								} 
								/* //20191002 : LGEUS-12351 add */ 
								// LGEGMC-526
								if($(".GPC0026").length > 0){
									$(".GPC0026 .filter-open-floating").removeClass("no-floating");
								}
								// LGEGMC-526 End
								// PJTPROCOM-3
							}
						}
					});
					// fieldset folding script
					$(_this.fieldset).on({
						click: function(e){	
							e.preventDefault();
							var parent_box = e.delegateTarget;
							if ($(parent_box).is(".open")){
								$(parent_box).removeClass("open").addClass("close");
								$(e.currentTarget).attr('aria-expanded', false);
							} else {
								$(parent_box).removeClass("close").addClass("open");
								$(e.currentTarget).attr('aria-expanded', true);
							}
						}
					}, '.btn-list');
					/* 20191002 : LGEUS-12351 add */ 
					if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
						if($(".GPC0007").length > 0 || $(".GPC0026").length > 0){ 
							var	filterLine = parseInt( $(".GPC0007, .GPC0026").find(".product-list-box").offset().top );
							var filterTopLine = parseInt( $(".GPC0007, .GPC0026").offset().top );
							$(window).on("resize", function(){
								filterLine = parseInt( $(".GPC0007, .GPC0026").find(".product-list-box").offset().top );
								return filterLine;
							});	
							$(window).on('load scroll', function(){
								filterLine = parseInt($(".GPC0007, .GPC0026").find(".product-list-box").offset().top );
								var scrollPos =  $(window).scrollTop();
								var isFilterFloating = false;
								if($(".GPC0007 .filter-open-floating").length>0 && !$(".GPC0007 .filter-open-floating").attr("class").match("no-floating") ||
								   $(".GPC0026 .filter-open-floating").length>0 && !$(".GPC0026 .filter-open-floating").attr("class").match("no-floating")) {
									isFilterFloating = true;
								}
								if(scrollPos >= parseInt(filterLine) && isFilterFloating){
									if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
										$(".GPC0007, .GPC0026").find('.filter-open-floating').removeClass("float-fix").addClass("float-active");
										if($(".eprivacy-cookie").hasClass('cookie-eu') && $('.cookie-banner').hasClass('ready') && ($('html').attr('data-countrycode') == 'uk' || $('html').attr('data-countrycode') == 'fr' || $('html').attr('data-countrycode') == 'nl' || $('html').attr('data-countrycode') == 'be_fr')){
											if($('.eprivacy-cookie').css('display') == 'none' ){
												$(".cookie-eu-get-height").css("height","0");
												$(".filter-open-floating").removeClass('hasCookie');
											} else{
												$(".filter-open-floating").addClass('hasCookie');
											}
										} else {
											$(".filter-open-floating").removeClass('hasCookie');
										}
									}
								}else{
									if ($(".GPC0007 #categoryCurFilterForm, .GPC0026 #categoryFilterForm").attr("class").match("open")) {
										$(".GPC0007, .GPC0026").find('.filter-open-floating').addClass("no-floating");
									} else {
										$(".GPC0007, .GPC0026").find('.filter-open-floating').removeClass("float-active");
									}
								}
							});
							$(".GPC0007 .filter-open-floating .floating-filter").on({
								click:function(e){
									e.preventDefault();
									if($(this).attr("class").match("active")){
										$(this).removeClass("active");
										$(".GPC0007 #categoryCurFilterForm").removeClass("open");
										$('.GPC0007 .filter-open-box').css("display","block");
										$(".GPC0007 .filter-open-floating").removeClass("no-floating");
										$(".GPC0007 .result-box .sort-box").css("display","block");
										$(".filter-box .float-filter-result").css("display","none");
										$(".filter-box .filter-result").css("display","block");
										filterTopLine = parseInt( $(".GPC0007").offset().top );
										$(window).scrollTop(filterTopLine);
									}else{
										$(this).addClass("active");
										$(".GPC0007 #categoryCurFilterForm").addClass("open");
										$('.GPC0007 .filter-open-box').css("display","none");
										$(".GPC0007 .filter-open-floating").addClass("no-floating");
										$(".GPC0007 .result-box .sort-box").css("display","none");
										$(".filter-box .float-filter-result").css("display","block");
										$(".filter-box .filter-result").css("display","none");
										filterTopLine = parseInt( $(".GPC0007").offset().top );
										$(window).scrollTop(filterTopLine);
									}
								}
							});

							// LGEGMC-526
							$(".GPC0026 .filter-open-floating .floating-filter").on({
								click:function(e){
									e.preventDefault();
									if($(this).attr("class").match("active")){
										$(this).removeClass("active");
										$(".GPC0026 #categoryFilterForm").removeClass("open");
										$('.GPC0026 .filter-open-box').css("display","block");
										$(".GPC0026 .filter-open-floating").removeClass("no-floating");
										$(".GPC0026 .result-box .sort-box").css("display","block");
										$(".filter-box .float-filter-result").css("display","none");
										$(".filter-box .filter-result").css("display","block");
										filterTopLine = parseInt( $(".GPC0026").offset().top );
										$(window).scrollTop(filterTopLine);
									}else{
										$(this).addClass("active");
										$(".GPC0026 #categoryFilterForm").addClass("open");
										$('.GPC0026 .filter-open-box').css("display","none");
										$(".GPC0026 .filter-open-floating").addClass("no-floating");
										$(".GPC0026 .result-box .sort-box").css("display","none");
										$(".filter-box .float-filter-result").css("display","block");
										$(".filter-box .filter-result").css("display","none");
										filterTopLine = parseInt( $(".GPC0026").offset().top );
										$(window).scrollTop(filterTopLine);
									}
								}
							});
							// LGEGMC-526 End
							
							// PJTPROCOM-3
							
							// PJTPROCOM-3 End
							
							$('.GPC0007 .filter-open-floating .float-sort-box .sort-select .sortBy').on({
								change: function(e){
									if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
										var _this = e.currentTarget;
										var sort = _this.options[_this.selectedIndex].value;
										var sortTxt = changeTitleFormat($(this).find('option').eq(_this.selectedIndex).text());
										plp2.el.form.sort.value = sort;
										plp2.el.form.page.value = 1;
										pageHistory.removeHistory();
										$(plp2.el.form).submit();
										$('.GPC0007 .filter-open-floating .floating-filter').removeClass("active");
										$(".GPC0007 #categoryCurFilterForm").removeClass("open");
										$('.GPC0007 .filter-open-box').css("display","block");
										$(".GPC0007 .filter-open-floating").removeClass("no-floating");
										$(".GPC0007 .result-box .sort-box").css("display","block");
										$(".filter-box .float-filter-result").css("display","none");
										$(".filter-box .filter-result").css("display","block");
										$('.result-box .sort-box .sort-select').find('select option[value="'+sort+'"]').prop("selected",true);
										$('.result-box .sort-box .sort-select').find('.chosen-single span').text($(this).find('option').eq(_this.selectedIndex).text());
										$('html, body').animate({
											scrollTop: $(plp2.el.scrollTarget).closest('.component').offset().top
										}, 500);
										adobeTrackEvent('product-list-sort', {sort_option : sortTxt, page_event : {product_sort : true}});
									} else {
										ePrivacyCookies.view('click');
									}
								}
							});

							// LGEGMC-526
							$('.GPC0026 .filter-open-floating .float-sort-box .sort-select .sortBy').on({
								change: function(e){
									if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
										var _this = e.currentTarget;
										var sort = _this.options[_this.selectedIndex].value;
										var sortTxt = changeTitleFormat($(this).find('option').eq(_this.selectedIndex).text());
										plp2.el.form.sort.value = sort;
										plp2.el.form.page.value = 1;
										pageHistory.removeHistory();
										$(plp2.el.form).submit();
										$('.GPC0026 .filter-open-floating .floating-filter').removeClass("active");	
										$(".GPC0026 #categoryFilterForm").removeClass("open");
										$('.GPC0026 .filter-open-box').css("display","block");
										$(".GPC0026 .filter-open-floating").removeClass("no-floating");
										$(".GPC0026 .result-box .sort-box").css("display","block");
										$(".filter-box .float-filter-result").css("display","none");
										$(".filter-box .filter-result").css("display","block");
										$('.result-box .sort-box .sort-select').find('select option[value="'+sort+'"]').prop("selected",true);
										$('.result-box .sort-box .sort-select').find('.chosen-single span').text($(this).find('option').eq(_this.selectedIndex).text());
										$('html, body').animate({
											scrollTop: $(plp2.el.scrollTarget).closest('.component').offset().top
										}, 500);
										adobeTrackEvent('product-list-sort', {sort_option : sortTxt, page_event : {product_sort : true}});
									} else {
										ePrivacyCookies.view('click');
									}
								}
							});
							// LGEGMC-526 End
							
							// PJTCUR-3
							$('#result-box-aria .filter-open-floating .float-sort-box .sort-select .sortBy').on({
								change: function(e){
									if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
										var _this = e.currentTarget;
										var sort = _this.options[_this.selectedIndex].value;
										var sortTxt = changeTitleFormat($(this).find('option').eq(_this.selectedIndex).text());
										plp2.el.form.sort.value = sort;
										plp2.el.form.page.value = 1;
										pageHistory.removeHistory();
										$(plp2.el.form).submit();
										$('#result-box-aria .filter-open-floating .floating-filter').removeClass("active");
										$("#result-box-aria #categoryCurFilterForm").removeClass("open");
										$('#result-box-aria .filter-open-box').css("display","block");
										$("#result-box-aria .filter-open-floating").removeClass("no-floating");
										$("#result-box-aria .result-box .sort-box").css("display","block");
										$(".filter-box .float-filter-result").css("display","none");
										$(".filter-box .filter-result").css("display","block");
										$('.result-box .sort-box .sort-select').find('select option[value="'+sort+'"]').prop("selected",true);
										$('.result-box .sort-box .sort-select').find('.chosen-single span').text($(this).find('option').eq(_this.selectedIndex).text());
										$('html, body').animate({
											scrollTop: $(plp2.el.scrollTarget).closest('.component').offset().top
										}, 500);
										adobeTrackEvent('product-list-sort', {sort_option : sortTxt, page_event : {product_sort : true}});
									} else {
										ePrivacyCookies.view('click');
									}
								}
							});
							// PJTCUR-3 End
						} 
					}
					/* //20191002 : LGEUS-12351 add */ 
				}
			},
			// jquery ui slider field function
			slider: {
				el: null,
				value: null, // Array inputed in filter markup
				init: function(){
					var _this = filter2.slider;
					_this.value = dragbarVal;
					_this.el = filter2.el.querySelectorAll('.slider-wrap');
					
					for (var i = 0; i < _this.el.length; i++) {
						var __this = _this.el[i];
						var range = __this.querySelector('.slider-range'),
							matchArray = _this.value[__this.getAttribute('data-value')],
							max = matchArray.length-1;

						$(range).data('matchArray', matchArray)
							.slider({
								range: true,
								min: 0,
								max: max,
								values: [0, max],
								slide: _this.slide,
								change: _this.change,
							}).data("ui-slider")._slide();

						// 2019-11-11 : added for accessiblity
						$(range).find('.ui-slider-handle').eq(0).attr('aria-label', range.getAttribute('data-min'));
						$(range).find('.ui-slider-handle').eq(1).attr('aria-label', range.getAttribute('data-max'));
						// 2019-11-11 : added for accessiblity end
					}
				},
				slide: function( event, ui ) {
					// 20200311 START 박지영 Slider에서 같은 값 선택 가능하도록 수정
					//if(ui.values[0] == ui.values[1]) return false;
					// 20200311 END

					// 20200406 START 박지영 : 둘다 Min 혹은 둘다 Max를 선택할 수 없도록 수정
					var num = $(this).data('matchArray').length - 1;
					if(ui.values[0]==0 && ui.values[1] == 0) return false;
					if(ui.values[0]==num && ui.values[1] == num) return false;
					// 20200406 END

					if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')||COUNTRY_CODE.toLowerCase()=='es'|| COUNTRY_CODE.toLowerCase()=='uk') {

						// 20200311 START 박지영 Slider에 aria-valuemin, aria-valuemax, aria-valuenow 추가
						var $wrap = $(this).parents('.slider-wrap'),
							_matchArray = $(this).data('matchArray'),
							minKey = Object.keys(_matchArray[ui.values[0]]),
							maxKey = Object.keys(_matchArray[ui.values[1]]),
							min = Object.keys(_matchArray[1]),
							max = Object.keys(_matchArray[_matchArray.length-2]);

						var box = {
							$min: $wrap.find('.min-box'),
							$max: $wrap.find('.max-box')
						};

						box.$min.find('span').text(minKey);
						box.$max.find('span').text(maxKey);
						$wrap.find('.ui-slider-handle').eq(0).attr('aria-valuetext',minKey).attr('aria-valuemin', min).attr('aria-valuemax', max).attr('aria-valuenow', minKey);
						$wrap.find('.ui-slider-handle').eq(1).attr('aria-valuetext',maxKey).attr('aria-valuemin', min).attr('aria-valuemax', max).attr('aria-valuenow', maxKey);
						// 20200311 END
						box.$min.find('input').val(_matchArray[ui.values[0]][minKey]);
						box.$max.find('input').val(_matchArray[ui.values[1]][maxKey]);

					} else {
						return false;
					}
				},
				change: function(event, ui){
					$(this).trigger('change', [ui]);
				},
				setSlider: function(){
					var _this = filter2.slider;
					if($(_this.el).is('div')) {
						for (var i = 0; i < _this.el.length; i++) {
							var __this = _this.el[i],
								__range = $(__this).find('.slider-range');

							var valueIndex = {
								min: $(__this).find('.min-box input').data('index'),
								max: $(__this).find('.max-box input').data('index')
							};
							valueIndex = {
								min: valueIndex.min ? valueIndex.min : 0,
								max: valueIndex.max ? valueIndex.max : $(__range).slider("option", "max")
							};
							$(__this).find('.slider-range')
								.slider('values', [valueIndex.min, valueIndex.max]).data("ui-slider")._slide();
						}
					}
				},
				indexOfValue: function(arr, val){
					for (var i = 0; i < arr.length; i++) {
						var _obj = arr[i];
						for(var key in _obj) {
							if(_obj[key] == val) {
								return i;
							}
						}
					}
				}
			},
			// auto field save
			cookie: {
				name: 'LG5_filter',
				cont: null,
				bake: function(param){
					var _this = filter2.cookie;
					var page = location.pathname;
					// Remove unnecessary fields before baking cookies
					param = param.replace(/\&/g,'|').replace(/\=/g,':');
					
					var paramArray = param.indexOf('|') > -1 ? param.split('|') : [param];
					var i = 0;
					while ( i < paramArray.length) {
						var _param = paramArray[i];
						if(_param.split(':')[1] == '' || _param.split(':')[1] == undefined) {
							paramArray.splice(i, 1);
						}else {
							i++;
						}
					}

					if(!_this.cont) {
						_this.cont = [];
					}

					var mergeParam = paramArray.join("|"),
						ac = page+'='+mergeParam,
						idx = _this.returnData();

					if(mergeParam != "") {
						if(idx >= 0) {
							_this.cont[idx] = ac;
						}else {
							_this.cont.push(ac);
						}
					}else {
						if(idx >= 0) {
							_this.cont.splice(idx, 1);
						}
					}

					if(_this.cont.join('') == "") {
						removeCookie(_this.name, true);
					}else {
						/*LGEES-15 modify*/
						if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS') ||COUNTRY_CODE.toLowerCase()=='es') {
							setCookie(_this.name, _this.cont.join(','), true);
						}
					}
				},
				get: function(){
					var _this = filter2.cookie;
					var ac = getCookie(_this.name) ? getCookie(_this.name) : [];
					if(ac !== undefined) {
						ac = ac.indexOf(',') > -1 ? ac.split(',') : [ac];
						_this.cont = ac;
						var idx = _this.returnData();
						if(idx >= 0) {
							ac = ac[idx].split('=')[1];
							return ac;
						}
					}
				},
				returnData: function(){
					var _this = filter2.cookie;
					var page = location.pathname;
					if(_this.cont) {
						var idx = -1;
						for (var j = 0; j < _this.cont.length; j++) {
							var c = _this.cont[j];
							if(c.indexOf(page) >= 0) {
								idx = j;
								break;
							}
						}
						return idx;
					}
				},
				reset: function(){
					var _this = filter2.cookie;
					_this.bake('');
				}
			},
			init: function(){
				filter2.initial = $(filter2.el).serialize();
				filter2.template = $('#productCurTemplate').clone().html();
				
				// 2020.10.06 PJTPLP WhiteSpace
				if($('.GPC0007').length>0 ||$('.GPC0026').length>0) {
					filter2.labelUseFlag = $('#whiteSpaceCurFlag').attr('data-label-use-flag');
					filter2.useLabelIcon = $('#whiteSpaceCurFlag').attr('data-use-label-icon');
					filter2.reviewType   = $('#reviewDefaultData').attr('data-reviewtype');
					// 2021.03.11 PJTCUR add start
					filter2.resultType   = $('#whiteSpaceCurFlag').attr('data-resultType');
					// 2021.03.11 PJTCUR add end
					filter2.loginUseFlag = $('#reviewDefaultData').attr('data-login-use-flag');
					filter2.reviewLoginUrl = $('#reviewDefaultData').attr('data-review-login-url');
					filter2.dataCheck      = $('#reviewDefaultData').attr('data-check');
					filter2.domain		 = $('#reviewDefaultData').attr('data-domain');
				}
				filter2.pageTemplate = $('#paginationCurTemplate').clone().html();
				$('#productCurTemplate').remove();
				$('#paginationCurTemplate').remove();

				filter2.ui.init(); // mobile ui events setting

				if(typeof dragbarVal != 'undefined') {
					filter2.slider.init();
				}

				if(typeof filter2.el.length == "object") {
					var itemLength;
					if(isMobile) {
						itemLength = filter2.el.length.getAttribute('data-mobile');
					}else {
						itemLength = filter2.el.length.getAttribute('data-desktop');
					}
					filter2.el.length.value = itemLength;
				}

				// var param = filter.cookie.get();
				var param = filter2.getParam();
				if(pageHistory.getHistory()) {
					filter2.addEvent();
					pageHistory.runHistory();
					//console.log(param);
					if(param) {
						filter2.setInput(param);
					} else {
						var page = $(filter2.el).find('input[type=hidden][name=page]').val();
						if(page == 'viewAll') {
							setTimeout(function() {
								$('#resultCurProductList .result-info a.view-all').trigger('click');
							}, 300);
						} else if(parseInt(page) > 1) {
							setTimeout(function() {
								$('#resultCurAppendTarget .pagination ul li').eq(parseInt(page)-1).find('button').trigger('click');
							}, 300);
						}
					}
				} else if(param && $('.compare-wrap').length==0){
					filter2.setInput(param);
				}else {
					filter2.addEvent();
					// PJTOBS-32 Start
	                if(ISVIP) {
	                    // Just run
	                    $('#categoryCurFilterForm').trigger('submit');
	                } else {
	                    // Waiting for loginCheck()
	                    $('.GPC0007').data('ready-vip-load', true);
	                }
	                // PJTOBS-32 End
				}

				runBVStaticPLP($(filter2.result));
				var $modelButtonEl = $('.products-info .model-button .button');
				// 2021.01.20 View all 버튼 영역 문제로 인한 추가
				$modelButtonEl.removeClass('only-button');
				$modelButtonEl.addClass('only-button');
				$modelButtonEl.each(function(){
					if($(this).find('a.active').length > 1){
						$modelButtonEl.removeClass('only-button');
						return;
					}
				});
				/* 2020.10.12 PJTPLP 수정(filter-length : 0일 경우 */
				if($('.GPC0007').length >0  || $(".GPC0026").length > 0) {
					$(window).on('scroll', function() {
						if ($(window).width() < 767){
							$('.float-sort-box').each(function() {
								if($('.sort-select').find('.sort-inner').length > 0) {
									
								} else {
									$(this).remove();
								}
							});
						}
					});
				}
			},
			getParam: function(){
				// filter.cookie.get()
				var result;
				/* LGEGMC-754 : 20201119 add */
				var paramFilter = $(".GPC0007").find('input[name="paramFilter"]').val();
				if (typeof paramFilter!="undefined" && paramFilter!=null && paramFilter!="") {
					var param = paramFilter;
					result = '';
					var cnt = 0;
					if(param.length>0) {
						var hasURLFilter = true;
						var arr = param.split('&');
						for(var i=0;i<arr.length;i++) {
							var name = arr[i].split('=')[0];
							var val = arr[i].split('=')[1];
							
							if(typeof $('#categoryCurFilterForm').find('[name='+name+']')[0] !="undefined" ){
								if($('#categoryCurFilterForm').find('[name='+name+']')[0].type == 'checkbox' || !!$('#categoryFilterForm').find('[name='+name+']').parents('.slider-wrap').length) {
									hasURLFilter = false;
									console.log($('#categoryCurFilterForm').find('[name='+name+']'));
									if(cnt != 0){
										result += '|';
									}
									result += name + ':' + val;
									cnt++;
								}
							}						
						}
						if(hasURLFilter) {
							result = filter2.cookie.get();
						}
					}
				}else if(location.search.length>0) {
				/*// LGEGMC-754 : 20201119 add */
					result = location.search.replace('?', '');
					if(result.length>0) {
						var hasURLFilter = true;
						var arr = result.split('&');
						for(var i=0;i<arr.length;i++) {
							var name = arr[i].split('=')[0];
							if($('[name='+name+']').length == 0) {
								hasURLFilter = false;
							}
						}
						if(hasURLFilter) {
							// Process if the URL contains filter data
							result = result.replace(/\&/g,'|').replace(/\=/g,':').replace(/\?/g, '');
						} else {
							result = filter2.cookie.get();
						}
					}
				}else {
					result = filter2.cookie.get();
				}
				
				/* 20200909 : LGEAE-113 add */
				var defaultFilter = $(".GPC0007").find('input[name="defaultFilter"]').val();
				if (typeof defaultFilter!="undefined" && defaultFilter!=null && defaultFilter!="") {
					if(typeof result=="undefined" || result==null || result==""){
						result = defaultFilter;
					}
				}
				/* 20200909 : LGEAE-113 add */
				
				// LGEGMC-526
				var defaultFilter = $(".GPC0026").find('input[name="defaultFilter"]').val();
				if (typeof defaultFilter!="undefined" && defaultFilter!=null && defaultFilter!="") {
					if(typeof result=="undefined" || result==null || result==""){
						result = defaultFilter;
					}
				}
				// LGEGMC-526 End
				
				// PJTPROCOM-3
				// PJTPROCOM-3 End

				return result;
			},
			setInput: function(param){
				if(!param) return false;

				var paramArray = param.indexOf('|') > -1 ? param.split('|') : [param];
				var ignore = ['categoryId', 'subCategoryId', 'status', 'sort', 'page'];
				var form = filter2.el;

				//console.log(paramArray);

				for (var i = 0; i < paramArray.length; i++) {
					var _param = paramArray[i].split(':');
					if(ignore.indexOf(_param[0]) == -1) {
						var $input = $(form).find('input[name="'+_param[0]+'"]');

						if(!$input.get(0)) {
							// filter.reset();
							return false;
						}

						var type = $input.get(0).type;
						if(type == "checkbox") {
							
							/* 20200909 : LGEAE-113 add */
							// apply filter
							var _this = $input.filter('[value="'+_param[1]+'"]');
							if (_this.length == 0) continue;
							
							var selected = _this.get(0);
							selected.setAttribute('checked', 'checked');
							/* 20200909 : LGEAE-113 add */
							
							var val = _this.parent().find('.text .name').length>0 ? changeTitleFormat(_this.parent().find('.text .name').text()) : changeTitleFormat(_this.parent().find('.text').text());
							var relVal2 = (_this.parent().find('.text .filter-cnt').length==0)?_this.parent().find('.text').text():_this.parent().find('.text').text().replace(_this.parent().find('.text .filter-cnt').text(),'');
							var checkName = _this.attr('name');
							if(!val || val=="") {
								// for color
								val = changeTitleFormat(_this.attr('title'));
								relVal2 = _this.attr('title');
							}
							if(_this.prop('checked')) {
								var $filter_icon2 = "<span data-filter-name='"+checkName+"' data-filter-value='"+_this.val()+"'>"+relVal2+" <a href='#'><span class=\"sr-only\">"+removeTxt+"</span></a>";
								if($('.GPC0007 .apply-filters span').length == 0){
									$('.GPC0007 .apply-filters a.link-text').addClass('active');
								}
								$('.GPC0007 .apply-filters .link-text').before($filter_icon2);
								$('.GPC0007 .apply-filters span[data-filter-value='+_this.val()+'] a').one('click',function(e){ // jslint ignore:line
									e.preventDefault();
									if($(this).parent().attr('data-filter-value')!=='Y'){
										$('.GPC0007 #categoryCurFilterForm input[value='+$(this).parent().attr('data-filter-value')+']').click();
									}else{
										$('.GPC0007 #categoryCurFilterForm input[name='+$(this).parent().attr('data-filter-name')+']').click();								
									}
								});

								// LGEGMC-526
								if($('.GPC0026 .apply-filters span').length == 0){
									$('.GPC0026 .apply-filters a.link-text').addClass('active');
								}
								$('.GPC0026 .apply-filters .link-text').before($filter_icon2);
								$('.GPC0026 .apply-filters span[data-filter-value='+_this.val()+'] a').one('click',function(e){ // jslint ignore:line
									e.preventDefault();
									if($(this).parent().attr('data-filter-value')!=='Y'){
										$('.GPC0026 #categoryFilterForm input[value='+$(this).parent().attr('data-filter-value')+']').click();
									}else{
										$('.GPC0026 #categoryFilterForm input[name='+$(this).parent().attr('data-filter-name')+']').click();
									}
								});
								// LGEGMC-526 End
								
								// PJTPROCOM-3
								
								// PJTPROCOM-3 END
							}

						}else { // slider
							// set hidden input
							$input.get(0).value = _param[1];

							// set Slider
							var $slider = $input.parents('.slider-wrap'); 
							if($slider.length>0) {
								var sliderType = $slider.attr('data-value');
								var index = filter2.slider.indexOfValue(filter2.slider.value[$slider.attr('data-value')], _param[1]);
								$input.data('index', index);

								// apply filter
								for(var key in dragbarVal[sliderType][index]) {
									$input.data('val', key);
								}
								var _this2 = $slider.find('.slider-range');
								var val1 = _this2.siblings().find(".min-box input").data('val');
								var val2 = _this2.siblings().find(".max-box input").data('val');
								if(!val1) val1 = Object.keys(dragbarVal[sliderType][0]).join('');
								if(!val2) val2 = Object.keys(dragbarVal[sliderType][dragbarVal[sliderType].length-1]).join('');
								var relVal = _this2.parent().siblings('.title').find('strong').text()+" : "+val1+"-"+val2;
								if($('.GPC0007 .apply-filters span[data-filter-value='+sliderType+']').length > 0){
									var _targetTxt = $('.GPC0007 .apply-filters span[data-filter-value='+sliderType+']');
									_targetTxt.contents().filter(function(){return this.nodeType == 3;})[0].nodeValue = relVal;
								}else{
									var $filter_icon = "<span data-filter-value='"+sliderType+"'>"+relVal+" <a href='#'><span class=\"sr-only\">"+removeTxt+"</span></a></span>";
									$('.GPC0007 .apply-filters .link-text').before($filter_icon);
									$('.GPC0007 .apply-filters span[data-filter-value='+sliderType+'] a').one('click',function(e){ // jslint ignore:line
										e.preventDefault();
										// 20200325 START 박지영 : slider의 min, max 텍스트 초기화 안되는 오류 수정
										var fv = $(this).parent().attr('data-filter-value');
										var options = $('.GPC0007 .slider-wrap[data-value="'+fv+'"] .slider-range').slider('option');
										$('.GPC0007 .slider-wrap[data-value="'+fv+'"] input').val('').removeData('index');
										$('.GPC0007 .slider-wrap[data-value="'+fv+'"] .slider-range').slider('values',[options.min, options.max]);
										$('.GPC0007 .slider-wrap[data-value="'+fv+'"] .min-box span').text(Object.keys(dragbarVal[fv][options.min])[0]);
										$('.GPC0007 .slider-wrap[data-value="'+fv+'"] .max-box span').text(Object.keys(dragbarVal[fv][options.max])[0]);
										// 20200325 END
										$(this).parent().remove();
									});
								}
								if($('.GPC0007 .apply-filters span').length != 0){
									$('.GPC0007 .apply-filters a.link-text').addClass('active');
								}else{
									$('.GPC0007 .apply-filters a.link-text').removeClass('active');
								}

								// LGEGMC-526
								if($('.GPC0026 .apply-filters span[data-filter-value='+sliderType+']').length > 0){
									var _targetTxt = $('.GPC0026 .apply-filters span[data-filter-value='+sliderType+']');
									_targetTxt.contents().filter(function(){return this.nodeType == 3;})[0].nodeValue = relVal;
								}else{
									var $filter_icon = "<span data-filter-value='"+sliderType+"'>"+relVal+" <a href='#'><span class=\"sr-only\">"+removeTxt+"</span></a></span>";
									$('.GPC0026 .apply-filters .link-text').before($filter_icon);
									$('.GPC0026 .apply-filters span[data-filter-value='+sliderType+'] a').one('click',function(e){ // jslint ignore:line
										e.preventDefault();
										// 20200325 START 박지영 : slider의 min, max 텍스트 초기화 안되는 오류 수정
										var fv = $(this).parent().attr('data-filter-value');
										var options = $('.GPC0026 .slider-wrap[data-value="'+fv+'"] .slider-range').slider('option');
										$('.GPC0026 .slider-wrap[data-value="'+fv+'"] input').val('').removeData('index');
										$('.GPC0026 .slider-wrap[data-value="'+fv+'"] .slider-range').slider('values',[options.min, options.max]);
										$('.GPC0026 .slider-wrap[data-value="'+fv+'"] .min-box span').text(Object.keys(dragbarVal[fv][options.min])[0]);
										$('.GPC0026 .slider-wrap[data-value="'+fv+'"] .max-box span').text(Object.keys(dragbarVal[fv][options.max])[0]);
										// 20200325 END
										$(this).parent().remove();
									});
								}
								if($('.GPC0026 .apply-filters span').length != 0){
									$('.GPC0026 .apply-filters a.link-text').addClass('active');
								}else{
									$('.GPC0026 .apply-filters a.link-text').removeClass('active');
								}
								// LGEGMC-526 End
								
								// PJTPROCOM-3
								
								// PJTPROCOM-3 End
							}
						}
					}
				}
				filter2.slider.setSlider();
				filter2.addEvent();
				filter2.loadPLP();
			},
			activateInput: function(enableList){
				if(typeof enableList === 'undefined') return false;
				var _enableList = enableList;
				var form = filter2.el;

				var $labels = $(form).find('label');
				// for (var ix = 0; ix < $labels.length; ix++) {
				// 	var _$label = $labels.eq(ix);
				// 	_$label.addClass('disabled').find('input').attr('disabled','disabled');
				// }
				if(_enableList != '') {
					for (var i = 0; i < _enableList.length; i++) {
						var keyId = _enableList[i].facetValueId;
						var _$faceInput = $(form).find('input[value="'+keyId+'"]'),
						_$faceLabel = _$faceInput.parents('label');
						/*LGEUS-11780 20190805 add */
						_$faceLabel.find('.filter-cnt').text('('+_enableList[i].modelCount+')'); 
						/*LGEUS-11780 20190805 add */
						// _$faceInput.removeAttr('disabled');
						// _$faceLabel.removeClass('disabled');
						if( _enableList[i].enable.toUpperCase() == "N"){
							_$faceInput.attr('disabled', 'disabled');
							_$faceLabel.addClass('disabled');
						}else {
							_$faceInput.removeAttr('disabled');
							_$faceLabel.removeClass('disabled');
						}
					}
				}
			}, 
			
			createProductItem: function(productList, productMessages){
				var html = [];
				
				if($('.GPC0007').length>0 ||$('.GPC0026').length>0) {
					var ynProductTag = "N";
					var ynBrandTag = "N";
					var ynSibling = "N";
					var ynEnergyLabel = "N";
					var ynPrice = "N";
					/* 2020.10.12 PJTPLP 수정 */
					var ynReviewRating = "N";
					var labelUseFlag = filter2.labelUseFlag;
					var useLabelIcon = filter2.useLabelIcon;
					// PJTPROCOM-3 ADD
					var reviewType = filter2.reviewType;
					var loginUseFlag = filter2.loginUseFlag;
					var reviewLoginUrl = filter2.reviewLoginUrl;
					var dataCheck = filter2.dataCheck;
					var tmpDomain = filter2.domain;
					// PJTCUR-3 add
					var resultType = filter2.resultType;
					if(resultType == "min") {
						labelUseFlag = "N";
						useLabelIcon = "N";
					}
				}
				//LGEGMC-177
				for (var i = 0; i < productList.length; i++) {
					//PJTCUR-3 add
					if($('.GPC0134').length > 0 || $('.GPC0142').length > 0) {
						if(i == 0) {
							$('#whiteSpaceCurData [data-category-id]').attr("data-category-id", $("input[name='curationId']").val());
							$('#whiteSpaceCurData [data-tag-content-area-yn]').attr("data-tag-content-area-yn", productList[i].tagContentAreaYn);
							$('#whiteSpaceCurData [data-model-brand-area-yn]').attr("data-model-brand-area-yn", productList[i].modelBrandAreaYn);
							$('#whiteSpaceCurData [data-price-area-yn]').attr("data-price-area-yn", productList[i].priceAreaYn);
							$('#whiteSpaceCurData [data-promotion-area-yn]').attr("data-promotion-area-yn", productList[i].promotionAreaYn);
							$('#whiteSpaceCurData [data-reivew-area-yn]').attr("data-review-area-yn", productList[i].reviewAreaYn);
							$('#whiteSpaceCurData [data-energy-fiche-yn]').attr("data-energy-fiche-yn", productList[i].energyFicheAreaYn);
							$('#whiteSpaceCurData [data-campaign-area-yn]').attr("data-campaign-area-yn", productList[i].campaignAreaYn);
							$('#whiteSpaceCurData [data-btn-area-yn]').attr("data-btn-area-yn", productList[i].btnAreaYn);
							$('#whiteSpaceCurData [data-emi-msg-area-yn]').attr("data-emi-msg-area-yn", productList[i].emiMsgAreaYn);
	                        $('#whiteSpaceCurData [data-emi-use-flag]').attr("data-emi-use-flag", productList[i].emiUseFlag);
							$('#whiteSpaceCurData [data-spec-msg-flag-area-yn]').attr("data-spec-msg-flag-area-yn", productList[i].specMsgFlagAreaYn);
							$('#resultCurAppendTarget').attr("categoryId", $("input[name='curationId']").val());
							//PJTLIMITQTY_EXTEND
							$('#whiteSpaceCurData [data-limitSale-area-yn]').attr("data-limitSale-area-yn", productList[i].limitSaleAreaYn);
							$('#whiteSpaceCurData [data-limitSale-use-flag]').attr("data-limitSale-use-flag", productList[i].limitSaleUseFlag);
						}
					}
					var p = productList[i],
						template = filter2.template;
					//LGEGMC-1406
					var specMsg = $("#specMsg").val();
					template = template.replace(/\*modelId\*/g, p.modelId)
									.replace(/\*modelName\*/g, p.modelName)
									.replace(/\*modelName_toLowerCase\*/g, p.modelName.toLowerCase())
									.replace(/\*imageAltText\*/g, (p.imageAltText != null) ? p.imageAltText : '')
									// 20200325 START 박지영 - ufn 따옴표 처리
									.replace(/\*userFriendlyName\*/g, p.userFriendlyName == null ? '' : p.userFriendlyName.replace(/\"/g, "''"))
									// 20200325 END
									.replace(/\*salesModelCode\*/g, p.salesModelCode)
									.replace(/\*modelUrlPath\*/g, p.modelUrlPath)
									.replace(/\*mediumImageAddr\*/g, p.mediumImageAddr)
									.replace(/\*smallImageAddr\*/g, p.smallImageAddr)
									.replace(/\*productTag1\*/g, p.productTag1)
									.replace(/\*productTag2\*/g, p.productTag2)
									.replace(/\*productTag1UserType\*/g, p.productTag1UserType) /* LGEDE-354 */
									.replace(/\*productTag2UserType\*/g, p.productTag2UserType) /* LGEDE-354 */
									.replace(/\*whereToBuyUrl\*/g, p.whereToBuyUrl)
									.replace(/\*inquiryToBuyUrl\*/g, p.inquiryToBuyUrl)
									.replace(/\*findTheDealerUrl\*/g, p.findTheDealerUrl)
									.replace(/\*promotionText\*/g, p.promotionText ? p.promotionText : "")
									/* LGEPL-80 */
									.replace(/\*promotionLinkUrl\*/g, p.promotionLinkUrl ? p.promotionLinkUrl : "")
									// PJTOBS 20200703 Start 
									.replace(/\*reStockAlertUrl\*/g, p.reStockAlertUrl ? p.reStockAlertUrl : "")
									// PJTOBS 20200703 End
									/* LGEUS-12083 : 20190826 add */
									.replace(/\*rDiscountedPrice\*/g, p.rDiscountedPrice ? changeFormatPrice(p.rDiscountedPrice) : 'null')
									.replace(/\*rDiscountedPriceCent\*/g, p.rDiscountedPriceCent)
									/* //LGEUS-12083 : 20190826 add */
									/* in-house review rating add */
									.replace(/\*reviewRatingStar2\*/g, p.reviewRatingStar2)
									.replace(/\*reviewRating\*/g, p.reviewRating)
									.replace(/\*reviewRatingPercent\*/g, p.reviewRatingPercent)
									/* // in-house review rating add */
									.replace(/\*siblingType\*/g, p.siblingType)
									.replace(/\*discountedRate\*/g, p.discountedRate)
									.replace(/\*retailerPricingText\*/g, p.retailerPricingText)
									.replace(/\*salesSuffixCode\*/g, (p.salesSuffixCode || ''))/* LGEGMC-455 20200717 add */
									.replace(/\*modelYear\*/g, (nvl(p.modelYear,'') || '')) /* LGEGMC-1279 : 2021.03.12 add */
									.replace(/\*buName1\*/g, (p.buName1 || ''))
									.replace(/\*buName2\*/g, (p.buName2 || ''))
									.replace(/\*buName3\*/g, (nvl(p.buName3,'') || ''))
									.replace(/\*bizType\*/g, (p.bizType || ''))
									.replace(/\*superCategoryName\*/g, (p.superCategoryName || ''))
									.replace(/\*categoryName\*/g, (p.categoryName || ''))
									.replace(/\*categoryEngName\*/g, (p.categoryEngName || ''))
									.replace(/\*priceValue\*/g, (nvl(p.rPrice,'')+'.'+nvl(p.rPriceCent,'00') || '')) /* LGEGMC-712 20201020 add */
									.replace(/\*salesSuffixCode\*/g, (p.salesSuffixCode || ''))  /* LGEGMC-455 20200717 add */
									/* PJTPLP-10 (황규하) wish 기능 추가 START */
									.replace(/\*wishTotalCnt\*/g, p.wishTotalCnt)
									.replace(/\*pdFav\*/g, p.myWishCnt == 'Y' ? 'pd-fav on' : 'pd-fav')
									.replace(/\*icoFav\*/g, p.myWishCnt == 'Y' ? 'ico-fav on' : 'ico-fav')
									.replace(/\*ariaChecked\*/g, p.myWishCnt == 'Y' ? 'true' : 'false')
									.replace(/\*modelCopyUrl\*/g, p.modelUrlPath)
									.replace(/\*categoryName\*/g, p.categoryName)
									/* PJTPLP-10 (황규하) wish 기능 추가 END */
									//PJTOBSB2E-3 Start
									.replace(/\*obsPreOrderStartDate\*/g, p.obsPreOrderStartDate)
									.replace(/\*obsPreOrderEndDate\*/g, p.obsPreOrderEndDate)
									.replace(/\*emiMsg\*/g, p.obsEmiMsgFlag == 'Y' && p.emiMsg != null ? p.emiMsg : '')
									.replace(/\*emiPopUrl\*/g, p.obsEmiMsgFlag == 'Y' && p.emiPopUrl != null ? p.emiPopUrl : '')
									//LGEGMC-1406
									.replace(/\*specMsg\*/g, p.specMsgFlag == 'Y' ? "<p>"+specMsg+"</p>" : '')
									//PJTOBSB2E-3 End
									.replace(/\*afterPayInstallMent\*/g, p.obsEmiMsgFlag == 'Y' && p.emiMsg != null && p.emiMsg != '' && (p.afterPay <= 3000 && p.afterPay > 0) ? 'afterpay-installment" href="#modal-afterpay' : '" style="display:none;')/* LGEAU-378 add */
									.replace(/\*wtbClass\*/g,(p.wtbExternalLinkUseFlag =="Y" && p.wtbExternalLinkUrl != null && p.wtbExternalLinkUrl != '' && p.wtbExternalLinkName != null && p.wtbExternalLinkName != '') ? 'in-buynow' : 'where-to-buy') //LGEGMC-2202
									; /* LGEGMC-455 20200717 add */
				
					
					//LGEGMC-177
					var pdfDownloadFile = $("#pdfDownloadFile").val();
					var productFicheDownload = $("#productFicheDownload").val();
					var productFichehtml = "<a href='#' adobe-click='pdp-file-down-click' data-doc='"+ p.productFicheDocId +"' data-file='" + p.productFicheFileName + "' data-original='" + p.productFicheOriginalName + "' data-category='' title='" + pdfDownloadFile + "' class='link-text'>"
	    			+ "<span class='fiche type-product'>" + productFicheDownload + "</span>"
	    			+ "</a>";
					/*LGEGMC-1035 start*/
					if($('html').attr('data-countrycode') == 'uk'){
						if(p.energyLabel != "" && p.energyLabel != "N" && p.energyLabel != null && p.energyLabelDocId !=null && p.energyLabelDocId !="" && p.energyLabelFileName != null && p.energyLabelFileName != "" && p.energyLabelOriginalName !=null
								&& p.energyLabelOriginalName !="" && p.energyLabelImageAddr !=null && p.energyLabelImageAddr !="" && p.energyLabelName !=null && p.energyLabelName !="" && p.fEnergyLabelFileName!= null && p.fEnergyLabelDocId!= null && p.fEnergyLabelDocId!= ""&&p.fEnergyLabelFileName!='' && p.fEnergyLabelOriginalName !=null&& p.fEnergyLabelOriginalName !=''){
							var energyLabelhtml = "<div class='energy-label-wrap'><a href='#' class='label-link'><span class='label'><img src='"+ p.energyLabelImageAddr +"' alt='"+ p.energyLabelName +"'></span></a>"
							var energyLabelImagehtml = "<div class='tooltip-link'><div class='tolltip-inner'>";
							if(p.fEnergyLabelFileName!= null && p.fEnergyLabelDocId!= null && p.fEnergyLabelDocId!= ""&&p.fEnergyLabelFileName!='' && p.fEnergyLabelOriginalName !=null&& p.fEnergyLabelOriginalName !=''){
								energyLabelImagehtml += "<a href='#' class='link-text link-text-uk' adobe-click='pdp-file-down-click' data-doc='" + p.fEnergyLabelDocId + "' data-file='" + p.fEnergyLabelFileName + "' data-original='" + p.fEnergyLabelOriginalName + "'  data-category='' title='" + pdfDownloadFile + "'>"+$("#pdfDownloadFileUk").val()+"</a>";
							}
						energyLabelImagehtml += "<a href='#' class='link-text link-text-eu' adobe-click='pdp-file-down-click' data-doc='" + p.energyLabelDocId + "' data-file='" + p.energyLabelFileName + "' data-original='" + p.energyLabelOriginalName + "'  data-category='' title='" + pdfDownloadFile + "'>"+$("#pdfDownloadFileEu").val()+"</a></div></div></div>"
						}else{
							var energyLabelhtml = "<a href='#' adobe-click='pdp-file-down-click' data-doc='" + p.energyLabelDocId + "' data-file='" + p.energyLabelFileName + "' data-original='" + p.energyLabelOriginalName + "' class='link-text' data-category='' title='" + pdfDownloadFile + "'>"
							+ "<span class='label type-none'>";
							var energyLabelImagehtml = "<img src='"+ p.energyLabelImageAddr +"' alt='"+ p.energyLabelName +"'></span></a>";
						}
					}else{
						var energyLabelhtml = "<a href='#' adobe-click='pdp-file-down-click' data-doc='" + p.energyLabelDocId + "' data-file='" + p.energyLabelFileName + "' data-original='" + p.energyLabelOriginalName + "' class='link-text' data-category='' title='" + pdfDownloadFile + "'>"
						+ "<span class='label type-none'>";
						var energyLabelImagehtml = "<img src='"+ p.energyLabelImageAddr +"' alt='"+ p.energyLabelName +"'></span></a>";
					}
					/*LGEGMC-1035 end*/
					if(p.productFicheFileName !="" && p.productFicheOriginalName !="" && p.productFicheFileName != null && p.productFicheOriginalName !=null && p.productFicheDocId !=null && p.productFicheDocId != ""){
						template = template.replace(/\*productFileName\*/g,productFichehtml);
						if($('.GPC0007').length>0 ||$('.GPC0026').length>0) {
							ynEnergyLabel = "Y";
						}
					} else{
						template = template.replace(/\*productFileName\*/g,"");
					}
					if(p.energyLabel != "" && p.energyLabel != "N" && p.energyLabel != null && p.energyLabelDocId !=null && p.energyLabelDocId !="" && p.energyLabelFileName != null && p.energyLabelFileName != "" && p.energyLabelOriginalName !=null
							&& p.energyLabelOriginalName !="" && p.energyLabelImageAddr !=null && p.energyLabelImageAddr !="" && p.energyLabelName !=null && p.energyLabelName !=""){
						template = template.replace(/\*energyLabel\*/g,energyLabelhtml);
						template = template.replace(/\*energyLabelImage\*/g,energyLabelImagehtml);
						if($('.GPC0007').length>0 ||$('.GPC0026').length>0) {
							ynEnergyLabel = "Y";
						}
					} else{
						template = template.replace(/\*energyLabelImage\*/g, "");
						template = template.replace(/\*energyLabel\*/g,"");
					} 
					
					if($('.GPC0026').length > 0) {
						template = 	template.replace(/\*linkUrl\*/g, p.linkUrl)
											.replace(/\*urlTarget\*/g, p.urlTarget)
											.replace(/\*btnName\*/g, p.btnName)
											.replace(/\*startDate\*/g, p.startDate)
											.replace(/\*endDate\*/g, p.endDate)
											.replace(/\*tooltipBody\*/g, p.tooltipBody)
						;
					}
					
					var $template = $(template),
						$keyBlocks = $template.find('*[data-key]'),
						$loopBlocks = $template.find('*[data-loop]');
					
					// LGEPL-80 START
					var opensTarget = $("#opensTarget").val();
					if(p.externalLinkTarget && p.externalLinkTarget=="New") {
						$template.find('.promotion-text a').attr('target', '_blank').attr('title', opensTarget);
					}
					// LGEPL-80 END

					for (var i1 = 0; i1 < $keyBlocks.length; i1++) {
						var $currentKeyBlock = $keyBlocks.eq(i1),
							key = $currentKeyBlock.get(0).getAttribute('data-key'),
							val = p[key];
						if(!val || (val == null || val == "N")) {
							if($currentKeyBlock.is('.btn')) {
								$currentKeyBlock.removeClass('active');
							}else {
								var countryCode = $('[data-countrycode]').attr('data-countrycode');
								//PJTLIMITQTY_EXTEND ADD
								if($('.GPC0007').length > 0 || $('.GPC0026').length > 0 ){
									if((p.obsLimitSale == 'Y' && p.limitSaleUseFlag == 'Y') || (p.obsPreOrderFlag == "Y" || p.obsPreOrderRSAFlag == "Y")){
										$keyBlocks.closest('p').addClass('tag-imp');
										if(p.vipPriceFlag != 'Y' && p.obsLimitSale == 'Y' && p.limitSaleUseFlag == 'Y') {
											$template.find('.price-vip').text(p.limitSaleTitle);
										}
									}
									if($template.find('.model-buy').length > 0 && (p.obsLimitSale == 'Y' && p.limitSaleUseFlag == 'Y')){
										if($template.find('.only-price').length > 0){
											$template.find('.model-buy').removeClass('only-price');	
										}
									}
								}
								if((key == 'productTag1' ||  key == 'productTag2') && ($('.GPC0007').length>0 ||$('.GPC0026').length>0)) {
										$currentKeyBlock.closest('p').remove();
								}else{
									$currentKeyBlock.remove();
								}
							}
						}else {
							if($currentKeyBlock.is('.btn')) {
								$currentKeyBlock.addClass('active');
							}else{
                                //PJTLIMITQTY_EXTEND ADD
								if(($('.GPC0007').length > 0 || $('.GPC0026').length > 0 ) && p.limitSaleUseFlag == 'Y'){
									if(p.obsLimitSale == 'Y'){
										$keyBlocks.closest('p').addClass('tag-imp');
										if(p.vipPriceFlag != 'Y') {
											$template.find('.price-vip').text(p.limitSaleTitle);
										}
									}
									if($template.find('.model-buy').length > 0){
										if($template.find('.only-price').length > 0){
											$template.find('.model-buy').removeClass('only-price');	
										}
									}
								}
							}
						}
					}

					// in-house reivew rating star - ie fix
					$template.find('.carmine-star').css({
						width: p.reviewRatingPercent+"%"
					});
					
					if($('.GPC0026').length > 0) {
						// PJTPROCOM-3 ADD
						var $campaignArea = $template.find('.btn-campaign-box');
						var campaignLinkBtn = $campaignArea.find('template[data-campaignbtn="LINK"]').clone().html();
						
						var $ratingArea = $template.find('.has-review-pop');
						var reviewBtnBV = $ratingArea.find('template[data-review-btn-type="BV"]').clone().html();
						var reviewBtnLGCOM = $ratingArea.find('template[data-review-btn-type="LGCOM"]').clone().html();
						var reviewBtnSP = $ratingArea.find('template[data-review-btn-type="SP"]').clone().html();
						var reviewBtnCENEO = $ratingArea.find('template[data-review-btn-type="CENEO"]').clone().html();
						var reviewBtnTxt = $ratingArea.attr('data-review-btn-text');
						var chkWriteReview = $('#reviewDefaultData').attr('data-check');
						var reviewLoginUrl = $('#reviewDefaultData').attr('data-review-login-url');
						
						var tmpText = "";
						var tmpBtnText = "";
						var tmpUrlTarget= "_blank";
						var tmpTooltipDate = "";
						var tmpBtnNameFontOpt = "";
						var tmpTooltipBodyFontOpt = "";
						
						if(p.urlTarget == "S") tmpUrlTarget = "_self";
						tmpTooltipDate = p.startDate + "-" + p.endDate;
						
						if(p.btnNameFontOpt == "I") tmpBtnNameFontOpt = " text-italic";
						if(p.btnNameFontOpt == "B") tmpBtnNameFontOpt = " text-bold";
						if(p.tooltipBodyFontOpt == "I") tmpTooltipBodyFontOpt = " text-italic";
						if(p.tooltipBodyFontOpt == "B") tmpTooltipBodyFontOpt = " text-bold";
						
						if(p.campaignUseFlag == "Y") {
							tmpText = "<a href='" + p.linkUrl + "' role='button' class='btn-campaign' target='" + tmpUrlTarget + "'>";
							tmpText = tmpText + "<div class='title-campaign'>";
							tmpText = tmpText + "<div class='campaign-txt" + tmpBtnNameFontOpt + "'>" + p.btnName + "</div>";
							tmpText = tmpText + "<div class='campaign-day'>" + tmpTooltipDate + "</div>";
							tmpText = tmpText + "</div>";
							if(p.tooltipBody != null && p.tooltipBody != '') {
								tmpText = tmpText + "<div class='campaign-banner'>";
								tmpText = tmpText + "<p class='campaign-info"+ tmpTooltipBodyFontOpt + "'>" + p.tooltipBody + "</p>";
								tmpText = tmpText + "</div>";
							}
							tmpText = tmpText + "</a>";
							campaignLinkBtn = campaignLinkBtn.replace(/\*alinktext\*/g,tmpText);
							$campaignArea.append(campaignLinkBtn);
						} else {
							$campaignArea.addClass('hidden');
						}
						
						if(p.reviewBtnUseFlag == "Y" && p.reviewUseFlag == "Y") {
							if(reviewType == "BV" || reviewType == "BV2") {
								tmpBtnText = "<a href='#' data-toggle='modal' role='button' data-review-event-click='BV' class='btn-popup-review' data-review-model-id='" + p.modelId + "' data-adobe-tracking-wish='Y' data-page-event='promotion_plp_review_move'>" + reviewBtnTxt + "</a>";
								reviewBtnBV = reviewBtnBV.replace(/\*reviewBtnText\*/g, tmpBtnText);
								$ratingArea.append(reviewBtnBV);
							} else if(reviewType == "LGCOM") {
								tmpBtnText = "<a href='#' data-toggle='modal' role='button' data-review-event-click='LGCOM' class='btn-popup-review' data-review-model-id='" + p.modelId + "' data-review-login-url= '" + reviewLoginUrl + "' data-review-participantCount= '" + p.reviewRating + "' data-review-starRatingPercent='" + p.reviewRatingPercent + "' data-review-starRatingValue='" + p.reviewRatingStar2 + "' data-check='" + chkWriteReview + "' data-adobe-tracking-wish='Y' data-page-event='promotion_plp_review_move'>" + reviewBtnTxt + "</a>";
								reviewBtnLGCOM = reviewBtnLGCOM.replace(/\*reviewBtnText\*/g, tmpBtnText);
								$ratingArea.append(reviewBtnLGCOM);
							} else if(reviewType == "SP") {
								tmpBtnText = "<a href='" + p.modelUrlPath + "'#pdp_review' data-review-event-click='SP' data-review-model-id='" + p.modelId + "' class='btn-popup-review' data-adobe-tracking-wish='Y' data-page-event='promotion_plp_review_move'>" + reviewBtnTxt + "</a>";
								reviewBtnSP = reviewBtnSP.replace(/\*reviewBtnText\*/g, tmpBtnText);
								$ratingArea.append(reviewBtnSP);
							} else if(reviewType == "CENEO") {
								tmpBtnText = "<a href='" + p.modelUrlPath + "'#pdp_review' data-review-event-click='CENEO' data-review-model-id='" + p.modelId + "' class='btn-popup-review' data-adobe-tracking-wish='Y' data-page-event='promotion_plp_review_move'>" + reviewBtnTxt + "</a>";
								reviewBtnCENEO = reviewBtnCENEO.replace(/\*reviewBtnText\*/g, tmpBtnText);
								$ratingArea.append(reviewBtnCENEO);
							}
						}
					}

					// sibling target check
					if(p.target && p.target.toUpperCase() == "SELF") {
						$template.find('.item.js-model').addClass('self');
					}else {
						$template.find('.item.js-model').removeClass('self');
					}
					
					
					// price setting
					$priceArea = $template.find('.price-area.total');
					if($priceArea.length!=0) {
						$priceArea.removeClass('type-none type-default type-msrp type-promotion type-text');
						if(p.modelStatusCode=='DISCONTINUED') {
							// do nothing
						} else if(p.retailerPricingFlag == "Y") {
							// type text
							$priceArea.addClass('type-text');
							$priceArea.find('.text').text(p.retailerPricingText);
						// 20200514 START 박지영 : 조건문에서 promotionPrice 제거
						} else if(p.rPromoPrice != null && p.rPrice != null && p.rPromoPrice != '' && p.rPrice != '') {
						// 20200514 END
							// type promotion
							$priceArea.addClass('type-promotion');
							var price = changeFormatFullPrice(p.rPromoPrice, p.rPromoPriceCent);
							var pricePromo = changeFormatFullPrice(p.rPrice, p.rPriceCent);
							$priceArea.find('.purchase-price .price .number').text(price);
							$priceArea.find('.product-price .price .number').text(pricePromo);
							$priceArea.find('.product-price .legal').html(p.discountMsg == null ? '' : p.discountMsg.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>'));		// LGEIS-229 change how discounts are shown
						} else {
							if(p.bizType=="B2B" && p.obsLoginFlag != "Y") { // PJTB2BOBS-1
								if(p.rPrice != null && p.rPrice != '') {
									// type b2b
									var price1 = changeFormatFullPrice(p.rPrice, p.rPriceCent);
									$priceArea.addClass('type-msrp');
									$priceArea.find('.purchase-price .price .number').text(price1);
								}
							} else {
								if(p.rPrice != null && p.rPrice != '') {
									// type default
									var price2 = changeFormatFullPrice(p.rPrice, p.rPriceCent);
									$priceArea.addClass('type-default');
									$priceArea.find('.purchase-price .price .number').text(price2);
								}
							}
						}
						// PJTOBS-32 Start
						if(ISVIP) $priceArea.addClass('vip-price-area');
						//PJTLIMITQTY_EXTEND
						var limitSaleConditionFlag =  p.vipPriceFlag == 'N' && p.obsLimitSale == 'Y' && p.limitSaleUseFlag == 'Y' ? 'Y' : 'N';
						if(p.vipPriceFlag == 'Y') {
							var priceOrg = changeFormatFullPrice(p.rPrice, p.rPriceCent);
							var pricePromo = changeFormatFullPrice(p.rPromoPrice, p.rPromoPriceCent);
							var legal = p.discountMsg == null ? '' : p.discountMsg.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');		// LGEIS-229 change how discounts are shown
							var vipPriceText = productMessages.vipPriceMessage;
							var previousPriceText = productMessages.previousPriceText;
							var emiMsgText = p.obsEmiMsgFlag == 'Y' && p.emiMsg != null ? p.emiMsg : '';
							
							setVipPrice($priceArea, priceOrg, pricePromo, legal, vipPriceText, previousPriceText, p.modelId + '/' + 'category-filter.js',emiMsgText,p.afterPay, limitSaleConditionFlag, p.limitSaleTitle);
						}else if(SIGN_IN_STATUS == 'Y' && p.emiMemberMsg != null && p.emiMemberMsg != '' && $('.GPC0007').lengtg > 0){
							//LGCOMSM-51 START
							setInstallmentMember($priceArea,p.emiMemberMsg);
							//LGCOMSM-51 END
						}
						if($('.GPC0007,.GPC0026,.GPC0132,.GPC0009').length>0) {
							if($priceArea.siblings( '.price-vip-Installment,.price-pdp-Installment').length > 0){
								$priceArea.removeClass('vip-price-area');	
							}
							
						}
						// PJTOBS-32 End
					}
					
					// 2020.09.28 PJTPLP ADD START
					// 2020.10.05 PJTPLP MODIFY START
					if($('.GPC0007').length>0 ||$('.GPC0026').length>0) {
						if(labelUseFlag == "Y" && useLabelIcon == "Y") {
							var $labelList = $template.find('.label-list .label-inner ul');
							var labelAward = $labelList.find('template[data-label-type="AWARD"]').clone().html();
							var labelFeature = $labelList.find('template[data-label-type="FEATURE"]').clone().html();
							var labelDelivery = $labelList.find('template[data-label-type="DELIVERY"]').clone().html();
							var labelWarranty = $labelList.find('template[data-label-type="WARRANTY"]').clone().html();
							var labelBullet = $labelList.find('template[data-label-type="BULLET"]').clone().html();
							var labelIconMap = p.labelIconMap;
							for(var cnt = 0; cnt < labelIconMap.length; cnt++) {
								var tmpLabelAward = labelAward;
								var tmpLabelFeature = labelFeature;
								var tmpLabelDelivery = labelDelivery;
								var tmpLabelWarranty = labelWarranty;
								var tmpLabelBullet = labelBullet;
								var tmpText = "";
							/* 2020.10.12 PJTPLP 수정 */
								if(labelIconMap[cnt].shortDescType == 'AWARD' || labelIconMap[cnt].shortDescType == 'FEATURE') {
									if(labelIconMap[cnt].cssFontBold=="Y" && labelIconMap[cnt].cssFontItalic=="Y") {
										tmpText = "<li data-adobe-tracking-wish='Y' data-page-event='plp_labelicon' class='text-all'>";
									} else if(labelIconMap[cnt].cssFontBold=="Y") {
										tmpText = "<li data-adobe-tracking-wish='Y' data-page-event='plp_labelicon' class='text-bold'>";
									} else if(labelIconMap[cnt].cssFontItalic=="Y") {
										tmpText = "<li data-adobe-tracking-wish='Y' data-page-event='plp_labelicon' class='text-italic'>";
									} else {
										tmpText = "<li data-adobe-tracking-wish='Y' data-page-event='plp_labelicon'>";
									}
									if(labelIconMap[cnt].linkUrl != null && labelIconMap[cnt].linkUrl != '') {
										tmpText = tmpText + "<a href='" +  labelIconMap[cnt].linkUrl + "' ";
										if(labelIconMap[cnt].linkOpt == "S") {
											tmpText = tmpText + "target='_self' data-adobe-tracking-wish='Y' data-page-event='plp-labelicon'>";
										} else if(labelIconMap[cnt].linkOpt == "B") {
											tmpText = tmpText + "target='_blank' data-adobe-tracking-wish='Y' data-page-event='plp-labelicon'>";
										}
									}
									if(labelIconMap[cnt].imagePathAddr != '' && labelIconMap[cnt].imagePathAddr != null) {
										tmpText = tmpText + "<img src='" + labelIconMap[cnt].imagePathAddr + "' alt='" + labelIconMap[cnt].altText + "' aria-hidden='true'>"
												+ "<p>" + labelIconMap[cnt].shortDesc + "</p>";
										if(labelIconMap[cnt].linkUrl != null && labelIconMap[cnt].linkUrl != '') {
											tmpText = tmpText + "</a>"
										}
										tmpText = tmpText + "</li>";
										tmpLabelAward = tmpLabelAward.replace(/\*shortDesc\*/g,tmpText);
										$labelList.append(tmpLabelAward);
									} else {
										tmpText = tmpText + "<p>" + labelIconMap[cnt].shortDesc + "</p>";
										if(labelIconMap[cnt].linkUrl != null && labelIconMap[cnt].linkUrl != '') {
											tmpText = tmpText + "</a>"
										}
										tmpText = tmpText + "</li>";
										tmpLabelFeature = tmpLabelFeature.replace(/\*shortDesc\*/g,tmpText);
										$labelList.append(tmpLabelFeature);
									}
								} else if(labelIconMap[cnt].shortDescType == 'DELIVERY') {
									tmpLabelDelivery = tmpLabelDelivery.replace(/\*shortDesc\*/g,labelIconMap[cnt].shortDesc);
									$labelList.append(tmpLabelDelivery);
								} else if(labelIconMap[cnt].shortDescType == 'WARRANTY') {
									tmpLabelWarranty = tmpLabelWarranty.replace(/\*shortDesc\*/g,labelIconMap[cnt].shortDesc);
									$labelList.append(tmpLabelWarranty);
								} else if(labelIconMap[cnt].shortDescType == 'BULLET') {
									tmpLabelBullet = tmpLabelBullet.replace(/\*shortDesc\*/g,labelIconMap[cnt].shortDesc);
									$labelList.append(tmpLabelBullet);
								} else {
									
								}
							}
							// 2020.10.05 PJTPLP MODIFY END
							var $tempThinqSignatureFlag = $template.find('.model-brand');
							var thinqFlag = $tempThinqSignatureFlag.find('template[data-thinqFlag]').clone().html();
							var signatureFlag = $tempThinqSignatureFlag.find('template[data-signatureFlag]').clone().html();
							if(p.signatureFlag == "Y") {
								$tempThinqSignatureFlag.append(signatureFlag+" ");
								ynBrandTag = "Y";
							}
							if(p.thinqFlag == "Y") {
								$tempThinqSignatureFlag.append(thinqFlag+" ");
								ynBrandTag = "Y";
							}
							// WhiteSpace 관련 수정
							if(p.productTag1 != null || p.productTag1 != "" || p.productTag2 != null || p.productTag2 != "") {
								ynProductTag = "Y";
							}
						}
					}
					// 2020.09.28 PJTPLP ADD END 
					
					// siblingModels
					var $sibling = $template.find('.model-group .inner');
					var siblingTypeclass;
					if(p.siblingType && p.siblingType != null) {
						siblingTypeclass = (p.siblingType.toLowerCase() == "color") ? "color" : "size";
						// 2020.10.06 // WhiteSpace 관련 수정
						if($('.GPC0007').length>0 ||$('.GPC0026').length>0) {
							ynSibling = "Y";
						}
					}else {
						siblingTypeclass = null;
					}
					
					var havSiblingModels = p.siblingModels && p.siblingModels.length > 0;
					if((havSiblingModels && siblingTypeclass != null) && $sibling.get(0)) {
						var siblingItem = $template.find('.model-group .'+siblingTypeclass).clone().html(),
							siblingAriaTxt = $template.find('.model-group .'+siblingTypeclass).clone().attr('aria-label'),
							siblingMarkup = [];

						for (var _j = 0; _j < p.siblingModels.length; _j++) {
							var sbModel = p.siblingModels[_j];
							var item = siblingItem.replace(/\*siblingCode\*/g, sbModel.siblingCode)
												.replace(/\*siblingValue\*/g, sbModel.siblingValue)
												.replace(/\*subModelId\*/g, sbModel.modelId);
							if(sbModel.modelId != p.modelId) {
								item = item.replace('active', '');
							}else {
								var $item = $(item);
								$item.attr('aria-checked', true);
								item = $item.get(0).outerHTML;
							}
							siblingMarkup += item;
						}
						$sibling.append(siblingMarkup);
						$template.find('.model-group .inner').attr('aria-label', siblingAriaTxt);
					// 20200316 START 박지영 : aria 오류 방지
					} else {
						$sibling.removeAttr('role');
					// 20200316 END
					}

					// rolling image
					if(p.modelRollingImgList && p.modelRollingImgList != null) {
						$template.find('.visual img.pc').addClass('js-thumbnail-loop').attr('data-img-list', p.modelRollingImgList);
					}

					// PJTOBS 20200703 Start
					// re stock alert
					var $stockArea = $template.find('.stock-area');
					//PJTLIMITQTY-1 START
					if((!p.reStockAlertFlag || p.reStockAlertFlag!='Y') && $stockArea.length>0) {
						if(($('.GPC0007').length > 0 || $('.GPC0026').length > 0) && p.limitSaleUseFlag == 'Y' && p.obsLimitSale == 'Y'){
							if(p.obsInventoryFlag == 'Y'){
								$stockArea.removeClass('out-of-stock').empty();
							}else{
								$stockArea.find('.text').text(productMessages.limitSaleSoldOutText);
							}
						}else{
							$stockArea.removeClass('out-of-stock').empty();
						}
					}else{
						if(($('.GPC0007').length > 0 || $('.GPC0026').length > 0) && p.limitSaleUseFlag == 'Y' && p.obsLimitSale == 'Y'){
							$stockArea.find('.text').text(productMessages.limitSaleSoldOutText);
						}
					}
					//PJTLIMITQTY-1 END
					
					// PJTOBS 20200703 End

					// buttons
					// PJTOBS 20200703 Start
					if($template.find('.button a.re-stock-alert').length>0) {
						if((!p.reStockAlertFlag || p.reStockAlertFlag!='Y')) {
							$template.find('.button a.re-stock-alert').removeClass('active');
						} else {
							$template.find('.button a.re-stock-alert').addClass('active');
						}
					}
					// PJTOBS 20200703 End
					if(p.obsPreOrderFlag == 'Y'){ //PJTOBS/2020/PJTOBSB2E-6 GILS
						if(p.obsBuynowFlag == 'Y'){
							$template.find('.button a.add-to-cart').addClass('active').data('model-id', p.modelId).attr('href', p.modelUrlPath).text(productMessages.preOrderBtnNm).removeAttr('target, title')
							.addClass('pre-order').attr('data-obs-pre-order-start-date',p.obsPreOrderStartDate).attr('data-obs-pre-order-end-date',p.obsPreOrderEndDate)
							;
						}else{
							$template.find('.button a.add-to-cart').addClass('active').data('model-id', p.modelId).attr('href', '#').text(productMessages.preOrderBtnNm).attr('role', 'button').removeAttr('target, title')
							.addClass('pre-order').attr('data-obs-pre-order-start-date',p.obsPreOrderStartDate).attr('data-obs-pre-order-end-date',p.obsPreOrderEndDate)
							;						
						}
						
					}else if(p.addToCartFlag!="N") {
						if(p.addToCartFlag == 'Y') {
							// LGEIN-125, LGEIN-155, LGEVN-80
							if(p.obsBuynowFlag == 'Y'){
								// 통합 OBS
								var buynow = $('#buynow').val();
								$template.find('.button a.add-to-cart').addClass('active').data('model-id', p.modelId).attr('href', p.modelUrlPath).text(buynow).removeAttr('target, title');
							} else{
								// 통합 OBS
								$template.find('.button a.add-to-cart').addClass('active').data('model-id', p.modelId).attr('href', '#').text(productMessages.addToCartBtnNm).attr('role', 'button').removeAttr('target, title');
							}
						} else if(p.addToCartFlag == 'S') {
							// Standalone OBS
							$template.find('.button a.add-to-cart').addClass('active').data('model-id', p.modelId).attr('href', '#').text(productMessages.addToCartBtnNm).attr('role', 'button').removeAttr('target, title');
						}
					} else if(p.buyNowFlag=="Y" || p.buyNowFlag=="L") { // buyNowFlag==Y : book online 포함
						if(p.ecommerceTarget == '_blank') {
							$template.find('.button a.add-to-cart').addClass('active').data('model-id', p.modelId).attr('href', p.buyNowUrl).text(productMessages.buyNowBtnNm).removeAttr('role').attr('target', '_blank').attr('title', productMessages.btnNewLinkTitle);
						}else {
							$template.find('.button a.add-to-cart').addClass('active').data('model-id', p.modelId).attr('href', p.buyNowUrl).text(productMessages.buyNowBtnNm).removeAttr('role').removeAttr('target, title');
						}
					// 20200506 START 박지영 - flag 명 변경
					} else if (p.resellerBtnFlag=="Y") {
					// 20200506 END
						$template.find('.button a.add-to-cart').addClass('active').data('model-id', p.modelId).attr('href', p.resellerLinkUrl).text(productMessages.resellerBtnNm).removeAttr('role').attr('target', '_blank').attr('title', productMessages.btnNewLinkTitle);
					} else if (p.productSupportFlag=="Y") {
						$template.find('.button a.add-to-cart').addClass('active').data('model-id', p.modelId).attr('href', p.productSupportUrl).text(productMessages.productSupportBtnNm).removeAttr('role').removeAttr('target, title');
					} else {
						$template.find('.button a.add-to-cart').removeClass('active');
					}
					// WTB btn
					if(p.whereToBuyFlag=="Y" && p.whereToBuyUrl != null && p.whereToBuyUrl != '') {
						// go to pdp page
						$template.find('.button a.where-to-buy').addClass('active').attr('href', p.whereToBuyUrl).text(productMessages.whereToBuyBtnNm);
						$template.find('.button a.where-to-buy').removeAttr('target, title');
					// 20200410 START 박지영 - wtb external link 변경
					} else if(p.wtbExternalLinkUseFlag=="Y" && p.wtbExternalLinkUrl != null && p.wtbExternalLinkUrl != '' && p.wtbExternalLinkName != null && p.wtbExternalLinkName != '') {
						// go to external link
						//LGEGMC-2202 START
						$template.find('.button a.in-buynow:not(.add-to-cart)').addClass('active').attr('href', p.wtbExternalLinkUrl).text(p.wtbExternalLinkName).attr('data-link-name', 'buy_now').removeAttr('data-sc-item');
						if(p.wtbExternalLinkSelfFlag == 'Y') {
							$template.find('.button a.in-buynow:not(.add-to-cart)').removeAttr('target, title');
						} else {
							$template.find('.button a.in-buynow:not(.add-to-cart)').attr('target', '_blank').attr('title', productMessages.btnNewLinkTitle);
						}
						//LGEGMC-2202 END
					// 20200410 END
					} else {
						$template.find('.button a.where-to-buy').removeClass('active');
					}
					// Find a dealer btn
					if(p.findTheDealerFlag=="Y" && p.findTheDealerUrl != null && p.findTheDealerUrl != '') {
						$template.find('.button a.find-a-dealer').addClass('active').attr('href', p.findTheDealerUrl).text(productMessages.findTheDealerBtnNm);
					} else {
						$template.find('.button a.find-a-dealer').removeClass('active');
					}
					// inquiry to buy btn
					if(p.inquiryToBuyFlag=="Y" && p.inquiryToBuyUrl != null && p.inquiryToBuyUrl != '') {
						$template.find('.button a.inquiry-to-buy').addClass('active').attr('href', p.inquiryToBuyUrl).text(productMessages.inquiryToBuyBtnNm);
					} else {
						$template.find('.button a.inquiry-to-buy').removeClass('active');
					}
					
					$template.find('template').remove();
					if(i == 0){ // accessiblity focus item
						$template.addClass('first-item');
					}
					/* 2020.10.12 PJTPLP 수정 */
					if((p.rPrice != 0 && p.rPrice != null) || (p.rPromoPrice != 0 && p.rPromoPrice != null) || p.retailerPricingFlag == "Y" || p.reStockAlertFlag == "Y") {
						ynPrice = "Y";
					}
					if((p.reviewRating != "0" && p.reviewRating != null) || (p.reviewRatingStar != "0" && p.reviewRatingStar != null) || (p.reviewRatingStar2 != "0.0" && p.reviewRatingStar2 != null)
						|| (p.reviewRatingPercent != "0" && p.reviewRatingPercent != null)) {
						ynReviewRating = "Y"
					}
					
					
					template = $template.get(0).outerHTML;
					
					html += template;
				}
				
				// 2020.10.06 PJTPLP WhiteSpace
				if($('.GPC0007').length>0 ||$('.GPC0026').length>0) {
					var template = html;
					var $template = $(template);
					var $modelButtonEl = $template.find('.products-info .model-button .button');
					$modelButtonEl.removeClass('only-button');
					$modelButtonEl.addClass('only-button');
					$modelButtonEl.each(function(){
						if($(this).find('a.active').length > 1){
							$modelButtonEl.removeClass('only-button');
						return;
						}
					});
					template = $template.get();
					html = template;
				}
				
				return html;
			},
			loadPLP: function(e){
				var form = filter2.el;
				var isExpander = $(form).data('focus') == true;
				var url = form.action;

				if(e && e.type == 'submit') e.preventDefault(); // if page change
				else if(form.page) form.page.value = 1; // if filter option change

				var param = xssfilter($(form).serialize()),
					//cookieParam = $(form).find('fieldset').serialize(); // IE doesn't support this.
					// 20200325 START 박지영 : fieldset 대신 클래스명으로 변경
					cookieParam = $(form).find('.option-box input').serialize();
					// 20200325 END

				ajax.call(url, param, 'json', function(d){
					var data;
					if(d && d.data) data = d.data instanceof Array ? d.data[0] : d.data;
					if(d.status == "success" && data) {

						// reset no-contents area
						if($(filter2.result.querySelector('.no-content')).is(':visible')) {
							$(filter2.result).children().removeAttr('style');
						}

						data.productList = data.productList && data.productList != null ? data.productList : []; 
						data.multiCategorys = data.multiCategorys && data.multiCategorys != null ? data.multiCategorys : []; 
						/* LGEUS-11775 : 20190807 add, LGEUS-11780 20190812 add */ 
						if(data.promotionTotalCount != null && filter2.el.querySelector('input[type=checkbox][name=promotionsOnly]') != null  && data.promotionTotalCount == 0){
							var promotionsOnlySelector1 = filter2.el.querySelector('input[type=checkbox][name=promotionsOnly]');
							promotionsOnlySelector1.setAttribute("disabled",'disabled');
							promotionsOnlySelector1.parentNode.classList.add("disabled");
							$(promotionsOnlySelector1).siblings('.filter-cnt').text('('+data.promotionTotalCount+')');
						}else if(data.promotionTotalCount != null && filter2.el.querySelector('input[type=checkbox][name=promotionsOnly]') != null  && data.promotionTotalCount > 0){
							var promotionsOnlySelector2 = filter2.el.querySelector('input[type=checkbox][name=promotionsOnly]');
							promotionsOnlySelector2.removeAttribute("disabled");
							promotionsOnlySelector2.parentNode.classList.remove("disabled");
							$(promotionsOnlySelector2).siblings('.filter-cnt').text('('+data.promotionTotalCount+')');
						}
						
						if(data.obsTotalCount != null && filter2.el.querySelector('input[type=checkbox][name=obsOnly]') != null  && data.obsTotalCount == 0){
							var obsOnlySelector1 = filter2.el.querySelector('input[type=checkbox][name=obsOnly]');
							obsOnlySelector1.setAttribute("disabled",'disabled');
							obsOnlySelector1.parentNode.classList.add("disabled");
							$(obsOnlySelector1).siblings('.filter-cnt').text('('+data.obsTotalCount+')');
						}else if(data.obsTotalCount != null && filter2.el.querySelector('input[type=checkbox][name=obsOnly]') != null  && data.obsTotalCount > 0){
							var obsOnlySelector2 = filter2.el.querySelector('input[type=checkbox][name=obsOnly]');
							obsOnlySelector2.removeAttribute("disabled");
							obsOnlySelector2.parentNode.classList.remove("disabled");
							$(obsOnlySelector2).siblings('.filter-cnt').text('('+data.obsTotalCount+')');
						}
						
						if(data.bundlesTotalCount != null && filter2.el.querySelector('input[type=checkbox][name=bundlesOnly]') != null  && data.bundlesTotalCount == 0){
							var bundlesOnlySelector1 = filter2.el.querySelector('input[type=checkbox][name=bundlesOnly]');
							bundlesOnlySelector1.setAttribute("disabled",'disabled');
							bundlesOnlySelector1.parentNode.classList.add("disabled");
							$(bundlesOnlySelector1).siblings('.filter-cnt').text('('+data.bundlesTotalCount+')');
						}else if(data.bundlesTotalCount != null && filter2.el.querySelector('input[type=checkbox][name=bundlesOnly]') != null  && data.bundlesTotalCount > 0){
							var bundlesOnlySelector2 = filter2.el.querySelector('input[type=checkbox][name=bundlesOnly]');
							bundlesOnlySelector2.removeAttribute("disabled");
							bundlesOnlySelector2.parentNode.classList.remove("disabled");
							$(bundlesOnlySelector2).siblings('.filter-cnt').text('('+data.bundlesTotalCount+')');
						}
						/* LGEUS-11775 : 20190807 add, LGEUS-11780 20190812 add */ 
						//if(data.productList.length > 0 || data.multiCategorys.length == 1) {
						if($(filter2.result.querySelector('.promotion-wrapper')).length==0 && (data.productList.length > 0 || data.multiCategorys.length == 1)) {
							// normal product list & single promotion list
							//var data =  d.data instanceof Array ? d.data[0] : d.data,
							//	html;
							var html;

							// if single promotion type
							var singleTotalCount = 0;
							if(data.multiCategorys && data.multiCategorys.length == 1) {
								singleTotalCount = data.totalCount;
								var singleCate = data.multiCategorys,
									filterEnableList = data.filterEnableList;
								data = singleCate instanceof Array ? singleCate[0] : singleCate;
								data.filterEnableList = filterEnableList;
							}

							// make markup
							//console.log(data);
							html = filter2.createProductItem(data.productList, d.data[0].productMessages);

							var pageInfo = data.pageInfoCur;
							if(isExpander) { // mobile append list
								$(filter2.result.querySelector('.pagination')).hide();

								$(filter2.result.querySelector('.list-box')).append(html);
								bindImgError();
								runBVStaticPLP($(filter2.result));
								if(typeof renderListingInlineRatingsRU != 'undefined') renderListingInlineRatingsRU(getProductsNameRU());
								var pageVisible = pageInfo && pageInfo.view == "Y";
								if(pageVisible && pageInfo.page < pageInfo.pageCount) {
									filter2.result.querySelector('.expander button').value = pageInfo.page+1;
									$(filter2.result.querySelector('.expander')).show();
								}else {
									$(filter2.result.querySelector('.expander')).hide();
								}
							}else {
								$(filter2.result.querySelector('.expander')).hide();

								$(filter2.result.querySelector('.list-box')).html(html);
								bindImgError();
								runBVStaticPLP($(filter2.result));
								if(typeof renderListingInlineRatingsRU != 'undefined') renderListingInlineRatingsRU(getProductsNameRU());
								if(data.totalCount) {
									$('.result-curation-head .result-number').text(data.totalCount);
									$('#resultCurProductList .result-number').text(data.totalCount);
									$('.process-mo-ea .result-number').text(data.totalCount);
									//LGEGMC-1923 add
									if($('.GPC0142').length>0){
										showMessage(data.totalCount);
									}
								} else if(singleTotalCount){
									$('.result-curation-head .result-number').text(singleTotalCount);
									$('#resultCurProductList .result-number').text(singleTotalCount);
									$('.process-mo-ea .result-number').text(singleTotalCount);
									//LGEGMC-1923 add
									if($('.GPC0142').length>0){
										showMessage(singleTotalCount);
									}
								}
								/* 20191111 : LGEUS-11779 add */
								if($('#categoryCurFilterForm input[type=checkbox]:checked').length == 0 && $('#categoryCurFilterForm .slider-wrap input[value!=""]').length == 0){
									$('#resultCurProductList .result-info .total2').hide();
									$('#resultCurProductList .result-info .total1').show();
								}else{
									$('#resultCurProductList .result-info .total2').show();
									$('#resultCurProductList .result-info .total1').hide();
								}
								/* //20191111 : LGEUS-11779 add */
								
								/* LGEGMC-754 : 20201123 add */
								if(Number($('#resultCurProductList .total2 .result-number-total').text()) < Number($('#resultCurProductList .total2 .result-number').text())){
									$('#resultCurProductList .total2 .result-number-total').text(Number($('#resultCurProductList .total2 .result-number').text()));
								}
								/*// LGEGMC-754 : 20201123 add */
								// setting pagination
								if(pageInfo && pageInfo.view == "Y") {
									if(filter2.result.querySelector('.pagination')){
										var pageMarkup = [];
										for (var pageIdx = pageInfo.loopStart; pageIdx <= pageInfo.loopEnd; pageIdx++) {
											/* LGEGMC-754 : 20201123 modify */
											var _pageItem = filter2.pageTemplate? filter2.pageTemplate :'<li><button type="button" value=""></button></li>' ;
											/*// LGEGMC-754 : 20201123 modify */
											_pageItem = $(_pageItem).get(0);
											var _pageButton = _pageItem.querySelector('button');
											_pageButton.value = pageIdx;
											_pageButton.innerHTML = pageIdx;
											if(pageIdx.toString() == pageInfo.page) {
												_pageButton.setAttribute('class', 'active');
												// WA-GPC0007-01 : aria-current 추가
												_pageButton.setAttribute('aria-current', 'page');
											}
											if(filter2.result.querySelector('.pagination').getAttribute('data-aria-pattern')) {
												var _ariaText = filter2.result.querySelector('.pagination').getAttribute('data-aria-pattern').replace(/\#/g, pageIdx);
												_pageButton.setAttribute('aria-label', _ariaText);
											}
											pageMarkup += _pageItem.outerHTML;
										}
										$(filter2.result.querySelector('.pagination ul')).html(pageMarkup); 

										filter2.result.querySelector('.pagination .prev').disabled = !pageInfo.leftPage;
										filter2.result.querySelector('.pagination .next').disabled = !pageInfo.rightPage;
										filter2.result.querySelector('.pagination .prev').value = pageInfo.page-1;
										filter2.result.querySelector('.pagination .next').value = pageInfo.page+1;
										$(filter2.result.querySelector('.pagination')).show();
									}else if(filter2.result.querySelectorAll('.btn-area').length > 0){
										filter2.result.querySelector('.btn-area .prev').disabled = !pageInfo.leftPage;
										filter2.result.querySelector('.btn-area .next').disabled = !pageInfo.rightPage;
										$(filter2.result.querySelector('.btn-area')).show();
									}
									
									/* LGEGMC-754 : 20201123 add */
									if(!!!filter2.result.querySelector('.pagination')){
										//list-box
										var prevFlag = '';
										var nextFlag = '';
										if(pageInfo.leftPage != true) prevFlag = ' disabled';
										if(pageInfo.rightPage != true) nextFlag = ' disabled';
										
										var pageTemplate = '';
										var pageMarkup = [];
										pageTemplate += '<div class="pagination" role="navigation" aria-label="'+ $('input[name=component-Pagination]').val() +'" data-aria-pattern="'+ $('input[name=component-page]').val() +' #">';
										pageTemplate += '<button type="button" value="1" class="prev" aria-label="'+ $('input[name=component-previousPage]').val() +'"'+prevFlag+'>'+ $('input[name=component-prev]').val() +'</button>';		
										
										pageTemplate += '<ul>';
										for (var pageIdx = pageInfo.loopStart; pageIdx <= pageInfo.loopEnd; pageIdx++) {
											var _pageItem = '<li><button type="button" value=""></button></li>';
											_pageItem = $(_pageItem).get(0);
											var _pageButton = _pageItem.querySelector('button');
											_pageButton.value = pageIdx;
											_pageButton.innerHTML = pageIdx;
											if(pageIdx.toString() == pageInfo.page) {
												_pageButton.setAttribute('class', 'active');
												// WA-GPC0007-01 : aria-current 추가
												_pageButton.setAttribute('aria-current', 'page');
											}
											pageMarkup += _pageItem.outerHTML;
										}
										pageTemplate += pageMarkup;
										pageTemplate += '</ul>';						
										pageTemplate += '<button type="button" value="2" class="next" aria-label="'+ $('input[name=component-nextPage]').val() +'"'+nextFlag+'>'+ $('input[name=component-next]').val() +'</button>';						
										pageTemplate += '</div>';
										$('#resultCurAppendTarget .list-box').after(pageTemplate);
									}
									
									if(pageInfo.loopStart != pageInfo.loopEnd && !!!filter2.result.querySelector('.expander')) {
										var pageTemplate = '';
										pageTemplate += '<div class="expander">';
										pageTemplate += '<button type="button" class="btn btn-outline-secondary btn-sm" value="2">'+ $('input[name=component-loadMore]').val() +'</button>';
										pageTemplate += '</div>';
										$('#resultCurAppendTarget .list-box').after(pageTemplate);
									}
									/* LGEGMC-754 : 20201123 add */
									
									if(isMobile && pageInfo.loopStart != pageInfo.loopEnd) {
										$(filter2.result.querySelector('.pagination')).hide();
										$(filter2.result.querySelector('.expander')).show();
									}
									if($('.compare-wrap').length>0) {
										// for compare product
										if(pageInfo.page <= 1) {
											filter2.result.querySelector('.btn-area .prev').disabled = true; // disabled
										} else {
											filter2.result.querySelector('.btn-area .prev').disabled = false; // enabled
										}
										if(pageInfo.page == pageInfo.loopEnd) {
											filter2.result.querySelector('.btn-area .next').disabled = true; // disabled
										} else {
											filter2.result.querySelector('.btn-area .next').disabled = false; // enabled
										}
									}
								}else {
									$(filter2.result.querySelector('.pagination')).hide();
									// .btn-area should not be hidden in compare product page.
									if($('.compare-wrap').length==0) {
										// for plp page
										$(filter2.result.querySelector('.btn-area')).hide();
									} else {
										// for compare product
										filter2.result.querySelector('.btn-area .prev').disabled = !pageInfo.leftPage;
										filter2.result.querySelector('.btn-area .next').disabled = !pageInfo.rightPage;
										$(filter2.result.querySelector('.btn-area')).show();
									}
								}

								filter2.activateInput(data.filterEnableList);
								plp2.mediaBranch(window.matchMedia('(max-width: 1069px)'));
								plp2.addAriaDescribedby();
							}
							
							$(form).data('focus', false);
							$(filter2.el).trigger('appended');

							if(e && e.type == 'submit') {
								// if event type is page change
								var _focusItem = filter2.result.querySelector(".first-item");
								//$(_focusItem).find("a, button").eq(0).focus();
								$(_focusItem).removeClass("first-item");
							}

							//if(typeof runEcorebates !== "undefined") {
							//	if($.isFunction(runEcorebates)) runEcorebates();
							//}
							
						}else if(data.multiCategorys.length >= 1) {
							// multi promotion category
							$(filter2.result.querySelector('.promotion-wrapper')).html('');
							for (var i = 0; i < data.multiCategorys.length; i++) {
								var promoTemplate = $('#promotionTemplate').clone().html(),
									p = data.multiCategorys[i];

								// LGEGMC-526
								var pHtml = filter2.createProductItem(p.productList, data.productMessages);
								var productListHtml = "";
								for (var h=0; h<pHtml.length; h++) {
									productListHtml += pHtml[h].outerHTML;
								}
								// LGEGMC-526

								promoTemplate = promoTemplate.replace(/\*categoryName\*/g, p.categoryName)
													.replace(/\*categoryId\*/g, p.categoryId)
													.replace(/\*viewAllAjaxUrl\*/g, p.viewAllAjaxUrl)
													.replace(/\*productList\*/g, productListHtml) // LGEGMC-526
													.replace(/\*modelCopyUrl\*/g, p.modelUrlPath);

								var $promoTemplate = $(promoTemplate);

								// LGEGMC-526
								if(!p.viewAllAjaxUrl || p.viewAllAjaxUrl == null) {
									$promoTemplate.find('.list-more').removeAttr('data-url');
								}
								
								// pagination (view all)
								if(isMobile) {
									if(pHtml.length<3) {
										$promoTemplate.removeClass("close").addClass("open");
									}
								}else {
									if(pHtml.length<4) {
										$promoTemplate.removeClass("close").addClass("open");
									}
								}
								// LGEGMC-526 End

								$(filter2.result.querySelector('.promotion-wrapper')).append($promoTemplate.get(0).outerHTML);
								bindImgError();
								runBVStaticPLP($(filter2.result));
								if(typeof renderListingInlineRatingsRU != 'undefined') renderListingInlineRatingsRU(getProductsNameRU());
								filter2.activateInput(data.filterEnableList);
								plp2.mediaBranch(window.matchMedia('(max-width: 1069px)'));
								plp2.addAriaDescribedby();
							}
							
							// LGEGMC-526
							if(data.totalCount) {
								$('#resultCurProductList .result-number').text(data.totalCount);
								$('.process-mo-ea .result-number').text(data.totalCount);
							}

							if($('#categoryCurFilterForm input[type=checkbox]:checked').length == 0 && $('#categoryCurFilterForm .slider-wrap input[value!=""]').length == 0){
								$('#resultCurProductList .result-info .total2').hide();
								$('#resultCurProductList .result-info .total1').show();
							}else{
								$('#resultCurProductList .result-info .total2').show();
								$('#resultCurProductList .result-info .total1').hide();
							}
							// LGEGMC-526 End
						}else {
							// empty data;
							$(filter2.result.querySelector('.no-content')).show()
								.siblings().hide();
							$('#resultCurProductList .result-number').text('0');
							$('.process-mo-ea .result-number').text(data.totalCount);
							//LGEUS-11780 20190812 add
							filter2.activateInput(data.filterEnableList);
							//LGEUS-11780 20190812 add
							//LGEGMC-1923 add
							if($('.GPC0142').length>0){
								showMessage(0);
							}
						}

						if(thumbnailLoop) $(filter2.result).trigger('thumbnailCarousel');
						/* LGEBE-4 : 20200608 add */
						if($("#categoryFilterForm").length > 0) {
							pdp_where.init();
						}
						/*// LGEBE-4 : 20200608 add */

						// PJTOBS-32 Start
						if(ISVIP && $('input[name=vipPriceOnly]').length>0 && data.obsVipTotalCount>0) {
							var $vipOnly = $('input[name=vipPriceOnly]');
							$vipOnly.closest('li').removeAttr('hidden');
							$vipOnly.siblings('.text').find('.filter-cnt').text('('+data.obsVipTotalCount+')');
						}
						// PJTOBS-32 End
						//GPC Compare list whitespace 반영
						if($(".result-box").hasClass('compare-list')){
							console.log(data.productList[0].priceAreaYn ,data.productList[0].promotionAreaYn)
							if(data.productList[0].priceAreaYn == 'Y'&& data.productList[0].promotionAreaYn == 'N' ) {
								setTimeout(function() {
									$('.promotion-text').remove();
									$('.model-buy').addClass('only-price');
									
								}, 200);
							}
							if(data.productList[0].priceAreaYn == 'N' && data.productList[0].promotionAreaYn == 'Y' ) {
								setTimeout(function() {
									$('.price-area').remove();
									$('.model-buy').addClass('only-prm');
									
								}, 200);
							} 
							if(data.productList[0].priceAreaYn == 'N' && data.productList[0].promotionAreaYn == 'N' ) {
								setTimeout(function() {
									$('.model-buy').remove();
									
								}, 200);
							}  
							if(data.productList[0].siblingAreaYn == 'N') {
								setTimeout(function() {
									$('.model-group').remove();
									
								}, 200);
							}
						}
								
					}

					if(!e || e.type != 'submit') {
						// if filter option change
						filter2.cookie.bake(cookieParam);
					}

					// clear hidden input
					//if(form.viewAll) {
					//	form.viewAll.value = "";
					//}
					if(form.length) {
						form.length.disabled = false;
					}

					$('body').trigger('initialized-plp');
					initWhiteSpace();
					if($('.share-common').length > 0){
						initShareCommon();
					}
					var $objGroup = $('.GPC0007, .GPC0026').find('.model-group');
					$objGroup.each(function() {
						var _this = $(this);
						var obj_ea = _this.find('a').length;
						var group_width = $objGroup.width();
						var obj_width = _this.find('a').outerWidth(true);
						var obj_etc = (obj_ea - 1) * 4; // LGETW-256 : margin 값 계산 수정
						if(obj_ea * obj_width + obj_etc > group_width){
							_this.addClass('limited');
							if(!_this.find('button').hasClass('btn-limited')){
								_this.append('<button class="btn-limited">'+ '(' + obj_ea + ')' +'</button>')
								_this.find('button').on('click', function(e){
									if ($(window).width() < 768){
										_this.toggleClass('open');
										if(_this.hasClass('open')){
											$('.model-group').removeClass('open')
											_this.addClass('open');
										} else{
											_this.removeClass('open');
										}
									}
								});
							}
						} else{
							_this.removeClass('limited');
							_this.find('.btn-limited').remove();
						}
					});
					$(window).on('scroll' ,function(){
						if ($(window).width() < 767){
							$('.label-inner').each( function(i){
								var srlTop = $(window).scrollTop();
								var winH = $(window).innerHeight();
								var harf_pos = winH / 2;
								var obj_pos = $(this).offset().top + harf_pos;
								if( srlTop + winH > obj_pos ){
									$(this).addClass("act");
									$(this).removeClass("imp");
									$(this).parent('.label-list').find('button').attr('disabled', true)
								}  else{
									$(this).removeClass("act");
									$(this).parent('.label-list').find('button').attr('disabled', false)
								}
							});
						} 
					});
					var $item_width = $('.list-box').find('li > .item').outerWidth();
						if ($(window).width() < 767 || isMobile){
						$('.pd-share').find('.list').addClass('mobileSns')
					} else{
						$('.pd-share').find('.list').css('width', $item_width);
						$('.pd-share').find('.list').removeClass('mobileSns')
					}

					if($('.GPC0026 .list-box .btn-popup-review').length > 0){
						var $reviewBtn = $(document).find('[data-review-event-click]');
						$reviewBtn.on('click', function(e) {
							var $obj = $(this);
							var productId = $obj.attr('data-review-model-id');
							var model = $obj.attr('data-review-model-id');
							var eventType = $obj.attr('data-review-event-click');
							
							switch(eventType){
							case 'BV' :
								e.preventDefault();
								$BV.ui('rr','submit_review', {productId : model});
								break;

							case 'LGCOM' :
								 writeReview.init($obj);
								break;

							case 'SP' :
								break;

							case 'CENEO' :
								break;

							default :
								break;
							}
						});
					}
				}, null, 'body');

				if(filter2.initial == param) {
					// if the initial Form data is the same as this Form data
					$(filter2.banner).show();
				}else {
					$(filter2.banner).hide();
				}			
				/* LGECI-260 201229 add :: [web accessibility] paging num tab -> focus to list first item */
				//$(filter2.result).find("a, button").eq(0).focus();
				/* //LGECI-260 201229 add */
				//LGEGMC-1923 add
				if($('.GPC0142').length === 0)$(filter2.result).find("a, button").eq(0).focus();
			},
			// GPC0026 multi category View All (.list-more)
			viewAllPromotionPLP: function(e, isWholeBtn){
				var $closest = $(e.currentTarget).closest('.promotion-box'),
					$listMore = $(e.currentTarget).closest('.list-more'),
					url = $listMore.get(0).getAttribute('data-url'),
					dataParam = $listMore.data();
					// dataParam = $.param($(filter.el).serializeArray()) + $.param($listMore.data());

				delete dataParam.url;

				var newParam = $(filter2.el).serialize().replace(/\&filterCategoryId=[A-Z]+[0-9]+/g, '') + '&filterCategoryId='+$listMore.data('category-id');

				//dataParam = $.param(dataParam) + "&" + $(filter.el).serialize();
				dataParam = $.param(dataParam) + "&" + newParam;

				// find auto focusing item
				var $focusItem = $closest.find(".list-box li:visible:last").next();
				if(url && url != null) {
					ajax.call(url, xssfilter(dataParam), 'json', function(d){
						var data;

						if(d && d.data) data = d.data instanceof Array ? d.data[0] : d.data;

						// json에서 multiCategorys: [] 로 출력되는 경우 오류 방지
						data.productList = !data.productList ? ((!data.multiCategorys[0]) ? data.multiCategorys : data.multiCategorys[0].productList) : data.productList;
						if(data.productList) {
							//var data =  d.data instanceof Array ? d.data[0] : d.data,
							var html = filter2.createProductItem(data.productList, data.productMessages);

							// append item markup
							$closest.find('.list-box').append(html)
								.find(".first-item").removeClass("first-item");
							initWhiteSpace();
							bindImgError();
							runBVStaticPLP($(filter2.result));
							if(typeof renderListingInlineRatingsRU != 'undefined') renderListingInlineRatingsRU(getProductsNameRU());
							// open promotion box
							$closest.addClass('open');

							// focusing item
							if(!isWholeBtn) { // if top of view all button
								$focusItem.find("a, button").eq(0).focus();
							}else {
								$(filter2.result).find("a, button").eq(0).focus();
							}

							if(thumbnailLoop) $(filter2.result).trigger('thumbnailCarousel');
						}
					}, null, 'body');
					if($('.visual').hasClass('hasThumbnail')){
						setTimeout(function(){
							$('.visual').addClass('hasThumbnail');
						}, 300);
					}
				}else {
					$closest.addClass('open');

					// focusing item
					if(!isWholeBtn) {
						$focusItem.find("a, button").eq(0).focus();
					}else {
						$(filter2.result).find("a, button").eq(0).focus();
					}
				}
			},
			reset: function(e){
				/*LGEES-15 modify*/
				if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')||COUNTRY_CODE.toLowerCase()=='es' || COUNTRY_CODE.toLowerCase()=='uk') {
					var form = filter2.el;
					// if(window.history.pushState) {
					// 	window.history.pushState({},'','?');
					// }else {
					// 	location.search = '';
					// }
					
					filter2.removeEvent();
					filter2.cookie.reset();

					$(form).find('input:checked').removeAttr('checked');
					$(form).find('.slider-wrap input').val('').removeData('index');
					filter2.slider.setSlider();

					pageHistory.removeHistory();

					/* 20191111 : LGEUS-11779 add */
					$('.GPC0007 .apply-filters span').remove();
					$('.GPC0007 .apply-filters a.link-text').removeClass('active');
					/* //20191111 : LGEUS-11779 add */
					// LGEGMC-526
					$('.GPC0026 .apply-filters span').remove();
					$('.GPC0026 .apply-filters a.link-text').removeClass('active');
					// LGEGMC-526 End
					// PJTPROCOM-3
					// PJTPROCOM-3 End
					if($('.eprivacy-tooltip').length>0){
						$("#modal_cookie_set").hide();
						$('.page-cookie-view').unwrap();
						$("#modal_cookie_set").removeClass('page-cookie-view');
					}
					setTimeout(function() {
						filter2.addEvent();
						filter2.loadPLP();
					}, 100);
				} else {
					ePrivacyCookies.view('click');
				}
			},
			removeEvent: function(){
				// 20200316 START 박지영 compare.js에서 bind한 appended 이벤트를 삭제 하지 않도록 수정
				$(filter2.el).off('submit change reset');
				// 20200316 END
			},
			addEvent: function(){
				$(filter2.el).on({
					submit: filter2.loadPLP
				});
				$(filter2.el).on({
					change: function(event, ui) {
							/*LGEES-15 modify*/ 
						if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS') ||COUNTRY_CODE.toLowerCase()=='es' || COUNTRY_CODE.toLowerCase()=='uk') {
							if(ui && ui.handle) {
								var min= $(this).siblings().find('.min-box input').get(0),
									max = $(this).siblings().find('.max-box input').get(0);

								var inputArray = [min, max],
									idx = ui.handleIndex;

								if(inputArray[idx].value && inputArray[idx].value != inputArray[idx].getAttribute('data-old')) {
									var v = (idx==0) ? ($(this).siblings().find('.min-box span').text().replace(/[^0-9.]/g,'')) : ($(this).siblings().find('.max-box span').text().replace(/[^0-9.]/g,''));
									adobeTrackEvent('product-list-filter', {filter_name : inputArray[idx].getAttribute('name')+"_"+v, page_event : {filter_apply : true}});
								}
								
								inputArray[idx].setAttribute('data-old', inputArray[idx].value);

								if($(this).siblings().find('.min-box input').val()=="" && $(this).siblings().find('.max-box input').val()==""){
									$('.GPC0007 .apply-filters span[data-filter-value='+$(this).parent().attr('data-value')+']').remove();
								}else{
									var relVal = $(this).parent().siblings('.title').find('strong').text()+" : "+$(this).siblings().find(".min-box span").text()+"-"+$(this).siblings().find(".max-box span").text();						
									var checkName = $(this).attr('name');
									if($('.GPC0007 .apply-filters span[data-filter-value='+$(this).parent().attr('data-value')+']').length != 0){
										var _targetTxt = $('.GPC0007 .apply-filters span[data-filter-value='+$(this).parent().attr('data-value')+']');
										_targetTxt.contents().filter(function(){return this.nodeType == 3;})[0].nodeValue = relVal;
									}else{
										var $filter_icon = "<span data-filter-name='"+checkName+"' data-filter-value='"+$(this).parent().attr('data-value')+"'>"+relVal+" <a href='#'><span class=\"sr-only\">"+removeTxt+"</span></a></span>";
										$('.GPC0007 .apply-filters .link-text').before($filter_icon);		
										$('.GPC0007 .apply-filters span[data-filter-value='+$(this).parent().attr('data-value')+'] a').one('click',function(e){
											e.preventDefault();
											// 20200325 START 박지영 : slider의 min, max 텍스트 초기화 안되는 오류 수정
											var fv = $(this).parent().attr('data-filter-value');
											var options = $('.GPC0007 .slider-wrap[data-value="'+fv+'"] .slider-range').slider('option');
											$('.GPC0007 .slider-wrap[data-value="'+fv+'"] input').val('').removeData('index');
											$('.GPC0007 .slider-wrap[data-value="'+fv+'"] .slider-range').slider('values',[options.min, options.max]);
											$('.GPC0007 .slider-wrap[data-value="'+fv+'"] .min-box span').text(Object.keys(dragbarVal[fv][options.min])[0]);
											$('.GPC0007 .slider-wrap[data-value="'+fv+'"] .max-box span').text(Object.keys(dragbarVal[fv][options.max])[0]);
											// 20200325 END
											$(this).parent().remove();
										});
									}
								}
								if($('.GPC0007 .apply-filters span').length != 0){
									$('.GPC0007 .apply-filters a.link-text').addClass('active');
								}else{
									$('.GPC0007 .apply-filters a.link-text').removeClass('active');
								}

								// LGEGMC-526
								if($(this).siblings().find('.min-box input').val()=="" && $(this).siblings().find('.max-box input').val()==""){
									$('.GPC0026 .apply-filters span[data-filter-value='+$(this).parent().attr('data-value')+']').remove();
								}else{
									var relVal = $(this).parent().siblings('.title').find('strong').text()+" : "+$(this).siblings().find(".min-box span").text()+"-"+$(this).siblings().find(".max-box span").text();
									var checkName = $(this).attr('name');
									if($('.GPC0026 .apply-filters span[data-filter-value='+$(this).parent().attr('data-value')+']').length != 0){
										var _targetTxt = $('.GPC0026 .apply-filters span[data-filter-value='+$(this).parent().attr('data-value')+']');
										_targetTxt.contents().filter(function(){return this.nodeType == 3;})[0].nodeValue = relVal;
									}else{
										var $filter_icon = "<span data-filter-name='"+checkName+"' data-filter-value='"+$(this).parent().attr('data-value')+"'>"+relVal+" <a href='#'><span class=\"sr-only\">"+removeTxt+"</span></a></span>";
										$('.GPC0026 .apply-filters .link-text').before($filter_icon);		
										$('.GPC0026 .apply-filters span[data-filter-value='+$(this).parent().attr('data-value')+'] a').one('click',function(e){
											e.preventDefault();
											// 20200325 START 박지영 : slider의 min, max 텍스트 초기화 안되는 오류 수정
											var fv = $(this).parent().attr('data-filter-value');
											var options = $('.GPC0026 .slider-wrap[data-value="'+fv+'"] .slider-range').slider('option');
											$('.GPC0026 .slider-wrap[data-value="'+fv+'"] input').val('').removeData('index');
											$('.GPC0026 .slider-wrap[data-value="'+fv+'"] .slider-range').slider('values',[options.min, options.max]);
											$('.GPC0026 .slider-wrap[data-value="'+fv+'"] .min-box span').text(Object.keys(dragbarVal[fv][options.min])[0]);
											$('.GPC0026 .slider-wrap[data-value="'+fv+'"] .max-box span').text(Object.keys(dragbarVal[fv][options.max])[0]);
											// 20200325 END
											$(this).parent().remove();
										});
									}
								}
								if($('.GPC0026 .apply-filters span').length != 0){
									$('.GPC0026 .apply-filters a.link-text').addClass('active');
								}else{
									$('.GPC0026 .apply-filters a.link-text').removeClass('active');
								}
								// LGEGMC-526 End
								
								// PJTPROCOM-3
								
								// LGEGMC-526 End
							} else {
								var name = changeTitleFormat($(this).closest('.option-box').find('.title strong').text());
								var val = $(this).parent().find('.text .name').length>0 ? changeTitleFormat($(this).parent().find('.text .name').text()) : changeTitleFormat($(this).parent().find('.text').text());
								var relVal2 = ($(this).parent().find('.text .filter-cnt').length==0)?$(this).parent().find('.text').text():$(this).parent().find('.text').text().replace($(this).parent().find('.text .filter-cnt').text(),'');
								var checkName = $(this).attr('name');
								if(!val || val=="") {
									// for color
									val = changeTitleFormat($(this).attr('title'));
									relVal2 = $(this).attr('title');
								}

								// LGEGMC-526, LGEGMC-1183 Start
								if($(this).prop('checked')) {
									var $filter_icon2 = "<span data-filter-name='"+checkName+"' data-filter-value='"+$(this).val()+"'>"+relVal2+" <a href='#'><span class=\"sr-only\">"+removeTxt+"</span></a>";
									if($('.GPC0007 .apply-filters span').length == 0){
										$('.GPC0007 .apply-filters a.link-text').addClass('active');
									}
									$('.GPC0007 .apply-filters .link-text').before($filter_icon2);
									$('.GPC0007 .apply-filters span[data-filter-value='+$(this).val()+'] a').one('click',function(e){
										e.preventDefault();
									if($(this).parent().attr('data-filter-value')!=='Y'){
											$('.GPC0007 #categoryCurFilterForm input[value="'+$(this).parent().attr('data-filter-value')+'"]').click();
										}else{
											$('.GPC0007 #categoryCurFilterForm input[name="'+$(this).parent().attr('data-filter-name')+'"]').click();
										}
									});

									if($('.GPC0026 .apply-filters span').length == 0){
										$('.GPC0026 .apply-filters a.link-text').addClass('active');
									}
									$('.GPC0026 .apply-filters .link-text').before($filter_icon2);
									$('.GPC0026 .apply-filters span[data-filter-value='+$(this).val()+'] a').one('click',function(e){
										e.preventDefault();
									if($(this).parent().attr('data-filter-value')!=='Y'){
											$('.GPC0026 #categoryFilterForm input[value="'+$(this).parent().attr('data-filter-value')+'"]').click();
										}else{
											$('.GPC0026 #categoryFilterForm input[name="'+$(this).parent().attr('data-filter-name')+'"]').click();
										}
									});

									if(name && val) {
										adobeTrackEvent('product-list-filter', {filter_name : name+"_"+val, page_event : {filter_apply : true}});
									} else if (val) {
										adobeTrackEvent('product-list-filter', {filter_name : val, page_event : {filter_apply : true}});
									}
								} else {
									if($(this).val() != '') {
										$('.GPC0007 .apply-filters span[data-filter-value='+$(this).val()+']').remove();
										$('.GPC0026 .apply-filters span[data-filter-value='+$(this).val()+']').remove();
									}
									if($('.GPC0007 .apply-filters span').length == 0){
										$('.GPC0007 .apply-filters a.link-text').removeClass('active');
									}

									if($('.GPC0026 .apply-filters span').length == 0){
										$('.GPC0026 .apply-filters a.link-text').removeClass('active');
									}
								}
								// LGEGMC-526, LGEGMC-1183 End
							}
							if(plp2.el.form.viewAll) plp2.el.form.viewAll.value = '';
							pageHistory.removeHistory();
							filter2.loadPLP();
							if($('.eprivacy-tooltip').length>0){
								$("#modal_cookie_set").hide();
								$('.page-cookie-view').unwrap();
								$("#modal_cookie_set").removeClass('page-cookie-view');
							}
						} else {
							ePrivacyCookies.view('click');
							if($(this).prop('checked')) {
								$(this).prop('checked', false);
							}
						}
					}
				}, 'input, .slider-range');
				$(filter2.el).on({
					reset: filter2.reset
				});
				$('.GPC0007 .apply-filters .link-text').on('click',function(e){
					e.preventDefault();
					$(filter2.el).find('.etc-box button[type="reset"]').trigger('click');
				});
				// LGEGMC-526
				$('.GPC0026 .apply-filters .link-text').on('click',function(e){
					e.preventDefault();
					$(filter2.el).find('.etc-box button[type="reset"]').trigger('click');
				});
				// LGEGMC-526 End
				// PJTPROCOM-3
				// PJTPROCOM-3 End
			}
		};
	
		plp2 = {
				el: {
					list: document.getElementById('resultCurProductList'),
					scrollTarget: document.getElementById('resultCurAppendTarget'),
					form: document.getElementById('categoryCurFilterForm'),
				},
				init: function(){
					var _this = plp2;
					plp2.addEvent();
					_this.mediaBranch(window.matchMedia('(max-width: 1069px)'));

					_this.addAriaDescribedby();
				},
				addAriaDescribedby: function(){
					var _this = plp2;
					var waNumber = 0;
					$(_this.el.list).find('.list-box .item').each(function() {
						var $target;
						if($(this).find('.model-name a') && !$(this).find('.model-name a').is(':empty')) {
							$target = $(this).find('.model-name a');
						}
						if($target) {
							$target.attr('id', 'wa_PLP_'+waNumber);
							$(this).find('a.btn').attr('aria-describedby', 'wa_PLP_'+waNumber);
							$(this).find('a.js-compare').attr('aria-describedby', 'wa_PLP_'+waNumber).attr('role', 'button');
							waNumber++;
						}
					});
				},
				mediaBranch: function(e, rebuild) {
					if($('.promotion-box').length>0) {
						var _this = plp2;
						var l = _this.el.list.querySelectorAll('.promotion-box');
						var leng = filter2.el.querySelectorAll('.option-box').length;
						
						leng = leng > 0 ? 3 : 4;

						if (e.matches) { // mobile;
							for (var i = 0; i < l.length; i++) {
								var _l = l[i];
								if(2 >= _l.querySelectorAll('.list-box li').length) {
									$(_l).addClass('js-open');
								}else {
									$(_l).removeClass('js-open');
								}
							}
						} else { 
							for (var j = 0; j < l.length; j++) {
								var _lj = l[j];
								if(leng >= _lj.querySelectorAll('.list-box li').length) {
									$(_lj).addClass('js-open');
								}else {
									$(_lj).removeClass('js-open');
								}
							}
						}
					}
				},
				addEvent: function(){
					var _this = this;
					$(plp2.el.list).on({
						click: function(e){
							e.preventDefault();
							if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')  ||COUNTRY_CODE.toLowerCase()=='uk') {
								var page;
								if($(e.currentTarget).closest('.expander')[0]) { // lead more button
									page = e.currentTarget.value;
									$(plp2.el.form).data('focus', true);
								}else { // general page button
									page = $(e.currentTarget).is('a') ? e.currentTarget.getAttribute('href') : e.currentTarget.value;

									var pagePosition = "";
									if($(e.currentTarget).is(".prev")) {
										pagePosition = "L";
									}else if($(e.currentTarget).is(".next")){
										pagePosition = "R";
									}
									plp2.el.form.pagePosition.value = pagePosition;

									$('html, body').animate({
										scrollTop: $(plp2.el.list).offset().top
									}, 500);
									$(plp2.el.form).data('focus', false);
								}

								// multi-promotion view all button (multi-promotion page does not have a pagination)
								if($('.promotion-wrapper .list-more').length > 0) {
									// trigger all of view-all button click event
									$('.promotion-wrapper .list-more a:visible').trigger('click', [true]);
								// general view all button
								}else {
									if($(e.currentTarget).is('.view-all')) {
										if(plp2.el.form.viewAll) plp2.el.form.viewAll.value = "Y";
										plp2.el.form.length.disabled = true;
										plp2.el.form.page.value = 'viewAll';
									}else {
										//if(plp.el.form.viewAll) plp.el.form.viewAll.value = "N";
										plp2.el.form.length.disabled = false;
										plp2.el.form.page.value = page;
									}
									$(plp2.el.form).submit();
									//filter.loadPLP(); XXX

									// 20200421 START 박지영 - view all 클릭시 읽어주도록 수정
									// WA
									if($(e.currentTarget).is('.view-all')) {
										var viewAllMsg = $('.view-all').siblings('.msg-sort').text() || 'All products are shown.';
										$('.view-all').siblings('.msg-sort').text(viewAllMsg);
									}
									// 20200421 END
								}

								if($(e.currentTarget).is('.view-all')) {
									pageHistory.setHistory('view-all');
								} else if($(e.currentTarget).is('.pagination a') || $(e.currentTarget).is('.pagination button')) {
									pageHistory.setHistory();
								}
								if($('.eprivacy-tooltip').length>0){
									$("#modal_cookie_set").hide();
									$('.page-cookie-view').unwrap();
									$("#modal_cookie_set").removeClass('page-cookie-view');
								}
								
								if($('.visual').hasClass('hasThumbnail')){
									setTimeout(function(){
										$('.visual').addClass('hasThumbnail');
									}, 300);
								}
							} else {
								ePrivacyCookies.view('click');
							}
						}
					}, '.pagination a, .pagination button, a.view-all, .expander button');
					$(plp2.el.list).on({
						change: function(e){
							if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS') ||COUNTRY_CODE.toLowerCase()=='uk') {
								var _this = e.currentTarget;
								var sort = _this.options[_this.selectedIndex].value;
								var sortTxt = changeTitleFormat($(this).find('option').eq(_this.selectedIndex).text());
								plp2.el.form.sort.value = sort;
								plp2.el.form.page.value = 1;

								pageHistory.removeHistory();

								$(plp2.el.form).submit();
								//filter.loadPLP(); XXX
								$('html, body').animate({
									//scrollTop: $(plp.el.scrollTarget).offset().top
									//scrollTop: $(_this).offset().top
									//scrollTop: $(filter.el).offset().top
									scrollTop: $(plp2.el.scrollTarget).closest('.component').offset().top
								}, 500);
								/* 20191002 : LGEUS-12351 add  */ 
								if($(".GPC0007").length > 0){  
									$('.GPC0007 .filter-open-floating .float-sort-box .sort-select').find('select option[value="'+sort+'"]').prop("selected",true);  
								}  
								// 20200421 START 박지영 - sort by 클릭시 읽어주도록 수정
								// LGEGMC-526
								if($(".GPC0026").length > 0){
									$('.GPC0026 .filter-open-floating .float-sort-box .sort-select').find('select option[value="'+sort+'"]').prop("selected",true);
								}
								// LGEGMC-526 End
								// LGEGMC-526
								// LGEGMC-526 End
								// WA
								var sortMsg = $('#sortBy').siblings('.msg-sort').text().replace(/\*msg\*/g, sortTxt) || 'Results are sorted by '+sortTxt;
								$('#sortBy').siblings('.msg-sort').text(sortMsg);
								// 20200421 END

								/* //20191002 : LGEUS-12351 add */  
								adobeTrackEvent('product-list-sort', {sort_option : sortTxt, page_event : {product_sort : true}});
								if($('.eprivacy-tooltip').length>0){
									$("#modal_cookie_set").hide();
									$('.page-cookie-view').unwrap();
									$("#modal_cookie_set").removeClass('page-cookie-view');
								}
							} else {
								ePrivacyCookies.view('click');
							}
						}
					}, '#sortBy');

					// only multi promotion page
					$(plp2.el.list).on({
						// click: function(e){
						// 	var closest = $(e.currentTarget).closest('.promotion-box');
						// 	closest.addClass('open');
						// }
						click: filter2.viewAllPromotionPLP
					
					}, '.promotion-box .list-more a');
					
					
					window.matchMedia('(max-width: 1069px)').addListener(_this.mediaBranch);
				}
			};
	}

	if($("#categoryFilterForm").length > 0) {
		filter.init();
		plp.init();
	}
	
	// Use for PJTCUR-3
	if($("#result-box-aria").length > 0) {
		filter2.init();
		plp2.init();
	}
	

	//LGEGMC-177 
	//file download
	var fileDownload = function($link) {
		if($('form#formDown').length>0) $('form#formDown').remove();

		var fileBox = $link.closest('[data-file-download]');
		var flag = (fileBox.data('flag') || '').toUpperCase();
		var downtime = fileBox.data('downtime') || null;
		var opentime = fileBox.data('opentime') || null;

		if(flag=='Y') {
			// downtime error
			var $errorPop = $('#htmlOpenError');
			if($errorPop.length>0) {
				$errorPop.modal();
				$errorPop.find('.htmldowntime').text(downtime);
				$errorPop.find('.htmlopentime').text(opentime);
			} else {
				console.log('#htmlOpenError is required in HTML');
			}
		} else {

			var doc = $link.data('doc'),
				file = $link.data('file'),
				original = $link.data('original'),
				category = $link.data('category');

			var input = '<input type="hidden" id="DOC_ID" name="DOC_ID" value="' + doc +'" />';
			input += '<input type="hidden" id="ORIGINAL_NAME_b1_a1" name="ORIGINAL_NAME_b1_a1" value="' + original +'" />';
			input += '<input type="hidden" id="FILE_NAME" name="FILE_NAME" value="' + file +'" />';
			input += '<input type="hidden" id="TC" name="TC" value="DwnCmd" />';
			input += '<input type="hidden" id="GSRI_DOC" name="GSRI_DOC" value="GSRI" />'
			input += '<input type="hidden" id="SPEC_DOWNLOAD" name="SPEC_DOWNLOAD" value="N" />';
			
			/*LGEGMC-1035 start*/
            var openlocale="|AT|BE_FR|BG|CH_DE|CH_FR|CZ|DE|DK|EE|ES|FI|FR|GR|HR|HU|IT|LT|LV|NL|NO|PL|PT|RO|RS|SE|SK|UK|";
            var _target="_self";
            if((original.toLowerCase().indexOf('.pdf')>-1 || original.toLowerCase().indexOf('.bmp')>-1 || original.toLowerCase().indexOf('.jpg')>-1 || original.toLowerCase().indexOf('.jpeg')>-1||original.toLowerCase().indexOf('.png')>-1) && openlocale.indexOf("|"+COUNTRY_CODE.toUpperCase()+"|")>-1){
            	_target="_blank";
            }
            
			var form = $('<form />').attr({
				id: 'formDown',
				method: 'get',
				action: fileBox.data('action'),
				target: _target
			}).append(input);
			$('body').append(form);
			/*LGEGMC-1035 end*/
			$('#formDown').submit();
		}
	}
	
	//LGEGMC-383
	$(document).on('click','.GPC0007 .file-list a.link-text,.compare-product .file-list a.link-text, .GPC0026 .file-list a.link-text',function(e){
		e.preventDefault();
		fileDownload($(this));
	});
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
	
	/* LGEBE-4 : 20200605 add */
	var pdp_where = {
		wtbOfflineCategoryIds : document.querySelectorAll('input[name=wtbOfflineCategoryIds'),
		categoryId : document.querySelectorAll('input[name=categoryId'),
		aflag : false,
		init : function(){
			var self = this;
			if($(self.wtbOfflineCategoryIds).val() != undefined && $(self.wtbOfflineCategoryIds).val() != '' && $(self.wtbOfflineCategoryIds).val() != 'component-WtbOfflineCategory'){
				var offline = $(self.wtbOfflineCategoryIds).val().split(',');
				var category = $(self.categoryId).val();
				var $aTag = $('a[href$="#pdp_where"]');
				for(var i=0; i< offline.length; i++){
					if(category == offline[i]){
						self.aflag = true;
						break;
					}
				}
				if(self.aflag){
					for(var i=0; i<$aTag.length; i++){
					    var aTagHref = $aTag.eq(i).attr('href');
					    var url = aTagHref.substring(0, aTagHref.indexOf('#pdp_where'))+'#pdpOfflieWhere';
					    $aTag.eq(i).attr('href', url);
					}
				}
			}
		}
		
	}
	pdp_where.init();
	/*// LGEBE-4 : 20200605 add */
});
