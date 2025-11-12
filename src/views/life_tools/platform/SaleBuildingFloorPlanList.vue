<template>
    <div style="margin-top: 20px;padding:20px;background-color: #fff;">
        <a-tabs default-active-key="loans">
            <a-tab-pane key="loans" tab="楼盘列表">
            </a-tab-pane>
        </a-tabs>
        <a-form-model layout="inline">
            <a-form-model-item>
                <a-button type="primary" @click="addBuild()">新建户型</a-button>
            </a-form-model-item>
        </a-form-model><br>
        <a-table rowKey="pigcms_id" :columns="columns" :data-source="datalist" :pagination="pagination" bordered>
            <template slot="image" slot-scope="text">
                <img alt="example" style="width: 80px;height:80px;" :src="text" />
            </template>

            <template slot="action" slot-scope="text, record">
                <a-button type="link" @click="editBuild(record.pigcms_id)">编辑</a-button>
                <a-button type="link" @click="delBuild(record.pigcms_id )">删除</a-button>
            </template>
        </a-table>
    </div>
</template>

<script>
    import lifePlatformApi from '@/api/life_tools/platform/index'
    const columns = [
        {
            title: '户型名称',
            dataIndex: 'title',
            scopedSlots: { customRender: 'title' },
            width:200,
            align:'center',
        },
        {
            title: '户型图片',
            dataIndex: 'image',
            scopedSlots: { customRender: 'image' },
            width:200,
            align:'center',
        },
        {
            title: '户型面积',
            dataIndex: 'acreage',
            scopedSlots: { customRender: 'acreage' },
            width:200,
            align:'center',
        },
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
            width:200,
            align:'center',
        }
    ];
    export default {
        name: "SaleBuildingFloorPlanList",
        data() {
            return {
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                datalist: [],
                houses_id:0,
                columns,
                goodsList: [],
                pagination: {
                    current: 1,
                    total: 0,
                    pageSize: 10,
                    showSizeChanger: true,
                    onChange: this.onPageChange,
                    onShowSizeChange: this.onPageSizeChange,
                    showTotal: (total) => `共 ${total} 条记录`,
                },
            };
        },
        watch: {
            $route: {
                handler() {
                    this.houses_id = this.$route.query.houses_id
                    this.getDataList(false)
                },
                deep: true,
            },
        },
        created() {
            this.houses_id = this.$route.query.houses_id
            this.getDataList(false)
        },
        methods: {
            editBuildPic(id){
                this.$router.push({path: '/life_tools/platform.LifeTools/saleBuildingFloorPlanList', query: {houses_id: id}})
            },
            addBuild(){
                this.$router.push({path: '/life_tools/platform.LifeTools/saleBuildingFloorPlanEdit', query: {houses_id: this.houses_id,pigcms_id: 0}})
            },
            editBuild(pigcms_id){
                this.$router.push({path: '/life_tools/platform.LifeTools/saleBuildingFloorPlanEdit', query: {pigcms_id: pigcms_id,houses_id: this.houses_id}})
            },
            delBuild(pigcms_id){
                this.$confirm({
                    title: '是否确定删除?',
                    centered: true,
                    onOk: () => {
                        this.request(lifePlatformApi.updateHousesFloorPlanStatus, {pigcms_id:pigcms_id,is_del:1}).then((res) => {
                            this.getDataList(false)
                        })
                    },
                    onCancel() {},
                })
            },
            // 获取table数据
            getDataList(is_search) {
                let params = {}
                if (is_search === true) {
                    params.page = 1
                    this.$set(this.pagination, 'current', 1)
                } else {
                    params.page = this.pagination.current
                    this.$set(this.pagination, 'current', this.pagination.current)
                }
                params.pageSize = this.pagination.pageSize
                params.houses_id=this.houses_id
                this.request(lifePlatformApi.getChildList, params).then((res) => {
                    this.datalist = res.list
                })
            },
            // 提交搜索表单
            submitForm(is_search = false) {
                this.getDataList(is_search)
            },
            // 页码变化
            onPageChange(page, pageSize) {
                this.$set(this.pagination, 'current', page)
                this.submitForm()
            },
            onPageSizeChange(page, pageSize) {
                this.$set(this.pagination, 'pageSize', pageSize)
                this.submitForm()
            },
        },
    }
</script>

<style scoped>

</style>