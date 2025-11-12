<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-row type="flex" align="middle">
            <a-button type="primary" class="mb-20" @click="addClick">
                {{ L('新建排行榜') }}
            </a-button>
        </a-row>

        <a-table style="background: #ffffff" :columns="columns" rowKey="tools_id" :data-source="dataList"
            @change="changePage" :pagination="pagination">
            <!-- 图片 -->
            <span slot="pic" slot-scope="text, item">
                <img :src="item.pic" alt="" style="width: 35px;height: 35px;">
            </span>
            <!-- 有效期 -->
            <span slot="start_time" slot-scope="text, item">
                {{ item.start_time + ' 至 ' + item.end_time }}
            </span>
            <!-- 排序 -->
            <span slot="sort" slot-scope="text, item">
                <a-input-number style="width: 60px" :min="0" :max="10000" @blur="changeSort($event, item.id)"
                    :default-value="text" />
            </span>
            <!-- 状态 -->
            <span slot="status" slot-scope="text, item">
                <a-switch checked-children="开" un-checked-children="关" :checked="item.status == 1 ? true : false"
                    @change="switchChange($event, item.id)" />
            </span>

            <!-- 操作栏 -->
            <span slot="action" slot-scope="text, item">
                <a class="inline-block" @click="preview(item)" style="margin-right: 10px">{{ L('预览') }}</a>
                <a class="inline-block" @click="editClick(item)" style="margin-right: 10px">{{ L('编辑') }}</a>
                <a class="inline-block" @click="delClick(item)" style="color: red;">{{ L('删除') }}</a>
            </span>
        </a-table>

        <a-modal destroyOnClose :title="form.id?'编辑排行榜':'新建排行榜'" v-model="visible" @ok="handleOk" width="1000px"
            :confirmLoading="confirmLoading">
            <div>
                <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol" :model="form" ref="ruleForm"
                    :rules="rules">
                    <a-form-model-item label="排行榜标题" prop="name">
                        <a-input v-model="form.name" :placeholder="L('请填写')" />
                    </a-form-model-item>
                    <a-form-model-item label="上传图标" prop="pic">
                        <a-upload action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                            accept="image/*" list-type="picture-card" :file-list="fileList" name="reply_pic"
                            @preview="handlePreviewImg" :data="{ upload_dir: 'common/visualization' }"
                            @change="handleUploadImg($event)">
                            <a-icon type="plus" />
                            <div class="ant-upload-text">{{ L('上传') }}</div>
                        </a-upload>
                    </a-form-model-item>
                    <a-form-model-item label="主题色" v-if="form.bg_color">
                        <a-radio-group :default-value="form.bg_color" @change="mainColorSelectChange">
                            <a-radio :value="item.bgColor" v-for="item in mainColor" :key="item.bgColor">{{ item.title
                                }}</a-radio>
                        </a-radio-group>
                        <!-- <div class="flex align-center">{{ L('背景颜色') }}：<color-picker :color.sync="form.bg_color"
                                disabled />
                        </div>
                        <div class="flex align-center">{{ L('字体颜色') }}：<color-picker :color.sync="form.font_color"
                                disabled />
                        </div> -->
                    </a-form-model-item>
                    <a-form-model-item :label="L('业务')">
                        <a-select style="width: 120px" v-model="form.business_type">
                            <a-select-option :value="item.key" v-for="item in businessType" :key="item.key">{{
                                item.value }}</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <template v-if="form.business_type != 'custom'">
                        <a-form-model-item :label="L('类型')">
                            <a-select style="width: 120px" v-model="form.type">
                                <a-select-option :value="item.key" v-for="item in typeList" :key="item.key">{{
                                    item.value }}</a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item :label="L('排行类型')">
                            <a-select style="width: 180px" v-model="form.sort_type">
                                <a-select-option :value="item.key" v-for="item in sortType" :key="item.key">{{
                                    item.value }}</a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item label="虚拟量">
                            <a-input-number :min="0" v-model="form.virtual_sales" />
                        </a-form-model-item>
                    </template>
                    <template v-if="form.business_type == 'custom'">
                        <div v-for="(item, index) in form.custom_value" :key="index" class="pb-20">
                            <a-form-model-item :label="L('名称')">
                                <a-input v-model="item.name" :placeholder="L('例如：谭松韵红毛衣好适合圣诞')" style="width: 350px;" />
                                <a class="ml-10 text-nowrap" style="color: red" @click="deleteCustom(item, index)">{{
                                    L('删除') }}</a>
                            </a-form-model-item>
                            <a-form-model-item label="数据">
                                <a-input v-model="item.virtual_sales" :placeholder="L('例如热度765.2万个')"
                                    style="width: 350px;" />
                            </a-form-model-item>
                            <a-form-model-item label="链接">
                                <a-input v-model="item.link_url" :placeholder="L('请填写')" style="width: 350px;" />
                                <a class="ant-form-text ml-10" @click="setLinkBases(item, index)">
                                    从功能库选择
                                </a>
                            </a-form-model-item>
                        </div>
                        <a-form-model-item :wrapper-col="{ offset: 6 }">
                            <a-button type="primary" @click="addCustom">{{ L('新增') }}</a-button>
                        </a-form-model-item>
                    </template>
                    <a-form-model-item label="有效期" prop="start_time">
                        <a-range-picker @change="onTimeChange"
                            :defaultValue="[form.start_time ? moment(form.start_time) : null, form.end_time ? moment(form.end_time) : null]" />
                    </a-form-model-item>
                    <a-form-model-item label="排序">
                        <a-input-number :min="0" v-model="form.sort" />
                    </a-form-model-item>
                    <a-form-model-item label="状态">
                        <a-switch v-model="form.status" checked-children="开" un-checked-children="关" />
                    </a-form-model-item>
                </a-form-model>
            </div>
        </a-modal>
        <a-modal destroyOnClose title="预览" v-model="h5Visible" :footer="null" width="400px">
            <iframe v-if="listItem" :src="listItem.preview_link" frameborder="0" style="width: 100%;height: 650px;"></iframe>
        </a-modal>
    </div>
</template>

<script>
import viewpagePlatFormApi from '@/api/common/platform/viewpage'
import { imgUploadHandle, imgUploadFileListHandle, getBase64 } from '@/utils/util.js'
import ColorPicker from '@/components/ColorPicker/ColorPicker'
import moment from 'moment';
export default {
    data() {
        return {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
            // 景区状态开启/暂停参数
            form: {
                status: true,
                name: '',
                business_type: 'mall',
                type: 'goods',
                sort_type: 'hit',
                virtual_sales: 0,
                sort: 0,
                start_time: '',
                end_time: '',
                custom_value: [],
                show_position: 'home',
                bg_color: '',
                font_color: '',
                pic: '',
            },
            visible: false,
            dataList: [],
            pagination: {
                pageSize: 10,
                total: 0,
                current: 1,
                page: 1,
            },
            queryParams: {
                page_size: 0,
                page: 1,
                keywords: '',
                show_position: 'home'
            },
            columns: [
                {
                    title: this.L('标题'),
                    dataIndex: 'name',
                },
                {
                    title: this.L('标题图标'),
                    dataIndex: 'pic',
                    key: 'pic',
                    scopedSlots: {
                        customRender: 'pic',
                    },
                },
                {
                    title: this.L('业务'),
                    dataIndex: 'business_type_txt',
                    key: 'business_type_txt',
                },
                {
                    title: this.L('有效期'),
                    dataIndex: 'start_time',
                    scopedSlots: {
                        customRender: 'start_time',
                    },
                },
                {
                    title: this.L('排序值'),
                    dataIndex: 'sort',
                    key: 'sort',
                    scopedSlots: {
                        customRender: 'sort',
                    },
                },

                {
                    title: this.L('状态'),
                    dataIndex: 'status',
                    key: 'status',
                    scopedSlots: {
                        customRender: 'status',
                    },
                },
                {
                    title: this.L('操作'),
                    dataIndex: 'tools_id',
                    key: 'action',
                    width: 150,
                    scopedSlots: {
                        customRender: 'action',
                    },
                },
            ],
            fileList: [],
            rules: {
                name: [{ required: true, message: this.L('请填写排行榜标题'), trigger: ['blur'], }],
                start_time: [{ required: true, message: this.L('请选择时间'), trigger: ['blur'], }],
                pic: [{ required: true, message: this.L('请上传图标'), trigger: ['blur'], }],
            },
            businessType: [],
            mainColor: [],
            sortType: [],
            typeList: [],
            confirmLoading: false,
            h5Visible: false,
            listItem: null,
        }
    },
    components: { ColorPicker },
    mounted() {
        this.getList()
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    methods: {
        moment,
        getList() {
            this.queryParams.page_size = this.pagination.pageSize
            this.queryParams.page = this.pagination.current
            this.request(viewpagePlatFormApi.searchRankingGetList, this.queryParams).then((res) => {
                this.dataList = res.data
                this.pagination.total = res.total
                this.businessType = res.businessType
                this.mainColor = res.mainColor
                this.sortType = res.sortType
                this.typeList = res.type
            })
        },
        changePage(page, pageSize) {
            this.pagination.current = page.current
            this.getList()
        },
        onSearch(text) {
            this.queryParams.keywords = text
            this.getList()
        },
        // 改变排序
        changeSort(e, id) {
            const sort = e.currentTarget.value
            this.request(viewpagePlatFormApi.searchRankingChangeInfo, {
                id,
                type: 'sort',
                value: sort,
            }).then((res) => {
                this.getList()
            })
        },

        // 改变开关状态
        switchChange(status, id) {
            status = status ? 1 : 0
            this.request(viewpagePlatFormApi.searchRankingChangeInfo, {
                id,
                type: 'status',
                value: status,
            }).then((res) => {
                this.getList()
            })
        },
        editClick(item) {
            this.form = JSON.parse(JSON.stringify(item));
            this.form.status = item.status ? true : false
            this.fileList = item.pic ? imgUploadFileListHandle([item.pic], 'icon') : []
            this.$nextTick(() => {
                this.visible = true;
            })
        },
        delClick(item) {
            this.$confirm({
                title: '确定删除吗？',
                centered: true,
                onOk: () => {
                    this.request(viewpagePlatFormApi.searchRankingDelete, { id: item.id }).then((res) => {
                        this.$message.success(this.L('删除成功！'))
                        this.getList()
                    })
                },
                onCancel() { },
            })
        },
        addClick() {
            this.form = {
                status: true,
                name: '',
                business_type: 'mall',
                type: 'goods',
                sort_type: 'hit',
                virtual_sales: 0,
                sort: 0,
                start_time: '',
                end_time: '',
                custom_value: [],
                show_position: 'home',
                bg_color: '',
                font_color: '',
                pic: '',
            }
            this.fileList = []
            if (this.mainColor.length) {
                this.form.bg_color = this.mainColor[0].bgColor
                this.form.font_color = this.mainColor[0].fontColor
            }
            this.visible = true;
        },
        handleOk() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    this.confirmLoading = true
                    this.request(viewpagePlatFormApi.searchRankingSaveData, this.form).then((res) => {
                        this.$message.success(this.L('添加成功！'))
                        this.visible = false;
                        this.confirmLoading = false
                        this.getList()
                    }).catch(err => {
                        this.confirmLoading = false
                    })
                } else {
                    if(!this.form.name){
                        this.$message.warning(this.rules.name[0].message)
                    }else if(!this.form.pic){
                        this.$message.warning(this.rules.pic[0].message)
                    } else if(!this.form.start_time){
                        this.$message.warning(this.rules.start_time[0].message)
                    }
                    return false;
                }
            });
        },
        // 预览图片
        async handlePreviewImg(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj)
            }
            this.previewImage = file.url || file.preview
            this.previewVisible = true
        },
        // 上传图片
        handleUploadImg(info) {
            const { fileList = [], resultData = {} } = imgUploadHandle(info)
            this.form.pic = resultData.fileUrl || ''
            this.fileList = fileList
        },
        onTimeChange(date, dateString) {
            this.form.start_time = dateString[0]
            this.form.end_time = dateString[1]
        },
        deleteCustom(item, index) {
            this.form.custom_value.splice(index, 1)
        },
        addCustom() {
            this.form.custom_value.push({
                name: '',
                virtual_sales: '',
                link_url: '',
            })
        },
        setLinkBases(item, index) {
            this.$LinkBases({
                // visible: true,
                source: 'platform', // 必填
                type: 'h5', // 必填
                // 确定按钮
                handleOkBtn: (res) => {
                    // 点击按钮事件
                    console.log('handleOk', res)
                    this.form.custom_value[index].link_url = res.url
                },
            })
        },
        mainColorSelectChange(e) {
            const item = this.mainColor.find(v => v.bgColor == e.target.value)
            if (item) {
                this.form.bg_color = item.bgColor
                this.form.font_color = item.fontColor
            }
        },
        preview(item) {
            this.listItem = item;
            this.h5Visible = true
        },
    },
}
</script>