<template>
    <a-modal
        title="查看设备"
        :visible="visible"
        :confirm-loading="confirmLoading"
        :width="600"
        :footer="null"
        @ok="handleOk"
        @cancel="handleCancel">
        <div class="container">
            <div class="props_item" v-for="(item, index) in propsList" :key="index">
               {{item.label}}：{{item.value}}
            </div>
        </div>
        <a-table :columns="columns" :data-source="tableList" :loading="tableLoading" :pagination="false">
            <span slot="action" slot-scope="text, record">
                <a @click="viewCode(record.socket)">查看二维码</a>
            </span>
        </a-table>
        
        <a-modal title="查看二维码" :width="500" :visible="codeVisible"
            @cancel="handleCodeCancel" :footer="null">
            <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
                <img style="width: 150px; height: 150px;" :src="ercodeUrl">
            </div>
        </a-modal>
    </a-modal>
</template>

<script>
    const columns = [{
            title: '设备编号',
            key: 'number',
            dataIndex: 'number',
        },
        {
            title: '设备状态',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: '操作',
            key: 'action',
            scopedSlots: { customRender: 'action' },
        },
    ];
    export default{
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            device_id: {
                type: Number,
                default: 0
            }
        },
        watch: {
            visible: {
                handler(val){
                    if(val){
                        this.getDetail(this.device_id)
                    }
                },
                immediate: true
            }
        },
        data(){
            return {
                confirmLoading: false,
                propsList: [{label: '设备品牌', value: '工单'},{label: '设备品牌', value: '工单'},{label: '设备品牌', value: '工单'},
                {label: '设备品牌', value: '工单'},{label: '设备品牌', value: '工单'},{label: '设备品牌', value: '工单'},{label: '设备品牌', value: '工单'},
                {label: '设备品牌', value: '工单'},{label: '设备品牌', value: '工单'},{label: '设备品牌', value: '工单'},{label: '设备品牌', value: '工单'},
                {label: '设备品牌', value: '工单'},{label: '设备品牌', value: '工单'},{label: '设备品牌', value: '工单'},{label: '设备品牌', value: '工单'}],
                formDetail: {},
                tableList: [],
                tableLoading: false,
                columns,
                codeVisible: false,
                ercodeUrl:''
            }
        },
        methods: {
            handleOk(){
                this.$emit('closeDetail')
            },
            handleCancel(){
                this.$emit('closeDetail')
            },
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            handleSelectChange(value, type){
                console.log(value, type)
            },
            getDetail(id){
                let that = this
                that.tableLoading = true
                that.request('/community/village_api.Pile/getEquipmentDetail', {id,}).then(res => {
                    that.formDetail = res.info
                    that.propsList = [{
                        label: '设备品牌',
                        value: res.info.device_brand
                    },{
                        label: '品牌类型',
                        value: res.info.brand_type_txt
                    },{
                        label: '电桩类型',
                        value: res.info.type == 1?'直流充电桩':'交流充电桩'
                    },{
                        label: '设备名称',
                        value: res.info.equipment_name
                    },{
                        label: '设备唯一编码',
                        value: res.info.equipment_num
                    },{
                        label: '设备功率',
                        value: res.info.power
                    },{
                        label: '最大电压',
                        value: res.info.max_voltage
                    },{
                        label: '最小电压',
                        value: res.info.min_voltage
                    },{
                        label: '最大电流',
                        value: res.info.max_electric_current
                    },{
                        label: '最小电流',
                        value: res.info.min_electric_current
                    },{
                        label: '最高温度',
                        value: res.info.max_temperature
                    },{
                        label: '最低温度',
                        value: res.info.min_temperature
                    },{
                        label: '枪头数量',
                        value: res.info.socket_num
                    },{
                        label: '备注',
                        value: res.info.remark
                    }]
                    that.tableList = res.socket_arr
                    that.tableLoading = false
                })
            },
            viewCode(value = 2){
                let that = this
                that.socket = value
                that.request('/community/village_api.Pile/getEquipmentCode ', {socket:value, id: that.device_id}).then(res => {
                    that.ercodeUrl = res.qrcode
                    that.codeVisible = true
                })
            },
            handleCodeCancel(){
                this.codeVisible = false
            }
        }
    }
</script>

<style lang="less" scoped>
    /deep/ textarea{
        overflow-x: hidden;
        overflow-y: scroll !important;
    }
    
    .container{
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        .props_item{
            width: 46%;
            margin: 5px;
        }
    }
</style>