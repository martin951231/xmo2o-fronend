<template>
  <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
      <a-collapse accordion>
          <a-collapse-panel key="1" header="操作说明">
              <p>
                  新版收费生效后，抄表录入统一由水电燃气收费项的收费标准进行管理设置，移动端及后台录入抄表数据交互不变，所有的抄表记录及生成的账单数据可汇总查询。<br/>
                  1、仅展示当前有正在生效的收费标准的收费项目，若没有，则该页为空白页；<br/>
                  2、收费项目在物业管理平台设置；<br/>
                  3、在抄表管理支持户录入抄表单和导入抄表单。<br/>
              </p>
          </a-collapse-panel>
      </a-collapse>
    <a-card :bordered="false">
      <a-table :columns="columns" :data-source="list"
               :pagination="pagination"
               @change="tableChange" 
               :row-key="record=>record.project_id"
               >
        <span slot="director_manage" slot-scope="text, record">
          <a @click="$refs.directorModel.get(record.project_id)" v-if="role_managebe==1">负责人管理</a>
        </span>
        <span slot="action" slot-scope="text, record">
          <a v-if="is_show" @click="$refs.addMeterPrice.add(record.project_name,record.rule_name,record.unit_price,record.rate,record.charge_type,record.rule_id,record.project_id)">录入费用</a>
          <a-divider v-if="is_show" type="vertical" />
          <a v-if="role_addmeter==1"  @click="$refs.addMeter.add(record.project_name,record.rule_name,record.unit_price,record.rate,record.charge_type,record.rule_id,record.project_id)">录入用量</a>
          <a-divider type="vertical" v-if="role_addmeter==1"/>
          <a @click="$refs.recordModel.get(record.charge_name,record.project_id,record.rule_name)" v-if="role_recordmeter==1">抄表记录</a>
          <a-divider type="vertical" v-if="role_recordmeter==1"/>
          <a @click="setMeterReading(record)" v-if="role_meterset==1">抄表设置</a>
          <a-divider v-if="is_revise_btn" type="vertical" />
          <a v-if="is_revise_btn" @click="$refs.addMeter.add(record.project_name,record.rule_name,record.unit_price,record.rate,record.charge_type,record.rule_id,record.project_id,'revise_data')" >手工矫正</a>
        </span>
      </a-table>
    </a-card>
    <meter-director-list ref="directorModel" />
    <meter-record-list ref="recordModel" />
    <add-meter ref="addMeter" @getMeterProject="getMeterProject" />
    <add-meter-price ref="addMeterPrice" @getMeterProject="getMeterProject" />
    
    <a-modal title="编辑缴费周期" :width="600" :visible="mRvisible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleMrSubmit" @cancel="handleMrCancel">
         <a-form-model :labelCol="labelCol" :wrapperCol="wrapperCol">
             <a-form-model-item label="缴费时间">
                 每月 <a-input-number  placeholder="缴费时间" v-model="mday" :min="0" :max="30" style="width:100px"/> 号进行抄表  <span style="color:red;">*必填项（0表示关闭缴费时间）</span>
             </a-form-model-item>
             <div v-if="jz_wsxdsj_customized_open==1">
                 <a-form-model-item label="用量提醒">
                     每次抄表数超过 <a-input-number  placeholder="用量提醒值" v-model="meter_use_v" :min="0" :max="99999999" style="width:110px"/> {{unit_name}}，将会给录入抄表数据人弹窗提示！  <span style="color:red;"> 填0将不做弹窗提示 </span>
                 </a-form-model-item>
                 <a-form-item label="抄表数重置功能">
                        <a-switch  checked-children="开启" v-model="reset_btn_show" un-checked-children="关闭" style="margin-right: 30px;margin-left: 30px;" />  开启状态后，在用量录入页面。起度（显示重置表数）按钮
                     </a-form-item>
            </div>
         </a-form-model>
        <div v-if="jz_wsxdsj_customized_open==1">
            <a-form-model :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="mRrecord.charge_type=='new_nuanqifei'">
                <a-form-model-item label="用户签字功能">
                    <a-switch  checked-children="开启" v-model="sign_btn_show" un-checked-children="关闭" style="margin-right: 30px;margin-left: 30px;" />  <span style="color:red;">开启状态后，在移动管理端用量录入页面，需要签字功能（用户自己签字）</span>
                </a-form-model-item>
            </a-form-model>
        </div>
    </a-modal>
  </div>
  
  
</template>

<script>
    import villageApi from '@/api/community/village';
    import MeterDirectorList from "@/views/community/village/charge/houseMeter/meterDirectorList";
    import MeterRecordList from "@/views/community/village/charge/houseMeter/meterRecordList";
    import addMeter from "@/views/community/village/charge/houseMeter/addMeter";
    import addMeterPrice from "@/views/community/village/charge/houseMeter/addMeterPrice";
    import { getSystemName } from '@/utils/util';
    import { Collapse } from 'ant-design-vue';

    export default {
        components: {
            MeterDirectorList,
            MeterRecordList,
            addMeter,
            addMeterPrice,
            'a-collapse':Collapse,
            'a-collapse-panel':Collapse.Panel,
        },
        data() {
            return {
                labelCol: {
                    span: 6
                },
                wrapperCol: {
                    span: 16
                },
                list:[],
                is_show:false,
                pagination: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    showTotal: total => `共 ${total} 条`, // 显示总数
                },
                page: 1,
                tokenName:'',
                sysName: '',
                confirmLoading:false,
                mday:0,
                mRvisible:false,
                mRrecord:{},
                role_addmeter:0,
                role_managebe:0,
                role_meterset:0,
                role_recordmeter:0,
                is_revise_btn:0,
                jz_wsxdsj_customized_open:0,
                sign_btn_show:false,
                meter_use_v:'',
                unit_name:'',
                reset_btn_show:false,
                
            };
        },
        mounted(){
            let sysName = getSystemName(location.hash);
            if (sysName) {
                this.tokenName = sysName + '_access_token';
                this.sysName = sysName;
            } else {
                this.sysName = 'village';
            }
            this.getMeterProject()
        },
        computed:{
            columns() {
                const columns = [
                    {
                        title: '收费项目',
                        dataIndex: 'project_name',
                        key: 'project_name',
                    },
                    {
                        title: '收费所属类别',
                        dataIndex: 'subject_name',
                        key: 'subject_name',
                    },
                    {
                        title: '当前生效标准',
                        dataIndex: 'rule_name',
                        key: 'rule_name',
                    },
                    {
                        title: '负责人管理',
                        dataIndex: '',
                        key: 'director_manage',
                        scopedSlots: {
                            customRender: 'director_manage'
                        }
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
                return columns;
            },
        },
        methods: {
            getMeterProject() {
                this.request(villageApi.getMeterProject, {
                    page:this.page,
                    limit:this.pagination.pageSize,
                    tokenName: this.tokenName
                }).then((res) => {
                        console.log('res', res);
                        this.is_show = res.is_show;
                        if(res.is_revise_btn!=undefined && res.is_revise_btn){
                            this.is_revise_btn=res.is_revise_btn;
                        }
                        this.list = res.list;
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        if(res.role_addmeter!=undefined){
                            this.role_addmeter=res.role_addmeter;
                            this.role_managebe=res.role_managebe;
                            this.role_meterset=res.role_meterset;
                            this.role_recordmeter=res.role_recordmeter;
                        }else{
                            this.role_addmeter=1;
                            this.role_managebe=1;
                            this.role_meterset=1;
                            this.role_recordmeter=1;
                        }
                        this.jz_wsxdsj_customized_open=0;
                        if(res.jz_wsxdsj_customized_open!=undefined){
                            this.jz_wsxdsj_customized_open=res.jz_wsxdsj_customized_open;
                        }
                })
            },
            onTableChange(page,pageSize) {
                this.page = page
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.getMeterProject()
                // console.log('onTableChange==>', page, pageSize)
            },
            setMeterReading(ret){
                this.mRrecord=ret;
                this.unit_name='';
                if(ret.charge_type=='water'){
                   this.unit_name='吨';
                }else if(ret.charge_type=='electric'){
                    this.unit_name='度';
                }else if(ret.charge_type=='gas'){
                    this.unit_name='立方米';
                }
                this.mday=ret.mday;
                this.meter_use_v=ret.meter_use_v;
                this.reset_btn_show=ret.reset_btn_show*1 >0 ? true : false ;
                this.mRvisible=true;
                this.sign_btn_show=ret.sign_btn_show*1 > 0 ? true : false;
            },
            handleMrSubmit(){
                if(this.mday>30 || this.mday<0){
                    this.$message.error('缴费时间,请设置在0到30之间的数字')
                    return false;
                }
               let postArr= {
                    mday:this.mday,
                    project_id:this.mRrecord.project_id,
                    subject_id:this.mRrecord.subject_id,
                    tokenName: this.tokenName,
                    sign_btn_show: this.sign_btn_show ? 1 : 0
               };
                postArr.meter_use_v=this.meter_use_v;
                postArr.reset_btn_show=this.reset_btn_show ? 1:0;
                this.request(villageApi.setMeterReadingDay,postArr ).then((res) => {
                    this.$message.success('保存成功！')
                    this.getMeterProject()
                    this.handleMrCancel();
                })
            },
            handleMrCancel(){
                this.mRvisible=false;
                this.mRrecord={};
                this.mday=0;
            },
            tableChange(e) {
                if (e.current && e.current>0) {
                    this.page = e.current;
                    this.getMeterProject();
                }
            },
        },
    }
</script>

<style scoped>
    
</style>