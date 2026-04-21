<?php

class CloudAccessControlDemo
{
    public function getDemoState(array  = [])
    {
        $response = [];
        if (!empty($requestData['Key'])) {
            $response['Key'] = (string)$requestData['Key'];
        }

        return json_encode($response, JSON_UNESCAPED_UNICODE);
    }
}
