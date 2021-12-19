//plp gpc0007, gpc0009, gpc0026 wish
var countrycode = document.getElementsByTagName("html")[0].getAttribute("data-countrycode");
var wishDataUrl = $('#wishDataUrl').val();
$(document).on('click','.pd-fav .ico-fav' , function(){
	$('#v').val(new Date().getTime()); //PJTPLP-10 GILS 버전정보 셋팅
	var $icofav = $(this);
	var login = sessionStorage.getItem('ACCESS_TOKEN'); /* LGEITF-376 modify */
	var modelId = "";
	if ($('.GPC0007').length>0 || $('.GPC0026').length>0 || $('.GPC0132').length>0) {
		modelId = $icofav.closest('.pd-sideInfo').find('.wish-inner').attr('data-product-id');
	} else if ($('.GPC0009').length>0) {
		modelId = $icofav.closest('.pdp-sideInfo').find('.wish-inner').attr('data-product-id');
	}
	var $wishEl = $('[data-wish-model-id='+modelId+']');
	if(!login){
		$icofav.addClass('wishTarget');
		$('#plp-wish-sign').modal('show');
	} else{
		if ($wishEl.find('[data-is-wish-on]').hasClass('on')) {
			if (isMobile) {
				
				if ($('.GPC0007').length>0 || $('.GPC0026').length>0 || $('.GPC0132').length>0) {
					
					if(isMobile && $('.pd-sideInfo').length>0){
						$('.pd-sideInfo').addClass('mobile-sideInfo');
					}
				} else if ($('.GPC0009').length>0) {
					
					if(isMobile && $('.pdp-sideInfo').length>0){
						$('.pdp-sideInfo').addClass('mobile-sideInfo');
					}
				}
				
				$('#plp-wish-count').attr('data-wish-count-product-id', modelId);
				$('#plp-wish-count').modal('show');
			} else {
				setWish(modelId);
			}
		} else {
			setWish(modelId);
		}
	}
});
// 접근성 관련 wish popup 포커스 관련 이벤트
$(document).on('keyup , keydown', '.pd-fav', function(e){
	if(e.type == 'keyup'){
		if($(e.target).length < 0){
			$(".pd-fav").removeClass('keyMove')
		} else{
			$(this).addClass('keyMove')
		}
	} 
	if(e.type == 'keydown'){
		if(e.keyCode == 9){
			if(!$(this).hasClass('on')){
				$(".pd-fav").removeClass('keyMove')
			} else if(e.target.nodeName == 'A'){
				$(".pd-fav").removeClass('keyMove')
			}
		}
		if(e.shiftKey && e.keyCode == 9){
			$(".pd-fav").removeClass('keyMove')
		}
	}
});
$(document).ready(function(){
	if ($('.GPC0007').length>0 || $('.GPC0009').length>0 || $('.GPC0026').length>0 || $('.GPC0132').length>0) {
		if(isMobile && $('.list-box').length>0){
			$('.list-box').addClass('mobile-list')
		}
		if(isMobile && $('.pdp-sideInfo').length>0){
			$('.pdp-sideInfo').addClass('mobile-sideInfo')
		}
	}
	$('#plp-wish-sign').on('hidden.bs.modal', function (e) {
		//#plp-wish-sign 닫기면 해당 타켓 이동 접근성
		$('.wishTarget').focus();
		$('.ico-fav').removeClass('wishTarget');
	});
	$('#plp-wish-count').on('hidden.bs.modal', function (e) {
		//#plp-wish-count 닫기면 해당 타켓 이동 접근성
		$('.wishTarget').focus();
		$('.ico-fav').removeClass('wishTarget');
		$('#plp-wish-count').attr('data-wish-count-product-id', '');
	});
	$('#goWish').on('click',function(){
		location.href = $('#goWish').attr('data-go-wish-url');
	});
	$('#wishRemove').on('click',function(){
		var productId = $('#plp-wish-count').attr('data-wish-count-product-id');
		$('#plp-wish-count').attr('data-wish-count-product-id', '');
		setWish(productId);
	});
	$('#signIn').click(function(){
		var current_location = window.location.href;
		location.href = '/' + countrycode + '/my-lg/login?state=' + current_location;
	});
	
	//////////////////////////////// PJTPLP-10-UI GILS START
	(function(){
		
		if(!$('[data-wish-model-id]').length > 0){
			return;
		}
		//위시 리스트 좋아요 조회 카운트 및 조아요 체크
		var wishUrl = $('[data-wish-url]').eq(0).attr('data-wish-url')
		var modelIds = [];
		//모델 아이디 수집후 좋아요 수 , 좋아요 여부 조회
		$('[data-wish-model-id]').each(function(){
			modelIds.push($(this).attr('data-wish-model-id'));
		});
		
		if(modelIds.length > 0){
			ajax.noCacheCall(wishUrl, {'modelIds': modelIds}, 'json', function(data){
				var productList = data.wishList;
				for(var i=0; i < productList.length ; i++){
					var product = productList[i];
					var modelId = product.modelId;
					var wishCnt = product.wishCnt;
					var isWishOn = product.isWishOn;
					var $wishEl = $('[data-wish-model-id='+modelId+']');
					$wishEl.find('[data-wish-cnt]').text(wishCnt);
					$wishEl.find('[data-is-wish-on]').removeClass('on').addClass(isWishOn);
				}
			});
		}
	})();
	
	///////////////////////////////// PJTPLP-10-UI GILS END
});
function setWish(modelId) {

	var param = {
		modelId: modelId
	};

	ajax.noCacheCall(wishDataUrl, param, 'json', function(data){
		var pdpYn = $('.GPC0009').length>0 ? true : false;
		var $wishEl = $('[data-wish-model-id='+data.modelId+']');

		// 로그인 일때 && PC/MO UI 다름
		if (data.flag == "L") {
			$wishEl.find('[data-wish-ico]').addClass('wishTarget');
			$('#plp-wish-sign').modal('show');
			if(pdpYn){
				$('#tempData').trigger('pdp_wish_no_signin');
			}else{
				$('#tempData').trigger('plp_wish_no_signin');	
			}
			
			
		} else {

			if(isMobile && $('.list-box').length>0){
				$('.list-box').addClass('mobile-list');
			}
			if ($('.GPC0009').length>0) {
				if(isMobile && $('.pdp-sideInfo').length>0){
					$('.pdp-sideInfo').addClass('mobile-sideInfo');
				}
			}else{
				if(isMobile && $('.pd-sideInfo').length>0){
					$('.pd-sideInfo').addClass('mobile-sideInfo');
				}
			}

			$wishEl.find('[data-wish-cnt]').text(data.wishCnt);
			if (data.flag == "Y") {
				$wishEl.find('[data-is-wish-on]').addClass('on');
				if(pdpYn){
					$('#tempData').trigger('pdp_wish_icon_select');
				}else{
					$('#tempData').trigger('plp_wish_icon_select');	
				}
			} else {
				$wishEl.find('[data-is-wish-on]').removeClass('on');
				if(pdpYn){
					$('#tempData').trigger('pdp_wish_icon_unselect');
				}else{
					$('#tempData').trigger('plp_wish_icon_unselect');
				}
			}
			$wishEl.find('[data-wish-ico]').attr('aria-checked', data.flag == "Y" ? "true" : "false" );
		}
	});
}