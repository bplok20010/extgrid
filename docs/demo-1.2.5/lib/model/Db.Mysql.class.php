<?php
define('CLIENT_MULTI_RESULTS', 131072);
/*
	$config:
	eg:
	$_SC['hostname']  		= 'localhost'; //服务器地址
	$_SC['hostport']  		= ''; //
	$_SC['username']  		= 'root'; //用户
	$_SC['password'] 	 		= ''; //密码
	$_SC['charset'] 		= 'utf8'; //字符集
	$_SC['pconnect'] 		= 0; //是否持续连接
	$_SC['database']  		= 'test'; //数据库
*/
class Db extends BuildSql {
	/*
	*实例化多个Db不会重复连接,如果该Db产生了linkID 那么$DBcount++;最后一个Db类析构的时候会关闭数据库连接并设置linkIDs[id] = null;
	*/
	//统计公有DB类共同用一个linkID,
	static protected $DbCount = array();
	//连接ID
	static protected $linkIDs = array();
	protected $_linkID = null;
	protected $config = array();
	protected $queryID = null;//最近一次查询ID
	public $querynum = 0;
	protected $_linkNum = null;
	public function __construct($config=''){
        if ( !extension_loaded('mysql') ) {
            $this->halt('当前服务器不支持:mysql');
        }
        if(!empty($config)) {
            $this->config  =  $config;
        }
    }
	//连接数据库
	public function connect($config=array(),$linkNum=0) {
		$linkID = Db::$linkIDs;
		if(empty($config)) {
            $config = $this->config;
        }
		if($linkNum == 0) {
			$linkNum = md5(serialize($config));
		}
		if ( !isset($linkID[$linkNum]) ) {
			$host = $config['hostname'].(!empty($config['hostport'])?":{$config['hostport']}":'');
			if($config['pconnect']) {
                $linkID[$linkNum] = @mysql_pconnect( $host, $config['username'], $config['password'],CLIENT_MULTI_RESULTS);
            }else{
                $linkID[$linkNum] = @mysql_connect( $host, $config['username'], $config['password'],true,CLIENT_MULTI_RESULTS);
            }
			if ( !$linkID[$linkNum] ) {
                $this->halt(mysql_error());
            }
			if((!empty($config['database']) && !mysql_select_db($config['database'], $linkID[$linkNum])) ) {
				$this->halt(mysql_error());
			}
			$this->_linkID = $linkID[$linkNum];
			
            if ($this->version() >= '4.1') {
                //使用UTF8存取数据库 需要mysql 4.1.0以上支持
                mysql_query("SET NAMES '".$config['charset']."'", $this->_linkID);
				if($this->version() > '5.0.1') {
					@mysql_query("SET sql_mode=''", $this->_linkID);
				}
            }
			Db::$linkIDs[$linkNum] = $this->_linkID;
		} else {
			$this->_linkID = $linkID[$linkNum];
		}
		
		$this->_linkNum = $linkNum;
		
		if(!isset(Db::$DbCount[$linkNum])) {
			Db::$DbCount[$linkNum] = 0;
		}
		Db::$DbCount[$linkNum]++;
        return $this->_linkID;
	}
	//获得数据库下的所有表
	public function getTables($dbName='') {
        if(!empty($dbName)) {
           $sql    = 'SHOW TABLES FROM '.$dbName;
        }else{
           $sql    = 'SHOW TABLES ';
        }
        $result =   $this->getAll($this->query($sql));
        $info   =   array();
        foreach ($result as $key => $val) {
            $info[$key] = current($val);
        }
        return $info;
    }
	public function select_db($dbname) {
		return mysql_select_db($dbname, $this->_linkID);
	}
	//SQL指令安全过滤
	public function escapeString($str) {
        if($this->_linkID) {
            return mysql_real_escape_string($str,$this->_linkID);
        }else{
            return mysql_escape_string($str);
        }
    }
	//執行查詢語句
	public function query($sql,$type='') {
		if(is_null($this->_linkID)) {
			$this->connect($this->config,0);
		}
		/*if(0===stripos($sql, 'call')){ // 存储过程查询支持
            $this->close();
        }*/
		//释放前次的查询结果
        if ( $this->queryID ) {    $this->free();    }
		$func = $type == 'UNBUFFERED' && @function_exists('mysql_unbuffered_query') ?
			'mysql_unbuffered_query' : 'mysql_query';
		if(!($queryID = $func($sql, $this->_linkID)) && $type != 'SILENT') {
			$this->halt('MySQL Query Error:'.$sql);
		}
		//执行 update insert 等sql
		if($queryID === true || $queryID === false) {
			return $queryID;
		}
		$this->queryID = $queryID;
		$this->querynum++;
		return $queryID;
	}
	//取得所有查询数据
	public function getAll($queryID='') {
        //返回数据集
		if(empty($queryID)) {
			$queryID = $this->queryID;
		}
        $result = array();
		$numRows = mysql_num_rows($queryID);
        if($numRows >0) {
            while($row = mysql_fetch_assoc($queryID)){
                $result[]   =   $row;
            }
            mysql_data_seek($queryID,0);
        }
        return $result;
    }
	public function error() {
		if(is_null($this->_linkID)) {
			$this->connect($this->config,$this->_linkNum);
		}
		return (($this->_linkID) ? mysql_error($this->_linkID) : mysql_error());
	}

	public function errno() {
		if(is_null($this->_linkID)) {
			$this->connect($this->config,$this->_linkNum);
		}
		return intval(($this->_linkID) ? mysql_errno($this->_linkID) : mysql_errno());
	}
	public function fetch_array($queryID, $result_type = MYSQL_ASSOC) {
		return mysql_fetch_array($queryID, $result_type);
	}
	public function affected_rows() {
		return mysql_affected_rows($this->_linkID);
	}
	public function result($queryID, $row) {
		$query = @mysql_result($queryID, $row);
		return $query;
	}

	public function num_rows($queryID) {
		$query = mysql_num_rows($queryID);
		return $query;
	}

	public function num_fields($queryID) {
		return mysql_num_fields($queryID);
	}

	public function free_result($queryID) {
		return mysql_free_result($queryID);
	}
	public function free() {
        mysql_free_result($this->queryID);
        $this->queryID = null;
    }
	public function insert_id() {
		if(is_null($this->_linkID)) {
			$this->connect($this->config,$this->_linkNum);
		}
		return ($id = mysql_insert_id($this->_linkID)) >= 0 ? $id : $this->result($this->query("SELECT last_insert_id()"), 0);
	}

	public function fetch_row($queryID) {
		$query = mysql_fetch_row($queryID);
		return $query;
	}

	public function fetch_fields($queryID) {
		return mysql_fetch_field($queryID);
	}
	public function version() {
		if(is_null($this->_linkID)) {
			$this->connect($this->config,$this->_linkNum);
		}
		return mysql_get_server_info($this->_linkID);
	}
	public function close() {
        if ($this->_linkID){
			if(Db::$DbCount[$this->_linkNum]==1) {
				mysql_close($this->_linkID);
				Db::$DbCount[$this->_linkNum]--;
				Db::$linkIDs[$this->_linkNum] = null;
			} else {
				Db::$DbCount[$this->_linkNum]--;
			}
        }
        $this->_linkID = null;
    }
	public function __destruct() {
        // 释放查询
        if ($this->queryID){
            $this->free();
        }
        // 关闭连接
		if($this->_linkID) {
       		$this->close();
		}
    }
}
?>