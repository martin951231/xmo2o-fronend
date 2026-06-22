-- 已执行旧版 manual-bill-vacancy-fee.sql 时，再执行本升级脚本。

ALTER TABLE `house_new_bill_third_party_split`
  ADD COLUMN `child_order_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '第三方子账单ID' AFTER `order_id`,
  ADD COLUMN `service_start_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '承担开始时间' AFTER `company_name`,
  ADD COLUMN `service_end_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '承担结束时间' AFTER `service_start_time`,
  ADD KEY `idx_child_order` (`child_order_id`);
