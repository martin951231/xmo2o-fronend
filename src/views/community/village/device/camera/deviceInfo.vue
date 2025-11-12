<template>
    <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"  @cancel="handleCancel" :footer="null">
        <a-page-header
            v-if="protocol == 31"
            :ghost="false"
            title="大华摄像头"
            sub-title="大华云睿开放平台"
            style="padding: 10px 5px;"
        >
            <a-descriptions size="small" :column="3">
                <a-descriptions-item label="设备ID">
                    <a> {{cameraDeviceInfo.deviceId }}</a>
                </a-descriptions-item>
                <a-descriptions-item label="设备名称">
                    {{cameraDeviceInfo.name }}
                </a-descriptions-item>
                <a-descriptions-item label="设备型号">
                    {{cameraDeviceInfo.deviceModel }}
                </a-descriptions-item>
                <a-descriptions-item label="设备序列号">
                    <a>{{cameraDeviceInfo.deviceId }}</a>
                </a-descriptions-item>
                <a-descriptions-item label="设备状态">
                    {{ (cameraDeviceInfo.status ==1 ) ? '在线' : ((cameraDeviceInfo.status == 0 ) ? '离线':'升级中' )  }}
                </a-descriptions-item>
                <a-descriptions-item label="设备分类">
                    {{cameraDeviceInfo.deviceCatalog }}
                </a-descriptions-item>
                <a-descriptions-item label="设备品牌信息">
                    {{cameraDeviceInfo.brand }}
                </a-descriptions-item>
                <a-descriptions-item label="设备基线类型">
                    {{cameraDeviceInfo.baseline }}
                </a-descriptions-item>
                <a-descriptions-item label="是否有新版本可以升级">
                    {{cameraDeviceInfo.canBeUpgrade ? '可以':'不可以' }}
                </a-descriptions-item>
            </a-descriptions>
            <a-descriptions size="small" :column="3"  v-for="(item,index) in cameraDeviceInfo.channelList" :key="index">
                <a-descriptions-item label="通道号">
                    {{item.channelId}}
                </a-descriptions-item>
                <a-descriptions-item label="通道名称">
                    {{item.channelName}}
                </a-descriptions-item>
                <a-descriptions-item label="通道状态">
                    {{item.onlineStatus ? '在线':'离线'}}
                </a-descriptions-item> 
                <a-descriptions-item label="报警布撤防状态">
                    {{item.alarmStatus ? '布防':'撤防'}}
                </a-descriptions-item>
            </a-descriptions>
            <a-descriptions size="small" :column="1" >
                <a-descriptions-item label="FLV">
                    {{cameraVideo.flv}}
                </a-descriptions-item>
                <a-descriptions-item label="HDFLV">
                    {{cameraVideo.flvHD}}
                </a-descriptions-item>
            </a-descriptions>
            <a-descriptions size="small" :column="3">
                <a-descriptions-item label="设备能力集">
                    <div style="word-wrap: break-word;width: 800px;"> {{cameraDeviceInfo.ability }}</div>
                </a-descriptions-item>
            </a-descriptions>
        </a-page-header>

        <a-page-header
            v-if="protocol == 12"
            :ghost="false"
            title="海康摄像头"
            sub-title="海康云牟内部协议"
            style="padding: 10px 5px;"
        >
            <a-descriptions  :column="3">
                <a-descriptions-item label="设备ID">
                   <a>{{cameraDeviceInfo.deviceId}}</a>
                </a-descriptions-item>
                <a-descriptions-item label="设备名称">
                    {{cameraDeviceInfo.deviceName}}
                </a-descriptions-item>
                <a-descriptions-item label="设备型号">
                    {{cameraDeviceInfo.deviceModel}}
                </a-descriptions-item>
                <a-descriptions-item label="设备序列号">
                    <a>{{cameraDeviceInfo.deviceSerial}}</a>
                </a-descriptions-item>
                <a-descriptions-item label="设备状态">
                    {{cameraDeviceInfo.deviceStatus ? '在线':'离线'}}
                </a-descriptions-item>
                <a-descriptions-item label="设备路径">
                    {{cameraDeviceInfo.devicePath}}
                </a-descriptions-item>
                <a-descriptions-item label="设备IP">
                    {{cameraDeviceInfo.deviceIp}}
                </a-descriptions-item>
               
            </a-descriptions>
            <a-descriptions size="small" :column="1" >
                <a-descriptions-item label="FLV">
                    {{cameraVideo.flvAddress}}
                </a-descriptions-item>
                <a-descriptions-item label="HDFLV">
                    {{cameraVideo.hdFlvAddress}}
                </a-descriptions-item>
                <a-descriptions-item label="HLS">
                    {{cameraVideo.hls}}
                </a-descriptions-item>
                <a-descriptions-item label="HLSHD">
                    {{cameraVideo.hlsHd}}
                </a-descriptions-item>
                <a-descriptions-item label="RTMP">
                    {{cameraVideo.rtmp}}
                </a-descriptions-item>
                <a-descriptions-item label="RTMPHD">
                    {{cameraVideo.rtmpHd}}
                </a-descriptions-item>
            </a-descriptions>
        </a-page-header>


        <a-page-header
            v-if="protocol == 14"
            :ghost="false"
            title="6000C摄像头"
            sub-title="6000C社区边缘"
            style="padding: 10px 5px;"
        >
            <a-descriptions  :column="3">
                <a-descriptions-item label="设备ID">
                   <a>{{cameraDeviceInfo.deviceId}}</a>
                </a-descriptions-item>
                <a-descriptions-item label="设备名称">
                    {{cameraDeviceInfo.deviceName}}
                </a-descriptions-item>
                <a-descriptions-item label="设备型号">
                    {{cameraDeviceInfo.deviceModel}}
                </a-descriptions-item>
                <a-descriptions-item label="设备序列号">
                    <a>{{cameraDeviceInfo.deviceSerial}}</a>
                </a-descriptions-item>
                <a-descriptions-item label="设备状态">
                    {{cameraDeviceInfo.deviceStatus ? '在线':'离线'}}
                </a-descriptions-item>
                <a-descriptions-item label="设备路径">
                    {{cameraDeviceInfo.devicePath}}
                </a-descriptions-item>
                <a-descriptions-item label="设备IP">
                    {{cameraDeviceInfo.deviceIp}}
                </a-descriptions-item>
               
            </a-descriptions>
            <a-descriptions size="small" :column="1" >
                <a-descriptions-item label="FLV">
                    {{cameraVideo.flv}}
                </a-descriptions-item>
            </a-descriptions>
        </a-page-header>

        <a-page-header
            v-if="protocol == 16 || protocol == 17"
            :ghost="false"
            :title="protocolTitle"
            sub-title="Hik Device Gateway 海康网关"
            style="padding: 10px 5px;"
        >
            <a-descriptions  :column="2">
                <a-descriptions-item label="设备ID" v-if="cameraDeviceInfo.deviceID">
                   <a>{{cameraDeviceInfo.deviceID}}</a>
                </a-descriptions-item>
                <a-descriptions-item label="设备序号" v-if="cameraDeviceInfo.serialNumber">
                   <a>{{cameraDeviceInfo.serialNumber}}</a>
                </a-descriptions-item>
                <a-descriptions-item label="设备名称" v-if="cameraDeviceInfo.deviceName">
                    {{cameraDeviceInfo.deviceName}}
                </a-descriptions-item>
                <a-descriptions-item label="设备UUID" v-if="cameraDeviceInfo.cloud_device_id">
                    <a>{{cameraDeviceInfo.cloud_device_id}}</a>
                </a-descriptions-item>
                <a-descriptions-item label="设备描述" v-if="cameraDeviceInfo.deviceDescription">
                    {{cameraDeviceInfo.deviceDescription}}
                </a-descriptions-item>
                <a-descriptions-item label="设备模型" v-if="cameraDeviceInfo.model">
                    <a>{{cameraDeviceInfo.model}}</a>
                </a-descriptions-item>
                <a-descriptions-item label="设备类型" v-if="cameraDeviceInfo.deviceTypeText">
                    {{cameraDeviceInfo.deviceTypeText}}
                </a-descriptions-item>
                <a-descriptions-item label="设备类型" v-else-if="cameraDeviceInfo.deviceType">
                    {{cameraDeviceInfo.deviceType}}
                </a-descriptions-item>
                <a-descriptions-item label="物理地址" v-if="cameraDeviceInfo.macAddress">
                    {{cameraDeviceInfo.macAddress}}
                </a-descriptions-item>
                <a-descriptions-item label="软件版本" v-if="cameraDeviceInfo.softwareVersion">
                    {{cameraDeviceInfo.softwareVersion}}
                </a-descriptions-item>
                <a-descriptions-item label="固件版本" v-if="cameraDeviceInfo.firmwareVersion">
                    {{cameraDeviceInfo.firmwareVersion}}
                </a-descriptions-item>
                <a-descriptions-item label="驱动版本" v-if="cameraDeviceInfo.bootVersion">
                    {{cameraDeviceInfo.bootVersion}}
                </a-descriptions-item>
                <a-descriptions-item label="硬件版本" v-if="cameraDeviceInfo.hardwareVersion">
                    {{cameraDeviceInfo.hardwareVersion}}
                </a-descriptions-item>
                <a-descriptions-item label="编码器版本" v-if="cameraDeviceInfo.encoderVersion">
                    {{cameraDeviceInfo.encoderVersion}}
                </a-descriptions-item>
                <a-descriptions-item label="解码器版本" v-if="cameraDeviceInfo.decoderVersion">
                    {{cameraDeviceInfo.decoderVersion}}
                </a-descriptions-item>
               
            </a-descriptions>
            <div v-if="cameraVideo && cameraVideo[0]">
                <div v-for="(channel,index) in cameraVideo" :key="index">
                    <a-descriptions  :column="1" v-if="channel" :title="'通道'+(index+1)+'信息'">
                            <a-descriptions-item label="通道名称" v-if="channel.channelName">
                                {{channel.channelName}}
                            </a-descriptions-item>
                            <a-descriptions-item label="通道ID" v-if="channel.channelId">
                                {{channel.channelId}}
                            </a-descriptions-item>
                            <a-descriptions-item label="码流类型" v-if="channel.preview && channel.preview.lookUrlType">
                                {{channel.preview.lookUrlType}}
                            </a-descriptions-item>
                            <a-descriptions-item label="码流URL" v-if="channel.preview && channel.preview.look_url">
                                {{channel.preview.look_url}}
                            </a-descriptions-item>
                    </a-descriptions>
                </div>
            </div>
            <div v-if="networkInfo && networkInfo['newWorkArr']">
                <div v-for="(network,index1) in networkInfo['newWorkArr']" :key="index1">
                    <a-descriptions  :column="3" v-if="network" :title="'网络接口'+(index1+1)+'信息'">
                            <a-descriptions-item label="IP地址" v-if="network.ip_address">
                                {{network.ip_address}}
                            </a-descriptions-item>
                            <a-descriptions-item label="IP版本" v-if="network.ip_version">
                                {{network.ip_version}}
                            </a-descriptions-item>
                            <a-descriptions-item label="子网掩码" v-if="network.subnet_mask">
                                {{network.subnet_mask}}
                            </a-descriptions-item>
                            <a-descriptions-item label="默认网关地址" v-if="network.default_gateway_address">
                                {{network.default_gateway_address}}
                            </a-descriptions-item>
                            <a-descriptions-item label="DNS服务器" v-if="network.primary_dns_address">
                                {{network.primary_dns_address}}
                            </a-descriptions-item>
                            <a-descriptions-item label="备用DNS" v-if="network.secondary_dns_address">
                                {{network.secondary_dns_address}}
                            </a-descriptions-item>
                            <a-descriptions-item label="物理地址(MAC)" v-if="network.mac_address">
                                {{network.mac_address}}
                            </a-descriptions-item>
                            <a-descriptions-item label="网卡ID" v-if="network.network_id">
                                {{network.network_id}}
                            </a-descriptions-item>
                    </a-descriptions>
                </div>
            </div>
        </a-page-header>


    </a-modal>
</template>
<style lang="less" scoped>
 
</style>
<script>
import villageApi from '@/api/community/village';

 
export default {
    components: {
    },
    data() {
        return {
            title: '信息',
            labelCol: {
                xs: {
                    span: 24
                },
                sm: {
                    span: 7
                }
            },
            wrapperCol: {
                xs: {
                    span: 24
                },
                sm: {
                    span: 13
                }
            },
            camera_id       :0,
            confirmLoading  : false,
            device_type     :'',
            visible         : false,
            protocol        : 0,
            protocolTitle   :'',
            cameraDeviceInfo:{},
            cameraVideo     :{},
            networkInfo     :{}
        }
    },
    mounted() {
    },
    methods: {
        handleChange(value, thirdProtocol) {
           
        },
        handleChange1(value) {
            console.log(value);
            this.device_type = value;
        },
        detail(id,record='') {
            this.title = '查看设备在平台的信息';
            this.visible = true;
            this.camera_id = id;
            this.getCameraInfo(id,record);
        },
        /**
         * 设备信息
         */
        getCameraInfo(id,record=''){
            let postxData={ camera_id:id};
            if(record){
                if(record.channel_id){
                    postxData.channel_id=record.channel_id;
                }
                if(record.channelId){
                    postxData.channelId=record.channelId;
                }
            }
            this.request(villageApi.getCameraDeviceInfo,postxData).then((res) => {
                this.protocol           = res.protocol
                this.protocolTitle      = res.protocolTitle
                this.cameraDeviceInfo   = res.cameraDeviceInfo
                this.cameraVideo        = res.cameraVideo.liveResult
                this.networkInfo        = res.networkInfo
                
                console.log('-------->',res.cameraVideo.liveResult)
            })
        },

        handleSubmit() {
            
        },
        handleCancel() {
            this.visible = false
            this.protocol           = 0
            this.protocolTitle      = ''
            this.cameraDeviceInfo   = {}
            this.cameraVideo        = {}
        }
    },
}
</script>