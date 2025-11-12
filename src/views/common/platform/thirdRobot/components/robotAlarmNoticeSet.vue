<template>
	<div>
		<a-modal :title="xtitle" :width="1300" :visible="alarmNoticeVisible" :maskClosable="false"
			:confirmLoading="confirmLoading" :footer="null" @cancel="cancelHandleCancel">

			<div class="message-suggestions-list-box">
				<div class="search-box">

				</div>
				<a-row style="padding-bottom: 10px;">
					<a-col :md="3" :sm="8" style="margin-left: 10px;margin-bottom: 20px;" v-if="r_record.village_id*1>0 && r_record.is_bind_village*1==1">
						<a-button type="primary" @click="addAlarmNotice()">添加</a-button>
					</a-col>
                    <span style="color: red;" v-else >机器人需要先绑定小区后，才能选择小区的工作人员设置为通知人员，请先去绑定小区！</span>
				</a-row>

				<a-table :columns="columns" :data-source="data" class="components-table-demo-nested"
					:pagination="pagination" @change='table_change' :loading="loading" :row-key="record => record.id">
					<span slot="action" slot-scope="text, record,index">
						<a @click="editAlarmNotice(record)">编辑</a>
						<a-divider type="vertical" />
					      <a-popconfirm placement="left" ok-text="确定" cancel-text="取消" @confirm="delAlarmNotice(record)">
					        <template slot="title">
					          <p>{{ record.person_str }}</p>
					          <p>您确定要删除此条信息吗？</p>
					        </template>
					        <a>删除</a>
					      </a-popconfirm>
					</span>
				</a-table>
			</div>
		</a-modal>

		<a-modal title="告警通知设置" :width="950" :visible="alarmNoticeSetVisible" :maskClosable="false"
			:confirmLoading="confirmLoading" @ok="okAlarmNoticeSet" @cancel="cancelAlarmNoticeSet">
			<div>
                <a-alert :message="tpisAlarm" type="success" style="margin-bottom: 10px;" />
				<a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
					style="margin-left: 15px">
					<a-form-item label="请选择人员">
					    <a-select   placeholder="请选择接收通知的人员"  style="width: 600px" v-model="admin_id">
							<a-select-option value="0"  >
							  请选择接收通知人员
							</a-select-option>
						  <a-select-option v-for="(item,index) in adminWorkers" :value="item.id" :disabled="checkOptionDisabled(item)">
						  	<span style="color:#000000;font-weight: bold;" v-if="!checkOptionDisabled(item)">{{item.account}}</span>
							<span  v-if="checkOptionDisabled(item)">{{item.account}}</span>
						  	(【姓名：{{item.realname}}，手机号：{{item.phone}}，绑定微信：<span v-if="item.openid.length>10"
						  		style="color:green">{{item.openid_desc}}</span> <span v-else
						  		style="color:red;">{{item.openid_desc}}</span>】)
						  </a-select-option>
					    </a-select>
						<div>
					    &nbsp;请选择接收通知的人员,绑定了微信的会发模板消息通知，有手机号的会发短信通知
						</div>
					</a-form-item>
							
					<a-form-item label="选择告警等级">
					    <a-select placeholder="请选择接收通知的告警级别"  mode="multiple" option-label-prop="label"  style="width: 450px" v-model="levels">
						  <a-select-option v-for="(item,index) in levels_arr" :value="item.levelv" :label="item.levelv">
						  	<span style="color:#000000;font-weight: bold;">{{item.levelv}}</span>
						  </a-select-option>
					    </a-select>
						<div>
					    &nbsp;请选择接收告警通知的等级。告警级别为 1、2、3、4四个等级（1为最高异常级别，4为正常告警）
						</div>
					</a-form-item>
					<!--
					<a-form-item label="选择机器人编号">
						<a-select placeholder="选择接收告警的机器人编号"  style="width: 620px" mode="multiple" option-label-prop="label" @change=selectRobots
							v-model="robot_codes">
							<a-select-option v-for="(item,index) in allRobotList" :value="item.robot_code" :label="item.robot_code">
								<span style="color:#000000;font-weight: bold;">{{item.robot_code}}</span>
								【机器人名称：{{item.name}}】
							</a-select-option>
						</a-select>
						<div>
						&nbsp;请选择接收通知的机器人编号
						</div>
					</a-form-item>
                    -->

				</a-form>
			</div>
		</a-modal>
	</div>
</template>

<script>
	import thirdRobotApi from '@/api/common/platform/thirdRobotApi';
	const data = [];
	const columns = [{
			title: '通知人员',
			dataIndex: 'person_str',
			key: 'person_str',
			width: 220,
		},
		{
			title: '告警级别',
			dataIndex: 'levels_str',
			key: 'levels_str',
			width: 110,
		},
		{
			title: '绑定的机器人编号',
			dataIndex: 'robot_code_str',
			key: 'robot_code_str',
		},
		{
			title: '创建时间',
			dataIndex: 'add_time',
			key: 'add_time',
			width: 150,
		},
		{
			title: '操作',
			dataIndex: '',
			key: '',
			align: 'center',
			width: 150,
			scopedSlots: {
				customRender: 'action'
			}
		},
	];
	export default {
		name: 'robotAlarmNoticeSet',
		components: {

		},
		data() {
			return {
				form: this.$form.createForm(this),
				confirmLoading: false,
				labelCol: {
					span: 5
				},
				wrapperCol: {
					span: 18
				},
				columns,
				data,
				xtitle: '告警通知设置列表',
				alarmNoticeVisible: false,
				alarmNoticeSetVisible: false,
				loading: false,
				pagination: {
					pageSize: 10,
					total: 10,
					current: 1
				},
				admin_id:"0",
				id:0,
				levels:[],
				levels_arr:[],
				robot_codes:[],
                robot_code:'',
				allRobotList:[],
				adminWorkers:[],
				seted_ids:[],
                r_record:{},
                tpisAlarm:'',
			}
		},

		methods: {
			alarmNotice(r_record) {
				this.admin_id="0";
				this.id=0;
                this.robot_code=this.r_record.robot_code;
                this.r_record=r_record!=undefined && r_record ? r_record:{};
                this.xtitle = '告警通知设置列表【机器人名称：' + this.r_record.name + ' ，机器人编码：' + this.r_record.robot_code + '】';
                this.tpisAlarm='机器人名称：' + this.r_record.name + ' ，机器人编码：' + this.r_record.robot_code ;
               if(this.r_record.village_id *1 >0 && this.r_record.is_bind_village *1 ==1 && this.r_record.village_name!=undefined && this.r_record.village_name){
                  this.xtitle = '告警通知设置列表【已绑小区：'+this.r_record.village_name+'，机器人名称：' + this.r_record.name + ' ，机器人编码：' + this.r_record.robot_code+'】';
                  this.tpisAlarm='已绑小区：'+this.r_record.village_name+'，机器人名称：' + this.r_record.name + ' ，机器人编码：' + this.r_record.robot_code;
                }
                this.alarmNoticeVisible = true;
				this.getAlarmNoticeList();
				this.getAdminWorkers();
			},
			
			refreshInterface(){
				this.getAdminWorkers();
				this.getAlarmNoticeList();
			},
			
			checkOptionDisabled(ritem){
				let admin_id=this.admin_id*1;
				if(admin_id<1 && ritem.is_seted>0){
					return true;
				}else if(admin_id>0 && ritem.is_seted>0 && admin_id!=ritem.id){
					return true;
				}
				return false;
			},
			getAlarmNoticeList() {
                let postArr={village_id:this.r_record.village_id,robot_id:this.r_record.id,xtype:'village_worker'};
				this.loading = true;
				this.request(thirdRobotApi.getAlarmNoticeList,postArr)
					.then((res) => {
						this.pagination.total = res.count ? res.count : 0
						this.pagination.pageSize = res.total_limit ? res.total_limit : 10
						this.data = res.list
						this.loading = false
					}).catch((error) => {
						this.loading = false
					})
			},
			cancelHandleCancel() {
				this.confirmLoading = false;
				this.admin_id="0";
				this.id=0;
				this.levels=[];
				this.robot_codes=[];
				this.alarmNoticeVisible = false;
			},
			addAlarmNotice() {
				this.admin_id="0";
                this.robot_code=this.r_record.robot_code;
				this.id=0;
				this.levels=[];
				this.robot_codes=[];
				this.alarmNoticeSetVisible = true;
			},
			editAlarmNotice(record){
				this.id=record.id;
                this.robot_code=this.r_record.robot_code;
				this.admin_id=record.person_id;
				this.levels=record.levels;
				this.robot_codes=record.robot_code;
				this.alarmNoticeSetVisible = true;
			},
			delAlarmNotice(record){
				this.loading=true;
				let postArr={};
				this.admin_id="0";
				this.id=0;
				this.levels=[];
				this.robot_codes=[];
				postArr.id=record.id;
				this.request(thirdRobotApi.delAlarmNoticeSet,postArr)
				  .then((res) => {
					    this.loading=false;
						this.$message.success('删除成功！')
						this.refreshInterface();
				  }).catch((error) => {
					 this.loading=false;
				 })
			},
			okAlarmNoticeSet() {
				let postArr={};
				postArr.id=this.id;
                postArr.xtype='village_worker';
				postArr.admin_id=this.admin_id*1;
				if(postArr.admin_id<1){
					this.$message.warning('请选择人员信息！')
					return false;
				}
				if(this.levels.length<1){
					this.$message.warning('请至少选择一个告警等级！')
					return false;
				}
				postArr.levels=this.levels;
                /*
				if(this.robot_codes.length<1){
					this.$message.warning('请至少选择一个机器人编号！')
					return false;
				}
				
				postArr.robot_codes=this.robot_codes;
                */
               this.confirmLoading=true;
                postArr.robot_code=this.robot_code;
                postArr.village_id=this.r_record.village_id;
                postArr.robot_id=this.r_record.id;
				this.request(thirdRobotApi.saveAlarmNoticeSet,postArr)
				  .then((res) => {
					    this.confirmLoading=false;
						this.$message.success('设置保存成功！')
						this.cancelAlarmNoticeSet();
						this.refreshInterface();
				  }).catch((error) => {
					 this.confirmLoading=false;
				 })
			},
			cancelAlarmNoticeSet() {
				this.admin_id="0";
				this.id=0;
				this.levels=[];
				this.robot_codes=[];
				this.alarmNoticeSetVisible = false;
			},
			selectRobots(value){
			    console.log(value)
			},
			// 获取员工信息
			getAdminWorkers() {
              let postArr={village_id:this.r_record.village_id,robot_id:this.r_record.id,xtype:'village_worker'};
			  this.request(thirdRobotApi.getAdminWorkers,postArr)
			    .then((res) => {
			      if (res.list && res.list.length>0){
			          this.adminWorkers=res.list;
			      }else{
			          this.adminWorkers=[];
			      }
				  if (res.seted_ids && res.seted_ids.length>0){
				      this.seted_ids=res.seted_ids;
				  }else{
				      this.seted_ids=[];
				  }
                  if (res.levels_arr && res.levels_arr.length>0){
                      this.levels_arr=res.levels_arr;
                  }else{
                      this.levels_arr=[];
                  }
			    })
			},
			// 获取机器人信息
			getAllRobotsList() {
			  this.request(thirdRobotApi.getAllRobotsList)
			    .then((res) => {
			      if (res.list && res.list.length>0){
			          this.allRobotList=res.list;
			      }else{
			          this.allRobotList=[];
			      }
				  if (res.levels_arr && res.levels_arr.length>0){
				      this.levels_arr=res.levels_arr;
				  }else{
				      this.levels_arr=[];
				  }
			    })
			},
			// 表格中变动  这里只针对页面页数切换
			table_change(e) {
				console.log('e', e)
				if (e.current && e.current > 0) {
					this.pagination.current = e.current;
					this.page = e.current;
					this.refreshInterface()
				}
			},
		},
	}
</script>

<style lang="less" scoped>
	.generation_rules {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		margin-top: 5px;
	}


	.footer_button {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-end;

	}
</style>