<template>
  <a-modal :width="800" title="添加" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk"
           @cancel="handleCancel">
    <a-table
      :columns="columns"
      :data-source="data"
      class="components-table-demo-nested"
      :pagination="pagination"
      @change='table_change'
    >
      <span slot="action" slot-scope="text, record">
          <a @click="showReordDrawer(record.id,record.message_name)" v-if="record.send_type == 1">群发记录</a>
         <a-divider type="vertical" v-if="record.send_type == 1" />
        <!--<a @click="showDrawer(record.id)">预览内容</a>
      <a-divider type="vertical"/>-->
            <a-popconfirm
              class="ant-dropdown-link"
              title="确认删除?"
              ok-text="是"
              cancel-text="否"
              @confirm="del(record.id)"
            >
              <a href="#">删除</a>
            </a-popconfirm>
        </span>
      <span slot="sure" slot-scope="text, record">

      </span>
    </a-table>
  </a-modal>
</template>
<script>
  const columns = [

  ];
</script>
<script>
    export default {
        name: "chargeBind",
        data(){
            return{
                visible:false,
                confirmLoading:false,
                data:[],
                columns,

            }
        },
        methods:{
            handleOk(e) {
                this.confirmLoading = true;
                setTimeout(() => {
                    this.visible = false;
                    this.confirmLoading = false;
                }, 2000);
            },
            handleCancel(e) {
                console.log('Clicked cancel button');
                this.visible = false;
            },
        }
    }
</script>

<style scoped>

</style>