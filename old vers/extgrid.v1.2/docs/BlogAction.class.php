<?php
// NOBO
class BlogAction extends CommonAction {
	
	function _initialize()
    {
		parent::_initialize();
		$this->dao = M("Blog");
    }
    public function index(){
		if($_POST['dosubmit']) {
			$this->doBlog();
			exit;
		}
		$Dao = $this->dao;
		import("@.ORG.Util.Page");
		$class = M('class');
		$classes = $class->where("type=2")->select();
		$cs = array();
		foreach($classes as $vs){
			$cs[$vs['cid']] = $vs['classname'];
		}
		$codes = $Dao->page($_REQUEST['page'])->limit(100)->select();
		foreach($codes as $key=>$value) {
			$codes[$key]['classid'] = $cs[$value['classid']];
			$codes[$key]['dateline'] = date("Y-m-d H:i:s",$value['dateline']);
			$codes[$key]['visible'] = empty($value['visible']) ? '不显示' : '显示';
			$codes[$key]['attentment'] = empty($value['attentment']) ? '无' : '带附件';
			$codes[$key]['description'] = mb_strcut($value['content'],0,60,'utf-8').(mb_strlen($value['content'])>=60?'...':'');
		}
		$mpurl = GROUP_NAME.'/'.MODULE_NAME.'/'.ACTION_NAME;
		$multis = new Page($Dao->count(),100,$_REQUEST['page'],$mpurl,'',5);
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
						$whereiarr['subject'] = array('like','%'.$keyword.'%');
					}
					break;
				case 2:
					if($keyword != '') {
						$whereiarr['blogid'] = $keyword;
					}
					break;
				case 3:
					if($keyword != '') {
						$whereiarr['username'] = $keyword;
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
		$classes = $class->where("type=2")->select();
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
		$classes = $class->where("type=2")->select();
		$this->classes = $classes;
		$this->display('Code:classes');
	}
	public function addClass(){
		$class = M('class');
		if(empty($_POST['classname'])) {
			$this->ajaxReturn(0,'分类名不能为空');
		}
		$_POST['type'] = 2;
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
	public function doBlog() {
		switch($_POST['ac']) {
			case 0:
			case 1:
				if(!empty($_POST['cids'])) {
					foreach($_POST['cids'] as $id) {
						if(empty($id)) continue;
						$this->dao->where('blogid='.$id)->setField('visible',$_POST['ac']);
					}
				}
				$this->success("修改成功");
				break;
			case 2:
			case 3:
				if(!empty($_POST['cids'])) {
					foreach($_POST['cids'] as $id) {
						if(empty($id)) continue;
						$this->dao->where('blogid='.$id)->setField('noreply',$_POST['ac']);
					}
				}
				$this->success("修改成功");
				break;
			case 4:
				if($_POST['cids']) {
					$cids = implode(",",$_POST['cids']);
					$this->dao->delete($cids);
				}
				$this->success("删除成功");
				break;
		}
	}
	public function add() {
		if($_POST['dosubmit']) {
			$this->addBlog();
			exit;
		}
		$class = M('class');
		$this->classes = $class->where(array('type'=>2))->select();
		$this->display();
	}
	protected function addBlog() {
		$Dao = $this->dao;
		$_POST['dateline'] = strtotime($_POST['dateline']);
		$_POST['username'] = $_SESSION['userinfo']['username'];
		$r = $Dao->create();
		$id = false;
		if($r) {
			$id = $Dao->add();
		}
		if($id === false) {
			$this->error('添加失败');
		} else {
			$this->success('添加成功');
		}
	}
	public function edit() {
		if($_POST['dosubmit']) {
			$this->editBlog();
			exit;
		}
		$Dao = $this->dao;
		$class = M('class');
		$this->classes = $class->where(array('type'=>2))->select();
		$id = $_GET['id'];
		if($id) {
			$cnt = $Dao->where("blogid=".$id)->count();
			if($cnt) {
				/*$Code->create();
				$fetchid = $Code->save();
				if($fetchid) {
					$this->success('修改成功');
				} else {
					$this->success('没有发生修改');
				}*/
				$info = $Dao->select($id);
				$info = $info[0];
			} else {
				$this->error('要修改的对象不存在！');exit;
			}
		}
		$this->info = $info;
		$this->display();
	}
	public function editBlog() {
		$Dao = $this->dao;
		$_POST['dateline'] = strtotime($_POST['dateline']);
		$_POST['username'] = $_SESSION['userinfo']['username'];
		$Dao->create();
		$id = $Dao->save();
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