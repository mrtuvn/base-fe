var compareCookie = {
	name: ($('.navigation') && $('.navigation').hasClass('b2b')) ? 'LG5_B2B_CompareCart' : 'LG5_CompareCart',
	cookie: null,
	add: function(productId){
		this.cookie = getCookie(this.name);
		if(this.cookie) {
			this.cookie = this.cookie.indexOf('|') >= 0 ? this.cookie.split('|') : [this.cookie];

			if(this.cookie.indexOf(productId) < 0) {
				this.cookie.unshift(productId);
			}
			this.cookie = this.cookie.join('|');
		}else {
			this.cookie = productId;
		}
		
		if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
			setCookie(this.name, this.cookie, true);
		}
	},
	remove: function(productId){
		if(productId) {
			this.cookie = getCookie(this.name);
			if(this.cookie) {
				var idx;
				this.cookie = this.cookie.indexOf('|') >= 0 ? this.cookie.split('|') : [this.cookie];
				idx = this.cookie.indexOf(productId);
				if(idx >= 0) {
					this.cookie.splice(idx, 1);
				}
				this.cookie = this.cookie.join('|');
			}
		} else {
			this.cookie = '';
		}
		if(this.cookie == '' || !this.cookie) {
			removeCookie(this.name, true);
		}else {
			if(typeof ePrivacyCookies=='undefined' || ePrivacyCookies.get('LGCOM_IMPROVEMENTS')) {
				setCookie(this.name, this.cookie, true);
			}
		}
	}
};