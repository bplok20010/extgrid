<?php
class IndexAction extends CommonAction {
    public function index(){
		$this->display();
    }
	public function main(){
		//dump(get_defined_constants(true));
		$this->display();
    }
	public function top() {
		$this->menus = getMenus(GROUP_NAME);
		$this->display();
	}
	public function cache() {
		switch($_GET['module']) {
			case 'role':
				import('@.ORG.Util.RBAC');
				RBAC::setRoleListCache();
				RBAC::setNodeListCache();
				RBAC::setAccessListCache();
				$this->success('缓存更新成功！',__URL__."/main");
				break;
			case 'category':
				$category = D('Admin/Category');
				$categorys = $category->setCategoryCache();
				$this->success('缓存更新成功！',__URL__."/main");
				break;
		}
	}
	public function left() {
		$leftMenus = array();
		import("@.ORG.Util.Tree");
		$menus = getMenus(GROUP_NAME);//获取当前分组的栏目
		$categorys = F('CATEGORYS');
		$categorys = $categorys[GROUP_NAME];
		$tree = new tree($categorys);
		foreach($menus as $key=>$value) {
			$leftMenus[$value['catid']] = "<div class=\"div_bigmenu_nav_down\" id=\"nav_{$catid}\" onclick=\"javascript:lefttoggle(".$value['catid'].");\">".$value['catname']."</div><ul id=\"ul_".$value['catid']."\">";
			$childiarr = $tree->get_child($value['catid']);
			foreach($childiarr as $cat) {
				$leftMenus[$value['catid']] .= "<li> <a href=\"".__APP__.'/'.$cat['group'].'/'.$cat['module'].'/'.$cat['action'].$cat['data']."\" target='main'>".$cat['catname']."</a></li>";
			}
			$leftMenus[$value['catid']] .= "</ul>";
		}
		$this->leftMenus = $leftMenus;
		$this->display();
	}
	public function bottom() {
		$this->display();
	}
}