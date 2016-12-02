<?php
// NOBO
class UserAction extends CommonAction {
	
	function _initialize()
    {
		parent::_initialize();
		$this->dao = D('Admin/User');
    }
    public function index(){
		$User = $this->dao;
		import("@.ORG.Util.Page");
		$users = $User->getUsersList($_REQUEST['page'],100,$whereiarr);
		$mpurl = GROUP_NAME.'/'.MODULE_NAME.'/'.ACTION_NAME;
		$multis = new Page($users[0],100,$_REQUEST['page'],$mpurl,'',5);
		$this->multi = $multis->multi_tp();
		$this->users = $users[1];
		$this->groupList = F('Role');
		$this->display();
    }
	public function search(){
		if($_POST['search']) {
			$whereiarr = array();
			if($_POST['start_time'] && $_POST['end_time']) {
				$whereiarr['registertime'] = array(array('gt',strtotime($_POST['start_time'])),array('lt',strtotime($_POST['end_time'])));
			}
			if($_POST['status'] != '') {
				$whereiarr['status'] = $_POST['status'];
			}
			if($_POST['roleid'] != '') {
				$whereiarr['roleid'] = $_POST['roleid'];
			}
			$keyword =  $_POST['keyword'];
			switch($_POST['type']) {
				case 1:
					if($keyword != '') {
						$whereiarr['username'] = $keyword;
					}
					break;
				case 2:
					if($keyword != '') {
						$whereiarr['userid'] = $keyword;
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
		
		$User = $this->dao;
		import("@.ORG.Util.Page");
		$users = $User->getUsersList($_REQUEST['page'],100,$whereiarr);
		$mpurl = GROUP_NAME.'/'.MODULE_NAME.'/'.ACTION_NAME;
		$multis = new Page($users[0],100,$_REQUEST['page'],$mpurl,'',5);
		$this->multi = $multis->multi_tp();
		$this->users = $users[1];
		$this->groupList = F('Role');
		$this->display('index');
	}
	public function add() {
		if($_POST['dosubmit']) {
			$this->addUser();
			exit;
		}
		$this->groupList = F('Role');
		$this->display();
	}
	public function edit() {
		if($_POST['dosubmit']) {
			$this->editUser();
			exit;
		}
		$userid = $_GET['userid'];
		$User = $this->dao;
		$this->userid = $userid;
		$this->groupList = F('Role');
		$this->userinfo = $User->getUser($userid,true);
		$this->display();
	}
	protected function addUser() {
		$User = $this->dao;
		$uid = $User->userRegister($_POST);
		if($uid === false) {
			$this->error('添加失败');
		} else {
			$this->success('添加成功');
		}
	}
	public function editUser() {
		$User = $this->dao;
		unset($_POST['username']);
		$uid = $User->userEdit($_POST);
		if($uid === false) {
			$this->error('修改失败');
		} else {
			$this->success('修改成功');
		}
	}
}