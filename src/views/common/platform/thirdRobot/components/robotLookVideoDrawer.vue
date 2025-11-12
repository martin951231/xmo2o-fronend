<template>
	<a-drawer :title="xtitle" :width="1000" :visible="showLookvisible" @close="handleSubCancel()">
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
					<div style="width: 48%;display: inline-block;"><span style="margin-left: 100px;font-weight: bold;">机器人型号</span>：<span class="item">{{ detailInfo.robot_model }}</span></div>
					<div style="width: 48%;display: inline-block;"><span  style="font-weight: bold;">机器类型</span>：<span class="item">{{ detailInfo.robot_type }}</span></div>
			</div>

			<div class="details" >
				<div style="width: 48%;display: inline-block;"><span style="margin-left: 100px;font-weight: bold;">所属租户编码</span>：<span class="item">{{ detailInfo.tenant_code }}</span></div>
                <div  style="width: 48%;display: inline-block;"><span style="font-weight: bold;">所属租户名称</span>：<span class="item">{{ detailInfo.tenant_name }}</span></div>
			</div>
            
            <div class="details">
            	<a-form-item label="是否绑定了小区">
            		<span class="item">{{ detailInfo.village_id>0 ? '已绑定小区':'未绑定小区' }}</span>
            	</a-form-item>
                
                <a-form-item label="绑定的小区名" v-if="detailInfo.village_id>0">
                	<span class="item">{{ detailInfo.bind_village_name}}</span>
                </a-form-item>
            </div>

         <div class="details" v-if="detailInfo.village_id>0">
         	<a-form-item label="查看视频监控设置">
         		<a-select  style="width: 200px" placeholder="请选择查看类型" v-model="look_video_type" @change="changeLookType">
         			<a-select-option :value="0">
         				不支持查看
         			</a-select-option>
         			<a-select-option :value="item.tkey" v-for="(item,index) in look_video_type_arr" :key="index">
         				{{ item.tvalue }}
         			</a-select-option>
         		</a-select> &nbsp;&nbsp;&nbsp;请选择设置
         	</a-form-item>
         </div>
         <div class="details">
         	<a-form-item label="设备状态">
         		<span class="item">{{ detailInfo.online_flag_str }}</span>
         	</a-form-item>
         </div>
         
		</a-form>
        
            <div class="details" v-if="detailInfo.online_flag>0" style="margin-left: 50px;">
            	<a-form-item label="预览视频">
            		<a-button type="primary"  @click="look_video()">
            			点击预览视频
            		</a-button>
            	</a-form-item>
            </div>
            
            <a-modal
                title="预览视频"
                :visible="look_video_visible"
                :footer="null"
                :width="1100"
                @cancel="handleCancelLook">
                 <iframe v-if="look_video_visible" :src="look_video_url" width="1050" height="680" style="border: none;"></iframe>
            </a-modal>
            
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
				xtitle: '视频预览详情',
				robot_id: 0,
				showLookvisible: false,
				detailInfo: {response_data:{}},
                look_video_type_arr:[{tkey:1,tvalue:'业主查看'},{tkey:2,tvalue:'业主和家属查看'}],
                look_video_type:0,
                look_video_visible:false,
                look_video_url:'',
			}
		},

		methods: {
			lookVideoPage(robot_id) {
				this.robot_id = robot_id;
				this.showLookvisible = true;
				this.getOneHotInfo();
			},
			getOneHotInfo() {
				let postArr = {
					robot_id: this.robot_id,
                    xtype:1,
                    get_look_video:1,
				};
				this.request(thirdRobotApi.getOneDetailInfo, postArr)
					.then((res) => {
						this.detailInfo = res;
                        this.look_video_type=res.look_video_type ? res.look_video_type :0;
                        this.look_video_url=res.look_video_url
					}).catch((error) => {

					})
			},
            changeLookType(value){
                let postArr = {
                	robot_id: this.robot_id,
                    look_video_type:value
                };
                this.request(thirdRobotApi.saveUpdateRobotSet, postArr)
                	.then((res) => {
                		this.$message.success('操作成功')
                	}).catch((error) => {
                
                	})
            },
            look_video(){
                this.look_video_visible=true;
            },
            handleCancelLook(){
                this.look_video_visible=false;
            },
            handleSubCancel() {
				this.robot_id = 0;
				this.showLookvisible = false;
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