<template>
    <a-drawer :title="title" :width="800" :visible="visible" @close="closeDrawer">
        <div class="apply_people_msg">
            <div class="title">
                申请人信息
            </div>

            <div class="msg_container">
                <div class="msg_item" v-for="(item, index) in rentUser" :key="index">
                    <div class="content" v-if="item.type == 0">{{item.label}}：{{item.value}}</div>
                    <div class="content" v-if="item.type == 1">{{item.label}}：<a
                            @click="openTemplate(item.url)">{{item.value}}</a></div>
                </div>
            </div>
        </div>

        <div class="deal_content" v-if="visible">
            <a-tabs :default-active-key="currentIndex" @change="tabChange">
                <a-tab-pane :key="1" tab="处理内容" v-if="rent_type == 1">
                    <div class="form_con" v-if="formConfig.is_examine">
                       <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol"
                           :wrapper-col="wrapperCol">
                           <!-- <a-form-model-item>
                               <template slot="label">
                                   <span style="color: red;">*</span>
                                   处理类型
                               </template>
                               {{formConfig.handle_name}}
                           </a-form-model-item> -->
                           <a-form-model-item v-if="formConfig.handle_type == 1">
                               <template slot="label">
                                   <span style="color: red;">*</span>
                                   绑定{{$store.getters.config.room_name}}
                               </template>
                               <a-cascader style="width: 240px;" :options="options" :load-data="loadDataFunc"
                                   class="cascader_style margin_left_10" :placeholder="'请选择'+$store.getters.config.room_name" change-on-select
                                   @change="setVisionsFunc" :value="form.roomArr" />
                           </a-form-model-item>
                           <a-form-model-item :label="formConfig.handle_name + '审核'" prop="resource" v-if="formConfig.examine_data.length>0">
                               <a-radio-group v-model="form.examine_value">
                                   <a-radio v-for="(item, index) in formConfig.examine_data" :value="item.key" @change="changeRadio">
                                       {{item.value}}
                                   </a-radio>
                               </a-radio-group>
                           </a-form-model-item>
                           
                        <a-form-model-item label="上传图片" v-if="formConfig.handle_type==3">
                            <a-upload
                                style="transform: translateX(140px);"
                                action="/v20/public/index.php/common/common.UploadFile/uploadPublicRental" list-type="picture-card"
                                :file-list="fileList"  @preview="handlePreview" @change="handleUploadChange" :before-upload="beforeUpload">
                                <div v-if="fileList.length < 5">
                                    <a-icon type="plus" />
                                    <div class="ant-upload-text">
                                        Upload
                                    </div>
                                </div>
                            </a-upload>
                            
                            <div class="desc" style="transform: translateX(140px);">
                                已上传{{fileList.length}}张, 最多可上传5张
                            </div>
                            
                            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                                <img alt="example" style="width: 100%" :src="previewImage" />
                            </a-modal>
                        </a-form-model-item>
                           
                           <a-form-model-item label="备注" prop="desc">
                               <a-textarea style="padding: 5px width:200px; height: 100px; resize:none;"
                                   placeholder="请输入" v-model="form.remarks" />
                           </a-form-model-item>
                       </a-form-model>
                    </div>
                    <div class="examine_status" v-else>
                        {{formConfig.examine_info}}
                    </div>
                </a-tab-pane>
                <a-tab-pane :key="2" tab="办理记录"> 
                    <div class="deal_record" @scroll="handleScroll">
                        <div class="record_list" v-for="(item, index) in flowChart" :key="index">
                            <div class="flow_icon_out">
                                <div class="flow_icon_in"></div>
                            </div>
                            <div class="flow_line" v-if="index != flowChart.length-1"></div>
                            <div class="props_list">
                                <div class="props_item" v-for="(props_item, props_index) in item" :key="props_index">
                                    <div v-if="props_item.type!='img'">
                                        {{props_item.label}}：{{props_item.value}}
                                    </div>
                                    <div v-else>
                                        <div>{{props_item.label}}：</div>
                                        <div
                                            style="display: flex; flex-wrap:wrap; align-content:flex-start; transform: translateX(-5px)">
                                            <div class="image_item" v-for="(img_item, img_index) in props_item.value"
                                                :key="img_index"
                                                style="
                                            width: 50px; height: 50px; background: #999999; margin: 5px; display:flex; align-items:center; justify-content:center;">
                                                <img :large="img_item" :src="img_item" :preview="1"
                                                    style="width: 100%; height:100%;">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="no_more" v-if="flowChart.length == 0"
                            style="width: 100%; padding: 10px 0; display:flex; align-items:center; justify-content:center;">
                            暂无数据
                        </div>
                        <div class="no_more" v-if="noMore"
                            style="width: 100%; padding: 10px 0; display:flex; align-items:center; justify-content:center;">
                            --没有更多数据了--
                        </div>
                    </div>
                </a-tab-pane>
                <a-tab-pane :key="3" tab="附件列表" v-if="rentRecord.source_type == 1">
                    <div class="enclosure_list">
                        <a-table :columns="columns" :data-source="enclosureList" :pagination="pagination"
                            @change='tableChange' :loading="tableLoading">
                            <span slot="see" slot-scope="text, record">
                                <a v-if="record.file_url" @click="lookImg(record.file_url)">
                                    <a v-if="record.is_image">查看图片</a>
                                    <a v-else>下载文件</a>
                                </a>
                                <a v-else>--</a>
                            </span>
                        </a-table>
                    </div>
                </a-tab-pane>
            </a-tabs>
        </div>
        <div v-if="currentIndex == 1 && formConfig.is_examine" :style="{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  width: '100%',
                  borderTop: '1px solid #e9e9e9',
                  padding: '10px 16px',
                  background: '#fff',
                  textAlign: 'right',
                  zIndex: 1,
                }">
            <a-button :style="{ marginRight: '8px' }" @click="closeDrawer">
                取消
            </a-button>
            <a-button type="primary" @click="onSubmit">
                确定
            </a-button>
        </div>
         <a-drawer title="模板内容" :width="800" :visible="showDrawer" @close="closeTemplate">
             <iframe :src="template_url" width="100%" height="800px"></iframe>
        </a-drawer>
    </a-drawer>
</template>
<script>
    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    import villageApi from '@/api/community/village'
	import store from '@/store';
    const columns = [{
            title: '文件名称',
            dataIndex: 'file_remark',
            key: 'file_remark',
            width: 100
        },
        {
            title: '上传人',
            dataIndex: 'account',
            key: 'account'
        },
        {
            title: '查看',
            dataIndex: 'see',
            key: 'see',
            scopedSlots: {
                customRender: 'see'
            }
        },
        {
            title: '上传时间',
            dataIndex: 'add_time',
            key: 'add_time',
        }
    ];
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            },
            rentRecord: {
                type: Object,
                defalut: () => {
                    return {}
                }
            },
            rent_type: {
                type: Number,
                defalut: 1
            }
        },
        watch: {
            visible: {
                handler(val) {
                    if (val) {
                        this.getApplyRecordUserInfo()
                        this.getConfigInfo()
                        if (this.rent_type == 1) {
                            this.currentIndex = 1
                            this.getSingleListByVillage()
                        } else {
                            this.currentIndex = 2
                            this.currentPage = 1
                            this.flowChart = []
                            this.getApplyRecordLog()
                        }
                    }
                },
                immediate: true
            }
        },
        data() {
            return {
                flowChart: [],
                labelCol: {
                    span: 4
                },
                wrapperCol: {
                    span: 14
                },
                currentIndex: 1,
                form: {
                    roomArr: [],
                    examine_value: 20,
                    remarks:''
                },
                rules: {
                    dealtype: [{
                        required: true,
                        message: '请选择凭证',
                        trigger: 'blur'
                    }],
                },
                columns,
                enclosureList: [],
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: 10,
                    showTotal: total => `共 ${total} 条`
                },
                tableLoading: false,
                currentPage: 1,
                totalCount: 0,
                rentUser: [],
                rentType: {},
                maxPage: 2,
                noMore: false,

                showDrawer: false,
                template_url: '',
                options: [],
                formConfig: {},
                previewImage:'',
                previewVisible:false,
                log_imgs:[],
                fileList:[],
            }
        },
        methods: {
            changeRadio(e){
                this.form.examine_value = e.target.value
                this.$forceUpdate()
            },
            closeDrawer() {
                this.form = {
                    roomArr: []
                }
                if (this.$refs.ruleForm) {
                    this.$refs.ruleForm.resetFields()
                }
                this.$emit('exit')
            },
            tabChange(key) {
                this.currentIndex = key
                if (key == 2) {
                    this.currentPage = 1
                    this.flowChart = []
                    this.getApplyRecordLog()
                }
                if (key == 3) {
                    this.pagination.current = 1
                    this.getEnclosureList()
                }
            },

            openTemplate(url) {
                this.template_url = url
                this.showDrawer = true
            },

            closeTemplate() {
                this.showDrawer = false
            },

            onSubmit() {
                let that = this
                that.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        if((that.form.examine_value==20 || that.form.examine_value==41) && (!that.form.remarks || that.form.remarks.length<1)){
                            let emsg='验房审核不合格时请填写上备注！';
                            if(that.form.examine_value==20){
                                emsg='凭证审核不通过时请填写上备注！';
                            }
                            that.$message.warn(emsg)
                            return false;
                        }
                        if(that.form.examine_value==20){
                             that.saveForm()
                        }else if((that.formConfig.handle_type == 1 && that.form.single_id && that.form.floor_id && that.form.layer_id && that.form.vacancy_id) || that.formConfig.handle_type != 1){
                            that.saveForm()
                        } else {
                            that.$message.warn('请选择'+store.getters.config.room_name)
                        }
                    } else {
                         console.log('error submit!!');
                         return false;
                     }
                });
            },
            
            saveForm(){
                let that = this
                that.form.id = that.rentRecord.id
                that.form.examine_status = that.form.examine_value
                that.form.source_type=that.rentRecord.source_type,
                that.form.log_imgs=this.log_imgs
                that.request('/community/village_api.HousePublicRental/subOperationExamine', that.form).then((res) => {
                    that.$message.success('操作成功')
                    that.closeDrawer()
                    that.$emit('ok')
                })
            },
            //计算列表最大页 判断有无更多数据
            computeMaxpage(count) {
                this.noMore = false
                if (count % 10 == 0) {
                    this.maxPage = parseInt(count / 10)
                } else {
                    this.maxPage = parseInt(count / 10 + 1)
                }
            },  
            handleScroll(e) {
                const {
                    scrollTop,
                    clientHeight,
                    scrollHeight
                } = e.target
                if (scrollTop + clientHeight === scrollHeight) {
                    if (this.flowChart.length > 0) {
                        if (this.currentPage >= this.maxPage) {
                            this.noMore = true
                        } else {
                            this.currentPage += 1
                            this.getApplyRecordLog()
                        }
                    }
                }
            },

            getEnclosureList() {
                this.tableLoading = true;
                this.request('/community/village_api.HousePublicRental/getEnclosureList', {
                    value_id: this.rentRecord.value_id,
                    source_type: this.rentRecord.source_type,
                    page: this.pagination.current
                }).then((res) => {
                    this.pagination.total = res.count ? res.count : 0;
                    this.pagination.pageSize = res.total_limit ? res.total_limit : 10;
                    this.enclosureList = res.list;
                    this.tableLoading = false;
                })
            },

            tableChange() {
                let _this = this;
                if (e.current && e.current > 0) {
                    _this.pagination.current = e.current;
                    _this.getEnclosureList()
                }
            },
            async handlePreview(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImage = file.url || file.preview;
                this.previewVisible = true;
            },
            
            beforeUpload(file) {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                    this.$message.error('You can only upload JPG file!');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('Image must smaller than 2MB!');
                }
                return isJpgOrPng && isLt2M;
            },
            
            handleUploadChange({  fileList }) {
                let that = this
                that.fileList = fileList;
                that.log_imgs = []
                that.fileList.map(v=>{
                    if(v.response && v.response.data && v.response.data.url){
                        that.log_imgs.push(v.response.data.url)
                    }
                })
            },
            handleCancel() {
                this.previewVisible = false;
            },
            
            //查看图片
            lookImg(url) {
                window.open(url, '_blank');
            },

            getApplyRecordLog() {
                this.request('/community/village_api.HousePublicRental/getApplyRecordLog', {
                    id: this.rentRecord.id,
                    page: this.currentPage,
                    source_type: this.rentRecord.source_type
                }).then((res) => {
                    this.flowChart = [...this.flowChart, ...res.list]
                    this.totalCount = res.count
                    this.computeMaxpage(res.count)
                    this.$previewRefresh()
                })
            },

            getApplyRecordUserInfo() {
                this.uploadFileName=false;
                this.request('/community/village_api.HousePublicRental/getApplyRecordUserInfo', {
                    id: this.rentRecord.id,
                    source_type: this.rentRecord.source_type
                }).then((res) => {
                    this.rentUser = res.user
                    this.rentType = res.type
                })
            },
            
            getConfigInfo(){
                this.log_imgs=[];
                this.fileList=[];
                this.request('/community/village_api.HousePublicRental/getApplyRecordInfo', {
                    id: this.rentRecord.id,
                    source_type: this.rentRecord.source_type
                }).then((res) => {
                    this.formConfig = res
                    this.form.examine_value = res.examine_value
                    this.form.remarks = res.remarks
                    if(res.examine_value == 21){
                        this.form.examine_status = true
                    } else {
                        this.form.examine_status = false
                    }
                })
            },
        
            //选择房间
            getSingleListByVillage() {
                this.request(villageApi.getSingleListByVillage, {is_public_rental: 1}).then(res => {
                    if (res) {
                        let array = []
                        res.map(pro => {
                            array.push({
                                label: pro.name,
                                value: pro.id,
                                isLeaf: false
                            });
                        });
                        this.options = array
                    }
                });
            },
            // 单元楼
            getFloorList(id) {
                return new Promise(resolve => {
                    this.request(villageApi.getFloorList, {
                        pid: id,
                        is_public_rental: 1
                    }).then(res => {
                        resolve(res);
                    });
                });
            },
            // 楼层
            getLayerList(id) {
                return new Promise(resolve => {
                    this.request(villageApi.getLayerList, {
                        pid: id,
                        is_public_rental: 1
                    }).then(res => {
                        if (res) {
                            resolve(res);
                        }
                    });
                })
            },
            // 房间
            getVacancyList(id) {
                return new Promise(resolve => {
                    this.request(villageApi.getVacancyList, {
                        pid: id,
                        is_public_rental: 1
                    }).then(res => {
                        if (res) {
                            resolve(res);
                        }
                    });
                })
            },

            async loadDataFunc(selectedOptions) {
                const targetOption = selectedOptions[selectedOptions.length - 1];
                targetOption.loading = true;
                setTimeout(function() {
                    targetOption.loading = false;
                }, 100)
            },
            // 处理加载漏洞单元（选择、编辑时可用）
            async setVisionsFunc(selectedOptions) {
                // this.vehicleForm.roomArr = selectedOptions
                this.form.roomArr = selectedOptions
                console.log('selectedOptions=====>', selectedOptions)
                if (selectedOptions.length == 4) {
                    this.form.single_id = selectedOptions[0]
                    this.form.floor_id = selectedOptions[1]
                    this.form.layer_id = selectedOptions[2]
                    this.form.vacancy_id = selectedOptions[3]
                    this.$forceUpdate()
                    return
                }
                if (selectedOptions.length === 1) {
                    const options_temp = [...this.options];
                    const res = await this.getFloorList(selectedOptions[0]);
                    const children = [];
                    res.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: false
                        });
                        options_temp['children'] = children
                        return true;
                    });
                    options_temp.find(_ => _.value === selectedOptions[0])['children'] = children;
                    this.options = options_temp
                } else if (selectedOptions.length === 2) {
                    const apps = await this.getLayerList(selectedOptions[1]);
                    const options_temp = [...this.options];
                    const children = [];
                    apps.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: false
                        });
                        return true;
                    });
                    const product = options_temp.find(_ => _.value === selectedOptions[0]);
                    product.children.find(_ => _.value === selectedOptions[1])['children'] = children;
                    this.options = options_temp
                } else if (selectedOptions.length === 3) {
                    const apps = await this.getVacancyList(selectedOptions[2]);
                    const options_temp = [...this.options];
                    const children = [];
                    apps.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: true
                        });
                        return true;
                    });
                    const product = options_temp.find(_ => _.value === selectedOptions[0]);
                    const product_1 = product.children.find(_ => _.value === selectedOptions[1])
                    product_1.children.find(_ => _.value === selectedOptions[2])['children'] = children;
                    this.options = options_temp
                }
            },
        }
    }
</script>

<style lang="less" scoped>
    .apply_people_msg {
        width: 100%;

        .title {
            font-size: 17px;
            font-weight: bold;
        }

        .msg_container {
            width: 100%;
            margin-top: 5px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-wrap: wrap;
            align-content: flex-start;

            .msg_item {
                width: 50%;
                margin: 3px 0;
            }
        }

        .deal_content {
            margin-top: 50px;
        }
    }
    /deep/ .ant-upload-picture-card-wrapper{display: inherit;}
    /deep/ textarea {
        overflow-x: hidden;
        overflow-y: scroll !important;
    }

    .form_con {
        height: 70vh;
        overflow-y: scroll;
        padding: 20px;

        &::-webkit-scrollbar {
            width: 0;
        }
    }

    .deal_record {
        height: 70vh;
        overflow-y: scroll;
        padding: 20px;

        &::-webkit-scrollbar {
            width: 0;
        }

        .record_list {
            margin: 10rpx;
            position: relative;
            margin: 15px 30px;

            .flow_line {
                position: absolute;
                width: 2px;
                border: 0;
                height: calc(100% + 10px);
                background-color: #409EFF;
                top: 14px;
                left: -23px;
            }

            .flow_icon_out {
                width: 15px;
                height: 15px;
                border-radius: 10px;
                background-color: #409EFF;
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                left: -30px;
                top: 3.5px;

                .flow_icon_in {
                    width: 7px;
                    height: 7px;
                    border-radius: 10px;
                    background-color: #ffffff;
                }
            }

            .props_list {
                width: 80%;

                .props_list {
                    margin: 10px 0;
                }
            }
        }
    }

    .enclosure_list {
        height: 70vh;
        padding: 20px;
        overflow-y: scroll;

        &::-webkit-scrollbar {
            width: 0;
        }
    }
</style>
