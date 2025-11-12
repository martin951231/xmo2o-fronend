<template>
	<a-drawer :title="xtitle" :width="700" :visible="showvisible" @close="handleSubCancel()">
		<a-form :label-col="labelCol" :wrapper-col="wrapperCol" style="margin-bottom: 30px;">
			<div class="details">
				<a-form-item label="机器人名称">
					<span class="item">{{ detailInfo.name }}</span>
				</a-form-item>
			</div>
			<div class="details">
				<a-form-item label="机器人编码">
					<span class="item">{{ detailInfo.robot_code }}</span>
				</a-form-item>
			</div>
			<div class="details">
				<a-form-item label="机器人型号">
					<span class="item">{{ detailInfo.robot_model }}</span>
				</a-form-item>
			</div>
			<div class="details">
				<a-form-item label="是否绑定了小区">
					<span class="item">{{ detailInfo.village_id>0 ? '已绑定小区':'未绑定小区' }}</span>
				</a-form-item>
			</div>
			<div class="details">
				<a-form-item label="绑定的小区名">
					<span class="item">{{ detailInfo.bind_village_name}}</span>
				</a-form-item>
			</div>
			<div class="details">
				<a-form-item label="绑定操作时间">
					<span class="item">{{ detailInfo.bind_village_time}}</span>
				</a-form-item>
			</div>
			<div class="details">
				<a-form-item label="机器人Sku">
					<span class="item">{{ detailInfo.robot_sku }}</span>
				</a-form-item>
			</div>
			<div class="details">
				<a-form-item label="设备类型">
					<span class="item">{{ detailInfo.device_type_str }}</span>
				</a-form-item>
			</div>
			<div class="details">
				<a-form-item label="机器类型">
					<span class="item">{{ detailInfo.robot_type }}</span>
				</a-form-item>
			</div>
			<div class="details">
				<a-form-item label="所属租户编码">
					<span class="item">{{ detailInfo.tenant_code }}</span>
				</a-form-item>
			</div>
			<div class="details">
				<a-form-item label="所属租户名称">
					<span class="item">{{ detailInfo.tenant_name }}</span>
				</a-form-item>
			</div>
			<div class="details">
				<a-form-item label="设备状态">
					<span class="item">{{ detailInfo.online_flag_str }}</span>
				</a-form-item>
			</div>
			<div class="details">
				<a-form-item label="充电状态">
					<span class="item">{{ detailInfo.charge_flag_str }}</span>
				</a-form-item>
			</div>
			<div class="details">
				<a-form-item label="RCU充电状态">
					<span class="item">{{ detailInfo.response_data.rcuChargeFlagStr }}</span>
				</a-form-item>
			</div>
			<div class="details">
				<a-form-item label="工作状态">
					<span class="item">{{ detailInfo.work_flag_str }}</span>
				</a-form-item>
			</div>
			<div class="details">
				<a-form-item label="急停状态">
					<span class="item">{{ detailInfo.response_data.emergencyStopStr }}</span>
				</a-form-item>
			</div>
			<div class="details">
				<a-form-item label="告警数">
					<span class="item">{{ detailInfo.alarming_num }}</span>
				</a-form-item>
			</div>
			<div class="details">
				<a-form-item label="软件版本">
					<span class="item">{{ detailInfo.response_data.softwareVersion }}</span>
				</a-form-item>
			</div>
			<div class="details">
				<a-form-item label="固件版本">
					<span class="item">{{ detailInfo.response_data.firmwareVersion }}</span>
				</a-form-item>
			</div>
			<div class="details">
				<a-form-item label="网络状况">
					<span class="item">{{ detailInfo.network_flag }}</span>
				</a-form-item>
			</div>
			<div class="details">
				<a-form-item label="网络信号强度">
					<span class="item">{{ detailInfo.network_signal }}</span>
				</a-form-item>
			</div>
			<div class="details">
				<a-form-item label="创建时间">
					<span class="item">{{ detailInfo.robot_create_time }}</span>
				</a-form-item>
			</div>
			<div class="details">
				<a-form-item label="修改时间">
					<span class="item">{{ detailInfo.robot_update_time }}</span>
				</a-form-item>
			</div>
			<div class="details">
				<a-form-item label="运行状态">
					<span class="item">{{ detailInfo.running_status_str }}</span>
				</a-form-item>
			</div>
		</a-form>

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
		name: 'platformThirdRobotDetails',
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
				robot_id: 0,
				showvisible: false,
				detailInfo: {response_data:{}},
			}
		},

		methods: {
			detailsPage(robot_id) {
				this.robot_id = robot_id;
				this.showvisible = true;
				this.getOneHotInfo();
			},
			getOneHotInfo() {
				let postArr = {
					robot_id: this.robot_id
				};
				this.request(thirdRobotApi.getOneDetailInfo, postArr)
					.then((res) => {
						this.detailInfo = res;
					}).catch((error) => {

					})
			},

			handleSubCancel() {
				this.robot_id = 0;
				this.showvisible = false;
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