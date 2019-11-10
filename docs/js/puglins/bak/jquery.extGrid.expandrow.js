/*
jquery.extGrid.expandrow.js
http://www.extgrid.com
author:nobo
qq:505931977
QQ交流群:13197510
email:zere.nobo@gmail.com or QQ邮箱

+----------------------------------------------------------------------------------------------------------------------------+
*/

;(function($){
	"use strict";
	$.extGrid.puglins.push(function(){
		var self = this,
			opt = self.configs;
		//防止重复绑定	
		self.unbind("onShowGrid.expandrow");
		self.unbind("onClickRow.expandrow");
		self.unbind("onFieldWidthChange.expandrow");
		self.unbind("onForceFitColumn.expandrow");
		self.unbind("onShowColumn.expandrow");
		self.unbind("onHideColumn.expandrow");
		
		//事件绑定
		self.bind("onShowGrid.expandrow",self.autoExpand);
		//单击展示_expand
		self.bind("onClickRow.expandrow",self.setExpandEvent);
		self.bind("onFieldWidthChange.expandrow",self.setExpandRowSize);
		self.bind("onForceFitColumn.expandrow",self.setExpandRowSize);
		self.bind("onShowColumn.expandrow",self.setExpandRowSize);
		self.bind("onHideColumn.expandrow",self.setExpandRowSize);
	});
	$.dataGrid.fn.extend({
		setExpandEvent : function(t,rowId,rowData){
			var self = this;
			var opt = self.configs;
			
			if( !$.isPlainObject(rowData) ) {
				return;	
			}
			
			if('_expand' in rowData) {
				if( !self.isExpandRowShow(rowId) )
					self.expandRow(rowId,rowData['_expand']);	
				else 
					self.hideExpandRow(rowId);	
			}
		},
		//当行的宽度改变时expand row的大小也要随之改变
		setExpandRowSize : function(){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var render = gid+" .datagrid-view2";
			$(render).find(".datagrid-row-expand").each(function(i){
					var rowId = $(this).attr("datagrid-expand-row-index");	
					var obj = $("#"+opt.id+"-row-"+rowId);
					var width = obj.width();
					
					/*obj.find(">td").each(function(i){
						if( !$(this).is(":hidden") ) {
							width += $(this).find(".datagrid-cell").outerWidth();
						}
					});
					$(this).find(".datagrid-cell-expand").width(width);*/
					$("#"+opt.id+"-expand-row-"+rowId+"_td")._outerWidth(width);
			});
		},
		resetExpandRowHeight : function(rid){
			var self = this,
				opt = self.configs;	
			var _expand_id = $("#"+opt.id+"-expand-row-"+rid);
			var _expand_view1_id = $("#"+opt.id+"-expand-view1-row-"+rid);
			if( _expand_view1_id.size() ) {
				_expand_view1_id._outerHeight( _expand_id._outerHeight() );	
			}
		},
		isExpandRowShow : function(rowId){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var _expand_id = opt.id+"-expand-row-"+rowId;
			
			return ( $("#"+_expand_id).size() && !$("#"+_expand_id).is(":hidden") ) ? true : false;
		},
		//判断当前expandRow是否已经存在 如果不存在则重新创建,如果存在则显示
		expandRow : function(rowId,html){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
		
			var e = opt.events;
			var rowId = typeof rowId === 'undefined' ? false : rowId;
			if(rowId === false) return self;
			var html = typeof html === 'undefined' ? "" : html;
			var data = self.getRowData(rowId);
			html = self.tpl(html,data);//可以是模版
			var obj = $("#"+opt.id+"-row-"+rowId);
			var obj1 = $("#"+opt.id+"-view1-row-"+rowId);
			
			if(obj.size()<=0) return self;
			
			var _expand_id = opt.id+"-expand-row-"+rowId;
			if( $("#"+_expand_id).size() ) {
				obj.after( $("#"+_expand_id) );
			} else {
				
				var width = obj.width();
				
				/*obj.find(">td").each(function(i){
					if( !$(this).is(":hidden") ) {
						width += $(this).find(".datagrid-cell").outerWidth();
					}
				});*/
				
				//var _expand = $("<tr id='"+_expand_id+"' class='datagrid-row-expand' datagrid-expand-row-index='"+rowId+"'><td colspan='"+opt.columns.length+"'><div class=' datagrid-cell-expand' style='overflow:hidden;width:"+width+"px'>"+html+"</div></td></tr>");
				var _expand = $("<tr id='"+_expand_id+"' class='datagrid-row-expand' datagrid-expand-row-index='"+rowId+"'><td id='"+_expand_id+"_td' colspan='"+opt.columns.length+"'><div class='datagrid-cell-expand' id='"+_expand_id+"_cell' style='overflow:hidden;'></div></td></tr>");
				//判断html是否纯文字或者是选择器or标签
				try {
					if( $(html).size() ) {
						_expand.find("div.datagrid-cell-expand").append( $(html).show() );
					} else {
						_expand.find("div.datagrid-cell-expand").html( html );
					}
				} catch(e) {
					_expand.find("div.datagrid-cell-expand").html( html );	
				}
				obj.after(_expand);	
				_expand.find("#"+_expand_id+"_td")._outerWidth(width);
			}
			
			var _expand_view1_id = opt.id+"-expand-view1-row-"+rowId;
			
			if( opt.rowNumbersWidth!==false || opt.lockColumns.length ) {
				$("#"+_expand_view1_id).remove();//重新生成rownumbers cell 不需要在计算跨列
				var tds = 0;
				var td = "";
				if(opt.lockColumns.length) {
					var k = 0,
						len = opt.lockColumns.length;
					for(;k<len;k++) {
						if(opt.lockColumns[k] != null) tds++;
					}
				}
				if(tds) {
					td = '<td colspan="'+tds+'" class="datagrid-cell-rownumber-expand"></td>'	
				}
				var _expand_view1 = $("<tr id='"+_expand_view1_id+"' style='overflow:hidden;'  class='datagrid-row datagrid-row-view1' datagrid-expand-row-index='"+rowId+"'><td class='datagrid-td-rownumber'><div class='datagrid-cell-view1-expand'></div></td>"+td+"</tr>");
				obj1.after(_expand_view1);
				
				//IE 6 7下还是无效 
				var h = $("#"+_expand_id).height();
				$("#"+_expand_view1_id).height(h);
				//修正ie 6 7多出1px问题
				if(h != $("#"+_expand_view1_id).height()) {
					var h = $("#"+_expand_view1_id).height();
					$("#"+_expand_view1_id).height( h-1 );
				}
			}
			var _expand = $.dataGrid._undef(_expand,$("#"+_expand_id));
			var _expand_view1 = $.dataGrid._undef(_expand_view1,$("#"+_expand_view1_id));
			
			if( self.isRowHidden(rowId) ) {
				_expand.hide();
				_expand_view1.hide();
			} else {
				_expand.show();
				_expand_view1.show();
			}
			var h = _expand.height();
			_expand_view1.css({ height:h });
			
			self.fireEvent('onExpandRow',[rowId]);
			
			//self.fireEvent('onViewSizeChange',[]);
			//self.resetViewSize();
			self.methodInvoke("resetViewSize");
		},
		_hideExpandRow : function(rowId){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var rowId = typeof rowId === 'undefined' ? false : rowId;
			if(rowId === false) return self;
			
			var _expand_id = opt.id+"-expand-row-"+rowId;
			var _expand_view1_id = opt.id+"-expand-view1-row-"+rowId;
			
			//$("#"+_expand_id).remove();
			//$("#"+_expand_view1_id).remove();
			
			$("#"+_expand_id).hide();
			$("#"+_expand_view1_id).hide();
			
			self.fireEvent('onHideExpandRow',[rowId]);
		},
		hideExpandRow : function(rowId){
			var self = this;
			
			self._hideExpandRow(rowId);
			
			//self.fireEvent('onViewSizeChange',[]);
			self.resetViewSize();
		},
		destroyExpandRow : function(rowId){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var rowId = typeof rowId === 'undefined' ? false : rowId;
			if(rowId === false) return self;
			
			var _expand_id = opt.id+"-expand-row-"+rowId;
			var _expand_view1_id = opt.id+"-expand-view1-row-"+rowId;
			
			$("#"+_expand_id).remove();
			$("#"+_expand_view1_id).remove();
			
			//self.fireEvent('onViewSizeChange',[]);
			//self.resetViewSize();
			self.methodInvoke('resetViewSize');
		},
		updateExpandRow : function(rowId,html){
			var self = this;
			self.destroyExpandRow( rowId );
			self.expandRow( rowId,html );
		},
		changeExpandPos : function(){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			$("#view2-datagrid-body-btable-tbody-"+opt.id).find(".datagrid-row-expand").each(function(i){
				if( !$(this).is(":hidden") ) {
					var rowId = $(this).attr("datagrid-expand-row-index");
					self.expandRow(rowId,"");
				}
			});
		},
		//当数据中包含 _expand _openExpand=true的时候调用
		autoExpand : function(){
			var self = this;
			var opt = self.configs;
			var i = 0,
				len = opt.data.length;
			var tr = $(">tr.datagrid-row","#view2-datagrid-body-btable-tbody-"+opt.id);	
			self.showLoading();
			setTimeout(function(){
				tr.each(function(){
					var data = $(this).data('rowData');	
					var rid = $(this).attr('datagrid-rid');	
					if( $.isPlainObject(data) && ('_expand' in data) && ('_openExpand' in data) && data['_openExpand'] ) {
						//self._denyEvent = true;
						self.lockMethod("resetViewSize")
						self.expandRow(rid,data['_expand']);
						self.unLockMethod("resetViewSize")
						//self._denyEvent = false;
						//self.denyEventInvoke("expandRow",[rid,html]);
	
					}
				});	
				self.hideLoading();
				if( tr.size() ) {
					self.methodInvoke("resetViewSize");
				}
			},0);
		}
	}); 
})(jQuery);