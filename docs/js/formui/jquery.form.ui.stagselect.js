/*
jquery.extGrid.stagselect.js 多级联动下拉框
http://www.extgrid.com/form.ui
author:nobo
qq:505931977
QQ交流群:13197510
email:zere.nobo@gmail.com or QQ邮箱

maxHeight:number
maxWidth: number|'auto'
multi : false | true 多选
items.sub = url

*/

;(function($){
	"use strict";
	var stagselectInit = function(){
		var self = this;
		var opt = self.configs;
		function change(){
			var self = this;
			var opt = self.configs;
			var items = self.C('items');
			var value = self.val();
			
			$("#"+opt.id).nextAll('.stag_'+opt.id).remove();
			
			$.each(items,function(i,item){
				if( item.name == value && item.sub!='' ) {
					var _opt = {};
					_opt.url = item.sub;
					_opt.type = 'stagselect';
					_opt.id = '';
					_opt.renderTo = '#'+opt.id;
					_opt.onCreate = function(){
						$("#"+opt.id).after($("#"+this.C('id')));
					}
					var ipt = $("#"+opt.id).extform(_opt);
					
					return false;
				}
			});
			console.log( self.val() );
		}
		if( opt.type == 'stagselect'  ) {
			opt.onCheck.push("onChange");
			opt.type='select';
			opt.cls += ' stag_'+opt.id+' ';
			self.bind("onChange",change);
		}
	};
	$.extForm.puglins.push(stagselectInit);
})(jQuery);