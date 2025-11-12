<template>
    <a-drawer :title="title" :width="1400" :visible="visible" :maskClosable="false"
              @close="handleCancel" placement="right">
      <div v-if="currentIndex == 0" style="margin-bottom: 20px;">
        <a-button  type="primary" @click="changeXTab(0)" style="margin-right: 30px">基本设置</a-button>
        <a-button v-if="$store.getters.config" type="default" @click="changeXTab(1)" style="margin-right: 30px" >{{$store.getters.config.house_name}}权限设置</a-button>
        <a-button  type="default" @click="changeXTab(2)" style="margin-right: 30px" >物业权限设置</a-button>
        </div>
        <div style="margin-bottom: 20px;" v-else-if="currentIndex == 1">
        <a-button   type="default" @click="changeXTab(0)" style="margin-right: 30px">基本设置</a-button>
        <a-button v-if="$store.getters.config" type="primary" @click="changeXTab(1)" style="margin-right: 30px" >{{$store.getters.config.house_name}}权限设置</a-button>
        <a-button  type="default" @click="changeXTab(2)" style="margin-right: 30px" >物业权限设置</a-button>
        </div>
        <div style="margin-bottom: 20px;" v-else>
        <a-button   type="default" @click="changeXTab(0)" style="margin-right: 30px">基本设置</a-button>
        <a-button v-if="$store.getters.config" type="default" @click="changeXTab(1)" style="margin-right: 30px" >{{$store.getters.config.house_name}}权限设置</a-button>
        <a-button  type="primary" @click="changeXTab(2)" style="margin-right: 30px" >物业权限设置</a-button>
        </div>
        
        <a-card  v-if="currentIndex == 0">
          <a-alert v-if="hw_id>0" message="此数据来源于物业后台【人员管理】数据，基本信息统一由物业后修改，因此这里一些基本信息不可修改" type="info" show-icon  style="margin-bottom: 10px;" />
          <a-form :form="form">
            <a-form-item label="登录账号" :labelCol="labelCol" :required="true">
              <a-col :span="18">
                <a-input
                  style="width: 300px"
                  placeholder="请输入登录账号"
                  autocomplete="off"
                  name="account"
                  v-model="post.account"   :disabled="accountAisabled"/>
                  <!--<span style="margin-left: 15px;color: #DA2626;">请输入英文大小写字母、数字、下划线，至少3位以上作为登录账号</span>-->
              </a-col>
            </a-form-item>
            <a-form-item label="登录密码" :labelCol="labelCol" :required="true">
              <a-col :span="18">
                <a-input-password 
                  style="width: 300px"
                  :placeholder="worker.set_pwd == 1 ? ' 如果不需修改密码则不填写' :'请填写登录密码' "
                  name="password"
                  autocomplete="new-password"
                  v-model="post.password" :disabled="is_edit_disabled" />
                 <!--<span style="margin-left: 15px;color: #DA2626;">请输入英文大小写字母、数字、下划线，至少3位以上作为登录密码</span>-->
              </a-col>
              <a-col :span="6">
              </a-col>
            </a-form-item>
            <a-form-item label="姓名" :labelCol="labelCol" :required="true">
              <a-col :span="18">
                <a-input
                  style="width: 300px"
                  placeholder="请输入姓名"
                  autocomplete="off"
                  name="realname"
                  v-model="post.realname" :disabled="is_edit_disabled"  @blur="validateInput"/>
              </a-col>
              <a-col :span="6">
              </a-col>
            </a-form-item>
            <a-form-item label="手机号" :labelCol="labelCol" :required="true">
              <a-col :span="18">
                <a-input
                  style="width: 300px"
                  placeholder="请输入手机号"
                  autocomplete="off"
                  name="phone"
                  :max-length="11"
                  v-model="post.phone" :disabled="is_edit_disabled"  @blur="validateInput"/>
              </a-col>
              <a-col :span="6">
              </a-col>
            </a-form-item>
            <a-form-item label="备注信息" :labelCol="labelCol" >
              <a-col :span="20">
                <a-textarea
                  ref="textareax"
                  autocomplete="off"
                  :rows="8"
                  style="width: 300px; resize : none;"
                  placeholder="请输入备注信息"
                  name="remarks"
                  v-model="post.remarks"/>
              </a-col>
              <a-col :span="6">
              </a-col>
            </a-form-item>
          </a-form>
        </a-card>
        
        <a-card v-if="currentIndex == 1">
            <div class="search-box">
                <a-row>
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
                    <a-col :span="18" style="padding-left: 1px; padding-right: 1px;width: 200px;">
                      <a-input
                        style="width: 200px"
                        :placeholder="'请输入'+$store.getters.config.house_name+'名称'"
                        autocomplete="off"
                        v-model="search.keyword"/>
                    </a-col>
                    <a-col :span="18" style="padding-left: 10px;padding-bottom: 15px;width: 37%;">
                      <a-button type="primary" icon="search" @click="searchList()">
                        查询
                      </a-button>
                      <a-button type="primary" @click="resetList()" style="margin-left: 15px;">
                        重置
                      </a-button>
                     <a-button type="primary" @click="batchSetRolePermission()" style="margin-left: 15px;">
                       批量权限分配
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
                        :row-selection="rowSelection"
                       > 
                       <span slot="action" slot-scope="text,record,index">
                            <a  @click="$refs.propertyPowerVillageEdit.editAccount(record,iddd)">分配权限</a>
                       </span>
              </a-table>
        
          </a-card>
          
        <a-card  v-if="currentIndex == 2">
            <div class="all_menus" id="components_layout_menus">
                <p><strong>温馨提示：</strong>物业菜单默认会有首页，数据中心，控制台，新版收费，功能应用库</p>
                 <div >
                  <a-layout style="line-height: 40px;font-size: 25px;">
                    <a-layout-content>  <a-checkbox @change="checkAll" style="font-size: 18px;pfont-weight: bold;padding-left: 2px;" value="0" :checked="all_checked"> 全选 </a-checkbox></a-layout-content>
                  </a-layout>
                  
                  <a-layout style="line-height: 40px;" v-for="(item2,index2) in menus">
                      <a-layout-sider ><a-checkbox @change="check2All" style="font-size: 18px;pfont-weight: bold;padding-left: 2px;"  :value="item2.id" :checked="getCval(item2.ckey)" :ref="item2.ckey"  > {{item2.name}} </a-checkbox></a-layout-sider>
                      <a-layout>
                            <a-layout-content v-for="(item3,index3) in item2.child" >
                                <div class="sub1div" ><a-checkbox @change="check3All" :checked="getCval(item3.ckey)" :ref="item3.ckey" :value="item3.id" :id="'item0id:'+item2.id" > {{item3.name}} </a-checkbox></div>
                                <div class="sub2div" v-if="(item3.child && item3.child.length>0)" v-for="(item4,index4) in item3.child">
                                    <div class="sub2div_1div"><a-checkbox  @change="check4All" :value="item4.id"  :checked="getCval(item4.ckey)" :ref="item4.ckey"  :id="'item0id:'+item2.id+'-item1id:'+item3.id" > {{item4.name}} </a-checkbox></div>
                                    
                                      <div class="sub2div_2div" style="width: 100%;" v-if="(item4.child && item4.child.length>0)">
                                        
                                          <a-row style="width: 100%; display: flex; flex-wrap: wrap;">
                                            <a-col style="width: 33.3%; flex-shrink: 0;margin-bottom: 5px;" v-for="(item5,index5) in item4.child">
                                              <a-checkbox  :value="item5.id" @change="onGroupChange" :checked="getCval(item5.ckey)" :ref="item5.ckey"  :id="'item0id:'+item2.id+'-item1id:'+item3.id +'-item2id:'+item4.id">
                                                  {{item5.name}}
                                              </a-checkbox>
                                            </a-col>
                                          </a-row>
                                        
                                      </div>
                                    
                                </div>
                            </a-layout-content>
                      </a-layout>
           
                    </a-layout>
                </div>
            </div>
         </a-card> 
         
          <a-card :bordered="false" style="text-align: center;" >
              <a-button  type="primary" style="margin-top: 20px;" @click="handleSubmit()" :loading="loading">保存设置</a-button>
          </a-card>
        <property-power-village-edit ref="propertyPowerVillageEdit" />
    </a-drawer>
    
</template>
<script>
    import villageApi from '@/api/community/village'
    import { Collapse } from 'ant-design-vue';
    import propertyPowerVillageEdit from "@/views/community/property/power/propertyPowerVillageEdit";
    import moment from 'moment'
	import store from '@/store';
    const columns = [
            { title: '全选',  dataIndex: 'village_id', key: 'village_id'},
            { title: store.getters.config.house_name+'名称',  dataIndex: 'village_name', key: 'village_name'},
            { title: store.getters.config.house_name+'地址',  dataIndex: 'village_address', key: 'village_address'},
            { title: '分配权限',  dataIndex: '', key: '', scopedSlots: { customRender: 'action' }},
    ];
    const data = [];
    export default {
        name: 'propertyPowerEdit',
        filters: {

        },
        components:{
            propertyPowerVillageEdit,
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
            search: { keyword: '',province_id:"0",city_id:"0",area_id:"0",page: 1 },
                form: this.$form.createForm(this),
                pagination: {current:1, pageSize: 10, total:10 },
                visible: false,
                loading: false,
                data,
               columns,
               iddd:0,
               worker:{},
               currentIndex:0,
               dateFormat: 'YYYY-MM-DD HH:mm:ss',
               is_set_pwd:0,
               accountAisabled:false,
               is_edit_worker:true,
               menus:[],
               selectedRowKeys:[],
               post:{
                   account:'',
                   password:'',
                   realname:'',
                   phone:'',
                   remarks:'',
               },
               role:{},
               all_checked:false,
               mckeyArr:[],
               group_id:0,
               property_id:0,
               title:'',
               province_list:[],
               city_list:[],
               area_list:[],
               village_ids:[],
               opt_village_ids:[],
               is_edit_disabled:false,
               hw_id:0,
            };
        },
        activated () {

        },
        computed: {
            rowSelection() {
                //const  selected_row_keys  = this.selectedRowKeys;             //console.log('selected_row_keys',selected_row_keys);
                return {
                    selectedRowKeys:this.selectedRowKeys,
                    onChange: (selectedRowKeys, selectedRows) => {
                        console.log('selectedRowKeys',selectedRowKeys);
                        this.village_ids=selectedRowKeys;
                        this.selectedRowKeys=selectedRowKeys;
                    },
                    onSelect:(record, selected, selectedRows, nativeEvent)=>{
                        console.log('record,',record,'selected',selected);
                        if(record && record.village_id){
                            let findthat=false;
                            this.opt_village_ids.map((vv, ii)=>{
                                if(vv.village_id==record.village_id){
                                    findthat=true;
                                    this.opt_village_ids[ii].selected=selected;
                                };
                            });
                            if(!findthat){
                                this.opt_village_ids.push({village_id:record.village_id,selected:selected});
                            }
                        }
                        console.log('opt_village_ids,',this.opt_village_ids);
                    },
                    getCheckboxProps: (item) => {
                        let tmp_village_id= item.village_id;
                       return {
                            props: {
                                defaultChecked: this.selectedRowKeys.includes(tmp_village_id),
                                //defaultChecked: true
                            }
                          }
                    }
                }
            }
        },
        methods: {
            moment,
            editAccount(record){
                console.log('record',record);
                this.title='登录账号【'+record.account+'】编辑';
                this.is_edit_disabled=false;
                if(record.hw_id!=undefined && record.hw_id*1 >0){
                    this.is_edit_disabled=true;
                    this.hw_id= record.hw_id*1;
                }
                this.visible = true;
                this.iddd=record.id;
                this.worker=record;
                this.post.account=record.account;
                this.post.realname=record.realname;
                this.post.phone=record.phone;
                this.is_set_pwd=record.set_pwd*1;
                this.post.remarks=record.remarks ? record.remarks:'';
                this.group_id=record.group_id*1;
                this.mckeyArr=[];
                this.menus=[];
                this.data=[];
                this.all_checked=false;
                this.currentIndex=0;
                this.property_id=record.property_id;
                this.village_ids=[];
                if(record.menus.length>0){
                    let selected_row_keys=record.menus.split(',');
                    for(let ii=0;ii<selected_row_keys.length;ii++){
                        let vkv=selected_row_keys[ii]*1;
                        this.selectedRowKeys.push(vkv);
                        this.village_ids.push(vkv);
                    }
                    console.log('recordSelectedRowKeys',this.selectedRowKeys,'village_ids',this.village_ids);
                }
                this.opt_village_ids=[];
                if(record.account && record.account.length >0){
                    this.accountAisabled=true;
                }else {
                    this.accountAisabled=false;
                }
                this.is_edit_worker=true;
            },
            handleSelectChange(value, option){
                if(value==0 || value=='0' || !value ){
                    this.group_id=0;
                }else{
                    this.group_id=value*1;
                }
                
            },
            batchSetRolePermission(){
                if(this.selectedRowKeys.length<1){
                    this.$message.error('请至少勾选一个'+store.getters.config.house_name+'！');
                    return false;
                }
                let villageIds=this.selectedRowKeys.join(',');
                let tmpRecord={village_name:''};
                tmpRecord.village_id='0';
                tmpRecord.property_id=this.property_id;
                this.$refs.propertyPowerVillageEdit.editAccount(tmpRecord,this.iddd,villageIds)
            },
            onGroupChange(e){
                this.group_id=0;
                let idd=e.target.id;
                let iddObj=this.handleIdd(idd)
                let tm_checked=e.target.checked;
                let default_checked= e.target.defaultChecked;
                let tm_value=e.target.value;
                //this.optCheckedMenus(tm_value,tm_checked);
                if(tm_checked){
                    this.setCval(iddObj,true,3,tm_value);
                }else{
                    this.setCval(iddObj,false,3,tm_value);
                    this.all_checked=false;
                }
            },
            handleIdd(idstr){
                let iddArr=idstr.split('-');
                let iddTmp=[];
                for(let ii=0;ii<iddArr.length;ii++){
                    let tmpid=iddArr[ii].split(':');
                    iddTmp.push({'item_id':tmpid['0'],'item_id_v':tmpid['1']});
                }
                return iddTmp;
            },
            checkAll(ee){
                //整体全选
                this.group_id=0;
                let tm_checked=ee.target.checked;
                let default_checked= ee.target.defaultChecked;
                let tm_value=ee.target.value; 
                if(tm_checked){
                   this.all_checked=true;
                   this.mckeyArr.map((v, i)=>{
                          v.cv=true;
                   }); 
                }else{
                    this.all_checked=false;
                    this.mckeyArr.map((v, i)=>{
                        v.cv=false;
                    });
                }
            },
            check2All(ee){
                this.group_id=0;
                let tm_checked=ee.target.checked;
                let default_checked= ee.target.defaultChecked;
                let tm_value=ee.target.value; 
                 //this.optCheckedMenus(tm_value,tm_checked);
                 if(tm_checked){
                     this.setCval(null,true,0,tm_value);
                 }else{
                     this.setCval(null,false,0,tm_value);
                     this.all_checked=false;
                 }
            },
            check3All(ee){
                this.group_id=0;
                 let idd=ee.target.id;
                 let iddObj=this.handleIdd(idd)
                 let tm_checked=ee.target.checked;
                 let default_checked= ee.target.defaultChecked;
                 let tm_value=ee.target.value; 
                  //this.optCheckedMenus(tm_value,tm_checked);
                  if(tm_checked){
                      this.setCval(iddObj,true,1,tm_value);
                  }else{
                      this.setCval(iddObj,false,1,tm_value);
                      this.all_checked=false;
                  }
            },
            check4All(ee){
              this.group_id=0;
              let idd=ee.target.id;
              let iddObj=this.handleIdd(idd)
              let tm_checked=ee.target.checked;
              let default_checked= ee.target.defaultChecked;
              let tm_value=ee.target.value; 
               //this.optCheckedMenus(tm_value,tm_checked);
               if(tm_checked){
                   this.setCval(iddObj,true,2,tm_value);
               }else{
                   this.setCval(iddObj,false,2,tm_value);
                   this.all_checked=false;
               }
            },
            /*
            optCheckedMenus(cvv,opt){
                if(opt){
                    this.checkedMenus.push(cvv);
                }else{
                    let cindex=this.checkedMenus.findIndex((value)=>(value==cvv));
                    this.$delete(this.checkedMenus,cindex);
                }
                console.log('checkedMenus',this.checkedMenus);
            },
            */
            handleSubmit() {
                if(this.currentIndex==1){
                    //权限提交
                    let postArr={};
                    postArr.xtype=1;
                    postArr.id=this.iddd;
                    postArr.menus_village='';
                    
                    let tmp_village_ids=[];
                    tmp_village_ids=this.village_ids;
                    const tmpVArr = new Set(tmp_village_ids);
                    tmp_village_ids=Array.from(tmpVArr);
                    
                    if(this.opt_village_ids.length>0){
                        this.opt_village_ids.map((vv, ii)=>{
                            if(vv.village_id && !vv.selected){
                                 let v_id=vv.village_id*1;
                                 let index=tmp_village_ids.findIndex(item=>item == v_id)
                                 console.log('index',index,'v_id',v_id);
                                 if(index>-1){
                                     tmp_village_ids.splice(index,1)
                                 }
                            }else if(vv.village_id && vv.selected){
                                tmp_village_ids.push(vv.village_id);
                            }
                        });
                    }
                    console.log('tmp_village_ids',tmp_village_ids);
                    if(tmp_village_ids.length>0){
                        const tmpVArr = new Set(tmp_village_ids);
                        tmp_village_ids=Array.from(tmpVArr);
                        postArr.menus_village=tmp_village_ids.join(',');
                    }
                    
                    this.loading = true;
                    this.request(villageApi.savePropertyEdit,postArr)
                        .then((res) => {
                            this.loading = false
                            this.$message.success('保存成功!');
                                setTimeout(() => {
                                  this.form = this.$form.createForm(this)
                                  this.visible = false;
                                  this.is_edit_worker=false;
                                  this.worker={};
                                  this.iddd=0;
                                  this.data=[];
                                  this.menus=[];
                                  this.search={ keyword: '',province_id:"0",city_id:"0",area_id:"0",page: 1 };
                                  this.selectedRowKeys=[];
                                  this.$emit('ok')
                                }, 1500)
                        }).catch(error => {
                            this.loading = false
                        })
                }else if(this.currentIndex==0){
                    if(!this.post.account || this.post.account.length<1){
                        this.$message.error('请输入登录账号!');
                        return false;
                    }
                    if(this.is_set_pwd==0 && (!this.post.password || this.post.account.password<1)){
                        this.$message.error('请输入登录密码!');
                        return false;
                    }
                    if(!this.post.phone || this.post.phone.length<1){
                        this.$message.error('请输入手机号码!');
                        return false;
                    }
                    let phoneReg =/^1[23456789]\d{9}$/
                    if(!phoneReg.test(this.post.phone)){
                        this.$message.error('手机号格式不正确！');
                         return false;
                    }
                    if(!this.post.realname || this.post.realname.length<1){
                        this.$message.error('请输入姓名!');
                        return false;
                    }
                    this.post.id=this.iddd;
                    this.post.xtype=0;
                    this.loading = true;
                    this.request(villageApi.savePropertyEdit,this.post)
                        .then((res) => {
                            this.loading = false
                           if(res.is_haved_account && res.is_haved_account==1){
                               this.accountAisabled=false;
                               this.$message.error('此账号【'+this.post.account+'】已经存在了，请修改！');
                           }else if(res.is_haved_phone && res.is_haved_phone==1){
                               this.$message.error('此手机号【'+this.post.phone+'】已经存在了，请修改！');
                           }else{
                               this.$message.success('保存成功!');
                               setTimeout(() => {
                                 this.form = this.$form.createForm(this)
                                 this.visible = false;
                                 this.is_edit_worker=false;
                                 this.record={};
                                 this.iddd=0;
                                 this.menus=[];
                                 this.search={ keyword: '',province_id:"0",city_id:"0",area_id:"0",page: 1 };
                                 this.post={
                                     account:'',
                                     password:'',
                                     realname:'',
                                     phone:'',
                                     remarks:'',
                                 },
                                 this.selectedRowKeys=[];
                                 this.$emit('ok')
                               }, 1500)
                           }
                        }).catch(error => {
                            this.loading = false
                        })
                    }else if(this.currentIndex==2){
                        //物业权限设置权限提交
                        let postArr={};
                        postArr.xtype=2;
                        postArr.id=this.iddd;
                        postArr.menus_property='';
                        let menusTmpArr=[];
                        this.mckeyArr.map((vv, ii)=>{
                            if(vv.cv){
                                menusTmpArr.push(vv.id);
                            };
                        });
                        if(menusTmpArr.length>0){
                            postArr.menus_property=menusTmpArr.join(',');
                        }
                        this.loading = true;
                        this.request(villageApi.savePropertyEdit,postArr)
                            .then((res) => {
                                this.loading = false
                                this.$message.success('保存成功!');
                                    setTimeout(() => {
                                      this.form = this.$form.createForm(this)
                                      this.visible = false;
                                      this.is_edit_worker=false;
                                      this.worker={};
                                      this.iddd=0;
                                      this.menus=[];
                                      this.search={ keyword: '',province_id:"0",city_id:"0",area_id:"0",page: 1 };
                                      this.selectedRowKeys=[];
                                      this.$emit('ok')
                                    }, 1500)
                            }).catch(error => {
                                this.loading = false
                            })
                    }
            },
            validateInput(e){
                let xv=e.target.value;
                let t_name=e.target.name;
                 console.log('name', t_name);
                 console.log('value', xv);
                  xv=xv.trim();
                if(!this.is_edit_worker){
                      return false;
                }
                if(this.currentIndex!=0){
                    return false;
                }
                if(t_name=='account'){
                        if(!xv || xv.length<1){
                            this.$message.error('请输入登录账号!');
                            e.target.focus();
                            return false;
                        }
                        let accountReg = /^[A-Za-z0-9_]+$/
                        if(!this.accountAisabled && !accountReg.test(xv)){
                            this.$message.error('登录账号必须是英文大小写字母、数字、下划线组成');
                            e.target.focus();
                             return false;
                        }
                        if(!this.accountAisabled && xv.length<3){
                            this.$message.error('请保持登录账号长度至少3位以上!');
                            e.target.focus();
                             return false;
                        }
                     if(!this.accountAisabled && xv.length>90){
                         this.$message.error('登录账号长度太长了，请小于90个字符！');
                         e.target.focus();
                         return false;
                     }
                     this.post.account=xv;
                }else if(t_name=='password'){
                    if(this.is_set_pwd==0 && (!xv || xv.length<1)){
                           this.$message.error('请输入登录密码!');
                           e.target.focus();
                           return false;
                       }
                       let accountReg = /^[A-Za-z0-9_]+$/
                       if(xv.length>0 && !accountReg.test(xv)){
                           this.$message.error('登录密码必须是英文大小写字母、数字、下划线组成');
                           e.target.focus();
                            return false;
                       }
                       if(xv.length>0 && xv.length<3){
                           this.$message.error('请保持登录密码长度至少3位以上!');
                           e.target.focus();
                            return false;
                       }
                    if(xv.length>0 && xv.length>32){
                        this.$message.error('登录密码长度太长了，请小于32个字符！');
                        e.target.focus();
                         return false;
                    }
                    if(xv){
                        this.post.password=xv;
                    }
                }else if(t_name=='realname'){
                    if(!xv || xv.length<1){
                        this.$message.error('请输入姓名!');
                        e.target.focus();
                        return false;
                    }
                    if(xv.length>10){
                        this.$message.error('您输入的姓名长度太长了，请小于10个字符！');
                        e.target.focus();
                         return false;
                    }
                    this.post.realname=xv;
                }else if(t_name=='phone'){
                    if(!xv || xv.length<1){
                        this.$message.error('请输入手机号!');
                        e.target.focus();
                        return false;
                    }
                    let phoneReg =/^1[23456789]\d{9}$/
                    if(!phoneReg.test(xv)){
                        this.$message.error('请输入正确的手机号格式！');
                        e.target.focus();
                         return false;
                    }
                    this.post.phone=xv;
                }
            },
            //获取物业小区
            getPropertyvillage(){
                this.search.page = this.pagination.current;
                this.search.id=this.worker.id;
                this.search.property_id=this.property_id;
                    this.request(villageApi.getPropertyvillage, this.search)
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
                handleSelectProvince(value, option){
                    this.city_list=[];
                    this.area_list=[];
                    this.search.city_id='0';
                    this.search.area_id="0"
                    if(value==0 || value=='0' || !value ){
                        this.search.province_id='0';
                    }else{
                        this.search.province_id=value;
                        this.getProvinceCityAreas(1,this.search.province_id);
                    }
                    
                },
                handleSelectCity(value, option){
                    this.area_list=[];
                    this.search.area_id="0"
                    if(value==0 || value=='0' || !value ){
                        this.search.city_id='0';
                    }else{
                        this.search.city_id=value;
                        this.getProvinceCityAreas(2, this.search.city_id);
                    }
                },
                handleSelectArea(value, option){
                    if(value==0 || value=='0' || !value ){
                        this.search.area_id="0";
                    }else{
                        this.search.area_id=value;
                    }
                },
            // 获取列表信息
            getRolePermissionMenus() {
                let postRole={id:this.iddd};
                this.request(villageApi.getPropertyRolePermission, postRole)
                    .then((res) => {
                        this.mckeyArr=res.mckeyArr;
                        this.menus = res.menus;
                    })
            },
            getCval(ckey){
                let is_checked=false;
                this.mckeyArr.map((v, i)=>{
                    if(ckey==v.ckey){
                       is_checked= v.cv;
                    }
                });
                console.log('ckey', ckey+'=>'+is_checked);
                return is_checked;
            },
            setCval(ids,cvl,level,thisid){
                if(level>=0){
                    //处理自生和子菜单
                    let tmp_level=level;
                    let ckey2index='key_'+tmp_level+'_'+thisid;
                    let last_f_index='';
                    let last_f_ckey=-1;
                    let ckeyArr={};
                    this.mckeyArr.map((v, i)=>{
                        //本身
                        if(ckey2index==v.ckey){
                            ckeyArr=v;
                            v.cv=cvl;
                            if(v.ckey2!=undefined){
                                last_f_index=v.ckey2;
                                last_f_ckey=2;
                            }else if(v.ckey1!=undefined){
                                last_f_index=v.ckey1;
                                last_f_ckey=1;
                            }else if(v.ckey0!=undefined){
                                last_f_index=v.ckey0;
                                last_f_ckey=0;
                            }
                            
                        }
                        //最后一层子节点
                        if(ckey2index==v.ckey2){
                           v.cv=cvl;
                        }
                        //最后子节点的上一层福节点
                        if(ckey2index==v.ckey1){
                            v.cv=cvl;
                        }
                         //最后子节点的上上一层福节点
                         if(ckey2index==v.ckey0){
                             v.cv=cvl;
                         }   
                    });
                    let handle_f_check=true;
                    if(!ids||ids===null||ids.length<1){
                        handle_f_check=false;
                    }
                    //处理父菜单
                    if(level>0 && !cvl){
                        //最后的子节点处理
                        this.mckeyArr.map((v, i)=>{
                            if(last_f_ckey==2 && last_f_index==v.ckey2 && v.cv){
                                //只要有一个子节点是 true
                                handle_f_check=false;
                            }else if(last_f_ckey==1 && last_f_index==v.ckey1 && v.cv){
                                //只要有一个子节点是 true
                                handle_f_check=false;
                            }else if(last_f_ckey==0 && last_f_index==v.ckey0 && v.cv){
                                //只要有一个子节点是 true
                                handle_f_check=false;
                            }
                        });
                    }
                    
                    if(handle_f_check && level>0){ 
                        level=level-1;
                        for (let mc = level; mc >=0; mc--) {
                            let tmp_item_id='item'+mc+'id';
                            //console.log('tmp_item_id', tmp_item_id);
                            let item_id=0;
                            ids.map((ivv,ii)=>{
                                if(ivv.item_id==tmp_item_id){
                                     item_id=ivv.item_id_v;
                                }
                            });
                            //console.log('item_id', item_id);
                            let ckeyindex='key_'+mc+'_'+item_id;
                            
                            if(!cvl){
                              if(mc==0){
                                  let tmp_ckey0=false;
                                  this.mckeyArr.map((v, i)=>{
                                      if(ckeyindex==v.ckey0 && v.cv){
                                          console.log('tmp_ckey0', v);
                                         tmp_ckey0=true;
                                      }
                                  });
                                  
                                  if(!tmp_ckey0){
                                      this.mckeyArr.map((v, i)=>{
                                          if(ckeyindex==v.ckey){
                                             v.cv=cvl;
                                          }
                                      });
                                  }  
                              }else if(mc==1){
                                  let tmp_ckey1=false;
                                  this.mckeyArr.map((v, i)=>{
                                      if(ckeyindex==v.ckey1 && v.cv){
                                           console.log('tmp_ckey1', v);
                                         tmp_ckey1=true;
                                      }
                                  });
                                  if(!tmp_ckey1){
                                      this.mckeyArr.map((v, i)=>{
                                          if(ckeyindex==v.ckey){
                                             v.cv=cvl;
                                          }
                                      });
                                  }
                              }else if(mc==2){
                                  let tmp_ckey2=false;
                                  this.mckeyArr.map((v, i)=>{
                                      if(ckeyindex==v.ckey2 && v.cv){
                                         tmp_ckey2=true;
                                      }
                                  });
                                  if(!tmp_ckey2){
                                      this.mckeyArr.map((v, i)=>{
                                          if(ckeyindex==v.ckey){
                                             v.cv=cvl;
                                          }
                                      });
                                  }
                              }
                            }else{
                                this.mckeyArr.map((v, i)=>{
                                    if(ckeyindex==v.ckey){
                                       v.cv=cvl;
                                    }
                                });
                            }
                        }
                    }
                    //console.log('mckeyArr', this.mckeyArr);
                }
            },
            changeXTab(index){

                this.currentIndex = index
                if(this.currentIndex==0){
                    
                } else if(this.currentIndex==1) {
                    if(this.data.length<1){
                      this.pagination.current=1;
                       this.getPropertyvillage();
                    }
                    this.getProvinceCityAreas(0,0);
                }else if(this.currentIndex==2){
                    if(this.menus.length<1){
                        this.getRolePermissionMenus();
                    }
                }
            },
            handleCancel() {
              this.is_edit_worker=false;
              this.visible = false;
              this.worker={};
              this.iddd=0;
              this.menus=[];
              this.currentIndex=0;
              this.selectedRowKeys=[];
              this.data=[];
              this.opt_village_ids=[];
              this.village_ids=[];
              this.search={ keyword: '',province_id:"0",city_id:"0",area_id:"0",page: 1 };
              this.post={
                  account:'',
                  password:'',
                  realname:'',
                  phone:'',
                  remarks:'',
              },
              this.hw_id=0;
              setTimeout(() => {
                this.form = this.$form.createForm(this)
              }, 500)
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
                this.search={ keyword: '',province_id:"0",city_id:"0",area_id:"0",page: 1 };
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