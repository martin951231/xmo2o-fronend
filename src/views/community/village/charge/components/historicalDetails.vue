<template>
    <a-modal title="历史缴费账单详情" :visible="visible" :width="750" @cancel="handleCancel" :footer="null" centered>
        <div class="detail_con">
            <div class="detail_item" v-for="(item, index) in detailList" :key="index">
                <div class="left_leble">{{item.label}}：</div>
                <div class="right_value">{{item.value}}</div>
            </div>
        </div>
    </a-modal>
</template>

<script>
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            repaireInfo: {
                type: Object,
                default: () => {return {}}
            }
        },
        
        watch: {
            visible: {
                handler(val){
                    if(val && this.repaireInfo.order_id){
                        this.getDetails()
                    }
                }
            }
        },
        
        data() {
            return {
                detailList: []
            }
        },
        methods: {
            handleCancel() {
                this.$emit('close')
            },
            getDetails(){
                let that = this
                that.request('/community/village_api.Cashier/getPayOrderInfo', {order_id: that.repaireInfo.order_id}).then(res=>{
                    that.detailList = res.orderArr
                }).catch(err=>{
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .detail_con{
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        .detail_item{
            width: 49%;
            margin-top: 10px;
            flex-shrink: 0;
            display: flex;
            .left_leble{
                font-size: 15px;
                color: #666;
            }
            .right_value{
                font-size: 15px;
                color: #999;
            }
        }
    }
</style>