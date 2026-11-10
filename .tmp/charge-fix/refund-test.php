<?php
require __DIR__.'/ChargeStatusService.php';
$s=new \app\community\model\service\ChargeStatusService();
$b=['order_id'=>1,'project_id'=>93,'rule_id'=>0,'room_id'=>1,'position_id'=>0,'is_paid'=>1,'is_discard'=>1,'total_money'=>139.6,'modify_money'=>139.6,'pay_money'=>139.6,'refund_money'=>139.6,'service_start_time'=>strtotime('2026-11-01'),'service_end_time'=>strtotime('2026-11-30'),'charge_type'=>'property','house_type'=>1];
$r=$s->calculate([],[$b],'2026-01-01','2026-12-31');
if($r[0]['amound']!=0 || $r[0]['account_num']!=0) throw new Exception('full refund failed');
$b['refund_money']=10;
$r=$s->calculate([],[$b],'2026-01-01','2026-12-31');
if($r[0]['amound']!=139.6 || $r[0]['paid_amound']!=129.6) throw new Exception('partial refund failed');
echo "refund tests PASS";
