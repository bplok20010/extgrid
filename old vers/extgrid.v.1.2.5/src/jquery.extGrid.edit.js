/*
jquery.extGrid.edit.js
http://www.extgrid.com
author:nobo
qq:505931977
QQ交流群:13197510
email:zere.nobo@gmail.com or QQ邮箱

新增 limitWidth属性
type 支持函数 注意应该返回editorProvider 而且需要定义val,checkVal,_destroy方法

所有编辑扩展事件：
	onBeforeCreateEditor 创建编辑单元格之前
	onCreateEditor  创建编辑单元格后
	onInsertEditorWrap 创建编辑单元格容器后
	onBeforeRemoveEditCell 在移除编辑单元格之前
	onRemoveEditCell	在移除编辑单元格后
	onBeforeEditRow	触发行编辑时
	onEditRow	触发行编辑后
	onBeforeSaveEditRow	在保存编辑状态行之前
	onRowEdit,onSaveEditRow 在保存编辑状态行之后
	onBeforeUnEditRow	在取消编辑之前
	onBeforeSaveEditCell 保存单元格之前
	onSaveEditCell 保存单元格后触发 该事件和onCellEdit基本一样只是少一个rowData参数,onCellEdit属於grid,onSaveEditCell只属於可编辑扩展事件
	onBeforeCheckEditCell 
*/

;(function($){
	"use strict";
	$.extGrid.puglins.push(function(){
		var self = this;
		//刷新grid时,取消当前所有的编辑状态
		self.bind("onBeforeShowGrid",function(){
			self.unEditCell();									  
		});
	});
	var edits = {
		text : function(editor,value){
			var e = $(editor.renderTo).extform( editor )
						              .val(value);
			return e;
		},
		textarea : function(editor,value){
			var e = $(editor.renderTo).extform( editor )
						              .val(value);	
			return e;
		},
		date : function(editor,value){
			var e = $(editor.renderTo).extform( editor )
						              .val(value);	
			return e;
		},
		//on off
		checkbox : function(editor,value){
			if( editor.on == value ) {
				value == '';	
			}
			editor.items = [ {name:editor.on} ];
			var e = $(editor.renderTo).extform( editor )
						              .val(value);	
			var _val = e.val;
			e.val = function(){
				var self = e;
				var value = _val.apply(self,arguments);
				if( !arguments.length ) {
					if( value == '' ) {
						return 	editor.off;
					} else {
						return 	editor.on;	
					}
				} else {
					return value;	
				}
			}
			return e;
		},
		radio : function(editor,value){
			var e = $(editor.renderTo).extform( editor )
						              .val(value);	
			return e;
		},
		spinner : function(editor,value){
			var e = $(editor.renderTo).extform( editor )
						              .val(value);	
			return e;
		},
		select : function(editor,value){
			var self = this;//grid
			var items = editor.items;
			for( var x=0;x<items.length;x++ ) {
				var item = items[x];
				item.name = typeof item.name=='undefined' ? item.value : item.name;
				item.value = typeof item.value=='undefined' ? item.name : item.value;
			}
			var e = $(editor.renderTo).extform( editor );
			if( value !== "" ) {
				e.val(value.toString());	
			}
			var t = self.bind("onScroll",function(){
				e.hideSelect();
			});
			e.bind("onDestroy",function(){
				self.unbind("onScroll",t);							
			})
			return e;
		},
		stagselect : function(editor,value){
			var e = $(editor.renderTo).extform( editor )
						              .val(value);	
			return e;
		}
	};
	$.extGrid.fn.extend({
		editors : [],
		//基于insertEditor扩展
		createEditor : function(rid,field){
			var self = this,
				opt = self.configs;
			
			var column = self.getColumnData(field);
			
			var edit = column.editor;
			
			var rs = self.fireEvent('onBeforeCreateEditor',[rid,field,edit]);
			if( rs === false ) return false;
			
			if( !edit || $.isEmptyObject( edit ) ) {
				return false;	
			}
			
			edit.type = edit.type || 'text';
			var type = edit.type;
			if( !$.isFunction(type) ) {
				var undef = edit.type in edits ? false : true;
				if( undef ) {
					return false;	
				}
			}
			var editable = self.insertEditor( rid,field );
			
			if( !editable ) {
				return false;	
			}
			
			var value = self.getFieldValue(rid,field);
			
			var edit_cell = opt.id + "_"+rid+"_"+field+"_edit";
			var edit_cell_id = edit_cell+"_cell";

			var cellId = opt.id+"_"+field+"_row_"+rid+"_cell";
			var width = edit.limitWidth ? edit.limitWidth : $("#"+cellId).width();

			edit.name = opt.id+"_"+field+"_"+rid;
			//edit.width = Math.floor( Math.max( parseFloat(width),parseFloat(w) ) );
			edit.width = width;
			edit.renderTo = "#"+edit_cell_id;
			edit.group = opt.id;
			if( !$.isFunction(type) ) {
				var editorProvider = edits[type].call(self,edit,value);	
			} else {
				var editorProvider = type.call(self,edit,value);
				editorProvider = $.isPlainObject(editorProvider) ? editorProvider : {};
				editorProvider['val'] = !!editorProvider['val'] ? editorProvider['val'] : $.noop;
				editorProvider['checkVal'] = !!editorProvider['checkVal'] ? editorProvider['checkVal'] : $.noop;
				editorProvider['_destroy'] = !!editorProvider['_destroy'] ? editorProvider['_destroy'] : $.noop;
			}
			//修改对列
			var list = self.editors;
			for(var x=0;x<list.length;x++) {
				if( list[x].id == edit_cell ) {
					list[x].editorProvider = editorProvider;
					break;
				}
			}
			
			self.fireEvent('onCreateEditor',[rid,field,editorProvider,edit]);
			
			return list[x];
		},
		insertEditor : function(rid,field){//创建一个容器定位到指定单元格处
			var self = this,
				opt = self.configs;
			var column = self.getColumnData(field);
			if( column == null ) return false;
			if( column.disabled ) {
				return false;	
			}
			var isLockRow,isLockColumn,isHidden,render;
			isLockRow = self.inArray(rid,opt.lockRows) == -1 ? false : true;
			isLockColumn = self.inArray(field,opt.lockColumns) == -1 ? false : true;
			isHidden = self.inArray(field,opt.hideColumns) == -1 ? false : true;
			
			if( isHidden ) {
				return false;	
			}
			if( isLockRow && isLockColumn ) {
				render = "datagrid-view1-header-outer-wraper-"+opt.id;
			} else if( isLockRow ) {
				render = "datagrid-view2-header-outer-wraper-"+opt.id;
			} else if( isLockColumn ) {
				render = "view1-datagrid-body-"+opt.id;	
			} else {
				render = "view2-datagrid-body-"+opt.id;	
			}
			render = $("#"+render);
			
			var tid = opt.id+"_"+field+"_row_"+rid+"_td";
			var td = $("#"+tid);
			var cellId = opt.id+"_"+field+"_row_"+rid+"_cell";
			var cell = $("#"+cellId);
			
			//var pos = $("#"+tid).position(); //IE6下获取和其他结果不一样
			var tdOffset,bodyOffset,pos;
			tdOffset = $("#"+tid).offset(); 
			bodyOffset = render.offset();
			pos = {
				left : 	tdOffset.left - bodyOffset.left + opt.sLeft,
				top : tdOffset.top - bodyOffset.top + (isLockRow ? 0 : opt.sTop)
			};
			var edit_cell = opt.id + "_"+rid+"_"+field+"_edit";
			
			if( $("#"+edit_cell).length ) {
				return	$("#"+edit_cell);
			}
			
			var edit_cell_id = edit_cell+"_cell";
			var editor = $("<table cellpadding=0 cellspacing=0 id='"+edit_cell+"'><tr><td id='"+edit_cell_id+"' valign=\"middle\" align=\"center\" ></td></tr></table>");
			editor.click(function(e){
				//e.preventDefault();
				e.stopPropagation();
			});
			
			var edit = column.editor;
			var tw = edit.width ? parseFloat(edit.width) : 0;
			var th = edit.height ? parseFloat(edit.height) : 0;
			
			editor.addClass('edit-cell');
			editor.css({
				//width : Math.max(tw,td.outerWidth()),
				width : td.outerWidth(),
				height : Math.max(th,td.outerHeight()),
				left : pos.left,
				position : 'absolute',
				top : pos.top
			});
			
			editor.appendTo(render);//显示editor
			//加入eidtor队列
			var q = {
				id : edit_cell,
				rid : rid,
				field : field,
				viewValue : cell.html(),//当前grid显示内容,不是实际的内容
				editor : editor
			}
			self.editors.push(q);
			self.fireEvent('onInsertEditorWrap',[rid,field,editor,edit_cell,edit_cell_id]);
			return editor;
		},
		removeEditor : function(rid,field,_reset){//_reset: true | false,true:移除后设置原来的内容,false:移除编辑后不设置原来的内容
			var self = this,
				opt = self.configs;
			var _reset = _reset || false;
			var edit_cell = opt.id + "_"+rid+"_"+field+"_edit";
			var edit_cell_id = edit_cell+"_cell";
			
			var viewValue = false;
			var isEditable = false;
			var sr = self.fireEvent("onBeforeRemoveEditCell",[rid,field,self.editors,edit_cell,edit_cell_id]);
			if( sr === false ) return false;
			//出列
			var list = self.editors;
			for(var x=0;x<list.length;x++) {
				if( list[x].id == edit_cell ) {
					list[x].editorProvider._destroy();
					viewValue = list[x].viewValue;
					list.splice(x,1);
					isEditable = true;//当前单元格是否处于编辑状态
					break;
				}
			}
			
			$("#"+edit_cell).remove();
			
			if( _reset && isEditable && (viewValue !== false) ) {
				var cellId = opt.id+"_"+field+"_row_"+rid+"_cell";
				var cell = $("#"+cellId);	
				if( cell.size() ) {
					cell.html( viewValue );	
				}
			}
			self.fireEvent("onRemoveEditCell",[rid,field,cell,viewValue]);
			return self;
		},
		getCellEditor : function( rid,field ){
			var self = this,
				opt = self.configs;	
			var list = self.editors;
			var editor = false;
			for(var x=0;x<list.length;x++) {
				if( list[x].rid == rid && list[x].field == field ) {
					editor = list[x].editorProvider;
					break;
				}
			}
			return editor;		
		},
		getEditCellValue : function(rid,field){
			var self = this,
				opt = self.configs;	
			var editor = self.getCellEditor( rid,field );
			var value = "";
			if( editor ) {
				value = editor.val();
			}
			return value;	
		},
		setEditCellValue : function(rid,field,value){
			var self = this,
				opt = self.configs;	
			var editor = self.getCellEditor( rid,field );
			if( editor ) {
				value = editor.val( value );
			}
			return true;	
		},
		//验证当前编辑单元格输入内容是否正确
		checkEditCell : function(rid,field){
			var self = this,
				opt = self.configs;	
			var list = self.editors;
			var isValid = true;
			
			var editorProvider = self.getCellEditor(rid,field);
			
			if( !editorProvider ) {
				return true;	
			}
			
			var sr = self.fireEvent("onBeforeCheckEditCell",[rid,field,editorProvider]);
			if( sr === false ) return false;
			
			var r = editorProvider.checkVal();
			if( r === false ) {
				isValid = false;	
			} 
			return isValid;
		},
		//编辑单元格
		editCell : function(rid,field){
			var self = this,
				opt = self.configs;
			var cellId = opt.id+"_"+field+"_row_"+rid+"_cell";
			var cell = $("#"+cellId);
			if( !cell.size() ) {
				return false	
			}
			
			var editable = self.createEditor(rid,field);
			
			if( !editable ) return false;
			
			cell.empty();//清空单元格内容
		},
		//保存并验证指定正处于编辑状态单元格,不带参数则保存所有目前正处于编辑状态的单元格
		//返回成功保存的的单元格数组 eg [ {rid:1,field:'name'} ]
		saveEditCell :　function(rid,field){
			var self = this,
				opt = self.configs;
			var list = self.editors;
			var len = list.length;
			var valid = valid || false;
			var successSave = [];
			if( arguments.length == 2 ) {
				for(var x=0;x<len;x++){
					var editor = list[x];
					var sr = self.fireEvent("onBeforeSaveEditCell",[rid,field,editor,editor.editorProvider]);
					if( sr === false ) return successSave;
					if( editor.rid == rid && editor.field == field ) { 
					
						var isValid = editor.editorProvider.checkVal();
						
						var value = editor.editorProvider.val();
						
						self.removeEditor( editor.rid,editor.field,true );
						
						if( isValid === false ) {
							break;
						}
						
						var isSave = self.setFieldValue( editor.rid,editor.field,value );
						self.fireEvent("onSaveEditCell",[editor.rid,editor.field,value]);
						if( isSave !== false ) {
							successSave.push({
								rid : editor.rid,
								field : editor.field
							});	
						}
						break;
					}
				}
			} else {
				for(var x=0;x<len;){
					var editor = list[x];
					
					var sr = self.fireEvent("onBeforeSaveEditCell",[editor.rid,editor.field,editor,editor.editorProvider]);
					if( sr === false ) return successSave;
					
					var isValid = editor.editorProvider.checkVal();
					
					
					var value = editor.editorProvider.val();
					
					self.removeEditor( editor.rid,editor.field,true );
					len = list.length;//因为removeEditor会对List进行删减 所以len是个可变的
					
					if( isValid === false ) {
						continue;
					}
					var isSave = self.setFieldValue( editor.rid,editor.field,value );
					self.fireEvent("onSaveEditCell",[editor.rid,editor.field,value]);
					if( isSave !== false ) {
						successSave.push({
							rid : editor.rid,
							field : editor.field
						});	
					}
				}
			}
			return successSave;
		},
		//不做任何保存,取消编辑指定单元格,不带参数则取消编辑所有目前正处于编辑状态的单元格
		unEditCell : function(rid,field){
			var self = this,
				opt = self.configs;
			if( arguments.length == 2 ) {
				self.removeEditor(rid,field,true);	
			} else {
				var list = self.editors;
				var len = list.length;
				for(var x=0;x<len;){
					var editor = list[x];
					self.removeEditor( editor.rid,editor.field,true );
					len = list.length;//因为removeEditor会对List进行删减 所以len是个可变的
				}
			}
		},
		editRow : function(rid){
			var self = this,
				opt = self.configs;
			
			var r = self.fireEvent("onBeforeEditRow",[rid]);
			if( r === false ) return false;
			
			var columns = self.getColumns();
			$.each( columns,function(i,column){
				self.editCell(rid,column.field);					 
			} );
			self.fireEvent("onEditRow",[rid]);
		},
		checkEditRow : function(rid){
			var self = this,
				opt = self.configs;
			var list = self.editors;
			var successSave = [];
			var isValid = true;
			for(var x=0;x<list.length;x++) {
				if( list[x].rid != rid ) {
					continue;	
				}
				var r = self.checkEditCell( rid,list[x].field );
				if( r === false ) {
					isValid = r;
				}
			}
			return isValid;
		},
		saveEditRow : function(rid){
			var self = this,
				opt = self.configs;
			var list = self.editors;
			var successSave = [];
			var rowList = [];
			var r = self.fireEvent("onBeforeSaveEditRow",[rid]);
			if( r === false ) return false;
			for(var x=0;x<list.length;x++) {
				if( list[x].rid != rid ) {
					continue;	
				}
				rowList.push({
					rid : rid,
					field : list[x].field
				});
			}
			for( var i=0;i<rowList.length;i++ ) {
				var isSave = self.saveEditCell( rid,rowList[i].field );
				if( isSave.length ) {
					successSave.push( rowList[i].field );	
				}	
			}
			var rowData = self.getRowData(rid);
			self.fireEvent("onRowEdit",[rid,rowData,successSave]);//兼容
			self.fireEvent("onSaveEditRow",[rid,rowData,successSave]);
		},
		unEditRow : function(rid){
			var self = this,
				opt = self.configs;
			var columns = self.getColumns();
			var r = self.fireEvent("onBeforeUnEditRow",[rid,rowData]);
			if( r === false ) return false;
			$.each( columns,function(i,column){
				self.unEditCell(rid,column.field);					 
			} );	
		}
	});
})(jQuery);