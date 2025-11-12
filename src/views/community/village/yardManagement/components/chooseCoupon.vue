<template>
    <a-modal title="优惠券管理" :width="1100" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk"
        @cancel="handleCancel" :footer="null">
        <a-button type="primary" @click="addCoupon">添加优惠券</a-button>
        <a-table :columns="columns" :row-key="record=>record.id" :pagination="pageInfo"
            :loading="tableLoadding" @change="handleTableChange"
            :data-source="couponList">
            <span slot="ercode" slot-scope="text, record">
                <a @click="lookErcode(record)">{{record.status==1?'静态码可查看':record.status==2?'动态码不可查看':'已删除'}}</a>
            </span>
            <span slot="action" slot-scope="text, record">
                <a @click="viewDetail(record)">查看详情</a>
            </span>
            <span slot="can_send_coupon" slot-scope="text, record">
                <a @click="send_coupon_opt(record)" v-if="record.residue_num>1">派发优惠券</a>
            </span>
        </a-table>
        <add-coupon :mid="mid" :visible="couponVisible" :modelTitle="modelTitle" @closeCoupon="closeCoupon"/>
        <coupon-detail :coupons_id="coupons_id" :visible="detailVisible" :modelTitle="modelTitle" @closeDetail="closeDetail"/>
        
        <a-modal title="查看二维码" :width="500" :visible="erCodeVisible"
            @cancel="handleCodeCancel" :footer="null">
            <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
                <img style="width: 150px; height: 150px;" :src="ercodeUrl">
            </div>
        </a-modal>
        
        <a-modal title="派发优惠券" :width="700" :visible="send_coupon_visible" :confirm-loading="confirmSendLoading" :maskClosable="false" @cancel="handleSendCancel" @ok="handleSendSubmit">
            <div style="display: inline-block;width: 80%;">
                <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
                    <a-form-model-item  label="优惠券名称">
                        <span>{{send_coupon.c_title}}【还剩有{{send_coupon.residue_num}}】</span>
                    </a-form-model-item>
  
                    <a-form-model-item label="车牌号" required>
                        <a-input v-model="send_coupon.car_number" placeholder="请输入车牌号"  :maxLength="10"/>
                    </a-form-model-item>
                    
                    <a-form-model-item label="派发数量" required>
                        <a-input-number v-model="send_coupon.send_num" :min="0" :max="send_coupon.residue_num" :precision="0" style="width:150px;" />
                    </a-form-model-item>


                </a-form-model>
            </div>
        </a-modal>
        
    </a-modal>
</template>

<script>
    import addCoupon from './addCoupon.vue'
    import couponDetail from './couponDetail.vue'
    import villageApi from '@/api/community/village';
    const columns = [
      {
        title: '优惠券名称',
        dataIndex: 'c_title',
        key: 'c_title',
        width: 200
      },{
            title: '优惠券所属停车场',
            dataIndex: 'garage_num',
            key: 'garage_num',
        },
      {
        title: '购买总数量',
        dataIndex: 'num',
        key: 'num',
      },
      {
        title: '已使用数量',
        dataIndex: 'buy_num',
        key: 'buy_num',
      },
      {
        title: '剩余数量',
        dataIndex: 'residue_num',
        key: 'residue_num',
      },
      {
        title: '优惠券二维码',
        key: 'ercode',
        scopedSlots: { customRender: 'ercode' },
      },
      {
        title: '领取记录',
        key: 'action',
        scopedSlots: { customRender: 'action' },
      },
    ];
    
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            m_id: {
                type: String,
                default: ''
            },
            can_send_coupon: {
                type: [Number,String],
                default: 0
            },
        },
       
        watch:{
            m_id: {
                immediate: true,
                handler (val) {
                    if(this.visible){
                        this.pageInfo.m_id = val
                        this.getCouponList()
                    }
                }
            },
        },
       
        data() {
            return {
                columns,
                confirmLoading: false,
                couponVisible: false,
                modelTitle: '',
                detailVisible: false,
                labelCol: { span: 6 },
                wrapperCol: { span: 18 },
                pageInfo: {
                    current:1,
                    page:1,
                    pageSize: 10,
                    total:10,
                    m_id: '',
                    showTotal: total => `共 ${total} 条`, // 显示总数
                },
                tableLoadding: false,
                couponList: [],
                coupons_id: '',
                ercodeUrl: '',
                erCodeVisible: false,
                mid: '',
                send_coupon:{car_number:'',send_num:1,c_title:'',cid:0,garage_id:0,mid:0,idd:0,residue_num:1},
                send_coupon_visible:false,
                confirmSendLoading:false,
            }
        },
        components: {
            addCoupon,
            couponDetail
        },
        
        methods: {
            handleOk(e) {
                this.confirmLoading = true;
                this.send_coupon={car_number:'',send_num:1,c_title:'',cid:0,garage_id:0,mid:0,idd:0,residue_num:1};
                setTimeout(() => {
                    this.$emit('closeCoupon')
                    this.confirmLoading = false;
                }, 2000);
                this.confirmSendLoading=false;
            },
            
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getCouponList()
            },
            onTableChange(page,pageSize){
                this.pageInfo.current = page
                this.pageInfo.page = page
                this.pageInfo.pageSize = pageSize
                this.getCouponList()
                console.log('onTableChange==>', page, pageSize)
            },
            getCouponList(){
                if(this.can_send_coupon*1>0){
                    this.columns=[
                                  {
                                    title: '优惠券名称',
                                    dataIndex: 'c_title',
                                    key: 'c_title',
                                    width: 200
                                  },{
                                        title: '优惠券所属停车场',
                                        dataIndex: 'garage_num',
                                        key: 'garage_num',
                                    },
                                  {
                                    title: '购买总数量',
                                    dataIndex: 'num',
                                    key: 'num',
                                  },
                                  {
                                    title: '已使用数量',
                                    dataIndex: 'buy_num',
                                    key: 'buy_num',
                                  },
                                  {
                                    title: '剩余数量',
                                    dataIndex: 'residue_num',
                                    key: 'residue_num',
                                  },
                                  {
                                    title: '优惠券二维码',
                                    key: 'ercode',
                                    scopedSlots: { customRender: 'ercode' },
                                  },
                                  {
                                    title: '领取记录',
                                    key: 'action',
                                    scopedSlots: { customRender: 'action' },
                                  },
                                  {title: '派发优惠券',key: 'can_send_coupon', scopedSlots: { customRender: 'can_send_coupon' } }
                                ];
                 }
                let that = this
                that.tableLoadding = true
                that.request(villageApi.getShopCouponsList, that.pageInfo).then((res) => {
                    that.couponList = res.list
                    that.pageInfo.total = res.count
                    that.tableLoadding = false
                }).catch(e=>{
                    that.tableLoadding = false
                })
            },
            
            handleCancel(e) {
                this.send_coupon={car_number:'',send_num:1,c_title:'',cid:0,garage_id:0,mid:0,idd:0,residue_num:1};
                this.$emit('closeCoupon')
                this.confirmLoading = false;
                this.confirmSendLoading=false;
            },
            
            viewDetail(record){
                this.coupons_id = record.id+''
                this.detailVisible = true
            },
            
            addCoupon(){
                this.mid = this.m_id
                this.modelTitle = '添加优惠券'
                this.couponVisible = true
            },
            
            closeCoupon(flag){
                this.mid = ''
                this.couponVisible = false
                if(flag){
                    this.getCouponList()
                }
            },
            
            closeDetail(){
                this.coupons_id = ''
                this.detailVisible = false
            },
            lookErcode(record){
                let that = this
                if(record.status == 1){
                    that.request(villageApi.getQrcodeCoupons, {coupons_id: record.id}).then((res) => {
                        that.ercodeUrl = res.qrcode
                        that.erCodeVisible = true
                    })
                }
            },
            handleCodeCancel(){
                this.erCodeVisible = false
                this.ercodeUrl = ''
            },
            send_coupon_opt(record){
                console.log('record',record)
                 this.send_coupon.c_title=record.c_title;
                 this.send_coupon.cid=record.cid;
                 this.send_coupon.garage_id=record.garage_id;
                 this.send_coupon.mid=record.mid;
                 this.send_coupon.idd=record.id;
                 this.send_coupon.residue_num=record.residue_num;
                 this.confirmSendLoading=false;
                 this.send_coupon_visible=true;
            },
            handleSendCancel(){
                this.send_coupon_visible=false;
                this.confirmSendLoading=false;
                this.send_coupon={car_number:'',send_num:1,c_title:'',cid:0,garage_id:0,mid:0,idd:0,residue_num:1};
            },
            handleSendSubmit(){
                if(!this.send_coupon.car_number){
                     this.$message.error('请填写车牌号')
                     return false;
                }
                if(this.send_coupon.car_number.length<5 || this.send_coupon.car_number.length>10){
                     this.$message.error('请争取填写车牌号')
                     return false;
                }
                if(this.send_coupon.send_num<1){
                     this.$message.error('请填写发券数量')
                     return false;
                }
                this.confirmSendLoading=true;
                this.request(villageApi.sendCouponToCarUse,this.send_coupon).then((res) => {
                    this.$message.success('操作成功！')
                    this.confirmSendLoading=false;
                    this.handleSendCancel();
                }).catch(e=>{
                    this.confirmSendLoading = false;
                })
           
            },
        },
    }
</script>

<style>
</style>
