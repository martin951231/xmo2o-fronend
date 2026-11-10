<?php
// Isolated service regression checks: this facade never connects to a database.
namespace think\facade {
    class Db {
        public static $tables = [];
        public static $events = [];
        public static $onStart;
        private static $snapshot;
        public static function name($name) { return new Query($name); }
        public static function startTrans() {
            self::$snapshot = self::$tables;
            self::$events[] = 'begin';
            if (self::$onStart) { call_user_func(self::$onStart); }
        }
        public static function commit() { self::$events[] = 'commit'; }
        public static function rollback() { self::$tables = self::$snapshot; self::$events[] = 'rollback'; }
    }
    class Collection {
        private $rows;
        public function __construct($rows) { $this->rows = $rows; }
        public function toArray() { return $this->rows; }
    }
    class Query {
        private $table;
        private $conditions = [];
        private $locked = false;
        public function __construct($table) { $this->table = $table; }
        public function alias($alias) { return $this; }
        public function leftJoin($table, $on) { return $this; } // Fixtures are prejoined.
        public function field($fields) { return $this; }
        public function order($order) { return $this; }
        public function lock($lock) { $this->locked = $lock; return $this; }
        public function where($field, $operator = null, $value = null) {
            if (is_array($field)) { $this->conditions = array_merge($this->conditions, $field); }
            else { $this->conditions[] = func_num_args() === 2 ? [$field, '=', $operator] : [$field, $operator, $value]; }
            return $this;
        }
        private function valueOf($row, $field) {
            if (array_key_exists($field, $row)) { return $row[$field]; }
            $parts = explode('.', $field);
            return $row[end($parts)] ?? null;
        }
        private function rows() {
            $matches = [];
            foreach (Db::$tables[$this->table] ?? [] as $row) {
                foreach ($this->conditions as $condition) {
                    list($field, $operator, $expected) = $condition;
                    $actual = $this->valueOf($row, $field);
                    switch ($operator) {
                        case '=': $ok = $actual == $expected; break;
                        case '<>': $ok = $actual != $expected; break;
                        case '>': $ok = $actual > $expected; break;
                        case '>=': $ok = $actual >= $expected; break;
                        case '<=': $ok = $actual <= $expected; break;
                        case 'in': $ok = in_array($actual, $expected); break;
                        default: throw new \RuntimeException('Unsupported operator: ' . $operator);
                    }
                    if (!$ok) { continue 2; }
                }
                $matches[] = $row;
            }
            return $matches;
        }
        public function find() {
            if ($this->locked) { Db::$events[] = 'lock:' . $this->table; }
            return $this->rows()[0] ?? null;
        }
        public function select() { return new Collection($this->rows()); }
        public function column($field) { return array_map(function ($row) use ($field) { return $this->valueOf($row, $field); }, $this->rows()); }
        public function max($field) { $values = $this->column($field); return $values ? max($values) : null; }
        public function insertGetId($row) {
            $row['order_id'] = count(Db::$tables[$this->table] ?? []) + 1;
            Db::$tables[$this->table][] = $row;
            Db::$events[] = 'insert';
            return $row['order_id'];
        }
    }
}
namespace {
    use think\facade\Db;
    use app\community\model\service\HouseNewManualBillService;
    date_default_timezone_set('Asia/Shanghai');
    require $argv[1];
    $service = new HouseNewManualBillService();
    $admin = ['village_id' => 1, 'property_id' => 9];
    $params = ['position_id' => 42, 'room_id' => 0, 'bill_kind' => 'parking_management',
        'project_id' => 11, 'rule_id' => 22, 'service_start_time' => '2026-08-01',
        'service_end_time' => '2026-08-31', 'generate_mode' => 'day'];
    function resetFixture() {
        Db::$events = [];
        Db::$onStart = null;
        Db::$tables = [
            'house_village_parking_position' => [['village_id' => 1, 'position_id' => 42, 'position_area' => 12, 'position_num' => 'A42']],
            'house_new_charge_rule' => [[
                'id' => 22, 'p.id' => 11, 'p.village_id' => 1, 'project_status' => 1,
                'charge_project_id' => 11, 'status' => 1, 'bill_create_set' => 2,
                'charge_price' => 310, 'charge_type' => 'parking_management', 'fees_type' => 1, 'charge_name' => '车位管理费',
            ]],
            'house_new_charge_project' => [['id' => 11, 'village_id' => 1, 'status' => 1, 'name' => '车位管理费', 'charge_type' => 'parking_management']],
            'house_new_charge_standard_bind' => [['village_id' => 1, 'position_id' => 42, 'project_id' => 11, 'rule_id' => 22, 'is_del' => 1, 'bind_type' => 2]],
            'house_new_pay_order' => [],
        ];
    }
    function check($condition, $message = 'assertion failed') { if (!$condition) { throw new \RuntimeException($message); } }
    function throwsText($fn, $text) {
        try { $fn(); } catch (\Exception $e) {
            check($text === '' || strpos($e->getMessage(), $text) !== false, 'Unexpected error: ' . $e->getMessage());
            return;
        }
        throw new \RuntimeException('Expected rejection containing: ' . $text);
    }
    $passed = 0;
    function testCase($name, $fn) {
        global $passed;
        resetFixture();
        $fn();
        $passed++;
        echo 'PASS ' . $name . PHP_EOL;
    }
    $create = function ($overrides = []) use ($service, $admin, $params) { return $service->createManualBill($admin, array_merge($params, $overrides)); };

    testCase('single creation routes to parking with inclusive day timestamps and position lock', function () use ($create) {
        $res = $create(['allow_deposit_deduct' => 0, 'remark' => 'test']);
        $bill = Db::$tables['house_new_pay_order'][0];
        check($res['order_count'] === 1 && $bill['position_id'] === 42 && $bill['room_id'] === 0);
        check($bill['order_type'] === 'parking_management' && $bill['source_type'] === 'manual_parking_management_bill');
        check($bill['total_money'] == 310 && $bill['allow_deposit_deduct'] === 0);
        check(date('Y-m-d H:i:s', $bill['service_start_time']) === '2026-08-01 00:00:00');
        check(date('Y-m-d H:i:s', $bill['service_end_time']) === '2026-08-31 23:59:59');
        check(Db::$events === ['begin', 'lock:house_village_parking_position', 'lock:house_new_pay_order', 'insert', 'commit']);
    });
    testCase('natural-month split and daily price rounding', function () use ($create) {
        $res = $create(['service_start_time' => '2026-08-30', 'service_end_time' => '2026-09-02', 'merge_bill' => 0]);
        check($res['order_count'] === 2);
        $bills = Db::$tables['house_new_pay_order'];
        check($bills[0]['total_money'] == 20 && $bills[1]['total_money'] == 20.7);
        check(date('Y-m-d', $bills[0]['service_end_time']) === '2026-08-31');
        check(date('Y-m-d', $bills[1]['service_start_time']) === '2026-09-01');
    });
    testCase('area billing uses server position area and ignores client price', function () use ($service, $admin, $params) {
        Db::$tables['house_new_charge_rule'][0]['fees_type'] = 2;
        Db::$tables['house_new_charge_rule'][0]['charge_price'] = 31;
        $calc = $service->calcCreateBillMoney($admin, array_merge($params, ['area' => 999, 'unit_price' => 1]));
        check($calc['total_money'] == 372 && $calc['billing_number'] == 12);
    });
    testCase('empty end date is one day', function () use ($service, $admin, $params) {
        $calc = $service->calcCreateBillMoney($admin, array_merge($params, ['service_end_time' => '']));
        check($calc['days'] === 1 && $calc['total_money'] == 10);
    });
    foreach (['getManualBillRuleInfo', 'calcCreateBillMoney', 'createManualBill'] as $method) {
        testCase($method . ' rejects unbound standard', function () use ($service, $admin, $params, $method) {
            Db::$tables['house_new_charge_standard_bind'] = [];
            throwsText(function () use ($service, $admin, $params, $method) { $service->$method($admin, $params); }, '未绑定');
            check(count(Db::$tables['house_new_pay_order']) === 0);
        });
    }
    foreach (['village_id' => 2, 'position_id' => 43, 'project_id' => 12, 'rule_id' => 23, 'bind_type' => 1, 'is_del' => 0] as $key => $value) {
        testCase('binding must match ' . $key, function () use ($create, $key, $value) {
            Db::$tables['house_new_charge_standard_bind'][0][$key] = $value;
            throwsText($create, '未绑定');
        });
    }
    testCase('binding is rechecked inside creation transaction', function () use ($create) {
        Db::$onStart = function () { Db::$tables['house_new_charge_standard_bind'] = []; };
        throwsText($create, '未绑定');
        check(in_array('rollback', Db::$events) && !in_array('insert', Db::$events));
    });
    foreach ([1, 2] as $paid) {
        testCase('overlap rejects active paid status ' . $paid . ' even with another standard', function () use ($create, $paid) {
            $create();
            Db::$tables['house_new_pay_order'][0]['is_paid'] = $paid;
            Db::$tables['house_new_pay_order'][0]['rule_id'] = 99;
            throwsText($create, '不能重复创建');
            check(count(Db::$tables['house_new_pay_order']) === 1);
        });
    }
    testCase('touching last day is overlap while next day is allowed', function () use ($create) {
        $create();
        throwsText(function () use ($create) { $create(['service_start_time' => '2026-08-31', 'service_end_time' => '2026-09-02']); }, '不能重复创建');
        $create(['service_start_time' => '2026-09-01', 'service_end_time' => '2026-09-02']);
        check(count(Db::$tables['house_new_pay_order']) === 2);
    });
    foreach (['is_discard' => 2, 'is_refund' => 2, 'position_id' => 99, 'project_id' => 99] as $key => $value) {
        testCase('unrelated or inactive bill does not block: ' . $key, function () use ($create, $key, $value) {
            $create();
            Db::$tables['house_new_pay_order'][0][$key] = $value;
            $create();
            check(count(Db::$tables['house_new_pay_order']) === 2);
        });
    }
    foreach (['charge_type' => 'property', 'bill_create_set' => 1, 'status' => 0, 'project_status' => 4, 'p.village_id' => 2, 'charge_price' => -310] as $key => $value) {
        testCase('rejects invalid rule ' . $key, function () use ($create, $key, $value) {
            Db::$tables['house_new_charge_rule'][0][$key] = $value;
            throwsText($create, '');
            check(count(Db::$tables['house_new_pay_order']) === 0);
        });
    }
    testCase('rejects cross-village position', function () use ($create) {
        Db::$tables['house_village_parking_position'][0]['village_id'] = 2;
        throwsText($create, '车位不存在');
    });
    testCase('rejects ambiguous room and position IDs', function () use ($create) {
        throwsText(function () use ($create) { $create(['room_id' => 7]); }, '仅传入车位ID');
    });
    testCase('rejects missing position, reversed dates and non-daily mode', function () use ($create) {
        throwsText(function () use ($create) { $create(['position_id' => 0]); }, '请选择车位');
        throwsText(function () use ($create) { $create(['service_start_time' => '2026-09-01']); }, '开始时间不能晚于结束时间');
        throwsText(function () use ($create) { $create(['generate_mode' => 'month']); }, '仅支持按天');
    });
    testCase('rule detail returns effective ranges for all standards in the project', function () use ($create, $service, $admin, $params) {
        $create();
        Db::$tables['house_new_pay_order'][0]['rule_id'] = 99;
        $detail = $service->getManualBillRuleInfo($admin, $params);
        check(count($detail['bill_date_ranges']) === 1 && $detail['bill_date_ranges'][0]['rule_id'] === 99);
    });
    testCase('metadata filters project type and village', function () use ($service, $admin, $params) {
        Db::$tables['house_new_charge_project'][] = ['id' => 12, 'village_id' => 1, 'status' => 1, 'charge_type' => 'property'];
        Db::$tables['house_new_charge_project'][] = ['id' => 13, 'village_id' => 2, 'status' => 1, 'charge_type' => 'parking_management'];
        $meta = $service->getCreateBillMeta($admin, $params);
        check(count($meta['project_list']) === 1 && $meta['project_list'][0]['id'] === 11);
        check($meta['target_info']['position_id'] === 42);
    });
    testCase('monthly rule list filters type, period and village', function () use ($service, $admin, $params) {
        $base = Db::$tables['house_new_charge_rule'][0];
        foreach (['charge_type' => 'property', 'bill_create_set' => 1, 'p.village_id' => 2] as $key => $value) {
            Db::$tables['house_new_charge_rule'][] = array_merge($base, [$key => $value, 'id' => 99]);
        }
        $list = $service->getMonthlyRuleList($admin, array_merge($params, ['charge_project_id' => 11]));
        check(count($list) === 1 && $list[0]['id'] === 22);
    });
    testCase('existing batch parking creation still works', function () use ($service, $admin) {
        $result = $service->createBatchManualBill($admin, ['bill_kind' => 'parking_management', 'target_ids' => [42],
            'project_id' => 11, 'rule_id' => 22, 'period' => 2, 'generate_mode' => 'day']);
        check(count(Db::$tables['house_new_pay_order']) === 1);
        $bill = Db::$tables['house_new_pay_order'][0];
        check(date('Y-m-d', $bill['service_start_time']) === date('Y-m-d'));
    });
    echo 'Passed ' . $passed . ' isolated backend cases; no live database used.' . PHP_EOL;
}
