var video;
$(document).ready(function() {
	var videoInterval;
	function setYoutubeJS() {
		var tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		//var firstScriptTag = document.getElementsByTagName('script')[0];
		//firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		$('body').append(tag);
	}
	if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
		setYoutubeJS();
	}

	var closeTxt = ($('.navigation').length>0 && $('.navigation').data('close-video')) ? $('.navigation').data('close-video') : 'Close Video';
	video = {
		originalFocus: null,
		cache: {
			$modal: null,
			id: null
		},
		
		/* LGEPL-136 : 20200914 modify */
		markup: {
			modal: [
				'<div class="video-modal video-box-closeset youtube"><div class="video-modal-background"></div><div class="modal-video-asset"><div class="video-asset">',
				'<div class="video-modal video-box-closeset brightcove"><div class="video-modal-background"></div><div class="modal-video-asset"><div class="video-asset">',
				'</div></div><button class="close-video">'+closeTxt+'</button></div>'
			],
			current: [
				'<div class="video-asset video-box-closeset">',
				'<button class="close-video">'+closeTxt+'</button></div>'
			]
		},
		/*// LGEPL-136 : 20200914 modify */
		getTitle: function(videoType, video) {
			var title="";
			if(videoType=="youtube") {
				title = video.getVideoData().title;
			} else {
				title = video.mediainfo.name;
			}
			return changeTitleFormat(title);
		},
		trigger: {
			init: function(){
				var tr = video.trigger;
				tr.addEvent();
			},
			setYoutube: function(t){
				var _this = t;
				var videoId = xssfilter(t.getAttribute('data-src'));
				var htmlDefault = null,
					html = null;
				if(videoId.indexOf('/') > 0) {
					var i = videoId.split('/');
					videoId = i[i.length-1];
				}
				var playsinline = (t.getAttribute('data-target') != 'modal') ? '&playsinline=1' : '';
				htmlDefault = '<div id="videoPlayerCode"></div>';
				if(t.getAttribute('data-target') == 'modal') {
					// if(video.cache.id != videoId) {
						html = video.markup.modal[0]+ htmlDefault +video.markup.modal[2];
					// }
					video.appendModal('youtube', html, videoId);
					this.playVideoYoutube(videoId);
				}else {
					html = video.markup.current[0]+ htmlDefault +video.markup.current[1];
					video.appendCurrent('youtube', html, videoId, '', '', t);
					this.playVideoYoutube(videoId);
				}
				
			},
			setBrightcove: function(t){
				var videoId = xssfilter(t.getAttribute('data-video-id'));
				var videoAccount = xssfilter(t.getAttribute('data-account'));
				var videoPlayer = xssfilter(t.getAttribute('data-player'));
				var htmlDefault = null,
					html = null;
				
				htmlDefault = '<div id="videoPlayerCode"></div>';
				if(t.getAttribute('data-target') == 'modal') {
					// if(video.cache.id != videoId) {
						html = video.markup.modal[1]+ htmlDefault +video.markup.modal[2];
					// }
					video.appendModal('brightcove', html, videoId);
					this.playVideoBrightCove(videoAccount, videoPlayer, videoId);
				}else {
					html = video.markup.current[0]+ htmlDefault +video.markup.current[1];
					video.appendCurrent('brightcove', html, videoId, videoAccount, videoPlayer, t);
					this.playVideoBrightCove(videoAccount, videoPlayer, videoId);
				}
				
			},
			playVideoYoutube: function(vid) {
				if(vid.indexOf('?')>=0) vid = vid.split("?")[0];
				setTimeout(function() {
					var player = new YT.Player('videoPlayerCode', {
						height: '360',
						width: '640',
						videoId: vid,
						host: 'https://www.youtube.com',
						playerVars: {
							modestbranding: true, rel: 0
						},
						events: {
							'onReady': onPlayerReady,
							'onStateChange': onPlayerStateChange
						}
					});
					function onPlayerReady(event) {
						event.target.playVideo();
					}
					function onPlayerStateChange(event) {
						if (event.data == YT.PlayerState.PLAYING) {
							adobeSatellite('video_track',{name:video.getTitle('youtube', player),event:'play'});
						}
						if (event.data == YT.PlayerState.PAUSED) {
							adobeSatellite('video_track',{name:video.getTitle('youtube', player),event:'pause'});
						}
					}

					var videoStatus = [0, 0, 0, 0];
					videoInterval = setInterval(function() {
						if(typeof player.getDuration != 'function') return false;
						var a = player.getDuration();
						var c = player.getCurrentTime();
						var p = parseInt((c*100)/a);
						for(var i=1;i<=4;i++) {
							if(p>=(25*i) && videoStatus[i-1]==0) {
								videoStatus[i-1] = 1;
								adobeSatellite('video_track',{name:video.getTitle('youtube', player), event:'ratio_'+(25*i)});
							}
						}
						if(p>=99 && videoStatus[3]==0) {
							videoStatus[3]=1;
							adobeSatellite('video_track',{name:video.getTitle('youtube', player),event:'ratio_'+(25*4)});
						}
					}, 2000);
				}, 1000);
			},
			playVideoBrightCove: function(accountId, playerId, videoId) {
				var myPlayer,
					playerHTML,
					playerData = {
						accountId: accountId,
						playerId: playerId,
						videoId: videoId
					};
				playerHTML = '<video-js id="brightCovePlayer" data-video-id="' +playerData.videoId +'"  data-account="' +playerData.accountId +'" data-player="' +playerData.playerId +'" data-embed="default" data-application-id autoplay class="video-js" controls></video-js>';
				setTimeout(function() {
					document.getElementById("videoPlayerCode").innerHTML = playerHTML;
					var s = document.createElement("script");
					s.src = "https://players.brightcove.net/" + playerData.accountId + "/" + playerData.playerId + "_default/index.min.js"; 
					document.body.appendChild(s);
					s.onload = callback;
					function callback() {
						myPlayer = bc(document.getElementById('brightCovePlayer'));
						myPlayer.on("loadedmetadata", function() {
							myPlayer.muted(false);
							myPlayer.play();
						});
						myPlayer.on("pause", function() {
							adobeSatellite('video_track',{name:video.getTitle('brightcove', myPlayer),event:'pause'});
						});
						myPlayer.on("play", function() {
							adobeSatellite('video_track',{name:video.getTitle('brightcove', myPlayer),event:'play'});
						});
					};

					var videoStatus = [0, 0, 0, 0];
					videoInterval = setInterval(function() {
						var a = myPlayer.mediainfo.duration;
						var c = myPlayer.currentTime();
						var p = parseInt((c*100)/a);
						for(var i=1;i<=4;i++) {
							if(p>=(25*i) && videoStatus[i-1]==0) {
								videoStatus[i-1] = 1;
								adobeSatellite('video_track',{name:video.getTitle('brightcove', myPlayer),event:'ratio_'+(25*i)});
							}
						}
						if(p>=99 && videoStatus[3]==0) {
							videoStatus[3]=1;
							adobeSatellite('video_track',{name:video.getTitle('brightcove', myPlayer),event:'ratio_'+(25*4)});
						}
					}, 2000);
				}, 1000);
			},
			addEvent: function(){
				var tr = video.trigger;
				var $component = $('.component');
				if($component.length <= 0) {
					$component = $('.container-fluid');
				}
				$component.off('click.video').on({
					'click.video': function(e){
						e.preventDefault();

						// 20200325 START 박지영 : brightcove 인 경우 쿠키 배너 셋팅에 따라 기능 막는 것 제거 (youtube에만 적용) 
						var _this = e.currentTarget;
						// 실행중인 비디오가 있으면 강제 종료
						if($('#videoPlayerCode').length>0) {
							var oldVideo = $('#videoPlayerCode');
							if(oldVideo.closest('.video-modal').length>0) {
								oldVideo.closest('.video-modal').find('button.close-video').trigger('click');
							} else {
								$('#videoPlayerCode').siblings('button.close-video').trigger('click');
							}
						}

						$('.eprivacy-layer').remove();
						if(_this.getAttribute('data-type')=="youtube") {
							// youtube
							if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
								// 실행중인 비디오가 있으면 강제 종료
								if($('#videoPlayerCode').length>0) {
									var oldVideo = $('#videoPlayerCode');
									if(oldVideo.closest('.video-modal').length>0) {
										oldVideo.closest('.video-modal').find('button.close-video').trigger('click');
									} else {
										$('#videoPlayerCode').siblings('button.close-video').trigger('click');
									}
								}
								var unCache = true;
								video.originalFocus = $(_this);

								if(_this.getAttribute('data-target') != 'modal') {
									// is component player
									var $cv = $(_this).data('cachedvideo');
									var $ci = $(_this).data('cacheid');
									var $ca = $(_this).data('cacheaccount');
									var $cp = $(_this).data('cacheplayer');
									if($cv) {
										video.appendCurrent(_this.getAttribute('data-type'), $cv, $ci, $ca, $cp, _this, true);
										if(typeof video.playVideoYoutube == 'function') video.playVideoYoutube($ci);
										unCache = false;
									}else {
										unCache = true;
									}
								}
								if(unCache) {
									tr.setYoutube(_this);
								}
								// stop autoplay by clicking the video button
								var slick = $(_this).closest('.slick-initialized');
								if(slick.length>0) {
									slick.next().find('a.slide-pause.pause').trigger('click');
								}
							} else {
								ePrivacyCookies.view('click');
							}
						} else {
							// brightcove
							var unCache = true;
							video.originalFocus = $(_this);

							if(_this.getAttribute('data-target') != 'modal') {
								// is component player
								var $cv = $(_this).data('cachedvideo');
								var $ci = $(_this).data('cacheid');
								var $ca = $(_this).data('cacheaccount');
								var $cp = $(_this).data('cacheplayer');
								if($cv) {
									video.appendCurrent(_this.getAttribute('data-type'), $cv, $ci, $ca, $cp, _this, true);
									if(typeof video.playVideoBrightCove == 'function') video.playVideoBrightCove($ca, $cp, $ci);
									unCache = false;
								}else {
									unCache = true;
								}
							}

							if(unCache) {
								tr.setBrightcove(_this);
							}
							
							// stop autoplay by clicking the video button
							var slick = $(_this).closest('.slick-initialized');
							if(slick.length>0) {
								slick.next().find('a.slide-pause.pause').trigger('click');
							}
						}
						
					}
				}, '.see-video');
			}
		},
		appendCurrent: function(videoType, mk, id, account, player, anchor, cached){
			var html = mk;
			var $target = $(anchor).parents('.video-box');
			$target = ($target.get(0)) ? $target : $(anchor).parents('.video-box').find('.visual-area');
			var $asset = $target.find('.video-asset');
			var $invisible = $(anchor).parents('.carousel-box').find('.text-area');
			if($asset) $asset.remove();
			$invisible.animate({
				opacity: 0
			}, 500);
			$target.parents('.component').addClass('js-invisible-nav');
			// $invisible.animate({
			// 	opacity: 0
			// }, 500);
			setTimeout(function(){
				$invisible.css({
					zIndex: -1
				});
				$target.append(html);
				if(!cached) {
					// init
					video.initCompo(anchor, id, account, player); // saved cache data in anchor
				}
			}, 500);
		},
		appendModal: function(videoType, mk, id){
			var modal = document.querySelectorAll('.video-modal')[0];
			var html = mk;
			if(modal) $(modal).remove();
			// if(video.cache.id == id){ // is cached video
			// 	html = video.cache.$modal;
			// 	$('body').append(html);
			// }else { // is not cached video
			// }
			$('body').addClass('modal-open').append(html);
			$('body').find('.video-modal').attr('tabindex', 0).focus();
			video.initModal();
			video.cache.id = id;
		},
		initCompo: function(cache, vid, va, vp){
			$('.video-asset').on({
				click: function(e){
					e.preventDefault();
					var $current = $(e.delegateTarget);
					var $invisible = $(e.delegateTarget).parents('.video-box').find('.text-area');
					$current.parents('.component').removeClass('js-invisible-nav');
					$(cache).data('cachedvideo', $current.detach());
					$(cache).data('cacheid', vid);
					$(cache).data('cacheaccount', va);
					$(cache).data('cacheplayer', vp);
					// $invisible.removeAttr('style').animate({
					// 	opacity: 1
					// }, 500);
					$invisible.removeAttr('style');
				}
			}, '.close-video');
		},
		initModal: function(){
			// 20200311 START 이상현 - FR-WA 요청 : 비디오 레이어 팝업의 키보드 인터랙션 수정.
			var $modal = $('.video-modal'),
				modalUI = 'a[href], area[href], input:not([disabled]), input:not([readonly]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';

			var closeAction = function(event){
				var $currentModal = $(event.delegateTarget);

				video.cache.$modal = $currentModal.detach();
				$('body').removeClass('modal-open');
				video.originalFocus.focus();
				if(videoInterval) clearInterval(videoInterval);
			}

			$modal.on({
				click: function(e){
					e.preventDefault();
					closeAction(e);
				}
			}, '.close-video');

			$modal.on({
				'keydown.loopFocus' : function(e){
					// var firstUIElem = $(this).find(modalUI).first();
					var lastUIElem = $(this).find(modalUI).last();

					if(e.target === e.currentTarget){
						if(e.keyCode === 9 && e.shiftKey){
							e.preventDefault();
							lastUIElem.focus();
						}
					}else if($(e.target).attr('class').indexOf('close-video') >= 0 ){
						if(e.keyCode === 9 && !e.shiftKey){
							e.preventDefault();
							$(e.currentTarget).focus();
						}
					}
				},
				'keydown.closeModal' : function(e){
					if( e.keyCode === 27 ){
						e.preventDefault();
						closeAction(e);
					}else{
						return;
					}
				},
			});
			// 20200311 END
			
			/* LGEPL-136 : 20200914 add */
			$modal.on({
				click: function(e){
					e.preventDefault();		
				    if($(e.target).hasClass('video-modal') || $(e.target).hasClass('modal-video-asset') || $(e.target).hasClass('video-asset') || $(e.target).hasClass('video-modal-background')){
				        closeAction(e);
				    }
				}
			});
			/*// LGEPL-136 : 20200914 add */
		},
		init: function(){
			video.trigger.init();
			// video.addEvent();
		}
	};

	video.init();
});
