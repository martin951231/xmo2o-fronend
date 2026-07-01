<?php

$db = [
    'host' => 'localhost',
    'user' => 'root',
    'pass' => 'admin123',
    'name' => 'xmo2o',
    'prefix' => 'pigcms_',
];

$outDir = __DIR__ . '/../outputs/village_attachment_stats';
if (!is_dir($outDir)) {
    mkdir($outDir, 0777, true);
}

$mysqli = new mysqli($db['host'], $db['user'], $db['pass'], $db['name']);
if ($mysqli->connect_error) {
    fwrite(STDERR, 'DB connect failed: ' . $mysqli->connect_error . PHP_EOL);
    exit(1);
}
$mysqli->set_charset('utf8');

function fetchAll($mysqli, $sql)
{
    $res = $mysqli->query($sql);
    if (!$res) {
        throw new RuntimeException($mysqli->error . "\nSQL: " . $sql);
    }
    $rows = [];
    while ($row = $res->fetch_assoc()) {
        $rows[] = $row;
    }
    $res->free();
    return $rows;
}

function normalizeListCount($value)
{
    if (empty($value)) {
        return 0;
    }
    if (is_array($value)) {
        $count = 0;
        foreach ($value as $item) {
            if (is_array($item)) {
                if (!empty(array_filter($item, function ($v) {
                    return trim((string)$v) !== '';
                }))) {
                    $count++;
                }
            } elseif (trim((string)$item) !== '') {
                $count++;
            }
        }
        return $count;
    }
    $text = trim((string)$value);
    if ($text === '') {
        return 0;
    }
    $json = json_decode($text, true);
    if (json_last_error() === JSON_ERROR_NONE && is_array($json)) {
        return normalizeListCount($json);
    }
    return 1;
}

function attachmentFileCount(array $fieldValue)
{
    $fileListCount = isset($fieldValue['file_list']) ? normalizeListCount($fieldValue['file_list']) : 0;
    $filesCount = isset($fieldValue['files']) ? normalizeListCount($fieldValue['files']) : 0;
    return max($fileListCount, $filesCount);
}

function csvCell($value)
{
    $value = (string)$value;
    $value = str_replace('"', '""', $value);
    return '"' . $value . '"';
}

$prefix = $db['prefix'];

$villages = fetchAll($mysqli, "SELECT village_id, village_name, property_id FROM {$prefix}house_village ORDER BY property_id ASC, village_id ASC");
$fields = fetchAll($mysqli, "SELECT property_id, `key`, title, type, sort FROM {$prefix}house_village_data_config WHERE village_id=0 AND is_display=1 AND is_close=0 AND type IN (5,6) ORDER BY property_id ASC, sort DESC, `key` ASC");

$fieldsByProperty = [];
foreach ($fields as $field) {
    $propertyId = intval($field['property_id']);
    $key = trim((string)$field['key']);
    if ($propertyId <= 0 || $key === '') {
        continue;
    }
    if (!isset($fieldsByProperty[$propertyId])) {
        $fieldsByProperty[$propertyId] = [];
    }
    $fieldsByProperty[$propertyId][] = [
        'key' => $key,
        'title' => (string)$field['title'],
        'type' => intval($field['type']),
    ];
}

$rows = [];
$totalFileCount = 0;
$totalBindCount = 0;
foreach ($villages as $village) {
    $villageId = intval($village['village_id']);
    $propertyId = intval($village['property_id']);
    if (empty($fieldsByProperty[$propertyId])) {
        continue;
    }

    $bindRows = fetchAll(
        $mysqli,
        "SELECT pigcms_id, authentication_field
         FROM {$prefix}house_village_user_bind
         WHERE village_id={$villageId}
           AND vacancy_id>0
           AND status=1
           AND type IN (0,3)
           AND (uid>0 OR phone<>'' OR name<>'')"
    );

    $stats = [];
    foreach ($fieldsByProperty[$propertyId] as $field) {
        $stats[$field['key']] = [
            'uploaded_bind_count' => 0,
            'uploaded_file_count' => 0,
        ];
    }

    foreach ($bindRows as $bind) {
        if (empty($bind['authentication_field'])) {
            continue;
        }
        $auth = @unserialize($bind['authentication_field']);
        if (!is_array($auth)) {
            continue;
        }
        foreach ($fieldsByProperty[$propertyId] as $field) {
            $key = $field['key'];
            if (!isset($auth[$key]) || !is_array($auth[$key])) {
                continue;
            }
            $fileCount = attachmentFileCount($auth[$key]);
            if ($fileCount > 0) {
                $stats[$key]['uploaded_bind_count']++;
                $stats[$key]['uploaded_file_count'] += $fileCount;
            }
        }
    }

    foreach ($fieldsByProperty[$propertyId] as $field) {
        $stat = $stats[$field['key']];
        $totalBindCount += $stat['uploaded_bind_count'];
        $totalFileCount += $stat['uploaded_file_count'];
        $rows[] = [
            'property_id' => $propertyId,
            'village_id' => $villageId,
            'village_name' => $village['village_name'],
            'attachment_title' => $field['title'],
            'attachment_key' => $field['key'],
            'attachment_type' => $field['type'],
            'eligible_owner_bind_count' => count($bindRows),
            'uploaded_bind_count' => $stat['uploaded_bind_count'],
            'uploaded_file_count' => $stat['uploaded_file_count'],
        ];
    }
}

$csvPath = $outDir . '/village_attachment_stats.csv';
$jsonPath = $outDir . '/village_attachment_stats.json';
$summaryPath = $outDir . '/summary.json';

$headers = [
    '物业ID',
    '小区ID',
    '小区名称',
    '附件名称',
    '附件key',
    '附件类型',
    '可统计业主绑定数',
    '上传绑定数',
    '上传文件数',
];

$fp = fopen($csvPath, 'wb');
fwrite($fp, "\xEF\xBB\xBF");
fwrite($fp, implode(',', array_map('csvCell', $headers)) . "\r\n");
foreach ($rows as $row) {
    fwrite($fp, implode(',', array_map('csvCell', [
        $row['property_id'],
        $row['village_id'],
        $row['village_name'],
        $row['attachment_title'],
        $row['attachment_key'],
        $row['attachment_type'],
        $row['eligible_owner_bind_count'],
        $row['uploaded_bind_count'],
        $row['uploaded_file_count'],
    ])) . "\r\n");
}
fclose($fp);

file_put_contents($jsonPath, json_encode($rows, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
file_put_contents($summaryPath, json_encode([
    'generated_at' => date('Y-m-d H:i:s'),
    'row_count' => count($rows),
    'village_count' => count(array_unique(array_column($rows, 'village_id'))),
    'attachment_config_count' => count($fields),
    'total_uploaded_bind_count' => $totalBindCount,
    'total_uploaded_file_count' => $totalFileCount,
    'csv' => $csvPath,
    'json' => $jsonPath,
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

echo file_get_contents($summaryPath);
