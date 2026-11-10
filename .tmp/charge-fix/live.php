<?php
require 'D:/phpstudy_pro/WWW/xmo2o/v20/vendor/autoload.php';
$app=new \think\App('D:/phpstudy_pro/WWW/xmo2o/v20/');
$app->initialize();
echo json_encode((new \app\community\model\service\ChargeStatusService())->getData(17,'2026-01-01','2026-12-31'),JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
