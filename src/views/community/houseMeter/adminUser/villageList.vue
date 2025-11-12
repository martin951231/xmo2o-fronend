<template>
    <a-modal  width="1000px" v-model="bindVisible" :footer="null" :maskClosable="false" @cancel="handleCandel">
        <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:0 0 0;">
            <a-card :bordered="false">
              <div class="search-box" style="margin-bottom: 10px;">
                <a-row :gutter="48">
                  <a-col :md="8" :sm="24" style="padding-left: 24px;padding-right: 1px;width: 130px;">
                    <a-select default-value="0" style="width: 105px" placeholder="请选择省" @change="handleChange10"
                              v-model="search.province1">
                      <a-select-option value="0">
                        全部省
                      </a-select-option>
                      <a-select-option :value="item11.area_id" v-for="(item11,index11) in province_list" :key="index11">
                        {{item11.area_name}}
                      </a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 117px;">
                    <a-select default-value="0" style="width: 115px" placeholder="请选择市" @change="handleChange11"
                              v-model="search.city1">
                      <a-select-option value="0">
                        全部市
                      </a-select-option>
                      <a-select-option :value="item12.id" v-for="(item12,index12) in city_list" :key="index12">
                        {{item12.name}}
                      </a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 117px;">
                    <a-select default-value="0" style="width: 115px" placeholder="请选择区" @change="handleChange12"
                              v-model="search.area1">
                      <a-select-option value="0">
                        全部区
                      </a-select-option>
                      <a-select-option :value="item13.id" v-for="(item13,index13) in area_list" :key="index13">
                        {{item13.name}}
                      </a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 119px;">
                    <a-select default-value="0" style="width: 117px" placeholder="请选择街道" @change="handleChange13"
                              v-model="search.street1">
                      <a-select-option value="0">
                        全部街道
                      </a-select-option>
                      <a-select-option :value="item14.id" v-for="(item14,index14) in street_list" :key="index14">
                        {{item14.name}}
                      </a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 125px;">
                    <a-select default-value="0" style="width: 117px" placeholder="请选择社区" v-model="search.community1">
                      <a-select-option value="0">
                        全部社区
                      </a-select-option>
                      <a-select-option :value="item15.id" v-for="(item15,index15) in community_list" :key="index15">
                        {{item15.name}}
                      </a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :md="8" :sm="24" style="padding-left: 1px;padding-right: 1px;width: 20%">
                    <a-input-group compact>
                      <label style="margin-top: 5px;">{{$store.getters.config.house_name}}名称：</label>
                      <a-input style="width: 54%" v-model="search.village_name1"/>
                    </a-input-group>
                  </a-col>
                  <a-col :md="2" :sm="2" style="padding-left: 1px;padding-right: 24px;">
                    <a-button type="primary" icon="search" @click="searchList()">
                      查询
                    </a-button>
                  </a-col>
                </a-row>
              </div>
                <a-table :columns="columns" :data-source="list"
                         :row-selection="rowSelection"
                         rowKey="village_id"
                         :pagination="pagination"
                         @change="tableChange">
        <span slot="action" slot-scope="text, record">
          <a @click="bind(record)">绑定</a>
        </span>
                    <span slot="join_status" slot-scope="text, record">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
        </span>

                    <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }}</template>
                </a-table>
                <span class="table-operator">
                    <a-button type="primary"  @click="bindAll()"  :disabled="isShow?false:true" >批量绑定</a-button>
                </span>
            </a-card>

        </div>
    </a-modal>
</template>

<script>
    import configHouseMeterApi from '@/api/community/houseMeter'
	import store from '@/store';
    const columns = [
        {
            title: store.getters.config.house_name+'名称',
            dataIndex: 'village_name',
            key: 'village_name',
        },
        {
            title: store.getters.config.house_name+'地址',
            dataIndex: 'village_address',
            key: 'village_address',
        },

        {
            title: '操作',
            key: 'action',
            dataIndex: '',
            scopedSlots: {
                customRender: 'action'
            }
        },
    ];
/*    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            let village_id = selectedRows;
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
        },
    };*/
    export default {
        name: 'villageList',
        data() {
            return {
                list: [],
                sortedInfo: null,
                pagination: {pageSize: 10, total: 10},
                search: {page: 1},
                page: 1,
                search_data: [],
                id: 0,
                village_id: [],
                uid: 0,
                columns,
                bindVisible: false,
                confirmLoading: false,
              province_list: [],
              city_list: [],
              area_list: [],
              street_list: [],
              community_list: [],
              areas: [],
              streetarr:[],
              lists:[],
              visible:false,
              isShow:false,
            };
        },
        computed: {
            // 表格选择操作
            rowSelection() {
                return {
                    onChange: this.onSelectChange,
                }
            },
        },
        methods: {
            tableChange() {

            },
            handleOks() {
                this.getVillageLists()
            },
            add(uid,areas,village_list) {
              this.uid = uid
              /*  this.areas = areas*/
              this.village_list = village_list
              this.bindVisible = true
              this.bindVisible = true
              // this.province_list = this.areas.province_list
              this.province_list = []
              this.getVillageLists()
              this.getAreaList()
            },
          // 获取省市区等信息
          getAreaList() {
            this.request(configHouseMeterApi.getAreasList,{'pid':0,'type':1})
              .then((res) => {
                this.province_list = res
              })
              .catch((error) => {
                this.confirmLoading = false
              })
          },
          handleCandel(){

              this.visible = false;
          },
            cancel1() {

            },


            onSelectChange(selectedRowKeys, selectedRows) {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                this.village_id = selectedRows;
                if (this.village_id.length>0){
                  this.isShow=true
                }else{
                  this.isShow=false
                }
                console.log('villagess',this.village_id)
                /*if (selectedRows && selectedRows[0]) {
                    for (var i in selectedRows) {
                        if (selectedRows[i]) {
                            this.selectedRowKeys.push(selectedRows[i]['code_id']);
                        }
                    }
                }*/
            },
            getVillageLists() {
                console.log('search', this.search);
                let searcharr={
                  province:this.search.province1,
                  city:this.search.city1,
                  area:this.search.area1,
                  street:this.search.street1,
                  community:this.search.community1,
                  village_name:this.search.village_name1,

                }
                this.request(configHouseMeterApi.villageBindList, {uid: this.uid, type: 1, search: searcharr})
                    .then((res) => {
                      console.log('reslist',res['list'])
                        this.list = res.list;
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                      console.log('listssss',this.list)
                      this.village_list.filter( (item,index) =>{
                        if (item) {
                          this.list.filter((v,i)=>{
                            if(v.village_id == item.village_id){
                              this.list.splice(i,1)
                            }
                          })
                        }

                      } )
                      this.pagination.total = this.list.length;
                    })
            },

          handleChange10(value) {
           /* let citys = this.areas.area
            this.city_list = citys[value]*/

            this.request(configHouseMeterApi.getAreasList,{'pid':value,'type':2})
              .then((res) => {
                this.city_list = res

              })
              .catch((error) => {
                this.confirmLoading = false
              })


          },
          handleChange11(value) {
          /*  let arealist = this.city_list
            this.area_list = arealist[value]*/

            this.request(configHouseMeterApi.getAreasList,{'pid':value,'type':3})
              .then((res) => {
                this.area_list = res

              })
              .catch((error) => {
                this.confirmLoading = false
              })

          },
          handleChange12(value) {
         /*   let streets = this.areas.village

            for (let i in streets){
              let streetlist=streets[i]
              console.log(streetlist.pid)
              if (streetlist.pid===value){
                this.streetarr.push(streetlist)
              }
            }
            console.log(this.streetarr)
            this.street_list = this.streetarr*/


            this.request(configHouseMeterApi.getCommunityList,{'pid':value,'type':0})
              .then((res) => {
                this.street_list = res

              })
              .catch((error) => {
                this.confirmLoading = false
              })

          },
          handleChange13(value) {
            this.request(configHouseMeterApi.getCommunityList,{'pid':value,'type':1})
              .then((res) => {
                this.community_list = res

              })
              .catch((error) => {
                this.confirmLoading = false
              })
           // this.community_list = this.street_list[value]

          },
          // 进行搜索
          searchList() {
            console.log('search', this.search);
            this.getVillageLists()
          },
            bind(item) {
                console.log('item', item)
                let uid = this.uid
                if (uid > 0) {
                    this.request(configHouseMeterApi.meterVillageAdd, {'village_id': item.village_id, 'uid': uid})
                        .then((res) => {
                            this.$message.success('绑定成功')
                            setTimeout(() => {
                                this.form = this.$form.createForm(this)
                                this.modelVisible = false
                                this.confirmLoading = false
                                  this.list.filter((v,i)=>{
                                    if(v.village_id == item.village_id){
                                      this.list.splice(i,1)
                                    }
                                  })
                              this.pagination.total = this.list.length;
                                this.$emit('ok')
                            }, 1500)
                        })
                        .catch((error) => {
                            this.confirmLoading = false
                        })
                } else {
                    let type=1
                  this.$message.success('绑定成功')
                  this.list.filter((v,i)=>{
                    if(v.village_id == item.village_id){
                      this.list.splice(i,1)
                    }
                  })
                  this.pagination.total = this.list.length;
                    this.$emit('ok', item,type)
                }


            },
            bindAll() {
                console.log('village_id: ', this.village_id)
                let village=this.village_id
                let uid = this.uid

                let type=2
                if (uid > 0) {
                    this.request(configHouseMeterApi.meterVillageAddll, {'village_id': village, 'uid': uid})
                        .then((res) => {
                            this.$message.success('绑定成功')
                            setTimeout(() => {
                                this.form = this.$form.createForm(this)
                                this.modelVisible = false
                                this.confirmLoading = false
                              this.village_id.filter( (item,index) =>{
                                if (item) {
                                  this.list.filter((v,i)=>{
                                    if(v.village_id == item.village_id){
                                      this.list.splice(i,1)
                                    }
                                  })
                                }

                              } )
                              this.pagination.total = this.list.length;
                                this.$emit('ok')
                            }, 1500)
                        })
                        .catch((error) => {
                            this.confirmLoading = false
                        })
                } else {
                  this.$message.success('绑定成功')
                    let item=village
                  this.village_id.filter( (item,index) =>{
                    if (item) {
                      this.list.filter((v,i)=>{
                        if(v.village_id == item.village_id){
                          this.list.splice(i,1)
                        }
                      })
                    }

                  } )
                  this.pagination.total = this.list.length;
                    this.$emit('ok', item,type)
                }

            },

        },
    }
</script>
<style scoped>
    .ant-form-item label {
        width: 50px;
    }

    .tip-txt {
        margin-left: 4px;
        font-size: 12px;
    }

    .add-box-tip {
        text-align: -webkit-center;
        padding: 0 6px;
        margin-left: 8px;
        border-radius: 15px;
        border: none;
    }

    .imgname {
        width: 100px;
    }

    .ant-radio-wrapper {
        margin-right: 45px;
    }

    .ant-card-body {
        padding: 1px;
        zoom: 1;
    }

</style>