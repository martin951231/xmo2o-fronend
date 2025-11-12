<template>
    <a-modal
        :title="title"
        width="70%"
        :bodyStyle="bodyStyle"
        :visible="visible"
        @cancel="handleCancel"
        :destroyOnClose="true"
        @ok="handleOk"
    >
        <a-form-model :model="form" v-bind="formItemLayout" ref="ruleForm">
            <a-form-model-item :label="L('标题')" required>
                <a-input :placeholder="L('请输入标题')" v-model="form.title" allowClear />
            </a-form-model-item>
            <a-form-model-item :label="L('摘要')">
                <a-input
                    type="textarea"
                    :placeholder="L('请输入')"
                    v-model="form.remark"
                    allowClear
                    :autoSize="{ minRows: 3, maxRows: 8 }"
                />
            </a-form-model-item>
            <a-form-model-item :label="L('关联预约商品')">
                <a-button type="primary" @click="goodsModalShow()">{{ L('添加') }}</a-button>
                <a-table
                    :columns="columns"
                    :data-source="form.goods_list"
                    rowKey="appoint_id"
                    class="mt-20"
                    v-show="form.goods_list.length"
                >
                    <span slot="sort" slot-scope="text, record">
                        <a-input-number :min="0" v-model="record.sort"></a-input-number>
                    </span>
                    <span slot="action" slot-scope="text, record">
                        <a-popconfirm
                            :title="L('确认删除？')"
                            :ok-text="L('确定')"
                            :cancel-text="L('取消')"
                            @confirm="delGoods(record)"
                        >
                            <a-button type="link">{{ L('删除') }}</a-button>
                        </a-popconfirm>
                    </span>
                </a-table>
            </a-form-model-item>
            <a-form-model-item :label="L('显示时长')" required>
                <a-select v-model="form.show_time_type">
                    <a-select-option :value="1"> {{ L('永久显示') }} </a-select-option>
                    <a-select-option :value="2"> {{ L('自定义') }} </a-select-option>
                </a-select>
                <a-range-picker
                    v-show="form.show_time_type == 2"
                    v-model="form.show_time"
                    format="YYYY-MM-DD HH:mm"
                    :disabled-date="disabledDate"
                    style="width: 100%"
                    class="mt-20"
                    allowClear
                    valueFormat="YYYY-MM-DD HH:mm"
                    :show-time="{ format: 'HH:mm' }"
                />
            </a-form-model-item>
            <a-form-model-item :label="L('内容')">
                <rich-text :info.sync="form.content" />
            </a-form-model-item>
        </a-form-model>

        <a-modal
            :title="L('选择预约推荐')"
            width="70%"
            :bodyStyle="bodyStyle"
            :visible="goodsVisible"
            @cancel="goodsModalCancel"
            @ok="goodsModalOk"
            :destroyOnClose="true"
        >
            <div class="flex align-center">
                <div class="flex align-center mr-20">
                    <span class="mr-10">{{ '标题' }}:</span>
                    <a-input :placeholder="L('请输入')" v-model="keyword" :allowClear="true" style="width: 300px" />
                </div>
                <a-button type="primary" @click="getGoodsList(true)">{{ L('搜索') }}</a-button>
            </div>
            <a-table
                :columns="columnsGoods"
                :data-source="goodsList"
                :row-selection="{ selectedRowKeys: selectedRowKeys, onSelect: onSelect, onSelectAll: onSelectAll }"
                class="mt-20"
                bordered
                :pagination="paginationGoods"
                rowKey="appoint_id"
            >
            </a-table>
        </a-modal>
    </a-modal>
</template>

<script>
import appointPlatformApi from '@/api/appoint/platform'
import moment from 'moment'
import RichText from '@/components/RichText/RichText'
export default {
    components: { RichText },
    data() {
        return {
            visible: false,
            bodyStyle: {
                maxHeight: document.body.clientHeight - 300 + 'px',
                overflowY: 'auto',
            },
            title: '',
            columns: [
                {
                    title: this.L('名称'),
                    dataIndex: 'appoint_name',
                    customCell: () => {
                        return { class: 'text-wrap' }
                    },
                },
                {
                    title: this.L('商家名称'),
                    dataIndex: 'merchant_name',
                    customCell: () => {
                        return { class: 'text-wrap' }
                    },
                },
                {
                    title: this.L('价格'),
                    dataIndex: 'appoint_price',
                },
                {
                    title: this.L('排序'),
                    dataIndex: 'sort',
                    width: 60,
                    scopedSlots: { customRender: 'sort' },
                },
                {
                    title: this.L('操作'),
                    key: 'action',
                    scopedSlots: { customRender: 'action' },
                    align: 'center',
                },
            ],
            form: {
                id: '',
                title: '',
                remark: '',
                goods_list: [],
                show_time_type: 1,
                show_time: [],
                content: '',
                status: 0,
            },
            formItemLayout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 18 },
            },
            goodsVisible: false,
            keyword: '',
            selectedRowKeys: [],
            columnsGoods: [
                {
                    title: this.L('名称'),
                    dataIndex: 'appoint_name',
                    customCell: () => {
                        return { class: 'text-wrap' }
                    },
                },
                {
                    title: this.L('商家名称'),
                    dataIndex: 'merchant_name',
                    customCell: () => {
                        return { class: 'text-wrap' }
                    },
                },
            ],
            goodsList: [],
            paginationGoods: {
                pageSize: 10,
                total: 0,
                current: 1,
                onChange: this.onPageChangeGoods,
                onShowSizeChange: this.onPageSizeChangeGoods,
                showTotal: (total) => this.L('共 X1 条记录', { X1: total }),
                showSizeChanger: true,
            },
            selectedGoodsList: [],
        }
    },
    methods: {
        moment,
        disabledDate(current) {
            return current < moment().subtract(1, 'days')
        },
        showModal(record = '') {
            this.title = record ? this.L('编辑快报') : this.L('添加快报')
            this.visible = true
            if (record) {
                this.getDetail(record)
            }
        },
        getDetail(record) {
            this.request(appointPlatformApi.newsDetail, { newsflash_id: record.id }).then((res) => {
                this.form = {
                    ...record,
                    show_time_type: Number(record.show_time_type) || 1,
                    show_time: record.show_time_type == 2 ? [record.start_show_time, record.end_show_time] : [],
                    goods_list: res.appoint_json && res.appoint_json.length ? res.appoint_json : [],
                }
            })
        },
        handleCancel() {
            this.visible = false
            this.form = {
                id: '',
                title: '',
                remark: '',
                goods_list: [],
                show_time_type: 1,
                show_time: [],
                content: '',
                status: 0,
            }
        },
        handleOk() {
            if (!this.form.title.trim()) {
                this.$message.error(this.L('请输入资讯名称'))
                return
            }
            if (this.form.show_time_type == 2 && !this.form.show_time.length) {
                this.$message.error(this.L('请选择显示日期'))
                return
            }
            let appoint_json = this.form.goods_list.length
                ? this.form.goods_list.map((item) => {
                      return {
                          appoint_id: item.appoint_id,
                          sort: item.sort,
                      }
                  })
                : []
            let params = {
                id: this.form.id || '',
                title: this.form.title,
                content: this.form.content,
                show_time_type: this.form.show_time_type,
                remark: this.form.remark,
                status: this.form.status,
                start_show_time: this.form.show_time_type == 2 ? this.form.show_time[0] : '',
                end_show_time: this.form.show_time_type == 2 ? this.form.show_time[1] : '',
                appoint_json,
            }
            this.request(appointPlatformApi.saveNews, params).then((res) => {
                this.$message.success(this.L('操作成功'))
                this.$emit('update')
                this.handleCancel()
            })
        },
        // 添加
        goodsModalShow() {
            this.getGoodsList()
            this.goodsVisible = true
            this.selectedGoodsList = this.form.goods_list.length ? JSON.parse(JSON.stringify(this.form.goods_list)) : []
            this.selectedRowKeys = this.selectedGoodsList.length
                ? this.selectedGoodsList.map((item) => item.appoint_id)
                : []
        },
        getGoodsList(update = false) {
            if (update && this.paginationGoods.current != 1) {
                this.paginationGoods.current = 1
            }
            let params = {
                page: this.paginationGoods.current,
                page_size: this.paginationGoods.pageSize,
                appoint_name: this.keyword,
            }
            this.request(appointPlatformApi.appointListInformation, params).then((res) => {
                this.paginationGoods.total = res.total
                this.goodsList = res.data
            })
        },
        // 预约商品删除
        delGoods(record) {
            let index = this.form.goods_list.findIndex((item) => item.appoint_id == record.appoint_id)
            if (index != -1) {
                this.$delete(this.form.goods_list, index)
            }
        },
        // 页码变化
        onPageChangeGoods(page, pageSize) {
            this.paginationGoods.current = page
            this.getGoodsList()
        },
        onPageSizeChangeGoods(page, pageSize) {
            this.paginationGoods.pageSize = pageSize
            this.getGoodsList()
        },
        onSelect(record, selected, selectedRows, nativeEvent) {
            if (selected) {
                this.selectedRowKeys.push(record.appoint_id)
                this.selectedGoodsList.push(record)
            } else {
                if (this.selectedRowKeys.length) {
                    let index = this.selectedRowKeys.findIndex((item) => item == record.appoint_id)
                    index != -1 && this.$delete(this.selectedRowKeys, index)
                    index != -1 && this.$delete(this.selectedGoodsList, index)
                }
            }
        },
        onSelectAll(selected, selectedRows, changeRows) {
            let ids = changeRows.map((item) => item.appoint_id)
            if (selected) {
                this.selectedRowKeys = this.selectedRowKeys.concat(ids)
                this.selectedGoodsList = this.selectedGoodsList.concat(changeRows)
            } else {
                this.selectedRowKeys = this.selectedRowKeys.concat(ids).filter((item) => !ids.includes(item))
                this.selectedGoodsList = this.selectedGoodsList
                    .concat(changeRows)
                    .filter((item) => !ids.includes(item.appoint_id))
            }
        },
        goodsModalCancel() {
            this.goodsVisible = false
            this.keyword = ''
            this.selectedRowKeys = []
            this.paginationGoods.current = 1
            this.paginationGoods.pageSize = 10
            this.selectedGoodsList = []
        },
        goodsModalOk() {
            this.$set(this.form, 'goods_list', this.selectedGoodsList)
            this.goodsModalCancel()
        },
    },
}
</script>
