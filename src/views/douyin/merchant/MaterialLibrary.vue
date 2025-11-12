<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-row>
            <a-col :span="16">
                <a-input-search
                    :placeholder="L('请输入')"
                    style="width: 300px"
                    v-model="queryParams.name"
                    @search="onSearch"
                />
                <a-button type="primary" class="m-10" @click="onSearch">
                    {{ L('搜索') }}
                </a-button>
            </a-col>
            <a-col :span="8" style="text-align: right">
                <a-button type="danger" class="m-10" @click="onDelete">
                    {{ L('删除') }}
                </a-button>
                <a-button type="primary" class="m-10" @click="onAdd">
                    {{ L('新建') }}
                </a-button>
            </a-col>
        </a-row>

        <a-table
            :columns="columns"
            rowKey="id"
            :data-source="list"
            :row-selection="{
                selectedRowKeys: selectedRowKeys,
                onSelect: onSelect,
                onSelectAll: onSelectAll,
            }"
            :pagination="pagination"
        >
            <span slot="cover" slot-scope="text, record">
                <img :src="record.cover" class="img pointer" @click="handlePreview({ url: record.cover })" />
            </span>
            <span
                class="pointer cr-primary no-wrap"
                slot="material_url"
                slot-scope="text, record"
                @click="viewItem(record)"
            >
                {{ L('点击播放') }}
            </span>

            <!-- 操作栏 -->
            <span slot="action" slot-scope="text, record">
                <a-button type="link" @click="delItem(record)">{{ L('删除') }}</a-button>
                <a-button type="link" @click="editItem(record)">{{ L('编辑') }}</a-button>
            </span>
        </a-table>

        <a-modal
            :visible="modalVisible"
            :title="modalTitle"
            :destroyOnClose="true"
            width="60%"
            :bodyStyle="{
                maxHeight: '650px',
                overflowY: 'auto',
            }"
            @cancel="handleCancel"
            @ok="handleOk"
            :footer="modalType == 'viewVideo' ? null : undefined"
        >
            <section v-if="modalType == 'viewVideo'">
                <video :src="modalForm.material_url" style="width: 100%; max-height: 400px" controls autoplay></video>
            </section>
            <section v-else>
                <a-form-model :model="modalForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
                    <section v-if="modalType == 'addVideo'">
                        <a-form-model-item :label="L('视频名称')" required>
                            <a-input allow-clear v-model="modalForm.material_name" :placeholder="L('请输入')" />
                        </a-form-model-item>
                        <a-form-model-item
                            class="videos"
                            :label="L('上传视频')"
                            :help="L('视频上传不可以大于100M，必须是MP4文件')"
                            required
                        >
                            <div v-if="modalForm.material_url">
                                <video
                                    :src="modalForm.material_url"
                                    style="width: 60%; max-height: 200px"
                                    controls
                                ></video>
                            </div>
                            <a-upload
                                name="video"
                                action="/v20/public/index.php/common/common.UploadFile/uploadVideos"
                                :file-list="videoUploadList"
                                :multiple="false"
                                :showUploadList="modalForm.material_url ?false:true"
                                :before-upload="beforeUploadFile"
                                @change="handleChangeVideo"
                                :data="{ upload_dir: '/douyin/video' }"
                            >
                                <div>
                                    <a-button> <a-icon type="upload" /> {{ L('上传视频') }} </a-button>
                                </div>
                            </a-upload>
                        </a-form-model-item>
                        <a-form-model-item :label="L('上传封面')" :help="L('封面未设置则默认读取视频第一帧作为封面图')">
                            <a-upload
                                action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                                name="reply_pic"
                                list-type="picture-card"
                                :data="{ upload_dir: '' }"
                                :file-list="videoCoverList"
                                @preview="handlePreview"
                                @change="handleUploadImgChange($event, 'cover', 'videoCoverList')"
                            >
                                <div>
                                    <a-icon type="plus" />
                                    <div class="ant-upload-text">{{ L('上传封面') }}</div>
                                </div>
                            </a-upload>
                        </a-form-model-item>
                        <a-form-model-item :label="L('转发文案')" required>
                            <a-textarea
                                allow-clear
                                v-model="modalForm.share_desc"
                                :placeholder="L('请输入')"
                                :autoSize="{ minRows: 2, maxRows: 6 }"
                            />
                        </a-form-model-item>
                        <a-form-model-item :label="L('话题')" :help="L('多个话题请以英文分号隔开')">
                            <a-input allow-clear v-model="modalForm.topic" :placeholder="L('请输入')" />
                        </a-form-model-item>
                    </section>
                </a-form-model>
            </section>
        </a-modal>

        <a-modal
            width="60%"
            :bodyStyle="{ maxHeight: '650px', overflowY: 'auto' }"
            :visible="previewVisible"
            :footer="null"
            @cancel="previewVisible = false"
        >
            <img class="mt-20" style="width: 100%; height: auto" :src="previewImage" />
        </a-modal>
    </div>
</template>

<script>
import douyinMerchantApi from '@/api/douyin/merchant'
export default {
    data() {
        return {
            queryParams: {
                name: '',
            },
            list: [],
            columns: [
                {
                    title: this.L('名称'),
                    dataIndex: 'material_name',
                },
                {
                    title: this.L('封面'),
                    dataIndex: 'cover',
                    scopedSlots: {
                        customRender: 'cover',
                    },
                },
                {
                    title: this.L('视频'),
                    dataIndex: 'material_url',
                    scopedSlots: {
                        customRender: 'material_url',
                    },
                },
                {
                    title: this.L('创建时间'),
                    dataIndex: 'create_time',
                },
                {
                    title: this.L('操作'),
                    key: 'action',
                    scopedSlots: {
                        customRender: 'action',
                    },
                },
            ],
            pagination: {
                pageSize: 10,
                total: 0,
                current: 1,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => `共 ${total} 条记录`,
            },
            selectedRowKeys: [],
            modalVisible: false,
            modalType: '',
            modalTitle: '',
            modalForm: '',
            fileloading: false,
            videoUploadList: [],
            videoCoverList: [],
            previewVisible: false,
            previewImage: '',
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        getList() {
            let params = {
                name: this.queryParams.name,
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
            }
            this.request(douyinMerchantApi.getSourceMaterialLists, params).then((res) => {
                this.list = res.data
                this.$set(this.pagination, 'total', res.total)
            })
        },
        onSearch() {
            this.$set(this.pagination, 'current', 1)
            this.getList()
        },
        onAdd() {
            this.modalType = 'addVideo'
            this.modalTitle = this.L('添加视频')
            this.modalForm = {
                id: '',
                material_name: '',
                material_url: '',
                material_type: 'video',
                cover: '',
                share_desc: '',
                topic: '',
            }
            this.modalVisible = true
        },
        onDelete() {
            if (!this.selectedRowKeys.length) {
                this.$message.error(this.L('请选择要删除的列表'))
                return
            }
            this.$confirm({
                title: this.L('确定要删除列表吗？'),
                centered: true,
                onOk: () => {
                    this.request(douyinMerchantApi.delSourceMaterial, {
                        ids: this.selectedRowKeys.join(','),
                    }).then((res) => {
                        this.$message.success(this.L('操作成功！'))
                        this.selectedRowKeys = []
                        this.getList()
                    })
                },
                onCancel() {},
            })
        },
        onSelect(record, selected, selectedRows, nativeEvent) {
            let selectedRowKeys = this.selectedRowKeys
            if (selected) {
                selectedRowKeys.push(record.id)
            } else {
                if (selectedRowKeys.length) {
                    let index = selectedRowKeys.findIndex((item) => item == record.id)
                    index != -1 && this.$delete(selectedRowKeys, index)
                }
            }
            this.selectedRowKeys = JSON.parse(JSON.stringify(selectedRowKeys))
        },
        onSelectAll(selected, selectedRows, changeRows) {
            let ids = changeRows.map((item) => item.id)
            let selectedRowKeys = this.selectedRowKeys
            if (selected) {
                selectedRowKeys = selectedRowKeys.concat(ids)
            } else {
                selectedRowKeys = selectedRowKeys.concat(ids).filter((item) => !ids.includes(item))
            }
            this.selectedRowKeys = JSON.parse(JSON.stringify(selectedRowKeys))
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
        // 视频查看
        viewItem(record) {
            this.modalType = 'viewVideo'
            this.modalTitle = this.L('视频查看')
            this.modalForm = {
                material_url: record.material_url,
            }
            this.modalVisible = true
        },
        // 视频编辑
        editItem(record) {
            this.modalType = 'addVideo'
            this.modalTitle = this.L('视频编辑')
            this.modalForm = {
                ...record,
                image_full_url: record.cover,
                video_full_url: record.material_url,
            }
            if (record.video_url) {
                this.videoUploadList = [
                    {
                        uid: 'video_url',
                        name: record.material_url,
                        status: 'done',
                        url: record.material_url,
                    },
                ]
            }

            if (record.cover) {
                this.videoCoverList = [
                    {
                        uid: 'video_cover',
                        name: record.cover,
                        status: 'done',
                        url: record.cover,
                    },
                ]
            }
            this.modalVisible = true
        },
        // 删除
        delItem(record) {
            this.$confirm({
                title: this.L('确定要删除该条数据吗？'),
                centered: true,
                onOk: () => {
                    this.request(douyinMerchantApi.delSourceMaterial, {
                        ids: record.id,
                    }).then((res) => {
                        this.$message.success(this.L('操作成功！'))
                        if (this.selectedRowKeys.length) {
                            let index = this.selectedRowKeys.findIndex((item) => item == record.id)
                            if (index != -1) {
                                this.$delete(this.selectedRowKeys, index)
                            }
                        }
                        this.getList()
                    })
                },
                onCancel() {},
            })
        },
        // 上传
        beforeUploadFile(file) {
            let type = file.type.toLowerCase()
            if (this.fileloading) {
                this.$message.warning(this.L('当前还有文件上传中，请等候上传完成!'))
                return false
            }
            if (type.indexOf('mp4') == -1) {
                this.$message.error(this.L('仅支持mp4文件上传!'))
                return false
            }
            let isLimitSize = file.size / 1024 / 1024 < 100
            if (!isLimitSize) {
                this.$message.error('视频上传最大支持100MB!')
                return false
            }
        },
        handleChangeVideo(info) {
            if (info.file && !info.file.status && this.fileloading) {
                return false
            }
            this.modalForm.material_url = ''
            if (info.file.status === 'uploading') {
                if (this.fileloading) {
                    return false
                }
                this.fileloading = true
                this.videoUploadList = [info.file]
            }
            if (info.file.status !== 'uploading') {
                this.fileloading = false
            }

            if (info.file && info.file.response) {
                const res = info.file.response
                if (res.status === 1000) {
                    this.videoUploadList = []
                    this.modalForm = {
                        ...this.modalForm,
                        material_url: res.data.video_url,
                        cover: this.modalForm.cover || res.data.video_image,
                    }
                    this.videoUploadList = [
                        {
                            uid: 'video_url',
                            name: this.modalForm.material_url,
                            status: 'done',
                            url: this.modalForm.material_url,
                        },
                    ]
                    this.$message.success(this.L('上传成功'))
                } else {
                    this.videoUploadList = []
                    res.msg && this.$message.error(res.msg)
                }
            }
        },
        handleCancel() {
            this.modalVisible = false
            this.videoUploadList = []
            this.videoCoverList = []
            this.modalType = ''
            this.modalTitle = ''
            this.modalForm = {}
        },
        handleOk() {
            if (this.modalType == 'addVideo') {
                this.addVideo()
            }
        },
        // 视频添加
        addVideo() {
            if (!this.modalForm.material_name) {
                this.$message.error(this.L('请输入视频名称'))
                return
            }
            if (!this.modalForm.material_url) {
                this.$message.error(this.L('请上传视频'))
                return
            }
            if (!this.modalForm.share_desc) {
                this.$message.error(this.L('请输入转发文案'))
                return
            }
            let params = {
                id: this.modalForm.id,
                material_name: this.modalForm.material_name,
                material_url: this.modalForm.material_url,
                material_type: this.modalForm.material_type,
                cover: this.modalForm.cover,
                share_desc: this.modalForm.share_desc,
                topic: this.modalForm.topic,
            }
            this.request(douyinMerchantApi.saveSourceMaterial, params).then((res) => {
                this.$message.success(this.L('操作成功'))
                this.getList()
                this.handleCancel()
            })
        },
        handleUploadImgChange(info, field, listField) {
            let fileList = info.fileList
            this[listField] = fileList
            if (fileList.length > 0) {
                let len = fileList.length - 1
                if (this[listField][len].status == 'done') {
                    let url = this[listField][len].response.data
                    this.$set(this.modalForm, field, url)
                    this[listField][0].uid = field
                    this[listField][0].name = url
                    this[listField][0].status = 'done'
                    this[listField][0].url = url
                    if (fileList.length > 1) {
                        this[listField].splice(0, 1)
                    }
                }
            } else {
                this.$set(this.modalForm, field, '')
            }
        },
        async handlePreview(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj)
            }
            this.previewImage = file.url || file.preview
            this.previewVisible = true
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
<style>
.videos .ant-form-explain{
    margin-top: 15px !important;
}
</style>
<style scoped>
.m-10 {
    margin: 10px;
}
.img {
    width: 50px;
    height: 50px;
    object-fit: cover;
}
</style>