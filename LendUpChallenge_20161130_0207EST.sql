#
# SQL Export
# Created by Querious (998)
# Created: November 30, 2016 at 2:07:55 AM EST
# Encoding: Unicode (UTF-8)
#


CREATE DATABASE IF NOT EXISTS `LendUpChallenge` DEFAULT CHARACTER SET latin1 DEFAULT COLLATE latin1_swedish_ci;




DROP TABLE IF EXISTS `FizzBuzzInformation`;


CREATE TABLE `FizzBuzzInformation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `delay` int(11) DEFAULT '0',
  `number` int(11) DEFAULT '0',
  `timeMade` bigint(20) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;




SET @PREVIOUS_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS = 0;


LOCK TABLES `FizzBuzzInformation` WRITE;
ALTER TABLE `FizzBuzzInformation` DISABLE KEYS;
INSERT INTO `FizzBuzzInformation` (`id`, `delay`, `number`, `timeMade`) VALUES 
	(1,1,5,1480489195479),
	(2,0,9,1480489240626),
	(3,0,5,1480489325398),
	(4,1,7,1480489632925);
ALTER TABLE `FizzBuzzInformation` ENABLE KEYS;
UNLOCK TABLES;




SET FOREIGN_KEY_CHECKS = @PREVIOUS_FOREIGN_KEY_CHECKS;


