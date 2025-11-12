<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-row>
            <a-col>
                <a-button type="primary" @click="openModal('add')">{{ L('新建') }}</a-button>
            </a-col>
        </a-row>
        <a-table :columns="columns" rowKey="id" :data-source="list" :pagination="pagination" class="mt-20">
            <span slot="status" slot-scope="text, record">
                <a-switch :checked-children="L('开')" :un-checked-children="L('关')" :checked="record.status==1?true: false" @change="onSwitchChange($event, record)" />
            </span>
            <span slot="sort" slot-scope="text, record">
                <a-input-number :defaultValue="record.sort" :min="0" @blur="moneyBlur($event,record)" />
            </span>
            <span slot="pic" slot-scope="text, record">
                <beautiful-image :src="record.pic" width="50px" height="50px" radius="4px" visible hover viewerStyle="2" />
            </span>
            <span slot="action" slot-scope="text, record">
                <span class="cr-primary pointer mr-10" @click="openModal('edit',record)">{{ L('编辑') }}</span>
                <span class="cr-primary pointer" @click="del(record)">{{ L('删除') }}</span>
            </span>
        </a-table>
        <a-modal :title="modalTitle" v-model="visible" :confirm-loading="confirmLoading" @ok="handleOk" width="800px" :destroyOnClose="true">
            <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules" ref="ruleForm">
                <a-form-model-item :label="L('打赏名称')" prop="name">
                    <a-input v-model="form.name" :placeholder="L('请输入')" />
                </a-form-model-item>
                <a-form-model-item :label="L('打赏金额')" prop="money">
                    <a-input-number v-model="form.money" :min="0" />
                </a-form-model-item>
                <a-form-model-item :label="L('上传图片')" prop="pic">
                    <a-upload
                        action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                        accept="image/*"
                        list-type="picture-card"
                        :file-list="fileList"
                        name="reply_pic"
                        :data="{ upload_dir: 'activity/rewardManagement' }"
                        @preview="handlePreviewImg"
                        @change="handleUploadImg($event, 'fileList', 'pic')"
                    >
                        <a-icon type="plus" />
                        <div class="ant-upload-text">{{ L('上传') }}</div>
                    </a-upload>
                </a-form-model-item>
                <a-form-model-item :label="L('排序值')">
                    <a-input v-model="form.sort" :placeholder="L('请输入')" />
                </a-form-model-item>
                <a-form-model-item :label="L('状态')">
                    <a-switch v-model="form.status" checked-children="开" un-checked-children="关" />
                </a-form-model-item>
            </a-form-model>
        </a-modal>
        <div id="previewImage" style="display: none">
            <img :src="previewImage" />
        </div>
    </div>
</template>

<script>
import appointPlatformApi from '@/api/appoint/platform'
import BeautifulImage from '@/components/BeautifulImage/BeautifulImage'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
let viewer = ''
export default {
    data() {
        return {
            list: [],
            columns: [
                {
                    title: this.L('打赏名称'),
                    dataIndex: 'name',
                },
                {
                    title: this.L('打赏商品价格'),
                    dataIndex: 'money',
                },
                {
                    title: this.L('打赏物品图片'),
                    dataIndex: 'pic',
                    scopedSlots: { customRender: 'pic' },
                },
                {
                    title: this.L('排序'),
                    dataIndex: 'sort',
                    scopedSlots: { customRender: 'sort' },
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
                showTotal: (total) => this.L(`共 X1 条记录`, { X1: total }),
            },
            visible: false,
            confirmLoading: false,
            modalTitle: '',
            labelCol: { span: 5 },
            wrapperCol: { span: 14 },
            form: {
                name: '', //名称
                pic: '', //图片地址
                money: '', //金额
                sort: 0, //排序值
                status: true, //状态1-开启，0-关闭
            },
            fileList: [],
            // 图片预览
            previewVisible: false,
            previewImage: '',
            rules: {
                name: { required: true, message: this.L('请输入打赏名称'), trigger: 'blur' },
                pic: { required: true, message: this.L('请上传打赏图片'), trigger: 'blur' },
                money: { required: true, message: this.L('请输入打赏金额'), trigger: 'blur' },
            },
            action_type: '',
        }
    },
    components: { BeautifulImage },
    mounted() {
        this.getList()
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    methods: {
        // 列表
        getList(update = false) {
            if (update && this.pagination.current != 1) {
                this.pagination.current = 1
            }
            let params = {
                page: this.pagination.current,
                page_size: this.pagination.pageSize,
                title: this.keyword,
            }
            this.request(appointPlatformApi.rewardMoneyGetList, params).then((res) => {
                this.list = res
            })
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.getList()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.getList()
        },
        // 状态开关
        onSwitchChange(e, record) {
            this.request(appointPlatformApi.rewardMoneyChangeStatus, { id: record.id, status: e ? 1 : 0 }).then(
                (res) => {
                    this.$message.success(this.L('操作成功！'))
                    this.getList()
                }
            )
        },
        // 添加 || 编辑
        openModal(type, item) {
            this.action_type = type
            if (type == 'add') {
                this.modalTitle = this.L('新建')
                this.fileList = []
                this.form = {
                    name: '', //名称
                    pic: '', //图片地址
                    money: '', //金额
                    sort: 0, //排序值
                    status: true, //状态1-开启，0-关闭
                }
            }
            if (type == 'edit') {
                this.modalTitle = this.L('编辑')
                this.form = JSON.parse(JSON.stringify(item))
                this.form.status = this.form.status == 1 ? true : false
                this.fileList = [
                    {
                        url: this.form.pic,
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                    },
                ]
            }
            this.visible = true
        },
        // 删除
        del(record) {
            this.$confirm({
                title: this.L('是否确定删除该条数据?'),
                centered: true,
                onOk: () => {
                    let param = {
                        id: record.id,
                    }
                    this.request(appointPlatformApi.rewardMoneyDel, param).then((res) => {
                        this.$message.success(this.L('操作成功！'))
                        this.getList()
                    })
                },
            })
        },
        //添加/编辑
        handleOk() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    let params = {
                        ...this.form,
                    }
                    params.status = params.status ? 1 : 0
                    let url = appointPlatformApi.rewardMoneyAdd
                    if (this.action_type == 'edit') {
                        url = appointPlatformApi.rewardMoneyEdit
                    }
                    this.request(url, params).then((res) => {
                        this.$message.success(this.L('操作成功！'))
                        this.visible = false
                        this.getList()
                    })
                } else {
                    return false
                }
            })
        },
        // 预览图片
        async handlePreviewImg(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj)
            }
            this.previewImage = file.url || file.preview
            this.previewVisible = true
            this.previewImg()
        },
        // 上传图片
        handleUploadImg(info = '', filedList = '', fieldForm = '') {
            let fileList = info && info.fileList ? [...info.fileList] : []
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
                this.$set(this.form, fieldForm, imgs[0])
                this[filedList] = fileList
            } else {
                this.$set(this.form, fieldForm, '')
                this[filedList] = []
            }
        },
        moneyBlur(event, record) {
            let value = Number(event.target._value)
            if (value != record.money) {
                this.request(appointPlatformApi.rewardMoneyChangeSort, {
                    sort: value,
                    id: record.id,
                }).then((res) => {
                    this.$message.success(this.L('操作成功！'))
                    this.visible = false
                    this.getList()
                })
            }
        },
        //加载查看图片插件
        previewImg() {
            this.$nextTick(()=>{
                viewer = new Viewer(document.getElementById('previewImage'), {
                button: true,
                inline: false,
                zoomable: true,
                title: true,
                tooltip: true,
                movable: true,
                interval: 2000,
                navbar: true,
                loading: true,
                show: function () {
                    viewer.full()
                },
                // 每次关闭查看时触发
                hide() {
                    viewer.destroy()
                },
                // 每次关闭查看时触发，在hide之后
                hidden() {
                    viewer.destroy()
                },
            })
            viewer.show()
            });
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
