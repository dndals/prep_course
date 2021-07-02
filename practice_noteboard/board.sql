CREATE TABLE `board`(
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(30) NOT NULL,
  `description` TEXT,
  `name` VARCHAR(20) NOT NULL,
  `date` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
);
