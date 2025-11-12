<template>
    <a-modal :title="title" :width="1200" :footer="null" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"  @cancel="handleCancel">
        <a-table
                :columns="columns"
                :data-source="data"
                class="components-table-demo-nested"
                :pagination="pagination"
                @change='table_change'
                :loading="loading"
        >
        </a-table>
    </a-modal>
</template>
<style>
    /deep/ .imgname{
        width: 100px;
    }
</style>
<script>
    import villageApi from '@/api/community/village'
	import store from '@/store';
    const columns = [
        { title: store.getters.config.single_name,  dataIndex: 'single_name', key: 'single_name'},
        { title: store.getters.config.floor_name, dataIndex: 'floor_name', key: 'floor_name' },
        { title: '楼层', dataIndex: 'layer_name', key: 'layer_name',},
        { title: store.getters.config.room_name+'号', dataIndex: 'room', key: 'room'},
        { title: '姓名', dataIndex: 'bind_name', key: 'bind_name',},
    ];
    const data = [];
    export default {
        name: 'roomList',
        data() {
            return {
                pagination: {current:1,  pageSize: 10, total:10 },
                search: { uid:'',keyword: '', page: 1 },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
                title:'',
                confirmLoading:false,
                uid:''
            };
        },
        methods: {
            // 获取列表信息
            List(uid=0) {
                this.title='关联的'+store.getters.config.room_name+'列表';
                this.loading = true;
                if(uid > 0){
                    this.$set(this.pagination, 'current', 1)
                    this.uid=uid;
                    this.search['uid']=this.uid;
                }
                this.search['page'] = this.pagination.current;
                this.request(villageApi.getUserRoomList,this.search)
                    .then((res) => {
                      console.log('roomlist',res)
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        this.loading = false;
                        this.confirmLoading=true;
                        this.visible=true;
                    })
            },

            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                let _this=this;
                console.log('e', e)
                if (e.current && e.current>0) {
                    _this.pagination.current = e.current;
                    _this.List()
                }
            },
            handleCancel() {
                this.visible = false;
                setTimeout(() => {
                    this.id = '0';
                    this.form = this.$form.createForm(this)
                }, 500)
            },

        }
    };
</script>