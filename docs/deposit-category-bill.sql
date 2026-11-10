-- 押金分类管理
CREATE TABLE IF NOT EXISTS `house_new_deposit_category` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '物业ID',
  `village_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '小区ID',
  `cate_name` varchar(50) NOT NULL DEFAULT '' COMMENT '分类名',
  `cate_key` varchar(80) NOT NULL DEFAULT '' COMMENT '分类关键字，对应审批业务类型标识',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态 1启用 0禁用',
  `is_del` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除 0否 1是',
  `add_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '新增时间',
  `update_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '修改时间',
  PRIMARY KEY (`id`),
  KEY `idx_village_cate_key` (`village_id`,`cate_key`,`is_del`),
  KEY `idx_village_status` (`village_id`,`status`,`is_del`),
  KEY `idx_property` (`property_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='押金分类表';

-- 押金账单明细：主账单仍写入 house_new_pay_order，退款/收款沿用原账单流程
CREATE TABLE IF NOT EXISTS `house_new_bill_deposit_order` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '物业ID',
  `village_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '小区ID',
  `room_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '房间ID',
  `order_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'house_new_pay_order.order_id',
  `category_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '押金分类ID',
  `category_name` varchar(50) NOT NULL DEFAULT '' COMMENT '押金分类名快照',
  `deposit_money` decimal(14,4) NOT NULL DEFAULT '0.0000' COMMENT '押金金额',
  `refunded_money` decimal(14,4) NOT NULL DEFAULT '0.0000' COMMENT '已退押金金额',
  `account_status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '押金账户状态 0未入账 1已入账 2已退完',
  `remark` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `add_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '新增时间',
  `update_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '修改时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_order` (`order_id`),
  KEY `idx_room` (`village_id`,`room_id`),
  KEY `idx_category` (`village_id`,`category_id`),
  KEY `idx_status` (`village_id`,`account_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='押金账单明细表';
