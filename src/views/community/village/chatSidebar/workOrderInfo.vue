<template>
    <a-modal :title="title" :width="900" :footer="null" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @cancel="handleCancel">
      <a-descriptions title="">
        <a-descriptions-item :label="item.title" v-for="(item,index) in workOrderInfo" :key="index" >
          <span v-if="item.type === 'text'">{{ item.value }}</span>
          <img v-else-if="item.type === 'img' && item.value" :src="item.value" />
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
</template>
<script>
    import villageApi from '@/api/community/village'
    export default {
        components: {
        },
        data () {
            return {
                title: '工单详情',
                labelCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 7
                    }
                },
                wrapperCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 13
                    }
                },
                confirmLoading: false,
                workOrderInfo: [],
                visible: false
            }
        },
        methods: {
            info (id) {
                this.title = '工单详情'
                this.visible = true
                let param = {
                  'order_id': id
                }
                this.request(villageApi.getWorkOrderInfo, param).then((data) => {
                  console.log(data)
                    this.workOrderInfo = data
                })
            },
            handleCancel () {
                this.visible = false
                setTimeout(() => {
                    this.post.id = 0
                    this.form = this.$form.createForm(this)
                }, 500)
            }
        }
    }
</script>