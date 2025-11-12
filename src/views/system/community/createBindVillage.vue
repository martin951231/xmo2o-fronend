<template>
  <a-modal :title="title" :width="640" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">


        <a-page-header
            :ghost="false"
            :title="detail.community_name"
            :sub-title="detail.community_name"
            style="padding: 10px 5px;"
        >
            <a-descriptions  :column="2">
                <a-descriptions-item label="街道详细地址">
                   <a>{{detail.address_detail}}</a>
                </a-descriptions-item>
                <a-descriptions-item label="省市区">
                    {{detail.community_address}}
                </a-descriptions-item>
                <a-descriptions-item :label="$store.getters.config.single_name+'结构'">
                    {{detail.struct_name}}
                </a-descriptions-item>
                <a-descriptions-item label="社区面积">
                    <a>{{detail.community_square_meter}}</a>
                </a-descriptions-item>
                <a-descriptions-item label="负责人">
                    {{detail.charge_person_name}}
                </a-descriptions-item>
                <a-descriptions-item label="最新获取时间">
                    {{detail.new_time_txt}}
                </a-descriptions-item>
                <a-descriptions-item :label="'选择要绑定的'+$store.getters.config.house_name">
                    <a-select
                        show-search
                        :placeholder="'选择'+$store.getters.config.house_name"
                        option-filter-prop="children"
                        style="width: 200px"
                        :filter-option="filterOption"
                        @focus="handleFocus"
                        @blur="handleBlur"
                        @change="handleChange"
                        v-model="chooseId"
                    >
                        <a-select-option v-for="(item,index) in list" :value="item.village_id" :key="index">
                            {{item.choose_name}}
                        </a-select-option>
                    </a-select>
                </a-descriptions-item>
            </a-descriptions>
        </a-page-header>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
    import deviceApi from '@/api/system/community/device';
	import store from '@/store';
    export default {
        data() {
            return {
                title: '绑定'+store.getters.config.house_name,
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
                visible: false,
                confirmLoading: false,
                form: this.$form.createForm(this),
                detail: {},
                list: {},
                community_id: '',
                dataLoad: false,
                dataLoad1: false,
                chooseId: '',
            }
        },
        mounted() {
            // this.getEditInfo();
        },
        methods: {
             filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            handleChange(value) {
                console.log(`selected ${value}`);
                this.village_id = value
            },
            handleBlur() {
                console.log('blur');
            },
            handleFocus() {
                console.log('focus');
            },
            add(community_id) {
                this.dataLoad       = false;
                this.dataLoad1      = false;
                this.confirmLoading = true
                this.title          = '绑定'+store.getters.config.house_name
                this.visible        = true
                 this.village_id    = ''
                 this.chooseId      = ''
                this.community_id   = community_id
                this.getCommunity(community_id)
                this.getVillageList()
            },
            getCommunity(community_id) {
                if (this.dataLoad) {
                    return false
                }
                this.dataLoad   = true;
                this.request(deviceApi.getCommunity, {community_id: community_id})
                    .then((res) => {
                        this.detail = res;
                        this.dataLoad   = false;
                    })
            },
            getVillageList() {
                if (this.dataLoad1) {
                    return false
                }
                this.dataLoad1   = true;
                this.request(deviceApi.getVillageList)
                    .then((res) => {
                        this.list = res.list;
                        console.log('this.list', this.list);
                        this.confirmLoading = false
                        this.dataLoad1   = false;
                    })
            },
            handleSubmit() {
                this.confirmLoading = true
                let param = {}
                if (!this.village_id) {
                    this.$message.warning('请选择要绑定的'+store.getters.config.house_name)
                    this.confirmLoading = false
                    return false;
                }
                param['village_id']   = this.village_id
                param['community_id'] = this.community_id
                this.request(deviceApi.bindHouseToSystemCommunity, param)
                    .then((res) => {
                        this.$message.success('绑定成功')
                        setTimeout(() => {
                            this.form = this.$form.createForm(this)
                            this.visible = false
                            this.confirmLoading = false
                            this.$emit('ok', param)
                        }, 1500)
                    })
                    .catch((error)=>{
                        this.confirmLoading = false
                    })
            },
            handleCancel() {
                this.visible = false
                setTimeout(() => {
                    this.form = this.$form.createForm(this)
                }, 500)
            },
        },
    }
</script>
