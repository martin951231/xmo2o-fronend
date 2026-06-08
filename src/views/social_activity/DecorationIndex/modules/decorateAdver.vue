<template>
    <a-modal :title="title" width="60%" :visible="visible" @cancel="handelCancle" @ok="handleOk" :footer="null">
        <a-button type="primary" @click="getOrEdit('', false)">新建</a-button>
        <a-table class="mt-10" :columns="columns" rowKey="id" :data-source="list" :scroll="{ y: 8 * 64 }">
            <span slot="pic" slot-scope="text, record">
                <img width="70px" height="30px" style="object-fit:contain;" :src="record.pic" />
            </span>
            <span slot="select_pic" slot-scope="text, record">
                <img width="70px" height="30px" style="object-fit:contain;" :src="record.select_pic" />
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
import socialActivityApi from '@/api/social_activity/index'
import DecorateAdverEdit from '@/views/social_activity/DecorationIndex/modules/decorateAdverEdit'

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
            this.list = []
            if (cat_key == 'footer_menu_list') {
                // 找到pic列并修改标题，然后在其后添加select_pic列
                const picIndex = columns.findIndex(item => item.dataIndex === 'pic')
                if (picIndex !== -1) {
                    this.columns = [...columns]
                    this.columns[picIndex] = {
                        ...this.columns[picIndex],
                        title: '未选中图标'
                    }
                    this.columns.splice(picIndex + 1, 0, {
                        title: '选中图标',
                        dataIndex: 'select_pic',
                        scopedSlots: { customRender: 'select_pic' },
                        width: 120,
                        align: 'center'
                    })
                }
            } else {
                this.columns = columns.filter(item => item.dataIndex != 'select_pic')
            }
            this.visible = true
            this.cat_key = cat_key
            this.title = titles
            this.getList()
        },
        getList() {
            this.request(socialActivityApi.getDecorationAdverList, { cat_key: this.cat_key }).then((res) => {
                this.cat_key = res.cat_key
                this.list = res.data || []
            })
        },
        handelCancle() {
            this.visible = false
        },
        getOrEdit(id, disabled) {
            this.$refs.adverEditModel.editOne(id, disabled, this.cat_key)
        },
        delOne(id) {
            this.request(socialActivityApi.deleteDecorationAdver, { id: id }).then((res) => {
                this.getList()
            })
        },
        handleOk(e) {
            this.visible = false
        },
    },
}
</script>
