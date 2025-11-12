<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-row>
            <a-col
                >{{ L('筛选') }}&nbsp;<a-input-search
                    :placeholder="L('请输入标题关键词')"
                    style="width: 400px"
                    @search="onSearch"
                    class="mr-20"
                    :enterButton="true"
                    allowClear
                    v-model="keyword"
                /><a-button type="primary" @click="edit()">{{ L('添加快报') }}</a-button></a-col
            >
        </a-row>
        <a-table :columns="columns" rowKey="id" :data-source="list" :pagination="pagination" class="mt-20">
            <span slot="show_time_type" slot-scope="text, record">
                {{ record.show_time_type == 1 ? L('永久显示') : record.start_show_time + "至" + record.end_show_time }}
            </span>
            <span slot="status" slot-scope="text, record">
                <a-switch
                    :checked-children="L('开')"
                    :un-checked-children="L('关')"
                    :checked="record.status == 1 ? true : false"
                    @change="onSwitchChange($event, record)"
                />
            </span>
            <span slot="action" slot-scope="text, record">
                <span class="cr-primary pointer mr-10" @click="edit(record)">{{ L('编辑') }}</span>
                <span class="cr-primary pointer" @click="del(record)">{{ L('删除') }}</span>
            </span>
        </a-table>

        <informationEdit ref="informationEdit" @update="getList(true)"></informationEdit>
    </div>
</template>

<script>
import appointPlatformApi from '@/api/appoint/platform'
import informationEdit from './modules/informationEdit.vue'
export default {
    components: {
        informationEdit,
    },
    data() {
        return {
            list: [],
            columns: [
                {
                    title: this.L('编号'),
                    dataIndex: 'id',
                    width:30,
                },
                {
                    title: this.L('标题'),
                    dataIndex: 'title',
                    width:150,
                    customCell: () => {
                        return { class: 'text-wrap' }
                    },
                },
                {
                    title: this.L('摘要'),
                    dataIndex: 'remark',
                    width:400,
                    customCell: () => {
                        return { class: 'text-wrap' }
                    },
                },
                {
                    title: this.L('显示时间'),
                    dataIndex: 'show_time_type',
                    width:120,
                    scopedSlots: { customRender: 'show_time_type' },
                    customCell: () => {
                        return { class: 'text-wrap' }
                    },
                },
                {
                    title: this.L('首页展示'),
                    dataIndex: 'status',
                    width:60,
                    scopedSlots: { customRender: 'status' },
                },
                {
                    title: this.L('浏览量'),
                    width:60,
                    dataIndex: 'views',
                },
                {
                    title: this.L('添加时间'),
                    width:100,
                    dataIndex: 'create_time',
                },
                {
                    title: this.L('操作'),
                    width:100,
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
            keyword: '',
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
        // 搜索
        onSearch(value) {
            this.keyword = value
            this.getList(true)
        },
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
            this.request(appointPlatformApi.newsList, params).then((res) => {
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
        // 是否上首页
        onSwitchChange(e, record) {
            this.request(appointPlatformApi.newsDetail, { newsflash_id: record.id }).then((res) => {
                let params = {
                    id: record.id,
                    status: e ? 1 : 0,
                    title: record.title,
                    remark: record.remark,
                    content: record.content,
                    show_time_type: record.show_time_type,
                    start_show_time: record.start_show_time,
                    end_show_time: record.end_show_time,
                    appoint_json:
                        res.appoint_json && res.appoint_json.length
                            ? res.appoint_json.map((item) => {
                                  return {
                                      appoint_id: item.appoint_id,
                                      sort: item.sort,
                                  }
                              })
                            : [],
                }
                this.request(appointPlatformApi.saveNews, params).then((res) => {
                    this.$message.success(this.L('操作成功！'))
                    this.getList()
                })
            })
        },
        // 添加 || 编辑
        edit(record = '') {
            this.$refs.informationEdit && this.$refs.informationEdit.showModal(record)
        },
        // 删除
        del(record) {
            this.$confirm({
                title: this.L('是否确定删除该条数据?'),
                centered: true,
                onOk: () => {
                    let param = {
                        newsflash_id: record.id,
                    }
                    this.request(appointPlatformApi.delNews, param).then((res) => {
                        this.$message.success(this.L('操作成功！'))
                        this.getList()
                    })
                },
            })
        },
    },
}
</script>
