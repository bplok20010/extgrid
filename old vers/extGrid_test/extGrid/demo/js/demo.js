var DEMO = {
	run : function(){
		var T = this;
		var columns = [
			{field:'username',width:'10%',minWidth:60,title:'姓名',editor:{type:'text',rules:['required']}},
			{field:'age',width:'6%',minWidth:45,title:'年龄',editor:{type:'spinner',rules:['required']}},
			{field:'sex',width:'6%',minWidth:45,title:'性别',editor:{type:'select',items:[{name:'男'},{name:'女'}]}},
			{field:'email',width:'10%',minWidth:80,title:'邮箱',editor:{type:'text',rules:['email']}},
			{field:'birthday',width:'13%',minWidth:80,title:'出生日期',editor:{type:'date'}},
			{field:'address',width:'22%',minWidth:100,title:'联系地址',editor:{type:'textarea',height:80}},
			{field:'info',width:'22%',minWidth:100,title:'个人说明',editor:{type:'textarea',height:80}},
		];	
		var opt = {
			url : 'list.php',
			columns : columns,
			rowNumbersWidth:24,
			singleSelect:true,
			responsive : true,
			toolBars : [{text:'添加',callBack:T.add}],
			pk : 'id',
			checkBox:true,
			pagination:true,
			editColumn : [{text:'删除',callBack:T['_delete']}],
			title : '增删改查DEMO'
		}
		window.grid = $("#tab").extgrid(opt);
		
		T.bindEvent(window.grid);
	},
	bindEvent : function(grid){
		var T = this;
		grid.bind("onSelect",function(obj,rowId,rowData){
	
			var grid = this;
			//IE有显示的BUG 应该换成以下写法
			setTimeout(function(){
				grid.fireEvent("onScroll");
				grid.editRow(rowId);
				$(document).one("click.edit",function(){
					grid.saveEditRow(rowId);	
					grid.unselectRow(rowId);
				});
			},0);
			//其他写法
			//grid.editRow(rowId);
			
			
		});
		grid.bind("onUnselect",function(obj,rowId,rowData){
			
			var grid = this;
			grid.saveEditRow(rowId);
			
		});	
		grid.bind("onRowEdit",T.save);
		//取消编辑状态
		grid.bind("onAfterDeleteRow",function(){
			grid.unEditCell();												  
		});
		$(window).bind("resize",function(){
			grid.unEditCell();								 
		})
	},
	add : function(){
		var g = this;
		var d = {
			id : -1,
			username : '',
			age : '',
			sex : '',
			email:'',
			birthday : '',
			address : '',
			info : ''
		};
		//id=-1 代表是新增数据
		g.addRow(d,false);
	},
	save : function(rid,rowData,saveField){
		var g = this;
		if( saveField.length ){//是否有修改
			g.showLoading();
			$.post("post.php",rowData,function(id){
				rowData.id = id;	
				g.hideLoading();
			})
		}
	},
	_delete:function(t,rid,_opt,rowData,_item){
		var g = this;
		
		if( rowData.id == -1 ) {
			g.deleteRow(rid);		
			return ;
		}
		
		if(confirm("你确定要删除?")){
			g.showLoading();
			$.post("post.php?action=delete",rowData,function(){
				g.deleteRow(rid);	
				g.hideLoading();
			});	
		}
	}
};