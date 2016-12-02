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
		self.unbind("onShowGrid.footer");
		
		//事件绑定
		self.bind("onShowGrid.footer",self.setFooterRow);
	});
	$.dataGrid.fn.extend({
		footerCellEvents : function(rowId,e) {
			var self = this,
				opt = self.configs;
			var data = opt.footerData;
			var target = e.srcElement ? e.srcElement : e.target;
			
			//检测当前是否对象是否单元格
			if( !self.isCell(target) ) {
				return true;	
			}
			
			var cell = $(target);
			
			var field = cell.parent("td").attr("field");
			var index = self.getRealField(field)
			var value = data[rowId][index] == undefined ? '' : data[rowId][index];
			
			var r = true;
			
			switch( e.type ) {
				case 'click' :
				
					r = self.fireEvent('onClickFooterCell',[cell.eq(0),rowId,field,value,e]);
					break;
				case 'dblclick' :
					r = self.fireEvent('onDblClickFooterCell',[cell.eq(0),rowId,field,value,e]);
					break;
				case 'mouseover' : //case 'mouseenter' : 
					r = self.fireEvent('onOverFooterCell',[cell.eq(0),rowId,field,value,e]);
					break;
				case 'mouseout' :
					r = self.fireEvent('onOutFooterCell',[cell.eq(0),rowId,field,value,e]);
					break;
				case 'contextmenu' :
					r = self.fireEvent('onFooterCellContextMenu',[cell.eq(0),rowId,field,value,e]);
					break;
			}
			return r;
		},
		bindFooterRowEvent : function( tr,ltr ){
			var self = this,
				opt = self.configs,
				data = opt.footerData,
				gid = opt.gid;
				
			if( typeof tr === "undefined" ) {
				tr = false;	
			}
			if( typeof ltr === "undefined" ) {
				ltr = false;	
			}
			var fields = opt.columns;
			
			var tr_events = {
				'click' : function(ev){
					var rowId = $(this).attr("datagrid-rid");
					var rowData = $(this).data('rowData');
					
					//触发单元格事件
					var cr = self.footerCellEvents(rowId,ev);
					if(cr === false) return false;
					
					var r = self.fireEvent('onClickFooterRow',[this,rowId,rowData,ev]);
					if(r === false) return false;
					
				},
			/*	'mouseenter' : function(e){
					var rowId = $(this).attr("datagrid-rid");	
					
					self.fireEvent("onOverRow",[rowId,e]);
				},*/
				'mouseover' : function(e){
					var rowId = $(this).attr("datagrid-rid");	
					//触发单元格事件
					var cr = self.footerCellEvents(rowId,e);
					if(cr === false) return false;
					
					self.fireEvent("onOverFooterRow",[rowId,e]);
				},
			/*	'mouseleave' : function(e){
					var rowId = $(this).attr("datagrid-rid");	
					
					self.fireEvent("onOutRow",[rowId,e]);
				},*/
				'mouseout' : function(e){
					var rowId = $(this).attr("datagrid-rid");	
					//触发单元格事件
					var cr = self.footerCellEvents(rowId,e);
					if(cr === false) return false;
					self.fireEvent("onOutFooterRow",[rowId,e]);
				},
				'dblclick' : function(e){
					var rowId = $(this).attr("datagrid-rid");
					var rowData = $(this).data('rowData');
					//触发单元格事件
					var cr = self.footerCellEvents(rowId,e);
					if(cr === false) return false;
					var r = self.fireEvent('onDblClickFooterRow',[this,rowId,rowData,e]);
					if(r == false) return false;
				},
				'contextmenu' : function(e){
					var rowId = $(this).attr("datagrid-rid");
					var rowData = $(this).data('rowData');
					//触发单元格事件
					var cr = self.footerCellEvents(rowId,e);
					if(cr === false) return false;
					var r = self.fireEvent('onFooterRowContextMenu',[this,rowId,rowData,e]);
					if(r == false) return false;
				}
			};
			
			if(tr) {
				tr.bind(tr_events);
				tr.each(function(){
					var tr = $(this);
					var rowId = $(this).attr("datagrid-rid");
					var rowData = $(this).data('rowData');
					//行回调
					if( $.isFunction(opt.footerRowCallBack) && opt.footerRowCallBack != $.noop ) {
						opt.footerRowCallBack.call(self,tr,rowId,rowData);
					}
					if( opt.footerRowStyler ) {
						if( $.isFunction(opt.footerRowStyler) ) {
							var rstyle = opt.footerRowStyler.call(self,tr,rowId,rowData);
							if( typeof rstyle == 'string' ) {
								tr.addClass(rstyle);	
							}
						} else if( typeof opt.footerRowStyler == 'string' ) {
							tr.addClass(opt.footerRowStyler);	
						}	
					}
					
				});
			}
			
			if( ltr ) {
				
					var ltr_events = {
					'click' : function(e){
						var rowId = $(this).attr("datagrid-rid");
						var rid = rowId;
						
						//触发单元格事件
						var cr = self.footerCellEvents(rowId,e);
						if(cr === false) return false;
						
						self.fireEvent('onClickFooterRowNumber',[rid,e]);
						if( opt.rowNumbers2Row !== false ) {
							//self.selectRow(rid);
							$("#"+opt.id+"-footer-row-"+rid).trigger('click');
						}
					},
					'mouseover' : function(e){
						var rowId = $(this).attr("datagrid-rid");
						//触发单元格事件
						var cr = self.footerCellEvents(rowId,e);
						if(cr === false) return false;
						self.fireEvent("onOverFooterRow",[rowId,e]);
						
					},
					'mouseout' : function(e){
						
						var rowId = $(this).attr("datagrid-rid");
						//触发单元格事件
						var cr = self.footerCellEvents(rowId,e);
						if(cr === false) return false;
						self.fireEvent("onOutFooterRow",[rowId,e]);
					},
					'dblclick' : function(e){
						
						var rowId = $(this).attr("datagrid-rid");
						var rid = rowId;
						//触发单元格事件
						var cr = self.footerCellEvents(rowId,e);
						if(cr === false) return false;
						if( opt.rowNumbers2Row !== false ) {
							//self.selectRow(rid);
							$("#"+opt.id+"-footer-row-"+rid).trigger('dblclick');
						}
						
					},
					'contextmenu' : function(ev){
					}
				};
				//view1 行事件绑定
				ltr.bind(ltr_events);
			}
		},
		//解析用户自定义行
		parseFooterTpl : function(tr,rid,d){
			var self = this,
				opt = self.configs,
				data = opt.footerData,
				gid = opt.gid;
			var fields = opt.columns;
			
			var i = rid,
				rowId = rid;
			
			var d = $.dataGrid._undef(d,false);
			
			if( !d ) {
				d = data[i] ? data[i] : {};
			}
			
			tr.find(">td,>th").each(function(f){
				var tdId = opt.id+'_'+fields[f]['field']+'_footer_row_'+rowId+'_td';
				var cellId = opt.id+'_'+fields[f]['field']+'_footer_row_'+rowId+'_cell';
				var $this = this;
				if( $(this).is("th") ) {
					$this = $("<td id='"+tdId+"' field='"+fields[f]['field']+"' align='"+fields[f]['align']+"'><div  id='"+cellId+"'  class='datagrid-cell datagrid-footer-cell datagrid-cell-"+fields[f]['field']+" ' >"+$(this).html()+"</div></td>");//style='width:"+fields[f]['width']+";'
					$(this).replaceWith( $this );
				} else {
					$(this).attr("field",fields[f]['field'])
						   .attr("align",fields[f]['align'])
						   .attr("id",tdId)
						   .html("<div  id='"+cellId+"' class='datagrid-cell datagrid-footer-cell datagrid-cell-"+fields[f]['field']+" ' >"+$(this).html()+"</div>");//style='width:"+fields[f]['width']+";'
				}						 
			});
						
			tr.addClass("datagrid-row datagrid-footer-row datagrid-row-"+rid)
			  .attr("id",opt.id+"-footer-row-"+i)
			  .attr("datagrid-rid",i);
		},
		//模版函数
		view2_footer_row : function(d){
			
			if( !d ) return "";
			var self = this,
				opt = self.configs,
				data = opt.data,
				gid = opt.gid;
				
			var tr = [];
			tr.push('<tr id="');
			tr.push(d.id);
			tr.push('-footer-row-');
			tr.push(d.i);
			tr.push('" ');
			tr.push(' datagrid-rid="');
			tr.push(d.i);
			tr.push('" class="datagrid-row datagrid-row-'+d.i+' datagrid-footer-row ');
			tr.push('">');
			
			var j = 0,
				len = d.fields.length;
			for(;j<len;j++) {
				//var tdId = opt.id+'_'+d.fields[j]["field"]+'_row_'+d.i+'_td';
				var tdId = [];
				tdId.push(opt.id);
				tdId.push('_');
				tdId.push(d.fields[j]["field"]);
				tdId.push('_footer_row_');
				tdId.push(d.i);
				tdId.push('_td');
				tdId = tdId.join("");
				
				//var cellId = opt.id+'_'+d.fields[j]["field"]+'_row_'+d.i+'_cell';
				var cellId = [];
				cellId.push(opt.id);
				cellId.push('_');
				cellId.push(d.fields[j]["field"]);
				cellId.push('_footer_row_');
				cellId.push(d.i);
				cellId.push('_cell');
				cellId = cellId.join("");
				
				var field = d.fields[j]["field"];
				var index = d.fields[j]["index"];
				var _expand = opt.self.tpl(d.data[index],d.data);//d.data[index]
				
				//tr.push('<td field="'+field+'" id="'+tdId+'" align="'+d.fields[j]["align"]+'">');
				tr.push('<td field="');
				tr.push(field);
				tr.push('" id="');
				tr.push(tdId);
				tr.push('" align="');
				tr.push(d.fields[j]["align"]);
				tr.push('">');
				
				//tr.push('<div id="'+cellId+'" class="datagrid-cell datagrid-cell-c1-'+field+' '+d.fields[j]["bcls"]+'" style="width:'+d.fields[j]["width"]+';" >'+_expand+'</div></td>');
				tr.push('<div id="');
				tr.push(cellId);
				tr.push('" class="datagrid-cell datagrid-footer-cell datagrid-cell-')
				tr.push(field);
				//tr.push(' datagrid-cell-c1-');
				//tr.push(field);
				tr.push(' ');
				tr.push(d.fields[j]["fcls"]);
				tr.push('" >');
				//tr.push('" style="width:');
				//tr.push(d.fields[j]["width"]);
				//tr.push(';" >');
				tr.push(_expand);
				tr.push('</div></td>');
			}
			tr.push('</tr>');
			
			return tr.join("");
		},
		//模版函数
		view1_footer_row : function(d){
			if( !d ) return "";
			var self = this,
				opt = self.configs,
				data = opt.data,
				gid = opt.gid;
			//var  group_id = ( typeof d.data["_groupid_"] != "undefined" )? "datagrid-group-id="+d.data["_groupid_"] : "";
			
			//var tdId = opt.id+'_row_'+d.i+'_td_rownumber';
			var tdId = [];
				tdId.push(opt.id);
				tdId.push('_footer_row_');
				tdId.push(d.i);
				tdId.push('_td_rownumber');
				tdId = tdId.join("");
			
			//var cellId = opt.id+'_row_'+d.i+'_cell_rownumber';
			var cellId = [];
				cellId.push(opt.id);
				cellId.push('_footer_row_');
				cellId.push(d.i);
				cellId.push('_cell_rownumber');
				cellId = cellId.join("");
			
			//var tr = ['<tr id="'+d.id+'-view1-row-'+d.i+'" '+group_id+' datagrid-rid="'+d.i+'" datagrid-row-select="0" class="datagrid-row datagrid-row-view1 '+modelTr+'">'];
			var tr = [];
			tr.push('<tr id="');
			tr.push(d.id);
			tr.push('-view1-footer-row-');
			tr.push(d.i);
			tr.push('" ');
			tr.push(' datagrid-rid="');
			tr.push(d.i);
			tr.push('" class="datagrid-row  datagrid-row-'+d.i+' datagrid-row-view1 ');
			tr.push('">');
			
			//tr.push('<td id="'+tdId+'" align="center" class="datagrid-td-rownumber"><div id="'+cellId+'" class="datagrid-cell-rownumber" style="width:'+parseFloat(d.rowNumbersWidth)+'px;">'+(d.rowNumbersExpand === false ? ++d.i : opt.self.tpl(d.rowNumbersExpand,d.data))+'</div></td>');//--
			tr.push('<td id="');
			tr.push(tdId);
			tr.push('" align="center" class="datagrid-td-rownumber"><div id="');
			tr.push(cellId);
			tr.push('" class="datagrid-cell-rownumber" style="width:');
			tr.push(parseFloat(d.rowNumbersWidth));
			tr.push('px;">');
			var _expand_Num = "";
			if( d.rowNumbersExpand === false ) {
				_expand_Num = (opt.pageNumber-1)*opt.pageSize + ( ++d.i );
			} else if( d.rowNumbersExpand == 'auto' ) {
				_expand_Num = ++d.i;
			} else if( $.isFunction( d.rowNumbersExpand ) ) {
				_expand_Num	= d.rowNumbersExpand.call(self,d.data);
			} else {
				_expand_Num = opt.self.tpl(d.rowNumbersExpand,d.data);	
			}
			//var _expand_Num = d.rowNumbersExpand === false ? ++d.i : opt.self.tpl(d.rowNumbersExpand,d.data);
			tr.push( _expand_Num );
			tr.push('</div></td>');
			
			
			tr.push('</tr>');

			return tr.join("");
		},
		showFooter : function(){
			var self = this,
				opt = self.configs;
				opt.showFooter = true;
			//self.fireEvent('onViewSizeChange',[]);
			self.resetViewSize();
		},
		hideFooter : function(){
			var self = this,
				opt = self.configs;
				opt.showFooter = false;
			//self.fireEvent('onViewSizeChange',[]);
			self.resetViewSize();
		},
		//行 生成
		setFooterRow : function(){
			var self = this,
				opt = self.configs,
				data = opt.footerData,
				gid = opt.gid;
			var fields = opt.columns;
			
			var view1_footer_row = self.getTpl("view1_footer_row");
			var view2_footer_row = opt.footerTpl ? opt.footerTpl : self.getTpl("view2_footer_row");
			var _d = {};
			var view2_tbodyId = $("#view2-datagrid-footer-inner-"+opt.id);
			var view1_tbodyId = $("#view1-datagrid-footer-inner-"+opt.id);
			
			var rows_view1 = ['<table class="datagrid-ftable" id="view1-datagrid-footer-ftable-'+opt.id+'" cellspacing="0" cellpadding="0" border="0"><tbody id="view1-datagrid-footer-ftable-tbody-'+opt.id+'">'];
			var rows_view2 = ['<table class="datagrid-ftable" id="view2-datagrid-footer-ftable-'+opt.id+'" cellspacing="0" cellpadding="0" border="0"><tbody id="view2-datagrid-footer-ftable-tbody-'+opt.id+'">'];
			
			var rowIds = [];
			
			if(  !$.isArray(data) ) {
				data = [];	
			}
			var len = data.length;
			for(var i=0;i<len;i++){
				
				rowIds.push(i);
				
				_d = {
					i : i,
					id : opt.id,
					fields : fields	,
					rowNumbersExpand : opt.footerRowNumbersExpand,
					data : data[i],
					rowNumbersWidth : opt.rowNumbersWidth,
					opt : opt
				};
				
				var tr = self.tpl(view2_footer_row,_d);
				
				rows_view2.push(tr);
				
				var ltr = false;
				if( opt.rowNumbersWidth!==false ) {
					ltr = self.tpl(view1_footer_row,_d);
					rows_view1.push(ltr);
				}
				
			}
			
			rows_view2.push('</tbody></table>');
			rows_view1.push('</tbody></table>');
			
			view2_tbodyId.html(rows_view2.join(""));
			view1_tbodyId.html( rows_view1.join("") );
			
			
			var tr = false;
			var ltr = false;
			

			//如果自定义opt.rowTpl 那么就添加系统必要的元素
			if( opt.footerTpl ) {
				tr = $(">tr","#view2-datagrid-footer-ftable-tbody-"+opt.id);
				tr.each(function(t){
					var tr = $(this);
					var rowId = rowIds[t];
					var i = rowId;
					
					self.parseFooterTpl(tr,rowId);
									 
				});
			} else {
				tr = $(">tr.datagrid-row","#view2-datagrid-footer-ftable-tbody-"+opt.id);	
			}

			tr.each(function(i){//2000 140ms
				var rid = $(this).attr("datagrid-rid"); 
				$(this).data("rowData",data[rid]);
			});
			
			if( opt.rowNumbersWidth!==false ) {
				ltr = $(">tr.datagrid-row","#view1-datagrid-footer-ftable-tbody-"+opt.id);
			}
			
			self.bindFooterRowEvent(tr,ltr);
			self.fireEvent('onFooterRowCreate',[]);
			
		},
		updateFooterData : function( data ){
			var self = this,
				opt = self.configs;
			if( $.isArray( data ) ) {
				opt.footerData = data;	
			} else if( $.isPlainObject( data ) ) {
				opt.footerData = [data];		
			}
			self.setGridFooter();
			self.fireEvent('onUpdateFooterRow',[]);
			return true;
		},
		updateFooterRow : function( data ){
			var self = this;
			return self.updateFooterData(data);
		},
		setGridFooter : function(){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			self.setFooterRow();
			self.resetViewSize();
			return true;
		},
		_getFooterRowNumber : function(rowId) {
			var self = this,
				opt = self.configs,
				data = opt.footerData,
				gid = opt.gid;
			var view1_tr = $("#"+opt.id+"-view1-footer-row-"+rowId);
			var isNew = false;
			var _d = {};
			if( !view1_tr.size() ) {//添加行
				isNew = true;
				var view1_footer_row = self.getTpl("view1_footer_row");
				_d = {
					i : rowId,
					id : opt.id,
					rowNumbersExpand : opt.rowNumbersExpand,
					data : data[rowId],
					rowNumbersWidth : opt.rowNumbersWidth,
					opt : opt
				};
				var ltr = $( self.tpl(view1_footer_row,_d) );
				//self.bindRowEvent(false,ltr);
				view1_tr = ltr;

			}
			return {
					isNew : isNew,
					node : view1_tr
				};
		}
	}); 
})(jQuery);