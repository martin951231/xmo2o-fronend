<template>
    <div>
        <a-page-header
            :ghost="false"
            :title="title"
            sub-title="指纹信息是由设备返回"
            style="padding: 10px 20px;"
        >
            <a-descriptions size="small" :column="3" v-if="personFingerprints && personFingerprints[0]">
                <a-descriptions-item v-for="(item1,index1) in personFingerprints" :key="index1" :label="'指纹' + (index1+1)">
                   <div style="width:100%;text-align: center; ">
                        <img class="icon_size" :src="fingerprintImg" width="120"/>
                   </div>
                </a-descriptions-item>
            </a-descriptions>
            <a-descriptions size="small" :column="3" v-else>
                <a-descriptions-item>
                   暂无指纹信息
                </a-descriptions-item>
            </a-descriptions>
            <a-descriptions size="small" :column="1"  v-if="tip && tip[0]">
                <a-descriptions-item label="">
                    注意事项：
                </a-descriptions-item>
            </a-descriptions>
            <a-descriptions size="small" :column="1" v-if="tip && tip[0]">
                <a-descriptions-item label=""  v-for="(item2,index2) in tip" :key="index2">
                    {{item2}}
                </a-descriptions-item>
            </a-descriptions>
            <a-descriptions size="small" :column="1"  v-if="tip_url">
                <a-descriptions-item label="">
                    快捷链接： <a  @click="openUrl(tip_url)">{{tip_url_title}}</a>
                </a-descriptions-item>
            </a-descriptions>
        </a-page-header>

    </div>
</template>
<style lang="less" scoped>
 
</style>
<script>
import villageDeviceApi from '@/api/community/village/device'

 
export default {
    components: {
    },
    data() {
        return {
            title: '信息',
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
            confirmLoading  : false,
            personFingerprints    : [],
            fingerprintDeviceInfo : {},
            tip_url               : '',
            tip                   : [],
            fingerprintImg        : '',
            tip_url_title         : '点击跳转',
        }
    },
  beforeCreate () {
    var param = {
      pigcms_id: this.$route.query['pigcms_id']
    }
    this.request(villageDeviceApi.fingerprintGetPersonFingerprintDetail, param)
      .then((res) => {
        this.title              = res.title
        this.personFingerprints = res.personFingerprints
        this.tip_url            = res.tip_url
        this.tip                = res.tip
        this.fingerprintImg     = res.fingerprintImg
        if (res.tip_url_title) {
            this.tip_url_title  = res.tip_url_title
        }
      })
  },
    mounted() {
    },
    methods: {
        openUrl(url) {
            window.top.open(url)
        },
    },
}
</script>