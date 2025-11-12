<template>
    <a-drawer :title="modalTitle" :width="1300" :visible="visible" @close="onClose" :bodyStyle="{padding: '0 25px'}">
        <!-- <div class="top_con">
            <a-button icon="plus" type="primary" @click="addAlert">添加</a-button>
        </div> -->
        <a-table :rowKey="record=>record.id" class="table_con" 
        @change="tableChange" :loading="tableLoading" :pagination="pageInfo"
        :columns="columns" :data-source="alertList" bordered>
            <template slot="action" slot-scope="text, record">
                <a-button @click="addAlert(record)" type="link">详情</a-button>
            </template>
            
            <template slot="channelId" slot-scope="text, record">
                <div style="width: 170px; text-align: center;">
                    {{record.channel_id?record.channel_id:'--'}}
                </div>
            </template>
            
            <template slot="pictureUrl" slot-scope="text, record">
                <viewer v-if="record.picture_url" :images="[record.picture_url]">
                    <img :src="record.picture_url" style="width: 50px; height: 50px; border-radius: 5px;" />
                </viewer>
            </template>
        </a-table>
        <!-- <div :style="{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            zIndex: 1,
        }">
            <a-button style="margin-right: 8px;" @click="onClose">取消</a-button>
            <a-button type="primary" @click="onClose">确定</a-button>
        </div> -->
        
        <alertAddModal :id="event_id" :visible="alertVisible" @close="closeAdd" />
    </a-drawer>
</template>

<script>
    import Vue from 'vue';
    import alertAddModal from './alertAddModal.vue';
    import 'viewerjs/dist/viewer.css';
    import Viewer from 'v-viewer';
    Vue.use(Viewer)
    const tableWidth = 200
    const columns = [
        {
            title: '事件时间',
            dataIndex: 'date_time',
            key: 'date_time',
            width: tableWidth + 40
        },
        // {
        //     title: '设备ID',
        //     dataIndex: 'device_id',
        //     key: 'device_id',
        //     width: tableWidth + 80
        // },
        // {
        //     title: '设备名称',
        //     key: 'device_name',
        //     dataIndex: 'device_name',
        //     width: tableWidth - 60
        // },
        // {
        //     title: '触发报警的设备通道号',
        //     key: 'channel_id',
        //     dataIndex: 'channel_id',
        //     width: tableWidth,
        //     scopedSlots: {
        //         customRender: 'channelId'
        //     }
        // },
        // {
        //     title: '触发报警的设备通道名称',
        //     key: 'channel_name',
        //     dataIndex: 'channel_name',
        //     width: tableWidth
        // },
        // {
        //     title: '设备型号',
        //     key: 'device_model',
        //     dataIndex: 'device_model',
        //     width: tableWidth
        // },
        // {
        //     title: '设备类型',
        //     key: 'device_type',
        //     dataIndex: 'device_type',
        //     width: tableWidth - 60
        // },
        {
            title: '事件类型',
            key: 'event_type',
            dataIndex: 'event_type',
            width: tableWidth - 80
        },
        {
            title: '事件描述',
            key: 'event_description',
            dataIndex: 'event_description',
            width: tableWidth - 40
        },
        {
            title: '图片URL',
            key: 'picture_url',
            dataIndex: 'picture_url',
            width: tableWidth - 100,
            scopedSlots: {
                customRender: 'pictureUrl'
            }
        },
        {
            title: '备注',
            key: 'event_remark',
            dataIndex: 'event_remark',
            width: tableWidth
        },
        {
            title: '操作',
            key: 'action',
            width: tableWidth - 100,
            scopedSlots: {
                customRender: 'action'
            }
        },
    ];

    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            camera_id: {
                type: [String, Number],
                default: 0
            },
            channelId: {
                type: [String, Number],
                default: 0
            }
        },
        
        watch: {
            visible: {
                handler(val){
                    if(val && this.camera_id){
                        this.pageInfo.camera_id = this.camera_id
                        this.pageInfo.channelId = this.channelId
                        this.getAlertList()
                    }
                },
                immediate: true
            }
        },
        
        components: {
           alertAddModal
        },
        
        data() {
            return {
                event_id: 0,
                modalTitle: '监控事件报警',
                tableLoading: false,
                columns,
                alertList: [],
                alertVisible: false,
                pageInfo: {
                    current: 1,
                    pageSize: 10,
                    total: 0,
                    page: 1
                },
                cameraInfo: {}
            }
        },

        methods: {
            onClose() {
                this.$emit('close')
            },
            addAlert(record){
                this.alertVisible = true
                this.event_id = record.id
            },
            closeAdd(){
                this.alertVisible = false
                this.event_id = 0
            },
            
            getAlertList(){
                this.tableLoading = true
                this.request('/community/village_api.CameraDevice/getDeviceAlarmEventList', this.pageInfo).then(res => {
                    this.alertList = res.alarm_list
                    this.cameraInfo = res.cameraInfo
                    this.pageInfo.total = res.count
                    this.tableLoading = false
                    if(res.cameraInfo.camera_sn && res.cameraInfo.camera_name){
                        this.modalTitle = '设备编号：'+res.cameraInfo.camera_sn + '\xa0\xa0\xa0\xa0\xa0\xa0' + '设备名称：'+res.cameraInfo.camera_name
                    }
                }).catch(err=>{
                    this.tableLoading = false
                })
            },
            
            tableChange(pagination, filters, sorter){
                console.log(pagination, filters, sorter)
                this.pageInfo.page = pagination.current
                this.pageInfo.current = pagination.current
                this.pageInfo.pageSize = pagination.pageSize
                this.getAlertList()
            }
        }
    }
</script>

<style lang='less' scoped>
    
    .top_con{
        width: 100%;
        display: flex;
        align-items: cneter;
        justify-content: flex-end;
    }
    
    .table_con{
        margin-top: 10px;
    }
    
    /deep/ .ant-table-tbody tr:nth-child(2n){
        background-color: #fafafa;
    }
    
    /deep/ .ant-table-row-cell-break-word{
        padding: 8px 16px;
    }
</style>
