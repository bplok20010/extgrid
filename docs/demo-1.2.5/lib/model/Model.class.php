<?php
/*
*NOBO
*/
class Model extends Db{
	// 当前数据库操作对象
    protected $db = null;
	// 主键名称
    protected $pk  = 'id';
	// 数据表前缀
    protected $tablePrefix  =   '';
	// 数据库名称
    protected $dbName  = '';
	// 数据表名（不包含表前缀）
    protected $tableName = '';
    // 实际数据表名（包含表前缀[數據庫.]prefix.表名）
    protected $trueTableName ='';
	// 是否自动检测数据表字段信息
    protected $autoCheckFields   =   true;
	// 字段信息
    protected $fields = array();
    // 数据信息
    protected $data =   array();
	
	public function __construct($tableName='',$tablePrefix='',$config='') {
        // 模型初始化
        $this->_initialize();
        // 获取模型名称
        if(!empty($tableName)) {
            if(strpos($tableName,'.')) { // 支持 数据库名.模型名的 定义
                list($this->dbName,$this->tableName) = explode('.',$tableName);
            }else{
                $this->tableName   =  $tableName;
            }
        }elseif(empty($this->tableName)){
            $this->tableName =   $this->getModelName();
        }
        // 设置表前缀
        if(is_null($tablePrefix)) {// 前缀为Null表示没有前缀
            $this->tablePrefix = '';
        }elseif('' != $tablePrefix) {
            $this->tablePrefix = $tablePrefix;
        }else{
            $this->tablePrefix = $this->tablePrefix?$this->tablePrefix:C('DB_PREFIX');
        }
		$this->dbconfig($config);
		// 字段检测 可以将表不存在的字段从插入数组中删除
		if(!empty($this->tableName) && $this->autoCheckFields)    $this->_checkTableInfo();
    }
	public function dbconfig($config=''){
		$this->config = $this->getConfig($config);
	}
	protected function getConfig($config){
		if(is_string($config) && !empty($config)) {
			$config = $this->parseDSN($config);
		} elseif(is_array($config) && !empty($config)) {
			$config = array(
				'hostname'	=>	isset($config['hostname']) && !empty($config['hostname']) ? $config['hostname'] : C('DB_HOST'),
				'hostport'	=>	isset($config['hostport']) && !empty($config['hostport']) ? $config['hostport'] : C('DB_PORT'),
				'username'	=>	isset($config['username']) && !empty($config['username']) ? $config['username'] : C('DB_USER'),
				'password'	=>	isset($config['password']) && !empty($config['password']) ? $config['password'] : C('DB_PWD'),
				'charset'	=>	isset($config['charset']) && !empty($config['charset']) ? $config['charset'] : C('DB_CHARSET'),
				'pconnect'	=>	isset($config['pconnect']) && !empty($config['pconnect']) ? $config['pconnect'] : C('DB_PCONNECT'),
				'database'	=>	isset($config['database']) && !empty($config['database']) ? $config['database'] : C('DB_NAME'),
			);
		} else {
			if(C('DB_DSN')!='') {
				$config = $this->parseDSN(C('DB_DSN'));
				return $this->getConfig($config);
			}
			$config = array(
				'hostname'	=>	C('DB_HOST'),
				'hostport'	=>	C('DB_PORT'),
				'username'	=>	C('DB_USER'),
				'password'	=>	C('DB_PWD'),
				'charset'	=>	C('DB_CHARSET'),
				'pconnect'	=>	C('DB_PCONNECT'),
				'database'	=>	C('DB_NAME'),
			);
		}
		return $config;
	}
	/**
     +----------------------------------------------------------
     * DSN解析
     * 格式： mysql://username:passwd@localhost:3306/DbName
     +----------------------------------------------------------
	 **/
	public function parseDSN($dsnStr) {
        if( empty($dsnStr) ){return array();}
        $info = parse_url($dsnStr);
        if($info['scheme']){
            $dsn = array(
            'dbms'        => $info['scheme'],
            'username'  => isset($info['user']) ? $info['user'] : '',
            'password'   => isset($info['pass']) ? $info['pass'] : '',
            'hostname'  => isset($info['host']) ? $info['host'] : '',
            'hostport'    => isset($info['port']) ? $info['port'] : '',
            'database'   => isset($info['path']) ? substr($info['path'],1) : ''
            );
        }else {
            preg_match('/^(.*?)\:\/\/(.*?)\:(.*?)\@(.*?)\:([0-9]{1, 6})\/(.*?)$/',trim($dsnStr),$matches);
            $dsn = array (
            'dbms'        => $matches[1],
            'username'  => $matches[2],
            'password'   => $matches[3],
            'hostname'  => $matches[4],
            'hostport'    => $matches[5],
            'database'   => $matches[6]
            );
        }
        return $dsn;
     }
	public function _initialize(){
		
	}
	public function getModelName() {
        if(empty($this->tableName))
            $this->tableName = substr(get_class($this),0,-5);
        return $this->tableName;
    }
	public function getTableName() {
        if(empty($this->trueTableName)) {
            $tableName  = !empty($this->tablePrefix) ? $this->tablePrefix : '';
            if(!empty($this->tableName)) {
                $tableName .= $this->parse_name($this->tableName);
            }
            $this->trueTableName    =   strtolower($tableName);
        }
        return (!empty($this->dbName)?$this->dbName.'.':'').$this->trueTableName;
    }
	protected function _checkTableInfo() {
        // 只在第一次执行记录
        if(empty($this->fields)) {
            // 如果数据表字段没有定义则自动获取
            if(C('DB_FIELDS_CACHE')) {
				$dbName = !empty($this->dbName) ? $this->dbName : C('DB_NAME');
                $this->fields = F('_fields/'.$dbName.'/'.$this->getTableName());
                if(!$this->fields)   $this->flush();
            }else{
                // 每次都会读取数据表信息
                $this->flush();
            }
        }
    }
	public function getFields($tableName='') {
		$tableName = empty($tableName) ? $this->getTableName() : $tableName;
		if(empty($tableName)) return array();
        $result =   $this->getAll($this->query('SHOW COLUMNS FROM '.$this->parseKey($tableName)));
        $info   =   array();
        if($result) {
            foreach ($result as $key => $val) {
                $info[$val['Field']] = array(
                    'name'    => $val['Field'],
                    'type'    => $val['Type'],
                    'notnull' => (bool) ($val['Null'] === ''), // not null is empty, null is yes
                    'default' => $val['Default'],
                    'primary' => (strtolower($val['Key']) == 'pri'),
                    'autoinc' => (strtolower($val['Extra']) == 'auto_increment'),
                );
            }
        }
        return $info;
    }
	public function flush() {
        $fields = $this->getFields($this->getTableName());
        if(!$fields) { // 无法获取字段信息
            return false;
        }
        $this->fields   =   array_keys($fields);
        $this->fields['_autoinc'] = false;
        foreach ($fields as $key=>$val){
            // 记录字段类型
            $type[$key]    =   $val['type'];
            if($val['primary']) {
                $this->fields['_pk'] = $key;
                if($val['autoinc']) $this->fields['_autoinc']   =   true;
            }
        }
        // 记录字段类型信息
        if(C('DB_FIELDTYPE_CHECK'))   $this->fields['_type'] =  $type;

        //增加缓存开关控制
        if(C('DB_FIELDS_CACHE')){
			$dbName = !empty($this->dbName) ? $this->dbName : C('DB_NAME');
			F('_fields/'.$dbName.'/'.$this->getTableName(),$this->fields);
        }
    }
	public function getPk() {
        return isset($this->fields['_pk'])?$this->fields['_pk']:$this->pk;
    }
	public function getDbFields(){
        if($this->fields) {
            $fields   =  $this->fields;
            unset($fields['_autoinc'],$fields['_pk'],$fields['_type']);
            return $fields;
        }
        return false;
    }
	public function data($data){
        if(is_object($data)){
            $data   =   get_object_vars($data);
        }elseif(is_string($data)){
            parse_str($data,$data);
        }elseif(!is_array($data)){
            $this->halt('数据无效');
        }
        $this->data = $data;
        return $this;
    }
	public function cache($key=true,$expire='',$type=''){
        $this->options['cache']  =  array('key'=>$key,'expire'=>$expire,'type'=>$type);
        return $this;
    }
	public function __set($name,$value) {
        // 设置数据对象属性
        $this->data[$name]  =   $value;
    }
	public function __get($name) {
        return isset($this->data[$name])?$this->data[$name]:null;
    }
	public function __isset($name) {
        return isset($this->data[$name]);
    }
	public function __unset($name) {
        unset($this->data[$name]);
    }
	public function create($data='',$type='') {
        // 如果没有传值默认取POST数据
        if(empty($data)) {
            $data    =   $_POST;
        }elseif(is_object($data)){
            $data   =   get_object_vars($data);
        }
        // 验证数据
        if(empty($data) || !is_array($data)) {
            $this->error = '数据不合法';
            return false;
        }

        // 验证完成生成数据对象
        if($this->autoCheckFields) { // 开启字段检测 则过滤非法字段数据
            $vo   =  array();
            foreach ($this->fields as $key=>$name){
                if(substr($key,0,1)=='_') continue;
                $val = isset($data[$name])?$data[$name]:null;
                //保证赋值有效
                if(!is_null($val)){
                    $vo[$name] = (get_magic_quotes_gpc() && is_string($val))?   stripslashes($val)  :  $val;
                }
            }
        }else{
            $vo   =  $data;
        }
        // 赋值当前数据对象
        $this->data =   $vo;
        // 返回创建的数据以供其他调用
        return $vo;
     }
	 //对保存到数据库的数据进行处理
	 protected function _facade($data) {
        // 检查非数据字段
        if(!empty($this->fields)) {
            foreach ($data as $key=>$val){
                if(!in_array($key,$this->fields,true)){
                    unset($data[$key]);
                }elseif(C('DB_FIELDTYPE_CHECK') && is_scalar($val)) {
                    // 字段类型检查
                    $this->_parseType($data,$key);
                }
            }
        }
        //$this->_before_write($data);
        return $data;
     }
	 //新增数据
	 public function add($data='',$options=array(),$replace=false) {
        if(empty($data)) {
            // 没有传递数据，获取当前数据对象的值
            if(!empty($this->data)) {
                $data    =   $this->data;
                // 重置数据
                $this->data = array();
            }else{
                $this->error = '没有需要新增的数据';
                return false;
            }
        }
		
        // 数据处理
        $data = $this->_facade($data);
		if(empty($data)) {
			$this->error = '没有需要新增的数据';
            return false;
		}
        // 写入数据到数据库
		$sql = $this->buildInsertSql($data,$options,$replace);
		$qr = $this->query($sql);
        return $qr === true ? $this->insert_id() : $qr;
    }
	//新增多条数据
	 public function addAll($dataList,$options=array(),$replace=false){
        if(empty($dataList)) {
            $this->error = '没有需要新增的数据';
            return false;
        }
        // 数据处理
        foreach ($dataList as $key=>$data){
            $dataList[$key] = $this->_facade($data);
			if(empty($dataList[$key])) {
				unset($dataList[$key]);
			}
        }
		if(empty($dataList)) {
			$this->error = '没有需要新增的数据';
            return false;
		}
        // 写入数据到数据库
		$sql = $this->buildInsertAllSql($dataList,$options,$replace);
		if($sql === false) {
			$this->error = '没有需要新增的数据';
			return false;
		}
		$qr = $this->query($sql);
        return $qr === true ? $this->insert_id() : $qr;
    }
	//保存数据
	public function save($data='',$options=array()) {
        if(empty($data)) {
            // 没有传递数据，获取当前数据对象的值
            if(!empty($this->data)) {
                $data    =   $this->data;
                // 重置数据
                $this->data = array();
            }else{
                $this->error = '数据不合法';
                return false;
            }
        }
		$options = $this->_parseOptions($options);
        // 数据处理
        $data = $this->_facade($data);
		if(empty($data)) {
			$this->error = '数据空,不需要保存';
            return false;
		}
        
        if(!isset($options['where']) ) {
            // 如果存在主键数据 则自动作为更新条件
            if(isset($data[$this->getPk()])) {
                $pk   =  $this->getPk();
                $where[$pk]   =  $data[$pk];
                $options['where']  =  $where;
                $pkValue = $data[$pk];
                unset($data[$pk]);
            }else{
                // 如果没有任何更新条件则不执行
                $this->error = '更新出现问题,没有提供更新条件';
                return false;
            }
        }
        $sql = $this->buildUpdateSql($data,$options);
		$qr = $this->query($sql);
        return $qr === true ? $this->affected_rows() : $qr;
    }
	//删除数据
	public function delete($options=array()) {
        if(empty($options) && empty($this->options['where'])) {
            // 如果删除条件为空 则删除当前数据对象所对应的记录
            if(!empty($this->data) && isset($this->data[$this->getPk()]))
                return $this->delete($this->data[$this->getPk()]);
            else
                return false;
        }
        if(is_numeric($options)  || is_string($options)) {
            // 根据主键删除记录
            $pk   =  $this->getPk();
            if(strpos($options,',')) {
                $where[$pk]   =  array('IN', $options);
            }else{
                $where[$pk]   =  $options;
                $pkValue = $options;
            }
            $options =  array();
            $options['where'] =  $where;
        }
        $sql = $this->buildDeleteSql($options);
		$qr = $this->query($sql);
        return $qr === true ? $this->affected_rows() : $qr;
    }
	//查询数据
	public function select($options=array()) {
        if(is_string($options) || is_numeric($options)) {
            // 根据主键查询
            $pk   =  $this->getPk();
            if(strpos($options,',')) {
                $where[$pk] =  array('IN',$options);
            }else{
                $where[$pk]   =  $options;
            }
            $options =  array();
            $options['where'] =  $where;
        }elseif(false === $options){ // 用于子查询 不查询只返回SQL
            $options =  array();
            return  '( '.$this->buildSelectSql($options).' )';
        }
		//$options =  $this->_parseOptions($options);
		$_options = $this->options;
        // 分析表达式
        $sql = $this->buildSelectSql($options);
		//是否缓存->读取
		
		$cache  =  isset($_options['cache'])?$_options['cache']:false;
        if($cache) { // 查询缓存检测
            $key =  is_string($cache['key'])?$cache['key']:md5($sql);
            $value   =  S($key,'','',$cache['type']);
            if(false !== $value) {
                return $value;
            }
        }
		$query = $this->query($sql);
		if(false === $query) {
            return false;
        }
		
		$result = $this->getAll($query);
		//缓存写入
		if($cache && false !== $query ) { // 查询缓存写入
            S($key,$result,$cache['expire'],$cache['type']);
        }
		return $result;
    }
	//以下操作都需要上面的 select save add delete 支持
	//只查詢一條數據
	public function find($options=array()) {
        if(is_numeric($options) || is_string($options)) {
            $where[$this->getPk()] =$options;
            $options = array();
            $options['where'] = $where;
        }
        // 总是查找一条记录
        $options['limit'] = 1;
		//$options =  $this->_parseOptions($options);
        $resultSet = $this->select($options);
        if(false === $resultSet) {
            return false;
        }
        if(empty($resultSet)) {// 查询结果为空
            return null;
        }
        $this->data = $resultSet[0];
        return $this->data;
    }
	//更新某字段的值
	public function setField($field,$value='') {
        if(is_array($field)) {
            $data = $field;
        }else{
            $data[$field]   =  $value;
        }
        return $this->save($data);
    }
	//設置增長值
	public function setInc($field,$step=1) {
        return $this->setField($field,array('exp',$field.'+'.$step));
    }
	public function setDec($field,$step=1) {
        return $this->setField($field,array('exp',$field.'-'.$step));
    }
	public function getField($field,$sepa=null) {
        //$options['field']    =  $field;
        if(strpos($field,',')) { // 多字段
            $resultSet = $this->field($field)->select();
            if(!empty($resultSet)) {
                $_field = explode(',', $field);
                $field  = array_keys($resultSet[0]);
                $move   =  $_field[0]==$_field[1]?false:true;
                $key =  array_shift($field);
                $key2 = array_shift($field);
                $cols   =   array();
                $count  =   count($_field);
                foreach ($resultSet as $result){
                    $name   =  $result[$key];
                    if($move) { // 删除键值记录
                        unset($result[$key]);
                    }
                    if(2==$count) {
                        $cols[$name]   =  $result[$key2];
                    }else{
                        $cols[$name]   =  is_null($sepa)?$result:implode($sepa,$result);
                    }
                }
                return $cols;
            }
        }else{   // 查找一条记录
            $options['limit'] = 1;
            $result = $this->field($field)->select();
            if(!empty($result)) {
                return reset($result[0]);
            }
        }
        return null;
    }
	public function getError(){
        return $this->error;
    }
}
?>