ALTER TABLE `pigcms_house_village_pay_config`
    ADD COLUMN `allinpay_private_key` text NULL COMMENT '通联支付私钥' AFTER `allinpay_mchid`;
