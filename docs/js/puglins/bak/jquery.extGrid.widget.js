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
	//滚动到指定行或列
	$.dataGrid.fn.extend({
		scrollToField : function(field){
			var self = this;
			var opt = self.configs;
			var header = $("#view2-datagrid-header-"+opt.id);
			
			if( !header.length ) {
				return self;	
			}
			
			var columns = self.getColumnList();
			
			if( self.inArray( field,columns ) == -1 ) {
				return self;		
			}
			//检测当前列是否被锁定
			if( self.inArray( field,opt.lockColumns ) != -1 ) {
				return self;		
			}
			//检测当前列是否已经隐藏
			if( self.inArray( field,opt.hideColumns ) != -1 ) {
				return self;		
			}
			
			var scrollbarSize = self.getScrollbarSize();
			
			var offset = header.offset();
			var w = header.outerWidth();
			//判断是否出现了垂直滚动条
			var body = $("#view2-datagrid-body-"+opt.id);
			var sh = body.get(0).scrollHeight;
			if( sh > body.outerHeight() ) {
				w -= scrollbarSize.width;//-滚动条大小
			}
			
			var f = $(">tr.datagrid-header-row td[field='"+field+"']","#view2-datagrid-header-inner-htable-tbody-"+opt.id);
			
			if( !f.length ) return self;
			
			var fo = f.offset();
			var fw = f.outerWidth();
			
			var outerWidth = 0;
			if( offset.left > fo.left ) {
				outerWidth = offset.left - fo.left;
			} else if( (offset.left+w) < (fo.left+fw) ) {
				outerWidth = (offset.left+w) - (fo.left+fw);
			}
			var sLeft = 0;
			
			sLeft = opt.sLeft - outerWidth;
			
			opt.sLeft = sLeft;

			//self.fireEvent("onScroll",[true]);
			self.onScroll(true);

			return self;
		},
		scrollToRow : function(rid){
			var self = this;
			var opt = self.configs;
			
			//检测当前行是否被锁定
			if( self.inArray( rid,opt.lockRows ) != -1 ) {
				return self;		
			}
			
			if( opt.lazyLoadRow && self.inArray( rid,opt.lazyRows ) == -1 ) {
				opt.sTop = opt._trHeight*rid;
				self.fireEvent("onScroll",[true]);
				return self;
			}
			
			var body = $("#view2-datagrid-body-"+opt.id);
			
			if( !body.length ) {
				return self;	
			}
			
			var scrollbarSize = self.getScrollbarSize();
			
			var offset = body.offset();
			var h = body.outerHeight();
			//判断是否出现了水平滚动条
			var sw = body.get(0).scrollWidth;
			if( sw > body.outerWidth() ) {
				h -= scrollbarSize.height;//-滚动条大小
			}
			
			var f = $("#"+opt.id+"-row-"+rid);
			if( !f.length ) {
				return self;	
			}
			
			var fo = f.offset();
			var fh = f.outerHeight();
			
			var outerHeight = 0;
			if( offset.top > fo.top ) {
				outerHeight = offset.top - fo.top;
			} else if( (offset.top+h) < (fo.top+fh) ) {
				outerHeight = (offset.top+h) - (fo.top+fh);
			}
			
			var sTop = 0;
			
			sTop = opt.sTop - outerHeight;
			
			opt.sTop = sTop;

			//self.fireEvent("onScroll",[true]);
			self.onScroll(true);
			return self;
		}
	}); 
	//grid高度自适应
	$.dataGrid.fn.extend({
		_autoHeight : function(){
			var self = this;
			var opt = self.configs;
			if( opt.autoHeight ) {
				self.autoHeight();	
			}
		},
		_autoHeightScrollBarY : function(){
			/*var self = this;
			var opt = self.configs;
			if( opt.autoHeight && !opt.forceFit ) {
				self.autoHeight();	
			}*/
		},
		autoHeight : function(){
			var self = this;
			var opt = self.configs;
			var grid = $("#"+opt.id);
			var view = $("#view_"+opt.id);
			
			var scrollbarSize = self.getScrollbarSize();
			
			$("#view2-datagrid-body-"+opt.id).css("overflow-y","hidden");	
			
			var h = grid.outerHeight() - view.outerHeight();
			var rv = $("#view2-datagrid-header-"+opt.id).outerHeight();
			var rh = $("#view2-datagrid-body-btable-"+opt.id).outerHeight();
			var rf = $("#view2-datagrid-footer-"+opt.id).outerHeight();
			var _min = opt.minAutoHeight;
			var _max = opt.maxAutoHeight;
			rh = Math.max( rh,_min );
			if( _max>0 ) {
				
				if( rh > _max ) {
					$("#view2-datagrid-body-"+opt.id).css("overflow-y","auto");	
				}
				
				rh = Math.min( rh,_max );	
			}
			var _f = 0;
			if( !opt.forceFit ) {
				//判断是否出现了水平滚动条
				var header = $("#datagrid-view2-header-inner-wraper-"+opt.id);
				if( header.get(0).scrollWidth>header.outerWidth() ) {
					_f = scrollbarSize.height;
				}
			}
			var height = rv + rh + rf + h + _f;

			self.onSizeChange( opt.width,height+( grid.outerHeight()-grid.height() ) );
			self.onViewSizeChange();
		},
		unAutoHeight : function(){
			var self = this;
			var opt = self.configs;	
			opt.autoHeight = false;
			$("#view2-datagrid-body-"+opt.id).css("overflow-y","auto");
		}
	}); 
	//grid 列只适应大小
	$.dataGrid.fn.extend({
		setForceFitColumn : function( field,w ){
			var self = this,
			opt = self.configs;	
			
			var column = self.getColumnData(field);
			if( opt.forceFit && column.forceFit ) {
				
				self.onFitColumn( field,w );

			}
		},
		onFitColumn : function( field,w ){
			var self = this,
			opt = self.configs;
			if( opt.forceFit ) {
				
				self.forceFitColumn( field,w );
				//if( !self._eventLocks['onAutoColumnResize'] ) {
					self.fireEvent("onAutoColumnResize",[]);
				//}
			}
		},
		forceFitColumn : function( fields,_w ){//平均设置列宽大小，如果传入field则传入的filed 大小不会改变
			var self = this,
			opt = self.configs;	
			var columns = opt.columns;
			
			var fields = typeof fields == 'undefined' ? [] : fields;
			
			fields = $.isArray( fields ) ? fields : [ fields ];
			
			var scrollbarSize = self.getScrollbarSize();
			
			$("#view2-datagrid-body-"+opt.id).css("overflow-x","hidden");
			
			var header = $("#view2-datagrid-header-"+opt.id);
			var w = header.outerWidth();
			
			var body = $("#view2-datagrid-body-"+opt.id);
			var sh = body.get(0).scrollHeight;
			var sw = body.get(0).scrollWidth;
			if( sh > body.outerHeight() ) {
				w -= scrollbarSize.width;
			//} else if( sw > body.outerWidth() ){
				//w -= scrollbarSize.height;	
			} else {
				w -= 0;	
			}
			
			var _clw = {};
			var _mw = {};//获取最小宽度
			var _wt = 0;//总宽
			var border = 0;
			//获取每个列宽
			$("#view2-datagrid-header-inner-htable-tbody-"+opt.id).find(">tr.datagrid-header-row td[field]").each(function(){	
				var tw = $(this).outerWidth();
				var field = $(this).attr('field');
				if( !border ) {
					border = $(this).outerWidth() - $(this).width();	
				}
				for( var x=0;x<columns.length;x++ ) {
					if( columns[x]['field'] == field && self.inArray( field,opt.hideColumns )==-1 ) {
						if( columns[x]['forceFit'] && self.inArray( field,fields )==-1 ) {
							_clw[ field ] = tw;
							_mw[ field ] = columns[x]['minWidth'];
							_wt += tw;
						} else {
							w -= tw;	
						}
						break;
					}
				}
			});
			var dw = 0;//超出宽度
			for( var f in _clw ) {
				_clw[f] =  (w*Math.floor( _clw[f]*10000/_wt )/10000) - border;
				if( _clw[f] < _mw[f] ) {
					dw += (_mw[f]-_clw[f]);
				}
				self._setFieldWidth(f,_clw[f]);
			}
			if( dw && fields.length==1 ) {
				self._setFieldWidth(fields[0],_w-dw);	
			}
			self.setGroupRowSize();
			self.setExpandRowSize();
			
			return self;
		},
		unForceFitColumn : function(){
			var self = this,
			opt = self.configs;	
			opt.forceFit = false;
			$("#view2-datagrid-body-"+opt.id).css("overflow-x","auto");
		}
	}); 
	//自动添加行
	$.dataGrid.fn.extend({
		//动态生成一行 ai:true 自动识别是否超过pageSize超过pageSize则不创建指加入data，false:则会同时创建一行tr
		//@d : object
		addRow : function(d,ai){
			var self = this,
				opt = self.configs,
				data = opt.data,
				gid = opt.gid;
			var fields = opt.columns;
			//var view1_row_tpl = self.getTpl("view1_row");
			//var view2_row_tpl = opt.rowTpl ? opt.rowTpl : self.getTpl("view2_row");
	
			//var view2_tbodyId = $("#view2-datagrid-body-btable-tbody-"+opt.id);
			//var view1_tbodyId = $("#view1-datagrid-body-btable-tbody-"+opt.id);
			
			var rid = data.length;
			var i = rid;
			
			var ai = $.dataGrid._undef(ai,true);
			
			var d = $.dataGrid._undef(d,{});
			
			//本地
			if( self.getAsync() ) {
				data.push( d );
				var datas = self.getData();
				datas.push( d );
			} else {
				data.push( d );	
			}
			
			opt.total++;
	
			var pk = opt.pk;
			
			if( !d[pk] ) {
				d[pk] = self.unique();	
			}
			
			var r = self.fireEvent("onBeforeAddRow",[d]);
			if( r === false ) {
				return false;	
			}
			
			if( ai && (rid >= opt.pageSize) ) {
				return true;	
			}
	
			var tr_row = self._insert(rid,d);
			if( tr_row.isNew ) {
				//行事件绑定
				if( opt.denyRowEvents === false ) {
					self.bindRowEvent(tr_row.tr,tr_row.ltr);
				} else if( $.isFunction(opt.denyRowEvents) ) {
					opt.denyRowEvents.call(self,tr_row.tr,tr_row.ltr);	
				}
			}
			return rid;
		},
		//更新行数据
		updateRow : function(rid,d){
			var self = this,
				opt = self.configs,
				data = opt.data,
				gid = opt.gid;	
				
			var d = $.dataGrid._undef(d,{});
			
			var r = self.fireEvent("onBeforeUpdateRow",[rid,d]);
			if( r === false ) {
				return false;	
			}
			
			var fieldList = self.getColumnList();
			
			var editList = [];
			
			for(var f in d) {
				if( self.inArray(f,fieldList)!=-1 ) {
					var ed = self.setFieldValue(rid,f,d[f]);	
					if( ed !== false ) {
						editList.push(f);
					}
				}	
			}
			//editList:修改过的单元格
			self.fireEvent("onAfterUpdateRow",[rid,d,editList]);
			return true;
		},
		//删除行
		deleteRow : function(rid,m){
			
			var self = this,
				opt = self.configs,
				data = opt.data,
				gid = opt.gid;
			var m = $.dataGrid._undef(m,true);	
			var r = self.fireEvent("onBeforeDeleteRow",[rid]);
			if( r === false ) {
				return false;	
			}
			
			var tr = $("#"+opt.id+"-row-"+rid);
			/*if( !tr.size() ) {
				return false;	
			}*/
			
			var ltr = $("#"+opt.id+"-view1-row-"+rid);
			
			var data = tr.size() ? tr.data('rowData') : opt.data[rid];
			if( !data ) return false;
			if( !data[opt.pk] ) {
				return false;	
			}
			
			if( m ) {
				
				for( var i=0;i<opt.data.length;i++ ) {
					if( opt.data[i][opt.pk] == data[opt.pk] ) {
						opt.data.splice(i,1);//删除	
						break;
					}	
				}
				if( self.getAsync() ) {
					var datas = self.getData();
					for( var i=0;i<datas.length;i++ ) {
						if( datas[i][opt.pk] == data[opt.pk] ) {
							datas.splice(i,1);//删除
							break;
						}	
					}
				}
				opt.total--;
			}
			
			//$("#"+opt.id+"-row-"+rid).remove();
			//$("#"+opt.id+"-view1-row-"+rid).remove();
			tr.remove();
			ltr.remove();
			self.destroyExpandRow(rid);
			
			self.fireEvent("onAfterDeleteRow",[rid]);
			//self.resetViewSize();
			self.methodInvoke('resetViewSize');
			
			return true;
			
		}
	}); 
	//大数据支持
	$.dataGrid.fn.extend({
		_loadRows : function(){
			
			var self = this,
				opt = self.configs,
				data = opt.data;
			var len = opt.pageTotal || data.length;
			
			if( !opt.lazyLoadRow || !len ) return;
			
			var vh = $("#view2-datagrid-body-"+opt.id).height();
			
			//console.log(opt.sTop);
			
			opt.__vh = vh;
			
			var totalRow = (opt.lazyMaxRow ? opt.lazyMaxRow : Math.ceil(vh/opt._trHeight)) + opt.lazyTopRows + opt.lazyBottomRows;
			var start = Math.ceil(opt.sTop/opt._trHeight) - opt.lazyTopRows;
			start = start>0 ? start : 1;
			var end = totalRow + start;
			end = end<=len ? end : len;
			if( start >= len ) {
				end = len;	
				start = end - totalRow;
				start = start>0 ? start : 1;
			}
			
			var r = self.fireEvent("onBeforeLazyLoadRow",[start,end,data]);
			if( r === false ) return false;
			
			var vheader = (start-1)*opt._trHeight;
			var vfooter = (len-end)*opt._trHeight;
			
			$("#view2-datagrid-body-btable-tbody-header-"+opt.id).height(vheader);
			$("#view1-datagrid-body-btable-tbody-header-"+opt.id).height(vheader);
			
			$("#view2-datagrid-body-btable-tbody-footer-"+opt.id).height(vfooter);
			$("#view1-datagrid-body-btable-tbody-footer-"+opt.id).height(vfooter);
		
			self.lockMethod('resetViewSize');
			
			var _dr = [];
			
			for( var x=0;x<opt.lazyRows.length;x++ ) {
				
				if( opt.lazyRows[x]>=(start-1) && opt.lazyRows[x]<=(end-1) ) {
					continue;
				}
				var rid = opt.lazyRows[x];
				
				if( self.inArray( rid,opt.lockRows )!=-1 ) continue;
				
				self.denyEventInvoke('deleteRow',rid,false);
				
				self.fireEvent("onLazyRowHide",[rid]);
				
				_dr.push(rid);
			}
			for( var _de=0;_de<_dr.length;_de++ ) {
				var drid = _dr[_de];
				var _ix = self.inArray( drid,opt.lazyRows );
				if( _ix != -1 ) {
					opt.lazyRows.splice(_ix,1);		
				}
			}

			var $lazyRows = opt.lazyRows;
			//opt.lazyRows = [];
			//var n = $.now();
			for(var i=start;i<=end;i++ ) {
				var rid = i-1;
				if( self.inArray( rid,$lazyRows ) != -1 ) {
					continue;	
				}
				
				if( self.inArray( rid,opt.lockRows )!=-1 ) continue;
				
				var tr_row = self.denyEventInvoke('_insert',rid,data[rid],false);	
				
				if( tr_row.isNew ) {
					//行事件绑定
					if( opt.denyRowEvents === false ) {
						self.bindRowEvent(tr_row.tr,tr_row.ltr);
					} else if( $.isFunction(opt.denyRowEvents) ) {
						opt.denyRowEvents.call(self,tr_row.tr,tr_row.ltr);	
					}
				}
				
				opt.lazyRows.push(rid);
				
				
				self.fireEvent("onLazyRowShow",[rid,tr_row]);
				
			}
			//console.log( $.now()-n );
			opt.lazyRows.sort(function(a,b){
				return a>=b ? 1 : -1;						   
			});
			
			//console.log(start,'-',end,' : ',opt.lazyRows);
			
			self.unLockMethod('resetViewSize');
			
		},
		//m true 强制刷新,   默认 false
		loadRows : function(m){
			var self = this,
				opt = self.configs;
			var len = opt.pageTotal || opt.data.length;
			
			if( !opt.lazyLoadRow ) return;
			
			var m = $.dataGrid._undef(m,false);
			
			var tq= opt._tq;
			if( tq ) {
				clearTimeout(tq);
			}
			
			var _func = function(){
				var initLazy = opt._initLazy;
				opt._initLazy = false;
				
				if( opt._trHeight<=0 ) {
					self.denyEventInvoke('_insert',0,{},false);	
					opt._trHeight = $("#"+opt.id+"-row-0").outerHeight();
					self.denyEventInvoke('deleteRow',0,false);
				}
				
				opt._hc = Math.min(opt.lazyBottomRows,opt.lazyTopRows) * opt._trHeight - opt._lazyEdge;
				
				var needLoad = false;
				if( !initLazy ) {
					if( Math.abs(opt.sTop-opt._csTop)<=opt._hc && !m  ) {
						return;	
					} else {
						
						//计算相差值 如果太多则显示loading
						opt.__vh = opt.__vh || $("#view2-datagrid-body-"+opt.id).height();
						if( Math.abs(opt.sTop-opt._csTop)>= opt.__vh ) {
							needLoad = true;	
						}
						
						opt._csTop = opt.sTop;	
					}	
				} else {
					opt.lazyRows = [];
					opt._csTop = opt.sTop;
				}
				
				self.lockEvent('onScroll');
				if( (needLoad || initLazy) && opt.showLazyLoading ) {
					self.showLoading();	
				}
				setTimeout(function(){
					//console.log('xx');
					self._loadRows();
					//设置滚动条
					self.onScroll(true);//必须
					//rowNumber滚动条
					self.onScroll();
					
					if( (needLoad || initLazy) && opt.showLazyLoading ) {
						self.hideLoading();	
					}
					self.fireEvent('onShowLazyRows',[opt.lazyRows]);
					if( initLazy ) {
						//code
						self.afterGridShow(true);
					}
					self.unLockEvent('onScroll');
					
				},0);	
			};
			
			var t;
			t = setTimeout(function(){
				self.fireEvent('onBeforeShowLazyRows',[]);
				_func();
			},50);
			opt._tq = t;
			
		},
		lazyLoadRow : function(){
			var self = this,
				opt = self.configs,
				data = opt.data;
			
			var len = opt.pageTotal || opt.data.length;
			
			var fields = opt.columns;
			
			var view2_tbodyId = $("#view2-datagrid-body-"+opt.id);
			var view1_tbodyId = $("#view1-datagrid-body-"+opt.id);
			
			var rows_view1 = ['<table class="datagrid-btable" id="view1-datagrid-body-btable-'+opt.id+'" cellspacing="0" cellpadding="0" border="0"><tbody id="view1-datagrid-body-btable-tbody-'+opt.id+'"><tr class="datagrid-row-header" id="view1-datagrid-body-btable-tbody-header-'+opt.id+'" style="height:0px;"></tr>'];
			var rows_view2 = ['<table class="datagrid-btable" id="view2-datagrid-body-btable-'+opt.id+'" cellspacing="0" cellpadding="0" border="0"><tbody id="view2-datagrid-body-btable-tbody-'+opt.id+'"><tr class="datagrid-row-header" id="view2-datagrid-body-btable-tbody-header-'+opt.id+'" style="height:0px;"></tr>'];
			
			if(  !$.isArray(data) ) {
				data = [];	
			}
			
			rows_view2.push('<tr class="datagrid-row-footer" id="view2-datagrid-body-btable-tbody-footer-'+opt.id+'" style="height:0px;"></tr></tbody></table>');
			rows_view1.push('<tr class="datagrid-row-footer" id="view1-datagrid-body-btable-tbody-footer-'+opt.id+'" style="height:0px;"></tr></tbody></table>');
			
			view2_tbodyId.html(rows_view2.join(""));
			view1_tbodyId.html( rows_view1.join("") );
			
			//取得行高
			if( opt._trHeight<=0 ) {
				self.denyEventInvoke('_insert',0,{},false);	
				opt._trHeight = $("#"+opt.id+"-row-0").outerHeight();
				self.denyEventInvoke('deleteRow',0,false);
			}
			var vh = opt._trHeight*len;
			
			$("#view2-datagrid-body-btable-tbody-header-"+opt.id).height( vh );
			$("#view1-datagrid-body-btable-tbody-header-"+opt.id).height( vh );
			
		}
	}); 
	//表格转grid
	$.fn.togrid = function(cfg,_cfg){//如果url='' 只能处理简单的table比如 表头不会包含的合并之类的
		
		cfg = $.dataGrid._undef(cfg,{});
		var _cfg = $.dataGrid.getToGridOptions(_cfg);
		
		var list = [];
		
		this.each(function(i){
			$(this).css("display",'block');
			
			//table options 获取
			if( $(this).attr( _cfg.options_from ) ) {
				var opt = "{"+ $(this).attr( _cfg.options_from ) +"}";
				opt = eval("("+opt+")");
			} else {
				var opt = {};	
			}
			
			var wh = {
					width : $(this).outerWidth(),
					height : $(this).outerHeight(),
					title : $(this).attr("title")
				};
			
			var columns = [];
			
			if( !$(this).find(_cfg.columns_from).size() ) {
				_cfg.columns_from = 'tr:first-child td,tr:first-child th';
			}
			
			var thead = $(this).find(_cfg.columns_from);
			var avg_w = 0;
			if( cfg.border !== false || opt.border !== false ) {
				avg_w = 2/thead.size();//本来应该要减去平均值的 还是直接在下面-1得了
			}
			thead.each(function(i){
				//忽略 ignore 的 th td
				if( $(this).attr("ignore") != undefined ) {
					return;	
				}
				//column options 获取
				if( $(this).attr( 'field' ) ){
					var column_a = {field:$(this).attr( 'field' )};	
				} else {
					var column_a = {};	
				}
				if( $(this).attr( _cfg.options_from ) ) {
					var column_b = "{"+$(this).attr( _cfg.options_from )+"}";	
					column_b = eval("("+ column_b +")");
				} else {
					var column_b = {};	
				}
				var column = $.extend({},column_b,column_a);
				column.title = $(this).html();
				column.field = column.field ? column.field : "field_"+(Math.floor(Math.random() * 999999));
				column.width = column.width ? column.width : $(this).outerWidth()- 1 - 1;
				//column.width -= $.dataGrid.padding;
				if( $(this).attr('align') ) {
					column.align = $(this).attr('align') ;
				}
				if( column.field == "ck") {//系统字段
					opt.checkBox = 	true;
				}
				if( column.field == "ed") {//系统字段
					wh.editColumn = true;
				}
				columns.push(column);
			});
			$(this).find(_cfg.columns_from).parent("tr").remove();
			
			
			
			if( !$(this).find(_cfg.data_from).size() ) {
				_cfg.data_from = 'tr';
			}
			opt.columns = columns;
			opt = $.extend(true,wh,opt,cfg);
			
			if( $(this).find(_cfg.footdata_from).size() ) {
				var footerData = [];
				$(this).find( _cfg.footdata_from ).each(function(i){
					var _d = {};
					$(this).find(">td,>th").each(function(i){
						var data = $(this).html();
						if( !$(this).attr("field") ) {
							if( opt.columns[i]['field'] )
								_d[ opt.columns[i]['field'] ] = data;
						} else {
							_d[ $(this).attr("field") ] = data;	
						}
					});
					footerData.push(_d);		
				});
				$(this).find( _cfg.footdata_from ).remove();
				opt.footerData = footerData;
			}
			
			//判断data数据的来源
			if(!opt.url) {//获取表格数据
				var data = [];
				$(this).find( _cfg.data_from ).each(function(i){
					var _d = {};
					$(this).find(">td,>th").each(function(i){
						var data = $(this).html();
						if( !$(this).attr("field") ) {
							if( opt.columns[i]['field'] )
								_d[ opt.columns[i]['field'] ] = data;
						} else {
							_d[ $(this).attr("field") ] = data;	
						}
					});
					data.push(_d);		
				});
				
				opt.data = data;
			}
			
			
			
			opt.helper = $("<div id='"+ ($(this).attr('id') ? $(this).attr('id') : '')+"' class='datagrid "+ $(this).attr('class') +"'></div>");
			
			$(this).after(opt.helper).remove();
			
			var grid = new $.dataGrid(opt);
			
			opt.helper.data('metaData',opt);	
			opt.helper.data("datagrid",grid);
			
			list.push(grid);
		});
		
		if( this.size() == 1 ) {
			return list[0];
		} else {
			return list	;
		}
	};
	$.fn.toGrid = $.fn.togrid;
	
})(jQuery);