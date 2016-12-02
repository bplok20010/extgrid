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
	var edits = {};
	edits.text = function (editor,value,column,cell,rid,field){
		var grid = this;
		var w = parseFloat(editor.width) || column.width;
		editor.width = Math.max( parseFloat(column.width),parseFloat(w) );
		var e = $(editor.renderTo).extform( editor )
						          .val(value);
		e.bind("onBlur",function(){
			var self = this;
			var newValue = self.val();
			var r = grid.setFieldValue(rid,field,newValue);
			if( r === false ) {
				cell.html(newValue);	
			}
		});
		return e;
	}
	edits.textarea = function (editor,value,column,cell,rid,field){
		var w = parseFloat(editor.width) || column.width;
		editor.width = Math.max( parseFloat(column.width),parseFloat(w) );
		var e = $(editor.renderTo).extform( editor )
						          .val(value);
		e.bind("onBlur",function(){
			var self = this;
			var newValue = self.val();
			var r = grid.setFieldValue(rid,field,newValue);
			if( r === false ) {
				cell.html(newValue);	
			}
		});
		return e;
	}
	edits.date = function (editor,value,column,cell,rid,field){
		var w = parseFloat(editor.width) || column.width;
		editor.width = Math.max( parseFloat(column.width),parseFloat(w) );
		var e = $(editor.renderTo).extform( editor )
						          .val(value);
		e.bind("onBlur",function(){
			var self = this;
			var newValue = self.val();
			var r = grid.setFieldValue(rid,field,newValue);
			if( r === false ) {
				cell.html(newValue);	
			}
		});
		return e;
	}
	edits.checkbox = function (editor,value,column,cell,rid,field){
		var w = parseFloat(editor.width) || column.width;
		editor.width = Math.max( parseFloat(column.width),parseFloat(w) );
		var e = $(editor.renderTo).extform( editor )
						          .val(value);
		e.bind("onClick",function(){
			var self = this;
			var newValue = self.val();
			var r = grid.setFieldValue(rid,field,newValue);
			if( r === false ) {
				cell.html(newValue);	
			}
		});
		return e;
	}
	edits.radio = function (editor,value,column){
		var w = parseFloat(editor.width) || column.width;
		editor.width = Math.max( parseFloat(column.width),parseFloat(w) );
		var e = $(editor.renderTo).extform( editor )
						  .val(value);
		return e;
	}
	edits.spinner = function (editor,value,column){
		var w = parseFloat(editor.width) || column.width;
		editor.width = Math.max( parseFloat(column.width),parseFloat(w) );
		var e = $(editor.renderTo).extform( editor )
						  .val(value);
		return e;
	}
	edits.select = function (editor,value,column){
		var w = parseFloat(editor.width) || column.width;
		editor.width = Math.max( parseFloat(column.width),parseFloat(w) );
		var e = $(editor.renderTo).extform( editor )
						  .val(value);
		return e;
	}
	edits.stagselect = function (editor,value,column){
		var w = parseFloat(editor.width) || column.width;
		editor.width = Math.max( parseFloat(column.width),parseFloat(w) );
		var e = $(editor.renderTo).extform( editor )
						  .val(value);
		return e;
	}
	function loadEdit(){
		var self = this;
		function isEditable( column ){
			var fields = self.getColumns();
			var isEdit = false;
			$.each(fields,function(i,field){
				if( field.editor && $.isPlainObject(field.editor) && field.field == column ) {
					field.editor.group = self.C("id");
					isEdit = field;
					return false;
				}					   
			});
			return isEdit;
		}
		var cellEditAble = function(cell,rowId,field,value,e){
			if( cellEditAble.editCell != null ) {
				cellEditAble.editCell.remove();	
			}
			var column = isEditable(field);
			if( !column ) return;
			
			cell.html('');
			
			var self = this;
			var opt = self.C();
			var gid = self.C("id");
			var tid = gid+"_"+field+"_row_"+rowId+"_td";
			var td = $("#"+tid);
			//需要判断行列锁
			var render = $("#view2-datagrid-body-"+gid);
			//var render = $("#view_"+gid);
			
			//var pos = $("#"+tid).position(); //IE6下获取和其他结果不一样
			var tdOffset,bodyOffset,pos;
			tdOffset = $("#"+tid).offset(); 
			bodyOffset = render.offset();
			pos = {
				left : 	tdOffset.left - bodyOffset.left + opt.sLeft,
				top : tdOffset.top - bodyOffset.top + opt.sTop
			};
			
			var edit_cell_id = gid + "_edit_cell";
			var c = $("<table cellpadding=0 cellspacing=0><tr><td id='"+edit_cell_id+"' valign=\"middle\" align=\"center\" ></td></tr></table>");
			cellEditAble.editCell = c;
			c.click(function(e){
				//e.preventDefault();
				e.stopPropagation();
			});
			c.addClass('edit-cell');
			c.css({
				width : td.outerWidth(),
				height : td.outerHeight(),
				left : pos.left,
				position : 'absolute',
				top : pos.top
			});
			
			c.appendTo(render);
			
			column.editor.renderTo = '#'+edit_cell_id;
			var type = column.editor.type || 'text';
			
			edits[type].call(self,column.editor,value,column,cell,rowId,field);
			
			//alert($("#"+edit_cell_id).find(">span").height());
			/*$(column.editor.renderTo).extform( edits[type](column) )
									 .val(value);*/
			c.find(":input").first().focus();
			var removeEdit = function(){
				c.remove();
				$(document).unbind("click.extgridEdit");				
			}
			setTimeout(function(){
				$(document).bind("click.extgridEdit",removeEdit);				
			},0);
			
			return false;
		};
		cellEditAble.editCell = null;
		self.bind("onClickCell",cellEditAble,self);
	}
	$.extGrid.puglins.push(loadEdit);
})(jQuery);