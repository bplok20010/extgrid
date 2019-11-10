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
	$.dataGrid.fn.extend({
		lockRow : function(rowId){
			var self = this,
				opt = self.configs;
			
			//lazyLoad
			if( opt.lazyLoadRow && self.inArray( rowId,opt.lazyRows ) == -1 ) {
				self._loadRow(rowId);
			}
				
			if( self._lockRow(rowId) ) {
				if( self.inArray(rowId,opt.lockRows) == -1 )
					opt.lockRows.push(rowId);
				//if( !self._eventLocks['onAfterLockRow'] ) {	
				self.fireEvent('onAfterLockRow',[rowId]);
				//}
			  	//self.fireEvent('onViewSizeChange',[]);
				//self.resetViewSize();
				self.methodInvoke('resetViewSize');
			}
		},
		unLockRow : function(rowId){
			var self = this,
				opt = self.configs;
			if( self._unLockRow(rowId) ) {
				var i = 0,
				len = opt.lockRows.length;
				for(;i<len;i++) {
					if(opt.lockRows[i] == rowId) {
						opt.lockRows[i] = null;
					}	
				}
				//取消null
				var _c = [];
				var j = 0,
				len = opt.lockRows.length;
				for(;j<len;j++) {
					if( opt.lockRows[j] !== null ) {
						_c.push( opt.lockRows[j] );	
					}	
				}
				opt.lockRows = _c;
				
				self.onAfterLockRow(rowId);//主要是调用该函数
				//if( !self._eventLocks['onAfterUnLockRow'] ) {
					self.fireEvent('onAfterUnLockRow',[rowId]);
				//}
				//self.fireEvent('onViewSizeChange',[]);
				self.resetViewSize();
			}
		},
		//行列锁
		onLockRow : function(){
			var self = this,
				opt = self.configs;
			var rows = opt.lockRows;
			var i = 0,
				len = rows.length;
			for(;i<len;i++) {
				if(rows[i] == null) continue;
				
				self.lockRow(rows[i]);
			}	
		},
		onAfterLockRow : function(rowId){
			var self = this,
				opt = self.configs;
			
			//self.hideExpandRow(indexid);
			var d_ = self.getRowData(rowId);
			if( $("#"+opt.id+"-expand-row-"+rowId).size() ) {
				var isHidden = $("#"+opt.id+"-expand-row-"+rowId).is(":hidden");
				self.expandRow(rowId,d_['_expand']);
				if( isHidden ) {
					self._hideExpandRow(rowId);
				}
			}
			//修正：当分组开启时 行解锁后不会自动回到分组里
			if( opt.groupBy ) {
				//view2
				var bdy = $("#view2-datagrid-body-btable-tbody-"+opt.id);
				bdy.find("tr.datagrid-group-row").each(function(i){
					var groupId = $(this).attr("datagrid-group-row-id");
					var f = bdy.find("tr[datagrid-group-id='"+groupId+"']").first();
					$(this).insertBefore(f);
				});
				//view1
				var bdy2 = $("#view1-datagrid-body-btable-tbody-"+opt.id);
				bdy2.find("tr.datagrid-group-row-view1").each(function(i){
					var groupId = $(this).attr("datagrid-group-row-id");
					var f = bdy2.find("tr[datagrid-group-id='"+groupId+"']").first();
					$(this).insertBefore(f);
				});
			}
			//取消锁定时位置的时刻刷
			self.changeExpandPos();
 		},
		_lockRow : function(rowId) {
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var render = gid;
			//if( !self._eventLocks['onBeforeLockRow'] ) {
				var r = self.fireEvent('onBeforeLockRow',[rowId]);
				if(r === false) return false;
			//}
			var f = $("#"+opt.id+"-row-"+rowId);
			var f1 = $("#"+opt.id+"-view1-row-"+rowId);
			if( !f.length ) return false; // || f.parents(".datagrid-header").length
			//防止重复锁定 注：不可以开启，否则刷新表格收不会锁行
			//if( self.inArray( rowId,opt.lockRows ) != -1 ) return false;
			
			//移动行
			//view2.find(".datagrid-header .datagrid-header-outer .datagrid-locktable > tbody").first().append(f);
			$("#view2-datagrid-header-outer-locktable-tbody-"+opt.id).append(f);
			//view1.find(".datagrid-header .datagrid-header-outer .datagrid-locktable > tbody").first().append(f1);
			$("#view1-datagrid-header-outer-locktable-tbody-"+opt.id).append(f1);
			
			return true;
		},
		_unLockRow : function(rowId){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var render = gid;
			//if( !self._eventLocks['onBeforeUnlockRow'] ) {
				var r = self.fireEvent('onBeforeUnlockRow',[rowId]);
				if(r === false) return false;
			//}
			var f = $("#"+opt.id+"-row-"+rowId);
			var f1 = $("#"+opt.id+"-view1-row-"+rowId);
			if( !f.length ) return false; // || f.parents(".datagrid-header").length
			//判断当前行是否已经锁定
			if( self.inArray( rowId,opt.lockRows ) == -1 ) return false;
			//console.log("unlock start");
			//修正当上一个元素也锁定的时 找出下一个没有锁定的元素
			//修正所有都锁定的时候 无法取消锁定问题
			var data = opt.data;
			//往上找
			for(var m=rowId-1;m>=-1;m--) {
				if( self.inArray( m,opt.lockRows ) == -1 ) {
					//判断该行是否存在
					if( $("#"+opt.id+"-row-"+m).size() ) {
						break;
					}
				}
			}
			rowId = m;
			
			var $theader2 = $("#view2-datagrid-body-btable-tbody-header-"+opt.id);
			var $theader1 = $("#view1-datagrid-body-btable-tbody-header-"+opt.id);
			
			//移动行
			if(rowId>=0) {
				//rowId -= 1;
				f.insertAfter("#"+opt.id+"-row-"+rowId);
				f1.insertAfter("#"+opt.id+"-view1-row-"+rowId);
			} else if( $theader2.size() && $theader1.size() ){ 
				f.insertAfter($theader2);
				f1.insertAfter($theader1);
			} else {
				//view2.find(".datagrid-body .datagrid-btable > tbody").first().prepend(f);
				$("#view2-datagrid-body-btable-tbody-"+opt.id).prepend(f);
				//view1.find(".datagrid-body .datagrid-btable > tbody").first().prepend(f1);	
				$("#view1-datagrid-body-btable-tbody-"+opt.id).prepend(f1);
			}
			
			return true;	
		}
	}); 
})(jQuery);