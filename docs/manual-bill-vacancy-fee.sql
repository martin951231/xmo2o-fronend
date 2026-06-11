-- 新增账单 / 空置费 / 第三方承担 / 新押金模块
-- 金额统一按 4 位小数保存。

ALTER TABLE `pigcms_house_new_pay_order`
  ADD COLUMN `allow_deposit_deduct` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否允许押金抵扣：1允许 0不允许' AFTER `extra_data`,
  ADD COLUMN `source_type` varchar(50) NOT NULL DEFAULT '' COMMENT '账单来源：manual_new_bill/vacancy_fee' AFTER `allow_deposit_deduct`;

-- 如果当前库金额字段不是 4 位小数，可执行以下调整。
ALTER TABLE `pigcms_house_new_pay_order`
  MODIFY COLUMN `total_money` decimal(14,4) NOT NULL DEFAULT '0.0000' COMMENT '账单金额',
  MODIFY COLUMN `modify_money` decimal(14,4) NOT NULL DEFAULT '0.0000' COMMENT '修改后金额',
  MODIFY COLUMN `pay_money` decimal(14,4) NOT NULL DEFAULT '0.0000' COMMENT '实付金额',
  MODIFY COLUMN `unit_price` decimal(14,4) NOT NULL DEFAULT '0.0000' COMMENT '单价',
  MODIFY COLUMN `number` decimal(14,4) NOT NULL DEFAULT '0.0000' COMMENT '数量/面积';

CREATE TABLE IF NOT EXISTS `pigcms_house_new_vacancy_fee_config` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '物业ID',
  `village_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '小区ID',
  `is_open` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否启用空置费',
  `charge_mode` tinyint(1) NOT NULL DEFAULT '1' COMMENT '收费模式：1固定每天金额 2按面积计算',
  `fixed_day_money` decimal(14,4) NOT NULL DEFAULT '0.0000' COMMENT '固定每天金额',
  `area_unit_price` decimal(14,4) NOT NULL DEFAULT '0.0000' COMMENT '面积单价',
  `project_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '收费项目ID',
  `rule_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '收费标准ID',
  `allow_deposit_deduct` tinyint(1) NOT NULL DEFAULT '1' COMMENT '空置费是否允许押金抵扣',
  `is_del` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  `add_time` int(10) unsigned NOT NULL DEFAULT '0',
  `update_time` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_village` (`village_id`,`is_del`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='小区空置费配置';

CREATE TABLE IF NOT EXISTS `pigcms_house_new_bill_third_party_company` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '物业ID',
  `village_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '小区ID',
  `company_name` varchar(100) NOT NULL DEFAULT '' COMMENT '公司名称',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态：1启用 0禁用',
  `is_del` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  `add_time` int(10) unsigned NOT NULL DEFAULT '0',
  `update_time` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_village` (`village_id`,`is_del`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='账单第三方承担公司';

CREATE TABLE IF NOT EXISTS `pigcms_house_new_bill_third_party_split` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '物业ID',
  `village_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '小区ID',
  `order_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '主账单ID',
  `company_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '第三方公司ID',
  `company_name` varchar(100) NOT NULL DEFAULT '' COMMENT '公司名称快照',
  `total_money` decimal(14,4) NOT NULL DEFAULT '0.0000' COMMENT '原总金额',
  `third_party_money` decimal(14,4) NOT NULL DEFAULT '0.0000' COMMENT '第三方承担金额',
  `owner_pay_money` decimal(14,4) NOT NULL DEFAULT '0.0000' COMMENT '业主应付金额',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态：0待处理 1已处理',
  `remark` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `add_time` int(10) unsigned NOT NULL DEFAULT '0',
  `update_time` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_order` (`order_id`),
  KEY `idx_village` (`village_id`,`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='账单第三方承担拆分';

CREATE TABLE IF NOT EXISTS `pigcms_house_new_bill_deposit_account` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '物业ID',
  `village_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '小区ID',
  `room_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '房间ID',
  `total_money` decimal(14,4) NOT NULL DEFAULT '0.0000' COMMENT '押金总额',
  `used_money` decimal(14,4) NOT NULL DEFAULT '0.0000' COMMENT '已抵扣金额',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态：1正常 0禁用',
  `remark` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `add_time` int(10) unsigned NOT NULL DEFAULT '0',
  `update_time` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_room` (`village_id`,`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='新账单押金账户';

CREATE TABLE IF NOT EXISTS `pigcms_house_new_bill_deposit_freeze` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '物业ID',
  `village_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '小区ID',
  `room_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '房间ID',
  `order_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '账单ID',
  `freeze_money` decimal(14,4) NOT NULL DEFAULT '0.0000' COMMENT '冻结金额',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态：0冻结中 1已抵扣 2已释放',
  `remark` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `add_time` int(10) unsigned NOT NULL DEFAULT '0',
  `update_time` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_room` (`village_id`,`room_id`,`status`),
  KEY `idx_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='新账单押金冻结记录';

CREATE TABLE IF NOT EXISTS `pigcms_house_new_vacancy_fee_day` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `village_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '小区ID',
  `room_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '房间ID',
  `order_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '空置费账单ID',
  `fee_date` date NOT NULL COMMENT '空置费日期',
  `add_time` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_room_fee_date` (`village_id`,`room_id`,`fee_date`),
  KEY `idx_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='空置费每日生成记录';
