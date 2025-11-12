<template>
	<a-drawer :title="title" :width="1220" :visible="visible" :maskClosable="false" @close="handleCancel"
		placement="right">
		<a-card>
			<div class="search-box">
				<a-row>
					<a-col :span="18" style="padding-left: 1px; padding-right: 1px;width: 335px;">
						<label style="margin-top: 5px;">选择省市区县街道社区：</label>
						<a-select default-value="0" style="width: 170px" placeholder="请选择省" v-model="search.province_id"
							@change="handleSelectProvince">
							<a-select-option value="0">
								全部省
							</a-select-option>
							<a-select-option :value="item.id" v-for="(item,index) in province_list">
								{{item.name}}
							</a-select-option>
						</a-select>
					</a-col>

					<a-col :span="18" style="padding-left: 1px; padding-right: 1px;width: 180px;">
						<a-select default-value="0" style="width: 170px" placeholder="请选择城市" v-model="search.city_id"
							@change="handleSelectCity">
							<a-select-option value="0">
								全部城市
							</a-select-option>
							<a-select-option :value="item.id" v-for="(item,index) in city_list">
								{{item.name}}
							</a-select-option>
						</a-select>
					</a-col>
					<a-col :span="18" style="padding-left: 1px; padding-right: 1px;width: 180px;">
						<a-select default-value="0" style="width: 170px" placeholder="请选择区县" v-model="search.area_id"
							@change="handleSelectArea">
							<a-select-option value="0">
								全部区县
							</a-select-option>
							<a-select-option :value="item.id" v-for="(item,index) in area_list">
								{{item.name}}
							</a-select-option>
						</a-select>
					</a-col>
					<a-col :span="18" style="padding-left: 1px; padding-right: 1px;width: 180px;">
						<a-select default-value="0" style="width: 170px" placeholder="请选择街道/镇"
							v-model="search.street_id" @change="handleSelectStreet">
							<a-select-option value="0">
								全部街道/镇
							</a-select-option>
							<a-select-option :value="item.id" v-for="(item,index) in street_list">
								{{item.name}}
							</a-select-option>
						</a-select>
					</a-col>
					<a-col :span="18" style="padding-left: 1px; padding-right: 1px;width: 180px;">
						<a-select default-value="0" style="width: 170px" placeholder="请选择社区/村"
							v-model="search.community_id" @change="handleSelectCommunity">
							<a-select-option value="0">
								全部社区/村
							</a-select-option>
							<a-select-option :value="item.id" v-for="(item,index) in community_list">
								{{item.name}}
							</a-select-option>
						</a-select>
					</a-col>
				</a-row>
				<a-row style="margin-top: 21px;margin-left: 20px;">
					<a-col :span="18" style="padding-left: 1px; padding-right: 1px;width: 200px;">
						<a-input style="width: 200px" placeholder="请输入小区名称" autocomplete="off"
							v-model="search.keyword" />
					</a-col>
					<a-col :span="18" style="padding-left: 10px;padding-bottom: 15px;width: 37%;">
						<a-button type="primary" icon="search" @click="searchList()">
							查询
						</a-button>
						<a-button type="primary" @click="resetList()" style="margin-left: 15px;">
							重置
						</a-button>
					</a-col>
				</a-row>
			</div>
			<div style="padding: 0px 0px 10px 10px;font-size: 16px;"><span style="color: green;font-weight: bold;">{{bind_village_info}}</span><span style="color: green;margin-left: 30px;">{{branch_info}}</span></div>
			<a-table :columns="columns" :data-source="data" :pagination="pagination"
				class="components-table-demo-nested" @change='table_change' :loading="loading"
				:row-key="record => record.village_id">

				<span slot="village_bind_state" slot-scope="text,record,index">
					<span v-if="bind_village_id>0 && bind_village_id*1==record.village_id*1"
						style="color:green;">此机器人已绑定</span>
					<span v-if="bind_village_id==0" >此机器人未绑定</span>
				</span>
				<span slot="action" slot-scope="text,record,index">
					<a-button @click="showBindConfirm(record,1)"  type="primary" v-if="bind_village_id==0"> 绑定此机器人 </a-button>
					<a-button @click="showBindConfirm(record,2)" v-if="bind_village_id>0 && bind_village_id*1==record.village_id*1 "> 取消机器人绑定 </a-button>
				</span>
			</a-table>
		</a-card>
	</a-drawer>

</template>
<script>
	import thirdRobotApi from '@/api/common/platform/thirdRobotApi';
	import {
		Collapse
	} from 'ant-design-vue';
	import moment from 'moment'
	const columns = [{
			title: '小区ID',
			dataIndex: 'village_id',
			key: 'village_id'
		},
		{
			title: '小区名称',
			dataIndex: 'village_name',
			key: 'village_name'
		},
		{
			title: '小区地址',
			dataIndex: 'village_address',
			key: 'village_address'
		},
		{
			title: '绑定状态',
			dataIndex: 'village_bind_str',
			key: '',
			width:160,
			scopedSlots: {
				customRender: 'village_bind_state'
			}
		},
		{
			title: '操作',
			dataIndex: '',
			key: '',
			width:180,
			scopedSlots: {
				customRender: 'action'
			}
		},
	];
	const data = [];
	export default {
		name: 'robotBindVillageOpt',
		filters: {

		},
		components: {
			'a-collapse': Collapse,
			'a-collapse-panel': Collapse.Panel,
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
				search: {
					keyword: '',
					province_id: "0",
					city_id: "0",
					area_id: "0",
					street_id: "0",
					community_id: "0",
					page: 1
				},
				pagination: {
					current: 1,
					pageSize: 10,
					total: 10
				},
				visible: false,
				loading: false,
				data,
				columns,
				title: '',
				province_list: [],
				city_list: [],
				area_list: [],
				street_list: [],
				community_list: [],
				r_record: {},
				bind_village_id: 0,
				bind_village_info:'',
				branch_info:'',
			};
		},
		activated() {

		},
		mounted() {

		},

		methods: {
			moment,
			bindvillage(r_record) {
				this.bind_village_info='';
				this.branch_info='';
				this.r_record = r_record;
				this.bind_village_id = r_record.village_id;
				this.title = '绑定小区【机器人名称：' + this.r_record.name + ' ，机器人编码：' + this.r_record.robot_code + '】';
				if(r_record.village_id>0){
					this.bind_village_info='已绑定小区：'+ r_record.bind_village_name+'，小区ID：'+r_record.village_id;
				}
				if(r_record.branch_id>0){
					this.branch_info='所属组织机构名称：'+ r_record.branch_name+'，所属组织机构ID：'+r_record.branch_id;
				}
				this.visible = true;
				this.getOneHotInfo();
				this.getPropertyvillage();
				this.getProvinceCityAreas(0, 0);
			},
			showBindConfirm(record, xtype){
				let xTitle = '';
				let xContent='';
				if (xtype == 1) {
					xTitle = '绑定机器人【'+this.r_record.name+'】';
					xContent = "是否确定将机器人【"+ this.r_record.name +"，机器人编码：" + this.r_record.robot_code + "】绑定到【" + record.village_name + "】小区，并同步人脸数据到设备？";
				} else if (xtype == 2) {
					xTitle = '解绑机器人【'+this.r_record.name+'】';
					xContent = "是否确定取消机器人绑定【" + record.village_name + "】小区？";
				}
				let postArr={village_id:record.village_id,robot_id:this.r_record.id,xtype:xtype,robot_code:this.r_record.robot_code};
				let _this=this;
				this.$confirm({
				  title: xTitle,
				  content: xContent,
				  onOk() {
				      _this.request(thirdRobotApi.robotBindVillageOpt,postArr)
				        .then((res) => {
				            console.log('res', res)
				          _this.$message.success('操作成功')
				          _this.getOneHotInfo();
						  if(xtype==1 && res.not_bind_village_count>0){
							  _this.showBindBranchConfirm(_this,record,res.not_bind_village_count);
						  }
				        }).catch((error) => {

					 })
				  },
				  onCancel() {
					  _this.getOneHotInfo();
				  },
				});
			},
			showBindBranchConfirm(_this,record,num){
				let xTitle = '';
				let xContent='';
				xTitle = '绑定同一组织机构【'+_this.r_record.branch_name+'】下的机器人';
				xContent = "是否确定将同属于组织机构【"+_this.r_record.branch_name+"】下的其他"+num+"台尚未绑定的机器人绑定到【" + record.village_name + "】小区，并同步人脸数据到设备？";
				let postArr={village_id:record.village_id,robot_id:_this.r_record.id,branch_id:_this.r_record.branch_id};
				let __this=_this;
				_this.$confirm({
				  title: xTitle,
				  content: xContent,
				  onOk() {
				      __this.request(thirdRobotApi.robotBranchBindVillageOpt,postArr)
				        .then((res) => {
				            console.log('res', res)
				          __this.$message.success('操作成功')
				          __this.getOneHotInfo();
				        }).catch((error) => {
				
					 })
				  },
				  onCancel() {
					  __this.getOneHotInfo();
				  },
				});
			},
			getTipsTitle(village_name, xtype) {
				let xTitle = '';
				if (xtype == 1) {
					xTitle = "是否确定绑定【" + village_name + "】小区，并同步人脸数据到设备？";
				} else if (xtype == 2) {
					xTitle = "是否确定取消绑定【" + village_name + "】小区？";
				}
				return xTitle;
			},
			getOneHotInfo() {
				let postArr = {
					robot_id: this.r_record.id,
					xtype: 1,
				};
				this.request(thirdRobotApi.getOneDetailInfo, postArr)
					.then((res) => {
						this.r_record = res;
						this.bind_village_id = this.r_record.village_id;
						this.title = '绑定小区【机器人名称：' + this.r_record.name + ' ，机器人编码：' + this.r_record.robot_code + '】';
					}).catch((error) => {

					})
			},
			//获取物业小区
			getPropertyvillage() {
				this.search.page = this.pagination.current;
				this.search.comefrom='thirdRobot';
				this.request(thirdRobotApi.getAllVillages, this.search)
					.then((res) => {
						this.data = res.list;
						this.pagination.total = res.count ? res.count : 0
						this.pagination.pageSize = res.total_limit ? res.total_limit : 10
					})
			},
			searchList() {
				this.pagination.current = 1;
				this.getPropertyvillage();
			},
			//获取省市区信息 xtype 0 省 1市 2区县
			getProvinceCityAreas(xtype, pid) {
				let postArr = {
					xtype: xtype,
					pid: pid
				};
				this.request(thirdRobotApi.getProvinceCityAreas, postArr)
					.then((res) => {
						if (xtype == 0) {
							this.province_list = res;
						} else if (xtype == 1) {
							this.city_list = res;
						} else if (xtype == 2) {
							this.area_list = res;
						}
					})
			},
			handleSelectProvince(value, option) {
				this.city_list = [];
				this.area_list = [];
				this.street_list= [];
				this.community_list= [];
				this.search.city_id = '0';
				this.search.area_id = "0";
				this.search.street_id = "0";
				this.search.community_id = "0";
				if (value == 0 || value == '0' || !value) {
					this.search.province_id = '0';
				} else {
					this.search.province_id = value;
					this.getProvinceCityAreas(1, this.search.province_id);
				}

			},
			handleSelectCity(value, option) {
				this.area_list = [];
				this.street_list= [];
				this.community_list= [];
				this.search.area_id = "0";
				this.search.street_id = "0";
				this.search.community_id = "0";
				if (value == 0 || value == '0' || !value) {
					this.search.city_id = '0';
				} else {
					this.search.city_id = value;
					this.getProvinceCityAreas(2, this.search.city_id);
				}
			},
			handleSelectArea(value, option) {
				this.street_list= [];
				this.community_list= [];
				this.search.street_id = "0";
				this.search.community_id = "0";
				if (value == 0 || value == '0' || !value) {
					this.search.area_id = "0";
				} else {
					this.search.area_id = value;
				}
				this.getStreetCommunityDatas(0, this.search.area_id);
			},

			handleSelectStreet(value, option) {
				this.community_list= [];
				this.search.community_id = "0";
				if (value == 0 || value == '0' || !value) {
					this.search.street_id = "0";
				} else {
					this.search.street_id = value;
				}
				this.getStreetCommunityDatas(1, this.search.street_id);
			},

			handleSelectCommunity(value, option) {
				if (value == 0 || value == '0' || !value) {
					this.search.community_id = "0";
				} else {
					this.search.community_id = value;
				}

			},
			//获取街道社区 xtype 0 街道 1社区
			getStreetCommunityDatas(xtype, pid) {
				let postArr = {
					xtype: xtype,
					pid: pid
				};
				this.request(thirdRobotApi.getStreetCommunityList, postArr)
					.then((res) => {
						if (xtype == 0) {
							this.street_list = res;
						} else if (xtype == 1) {
							this.community_list = res;
						}
					})
			},
			handleCancel() {
				this.visible = false;
				this.data = [];
				this.city_list = [];
				this.area_list = [];
				this.street_list= [];
				this.community_list= [];
				this.r_record={};
				this.bind_village_info='';
				this.branch_info='';
				this.search={
					keyword: '',
					province_id: "0",
					city_id: "0",
					area_id: "0",
					street_id: "0",
					community_id: "0",
					page: 1
				};
				this.$emit('ok');
			},
			resetList() {
				this.city_list = [];
				this.area_list = [];
				this.street_list= [];
				this.community_list= [];
				this.search={
					keyword: '',
					province_id: "0",
					city_id: "0",
					area_id: "0",
					street_id: "0",
					community_id: "0",
					page: 1
				};
				this.getPropertyvillage();
			},
			// 表格中变动  这里只针对页面页数切换
			table_change(e) {
				let _this = this;
				if (e.current && e.current > 0) {
					_this.pagination.current = e.current;
					_this.getPropertyvillage()
				}
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

	.lbsf {
		float: right;
		margin-right: 24px;
	}

	.padding-tp10 {
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

	#components_layout_menus .ant-layout-sider {
		background-color: #fff;
		width: 150px;
		font-size: 25px;
		display: inline-block;
	}

	#components_layout_menus .ant-layout {
		min-height: 40px;
		vertical-align: middle;
		border-bottom: 1px solid #eee;
		margin-bottom: 10px;
	}

	#components_layout_menus .ant-layout-header {
		background-color: #fff;
	}

	#components_layout_menus .ant-layout-footer {
		background-color: #fff;
	}

	#components_layout_menus .sub2div {
		margin-left: 35px;
		border-bottom: 1px solid #eee;
	}

	#components_layout_menus .sub1div label {
		font-size: 16px;
		padding-left: 2px;
		color: #2b7dbc;
	}

	#components_layout_menus .sub2div label {
		font-size: 16px;
		padding-left: 2px;
		color: green;
	}

	#components_layout_menus .sub2div .sub2div_2div {
		margin-left: 35px;
	}

	#components_layout_menus .sub2div .sub2div_2div label {
		font-size: 14px;
		color: #000000a6
	}

	/deep/ textarea {
		overflow-y: scroll !important;
	}
</style>