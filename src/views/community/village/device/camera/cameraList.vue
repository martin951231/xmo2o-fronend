<template>
    <div class="message-suggestions-box-1">
        <div>
            <a-collapse>
                <a-collapse-panel key="1" header="注意事项">
                    <p>目前已知情况如下</p>
                    <p>1、海康梯控自从22年四月底所有的经销型号都无法配置到云牟，如果想当做视频监控来查看必须要通过硬盘录像机的方式单独实现，此处不支持</p>
                    <p>2、海康高空抛物，此处也不支持作为监控视频查看的。</p>
                    <p>3、在添加海康或大华设备时，请先检查该设备是否已在海康或大华平台中存在（若已存在，请先删除对应设备）。完成这一操作后，您可以在智慧社区平台中添加设备信息，并同步到海康和大华系统。</p>
                </a-collapse-panel>
            </a-collapse>
        </div>
        <div class="add-box">
            <a-row>
                <a-col :md="24" :sm="24">
                    <a-button type="primary" @click="cameraAdd">
                        添加视频监控设备
                    </a-button>
                    <a-divider type="vertical" />
                    <a-button type="primary" @click="$refs.vmonitorType.listpage()">
                        设备类型管理
                    </a-button>
                    <a-divider type="vertical" v-if="hikCloudInfo && hikCloudInfo.community_id" />
                    <a-button type="primary" icon="cloud-download" @click="getDeviceByCommunityId()"
                        v-if="hikCloudInfo && hikCloudInfo.community_id">
                        获取6000C社区边缘设备
                    </a-button>
                </a-col>
            </a-row>
        </div>

        <div class="search-box">
            <div class="form_item">
                <div class="left_label">设备类型：</div>
                <div class="right_value">
                    <a-select style="width: 150px" placeholder="请选择设备类型" v-model="search.device_type">
                        <a-select-option :value="0">全部</a-select-option>
                        <a-select-option :value="item.id" v-for="(item,index) in type_list" :key="index">
                            {{item.title}}
                        </a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="form_item">
                <div class="left_label">设备协议：</div>
                <div class="right_value">
                    <a-select style="width: 150px" placeholder="请选择设备协议" v-model="search.device_protocol">
                        <a-select-option :value="0">全部</a-select-option>
                        <a-select-option :value="item.name" v-for="(item,index) in protocolList" :key="index">
                            {{item.label}}
                        </a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="form_item">
                <div class="left_label">设备编号：</div>
                <div class="right_value">
                    <a-input style="width: 150px" placeholder="请输入设备编号" v-model="search.camera_sn" />
                </div>
            </div>
            <div class="form_item">
                <div class="left_label">设备名称：</div>
                <div class="right_value">
                    <a-input style="width: 150px" placeholder="请输入设备名称" v-model="search.camera_name" />
                </div>
            </div>
            <div class="form_item">
                <div class="left_label">设备状态：</div>
                <div class="right_value">
                    <a-select default-value="0" style="width: 117px" placeholder="请选择项目" v-model="search.is_online">
                        <a-select-option value="0">全部</a-select-option>
                        <a-select-option value="1">在线</a-select-option>
                        <a-select-option value="2">离线</a-select-option>
                    </a-select>
                </div>
            </div>

            <div class="form_item">
                <div class="left_label">业主查看：</div>
                <div class="right_value">
                    <a-select default-value="0" style="width: 117px" placeholder="请选择项目"
                        v-model="search.is_support_look">
                        <a-select-option value="0">全部</a-select-option>
                        <a-select-option value="1">可以查看</a-select-option>
                        <a-select-option value="2">不可查看</a-select-option>
                    </a-select>
                </div>
            </div>

            <div class="form_item">
                <div class="right_value">
                    <a-button type="primary" icon="search" @click="searchList()">
                        查询
                    </a-button>
                    <a-divider type="vertical" />
                    <a-button @click="resetList()">重置</a-button>
                </div>
            </div>

        </div>

        <a-table :rowKey="record=>record.camera_id" :columns="columns" :data-source="data"
            class="components-table-demo-nested" :pagination="pagination" @change='table_change' :loading="loading">
            <span slot="action" slot-scope="text, record">
                <a @click="cameraEdit(record.camera_id, record)">修改设备</a>
                <a-divider type="vertical" />
                <!-- <a  v-if="record.videoPreviewUrl" class="link" :href="record.videoPreviewUrl" target="_blank">预览</a> -->
                <a-button type="link" @click="reviewVideo(record)">预览</a-button>
                <!-- 应该根据设备对接的协议接口来确定是否可以查看 -->
                <a-divider type="vertical" />
                <a v-if="(record.thirdProtocol > 0) "
                    @click="$refs.getDeviceInfo.detail(record.camera_id,record)">设备信息</a>
                <!-- <a-divider type="vertical"/>
                <a  @click="$refs.PrintModel.add(record.camera_sn)">回放</a> -->
                <!-- <a-divider type="vertical"/>
                <a  @click="$refs.PrintModel.add(record.camera_sn)">报警</a> -->
                <a-divider type="vertical" v-if="record.is_del" />
                <a-popconfirm style="margin-left: 10px; color: red;" class="ant-dropdown-link" title="确认删除?" ok-text="是"
                    cancel-text="否" @confirm="del_camera(record.camera_id)" v-if="record.is_del">
                    <a>删除</a>
                </a-popconfirm>
                <a-divider type="vertical" v-if="record.isAlarmEvent" />
                <a-button v-if="record.isAlarmEvent" type="link" @click="showAlertEvent(record)">报警事件</a-button>
            </span>

        </a-table>
        <add-camera :visible="cameraVisible" :cameraId="cameraId" :channelId="channelId" @close="closeCamera" />

        <vmonitor-type ref="vmonitorType" @ok="getTypeList" />

        <device-info ref="getDeviceInfo" />

        <video-preview :visible="showVideoPreview" :gatewayinfo="gatewayinfo"
            :gatewayPluginDownload="gatewayPluginDownload" :videoUrl="videoUrl" :videoType="videoType"
            :videoTitle="videoTitle" @closeVideo="closeVideo" />

        <alertEventModal :camera_id="camera_id" :channelId="channelId" :visible="showAlertModal" @close="closeAlert" />
    </div>

</template>
<script>
    import villageApi from '@/api/community/village'
    const columns = [{
            title: '设备编号',
            dataIndex: 'camera_sn',
            key: 'camera_sn'
        },
        {
            title: '设备名称',
            dataIndex: 'camera_name',
            key: 'camera_name'
        },
        {
            title: '通道号',
            dataIndex: 'channelNo',
            key: 'channelNo'
        },
        {
            title: '设备品牌',
            dataIndex: 'brand_name',
            key: 'brand_name'
        },
        {
            title: '设备类型',
            dataIndex: 'device_type',
            key: 'device_type'
        },
        {
            title: '业主查看',
            dataIndex: 'is_support_look_txt',
            key: 'is_support_look_txt'
        },
        {
            title: '支持设备协议',
            dataIndex: 'thirdProtocol_txt',
            key: 'thirdProtocol_txt'
        },
        {
            title: '排序',
            dataIndex: 'sort',
            key: 'sort'
        },
        {
            title: '操作',
            key: 'action',
            width: '440px',
            dataIndex: '',
            scopedSlots: {
                customRender: 'action'
            }
        },
    ];
    const data = [];
    import addCamera from './addCamera';
    import vmonitorType from './vmonitorType';
    import deviceInfo from "@/views/community/village/device/camera/deviceInfo";
    import videoPreview from "../components/videoPreview.vue";
    import alertEventModal from "../components/alertEventModal.vue";
    export default {
        name: 'cameraList',
        filters: {

        },
        components: {
            addCamera,
            vmonitorType,
            deviceInfo,
            videoPreview,
            alertEventModal
        },
        data() {
            return {
                cameraVisible: false,
                pagination: {
                    pageSize: 10,
                    total: 10,
                    current: 1
                },
                search: {
                    camera_sn: '',
                    camera_name: '',
                    page: 1,
                    device_type: undefined,
                    device_protocol: undefined
                },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
                page: 1,
                type_list: [],
                camera_id: 0,
                channelId: 0,
                showDeviceBtn: ['12', '31'],
                showVideoPreview: false,
                videoType: 'flv',
                videoUrl: '',
                videoTitle: '',
                hikCloudInfo: {},
                showAlertModal: false,
                protocolList: [],
                cameraId: null,
                gatewayinfo: {},
                gatewayPluginDownload: ''
            };
        },
        mounted() {
            this.getList();
            this.getType();
            this.getProtocols()
        },
        methods: {
            getDeviceByCommunityId() {
                this.request(villageApi.getDeviceByCommunityId)
                    .then((res) => {
                        console.log('getDeviceByCommunityId', res)
                        this.$message.success('已经下发执行获取，请在稍后刷新列表确认');
                    })
            },

            getProtocols() {
                this.request('/community/village_api.CameraDevice/getCameraThirdProtocols').then((res) => {
                    this.protocolList = res.list
                })
            },

            reviewVideo(record) {
                let param = {}
                param['camera_id'] = record.camera_id
                param['channelId'] = record.channelId
                param['channel_id'] = record.channel_id ? record.channel_id:0;
                let that = this;
                this.request(villageApi.getCameraLiveAddress, param)
                    .then((res) => {
                        if(res && res.look_url){
                            that.videoUrl = res.look_url
                            that.videoType = res.lookUrlType
                            that.videoTitle = '设备名称：' + res.camera_name + '，设备品牌：' + res.brand_name
                            that.gatewayinfo = res.gatewayinfo
                            that.gatewayPluginDownload = res.gatewayPluginDownload
                            that.showVideoPreview = true
                        }else {
                            that.videoUrl = record.look_url
                            that.videoType = record.lookUrlType
                            that.gatewayinfo = record.gatewayinfo
                            that.gatewayPluginDownload = record.gatewayPluginDownload
                            that.videoTitle = '设备名称：' + record.camera_name + '，设备品牌：' + record.brand_name
                            that.showVideoPreview = true
                        }
                    }).catch((error) => {
                        that.videoUrl = record.look_url
                        that.videoType = record.lookUrlType
                        that.gatewayinfo = record.gatewayinfo
                        that.gatewayPluginDownload = record.gatewayPluginDownload
                        that.videoTitle = '设备名称：' + record.camera_name + '，设备品牌：' + record.brand_name
                        that.showVideoPreview = true

                    })

            },
            videoV2CamerasPreviewURLs(camera_id) {
                // this.request(villageApi.videoV2CamerasPreviewURLs,{
                //     camera_id:camera_id
                // }).then((res)=>{
                //     console.log('videoV2CamerasPreviewURLs',res);
                // });
            },
            // 获取列表信息
            getList() {
                this.loading = true;
                this.search['page'] = this.page;
                this.request(villageApi.getCameraList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        this.hikCloudInfo = res.hikCloudInfo
                        this.loading = false
                    })
            },
            //删除视频监控
            del_camera(camera_id) {
                this.request(villageApi.delCamera, {
                    camera_id: camera_id
                }).then((res) => {
                    this.$message.success('删除成功');
                    this.getList();
                });
            },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                if (e.current && e.current > 0) {
                    this.pagination.current = e.current;
                    this.page = e.current;
                    this.getList();
                }
            },
            // 进行搜索
            searchList() {
                console.log('search', this.search);
                this.page = 1;
                let val = {
                    current: 1,
                    pageSize: 10,
                    total: 10
                }
                console.log('searchList');
                this.table_change(val);
            },
            //获取视频类型
            getType() {
                this.request(villageApi.getCameraDeviceType).then((res) => {
                    this.type_list = res
                }).catch((error) => {})
            },
            // 进行重置
            resetList() {
                this.getType();
                this.search = {
                    camera_sn: '',
                    camera_name: '',
                    is_online: undefined,
                    is_support_look: undefined,
                    device_type: undefined,
                    device_protocol: undefined,
                    page: 1
                };
                this.table_change({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });
            },
            //刷新视频类型数据
            getTypeList() {
                this.getType();
            },

            closeVideo() {
                this.showVideoPreview = false
            },

            showAlertEvent(record) {
                this.showAlertModal = true
                this.camera_id = record.camera_id
                this.channelId = record.channelId
            },

            closeAlert() {
                this.camera_id = 0
                this.showAlertModal = false
            },

            cameraAdd() {
                this.cameraId = null
                this.channelId = null
                this.cameraVisible = true
            },

            cameraEdit(id, record) {
                this.cameraId = id
                this.channelId = record.channelId
                this.cameraVisible = true
            },

            closeCamera(flag) {
                this.cameraId = null
                this.cameraVisible = false
                if (flag) {
                    this.getList();
                }
            }
        }
    };
</script>
<style lang="less" scoped>
    .message-suggestions-box-1 {
        margin-top: 10px;
        background-color: white;
    }

    .message-suggestions-box-1 .search-box {
        padding: 0 20px 0;
        margin: 10px 0;
        display: flex;

        .form_item {
            display: flex;
            align-items: center;
            margin-left: 7px;

            &:nth-child(1) {
                margin-left: 0;
            }

            .left_label {
                color: #666666;
            }

            .right_value {}
        }
    }

    .message-suggestions-box-1 .add-box {
        padding: 10px 10px 10px;
    }

    .lbsf {
        float: right;
        margin-right: 24px;
    }

    .padding-tp10 {
        padding-top: 15px;
        padding-bottom: 20px;
    }

    /deep/ .but-box {
        width: 365px !important;
        padding-left: 0 !important;
    }
</style>
