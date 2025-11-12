<template>
    <a-drawer :title="title" :width="1400" :visible="visible" :maskClosable="false"
              @close="handleCancel" placement="right">
            <div class="search-box">
                <a-row>
                       <a-alert
                         description="温馨提示：只能复制关键词类型是【功能链接】的状态是启用的关键词"
                         type="info"
                         style="margin-bottom: 20px;"
                       />
                    <a-col :span="18" style="padding-left: 1px; padding-right: 1px;width: 250px;">
                      <label style="margin-top: 5px;">选择省市区县：</label>
                      <a-select default-value="全部省" style="width: 150px" placeholder="请选择省" v-model="search.province_id" @change="handleSelectProvince">
                        <a-select-option value="0">
                          全部省
                        </a-select-option>
                        <a-select-option :value="item.id" v-for="(item,index) in province_list" >
                          {{item.name}}
                        </a-select-option>
                      </a-select>
                    </a-col>
                
                    <a-col  :span="18" style="padding-left: 1px; padding-right: 1px;width: 155px;">
                      <a-select default-value="全部城市" style="width: 150px" placeholder="请选择城市" v-model="search.city_id"  @change="handleSelectCity">
                        <a-select-option value="0">
                          全部城市
                        </a-select-option>
                        <a-select-option :value="item.id" v-for="(item,index) in city_list" >
                          {{item.name}}
                        </a-select-option>
                      </a-select>
                    </a-col>
                    <a-col  :span="18" style="padding-left: 1px; padding-right: 1px;width: 170px;">
                      <a-select default-value="全部区县" style="width: 150px" placeholder="请选择区县" v-model="search.area_id" @change="handleSelectArea">
                        <a-select-option value="0">
                          全部区县
                        </a-select-option>
                        <a-select-option :value="item.id" v-for="(item,index) in area_list">
                          {{item.name}}
                        </a-select-option>
                      </a-select>
                    </a-col>
                    <a-col  :span="18" style="padding-left: 1px; padding-right: 1px;width: 170px;">
                      <a-select default-value="全部街道/乡镇" style="width: 150px" placeholder="街道/乡镇" v-model="search.street_id" @change="handleSelectStreet">
                        <a-select-option value="0">
                          全部街道/乡镇
                        </a-select-option>
                        <a-select-option :value="item.area_id" v-for="(item,index) in street_list">
                          {{item.area_name}}
                        </a-select-option>
                      </a-select>
                    </a-col>
                    
                    <a-col  :span="18" style="padding-left: 1px; padding-right: 1px;width: 170px;">
                      <a-select default-value="全部社区/村" style="width: 150px" placeholder="社区/村" v-model="search.community_id" @change="handleSelectCommunity">
                        <a-select-option value="0">
                          全部社区/村
                        </a-select-option>
                        <a-select-option :value="item.area_id" v-for="(item,index) in community_list">
                          {{item.area_name}}
                        </a-select-option>
                      </a-select>
                    </a-col>
                    
                    <a-col :span="18" style="padding-left: 1px; padding-right: 1px;width: 200px;">
                      <a-input
                        style="width: 200px"
                        :placeholder="'请输入'+$store.getters.config.house_name+'名称'"
                        autocomplete="off"
                        v-model="search.keyword"/>
                    </a-col>
                    <a-col :span="18" style="padding-left: 100px;padding-bottom: 15px;padding-top: 20px;">
                      <a-button type="primary" icon="search" @click="searchList()">
                        查询
                      </a-button>
                      <a-button type="primary" @click="resetList()" style="margin-left: 15px;">
                        重置
                      </a-button>
                    </a-col>
                </a-row>
            </div>
              <a-table :columns="columns" :data-source="data"
                       :pagination="pagination"
                        class="components-table-demo-nested"
                        @change='table_change'
                        :loading="loading"
                        :row-key="record => record.village_id"
                       > 
                       <span slot="action" slot-scope="text,record,index">
                            <a @click="selectVillageHandle(record)" style="color: red" v-if="!record.is_select">选择</a>
                            <a @click="cancelSelectVillage(record)" style="color: green" v-else>取消选择</a>
                       </span>
              </a-table>
        
          </a-card>

          <a-card :bordered="false" style="text-align: center;" >
              <a-button  type="primary" style="margin-bottom: 20px;" @click="handleSubmit()" :loading="loading">确认复制</a-button>
          </a-card>
        
    </a-drawer>
    
</template>
<script>
    import villageApi from '@/api/community/village'
    import { Collapse } from 'ant-design-vue';
    import moment from 'moment'
	import store from '@/store';
    const columns = [
            { title: store.getters.config.house_name+'ID',  dataIndex: 'village_id', key: 'village_id'},
            { title: store.getters.config.house_name+'名称',  dataIndex: 'village_name', key: 'village_name'},
            { title: store.getters.config.house_name+'地址',  dataIndex: 'village_address', key: 'village_address'},
            { title: '请选择',  dataIndex: '', key: '', scopedSlots: { customRender: 'action' }},
    ];
    const data = [];
    export default {
        name: 'copyOtherWordList',
        filters: {

        },
        components:{
            'a-collapse':Collapse,
            'a-collapse-panel':Collapse.Panel,
        },
        data() {
            return {
                labelCol: {
                  xs: {
                    span: 10
                  },
                  sm: {
                    span:3
                  }
                },
            search: { keyword: '',province_id:"0",city_id:"0",area_id:"0",street_id:"0",community_id:"0",page: 1 },
                form: this.$form.createForm(this),
                pagination: {current:1, pageSize: 10, total:10 },
                visible: false,
                loading: false,
                data,
               columns,
               dateFormat: 'YYYY-MM-DD HH:mm:ss',
               title:'',
               province_list:[],
               city_list:[],
               area_list:[],
               street_list:[],
               community_list:[],
               select_village_id:0,
               select_record:{}
            };
        },
        activated () {

        },
        methods: {
            moment,
            copyOtherWord(){
                this.select_village_id=0;
                this.select_record={};
                this.getPropertyvillage();
                this.getProvinceCityAreas(0,0);
                this.visible = true;
            },
            handleSelectChange(value, option){
                if(value==0 || value=='0' || !value ){
                    this.group_id=0;
                }else{
                    this.group_id=value*1;
                }  
            },
            handleCancel(){
                this.select_village_id=0;
                this.select_record={};
                this.city_list=[];
                this.area_list=[];
                this.street_list=[];
                this.community_list=[];
                this.search={ keyword: '',province_id:"0",city_id:"0",area_id:"0",street_id:"0",community_id:"0",page: 1 }
                this.visible = false;
            },
            selectVillageHandle(record){
                this.select_record=record;
                let village_id=record.village_id*1;
                this.select_village_id=village_id;
                console.log('village_id', village_id)
                this.data.map((v, i) => {
                  if (v.village_id*1 == village_id) {
                    console.log('v.village_id', v.village_id)
                    v.is_select = true;
                  }else{
                      v.is_select = false;
                  }
                  this.data[i] = v;
                })
                this.$forceUpdate()
            },
            cancelSelectVillage(record){
                let village_id=record.village_id*1;
                this.select_village_id=0;
                this.select_record={};
                console.log('village_id', village_id)
                this.data.forEach((v, i) => {
                if (v.village_id*1 == village_id) {
                    v.is_select = false;

                  }else{
                      v.is_select = true;
                  }
                  this.data[i] = v;
                })
                this.$forceUpdate()
            },
            handleSubmit() {
                        if(this.select_village_id<1){
                            this.$message.error('请先选择一个'+store.getters.config.house_name+'!');
                        }
                        let postArr={other_village_id:this.select_village_id}
                        this.loading = true;
                        let _this=this;
                        this.$confirm({
                          title: '确认复制',
                          content: '您确认要从'+store.getters.config.house_name+'【'+this.select_record.village_name+'】复制数据吗？',
                          onOk() {
                                _this.request(villageApi.copyAvillageKeyword,postArr)
                                    .then((res) => {
                                        _this.loading = false
                                        _this.$message.success('操作成功!');
                                            setTimeout(() => {
                                              _this.handleCancel();
                                              _this.$emit('ok')
                                            }, 1500)
                                    }).catch(error => {
                                        _this.loading = false
                                    })
                          },
                          onCancel() {
                              _this.loading = false
                          },
                        });
            },
            //获取物业小区
            getPropertyvillage(){
                this.search.page = this.pagination.current;
                    this.request(villageApi.getHotWordAllVillages, this.search)
                        .then((res) => {
                            this.data=res.list;
                            this.pagination.total = res.count ? res.count : 0
                            this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        })
                },
                searchList(){
                    this.pagination.current=1;
                    this.getPropertyvillage();
                },
                //获取省市区信息 xtype 0 省 1市 2区县
                getProvinceCityAreas(xtype,pid){
                    let postArr={xtype:xtype,pid:pid};
                        this.request(villageApi.getProvinceCityAreas, postArr)
                            .then((res) => {
                                if(xtype==0){
                                    this.province_list=res;
                                }else if(xtype==1){
                                    this.city_list=res;
                                }else if(xtype==2){
                                    this.area_list=res;
                                }
                            })
                },
                
                getStreetCommunitys(xtype,pid){
                    let postArr={xtype:xtype,pid:pid};
                        this.request(villageApi.getAreaStreetCommunity, postArr)
                            .then((res) => {
                                if(xtype=='street'){
                                    this.street_list=res.list;
                                }else if(xtype=='community'){
                                    this.community_list=res.list;
                                }
                    })
                },
                handleSelectProvince(value, option){
                    this.city_list=[];
                    this.area_list=[];
                    this.street_list=[];
                    this.community_list=[];
                    this.search.city_id='0';
                    this.search.area_id="0";
                    this.search.street_id='0';
                    this.search.community_id="0";
                    if(value==0 || value=='0' || !value ){
                        this.search.province_id='0';
                    }else{
                        this.search.province_id=value;
                        this.getProvinceCityAreas(1,this.search.province_id);
                    }
                    
                },
                handleSelectCity(value, option){
                    this.area_list=[];
                    this.street_list=[];
                    this.community_list=[];
                    this.search.area_id="0";
                    this.search.street_id='0';
                    this.search.community_id="0";
                    if(value==0 || value=='0' || !value ){
                        this.search.city_id='0';
                    }else{
                        this.search.city_id=value;
                        this.getProvinceCityAreas(2, this.search.city_id);
                    }
                },
                handleSelectArea(value, option){
                    this.street_list=[];
                    this.community_list=[];
                    this.search.street_id='0';
                    this.search.community_id="0";
                    
                    if(value==0 || value=='0' || !value ){
                        this.search.area_id="0";
                    }else{
                        this.search.area_id=value;
                        this.getStreetCommunitys('street', this.search.area_id);
                    }
                },
                handleSelectStreet(value, option){
                    this.community_list=[];
                    this.search.community_id="0";
                    if(value==0 || value=='0' || !value ){
                        this.search.street_id="0";
                    }else{
                        this.search.street_id=value;
                        this.getStreetCommunitys('community', this.search.street_id);
                    }
                },
                handleSelectCommunity(value, option){
                    if(value==0 || value=='0' || !value ){
                        this.search.community_id="0";
                    }else{
                        this.search.community_id=value;
                    }
                },
            // 处理时间
            date_moment(time, dateFormat) {
                if (!time) {
                    return '';
                }
                return moment(time, dateFormat)
            },
            resetList() {
                this.city_list=[];
                this.area_list=[];
                this.search={ keyword: '',province_id:"0",city_id:"0",area_id:"0",street_id:"0",community_id:"0",page: 1 };
                this.getPropertyvillage();
            },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                let _this=this;
                if (e.current && e.current>0) {
                    _this.pagination.current = e.current;
                    _this.getPropertyvillage()
                }
            },

        }
    };
</script>
<style lang="less" scoped>
    .message-suggestions-list-box {
        margin: 30px 20px;
        background-color: white;
    }
    .message-suggestions-list-box .search-box {
        padding: 20px 20px 0;
      border: 1px solid #e4dfdf;
    }
    .message-suggestions-list-box .add-box {
        padding: 20px 20px 0;
    }
    .message-suggestions-list-box .components-table-demo-nested {
        padding: 20px;
    }
    .message-suggestions-list-box .message_box {
        padding: 20px;
    }
    .lbsf{
        float: right;margin-right: 24px;
    }
    .padding-tp10{
      padding-top: 15px;
      padding-bottom: 15px;
    }
    .modal_box_1 {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
    
      .flex_text_box {
        width: 50%;
      }
    }
    // 公共样式
    .margin_top_10 {
      margin-top: 10px;
    }
    .flex_text_box {
        display: flex;
        flex-direction: row;
        align-items: center;
    
        .text_1 {
            flex-shrink: 0;
        }
    }
    #components_layout_menus .ant-layout-content {
            background-color: #fff;
            padding-bottom: 5px;
            border-bottom: 1px solid #eee;
    }

    #components_layout_menus .ant-layout-sider{
        background-color: #fff;
        width: 150px;
        font-size: 25px;
        display: inline-block;
    }
   #components_layout_menus .ant-layout{
       min-height: 40px;
       vertical-align: middle;
       border-bottom: 1px solid #eee;
       margin-bottom: 10px;
   }
   #components_layout_menus  .ant-layout-header{
       background-color: #fff;
   }
   #components_layout_menus .ant-layout-footer{
       background-color: #fff;
   }
  #components_layout_menus .sub2div{    margin-left: 35px;border-bottom: 1px solid #eee;}
  #components_layout_menus .sub1div label { font-size: 16px;padding-left: 2px; color: #2b7dbc;}
  #components_layout_menus .sub2div label{ font-size: 16px;padding-left: 2px;color: green;}
  #components_layout_menus .sub2div .sub2div_2div{margin-left: 35px;}
  #components_layout_menus .sub2div .sub2div_2div label{font-size: 14px;color: #000000a6}
  
  /deep/ textarea{
      overflow-y: scroll !important;
  }
</style>