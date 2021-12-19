var thumbnailLoop;
$(document).ready(function() {
	// 초기 로드 되는 페이지에는 js-thumbnail-loop이 없더라도,
	// filter나 plp-model-switcher.js에 의해 발생할 수 있기 때문에 
	// 아래 1줄은 제거 함.
	//if(!document.querySelector('.js-thumbnail-loop')) return false;

	thumbnailLoop = {
		// 데스크탑용 스크립트는 제품 이미지가 들어가는 모든 화면에서 사용 가능함.
		// 데스크탑용 스크립트는 필터 및 페이징 등 ajax 호출 후 다시 실행하지 않아도 됨. 
		// GPC0003, GPC0004, GPC0007 GPC0026, myLG>My Products 
		// search result, search result all
		desktopList: '#resultProductList, .products-list-wrap, #resultAppendTarget, .search-result-products-wrap, .product-list-box, .business-product-list, .products-list-group, .products-list-group2, .products-box',
		// 모바일용 스크립트는 Carousel 하위에 Carousel을 생성할 수 없기 때문에, 사용 대상이 좀더 명확 해야 함.
		// 모바일용 스크립트는 필터 및 페이징 등 ajax 호출 후 다시 실행 해야 함.
		// 따라서 아래 mobileList는 ajax 호출시 변경되는 id값으로 넣고, 
		// 호출 후 .visual안에 있는 .thumbnail-carousel를 제거하고, .trigger('thumbnailCarousel'); 실행 할 것.
		// 또한, 해당 스크립트가 추가될 .visual에는 position:relative;을 추가해 주어야 함.
		// GPC0007 (.GPC0007 #resultAppendTarget),
		// GPC0026 (.GPC0026 #resultAppendTarget),
		// myLG>My Products(.accessories-product #resultAppendTarget), 
		// search result all - consumer (.search-result-view-all .product-list-box)
		// search result all - business (.search-result-view-all .business-product-list)
		// search result all (1 product) (.search-result-view-all .products-box)
		// search result - consumer (.search-result-products-wrap)
		// search result - business (.search-result-business-products-wrap)
		mobileList: '.GPC0007 #resultAppendTarget, .GPC0026 #resultAppendTarget, .accessories-product #resultAppendTarget, .search-result-view-all .product-list-box, .search-result-view-all .business-product-list, .search-result-view-all .products-box, .search-result-products-wrap, .search-result-business-products-wrap',
		interval: null,
		idx: 1,
		loop:function(img, imgList){
			var src = imgList[thumbnailLoop.idx];
			if((imgList.length-1) > thumbnailLoop.idx){
				thumbnailLoop.idx++;
			}else {
				thumbnailLoop.idx = 1;
			}
			img.src = src;
		},
		hover: function(e){
			var _img = e.currentTarget,
				imgList = _img.getAttribute('data-img-list').split(',');
			clearInterval(thumbnailLoop.interval);
			if(imgList.length>1) {
				thumbnailLoop.interval = setInterval(function(){
					thumbnailLoop.loop(_img, imgList);
				}, 500);//LGEGMC-368 modify
			} else {
				//_img.src=imgList[0];
				_img.src=_img.getAttribute('data-src');
			}
		},
		blur: function(e){
			var _img = e.currentTarget,
				imgList = _img.getAttribute('data-img-list').split(',');
			clearInterval(thumbnailLoop.interval);
			thumbnailLoop.idx = 1;
			//_img.src = imgList[0];
			_img.src=_img.getAttribute('data-src');
		},
		init: function(){
			if($('.navigation').length>0 && $('.navigation').hasClass('mobile-device')) {
				this.addEventForMobile();
			} else {
				this.addEventForDesktop();
			}
		},
		addEventForDesktop: function(){
			var _this = this;
			$(_this.desktopList).on({
				'mouseenter focus': _this.hover,
				'mouseleave focusout': _this.blur
			}, '.js-thumbnail-loop');
		},
		addEventForMobile: function() {
			var _this = this;
			$(_this.mobileList).each(function() {
				$(this).on({
					'thumbnailCarousel': _this.mobileThumbnailCarousel
				});
				$(this).trigger('thumbnailCarousel');
			});
		},
		mobileThumbnailCarousel : function(e) {
			var targetEl = $(e.currentTarget);
			setTimeout(function() {
				var imgs = targetEl.find("img[data-img-list]");
				imgs.each(function() {
					thumbnailLoop.mobileThumbnailCarouselSingle($(this), false);
				});
			}, 600); // Don't reduce this number.
		},
		mobileThumbnailCarouselSingle : function($el, isModelSwitcher) {
			if($('.navigation').length==0 || !$('.navigation').hasClass('mobile-device')) {
				return false;
			}
			if($el.closest('.slick-slider').length>0 || $el.closest('.visual').length==0 || $el.closest('.visual').find('.thumbnail-carousel').length>0) {
				return false;
			}
			if(isModelSwitcher) {
				// When clicking 'siblings' in the product list,
				// check if the changed image is a child element of this.mobileList
				var tmpList = thumbnailLoop.mobileList.split(',');
				var isPassed = false;
				for(i=0;i<tmpList.length;i++) {
					if($el.parents($.trim(tmpList[i])).length > 0) {
						isPassed = true;
					}
				}
				if (!isPassed) {
					return false;
				}
			}
			var imgEl = $el.attr('data-img-list') ? $el.attr('data-img-list') : $el.siblings('img.pc').attr('data-img-list');
			var imgList = imgEl.split(',');
			if(imgList.length>1) {
				var defaultImg = $el.attr('data-src') ? $el.attr('data-src') : $el.attr('src');
				var html = '<div class="thumbnail-carousel"><div class="imglist"><img src="'+defaultImg+'" alt="" /></div>';
				var max = 5;
				if(defaultImg==imgList[0]) max = 6;
				var len = imgList.length<=max ? imgList.length : max;
				for(var i=0;i<len;i++) {
					if(defaultImg!=imgList[i]) {
						html += '<div class="imglist"><img src="'+imgList[i]+'" alt="" /></div>';
					}
				}
				html += '</div>';
				if ($el.closest('.visual').find('.thumbnail-carousel').length==0) {
					// append
					$('.visual').addClass('hasThumbnail');
					$el.closest('.visual').append(html).find('.thumbnail-carousel').slick({
						arrows: false,
						dots: true
					});
					if($('.btn-listChange').hasClass('act')){
						console.log('slick refresh');
						$('.thumbnail-carousel').slick('refresh');
					}
				} else{
					
				}
			}
		
		}
	};
	thumbnailLoop.init();
});
