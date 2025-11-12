<template>
    <a-modal :title="title" :width="640" :footer="null" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
        <div>
          <a-row class="mb-20">
            <a-col :span="1"></a-col>
            <a-col :span="20">
              职位名称: <span>  {{ detail.job_name }}</span>
            </a-col>
          </a-row>
          <a-row class="mb-20">
            <a-col :span="1"></a-col>
            <a-col :span="20">
              职位类别: <span>  {{ detail.job_cate }}</span>
            </a-col>
          </a-row>
          <a-row class="mb-20">
            <a-col :span="1"></a-col>
            <a-col :span="10">
              职位月薪: <span>  {{ detail.wages }}</span>
            </a-col>
            <a-col :span="1"></a-col>
            <a-col :span="10">
              职位性质: <span>  {{ detail.type_txt }}</span>
            </a-col>
          </a-row>
          <a-row class="mb-20">
            <a-col :span="1"></a-col>
            <a-col :span="10">
              招聘人数: <span>  {{ detail.recruit_nums }}</span>
            </a-col>
            <a-col :span="1"></a-col>
            <a-col :span="10">
              学历要求: <span>  {{ detail.education }}</span>
            </a-col>
          </a-row>
          <a-row class="mb-20">
            <a-col :span="1"></a-col>
            <a-col :span="10">
              工作年限: <span>  {{ detail.job_age }}</span>
            </a-col>
            <a-col :span="1"></a-col>
            <a-col :span="10">
              年龄要求: <span>  {{ detail.age }}</span>
            </a-col>
          </a-row>
          <a-row class="mb-20">
            <a-col :span="1"></a-col>
            <a-col :span="20">
              工作地点： <span>  {{ detail.address_detail }}</span>
            </a-col>
          </a-row>
          <a-row class="mb-20" v-if="detail.fuli_txt">
            <a-col :span="1"></a-col>
            <a-col :span="20">
              福利待遇: <span>  {{ detail.fuli_txt }}</span>
            </a-col>
          </a-row>
          <a-row class="mb-20">
            <a-col :span="1"></a-col>
            <a-col :span="20">
              职位时效: <span>  {{ detail.time }}</span>
            </a-col>
          </a-row>
          <a-row class="mb-20">
            <a-col :span="1"></a-col>
            <a-col :span="20">
              职位描述： <span>  {{ detail.desc }}</span>
            </a-col>
          </a-row>
          </div>
    </a-modal>
</template>

<script>
    import recruitMerchantApi from '@/api/recruit/merchant/index'

    export default {
        name: "jobDetail1",
        components: {
          
        },
        data() {
            return {
                title: '职位预览',
                visible: false,
                confirmLoading: false,
                detail: {
                    job_id: '',
                    job_name:'',
                    job_cate: '',
                    wages: '',
                    type_txt:'',
                    address_detail: '',
                    recruit_nums: 0,
                    education: '',
                    job_age: '',
                    age: '',
                    desc: '',
                    fuli_txt: '',
                    time: '',
                },
            }
        },
        methods: {
            getEditInfo(id) {
              this.visible = true
              this.detail = {
                  job_id: id,
              }
                this.request(recruitMerchantApi.getJobDetail, {
                    job_id: id,
                }).then((res) => {
                    this.detail = res
                  this.detail.desc = decodeURIComponent(res.desc)
                })
            },
            handleCancel() {
              this.visible = false
            },
        }
    }
</script>

<style scoped>

</style>