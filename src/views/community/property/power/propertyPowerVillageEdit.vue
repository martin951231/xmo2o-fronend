<template>
    <a-drawer :title="title" :width="1400" :visible="visible" :maskClosable="false"
              @close="handleXCancel" placement="right">
          
        <a-card >
            <div class="all_menus" id="components_layout_menus">
                 <div >
                  <a-layout style="line-height: 40px;font-size: 25px;">
                    <a-layout-content>  <a-checkbox @change="checkAll" style="font-size: 18px;pfont-weight: bold;padding-left: 2px;" value="0" :checked="all_checked"> 全选 </a-checkbox></a-layout-content>
                  </a-layout>
                  
                  <a-layout style="line-height: 40px;" v-for="(item2,index2) in vmenus">
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
              <a-button  type="primary" style="margin-top: 20px;" @click="handleXSubmit()" :loading="loading">保存设置</a-button>
          </a-card>

    </a-drawer>
    
</template>
<script>
    import villageApi from '@/api/community/village'
    import { Collapse } from 'ant-design-vue';
    import moment from 'moment'
    const columns = [];
    const data = [];
	import store from '@/store';
    export default {
        name: 'propertyPowerVillageEdit',
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
            search: { keyword: '',key_val:'name',key_val1:'paytime',page: 1 },
                form: this.$form.createForm(this),
                pagination: {current:1, pageSize: 10, total:10 },
                visible: false,
                loading: false,
                data,
               columns,
               dateFormat: 'YYYY-MM-DD HH:mm:ss',
               vmenus:[],
               all_checked:false,
               vmckeyArr:[],
               property_id:0,
                title:'',
                admin_id:0,
                village_id:0,
                village_ids:'',
                batchSetRolePermission:0,
            };
        },
        activated () {

        },
        computed: {

        },
        methods: {
            moment,
            editAccount(record,property_admin_id,village_ids){
                console.log('record',record);
                this.title=store.getters.config.house_name+'名称【'+record.village_name+'】编辑';
                this.village_id=record.village_id;
                if(village_ids!=undefined && village_ids.length>0){
                    //批量
                    this.title='批量设置'+store.getters.config.house_name+'权限';
                    this.village_id=0;
                    this.batchSetRolePermission=1;
                    this.village_ids=village_ids;
                }
                this.admin_id=property_admin_id;
                this.visible = true;
                this.vmckeyArr=[];
                this.vmenus=[];
                this.all_checked=false;
                this.property_id=record.property_id;
                this.getRolePermissionMenus();
            },

            onGroupChange(e){
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
                let tm_checked=ee.target.checked;
                let default_checked= ee.target.defaultChecked;
                let tm_value=ee.target.value; 
                if(tm_checked){
                   this.all_checked=true;
                   this.vmckeyArr.map((v, i)=>{
                          v.cv=true;
                   }); 
                }else{
                    this.all_checked=false;
                    this.vmckeyArr.map((v, i)=>{
                        v.cv=false;
                    });
                }
            },
            check2All(ee){
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
            handleXSubmit() {
                        //物业权限设置权限提交
                        let postArr={};
                        postArr.xtype=3;
                        postArr.id=this.admin_id;
                        postArr.menus_property='';
                        postArr.village_id=this.village_id;
                        if(this.batchSetRolePermission==1 && this.village_ids.length>0){
                            postArr.village_id=this.village_ids;
                        }
                        postArr.property_id=this.property_id;
                        let menusTmpArr=[];
                        this.vmckeyArr.map((vv, ii)=>{
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
                                      this.vmenus=[];
                                      this.vmckeyArr=[];
                                      this.admin_id=0;
                                      this.title='';
                                      this.village_id=0;
                                      this.all_checked=false;
                                      this.property_id=0;
                                      this.batchSetRolePermission=0;
                                      this.village_ids='';
                                    }, 1500)
                            }).catch(error => {
                                this.loading = false
                            })
                   
            },
            // 获取列表信息
            getRolePermissionMenus() {
                let postRole={admin_id:this.admin_id};
                postRole.village_id=this.village_id;
                postRole.property_id=this.property_id;
                this.request(villageApi.getPropertyVillageRolePermission, postRole)
                    .then((res) => {
                        this.vmckeyArr=res.mckeyArr;
                        this.vmenus = res.menus;
                    })
            },
            getCval(ckey){
                let is_checked=false;
                this.vmckeyArr.map((v, i)=>{
                    if(ckey==v.ckey){
                       is_checked= v.cv;
                    }
                });
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
                    this.vmckeyArr.map((v, i)=>{
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
                        this.vmckeyArr.map((v, i)=>{
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
                                  this.vmckeyArr.map((v, i)=>{
                                      if(ckeyindex==v.ckey0 && v.cv){
                                          console.log('tmp_ckey0', v);
                                         tmp_ckey0=true;
                                      }
                                  });
                                  
                                  if(!tmp_ckey0){
                                      this.vmckeyArr.map((v, i)=>{
                                          if(ckeyindex==v.ckey){
                                             v.cv=cvl;
                                          }
                                      });
                                  }  
                              }else if(mc==1){
                                  let tmp_ckey1=false;
                                  this.vmckeyArr.map((v, i)=>{
                                      if(ckeyindex==v.ckey1 && v.cv){
                                           console.log('tmp_ckey1', v);
                                         tmp_ckey1=true;
                                      }
                                  });
                                  if(!tmp_ckey1){
                                      this.vmckeyArr.map((v, i)=>{
                                          if(ckeyindex==v.ckey){
                                             v.cv=cvl;
                                          }
                                      });
                                  }
                              }else if(mc==2){
                                  let tmp_ckey2=false;
                                  this.vmckeyArr.map((v, i)=>{
                                      if(ckeyindex==v.ckey2 && v.cv){
                                         tmp_ckey2=true;
                                      }
                                  });
                                  if(!tmp_ckey2){
                                      this.vmckeyArr.map((v, i)=>{
                                          if(ckeyindex==v.ckey){
                                             v.cv=cvl;
                                          }
                                      });
                                  }
                              }
                            }else{
                                this.vmckeyArr.map((v, i)=>{
                                    if(ckeyindex==v.ckey){
                                       v.cv=cvl;
                                    }
                                });
                            }
                        }
                    }
                    //console.log('mckeyArr', this.vmckeyArr);
                }
            },

            handleXCancel() {
              this.visible = false;
              this.vmenus=[];
              this.vmckeyArr=[];
              this.admin_id=0;
              this.title='';
              this.village_id=0;
              this.all_checked=false;
              this.property_id=0;
              this.batchSetRolePermission=0;
              this.village_ids='';
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
                let _this=this;
            },
          // 日期切换，重新赋值
          dateOnChange(date, dateString) {
            this.search.date = dateString;
            this.search.begin_time=dateString['0'];
            this.search.end_time=dateString['1'];
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
</style>