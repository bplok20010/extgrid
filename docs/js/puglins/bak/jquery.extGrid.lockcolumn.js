/*
jquery.extGrid.search.js
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
		self.unbind("onShowGrid.lockcolumn");
		self.unbind("onAfterLockRow.lockcolumn");
		self.unbind("onShowLazyRows.lockcolumn");
		self.unbind("onUpdateHeaderRow.lockcolumn");
		self.unbind("onUpdateFooterRow.lockcolumn");
		self.unbind("onAfterAddRow.lockcolumn");
		
		//事件绑定
		self.bind("onShowGrid.lockcolumn",self.onLockColumn);
		self.bind("onAfterLockRow.lockcolumn",self.onAfterLockColumn);
		self.bind("onAfterAddRow.lockcolumn",self.onLockColumn);//锁列
		self.bind("onShowLazyRows.lockcolumn",self.onLockColumn);//锁列
		self.bind("onUpdateHeaderRow.lockcolumn",self.onLockColumn);
		self.bind("onUpdateFooterRow.lockcolumn",self.onLockColumn);
	});
	$.dataGrid.fn.extend({
		unLockColumn : function(field){
			var self = this,
				opt = self.configs;
			if( self._unLockColumn(field) ) {
				var i = 0,
				len = opt.lockColumns.length;
				for(;i<len;i++) {
					if(opt.lockColumns[i] == field) {
						opt.lockColumns[i] = null;
					}	
				}
				//取消null
				var _c = [];
				var j = 0,
				len = opt.lockColumns.length;
				for(;j<len;j++) {
					if( opt.lockColumns[j] !== null ) {
						_c.push( opt.lockColumns[j] );	
					}	
				}
				opt.lockColumns = _c;
				
				self.onAfterLockColumn(field);//主要是调用该函数
				//if( !self._eventLocks['onAfterUnLockColumn'] ) {
					self.fireEvent('onAfterUnLockColumn',[field]);
				//}
				//self.fireEvent('onViewSizeChange',[]);
				self.resetViewSize();
			}
		},
		lockColumn : function(field){
			var self = this,
				opt = self.configs;
			if( self._lockColumn(field) ) {
				if(self.inArray(field,opt.lockColumns)  == -1 )
					opt.lockColumns.push(field);
				//if( !self._eventLocks['onAfterLockColumn'] ) {	
					self.fireEvent('onAfterLockColumn',[field]);
				//}
				//self.fireEvent('onViewSizeChange',[]);
				//self.resetViewSize();
				self.methodInvoke('resetViewSize');
			}
		},
		onLockColumn : function(){
			var self = this,
				opt = self.configs;
			var columns = opt.lockColumns;
			setTimeout(function(){
				var i = 0,
					len = columns.length;
				for(;i<len;i++) {
					self.lockColumn(columns[i]);
				}						
			},0);
			
		},
		onAfterLockColumn : function(field){
			var self = this,
				opt = self.configs;
			var gid = opt.gid;
			//expand事件 重新创建left row的td
			$("#view2_"+opt.id).find("tr.datagrid-row-expand").each(function(i){
				var indexid = $(this).attr("datagrid-expand-row-index");
				var isHidden = $(this).is(":hidden");
				//self.hideExpandRow(indexid);
				var d_ = self.getRowData(indexid);
				if( $("#"+opt.id+"-expand-row-"+indexid).size() ) {
					self.expandRow(indexid,d_['_expand']);
					if( isHidden ) {
						self.hideExpandRow(indexid);
					}
				}
			});
			//取消锁定时位置的时刻刷新
			//self.changeExpandPos();
			//锁定列是 修改expandRow的大小
			self.setExpandRowSize();
			//group 事件
			self.addGroupRow();
		},
		_lockColumn : function(field) {
			var self = this,
				opt = self.configs,
				data = opt.data,
				gid = opt.gid;
			var render = gid;
			
			//如果rowNumbersWidth == false 则不能进行列锁
			if( opt.rowNumbersWidth===false ) { 
				return false;
			}
			//if( !self._eventLocks['onBeforeLockColumn'] ) {
				var r = self.fireEvent('onBeforeLockColumn',[field]);
				if(r === false) return false;
			//}
			var fields = self.getColumnList();
			var field = $.isArray(field) ? field : [field];
			
			var view1_header_hbody_id = "#view1-datagrid-header-inner-htable-tbody-"+opt.id;
			var view1_header_lockbody_id = "#view1-datagrid-header-outer-locktable-tbody-"+opt.id;
			//移动列
			var i = 0,
				len = field.length;
			for(;i<len;i++) {
				if(field[i] == null) continue;	
				if( self.inArray( field[i],fields ) == -1 ) continue;
				//防止重复锁定 注：不可以开启，否则刷新表格收不会锁行
				//if( self.inArray( field[i],opt.lockColumns ) != -1 ) continue;
				
				var f = $("#view2-datagrid-header-inner-htable-tbody-"+opt.id).find(">tr.datagrid-header-row td[field='"+field[i]+"']");
				
				$(view1_header_hbody_id).find(">tr.datagrid-header-row").append(f);
				
				$("#view2-datagrid-header-outer-locktable-tbody-"+opt.id).find(">tr.datagrid-row td[field='"+field[i]+"']").each(function(i){
					var rowId = $(this).parent().attr("datagrid-rid");
					var getRn = self._getRowNumber(rowId);
					if( getRn.isNew ) {
						$("#view1-datagrid-header-outer-locktable-tbody-"+opt.id).append(getRn.node);
					}
					$(this).appendTo( getRn.node );
				});
				
				$("#view2-datagrid-body-btable-tbody-"+opt.id).find(">tr.datagrid-row td[field='"+field[i]+"']").each(function(i){
					var rowId = $(this).parent().attr("datagrid-rid");
					var getRn = self._getRowNumber(rowId);
					if( getRn.isNew ) {
						$("#view1-datagrid-body-btable-tbody-"+opt.id).append(getRn.node);
					}
					$(this).appendTo( getRn.node );
				});
				
				$("#view2-datagrid-footer-ftable-tbody-"+opt.id).find(">tr.datagrid-row td[field='"+field[i]+"']").each(function(i){
					var rowId = $(this).parent().attr("datagrid-rid");
					var getRn = self._getFooterRowNumber(rowId);
					if( getRn.isNew ) {
						$("#view1-datagrid-footer-ftable-tbody-"+opt.id).append(getRn.node);
					}
					$(this).appendTo( getRn.node );
				});
			}
			
			return true;
		},
		_unLockColumn : function(field) {
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var render = gid;
			//if( !self._eventLocks['onBeforeUnlockColumn'] ) {
				var r = self.fireEvent('onBeforeUnlockColumn',[field]);
				if(r === false) return false;
			//}
			var fields = self.getColumns();
			var isField = false;
			var i = 0,
				len = fields.length;
			for(;i<len;i++) {
				if(fields[i]['field'] == field) {
					isField = true;
					break;
				}
			}
			if( !isField ) return false;
			//判断当前列是否已经不存在锁定
			if( self.inArray( field,opt.lockColumns ) == -1 ) return false;
			
			//var f = $(render).find(".datagrid-header tr.datagrid-header-row td[field='"+field+"']");
			var f = $("#view1-datagrid-header-inner-htable-tbody-"+opt.id).find(">tr.datagrid-header-row td[field='"+field+"']");
			
			var view = $(gid);
			//var view1 = $(render).find(".datagrid-view1");
			//var view2 = $(render).find(".datagrid-view2");
			var view1 = $("#view1_"+opt.id);
			var view2 = $("#view2_"+opt.id);
			
			//移动field 列 到 view1
			var pos = i;
			//修正所有都锁定的时候 无法取消锁定问题
			var m = 0,
				len = fields.length;
			for(;m<len;m++) {
				if( fields[m]['field'] == field ) break;	
			}
			for(m=m-1;m>=-1;m--) {
				if(m<0) break;
				var _field = fields[m]['field'];
				if( self.inArray( _field,opt.lockColumns ) == -1 ) {
					break;
				}
			}
			pos = m;
			//pos = pos < 0 ? 0 : pos;
			
			if( pos < 0) {
				f.prependTo( $("#view2-datagrid-header-inner-htable-tbody-"+opt.id).find(">tr.datagrid-header-row") );
			} else {
				f.insertAfter( $("#view2-datagrid-header-inner-htable-tbody-"+opt.id).find(">tr.datagrid-header-row").find("td[field]").eq(pos) );	
			}
			//移动单元格
			$("#view1-datagrid-header-outer-locktable-tbody-"+opt.id).find(">tr.datagrid-row td[field='"+field+"']").each(function(i){
				var tr = $(this).parent();
				var rowId = tr.attr("datagrid-rid");
				//$(this).appendTo( view.find("#"+opt.id+"-row-"+indexid) );
				var view2_tr = $("#"+opt.id+"-row-"+rowId);
				if( pos < 0) {
					view2_tr.prepend( $(this) );
				} else {
					view2_tr.find(">td").eq(pos).after( $(this) );	
				}
				
			});
			$("#view1-datagrid-body-btable-tbody-"+opt.id).find(">tr.datagrid-row td[field='"+field+"']").each(function(i){
				var tr = $(this).parent();
				var rowId = tr.attr("datagrid-rid");
				//$(this).appendTo( view.find("#"+opt.id+"-row-"+indexid) );
				var view2_tr = $("#"+opt.id+"-row-"+rowId);
				if( pos < 0) {
					view2_tr.prepend( $(this) );
				} else {
					view2_tr.find(">td").eq(pos).after( $(this) );	
				}
				
			});
			
			$("#view1-datagrid-footer-ftable-tbody-"+opt.id).find(">tr.datagrid-row td[field='"+field+"']").each(function(i){
				var tr = $(this).parent();
				var rowId = tr.attr("datagrid-rid");
				//$(this).appendTo( view.find("#"+opt.id+"-row-"+indexid) );
				var view2_tr = $("#"+opt.id+"-footer-row-"+rowId);
				if( pos < 0) {
					view2_tr.prepend( $(this) );
				} else {
					view2_tr.find(">td").eq(pos).after( $(this) );	
				}
			});
			
			//self.onAfterLockColumn(field);
			
			return true;	
		}
	}); 
})(jQuery);