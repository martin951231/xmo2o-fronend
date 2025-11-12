<template>
    <a-drawer title="编辑" :width="1400" :visible="visible" :maskClosable="false"
              @close="handleCancel" placement="right">
      <div v-if="currentIndex == 0" style="margin-bottom: 20px;">
        <a-button  type="primary" @click="changeXTab(0)" style="margin-right: 30px">基本设置</a-button>
        <a-button  type="default" @click="changeXTab(1)" style="margin-right: 30px" >权限设置</a-button>
        </div>
        <div style="margin-bottom: 20px;" v-else>
        <a-button   type="default" @click="changeXTab(0)" style="margin-right: 30px">基本设置</a-button>
        <a-button  type="primary" @click="changeXTab(1)" style="margin-right: 30px" >权限设置</a-button>
        </div>
        <a-card  v-if="currentIndex == 0">
         <a-alert v-if="hw_id>0" message="此数据来源于物业后台【人员管理】数据，基本信息统一由物业后修改，因此这里基本信息不可修改" type="info" show-icon  style="margin-bottom: 10px;" />
           <a-row>
               <a-col :span="12">
                   <a-form :form="form">
                       <a-form-item label="登录账号" :labelCol="labelCol" :required="true">
                           <a-col :span="18">
                               <a-input
                                   style="width: 300px"
                                   placeholder="请输入登录账号"
                                   autocomplete="off"
                                   name="account"
                                   v-model="post.account"    :disabled="accountAisabled"/>
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
                                   v-model="post.password"   :disabled="disabledBase" />
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
                                   name="lxname"
                                   v-model="post.name"  @blur="validateInput" :disabled="disabledBase" />
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
                                   v-model="post.phone"  @blur="validateInput" :disabled="disabledBase" />
                           </a-col>
                           <a-col :span="6">
                           </a-col>
                       </a-form-item>
                       <a-form-item label="备注信息" :labelCol="labelCol" >
                           <a-col :span="20">
                               <a-textarea
                                   ref="textareax"
                                   :rows="8"
                                   style="width: 300px; overflow-y: scroll; resize:none;"
                                   placeholder="请输入备注信息"
                                   name="remarks"
                                   v-model="post.remarks"/>
                           </a-col>
                           <a-col :span="6">
                           </a-col>
                       </a-form-item>
                   </a-form>
               </a-col>
               <a-col :span="12">

                       <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" >
                           <a-form-item label="身份证号">
                               <a-input v-model="post.id_card" readonly="readonly" disabled="disabled" />
                           </a-form-item>
                           <a-form-item label="IC卡号">
                               <a-input v-model="post.ic_card" readonly="readonly" disabled="disabled"/>
                           </a-form-item>
                           <div v-if="is_openid">
                               <a-form-item label="微信昵称" >
                                   <a-input v-model="post.nickname" readonly="readonly" disabled="disabled"/>
                               </a-form-item>
                               <a-form-item label="微信头像" v-if="is_avatar">
                                   <img :src="is_avatar" width="80px"/>
                               </a-form-item>
                           </div>
                           <a-form-item label="绑定微信" v-else>
                               <a-tag  color="#1890FF" style="padding: 5px;cursor: pointer" @click="getRecognition(wid)"> 点击绑定微信</a-tag>
                               <span  v-if="hw_id>0">绑定微信后会同步关联账号的小区</span>
                           </a-form-item>
                           <a-form-item label="入职时间">
                               <a-input v-model="post.create_time_str" readonly="readonly" disabled="disabled"/>
                           </a-form-item>
                           <a-form-item label="处理次数">
                               <a-input v-model="post.num" readonly="readonly" disabled="disabled"/>
                           </a-form-item>
                           <a-form-item label="被评论数">
                               <a-input v-model="post.reply_count" readonly="readonly" disabled="disabled"/>
                           </a-form-item>
                           <a-form-item label="评分">
                               <a-input v-model="post.score_mean" readonly="readonly" disabled="disabled"/>
                           </a-form-item>
                           <a-form-item label="职务类型">
                               <a-input v-model="post.type_name" readonly="readonly" disabled="disabled"/>
                           </a-form-item>
                       </a-form>


               </a-col>
           </a-row>
        </a-card>
        
        <a-card  v-if="currentIndex == 1">
            <div class="all_menus" id="components_layout_menus">
                    <a-layout style="line-height: 40px;">
                        <a-layout-sider style="width: 150px;flex: 0 0 150px;max-width: 150px;min-width: 150px;">权限分组</a-layout-sider>
                        <a-layout-content>            
                        <a-select placeholder="权限分组选择" style="width: 300px;margin-top: 5px;"  default-value="0" v-model="group_id" @change="handleSelectChange"	>
                              <a-select-option :value="0">不选择分组</a-select-option>
                                <a-select-option  v-for="(item1,index1) in group_list" :key="index1" :value="item1.group_id">
                                    {{item1.name}}
                                </a-select-option>
                            </a-select>
                        </a-layout-content>
                      </a-layout>
                 <div v-if="group_id<=0">
                  <a-layout style="line-height: 40px;font-size: 25px;">
                    <a-layout-content>  <a-checkbox @change="checkAll" style="font-size: 18px;pfont-weight: bold;padding-left: 2px;" value="0" :checked="all_checked"> 全选 </a-checkbox></a-layout-content>
                  </a-layout>
                  
                  <a-layout style="line-height: 40px;" v-for="(item2,index2) in menus">
                      <a-layout-sider ><a-checkbox @change="check2All" style="font-size: 18px;pfont-weight: bold;padding-left: 2px;"  :value="item2.id" :checked="getCval(item2.ckey)" :ref="item2.ckey"  > {{item2.name}} </a-checkbox></a-layout-sider>
                      <a-layout>
                            <a-layout-content v-for="(item3,index3) in item2.child" >
                                <div class="sub1div" ><a-checkbox @change="check3All" :checked="getCval(item3.ckey)" :ref="item3.ckey" :value="item3.id" :id="'item0id_'+item2.id" > {{item3.name}} </a-checkbox></div>
                                <div class="sub2div" v-if="(item3.child && item3.child.length>0)" v-for="(item4,index4) in item3.child">
                                    <div class="sub2div_1div"><a-checkbox  @change="check4All" :value="item4.id"  :checked="getCval(item4.ckey)" :ref="item4.ckey"  :id="'item0id_'+item2.id+'-item1id_'+item3.id" > {{item4.name}} </a-checkbox></div>
                                    
                                      <div class="sub2div_2div" style="width: 100%;" v-if="(item4.child && item4.child.length>0)">
                                        
                                          <a-row style="width: 100%; display: flex; flex-wrap: wrap;">
                                            <a-col style="width: 33.3%; flex-shrink: 0;margin-bottom: 5px;" v-for="(item5,index5) in item4.child">
                                              <a-checkbox  :value="item5.id" @change="onGroupChange" :checked="getCval(item5.ckey)" :ref="item5.ckey"  :id="'item0id_'+item2.id+'-item1id_'+item3.id +'-item2id_'+item4.id">
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
              <a-button  type="primary" style="margin-top: 20px;margin-right: 15px;" @click="handleSubmit()" :loading="loading">保存设置</a-button>
              <a-button @click="onClose()"> 关闭当前页 </a-button>
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
    import villageApi from '@/api/community/village'
    import { Collapse } from 'ant-design-vue';
    import moment from 'moment'
    const columns = [

    ];
    const data = [];
    export default {
        name: 'houseWorkerEdit',
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
            search: {page: 1 },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
               wid:0,
               worker:{},
               currentIndex:0,
               dateFormat: 'YYYY-MM-DD HH:mm:ss',
               is_set_pwd:0,
               accountAisabled:false,
               is_edit_worker:true,
               menus:[],
               group_list:[],
               //role_menus:[],
               post:{
                   account:'',
                   password:'',
                   name:'',
                   phone:'',
                   remarks:'',
                   nickname:'',
                   create_time_str:'',
                   num:0,
                   reply_count:0,
                   score_mean:0,
                   type_name:'',
                   ic_card:'暂无',
                   id_card:'暂无'

               },
               role:{},
               all_checked:false,
               mckeyArr:[],
               group_id:0,
                srcUrl:'',
                img_errmsg:'',
                visible_img: false,
                confirmLoading:false,
                is_openid:false,
                is_avatar:'',
                hw_id:0,
                disabledBase:false,
            };
        },
        activated () {

        },
        methods: {
            onClose(){
              this.visible = false
            },
            moment,
            editAccount(record){
                console.log('record', record)
                if(record.openid !=''){
                    this.is_openid=true;
                }else{
                    this.is_openid=false;
                }
                this.hw_id=0;
                this.disabledBase=false;
                if(record.hw_id!=undefined && record.hw_id*1>0){
                    this.hw_id=record.hw_id*1;
                }
                if(this.hw_id>0){
                    this.disabledBase=true;
                }
                this.is_avatar=record.avatar;
                this.visible = true;
                this.wid=record.wid;
                this.worker=record;
                this.post.account=record.account;
                this.post.name=record.name;
                this.post.phone=record.phone;
                this.is_set_pwd=record.set_pwd*1;
                this.post.remarks=record.remarks ? record.remarks:'';
                this.post.nickname=record.nickname;
                this.post.create_time_str = record.create_time_str;
                this.post.num         = record.num;
                this.post.reply_count = record.reply_count;
                this.post.score_mean  = record.score_mean;
                this.post.type_name   = record.type_name;
                this.post.id_card     = record.id_card;
                this.post.ic_card     = record.ic_card;
                this.group_id=record.group_id*1;
                this.mckeyArr=[];
                this.menus=[];
                this.all_checked=false;
                this.currentIndex=0;
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
                    let tmpid=iddArr[ii].split('_');
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
                    postArr.wid=this.wid;
                    postArr.group_id=this.group_id;
                    postArr.menus='';
                    if(this.group_id>0){
                        this.group_list.map((vv, ii)=>{
                            if(vv.group_id==this.group_id){
                                postArr.menus=vv.group_menus;
                            }
                        });
                    }else{
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
                    this.loading = true;
                    this.request(villageApi.saveWorkerEdit,postArr)
                        .then((res) => {
                            this.loading = false
                            this.$message.success('保存成功!');
                                setTimeout(() => {
                                  this.form = this.$form.createForm(this)
                                  this.visible = false;
                                  this.is_edit_worker=false;
                                  this.record={};
                                  this.wid=0;
                                  this.menus=[];
                                  this.$emit('ok')
                                }, 1500)
                        }).catch(error => {
                            this.loading = false
                        })
                }else{
                    if(!this.post.account || this.post.account.length<1){
                        this.$message.error('请输入登录账号!');
                        return false;
                    }
                    if(this.is_set_pwd==0 && (!this.post.password || this.post.account.password<1)){
                        this.$message.error('请输入登录密码!');
                        return false;
                    }
                    if(!this.post.phone || this.post.phone.length<1){
                        this.$message.error('请输入手机号!');
                        return false;
                    }
                    let phoneReg =/^1[23456789]\d{9}$/
                    if(!phoneReg.test(this.post.phone)){
                        this.$message.error('手机号格式不正确！');
                         return false;
                    }
                    if(!this.post.name || this.post.name.length<1){
                        this.$message.error('请输入姓名!');
                        return false;
                    }
                    this.post.wid=this.wid;
                    this.post.xtype=0;
                    this.loading = true;
                    this.request(villageApi.saveWorkerEdit,this.post)
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
                                 this.wid=0;
                                 this.menus=[];
                                 this.post={
                                     account:'',
                                     password:'',
                                     name:'',
                                     phone:'',
                                     remarks:'',
                                 };
                                 this.$emit('ok')
                               }, 1500)
                           }
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
                            //this.$message.error('请输入登录账号!');
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
                           //this.$message.error('请输入登录密码!');
                           e.target.focus();
                           return false;
                       }
                       let accountReg = /^[A-Za-z0-9_]+$/
                       if(xv.length>0&& !accountReg.test(xv)){
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
                }else if(t_name=='lxname'){
                    if(!xv || xv.length<1){
                       // this.$message.error('请输入姓名!');
                        e.target.focus();
                        return false;
                    }
                    if(xv.length>10){
                        this.$message.error('您输入的姓名长度太长了，请小于10个字符！');
                        e.target.focus();
                         return false;
                    }
                    this.post.name=xv;
                }else if(t_name=='phone'){
                    if(!xv || xv.length<1){
                        //this.$message.error('请输入手机号!');
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

            // 获取列表信息
            getRolePermissionMenus() {
                let postRole={wid:this.wid};
                this.request(villageApi.getRolePermissionMenus, postRole)
                    .then((res) => {
                        this.mckeyArr=res.mckeyArr;
                        this.menus = res.menus;
                        this.group_list = res.group_list;
                        //this.role_menus = res.role_menus;
                    })
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
                    
                } else if(this.menus.length<1) {
                    this.getRolePermissionMenus();
                }
            },
            handleCancel() {
              this.is_edit_worker=false;
              this.visible = false;
              this.record={};
              this.wid=0;
              this.menus=[];
              this.currentIndex=0;
              this.post={
                  account:'',
                  password:'',
                  name:'',
                  phone:'',
                  remarks:'',
              };
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

            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                if (e.current && e.current>0) {
                  this.pagination.current = e.current;
                    this.page = e.current;
                }
            },
          // 日期切换，重新赋值
          dateOnChange(date, dateString) {
            this.search.date = dateString;
            this.search.begin_time=dateString['0'];
            this.search.end_time=dateString['1'];
          },

            //关闭二维码弹出层
            handleImgCancel(){
                this.visible_img = false;
                this.srcUrl = '';
                clearInterval(timer_2)
                this.$emit('ok')
            },

            //展示二维码弹出层
            getRecognition(wid){
                let that=this,qrcode_id=wid+3900000000;
                this.request(villageApi.getRecognition,{qrcode_id:qrcode_id}).then((res) => {
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

            //校验工作人员是否绑定微信
            checkWorkOpenid(wid){
                let that=this;
                this.request(villageApi.checkWorker0629,{wid:wid}).then((res) => {
                   if(res.status == 1){
                       that.post.nickname=res.nickname;
                       that.is_avatar=res.avatar;
                       that.is_openid=true;
                       that.handleImgCancel()
                   }
                })
            }
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