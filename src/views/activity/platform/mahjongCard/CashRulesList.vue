<template>
    <div class="mt-10 mb-10 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-row type="flex" justify="space-between">
            <div class="pointer" @click="back()"><a-icon type="arrow-left" class="mr-10" />{{ L('活动列表') }}</div>
            <a-col
                ><a-button type="primary" @click="edit()">{{ L('新建') }}</a-button></a-col
            >
        </a-row>
        <a-table :columns="columns" rowKey="id" :data-source="list" :pagination="pagination" class="mt-20">
            <span slot="img" slot-scope="text, record">
                <BeautifulImage :key="record.img" :src="record.img" width="50px" height="50px" visible></BeautifulImage>
            </span>
            <span slot="awards_ids" slot-scope="text, record" class="text-wrap">
                <a-tag v-for="(item, index) in record.awards_info_name" :key="index" style="margin: 0 4px 4px 0">{{
                    item
                }}</a-tag>
            </span>

            <span slot="type" slot-scope="text, record">
                <a-tag :color="record.type == 0 ? 'red' : record.type == 1 ? 'green' : 'orange'">
                    {{ getLabel(record.type, prizeTypeOptions) }}
                </a-tag>
                <span class="text-wrap">{{ record.awards_val || '--' }}</span>
            </span>
            <span slot="action" slot-scope="text, record">
                <span class="cr-red pointer mr-10" @click="del(record)">{{ L('删除') }}</span>
                <span class="cr-primary pointer" @click="edit(record)">{{ L('编辑') }}</span>
            </span>
        </a-table>

        <a-modal
            :title="form.id ? L('编辑') : L('新建')"
            v-model="visible"
            @ok="handleOk"
            destroyOnClose
            width="60%"
            :centered="true"
            @cancel="handleCancel"
        >
            <a-form-model ref="form" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
                <a-form-model-item :label="L('兑奖名称')" prop="title">
                    <a-input :placeholder="L('请输入')" v-model="form.title" allowClear />
                </a-form-model-item>
                <a-form-model-item
                    :label="L('奖品图片')"
                    :extra="L('建议尺寸：224*224，支持扩展名：.png，.jpg')"
                    prop="img"
                >
                    <a-upload
                        action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                        accept="image/*"
                        list-type="picture-card"
                        :file-list="fileList"
                        name="reply_pic"
                        @preview="handlePreviewImg"
                        :data="{ upload_dir: 'activity/mahjongCard' }"
                        @change="handleUploadImg($event)"
                    >
                        <a-icon type="plus" />
                        <div class="ant-upload-text">{{ L('上传') }}</div>
                    </a-upload>
                </a-form-model-item>
                <a-form-model-item :label="L('兑奖条件')" prop="awards_ids" required>
                    <div v-for="(item, index) in form.awards_ids" :key="index" class="flex align-center">
                        <a-select v-model="item.awards_id" style="width: 60%" :placeholder="L('请选择')">
                            <a-select-option v-for="itemAwards in awardsOptions(item)" :key="itemAwards.id">
                                {{ itemAwards.title }}
                            </a-select-option>
                        </a-select>
                        <div class="text-nowrap ml-10 flex align-center">
                            <span>{{ L('数量') }}：</span>
                            <a-input-number v-model="item.num" :min="1"></a-input-number>
                        </div>
                        <div class="text-nowrap ml-10 flex align-center" style="min-width: 66px">
                            <span class="cr-primary pointer" @click="awardIdsHandle(-1)" :class="[{'cr-99':(form.awards_ids.length > awards.length) || (form.awards_ids.length == awards.length)}]" v-show="index == 0">{{
                                L('添加')
                            }}</span>
                            <span class="cr-red pointer" v-show="index != 0" @click="awardIdsHandle(index)">{{
                                L('删除')
                            }}</span>
                        </div>
                    </div>
                </a-form-model-item>
                <a-form-model-item :label="L('活动库存')" prop="stocks_num">
                    <a-input-number :placeholder="L('请输入')" v-model="form.stocks_num" allowClear />
                </a-form-model-item>
                <a-form-model-item :label="L('奖品类型')" prop="type">
                    <a-select
                        v-model="form.type"
                        :placeholder="L('请选择')"
                        :options="prizeTypeOptions"
                        @change="form.awards_val = ''"
                    >
                    </a-select>
                </a-form-model-item>
                <a-form-model-item
                    v-if="form.type != undefined"
                    prop="awards_val"
                    :rules="[
                        {
                            required: true,
                            message: L('请输入X1', { X1: getLabel(form.type, prizeTypeOptions) }),
                            trigger: ['blur', 'change'],
                        },
                    ]"
                    :label="getLabel(form.type, prizeTypeOptions)"
                >
                    <a-input-number
                        v-if="form.type && form.type != 0"
                        :placeholder="L('请输入')"
                        v-model="form.awards_val"
                        style="width: 100%"
                        allowClear
                    />
                    <a-input v-else :placeholder="L('请输入')" v-model="form.awards_val" allowClear />
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import activityPlatformApi from '@/api/activity/platform'
import BeautifulImage from '@/components/BeautifulImage/BeautifulImage.vue'
import { imgUploadHandle, imgUploadFileListHandle, getBase64 } from '@/utils/util.js'
let checkAwardsIds = (rule, value, callback) => {
    let ids = value.filter((item) => item.awards_id)
    if (!ids.length) {
        return callback(new Error('兑奖条件请选择'))
    }
    let num = value.filter((item) => item.awards_id && (!item.num || item.num < 1))
    if (num.length) {
        return callback(new Error('兑奖条件数量最小为1'))
    }
    callback()
}
export default {
    name: 'ActivityMahjongCardCashRulesList',
    components: {
        BeautifulImage,
    },
    data() {
        return {
            prizeTypeOptions: [],
            awards: [], // 奖品列表
            list: [],
            columns: [
                {
                    title: this.L('兑奖名称'),
                    dataIndex: 'title',
                    customCell: () => {
                        return {
                            class: 'text-wrap',
                        }
                    },
                },
                {
                    title: this.L('奖品图片'),
                    dataIndex: 'img',
                    scopedSlots: { customRender: 'img' },
                },
                {
                    title: this.L('兑奖条件'),
                    dataIndex: 'awards_ids',
                    scopedSlots: { customRender: 'awards_ids' },
                    width: '30%',
                },
                {
                    title: this.L('活动库存'),
                    dataIndex: 'stocks_num',
                },
                {
                    title: this.L('奖品类型'),
                    scopedSlots: { customRender: 'type' },
                },
                {
                    title: this.L('操作'),
                    scopedSlots: { customRender: 'action' },
                    align: 'center',
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
            form: {},
            rules: {
                title: [{ required: true, message: this.L('请输入兑奖名称'), trigger: ['blur', 'change'] }],
                img: [{ required: true, message: this.L('请上传奖品图片'), trigger: ['blur', 'change'] }],
                awards_ids: [{ validator: checkAwardsIds, trigger: ['blur', 'change'] }],
                stocks_num: [{ required: true, message: this.L('请输入兑奖活动库存'), trigger: ['blur', 'change'] }],
                type: [{ required: true, message: this.L('请选择兑奖奖品类型'), trigger: ['blur', 'change'] }],
            },
            labelCol: { span: 4 },
            wrapperCol: { span: 18 },
            fileList: [],
        }
    },
    computed: {
        awardsOptions() {
            return (record) => {
                let list = this.awards
                let awards_ids = this.form.awards_ids
                if(awards_ids.length) {
                    list = this.awards.filter(item => {
                        let index = awards_ids.findIndex(sItem => sItem.awards_id == item.id && record.awards_id != item.id)
                        if(index == -1) {
                            return item
                        }
                    })
                }
                return list
            }
            
        }
    },
    mounted() {
        this.getList()
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    methods: {
        back() {
            let length = window.history.length
            if (length == 1) {
                this.$router.replace({
                    path: '/platform/activity.platform/mahjongCard/list',
                })
            } else {
                this.$router.go(-1)
                this.$router.replace({
                    path: '/platform/activity.platform/mahjongCard/list',
                })
            }
        },
        getLabel(value, options = [], valueField = 'value', labelField = 'label') {
            if (!options.length) return ''
            let item = options.find((item) => item[valueField] == value)
            if (item) {
                return item[labelField] || ''
            }
            return ''
        },
        getList() {
            let params = {
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
                id: this.$route.query.id,
            }
            this.request(activityPlatformApi.mahjongCardRulesList, params).then((res) => {
                const { list = [], awards = [], type_arr = [] } = res
                this.list = list
                this.awards = awards
                this.prizeTypeOptions = type_arr
                if (!this.list.length && this.pagination.current > 1) {
                    this.pagination.current = this.pagination.current - 1
                    this.getList()
                }
                this.pagination.total = res.total || 0
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
        // 编辑
        edit(record = '') {
            let awards_ids = [
                {
                    awards_id: undefined,
                    num: 1,
                },
            ]
            if (!record) {
                record = {
                    title: '',
                    img: '',
                    awards_ids: awards_ids,
                    stocks_num: undefined,
                    type: undefined,
                    awards_val: undefined,
                }
            }

            if (record.id && record.awards_info && record.awards_info.length) {
                awards_ids = record.awards_info.map((item) => {
                    return {
                        awards_id: item.awards_id,
                        num: item.num ? Number(item.num) : 1,
                    }
                })
            }
            this.form = {
                ...record,
                awards_ids: awards_ids,
            }
            this.fileList = record.img ? imgUploadFileListHandle([record.img], 'cash_rules_img') : []
            this.visible = true
        },
        // 删除
        del(record) {
            this.$confirm({
                title: this.L('是否确定删除?'),
                centered: true,
                onOk: () => {
                    let param = {
                        id: record.id,
                    }
                    this.request(activityPlatformApi.mahjongCardRulesDel, param).then((res) => {
                        this.$message.success(this.L('操作成功！'))
                        this.getList()
                    })
                },
            })
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
            this.form.img = resultData.fileUrl || ''
            this.fileList = fileList
        },
        handleOk() {
            this.$refs.form.validate((valid, obj) => {
                if (valid) {
                    let params = {
                        ...this.form,
                        event_id: this.$route.query.id,
                    }
                    this.request(activityPlatformApi.mahjongCardRulesSave, params).then((res) => {
                        this.$message.success(this.L('操作成功'), 1, () => {
                            this.handleCancel()
                            this.getList()
                        })
                    })
                } else {
                    if (Object.keys(obj).length) {
                        let errMsg = []
                        for (let k in obj) {
                            if (obj[k] && obj[k].length) {
                                errMsg.push(obj[k])
                            }
                        }
                        if (errMsg.length) {
                            errMsg = errMsg.flat()
                            let msg = errMsg[0].message
                            this.$message.error(msg)
                        }
                    }

                    return false
                }
            })
        },
        handleCancel() {
            this.visible = false
        },
        awardIdsHandle(index = -1) {
            if (index == -1) {
                if((this.form.awards_ids.length == this.awards.length) || (this.form.awards_ids.length > this.awards.length)) return
                this.form.awards_ids.push({
                    awards_id: undefined,
                    num: 1,
                })
            } else {
                this.$delete(this.form.awards_ids, index)
            }
        },
    },
}
</script>

<style scoped></style>
