<template>
    <div>
        <a-row>
            <a-col
                ><a-button type="primary" @click="edit()">{{ L('新建') }}</a-button></a-col
            >
        </a-row>
        <a-table :columns="columns" rowKey="id" :data-source="list" :pagination="pagination" class="mt-20" :scroll="{ y: 93 * 4 + (93 / 2) }">
            <span slot="pic" slot-scope="text, record">
                <beautiful-image :src="record.pic" width="60px" height="60px" hover radius="6px" />
            </span>
            <span slot="status" slot-scope="text">
                <a-badge :color="text == 1 ? 'green' : 'red'" :text="text == 1 ? L('开启') : L('关闭')" />
            </span>
            <span slot="action" slot-scope="text, record">
                <span class="cr-primary pointer mr-10" @click="edit(record)">{{ L('编辑') }}</span>
                <span class="cr-primary pointer" @click="del(record)">{{ L('删除') }}</span>
            </span>
        </a-table>

        <a-modal
            :title="modalTitle"
            v-model="visible"
            @ok="handleOk"
            destroyOnClose
            width="60%"
            :centered="true"
            @cancel="handleCancel"
            :getContainer="getContainer"
        >
            <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item :label="L('名称')" prop="name">
                    <a-input :placeholder="L('请输入')" v-model="form.name" />
                </a-form-model-item>
                <a-form-model-item :label="L('图片')" :help="L('建议尺寸80*80')">
                    <a-upload
                        action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                        accept="image/*"
                        list-type="picture-card"
                        :file-list="fileList"
                        name="reply_pic"
                        :data="{ upload_dir: 'merchant/shop_new' }"
                        @preview="handlePreviewImg"
                        @change="handleUploadImg($event)"
                    >
                        <a-icon type="plus" />
                        <div class="ant-upload-text">上传</div>
                    </a-upload>
                </a-form-model-item>
                <a-form-model-item :label="L('链接地址')" prop="url">
                    <a-input :placeholder="L('请输入')" v-model="form.url" style="width: 70%" />
                    <a-button type="link" @click="changeUrl()">{{ L('从功能库选择') }}</a-button>
                </a-form-model-item>
                <a-form-model-item :label="L('排序')" :help="L('值越大越靠前')">
                    <a-input-number v-model="form.sort" :min="0" />
                </a-form-model-item>
                <a-form-model-item label="状态">
                    <a-switch
                        :checked-children="L('开')"
                        :un-checked-children="L('关')"
                        :checked="form.status == 1 ? true : false"
                        @change="onModelStatusChange"
                    />
                </a-form-model-item>
            </a-form-model>
        </a-modal>

        <a-modal
            :visible="previewVisible"
            :footer="null"
            :getContainer="getContainer"
            @cancel=";(previewVisible = false), (previewImage = '')"
        >
            <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
    </div>
</template>

<script>
import shopNewMerchantApi from '@/api/shop_new/merchant'
import BeautifulImage from '@/components/BeautifulImage/BeautifulImage.vue'
export default {
    components: {
        BeautifulImage,
    },
    data() {
        return {
            store_id: '',
            mer_id: '',
            list: [],
            columns: [
                {
                    title: this.L('排序'),
                    dataIndex: 'sort',
                },
                {
                    title: this.L('名称'),
                    dataIndex: 'name',
                },
                {
                    title: this.L('图片'),
                    dataIndex: 'pic',
                    scopedSlots: { customRender: 'pic' },
                },
                {
                    title: this.L('操作时间'),
                    dataIndex: 'last_time',
                },
                {
                    title: this.L('状态'),
                    dataIndex: 'status',
                    scopedSlots: { customRender: 'status' },
                },
                {
                    title: this.L('操作'),
                    scopedSlots: { customRender: 'action' },
                },
            ],
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => this.L(`共 X1 条记录`,{X1:total}),
            },
            visible: false,
            modalTitle: '',
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            rules: {
                name: [{ required: true, message: this.L('请输入名称'), trigger: 'blur' }],
                url: [{ required: true, message: this.L('请选择链接地址'), trigger: 'blur' }],
            },
            form: {
                name: '',
                pic: '',
                status: 1,
                sort: '',
                url: '',
            },
            fileList: [],
            // 图片预览
            previewVisible: false,
            previewImage: '',
        }
    },
    mounted() {
        this.store_id = this.$route.query.store_id || ''
        this.mer_id = this.$route.query.mer_id || ''
        this.shopEditSliderList()
        this.$message.config({
            getContainer: this.getContainer,
        })
        this.$notification.config({
            getContainer: this.getContainer,
        })
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    methods: {
        shopEditSliderList() {
            let params = {
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
                store_id: this.store_id,
            }
            this.request(shopNewMerchantApi.shopEditSliderList, params).then((res) => {
                this.list = res.data || []
                if (!this.list.length && this.pagination.current > 1) {
                    this.pagination.current = this.pagination.current - 1
                    this.shopEditSliderList()
                }
                this.pagination.total = res.total || 0
            })
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.shopEditSliderList()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.shopEditSliderList()
        },
        // 编辑
        edit(record = '') {
            if (record) {
                this.form = {
                    ...record,
                }
                this.modalTitle = this.L('导航编辑')
                this.fileList = [
                    {
                        uid: 'image',
                        name: 'image_1',
                        status: 'done',
                        url: record.pic,
                    },
                ]
            } else {
                this.form = {
                    name: '',
                    pic: '',
                    status: 1,
                    sort: '',
                    url: '',
                }
                this.fileList = []
                this.modalTitle = this.L('导航添加')
            }
            this.visible = true
        },
        // 删除
        del(record) {
            this.$confirm({
                title: this.L('是否确定删除该条数据?'),
                centered: true,
                getContainer: this.getContainer,
                onOk: () => {
                    let param = {
                        id: record.id,
                        store_id: this.store_id,
                    }
                    this.request(shopNewMerchantApi.shopEditDelSlider, param).then((res) => {
                        this.$message.success(this.L('操作成功！'))
                        this.shopEditSliderList()
                    })
                },
                onCancel() {},
            })
        },
        // 弹框挂载
        getContainer() {
            return window.parent && window.parent.document.body ? window.parent.document.body : document.body
        },
        // 状态
        onModelStatusChange(e) {
            this.$set(this.form, 'status', e ? 1 : 0)
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
            let fileList = [...info.fileList]
            if (fileList.length) {
                fileList = fileList.splice(-1)
                let imgs = []
                fileList = fileList.map((file) => {
                    if (file.response && file.status == 'done' && file.response.status == 1000) {
                        let url = file.response.data
                        imgs.push(url)
                    }
                    return file
                })
                this.$set(this.form, 'pic', imgs[0])
                this.fileList = fileList
            } else {
                this.$set(this.form, 'pic', '')
                this.fileList = []
            }
        },
        // 功能库选择链接
        changeUrl() {
            this.$LinkBases({
                source: 'merchant',
                type: 'h5',
                modalGetContainer: this.getContainer,
                source_id: this.mer_id,
                // 确定按钮
                handleOkBtn: (res) => {
                    this.$set(this.form, 'url', res.url)
                },
            })
        },
        // 添加 || 编辑确认
        handleOk() {
            if (!this.form.name.trim()) {
                this.$message.error(this.L('请输入名称'))
                return
            }
            if (!this.form.url.trim()) {
                this.$message.error(this.L('请选择链接地址'))
                return
            }
            let params = {
                store_id: this.store_id,
                name: this.form.name.trim(),
                pic: this.form.pic,
                url: this.form.url,
                status: this.form.status,
                sort: this.form.sort,
            }
            let api = shopNewMerchantApi.shopEditAddSlider
            if (this.form.id) {
                api = shopNewMerchantApi.shopEditEditSlider
                params['id'] = this.form.id
            }

            this.request(api, params).then((res) => {
                this.$message.success(this.L('操作成功！'))
                this.shopEditSliderList()
                this.handleCancel()
            })
        },
        // 添加 || 编辑取消
        handleCancel() {
            this.visible = false
        },
    },
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}
</script>

<style scoped>
</style>