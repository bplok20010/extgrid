/*
jquery.extGrid.spinner.js
http://www.extgrid.com/form.ui
author:nobo
qq:505931977
QQ交流群:13197510
email:zere.nobo@gmail.com or QQ邮箱

step:1


*/

;(function($){
	"use strict";
	var spinnerInit = function(){
		var self = this;
		var opt = self.configs;
		//js 浮点运算BUG eg: 7*0.8
		/*var fixFloat = function(num,step){
			var step = step.toString().split(".");
			if( step.length == 1 ) {
				return num;	
			}
			var l = step[1].length;
			var num = num.toString().split(".");
			if( num[1].length ) {
				num[1].substr(0,l);
			}
			return Number( num.join(".") );
		}*/
		var onSpinnerUp = function(){
			var self = this;
			var opt = self.configs;	
			opt.step = Number( opt.step );
			var v = Number(self.val())+opt.step
			if( opt.smax !== null ) {
				if( v>opt.smax ) return;
			}
			self.val( v );
		};
		var onSpinnerDown = function(){
			var self = this;
			var opt = self.configs;		
			opt.step = Number( opt.step );
			var v = Number(self.val())-opt.step
			if( opt.smin !== null ) {
				if( v<opt.smin ) return;
			}
			self.val( v );
		};
		if( opt.type=='spinner' ) {
			opt.onCheck.push("onChange");
			self.bind("onSpinnerUp",onSpinnerUp);
			self.bind("onSpinnerDown",onSpinnerDown);
			if( opt.smax !== null ) {
				opt.rules.push( {max:Number(opt.smax)} );
			}
			if( opt.smin !== null ) {
				opt.rules.push( {min:Number(opt.smin)} );
			}
		}
	};
	$.extForm.puglins.push(spinnerInit);
})(jQuery);