var GPC0003;
$(document).ready(function() {
	if(!document.querySelector('.GPC0003')) return false;
	var $obj = $('.GPC0003');
	GPC0003 = {
		el: null,
		tab : null,
		opt: {
			infinite: false,
			slidesToShow: 4,
			slidesToScroll: 4,
			arrows : true,
			dots: true,
			listStyle: true, // WA-GPC0003-05
			responsive: [{
				breakpoint: 992,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
					arrows : true
				}
			}, {
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					arrows : false
				}
			}],
			prevArrow: carouselOptions.bigAnglePrev, // common.js variable
			nextArrow: carouselOptions.bigAngleNext // common.js variable
		},
		template: null,
		init: function(){
			var _this = GPC0003;
			var els = document.querySelectorAll('.GPC0003');

			for (var i = 0; i < els.length; i++) {
				_this.el = els[i];
				_this.tab = _this.el.querySelector('.tabs-type-liner');
				if($(_this.el).find('.contents-template').length>0) _this.template = $(_this.el).find('.contents-template').clone();
				$(_this.el).find('.contents-template').remove();

				// get Recently products
				var _recentlyModelsList = _this.el.querySelector('input[name="recentlyModelsList"]');
				if(_recentlyModelsList) {
					var $nav = $('.navigation');
					var list = ($nav && $nav.hasClass('b2b')) ? getCookie("LG5_B2B_RecentlyView") : getCookie("LG5_RecentlyView"),
						$content = $(_recentlyModelsList).closest(".tabs-cont");
					_recentlyModelsList.value = list ? list : "";

					if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
						if(list == undefined) {
							$content.find("form").remove();
						}else {
							$content.find(".no-content").remove();
						}
					} else {
						ePrivacyCookies.view('load', '', $content);
					}

				}

				_this.addEvent();

				if(_this.tab && !$(_this.tab.querySelector('a')).is('.active')) {
					$(_this.tab.querySelector('a')).trigger('click');
				}
				var fid = $(_this.tab.querySelector('a.active')).attr('href').split('#')[1];
				if($('#'+fid).length>0) runBVStaticPLP($('#'+fid));
			}
			// 20200406 START 이상현 - tab ui의 관계 정보 추가
			_this.addAriaRelationship(els);
			// 20200406 END
			scrollDesign();
		},
		createProductItem: function(productList, productMessages){
			var html = [];
			for (var i = 0; i < productList.length; i++) {
				var p = productList[i],
					template = $(GPC0003.template).clone().html();
				//PJTGADL-2 
				var priceValue = "";
				if(p.rPromoPrice != null && p.rPromoPrice != "" && p.rPromoPrice != 'null'){
					priceValue = p.rPromoPrice+"."+nvl(p.rPromoPriceCent,'00');
				} else{
					priceValue = nvl(p.rPrice,'')+"."+nvl(p.rPriceCent,'00');
				}
				template = template.replace(/\*modelId\*/g, p.modelId)
								.replace(/\*modelName\*/g, p.modelName)
								.replace(/\*modelDisplayName\*/g, p.modelName.toLowerCase()) // LGEGMC-1766 
								.replace(/\*imageAltText\*/g, (p.imageAltText != null) ? p.imageAltText : '')
								// 20200325 START 박지영 - ufn 따옴표 처리
								// 20200512 START 박지영 - ufn null 처리
								.replace(/\*userFriendlyName\*/g, p.userFriendlyName == null ? '' : p.userFriendlyName.replace(/\"/g, "''"))
								// 20200512 END
								// 20200325 END
								.replace(/\*salesModelCode\*/g, p.salesModelCode)
								.replace(/\*modelUrlPath\*/g, p.modelUrlPath)
								.replace(/\*mediumImageAddr\*/g, p.mediumImageAddr)
								.replace(/\*smallImageAddr\*/g, p.smallImageAddr)
								.replace(/\*productTag1\*/g, p.productTag1)
								.replace(/\*productTag2\*/g, p.productTag2)
								.replace(/\*whereToBuyUrl\*/g, p.whereToBuyUrl)
								.replace(/\*inquiryToBuyUrl\*/g, p.inquiryToBuyUrl)
								.replace(/\*findTheDealerUrl\*/g, p.findTheDealerUrl)
								.replace(/\*promotionText\*/g, p.promotionText ? p.promotionText : "")
								// PJTOBS 20200703 Start 
								.replace(/\*reStockAlertUrl\*/g, p.reStockAlertUrl ? p.reStockAlertUrl : "")
								// PJTOBS 20200703 End
								// 20200316 START 박지영 : price format 함수 적용
								.replace(/\*rPrice\*\.\*rPriceCent\*/g, p.rPrice ? changeFormatFullPrice(p.rPrice, p.rPriceCent) : 'null')
								// 20200421 START 박지영 : 오타 수정
								.replace(/\*rPromoPrice\*\.\*rPromoPriceCent\*/g, p.rPromoPrice ? changeFormatFullPrice(p.rPromoPrice, p.rPromoPriceCent) : 'null')
								// 20200421 END
								// 20200316 END
								.replace(/\*rPrice\*/g, p.rPrice ? changeFormatPrice(p.rPrice) : 'null')
								.replace(/\*rPromoPrice\*/g, p.rPromoPrice ? changeFormatPrice(p.rPromoPrice) : 'null')
								// 20200325 START 박지영 : price format 수정
								.replace(/\*rPriceCent\*/g, p.rPriceCent ? (p.rPriceCent) : 'null')
								.replace(/\*rPromoPriceCent\*/g, p.rPromoPriceCent ? (p.rPromoPriceCent) : 'null')
								// 20200325 END
								/* LGEUS-12083 : 20190826 modify */
								.replace(/\*rDiscountedPrice\*/g, p.rDiscountedPrice ? changeFormatPrice(p.rDiscountedPrice) : 'null')
								.replace(/\*rDiscountedPriceCent\*/g, p.rDiscountedPriceCent)
								/* //LGEUS-12083 : 20190826 modify */
								/* in-house review rating add */
								.replace(/\*sRating2\*/g, p.sRating2)
								.replace(/\*pCount\*/g, p.pCount)
								.replace(/\*ratingPercent\*/g, p.ratingPercent)
								/* // in-house review rating add */
								.replace(/\*siblingType\*/g, p.siblingType)
								.replace(/\*discountedRate\*/g, p.discountedRate)
								.replace(/\*discountMsg\*/g, p.discountMsg == null ? '' : p.discountMsg.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>'))	// LGEIS-229 change how discounts are shown
								.replace(/\*retailerPricingText\*/g, p.retailerPricingText)
								.replace(/\*salesSuffixCode\*/g, (p.salesSuffixCode || ''))/* LGEGMC-455 20200717 add */
								.replace(/\*modelYear\*/g, (nvl(p.modelYear,'') || '')) /* LGEGMC-1279 : 2021.03.12 add */
								.replace(/\*buName1\*/g, (p.buName1 || ''))
								.replace(/\*buName2\*/g, (p.buName2 || ''))
								.replace(/\*buName3\*/g, (nvl(p.buName3,'') || ''))
								.replace(/\*bizType\*/g, (p.bizType || ''))
								.replace(/\*superCategoryName\*/g, p.superCategoryName)
								.replace(/\*categoryEngName\*/g, p.categoryEngName) // LGEGMC-1766 
								.replace(/\*priceValue\*/g, priceValue)/* LGEGMC-712 20201102 ADD */
								//PJTOBSB2E-3 Start
								.replace(/\*obsPreOrderStartDate\*/g, p.obsPreOrderStartDate)
								.replace(/\*obsPreOrderEndDate\*/g, p.obsPreOrderEndDate)
								//PJTOBSB2E-3 End
								.replace(/\*msrp\*/g, nvl(p.msrp,'0'))
								//PJTOBSEMI-4-num2 Start
								.replace(/\*emiMsg\*/g, p.obsEmiMsgFlag == 'Y' && p.emiMsg != null && p.emiMsg != '' ? p.emiMsg : '')
								//PJTOBSEMI-4-num2 End
								//LGEAU-378 START
								.replace(/\*afterPayInstallMent\*/g, p.obsEmiMsgFlag == 'Y' && p.emiMsg != null && p.emiMsg != '' && (p.afterPay <= 3000 && p.afterPay > 0) ? 'afterpay-installment" href="#modal-afterpay' : '" style="display:none;')
								//LGEAU-378 END
								//LGEGMC-2202 START
								.replace(/\*wtbClass\*/g, (p.wtbExternalLinkUseFlag =="Y" && p.wtbExternalLinkUrl != null && p.wtbExternalLinkUrl != '' && p.wtbExternalLinkName != null && p.wtbExternalLinkName != '') ? 'in-buynow' : 'where-to-buy');
								//LGEGMC-2202
								
				 //LGEGMC-383
				var pdfDownloadFile = $obj.find('input[name="pdfDownloadFile"]').val();
				var productFicheDownload = $obj.find('input[name="productFicheDownload"]').val();
				//LGESR-72
				var rsProductFicheDownload = $obj.find('input[name="rsProductFicheDownload"]').val();
				var rsUseFlag = p.rsUseFlag;
				if(rsUseFlag == "Y"){
					productFicheDownload = rsProductFicheDownload;
				}
				//LGESR-72
				var productFichehtml = "<a href='#' adobe-click='pdp-file-down-click' data-doc='"+ p.productFicheDocId +"' data-file='" + p.productFicheFileName + "' data-original='" + p.productFicheOriginalName + "' data-category='' class='link-text' title='" + pdfDownloadFile + "'>"
    			+ "<span class='fiche type-product'>" + productFicheDownload + "</span>"
    			+ "</a>";
				/*LGEGMC-1035 start*/
				if($('html').attr('data-countrycode') == 'uk'){
					if(p.energyLabel != "" && p.energyLabel != "N" && p.energyLabel != null && p.energyLabelDocId !=null && p.energyLabelDocId !="" && p.energyLabelFileName != null && p.energyLabelFileName != "" && p.energyLabelOriginalName !=null
							&& p.energyLabelOriginalName !="" && p.energyLabelImageAddr !=null && p.energyLabelImageAddr !="" && p.energyLabelName !=null && p.energyLabelName !="" && p.fEnergyLabelFileName!= null && p.fEnergyLabelDocId!= null && p.fEnergyLabelDocId!= ""&&p.fEnergyLabelFileName!='' && p.fEnergyLabelOriginalName !=null&& p.fEnergyLabelOriginalName !=''){
						var energyLabelhtml = "<div class='energy-label-wrap'><a href='#' class='label-link'><span class='label'><img src='"+ p.energyLabelImageAddr +"' alt='"+ p.energyLabelName +"'></span></a>"
						var energyLabelImagehtml = "<div class='tooltip-link'><div class='tolltip-inner'>";
						if(p.fEnergyLabelFileName!= null && p.fEnergyLabelDocId!= null && p.fEnergyLabelDocId!= ""&&p.fEnergyLabelFileName!='' && p.fEnergyLabelOriginalName !=null&& p.fEnergyLabelOriginalName !=''){
							energyLabelImagehtml += "<a href='#' class='link-text link-text-uk' adobe-click='pdp-file-down-click' data-doc='" + p.fEnergyLabelDocId + "' data-file='" + p.fEnergyLabelFileName + "' data-original='" + p.fEnergyLabelOriginalName + "'  data-category='' title='" + pdfDownloadFile + "'>UK</a>";
						}
					energyLabelImagehtml += "<a href='#' class='link-text link-text-eu' adobe-click='pdp-file-down-click' data-doc='" + p.energyLabelDocId + "' data-file='" + p.energyLabelFileName + "' data-original='" + p.energyLabelOriginalName + "'  data-category='' title='" + pdfDownloadFile + "'>EU</a></div></div></div>"
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
				} else{
					template = template.replace(/\*productFileName\*/g,"");
				}
				if(p.energyLabel != "" && p.energyLabel != "N" && p.energyLabel != null && p.energyLabelDocId !=null && p.energyLabelDocId !="" && p.energyLabelFileName != null && p.energyLabelFileName != "" && p.energyLabelOriginalName !=null
						&& p.energyLabelOriginalName !="" && p.energyLabelImageAddr !=null && p.energyLabelImageAddr !="" && p.energyLabelName !=null && p.energyLabelName !=""){
					template = template.replace(/\*energyLabel\*/g,energyLabelhtml);
					template = template.replace(/\*energyLabelImage\*/g,energyLabelImagehtml);
				} else{
					template = template.replace(/\*energyLabelImage\*/g, "");
					template = template.replace(/\*energyLabel\*/g,"");
				}                
				
				var $template = $(template),
					$keyBlocks = $template.find('*[data-key]');

				for (var i1 = 0; i1 < $keyBlocks.length; i1++) {
					var $currentKeyBlock = $keyBlocks.eq(i1),
						key = $currentKeyBlock.get(0).getAttribute('data-key'),
						val = p[key];
					if(!val || (val == null || val == "N")) {
						$currentKeyBlock.remove();
					}
				}
				
				// in-house reivew rating star - ie fix
				$template.find('.carmine-star').css({
					width: p.reviewRatingPercent+"%"
				});

				// price setting
				var $prices = $template.find('.price-area');
				if(p.modelStatusCode=='DISCONTINUED') {
					$prices.filter('.rPrice').html("");
					$prices.filter('.rPromoPrice').remove();
					$prices.filter('.retailer').remove();
				} else if(p.retailerPricingFlag=="Y") {
					$prices.filter('.rPrice').remove();
					$prices.filter('.rPromoPrice').remove();
				}else {
					if((p.rPromoPrice && p.rPromoPrice != null) && (p.rPrice && p.rPrice != null)) {
						$prices.filter('.rPrice').remove();
						$prices.filter('.retailer').remove();
					}else if(p.rPrice && p.rPrice != null){
						$prices.filter('.rPromoPrice').remove();
						$prices.filter('.retailer').remove();
					}else {
						$prices.filter('.rPrice').html("");
						$prices.filter('.rPromoPrice').remove();
						$prices.filter('.retailer').remove();
					}
				}
				// PJTOBS-32 Start
				if(ISVIP) $prices.addClass('vip-price-area');
				//PJTLIMITQTY_EXTEND
				var limitSaleConditionFlag =  p.vipPriceFlag == 'N' && p.obsLimitSale == 'Y' && p.limitSaleUseFlag == 'Y' ? 'Y' : 'N';
				if(p.vipPriceFlag == 'Y') {
					var priceOrg = changeFormatFullPrice(p.rPrice, p.rPriceCent);
					var pricePromo = changeFormatFullPrice(p.rPromoPrice, p.rPromoPriceCent);
					var legal = p.discountMsg == null ? '' : p.discountMsg.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');		// LGEIS-229 change how discounts are shown
					var vipPriceText = productMessages.vipPriceMessage;
					var previousPriceText = productMessages.previousPriceText;
					// PJTOBSEMI-4-num2 Start
					var emiMsgText = p.obsEmiMsgFlag == 'Y' && p.emiMsg != null && p.emiMsg != '' ? p.emiMsg : '';

					setVipPrice($prices, priceOrg, pricePromo, legal, vipPriceText, previousPriceText, p.modelId + '/' + 'GPC0003.js',emiMsgText,p.afterPay, limitSaleConditionFlag, p.limitSaleTitle);
					// PJTOBSEMI-4-num2 End
				}else{
					//PJTLIMITQTY_EXTEND
					if(p.obsLimitSale == 'Y' && p.limitSaleUseFlag == 'Y'){
						$template.find('.price-vip').text(productMessages.limitSaleTitle);
					}else{
						$template.find('.price-vip').text('');
					}
					//PJTLIMITQTY_EXTEND
				}
				// PJTOBS-32 End

				// 20200427 START 박지영 - cac와 cac_en에서 review가 0일때 별점 삭제
				// cac, cac_en (in house review)
				var cc = COUNTRY_CODE.toLowerCase();
				if(cc=='cac' || cc=='cac_en') {
					if(p.sRating2==0 && p.sRating2==0 && p.ratingPercent==0) {
						$template.find(".rating.inhouse-review").remove();
					}
				}
				// 20200427 END

				// rolling image
				if(p.modelRollingImgList && p.modelRollingImgList != null) {
					$template.find('.visual img.pc').addClass('js-thumbnail-loop').attr('data-img-list', p.modelRollingImgList);
				}

				// PJTOBS 20200703 Start
				//PJTLIMITQTY_EXTEND
				var $stockArea = $template.find('.stock-area');
				if((!p.reStockAlertFlag || p.reStockAlertFlag!='Y') && $stockArea.length>0) {
					if( p.limitSaleUseFlag == 'Y' && p.obsLimitSale == 'Y'){
						if(p.obsInventoryFlag == 'Y'){
							$stockArea.removeClass('out-of-stock').empty();
						}else{
							$stockArea.find('.text').text(productMessages.limitSaleSoldOutText);
						}
					}else{
						$stockArea.removeClass('out-of-stock').empty();
					}
				}else{
					if(p.limitSaleUseFlag == 'Y' && p.obsLimitSale == 'Y'){
						$stockArea.find('.text').text(productMessages.limitSaleSoldOutText);
					}
				}
				// PJTOBS 20200703 End

				// buttons
				// PJTOBS 20200703 Start
				if((!p.reStockAlertFlag || p.reStockAlertFlag!='Y') && $template.find('.button a.re-stock-alert').length>0) {
					$template.find('.button a.re-stock-alert').remove();
				}
				// PJTOBS 20200703 End
				// LGEVN-80
				var obsBuynowFlag = $obj.find('input[name="obsBuynowFlag"]').val();
				if(p.obsPreOrderFlag == 'Y'){ //PJTOBS/2020/PJTOBSB2E-6 GILS
					if(obsBuynowFlag == 'Y'){
						$template.find('.button a.add-to-cart').data('model-id', p.modelId).attr('href', p.modelUrlPath).text(productMessages.preOrderBtnNm).removeAttr('target, title')
						.addClass('pre-order').attr('data-obs-pre-order-start-date',p.obsPreOrderStartDate).attr('data-obs-pre-order-end-date',p.obsPreOrderEndDate)
						;
					}else{
						$template.find('.button a.add-to-cart').data('model-id', p.modelId).attr('href', '#').text(productMessages.preOrderBtnNm).attr('role', 'button').removeAttr('target, title')
						.addClass('pre-order').attr('data-obs-pre-order-start-date',p.obsPreOrderStartDate).attr('data-obs-pre-order-end-date',p.obsPreOrderEndDate)
						;						
					}
				}else if(p.addToCartFlag!="N") {
					if(p.addToCartFlag == 'Y') {
						// 통합 OBS
						if(obsBuynowFlag == 'Y'){
							// 통합 OBS
							var buynow = $obj.find('input[name="buynow"]').val();
							$template.find('.button a.add-to-cart').data('model-id', p.modelId).attr('href', p.modelUrlPath).text(buynow).removeAttr('target, title');
						}else{
							// 통합 OBS
							$template.find('.button a.add-to-cart').data('model-id', p.modelId).attr('href', '#').text(productMessages.addToCartBtnNm).attr('role', 'button').removeAttr('target, title');
						}
					} else if(p.addToCartFlag == 'S') {
						// Standalone OBS
						$template.find('.button a.add-to-cart').data('model-id', p.modelId).attr('href', '#').text(productMessages.addToCartBtnNm).attr('role', 'button').removeAttr('target, title');
					}
				} else if(p.buyNowFlag=="Y" || p.buyNowFlag=="L") {
					if(p.ecommerceTarget == '_blank') {
						$template.find('.button a.add-to-cart').addClass('in-buynow').data('model-id', p.modelId).attr('href', p.buyNowUrl).text(productMessages.buyNowBtnNm).removeAttr('role').attr('target', '_blank').attr('title', productMessages.btnNewLinkTitle);//LGEGMC-1567
					}else {
						$template.find('.button a.add-to-cart').addClass('in-buynow').data('model-id', p.modelId).attr('href', p.buyNowUrl).text(productMessages.buyNowBtnNm).removeAttr('role').removeAttr('target, title');//LGEGMC-1567
					}
				// 20200506 START 박지영 - flag 명 변경
				} else if (p.resellerBtnFlag=="Y") {
				// 20200506 END
					$template.find('.button a.add-to-cart').addClass('active').data('model-id', p.modelId).attr('href', p.resellerLinkUrl).text(productMessages.resellerBtnNm).removeAttr('role').attr('target', '_blank').attr('title', productMessages.btnNewLinkTitle);
				} else if (p.productSupportFlag=="Y") {
					$template.find('.button a.add-to-cart').addClass('active').data('model-id', p.modelId).attr('href', p.productSupportUrl).text(productMessages.productSupportBtnNm).removeAttr('role').removeAttr('target, title');
				} else {
					$template.find('.button a.add-to-cart').remove();
				}
				// WTB btn
				if(p.whereToBuyFlag=="Y" && p.whereToBuyUrl != null && p.whereToBuyUrl != '') {
					// go to pdp page
					$template.find('.button a.where-to-buy').attr('href', p.whereToBuyUrl).text(productMessages.whereToBuyBtnNm);
					$template.find('.button a.where-to-buy').removeAttr('target, title');
				// 20200410 START 박지영 - wtb external link 변경
				} else if(p.wtbExternalLinkUseFlag=="Y" && p.wtbExternalLinkUrl != null && p.wtbExternalLinkUrl != '' && p.wtbExternalLinkName != null && p.wtbExternalLinkName != '') {
					// go to external link
					//LGEGMC-2202 START
					$template.find('.button a.in-buynow').attr('href', p.wtbExternalLinkUrl).text(p.wtbExternalLinkName).attr('data-link-name', 'buy_now').removeAttr('data-sc-item');
					if(p.wtbExternalLinkSelfFlag == 'Y') {
						$template.find('.button a.in-buynow').removeAttr('target, title');
					} else {
						$template.find('.button a.in-buynow').attr('target', '_blank').attr('title', productMessages.btnNewLinkTitle);
					}
					//LGEGMC-2202 END
				// 20200410 END
				} else {
					$template.find('.button a.where-to-buy').remove();
				}
				// Find a dealer btn
				if(p.findTheDealerFlag=="Y" && p.findTheDealerUrl != null && p.findTheDealerUrl != '') {
					$template.find('.button a.find-a-dealer').attr('href', p.findTheDealerUrl).text(productMessages.findTheDealerBtnNm);
				} else {
					$template.find('.button a.find-a-dealer').remove();
				}
				// inquiry to buy btn
				if(p.inquiryToBuyFlag=="Y" && p.inquiryToBuyUrl != null && p.inquiryToBuyUrl != '') {
					$template.find('.button a.inquiry-to-buy').attr('href', p.inquiryToBuyUrl).text(productMessages.inquiryToBuyBtnNm);
				} else {
					$template.find('.button a.inquiry-to-buy').remove();
				}

				// 20200511 START 박지영 - 3번, 4번 컴포넌트 버튼 색상 변경
				// button - change color (Changing button color to JavaScript is only the GPC0003 and GPC0004 components.)
				if((OBS_LOGIN_FLAG=='N' || OBS_LOGIN_FLAG == 'T') && p.buyNowUseFlag == 'N' && p.resellerBtnFlag == 'N' && p.productSupportFlag == 'N') {
					// change color (No red button) 
					if($template.find('.button a.add-to-cart').length>0) $template.find('.button a.add-to-cart').removeClass('btn-primary').addClass('btn-outline-secondary');
					if($template.find('.button a.where-to-buy').length>0) $template.find('.button a.where-to-buy').addClass('btn-primary').removeClass('btn-outline-secondary');
				}
				// 20200511 END

				$template.find('template').remove();
				template = $template.get(0).outerHTML;
				html += template;
			}

			return html;
		},
		addAriaDescribedby: function(){
			var _this = GPC0003;
			var waNumber = 0;
			$(_this.el).find('.unit-list .item').each(function() {
				var $target;
				if($(this).find('.model-name a') && !$(this).find('.model-name a').is(':empty')) {
					$target = $(this).find('.model-name a');
				}
				if($target) {
					$target.attr('id', 'waGPC0003_'+waNumber);
					$(this).find('a.btn').attr('aria-describedby', 'waGPC0003_'+waNumber);
					$(this).find('a.js-compare').attr('aria-describedby', 'waGPC0003_'+waNumber).attr('role', 'button');
					waNumber++;
				}
			});
		},
		// 20200406 START 이상현 - tab ui의 관계 정보 추가
		addAriaRelationship : function(tg){
			if($(tg).find('.js-tab').length > 0){
				$(tg).find('.js-tab').find('[role="tab"]').each(function(idx) {
					$(this).attr('id', 'tabLabel_' + (idx+1));
					$(tg).find('[role="tabpanel"]').eq(idx).attr('aria-labelledby', 'tabLabel_' + (idx+1));
				});
			}
		},
		// 20200406 END
		addEvent: function(){
			var _this = GPC0003;
			$(_this.el).on({
				submit: function(e){
					e.preventDefault();
					//console.log('!!');
					var isExpander = $(e.delegateTarget).data('focus') == true;
					var url = e.currentTarget.action,
						param = encodeURI(xssfilter($(e.currentTarget).serialize()));
					var $target = $(e.currentTarget).siblings('.list-contents-wrap');
					var $form = $(e.currentTarget);
					ajax.noCacheCall(url, param, 'json', function(d){
						var data, html;
						if(d && d.data) data = d.data instanceof Array ? d.data[0] : d.data;

						if(d.status == "success" && (data && (data.productList && data.productList.length > 0))) {
							// making markup
							html = GPC0003.createProductItem(data.productList, data.productMessages);

							if($target.find('.unit-list').is('.slick-initialized')) {
								$target.find('.unit-list').slick('unslick');
							}
							
							$target.find('.unit-list').html(html);
							if($target.hasClass('initialized')) {
								$('html, body').animate({
									scrollTop: $target.closest('.component').offset().top
								});
							}
							$target.find('.unit-list').slick(GPC0003.opt);
							$target.addClass('initialized');
							_this.addAriaDescribedby();
							bindImgError();
							runBVStaticPLP($target);
							if(typeof renderListingInlineRatingsRU != 'undefined') renderListingInlineRatingsRU(getProductsNameRU());

							// over, out, focus, blur 이벤트 - ajax 호출시

							// interaction handler
							$target.find(".item a.visual").off("mouseenter").on("mouseenter", function(){ // WA-GPC0003-09
								$target.find(".item").removeClass("on-focus");
								$(this).closest(".item").addClass("on-focus");
							});
							$target.find(".item").off("mouseleave").on("mouseleave", function(e){ // WA-GPC0003-09
								$(this).removeClass("on-focus");
							});
							// WA-GPC0003-09
							setTimeout(function() { // fix bv script
								$target.find('.item').each(function() {
									var $blurlink = $(this).find('.model-name a');
									if($(this).find('a.bv_main_container').length>0) $blurlink = $(this).find('a.bv_main_container');
									if($(this).find('.rating.inhouse-review').length>0) $blurlink = $(this).find('.rating.inhouse-review > a');
									if($(this).find('.rating.loaded').length>0) $blurlink = $(this).find('.rating.loaded a');
									$blurlink.off('blur.showbtn').on('blur.showbtn', function(e) {
										$(this).closest(".item").addClass("on-focus");
										$(this).closest(".item").siblings().removeClass('on-focus');
										// 20200401 START 박지영 : 모바일에서 불필요한 스크립트 동작하지 않도록 수정 
										if($(this).closest(".item").find('.button a').length>0) {
											if($(window).width() >= 768) $(this).closest(".item").find('.button a').eq(0).focus();
										} else if($(this).closest(".item").find('.wishlist-compare a').length>0) {
											if($(window).width() >= 768) $(this).closest(".item").find('.wishlist-compare a').eq(0).focus();
										}
										// 20200401 END
									});
								});
							}, 1000);
							$target.find(".item a.visual").off("focus.showbtn").on("focus.showbtn", function(){
								//$(this).removeClass("on-focus");
								$target.find(".item").removeClass("on-focus");
							});

							// -- over, out, focus, blur 이벤트 - ajax 호출시

							$form.trigger('ajaxLoadEnd');

						}else {
							$target.closest(".tab-cont").removeClass("active");
							$target.closest(".component").find(".no-content-wrap").addClass("active");

							$form.trigger('ajaxLoadEnd');
						}
						// console.log($target);
					});
				}
			}, 'form');

			// over, out, focus, blur 이벤트 - ajax 호출 안되는 경우 (1번째 탭)

			// mouseover (default)
			$(_this.el).find(".item a.visual").off("mouseenter").on("mouseenter", function(){ // WA-GPC0003-09
				$(this).closest(".item").addClass("on-focus");
				$(this).closest(".item").siblings().removeClass('on-focus');
			});
			$(_this.el).find(".item").off("mouseleave").on("mouseleave", function(e){ // WA-GPC0003-09
				//$(this).removeClass("on-focus");
				$(_this.el).find(".item").removeClass("on-focus");
			});
			
			// WA-GPC0003-09
			setTimeout(function() { // fix bv script
				$(_this.el).find('.item').each(function() {
					var $blurlink = $(this).find('.model-name a');
					if($(this).find('a.bv_main_container').length>0) $blurlink = $(this).find('a.bv_main_container');
					if($(this).find('.rating.inhouse-review').length>0) $blurlink = $(this).find('.rating.inhouse-review > a');
					if($(this).find('.rating.loaded').length>0) $blurlink = $(this).find('.rating.loaded a');
					$blurlink.off('blur.showbtn').on('blur.showbtn', function(e) {
						$(this).closest(".item").addClass("on-focus");
						$(this).closest(".item").siblings().removeClass('on-focus');
						// 20200401 START 박지영 : 모바일에서 불필요한 스크립트 동작하지 않도록 수정 
						if($(this).closest(".item").find('.button a').length>0) {
							if($(window).width() >= 768) $(this).closest(".item").find('.button a').eq(0).focus();
						} else if($(this).closest(".item").find('.wishlist-compare a').length>0) {
							if($(window).width() >= 768) $(this).closest(".item").find('.wishlist-compare a').eq(0).focus();
						}
						// 20200401 END
					});
				});

				// - over, out, focus, blur 이벤트 - ajax 호출 안되는 경우 (1번째 탭)
			}, 1000);
			$(_this.el).find(".item a.visual").off("focus.showbtn").on("focus.showbtn", function(e){
				$(this).removeClass("on-focus");
			});

			// tab click
			$(_this.tab).on({
				click: function(e){
					e.preventDefault();
					var target = $(e.currentTarget.getAttribute('href')).get(0),
						targetForm = target.querySelector('form');

					// hide no-content area
					$(target).closest(".component").find(".no-content-wrap").removeClass("active");

					if($(targetForm).length>0) {
						if(!$(target.querySelector('.list-contents-wrap')).is('.initialized')) {
							if($(targetForm).find('input[name=type][value=EO]').length>0 || $(targetForm).find('input[name=type][value=YMAL]').length>0) {
								if(typeof OBS.init == 'function') {
									OBS.init($(target));
								} else {
									$(targetForm).submit();
								}
							} else {
								$(targetForm).submit();
							}
						}
					} else {
						if(!$(target).hasClass('active')) {
							$(target).addClass('active');
						}
						if(!$(target.querySelector('.list-contents-wrap')).find('.unit-list').hasClass('slick-initialized')) {
							setTimeout(function() {
								$(target.querySelector('.list-contents-wrap')).find('.unit-list').slick(GPC0003.opt);
								runBVStaticPLP($(target));
								
								// over, out, focus, blur 이벤트 - 탭 클릭시
								$(target).find(".item a.visual").off("mouseenter").on("mouseenter", function(){
									$(target).find(".item").removeClass("on-focus");
									$(this).closest(".item").addClass("on-focus");
								});
								$(target).find(".item").off("mouseleave").on("mouseleave", function(e){
									$(this).removeClass("on-focus");
								});
								setTimeout(function() { // fix bv script
									$(target).find('.item').each(function() {
										var $blurlink = $(this).find('.model-name a');
										if($(this).find('a.bv_main_container').length>0) $blurlink = $(this).find('a.bv_main_container');
										if($(this).find('.rating.inhouse-review').length>0) $blurlink = $(this).find('.rating.inhouse-review > a');
										if($(this).find('.rating.loaded').length>0) $blurlink = $(this).find('.rating.loaded a');
										$blurlink.off('blur.showbtn').on('blur.showbtn', function(e) {
											$(this).closest(".item").addClass("on-focus");
											$(this).closest(".item").siblings().removeClass('on-focus');
											// 20200401 START 박지영 : 모바일에서 불필요한 스크립트 동작하지 않도록 수정 
											if($(this).closest(".item").find('.button a').length>0) {
												if($(window).width() >= 768) $(this).closest(".item").find('.button a').eq(0).focus();
											} else if($(this).closest(".item").find('.wishlist-compare a').length>0) {
												if($(window).width() >= 768) $(this).closest(".item").find('.wishlist-compare a').eq(0).focus();
											}
											// 20200401 END
										});
									});
								}, 1000);
								$(target).find(".item a.visual").off("focus.showbtn").on("focus.showbtn", function(){
									$(target).find(".item").removeClass("on-focus");
								});
								// -- over, out, focus, blur 이벤트 - 탭 클릭시

							}, 100);
						}
					}
				}
			}, 'a');

			// resize
			var resizeEvent = function(e) {
				if (e.matches) { // if matches media query 
					//console.log(e.matches);
				} else { // if not  }
					//console.log(e.matches);
					// over, out, focus, blur 이벤트 - 리사이징 시 (only desktop)

					setTimeout(function() {
						$(GPC0003.el).find(".item a.visual").off("mouseenter").on("mouseenter", function(){
							$(GPC0003.el).find(".item").removeClass("on-focus");
							$(this).closest(".item").addClass("on-focus");
						});
						$(GPC0003.el).find(".item").off("mouseleave").on("mouseleave", function(e){
							$(this).removeClass("on-focus");
						});
						$(GPC0003.el).find(".item a.visual").off("focus.showbtn").on("focus.showbtn", function(){
							$(GPC0003.el).find(".item").removeClass("on-focus");
						});
					}, 500);

					setTimeout(function() { // fix bv script
						$(GPC0003.el).find('.item').each(function() {
							var $blurlink = $(this).find('.model-name a');
							if($(this).find('a.bv_main_container').length>0) $blurlink = $(this).find('a.bv_main_container');
							if($(this).find('.rating.inhouse-review').length>0) $blurlink = $(this).find('.rating.inhouse-review > a');
							if($(this).find('.rating.loaded').length>0) $blurlink = $(this).find('.rating.loaded a');
							$blurlink.off('blur.showbtn').on('blur.showbtn', function(e) {
								$(this).closest(".item").addClass("on-focus");
								$(this).closest(".item").siblings().removeClass('on-focus');
								// 20200401 START 박지영 : 모바일에서 불필요한 스크립트 동작하지 않도록 수정 
								if($(this).closest(".item").find('.button a').length>0) {
									if($(window).width() >= 768) $(this).closest(".item").find('.button a').eq(0).focus();
								} else if($(this).closest(".item").find('.wishlist-compare a').length>0) {
									if($(window).width() >= 768) $(this).closest(".item").find('.wishlist-compare a').eq(0).focus();
								}
								// 20200401 END
							});
						});
					}, 1000);

					// -- over, out, focus, blur 이벤트 - 리사이징 시 (only desktop)
					
				}
			};
			mql.maxXs.addListener(resizeEvent);
			//resizeEvent(mql.maxXs); // initial run

		}
	};
	//LGEGMC-383
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
	
	
	$obj.on('click','.file-list a.link-text',function(e){
		e.preventDefault();
		fileDownload($(this));
	});
	

	GPC0003.init();
});
