<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-form
        :form="detail"
        v-bind="{
          labelCol: { span: 4 },
          wrapperCol: { span: 10 },
        }">
        <a-form-item label="是否推荐至首页" :labelCol="{span: 6}">
          <a-switch
            checked-children="是"
            un-checked-children="否"
            :checked="is_recommend==1 ? true : false"
            @change="isRecommendChange" />
        </a-form-item>
        <a-form-model-item label="推荐时间" help="推荐时间应在活动时间之内" prop="recommend_time" v-if="is_recommend==1">
          <a-range-picker
                  show-time
            :value="recommend_time"
            format="YYYY-MM-DD HH:mm:ss"
            @change="onRecommendDateRangeChange"
          />
        </a-form-model-item>
      </a-form>
  </a-modal>
</template>
<script>
  import mallPlatformApi from "@/api/mall/platform/index";
  import moment from "moment";

  export default {
    data() {
      return {
        title: '',
        visible: false,
        detail: {},
        rec_start_time: '',
        rec_end_time: '',
        recommend_time: [],
        activeKey: '',
        is_recommend:2,
      }
    },
    mounted() {
      console.log(this.catFid)
    },
    methods: {
      moment,
      // 监听日期选择变化
      onRecommendDateRangeChange(date, dateString) {
        // 更新表单数据
        this.recommend_time = [date[0], date[1]]
        this.rec_start_time = dateString[0]
        this.rec_end_time = dateString[1]
      },
      edit(record,activeKey,type) {
  /*      console.log(record,'record')
        console.log(this,'this')*/
        this.title = '首页推荐设置'
        for (let k in record) {
          this.$set(this.detail, k, record[k])
        }
        this.is_recommend=this.detail.is_recommend
        this.visible = true
        this.activeKey = activeKey
        this.type = type
        this.rec_start_time = this.detail.rec_start_time || this.detail.start_time
        this.rec_end_time = this.detail.rec_end_time || this.detail.end_time
          //record.recommend_start_time, record.recommend_end_time
          if(record.recommend_start_time!='' && record.recommend_start_time!=null && record.recommend_end_time!='' && record.recommend_end_time!=null){
              this.recommend_time = this.recommend_time.concat([moment(record.recommend_start_time), moment(record.recommend_end_time)])
          }
          /*else{
              this.recommend_time = this.recommend_time.concat([moment(this.rec_start_time), moment(this.rec_end_time)])
          }*/
      },
      handleSubmit() {
        if(this.is_recommend==1 && (this.recommend_time=='' || this.recommend_time==null)){
          this.$message.error('请完善推荐时间')
          return
        }
        let params=[]
        let activity_id=[]
        let goods_id=[]
        let activity=[]
        let goods=[]
        if(this.type==1){
          params = {
            activity_id: this.detail.id,
            goods_id: this.detail.act_goods_id,
            is_recommend: this.is_recommend,
            rec_start_time: this.rec_start_time,
            rec_end_time: this.rec_end_time
          }
        }else if (this.type == 2) {
          for (let k in this.detail) {
            activity_id = this.detail[k].id
            goods_id = this.detail[k].act_goods_id
            activity.push(activity_id)
            goods.push(goods_id)
          }
          params={
            activity_id:activity,
            goods_id:goods,
            is_recommend: this.is_recommend,
            rec_start_time: this.rec_start_time,
            rec_end_time: this.rec_end_time
          }
        }
       /* console.log(params)*/
        let api = ''
        if (this.activeKey == 'getLimitedRecommendList') {
          api = 'editLimitedRecommend'
        } else if (this.activeKey == 'getBargainRecommendList') {
          api = 'editBargainRecommend'
        } else if (this.activeKey == 'getGroupRecommendList') {
          api = 'editGroupRecommend'
        }
        if (api) {
          this.request(mallPlatformApi[api], params).then((data) => {
            this.$message.success('设置成功')
            this.$emit('updateList')
            this.handleCancel()
          })
        }
      },
      handleCancel() {
        this.visible = false
        Object.assign(this.$data, this.$options.data())
      },
      // switch change事件
      isRecommendChange(val) {
        this.is_recommend = val?1:2
        if (!val) {
          this.rec_start_time = ''
          this.rec_end_time = ''
        }
        if(this.type==2){
            this.recommend_time=[]
        }
      }
    },
  }
</script>
