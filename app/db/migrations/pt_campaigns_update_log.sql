CREATE TABLE `campaigns`.`pt_campaigns_update_log` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `campaign_id` VARCHAR(45) NOT NULL,
  `app_id` VARCHAR(255) NOT NULL,
  `old_bid` FLOAT NOT NULL,
  `new_bid` FLOAT NOT NULL,
  `ratio` FLOAT NOT NULL,
  `created_at` VARCHAR(45) NOT NULL DEFAULT 'CURRENT_TIMESTAMP',
  PRIMARY KEY (`id`));
