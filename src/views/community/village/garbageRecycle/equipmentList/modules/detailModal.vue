<template>
    <a-modal :visible="visible" :width="500" @cancel="handleClose" :footer="null">
        <div class="form_con">
            <div class="form_item" v-for="(item, index) in formList" :key="index">
                <div class="form_lable">{{item.label}}</div>
                <div class="form_value">{{item.value}}
                    <a-button type="link" v-if="item.longlat && item.longlat.lat" style="margin-left:10px;" @click="openMap(item.longlat)">
                        查看位置</a-button>
                </div>
            </div>
        </div>

        <a-modal v-if="mapVisible" title="查看位置" :visible="mapVisible" :width="800" @cancel="handleMapCancel"
            :footer="false">
            <div id="allmap" style="width:100%; height: 500px;"></div>
        </a-modal>
    </a-modal>
</template>

<script>
    import Vue from 'vue';
    export default {
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
                        this.getMachineDetail(val)
                    }
                }
            }
        },
        
        data() {
            return {
                formList: [{
                    label: '设备编号',
                    value: '12asrdtghaiojo34567778'
                }, {
                    label: '名称',
                    value: '二栋门口垃圾箱'
                }, {
                    label: '设备类型',
                    value: '智能垃圾分类箱'
                }, {
                    label: '详细地址',
                    value: '蓝色金光小区10栋',
                    longlat: {
                        long: 118.34567,
                        lat: 32.123456
                    }
                }, {
                    label: '合作商名称',
                    value: '合作商名称'
                }, {
                    label: '合作商电话',
                    value: '合作商电话'
                }, {
                    label: '创建时间',
                    value: '2023-05-23'
                }, {
                    label: '设备状态',
                    value: '在线'
                }, {
                    label: '绑定小区',
                    value: '蓝色金光小区'
                }],
                longlat: {},
                mapVisible: false
            }
        },
        methods: {
            handleClose() {
                this.$emit('close')
            },

            handleMapCancel() {
                this.mapVisible = false
            },

            openMap(longlat) {
                this.mapVisible = true
                this.longlat = longlat
                this.initMap()
            },

            getMachineDetail(id) {
                let that = this
                that.request('/community/village_api.Garbage.GarbageCollectionMachine/machineDetail', {
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
                            label: '设备类型',
                            value: res.type_str || '暂无'
                        }, {
                            label: '详细地址',
                            value: res.address || '暂无',
                            longlat: {
                                long: res.longitude,
                                lat: res.latitude
                            }
                        }, {
                            label: '合作商名称',
                            value: res.agent_name || '暂无'
                        }, {
                            label: '合作商电话',
                            value: res.agent_phone || '暂无'
                        }, {
                            label: '创建时间',
                            value: res.add_time || '暂无'
                        }, {
                            label: '设备状态',
                            value: res.status_str || '暂无'
                        }, {
                            label: '绑定小区',
                            value: res.village_name || '暂无'
                        }
                    ]
                })
            },

            initMap() {
                this.$nextTick(function() {
                    let map = new BMap.Map("allmap");
                    let point = new BMap.Point(this.longlat.long, this.longlat.lat);
                    this.$nextTick(() => {
                        map.clearOverlays();
                        map.addOverlay(new BMap.Marker(point));
                        map.centerAndZoom(point, 15);
                        map.enableScrollWheelZoom();
                    })
                });
            },
        }
    }
</script>

<style lang="less" scoped>
    .form_con {
        .form_item {
            display: flex;
            margin-top: 10px;

            .form_lable {
                width: 100px;
            }

            .form_value {
                width: calc(100% - 180px);
            }
        }
    }
</style>
