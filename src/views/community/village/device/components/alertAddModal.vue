<template>
    <a-modal title="告警事件详情" :width="800" :visible="visible" @ok="handleOk" @cancel="handleCancel" :footer="null">
        <div class="detail_con">
            <div class="detail_item" v-for="(item, index) in detailList" :key="index">
                <div class="left_label">{{item.label}}：</div>
                <div class="right_value" v-if="item.type=='text'">{{item.value}}</div>
                
                <viewer v-if="item.value && item.type=='image'" :images="[item.value]">
                    <img :src="item.value" style="width: 50px; height: 50px; border-radius: 5px;" />
                </viewer>
            </div>
        </div>
    </a-modal>
</template>

<script>
    import Vue from 'vue';
    import 'viewerjs/dist/viewer.css';
    import Viewer from 'v-viewer';
    Vue.use(Viewer)
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            id: {
                type: [String, Number],
                default: 0
            }
        },
        
        watch: {
            visible: {
                handler(val){
                    if(val && this.id){
                        this.getDetails()
                    }
                },
                immediate: true
            }
        },
        
        data() {
            return {
                detailList: []
            }
        },

        methods: {
            handleOk() {
                this.$emit('close')
            },

            handleCancel() {
                this.$emit('close')
            },
            
            getDetails(){
                this.request('/community/village_api.CameraDevice/getDeviceAlarmInfo', {id: this.id}).then(res=> {
                    this.detailList = res.alarmShow
                })
            }
            
        }

    }
</script>

<style lang="less" scoped>
    .detail_con{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        .detail_item{
            width: 49%;
            display: flex;
            margin-top: 20px;
            margin-left: 5px;
            .left_label{
                color: #333;
                flex-shrink: 0;
            }
            .right_value{
                color: #666;
                margin-left: 3px;
            }
        }
    }
</style>
