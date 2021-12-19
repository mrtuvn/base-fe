$(document).ready(function() {
	if(!document.querySelector('.animation-box')) return false;

	var ani = {
		el: document.querySelectorAll('.animation-box'),
		init: function(){
			ani.addEvent();
		},
		videoEvent : function(e){
			var video = e.currentTarget,
				$ctrl = $(video).siblings('.controller-wrap');
			if(e.type == 'ended' || e.type == 'pause') {
				$ctrl.find('.play').addClass('active').siblings().removeClass('active');
			}else if(e.type == 'play' || e.type == 'playing') {
				$ctrl.find('.pause').addClass('active').siblings().removeClass('active');
			}
		},
		addEvent: function(){
			var anibox = ani.el;
			$(anibox).each(function() {
				var target = $(this).get(0);
				if($(this).closest('.carousel-wrap').length>0) {
					target = $(this).closest('.carousel-wrap');
				}
				/*
				if(document.querySelectorAll('.carousel-wrap')[0]) {
					target = document.querySelectorAll('.carousel-wrap');
				}*/
				// 20200311 START 이상현 - FR-WA 요청 : animation stop/play 키보드 제어 시 focus 유지
				$(target).on({
					click: function(e){
						e.preventDefault();
						var button = e.currentTarget;
						var box = $(button).closest('.animation-box').find('video:visible')[0];
						if(button.name == 'pause') {
							box.pause();
						}else if (button.name == 'play') {
							box.play();
						}
						setTimeout(function(){
							$(button.parentElement).find('button:visible').focus();
						});
					}
				}, '.controller-wrap button');
				// 20200311 END
				$(target).find('video').on({
					'play playing pause ended': ani.videoEvent
				});
				if(target != ani.el){
					$(target).on({
						'init': function(){
							$(target).find('video').on({
								'play playing pause ended': ani.videoEvent
							});
						}
					});
				}
			});
		}
	};
	ani.init();
});