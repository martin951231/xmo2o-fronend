<template>
	<div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
		<div class="search-box" >
			<a-row>
				<a-col :md="5" :sm="12" class="suggestions_col">
					<a-input-group compact>
						<label style="margin-top: 5px;">机器名称：</label> <a-input style="width: 210px"
							placeholder="请输入机器名称" v-model="search.name" />
					</a-input-group>
				</a-col>
				<a-col :md="5" :sm="12" class="suggestions_col">
					<a-input-group compact>
						<label style="margin-top: 5px;">机器人编码：</label> <a-input style="width: 210px"
							placeholder="请输入机器人编码" v-model="search.robot_code" />
					</a-input-group>
				</a-col>
				<a-col :md="4" :sm="10" class="suggestions_col">
					<label style="margin-top: 5px;">设备类型：</label>
					<a-select default-value="0" style="width: 170px" placeholder="请选择设备类型" v-model="search.device_type_v">
						<a-select-option value="0">
							全部
						</a-select-option>
						<a-select-option :value="item.ikey" v-for="(item,index) in device_type_arr" :key="index">
							{{ item.ivalue }}
						</a-select-option>
					</a-select>
				</a-col>
				<a-col :md="4" :sm="10" class="suggestions_col">
					<label style="margin-top: 5px;">工作状态：</label>
					<a-select default-value="0" style="width: 150px" placeholder="请选择工作状态" v-model="search.work_status_v">
						<a-select-option value="-1">
							全部
						</a-select-option>
						<a-select-option :value="item.ikey" v-for="(item,index) in work_status_arr" :key="index">
							{{ item.ivalue }}
						</a-select-option>
					</a-select>
				</a-col>
				<a-col :md="4" :sm="10" class="suggestions_col">
					<label style="margin-top: 5px;">设备状态：</label>
					<a-select default-value="0" style="width: 150px" placeholder="请选择设备状态" v-model="search.device_online_v">
						<a-select-option value="-1">
							全部
						</a-select-option>
						<a-select-option :value="item.ikey" v-for="(item,index) in device_online_arr" :key="index">
							{{ item.ivalue }}
						</a-select-option>
					</a-select>
				</a-col>
				<a-col :md="2" :sm="12" class="suggestions_col_btn">
					<a-button type="primary" icon="search" @click="searchList()">
						查询
					</a-button>
				</a-col>
			</a-row>
		</div>
		<div class="mt-20" v-if="is_configure_right>0">
			<a-button type="primary" @click="getRemoteRobotData()" class="mr-20">拉取机器人数据</a-button>
		</div>
		<a-table :columns="columns" :data-source="list" class="mt-20" :pagination="pagination"
			@change='table_change' :loading="loading" :row-key="record => record.id">
			<span slot="actionstatus" slot-scope="text, record,index">
				<span v-if="record.status==1" style="color: green;">已启用</span>
				<span v-if="record.status<1" style="color: red;">已禁用</span>
			</span>
			<span slot="action" slot-scope="text, record,index">
				<span v-if="is_configure_right>0 && record.del_time==0">
                <a  @click="$refs.robotLookVideoDrawer.lookVideoPage(record.id)">视频设置</a>
                <a-divider type="vertical"  />
				<a  @click="$refs.robotDetailsDrawer.detailsPage(record.id)">查看详情</a>
				<a-divider type="vertical"  />
				<a @click="$refs.robotBindVillageOpt.bindvillage(record)">绑定小区</a>
				<a-divider type="vertical"  />
				<a @click="$refs.robotHistoryTaskList.showTaskList(record)">任务情况</a>
				<a-divider type="vertical" />
				<a @click="$refs.robotAlarmList.showAlarmList(record)" >告警记录</a>
                <a-divider type="vertical" />
                
                <a-popover title="服务费设置" :visible="rowContent.id == record.id?true:false" trigger="click" :destroyTooltipOnHide="true" :getPopupContainer="getPopupContainer">
                    <div slot="content" >
                        <div>
                            召唤费用：<a-input-number v-model="rowContent.service_call_charge" :min="0"></a-input-number>
                        </div>
                        <div style="margin-top:15px;">
                            配送费用：<a-input-number v-model="rowContent.service_charge" :min="0"></a-input-number>
                        </div>
                        <div class="mt-10">
                            <a-button type="link" style="color: #999999;padding-left: 0;" @click="rowContent = {}">取消</a-button><a-button type="link" @click="robotServiceCharge(record,true)">确定</a-button>
                        </div>
                    </div>
                    <a @click="robotServiceCharge(record,false)" >服务费</a>
                </a-popover>
				</span>
			</span>
		</a-table>
        <a-modal title="请稍等,正在为您拉取远程机器人数据..." :visible="tips_visible" :closable="false" :mask-closable="false" :footer="null"
            :width="550">
            <div>
                <a-spin size="large" />
                <span style=" margin-left: 25px;">请稍等,正在为您拉取远程机器人数据...</span>
                <p style="margin: 15px;">拉取数据中,请耐心等待,数量越多拉取时间越长。</p>
            </div>
        </a-modal>
		<robot-details-drawer ref="robotDetailsDrawer" @ok="bindOk" />
		<robot-bind-village-opt ref="robotBindVillageOpt" @ok="bindOk" />
		<robot-history-task-list ref="robotHistoryTaskList" @ok="bindOk" />
		<robot-alarm-list ref="robotAlarmList" @ok="bindOk" />
        <robot-look-video-drawer ref="robotLookVideoDrawer" @ok="bindOk" />
		
	</div>
</template>
<script>
	import thirdRobotApi from '@/api/common/platform/thirdRobotApi';
	import robotDetailsDrawer from "./components/robotDetailsDrawer";
    import robotLookVideoDrawer from "./components/robotLookVideoDrawer";
	import robotBindVillageOpt from "./components/robotBindVillageOpt";
	import robotHistoryTaskList from "./robotHistoryTaskList";
	import robotAlarmList from "./robotAlarmList";
	
	const columns = [{
			title: '机器人名称',
			dataIndex: 'name',
			key: 'name',
			width: 200
		},
		{
			title: '机器人编码',
			dataIndex: 'robot_code',
			key: 'robot_code',
			width: 240
		},
		{
			title: '机器人型号',
			dataIndex: 'robot_model',
			key: 'robot_model',
		},
		{
			title: '设备类型',
			dataIndex: 'device_type_str',
			key: 'device_type_str',
		},
		{
			title: '机器类型',
			dataIndex: 'robot_type',
			key: 'robot_type',
		},
		{
			title: '工作状态',
			dataIndex: 'work_flag_str',
			key: 'work_flag_str',
		},
		{
			title: '设备状态',
			dataIndex: 'online_flag_str',
			key: 'online_flag_str',
		},
		{
			title: '绑定状态',
			dataIndex: 'bind_village_str',
			key: 'bind_village_str',
		},
		{
			title: '删除状态',
			dataIndex: 'del_time_str',
			key: 'del_time_str',
		},
		{
			title: '操作',
			dataIndex: '',
			key: '',
			align: 'center',
			scopedSlots: {
				customRender: 'action'
			}
		},
	];

	export default {
		name: 'platformThirdRobotList',
		components: {
			robotDetailsDrawer,
			robotBindVillageOpt,
			robotHistoryTaskList,
			robotAlarmList,
            robotLookVideoDrawer,
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
					name: '',
					robot_code:'',
					device_type_v:'0',
					device_online_v:'-1',
					work_status_v:'-1',
				},
				loading: false,
				list: [],
				columns,
				confirmLoading: false,
				device_type_arr:[],
				device_online_arr:[],
				work_status_arr:[],
				tips_visible:false,
				is_configure_right:0,
                rowContent: {}
			};
		},

		created() {
			this.getList()
		},
		beforeRouteLeave(to, from, next) {
			this.$destroy()
			next()
		},
		methods: {
			// 获取列表信息
			getList() {
				this.tips_visible = false
				this.loading = true;
				this.search['page'] = this.pagination.current;
				this.request(thirdRobotApi.getThirdRobotList, this.search)
					.then((res) => {
						this.pagination.total = res.count ? res.count : 0
						this.pagination.pageSize = res.total_limit ? res.total_limit : 10
						this.list = res.list
						this.device_type_arr=res.device_type_arr;
						this.device_online_arr=res.device_online_arr;
						this.work_status_arr=res.work_status_arr;
						this.is_configure_right=res.is_configure_right;
						this.loading = false
					}).catch((error) => {
						this.loading = false;
					})
			},
			bindOk() {
				this.getList()
			},
			getRemoteRobotData(){
				this.tips_visible=true;
				this.request(thirdRobotApi.getRemoteRobotList)
					.then((res) => {
                        this.tips_visible = false
						this.getList();
					}).catch((error) => {
						this.tips_visible = false
					})
			},

			// 表格中变动  这里只针对页面页数切换
			table_change(e) {
				if (e.current && e.current > 0) {
					this.pagination.current = e.current;
					this.getList()
				}
			},
			// 日期切换，重新赋值
			dateOnChange(date, dateString) {
				this.search.date = dateString;
			},
			// 进行搜索
			searchList() {
				this.pagination.current = 1;
				this.getList()
			},
            // 服务费设置
            robotServiceCharge(record,isConfirm = false) {
                if(!isConfirm) {
                    this.rowContent = {
                        ...record,
                        service_charge: record.delivery_price?record.delivery_price-0:0,
                        service_call_charge: record.call_price?record.call_price-0:0
                    }
                } else {
                    let params = {
                        robot_price_arr: [
                            {
                                robot_id: this.rowContent.id,
                                delivery_price:this.rowContent.service_charge,
                                call_price:this.rowContent.service_call_charge
                            }
                        ]
                    }
                    this.request(thirdRobotApi.setRobotDeliveryPrice, params).then((res) => {
                        this.$message.success('操作成功')
						this.getList()
                        this.rowContent = {}
					})
                }
            },
            getPopupContainer(trigger) {
                return trigger.parentElement;
            },
		}
	};
</script>
<style lang="less" scoped>
</style>