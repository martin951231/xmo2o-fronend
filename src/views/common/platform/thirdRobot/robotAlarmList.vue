<template>
	<a-drawer :title="title" :width="1600" :visible="alarm_visible" :maskClosable="false" @close="handleTaskCancel"
		placement="right">
	<div class="message-suggestions-list-box">
		<!--
		<div class="search-box" ></div>
		-->
		<a-row>
			<!--
			<a-col :md="3" :sm="24" style="margin-left: 50px;" v-if="is_configure_right>0" >
				<a-button  type="primary" @click="getRemoteRobotAlarmData()">拉取告警记录数据</a-button>
			</a-col>
			-->
            <a-button type="primary" @click="$refs.robotAlarmNoticeSet.alarmNotice(r_record)" :loading="loading">告警通知设置</a-button>
		</a-row>
		<a-table :columns="columns" :data-source="data" class="components-table-demo-nested" :pagination="pagination"
			@change='table_change' :loading="loading" :row-key="record => record.id">
		</a-table>
        <a-modal title="请稍等,正在为您拉取任务列表数据..." :visible="tips_alarm_visible" :closable="false" :mask-closable="false" :footer="null"
            :width="550">
            <div>
                <a-spin size="large" />
                <span style=" margin-left: 25px;">请稍等,正在为您拉取任务列表数据...</span>
                <p style="margin: 15px;">拉取数据中,请耐心等待,数量越多拉取时间越长。</p>
            </div>
        </a-modal>
        <robot-alarm-notice-set ref="robotAlarmNoticeSet" @ok="bindOk" />
	</div>
	</a-drawer>
</template>
<script>
	import thirdRobotApi from '@/api/common/platform/thirdRobotApi';
    import robotAlarmNoticeSet from "./components/robotAlarmNoticeSet";
	import {
		Collapse
	} from 'ant-design-vue';
	const columns = [{
				title: '告警ID',
				dataIndex: 'alarm_id',
				key: 'alarm_id',
		},
		{
			title: '告警时间',
			dataIndex: 'event_time_str',
			key: 'event_time_str',
		},
		{
			title: '告警中文名称',
			dataIndex: 'type_cname',
			key: 'type_cname',
		},
		{
			title: '告警类型名称',
			dataIndex: 'type_name',
			key: 'type_name',
		},
		{
			title: '告警码',
			dataIndex: 'type_code',
			key: 'type_code',
		},
		{
			title: '告警开始时间',
			dataIndex: 'start_time_str',
			key: 'start_time_str',
		},
		{
			title: '告警结束时间',
			dataIndex: 'end_time_str',
			key: 'end_time_str',
		},
		{
			title: '告警级别',
			dataIndex: 'level',
			key: 'level',
		},
		{
			title: '告警状态',
			dataIndex: 'event_status_str',
			key: 'event_status_str',
		},
		{
			title: '告警确认',
			dataIndex: 'confirm_flag_str',
			key: 'confirm_flag_str',
		},
		{
			title: 'RDM告警类型',
			dataIndex: 'rdm_alarm_type_str',
			key: 'rdm_alarm_type_str',
		},
		{
			title: '告警描述',
			dataIndex: 'details_remark',
			key: 'details_remark',
		},
	];

	const data = [];
	export default {
		name: 'thirdRobotAlarmList',
		filters: {

		},
		components: {
			'a-collapse': Collapse,
			'a-collapse-panel': Collapse.Panel,
            robotAlarmNoticeSet,
		},
		data() {
			return {
				labelCol: {
					xs: {
						span: 10
					},
					sm: {
						span: 3
					}
				},
				pagination: {
					pageSize: 10,
					total: 10,
					current: 1
				},
				search: {
					page: 1,
				},
				loading: false,
				data,
				columns,
				page: 1,
				confirmLoading: false,
				tips_alarm_visible:false,
				alarm_visible:false,
				is_configure_right:0,
				r_record:{},
				title:'',
			};
		},

		created() {
	
		},

		methods: {
			showAlarmList(r_record) {
				this.r_record = r_record;
				this.title = '【机器人名称：' + this.r_record.name + ' ，机器人编码：' + this.r_record.robot_code + '】告警记录';
				this.getList();
				this.alarm_visible = true;
			},
			// 获取列表信息
			getList() {
				this.tips_alarm_visible = false
				this.loading = true;
				this.search['robot_id'] = this.r_record.id;
				this.search['robot_code'] = this.r_record.robot_code;
				this.search['page'] = this.page;
				this.request(thirdRobotApi.getRobotAlarmList, this.search)
					.then((res) => {
						this.pagination.total = res.count ? res.count : 0
						this.pagination.pageSize = res.total_limit ? res.total_limit : 10
						this.data = res.list;
                        if(res.robot_info!=undefined && res.robot_info){
                            this.r_record=res.robot_info;
                            if(this.r_record.village_id *1 >0 && this.r_record.is_bind_village *1 ==1 && this.r_record.village_name!=undefined && this.r_record.village_name){
                                this.title = '【机器人名称：' + this.r_record.name + ' ，机器人编码：' + this.r_record.robot_code + '，已绑小区：'+this.r_record.village_name+'】告警记录';
                            }
                        }
						this.loading = false
					}).catch((error) => {
						this.loading = false;
					})
			},
			bindOk() {
				this.getList()
			},
			getRemoteRobotAlarmData(){
				this.tips_alarm_visible=true;
				let postArr={'robot_id':this.r_record.id,'robot_code':this.r_record.robot_code};
				this.request(thirdRobotApi.getRemoteRobotAlarmList,postArr)
					.then((res) => {
						this.getList();
					})
			},
			handleTaskCancel(){
				this.tips_alarm_visible = false;
				this.alarm_visible = false;
				this.data = [];
				this.r_record={};
				this.search={
					page: 1
				};
				this.$emit('ok');
			},
			// 表格中变动  这里只针对页面页数切换
			table_change(e) {
				console.log('e', e)
				if (e.current && e.current > 0) {
					this.pagination.current = e.current;
					this.page = e.current;
					this.getList()
				}
			},
			// 日期切换，重新赋值
			dateOnChange(date, dateString) {
				this.search.date = dateString;
				console.log('search', this.search);
			},
			// 进行搜索
			searchList() {
				console.log('search', this.search);
				this.page = 1;
				let val = {
					current: 1,
					pageSize: 10,
					total: 10
				}
				console.log('searchList')
				this.table_change(val)
				// this.getList()
			},

		}
	};
</script>
<style lang="less" scoped>
	.message-suggestions-list-box {
		background-color: white;
	}

	.message-suggestions-list-box .search-box {
		padding: 25px 20px 0;
	}

	.message-suggestions-list-box .add-box {
		padding: 20px 20px 0;
	}

	.message-suggestions-list-box .components-table-demo-nested {
		padding: 10px;
	}

	.message-suggestions-list-box .message_box {
		padding: 10px;
	}

	.lbsf {
		float: right;
		margin-right: 24px;
	}

	.padding-tp10 {
		padding-top: 15px;
		padding-bottom: 15px;
	}

	.statusopen {
		color: green;
	}

	.statusclose {
		color: red;
	}
</style>