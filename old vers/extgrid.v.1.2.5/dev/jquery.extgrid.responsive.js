/*
自适应插件
jquery.extgrid.responsive.js
v1.0
开启参数 : responsive=true|false,默认false 

http://www.extgrid.com
author:nobo
qq:505931977
QQ交流群:13197510
email:zere.nobo@gmail.com or QQ邮箱
*/

;(function($){
	"use strict";
	function _responsive() {
		var self = this;
		var responsive = self.C("responsive") == 'undefiend' ? false : self.C("responsive");
		var target = self.configs.helper;
		if( responsive ) {
			self.rwidth = 0;
			self.rheight = 0;
			if( target.is("body") ) {
				$(window).resize(function(e){
					self.setWH( $(window).width(),$(window).height() );						  
				});	
				setTimeout(function(){
					$(window).resize();				
				},0);
			} else {
				var t;
				t = setInterval(function(){
					if( $( "#"+self.C("id") ).length ) {
						var w = target.width();
						var h = target.height();
						if( w != self.rwidth || h != self.rheight ) {
							self.setWH( w,h );
							self.rwidth = w;
							self.rheight = h;
						}			
					} else {
						clearInterval(t);	
					}					 
				},100);
			}
		}
	}
	function responsive(){
		var self = this;
		
		self.bind("onFinish",_responsive,self);
	}
	$.extGrid.puglins.push(responsive);
})(jQuery);