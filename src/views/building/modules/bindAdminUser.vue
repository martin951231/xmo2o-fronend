<template>
    <a-table
        style="background: #ffffff;margin-top: 20px"
        :columns="columns"
        rowKey="id"
        :data-source="dataList"
        @change="changePage"
        :pagination="pagination"
    >

        <span slot="status" slot-scope="text, ">
            <a-tag v-if="text == 1" color="#108ee9">正常</a-tag>
            <a-tag v-else color="#f50">关闭</a-tag>
        </span>

        <span slot="level" slot-scope="text, ">
            <span v-if="text == 0" color="#108ee9">普通管理员</span>
            <span v-else-if="text == 1" color="#108ee9">区域管理员</span>
            <span v-else-if="text == 2" color="#108ee9">超级管理员</span>
            <span v-else color="#f50">未知</span>
        </span>

        <span slot="is_bind" slot-scope="text, item">
            <a-switch v-if="text == 1"  @change="onChangeBind(item.id)" checked-children="已绑定" un-checked-children="未绑定" default-checked />
            <a-switch v-else  @change="onChangeBind(item.id)" checked-children="已绑定" un-checked-children="未绑定"/>
        </span>
    
    </a-table>
    
     
</template>

<script>
import buildingPlatformApi from '@/api/building/index'

export default {
    name: "bindAdminUser",
    components: {
     
    },
    props: {
        // 存放路径
        mall_id: {
            type: [String, Number],
            default: '0',
        },
    },
    data() {
        return {
            dataList:[],
            queryParams: {
                page_size: 0,
                page: 1,
            },
            pagination: {
                pageSize: 10,
                total: 0,
                current: 1,
                page: 1,
            },
            columns: [
                {
                    title: this.L('账号'),
                    dataIndex: 'account',
                },
                {
                    title: this.L('姓名'),
                    dataIndex: 'realname',
                },
                {
                    title: this.L('电话'),
                    dataIndex: 'phone',
                },
                {
                    title: this.L('级别'),
                    dataIndex: 'level',
                    scopedSlots: {
                        customRender: 'level',
                    },
                },
                {
                    title: this.L('状态'),
                    dataIndex: 'status',
                    scopedSlots: {
                        customRender: 'status',
                    },
                },
                {
                    title: this.L('绑定状态'),
                    dataIndex: 'is_bind',
                    scopedSlots: {
                        customRender: 'is_bind',
                    },
                },
            ],  
        }
    },
    
    mounted() {
        if(this.$props.mall_id > 0){
            this.getLists();
        }
    },
    methods: {
      //获取商场列表
      getLists() {
        this.queryParams.page_size = this.pagination.pageSize
        this.queryParams.page = this.pagination.current
        this.queryParams.mall_id = this.$props.mall_id
        this.request(buildingPlatformApi.getBindAdminUserLists, this.queryParams).then((res) => {
          this.dataList = res.data
          this.pagination.total = res.total
        })
      },
  
      // 切换表格分页
      changePage(page, pageSize) {
        this.pagination.current = page.current
        this.getLists()
      },

      //切换商场状态
      onChangeBind(admin_id) {
        this.request(buildingPlatformApi.changeBindAdminUserStatus, {admin_id:admin_id,mall_id:this.$props.mall_id}).then((res) => {
            this.getLists()
        })
      },
    },
}
</script>

<style scoped>
.mb-0 {
    margin-bottom: 0;
}
.bm-view {
    width: 650px;
    height: 450px;
    margin-top: 10px;
}
.ms {
    color: #888;
    display: flex;
    justify-content: center;
}
</style>


