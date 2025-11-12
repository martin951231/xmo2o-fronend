<template>
    <a-modal
        :title="L('微页面')"
        :visible="visible"
        :destroyOnClose="true"
        :width="'60%'"
        :cancelText="L('取消')"
        :okText="L('确定')"
        @ok="handleOk"
        @cancel="handleCancel"
    >
        <a-row type="flex" justify="space-between" class="mb-20">
            <a-col>
                <a-button class="mr-20" @click="addCustomPageOpt()"> {{ L('新建') }}</a-button>
                <a-button @click="refreshOpt()"> {{ L('刷新') }}</a-button>
            </a-col>
        </a-row>
        <!--   -->
        <a-table
            :row-selection="{
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange,
                type: 'radio',
            }"
            :columns="columns"
            rowKey="id"
            :scroll="{ y: 442 }"
            :customRow="customRow"
            :pagination="pagination"
            :data-source="dataList"
        >
            <a slot="page_title" slot-scope="text, record" href="javascript:void(0);" @click.stop="previewOpt(record)">
                {{ text }}
            </a>
        </a-table>
    </a-modal>
</template>

<script>
import customPageApi from '@/api/common/platform/customPage'
// 主页装修
export default {
    props: {
        // 是否为自定义模块选择页面
        isCustomModule: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            visible: false,
            dataList: [],
            selectedRowKeys: [],
            columns: [
                {
                    title: this.L('标题'),
                    dataIndex: 'page_title',
                    key: 'page_title',
                    scopedSlots: { customRender: 'page_title' },
                },
                {
                    title: this.L('创建时间'),
                    dataIndex: 'create_time',
                    key: 'create_time',
                },
            ],
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                'show-total': (total) => (total ? this.L(`共 X1 条记录`, { X1: total }) : false),
                'show-size-changer': true,
                'show-quick-jumper': true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
            },
            pageId: '',
            sourceInfo: '',
        }
    },
    computed: {
        current() {
            let customPageInfo = ''
            if (this.dataList.length && this.selectedRowKeys.length) {
                customPageInfo =
                    this.dataList.filter((item) => {
                        if (item.id == this.selectedRowKeys[0]) {
                            return item
                        }
                    })[0] || ''
            }
            return customPageInfo
        },
    },
    methods: {
        // 打开modal
        openModal(res) {
            this.pageId = res.id || ''
            if (this.pageId) {
                this.selectedRowKeys = [this.pageId]
            }
            this.sourceInfo = res.sourceInfo || ''
            this.visible = true
            this.getCustomPageList()
        },
        // 获取微页面列表
        getCustomPageList() {
            let params = {
                source: this.sourceInfo.source,
                source_id: this.sourceInfo.source_id,
                keyword: '',
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
            }
            this.request(customPageApi.getMicroPageList, params).then((res) => {
                this.dataList = res.list || []
                if (!this.selectedRowKeys.length && this.dataList.length) {
                    this.selectedRowKeys = this.dataList[0].id ? [this.dataList[0].id] : []
                }
                this.$set(this.pagination, 'total', res.total)
            })
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.getCustomPageList()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'current', 1)
            this.$set(this.pagination, 'pageSize', pageSize)
            this.getCustomPageList()
        },
        // 单选
        onSelectChange(selectedRowKeys) {
            console.log(selectedRowKeys, 'selectedRowKeys')
            this.selectedRowKeys = selectedRowKeys
        },
        // 表格行点击
        customRow(record, index) {
            return {
                on: {
                    click: (e) => {
                        this.selectedRowKeys = [record.id]
                    },
                },
            }
        },
        // 确定
        handleOk() {
            if (this.isCustomModule) {
                this.handleCancel()
                this.$emit('getIndexPageOpt', { current: this.current })
                return
            }
            let params = {
                id: this.selectedRowKeys[0],
                source: this.sourceInfo.source,
                source_id: this.sourceInfo.source_id,
            }
            this.request(customPageApi.setHomePage, params).then((res) => {
                this.handleCancel()
            })
        },
        // 取消
        handleCancel() {
            this.visible = false
            this.$set(this.pagination, 'current', 1)
            this.$set(this.pagination, 'pageSize', 10)
        },
        // 刷新
        refreshOpt() {
            this.$set(this.pagination, 'current', 1)
            this.$set(this.pagination, 'pageSize', 10)
            this.getCustomPageList()
        },
        // 新建 打开新窗口
        addCustomPageOpt() {
            let path = this.$store.state.customPage[`${this.sourceInfo.source}CustomPage`]
            let routeData = this.$router.resolve({
                path: path,
                query: {
                    source: this.sourceInfo.source,
                    source_id: this.sourceInfo.source_id,
                },
            })
            window.open(routeData.href, '_blank')
        },
        // 预览
        previewOpt(record) {
            let link_url = record.link_url || ''
            if (link_url) {
                window.open(link_url)
            }
        },
    },
}
</script>

<style scoped>
.listPage {
    padding: 12px 16px;
    box-sizing: border-box;
}
</style>
