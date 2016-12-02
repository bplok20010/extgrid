<?php
$_SC = array(
	/* 数据库设置 */
    'DB_TYPE'               => 'mysql',     // 数据库类型
	'DB_HOST'               => 'localhost', // 服务器地址
	'DB_NAME'               => 'test',          // 数据库名
	'DB_USER'               => 'root',      // 用户名
	'DB_PWD'                => '',          // 密码
	'DB_PORT'               => '',        // 端口
	'DB_PREFIX'             => '',    // 数据库表前缀
    'DB_FIELDTYPE_CHECK'    => false,       // 是否进行字段类型检查
    'DB_FIELDS_CACHE'       => true,        // 启用字段缓存
    'DB_CHARSET'            => 'utf8',      // 数据库编码默认采用utf8
	'DB_PCONNECT'			=> 0,
    //'DB_DEPLOY_TYPE'        => 0, // 数据库部署方式:0 集中式(单一服务器),1 分布式(主从服务器)
    //'DB_RW_SEPARATE'        => false,       // 数据库读写是否分离 主从式有效
    //'DB_MASTER_NUM'         => 1, // 读写分离后 主服务器数量
    'DB_SQL_BUILD_CACHE'    => true, // SELECT SQL创建缓存 开启后可以减少parseSql的调用 建议开启
    //'DB_SQL_BUILD_QUEUE'    => 'file',   // SQL缓存队列的缓存方式 支持 file xcache和apc
    //'DB_SQL_BUILD_LENGTH'   => 20, // SQL缓存的队列长度
	'DB_DSN'				=> '',//'DB_DSN' => 'mysql://username:password@localhost:3306/DbName'
	/*文件緩存路徑*/
	'DATA_CACHE_PATH'		=> 'data/',//缓存文件目录
	'DATA_CACHE_TIME'		=> 0,//0为永久
	'DATA_CACHE_CHECK'		=> false,//是否开启数据校验 会有开销
	'DATA_CACHE_COMPRESS'	=> false,//是否开启数据压缩
	'DATA_CACHE_SUBDIR'		=> true,//使用子目录
	'DATA_PATH_LEVEL'		=> 2,//目录层次
);
?>