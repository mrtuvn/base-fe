$(document).ready(function() {
	if(!document.querySelector('.GPC0055')) return false;
	$(".GPC0055").find('picture source').remove();
    $(".GPC0055").find('.inside-component .component-wrap').wrap('<div class="inside-inner"></div>');
	var component55 = {
		$el : $('.GPC0055'),
		init : function() {
			this.$el.find('.carousel-wrap.type-hero').each(function() {
				if($(this).find('.carousel-box').length>1) {
					component55.runSlick($(this));
				} else {
					$(this).addClass('active');
				}
			});
			this.$el.find('.carousel-wrap.type-etc').each(function() {
				$(this).addClass('active');
			});
			/* LGEGMC-324 20200715 add */
			this.$el.find('.carousel-wrap').each(function() {
				var $target = $(this).find('video:visible[autoplay][muted]');
				if ($target.length) {
					setTimeout(function(){
						var targetVideo = $target[0];
						(targetVideo.paused && targetVideo.muted) && targetVideo.play();
					},300);
				}
				
			});
			/* //LGEGMC-324 20200715 add */
			this.addAriaDescribedby();
			/* LGEGMC-1528 : 20210423 add */ 
			this.clickEvt(); 
			/*// LGEGMC-1528 : 20210423 add */ 
		},
		runSlick: function($obj) {
			var fontColor = 'black';
			if($obj.find('.carousel-box').eq(0).hasClass('text-white')) {
				fontColor = 'white';
			}
			/* LGEBR-167 20201116 add */
			var playSpeed = 8000,
					componentThis = $obj.closest('.GPC0055'),
					dataSpeed = componentThis.attr('data-play-speed'); // At the moment of request >> when before 'runslick' event
			if(ISMAIN && dataSpeed != 'component-playSpeed'){ 
				// filtering > main 0055 banner + already add msg
				playSpeed = dataSpeed;
			}else{
				componentThis.removeAttr('data-play-speed');
			}
			/* //LGEBR-167 20201116 add */

			/* LGEIN-554, LGEBR-751 Start */
			var countryCode = $('html').data('countrycode'),
				slideDirLtr = countryCode == 'in' || countryCode == 'br' ? true : false;
			/* //LGEIN-554, LGEBR-751 End */
			$obj.slick({
				infinite: slideDirLtr, // WA-GPC0055-01, LGEIN-554
				listStyle: true, // WA-GPC0055-01
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows : true,
				dots: true,
				//adaptiveHeight: true,
				// lazyLoad: 'ondemand',
				autoplay: false, //LGEITF-424
				autoplaySpeed: playSpeed, // LGEBR-167
				prevArrow: carouselOptions.bigAnglePrev, // common.js variable
				nextArrow: carouselOptions.bigAngleNext, // common.js variable
				//appendDots:$obj.find('.slick-indicator .slick-dot-wrap')
				appendDots:$obj.siblings().find('.slick-dot-wrap')
			});
			$obj.addClass('active');

			$obj.addClass('slick-'+fontColor);
			$obj.on('beforeChange', function(event, slick, currentSlide, nextSlide){
				$obj.find('.carousel-box[data-slick-index='+nextSlide+'] .visual-area img[data-src]').addClass('lazyload');
			});
			$obj.on('afterChange', function(event, slick, currentSlide){
				if($obj.find('.slick-current').hasClass('text-white')) {
					fontColor = 'white';
				} else {
					fontColor = 'black';
				}
				$obj.removeClass('slick-white').removeClass('slick-black').addClass('slick-'+fontColor);
			});
			$obj.siblings().find('.slide-pause').addClass('active').on('click',function(e){
				e.preventDefault();
				if ($(this).hasClass('pause')) {
					$(this).removeClass('pause').addClass('play');
					$(this).text($(this).attr('data-title-play'));
					$obj.slick('slickPause');
				} else {
					$(this).removeClass('play').addClass('pause');
					$(this).text($(this).attr('data-title-stop'));
					$obj.slick('slickPlay');
				}
			});
			//LGEITF-424 s
			setTimeout(function(){
				$obj.slick('slickPlay');
			}, 8000);
			//LGEITF-424 e
			// $obj.find('.slide-pause').trigger('click');
		},
		addAriaDescribedby: function(){
			var _this = component55;
			var waNumber = 0;
			$(_this.$el).find('.text-area').each(function() {
				var $target;
				if($(this).find('.title') && !$(this).find('.title').is(':empty')) {
					$target = $(this).find('.title');
				}
				if($target) {
					$target.attr('id', 'waGPC0055_'+waNumber);
					$(this).find('a.btn').attr('aria-describedby', 'waGPC0055_'+waNumber);
					$(this).find('a.link-text').attr('aria-describedby', 'waGPC0055_'+waNumber);
					waNumber++;
				}
			});
		},
		/* LGEGMC-1528 : 20210423 add */ 
		clickEvt : function(){ 
			var _this = component55; 
			$(_this.$el).find('.type-hero .cta a').off('click').on('click', function(e){ 
				var $btn = $(this); 
				adobeTrackEvent('hero_click', { 
					hero_key_subject : $btn.parents('.cta').siblings('.text-block').find('.title').text(), //hero 제목 ​
					hero_key_order : $btn.parents('li.carousel-box').data('slick-index') + 1, //hero 순번 ​
					//hero_key_upload_date : "20210125", //hero 업로드된 날짜 ​
					hero_key_btn_order : $btn.parent('span').index() + 1, //hero 내 버튼 순번 ​
					hero_key_btn_title : $btn.text(),  // btn 타이틀 ​
					page_event : { 
						hero_click : true 
					} 
				}); 
			}) 
		} 
		/*// LGEGMC-1528 : 20210423 add */ 
	};
	component55.init();
	
	$('.GPC0055').each(function(){
		var $iconblock = $(this).find('.GPC0088');
		if ($iconblock.length) {
			var componentCarouselSimple = {
				$el : null,
				init : function() {
					this.$el = $iconblock;
					this.$el.find('.spec-list').not('.none-slide').not('.slick-initialized').each(function(){
						if($(this).find('.item').length>1) {
							componentCarouselSimple.runSlick($(this));
							$(this).parents('.GPC0088').addClass('bindSlick');
						}
					});
					this.$el.find('.spec-list.none-slide').each(function(){
                        if($(this).find('.item').length>2) {
                            $(this).removeClass('none-slide');
                            componentCarouselSimple.runSlick($(this));
                            $(this).parents('.GPC0088').addClass('bindSlick');
                        } else{
                            $(this).addClass('none-slide');
                        }
                    });
				},
				runSlick: function($obj) {
					$obj.slick({
						appendDots:$obj.siblings('.slick-indicator').find('.slick-dot-wrap'),
						responsive: [
							{
								breakpoint: 9999,
								settings: 'unslick'
							},
							{
								breakpoint: 767,
								settings: {
									infinite: false,
									slidesToShow: 1,
									slidesToScroll: 1,
									arrows : false,
									dots: true,
								}
							}
						]
					});
					$obj.on('afterChange', function(event, slick, currentSlide){
						//console.log('..');
					});
					$obj.on('breakpoint', function(event, slick, breakpoint) {
						// console.log('breakpoint ' +  breakpoint);
						if( breakpoint === 767 ) {
							eventStopOn();
						}
						if ( breakpoint === 9999 ) {
							$obj.off('mousedown.stop touchstart.stop');
						}
					});
					$(window).on('resize',function(){
						$obj.slick('resize');
						if( ! mql.maxSm.matches) {
							$obj.find('.item').removeAttr('role id tabindex aria-describedby aria-hidden');
						}
					}).resize();
					function eventStopOn() {
						$obj.on('mousedown.stop touchstart.stop', function (e) {
							e.stopPropagation();
						});
					}
					if( mql.maxSm.matches) {
						eventStopOn();
					}
				}
			};
			componentCarouselSimple.init();
		}
	});
	function textAreaPosition() {
		component55.$el.each(function(){
			var $carouselBox = $(this).find('.carousel-box').not('.slick-slide');
			$carouselBox.each(function(){
				var $carouselBox = $(this);
				var $conArea = $carouselBox.find('.contents-area');
				var $visualArea = $carouselBox.find('.visual-area');
				var $textAreaL = $carouselBox.find('.text-area.align-left');
				var $textAreaR = $carouselBox.find('.text-area.align-right');
				var $textArea = $carouselBox.find('.text-area');
				var $mobileTop = $textArea.is('.align-mobile-top');
				if ( $carouselBox.parents('.carousel-wrap').is('.type-hero') ){
					return false;
				}
				if( $textAreaL.length || $textAreaR.length ) {
					if( mql.minMd.matches ) {
						var $textAreaClone = $textArea.clone(true, true);
						$textArea.remove();
						$conArea.prepend($textAreaClone);
						var $con = $conArea.detach();
						$carouselBox.append($con);
						//console.log('pc');
					}
					if ( mql.maxSm.matches ) {
						var $textAreaClone = $textArea.clone(true, true);
						$textArea.remove();
						if ( $mobileTop ){
							$carouselBox.prepend($textAreaClone);
						} else {
							$carouselBox.append($textAreaClone);
						}
						var $con = $conArea.detach();
						$visualArea.append($con);
						//console.log('mobile');
					}
				}
			});
		});
	}
	$(window).on('load resize',textAreaPosition).trigger('resize');	
	/* LGEPA-508 Start */
	function countDownTimer() {
		if(!document.querySelector('.countdown-box')) return false;
		$(document).find('.countdown-box .count-timer-box').each(function() {
			var $count_target = $(this);
			var $countdate = $count_target.data('countdown-date');
			$count_target.countdown({
				labels: ['Years', 'Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'], 
				labels1: ['Years', 'Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'], 
				until: new Date($countdate),
				//timezone: +9, // seoul 기준
				format: 'DHMS',
				padZeroes: true, // 00 표시
			});
		});

	}
	setTimeout(function(){
		countDownTimer();
	}, 2000);
	/* LGEPA-508 End */
});
