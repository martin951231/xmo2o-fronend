ALTER TABLE `pigcms_house_village_pay_config`
    ADD COLUMN `allinpay_appid` varchar(100) NOT NULL DEFAULT '' COMMENT '通联支付AppID' AFTER `scrcu_mer_no_2`,
    ADD COLUMN `allinpay_mchid` varchar(100) NOT NULL DEFAULT '' COMMENT '通联支付商户号' AFTER `allinpay_appid`,
    ADD COLUMN `allinpay_status` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '通联支付状态：0关闭，1开启' AFTER `allinpay_mchid`;
