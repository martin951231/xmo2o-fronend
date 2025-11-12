<template>
    <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
        <a-card :bordered="false">
            <div class="table-operator">
                <a-button type="primary" icon="plus" >添加</a-button>
            </div>
            <a-table :columns="columns" :data-source="list"
                     :pagination="pagination"
                     @change="tableChange" >

          <span slot="action" slot-scope="text, record">
            <a >编辑</a>
         </span>
                <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
            </a-table>

        </a-card>
    </div>
</template>
<script>
import newChargeApi from '@/api/community/property/packages';


const columns = [
    {
        title: '科目名称',
        dataIndex: 'charge_number_name',
        key: 'charge_number_name',
    },
    {
        title: '收费类别',

        dataIndex: 'charge_type_name',
        key: 'charge_type_name',
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        scopedSlots: {
            customRender: 'status'
        }

    },
    {
        title: '操作',
        key: 'action',
        dataIndex: '',
        scopedSlots: {
            customRender: 'action'
        }
    },
];
export default {
    name: 'ProperyvillageList',
    components: {

    },
    data() {
        return {
            list:[],
            pagination: { pageSize: 10, total:10 },
            search: { page: 1 },
            page: 1,
            search_data:[],
            id:0,
            columns
        };
    },
    mounted(){
        this.getChargeNumberList()
    },
    methods: {
        getChargeNumberList() {
            this.request(newChargeApi.dataCenterVillageList,{'page':this.page})
                .then((res) => {
                    console.log('res', res);
                    // this.list = res.list;
                    // this.pagination.total = res.count ? res.count : 0
                    // this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                })
        },
        tableChange(e) {
            if (e.current && e.current>0) {
                this.page = e.current;
                this.getChargeNumberList()
            }
        },
        cancel() {

        },
        handleOks() {
            this.getChargeNumberList();
        },

    },
};
</script>
<style scoped>
.txt-green {
    color: #0fb70f;
}

.txt-red {
    color: red;
}

.table-operator{
    margin-bottom: 10px;
}

</style>