-- 押金分类关键字：用于映射审批业务类型 type_key，判断是否存在对应押金解冻审批流
ALTER TABLE `pigcms_house_new_deposit_category`
  ADD COLUMN `cate_key` varchar(80) NOT NULL DEFAULT '' COMMENT '分类关键字，对应审批业务类型标识' AFTER `cate_name`,
  ADD KEY `idx_village_cate_key` (`village_id`,`cate_key`,`is_del`);
