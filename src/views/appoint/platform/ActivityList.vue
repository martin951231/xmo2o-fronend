<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-row>
            <a-col
                ><a-button type="primary" @click="edit()">{{ L('新建活动') }}</a-button
                ><a-button type="primary" @click="del()" :disabled="!selectedRowKeys.length" class="ml-20">{{
                    L('删除')
                }}</a-button></a-col
            >
        </a-row>
        <a-table
            :columns="columns"
            rowKey="id"
            :data-source="list"
            :pagination="pagination"
            class="mt-20"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onSelect: onSelect, onSelectAll: onSelectAll }"
        >
            <span slot="show_time_type" slot-scope="text, record">
                {{ record.show_time_type == 1 ? L('永久显示') : record.start_show_time + '-' + record.end_show_time }}
            </span>
            <router-link
                slot="decorate"
                slot-scope="text, record"
                :to="{
                    path: '/common/platform.custom/customPage',
                    query: {
                        source_id: record.id,
                        source: 'appoint_activity',
                        template_id: record.template_id,
                        pageId: record.micro_page && record.micro_page.id ? record.micro_page.id : '',
                    },
                }"
                target="_blank"
            >
                {{ L('点击装修') }}
            </router-link>
            <span slot="code" slot-scope="text, record" @click="codeView(record)">
                <a-button type="link">{{ L('点击查看') }}</a-button>
            </span>
            <span slot="action" slot-scope="text, record">
                <span class="cr-primary pointer mr-10" @click="edit(record)">{{ L('编辑') }}</span>
                <span class="cr-primary pointer" @click="del(record)">{{ L('删除') }}</span>
            </span>
        </a-table>

        <a-modal
            :title="title"
            width="50%"
            :bodyStyle="bodyStyle"
            :visible="visible"
            @cancel="handleCancel"
            :destroyOnClose="true"
            @ok="handleOk"
        >
            <a-form-model :model="form" v-bind="formItemLayout" ref="ruleForm">
                <a-form-model-item :label="L('活动名称')">
                    <a-input :placeholder="L('请输入活动名称')" v-model="form.title" allowClear />
                </a-form-model-item>
                <a-form-model-item :label="L('选择日期')">
                    <div class="flex justify-between align-center">
                        <a-range-picker
                            v-model="form.show_time"
                            format="YYYY-MM-DD HH:mm"
                            style="flex: 1; margin-right: 20px"
                            allowClear
                            valueFormat="YYYY-MM-DD HH:mm"
                            :show-time="{ format: 'HH:mm' }"
                            @change="rangePickerChange"
                        />
                        <a-checkbox
                            @change="onShowTimeTypeChange"
                            :disabled="form.show_time.length?true:false"
                            :checked="form.show_time_type == 1 ? true : false"
                            class="text-nowrap"
                        >
                            {{ L('永久') }}
                        </a-checkbox>
                    </div>
                </a-form-model-item>
                <a-form-model-item
                    :label="L('选择模板')"
                    v-if="!form.micro_page || (form.micro_page && !form.micro_page.id)"
                >
                    <div v-for="item in templateList" :key="item.value" class="mb-10 pointer inline-block mr-20">
                        <div
                            style="width: 93.75px; position: relative; height: 140px"
                            class="flex flex-column align-center justify-center"
                            @click="choseTemplate(item)"
                            :class="[{ 'template-active': item.value == form.template_id }]"
                        >
                            <div v-if="item.image" style="width: 100%; height: 100%; overflow: hidden">
                                <BeautifulImage :src="requestDomain + item.image" height="auto"></BeautifulImage>
                            </div>

                            <div
                                v-else
                                style="height: 100%; width: 100%; background-color: #f4f4f4"
                                class="flex-1"
                            ></div>
                        </div>
                        <div class="text-center mt-10">{{ item.label }}</div>
                    </div>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
        <QrcodeModal ref="QrcodeModal"></QrcodeModal>
    </div>
</template>

<script>
/* 监听页面显示隐藏 */
function onPageVisibility(fns) {
    var hiddenProperty =
        'hidden' in document
            ? 'hidden'
            : 'webkitHidden' in document
            ? 'webkitHidden'
            : 'mozHidden' in document
            ? 'mozHidden'
            : null

    var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange')

    var onVisibilityChange = function () {
        if (!document[hiddenProperty]) {
            fns.show && fns.show()
        } else {
            fns.hide && fns.hide()
        }
    }

    document.addEventListener(visibilityChangeEvent, onVisibilityChange)
}
import appointPlatformApi from '@/api/appoint/platform'
import QrcodeModal from '@/components/QrcodeModal/QrcodeModal.vue'
import BeautifulImage from '@/components/BeautifulImage/BeautifulImage.vue'
import moment from 'moment'
export default {
    components: {
        QrcodeModal,
        BeautifulImage,
    },
    data() {
        return {
            list: [],
            columns: [
                {
                    title: this.L('活动名称'),
                    dataIndex: 'title',
                    customCell: () => {
                        return { class: 'text-wrap' }
                    },
                },
                {
                    title: this.L('活动时间'),
                    dataIndex: 'show_time_type',
                    scopedSlots: { customRender: 'show_time_type' },
                    customCell: () => {
                        return { class: 'text-wrap' }
                    },
                },
                {
                    title: this.L('页面装修'),
                    dataIndex: 'decorate',
                    scopedSlots: { customRender: 'decorate' },
                },
                {
                    title: this.L('页面二维码'),
                    dataIndex: 'code',
                    scopedSlots: { customRender: 'code' },
                    align: 'center',
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
            templateList: [
                {
                    label: this.L('无模板'),
                    value: 0,
                },
                {
                    label: this.L('家政服务'),
                    value: 1,
                    image: '/static/wxapp/custompage/template_1.png',
                },
                {
                    label: this.L('按摩足疗'),
                    value: 2,
                    image: '/static/wxapp/custompage/template_2.png',
                },
                {
                    label: this.L('婚纱摄影'),
                    value: 3,
                    image: '/static/wxapp/custompage/template_3.png',
                },
                {
                    label: this.L('美甲美容'),
                    value: 4,
                    image: '/static/wxapp/custompage/template_4.png',
                },
            ],
            selectedRowKeys: [],
            visible: false,
            bodyStyle: {
                maxHeight: document.body.clientHeight - 300 + 'px',
                overflowY: 'auto',
            },
            title: '',
            form: {
                id: '',
                title: '',
                show_time_type: 2,
                show_time: [],
                template_id: 0,
            },
            formItemLayout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 18 },
            },
            requestDomain: location.protocol + '//' + location.host,
        }
    },
    mounted() {
        this.getList()
        onPageVisibility({
            show: () => {
                // 显示
                this.getList()
            },
            hide: function () {
                // 隐藏
            },
        })
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    methods: {
        moment,
        // 列表
        getList(update = false) {
            if (update && this.pagination.current != 1) {
                this.pagination.current = 1
            }
            let params = {
                page: this.pagination.current,
                page_size: this.pagination.pageSize,
            }
            this.request(appointPlatformApi.appointActivityList, params).then((res) => {
                this.list = res.data || []
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
        // 添加 || 编辑
        edit(record = '') {
            if (record) {
                this.form = {
                    ...record,
                    show_time:
                        record.show_time_type == 2 && record.start_show_time && record.end_show_time
                            ? [record.start_show_time, record.end_show_time]
                            : [],
                }
                this.title = this.L('编辑活动')
            } else {
                this.form = {
                    id: '',
                    title: '',
                    show_time_type: 2,
                    show_time: [],
                    template_id: 0,
                }
                this.title = this.L('新建活动')
            }
            this.visible = true
        },
        // 页面查看
        codeView(record) {
            this.$refs.QrcodeModal.showModal(
                true,
                { link_url: record.url, qrcode: record.qrcode },
                3,
                this.L('查看链接'),
                '40%'
            )
        },
        // 删除
        del(record) {
            this.$confirm({
                title: this.L('是否确定删除数据?'),
                centered: true,
                onOk: () => {
                    let param = {
                        ids: record ? [record.id] : this.selectedRowKeys,
                    }
                    this.request(appointPlatformApi.appointDelActivity, param).then((res) => {
                        this.$message.success(this.L('操作成功！'))
                        this.getList()
                        if (this.selectedRowKeys.length) {
                            this.selectedRowKeys = []
                        }
                    })
                },
            })
        },
        onSelect(record, selected, selectedRows, nativeEvent) {
            if (selected) {
                this.selectedRowKeys.push(record.id)
            } else {
                if (this.selectedRowKeys.length) {
                    let index = this.selectedRowKeys.findIndex((item) => item == record.id)
                    index != -1 && this.$delete(this.selectedRowKeys, index)
                }
            }
        },
        onSelectAll(selected, selectedRows, changeRows) {
            let ids = changeRows.map((item) => item.id)
            if (selected) {
                this.selectedRowKeys = this.selectedRowKeys.concat(ids)
            } else {
                this.selectedRowKeys = this.selectedRowKeys.concat(ids).filter((item) => !ids.includes(item))
            }
        },
        onShowTimeTypeChange(e) {
            this.$set(this.form, 'show_time_type', e.target.checked ? 1 : 2)
        },
        choseTemplate(item) {
            if (this.form.template_id == item.value) return
            this.$set(this.form, 'template_id', item.value)
        },
        handleCancel() {
            this.visible = false
        },
        handleOk() {
            let params = {
                id: this.form.id || '',
                title: this.form.title,
                show_time_type: this.form.show_time_type,
                start_show_time: this.form.show_time.length ? this.form.show_time[0] : '',
                end_show_time: this.form.show_time.length ? this.form.show_time[1] : '',
                template_id: this.form.template_id,
            }
            this.request(appointPlatformApi.appointSaveActivityList, params).then((res) => {
                this.handleCancel()
                this.getList()
            })
        },
        rangePickerChange(date, dateString){
            if(dateString.length){
                this.form.show_time_type = 2;
            }
        },
    },
}
</script>

<style scoped>
.template-active::after {
    content: '';
    position: absolute;
    left: -4px;
    top: -4px;
    right: -4px;
    height: 148px;
    border: 2px solid #1890ff;
}
</style>
