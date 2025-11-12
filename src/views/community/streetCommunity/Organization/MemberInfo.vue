<template>
  <a-drawer   :title="title" :width="1200" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"   @close="handleCancel">
      <a-card :bordered="false">
       <div v-if="currentIndex == 0">
        <a-button  type="primary" @click="changeXTab(0)" style="margin-right: 30px"> 基本信息</a-button>
        <a-button v-if="$store.getters.config && worker_id>0" type="default" @click="changeXTab(1)" style="margin-right: 30px">{{$store.getters.config.house_name}}权限设置</a-button>
        <a-button  type="default" @click="changeXTab(2)" style="margin-right: 30px" v-if="worker_id>0" >街道社区权限设置</a-button>
        </div>
        <div v-else-if="currentIndex == 1">
        <a-button   type="default" @click="changeXTab(0)" style="margin-right: 30px">基本信息</a-button>
        <a-button v-if="$store.getters.config && worker_id>0" type="primary" @click="changeXTab(1)" style="margin-right: 30px">{{$store.getters.config.house_name}}权限设置</a-button>
        <a-button  type="default" @click="changeXTab(2)" style="margin-right: 30px" v-if="worker_id>0">街道社区权限设置</a-button>
        </div>
        <div v-else>
        <a-button   type="default" @click="changeXTab(0)" style="margin-right: 30px">基本信息</a-button>
        <a-button v-if="$store.getters.config && worker_id>0" type="default" @click="changeXTab(1)" style="margin-right: 30px">{{$store.getters.config.house_name}}权限设置</a-button>
        <a-button  type="primary" @click="changeXTab(2)" style="margin-right: 30px" v-if="worker_id>0" >街道社区权限设置</a-button>
        </div>
      </a-card>
      
    <a-card :spinning="confirmLoading"  :height="800" v-if="currentIndex == 0">
      <a-form :form="form">
         <a-col :span="12">
        <a-form-item label="编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input :disabled="is_edit" placeholder="请输入工号" v-decorator="['work_num', {initialValue:detail.work_num}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input :disabled="is_edit" placeholder="请输入姓名,最多6个字" :maxLength="6" v-decorator="['work_name', {initialValue:detail.work_name,rules: [{required: true, message: '请输入姓名！'},{max:8, message: '姓名最多6个字！'}]}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="手机号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input :disabled="is_edit" placeholder="请输入手机号码" v-decorator="['work_phone', {initialValue:detail.work_phone,rules: [{required: true, message: '请输入手机号码！'}]}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="身份证号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input :disabled="is_edit" placeholder="请输入身份证号" v-decorator="['work_id_card', {initialValue:detail.work_id_card}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="住址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input :disabled="is_edit" placeholder="请输入住址" v-decorator="['work_addr', {initialValue:detail.work_addr}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="头像" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-row>
              <div>
                <a-upload
                  name="img"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :show-upload-list="false"
                  :action="upload_url"
                  :disabled="is_edit"
                  :before-upload="beforeUpload"
                  @change="handleChange"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="imgname" alt="img" style="height: 120px;width: 120px" />
                  <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">
                      上传
                    </div>
                  </div>
                </a-upload>
                <div>建议尺寸：295*412px</div>
              </div>
            </a-row>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
         <div v-if="party_member_show*1>0">
            <a-form-item label="是否是党员" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="18">
                <a-radio-group v-model="detail.is_party_member" :disabled="is_edit">
                  <a-radio :value="1">是</a-radio>
                  <a-radio :value="0">否</a-radio>
                </a-radio-group>
              </a-col>
              <a-col :span="6">
              </a-col>
            </a-form-item>
            <a-form-item label="入党时间" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="detail.is_party_member*1>0">
              <a-col :span="18">
                  <a-date-picker :disabled="is_edit" v-if="detail.join_party_time" placeholder="请选择入党时间" :value="moment(detail.join_party_time, dateFormat)" @change="onDatePartyChange"></a-date-picker>
                  <a-date-picker v-else  :disabled="is_edit" placeholder="请选择入党时间"  @change="onDatePartyChange"></a-date-picker>
              </a-col>
              <a-col :span="6">
              </a-col>
            </a-form-item>
        </div>
   </a-col>
          
    <a-col :span="12">
        <a-form-item label="所属部门" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-select
              :disabled="is_edit"
              mode="multiple"
              placeholder="请选择所属部门"
              v-model="selectedItems"
              style="width: 100%"
              @change="handleChangeSelect"
            >
              <a-select-option v-for="(v,k)  in organizationList" :key="String(v.id)">
                {{ v.name }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="职务" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input :disabled="is_edit" placeholder="请输入职务" v-decorator="['work_job', {initialValue:detail.work_job}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>


        <div v-if="is_openid">
            <a-form-item label="微信昵称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-col :span="18">
                    <a-input :disabled="true" v-model="detail.nickname"/>
                </a-col>
                <a-col :span="6">
                </a-col>
            </a-form-item>
          <a-form-item label="微信头像" v-if="is_avatar" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <img :src="is_avatar" width="80px"/>
          </a-form-item>

            <a-form-item label="取消绑定" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-col :span="18">
                    <a-tag  color="#1890FF" style="padding: 5px;cursor: pointer" @click="clickCancel(worker_id)"> 点击取消绑定微信</a-tag>
                </a-col>
            </a-form-item>

      </div>
      <a-form-item label="绑定微信" v-if="worker_id>0" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
              <a-tag  color="#1890FF" style="padding: 5px;cursor: pointer" @click="getRecognition(worker_id)"> 点击绑定微信</a-tag>
          </a-col>
      </a-form-item>

        <a-form-item label="是否是事件处理人员" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-radio-group v-decorator="['is_handle_event',{initialValue:detail.is_handle_event}]" >
              <a-radio :value="1">是</a-radio>
              <a-radio :value="2">否</a-radio>
            </a-radio-group>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="入职时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
              <a-date-picker v-if="detail.entry_time" :disabled="is_edit" placeholder="请选择入职时间" :value="moment(detail.entry_time, dateFormat)" @change="onDateChange"></a-date-picker>
            <a-date-picker v-else :disabled="is_edit" placeholder="请选择入职时间"  @change="onDateChange"></a-date-picker>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input :disabled="is_edit" placeholder="请输入登录账号" v-decorator="['work_account', {initialValue:detail.work_account}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input :disabled="is_edit" placeholder="请输入登录密码" v-decorator="['work_passwd', {initialValue:detail.work_passwd}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input :disabled="is_edit" placeholder="请输入内容" v-decorator="['remark', {initialValue:detail.remark}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
       
        <a-form-item label="所属党支部" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="detail.is_party_member*1>0">
              <a-col :span="18">
              <a-select
                      show-search
                      placeholder="请选择所属党支部"
                      v-model="detail.party_id"
                      :disabled="is_edit"
              >
                <a-select-option :value="item.id" v-for="(item,index) in party_branchs" :key="index">
                  {{item.name}}
                </a-select-option>
              </a-select>
              </a-col>
              <a-col :span="6">
              </a-col>
        </a-form-item>
       
        </a-col>
      </a-form>
    </a-card>
    
    <a-card  :spinning="confirmLoading" v-if="currentIndex == 1">
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
					v-if="$store.getters.config"
                    style="width: 200px"
                    :placeholder="'请输入'+$store.getters.config.house_name+'名称'"
                    autocomplete="off"
                    v-model="search.keyword"/>
                </a-col>
                <a-col :span="18" style="padding-left: 10px;padding-bottom: 15px;width: 200px;">
                  <a-button type="primary" icon="search" @click="searchList()">
                    查询
                  </a-button>
                  <a-button type="primary" @click="resetList()" style="margin-left: 15px;" v-if="!is_edit">
                    重置
                  </a-button>
                 
                </a-col>
            </a-row>
        </div>
          <a-table :columns="columns"
                   :data-source="data"
                   :pagination="pagination"
                    class="components-table-demo-nested"
                    :loading="loading"
                    :row-key="record => record.village_id"
                    :row-selection="rowSelection"
                   > 
          </a-table>
   </a-card>
   
   <a-card :spinning="confirmLoading"  v-if="currentIndex == 2">
        <div class="all_menus" id="components_layout_menus">
            <p><strong>温馨提示：</strong>街道菜单默认会有首页</p>
             <div >
              <a-layout style="line-height: 40px;font-size: 25px;">
                <a-layout-content>  <a-checkbox @change="checkAll" style="font-size: 18px;pfont-weight: bold;padding-left: 2px;" value="0" :checked="all_checked" :disabled="is_edit" > 全选 </a-checkbox></a-layout-content>
              </a-layout>
              
                  <a-layout style="line-height: 40px;" v-for="(item2,index2) in menus">
                      <a-layout-sider ><a-checkbox @change="check2All" style="font-size: 18px;pfont-weight: bold;padding-left: 2px;"  :value="item2.id" :checked="getCval(item2.ckey)" :ref="item2.ckey"  :disabled="is_edit" > {{item2.name}} </a-checkbox></a-layout-sider>
                      <a-layout>
                            <a-layout-content v-for="(item3,index3) in item2.child" >
                                <div class="sub1div" ><a-checkbox @change="check3All" :checked="getCval(item3.ckey)" :ref="item3.ckey" :value="item3.id" :id="'item0id:'+item2.id" :disabled="is_edit" > {{item3.name}} </a-checkbox></div>
                                <div class="sub2div" v-if="(item3.child && item3.child.length>0)" v-for="(item4,index4) in item3.child">
                                    <div class="sub2div_1div"><a-checkbox  @change="check4All" :value="item4.id"  :checked="getCval(item4.ckey)" :ref="item4.ckey"  :id="'item0id:'+item2.id+'-item1id:'+item3.id" :disabled="is_edit" > {{item4.name}} </a-checkbox></div>
                                    
                                      <div class="sub2div_2div" style="width: 100%;" v-if="(item4.child && item4.child.length>0)">
                                        
                                          <a-row style="width: 100%; display: flex; flex-wrap: wrap;">
                                            <a-col style="width: 33.3%; flex-shrink: 0;margin-bottom: 5px;" v-for="(item5,index5) in item4.child">
                                              <a-checkbox  :value="item5.id" @change="onGroupChange" :checked="getCval(item5.ckey)" :ref="item5.ckey"  :id="'item0id:'+item2.id+'-item1id:'+item3.id +'-item2id:'+item4.id" :disabled="is_edit" >
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
   
    <a-card :bordered="false" style="text-align: center;margin-top: 10px;">
        <a-button  type="primary" style="margin-right: 50px;" @click="handleSubmit()" :loading="loading" v-if="is_footer">保存设置</a-button>
        <a-button  type="default" @click="handleCancel()"> 取 消 </a-button>
    </a-card>

      <a-modal :width="500" title="扫描二维码绑定微信号" :visible="visible_img" :maskClosable=false :confirm-loading="confirmLoading" @ok="handleImgCancel" @cancel="handleImgCancel">
          <div class="modal_box">
              <div class="flex_text_box margin_top_10">
                  <img :src="srcUrl" v-if="srcUrl">
                  <p  v-if="img_errmsg">{{img_errmsg}}</p>
              </div>
          </div>
      </a-modal>
  </a-drawer>

</template>

<script>
    let timer_2 = null;
    import streetCommunityApi from '@/api/community/streetCommunity'
    import common from '@/utils/variable'
    import moment from 'moment';
    import { Modal } from 'ant-design-vue';
	import store from '@/store';
    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    const columns = [
            { title: '全选',  dataIndex: 'village_id', key: 'village_id'},
            { title: store.getters.config.house_name+'名称',  dataIndex: 'village_name', key: 'village_name'},
            { title: store.getters.config.house_name+'地址',  dataIndex: 'village_address', key: 'village_address'},
    ];
    export default {
        name:'MemberInfo',
        data() {
            this.dateFormat='YYYY-MM-DD';
            return {
                upload_url: '/v20/public/index.php/' + streetCommunityApi.uploadMeeting,
                title: '新建',
                labelCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 7
                    }
                },
                wrapperCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 13
                    }
                },
                visible: false,
                is_edit:false,
                confirmLoading: false,
                loading:false,
                search: { keyword: '',province_id:"0",city_id:"0",area_id:"0",page: 1 },
                pagination: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '30', '50'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                form: this.$form.createForm(this),
                detail: {
                    worker_id: 0,
                    work_num: '',
                    work_name: '',
                    work_phone: '',
                    work_id_card: '',
                    work_addr: '',
                    work_head: '',
                    organization_ids: '',
                    work_job: '',
                    is_handle_event: 1,
                    entry_time: '',
                    work_account: '',
                    work_passwd: '',
                    remark: '',
                    area_id: '',
                    is_party_member:0,
                    join_party_time:'',
                    party_id:0,
                },
                data:[],
                columns,
                previewVisible: false,
                previewImage: '',
                dateFormat:'YYYY-MM-DD',
                imageUrl: '',
                is_null: ':footer="null"',
                img:'',
                branch_id:0,
                selectedItems:[],
                organization_ids:'',
                organizationList:[],
                worker_id:0,
                is_handle_event:1,
                is_footer:true,
                currentIndex:0,
                province_list:[],
                city_list:[],
                area_list:[],
                menus:[],
                selectedRowKeys:[],
                all_checked:false,
                mckeyArr:[],
                village_ids:[],
                opt_village_ids:[],

                srcUrl:'',
                img_errmsg:'',
                visible_img: false,
                is_openid:false,
                is_avatar:'',
                party_member_show:0,
                party_branchs:[{id: 0, name: "请选择所属党支部"}],
            }
        },
        mounted() {

        },
        activated () {
        
        },
        computed: {
            rowSelection() {
                const  selected_row_keys  = this.selectedRowKeys;             //console.log('selected_row_keys',selected_row_keys);
                return {
                    onChange: (selectedRowKeys, selectedRows) => {
                        console.log('selectedRowKeys',selectedRowKeys);
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
                                defaultChecked: selected_row_keys.includes(tmp_village_id),
                                //defaultChecked: true
                                disabled:this.is_edit
                            }
                          }
                    }
                }
            }
        },
        methods: {
            moment,
            // 处理时间
            date_moment(time, dateFormat) {
                if (!time) {
                    return ''
                }
                return moment(time, dateFormat);
            },
            onDateChange(date, dateString) {
                this.detail.entry_time = dateString;
            },
            onDatePartyChange(date, dateString){
                this.detail.join_party_time = dateString;
            },
            handleChangeSelect(value) {
                this.organization_ids = value;
                this.selectedItems = value;
                console.log('res',value);
            },
            changeXTab(index){
                this.currentIndex = index
                if(this.currentIndex==0){
                    
                } else if(this.currentIndex==1) {
                    if(this.data.length<1){
                       this.getStreetVillages();
                       this.getProvinceCityAreas(0,0);
                    }
                }else if(this.currentIndex==2){
                    if(this.menus.length<1){
                        this.getRolePermissionMenus();
                    }
                }
            },
            onTableChange(page,pageSize){
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.getStreetVillages()
                console.log('onTableChange==>', page, pageSize)
            },
            add(branch_id,xparam) {
                this.is_footer = true;
                this.is_edit = false;
                this.title = '添加';
                this.visible = true
                this.branch_id = branch_id;
                this.worker_id = 0;
                this.imageUrl = '';
                this.currentIndex=0;
                this.selectedRowKeys=[];
                this.mckeyArr=[];
                this.menus=[];
                this.city_list=[];
                this.area_list=[];
                this.search= { keyword: '',province_id:"0",city_id:"0",area_id:"0",page: 1 };
                this.village_ids=[];
                this.data=[];
                this.pagination.current = 1
                this.pagination.pageSize = 10
                this.party_member_show=0;
                this.opt_village_ids=[];
                this.detail = {
                    worker_id: 0,
                    work_num: '',
                    work_name: '',
                    work_phone: '',
                    work_id_card: '',
                    work_addr: '',
                    work_head: '',
                    organization_ids: '',
                    work_job: '',
                    is_handle_event: 1,
                    entry_time: '',
                    work_account: '',
                    work_passwd: '',
                    remark: '',
                    area_id: '',
                    is_party_member:0,
                    join_party_time:'',
                    party_id:0,
                }
                this.selectedItems = [];
                if(branch_id != 0){
                    this.selectedItems.push(branch_id);
                }
                if(xparam && xparam.party_member_show!=undefined){
                    this.party_member_show=xparam.party_member_show;
                }
                if(this.party_member_show){
                    this.getPartyBranchs()
                }
                this.organization_ids = branch_id;
                this.getTissueList();
            },
            edit(worker_id,branch_id=0,xparam) {
                this.mckeyArr=[];
                this.menus=[];
                this.city_list=[];
                this.area_list=[];
                this.search= { keyword: '',province_id:"0",city_id:"0",area_id:"0",page: 1 };
                this.selectedRowKeys=[];
                this.village_ids=[];
                this.data=[];
                this.opt_village_ids=[];
                this.pagination.current = 1
                this.pagination.pageSize = 10
                this.party_member_show=0;
                this.currentIndex=0;
                if(branch_id)
                    this.is_footer = true;
                else
                    this.is_footer = false;
                if(branch_id == 0){
                    this.is_edit = true;
                }else{
                    this.is_edit = false;
                }
                this.visible = true;
                this.worker_id = worker_id;
                if(xparam && xparam.party_member_show!=undefined){
                    this.party_member_show=xparam.party_member_show;
                }
                this.getEditInfo();
                if (this.worker_id > 0) {
                    this.title = '编辑'
                } else {
                    this.title = '添加'
                }
                if(branch_id == 0){
                    this.title = '查看';
                }
                this.branch_id = branch_id;
                if(this.party_member_show){
                    this.getPartyBranchs()
                }
                this.getTissueList();
            },
            handleSubmit() {
                if(this.currentIndex==0){
                    this.handleSubmitBasic();
                }else if(this.currentIndex==1 || this.currentIndex==2){
                    let postArr={};
                    if(this.currentIndex==1){
                        //街道人员 小区
                        postArr.xtype=1;
                        postArr.worker_id=this.worker_id;
                        postArr.village_ids='';
                        let tmp_village_ids=[];

                        tmp_village_ids=this.village_ids;
                        const tmpVArr = new Set(tmp_village_ids);
                        tmp_village_ids=Array.from(tmpVArr);
                        console.log('tmp_village_ids',tmp_village_ids);
                        if(this.opt_village_ids.length>0){
                            this.opt_village_ids.map((vv, ii)=>{
                                if(vv.village_id && !vv.selected){
                                     let v_id=vv.village_id*1;
                                     let index=tmp_village_ids.findIndex(item=>item == v_id)
                                     console.log('index',index,'v_id',v_id);
                                     if(index>-1){
                                         tmp_village_ids.splice(index,1)
                                     }
                                };
                            });
                        }
                        if(this.selectedRowKeys.length>0){
                            this.selectedRowKeys.map((vv, ii)=>{
                                tmp_village_ids.push(vv);
                            }); 
                        }
                        if(tmp_village_ids.length>0){
                            const tmpVArr = new Set(tmp_village_ids);
                            tmp_village_ids=Array.from(tmpVArr);
                            postArr.village_ids=tmp_village_ids.join(',');
                        }
                    }else{
                        //街道权限设置权限提交
                         postArr.xtype=2;
                         postArr.worker_id=this.worker_id;
                         postArr.menus='';
                         let menusTmpArr=[];
                         this.mckeyArr.map((vv, ii)=>{
                             if(vv.cv){
                                 menusTmpArr.push(vv.id);
                             };
                         });
                         if(menusTmpArr.length>0){
                             postArr.menus=menusTmpArr.join(',');
                         }
                    }
                    this.confirmLoading= true;
                    this.loading = true;
                    this.request(streetCommunityApi.saveStreetRolePermission,postArr)
                        .then((res) => {
                            this.loading = false
                            this.confirmLoading= false;
                            this.$message.success('保存成功!');
                        }).catch(error => {
                            this.loading = false
                            this.confirmLoading= false;
                        })
                }else{

               } 
            },
            handleSubmitBasic() {
                const {
                    form: {
                        validateFields
                    }
                } = this
                this.confirmLoading = true
                this.loading = true;
                validateFields((errors, values) => {
                    if (!errors) {
                        values.worker_id= this.worker_id;
                        values.work_head= this.img;
                        if(this.detail.entry_time != null){
                            values.entry_time = (new Date(this.detail.entry_time)).getTime()/1000;
                        }
                        if(this.organization_ids){
                            values.organization_ids = this.organization_ids+',';
                        }else{
                            values.organization_ids = this.branch_id;
                        }
                        values.is_party_member=this.detail.is_party_member;
                        values.party_id=this.detail.party_id;
                        values.join_party_time=this.detail.join_party_time;
                        if(this.worker_id > 0)
                            var url = streetCommunityApi.saveStreetWorker;
                        else
                            var url = streetCommunityApi.subMemberBranch;
                        this.request(url, values)
                            .then((res) => {
                                if (this.worker_id>0) {
                                    this.$message.success('编辑成功')
                                } else {
                                    this.worker_id=res.worker_id;
                                    this.detail.worker_id=res.worker_id;
                                    this.$message.success('添加成功')
                                }
                                setTimeout(() => {
                                    this.form = this.$form.createForm(this)
                                    this.visible = false
                                    this.confirmLoading = false
                                    this.loading = false;
                                    this.$emit('ok', values)
                                }, 1500)
                            })
                            .catch((error)=>{
                                this.confirmLoading = false
                                this.loading = false;
                            })

                        console.log('values', values)

                    } else {
                        this.confirmLoading = false
                        this.loading = false;
                    }
                })
            },
            //获取类型
            getPartyBranchs(){
              this.request(streetCommunityApi.getPartyBranchAll).then((res) => {
                    this.party_branchs=[{id: 0, name: "请选择所属党支部"},...res];
                }).catch((error)=>{
                    this.party_branchs=[{id: 0, name: "请选择所属党支部"}];
               })
            },
            //获取物业小区
            getStreetVillages(){
                this.search.page = this.pagination.current;
                this.search.limit = this.pagination.pageSize;
                this.search.street_id=this.branch_id;
                    this.request(streetCommunityApi.getStreetVillages, this.search)
                        .then((res) => {
                            this.data=res.list;
                            this.pagination.total = res.count ? res.count : 0
                            this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        })
                },
                searchList(){
                    this.pagination.current=1;
                    this.getStreetVillages();
                },
                resetList() {
                    this.city_list=[];
                    this.area_list=[];
                    this.search={ keyword: '',province_id:"0",city_id:"0",area_id:"0",page: 1 };
                    this.getStreetVillages();
                },
                // 表格中变动  这里只针对页面页数切换
                table_change(e) {
                    let _this=this;
                    if (e.current && e.current>0) {
                        _this.pagination.current = e.current;
                        _this.getStreetVillages()
                    }
                },
                //获取省市区信息 xtype 0 省 1市 2区县
                getProvinceCityAreas(xtype,pid){
                    let postArr={xtype:xtype,pid:pid};
                        this.request(streetCommunityApi.getProvinceCityAreas, postArr)
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
                    this.search.city_id="0";
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
                getRolePermissionMenus() {
                    let postRole={worker_id:this.worker_id};
                    this.request(streetCommunityApi.getStreetRolePermission, postRole)
                        .then((res) => {
                            this.mckeyArr=res.mckeyArr;
                            this.menus = res.menus;
                        })
                },

            handleCancel() {
                this.visible = false;
                this.mckeyArr=[];
                this.menus=[];
                this.city_list=[];
                this.area_list=[];
                this.search= { keyword: '',province_id:"0",city_id:"0",area_id:"0",page: 1 };
                this.currentIndex=0;
                this.selectedRowKeys=[];
                this.village_ids=[];
                this.data=[];
                this.pagination.current = 1
                this.pagination.pageSize = 10
                this.opt_village_ids=[];
                setTimeout(() => {
                    this.worker_id = '0';
                    this.form = this.$form.createForm(this)
                    this.$emit('ok')
                }, 500)
            },
            getEditInfo() {
                let postArr={
                    worker_id: this.worker_id,
                    is_edit:1,
                }
                if(this.is_edit){
                    postArr.is_edit=2;
                }
                this.request(streetCommunityApi.getMemberInfo, postArr)
                    .then((res) => {
                        this.detail = {
                            worker_id: 0,
                            work_num: '',
                            work_name: '',
                            work_phone: '',
                            work_id_card: '',
                            work_addr: '',
                            work_head: '',
                            organization_ids: '',
                            work_job: '',
                            is_handle_event: '',
                            entry_time: '',
                            work_account: '',
                            work_passwd: '',
                            remark: '',
                            area_id: '',
                            is_party_member:0,
                            join_party_time:'',
                            party_id:0,
                        };

                        if (typeof(res.info)=='object') {
                            this.detail = res.info;
                            this.imageUrl = res.info.work_head;
                            this.img = res.info.img;
                            if (res.info.organization_ids) {
                              this.selectedItems = res.info.organization_ids;
                              this.selectedItems = this.selectedItems.split(',');
                            } else {
                              this.selectedItems = [];
                            }
                            console.log('0303',this.selectedItems);
                            this.organization_ids = this.selectedItems;
                            this.fileList = res.info.imgList;
                            if(res.info.village_ids && res.info.village_ids.length>0){
                                for(let ii=0;ii<res.info.village_ids.length;ii++){
                                    let vkv=res.info.village_ids[ii]*1;
                                    this.selectedRowKeys.push(vkv);
                                    this.village_ids.push(vkv);
                                }
                                console.log('village_ids', this.village_ids)
                            }
                        }
                        if(this.detail.openid !=''){
                            this.is_openid=true;
                        }else{
                            this.is_openid=false;
                        }
                        this.is_avatar=this.detail.avatar;
                    })
            },
            getTissueList() {
                this.request(streetCommunityApi.getTissueNavList)
                    .then((res) => {
                        this.organizationList = res;
                    })
            },
            handleChange(info) {
                if (info.file.status === 'uploading') {
                    this.loading = true;
                    return;
                }
                if (info.file.status === 'done') {
                    // Get this url from response in real world.
                    getBase64(info.file.originFileObj, imageUrl => {
                        this.imageUrl = imageUrl;
                        this.loading = false;
                    });
                    if(info.file.response.status === 1000)
                    {
                        this.img = info.file.response.data;
                    }
                }
            },
            beforeUpload(file) {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                    this.$message.error('You can only upload JPG file!');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('Image must smaller than 2MB!');
                }
                return isJpgOrPng && isLt2M;
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
               if(tm_checked){
                   this.setCval(iddObj,true,2,tm_value);
               }else{
                   this.setCval(iddObj,false,2,tm_value);
                   this.all_checked=false;
               }
            },
            getCval(ckey){
                let is_checked=false;
                this.mckeyArr.map((v, i)=>{
                    if(ckey==v.ckey){
                       is_checked= v.cv;
                    }
                });
                //console.log('ckey', ckey+'=>'+is_checked);
                return is_checked;
            },
            setCval(ids,cvl,level,thisid){
                console.log('ids=>',ids,'cvl=>',cvl,'level=>',level,'thisid=>',thisid);
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

            //展示二维码弹出层
            getRecognition(wid){
                let that=this,qrcode_id=wid+200000000;
                this.request(streetCommunityApi.getStreetWorkRecognition,{qrcode_id:qrcode_id}).then((res) => {
                    that.visible_img=true;
                    if(res.ticket){
                        that.srcUrl = res.ticket;
                        that.img_errmsg='';
                    }else{
                        that.srcUrl = '';
                        that.img_errmsg=res.msg;
                    }
                    timer_2 = setInterval(() => {
                        that.checkWorkOpenid(wid)
                    }, 1500)
                })
            },
            //关闭二维码弹出层
            handleImgCancel(){
                this.visible_img = false;
                this.srcUrl = '';
                clearInterval(timer_2)
                this.$emit('ok')
            },
            //校验工作人员是否绑定微信
            checkWorkOpenid(wid){
                let that=this;
                this.request(streetCommunityApi.checkStreetWorkRecognition,{wid:wid}).then((res) => {
                    if(res.status == 1){
                        that.detail.nickname=res.nickname;
                        that.is_avatar=res.avatar;
                        that.is_openid=true;
                        that.handleImgCancel()
                    }
                })
            },
            //取消微信绑定
            clickCancel(wid){
                let that=this;
                Modal.confirm({
                    title: '确定取消绑定？',
                    content: '取消绑定后，可重新选择绑定',
                    okText: '是',
                    cancelText: '否',
                    onOk() {
                        that.request(streetCommunityApi.cancelStreetWorkRecognition,{wid:wid}).then((res) => {
                            if(res.status == 1){
                                that.is_openid=false;
                                that.detail.nickname='';
                                that.is_avatar='';
                                that.handleImgCancel()
                            }
                        })
                    },
                    onCancel() {

                    },
                });
            }

        },
        
    }
</script>
<style>
  .ant-upload-list-picture-card .ant-upload-list-item {
    float: left;
    width: 104px;
    height: 104px;
    margin: 8px 8px 0 0;
  }
  .ant-form-item label {
    width: 50px !important;
  }
  .tip-txt {
    margin-left:4px;font-size: 12px;
  }
  .add-box-tip {
    text-align: -webkit-center;
    padding: 0 6px;
    margin-left: 8px;
    border-radius: 15px;
    border: none;
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