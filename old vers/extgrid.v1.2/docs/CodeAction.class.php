<?php
// NOBO
class CodeAction extends CommonAction {
	
	function _initialize()
    {
		parent::_initialize();
		$this->dao = M('Code');
    }
    public function index(){
		if($_POST['dosubmit']) {
			$this->deleteCode();
			exit;
		}
		$Code = $this->dao;
		import("@.ORG.Util.Page");
		$class = M('class');
		$classes = $class->where("type=0")->select();
		$cs = array();
		foreach($classes as $vs){
			$cs[$vs['cid']] = $vs['classname'];
		}
		$codes = $Code->page($_REQUEST['page'])->order("cid DESC")->limit(100)->select();
		foreach($codes as $key=>$value) {
			$codes[$key]['classid'] = $cs[$value['classid']];
			$codes[$key]['attentment'] = empty($value['attentment']) ? '否' : "<a href='".U(GROUP_NAME.'/'.MODULE_NAME.'/down','cid='.$value['cid'].'&t='.time())."'>下载</a>";
		}
		$mpurl = GROUP_NAME.'/'.MODULE_NAME.'/'.ACTION_NAME;
		$multis = new Page($Code->count(),100,$_REQUEST['page'],$mpurl,'',5);
		$this->multi = $multis->multi_tp();
		$this->codes = $codes;
		$this->classes = $classes;
		$this->display();
    }
	public function down(){
		import("@.ORG.Util.Http");
		$cid = $_GET['cid'];
		$Code = $this->dao;
		$path = $Code->getFieldByCid($cid,'attentment');
		$file_ext = explode(".",$path);
		if(count($file_ext)>=2) {
			$file_ext = end($file_ext);
		}
		$filename = $Code->getFieldByCid($cid,'title');
		
		Http::download($path,$filename.'.'.$file_ext);
	}
	public function classes(){
		$class = M('class');
		$classes = $class->where("type=0")->select();
		$this->classes = $classes;
		$this->display();
	}
	public function addClass(){
		$class = M('class');
		if(empty($_POST['classname'])) {
			$this->ajaxReturn(0,'分类名不能为空');
		}
		$cid = $class->add($_POST);
		if($cid) {
			$this->ajaxReturn($cid,$_POST['classname']);
		} else {
			$this->ajaxReturn(0,'添加失败');
		}
	}
	public function deleteCode() {
		if($_POST['cids']) {
			$cids = implode(",",$_POST['cids']);
			$this->dao->delete($cids);
		}
		$this->success("删除成功");
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
						$whereiarr['cid'] = $keyword;
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
		
		$Code = $this->dao;
		import("@.ORG.Util.Page");
		$class = M('class');
		$classes = $class->where("type=0")->select();
		$cs = array();
		foreach($classes as $vs){
			$cs[$vs['cid']] = $vs['classname'];
		}
		$codes = $Code->where($whereiarr)->page($_REQUEST['page'])->limit(100)->select();
		foreach($codes as $key=>$value) {
			$codes[$key]['classid'] = $cs[$value['classid']];
			$codes[$key]['attentment'] = empty($value['attentment']) ? '否' : '是';
		}
		$mpurl = GROUP_NAME.'/'.MODULE_NAME.'/'.ACTION_NAME;
		$multis = new Page(count($codes),100,$_REQUEST['page'],$mpurl,'',5);
		$this->multi = $multis->multi_tp();
		$this->codes = $codes;
		$this->classes = $classes;
		$this->display("index");
	}
	public function add() {
		if($_POST['dosubmit']) {
			$this->addCode();
			exit;
		}
		$class = M('class');
		$this->classes = $class->where(array('type'=>0))->select();
		$this->display();
	}
	public function edit() {
		if($_POST['dosubmit']) {
			$this->editCode();
			exit;
		}
		$Code = $this->dao;
		$class = M('class');
		$this->classes = $class->where(array('type'=>0))->select();
		$cid = $_GET['cid'];
		if($cid) {
			$cnt = $Code->where("cid=".$cid)->count();
			if($cnt) {
				/*$Code->create();
				$fetchid = $Code->save();
				if($fetchid) {
					$this->success('修改成功');
				} else {
					$this->success('没有发生修改');
				}*/
				$info = $Code->select($cid);
				$info = $info[0];
			} else {
				$this->error('要修改的对象不存在！');exit;
			}
		}
		$this->info = $info;
		$this->display();
	}
	protected function addCode() {
		$Code = $this->dao;
		$r = $Code->create();
		$cid = false;
		if($r) {
			$cid = $Code->add();
		}
		if($cid === false) {
			$this->error('添加失败');
		} else {
			$path = file_upload('attentment','./Public/Uploads/code/',md5($_POST['title']).'-'.$cid);
			if(!in_array($path,array(1,2,3,4))) {
				$Code->where(array('cid'=>$cid))->setField("attentment",$path);
			}
			$this->success('添加成功');
		}
	}
	public function editCode() {
		$Code = $this->dao;
		$path = file_upload('attentment','./Public/Uploads/code/',md5($_POST['title']).'-'.$cid);
		$Code->create();
		$cid = $Code->save();
		if(!in_array($path,array(1,2,3,4))) {
			$Code->where(array('cid'=>$_POST['cid']))->setField("attentment",$path);
			$cid = true;
		}
		if($cid === false) {
			$this->error('修改失败');
		} else {
			$this->success('修改成功');
		}
	}
}