-- 房间物业服务时间、交房时间字段
ALTER TABLE `pigcms_house_village_user_vacancy`
  ADD COLUMN `property_service_start_time` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '物业服务开始时间' AFTER `contract_time_end`,
  ADD COLUMN `property_service_end_time` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '物业服务结束时间' AFTER `property_service_start_time`,
  ADD COLUMN `delivery_time` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '交房时间' AFTER `property_service_end_time`;

-- 审批申请原因
ALTER TABLE `pigcms_community_approval_instance`
  ADD COLUMN `apply_reason` varchar(500) NOT NULL DEFAULT '' COMMENT '申请原因' AFTER `apply_remark`;

-- 审批业务类型配置
CREATE TABLE IF NOT EXISTS `pigcms_community_approval_business_type` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '物业ID',
  `village_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '小区ID',
  `type_key` varchar(80) NOT NULL DEFAULT '' COMMENT '业务类型标识',
  `type_name` varchar(100) NOT NULL DEFAULT '' COMMENT '业务类型名称',
  `status` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '状态 1启用 0停用',
  `is_system` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否系统内置',
  `is_del` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否删除',
  `add_time` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '添加时间',
  `update_time` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_village_type_key` (`property_id`,`village_id`,`type_key`,`is_del`),
  KEY `idx_village_status` (`property_id`,`village_id`,`status`,`is_del`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='社区审批业务类型配置';

-- 审批流、审批实例绑定业务类型ID，保留原 business_type 标识兼容旧逻辑和业务生效判断
ALTER TABLE `pigcms_community_approval_flow`
  ADD COLUMN `business_type_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '业务类型ID' AFTER `business_type`,
  ADD KEY `idx_business_type_id` (`business_type_id`);

ALTER TABLE `pigcms_community_approval_instance`
  ADD COLUMN `business_type_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '业务类型ID' AFTER `business_type`,
  ADD KEY `idx_business_type_id` (`business_type_id`);

-- 下面三类是当前系统内置业务类型；如果已有审批流，先按现有物业/小区维度初始化配置。
INSERT IGNORE INTO `pigcms_community_approval_business_type`
  (`property_id`,`village_id`,`type_key`,`type_name`,`status`,`is_system`,`is_del`,`add_time`,`update_time`)
SELECT `property_id`,`village_id`,'service_time_change','调整物业服务时间',1,1,0,UNIX_TIMESTAMP(),UNIX_TIMESTAMP()
FROM `pigcms_community_approval_flow`
GROUP BY `property_id`,`village_id`;

INSERT IGNORE INTO `pigcms_community_approval_business_type`
  (`property_id`,`village_id`,`type_key`,`type_name`,`status`,`is_system`,`is_del`,`add_time`,`update_time`)
SELECT `property_id`,`village_id`,'delivery_time_change','调整交房时间',1,1,0,UNIX_TIMESTAMP(),UNIX_TIMESTAMP()
FROM `pigcms_community_approval_flow`
GROUP BY `property_id`,`village_id`;

INSERT IGNORE INTO `pigcms_community_approval_business_type`
  (`property_id`,`village_id`,`type_key`,`type_name`,`status`,`is_system`,`is_del`,`add_time`,`update_time`)
SELECT `property_id`,`village_id`,'bill_amount_change','修改账单金额',1,1,0,UNIX_TIMESTAMP(),UNIX_TIMESTAMP()
FROM `pigcms_community_approval_flow`
GROUP BY `property_id`,`village_id`;

-- 回填历史审批流和审批实例的业务类型ID。
UPDATE `pigcms_community_approval_flow` f
INNER JOIN `pigcms_community_approval_business_type` t
  ON t.`property_id` = f.`property_id`
  AND t.`village_id` = f.`village_id`
  AND t.`type_key` = f.`business_type`
  AND t.`is_del` = 0
SET f.`business_type_id` = t.`id`
WHERE f.`business_type_id` = 0;

UPDATE `pigcms_community_approval_instance` i
INNER JOIN `pigcms_community_approval_business_type` t
  ON t.`property_id` = i.`property_id`
  AND t.`village_id` = i.`village_id`
  AND t.`type_key` = i.`business_type`
  AND t.`is_del` = 0
SET i.`business_type_id` = t.`id`
WHERE i.`business_type_id` = 0;
