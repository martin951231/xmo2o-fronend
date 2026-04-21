<?php

class CloudAccessControlDemoService
{
    public function queueCommand($command, $serial = '', $door = '01')
    {
        return [
            'command' => (string)$command,
            'serial' => (string)$serial,
            'door' => str_pad((string)$door, 2, '0', STR_PAD_LEFT),
        ];
    }
}
