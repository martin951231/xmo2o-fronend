<template>
    <a-modal title="报警记录" :width="1250" :visible="visible" @cancel="handleCancel" :footer="null">
        <a-table :rowKey="record=>record.id" :loading="tableLoading" :pagination="pageInfo" :columns="columns" :data-source="tableList" @change="handleTableChange">
            <template slot="pictureUrl" slot-scope="text, record">
                <viewer v-if="record.picture_url" :images="[record.picture_url]">
                    <img :src="record.picture_url" style="width: 50px; height: 50px; border-radius: 5px;" />
                </viewer>
                <span v-else>暂无</span>
            </template>
        </a-table>
    </a-modal>
</template>

<script>
    import Vue from 'vue';
    import 'viewerjs/dist/viewer.css';
    import Viewer from 'v-viewer';
    Vue.use(Viewer)
    const columns = [{
            title: '设备名称',
            dataIndex: 'device_name',
            key: 'device_name',
        },
        {
            title: '设备通道名称',
            key: 'channel_name',
            dataIndex: 'channel_name',
        },
        {
            title: '设备类型',
            key: 'device_model',
            dataIndex: 'device_model',
        },
        {
            title: '事件ID',
            key: 'event_id',
            dataIndex: 'event_id',
            width:250,
        },
        {
            title: '事件时间',
            key: 'date_time',
            dataIndex: 'date_time',
        },
        {
            title: '图片URL',
            key: 'picture_url',
            dataIndex: 'picture_url',
            scopedSlots: {
                customRender: 'pictureUrl'
            }
        },
        {
            title: '事件描述',
            key: 'event_description',
            dataIndex: 'event_description'
        },
        {
            title: '事件备注',
            key: 'event_remark',
            dataIndex: 'event_remark'
        }
    ];
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            device_id: {
                type: [String, Number],
                default: ''
            }
        },
        
        watch: {
            visible: {
                handler(val){
                    if(val && this.device_id){
                        this.tableList = []
                        this.pageInfo.current = 1
                        this.pageInfo.page = 1
                        this.pageInfo.total = 0
                        this.getTableList()
                    }
                },
                immediate: true
            }
        },
        data() {
            return {
                tableLoading: false,
                tableList: [],
                pageInfo: {
                    page: 1,
                    current: 1,
                    pageSize: 10,
                    total: 0
                },
                columns,
                
            }
        },
        
        methods: {
            handleCancel(){
                this.$emit('close')
            },
            getTableList(){
                this.tableLoading = true
                let params = {}
                Object.assign(params, this.pageInfo)
                params.device_id = this.device_id
                this.request('/community/village_api.AlarmDevice/getDeviceAlarmEventList', params).then((res) => {
                    this.tableLoading = false
                    this.tableList = res.alarm_list
                    this.pageInfo.total = res.count
                }).catch(err=>{
                    this.tableLoading = false
                    this.$emit('close')
                })
            },
            handleTableChange(pagination, filters, sorte){
                this.pageInfo.current = pagination.current
                this.pageInfo.page = pagination.current
                this.pageInfo.pageSize = pagination.pageSize
                this.getTableList()
            },
        },
    }
</script>

<style lang="less" scoped>
</style>
