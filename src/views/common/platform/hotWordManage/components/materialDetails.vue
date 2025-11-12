<template>
    <a-modal :title="title" :width="850" :height='650' :footer="null" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @cancel="handleCancel">
        <a-table :columns="columns" :data-source="navigationList"
                 :pagination="pagination"
                 :loading="loading"
                 @change="tableChange" 
                 :row-key="record => record.material_id"
                 >
                 <div slot="xcontentaction" slot-scope="text, record,index">
                    <div v-if="record.xtype==1">
                        {{record.xcontent}}
                    </div>
                    <div v-else-if="record.xtype==2" >
                        <div style="font-size: 16px;font-weight: bold;">{{record.xname}}</div>
                        <a :href="record.audio_url" target="_blank">{{record.audio_url}}</a>
                    </div>
                    <div v-else-if="record.xtype==3" class="previewimg">
                        <img v-for="(item,index) in record.word_imgs" :src="item" style="height:80px;margin-right: 10px;"  preview="1">
                    </div>
                 </div>
            <span slot="action" slot-scope="text, record">
                <a @click="selected_url(record)">选中</a>
            </span>
        </a-table>
    </a-modal>
</template>

<script>
    import hotWordManageApi from '@/api/common/platform/hotWordManage';
    const columns = [
        {title: '编号', dataIndex: 'material_id', key: 'material_id'},
        {title: '回复内容',dataIndex: 'xcontent',key: 'xcontent',width: 450,scopedSlots: {customRender: 'xcontentaction'}},
        {title: '操作', key: 'action', dataIndex: '', scopedSlots: {customRender: 'action'}},
    ];
    export default {
        name:'HotwordMaterialDetails',
        data() {
            return {
                title: '',
                category:{},
                visible: false,
                confirmLoading: false,
                navigationList: [],
                pagination: { current:1,pageSize: 20, total:20 },
                search: { page: 1 },
                page: 1,
                xtype:'',
                loading: false,
                cfromModel:'',
            }
        },
        computed:{
            columns() {
                return columns;
            },
        },
        methods: {
            navigations(category,xtype,cfromModel) {
                this.title = '【'+category.categoryname+'】详细';
                this.category=category;
                this.visible = true;
                this.xtype=xtype;
                if(cfromModel){
                    this.cfromModel=cfromModel
                }else{
                    this.cfromModel='';
                }
                
                this.getList();
            },
            getList() {
                let _this=this;
                _this.loading = true;
                _this.search.cate_id=_this.category.cate_id;
                _this.search.xtype = _this.xtype;
                _this.search.page = _this.pagination.current;
                let post_url=hotWordManageApi.getHotWordMaterialLibraryDetails;
                _this.request(post_url, _this.search).then((res) => {
                    _this.loading = false;
                    _this.navigationList = res.list;
                    _this.pagination.total = res.count ? res.count : 0;
                    _this.pagination.pageSize = res.total_limit ? res.total_limit : 20
                })
            },
            tableChange(e) {
                let _this=this;
                if (e.current && e.current>0) {
                    _this.pagination.current = e.current;
                    _this.getList()
                }
            },
            selected_url(record){
                this.$emit('ok', record)
                this.visible = false;
            },
            handleCancel() {
                this.category={};
                this.visible = false
            },
        },
    }
</script>
<style lang="less" scoped>
.previewimg img{cursor: pointer;}
</style>