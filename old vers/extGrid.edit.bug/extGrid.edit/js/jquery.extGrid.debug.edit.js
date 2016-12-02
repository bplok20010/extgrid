/*
jquery.extGrid.edit.js
http://www.extgrid.com
author:nobo
qq:505931977
QQ交流群:13197510
email:zere.nobo@gmail.com or QQ邮箱
*/

;(function($){
	"use strict";
	var edits = {
		text : function(cell,rid,field,value){
			
			if( field == 'ck' ) return true;
			
			var grid = this;
			var cedit = $("<div class='cell-text'><input type='text' value='"+value+"'></div>").appendTo(cell).click(function(){return false;});
			$(">input",cedit).bind('blur',function(){
					grid.setFieldValue(rid,field,$(this).val());
					$(cedit).remove();						   
			}).focus().select();
			/*$(document.body).bind("click.edit",function(){
				$(cedit).remove();
				$(document.body).unbind("click.edit");
			});*/
			
			return false;
		}	
	};
	function loadEdit(){
		var self = this;
		self.bind("onClickCell",edits.text,self);
		
	}
	$.extGrid.puglins.push(loadEdit);
})(jQuery);