const fs = require('fs')
const file = 'D:/phpstudy_pro/WWW/xmo2o/v20/app/community/model/service/HouseNewManualBillService.php'
const original = fs.readFileSync(file, 'utf8')
let source = original
function replaceOnce(before, after) {
  // Match either existing line ending style without rewriting unrelated lines.
  const pattern = new RegExp(before.split('\n').map(line => line.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\r?\n'), 'g')
  const matches = Array.from(source.matchAll(pattern))
  if (matches.length !== 1) throw new Error('Expected one match, got ' + matches.length + ': ' + before.slice(0, 100))
  const newline = matches[0][0].includes('\r\n') ? '\r\n' : '\n'
  source = source.replace(pattern, () => after.replace(/\n/g, newline))
}
replaceOnce(`    public function createManualBill($adminUser, $params)
    {
        $villageId = $this->getVillageId($adminUser);`, `    public function createManualBill($adminUser, $params)
    {
        if (intval($params['position_id'] ?? 0) > 0 || ($params['bill_kind'] ?? '') === 'parking_management') {
            if (intval($params['room_id'] ?? 0) > 0) {
                throw new \\Exception('车位账单请仅传入车位ID');
            }
            return $this->createManualPositionBill($adminUser, $params);
        }
        $villageId = $this->getVillageId($adminUser);`)
replaceOnce(`        $this->assertTargetRuleType($ruleInfo, $positionId > 0);
        $result = $this->formatManualRuleInfo($targetInfo, $ruleInfo);`, `        $this->assertTargetRuleType($ruleInfo, $positionId > 0);
        if ($positionId > 0) {
            $this->assertPositionRuleBound($villageId, $positionId, $projectId, $ruleInfo);
        }
        $result = $this->formatManualRuleInfo($targetInfo, $ruleInfo);`)
replaceOnce(`        $this->assertTargetRuleType($ruleInfo, $positionId > 0);
        $unitPrice = $this->money4($ruleInfo['charge_price'] ?? 0);`, `        $this->assertTargetRuleType($ruleInfo, $positionId > 0);
        if ($positionId > 0) {
            $this->assertPositionRuleBound($villageId, $positionId, intval($params['project_id'] ?? 0), $ruleInfo);
        }
        $unitPrice = $this->money4($ruleInfo['charge_price'] ?? 0);`)
replaceOnce(`        $segments = $mergeBill === 1
            ? [['start_date' => $calc['service_start_time'], 'end_date' => $calc['service_end_time'], 'money' => $calc['total_money']]]`, `        if ($calc['total_money'] < 0) {
            throw new \\Exception('业主应付金额不能小于0');
        }
        $segments = $mergeBill === 1
            ? [['start_date' => $calc['service_start_time'], 'end_date' => $calc['service_end_time'], 'money' => $calc['total_money']]]`)
replaceOnce(`        try {
            $this->assertNoOverlappingPositionBill(`, `        try {
            // Serialize manual creation for the same position, including when no bill exists yet.
            $lockedPosition = Db::name('house_village_parking_position')->where([
                ['village_id', '=', $villageId],
                ['position_id', '=', $positionId],
            ])->lock(true)->find();
            if (!$lockedPosition) {
                throw new \\Exception('车位不存在');
            }
            $this->assertPositionRuleBound($villageId, $positionId, $projectId, $ruleInfo);
            $this->assertNoOverlappingPositionBill(`)
replaceOnce(`            ->field('r.*,p.name as order_name,p.id as charge_project_id,n.charge_type')`, `            ->field('r.*,p.name as order_name,p.id as charge_project_id,p.status as project_status,n.charge_type')`)
replaceOnce(`    private function formatManualRuleInfo($roomInfo, $ruleInfo)`, `    private function assertPositionRuleBound($villageId, $positionId, $projectId, $ruleInfo)
    {
        if (intval($ruleInfo['status'] ?? 0) !== 1 || intval($ruleInfo['project_status'] ?? 0) === 4) {
            throw new \\Exception('收费项目或收费标准已停用');
        }
        $boundTargetMap = $this->getBatchBoundTargetIdMap(
            $villageId,
            $projectId,
            intval($ruleInfo['id'] ?? 0),
            'position',
            [$positionId]
        );
        if (empty($boundTargetMap[$positionId])) {
            throw new \\Exception('当前车位未绑定所选收费标准，请先通过添加收费项绑定');
        }
    }

    private function formatManualRuleInfo($roomInfo, $ruleInfo)`)
if (fs.readFileSync(file, 'utf8') !== original) throw new Error('Backend changed during patch preparation')
fs.writeFileSync(file, source, 'utf8')
console.log('Updated ' + file)
