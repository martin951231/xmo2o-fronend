<template>
    <a-modal :visible="visible" :width="700" @cancel="handleClose" :footer="null">
        <div class="form_con">
            <div class="form_item" v-for="(item, index) in formList" :key="index">
                <div class="form_lable">{{item.label}}</div>
                <div class="form_value">{{item.value}}</div>
            </div>
        </div>
        
        <a-modal
            v-if="mapVisible"
            title="查看位置"
            :visible="mapVisible"
            :width="800"
            @cancel="handleMapCancel" :footer="false">
            <div id="allmap" style="width:100%; height: 500px;"></div>
        </a-modal>
    </a-modal>
</template>

<script>
    import Vue from 'vue';
    export default{
        props: {
            visible: {
              type: Boolean,
              deafult: false
            },
            equip_id: {
                type: [String, Number],
                default: ''
            }
        },

        watch: {
            equip_id:{
                immediate: true,
                handler(val){
                    if(val){
                        this.getDetail(val)
                    }
                }
            }
        },
        data(){
            return{
                formList: [],
                longlat: {},
                mapVisible: false
            }
        },
        methods: {
            handleClose(){
                this.$emit('close')
            },
            
            handleMapCancel() {
                this.mapVisible = false
            },
            
            openMap(longlat){
                this.mapVisible = true
                this.longlat = longlat
                this.initMap()
            },
            
            initMap(){
                this.$nextTick(function () {
                    let map = new BMap.Map("allmap");
                    let point = new BMap.Point(this.longlat.long, this.longlat.lat);
                    this.$nextTick(()=> {
                        map.clearOverlays();
                        map.addOverlay(new BMap.Marker(point));
                        map.centerAndZoom(point, 15);
                        map.enableScrollWheelZoom();
                    })
                });
            },

            getDetail(id) {
                let that = this
                that.request('/community/village_api.Garbage.GarbageCollectionPut/putDetail', {
                    id,
                }).then(res => {
                    that.formList = [
                        {
                            label: '设备编号',
                            value: res.device_no || '暂无'
                        }, {
                            label: '名称',
                            value: res.name || '暂无'
                        }, {
                            label: '关联小区',
                            value: res.village_name || '暂无'
                        }, {
                            label: '投放方式',
                            value: res.clnt_type_str || '暂无'
                        }, {
                            label: '用户名',
                            value: res.nickname || '暂无'
                        }, {
                            label: '卡号',
                            value: res.ic_card || '暂无'
                        }, {
                            label: '重量（g）',
                            value: res.weight || '暂无'
                        }, {
                            label: '积分',
                            value: res.score || '暂无'
                        }, {
                            label: '描述',
                            value: res.agent_phone || '暂无'
                        }, {
                            label: '投放时间',
                            value: res.put_time || '暂无'
                        }, {
                            label: '创建时间',
                            value: res.add_time || '暂无'
                        }
                    ]
                })
            },
        }
    }
</script>

<style lang="less" scoped>
    .form_con{
        .form_item{
            display: flex;
            margin-top: 10px;
            .form_lable{
                width: 100px;
            }
            .form_value{
                width: calc(100% - 180px);
            }
        }
    }
   
</style>