<template>
    <a-modal title="绑定社区" :width="1000" :visible="visible" @cancel="handleClose">
        <div class="search_con" style="margin-bottom: 10px;">
            <a-col :md="8" :sm="24" style="padding-left: 24px;padding-right: 1px;width: 130px;">
                <a-select default-value="0" style="width: 105px" placeholder="请选择省" @change="handleChange"
                          v-model="pageInfo.province">
                    <a-select-option value="0">
                        全部省
                    </a-select-option>
                    <a-select-option :value="item1.area_id" v-for="(item1,index1) in province_list" :key="index1">
                        {{item1.area_name}}
                    </a-select-option>
                </a-select>
            </a-col>
            <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 117px">
                <a-select default-value="0" style="width: 115px" placeholder="请选择市" @change="handleChange1"
                          v-model="pageInfo.city">
                    <a-select-option value="0">
                        全部市
                    </a-select-option>
                    <a-select-option :value="item2.id" v-for="(item2,index2) in city_list" :key="index2">
                        {{item2.name}}
                    </a-select-option>
                </a-select>
            </a-col>
            <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 117px">
                <a-select default-value="0" style="width: 115px" placeholder="请选择区" @change="handleChange2"
                          v-model="pageInfo.area">
                    <a-select-option value="0">
                        全部区/县
                    </a-select-option>
                    <a-select-option :value="item3.id" v-for="(item3,index3) in area_list" :key="index3">
                        {{item3.name}}
                    </a-select-option>
                </a-select>
            </a-col>
            <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 119px">
                <a-select default-value="0" style="width: 117px" placeholder="请选择街道" @change="handleChange3"
                          v-model="pageInfo.street">
                    <a-select-option value="0">
                        全部街道/镇
                    </a-select-option>
                    <a-select-option :value="item4.id" v-for="(item4,index4) in street_list" :key="index4">
                        {{item4.name}}
                    </a-select-option>
                </a-select>
            </a-col>
            <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 118px">
                <a-select default-value="0" style="width: 117px" placeholder="请选择社区" v-model="pageInfo.community">
                    <a-select-option value="0">
                        全部社区/村
                    </a-select-option>
                    <a-select-option :value="item5.id" v-for="(item5,index5) in community_list" :key="index5">
                        {{item5.name}}
                    </a-select-option>
                </a-select>
            </a-col>
            <a-col :md="8" :sm="24" style="padding-left: 10px;padding-right: 1px;width: 25%">
                <a-input-group compact>
                    <a-input style="width: 54%" v-model="pageInfo.village_name" placeholder="请输入小区名称"/>
                </a-input-group>
            </a-col>
            <a-button type="primary" style="margin-left: 10px;" @click="searchList()">查询</a-button>
        </div>
        <div class="table_con">
            <a-table rowKey="village_id" :columns="tableColumns" :data-source="tableList" :pagination="pageInfo" @change="handleTableChange" :row-selection="{ selectedRowKeys: selectedRowKeys, type:'radio', onChange:(e)=>{onSelectChange(e,tableList)} }">
            </a-table>
        </div>
        <template slot="footer">
            <div class="bottom_con" style="width: 100%; display: flex; align-items: center; justify-content: flex-end;">
                <a-button type="primary" @click="bindVillages">绑定</a-button>
            </div>
        </template>
    </a-modal>
</template>

<script>
    import Vue from 'vue';
    import configHouseMeterApi from "@/api/community/houseMeter";
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },

            equip_id: {
                type: [String, Number],
                default: ''
            }
        },
        
        watch: {
            visible: {
                handler(val){
                    if(!val){
                        this.selectedRowKeys = []
                    }
                },
                immidiate: true,
            }
        },
        
        data(){
            return{
                selectedRowKeys: [],
                pageInfo: {
                    pageSize: 10,
                    page: 1,
                    current: 1,
                    total: 0,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
                    province:'0',
                    city:'0',
                    area:'0',
                    street:'0',
                    community:'0',
                    village_name:''
                },
                tableColumns: [{
                        title: '小区名称',
                        dataIndex: 'village_name'
                    },
                    {
                        title: '小区地址',
                        dataIndex: 'village_address',
                    }
                ],
                tableList: [],
                tableLoading: false,
                villageName: '',
                province_list: [],
                city_list: [],
                area_list: [],
                street_list: [],
                community_list: [],
                confirmLoading: false,
            }
        },
        
        methods: {
            handleClose(){
                this.$emit('close')
            },
            bindVillages(record){
                let that = this
                if(that.selectedRowKeys.length == 0){
                    that.$message.warn('请先选择要绑定的小区！')
                    return false;
                }
                console.log('village_ary',record);
                var villageName = this.villageName;
                this.$confirm({
                    title: '提示',
                    content: '是否确定绑定【'+villageName+'】小区',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        that.request('/community/platform.device.GarbageCollectionMachine/machineBind', {id: that.equip_id, village_id: that.selectedRowKeys[0],status:1}).then((res) => {
                            that.$message.success('绑定成功！')
                            setTimeout(() => {
                                that.handleClose()
                            }, 1500)
                        })
                    },
                    onCancel: () => {
                        console.log('Cancel')
                        this.currentBtn = ''
                    },
                    class: 'test'
                })
            },
            
            onSelectChange(selectedRowKeys,data){
                this.selectedRowKeys = selectedRowKeys
                for (var key in data) {
                    if (data[key] && data[key].village_id==selectedRowKeys[0]) {
                        this.villageName = data[key].village_name;
                    }
                }
            },
            
            handleTableChange({current, pageSize}){
                this.pageInfo.current = current
                this.pageInfo.page = current
                this.pageInfo.pageSize = pageSize
                this.getVillageList()
                this.getAreaList()
            },
            
            getVillageList(){
                let that = this
                that.tableLoading = true
                that.request('/community/platform.device.GarbageCollectionMachine/villageList', that.pageInfo).then((res) => {
                    that.tableLoading = false
                    that.pageInfo.total = res.total
                    that.tableList = res.data
                })
            },
            handleChange(value) {
                this.pageInfo.city = '0'
                this.pageInfo.area = '0'
                this.pageInfo.street = '0'
                this.pageInfo.community = '0'
                this.request(configHouseMeterApi.getAreasList,{'pid':value,'type':2})
                    .then((res) => {
                        this.city_list = res

                    })
                    .catch((error) => {
                        this.confirmLoading = false
                    })



            },
            handleChange1(value) {
                this.pageInfo.area = '0'
                this.pageInfo.street = '0'
                this.pageInfo.community = '0'
                this.request(configHouseMeterApi.getAreasList,{'pid':value,'type':3})
                    .then((res) => {
                        this.area_list = res

                    })
                    .catch((error) => {
                        this.confirmLoading = false
                    })

            },
            handleChange2(value) {
                this.pageInfo.street = '0'
                this.pageInfo.community = '0'
                this.request(configHouseMeterApi.getCommunityList,{'pid':value,'type':0})
                    .then((res) => {
                        this.street_list = res

                    })
                    .catch((error) => {
                        this.confirmLoading = false
                    })


            },
            handleChange3(value) {
                this.pageInfo.community = '0'
                this.request(configHouseMeterApi.getCommunityList,{'pid':value,'type':1})
                    .then((res) => {
                        this.community_list = res

                    })
                    .catch((error) => {
                        this.confirmLoading = false
                    })

            },
            getAreaList() {
                this.request(configHouseMeterApi.getAreasList,{'pid':0,'type':1})
                    .then((res) => {
                        this.province_list = res
                    })
                    .catch((error) => {
                        this.confirmLoading = false
                    })
            },
            searchList() {
                this.getVillageList()
            }
        },
        
        mounted(){
            this.getVillageList()
            this.getAreaList()
        }
    }
</script>

<style lang="less" scoped>
    .search_con {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        transform: tranlateX(-10px);
        .search_item {
            display: flex;
            align-items: center;
            margin: 10px;
            
            .label {
                font-size: 14px;
                color: #666666;
            }
    
            .value {}
        }
    }
</style>