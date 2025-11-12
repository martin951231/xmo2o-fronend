<template>
	<a-drawer :title="title" :width="1500" :visible="task_visible" :maskClosable="false" @close="handleTaskCancel"
		placement="right">
	<div class="message-suggestions-list-box">
		<!--
		<div class="search-box" ></div>
		-->
		<a-row>
			<a-col :md="3" :sm="24" style="margin-left: 50px;" v-if="is_configure_right>0" >
				<a-button  type="primary" @click="getRemoteRobotTaskData()">拉取任务列表数据</a-button>
			</a-col>
		</a-row>
		<a-table :columns="columns" :data-source="data" class="components-table-demo-nested" :pagination="pagination"
			@change='table_change' :loading="loading" :row-key="record => record.id">
			<span slot="action" slot-scope="text, record,index">
				<a @click="$refs.robotHistoryTaskDetails.showTaskDetails(record)"> 任务详情 </a>
				</span>
			</span>
		</a-table>
        <a-modal title="请稍等,正在为您拉取任务列表数据..." :visible="tips_task_visible" :closable="false" :mask-closable="false" :footer="null"
            :width="550">
            <div>
                <a-spin size="large" />
                <span style=" margin-left: 25px;">请稍等,正在为您拉取任务列表数据...</span>
                <p style="margin: 15px;">拉取数据中,请耐心等待,数量越多拉取时间越长。</p>
            </div>
        </a-modal>
		<robot-history-task-details ref="robotHistoryTaskDetails" @ok="bindOk" />
	</div>
	</a-drawer>
</template>
<script>
	import thirdRobotApi from '@/api/common/platform/thirdRobotApi';
	import robotHistoryTaskDetails from "./components/robotHistoryTaskDetails";
	import {
		Collapse
	} from 'ant-design-vue';
	const columns = [{
				title: '任务ID',
				dataIndex: 'task_id',
				key: 'task_id',
		},{
			title: '任务名称',
			dataIndex: 'task_name',
			key: 'task_name',
			width: 220
		},
		{
			title: '机器人名称',
			dataIndex: 'robot_name',
			key: 'robot_name',
		},
		{
			title: '机器人编码',
			dataIndex: 'robot_code',
			key: 'robot_code',
			width: 220
		},
		{
			title: '机器类型',
			dataIndex: 'robot_type',
			key: 'robot_type',
		},
		{
			title: '开始时间',
			dataIndex: 'start_time_str',
			key: 'start_time_str',
		},
		{
			title: '结束时间',
			dataIndex: 'end_time_str',
			key: 'end_time_str',
		},
		{
			title: '任务状态',
			dataIndex: 'status_str',
			key: 'status_str',
		},
		{
			title: '操作',
			dataIndex: '',
			key: '',
			align: 'center',
			width: 90,
			scopedSlots: {
				customRender: 'action'
			}
		},
	];

	const data = [];
	export default {
		name: 'thirdRobotHistoryTask',
		filters: {

		},
		components: {
			'a-collapse': Collapse,
			'a-collapse-panel': Collapse.Panel,
			robotHistoryTaskDetails,
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
				tips_task_visible:false,
				task_visible:false,
				is_configure_right:0,
				r_record:{},
				title:'',
			};
		},

		created() {
	
		},

		methods: {
			showTaskList(r_record) {
				this.r_record = r_record;
				this.title = '【机器人名称：' + this.r_record.name + ' ，机器人编码：' + this.r_record.robot_code + '】任务情况';
				this.getList();
				this.task_visible = true;
			},
			// 获取列表信息
			getList() {
				this.tips_task_visible = false
				this.loading = true;
				this.search['robot_id'] = this.r_record.id;
				this.search['robot_code'] = this.r_record.robot_code;
				this.search['page'] = this.page;
				this.request(thirdRobotApi.getThirdRobotTaskList, this.search)
					.then((res) => {
						this.pagination.total = res.count ? res.count : 0
						this.pagination.pageSize = res.total_limit ? res.total_limit : 10
						this.data = res.list
						this.is_configure_right=res.is_configure_right;
						this.loading = false
					}).catch((error) => {
						this.loading = false;
					})
			},
			bindOk() {
				this.getList()
			},
			getRemoteRobotTaskData(){
				this.tips_task_visible=true;
				let postArr={'robot_id':this.r_record.id,'robot_code':this.r_record.robot_code};
				this.request(thirdRobotApi.getRemoteRobotTaskList,postArr)
					.then((res) => {
						this.getList();
					})
			},
			handleTaskCancel(){
				this.tips_task_visible = false;
				this.task_visible = false;
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