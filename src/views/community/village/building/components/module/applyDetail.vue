<template>
    <a-modal title="详情" :width="700" :visible="visible" :footer="null" @cancel="onClose" centered>
        <div class="detail_con">
            <div class="detail_item" v-for="(item, index) in applyDetail" :key="index">
                <div class="label">{{item.label}}：</div>
                <div class="value">{{item.value}}</div>
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
            apply_id: {
                type: Number,
                default: 0
            }
        },
        
        watch: {
            visible: {
                handler(val){
                    if(val && this.apply_id){
                        this.getDetail()
                    }
                }
            }
        },
        
        data() {
            return {
                applyDetail: []
            };
        },
        methods: {
            getDetail(){
                let that = this
                that.request('/community/village_api.workorder.CommunityQuality/getApplyDetail', {id:that.apply_id}).then(res=>{
                    that.applyDetail = res.detail.handleArr
                })
            },
            
            onClose(){
                this.$emit('close')
            },
        },
    };
</script>

<style lang="less" scoped>
    .detail_con{
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        .detail_item{
            width: 49%;
            display: flex;
            align-items: center;
            margin-top: 10px;
            .label{
                font-size: 14px;
                color: #666;
            }
            .value{
                font-size: 14px;
                color: #999;
            }
        }
    }
    
</style>