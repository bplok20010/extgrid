/*
jquery.extGrid.select.js
http://www.extgrid.com/form.ui
author:nobo
qq:505931977
QQ交流群:13197510
email:zere.nobo@gmail.com or QQ邮箱

每个组件都应该提供或实现的接口
组件名+Start
组件名+Create 必须
组件名+BindEvent 必须
组件名+Tpl
组件名+GetValue
组件名+SetValue
组件名+Extend

*/

;(function($){
	"use strict";
	$.extForm.fn.extend({
		dateExtend : function(){
			var self = this;
			var opt = self.configs;
			self.val( opt.value );
		},
		dateStart : function(){
			var self = this;
			var opt = self.configs;
			//opt.cls +=" date-picker ";
			
			//opt.attrs += ' class="date-picker" ';
			//opt.attrs += ' data-date-format="'+dateFormat+'" ';
			
			opt.onCheck.push("onChange");
		},
		dateBindEvent : function(){
			var self = this;
			var opt = self.configs;
			self.commonEvent();
			var text = $("#"+opt.id+"_text");
			$(">span.ui-form-buttons",text).bind({
				click : function(e){
					$("#"+opt.id+"_input")[0].focus();
					return false;
				}						 
			});
			$("#"+opt.id+"_input").blur(function(){
				$("#"+opt.id+"_input_key").val( $("#"+opt.id+"_input").val() );
				setTimeout(function(){
					self.fireEvent('onChange');
					self.checkVal();						
				},10);
			});
			$("#"+opt.id+"_input").change(function(){
				$("#"+opt.id+"_input_key").val( $("#"+opt.id+"_input").val() );								 
			});
			
			var dateFormat = opt.dateFormate || opt.helper.attr("date-format") || 'yyyy-mm-dd';
			
			var isIE6_7 = false;
			var browser=navigator.appName 
			var b_version=navigator.appVersion 
			var version=b_version.split(";"); 
			try{
			var trim_Version=version[1].replace(/[ ]/g,""); 
			} catch(e) {
				trim_Version = ''	
			}
			if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE7.0") 
			{ 
			isIE6_7 = true;
			} 
			else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE6.0") 
			{ 
			isIE6_7 = true;
			} 
			if( isIE6_7 ) {
				
				$("#"+opt.id+"_input").click(function(){
					var self = this;
					WdatePicker({el:self});									  
				});
			} else {
				$("#"+opt.id+"_input").attr("onClick","WdatePicker()");
			}
			return self;	
		},
		
		dateCreate : function(){
			var self = this;
			var opt = self.configs;
			var target = opt.helper;
			
			var render = $(opt.renderTo);
			
			var wraper = $( self.tpl('combo',opt) );
			
			if( render.length ) {
				render.append( wraper );
			} else {
				target.after( wraper ).remove();
			}
			
			opt.helper = wraper;	
		}
	});
})(jQuery);