<?php
require __DIR__.'/ChargeStatusService.php';
$s=new \app\community\model\service\ChargeStatusService();
$b=['order_id'=>1,'project_id'=>93,'rule_id'=>0,'room_id'=>1,'position_id'=>0,'is_paid'=>1,'is_discard'=>1,'total_money'=>100,'modify_money'=>100,'pay_money'=>90,'refund_money'=>10,'service_start_time'=>strtotime('2026-11-01'),'service_end_time'=>strtotime('2027-10-31'),'charge_type'=>'property','house_type'=>1];
$u=$b; $u['order_id']=2; $u['is_paid']=2; $u['modify_money']=40; $u['pay_money']=0; $u['refund_money']=0;
$r=$s->calculate([],[$b,$u,$u],'2026-01-01','2026-12-31');
if($r[0]['amound']!=140 || $r[0]['paid_amound']!=80 || $r[0]['remaining_paid_amound_num']!=40) throw new Exception('unpaid aggregation failed');
$r=$s->calculate([],[$b],'2026-01-01','2026-12-31');
if($r[0]['remaining_paid_amound_num']!=0) throw new Exception('paid balance counted as debt');
echo "unpaid tests PASS\n";
