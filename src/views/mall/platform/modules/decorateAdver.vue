<template>
    <a-modal :title="title" width="60%" :visible="visible" @cancel="handelCancle" @ok="handleOk" :footer="null">
        <a-button type="primary" @click="getOrEdit('', false)">新建</a-button>
        <a-table class="mt-10" :columns="columns" rowKey="id" :data-source="list" :scroll="{ y: 8 * 64 }">
            <span slot="pic" slot-scope="text, record">
                <img width="70px" height="30px" style="object-fit:contain;" :src="record.pic" />
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
import mallPlatformApi from '@/api/mall/platform'
import DecorateAdverEdit from '@/views/mall/platform/modules/decorateAdverEdit'

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
        title: '浏览量',
        dataIndex: 'click_number',
        width: 80,
    },
    {
        title: '城市',
        dataIndex: 'area_name',
        width: 100,
    },
    {
        title: '图片',
        dataIndex: 'pic',
        scopedSlots: { customRender: 'pic' },
        width: 120,
        align: 'center'
    },
    {
        title: '操作时间',
        dataIndex: 'last_time',
    },
    {
        title: '状态',
        dataIndex: 'status',
        width: 120,
        scopedSlots: { customRender: 'status' },
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
            visible: false,
            title: '',
            cat_key: '',
            columns,
            list: [],
        }
    },
    methods: {
        showModal(cat_key, titles) {
            this.visible = true
            this.cat_key = cat_key
            this.title = titles
            this.getList()
        },
        getList() {
            this.request(mallPlatformApi.getList, { cat_key: this.cat_key }).then((res) => {
                this.cat_key = res.now_category.cat_key
                this.list = res.adver_list
            })
        },
        handelCancle() {
            this.visible = false
        },
        getOrEdit(id, disabled) {
            this.$refs.adverEditModel.editOne(id, disabled, this.cat_key)
        },
        delOne(id) {
            this.request(mallPlatformApi.getDel, { id: id }).then((res) => {
                this.getList()
            })
        },
        handleOk(e) {
            this.visible = false
        },
    },
}
</script>
