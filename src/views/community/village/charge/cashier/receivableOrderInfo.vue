<template>
  <div>
    <a-modal
      title="应收明细"
      :width="1200"
      :visible="visible"
      :confirmLoading="confirmLoading"
      :footer="null"
      :centered = true
      :maskClosable = false
      @cancel="handleCancel"
    >
      <a-table
        :columns="columns"
        :data-source="data"
        :loading="loading"
      >
        <span slot="action" slot-scope="text, record">
        <a @click="invalidShow(record.order_id)">作废账单</a>
      </span>
      </a-table>
    </a-modal>
    <a-modal :width="500" title="作废账单" :visible="visible_invalid" :confirm-loading="confirmLoading"
             @ok="confirm_invalid" :maskClosable = false @cancel="handleCancel1">
      <div class="modal_box">
        <div class="flex_text_box margin_top_10">
          <div class="text_1">作废原因：</div>
          <a-textarea v-model="invalidReasons" style="width: 200px;height: 100px" placeholder="请输入作废原因" auto-size />
        </div>
        <br><br><br>
      </div>
    </a-modal>
  </div>
</template>

<script>
    import villageApi from '@/api/community/village'
    const columns = [
        {
            title: '收费标准名称',
            dataIndex: 'charge_name',
            key: 'charge_name',
        },
        {
            title: '收费项目名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '所属收费科目',
            dataIndex: 'charge_number_name',
            key: 'charge_number_name',
        },
        {
            title: '应收费用',
            dataIndex: 'total_money',
            key: 'total_money',
        },
        {
            title: '计费开始时间',
            dataIndex: 'service_start_time_txt',
            key: 'service_start_time_txt',
        },
        {
            title: '计费结束时间',
            dataIndex: 'service_end_time_txt',
            key: 'service_end_time_txt',
        },
        {
            title: '上次度数',
            dataIndex: 'last_ammeter',
            key: 'last_ammeter',
        },
        {
            title: '本次度数',
            dataIndex: 'now_ammeter',
            key: 'now_ammeter',
        },
        {
            title: '操作',
            key: 'action',
            dataIndex: '',
            scopedSlots: {customRender: 'action'}
        },
    ];
    export default {
        data(){
            return{
                visible :false,
                confirmLoading:false,
                data:[],
                loading: false,
                columns,
                room_id:0,
                position_id:0,
                type:'room',
                key_id:0,
                visible_invalid:false,
                invalidReasons:'',
                order_id :0,
            }
        },
        methods: {
            confirm_invalid() {
                if (this.invalidReasons == '') {
                    this.$message.warning('请填写作废原因');
                    return
                }
                this.discardOrder(this.order_id)
            },
            // 作废账单
            discardOrder(order_id) {
                this.request(villageApi.discardOrder, {
                    discard_reason: this.invalidReasons,
                    order_id: this.order_id,
                }).then(res => {
                    console.log('+++++++Single', res);
                    if (res) {
                        this.$message.success('作废成功');
                        this.invalidReasons = '';
                        this.order_id = 0;
                        this.visible_invalid = false;
                        this.receivableOrderInfo()
                    }
                });
            },
            invalidShow(order_id){
                this.visible_invalid = true;
                this.order_id = order_id;
            },
            info(room_id,position_id){
                this.room_id = room_id;
                this.position_id = position_id;
                this.order_id = 0;
                if(position_id>0){
                  this.type = 'position';
                  this.key_id = position_id;
                } else {
                  this.type = 'room';
                  this.key_id = room_id;
                }
                this.receivableOrderInfo();
                this.visible = true;
            },
            handleCancel () {
                this.visible = false;
            },
            handleCancel1 () {
                this.visible_invalid = false;
            },
            //应收账单明细
            receivableOrderInfo(){
                this.request(villageApi.receivableOrderInfo,{
                    key_id:this.key_id,
                    type:this.type,
                }).then((res)=>{
                    this.data = res;
                })
            },
        },
    }
</script>

<style scoped>
  .flex_text_box {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .margin_top_10 {
    margin-top: 10px;
  }
  .text_1 {
    flex-shrink: 0;
  }

  .input_style {
    width: 100px;
  }

  .cascader_style {
    width: 120px;
  }

</style>