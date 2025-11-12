<template>
    <div>
        <a-modal
            :visible="visible"
            :title="title"
            width="60%"
            :bodyStyle="{'overflow-y': 'auto','height':'750px'}"
            @cancel="handleCancel"
            @ok="handleOk"
        >
            <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item label="活动页名称" required>
                    <a-input
                        v-model="formData.name"
                        class="sort-input"
                        @change="handleNameChange"
                    />
                    活动页名称将在活动页标题栏展示
                </a-form-model-item>
                <a-form-model-item label="配置轮播图">
                    <a-button type="primary" class="ml-20" @click="getBanner()">配置</a-button>
                </a-form-model-item>
            </a-form-model>
            <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item label="活动时间" required>
                   <a-range-picker 
                        v-model="datetimeStr"
                        :format="dateFormat"
                        @change="dateOnChange"
                   >
                    </a-range-picker>
                </a-form-model-item>
            </a-form-model>
            <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item label="上传列表标题图片"  help="建议700*285px" required>
                    <a-upload
                        name="reply_pic"
                        :file-list="fileListCover"
                        :action="uploadImg"
                        :headers="headers"
                        list-type="picture-card"
                        @preview="handlePreviewCover"
                        @change="upLoadChangeCover($event)"
                    >
                    <div v-if="fileListCover.length < 1">
                        <a-icon type="plus" />
                        <div class="ant-upload-text">上传图片</div>
                    </div>
                    </a-upload>
                    <a-modal :visible="previewVisibleCover" :footer="null" @cancel="handleCancelCover">
                        <img alt="example" style="width: 100%" :src="previewImageCover" />
                    </a-modal>
                </a-form-model-item>
            </a-form-model>
            <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item label="发布单位">
                    <a-input
                        :default-value="formData.company"
                        class="sort-input"
                        v-model="formData.company"
                    />
                </a-form-model-item>
            </a-form-model>
            <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item label="状态">
                     <a-switch checked-children="开启" un-checked-children="关闭" v-model="formData.status_bool" />
                </a-form-model-item>
            </a-form-model>
            <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item label="设置仅为员工可见">
                     <a-button type="primary" @click="onAddInput">
                    添加
                    </a-button>
                 
                     <div class="goods-container" v-for="(item, index) in selectedLable" :key="index">
                        <div class="goods-content">
                            <div class="goods-content-box">
                                <div class="goods-content-left">
                                    <a-form  :label-col="{span:3}" :wrapper-col="{span:20}" >
                                        <a-form-item label="商家" >
                                            <a-select 
                                                style="width:80%"
                                                placeholder="请选择商家"
                                                @change="selecteMerChangge($event, index)"
                                                :value="item.mer_id"
                                            >
                                                <a-select-option v-for="(mer) in lableList" :key="mer.mer_id" :value="mer.mer_id">{{mer.name}}</a-select-option>
                                            </a-select>
                                        </a-form-item>
                                        <div  v-for="(mer) in lableList" :key="mer.mer_id">
                                            <a-form-item label="标签" v-if="mer.mer_id == item.mer_id">
                                                <a-select 
                                                    style="width:80%"
                                                    placeholder="请选择标签"
                                                    mode="multiple"
                                                    @change="selecteLableChangge($event, index)"
                                                    :value="item.lables"
                                                >
                                                    <a-select-option v-for="(labelVal) in mer.lables" :key="labelVal.lable_id" :value="labelVal.lable_id">{{labelVal.name}}</a-select-option>
                                                </a-select> 
                                            </a-form-item>
                                        </div>
                                    </a-form>
                                </div>
                                <div class="goods-content-right">
                                    <a-button type="danger" @click="delPrivateSpec(index)">删除</a-button>
                                </div>
                            </div>
                        </div>
                    </div>
                 
                </a-form-model-item>  
               
            </a-form-model>
            <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item label="是否开启自由跳转">
                    <a-switch checked-children="开启" un-checked-children="关闭" v-model="formData.open_free_jump" />
                </a-form-model-item>
                <a-form-model-item label="跳转链接">
                    <a-input
                        :default-value="formData.free_jump_url"
                        class="sort-input"
                        v-model="formData.free_jump_url"/>
                </a-form-model-item>
            </a-form-model>
            <a-form-model layout="inline" :model="searchForm">
                <a-form-model-item label="搜索">
                    <a-select
                        v-model="searchForm.search_type"
                        style="width:100px;"
                    >
                        <a-select-option value="3">商品名称</a-select-option>
                        <a-select-option value="1">商家名称</a-select-option>
                        <a-select-option value="2">店铺名称</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="">
                    <a-input v-model="searchForm.keyword" placeholder="关键词"></a-input>
                </a-form-model-item>
                <a-form-model-item>
                    <a-button type="primary" @click="submitForm(true)" class="ml-20">搜索</a-button>
                    <a-button @click="resetForm()" class="ml-20">重置</a-button>
                    <a-button type="primary" class="ml-20" @click="handleAdd()">添加</a-button>
                    <a-popconfirm
                        title="确认删除吗?"
                        ok-text="确认"
                        cancel-text="取消"
                        @confirm="handleDelAll()"
                    ><a-button type="primary" class="ml-20">删除</a-button>
                    </a-popconfirm>
                </a-form-model-item>
            </a-form-model><br>
            <a-table
                rowKey="pigcms_id"
                :columns="columns"
                :data-source="datalist"
                :pagination="pagination"
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                bordered>
            <span slot="sort" slot-scope="text, record">
                <a-input-number
                :default-value="record.sort"
                class="sort-input"
                v-model="record.sort"
                @blur="handleSortChange($event, record.sort, record.pigcms_id)"/>
            </span>
            <span slot="action" slot-scope="text, record">
                <a-popconfirm
                    title="确认删除吗?"
                    ok-text="确认"
                    cancel-text="取消"
                    @confirm="handleDelOne(record.pigcms_id)"
                >
                      <a>删除</a>
                  </a-popconfirm>
              </span>
            </a-table>
        </a-modal>
        <!--轮播图-->
        <decorate-adver ref="bannerModel"></decorate-adver>
        <select-shop-goods ref="selectGoods" @getTable="getDataList"></select-shop-goods>
    </div>
</template>
<script>

import employeePlatformApi from "@/api/employee/platform";
import DecorateAdver from "@/views/employee/platform/modules/decorateAdver";
import SelectShopGoods from "@/views/employee/platform/modules/SelectShopGoods";
import uploadApi from '@/api/common/uploads'
import moment from 'moment'

const columns = [
    {
        title: '商品名称',
        dataIndex: 'goods_name',
        key: 'goods_name',
    },
    {
        title: '商家名称',
        dataIndex: 'mer_name',
        key: 'mer_name',
    },
    {
        title: '店铺名称',
        dataIndex: 'store_name',
        key: 'store_name',
    },
    {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: '可见员工身份标签',
        dataIndex: 'employee_lables',
        key: 'employee_lables',
    },
    {
        title: '排序',
        scopedSlots: { customRender: 'sort' },
        key: 'sort',
    },
    {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' },
    },
];

export default {
    props: {
        visible: Boolean,
        title: String,
    },
    components: {DecorateAdver, SelectShopGoods},
    data() {
        return {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
            datalist: [],
            columns,
            //搜索框表单
            searchForm: {
                search_type: '3',
                keyword: '',
            },
            selectedRowKeys: [],
            selectedRows: [],
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => `共 ${total} 条记录`,
            },
            loading: false,
            image: '',
            dateFormat:'YYYY-MM-DD',
            datetimeStr:null,
            headers: {
                authorization: 'authorization-text',
            },
            uploadImg: '/v20/public/index.php' + uploadApi.uploadImg + '?upload_dir=/employee/activity',
            fileListCover: [],
            previewVisibleCover: false,
            previewImageCover: null,
            lableList:[],
            selectedLable:[],
            formData: {}
        };
    },
    watch: {
        formData(val) {
            this.getDataList(false)
            this.getlableAll()
            if(this.formData.cover_image){   
                this.fileListCover[0] = {
                    uid: 1,
                    name: 'image.png',
                    status: 'done',
                    url: this.formData.cover_image,
                    data: this.formData.cover_image
                };
            }else{
                this.fileListCover = []
            }
            if( this.formData.start_time){
                this.datetimeStr = [moment(this.formData.start_time, this.dateFormat), moment(this.formData.end_time, this.dateFormat)]
            }else{
                this.datetimeStr = null
            }
        if(this.selectedLable.length > 0){
            this.formData.lable_arr = this.selectedLable
        }
        this.selectedLable = this.formData.lable_arr || []
        console.log(this.formData,'this.formData2')
        console.log(this.datetimeStr,'this.datetimeStr')
        },
    },
    created() {
        this.getDataList(false)
        this.getlableAll()
        if(this.formData.cover_image){            
            this.fileListCover[0] = {
                uid: 1,
                name: 'image.png',
                status: 'done',
                url: this.formData.cover_image,
                data: this.formData.cover_image
            };
        }
       
        if( this.formData.start_time){
            this.datetimeStr = [moment(this.formData.start_time, this.dateFormat), moment(this.formData.end_time, this.dateFormat)]
        }else{
                this.datetimeStr = null
        }

        console.log(this.formData,'this.formData')
    },
    methods: {
        moment,       
        handleNameChange(e, val) {
            if(this.formData.pigcms_id){
                return false;
            }
            if (this.formData.name == '') {
                this.$message.error("活动名称必填");
                return false;
            }
            let params = {
                is_temp: 1,
                name: this.formData.name
            }
            this.request(employeePlatformApi.employActivityAddOrEdit, params).then((data) => {
                this.$set(this.formData, 'pigcms_id', data.pigcms_id)
            })
        },
        onSelectChange(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys;
            this.selectedRows = selectedRows;
        },
        getBanner() {
            if (this.formData.pigcms_id == 0) {
                this.$message.error("请先设置活动名称");
                return false;
            }
            this.$refs.bannerModel.getList(this.formData.pigcms_id, '配置轮播图')
        },
        getlableAll(){
            this.request(employeePlatformApi.getlableAll, {}).then((res) => {
                this.lableList = res
                console.log(this.lableList,'lableList')
            })

        },
        // 获取table数据
        getDataList(is_search) {
            let params = {...this.searchForm}
            if (is_search === true) {
                params.page = 1
                this.$set(this.pagination, 'current', 1)
            } else {
                params.page = this.pagination.current
                this.$set(this.pagination, 'current', this.pagination.current)
            }
            params.pageSize = this.pagination.pageSize
            params.activity_id = this.formData.pigcms_id
            this.request(employeePlatformApi.getActivityGoods, params).then((res) => {
                this.datalist = res.data
                this.$set(this.pagination, 'total', res.total)
            })
        },
        // 提交搜索表单
        submitForm(is_search = false) {
            this.getDataList(is_search)
        },
        // 重置表单
        resetForm() {
            this.$set(this, 'searchForm', {
                keyword: '',
            })
            this.$set(this.pagination, 'current', 1)
            this.getDataList()
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.submitForm()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.submitForm()
        },
        handleOk() {
             if (this.formData.name == '') {
                this.$message.error("活动名称必填");
                return false;
            }
            if (!this.formData.start_time || this.formData.start_time == undefined) {
                this.$message.error("请选择活动时间");
                return false;
            }
            if (this.fileListCover.length == 0) {
                this.$message.error("请上传活动列表标题图片");
                return false;
            }
            this.formData.status =  this.formData.status_bool ? 1 : 0
            this.formData.lable_arr = this.selectedLable
            if(this.formData.lable_arr.length > 0){
                let error = this.formData.lable_arr.find((item)=>{
                    return item.mer_id <= 0 || item.lables.length <= 0
                })
                if (error) {
                    this.$message.error("未选择商家或者标签");
                    return false;
                }
            }

            this.request(employeePlatformApi.employActivityAddOrEdit, this.formData).then((data) => {
                this.$set(this.formData, 'pigcms_id', data.pigcms_id)
                this.$message.success('活动保存成功!', 1)
                this.handleCancel()
            })
        },
        handleCancel() {
            this.$emit('handleCancel')
            this.$emit('getDataList',false)

            if(this.formData.pigcms_id){
                this.request(employeePlatformApi.delActivity, {pigcms_id: this.formData.pigcms_id,is_temp:1}, 'GET').then((res) => {
                })
            }
        },
        dateOnChange(date, dateString) {
            this.formData.start_time = dateString[0]
            this.formData.end_time = dateString[1]
        },
        handleSortChange(e, val, pigcms_id) {
            let params = {
                pigcms_id: pigcms_id,
                sort: val
            }
            this.request(employeePlatformApi.setActivityGoodsSort, params).then((data) => {
                this.getDataList()
                this.$message.success('排序设置成功!', 1)
            })
        },
        handleAdd() {
            if (this.formData.pigcms_id == 0) {
                this.$message.error("请先设置活动名称");
                return false;
            }
            this.$refs.selectGoods.openDialog(this.formData.pigcms_id);
        },
        handleDelOne(pigcms_id) {
            this.request(employeePlatformApi.delActivityGoods, {pigcms_id: [pigcms_id]}).then((res) => {
                this.$message.success('删除成功!', 1)
                setTimeout(() => {
                    this.getDataList()
                },1000)
            })
        }, 
        handleDelAll() {
            if (this.selectedRowKeys.length > 0) {
                this.request(employeePlatformApi.delActivityGoods, {
                    pigcms_id: this.selectedRowKeys
                }).then(res => {
                    this.selectedRowKeys = []
                    this.selectedRows = []
                    this.$message.success('删除成功')
                    setTimeout(() => {
                        this.getDataList()
                    },1000)
                })
            } else {
                this.$message.error('请选择')
            }
        }, 
        async handlePreviewCover(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            this.previewImageCover = file.url || file.preview;
            this.previewVisibleCover = true;
        },
        // 上传封面图
        upLoadChangeCover(info) {
                // 图片列表
            let fileList = [...info.fileList]

            fileList = fileList.slice(-1)
            fileList = fileList.map((file) => {
                if (file.response) {
                file.url = file.response.data.full_url
                this.formData.cover_image = info.file.response.data.image
                }
                return file
            })
            this.fileListCover = fileList
            if (info.file.status === 'done') {
            } else if (info.file.status === 'error') {
                this.$message.error(`${info.file.name} 上传失败.`)
            }
        },
        handleCancelCover() {
            this.previewVisibleCover = false;
        },
        //   添加标签信息
        onAddInput () {          
            this.selectedLable.push({
                lables: [], 
            })
        },
        // 标签删除
        delPrivateSpec (index) {
            this.selectedLable.splice(index, 1)
        },
        // 切换商家
        selecteMerChangge(val, index){
            // 查看此商家是否已经选择过了
            let error = this.selectedLable.find((item)=>{
                return item.mer_id == val
            })
        
            if (error) {
                this.$message.error("该商家已添加过");
                return false;
            }else{
                let current = this.selectedLable[index]
                current['mer_id'] = val
                current['lables'] = []
                this.$set(this.selectedLable, index, current)
            }
        },
        // 切换标签
        selecteLableChangge(val, index){
            console.log(val,'val2')
            let current = this.selectedLable[index]
            current['lables'] = val
             this.$set(this.selectedLable, index, current)
        },
        //设置表单值
        setFormData(data){
            this.formData = JSON.parse(JSON.stringify(data));
            this.selectedLable = this.formData.lable_arr || []
        },
    },
};
</script>
<style scoped>

    .specification{
        font-size: 18px;
    }

    .goods-spec {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }
    .goods-spec .goods-spec-add {
        margin-right: 15px;
    }

    .goods-container .button-new-tag {
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .goods-container .input-new-tag {
        width: 90px;
        margin-right: 10px;
    }
    .goods-container .el-tag {
        margin-right: 10px;
    }
    .goods-container .goods-content {
        margin-bottom: 10px;
        padding: 14px;
        border: 1px solid #ebeef5;
        border-radius: 4px;
        background-color: #fcfcfc;
    }
    .goods-content .goods-content-box {
        display: flex;
        align-items: center;
    }
    .goods-content-box .goods-content-left {
        flex: 1;
    }

    .goods-img {
        width: 80px;
        height: 80px;
        margin: 10px;
        border-radius: 5px;
        position: relative;
        display: inline-block;
        border: 1px solid #d9d9d9;
    }
    .goods-img .delete {
        position: absolute;
        right: 0px;
        top: 0px;
    }
    .goods-img img {
        width: 100%;
        height: 100%;
        border-radius: 5px;
    }
</style>