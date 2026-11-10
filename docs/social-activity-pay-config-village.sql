-- 社群活动支付配置改为按小区保存
ALTER TABLE `pigcms_social_activity`
    ADD COLUMN `host_village_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '活动主办社区ID' AFTER `category_id`,
    ADD KEY `idx_host_village_id` (`host_village_id`);

UPDATE `pigcms_social_activity` AS `activity`
INNER JOIN (
    SELECT `activity_id`, MIN(`id`) AS `first_session_id`
    FROM `pigcms_social_activity_session`
    GROUP BY `activity_id`
) AS `first_session`
    ON `first_session`.`activity_id` = `activity`.`id`
INNER JOIN `pigcms_social_activity_session` AS `session`
    ON `session`.`id` = `first_session`.`first_session_id`
SET `activity`.`host_village_id` = CAST(SUBSTRING_INDEX(`session`.`village_id`, ',', 1) AS UNSIGNED)
WHERE `activity`.`host_village_id` = 0
  AND `session`.`village_id` <> '';

ALTER TABLE `pigcms_social_activity_pay_config`
    ADD COLUMN `village_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '小区ID' AFTER `id`;

-- 将原有的全局配置复制给当前所有启用小区
SET @source_config_id := (
    SELECT MIN(`id`)
    FROM `pigcms_social_activity_pay_config`
    WHERE `village_id` = 0
);

INSERT INTO `pigcms_social_activity_pay_config`
    (`village_id`, `status`, `app_id`, `merchant_no`, `private_key`, `create_time`, `update_time`)
SELECT
    `v`.`village_id`,
    `config`.`status`,
    `config`.`app_id`,
    `config`.`merchant_no`,
    `config`.`private_key`,
    `config`.`create_time`,
    NOW()
FROM `pigcms_house_village` AS `v`
INNER JOIN `pigcms_social_activity_pay_config` AS `config`
    ON `config`.`id` = @source_config_id
LEFT JOIN `pigcms_social_activity_pay_config` AS `existing`
    ON `existing`.`village_id` = `v`.`village_id`
WHERE `v`.`status` = 1
  AND `existing`.`id` IS NULL;

-- 删除旧的全局配置，并限制每个小区只能有一条配置
DELETE FROM `pigcms_social_activity_pay_config`
WHERE `village_id` = 0;

ALTER TABLE `pigcms_social_activity_pay_config`
    ADD UNIQUE KEY `uniq_village_id` (`village_id`);
