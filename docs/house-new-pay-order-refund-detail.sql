ALTER TABLE `house_new_pay_order_refund`
    ADD COLUMN `refund_detail` TEXT NULL COMMENT '组合支付退款明细(JSON)' AFTER `refund_money`;
