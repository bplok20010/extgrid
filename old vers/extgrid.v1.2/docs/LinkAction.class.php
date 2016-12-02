<?php
// NOBO
class LinkAction extends CommonAction {
	
	function _initialize()
    {
		parent::_initialize();
		$this->dao = M("Link");
    }
    public function index(){
		if($_POST['dosubmit']) {
			$this->deleteLink();
			exit;
		}
		$Link = $this->dao;
		import("@.ORG.Util.Page");
		$class = M('class');
		$classes = $class->where("type=1")->select();
		$cs = array();
		foreach($classes as $vs){
			$cs[$vs['cid']] = $vs['classname'];
		}
		$codes = $Link->page($_REQUEST['page'])->limit(100)->select();
		foreach($codes as $key=>$value) {
			$codes[$key]['classid'] = $cs[$value['classid']];
		}
		$mpurl = GROUP_NAME.'/'.MODULE_NAME.'/'.ACTION_NAME;
		$multis = new Page($Link->count(),100,$_REQUEST['page'],$mpurl,'',5);
		$this->multi = $multis->multi_tp();
		$this->codes = $codes;
		$this->classes = $classes;
		$this->display();
    }
	public function search(){
		if($_POST['search']) {
			$whereiarr = array();
			if($_POST['start_time'] && $_POST['end_time']) {
				$whereiarr['dateline'] = array(array('egt',$_POST['start_time']),array('elt',$_POST['end_time']));
			}
			if($_POST['classid']) {
				$whereiarr['classid'] = $_POST['classid'];
			}
			$keyword =  $_POST['keyword'];
			switch($_POST['type']) {
				case 1:
					if($keyword != '') {
						$whereiarr['title'] = array('like','%'.$keyword.'%');
					}
					break;
				case 2:
					if($keyword != '') {
						$whereiarr['lid'] = $keyword;
					}
					break;
				case 3:
					if($keyword != '') {
						$whereiarr['email'] = $keyword;
					}
					break;
				case 4:
					if($keyword != '') {
						$whereiarr['nickname'] = $keyword;
					}
					break;
			}
		}
		
		$Link = $this->dao;
		import("@.ORG.Util.Page");
		$class = M('class');
		$classes = $class->where("type=1")->select();
		$cs = array();
		foreach($classes as $vs){
			$cs[$vs['cid']] = $vs['classname'];
		}
		$codes = $Link->where($whereiarr)->page($_REQUEST['page'])->limit(100)->select();
		foreach($codes as $key=>$value) {
			$codes[$key]['classid'] = $cs[$value['classid']];
		}
		$mpurl = GROUP_NAME.'/'.MODULE_NAME.'/'.ACTION_NAME;
		$multis = new Page($Link->where($whereiarr)->count(),100,$_REQUEST['page'],$mpurl,'',5);
		$this->multi = $multis->multi_tp();
		$this->codes = $codes;
		$this->classes = $classes;
		$this->display('index');
	}
	public function classes(){
		$class = M('class');
		$classes = $class->where("type=1")->select();
		$this->classes = $classes;
		$this->display('Code:classes');
	}
	public function addClass(){
		$class = M('class');
		if(empty($_POST['classname'])) {
			$this->ajaxReturn(0,'分类名不能为空');
		}
		$_POST['type'] = 1;
		$cid = $class->add($_POST);
		if($cid) {
			$this->ajaxReturn($cid,$_POST['classname']);
		} else {
			$this->ajaxReturn(0,'添加失败');
		}
	}
	public function editClass(){
		$class = M('class');
		if(empty($_POST['classname'])) {
			$this->ajaxReturn(0,'分类名不能为空');
		}
		$cid = $class->save($_POST);
		if($cid) {
			$this->ajaxReturn(1,'修改成功');
		} else {
			$this->ajaxReturn(0,'修改失败');
		}
	}
	public function deleteClass(){
		$class = M('class');
		$cid = $_REQUEST['cid'];
		$class->delete($cid);
		$this->ajaxReturn($cid,'删除成功');
	}
	public function deleteLink() {
		if($_POST['cids']) {
			$cids = implode(",",$_POST['cids']);
			$this->dao->delete($cids);
		}
		$this->success("删除成功");
	}
	public function add() {
		if($_POST['dosubmit']) {
			$this->addLink();
			exit;
		}
		$class = M('class');
		$this->classes = $class->where(array('type'=>1))->select();
		$this->display();
	}
	protected function addLink() {
		$Link = $this->dao;
		$r = $Link->create();
		$cid = false;
		if($r) {
			$cid = $Link->add();
		}
		if($cid === false) {
			$this->error('添加失败');
		} else {
			if($_POST['add_attentment'] == 1) {
				import("@.ORG.Util.Http");
				$content = Http::fsockopenDownload($_POST['url']);
				if(!file_exists("./Public/Uploads/link/")) {
					mk_dir('./Public/Uploads/link/');
				}
				$path = './Public/Uploads/link/'.$_POST['title']."(".date("Y-m-d H:i:s",time()).").html";
				file_put_contents($path,$content);
				$Link->where(array('lid'=>$cid))->setField("attentment",$path);
			}
			$this->success('添加成功');
		}
	}
	public function edit() {
		if($_POST['dosubmit']) {
			$this->editLink();
			exit;
		}
		$Link = $this->dao;
		$class = M('class');
		$this->classes = $class->where(array('type'=>1))->select();
		$cid = $_GET['lid'];
		if($cid) {
			$cnt = $Link->where("lid=".$cid)->count();
			if($cnt) {
				/*$Code->create();
				$fetchid = $Code->save();
				if($fetchid) {
					$this->success('修改成功');
				} else {
					$this->success('没有发生修改');
				}*/
				$info = $Link->select($cid);
				$info = $info[0];
			} else {
				$this->error('要修改的对象不存在！');exit;
			}
		}
		$this->info = $info;
		$this->display();
	}
	public function editLink() {
		$Dao = $this->dao;
		$Dao->create();
		$id = $Dao->save();
		if($_POST['add_attentment'] == 1) {
			import("@.ORG.Util.Http");
			$content = Http::fsockopenDownload($_POST['url']);
			if(!file_exists("./Public/Uploads/link/")) {
				mk_dir('./Public/Uploads/link/');
			}
			$path = './Public/Uploads/link/'.$_POST['title'].".html";
			file_put_contents($path,$content);
			$Dao->where(array('lid'=>$_POST['lid']))->setField("attentment",$path);
		}
		$this->success('修改成功');
	}
	public function down(){
		import("@.ORG.Util.Http");
		$cid = $_GET['lid'];
		$Dao = $this->dao;
		$path = $Dao->getFieldByLid($cid,'attentment');
		if(file_exists($path)) {
			Http::download($path);
		} else {
			return false;
		}
	}
}