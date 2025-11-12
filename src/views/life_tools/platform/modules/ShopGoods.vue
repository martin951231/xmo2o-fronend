<template>
    <div class="mt-10 mb-20 mh-full">
        <a-form-model
                v-bind="{
        labelCol: { span: 2 },
        wrapperCol: { span: 10 },
      }"
                ref="form"
        >
            <a-card  :bordered="false">
                <a-form-model-item label="是否展示">
                    <a-switch
                            checked-children="展示"
                            un-checked-children="不展示"
                            :checked="recommend.is_show == 1 ? true : false"
                            @change="setStatus(recommend.id, $event)"
                    />
                </a-form-model-item>

                <a-form-model-item label="主标题">
                    <a-input v-model="recommend.title" @blur="updateStatus(recommend.id)"/>
                </a-form-model-item>

                <a-form-model-item label="排序">
                    <a-input v-model="recommend.sort" @blur="updateStatus(recommend.id)"/>
                </a-form-model-item>
            </a-card>
            <a-card style="margin-top: 10px" title="快店商品信息" :bordered="false">
                <a-form-model-item label="商品" :wrapper-col="{span: 23}" :labelCol="{ span: 1}">
                    <a-row>
                        <a-col :span="12" class="text-left">
                            <a-button @click="addProduct('shop')" type="primary"> 添加商品 </a-button>
                        </a-col>

                        <a-col :span="12" class="text-right">
                            <a-button @click="delAll()" type="primary"> 删除 </a-button>
                        </a-col>
                    </a-row>
                </a-form-model-item>
                <a-table :columns="columns"
                         :data-source="data"
                         :row-selection="rowSelection"
                         rowKey="id">
                 <span slot="sort" slot-scope="text,record">
                    <a-input v-model="record.sort" @blur="saveSort(record.id,record.sort)" style="width: 80px;"/>
                </span>
                    <span slot="action" slot-scope="text,record">
                              <a class="ml-10 inline-block" @click="delAct(record.id)">删除</a>
                </span>
                </a-table>
            </a-card>
        </a-form-model>
        <select-rec-goods ref="selectGoods" @getTable="getTable"></select-rec-goods>
    </div>
</template>
<script>
    import lifeToolsPlatformApi from "@/api/life_tools/platform";
    import SelectRecGoods from "./SelectRecGoods";
    const columns = [
        {
            title: '名称',
            dataIndex: 'goods_name',
            scopedSlots: {customRender: 'goods_name'},
        },
        {
            title: '商家名称',
            dataIndex: 'name',
            scopedSlots: {customRender: 'name'},
        },
        {
            title: '价格',
            dataIndex: 'goods_price',
            slots: {customRender: 'goods_price'}
        },
        {
            title: '排序',
            dataIndex: 'sort',
            scopedSlots: {customRender: 'sort'},
            align: "center"
        },
        {
            title: '操作',
            dataIndex: 'goods_id',
            key: 'goods_id',
            scopedSlots: {customRender: 'action'},
            align:'center'
        },
    ];
    export default {
     name: "ShopGoods",
    components: {SelectRecGoods},
    data() {
        return {
            columns,
            data:[],
            selectedRowKeys: [],
            recommend:{
                id:0,
                is_show:0,
                title:"",
                sort:0,
                goods_type:'shop',
            },
        }
    },
    computed: {
        rowSelection() {
            return {
                selectedRowKeys: this.selectedRowKeys,
                onChange: this.handleRowSelectChange,
            }
        },
    },
    methods: {
        handleRowSelectChange(selectedRowKeys) {
            console.log(selectedRowKeys)
            this.selectedRowKeys = selectedRowKeys
        },
        delAll(){
            if(this.selectedRowKeys.length>0){
                this.$confirm({
                    title: '确定删除吗？',
                    centered: true,
                    onOk: () => {
                        this.request(lifeToolsPlatformApi.delRecGoods, {id:this.selectedRowKeys}).then((res) => {
                            this.selectedRowKeys=[]
                            this.$message.success(this.L('操作成功！'));
                            this.getOpen();
                        })
                    },
                    onCancel() {},
                })
            }else{
                this.$message.error(this.L('请勾选列表！'));
            }
        },
        getOpen() {
            this.request(lifeToolsPlatformApi.getRecGoodsList, {goods_type:'shop'}).then((res) => {
                this.recommend = res.recommend
                this.$set(this, 'recommend', res.recommend)
                this.data = res.recommend_goods
            })
        },
        getTable() {
            this.request(lifeToolsPlatformApi.getRecGoodsList, {goods_type:'shop'}).then((res) => {
                this.$set(this, 'recommend', res.recommend)
                this.data = res.recommend_goods
            })
        },
        addProduct(key){
            this.$refs.selectGoods.openDialog(key,this.recommend.id);
        },
        delAct(id){
            this.$confirm({
                title: '确定删除吗？',
                centered: true,
                onOk: () => {
                    this.request(lifeToolsPlatformApi.delRecGoods, {id:id}).then((res) => {
                        this.selectedRowKeys=[]
                        this.$message.success(this.L('操作成功！'));
                        this.getOpen();
                    })
                },
                onCancel() {},
            })
        },
        // 状态设置开启关闭
        setStatus(id, status) {
            if(status){
                this.recommend.is_show=1
                this.$set(this.recommend, 'is_show', 1)
            }else{
                this.recommend.is_show=0
                this.$set(this.recommend, 'is_show', 0)
            }
            this.request(lifeToolsPlatformApi.updateRec, {
                id: id,
                is_show: this.recommend.is_show,
                title: this.recommend.title,
                sort: this.recommend.sort,
                goods_type: this.recommend.goods_type
            }).then((res) => {

            })
        },
        saveSort(id,sort){
            this.request(lifeToolsPlatformApi.updateRecGoods, {
                id: id,
                sort: sort,
            }).then((res) => {
                this.getOpen();
            })
        },
        // 状态设置开启关闭
        updateStatus(id) {
            this.request(lifeToolsPlatformApi.updateRec, {
                id: id,
                is_show: this.recommend.is_show,
                title: this.recommend.title,
                sort: this.recommend.sort,
                goods_type: this.recommend.goods_type
            }).then((res) => {

            })
        },
    }
    }
</script>

<style scoped>
    >>>.ant-card-head-title {
        display: inline-block;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        /* padding: 16px 0; */
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    >>>.ant-card-body {
        padding: 12px;
        zoom: 1;
    }
    >>>.ant-form-item {
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        font-variant: tabular-nums;
        line-height: 1.5;
        list-style: none;
        -webkit-font-feature-settings: 'tnum';
        font-feature-settings: 'tnum';
        margin-bottom: 15px;
        vertical-align: top;
    }
</style>