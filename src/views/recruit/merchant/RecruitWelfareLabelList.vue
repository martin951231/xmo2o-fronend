<template>
<div class="page">
    <a-page-header class="page-header" title="选择的标签将展示到公司主页" />
    <a-form-model style="margin-top: 20px;margin-left:120px" :model="form" :label-col="{ span: 2 }" :wrapper-col="{ span: 8 }" ref="ruleForm" :rules="rules">

      <div style="line-height:50px;">标签支持多选，若需要补充，请联系平台管理员。</div>

        <a-form-model-item :colon="false" ref="name" prop="name" label="">
            <a-checkbox-group v-model="checkedList" :options="plainOptions" @change="onChange" class="biaoqian" />
        </a-form-model-item>

        <a-form-model-item>
            <a-button type="primary" @click="onSubmit">
                保存
            </a-button>
        </a-form-model-item>
    </a-form-model>

</div>

</template>

<script>
    import recruitMerchantApi from '@/api/recruit/merchant';

    export default {
        name: "Company",
        components: {
        },
        data() {
          return {
              checkedList: [],
              indeterminate: true,
              checkAll: false,
              plainOptions: [],
              form:{
                  checked:[],
              },
          }
        },
        mounted() {
            this.getCompanyInfo();
            this.syncIndustrySelect();
        },
        methods: {
            onChange(checkedValues) {
                this.checkedList = checkedValues
                console.log('checked = ', checkedValues);
            },
            getCompanyInfo() {
                this.request(recruitMerchantApi.getRecruitWelfareLabelInfo, {})
                    .then((res) => {
                        this.checkedList = res
                    })
                    .catch((error) => {
                    })
            },
            syncIndustrySelect() {
                this.request(recruitMerchantApi.getRecruitWelfareLabelList, {})
                    .then((res) => {
                        this.plainOptions = res;
                    })
                    .catch((error) => {
                    })
            },
            onSubmit() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        let params = {...this.form}
                        params.checked = this.checkedList;
                        console.log(this.form)
                        this.request(recruitMerchantApi.getRecruitWelfareLabelCreate, params)
                            .then((res) => {
                                this.$message.success('保存成功');
                            })
                            .catch((error) => {
                            })
                    } else {
                        return false;
                    }
                });
            },
        }
    }
</script>

<style>
    .page {
        width: 100%;
        min-height: 100%;
        box-sizing: border-box;
        background: #ffffff;
    }
    .page-header {
        background-color: #eef0f3;
        padding: 14px 16px;
        font-size: 1rem;
    }
    /* 标签样式 */
    .biaoqian {
        width: 500px;
    }
    .biaoqian .ant-checkbox-group-item {
        width: 106px;
        height: 36px;
        line-height: 36px;
        margin-bottom: 16px;
        margin-right: 18px;
        text-align: center;
        overflow: hidden;
        background: #F6F6F6;
        border: 1px solid #EEE;
        color: #000;
    }
    .biaoqian .ant-checkbox-wrapper-checked {
        color: #1890ff;
        background: #F6F6F6;
        border: 1px solid #1890ff;
    }
    .biaoqian .ant-checkbox-group-item .ant-checkbox {
        display:none;
    }
</style>