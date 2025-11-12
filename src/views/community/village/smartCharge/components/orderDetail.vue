<template>
    <a-modal
        title="查看订单"
        :visible="visible"
        :confirm-loading="confirmLoading"
        :width="750"
        :footer="null"
        @ok="handleOk"
        @cancel="handleCancel">
        <div class="container">
            <div class="props_item" v-for="(item, index) in propsList" :key="index">
               {{item.key}}：{{item.value}}
            </div>
        </div>
        <a-table :columns="columns" :data-source="tableList" :loading="tableLoading" :pagination="false"></a-table>
    </a-modal>
</template>

<script>
    const columns = [{
            title: '充电时段',
            key: 'time',
            dataIndex: 'time',
        },
        {
            title: '电费单价（元/度）',
            dataIndex: 'ele_money',
            key: 'ele_money',
        },
        {
            title: '服务费单价（元/度）',
            dataIndex: 'serve_money',
            key: 'serve_money',
        },
        {
            title: '充电度数',
            dataIndex: 'use_ele',
            key: 'use_ele',
        },
        {
            title: '费用',
            dataIndex: 'use_money',
            key: 'use_money',
        }
    ];
    export default{
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            order_id: {
                type: Number,
                default: 0
            }
        },
        watch: {
            visible: {
                handler(val){
                    if(val){
                        this.getOrderDetail(this.order_id)
                    }
                },
                immediate: true
            }
        },
        data(){
            return{
                confirmLoading: false,
                propsList: [],
                columns,
                tableList: [],
                tableLoading: false
            }
        },
        methods: {
            handleOk(){
                this.$emit('closeOrder')
            },
            handleCancel(){
                this.$emit('closeOrder')
            },
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            handleSelectChange(value, type){
                console.log(value, type)
            },
            getOrderDetail(id){
                let that = this
                that.tableLoading = true
                that.request('/community/village_api.Pile/getOrderDetail', {id,}).then((res) => {
                    that.propsList = res.list
                    that.tableList = res.charge_info
                    that.tableLoading = false
                })
            },
            viewCode(id){
                
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