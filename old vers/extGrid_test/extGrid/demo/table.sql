CREATE TABLE `extgrid` (
  `username` varchar(255) DEFAULT '',
  `age` int(11) DEFAULT NULL,
  `sex` varchar(3) DEFAULT NULL,
  `qq` int(11) DEFAULT NULL,
  `email` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `address` text,
  `info` text,
  `birthday` date DEFAULT NULL,
  `itime` date DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

