/*
jquery.extGrid.mergecell.js
http://www.extgrid.com
author:nobo
qq:505931977
QQ交流群:13197510
email:zere.nobo@gmail.com or QQ邮箱
//大数据部分支持单元格合并

*/

;(function($){
	"use strict";
	$.extGrid.puglins.push(function(){
		var self = this;
		
	});
	
	$.extGrid.fn.extend({
		mergeList : [],
		//检查当前单元格是否处于合并状态 @_m : true 返回合并对象,false 返回boolean 默认:false
		isMergeCell : function(rid,field,_m){
			var self = this;
			var opt = self.configs;	
			var _m = $.dataGrid._undef( _m,false );
			for( var m=0;m<self.mergeList.length;m++ ) {
				var _mlist = self.mergeList[m];
				if( _mlist.rid == rid && _mlist.field == field ) {
					return _m ? m : true;	
				}
				for( var y=0;y<_mlist.mCells.length;y++ ) {
					var _mc = _mlist.mCells[y];
					if( _mc.rid == rid && _mc.field == field ) {
						return _m ? m : true;	
					}
				}
			}
			return false;
		},
		unMergeCells : function( rid,field ){
			var self = this;
			var opt = self.configs;	
			var mergeID = self.isMergeCell( rid,field,true );
			var merge = self.mergeList[mergeID];
			if( !merge ) {
				return false;	
			}
			
			var tid = $("#"+opt.id+"_"+merge.field+"_row_"+merge.rid+"_td");
			tid.attr({
				rowspan : 1,
				colspan : 1
			});
			
			for( var c=0;c<merge.mCells.length;c++ ) {
				var _mcell = merge.mCells[c];
				var mtid = 	$("#"+opt.id+"_"+_mcell.field+"_row_"+_mcell.rid+"_td");
				$(mtid).show();
			}
			self.mergeList.splice(mergeID,1);
			return true;
		},
		/*
			@merge: object
				rid,field,rowspan,colspan
			@_col : true(如果合并过程中发现需要合并的单元格被其他合并单元格占用则取消被占用的单元格合并) | false 默认false	
		*/
		mergeCells : function( merge,_col ){
			var self = this;
			var opt = self.configs;
			var merge = $.dataGrid._undef( merge,{} );
			var _col = $.dataGrid._undef( _col,false );
			var _m = {
				rid : false,
				field : false,
				mCells : [],
				rowspan : 1,
				colspan : 1
			};
			if( !$.isPlainObject(merge) ) {
				return false;	
			}
			merge = $.extend(_m,merge);
			if( (merge.rid === false) || (merge.field === false) ) {
				return false;	
			}
			if( (merge.rowspan == 1) && (merge.colspan == 1) ) {
				return false;	
			}
			var columnList = self.getColumnList();
			var index = self.inArray(merge.field,columnList);
			if( index == -1 ) return false;
			
			if( self.isMergeCell( merge.rid,merge.field ) ){
				if( _col ) {
					self.unMergeCells( rid,field );
				} else {
					return false;		
				}
			}
			
			merge.mCells = [];//被合并的单元格
			for( var i=0;i<merge.rowspan;i++ ) {
				var rid = merge.rid + i;
				//检查行是否存在
				var trid = "#"+opt.id+"-row-"+rid;
				if( !$(trid).size() ) {
					if( opt.lazyLoadRow ) {
						self._loadRow(rid);	
					}	
					if( !$(trid).size() ) {
						continue;	
					}
				}
				
				for( var j=0;j<merge.colspan;j++ ) {
					var _j = index + j;
					if( _j>=columnList.length ) continue;
					var field = columnList[_j];
					//如果合并的单元格有被其他合并单元格占用则返回false
					if( self.isMergeCell( rid,field ) ){
						if( _col ) {
							self.unMergeCells( rid,field );
						} else {
							return false;		
						}
					}
					
					if( (rid == merge.rid) && (field==merge.field) ) {
						continue;	
					}
					merge.mCells.push({rid:rid,field:field});		
				}
			}
			
			self.mergeList.push( merge );
			var tid = $("#"+opt.id+"_"+merge.field+"_row_"+merge.rid+"_td");
			tid.attr({
				rowspan : merge.rowspan,
				colspan : merge.colspan
			});
			for( var c=0;c<merge.mCells.length;c++ ) {
				
				var _mcell = merge.mCells[c];
				
				var mtid = 	$("#"+opt.id+"_"+_mcell.field+"_row_"+_mcell.rid+"_td");
				$(mtid).hide();
			}
		}
	});
})(jQuery);