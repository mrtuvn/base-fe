$(document).ready(function() {
	if(!document.querySelector('.GPC0022')) return false;
	var compareComponent = {
		$el: $('.GPC0022'),
		alert: document.getElementById('compare_alert'),
		cookieArray: null,
		maximum: null,
		url: null,
		// return markup
		compareLink : {
			productCompareURL: null,
			bundleCompareURL: null
		},
		compareBtn: null,
		markup: {
			blank: null,
			item: null
		},
		init: function(){
			this.markup.blank = compareComponent.$el.find('template.empty-item').clone().html();
			this.markup.item = compareComponent.$el.find('template.product-item').clone().html();
			compareComponent.$el.find('template.empty-item').remove();
			compareComponent.$el.find('template.product-item').remove();
			
			this.url = compareComponent.$el.attr('data-compare-url');
			this.maximum = compareComponent.$el.attr('data-type-plp').toUpperCase() == 'Y' ? 6 : 3;

			this.compareLink.productCompareURL = compareComponent.$el.find('.compare-control .button').data('product-compare');
			this.compareLink.bundleCompareURL = compareComponent.$el.find('.compare-control .button').data('bundle-compare');
			this.compareBtn = this.$el.find('.compare-control .btn-compare a.btn');

			this.slick.init();
			compareComponent.trigger.init();

			$('body').on({
				'initialized-plp': function(){
					if(document.querySelector('.js-compare')) {
						compareComponent.trigger.init();
					}
				}
			});
			$('body').on('click', '.go-compare-sticky', function(e) {
				e.preventDefault();
				compareComponent.$el.find('.compare-sticky-collspace button:visible').focus();
			});

			// LGECI-259 web accessibility
			// this.compareBtn.on('blur', function() {
			// 	compareComponent.$el.find('.compare-sticky-collspace button:visible').focus();
			// });
			// component-compareSticky 등록 여부에 따라 attr 노출
			if(compareComponent.$el.attr('aria-labelldby') == 'component-compareSticky')
				compareComponent.$el.removeAttr('aria-labelldby');
			// LGECI-259 End

		},
		getBizType: function($obj) {
			var bizType = ($('.navigation') && $('.navigation').hasClass('b2b')) ? 'B2B' : 'B2C';
			// for search result page
			if($('.search-contents-area').length>0 && $obj) {
				if($obj.closest('.business-product-list').length>0 || $obj.closest('.products-box').hasClass('b2b')) {
					bizType = 'B2B';
				} else {
					bizType = 'B2C';
				}
			}
			return bizType;
		},
		switcher: function(e){
			e.preventDefault();

			if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {

				var _this = e.currentTarget,
					status = $(_this).hasClass('added'),
					productId = _this.getAttribute('data-model-id'),
					url = compareComponent.url,
					param;
				$(_this).data('modelId', productId);
				param = encodeURI(xssfilter(jQuery.param($(_this).data())));
				var addTxt = $(_this).find('.add.sr-only').text();
				var removeTxt = $(_this).find('.remove.sr-only').text();

				if(!status) {
					// adobe
					adobeTrackEvent('add-to-compare', {
						products : [{sales_model_code : findSalesModel($(this)), model_name : findModelName($(this))}], /* LGEGMC-455 20200722 modify */
						page_event : {add_to_compare : true}
					});
					var maximum = compareComponent.maximum,
						cookie = getCookie(compareCookie.name),
						count;
					if(cookie) {
						cookie = cookie.indexOf('|') >= 0 ? cookie.split('|') : [cookie];
						count = cookie.length+1;
					}else {
						count = 1;
					}
					if(cookie && maximum < count){
						$(compareComponent.alert).find('.number').text(maximum);
						$(compareComponent.alert).find('.maximum').show().siblings().hide();
						$(compareComponent.alert).modal('show');
					}else {
						var attributeCategory = compareComponent.$el.attr('data-current-category');
						var bizType = compareComponent.getBizType($(_this));
						if(attributeCategory && attributeCategory != '') {
							param = param +"&currentCategory="+compareComponent.$el.attr('data-current-category');
						}
						param = param + "&bizType="+bizType;
						if(!cookie || (compareCookie.name=="LG5_CompareCart" && bizType=="B2C") || (compareCookie.name=="LG5_B2B_CompareCart" && bizType=="B2B")) {

							// 20200427 START 박지영 - search result에서 add to compare 클릭시 B2C/B2B 교차 오류 수정
							var needRemove = false;
							if(!cookie && ((compareCookie.name=="LG5_CompareCart" && bizType=="B2B") || (compareCookie.name=="LG5_B2B_CompareCart" && bizType=="B2C"))) {
								// 현재 해당하는 쿠키가 없고, 현재 페이지와 추가하려는 제품의 bizType이 같지 않은 경우에는 오류 방지를 위해 기존 제품을 삭제 함.
								needRemove = true;
							}
							// 20200427 END

							if(bizType=="B2C") compareCookie.name="LG5_CompareCart";
							else compareCookie.name="LG5_B2B_CompareCart";

							// 20200427 START 박지영 - search result에서 add to compare 클릭시 B2C/B2B 교차 오류 수정
							if(needRemove) removeCookie(compareCookie.name);
							// 20200427 END

							ajax.noCacheCall(url, param, 'json', function(d){
								if(d.result == true || d.status == "success") {
									var data;
									data = d.data[0].productList[0];

									//console.log(data.modelType.toUpperCase());
									var currentPLP = compareComponent.$el.attr('data-type-plp'),
										// PJTOBS 20200702 - O 타입 추가로 인한 변경 Start
										flag = data.modelType.toUpperCase() == "A" || data.modelType.toUpperCase() == "G" || data.modelType.toUpperCase() == "O" || (data.modelType.toUpperCase() == "B" && data.bundlePlpDisplayFlag.toUpperCase() == "Y");
										// PJTOBS 20200702 - O 타입 추가로 인한 변경 End
										flag = flag ? "Y" : "N";
									/*
									if(flag != currentPLP) {
										compareComponent.$el.attr('data-type-plp', flag);
										compareComponent.maximum = (flag == "Y" ? 6 : 3);
									}
									*/

									//if(d.data[0].categoryCheck) {
									if(flag == currentPLP) {
										// 20200317 START 이상현 - Sticky compare : console 제거.
										// console.log('switcher :', count);
										// console.log('bf', cookie);
										// 20200317 END

										compareComponent.slick.addItem(productId, data, d.data[0].productMessages);
										// 20200309 START 이상현 - Sticky Compare 접근성 수정 : compare cart에 담겨진 제품의 갯수를 스크린 리더가 컴포넌트 플로팅보다 먼저 읽어주도록 수정.
										compareComponent.slick.switchLayer(true, count);
										compareCookie.add(productId);
										
										// 20200317 START 이상현 - Sticky compare : console 제거.
										// console.log('af', getCookie(compareCookie.name));
										// 20200317 END

										// compareComponent.$el.find('.count').text(count);
										// 20200309 END

										// 20200319 START 이상현 - Sticky compare : 동일한 제품 동시 체크하도록 수정.
										// $(_this).addClass('added').attr('aria-label',removeTxt); // WA-Common-Compare
										$('a.js-compare[data-model-id='+ productId +']').addClass('added').attr('aria-label',removeTxt); // WA-Common-Compare
										// 20200319 END

										// set currentCategory
										var attributeCategory = compareComponent.$el.attr('data-current-category');
										if(!attributeCategory || attributeCategory == '') {
											compareComponent.$el.attr('data-current-category', data.categoryId);
										}

										// change url 
										if(flag="Y") {
											compareComponent.compareBtn.attr('href', compareComponent.compareLink.productCompareURL+'?bizType='+bizType);
										} else {
											compareComponent.compareBtn.attr('href', compareComponent.compareLink.bundleCompareURL+'?bizType='+bizType);
										}
									} else {
										$(compareComponent.alert).find('.clear-category').show().siblings().hide();
										$(compareComponent.alert).modal('show');
									}
								}else {
									// server error
									$(compareComponent.alert).find('.clear-category').show().siblings().hide();
									$(compareComponent.alert).modal('show');
								}
							}, null, 'body');
						} else {
							$(compareComponent.alert).find('.clear-category').show().siblings().hide();
							$(compareComponent.alert).modal('show');
						}
					}
				}else {
					compareComponent.remove(productId);
					$(_this).removeClass('added').attr('aria-label',addTxt); // WA-Common-Compare
				}

			} else {
				ePrivacyCookies.view('click');
			}

		},
		remove: function(productId){
			var cookie = getCookie(compareCookie.name),
				count;
			if(cookie) {
				cookie = cookie.indexOf('|') >= 0 ? cookie.split('|') : [cookie];
				count = cookie.length-1;
			}else {
				count = 0;
			}
			compareComponent.slick.removeItem(productId);
			compareCookie.remove(productId);
			// 20200317 START 이상현 - Sticky compare : console 제거.
			// console.log('remove after floating false', count)
			// 20200317 END
			compareComponent.$el.find('.count').text(count);
			
			if(count == 0) {
				compareComponent.$el.removeAttr('data-current-category');
			}
		},
		// compare Sticky bottom layer
		slick: {
			$slideTarget: null,
			opt: {
				infinite: false,
				slidesToShow: 3,
				slidesToScroll: 1,
				arrows: true,
				dots: false,
				responsive: [
					{
						breakpoint: 992,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 1
						}
					},
					{
						breakpoint: 768,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 1,
							arrows: false
						}
					}
				]
			},
			init: function(){
				var _this = compareComponent.slick,
					$el = compareComponent.$el;

				_this.$slideTarget = $el.find('.compare-product');

				// cookie product list setting
				var list = getCookie(compareCookie.name);
				if(list) {
					_this.getCookieProducts(list);
				}

				// slick init
				_this.$slideTarget.slick(_this.opt);

				mql.maxMd.addListener(_this.branch);
				_this.setMobileDisabled(); // change desktop and mobile item count

				// remove button
				_this.$slideTarget.on({
					click: function(e){
						var id = $(e.currentTarget).closest('.item').attr('data-model-id');
						compareComponent.remove(id);
					}
				}, '.close');

				// clear button
				$el.on({
					click: function(e){
						_this.$slideTarget.slick('unslick');
						_this.$slideTarget.html('');

						var html = [];
						for (var i = 0; i < 3; i++) {
							html += compareComponent.markup.blank;
						}
						_this.$slideTarget.html(html);
						_this.$slideTarget.slick(_this.opt);
						compareCookie.remove();
						$('.js-compare').removeClass('added');
						$('.js-compare').each(function(){
							var addTxt = $(this).find('.add.sr-only').text();
							$(this).attr('aria-label',addTxt); // WA-Common-Compare
						});
						// 20200309 START 이상현 - Sticky Compare 접근성 수정 : compare cart에 담겨진 제품의 갯수를 스크린 리더가 컴포넌트 플로팅보다 먼저 읽어주도록 수정.
						// $el.find('.count').text(0);
						compareComponent.$el.removeAttr('data-current-category');
						_this.switchLayer(false, 0);
						// 20200309 END
					}
				}, '.clear');
			},
			getCookieProducts: function(list){
				var url = compareComponent.$el.attr('data-compare-list'),
					bizType = compareComponent.getBizType(),
					param = compareComponent.$el.attr('data-name') + "=" + encodeURI(list)+"&bizType="+bizType;

				ajax.noCacheCall(url, param, 'json', function(d){
					if(d && d.data != null) {
						//for (var i = 0; i < d.data[0].productList.length; i++) {
						for (var i = (d.data[0].productList.length)-1; i>=0; i--) {
							var product = d.data[0].productList[i];
							compareComponent.slick.addItem(product.modelId, product, d.data[0].productMessages);
						}
						if(d.data[0].productList[0]){
							var currentCategory = d.data[0].productList[0].categoryId;
							compareComponent.$el.attr('data-current-category', currentCategory);
							// 20200309 START 이상현 - Sticky Compare 접근성 수정 : compare cart에 담겨진 제품의 갯수를 스크린 리더가 컴포넌트 플로팅보다 먼저 읽어주도록 수정.
							// compareComponent.$el.find('.count').text(d.data[0].productList.length);
							compareComponent.slick.switchLayer(true, d.data[0].productList.length);
							// 20200309 END 
							var info = d.data[0].productList[0],
								// PJTOBS 20200702 - O 타입 추가로 인한 변경 Start
								isPLP = info.modelType.toUpperCase() == "A" || info.modelType.toUpperCase() == "G" || info.modelType.toUpperCase() == "O" || (info.modelType.toUpperCase() == "B" && info.bundlePlpDisplayFlag.toUpperCase() == "Y");
								// PJTOBS 20200702 - O 타입 추가로 인한 변경 End
							isPLP = isPLP ? "Y" : "N";
							compareComponent.$el.attr('data-type-plp', isPLP);
							// compareComponent.$el.attr('data-type-plp');

							if(isPLP="Y") {
								compareComponent.compareBtn.attr('href', compareComponent.compareLink.productCompareURL+'?bizType='+bizType);
							} else {
								compareComponent.compareBtn.attr('href', compareComponent.compareLink.bundleCompareURL+'?bizType='+bizType);
							}
						}
					}
					
				});
			},
			setMobileDisabled: function(){
				var _this = compareComponent.slick;
				var $thirdItem = _this.$slideTarget.find('.item:eq(2)');
				if($thirdItem.is('.no-item')) {
					$thirdItem.addClass('mobile-disable');
				}
				_this.branch(mql.maxMd);
			},
			branch: function(e){
				var _this = compareComponent.slick;
				if (e.matches) { // mobile
					_this.$slideTarget.slick('slickFilter',':not(.mobile-disable)');
				}else {
					_this.$slideTarget.slick('slickUnfilter');
				}
			},
			setBlank: function(){
				var _this = compareComponent.slick,
					count = _this.$slideTarget.find('.product').length,
					html = [],
					loop = 0;

				var blank = _this.$slideTarget.find('.no-item');
				if(blank[0]) {
					for (var i = 0; i < blank.length; i++) {
						var idx = _this.$slideTarget.slick("getSlick").slideCount - 1;
						_this.$slideTarget.slick('slickRemove', idx);
					}
				}
				if(count<3) {
					loop = (3 - count);
					for (var j = 0; j < loop; j++) {
						_this.$slideTarget.slick('slickAdd', compareComponent.markup.blank);
					}
				}

				_this.setMobileDisabled();
			},
			// add product item
			addItem: function(productId, data, productMessages){
				var _this = compareComponent.slick,
					markup = compareComponent.markup.item;
				markup = markup.replace(/\*modelId\*/g, productId)
							// 20200325 START 박지영 - ufn 따옴표 처리
							// 20200512 START 박지영 - ufn null 처리
							.replace(/\*userFriendlyName\*/g, data.userFriendlyName == null ? '' : data.userFriendlyName.replace(/\"/g, "''"))
							// 20200512 END
							// 20200325 END
							.replace(/\*mediumImageAddr\*/g, data.mediumImageAddr)
							.replace(/\*imageAltText\*/g, (data.imageAltText != null) ? data.imageAltText : '')
							.replace(/\*modelUrlPath\*/g, data.modelUrlPath)
							.replace(/\*discountedRate\*/g, data.discountedRate)
							// 20200316 START 박지영 : price format 함수 적용
							.replace(/\*rPrice\*\.\*rPriceCent\*/g, data.rPrice ? changeFormatFullPrice(data.rPrice, data.rPriceCent) : 'null')
							// 20200421 START 박지영 : 오타 수정
							.replace(/\*rPromoPrice\*\.\*rPromoPriceCent\*/g, data.rPromoPrice ? changeFormatFullPrice(data.rPromoPrice, data.rPromoPriceCent) : 'null')
							// 20200421 END
							// 20200316 END
							.replace(/\*rPrice\*/g, data.rPrice ? changeFormatPrice(data.rPrice) : 'null')
							.replace(/\*rPromoPrice\*/g, data.rPromoPrice ? changeFormatPrice(data.rPromoPrice) : 'null')
							// LGEGMC-1518
							.replace(/,\*rPriceCent\*/g, data.rPriceCent ? ','+(data.rPriceCent) : '')
							.replace(/,\*rPromoPriceCent\*/g, data.rPromoPriceCent ? ','+(data.rPromoPriceCent) : '')
							// LGEGMC-1518
							// 20200325 START 박지영 : price format 수정
							.replace(/\*rPriceCent\*/g, data.rPriceCent ? (data.rPriceCent) : 'null')
							.replace(/\*rPromoPriceCent\*/g, data.rPromoPriceCent ? (data.rPromoPriceCent) : 'null')
							// 20200325 END
							.replace(/\*discountMsg\*/g, data.discountMsg == null ? '' : data.discountMsg.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>'))		// LGEIS-229 change how discounts are shown
							.replace(/\*retailerPricingText\*/g, data.retailerPricingText);

				// price setting
				var $template = $(markup);
				
				var $prices = $template.find('.price-area');
				if(data.modelStatusCode=='DISCONTINUED') {
					$prices.filter('.rPrice').html("");
					$prices.filter('.rPromoPrice').remove();
					$prices.filter('.retailer').remove();
				} else if(data.retailerPricingFlag=="Y") {
					$prices.filter('.rPrice').remove();
					$prices.filter('.rPromoPrice').remove();
				}else {
					if((data.rPromoPrice && data.rPromoPrice != null) && (data.rPrice && data.rPrice != null)) {
						$prices.filter('.rPrice').remove();
						$prices.filter('.retailer').remove();
					}else if(data.rPrice && data.rPrice != null){
						$prices.filter('.rPromoPrice').remove();
						$prices.filter('.retailer').remove();
					}else {
						$prices.filter('.rPrice').html("");
						$prices.filter('.rPromoPrice').remove();
						$prices.filter('.retailer').remove();
					}
				}
				// PJTOBS-32 Start
				if(data.vipPriceFlag=='Y') {
					$prices.find('.product-price').remove();
					$prices.append('<div class="product-price vip"><div class="vip-price"><span class="name">'+productMessages.vipPriceMessage+'</span></div></div>');
				}
				// PJTOBS-32 End

				if($template.find('.model-name a').text() == 'null') {
					$template.find('.model-name a').empty();
				}

				markup = $template.get(0).outerHTML;

				_this.$slideTarget.slick('slickAdd', markup, 0, true);
				_this.setBlank();

				// 20200317 START 이상현 - Sticky compare : console 제거.
				// console.log(compareComponent.$el.attr('class'));
				// 20200317 END
				
				// 20200309 START 이상현 - Sticky Compare 접근성 수정 : compare cart에 담겨진 제품의 갯수를 스크린 리더가 컴포넌트 플로팅보다 먼저 읽어주도록 수정.
				// if(!compareComponent.$el.hasClass('active')) {
				// 	_this.switchLayer(true);
				// }
				// 20200309 END
			},
			removeItem: function(id){
				var _this = compareComponent.slick,
					idx = $('.item[data-model-id="'+id+'"]').index(),
					$trigger = $('.js-compare[data-model-id="'+id+'"]');
				_this.$slideTarget.slick('slickRemove', idx);
				_this.setBlank();
				// WA-ETC-004
				if($trigger.length==1) {
					$trigger.removeClass('added').attr('aria-label',$trigger.find('.add.sr-only').text()); // WA-Common-Compare
				} else {
					$trigger.each(function(idx) {
						$trigger.eq(idx).removeClass('added').attr('aria-label',$trigger.eq(idx).find('.add.sr-only').text()); // WA-Common-Compare
					});
				}
				if(_this.$slideTarget.find('.product').length == 0) {
					// 20200309 START 이상현 - Sticky Compare 접근성 수정 : compare cart에 담겨진 제품의 갯수를 스크린 리더가 컴포넌트 플로팅보다 먼저 읽어주도록 수정.
					
					// 20200319 START 이상현 - Sticky compare : 이전 이관 시 코드 주석 처리 오류.
					_this.switchLayer(false);
					// 20200319 END

					// 20200309 END
				}
			},
			// 20200309 START 이상현 - Sticky Compare 접근성 수정 : compare cart에 담겨진 제품의 갯수를 스크린 리더가 컴포넌트 플로팅보다 먼저 읽어주도록 수정.
			switchLayer: function(open, count){
				var _this = compareComponent.slick;
				if(open) {
					compareComponent.$el.addClass('active');
					setTimeout(function(){
						_this.$slideTarget.slick('setPosition');

					compareComponent.$el.find('.compare-sticky-collspace .open').on('click',function(){
						compareComponent.$el.find('.compare-sticky-collspace .open').removeClass('active');
						compareComponent.$el.find('.compare-sticky-collspace .close').addClass('active');
						compareComponent.$el.removeClass('compare-min');
						$('body').removeClass('compare-sticky-min');
						compareComponent.$el.find('.compare-sticky-collspace button:visible').focus();
					});
					compareComponent.$el.find('.compare-sticky-collspace .close').on('click',function(){
						compareComponent.$el.find('.compare-sticky-collspace .open').addClass('active');
						compareComponent.$el.find('.compare-sticky-collspace .close').removeClass('active');
						compareComponent.$el.addClass('compare-min');
						$('body').addClass('compare-sticky-min');
						compareComponent.$el.find('.compare-sticky-collspace button:visible').focus();
					});
						compareComponent.$el.addClass('showing');
						$('body').addClass('compare-sticky-showing');

						// count
						// 20200317 START 이상현 - Sticky compare : console 제거.
						// console.log(count);
						// 20200317 END
						if(typeof count === 'number' && count !== NaN){
							compareComponent.$el.find('.count').text(count);
						}
					}, 50);
				}else {
					compareComponent.$el.removeClass('showing');
					$('body').removeClass('compare-sticky-showing');
					compareComponent.$el.off('transitionend webkitTransitionEnd oTransitionEnd').on({
						'transitionend webkitTransitionEnd oTransitionEnd': function(){
							if(!compareComponent.$el.hasClass('showing')) {
								compareComponent.$el.removeClass('active');
								$('body').removeClass('compare-sticky-showing');
								$('body').removeClass('compare-sticky-min');
							}
						}
					});
				}
			}
			// 20200309 END 
		},
		// add(or remove) to compare button
		trigger: {
			init: function(){
				$('body').off('click.jsCompare').on({
					'click.jsCompare': compareComponent.switcher
				}, '.js-compare');

				var cookie = getCookie(compareCookie.name);
				if(cookie) {
					cookie = cookie.indexOf('|') >= 0 ? cookie.split('|') : [cookie];
					for (var i = 0; i < cookie.length; i++) {
						// 20200311 START 박지영 : PDP summary 에서 add to compare 버튼 모바일 화면에서 초기화 안되는 버그 수정
						// * US도 반영 필요 *
						var _addedItem = document.querySelectorAll('.js-compare[data-model-id="'+cookie[i]+'"]');
						$(_addedItem).addClass('added');
						// 20200311 END
					}
				}
				// button aria-label & text setting
				$('.js-compare').each(function(){
					var addTxt;
					if($(this).is('.added')) {
						addTxt = $(this).find('.remove.sr-only').text();
					}else {
						addTxt = $(this).find('.add.sr-only').text();
					}
					$(this).attr('aria-label',addTxt); // WA-Common-Compare
				});
			}
		},
		cookie: null
	};

	compareComponent.init();
});
