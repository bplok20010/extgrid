/*
jquery.dataGrid.js
author:nobo
qq:505931977
email:zere.nobo@gmail.com
*/
;(function($){
	$.dataGrid = function(options){
		this.init(options);
	};
	$.dataGrid.fn = {};
	$.dataGrid.fn.extend = function(obj){
		$.extend($.dataGrid.prototype,obj);
	};
	$.dataGrid.extend = function(obj){
		$.extend($.dataGrid,obj);	
	};
	$.dataGrid.extend({
		defaults : 	{
			title : '',//为空不显示标题
			toolBars : false,
			width : 700,
			height : 250,
			columns : [],//
			columnsWidth : '120px',//默认的列宽
			data : [],//列表数据
			pk : '',//主键名称
			isCreate : false,
			views : [],
			method : 'post',
			url : '',
			loadMsg : '加载中,请稍后...',
			cache : true,//缓存
			cacheData : [],
			pagination : true,//page栏目
			pageNumber : 1,
			pageSize : 10,
			dataType : 'json',
			pageList : [10,20,30,40,50],
			queryParams : {},
			events : {
				onStart : $.noop,//创建开始
				onFinish : $.noop,//创建结束
				onBeforeLoad : $.noop,//调用远程数据开始 ，如果返回false讲取消本次请求
				onLoadSuccess : $.noop,//调用远程数据成功
				onLoadError : $.noop,//调用远程数据失败
				onClickRow : $.noop,//当用户点击一行时触发
				onDblClickRow : $.noop,//当用户双击一行时触发
				onClickCell : $.noop,//当用户单击一个单元格时触发
				onDblClickCell : $.noop,//当用户双击一个单元格时触发
				onSortColumn : $.noop,//当用户对一列进行排序时触发
				onResizeColumn : $.noop,//当用户调整列的尺寸时触发
				onSelect : $.noop,//用户选中一行时触发
				onUnselect : $.noop,//当用户取消选择一行时触发
				onSelectAll : $.noop,//当用户选中全部行时触发
				onUnselectAll : $.noop,//当用户取消选中全部行时触发
				onHeaderContextMenu : $.noop,//当 datagrid 的头部被右键单击时触发
				onRowContextMenu : $.noop,//当右键点击行时触发
				onBeforeRefresh : $.noop,
				onRefresh : $.noop,
				onChangePageSize : $.noop,
				onSelectPage : $.noop,
				onBeforeRefresh : $.noop
			}//事件组合
			
		},
		_undef : function (val, defaultVal) {
			return val === undefined ? defaultVal : val;
		},
		tpl : baidu.template,// bt
		_Tpl : {
			'container' : '<div class="datagrid-container" id="<%=id%>" style=" position:relative; overflow:hidden; width:<%=width%>px; height:<%=height%>px;"></div>',
			'title' : '<div class="datagrid-title" id="title_<%=id%>"><%=title%></div>',
			'grid' : '<div class="datagrid-view" id="view_<%=id%>" style="width:<%=width%>px; height:0px;"></div>',
			'view1' : '<div class="datagrid-view1" style="width:0px;height:100%;"></div>',//尚未开启
			'view2' : '<div class="datagrid-view2" style="width:0px;height:100%;"></div>',
			'grid_header' : '<div  class="datagrid-header" style="width: 100%;">'
								+'<div class="datagrid-header-inner">'
									+'<table class="datagrid-htable" border="0" cellspacing="0" cellpadding="0">'
										+'<tbody>'
											+'<tr class="datagrid-header-row">'
												+'<% for(var i in fields) {%>'
												+'<td field="<%=fields[i]["field"]%>" align="<%=fields[i]["align"]%>">'
													+'<div class="datagrid-cell"  style="width:<%=fields[i]["width"]%>">'
														+'<span><%=fields[i]["title"]%></span>'
														+'<span class="datagrid-sort-icon">&nbsp;</span>'
													+'</div>'
												+'</td>'
												+'<% } %>'
											+'</tr>'
										+'</tbody>'
									+'</table>'
								+'</div>'
							+'</div>',
			'grid_body' : '<div class="datagrid-body" style="width: 100%;height:0px;">'
							+'<table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0">'
								+'<tbody>'
									+'<% for(var i in data) {%>'
									+'<tr id="datagrid-row-<%=i%>" datagrid-row-index="<%=i%>" class="datagrid-row">'
										+'<% for(var j in fields) {%>'
										+'<% var field = fields[j]["field"];%>'
										+'<td field="<%=fields[j]["field"]%>" align="<%=fields[j]["align"]%>">'
											+'<div class="datagrid-cell datagrid-cell-c1-<%=fields[j]["field"]%>" style="width:<%=fields[j]["width"]%>;" ><%=data[i][field]%></div>'
										+'</td>'
										+'<% } %>'
									+'</tr>'
									+'<% } %>'
								+'</tbody>'
							+'</table>'
						+'</div>',
			'grid_footer' : '<div  class="datagrid-footer" style="width: 100%;"></div>',
			'pager' : '<div class="datagrid-pager pagination" id="pager_<%=id%>">'
							+ '<table cellspacing="0" cellpadding="0" border="0"><tbody><tr><td><select class="pagination-page-list"><option>10</option><option>20</option><option>30</option><option>40</option><option>50</option></select>分页工具栏</td></tr></tbody></table>'
						+ '</div>',
			'colums' : '',
			'rows' : ''
		}
		
	});
	$.dataGrid.fn.extend({
		init : function(options) {
			var self = this;
			
			self.configs = 	$.extend({},$.dataGrid.defaults,options);
			
			var e = self.configs.events;
			
			//默认datagrid有边框 如果从css中去掉边框样式，可以去掉下面的2像素只差
			self.configs.width -= 2;
			self.configs.height -= 2;
			self.configs.id = self.configs.id || self.getId();
			self.configs.gid = self.configs.gid || "#view_"+self.configs.id;
			
			e.onStart();
			
			self.setContainer() //setContainer必须
				.setTitle()
				.setGrid()
				.setPager()
				.show();
				
			e.onFinish();
		},
		//添加事件
		bind : function(eventType,func){
			if( typeof eventType == "undefined" ) {
				return this;	
			}
			var func = func || $.noop;
			var self = this;
			var event = self.configs.events;
			event[eventType] = func;
			return self;
		},
		getId : function(){
			return 'datagrid_' + Math.floor(Math.random() * 99999);	
		},
		showLoading : function(msg,render){
			var self = this;	
			var opt = self.configs;
			var msg = msg || opt.loadMsg;
			var render = render || "#view_"+opt.id;
			self.hideLoading(render);
			$('<div class="datagrid-mask" style="display:block"></div><div class="datagrid-mask-msg" style="display: block; left: 50%;">'+msg+'</div>').appendTo("#view_"+opt.id);
			var w = $(render).find(".datagrid-mask-msg").width();
			$(render).find(".datagrid-mask-msg").css("marginLeft",-w/2);
		},
		hideLoading : function(render){
			var self = this;
			var opt = self.configs;
			var render = render || "#view_"+opt.id;
			$("#"+opt.id).find(".datagrid-mask-msg,.datagrid-mask").remove();
		},
		setContainer : function(opt) {
			var opt = opt || {};
			var self = this;
			var opt = $.extend({},self.configs,opt);
			var tpl = $.dataGrid.tpl($.dataGrid._Tpl.container,opt);
			opt.helper.html(tpl);
			return self;
		},
		setTitle : function(title) {
			var self = this;
			var opt = self.configs;
			opt.title = title || opt.title;
			if(opt.title=="") return self;
			var tpl = $.dataGrid.tpl($.dataGrid._Tpl.title,opt);
			self.configs.views['title'] = $(tpl);
			return self;
		},
		setGrid : function () {
			var self = this;
			var opt = self.configs;
			var views = opt.views;
			if(!views['grid']) {
				var tpl = $.dataGrid.tpl($.dataGrid._Tpl.grid,opt);
				self.configs.views['grid'] = $(tpl);
			} else {//设置高度
				var grid = views['grid'];
				var h = 0;
				for(var i in views) {
					if(i == 'grid') continue;
					h += views[i].outerHeight(true);
				}
				/*
				try{
				console.log(opt.height +"-"+ h);
				} catch(e){}
				*/
				grid.height(opt.height - h);
			}
			return self;
		},
		setPager : function() {
			var self = this;
			var opt = self.configs;
			var tpl = $.dataGrid.tpl($.dataGrid._Tpl.pager,opt);
			if( !opt.pagination ) return self;
			self.configs.views['pager'] = $(tpl);
			return self;	
		},
		
		setView : function(){
			var self = this,
				opt = self.configs,
				tpl_view1 = $.dataGrid.tpl($.dataGrid._Tpl.view1,opt),
				tpl_view2 = $.dataGrid.tpl($.dataGrid._Tpl.view2,opt),
				gid = opt.gid;
				$(gid).html('');//防止重复调用
				var w = $(tpl_view1).appendTo(gid).width();
				$(tpl_view2).appendTo(gid).width( $(gid).width() - w );
		},
		getRowData : function (rid){
			var self = this;	
			var data = self.configs.data;
			return data[rid];
		},
		getFieldValue : function (rid,field){
			var data = this.getRowData(rid);
			return data[field];
		},
		getSlectRow : function (){
				
		},
		getColumns : function(){
			var self = this,
			opt = self.configs,
			columns = opt.columns;
			//检测是否设置了 列 否则用data的key作为列名
			if(columns.length<=0) {
				if(opt.data.length>0) {
					for(var i in opt.data[0]) {
						columns.push({'field':i});
					}
				}
			}
			for(var i in columns) {
				columns[i]['title'] = columns[i]['title'] || columns[i]['field'];
				columns[i]['width'] = columns[i]['width'] || opt.columnsWidth;
				if(typeof columns[i]['width'] == 'number') columns[i]['width'] += 'px';
				columns[i]['align'] = columns[i]['align'] || 'left';
				columns[i]['callBack'] = columns[i]['callBack'] || $.noop;
			}
			return columns;
		},
		setGridHeader : function(render){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var render = render || gid+" .datagrid-view2";
			var fields = self.getColumns();
			var isSet = $(render).find(".datagrid-header").size();
			var grid_header = $.dataGrid.tpl( $.dataGrid._Tpl.grid_header , {'fields':fields} );
			if(isSet) {
				$(render).find(".datagrid-footer").replaceWith( grid_header );
				opt.gheader = $(render).find(".datagrid-footer");
			} else {
				opt.gheader =$(grid_header).appendTo(render);
			}
			return opt.gheader;
		},
		//async 当数据需要用ajax获取 async=false
		//必须要返回一个html dom
		setGridBody : function(render,async){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var render = render || gid+" .datagrid-view2";
			var async = async || ( opt.url == "" ? true : false );
			var fields = self.getColumns();
			if(!async) {//ajax获取数据
				self.getGridData(function(){
					self.setGridBody(render,true);					  
				});
				var data = [];
			} else {
				var data = opt.data;
			}
			var isSet = $(render).find(".datagrid-body").size();
			var grid_body = $.dataGrid.tpl( $.dataGrid._Tpl.grid_body , {'data':data,'fields':fields} );
			if(isSet) {
				$(render).find(".datagrid-body").replaceWith( grid_body );
				opt.gbody = $(render).find(".datagrid-body");
			} else {
				opt.gbody =$(grid_body).appendTo(render);
			}
			if(opt.isCreate) {
				self.resetGridHeight(render,opt.gbody,[opt.gheader,opt.gfooter]);
			}
			if(data.length) {//datagrid创建后 执行 行 事件绑定
				var e = self.configs.events;
				opt.gbody.find("tr.datagrid-row").click(function(ev){
					var rowId = $(this).attr("datagrid-row-index");
					var rowData = self.getRowData(rowId);
					//触发单击行事件
					var r = e.onClickRow.call(this,rowId,rowData);
					
					//触发行 是否选择事件
					if(typeof this.isSelect != 'undefined' && this.isSelect == true) {
						this.isSelect = false;
						e.onUnselect.call(this,rowId,rowData);	
					} else {
						this.isSelect = true;
						e.onSelect.call(this,rowId,rowData);
					}
					if(r == false) return false;
				});
				
				opt.gbody.find("tr.datagrid-row").dblclick(function(){
					var rowId = $(this).attr("datagrid-row-index");
					var rowData = self.getRowData(rowId);
					//双击行事件dblclick
					var r = e.onDblClickRow.call(this,rowId,rowData);
					if(r == false) return false;
				});
				
				opt.gbody.find("td div.datagrid-cell").click(function(){
					var rowId = $(this).parent("td").parent("tr.datagrid-row").attr("datagrid-row-index");
					var field = $(this).parent("td").attr("field");
					var value = self.getFieldValue(rowId,field);
					//双击行事件dblclick
					var r = e.onClickCell.call(this,rowId,field,value);
					if(r == false) return false;
				});
				opt.gbody.find("td div.datagrid-cell").dblclick(function(){
					var rowId = $(this).parent("td").parent("tr.datagrid-row").attr("datagrid-row-index");
					var field = $(this).parent("td").attr("field");
					var value = self.getFieldValue(rowId,field);
					//双击行事件dblclick
					var r = e.onDblClickCell.call(this,rowId,field,value);	
					if(r == false) return false;
				});
				
				opt.gbody.find("tr.datagrid-row").bind("contextmenu",function(ev){
					var rowId = $(this).attr("datagrid-row-index");
					var rowData = self.getRowData(rowId);
					//触发单击行事件
					var r = e.onRowContextMenu.call(this,rowId,rowData);
					if(r == false) return false;
				});
				
			}
			return opt.gbody;
		},
		setGridFooter : function(render){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var isSet = $(render).find(".datagrid-body").size();
			var render = render || gid+" .datagrid-view2";
			var fields = self.getColumns();
			var grid_footer = $.dataGrid.tpl( $.dataGrid._Tpl.grid_footer , {'data':opt.data,'fields':fields} );
			if(isSet) {
				$(render).find(".datagrid-footer").replaceWith( grid_footer );
				opt.gfooter = $(render).find(".datagrid-footer");
			} else {
				opt.gfooter =$(grid_footer).appendTo(render);
			}
			return opt.gfooter;
		},
		resetGridHeight : function(render,subject,iarr){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var render = render || gid+" .datagrid-view2";
			var h = $(render).height();
			for(var i in iarr) {
				h -= iarr[i].height();
			}
			
			//重设高度
			subject.height( h );
			
			// 滚动条事件绑定
			subject.scroll(function(){
				$(render+" .datagrid-header")._scrollLeft( $(this)._scrollLeft() );
			});
			return this;
		},
		//刷新表格数据
		refreshData : function(){
			var e = this.configs.events;
			e.onBeforeRefresh.call(this);
			this.setGridBody();	
		},
		//重新生成grid
		reLoadGrid : function(){
			var opt = this.configs;
			opt.views = [];//清空视图缓存
			opt.isCreate = false;
			$.dataGrid.call(this,opt);
		},
		//设置参数
		C : function(key,value){
			if( typeof key == 'undefined') {
				return this.configs;	
			}
			if( typeof value == 'undefined') {
				return this.configs[key];
			}
			this.configs[key] = value;
			return this;
		},
		createGrid : function(render){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
				
			
			var render = render || gid+" .datagrid-view2";
			
			opt.gheader = self.setGridHeader(render);
			opt.gbody = self.setGridBody(render);//grid数据列表
			opt.gfooter = self.setGridFooter(render);
			
			//重设gird 
			self.resetGridHeight(render,opt.gbody,[opt.gheader,opt.gfooter]);
			
			//设置gird已经创建标志
			opt.isCreate = true;
		},
		//获取ajax返回的data数据
		getGridData : function(successBack,errorBack){
			var self = this,
				opt = self.configs;
				opt.queryParams.page = opt.pageNumber;
				opt.queryParams.limit = opt.pageSize;
			var e = self.configs.events;
			var successBack = successBack || e.onLoadSuccess;
			var errorBack = errorBack || e.onLoadError;
			
				$.ajax({
					url : opt.url,
					type : opt.method,
					cache : opt.cache,
					dataType : opt.dataType,
					data : opt.queryParams,
					beforeSend : function(){
						e.onBeforeLoad.call(self);
						self.showLoading();	
					},
					success : function(data){
						self.hideLoading();
						opt.data = data.rows;
						opt.total = data.total;
						successBack.call(self,data);
					},
					error : function(xmlHttp){
						errorBack.call(self,xmlHttp.responseText);
						self.showLoading(xmlHttp.responseText);
						setTimeout(function(){
							self.hideLoading();				
						},2000);
					}
				});	
			
		},
		show : function (){
			var self = this;
			var opt = self.configs;
			var views = opt.views;
			var container = $("#"+opt.id);
			for(var i in views) {
				container.append( views[i] );	
			}
			self.setGrid();//必须 重新设置宽高
			self.setView();// 显示grid的容器
			self.createGrid();//gird数据显示开始...
		}
	});
	
	$.fn._scrollLeft=function(_10){
		if(_10==undefined){
			return this.scrollLeft();
		}else{
			return this.each(function(){
				$(this).scrollLeft(_10);
			});
		}
	};
	
	$.fn._scrollTop=function(_10){
		if(_10==undefined){
			return this.scrollTop();
		}else{
			return this.each(function(){
				$(this).scrollTop(_10);
			});
		}
	};
	
	$.fn.datagrid = function(opt){
		if(this.size()<=0 || this.size()>1){
			alert('容器不正确');
			return false;
		}
		var self = this;
		var opt = opt || {};
		opt.selector = self.selector;
		opt.helper = self;
		opt.width = $.dataGrid._undef(opt.width,self.width());
		opt.height = $.dataGrid._undef(opt.height,self.height());
		return new $.dataGrid(opt);
	}
})(jQuery);