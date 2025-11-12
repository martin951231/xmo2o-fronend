<template>
    <a-modal :title="title" :width="960" :height="860" :visible="visible" @cancel="handelCancle" @ok="handelOK">
        <a-tabs v-model="tabIndex" @change="tabCallback" v-if="!queryParam.cat_id">
            <a-tab-pane key="0" :tab="this.L('店铺活动')"></a-tab-pane>
            <a-tab-pane key="1" :tab="this.L('商品活动')"></a-tab-pane>
        </a-tabs>
        <div class="message-suggestions-list-box">
            <a-button type="primary" icon="plus" @click="$refs.createModal.add(now_cat_id)">新建分类</a-button>
            <div class="mb-20"></div>
            <a-table :columns="columns" :data-source="data" rowKey="custom_id" class="components-table-demo-nested" :pagination="pagination" @change="tableChange">
                <template slot="custom_id" slot-scope="text,record">
                    <a-button class="pcButton" @click="getManage(record)" v-if="queryParam.group_activity_recommendations==0">{{'去管理'}}</a-button>
                    <a-button class="pcButton" @click="addGoods(record)" v-else-if="queryParam.group_activity_recommendations==1">{{'添加商品'}}</a-button>
                </template>
                <span slot="img" slot-scope="text, record">
                    <BeautifulImage width="40px" height="40px" :src="record.img" hover visible viewerStyle="2" radius="4px" v-if="record.img"/>
                </span>
                <span slot="action" slot-scope="text, record">
                    <template>
                        <a @click="$refs.createModal.edit(record.custom_id,record.cat_id)">编辑</a>
                        <a-divider type="vertical" />
                    </template>
                    <a @click="removeCustom(record)">删除</a>
                </span>
            </a-table>
            <create-custom ref="createModal" :group_activity_recommendations="queryParam.group_activity_recommendations" @loaddata="getList" />
        </div>
        <RecommendGoods ref="recommendGoods" :group_activity_recommendations="queryParam.group_activity_recommendations" />
    </a-modal>
</template>
<script>
import GroupPlatformApi from '@/api/group/platform'
import CreateCustom from '@/views/group/modules/CreateCustom'
import RecommendGoods from '@/views/group/modules/RecommendGoods'
import BeautifulImage from '@/components/BeautifulImage/BeautifulImage'
export default {
    name: 'GroupCustomList',
    components: {
        CreateCustom,
        RecommendGoods,
        BeautifulImage,
    },
    data() {
        return {
            visible: false,
            title: '',
            // 查询参数
            queryParam: {
                cat_id: '0',
                group_activity_recommendations: 0, //团购首页的活动推荐类型
            },
            pagination: {
                current: 1,
                pageSize: 10,
                total: 10,
                'show-total': (total) => `共 ${total} 条记录`,
            },
            page: 1,
            data: [],
            now_cat_id: 0,
            // 表头
            columns: [
                {
                    title: '排序',
                    dataIndex: 'sort',
                    width: '8%',
                },
                {
                    title: '推荐标题',
                    dataIndex: 'title',
                    width: '15%',
                },
                {
                    title: '副标题',
                    dataIndex: 'sub_title',
                    width: '15%',
                },
                {
                    title: '团购类型',
                    dataIndex: 'category',
                    width: '15%',
                },
                {
                    title: '店铺管理',
                    dataIndex: 'custom_id',
                    width: '8%',
                    scopedSlots: {
                        customRender: 'custom_id',
                    },
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    width: '10%',
                    scopedSlots: {
                        customRender: 'action',
                    },
                },
            ],
            tabIndex: '0',
        }
    },
    created() {},
    activated() {},
    mounted() {},
    methods: {
        // 获取列表信息
        getList(param) {
            console.log(param)
            this.visible = true
            this.title = param.title
            this.queryParam['page'] = this.pagination.current
            this.queryParam['pageSize'] = this.pagination.pageSize
            this.queryParam['cat_id'] = param.cat_id
            this.now_cat_id = param.cat_id
            this.columns.map((item) => {
                if (item.dataIndex == 'custom_id') {
                    if (param.cat_id == 0 && this.queryParam.group_activity_recommendations == 0) {
                        item.title = '店铺管理'
                    } else {
                        item.title = '置顶商品'
                    }
                }
                return item
            })

            this.request(GroupPlatformApi.getRenovationCustomList, this.queryParam).then((res) => {
                this.data = res.list
                this.pagination.total = res.count
            })
        },
        // 表格中变动  这里只针对页面页数切换
        tableChange(e) {
            // 分页
            this.pagination.current = e.current
            this.pagination.pageSize = e.pageSize
            this.getList({ cat_id: this.now_cat_id, page: this.page })
        },
        // 删除分类
        removeCustom(record) {
            this.$confirm({
                title: `是否确定删除该${
                    this.queryParam.group_activity_recommendations == 1 ? '商品' : '店铺'
                }活动推荐分类吗?`,
                centered: true,
                onOk: () => {
                    this.request(GroupPlatformApi.delRenovationCustom, {
                        custom_id: record.custom_id,
                        cat_id: record.cat_id,
                        group_activity_recommendations: this.queryParam.group_activity_recommendations,
                    }).then((res) => {
                        this.$message.success('操作成功！')
                        this.getList({ cat_id: this.now_cat_id, page: this.page })
                    })
                },
                onCancel() {},
            })
        },
        // 去管理店铺
        getManage(record) {
            if (record.cat_id == 0) {
                // 店铺管理
                this.$router.push({
                    path: '/group/platform.groupRenovationCustomStore/index',
                    query: { custom_id: record.custom_id },
                })
            } else {
                // 商品管理
                this.$router.push({
                    path: '/group/platform.groupRenovationCustomGroup/index',
                    query: { custom_id: record.custom_id },
                })
            }
            this.visible = false
        },
        handelCancle() {
            this.visible = false
        },
        handelOK() {
            this.visible = false
        },
        tabCallback(e,flag=false) {
            this.queryParam.group_activity_recommendations = e
            this.pagination.current = 1
            this.page = 1
            if (this.queryParam.group_activity_recommendations == 1) {
                this.columns = this.columns.filter((v) => v.dataIndex != 'sub_title')
                this.columns.findIndex((v) => v.dataIndex == 'img') == -1 &&
                    this.columns.splice(2, 0, {
                        title: '图标',
                        dataIndex: 'img',
                        width: '15%',
                        scopedSlots: {
                            customRender: 'img',
                        },
                    })
            } else {
                this.columns = this.columns.filter((v) => v.dataIndex != 'img')
                this.columns.findIndex((v) => v.dataIndex == 'sub_title') == -1 && this.columns.splice(2, 0, {
                    title: '副标题',
                    dataIndex: 'sub_title',
                    width: '15%',
                })
            }
            if(flag)return
            this.getList({ cat_id: this.queryParam.cat_id, title: this.title })
        },
        //添加推荐商品
        addGoods(item) {
            this.$refs.recommendGoods.queryParam.sort_id = item.type
            this.$refs.recommendGoods.custom_id = item.custom_id
            this.$refs.recommendGoods.open()
        },
    },
}
</script>
<style scoped lang="less">
.pcButton {
    color: #1890ff;
    border: 1px dashed #ccc;
    // display: block;
}
</style>