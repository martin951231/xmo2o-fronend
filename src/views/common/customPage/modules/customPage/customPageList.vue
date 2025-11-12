<template>
    <!-- 微页面列表 -->
    <div class="bg-ff listPage">
        <a-row type="flex" justify="space-between" class="mt-20 mb-20">
            <a-col>
                <a-button type="primary" icon="plus" @click="addCustomPageOpt()">
                    {{ L('新建微页面') }}
                </a-button>
            </a-col>
            <a-col>
                <a-input v-model="keyword" :placeholder="L('搜索')" @change="inputChange" @pressEnter="inputChange">
                    <a-icon slot="prefix" type="search" />
                </a-input>
            </a-col>
        </a-row>

        <a-table :columns="columns" rowKey="id" :scroll="{ y: 570 }" :pagination="pagination" :data-source="dataList">
            <a
                :href="record.link_url"
                target="_blank"
                class="inline-block flex"
                slot="page_title"
                slot-scope="text, record"
            >
                <span>{{ text }}</span>
                <a-button
                    class="ml-10"
                    v-if="record.is_home_page == 1 && sourceInfo.source != 'platform'"
                    size="small"
                    type="primary"
                    >{{ sourceInfo.source == 'merchant' ? L('商家主页') : L('店铺主页') }}</a-button
                >
            </a>
            <!-- 二维码 -->
            <span slot="qrcode" slot-scope="text, record">
                <a href="javascript:void(0);" @click="viewQrcode(record)">{{ L('查看') }}</a>
            </span>
            <!-- 操作栏 -->
            <span slot="action" slot-scope="text, record">
                <a href="javascript:void(0);" class="inline-block" @click="editOpt(record)">{{ L('编辑') }}</a>
                <a href="javascript:void(0);" class="ml-10 inline-block" @click="removeOpt(record)">{{ L('删除') }}</a>
                <span v-if="sourceInfo.source != 'platform' && sourceInfo.source != 'store'">
                    <span class="ml-10 inline-block color-gray" v-if="record.is_home_page && record.is_home_page == 1">
                        {{ L('已为主页') }}
                    </span>
                    <a href="javascript:void(0);" class="ml-10 inline-block" v-else @click="setHomePageOpt(record)">
                        {{ L('设为主页') }}
                    </a>
                </span>
            </span>
        </a-table>
        <!-- 预览 -->
        <componentPreview
            v-if="componentPreviewVisible && componentPreviewInfo"
            :visible="componentPreviewVisible"
            :componentPreviewInfo="componentPreviewInfo"
            @handleCancel="componentPreviewVisible = false"
        ></componentPreview>
    </div>
</template>

<script>
import customPageApi from '@/api/common/platform/customPage'
import componentPreview from '@/views/common/customPage/modules/common/componentPreview'
// 主页装修
export default {
    components: {
        componentPreview, // 预览
    },
    data() {
        return {
            keyword: '',
            dataList: [],
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
                {
                    title: this.L('浏览数'),
                    dataIndex: 'brows_times',
                    key: 'brows_times',
                },
                {
                    title: this.L('商品数量'),
                    dataIndex: 'goods_nums',
                    key: 'goods_nums',
                },
                {
                    title: this.L('二维码'),
                    dataIndex: 'qrcode',
                    key: 'qrcode',
                    scopedSlots: { customRender: 'qrcode' },
                },
                {
                    title: this.L('操作'),
                    dataIndex: 'id',
                    key: 'id',
                    scopedSlots: { customRender: 'action' },
                    align: 'center',
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
            componentPreviewVisible:false,
            componentPreviewInfo: null,
        }
    },
    computed: {
        sourceInfo() {
            return this.$store.state.customPage.sourceInfo
        },
        refreshCustomPageList() {
            return this.$store.state.customPage.refreshCustomPageList
        },
    },
    watch: {
        refreshCustomPageList: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.$set(this.pagination, 'current', 1)
                    this.$set(this.pagination, 'pageSize', 10)
                    this.keyword = ''
                    this.getCustomPageList()
                }
            },
        },
    },
    mounted() {
        if (!this.refreshCustomPageList) {
            this.getCustomPageList()
        }
    },
    methods: {
        // 获取微页面列表
        getCustomPageList() {
            let params = {
                source: this.sourceInfo.source,
                source_id: this.sourceInfo.source_id,
                keyword: this.keyword.trim(),
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
            }
            this.request(customPageApi.getMicroPageList, params).then((res) => {
                this.dataList = res.list || []
                this.$set(this.pagination, 'total', res.total)
                if (this.pagination.current != 1 && res.total > 0 && !this.dataList.length) {
                    this.$set(this.pagination, 'current', this.pagination.current - 1)
                    this.getCustomPageList()
                }
                this.$store.dispatch('updateCustomPageList', false)
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
        // 搜索
        inputChange() {
            if (this.keyword.trim() === '' && this.keyword != 0) return
            this.$set(this.pagination, 'current', 1)
            this.$set(this.pagination, 'pageSize', 10)
            this.getCustomPageList()
        },
        // 新建
        addCustomPageOpt() {
            this.$router.push({
                path: this.$store.state.customPage[`${this.sourceInfo.source}CustomPage`],
                query: {
                    source: this.sourceInfo.source,
                    source_id: this.sourceInfo.source_id,
                },
            })
        },
        // 编辑
        editOpt(current) {
            this.$router.push({
                path: this.$store.state.customPage[`${this.sourceInfo.source}CustomPage`],
                query: {
                    source: current.source || this.sourceInfo.source,
                    source_id: current.source_id || this.sourceInfo.source_id,
                    pageId: current.id,
                },
            })
        },
        // 删除
        removeOpt(current) {
            this.$confirm({
                title: this.L('是否确定删除该微页面?'),
                centered: true,
                onOk: () => {
                    this.request(customPageApi.delMicroPage, { id: current.id }).then((res) => {
                        this.$message.success(this.L('操作成功！'))
                        this.getCustomPageList()
                    })
                },
            })
        },
        // 设为主页
        setHomePageOpt(current) {
            let params = {
                id: current.id,
                source: current.source || this.sourceInfo.source,
                source_id: current.source_id || this.sourceInfo.source_id,
            }
            this.request(customPageApi.setHomePage, params).then((res) => {
                this.$message.success(this.L('操作成功！'))
                this.getCustomPageList()
            })
        },
        viewQrcode(item){
            this.componentPreviewVisible = true;         
            this.componentPreviewInfo = {link_url:item.link_url,link_code:item.qrcode}
        },
    },
}
</script>

<style scoped>
.listPage {
    padding: 12px 16px;
    box-sizing: border-box;
}
.color-gray {
    color: rgba(173, 173, 173, 1);
}
</style>
