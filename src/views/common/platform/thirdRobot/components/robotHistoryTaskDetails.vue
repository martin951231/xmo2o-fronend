<template>
	<a-drawer :title="xtitle" :width="850" :visible="showdetailvisible" @close="handleSubCancel()">
		<div v-if="taskDetails.length>0" >
		
		  <a-timeline mode="alternate" :pending="true"  pendingDot=" " v-for="(item,index) in taskDetails" >
				<a-timeline-item >
					<div><span>任务点名称：</span>{{item.point_name}}</div>
				</a-timeline-item>
				<a-timeline-item>
				  <a-icon slot="dot" type="clock-circle-o" style="font-size: 16px;" />
					<div><span>开始时间：</span>{{item.start_time_str}}</div>
					<div><span>抵达时间：</span>{{item.arrival_time_str}}</div>
					<div><span>结束时间：</span>{{item.end_time_str}}</div>
				</a-timeline-item>
				<a-timeline-item color="green">
				   <div><span>线路点名称：</span>{{item.target_point_name}} </div>
				   <div><span>是否是目标点：</span>{{item.target_point_flag}}</div>
				   <div><span>节点状态：</span>{{item.status_str}}</div>
				    <div><span>执行动作：</span>
					 <a-tooltip  placement="topRight" style="color: green;font-weight: bold;margin-right: 10px;" v-if="item.actions.length>0" v-for="(item_a,index_a) in item.actions">
				       <template slot="title" >
				        {{item_a}}
				       </template>
				       {{item_a.actionName}}
				     </a-tooltip>
					 </div>
				   <div><span>地图名称：</span>{{item.map_name}}</div>
				   <div><span>地图编码：</span>{{item.map_code}}</div>
				   <div><span>更新时间：</span>{{item.update_time_str}}</div>
				</a-timeline-item>
		  </a-timeline>
		</div>
		<div v-else> <span>暂无详细数据</span> </div>
	</a-drawer>
</template>

<script>
	import thirdRobotApi from '@/api/common/platform/thirdRobotApi';

	function getBase64(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = error => reject(error);
		});
	}

	export default {
		name: 'robotHistoryTaskDetails',
		components: {

		},
		data() {
			return {
				confirmLoading: false,
				labelCol: {
					span: 5
				},
				wrapperCol: {
					span: 18
				},
				xtitle: '查看详情',
				t_record: {},
				showdetailvisible: false,
				taskDetails: [],
			}
		},

		methods: {
			showTaskDetails(t_record) {
				this.t_record = t_record;
				this.showdetailvisible = true;
				this.getOneTaskDetail();
			},
			getOneTaskDetail() {
				let postArr = {
					task_id: this.t_record.task_id,
					task_instance_id: this.t_record.task_instance_id,
					id: this.t_record.id,
					robot_code: this.t_record.robot_code,
				};
				this.request(thirdRobotApi.geteRobotTaskDetails, postArr)
					.then((res) => {
						this.taskDetails = res;
					}).catch((error) => {

					})
			},

			handleSubCancel() {
				this.showdetailvisible = false;
				this.confirmLoading = false;
				this.$emit('ok');
			},
		},
	}
</script>

<style lang="less" scoped>
	.form_title {
		font-size: 14px;
		font-weight: bold;
	}

	.generation_rules {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		margin-top: 5px;
	}

	/deep/ .details .ant-form-item-control-wrapper {
		display: inline-block;
	}

	/deep/ .ant-form-item {
		margin-bottom: 1px;
	}

	/deep/ .details .uploadFile .ant-form-item-control-wrapper {
		width: 520px;
	}

	/deep/ .details .ant-form-item-label {
		vertical-align: top;
	}

	.details .item {
		margin-left: 20px;
		font-size: 16px;
		font-weight: bold;
	}

	/deep/ .ant-upload-list-item-info {
		width: 95%;
	}

	/deep/ .ant-upload-list-item-card-actions {
		right: auto;
	}
	/deep/ .ant-tooltip-inner{
		background-color:#f7f7f7;
		color: green;
		padding:15px;
	}
	.previewimg img {
		cursor: pointer;
	}

	.footer_button {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-end;

	}
</style>