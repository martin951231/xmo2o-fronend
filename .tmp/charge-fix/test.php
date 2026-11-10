<?php
require __DIR__.'/ChargeStatusService.php';
$s = new \app\community\model\service\ChargeStatusService();
$b = ['order_id'=>1,'project_id'=>93,'rule_id'=>0,'room_id'=>1,'position_id'=>0,'is_paid'=>1,'is_discard'=>1,'total_money'=>1200,'modify_money'=>1200,'pay_money'=>1200,'refund_money'=>0,'service_start_time'=>strtotime('2026-11-01'),'service_end_time'=>strtotime('2027-10-31'),'charge_type'=>'property','house_type'=>1];
$r=$s->calculate([],[$b,$b],'2026-01-01','2026-12-31');
if ($r[0]['amound']!=1200 || $r[0]['paid_amound']!=1200 || $r[0]['account_num']!=1) {throw new Exception('cross year/dedup failed');}
$r=$s->calculate([],[$b],'2026-11-01','2027-10-31');
if ($r[0]['amound']!=1200) {throw new Exception('full period failed');}
$b['charge_type']='deposit_bill';
$r=$s->calculate([],[$b],'2026-11-01','2027-10-31');
if ($r[0]['amound']!=0) {throw new Exception('category failed');}
echo "PASS: missing binding, cross-year, full-period, dedup, excluded category\n";

