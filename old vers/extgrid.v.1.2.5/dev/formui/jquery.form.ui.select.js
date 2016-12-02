/*
jquery.extGrid.select.js
http://www.extgrid.com/form.ui
author:nobo
qq:505931977
QQ交流群:13197510
email:zere.nobo@gmail.com or QQ邮箱

maxHeight:number
maxWidth: number|'auto'
multi : false | true 多选

每个组件都应该提供或实现的接口
组件名+Start
组件名+Create 必须
组件名+BindEvent 必须
组件名+Tpl
组件名+GetValue
组件名+SetValue
组件名+ValueChange
组件名+Extend

*/

;(function($){
	"use strict";
	var selectInit = function(){
		var self = this;
		var opt = self.configs;
		//表单生成时
		if( opt.type=='multiselect' ) {
			opt.type='select';
			opt.multi = true;
			opt.onCheck.push("onChange");
		}
		
		var isSelect = opt.helper.is("select");
		
		if( isSelect  ) {
			
			opt.type='select';
			if( !opt.items.length ) {
				
				var items = [];
				opt.helper.find(">option").each(function(){
					var item = {};
					item.name = $(this).val();
					item.value = $(this).html();
					item.disabled = $(this).attr("disabled");
					item.selected = $(this).attr("selected");
					items.push(item);
				});	
				opt.items = items;
			
			}
		}
		if( opt.type == 'select' ) {
			opt.onCheck.push("onChange");	
		}
	};
	$.extForm.puglins.push(selectInit);
	$.extForm.fn.extend({
		
		selectExtend : function(){
			var self = this;
			var opt = self.configs;
			self.bind("onClick",self.showSelect,self);
			//默认选中项
			var self = this;
			var opt = self.configs;
			var items = opt.items;
			//var selects = opt.value.split(",");
			for( var x=0;x<items.length;x++ ) {
				items[x] = $.extend(true,{},opt._item,items[x]);
				if( items[x]['selected'] ) {
					self.selectSetValue( items[x].name,items[x].value );
				}
			}
			//创建显示下拉框
			self.creteSelectList();
		},
		selectStart : function(){
			var self = this;
			var opt = self.configs;
			opt.attrs += 'readonly';
			
			
		},
		selectDestroy : function(){
			var self = this;
			var opt = self.configs;
			$("#"+opt.id+"_list").remove();
		},
		selectGetValue : function(){
			var self = this;
			var opt = self.configs;
			var input = $("#"+opt.id+"_input_key");
			return input.val();
		},
		//name,value
		selectSetValue : function(){
			var self = this;
			var opt = self.configs;
			var input = $("#"+opt.id+"_input");
			var input_key = $("#"+opt.id+"_input_key");	
			
			if( arguments.length == 2 ) {
				input.val(arguments[1]);
				input_key.val(arguments[0]);
			} else {
				//input.val(arguments[0]);
				//input_key.val(arguments[0]);	
				if( opt.multi ) {
					$.each( arguments[0].split(","),function(i,value){
						self.selectItem(value);				  
					} );	
				} else {
					self.selectItem(arguments[0]);
				}
			}
			
			return self;
		},
		selectValueChange : function(){
			var self = this;
		//	self.fireEvent("onChange");
			return self;	
		},
		selectBindEvent : function(){
			var self = this;
			var opt = self.configs;
			self.commonEvent();
			var obj = $("#"+opt.id+"_text");
			obj.bind("click",function(){
				//return false;						  
			})
			return self;	
		},
		selectCreate : function(){
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
		},
		selectUpdateValue :　function(){
			var self = this;
			var opt = self.configs;
			var selects = $("#"+opt.id+"_list_body").find(">div.ui-form-select-list-item-selected");
			var name = [];
			var value = []
			selects.each(function(){
				name.push($(this).attr("value"));		
				value.push($(this).html());		
			});
			self.val( name.join(","),value.join(",") );
			return self;
		},
		creteSelectList : function(){
			var self = this;
			var opt = self.configs;
			var list = [];
			//创建
			list.push('<div id="'+opt.id+'_list" class="ui-form-select-list" tabindex="-1" style="display:none;">');
				list.push('<div id="'+opt.id+'_list_body" class="ui-form-select-list-body" tabindex="-1" style="">');
					var items = opt.items;
					for( var x=0;x<items.length;x++ ) {
						items[x] = $.extend(true,{},opt._item,items[x]);
						if( items[x]['disabled'] ) {
							items[x]['cls'] += ' ui-form-select-list-item-disabled ';	
						}
						if( items[x]['selected'] ) {
							items[x]['cls'] += ' ui-form-select-list-item-selected ';
						}
						list.push('<div value="'+items[x]['name']+'" class="ui-form-select-list-item '+items[x]['cls']+'" id="'+opt.id+'_'+x+'_item">'+items[x]['value']+'</div>');	
					}
					
				list.push('</div>');
			list.push('</div>');
			
			list = $( list.join("") ).appendTo(document.body);
			
			//事件绑定
			var events = {
				selectstart : function(e){
					return false;	
				},
				mouseenter : function(e){
					if( $(this).hasClass('ui-form-select-list-item-disabled') ) return;
					$(this).addClass("ui-form-select-list-item-over");
				},
				mouseleave : function(e){
					if( $(this).hasClass('ui-form-select-list-item-disabled') ) return;
					$(this).removeClass("ui-form-select-list-item-over");
				},
				click : function(e) {
					if( $(this).hasClass('ui-form-select-list-item-disabled') ) return false;
					var name = $(this).attr('value');
					var value = $(this).html();
					opt.multi = $.extForm._undef(opt.multi,false);
					if( !opt.multi ) {//单选
						$("#"+opt.id+"_list_body").find(">div.ui-form-select-list-item").removeClass("ui-form-select-list-item-selected");
						$(this).addClass("ui-form-select-list-item-selected");
						//self.val(name,value);
						self.selectUpdateValue();		
						self.hideSelect();
					} else {//多选
						
						if( $(this).hasClass("ui-form-select-list-item-selected") ) {
							$(this).removeClass("ui-form-select-list-item-selected");
						} else {
							$(this).addClass("ui-form-select-list-item-selected");
						}
						
						self.selectUpdateValue();
						
						return false;
					}
					
				}
			};
			$(".ui-form-select-list-item",list).bind(events);
				
			return list;
		},
		destroySelectList : function(){
			var self = this;
			var opt = self.configs;
			
			var list = $('#'+opt.id+'_list');
			
			list.remove();
			$(document).unbind("click.selectList"+opt.id);		
		},
		hideSelect : function(){
			var self = this;
			var opt = self.configs;
			
			var list = $('#'+opt.id+'_list');
			list.css({
				width:'auto',
				height:'auto'
			});
			list.hide();
		},
		selectItem : function(name){
			var self = this;
			var opt = self.configs;	
			name = $.extForm._undef(name,false);
			if( name === false ) return self;
			
			var items = opt.items;
			
			opt.multi = $.extForm._undef(opt.multi,false);
			if( !opt.multi ) {//单选模式下
				$("#"+opt.id+"_list_body").find(">div.ui-form-select-list-item").removeClass("ui-form-select-list-item-selected");	
			}
			
			for( var x=0;x<items.length;x++ ) {
				items[x] = $.extend(true,{},opt._item,items[x]);
				if( items[x].name == name ) {
					$("#"+opt.id+'_'+x+"_item").removeClass("ui-form-select-list-item-selected")
											   .addClass("ui-form-select-list-item-selected");
					break;
				}
			}
			self.selectUpdateValue();
			return self;
		},
		unSelectItem : function(name){
			var self = this;
			var opt = self.configs;	
			name = $.extForm._undef(name,false);
			if( name === false ) return self;
			
			var items = opt.items;
			for( var x=0;x<items.length;x++ ) {
				items[x] = $.extend(true,{},opt._item,items[x]);
				if( items[x].name == name ) {
					$("#"+opt.id+'_'+x+"_item").removeClass("ui-form-select-list-item-selected");
					break;
				}
			}	
			self.selectUpdateValue();
			return self;
		},
		
		showSelect : function(input){
			
			if( $(input).attr("disabled") ){
				return self;	
			}
			
			var self = this;
			var opt = self.configs;
			
			var list = $('#'+opt.id+'_list');
			var obj = $("#"+opt.id+"_text");
			var space = self.getShowSpace();
			//取消绑定
			$(document).unbind("click.selectList"+opt.id);		
			
			//判断是否创建
			if( !list.length ) {
				list = self.creteSelectList();
			}
			
			if( !list.is(":hidden") ) {
				self.hideSelect();
				return self;
			}
			
			//显示
			var h = list.outerHeight();
			var w = list.outerWidth();
			var offset = obj.offset();
			var border_top = parseInt( list.css("border-top-width") );
			var border_bottom = parseInt( list.css("border-bottom-width") );
			var border_left = parseInt( list.css("border-left-width") );
			var border_right = parseInt( list.css("border-right-width") );
			
			
			opt.maxHeight = $.extForm._undef(opt.maxHeight,Math.max(space.bottom,space.top));
			opt.maxWidth = $.extForm._undef(opt.maxWidth, obj.outerWidth() );
			
			list.removeClass('ui-form-select-list-bottom-auto')
				.removeClass('ui-form-select-list-top-auto')
				.removeClass('ui-form-select-list-top')
				.removeClass('ui-form-select-list-bottom');
			
			//计算大小
			if( h>opt.maxHeight ) {
				h = opt.maxHeight;		
			}
			
			
			//显示方位
			var showPos = 'bottom';
			if( h<=space.bottom) {//显示在下方
				list.css({
					top : offset.top + obj.outerHeight(),
					left : offset.left
						 });
				list.addClass('ui-form-select-list-bottom');
			} else if( space.top > space.bottom ) {//显示在上方
				list.css({
					top:offset.top - h,
					left : offset.left
						 });
				list.addClass('ui-form-select-list-top');
				showPos = 'top';
			} else {//显示在下方
				list.css({
					top : offset.top + obj.outerHeight(),
					left : offset.left
						 });
				list.addClass('ui-form-select-list-bottom');	
			}
			
			h = h - border_top - border_bottom;
			
			list.height( h );	
			
			
			if( opt.maxWidth == 'auto' ) {
				if( w < obj.outerWidth() ) {
					w = obj.outerWidth();
				} else {
					if( w > ( space.right+obj.outerWidth() ) ) {
						list.addClass("ui-form-select-list-"+showPos+"-auto");
						w = space.right+obj.outerWidth();
					} else if( w<obj.outerWidth() ) {
						w = obj.outerWidth();	
					} else {
						list.addClass("ui-form-select-list-"+showPos+"-auto");	
					}
				}
			} else {
				if( w >= opt.maxWidth && w > obj.outerWidth() ) {
					list.addClass("ui-form-select-list-"+showPos+"-auto");
					w = opt.maxWidth;		
				} else {
					w = obj.outerWidth();	
				}
				
			}
			
			w = w - border_left - border_right;
			list.width( w );
			
			list.show();
			
			//取消绑定
			setTimeout(function(){
				$(document).bind("click.selectList"+opt.id,function(e){
					self.hideSelect();											 
				});						
			},0);
			
		}
	});
})(jQuery);