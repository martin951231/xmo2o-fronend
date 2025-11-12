<template>
    <a-modal
        title="查看订单"
        :visible="visible"
        :width="750"
        :footer="null"
        @ok="handleOk"
        @cancel="handleCancel">
        <div class="container">
            <div class="props_item" v-for="(item, index) in propsList" :key="index">
               {{item.key}}：{{item.value}}
            </div>
        </div>
    </a-modal>
</template>

<script>
    export default{
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            rule_id: {
                type: Number,
                default: 0
            }
        },
        watch: {
            visible: {
                handler(val){
                    if(val){
                        this.getRuleDetail(this.rule_id)
                    }
                },
                immediate: true
            }
        },
        data(){
            return{
                propsList: []
            }
        },
        methods: {
            handleOk(){
                this.$emit('close')
            },
            handleCancel(){
                this.$emit('close')
            },
            getRuleDetail(id){
                let that = this
                that.request('/community/village_api.Pile/getRuleDetail', {id,}).then((res) => {
                    that.propsList = res.list
                })
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