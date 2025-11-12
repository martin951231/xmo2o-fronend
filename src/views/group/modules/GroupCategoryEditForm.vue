<template>
    <div>
        <a-row>
            <a-col :offset="4">
                <a-form-model
                    ref="form"
                    :label-col="{ span: 4 }" 
                    :wrapper-col="{ span: 14 }"
                    :rules="rules"
                    :model="formData">
                    <a-form-model-item label="分类名称" prop="cat_name">
                        <a-input 
                            v-model="formData.cat_name"
                            placeholder="请输入"
                            :maxLength="6"></a-input>
                    </a-form-model-item>
                    <a-form-model-item 
                        label="分类描述" 
                        help="用于描述分类的副标题，吸引客户，限制100字以内">
                        <a-input 
                            v-model="formData.cat_des" 
                            type="textarea"
                            placeholder="请输入"
                            :maxLength="100" />
                    </a-form-model-item>
                    <a-form-model-item 
                        label="短标记(url)"
                        help="只能使用英文或数字，用于网址（url）中的标记！建议使用分类的拼音"
                        prop="cat_url">
                        <a-input 
                            v-model="formData.cat_url" 
                            placeholder="英文或数字"></a-input>
                    </a-form-model-item>
                    <a-form-model-item 
                        label="分类LOGO图标" 
                        help="分类LOGO小图标，建议尺寸118*118"
                        prop="cat_pic"
                        required >
                        <a-upload
                            name="reply_pic"
                            :file-list="catPicFileList"
                            :action="uploadImg"
                            :headers="headers"
                            :data="upload_dir"
                            @change="upLoadChange($event,'cat_pic')"
                        >
                        <a-button> <a-icon type="upload" /> 上传图片</a-button>
                    </a-upload>
                    </a-form-model-item>
                    <a-form-model-item 
                        label="分类广告图" 
                        help="分类广告图，建议尺寸702*142">
                        <a-upload
                            name="reply_pic"
                            :file-list="catAdPicFileList"
                            :action="uploadImg"
                            :headers="headers"
                            :data="upload_dir"
                            @change="upLoadChange($event,'cat_ad_pic')"
                        >
                        <a-button> <a-icon type="upload" /> 上传图片</a-button>
                    </a-upload>
                    </a-form-model-item>
                    <a-form-model-item 
                        label="分类排序"
                        help="默认添加时间排序！手动排序数值越大，排序越前。">
                        <a-input-number 
                            v-model="formData.cat_sort"
                            :min="0"></a-input-number>
                    </a-form-model-item>
                    <a-row 
                        v-if="showSetting">
                        <!-- <a-form-model-item 
                            label="购买须知填写项">
                            <a-button type="primary" @click="showModal('1')">设置</a-button>
                        </a-form-model-item>
                        <a-form-model-item 
                            label="商品字段管理">
                            <a-button type="primary" @click="showModal('2')">设置</a-button>
                        </a-form-model-item> -->
                        <a-form-model-item 
                            label="自定义填写项管理">
                            <a-button type="primary" @click="showModal('3')">设置</a-button>
                        </a-form-model-item>
                    </a-row>
                    <a-form-model-item 
                        label="是否热门"
                        help="如果选择热门，颜色会有变化">
                        <a-switch 
                            checked-children="是" 
                            un-checked-children="否"
                            :checked="formData.is_hot == 1?true:false"
                            @change="(checked) => {formData.is_hot = checked?1:0}" />
                    </a-form-model-item>
                    <a-form-model-item label="分类状态">
                        <a-switch 
                            checked-children="开启" 
                            un-checked-children="关闭"
                            :checked="formData.cat_status == 1?true:false"
                            @change="(checked) => {formData.cat_status = checked?1:0}" />
                    </a-form-model-item>
                    <a-form-model-item 
                        label="是否是酒店"
                        help="如果是酒店，酒店首页将显示该分类">
                        <a-switch 
                            checked-children="是" 
                            un-checked-children="否"
                            :checked="formData.is_hotel == 1?true:false"
                            @change="(checked) => {formData.is_hotel = checked?1:0}" />
                    </a-form-model-item>
                    <a-form-model-item 
                        label="编辑器数量"
                        help="填写编辑其数量后请填写对应的编辑器头部标题"
                        v-if="group_content_switch == 1 && type == 'category'">
                        <a-input-number 
                            v-model="formData.editor_num"
                            :min="0"
                            :max="5"
                            @change="editorNumChange"></a-input-number>
                    </a-form-model-item>
                    <a-form-model-item
                        v-for="(domain, index) in formData.editor_title"
                        :key="domain.key"
                        v-bind="index !== 0 ? formItemLayout : {}"
                        :label="index === 0 ? '编辑器标题' : ''"
                        :prop="'editor_title.' + index + '.value'"
                        :rules="{
                            required: true,
                            message: '请输入编辑器标题',
                            trigger: 'blur',
                        }">
                        <a-input
                            v-model="domain.value"
                            placeholder="请输入"
                        />
                    </a-form-model-item>
                    <a-row class="mt-50" v-if="type == 'category'">
                        <a-col :span="10" class="text-center">
                            <a-button type="primary" @click="submitOpt()">提交</a-button>
                        </a-col>
                    </a-row>
                </a-form-model>
            </a-col>
        </a-row>

        <!-- // 1 购买须知填写项 2 商品字段管理 3 自定义填写项管理 列表弹框-->
        <a-modal
            :title="modalConfig.title"
            :visible="visible"
            @ok="visible = false"
            @cancel="visible = false"
            width="50%"
            :bodyStyle="{
                height: 'auto',
                maxHeight: '600px',
                overflowY: 'auto'
            }"
            :destroyOnClose="true"
            :maskClosable="false"
            :footer="null"
            >
            <a-row class="text-right mb-20">
                <a-button type="primary" @click="addModalShow()">
                    {{modalType == 2?'添加字段':'添加填写项'}}
                </a-button> 
            </a-row>
            <a-table
                :columns="modalConfig.columns"
                :data-source="data"
                rowKey="name"
                :scroll="{ y: 378 }"
                >
                <span slot="type" slot-scope="text">
                    {{text == 0?'单行':'多行'}}
                </span>
                <span slot="iswrite" slot-scope="text,record">
                    {{record.iswrite == 0?'否':'是'}}
                </span>
                <span slot="action" slot-scope="text,record">
                    <span v-if="modalType == '1'">
                        <a href="javascript:;" @click="editOpt(record)">编辑</a>
                        <a 
                            href="javascript:;" 
                            @click="delOpt(record)" 
                            class="ml-20">删除</a>
                    </span>
                    <span v-if="modalType == '2'">
                        <a-switch 
                            checked-children="显示" 
                            un-checked-children="隐藏"
                            :checked="record.is_show == 1?true:false"
                            @change="isShowChange(record)" />
                    </span>
                    <span v-if="modalType == '3'">
                        <a href="javascript:;" @click="delOpt(record)">删除</a>
                    </span>
                </span>
            </a-table>
        </a-modal>


        <!--  1 购买须知填写项添加编辑弹框 3 自定义填写项管理添加弹框 商品字段管理添加-->
        <a-modal
            :title="addModalConfig.title"
            :visible="addVisible"
            width="40%"
            :bodyStyle="{
                height: 'auto',
                minHeight: addModalType == 7 || addModalType == 8?'530px':'auto',
                maxHeight: '600px',
                overflowY: 'auto'
            }"
            :destroyOnClose="true"
            :maskClosable="false"
            :cancelText="'关闭'"
            :okText="addModalType == 5?'编辑':'添加'"
            @ok="addModalOk()"
            @cancel="addModalCancel()">
            <a-row v-if="modalFormData && addModalType != 7 && addModalType != 8">
                <a-col>
                    <a-form-model
                        ref="modalForm"
                        :label-col="{ span: 4 }" 
                        :wrapper-col="{ span: 10 }"
                        :model="modalFormData"
                        :rules="addModalConfig.rules">
                        <a-form-model-item label="名称" prop="name">
                            <a-input 
                                v-model="modalFormData.name" 
                                placeholder="请输入"
                                :maxLength="6"></a-input>
                        </a-form-model-item>
                        <a-form-model-item 
                            label="显示排序"
                            help="默认添加时间排序！手动排序数值越大，排序越前。">
                            <a-input-number 
                                v-model="modalFormData.sort"
                                :min="0"></a-input-number>
                        </a-form-model-item>
                        <a-form-model-item 
                            label="是否必填" 
                            help="客户团购时决定此字段用户是否必须填写"
                            v-if="modalFormData.iswrite || modalFormData.iswrite == 0">
                            <a-switch 
                                checked-children="是" 
                                un-checked-children="否"
                                :checked="modalFormData.iswrite == 1?true:false"
                                @change="(checked) => {modalFormData.iswrite = checked?1:0}" />
                        </a-form-model-item>
                        <a-form-model-item label="字段类型">
                            <a-select v-model="modalFormData.type">
                                <a-select-option 
                                    v-for="item in addModalConfig.options"
                                    :key="item.value"
                                    :value="item.value.toString()">
                                    {{item.label}}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item label="下拉框候选值" v-if="modalFormData.type == 3">
                            <a-textarea
                                :placeholder="L('一行一个，将通过下拉框的模式展示候选。')"
                                :auto-size="{ minRows: 2, maxRows: 6 }"
                                v-model="modalFormData.use_field"
                            />
                        </a-form-model-item>
                    </a-form-model>
                </a-col>
            </a-row>   
            <!-- 自定义商品字段管理添加 -->
            <a-row v-else>
                <a-col>
                    <a-tabs
                        :activeKey="addModalType.toString()" 
                        @change="customTabChange">
                        <a-tab-pane key="7" tab="自定义字段">
                            <a-row class="mb-10">
                                <a-col>请谨慎小心填写，无法编辑删除</a-col>
                            </a-row>
                            <a-row v-if="modalFormData && addModalType == 7">
                                <a-col>
                                    <a-form-model
                                        ref="modalForm"
                                        :label-col="{ span: 4 }" 
                                        :wrapper-col="{ span: 10 }"
                                        :model="modalFormData"
                                        :rules="addModalConfig.rules">
                                        <a-form-model-item label="字段名称" prop="name">
                                            <a-input 
                                                v-model="modalFormData.name" 
                                                placeholder="请输入"></a-input>
                                        </a-form-model-item>
                                        <a-form-model-item 
                                            label="短标记(url)"
                                            help="只能使用英文或数字，用于网址（url）中的标记！建议使用分类的拼音"
                                            prop="url">
                                            <a-input 
                                                v-model="modalFormData.url" 
                                                placeholder="英文或数字"></a-input>
                                        </a-form-model-item>
                                        <a-form-model-item 
                                            label="字段候选值" 
                                            help="一行一个，将通过下拉框的模式展示候选。">
                                            <a-input 
                                                v-model="modalFormData.value" 
                                                type="textarea"
                                                placeholder="请输入" />
                                        </a-form-model-item>
                                        <a-form-model-item label="字段类型">
                                            <a-select v-model="modalFormData.type">
                                                <a-select-option 
                                                    v-for="item in addModalConfig.options"
                                                    :key="item.value"
                                                    :value="item.value.toString()">
                                                    {{item.label}}
                                                </a-select-option>
                                            </a-select>
                                        </a-form-model-item>
                                        <a-form-model-item 
                                            label="是否前端显示">
                                            <a-switch 
                                                checked-children="显示" 
                                                un-checked-children="隐藏"
                                                :checked="modalFormData.is_show == 1?true:false"
                                                @change="(checked) => {modalFormData.is_show = checked?1:0}" />
                                        </a-form-model-item>
                                    </a-form-model>
                                </a-col>
                            </a-row>
                        </a-tab-pane>
                        <a-tab-pane key="8" tab="选择内置字段">
                            <a-row v-if="modalFormData && addModalType == 8">
                                <a-col>
                                    <a-form-model
                                        ref="modalForm"
                                        :label-col="{ span: 4 }" 
                                        :wrapper-col="{ span: 10 }"
                                        :model="modalFormData"
                                        :rules="addModalConfig.rules">
                                        <a-form-model-item label="选择字段">
                                            <a-select v-model="modalFormData.use_field">
                                                <a-select-option 
                                                    v-for="item in addModalConfig.options"
                                                    :key="item.value"
                                                    :value="item.value.toString()">
                                                    {{item.label}}
                                                </a-select-option>
                                            </a-select>
                                        </a-form-model-item>
                                        <a-form-model-item 
                                            label="字段排序"
                                            help="默认添加时间排序！手动排序数值越大，排序越前。">
                                            <a-input-number 
                                                v-model="modalFormData.sort"
                                                :min="0"></a-input-number>
                                        </a-form-model-item>
                                        <a-form-model-item 
                                            label="是否前端显示">
                                            <a-switch 
                                                checked-children="显示" 
                                                un-checked-children="隐藏"
                                                :checked="modalFormData.is_show == 1?true:false"
                                                @change="(checked) => {modalFormData.is_show = checked?1:0}" />
                                        </a-form-model-item>
                                    </a-form-model>
                                </a-col>
                            </a-row>
                        </a-tab-pane>
                    </a-tabs>
                </a-col>
            </a-row>   
        </a-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import GroupPlatformApi from '@/api/group/platform'
import { FormModel } from 'ant-design-vue';
Vue.use(FormModel);

export default {
    props: {
        cat_id: {
            type: [String,Number],
            default: 0, // 0：主分类 其它：子分类
        },
        cat_fid: {
            type: [String,Number],
            default: 0, // 0 主分类 其他 子分类
        },
        group_content_switch: {
            type: [String,Number],
            default: 0 // 编辑器数量&&编辑器标题 显隐 1：显示这两栏信息，0不显示
        },
        type: {
            type: String,
            default: 'category', // category 主分类 subCategory 子分类
        }
    },
    data() {
        return {
            formData: {
                cat_id: this.$props.cat_id || 0, // 0:添加 其它：编辑
                cat_fid: this.$props.cat_fid || 0,// 0：主分类 其它：子分类
                cat_name: '',// 分类名称
                cat_des: '', // 分类描述
                cat_url: '', // 短标记(url)
                cat_pic: '', // 分类LOGO图标
                cat_ad_pic: '', // 分类广告图
                cat_sort: 0, // 分类排序
                is_hot: 1, // 是否热门 1：是 0：否
                cat_status: 1, // 分类状态 1：启用 0：关闭
                is_hotel: 0, // 是否是酒店 0 不是酒店 1 酒店
                editor_num: '', // 编辑器数量
                editor_title: [] // 编辑器标题
            },
            uploadImg: '/v20/public/index.php/common/common.UploadFile/uploadPictures',
            upload_dir: {upload_dir:'/category'},
            reply_pic: '',
            headers: {
                authorization: 'authorization-text',
            },
            catPicFileList: [],
            catAdPicFileList: [],
            formItemLayout: {
                wrapperCol: {
                    offset: 4,
                    span: 14
                },
            },
            rules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur', whitespace: true },
                    { max: 6, message: '分类名称最多6个字符', trigger: 'blur' },
                ],
                cat_url: [
                    { required: true, message: '请输入短标记', trigger: 'blur', whitespace: true },
                    {pattern: /^[A-Za-z0-9]+$/, message: '短标记只能是英文或数字!', trigger: 'blur'}
                ],
                cat_pic: [
                    { required: true, message: '请上传分类LOGO图标', trigger: 'change'}
                ]
            },
            visible: false,
            modalType: '', // 1 购买须知填写项 2 商品字段管理 3 自定义填写项管理
            data: [],
            addVisible: false,
            modalFormData: '', // 购买须知填写项 商品字段管理 自定义填写项管理 表单数据
            addModalType: '', // 4 购买须知填写项添加 5 购买须知填写项编辑 6 自定义填写项管理添加 7 自定义商品字段管理添加 8 选择内置字段
        }
    },
    computed: {
        // 主分类编辑才有
        showSetting() {
            return this.cat_id != 0 && this.cat_fid == 0 && this.type == 'category'?true:false
        },
        // 1 购买须知填写项 2 商品字段管理 3 自定义填写项管理
        modalConfig() {
            let obj = {}
            if (this.modalType == '1') {
                obj.title = '购买须知填写项'
                obj.apiList = 'getGroupCategoryCueList'
                obj.apiDel = 'delGroupCategoryCue'
                obj.columns = [
                    {
                        title: '排序',
                        dataIndex: 'sort'
                    },
                    {
                        title: '名称',
                        dataIndex: 'name'
                    },
                    {
                        title: '类型',
                        dataIndex: 'type',
                        scopedSlots: {
                            customRender: 'type',
                        },
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        scopedSlots: {
                            customRender: 'action',
                        },
                        align: 'center',
                    }
                ]
                
            } else if (this.modalType == '2') {
                obj.title = '商品字段管理'
                obj.apiList = 'getGroupCategoryCatFieldList'
                obj.columns = [
                    {
                        title: '名称',
                        dataIndex: 'name'
                    },
                    {
                        title: '短标记(url)',
                        dataIndex: 'url'
                    },
                    {
                        title: '类型',
                        dataIndex: 'type',
                        scopedSlots: {
                            customRender: 'type',
                        },
                    },
                    {
                        title: '是否前端显示',
                        dataIndex: 'action',
                        scopedSlots: {
                            customRender: 'action',
                        },
                    }
                ]
                
            } else if (this.modalType == '3') {
                obj.title = '自定义填写项管理'
                obj.apiList = 'getGroupCategoryWriteFieldList'
                obj.apiDel = 'delGroupCategoryWriteField'
                obj.columns = [
                    {
                        title: '排序',
                        dataIndex: 'sort'
                    },
                    {
                        title: '名称',
                        dataIndex: 'name'
                    },
                    {
                        title: '类型',
                        dataIndex: 'type',
                        scopedSlots: {
                            customRender: 'type',
                        },
                    },
                    {
                        title: '必填',
                        dataIndex: 'iswrite',
                        scopedSlots: {
                            customRender: 'iswrite',
                        },
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        scopedSlots: {
                            customRender: 'action',
                        }
                    }
                ]
                
            }
            return obj
        },
        // 4 购买须知填写项添加 5 购买须知填写项编辑 6 自定义填写项管理添加 7 自定义商品字段管理添加 8 选择内置字段
        addModalConfig() {
            let obj = {}
            if (this.addModalType == 4 || this.addModalType == 6) {
                obj.title = '添加填写项'
            } else if (this.addModalType == 5) {
                obj.title = '编辑填写项'
            }

            if (this.addModalType == 4 || this.addModalType == 5) {
                obj.rules = {
                    name: [
                        { required: true, message: '请输入购买须知填写项名称', trigger: 'blur', whitespace: true  }
                    ],
                }
                obj.options = [
                    {
                        label: '单行文本 input[text]',
                        value: '0'
                    },
                    {
                        label: '多行文本 textarea',
                        value: '1'
                    }
                ]
            }
            
            if (this.addModalType == 6) {
                obj.rules = {
                    name: [
                        { required: true, message: '请输入自定义填写项名称', trigger: 'blur', whitespace: true  }
                    ],
                }
                obj.options = [
                    {
                        label: '单行文本',
                        value: '0'
                    },
                    {
                        label: '多行文本',
                        value: '1'
                    },
                    {
                        label: '地址',
                        value: '2'
                    },
                    {
                        label: '下拉选择框',
                        value: '3'
                    },
                    {
                        label: '数字格式',
                        value: '4'
                    },
                    {
                        label: '邮件格式',
                        value: '5'
                    },
                    {
                        label: '日期格式',
                        value: '6'
                    },
                    {
                        label: '时间格式',
                        value: '7'
                    },
                    {
                        label: '手机格式',
                        value: '9'
                    }
                ]
            }

            if (this.addModalType == 7) {
                obj.rules = {
                    name: [
                        { required: true, message: '请输入自定义字段名称', trigger: 'blur', whitespace: true  }
                    ],
                    url: [
                        { required: true, message: '请输入短标记', trigger: 'blur', whitespace: true },
                        { pattern: /^[A-Za-z0-9]+$/, message: '短标记只能是英文或数字!',trigger: 'blur'}
                    ]
                }
                obj.options = [
                    {
                        label: '单选',
                        value: '0'
                    },
                    {
                        label: '多选',
                        value: '1'
                    }
                ]
            }

            if (this.addModalType == 8) {
                obj.options = [
                    {
                        label: '地区商圈',
                        value: 'area'
                    }
                ]
            }
            return obj
        }
    },
    mounted() {
        if (this.$refs.form && this.cat_id == 0) {
            // 表单重置，并移除校验结果
            this.$refs.form.resetFields()
            this.formData =  {
                cat_id: this.cat_id || 0,
                cat_fid: this.cat_fid || 0,
                cat_name: '',
                cat_des: '', 
                cat_url: '',
                cat_pic: '',
                cat_ad_pic: '', 
                cat_sort: 0, 
                is_hot: true, 
                cat_status: true,
                is_hotel: false, 
                editor_num: '', 
                editor_title: [] 
            }
        }
        console.log(this.cat_id,'cat_id---gropuCategoryEditForm')
        if (this.cat_id != 0) {
            this.getFormData(this.cat_id)
        }
    },
    methods: {
        // 分类信息
        getFormData(cat_id) {
            this.catPicFileList = []
            this.catAdPicFileList = []
            let params = {
                cat_id
            }
            this.request(GroupPlatformApi.getGroupCategoryInfo, params).then((res) => {
                console.log(res,'res----getFormData')
                let detail = res.detail || ''
                if (detail) {
                    for (let k in detail) {
                        
                        if (k == 'cat_pic' && detail[k]) {
                            this.catPicFileList.push({
                                uid: '1',
                                name: detail[k],
                                status: 'done',
                                url: detail[k]
                            })
                        }
                        if (k == 'cat_ad_pic' && detail[k]) {
                            this.catAdPicFileList.push({
                                uid: '2',
                                name: detail[k],
                                status: 'done',
                                url: detail[k]
                            })
                        }

                        for (let j in this.formData) {
                            if (j == k && k != 'editor_title') {
                                this.$set(this.formData, j, detail[j])
                            }
                        }
                    }

                    if ( detail['editor_title'] && detail['editor_title'].length) {
                        let editor_title = []
                        detail['editor_title'].forEach((item,index) => {
                            editor_title.push({
                                key: index,
                                value: item
                            })
                        })
                        detail['editor_title'] = editor_title
                    } else {
                        if (detail['editor_num']) {
                            let editor_num = detail['editor_num']
                            let editor_title = []
                            if (editor_num && this.group_content_switch == 1) {
                                for (let i = 0; i < editor_num; i++) {
                                    editor_title.push({
                                        key: i,
                                        value: ''
                                    })
                                }
                            }
                            detail['editor_title'] = editor_title
                        }
                    }

                    // 子分类
                    if (this.type == 'subCategory') {
                        detail['editor_num'] = ''
                        detail['editor_title'] = []
                    }

                    this.$set(this.formData, 'editor_title', detail['editor_title'])
                }
                console.log(this.formData,'this.formData')
            })
        },
        // 分类logo || 广告图 上传
        upLoadChange(info,type) {
            console.log(info,'info---upLoadChange')
            console.log(type,'type---upLoadChange')
            // 图片列表
            let fileList = [...info.fileList]
            if (fileList.length) {
                fileList = fileList.slice(-1)
                fileList = fileList.map((file) => {
                    if (file.response) {
                        file.url = file.response.data
                    }
                    return file
                })

                if (type == 'cat_ad_pic') {
                    this.catAdPicFileList = fileList
                } else if (type == 'cat_pic') {
                    this.catPicFileList = fileList
                }
                
            } else {
                if (type == 'cat_ad_pic') {
                    this.catAdPicFileList = []
                } else if (type == 'cat_pic') {
                    this.catPicFileList = []
                }
            }

            let data = ''
            if (fileList.length) {
                fileList.forEach(item => {
                    if (item.response && item.response.status && item.response.status == 1000) {
                        data = item.response.data
                    }
                })
            }

            this.$set(this.formData, type, data)

            if (info.file.status === 'done') {
                console.log('done')
            } else if (info.file.status === 'error') {
                console.log('error')
                this.$message.error(`${info.file.name} 上传失败.`)
            }
        },
        // 编辑器数量
        editorNumChange() {
            console.log('editorNumChange')
            let editor_num = this.formData.editor_num || 0
            let editor_title = []
            if (editor_num && this.group_content_switch == 1) {
                for (let i = 0; i < editor_num; i++) {
                    editor_title.push({
                        key: i,
                        value: ''
                    })
                }
            }

            if (editor_num == 0) {
                editor_title = []
            }
            
            this.$set(this.formData, 'editor_title', editor_title)
        },
        // 提交
        submitOpt() {
            console.log('submitOpt-提交-submitOpt')
            this.$refs.form.validate((valid, values) => {
                console.log(valid,'valid')
                if (valid) {
                    if (this.formData.cat_pic == '') {
                        this.$message.error('请上传分类LOGO图标')
                        return false
                    }

                    console.log(this.formData,'this.formData')

                    let params = {}
                    for (let k in this.formData) {
                        params[k] = this.formData[k]

                        if (k == 'is_hot' || k == 'cat_status' || k == 'is_hotel') {
                           params[k] = this.formData[k]?1:0
                        }

                        if (k == 'editor_title' && this.formData['editor_num']) {
                            if (this.formData[k] && this.formData[k].length) {
                                params[k] = this.formData[k].map(item => item.value)
                            } else {
                                params[k] = []
                            }
                        }
                    }

                    // 子分类
                    if (this.type == 'subCategory') {
                        params.editor_num = ''
                        params.editor_title = []
                    }

                    console.log(params,'params---submitOpt')

                    this.request(GroupPlatformApi.addGroupCategory, params).then((res) => {
                        console.log(res,'res')
                        
                        this.$message.success('操作成功',1,() => {
                            this.catPicFileList = []
                            this.catAdPicFileList = []
                            if (this.$refs.form) {
                                // 表单重置，并移除校验结果
                                this.$refs.form.resetFields()
                            }

                            // 主分类
                            if (this.type == 'category') {
                                this.$router.go(-1)
                            } else {
                                // 子分类
                                this.$emit('updateList')
                            }
                        });
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        // showModal
        showModal(modalType) {
            this.modalType = modalType
            this.visible = true
            this.getList()
        },
        // 获取列表
        getList() {
            let params = {
                cat_id: this.cat_id
            }
            this.request(GroupPlatformApi[this.modalConfig.apiList], params).then((res) => {
                console.log(res,'res')
                this.data = res.list || []
            })
        },
        // 删除
        delOpt(current) {
            let params = {
                cat_id: this.cat_id,
                name: current.name
            }
            this.$confirm({
                title: '提示',
                content: '确定删除该项？',
                onOk: () =>  {
                    this.request(GroupPlatformApi[this.modalConfig.apiDel], params).then((res) => {
                        this.upDateListOpt()
                    })
                },
                onCancel() {},
            });
            
        },
        // 显隐
        isShowChange(current) {
            console.log(current,'current---isShowChange')
            let params = {
                cat_id: this.cat_id,
                name: current.name,
                is_show:current.is_show == 0?1:0
            }
            this.request(GroupPlatformApi.groupCategoryCatFieldShow, params).then((res) => {
                this.upDateListOpt()
            })
        },
        // 购买须知填写项添加 自定义填写项管理添加
        addModalShow() {
            this.addVisible = true
            if (this.modalType == '1') {
                // 购买须知填写项添加
                this.addModalType = 4
                this.modalFormData = {
                    cat_id: this.cat_id,
                    id: '',
                    name: '',
                    type: '0',
                    sort: 0,
                }
            } else if (this.modalType == '3') {
                // 自定义填写项管理添加
                this.addModalType = 6
                this.modalFormData = {
                    cat_id: this.cat_id,
                    name: '',
                    type: '0',
                    sort: 0,
                    iswrite: 1,
                    use_field: '',
                }
            } else if (this.modalType == '2') {
                // 自定义字段管理添加
                this.addModalType = 7
                this.modalFormData = {
                    cat_id: this.cat_id,
                    name: '',
                    type: '0',
                    url: '',
                    value: '',
                    is_show: 1,
                }
            }
        },
        // 购买须知填写项编辑
        editOpt(current) {
            this.addModalType = 5
            this.modalFormData = JSON.parse(JSON.stringify(current))
            this.$set(this.modalFormData, 'cat_id', this.cat_id)
            this.addVisible = true
        },
        // 弹框确定
        addModalOk() {
            console.log(this.modalFormData,'this.modalFormData---addModalOk')
            console.log(this.addModalType,'this.addModalType---addModalOk')

            this.$refs.modalForm.validate((valid, values) => {
                console.log(valid,'valid---addModalOk')
                if (valid) {
                    // 购买须知填写项添加 || 编辑
                    if (this.addModalType == 4 || this.addModalType == 5) {
                        this.editGroupCategoryCueOpt()
                    }
                    // 自定义填写项管理添加
                    if (this.addModalType == 6) {
                        this.groupCategoryAddWriteFieldOpt()
                    }
                    // 管理商品属性字段添加
                    if (this.addModalType == 7 || this.addModalType == 8) {
                        this.groupCategoryAddCatFieldOpt()
                    }
                }
            })
            
        },
        // 弹框取消
        addModalCancel() {
            this.addVisible = false
            this.modalFormData = null
        },
        // 团购分类购买须知填写项编辑
        editGroupCategoryCueOpt() {
            this.request(GroupPlatformApi.editGroupCategoryCue, this.modalFormData).then((res) => {
                this.upDateListOpt()
            })
        },
        // 团购分类自定义填写项管理
        groupCategoryAddWriteFieldOpt() {
            this.request(GroupPlatformApi.groupCategoryAddWriteField, this.modalFormData).then((res) => {
                this.upDateListOpt()
            })
        },
        // 自定义商品字段管理添加tabs change
        customTabChange(key) {
            this.addModalType = key
            if (this.addModalType == 7) {
                this.modalFormData = {
                    cat_id: this.cat_id,
                    name: '',
                    type: '0',
                    url: '',
                    value: '',
                    is_show: 1
                }
            } else {
                this.modalFormData = {
                    cat_id: this.cat_id,
                    use_field: 'area',
                    sort: '0',
                    name: '',
                    type: '0',
                    url: '',
                    value: '',
                    is_show: 1
                }
            }
        },
        // 管理商品属性字段 添加
        groupCategoryAddCatFieldOpt() {
            this.request(GroupPlatformApi.groupCategoryAddCatField, this.modalFormData).then((res) => {
                this.upDateListOpt()
            })
        },
        // 更新列表
        upDateListOpt() {
            this.$message.success('操作成功',1,() => {
                this.getList()
                if (this.addVisible) {
                    this.addVisible = false
                }
            });
        }
    },
}
</script>

<style scoped>

</style>
