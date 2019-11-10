/*
jquery.dataGrid.js
author:nobo
qq:505931977
email:zere.nobo@gmail.com
版本 3.0
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
		getDefaults : function(){
			return 	{
				init : $.noop,//初始化调用
				title : '',//为空不显示标题
				toolBars : false,// [{'text':'添加',cls:'样式',callBack,disabled:false}]
				_toolItem : {text : '',cls : '',callBack : $.noop,disabled:false},//tool 属性
				rowNumbersWidth : '0px',//左侧数字列表 一般设为24px
				rowNumbersExpand: false,//默认是 i++
				rowNumbers2Row : true,//开启当rowNumbers2Row click的时候 选择当前行
				leftBorder : 1, //gird边框大小 注意grid不会生成边框，而是根据你自己在css中定义的边框大小， 系统默认的是1px
				rightBorder : 1,
				topBorder : 1,
				bottomBorder : 1,
				width : 700,
				height : 250,
				checkBox : false,//是否显示checkbox列
				editColumn : false,//是否显示edit列 [{'text':'添加',cls:'样式',callBack,disabled:false}]
				editColumnTitle : '操作',
				editCellW : 60,//每个操作按钮的大小
				columns : [],//
				_columnMetaData : {
					field : '',
					title : '',
					width : '120px',//默认的列宽
					align : 'left',
					_expand : false,//自定义列内容
					callBack : $.noop,
					hcls : '',//header cell自定义css
					bcls : '',//body cell自定义css
					fcls : '',//footer cell自定义css
					sortable : false, 
					textLimit : false,//当处理大数据的时候 性能消耗比较厉害，
					fitColumn : true,
					disabled : false//当前列不可用
				},
				textLimitDef : '...',
				//columnsWidth : '120px',//默认的列宽
				groupBy : false,//'year'  
				groupList : false,//['2012','2013','2014']
				groupListCallBack : $.noop,//group row的回调 
				_groupListData : [],//数据缓存
				_sTop : 0,//初始滚动位置
				_sLeft : 0,
				fitColumns : true,//移动列总开关
				data : [],//列表数据 含有_expand的将作为扩展列 如果有 _openExpand=true 则会自动展开
				pk : '',//主键名称
				lockRows : [],
				lockColumns : [],
				hideColumns : [],//已经隐藏的列
				isCreate : false,
				isShow : false,
				views : {},
				method : 'post',
				url : '',
				loadMsg : '加载中,请稍后...',
				cache : true,//缓存
				cacheData : [],
				pagination : false,//page栏目
				pageNumber : 1,
				pageSize : 10,
				dataType : 'json',
				pageList : [10,20,30,40,50],
				queryParams : {},
				singleSelect : false,//是否可以多选
				iconCls : '',//datagrid 标题的icon样式
				sortName : '',
				sortOrder : 'asc',
				rowStyler : "",//行style 字符串作为 class function(rowid,rowdata)
				tpl : {},
				methodCall : {},//内部函数的回调函数
				ESCAPE : false,//是否开启模板转义
				events : {
					onStart : $.noop,//创建开始 1
					onFinish : $.noop,//创建结束 1
					onBeforeLoad : $.noop,//调用远程数据开始 ，如果返回false讲取消本次请1求
					onLoadSuccess : $.noop,//调用远程数据成功1
					onLoadError : $.noop,//调用远程数据失败1
					onClickRow : $.noop,//当用户点击一行时触发1
					onOverRow : $.noop,//当用户mouseover row
					onOutRow : $.noop,//当用户mouseout row
					onDblClickRow : $.noop,//当用户双击一行时触发1
					onClickCell : $.noop,//当用户单击一个单元格时触发1
					onDblClickCell : $.noop,//当用户双击一个单元格时触发1
					onSortColumn : $.noop,//当用户对一列进行排序时触发1
					onResizeColumnStart : $.noop,//当用户调整列的尺寸时触发1
					onResizeColumn : $.noop,//当用户调整列的尺寸时触发1
					onResizeColumnStop : $.noop,//当用户调整列的尺寸时触发1
					onSelect : $.noop,//用户选中一行时触发1
					onUnselect : $.noop,//当用户取消选择一行时触发1
					onSelectAll : $.noop,//当用户选中全部行时触发1
					onUnselectAll : $.noop,//当用户取消选中全部行时触发1
					onHeaderContextMenu : $.noop,//当 datagrid 的头部被右键单击时触发1
					onToolBarCreate: $.noop,//排序触发1
					onRowContextMenu : $.noop,//当右键点击行时触发1
					onBeforeRefresh : $.noop,//1
					onRefresh : $.noop,//1
					onChangePageSize : $.noop,//1
					onShowGrid : $.noop,// grid 每次刷新都会调用
					onBeforeShowGrid : $.noop, 
					onGetData : $.noop,//1 grid 数据变动都会调用
					onSelectPage : $.noop,//1
					onClickRowNumber : $.noop,//1
					onSearch : $.noop,//1
					onExpandRow : $.noop,//1
					onLockColumn :  $.noop,//锁行事件
					onAfterLockColumn :  $.noop,//锁列结束
					onLockRow : $.noop,
					onAfterLockRow : $.noop,//锁行结束
					onUnlockColumn : $.noop,
					onUnlockRow : $.noop,
					onViewSizeChange : $.noop,
					onSizeChange : $.noop,
					onScroll : $.noop,
					onDataChange : $.noop,//数据有变更
					onAdd : $.noop,//添加数据
					onUpdate : $.noop,//更新数据
					onDelete : $.noop,//删除数据
					onAjaxAdd : $.noop,//远程添加数据 需要自定义
					onAjaxUpdate : $.noop,//远程更新数据 需要自定义
					onAjaxDelete : $.noop//远程删除数据 需要自定义
				}//事件组合 
				
			};
		},
		_undef : function (val, defaultVal) {
			return val === undefined ? defaultVal : val;
		},
		tpl : baidu.template,// bt
		_Tpl : {
			'container' : '<div class="datagrid-container" id="<%=id%>" style=" position:relative; overflow:hidden; width:<%=width%>px; height:<%=height%>px;"></div>',
			'title' : '<div class="datagrid-title <%=iconCls%>" id="title_<%=id%>"><%=title%></div>',
			'toolbar' : '<div class="datagrid-toolbar" id="toolbar_<%=id%>"></div>',
			'grid' : '<div class="datagrid-view" id="view_<%=id%>" style="width:<%=width%>px; height:0px;"></div>',
			'group_row' : '<tr id="<%=id%>-group-row-<%=gid%>"  datagrid-group-row-id="<%=gid%>" class="datagrid-group-row"><td style="width:<%=w%>px" colspan="<%=colspan%>"><div  class="datagrid-group-cell"><%=html%>(<%=num%>)</div></td></tr>',
			'view1' : '<div class="datagrid-view1" style="width:<%=rowNumbersWidth%>;height:100%;">'
							+'<div  class="datagrid-header" style="width: 100%; z-index:40; position:relative;">'
								+'<div class="datagrid-header-inner">'
									+'<table class="datagrid-htable" border="0" cellspacing="0" cellpadding="0">'
										+'<tbody>'
											+'<tr class="datagrid-header-row">'
											+'<td class="datagrid-td-rownumber"><div class="datagrid-header-rownumber" style="width:<%=parseInt(rowNumbersWidth)%>px;"></div></td>'
											+'</tr>'
										+'</tbody>'
									+'</table>'
								+'</div>'
							+'</div>'
							+'<div class="datagrid-body-wrap" style="height:10000000px; overflow:hidden;zoom:1; ">'
								+'<div class="datagrid-body" style="width: 100%;float:left;z-index:30;position:relative;">'
									+'<table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0">'
										+'<tbody>'
											+'<% var len = isCreate ? data.length : pageSize; %>'
											+'<% for(var i=0;i<len;i++) { %>'
											+'<tr id="<%=id%>-view1-row-<%=i%>" style="<%=(groupBy !== false) ? "display:none" : ""%>" <%=( isCreate && typeof data[i]["_groupid_"] != "undefined" ) ? "datagrid-group-id="+data[i]["_groupid_"] : ""%> datagrid-row-index="<%=i%>" datagrid-row-select="0" class="datagrid-row datagrid-row-view1">'
												+'<td align="center" class="datagrid-td-rownumber"><div class="datagrid-cell-rownumber" style="width:<%=parseInt(rowNumbersWidth)%>px;"><%var j = i%><%=rowNumbersExpand === false ? j++ : baidu.template(rowNumbersExpand,data[i])%></div></td>'
											+'</tr>'
											+'<% } %>'
										+'</tbody>'
									+'</table>'
								+'</div>'
							+'</div>'
							+'<div class="datagrid-footer" style="width: 100%; height:0px; overflow:hidden;"></div>'
						+'</div>',
			'view2' : '<div class="datagrid-view2" style="width:0px;height:100%;"></div>',
			'grid_header' : '<div  class="datagrid-header" style="width: 100%;">'
								+'<div class="datagrid-header-inner">'
									+'<table class="datagrid-htable" border="0" cellspacing="0" cellpadding="0">'
										+'<tbody>'
											+'<tr class="datagrid-header-row">'
												+'<% for(var i in fields) {%>'
												+'<td field="<%=fields[i]["field"]%>" align="<%=fields[i]["align"]%>">'
													+'<div class="datagrid-header-wrap" field="<%=fields[i]["field"]%>" >'
													+'<div class="datagrid-cell <%=fields[i]["hcls"]%>"  style="width:<%=fields[i]["width"]%>">'
														+'<span><%=fields[i]["title"]%></span>'
														+'<span class="datagrid-sort-icon">&nbsp;</span>'
													+'</div>'
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
									+'<% for(var i=0;i<data.length;i++) {%>'
									+'<tr id="<%=id%>-row-<%=i%>" style="<%=(opt.groupBy !== false) ? "display:none" : ""%>" <%=( opt.isCreate && typeof data[i]["_groupid_"] != "undefined" )? "datagrid-group-id="+data[i]["_groupid_"] : ""%> datagrid-row-index="<%=i%>" datagrid-row-select="0" class="datagrid-row">'
										+'<% for(var j in fields) {%>'
										+'<% var field = fields[j]["field"];%>'
										+'<td field="<%=fields[j]["field"]%>" align="<%=fields[j]["align"]%>">'
											+'<div class="datagrid-cell datagrid-cell-c1-<%=fields[j]["field"]%> <%=fields[j]["bcls"]%>" style="width:<%=fields[j]["width"]%>;" ><%=fields[j]["_expand"] !== false ? baidu.template(fields[j]["_expand"],data[i]) : data[i][field]%></div>'
										+'</td>'
										+'<% } %>'
									+'</tr>'
									+'<% } %>'
								+'</tbody>'
							+'</table>'
						+'</div>',
			'grid_footer' : '<div class="datagrid-footer" style="width: 100%; height:0px; overflow:hidden;"></div>',
			'pager' : '<div class="datagrid-pager pagination">'
						+' <table cellspacing="0" cellpadding="0" border="0">'
							+'<tbody>'
								+'<tr>'
									+'<td><select class="pagination-page-list">'
									+'<% var s = ""; for(var i=0;i<pageList.length;i++) {%>'
										+'<% if(pageList[i] == pageSize) {%>'
										+'<% s="selected";%>'
										+'<% } else {s="";} %>'
									+'<option value="<%=pageList[i]%>" <%=s%> ><%=pageList[i]%></option>'
									+'<% } %>'
									+'</select></td><td><div class="pagination-btn-separator"></div></td>'
									+'<td><a href="javascript:void(0)" class=" p-plain <%=(pageNumber <= 1 )?"p-btn-disabled":""%>"><span class="pagination-first  p-btn">&nbsp;</span></a></td>'
									+'<td><a href="javascript:void(0)" class=" p-plain <%=(pageNumber <= 1 )?"p-btn-disabled":""%>"><span class="pagination-prev  p-btn">&nbsp;</span></a></td>'
									+'<td><div class="pagination-btn-separator"></div></td>'
									+'<td><span style="padding-left:6px;">第</span></td>'
									+'<td><input class="pagination-num" type="text" value="<%=pageNumber%>" size="2"></td>'
									+'<td><span style="padding-right:6px;">页 共 <%=pages%> 页</span></td>'
									+'<td><div class="pagination-btn-separator"></div></td>'
									+'<td><a href="javascript:void(0)" class=" p-plain <%=(pageNumber >= pages)?"p-btn-disabled":""%>"><span class="pagination-next p-btn">&nbsp;</span></a></td>'
									+'<td><a href="javascript:void(0)" class=" p-plain <%=(pageNumber >= pages)?"p-btn-disabled":""%>"><span class="pagination-last p-btn ">&nbsp;</span></a></td>'
									+'<td><div class="pagination-btn-separator"></div></td>'
									+'<td><a href="javascript:void(0)" class=" p-plain"><span class="pagination-load p-btn">&nbsp;</span></a></td>'
								+'</tr>'
							+'</tbody>'
						+'</table>'
						+'<div class="pagination-info">当前显示 <%=(pageNumber*pageSize - pageSize + 1)<0 ? 0 : (pageNumber*pageSize - pageSize + 1)%> 到 <%=pageNumber*pageSize%> 条，共 <%=total%> 条</div>'
						+'<div style="clear:both;"></div>'
					+'</div>',
			'colums' : '',
			'rows' : ''
		}
		
	});
	$.dataGrid.fn.extend({
		init : function(options) {
			var self = this;
			
			self.configs = 	$.extend({},$.dataGrid.getDefaults(),options);
			
			var e = self.configs.events;
			
			//默认datagrid有边框 如果从css中去掉边框样式，可以去掉下面的2像素只差
			self.configs.width -= (self.configs.leftBorder + self.configs.rightBorder);
			self.configs.height -= (self.configs.topBorder + self.configs.bottomBorder);
			self.configs.id = self.configs.id || self.getId();
			self.configs.gid = self.configs.gid || "#view_"+self.configs.id;
			
			//系统初始化调用
			self.configs.init.call(self);
			//系统事件绑定
			self.sysEvents();
			
			//e.onStart.call(self);
			self.fireEvent("onStart",self);
			
			self.setContainer() //setContainer必须
				.setTitle()
				.setToolBar()
				.setGrid()
				.setPager()
				.show();
			
		},
		//添加事件
		bind : function(eventType,func){
			if( typeof eventType == "undefined" ) {
				return this;	
			}
			var func = func || $.noop;
			var self = this;
			var event = self.configs.events;
			
			event[eventType] = $.dataGrid._undef(event[eventType],[]);
			
			if( $.isFunction( event[eventType] ) ) {
				event[eventType] = [];
			}
			var id = event[eventType].push(func);
			/*
			event[eventType] = func;
			
			*/
			return id-1;
		},
		unbind : function(eventType,id){
			var self = this;
			var event = self.configs.events;
			var id = $.dataGrid._undef(id,false);
			if(id === false) {
				event[eventType] = $.noop;
			} else {
				event[eventType][id] = $.noop;
			}
			return self;
		},
		fireEvent : function(eventType,scope,data){
			var self = this;
			var events = self.configs.events[eventType];
			var scope = $.dataGrid._undef(scope,self);
			var data = $.dataGrid._undef(data,[]);
			var r = true;
			if($.isArray(events) ) {
				
				for(var i=0;i<events.length;i++) {
					r = events[i].apply(scope,data);
					if(r === false) break;
				}	
				
			} else if($.isFunction(events)) {
				r = events.apply(scope,data);
			}
			return r;
		},
		sysEvents : function(){
			var self = this;
			var opt = self.configs;
			//自动展示_expand
			self.bind("onShowGrid",self.autoExpand);
			//单击展示_expand
			self.bind("onClickRow",self.setExpandEvent);
			//绑定checkBox
			self.bind("onUnselectAll",function(){this.checkCk(false)});
			self.bind("onSelectAll",function(){this.checkCk(true)});
			self.bind("onUnselect",function(){this.checkCk(false)});
			
			//系统事件
			self.bind("onSetPk",self.setPk);
			self.bind("onViewSizeChange",self.onViewSizeChange);
			self.bind("onSizeChange",self.onSizeChange);
			self.bind("onShowGrid",self.onLockRow);
			self.bind("onShowGrid",self.onLockColumn);
			self.bind("onBeforeShowGrid",self.onBeforeShowGrid);
			self.bind("onScroll",self.onScroll);
			self.bind("onAfterLockRow",self.onAfterLockRow);
			self.bind("onAfterLockColumn",self.onAfterLockColumn);
			self.bind("onDataChange",self.onDataChange);
			self.bind("onOverRow",self.onOverRow);
			self.bind("onOutRow",self.onOutRow);
			self.bind("onShowGrid",self.onDisplayField);
		},
		getId : function(){
			return 'datagrid_' + Math.floor(Math.random() * 99999);	
		},
		unique : function(){
			return 'unique_' + Math.floor(Math.random() * 99999);		
		},
		showLoading : function(msg,render){
			var self = this;	
			var opt = self.configs;
			var msg = typeof msg === 'undefined' ? opt.loadMsg : msg;
			var render = render || "#"+opt.id;
			self.hideLoading(render);
			$('<div class="datagrid-mask" style="display:block"></div><div class="datagrid-mask-msg" style="display: block; left: 50%;">'+msg+'</div>').appendTo("#"+opt.id);
			var w = $(render).find(".datagrid-mask-msg").outerWidth(true);
			$(render).find(".datagrid-mask-msg").css("marginLeft",-w/2+"px");
		},
		hideLoading : function(render){
			var self = this;
			var opt = self.configs;
			var render = render || "#view_"+opt.id;
			$("#"+opt.id).find(".datagrid-mask-msg,.datagrid-mask").remove();
		},
		methodCall : function(method){
			var method = method || "";
			var self = this;
			var opt = self.configs;
			if( method!="" && method in opt.methodCall && $.isFunction(opt.methodCall[method]) ) {
				opt.methodCall[method].call(self);	
			}
			
			return self;
		},
		//设置后会立刻刷新表格
		getColumnData : function(columnName,proto,value){
			var self = this;
			var opt = self.configs;
			
			var columnName = $.dataGrid._undef(columnName,false);	
			var proto = $.dataGrid._undef(proto,false);	
			
			if(columnName === false ) return self;
			
			var fields = self.getColumns(true);//获取columns元数据
			
			for(var i in fields) {
				if(fields[i]['field'] == columnName) {
					if(proto === false) {
						return fields[i];
					} else {
						if(typeof value === 'undefined') {
							return fields[i][proto];
						} else {
							fields[i][proto] = value;
							
							opt.columns = fields;//设置后必须调用getColumns 。setGridHeader会调用getColumns
							
							self.setGridHeader();//重新生成
							self.refreshDataCache();
							return self;
						}
					}
				}	
			}
			return null;
		},
		setColumnData : function(columnName,proto,value){
			var self = this;
			return self.getColumnData(columnName,proto,value);
		},
		getData : function(){
			var self = this;
			var opt = self.configs;
			var async = self.getAsync();
			if( async ) {
				return opt.cacheData['source'];
			} else {
				return opt.data;
			}
		},
		textLimit : function(text,width,fontSize) {
			var self = this;
			var opt = self.configs;
			var text = $.dataGrid._undef(text,"");
			if(text == "") return text;
			text = new String(text);
			var _t = $("<div style='position:absolute;left:-1000px;'></div>");
			_t.appendTo(document.body);
			_t.css({'fontSize':fontSize});
			
			var len = text.length;
			var _text = "";
			var _i = 0;
			for(var i=1;i<=len;i++) {
				_text = text.substr(0,i);
				_t.html( _text + opt.textLimitDef );
				if( parseInt(_t.width()) < parseInt(width) ) {
					_i = i;
				} else {
					break;	
				}
			}
			
			_t.remove();
			
			if(_i == 0) {
				return 	text.substr(0,1) + opt.textLimitDef;
			} else if(_i == len) {
				return text;	
			} else {
				return 	text.substr(0,_i) + opt.textLimitDef;
			}
		},
		getTpl : function(tpl) {
			var tpl = tpl || '';
			var self = this;
			var opt = self.configs;
			
			//baidu.template.ESCAPE = false;
			baidu.template.ESCAPE = opt.ESCAPE;
			
			var _tpl = tpl in opt.tpl ? $(opt.tpl[tpl]).html() : $.dataGrid._Tpl[tpl];
			_tpl = _tpl == '' ? $.dataGrid._Tpl[tpl] : _tpl;
			
			return _tpl;
		},
		setContainer : function(opt) {
			var opt = opt || {};
			var self = this;
			var opt = $.extend({},self.configs,opt);
			var tpl = $.dataGrid.tpl(self.getTpl("container"),opt);
			opt.helper.html(tpl);
			return self;
		},
		setTitle : function(title) {
			var self = this;
			var opt = self.configs;
			opt.title = typeof title === 'undefined' ?  opt.title : title;
			if(opt.title=="") return self;
			var tpl = $.dataGrid.tpl(self.getTpl("title"),opt);
			self.configs.views['title'] = $(tpl);
			return self;
		},
		getTools : function(items){
			var self = this;
			var opt = self.configs;
			
			if( !$.isArray(items) ) return false;
			var _item = opt._toolItem;
			var container = '<table cellspacing="0" cellpadding="0" border="0"><tbody><tr>{$tools}</tr></tbody></table>';
			var h = '';
			for(var i in items) {
				if( $.isPlainObject(items[i]) ) {
					items[i] = $.extend({},_item,items[i]);
					if(items[i]['cls'] != '') {
						items[i]['cls'] += " l-btn-icon-left";		
					}
					var isDisabled = items[i]['disabled'] ? "l-btn-disabled" : "";
					h += '<td><a href="javascript:void(0)" class="l-btn l-btn-plain '+isDisabled+'" indexid="'+i+'"><span class="l-btn-left"><span class="l-btn-text '+items[i]['cls']+'">'+items[i]['text']+'</span></span></a></td>';
				} else {
					h += '<td><div class="datagrid-btn-separator"></div></td>';	
				}
			}
			container = container.replace('{$tools}',h);
			var container = $(container);
			container.find(".l-btn").each(function(i){
				$(this).click(function(e){
					var indexid = $(this).attr("indexid");
					items[indexid]['callBack'].call(self,this,items[indexid]);
					e.stopPropagation();
					e.preventDefault();
				});									   
			});
			return container;
		},
		setToolBar : function() {
			var self = this;
			var opt = self.configs;
			if(opt.toolBars===false) return self;
			var tpl = $.dataGrid.tpl(self.getTpl("toolbar"),opt);
			self.configs.views['toolbar'] = $(tpl);
			var tool = self.getTools(opt.toolBars);
			if( tool !== false ) {
				self.configs.views['toolbar'].append(tool);	
			}
			self.fireEvent('onToolBarCreate',self,[self.configs.views['toolbar'],opt.toolBars]);
			
			self.methodCall('setToolBar');
			
			return self;
		},
		setGrid : function () {
			var self = this;
			var opt = self.configs;
			var views = opt.views;
			if(!views['grid']) {
				var tpl = $.dataGrid.tpl(self.getTpl("grid"),opt);
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
			self.methodCall('setGrid');
			return self;
		},
		autoExpand : function(){
			var self = this;
			var opt = self.configs;
			
			for(var i in opt.data) {
				if( ('_expand' in opt.data[i]) && ('_openExpand' in opt.data[i]) && opt.data[i]['_openExpand'] ) {
					self.expandRow(i,opt.data[i]['_expand']);
				}
			}
		},
		checkCk : function(type){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var render = gid;
			var type = $.dataGrid._undef(type,false);
			$(render).find(".datagrid-header-row td[field='ck']").find("input:checkbox").each(function(i){
				this.checked = type ? true : false;																					   
			});
		},
		setExpandEvent : function(t,rowId,rowData){
			var self = this;
			var opt = self.configs;
			if('_expand' in rowData) {
				if( !self.isExpandRowShow(rowId) )
					self.expandRow(rowId,rowData['_expand']);	
				else 
					self.hideExpandRow(rowId);	
			}
		},
		addPagerEvent : function(){
			var self = this;
			var opt = self.configs;
			var obj = self.configs.views['pager'];
			var e = opt.events;
			obj.find(".pagination-first").click(function(){
				if($(this).parent().hasClass("p-btn-disabled")) return;
				opt.pageNumber = 1;
				self.refreshData();	
			});
			obj.find(".pagination-prev").click(function(){
				if($(this).parent().hasClass("p-btn-disabled")) return;
				var pageNumber = opt.pageNumber - 1;
				opt.pageNumber = pageNumber<0 ? 1 : pageNumber;										
				self.refreshData();											 
			});
			obj.find(".pagination-next").click(function(){
				if($(this).parent().hasClass("p-btn-disabled")) return;																				
				var total = opt.total || opt.data.length;
				var pages = Math.ceil( parseInt(total)/parseInt(opt.pageSize) );
				var pageNumber = opt.pageNumber + 1;
				opt.pageNumber = pageNumber>pages ? pages : pageNumber;	
				self.refreshData();	
			});
			obj.find(".pagination-last").click(function(){
				if($(this).parent().hasClass("p-btn-disabled")) return;
				var total = opt.total || opt.data.length;
				var pages = Math.ceil( parseInt(total)/parseInt(opt.pageSize) );
				opt.pageNumber = pages;
				self.refreshData();	
			});
			obj.find(".pagination-load").click(function(){
				if($(this).parent().hasClass("p-btn-disabled")) return;
				self.refreshData();											 
			});
			obj.find(".pagination-page-list").change(function(){
				var pageSize = $(this).val();
				//var r = e.onChangePageSize.call(self,pageSize);
				var r = self.fireEvent('onChangePageSize',self,[pageSize]);
				
				if(r === false) return false;
				opt.pageSize = pageSize;
				//var r = e.onSelectPage.call(self,pageSize);
				var r = self.fireEvent('onSelectPage',self,[pageSize]);
				if(r === false) return false;
				self.refreshData();	
			});
			obj.find(".pagination-num").keydown(function(e){
				if(e.keyCode === 13) {
					opt.pageNumber = obj.find(".pagination-num").val();	
					self.refreshData();	
				}
			});
			return self;
		},
		setPager : function() {
			var self = this;
			var opt = self.configs;
			
			if( !opt.pagination ) return self;
			//计算分页
			var data = {};
			data.total = opt.total || opt.data.length;
			data.pageSize = opt.pageSize;
			data.pageNumber = opt.pageNumber;
			data.pageList = opt.pageList;
			data.pages = Math.ceil( parseInt(data.total)/parseInt(data.pageSize) );
			//检查pageNumber的合法性
			opt.pageNumber = opt.pageNumber > data.pages ? data.pages : opt.pageNumber;
			opt.pageNumber = opt.pageNumber<=0 ? 1 : opt.pageNumber;
			data.pageNumber = opt.pageNumber;
			
			if(opt.id)
			var isSet = $("#"+opt.id).find(".datagrid-pager").size();
			
			var tpl = $.dataGrid.tpl(self.getTpl("pager"),data);
			if(!isSet) {
				self.configs.views['pager'] = $(tpl);
			} else {
				$("#"+opt.id).find(".datagrid-pager").replaceWith(tpl);
				self.configs.views['pager'] = $("#"+opt.id).find(".datagrid-pager");
			}
			self.addPagerEvent();
			self.methodCall('setPager');
			return self;	
		},
		addView1Event : function(){
			var self = this,
				opt = self.configs,
				gid = opt.gid,
				tpl_view1 = $.dataGrid.tpl(self.getTpl("view1"),opt);
			var render1 = gid+" .datagrid-view1";
			
			$(render1).find(".datagrid-row").click(function(){
				var rid = $(this).attr("datagrid-row-index");
				//opt.events.onClickRowNumber.call(self,rid);
				self.fireEvent('onClickRowNumber',self,[rid]);
				if( opt.rowNumbers2Row !== false ) {
					//self.selectRow(rid);
					$("#"+opt.id+"-row-"+rid).click();
				}
			});
			$(render1).find("tr.datagrid-row").hover(function(){
				var rowId = $(this).attr("datagrid-row-index");	
				self.fireEvent("onOverRow",self,[rowId])
			},function(){
				var rowId = $(this).attr("datagrid-row-index");	
				self.fireEvent("onOutRow",self,[rowId]);
			});
		},
		//datagrid的大小改变时 触发
		onSizeChange : function(width,height){
			var self = this;
			var opt = self.configs;
			opt.width = $.dataGrid._undef(width,opt.width);
			opt.height = $.dataGrid._undef(height,opt.height);
			
			//默认datagrid有边框 如果从css中去掉边框样式，可以去掉下面的2像素只差
			opt.width -= (opt.leftBorder + opt.rightBorder);
			opt.height -= (opt.topBorder + opt.bottomBorder);
			
			$("#"+opt.id).css({
				width : opt.width,
				height : opt.height
			});
			$("#view_"+opt.id).css({
				width : opt.width
			});
			
			self.setGrid();
			
			self.fireEvent("onViewSizeChange",self,[]);
		},
		//view的大小改变时 触发
		onViewSizeChange : function(){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var w = $(gid).width(),
				h = $(gid).height();
			//设置宽度	
			var view1_w = $(gid).find(".datagrid-header .datagrid-htable").outerWidth();
			$(gid).find(".datagrid-view1").width(view1_w);
			$(gid).find(".datagrid-view2").width(w - parseInt( view1_w ) );
			//设置高度
			var view1 = $(gid).find(".datagrid-view1");
			var view2 = $(gid).find(".datagrid-view2");
			var view2_header_h = view2.find(".datagrid-htable").outerHeight();
			view2_header_h = parseInt(view2_header_h) - 1;
			view1.find(".datagrid-header").height( view2_header_h );
			view2.find(".datagrid-header").height( view2_header_h );
			
			self.resetGridHeight(false,opt.gbody,[opt.gheader,opt.gfooter]);
			
			//触发滚动
			self.fireEvent("onScroll",self,[]);
		},
		resetView1 : function(){
			var self = this,
				opt = self.configs,
				gid = opt.gid,
				tpl_view1 = $.dataGrid.tpl(self.getTpl("view1"),opt);
			var render1 = gid+" .datagrid-view1";
			var view1 = $(tpl_view1);
			var isSet = $(render1).size();
			if(isSet) {
				$(render1).replaceWith( view1 );
			}
			self.addView1Event();
			return self;
		},
		setView : function(){
			var self = this,
				opt = self.configs,
				tpl_view1 = $.dataGrid.tpl(self.getTpl("view1"),opt),
				tpl_view2 = $.dataGrid.tpl(self.getTpl("view2"),opt),
				gid = opt.gid;
				$(gid).html('');//防止重复调用
				var w = $(tpl_view1).appendTo(gid).width();
				$(tpl_view2).appendTo(gid).width( $(gid).width() - w );
		},
		getRowData : function (rid,isPK){
			var self = this;
			var opt = self.configs;
			
			var isPK = $.dataGrid._undef(isPK,false);
			
			var data = isPK ? self.getData() : opt.data;
			
			
			if(!isPK) {
				return data[rid];
			} else {
				var pk = opt.pk;
				for(var i in data) {
					if(data[i][pk] == rid) {
						return data[i];
					}	
				}
			}
		},
		setRowData : function (rid,field,value){
			var self = this;	
			var data = self.configs.data;
			
			data[rid][field] = value;
			return self;
		},
		getFieldValue : function (rid,field){
			var data = this.getRowData(rid);
			return data[field];
		},
		setFieldValue : function(rid,field,value){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			opt.gbody.find("tr.datagrid-row[datagrid-row-index='"+rid+"']").find("td[field='"+field+"']").find("div.datagrid-cell").html(value);
			
			self.setRowData(rid,field,value);
			
			return self;
		},
		getSlectRows : function(){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var list = [];
			$(gid).find(".datagrid-view2 tr.datagrid-row[datagrid-row-select='1']").each(function(idx){
				list.push($(this).attr("datagrid-row-index"));																		 
			});
			return list;
		},
		//行列锁
		onLockRow : function(){
			var self = this,
				opt = self.configs;
			var rows = opt.lockRows;
			for(var i in rows) {
				if(rows[i] == null) continue;
				self.lockRow(rows[i]);
			}	
		},
		onAfterLockRow : function(){
			var self = this,
				opt = self.configs;
			
		},
		onLockColumn : function(){
			var self = this,
				opt = self.configs;
			var columns = opt.lockColumns;
			for(var i in columns) {
				self.lockColumn(columns[i]);
			}	
		},
		onAfterLockColumn : function(){
			var self = this,
				opt = self.configs;
			var gid = opt.gid;
			//expand事件
			$(gid).find(".datagrid-row-expand").each(function(i){
				var indexid = $(this).attr("datagrid-exoand-row-index");
				self.hideExpandRow(indexid);
				var d_ = self.getRowData(indexid);
				self.expandRow(indexid,d_['_expand']);
			});
			
			//group 事件
			self.addGroupRow();
		},
		lockRow : function(rowId){
			var self = this,
				opt = self.configs;
			if( self._lockRow(rowId) ) {
				if( $.inArray(rowId,opt.lockRows) == -1 )
					opt.lockRows.push(rowId);
					
				self.fireEvent('onAfterLockRow',self,[]);
			  	self.fireEvent('onViewSizeChange',self,[]);
			}
		},
		unLockRow : function(rowId){
			var self = this,
				opt = self.configs;
			if( self._unLockRow(rowId) ) {
				for(var i in opt.lockRows) {
					if(opt.lockRows[i] == rowId) {
						opt.lockRows[i] = null;
					}	
				}
				
				self.fireEvent('onViewSizeChange',self,[]);
			}
		},
		unLockColumn : function(field){
			var self = this,
				opt = self.configs;
			if( self._unLockColumn(field) ) {
				for(var i in opt.lockColumns) {
					if(opt.lockColumns[i] == field) {
						opt.lockColumns[i] = null;
					}	
				}
				
				self.fireEvent('onViewSizeChange',self,[]);
			}
		},
		lockColumn : function(field){
			var self = this,
				opt = self.configs;
			if( self._lockColumn(field) ) {
				if($.inArray(field,opt.lockColumns)  == -1 )
					opt.lockColumns.push(field);
					
				self.fireEvent('onAfterLockColumn',self,[]);
				self.fireEvent('onViewSizeChange',self,[]);
			}
		},
		_lockRow : function(rowId) {
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var render = gid;
			
			var f = $(render).find("#"+opt.id+"-row-"+rowId);
			var f1 = $(render).find("#"+opt.id+"-view1-row-"+rowId);
			if( !f.length ) return false; // || f.parents(".datagrid-header").length
			
			var view1 = $(render).find(".datagrid-view1");
			var view2 = $(render).find(".datagrid-view2");
			
			//移动行
			view2.find(".datagrid-header .datagrid-htable > tbody").first().append(f);
			view1.find(".datagrid-header .datagrid-htable > tbody").first().append(f1);
			
			return true;
		},
		_unLockRow : function(rowId){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var render = gid;
			
			var f = $(render).find("#"+opt.id+"-row-"+rowId);
			var f1 = $(render).find("#"+opt.id+"-view1-row-"+rowId);
			if( !f.length ) return false; // || f.parents(".datagrid-header").length
			
			var view1 = $(render).find(".datagrid-view1");
			var view2 = $(render).find(".datagrid-view2");
			
			//移动行
			if(rowId) {
				rowId -= 1;
				f.insertAfter("#"+opt.id+"-row-"+rowId);
				f1.insertAfter("#"+opt.id+"-view1-row-"+rowId);
			} else {
				view2.find(".datagrid-body .datagrid-btable > tbody").first().prepend(f);
				view1.find(".datagrid-body .datagrid-btable > tbody").first().prepend(f1);	
			}
			
			return true;	
		},
		
		_lockColumn : function(field) {
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var render = gid;
			var fields = self.getColumns();
			var isField = false;
			for(var i in fields) {
				if(fields[i]['field'] == field) {
					isField = true;
					break;
				}
			}
			if( !isField ) return false;
			var f = $(render).find(".datagrid-header tr.datagrid-header-row td[field='"+field+"']");
			var view = $(gid);
			var view1 = $(render).find(".datagrid-view1");
			var view2 = $(render).find(".datagrid-view2");
			
			//移动field 列 到 view1
			view1.find("tr.datagrid-header-row").append(f);
			//移动单元格
			view.find(".datagrid-body tr.datagrid-row td[field='"+field+"']").each(function(i){
				var indexid = $(this).parent().attr("datagrid-row-index");
				$(this).appendTo( view1.find("#"+opt.id+"-view1-row-"+indexid) );
			});
			view.find(".datagrid-header tr.datagrid-row td[field='"+field+"']").each(function(i){
				var indexid = $(this).parent().attr("datagrid-row-index");
				$(this).appendTo( view1.find("#"+opt.id+"-view1-row-"+indexid) );
			});
			view.find(".datagrid-footer tr.datagrid-row td[field='"+field+"']").each(function(i){
				var indexid = $(this).parent().attr("datagrid-row-index");
				$(this).appendTo( view1.find("#"+opt.id+"-view1-row-"+indexid) );
			});
			
			return true;
		},
		_unLockColumn : function(field) {
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var render = gid;
			var fields = self.getColumns();
			var isField = false;
			for(var i in fields) {
				if(fields[i]['field'] == field) {
					isField = true;
					break;
				}
			}
			if( !isField ) return false;
			var f = $(render).find(".datagrid-header tr.datagrid-header-row td[field='"+field+"']");
			var view = $(gid);
			var view1 = $(render).find(".datagrid-view1");
			var view2 = $(render).find(".datagrid-view2");
			
			//移动field 列 到 view1
			var pos = i;
			
			view2.find("tr.datagrid-header-row").append(f);
			if( pos <= 0) {
				f.prependTo( view2.find("tr.datagrid-header-row") );
			} else {
				f.insertAfter( view2.find("tr.datagrid-header-row").find("td").eq(pos-1) );	
			}
			//移动单元格
			view.find(".datagrid-body tr.datagrid-row td[field='"+field+"']").each(function(i){
				var tr = $(this).parent();
				var indexid = tr.attr("datagrid-row-index");
				//$(this).appendTo( view.find("#"+opt.id+"-row-"+indexid) );
				var view2_tr = $("#"+opt.id+"-row-"+indexid);
				if( pos <= 0) {
					view2_tr.prepend( $(this) );
				} else {
					view2_tr.find("td").eq(pos-1).after( $(this) );	
				}
				
			});
			view.find(".datagrid-header tr.datagrid-row td[field='"+field+"']").each(function(i){
				var tr = $(this).parent();
				var indexid = tr.attr("datagrid-row-index");
				//$(this).appendTo( view.find("#"+opt.id+"-row-"+indexid) );
				var view2_tr = $("#"+opt.id+"-row-"+indexid);
				if( pos <= 0) {
					view2_tr.prepend( $(this) );
				} else {
					view2_tr.find("td").eq(pos-1).after( $(this) );	
				}
				
			});
			view.find(".datagrid-footer tr.datagrid-row td[field='"+field+"']").each(function(i){
				var tr = $(this).parent();
				var indexid = tr.attr("datagrid-row-index");
				//$(this).appendTo( view.find("#"+opt.id+"-row-"+indexid) );
				var view2_tr = $("#"+opt.id+"-row-"+indexid);
				if( pos <= 0) {
					view2_tr.prepend( $(this) );
				} else {
					view2_tr.find("td").eq(pos-1).after( $(this) );	
				}
			});
			
			return true;	
		},
		
		getCheckBoxColumn : function(columns) {
			var self = this,
			opt = self.configs;
			var r = $.extend({},opt._columnMetaData);
			
			for(var i in columns) {
				if(columns[i]['field'] == 'ck')	return false;
			}
			
			//console.log(columns);
			r.field = 'ck';
			r.title = '<input type="checkbox">';
			r._expand = '<input type="checkbox">';
			r.hcls = 'datagrid-header-check';
			r.bcls = 'datagrid-cell-check';
			r.width = '20px';
			r.fitColumn = false;
			r.align = 'center';
			r.callBack = function(t,rowId,field,rowData){
				var self = this;
				$(t).find("input:checkbox").click(function(e){
					if( this.checked ) {
						self.selectRow(rowId);	
					} else {
						self.unselectRow(rowId);
					}
					e.stopPropagation();
				});
			};
			return r;
		},
		geteditColumn : function(columns) {
			var self = this,
			opt = self.configs;
			var r = $.extend({},opt._columnMetaData);
			var j = 0;
			var k = 0;
			if( $.isArray(opt.editColumn) ) { 
				$.each(opt.editColumn,function(i,n){
					if( $.isPlainObject(this) ) {
						opt.editColumn[i] = $.extend({},opt._toolItem,opt.editColumn[i]);
						j++;	
					} else {
						k++;	
					}						   
				});
			} else {
				opt.editColumn = [];	
			}
			for(var i in columns) {
				if(columns[i]['field'] == 'ed')	return false;
			}
			var str = '';
			r.field = 'ed';
			r.title = (opt.editColumnTitle == '' || opt.editColumnTitle === false ) ? ' ' : opt.editColumnTitle;
			r._expand = str;
			r.hcls = 'datagrid-header-edit';
			r.bcls = 'datagrid-cell-edit';
			r.width = ( j * opt.editCellW + k * 4 )+'px';
			r.fitColumn = true;
			r.align = 'center';
			r.callBack = function(t,rowId,field,rowData){
				var self = this;
				var _item = opt._toolItem;
				var tools = [];
				var tool = {};
				for(var i in opt.editColumn) {
					
					if( $.isPlainObject(opt.editColumn[i]) ) {
						tool = $.extend({},_item,opt.editColumn[i]);
						tool.callBack = function(t,_item_){
							var indexid = $(t).attr("indexid");
							opt.editColumn[indexid]['callBack'].call(self,t,rowId,field,rowData,_item_);	
						}
						
						tools.push(tool);	
					}  else {
						tools.push(opt.editColumn[i]);	
					}
				};
				
				var _tool = self.getTools(tools);
			//	console.log(_tool);
				t.append(_tool);
				//opt.editColumn[i]['callback'].call(t,rowId,field,rowData);
			}
			
			return r;
		},
		getColumns : function(s){
			var self = this,
			opt = self.configs,
			columns = opt.columns;
			
			var s = $.dataGrid._undef(s,false);
			//初始调用时保存副本
			opt.cacheData['columns'] = $.dataGrid._undef(opt.cacheData['columns'],columns);//cacheData
			//获取副本
			if(s) {
				return 	opt.cacheData['columns'];
			}
			
			//检测是否设置了 列 否则用data的key作为列名
			if(columns.length<=0) {
				if(opt.data.length>0) {
					for(var i in opt.data[0]) {
						columns.push({'field':i});
					}
				}
			}
			var _columns = [];
			for(var i in columns) {
				columns[i] = $.extend({},opt._columnMetaData,columns[i]);
				
				if( columns[i]['disabled'] === true ) continue;
				
				if(typeof columns[i]['width'] == 'number') columns[i]['width'] += 'px';
				columns[i]['title'] = columns[i]['title'] == "" ?  columns[i]['field'] : columns[i]['title'];
				
				_columns.push(columns[i]);
			}
			
			opt.columns = columns = _columns;
			
			//检测是否使用checkbox
			var ck = ed = [];
			if( opt.checkBox !== false ) {
				if(self.getCheckBoxColumn(columns) !== false) {
					ck = [ self.getCheckBoxColumn(columns) ];
					$.merge(ck,columns);
					columns = ck;
				}
			}
			if( opt.editColumn !== false) {
				if(self.geteditColumn(columns) !== false) {
					ed = [ self.geteditColumn(columns) ];
					$.merge(columns,ed);
				}
			}
			opt.columns = columns;
			return opt.columns;
		},
		getColumnList : function(){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var fields = self.getColumns();
			var list = [];
			for(var i in fields) {
				list.push(fields[i]['field']);	
			}
			return list;
		},
		
		//页面刷新的时候调用
		onDisplayField : function(){
			var self = this,
				opt = self.configs,
				_columns = opt.hideColumns;
				gid = opt.gid;
				
			if(_columns.length <= 0) return;
			
			for(var i in _columns) {
				if( _columns[i] == null ) continue;
				self.hideColumn(_columns[i]);
				console.log(_columns[i]);
			}
		},
		
		displayColumn : function( field , type ) {
			var self = this,
				opt = self.configs,
				_columns = opt.hideColumns;
				gid = opt.gid;
			var fields = self.getColumnList();
			
			if( $.inArray(field,fields) == -1 ) return false;
			
			var isDisplay = (type == "show") ? true : false;
			if( isDisplay  ) { //&& $.inArray( field,_columns )
				for(var i in _columns) {
					if(_columns[i] == field) _columns[i] = null;
				}
			} else {
				if( $.inArray( field,_columns ) == -1 )
					_columns.push( field );
			}
			$(gid).find("td[field='"+field+"']")[type]();
			self.fireEvent("onViewSizeChange",self);
			
			self.setGroupRowSize();
			
			return true;
		},
		showColumn : function( field ){
			var self = this;
			return self.displayColumn( field ,"show");
		},
		hideColumn : function( field ){
			var self = this;
			return self.displayColumn( field , "hide");
		},
		sortColumn : function(field){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var field = field || false;
			if(field == false) return;
			var render = render || gid+" .datagrid-view2 .datagrid-header";
			$(render).find("td[field='"+field+"']")
					 .find("div.datagrid-cell")
					 .click(function(e){
						
						var field = $(this).parent().attr('field');
						opt.sortName = field;
						 var rs = self.fireEvent("onSortColumn",self,[field]);//opt.events.onSortColumn.call(self,field);
						 if(rs === false) return;
						 if( $(this).hasClass('datagrid-sort-asc') ) {
							 $(render).find("div.datagrid-cell").removeClass('datagrid-sort-asc').removeClass('datagrid-sort-desc');
							$(this).removeClass('datagrid-sort-asc');
							$(this).addClass('datagrid-sort-desc');
							opt.sortOrder = 'desc';
						 } else {
							  $(render).find("div.datagrid-cell").removeClass('datagrid-sort-asc').removeClass('datagrid-sort-desc');
							$(this).removeClass('datagrid-sort-desc');
							$(this).addClass('datagrid-sort-asc');	 
							opt.sortOrder = 'asc';
						 };
						 
						 self.refreshData();
					 });
		},
		setGridHeaderEvent : function(){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var render = gid+" .datagrid-view2";
			var fields = self.getColumns();	
			//设置列 是否可以移动
			if(opt.fitColumns) {
				var o = $.extend({},opt);
				o.self = self;
				o.stop = function(e,cfg){
					//var r = opt.events.onResizeColumnStop();
					var r = self.fireEvent('onResizeColumnStop',self,[cfg]);
					if(r === false) return r;
					self.cStop(cfg);
				};
				//$(render).find(".datagrid-cell")._resize(o);
				$(render).find("div.datagrid-cell").each(function(idx){
					var fieldName = $(this).parent().attr("field");
					for(var i in fields) {
						if( fields[i]['field'] == fieldName && fields[i]['fitColumn'] ) {
							$(this)._resize(o);
							break;
						}
					}
				});
			}
			//设置列是否可排序
			for(var i in fields) {
				if(fields[i]['sortable'] == true) {
					self.sortColumn(fields[i]['field']);	
				}
			}
			if( opt.sortName != '' ) {
				 $(render).find(".datagrid-header td[field='"+opt.sortName+"']").find("div.datagrid-cell").addClass('datagrid-sort-'+opt.sortOrder.toLowerCase());
			}
			
			//设置contentmenu
			opt.gheader.bind("contextmenu",function(ev){
					//触发单击行事件
					//var r = opt.events.onHeaderContextMenu.call(this);
					var r = self.fireEvent('onHeaderContextMenu',self,[this]);
					if(r == false) return false;
			});
			
			//设置鼠标移动效果
			$(render).find(".datagrid-header-row td[field]").hover(function(){
				$(this).addClass("datagrid-header-over");												 
			},function(){
				$(this).removeClass("datagrid-header-over");		
			});
			
			/*检查文字是否超出边界*/
			self.setGridHeaderTextLimit();
			/*checkbox绑定*/
			$(render).find(".datagrid-header-row td[field='ck']").find(".datagrid-sort-icon").hide();
			$(render).find(".datagrid-header-row td[field='ck']").find("input:checkbox").click(function(){
					if(opt.singleSelect) {
						this.checked = false;
						return false;
					}
					if(this.checked) {
						self.selectAllRows();
					} else {
						self.unselectAllRows();
					}
				});
		},
		/*检查文字是否超出边界*/
		setGridHeaderTextLimit : function(){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var render = gid;
			var fields = self.getColumns();	
			
			for(var i in fields) {
				if(fields[i]['textLimit'] === false) continue;
				var f = $(render).find(".datagrid-header-row td[field='"+fields[i]['field']+"']").find("div.datagrid-cell");
				var w = f.width(); // 注意 此处的width 包含了sort 图标,如果需要精确 那么就要减掉 sort-icon 大概12px
				var fs = f.css("fontSize");
				var text = self.getColumnData( fields[i]['field'],'title' );
				text = self.textLimit( text , w , fs );
				f.find("span").first().html( text );
			}	
		},
		setGridHeader : function(render,func){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var render = render || gid+" .datagrid-view2";
			var fields = self.getColumns();
			var func = func || $.noop;
			
			var isSet = $(render).find(".datagrid-header").size();
			var grid_header = $.dataGrid.tpl( self.getTpl("grid_header") , {'fields':fields} );
			if(isSet) {
				//$(render).find(".datagrid-footer").replaceWith( grid_header );
				opt.gheader.replaceWith( grid_header );
				opt.gheader = $(render).find(".datagrid-header");
			} else {
				opt.gheader =$(grid_header).appendTo(render);
			}
			
			self.setGridHeaderEvent();
			
			func();
			self.methodCall('setGridHeader');
			return opt.gheader;
		},
		//设置field的属性 但不更新表格 注意:setColumnData 会立刻更新表格
		setColumnValue : function(field,key,value){
			var self = this;
			var fields = self.getColumns();
			for(var i in fields){
				if(fields[i]['field'] == field) {
					fields[i][key] = value;
					continue;
				}	
			}
		},
		cStop : function(cfg){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var glist = $(gid).find("td[field='"+cfg.field+"']").find("div.datagrid-cell");
			
			if(!glist.size()) return;
			
			var w = parseInt(glist.width());
			
			w = w + cfg.offsetX;
			w = w<10 ? 10 : w;
			
			//把configs的width设置回去
			self.setColumnValue(cfg.field,'width',w);
			
			glist.width(w);
			//数据更新后滚动条位置重置
			//opt.gbody.scrollLeft(opt.sLeft);
			//opt.gbody.scrollTop(opt.sTop);
			//opt.gbody.scroll();
			self.fireEvent('onScroll',self,[true]);
			
			/*检查文字是否超出边界*/
			self.setGridHeaderTextLimit();
			self.setGridBodyTextLimit(cfg.field);
			
			self.fireEvent("onViewSizeChange",self,[]);
			
			/*设置group-row width*/
			//if(opt.groupBy === false) return;
			//var render = gid+" .datagrid-view2";
			//var grw = $(render).find(".datagrid-header-row").first().width();
			//$(render).find(".datagrid-group-row td").width(grw);
			self.setGroupRowSize();
			
		},
		//当行的宽度改变时 group row的大小也要随之改变
		setGroupRowSize : function(){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
				
			if(opt.groupBy === false) return;	
			var render = gid+" .datagrid-view2";
			var grw = $(render).find(".datagrid-header-row").first().width();
			$(render).find(".datagrid-group-row td").width(grw);
		},
		isRowHidden : function(rowId) {
			var self = this,
				opt = self.configs,
				gid = opt.gid;
				if(rowId === undefined) return true;
				return ($("#"+opt.id+"-row-"+rowId).size() && !$("#"+opt.id+"-row-"+rowId).is(":hidden") ) ? false : true;
		},
		isExpandRowShow : function(rowId){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var _expand_id = opt.id+"-expand-row-"+rowId;
			
			return ( $("#"+_expand_id).size() && !$("#"+_expand_id).is(":hidden") ) ? true : false;
		},
		//html 可是是 模板 
		expandRow : function(rowId,html){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var e = opt.events;
			var rowId = typeof rowId === 'undefined' ? false : rowId;
			if(rowId === false) return self;
			var html = typeof html === 'undefined' ? "" : html;
			var data = self.getRowData(rowId);
			html = $.dataGrid.tpl(html,data);
			var obj = $("#"+opt.id+"-row-"+rowId);
			var obj1 = $("#"+opt.id+"-view1-row-"+rowId);
			
			if(obj.size()<=0) return self;
			
			var _expand_id = opt.id+"-expand-row-"+rowId;
			var _expand_view1_id = opt.id+"-expand-view1-row-"+rowId;
			if( $("#"+_expand_id).size() ) {
				$("#"+_expand_id+",#"+_expand_view1_id).show();
				self.fireEvent('onViewSizeChange',self,[]);
				return self;
			}
			if($("#"+_expand_id).size()<=0) {
				var _expand = $("<tr id='"+_expand_id+"' class='datagrid-row-expand' datagrid-exoand-row-index='"+rowId+"'><td colspan='"+opt.columns.length+"'><div class='datagrid-cell' style='width:100%;height:100%;'>"+html+"</div></td></tr>");
				obj.after(_expand);
			} 
			
			var tds = 0;
			var td = "";
			if($("#"+_expand_view1_id).size()<=0) {
				if(opt.lockColumns.length) {
					for(var k in opt.lockColumns) {
						if(opt.lockColumns[k] != null) tds++;
					}
				}
				if(tds) {
					td = '<td colspan="'+tds+'"></td>'	
				}
				
				var _expand_view1 = $("<tr id='"+_expand_view1_id+"'  class='datagrid-row datagrid-row-view1' datagrid-exoand-row-index='"+rowId+"'><td class='datagrid-td-rownumber'><div class='datagrid-cell-rownumber'></div></td>"+td+"</tr>");
				obj1.after(_expand_view1);
			}
			
			if( self.isRowHidden(rowId) ) {
				_expand.hide();
				_expand_view1.hide();
			} else {
				_expand.show();
				_expand_view1.show();
			}
			var h = _expand.height();
			$("#"+_expand_view1_id).css({ height:h });
			
			//e.onExpandRow.call(self,rowId);
			self.fireEvent('onExpandRow',self,[rowId]);
			
			self.fireEvent('onViewSizeChange',self,[]);
		},
		hideExpandRow : function(rowId){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var rowId = typeof rowId === 'undefined' ? false : rowId;
			if(rowId === false) return self;
			
			var _expand_id = opt.id+"-expand-row-"+rowId;
			var _expand_view1_id = opt.id+"-expand-view1-row-"+rowId;
			
			$("#"+_expand_id).remove();
			$("#"+_expand_view1_id).remove();
			
			//$("#"+_expand_id).hide();
			//$("#"+_expand_view1_id).hide();
			
			self.fireEvent('onViewSizeChange',self,[]);
		},
		selectAllRows : function(){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var e = opt.events;	
			if(opt.singleSelect) return self; //singleSelect 模式下无效
			//var r = e.onSelectAll.call(self);
			var r = self.fireEvent('onSelectAll',self,[]);
			if(r === false) return self;
			$(gid).find("tr.datagrid-row").each(function(idx){
				self.selectRow($(this).attr("datagrid-row-index"));									
			});
			return self;
		},
		unselectAllRows : function(){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var e = opt.events;	
			
			//var r = e.onUnSelectAll.call(self);
			var r = self.fireEvent('onUnSelectAll',self,[]);
			if(r === false) return self;
			
			var rows = self.getSlectRows();
			for(var i in rows) {
				self.unselectRow(rows[i]);
			}
			return self;
		},
		selectRow : function(rowId){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var e = opt.events;	
			var render = gid;
			var rowId = typeof rowId === 'undefined' ? false : rowId;
			if(rowId === false) return self;
			
			var rowData = self.getRowData(rowId);
			var obj = $(render).find("tr[datagrid-row-index='"+rowId+"']");
			
			if(obj.size()<=0) return self;
			
			//var r = e.onSelect.call(obj.get(0),rowId,rowData);
			var r = self.fireEvent('onSelect',self,[obj,rowId,rowData]);
			if(r === false) return r;
			obj.attr("datagrid-row-select","1").addClass("datagrid-row-selected");
			
			var ck = obj.find("td[field='ck'] .datagrid-cell-check input:checkbox");
			if( !ck.length ) {
				obj = $(render).find("#"+opt.id+"-view1-row-"+rowId);
				ck = obj.find("td[field='ck'] .datagrid-cell-check input:checkbox");
			}
			ck.get(0).checked = true;
			//判断是否singleSelect
						
			var selects = self.getSlectRows();
			if(selects.length && opt.singleSelect) {
				for(var si=0;si<selects.length;si++){
					if(selects[si] == rowId) continue;
					self.unselectRow(selects[si]);
				}	
			}
			return self;
		},
		unselectRow : function(rowId){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var e = opt.events;	
			var render = gid;
			var rowId = typeof rowId === 'undefined' ? false : rowId;
			if(rowId === false) return self;
			var rowData = self.getRowData(rowId);
			
			var obj = $(render).find("tr[datagrid-row-index='"+rowId+"']");
			
			if(obj.size()<=0) return self;
			
			//var r = e.onUnselect.call(obj.get(0),rowId,rowData);
			var r = self.fireEvent('onUnselect',self,[obj,rowId,rowData]);
			if(r === false) return r;
			obj.attr("datagrid-row-select","0").removeClass("datagrid-row-selected");
			//obj.find("td[field='ck'] .datagrid-cell-check input:checkbox").get(0).checked = false;
			var ck = obj.find("td[field='ck'] .datagrid-cell-check input:checkbox");
			if( !ck.length ) {
				obj = $(render).find("#"+opt.id+"-view1-row-"+rowId);
				ck = obj.find("td[field='ck'] .datagrid-cell-check input:checkbox");
			}
			ck.get(0).checked = false;
			
			return self;
		},
		showGroup : function(groupId,type){
			var self = this,
				opt = self.configs,
				gid = opt.gid;	
			var render = gid+" .datagrid-view2";	
			var render1 = gid+" .datagrid-view1";
			var type = $.dataGrid._undef(type,'show');
			if( typeof groupId == 'undefined') return self;
			var g1 = $(render).find("tr[datagrid-group-id='"+groupId+"']");
			var g2 = $(render1).find("tr[datagrid-group-id='"+groupId+"']");
			g1[type]();
			g2[type]();
			//expand 的自动展现问题 每次展开group 都会重置expand
			g1.each(function(i){
				var indexid = $(this).attr('datagrid-row-index');
				var _d = self.getRowData( indexid );
				_d['_openExpand'] = $.dataGrid._undef(_d['_openExpand'],false);
				if( _d['_openExpand'] ) {
					self.expandRow(indexid,_d['_expand']);
				}
				if(type == 'hide') {
					self.hideExpandRow(indexid);	
				}
			});
			
			if(type == 'show') {//datagrid_22768-group-row-0
				$(render).find("#"+opt.id+"-group-row-"+groupId).find("div.datagrid-group-cell").addClass("datagrid-group-cell-select");
				$(render1).find("#"+opt.id+"-group-view1-row-"+groupId).find("div.datagrid-group-cell-rownumber").addClass("datagrid-group-cell-rownumber-select");
			} else {
				$(render).find("#"+opt.id+"-group-row-"+groupId).find("div.datagrid-group-cell").removeClass("datagrid-group-cell-select");
				$(render1).find("#"+opt.id+"-group-view1-row-"+groupId).find("div.datagrid-group-cell-rownumber").removeClass("datagrid-group-cell-rownumber-select");
			}
			//rownumber位置刷新
			//opt.gbody.scrollLeft(opt.sLeft);
			//opt.gbody.scrollTop(opt.sTop);
			//opt.gbody.scroll();
			self.fireEvent('onScroll',self,[true]);
			self.fireEvent('onViewSizeChange',self,[]);
			return self;
		},
		hideGroup : function(groupId){
			var self = this;
			return 	self.showGroup(groupId,'hide');
		},
		addGroupRow : function(){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var render = gid+" .datagrid-view2";	
			var render1 = gid+" .datagrid-view1";	
			var gnode = {};
			var grw = $(render).find(".datagrid-header-row").width();
			
			var rowNumber = parseInt(opt.rowNumbersWidth);
			var cls = '';
			if(rowNumber>=16) {
				cls = 'datagrid-group-cell-rownumber';	
			}
			
			$(render).find(".datagrid-group-row").remove();
			$(render1).find(".datagrid-group-row-view1").remove();
			//锁定的列
			columns = opt.lockColumns;
			var cosp = 0;
			for(var i in columns) {
				if(columns[i] != null)  cosp++;
			}
			for(var i in opt.groupList) {
				opt._groupListData[i] = $.dataGrid._undef(opt._groupListData[i],[]);
				var group_row = $.dataGrid.tpl( self.getTpl("group_row") , {'gid':i,w:parseInt(grw),'id':opt.id,'colspan':opt.columns.length-cosp,"html":opt.groupList[i],"num":opt._groupListData[i].length} );
				var d = $(render).find(".datagrid-body tr[datagrid-group-id='"+i+"']");//.datagrid-body 兼容行锁
				var d1 = $(render1).find("tr[datagrid-group-id='"+i+"']");
				var tpl = "<tr id='"+opt.id+"-group-view1-row-"+i+"' datagrid-group-row-id='"+i+"' class='datagrid-group-row-view1'><td colspan='"+(cosp+1)+"'><div class='"+cls+"'></div></td></tr>";
				if(d.size()) {
					gnode = $(group_row).insertBefore(d.first());
					var _g = $(tpl);
					_g.insertBefore( d1.first() );
					
					//列锁需要
					if( !d.first().is(":hidden") ) {
						_g.find("div.datagrid-group-cell-rownumber").addClass("datagrid-group-cell-rownumber-select");//
					}
					
				} else {
					//如果当前分组没有数据
					for(var j=i-1;j>=0;j--) {
						var _d = $(render).find("tr[datagrid-group-id='"+i+"']");
						var _d1 = $(render1).find("tr[datagrid-group-id='"+i+"']");
						if( _d.size() ) {
							gnode = $(group_row).insertAfter(_d.last());	
							$(tpl).insertAfter( _d1.first() );
							break;
						}
					}
					if(j<0) {
						gnode = $(group_row).appendTo( $(render).find(".datagrid-body .datagrid-btable tbody") );
						$(tpl).appendTo( $(render1).find(".datagrid-body .datagrid-btable tbody") );
					}
				}
				
				
				var h = $("#"+opt.id+"-group-row-"+i).height();
				$("#"+opt.id+"-group-view1-row-"+i).height(h);
				//修正ie 6 7多出1px问题
				if(h != $("#"+opt.id+"-group-view1-row-"+i).height()) {
						$("#"+opt.id+"-group-view1-row-"+i).height(h-1);
				}
				opt.groupListCallBack.call(self,gnode.find(".datagrid-group-cell"),opt.groupList[i],opt._groupListData[i]);
				
			}
			
			self.setGroupEvent();
		},
		setGroupEvent : function(){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
				
			//self.addGroupRow();
			
			var render = gid+" .datagrid-view2";	
			var render1 = gid+" .datagrid-view1";
			//事件绑定
			for(var i in opt.groupList) {
				
				$(render).find("#"+opt.id+"-group-row-"+i).click(function(){
					var groupId = $(this).attr("datagrid-group-row-id");
					var gcell = $(this).find(".datagrid-group-cell");
					if(gcell.hasClass("datagrid-group-cell-select")) {
						self.hideGroup(groupId);
					} else {
						self.showGroup(groupId);
					}
				});
				$(render1).find("#"+opt.id+"-group-view1-row-"+i).click(function(){
					var groupId = $(this).attr("datagrid-group-row-id");
					var gcell = $(this).find(".datagrid-group-cell-rownumber");
					if(gcell.hasClass("datagrid-group-cell-rownumber-select")) {
						self.hideGroup(groupId);
					} else {
						self.showGroup(groupId);
					}
				});
			}
		},
		//对数据按指定的grouplist字段分类，并重新设置configs的data数据，途中会修改configs的 groupBy  groupList
		groupByField : function(field,data,groupList){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			
			var field = $.dataGrid._undef(field,opt.groupBy);	
			var data = $.dataGrid._undef(data,opt.data);
			var groupList = $.dataGrid._undef(groupList,opt.groupList);
			opt._groupList = $.dataGrid._undef(opt._groupList,opt.groupList);
			
			if(field === false) {
				return self;
			}
			
			//字段检测
			var fields = self.getColumns();
			var _field = false;
			for(var i=0;i<fields.length;i++) {
				if( fields[i]['field'] == field ) {
					_field = field;
					break;	
				}
			}
			if( _field === false ) {
				opt.groupBy = _field;
				return self;
			}
			field = _field;
			opt.groupBy = field;
			//data数据分类
			var _data = [];
			if(opt._groupList === false) {
				groupList = [];
				for(var i=0;i<data.length;i++) {
					if( $.inArray(data[i][field] , groupList ) === -1 ) {
						groupList.push(data[i][field]);	
					}
				}	
			}
			opt.groupList = groupList;
			
			for(var j=0;j<groupList.length;j++) {
				var _d = [];
				for(var t=0;t<data.length;t++) {
					if( data[t][field] == groupList[j] ) {
						data[t]['_groupid_'] = j;
						_d.push(data[t]);	
					}
				}
				_data[j] = _d;
				_d = [];
			}
			opt._groupListData = _data;
			
			data = [];//清空原有数据
			for(var k in _data) {
				for(var n=0;n<_data[k].length;n++) {
					data.push( _data[k][n] );
				}	
			}
			opt.data = data;
			return self;
		},
		searchData : function(text,field,async,data){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var text = $.dataGrid._undef(text,null);	
			if(text == null) return self;
			//字段进行检测 是否存在
			var field = $.dataGrid._undef(field,false);	
			var fields = self.getColumns();
			if(field !== false) {
				var _field = false;
				for(var i=0;i<fields.length;i++) {
					if( fields[i]['field'] == field ) {
						_field = field;
						break;	
					}
				}
				field = _field;
			}
			
			var async = $.dataGrid._undef(async,true);
			
			
			opt.cacheData['searchAsync'] = async;
			//本地搜索
			if( async ) {
				var data = $.dataGrid._undef(data,opt.cacheData['searchData'] || opt.cacheData['source'] || opt.data);	
				
				if(opt.cacheData['searched'] != true) {
					opt.cacheData['searchData'] = opt.cacheData['searchData'] || data;//存储元数据
					opt.cacheData['_url'] = opt.url;
					opt.cacheData['_pageNumber'] = opt.pageNumber;
					opt.cacheData['_data'] = opt.data;
				
					opt.url = "";
					opt.pageNumber = 1;
				 }
				var _data = [];
				for(var i=0;i<data.length;i++) {
					if(field !== false)	{
						if(data[i][field].toString().indexOf(text) != -1 ) {
							_data.push(data[i]);	
						}
					} else {
						for(var s=0;s<fields.length;s++) {
							if(data[i][ fields[s]['field'] ].toString().indexOf(text) != -1 ) {
								_data.push(data[i]);
								break;
							}	
						}	
					}
				}
				self.setGridData(_data,true);
				self.showGrid(function(){
						//opt.events.onSearch.call(self,_data);
						self.fireEvent('onSearch',self,[_data]);
						self.setGridBody();
				},$.noop,true);
			} else {//服务器搜索
				if(opt.cacheData['searched'] != true) {
					opt.cacheData['_pageNumber'] = opt.pageNumber;
					opt.pageNumber = 1;
				}
				opt.queryParams.searchText = text;	
				opt.queryParams.searchField = field;	
				self.showGrid(function(){
					//opt.events.onSearch.call(self,opt.data);
					self.fireEvent('onSearch',self,[opt.data]);
					self.setGridBody();						  
				});
			}
			
			opt.cacheData['searched'] = true;
			return self;
		},
		clearSearch : function(){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			
			if(opt.cacheData['searched'] !== true) {
				return self;	
			}
			
			opt.cacheData['searched'] = false;
			
			self.setGridData(opt.cacheData['searchData']);
			
			opt.url = opt.cacheData['_url'] || opt.url;
			opt.pageNumber = opt.cacheData['_pageNumber'] || opt.pageNumber;
			opt.data = opt.cacheData['_data'] || opt.data;
			
			try{
			delete opt.cacheData['_url'];
			} catch(e){}
			try{
			delete opt.cacheData['_pageNumber'];
			} catch(e){}
			try{
			delete opt.cacheData['searchData'];
			} catch(e){}
			try{
			delete opt.cacheData['_data'];
			} catch(e){}
			
			try{
			delete opt.queryParams['searchText'];
			} catch(e){}
			try{
			delete opt.queryParams['searchField'];
			} catch(e){}
			
			if( !opt.cacheData['searchAsync'] ){//if(opt.url != "") 
				delete opt.cacheData['source'];
			}
			if(opt.cacheData['searchAsync']) {
				self.refreshDataCache();
			} else {
				self.refreshData();	
			}
			
			delete opt.cacheData['searchAsync'];
			
			return self;
		},
		onOverRow : function(rowId){
			var self = this,
				opt = self.configs,
				gid = opt.gid;	
			var obj = $(gid).find("tr[datagrid-row-index='"+rowId+"']");
			obj.addClass("datagrid-row-over");
		},
		onOutRow : function(rowId){
			var self = this,
				opt = self.configs,
				gid = opt.gid;		
			var obj = $(gid).find("tr[datagrid-row-index='"+rowId+"']");
			obj.removeClass("datagrid-row-over");
		},
		setGridBodyEvent : function(){
			var self = this,
				opt = self.configs,
				gid = opt.gid;	
			var e = opt.events;	
			var data = opt.isCreate ? opt.data : [];
			var render = gid+" .datagrid-view2";	
			var fields = self.getColumns();
			//datagrid创建后 执行 行 事件绑定
			if(data.length) {
				opt.gbody.find("tr.datagrid-row").click(function(ev){
					var rowId = $(this).attr("datagrid-row-index");
					var rowData = self.getRowData(rowId);
					//触发单击行事件
					//var r = e.onClickRow.call(this,rowId,rowData);
					var r = self.fireEvent('onClickRow',self,[this,rowId,rowData]);
					//触发行 是否选择事件
					var isSelect = $(this).attr("datagrid-row-select");
					var selects = self.getSlectRows();
					if( isSelect == "1" ) {
						if(opt.singleSelect) {
							if(selects.length==1 && selects[0] != rowId) {
								self.unselectRow(rowId);	
							}
						} else {
							self.unselectRow(rowId);
						}
					} else {
						self.selectRow(rowId);
					}
					if(r == false) return false;
				});
				
				opt.gbody.find("tr.datagrid-row").hover(function(){
					var rowId = $(this).attr("datagrid-row-index");	
					self.fireEvent("onOverRow",self,[rowId])
				},function(){
					var rowId = $(this).attr("datagrid-row-index");	
					self.fireEvent("onOutRow",self,[rowId])
				});
				
				opt.gbody.find("tr.datagrid-row").dblclick(function(){
					var rowId = $(this).attr("datagrid-row-index");
					var rowData = self.getRowData(rowId);
					//双击行事件dblclick
					//var r = e.onDblClickRow.call(this,rowId,rowData);
					var r = self.fireEvent('onDblClickRow',self,[this,rowId,rowData]);
					if(r == false) return false;
				});
				
				opt.gbody.find("td div.datagrid-cell").click(function(){
					var rowId = $(this).parent("td").parent("tr.datagrid-row").attr("datagrid-row-index");
					var field = $(this).parent("td").attr("field");
					var value = self.getFieldValue(rowId,field);
					//双击行事件dblclick
					//var r = e.onClickCell.call(this,rowId,field,value);
					var r = self.fireEvent('onClickCell',self,[this,rowId,field,value]);
					if(r == false) return false;
				});
				opt.gbody.find("td div.datagrid-cell").dblclick(function(){
					var rowId = $(this).parent("td").parent("tr.datagrid-row").attr("datagrid-row-index");
					var field = $(this).parent("td").attr("field");
					var value = self.getFieldValue(rowId,field);
					//双击行事件dblclick
					//var r = e.onDblClickCell.call(this,rowId,field,value);
					var r = self.fireEvent('onDblClickCell',self,[this,rowId,field,value]);
					if(r == false) return false;
				});
				
				opt.gbody.find("tr.datagrid-row").bind("contextmenu",function(ev){
					var rowId = $(this).attr("datagrid-row-index");
					var rowData = self.getRowData(rowId);
					//触发单击行事件
					//var r = e.onRowContextMenu.call(this,rowId,rowData);
					var r = self.fireEvent('onRowContextMenu',self,[this,rowId,rowData]);
					if(r == false) return false;
				});
				
			}
			//单元格过滤
			if(data.length) {
				//单元格回调
				var field = [];
				for(var j in fields) {
					field = fields[j];
					$(render).find(".datagrid-body").find("td[field='"+field['field']+"']").each(function(idx){
						var rowId = $(this).parent().attr("datagrid-row-index");
						var rowData = self.getRowData(rowId);
						var t = $(this).find("div.datagrid-cell");
						field['callBack'].call(self,t,rowId,field,rowData);
					});
				}
				//行回调
				opt.gbody.find("tr.datagrid-row").each(function(idx){
					var rowId = $(this).attr("datagrid-row-index");
					var rowData = self.getRowData(rowId);
					if( $.isFunction(opt.rowStyler) ) {
						var rstyle = self.rowStyler.call(this,rowId,rowData);
						if(rstyle) {
							$(this).addClass(rstyle);	
						}
					} else {
						$(this).addClass(opt.rowStyler);	
					}								
				});
			}
			//检测文字是否超出
			self.setGridBodyTextLimit();
			
		},
		setGridBodyTextLimit : function(field){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var render = gid;
			
			if(typeof field === 'undefined') {
				
				var fields = self.getColumns();
				
				for(var i in fields) {
					if(fields[i]['textLimit'] === false) continue;
					var f = $(render).find(".datagrid-body td[field='"+fields[i]['field']+"']");//.find("div.datagrid-cell");
					f.each(function(idx){
						var rid = $(this).parent().attr("datagrid-row-index");
						var data = self.getRowData(rid);
						var value = $(this).find("div.datagrid-cell").html();
						
						if( typeof data[ fields[i]['field'] ] === 'undefined' ) {
							self.setRowData(rid,fields[i]['field'],value);
						}
						value = data[ fields[i]['field'] ];//注意
						
						var w = $(this).find("div.datagrid-cell").width();
						var fs = $(this).find("div.datagrid-cell").css("fontSize");
						var text = value;
						
						text = self.textLimit( text , w , fs );
						
						$(this).find("div.datagrid-cell").html( text );
						
					});
				}
			} else {
				var textLimit = self.getColumnData(field,'textLimit');
				if( textLimit ) {
					var f = $(render).find(".datagrid-row td[field='"+field+"']");//.find("div.datagrid-cell");
					f.each(function(idx){
						var rid = $(this).parent().attr("datagrid-row-index");
						var data = self.getRowData(rid);
						var value = $(this).find("div.datagrid-cell").html();
						
						if( typeof data[ field ] === 'undefined' ) {
							self.setRowData(rid,field,value);
						}
						value = data[ field ];//注意
						
						var w = $(this).find("div.datagrid-cell").width();
						var fs = $(this).find("div.datagrid-cell").css("fontSize");
						var text = value;
						
						text = self.textLimit( text , w , fs );
						
						$(this).find("div.datagrid-cell").html( text );
						
					});	
				}
			}
		},
		onBeforeShowGrid : function(){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			if(opt.lockColumns.length) {
				for(var j in opt.lockColumns) {
					if(opt.lockColumns[j] != null) {
						self.setGridHeader();
						return;
						break;	
					}	
				}	
			}
			if(opt.lockRows.length) {
				for(var j in opt.lockRows) {
					if(opt.lockRows[j] != null) {
						self.setGridHeader();
						return;
						break;	
					}	
				}	
			}
		},
		//必须要返回一个html dom
		setGridBody : function(render,func){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
				
			self.showLoading();
			
			var e = opt.events;	
			var render = render || gid+" .datagrid-view2";	
			var fields = self.getColumns();
			var func = func || $.noop;
			//对数据分类
			if( opt.isCreate )
				self.groupByField();
			
			var data = opt.isCreate ? opt.data : [];
			
			if( opt.isCreate )
				self.fireEvent('onBeforeShowGrid',self,[]);
			
			var isSet = $(render).find(".datagrid-body").size();
			var grid_body = $.dataGrid.tpl( self.getTpl("grid_body") , {'data':data,'fields':fields,"id":opt.id,'opt':opt} );
			if(isSet) {
				//$(render).find(".datagrid-body").replaceWith( grid_body );
				opt.gbody.replaceWith( grid_body );
				opt.gbody = $(render).find(".datagrid-body");
			} else {
				opt.gbody =$(grid_body).appendTo(render);
			}
			
			self.setGridBodyEvent();
			
			func();
			
			self.hideLoading();
			
			//所有数据都创建完成
			if(opt.isCreate) {
				self.resetGridHeight(render,opt.gbody,[opt.gheader,opt.gfooter]);
				self.onFinishDone = self.onFinishDone || false;
				if(!self.onFinishDone) {
					self.onFinishDone = true;
					//e.onFinish.call(self);
					self.fireEvent('onFinish',self);
				}
				//更新分页工具栏
				self.setPager();
				//更新序列栏
				self.resetView1();
				//更新
				self.addGroupRow();
				//数据更新后滚动条位置重置
				self.fireEvent('onScroll',self,[true]);
				//opt.gbody.scrollLeft(opt.sLeft);
				//opt.gbody.scrollTop(opt.sTop);
				//opt.gbody.scroll();
				
				self.methodCall('setGridBody');
				
				self.fireEvent('onViewSizeChange',self,[]);
				self.fireEvent('onShowGrid',self,[]);
			}
			return opt.gbody;
		},
		resetGridBody : function(render,func){
			var self = this;
			var func = func || $.noop;
			self.showGrid(function(){
				self.setGridBody(render,func);						  
			});	
		},
		setGridFooter : function(render,func){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var isSet = $(render).find(".datagrid-footer").size();
			var render = render || gid+" .datagrid-view2";
			var fields = self.getColumns();
			var func = func || $.noop;
			
			var grid_footer = $.dataGrid.tpl( self.getTpl("grid_footer") , {'data':opt.data,'fields':fields} );
			if(isSet) {
				//$(render).find(".datagrid-footer").replaceWith( grid_footer );
				opt.gfooter.replaceWith( grid_footer );
				opt.gfooter = $(render).find(".datagrid-footer");
			} else {
				opt.gfooter =$(grid_footer).appendTo(render);
			}
			func();
			
			self.methodCall('setGridFooter');
			return opt.gfooter;
		},
		//未完成
		onScroll : function(auto){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
				
			var render = render || gid+" .datagrid-view2";
			var render1 = gid+" .datagrid-view1";
			auto = $.dataGrid._undef(auto,false);	
			if(auto) {
				opt.gbody.scrollLeft(opt.sLeft);
				opt.gbody.scrollTop(opt.sTop);
			}
			opt.sLeft = opt.gbody._scrollLeft();
			opt.sTop = opt.gbody._scrollTop();
			
			$(render+" .datagrid-header .datagrid-header-inner")._scrollLeft( opt.sLeft );
			$(render1+" .datagrid-body")._scrollTop( opt.sTop );
		},
		resetGridHeight : function(render,subject,iarr){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var render = render || gid+" .datagrid-view2";
			var render1 = gid+" .datagrid-view1";
			var h = $(render).height();
			for(var i in iarr) {
				h -= iarr[i].height();
			}
			
			//重设高度
			subject.height( h );
			
			//$(render1).find(".datagrid-body").height( h );
			
			// 滚动条事件绑定
			subject.scroll(function(){
				//opt.sLeft = $(this)._scrollLeft();
				//opt.sTop = $(this)._scrollTop();
				//$(render+" .datagrid-header .datagrid-header-inner")._scrollLeft( opt.sLeft );
				//$(render1+" .datagrid-body")._scrollTop( opt.sTop );
				self.fireEvent('onScroll',self,[]);
			});
			return this;
		},
		//统一使用该函数来实现表格展示
		showGrid : function(successBack,errorBack,async){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var render = render || gid+" .datagrid-view2";
			
			var successBack = successBack || $.noop;
			var errorBack = errorBack || $.noop;
			var async = $.dataGrid._undef(async,false);	
			
			self.getGridData(function(){
				self.fireEvent('onGetData',self,[opt.data]);
				successBack.apply(this,arguments);	
			},function(){
				errorBack.apply(this,arguments);
			},async);
		},
		//刷新表格数据
		refreshData : function(){
			var e = this.configs.events;
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var render = render || gid+" .datagrid-view2";
			//e.onBeforeRefresh.call(self);	
			self.fireEvent('onBeforeRefresh',self);
			self.showGrid(function(){
				self.setGridBody(render,function(){
					//e.onRefresh.call(self);	
					self.fireEvent('onRefresh',self);
				});						  
			});
		},
		//无ajax刷新表格数据
		refreshDataCache : function(){
			var e = this.configs.events;
			var self = this;
			self.setGridBody();
		},
		clearCache : function(){
			var opt = this.configs;
			//个缓存清除
			opt.views = [];//清空视图缓存
			opt.isCreate = false;
			this.onFinishDone = false;
			opt.isShow = false;
			opt.pki = 0;
		},
		clearDataCache : function(setAll){
			var opt = this.configs;
			var _d = opt.cacheData;
			opt.cacheData = [];
			var setAll = $.dataGrid._undef(setAll,false);
			if(!setAll) {
				opt.cacheData['source'] = _d['source'];
				opt.cacheData['columns'] = _d['columns'];
			}
			return this;
		},
		//重新生成grid 慎用 setAll是否重置所有数据 否则保留source columns
		reLoadGrid : function(cfg,setAll){
			var opt = this.configs;
			var setAll = $.dataGrid._undef(setAll,false);
			this.clearCache(setAll);
			$.extend(opt,cfg);
			$.dataGrid.call(this,opt);
		},
		setWH : function(width,height){
			var self = this;
			self.fireEvent("onSizeChange",self,[width,height]);
			return self;
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
			//开始获取griddata数据
			
			self.showGrid(function(){
				self.setGridBody(render);
			});
			self.methodCall('createGrid');
			return self;
		},
		//对数据进行排序,返回排序后的结果，不支持中文排序
		sortData : function(field,data,type) {//对field列进行排序 type = asc type= desc
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var field = $.dataGrid._undef(field,opt.sortName);
			if( field == '' ) return self;
			//字段检测
			var fields = self.getColumns();
			var _field = false;
			for(var i=0;i<fields.length;i++) {
				if( fields[i]['field'] == field ) {
					_field = field;
					break;	
				}
			}
			if( _field === false ) return self;
			//排序处理
			opt.cacheData['source'] = opt.cacheData['source'] || opt.data;
			var data = $.dataGrid._undef(data,opt.cacheData['source']);
			var type = $.dataGrid._undef(type,opt.sortOrder);
			var isAsc = type == "asc" ? true : false;
			data.sort(function(a,b){
				a[field] = $.dataGrid._undef(a[field],"");
				b[field] = $.dataGrid._undef(b[field],"");
				if( a[field] >=  b[field]) return isAsc ? 1 : -1;
				return isAsc ? -1 : 1;
			});
			return data;
		},
		//数据管理 addData 添加表格数据 updateData更新表格数据 removeData删除表格数据
		//如果是opt.url 存在则发送数据到服务器
		//如果async = true的话 就所有操作都在本地进行
		//最好通过自己的函数向服务器添加数据然后调用refreshData 如果本地的话就无所谓
		onDataChange : function(data){
			var self = this,
				opt = self.configs;	
			self.refreshData();
		},
		addData : function(data){
			var self = this,
				opt = self.configs;
				
			var async = self.getAsync();
			
			data = $.dataGrid._undef( data , {} );
			data = $.isPlainObject(data) ? data : {};
			
			var pk = opt.pk;
			//本地添加
			if( async ) {
				data[pk] = $.dataGrid._undef( data[pk] , self.unique() );
				var _d = self.getData();
				_d.push(data);
				self.fireEvent("onAdd",self,[data,true]);
				self.fireEvent("onDataChange",self,[_d]);
			} else {
				//远程处理		
				self.fireEvent("onAjaxAdd",self,[data,self.onDataChange]);
			}
		},
		updateData : function(data){
			var self = this,
				opt = self.configs;
				
			var async = self.getAsync();
			
			data = $.dataGrid._undef( data , {} );
			data = $.isPlainObject(data) ? data : {};
			
			var pk = opt.pk;
			var setPk = false;
			//本地更新
			if( async ) {
				setPk = $.dataGrid._undef( data[pk] , false );
				if(setPk === false) {
					self.fireEvent("onUpdate",self,[data,false]);	
					return;
				}
				
				var _d = self.getData();
				for(var i in _d) {
					if(_d[i][pk] == data[pk]) {
						_d[i] = data;
						break;
					}	
				}
				self.fireEvent("onUpdate",self,[data,true]);
				self.fireEvent("onDataChange",self,[_d]);
			} else {
				//远程处理	
				self.fireEvent("onAjaxUpdate",self,[data,self.onDataChange]);
			}
		},
		deleteData : function(data){
			var self = this,
				opt = self.configs;
				
			var async = self.getAsync();
			
			data = $.dataGrid._undef( data , {} );
			data = $.isPlainObject(data) ? data : {};
			
			var pk = opt.pk;
			var setPk = false;
			//本地删除
			if( async ) {
				setPk = $.dataGrid._undef( data[pk] , false );
				if(setPk === false) {
					self.fireEvent("onDelete",self,[data,false]);	
					return;
				}
				
				var _d = self.getData();
				for(var i in _d) {
					if(_d[i][pk] == data[pk]) {
						break;
					}	
				}
				var __d = [];//删除后的新数据
				for(var j in _d) {
					if( i == j ) continue;
					__d.push(_d[j]);	
				}
				
				opt.cacheData['source'] = __d;
				
				self.fireEvent("onDelete",self,[data,true]);
				self.fireEvent("onDataChange",self,[__d]);
			} else {
				//远程处理	
				self.fireEvent("onAjaxDelete",self,[data,self.onDataChange]);
			}
		},
		//判断当前的操作是 服务器还是本地 true 表示本地操作
		getAsync : function(){
			var self = this,
				opt = self.configs,
				gid = opt.gid;	
			return (opt.url == "" || opt.url===false)  ? true : false;
		},
		//设置grid的data数据,
		setGridData : function(data , async , s){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
				
			var async = $.dataGrid._undef(async,false);	
			var s = $.dataGrid._undef(s,false);	
			if(async == false) {
				async = self.getAsync();
			}
			
			if( async ) {
				opt.cacheData['source'] = data;
			} else {
				opt.data = data;	
			}
			//数据重置后 PK值也的重置
			if(opt.pk == '_pk') {
				opt.pk = '';
				self.fireEvent("onSetPk",self,[data]);
			}
			
			//数据源改变时调用
			if( s ) {
				if( async )
					self.showGrid(function(){
						self.setGridBody();							   
					},$.noop,true);	
				else 
					self.refreshDataCache();
			}
		},
		//获取ajax返回的data数据
		getGridData : function(successBack,errorBack,async){
			var self = this,
				opt = self.configs,
				gid = opt.gid;
			var successBack = successBack || $.noop;
			var errorBack = errorBack || $.noop;
			
			var render = gid+" .datagrid-view2";
			
			var async = $.dataGrid._undef(async,false);	
			if(async == false) {
				async = self.getAsync();
			}
			
			self.methodCall('getGridData');
			
			if(async) {
				//本地数据都会存储到source 只有显示部分才会放到datal里 远程数据就都放在data 不会存放到source
				opt.cacheData['source'] = opt.cacheData['source'] || opt.data;
				
				self.fireEvent('onSetPk',self, [opt.cacheData['source']]);
				
				if(opt.sortName != '') {
					opt.cacheData['source'] = self.sortData();		
				}
				
				opt.total = opt.cacheData['source'].length;
				
				var start = (opt.pageNumber-1) * opt.pageSize;
				var end = opt.pageSize * opt.pageNumber;
				end = end>opt.total ? opt.total : end;
				var data = [];
				for(var i = start;i<end;i++){
					data.push(opt.cacheData['source'][i]);
				}
				opt.data = data;
				successBack.call(self,render);
				
				return;	
			}
			//ajax部分
			opt.queryParams.pageNumber = opt.pageNumber;
			opt.queryParams.pageSize = opt.pageSize;
			if(opt.sortName != '') {
				opt.queryParams.sortName = opt.sortName;
				opt.queryParams.sortOrder = opt.sortOrder;
			}
			var e = self.configs.events;
			
				$.ajax({
					url : opt.url,
					type : opt.method,
					cache : opt.cache,
					dataType : opt.dataType,
					data : opt.queryParams,
					beforeSend : function(){
						//e.onBeforeLoad.call(self);
						self.fireEvent('onBeforeLoad',self,[]);
						self.showLoading();	
					},
					success : function(data){
						self.hideLoading();
						opt.data = data.rows;
						opt.total = data.total;
						
						self.fireEvent('onSetPk',self,[opt.data]);
						
						//检查是否返回了column
						if(data.columns) {
							opt.columns = data.columns;
							self.setGridHeader();
						}
						
						//e.onLoadSuccess.call(self,data);
						self.fireEvent('onLoadSuccess',self,[data]);
						successBack.call(self,render);
						
					},
					error : function(xmlHttp){
						
						//e.onLoadError.call(self,xmlHttp.responseText);
						self.fireEvent('onLoadError',self,[xmlHttp.responseText]);
						errorBack.call(self,xmlHttp.responseText);
						
						self.showLoading(xmlHttp.responseText);
						setTimeout(function(){
							self.hideLoading();				
						},2000);
					}
				});	
			
		},
		setPk : function(data) {//data 必须是数组 这里是引用
			var self = this;
			var opt = self.configs;
			if(opt.pk != '') return;
			opt.pki = 1;
			opt.pk = '_pk';
			$.each(data,function(i,n){
				data[i][opt.pk] = opt.pki++;			 
			});
		},
		show : function (){
			var self = this;
			var opt = self.configs;
			var views = opt.views;
			var container = $("#"+opt.id);
			//防止重复调用
			if(opt.isShow) {
				return;	
			}
			opt.isShow = true;
			
			for(var i in views) {
				container.append( views[i] );	
			}
			
			self.setGrid();//必须 重新设置宽高
			self.setView();// 显示grid的容器
			self.createGrid();//gird数据显示开始...
			
			self.methodCall('show');
		}
	});
	
	$.fn._scrollLeft=function(_10){
		if(_10==undefined){
			return this.scrollLeft();
		}else{
			return this.each(function(){
				//$(this)._scrollLeft(_10);			  
				$(this).css("marginLeft",_10*-1);
			});
		}
	};
	
	$.fn._scrollTop=function(_10){
		if(_10==undefined){
			return this.scrollTop();
		}else{
			return this.each(function(){
				//$(this).scrollTop(_10);
				$(this).css("marginTop",_10*-1);
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
	
	//resizeable
	$.fn._resize = function(opt){
		var opt = opt || {};
		var opt = $.extend({},opt);
		
		var self = this;
		function start(e,opt) {
			$(document.body).css("cursor", "col-resize");
			$(document.body).css("-moz-user-select", "none");
			$(document.body).attr("unselectable", "on");
			opt.gheader.find(".datagrid-header-inner").css("cursor", "col-resize");
			opt.gheader.find("div.datagrid-cell").css("cursor", "col-resize");
			
			var line = $("<div class='datagrid-resize'></div>");
			var render = "#view_"+opt.id;
			$(render).append(line);
			var left = $(this).offset().left - $(render).offset().left;
			var height = $(render).height();
			var width = $(this).width();
			left = parseInt(left)+parseInt(width);
			line.css({
				position:'absolute',
				borderLeft : '1px solid #aac5e7',
				'top':0,
				'zIndex':9999,
				'height':parseInt(height),
				'left':left
			});
			opt.line = line;
			opt.x = e.clientX;
			opt.left = left;
			
			opt.offsetX = 0;
			
			$(document.body).bind("selectstart", function(e){
				return false;
			});
			
			$(document).bind("mousemove", function(e){
				//var r = opt.events.onResizeColumn(e,opt);
				var r = opt.self.fireEvent('onResizeColumn',opt.self,[e,opt]);
				if(r === false) return;
				resize(e,opt);
			});
			$(document).bind("mouseup", function(e){
				var r = opt.stop(e,opt);
				//if(r === false) return;
				stop(e,opt);
			});
		}
		function resize(e,opt){
			
			var x = e.clientX;
			var left = opt.left + (x - opt.x);
			opt.offsetX = (x - opt.x);
			opt.line.css({
				'left':left
			});
		}
		function stop(e,opt){
			//opt.self.resizing = false;
			var render = "#view_"+opt.id;
			$(document)	.unbind("mousemove");
			$(document)	.unbind("mouseup");
			
			$(document.body).unbind("selectstart");
			
			$(document.body).css("cursor",'default');
			$(document.body).removeAttr("unselectable");
			
			opt.gheader.find(".datagrid-header-inner").css("cursor", "default");
			opt.gheader.find("div.datagrid-cell").css("cursor", "default");
			
			$(opt.line).remove();
		}
		self.each(function(idx){
			$("<div class='datagrid_resize'></div>")
				.appendTo($(this).parent())
				.bind("mousedown",function(e){
					//opt.self.resizing = true;
					opt.field = $(this).parent().attr("field");
					//var r = opt.events.onResizeColumnStart.call(this,e,opt);
					var r = opt.self.fireEvent('onResizeColumnStart',opt.self,[e,this,opt]);
					if(r === false) return;
					start.call(this,e,opt);
				});
		});
	}
})(jQuery);