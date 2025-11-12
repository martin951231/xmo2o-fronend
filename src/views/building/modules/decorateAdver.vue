<template>
    <a-modal :title="title" width="60%" :visible="visible" @cancel="handelCancle" @ok="handleOk" :footer="null">
        <a-button type="primary" @click="getOrEdit('', false)">新建</a-button>
        <a-table class="mt-10" 
        :columns="columns" 
        rowKey="id" 
        :data-source="list" 
        @change="changePage"
        :pagination="pagination"
        :scroll="{ y: 8 * 64 }">
            <span slot="pic" slot-scope="text, record">
                <img width="70px" height="30px" style="object-fit:contain;" :src="record.pic" />
            </span>
            <span slot="focus_pic" slot-scope="text, record">
                <img width="70px" height="30px" style="object-fit:contain;" :src="record.focus_pic" />
            </span>
            <span slot="status" slot-scope="text, record">
                <a-badge v-if="text == 0" status="error" text="关闭" />
                <a-badge v-if="text == 1" status="success" text="开启" />
            </span>
            <span slot="action" slot-scope="text, record">
                <a @click="getOrEdit(record.id, true)">查看</a>
                <a-divider type="vertical" />
                <a @click="getOrEdit(record.id, false)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm title="确认删除？" ok-text="确定" cancel-text="取消" @confirm="delOne(record.id)">
                    <a>删除</a>
                </a-popconfirm>
            </span>
        </a-table>
        <decorate-adver-edit ref="adverEditModel" @update="getList"></decorate-adver-edit>
    </a-modal>
</template>

<script>
import DecorateAdverEdit from './decorateAdverEdit'
import buildingPlatformApi from '@/api/building/index'



const columns = [
    {
        title: '排序',
        dataIndex: 'sort',
        width: 60,
    },
    {
        title: '名称',
        dataIndex: 'name',
    },
    {
        title: '图片',
        dataIndex: 'pic',
        scopedSlots: { customRender: 'pic' },
        align: 'center'
    },
    {
        title: '状态',
        dataIndex: 'status',
        scopedSlots: { customRender: 'status' },
    },
    {
        title: '操作时间',
        dataIndex: 'last_time',
    },
    {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' },
    },
]

const footer_navigate_columns = [
    {
        title: '排序',
        dataIndex: 'sort',
        width: 60,
    },
    {
        title: '名称',
        dataIndex: 'name',
    },
    {
        title: '未选中图',
        dataIndex: 'pic',
        scopedSlots: { customRender: 'pic' },
        align: 'center'
    },
    {
        title: '选中图',
        dataIndex: 'focus_pic',
        scopedSlots: { customRender: 'focus_pic' },
        align: 'center'
    },
    {
        title: '状态',
        dataIndex: 'status',
        scopedSlots: { customRender: 'status' },
    },
    {
        title: '操作时间',
        dataIndex: 'last_time',
    },
    {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' },
    },
]

const adver_columns = [
    {
        title: '排序',
        dataIndex: 'sort',
        width: 60,
    },
    {
        title: '名称',
        dataIndex: 'name',
    },
    {
        title: '图片',
        dataIndex: 'pic',
        scopedSlots: { customRender: 'pic' },
        align: 'center'
    },
    {
        title: '推荐方式',
        dataIndex: 'recommend_type_text',
        scopedSlots: { customRender: 'recommend_type_text'}, 
    },
    {
        title: '状态',
        dataIndex: 'status',
        scopedSlots: { customRender: 'status' },
    },
    {
        title: '操作时间',
        dataIndex: 'last_time',
    },
    {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' },
    },
]
export default {
    name: 'decorateAdver',
    components: { DecorateAdverEdit },
    data() {
        return {
            mall_id: 0,
            visible: false,
            title: '',
            cat_key: '',
            columns,
            list: [],

            pagination: {
                pageSize: 10,
                total: 0,
                current: 1,
                page: 1,
            },
            queryParams: {
                page_size: 0,
                page: 1,
            },
        }
    },
    methods: {
        showModal(cat_key, titles ,mall_id) {
            this.cat_key = cat_key
            this.title = titles
            this.mall_id = mall_id
            
            if (cat_key == 'footer_navigate') {
                this.columns = footer_navigate_columns;
            } else if (cat_key == 'adver') {
                this.columns = adver_columns;
            } else {
                this.columns = columns;
            }
            this.visible = true
            this.getList()
        },
        getList() {
            this.queryParams.page_size = this.pagination.pageSize
            this.queryParams.page = this.pagination.current
            this.queryParams.mall_id = this.mall_id
            this.queryParams.cat_key = this.cat_key
            this.request(buildingPlatformApi.getAdverLists, this.queryParams).then((res) => {
                this.list = res.data
            })
        },
        handelCancle() {
            this.visible = false
        },
        getOrEdit(id, disabled) {
            this.$refs.adverEditModel.editOne(id, disabled, this.cat_key,this.mall_id)
        },
        delOne(id) {
            this.request(buildingPlatformApi.delAdver, { id: id }).then((res) => {
                this.getList()
            })
        },
        handleOk(e) {
            this.visible = false
        },

        // 切换表格分页
        changePage(page, pageSize) {
            this.pagination.current = page.current
            this.getLists()
        },
    },
}
</script>
