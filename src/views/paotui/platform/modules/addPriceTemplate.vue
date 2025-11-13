<template>
    <a-modal :title="title" :visible="visible" width="55%" :bodyStyle="{ maxHeight: '80vh', overflowY: 'auto' }"
        destroyOnClose :centered="true" @cancel="handleCancle" @ok="handleOk">
        <a-form-model ref="form" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="模板名称" required>
                <a-input v-model="form.name" placeholder="请输入名称" allowClear />
            </a-form-model-item>
            <a-form-model-item label="计价类型" required>
                <a-radio-group v-model="form.type" button-style="solid" @change="onTypeChange">
                    <a-radio-button :value="1">
                        里程计价（1公里）
                    </a-radio-button>
                    <a-radio-button :value="2">
                        里程计价（自定义）
                    </a-radio-button>
                    <p style="margin-top: 0.5rem;color: #999!important;">根据配送里程距离，优先计算起步价，超出部分再按里程计算费用，取起步价+超出里程费作为订单跑腿费
                    </p>
                </a-radio-group>
            </a-form-model-item>

            <a-form-model-item label="自定义超出里程" v-if="form.type == '2'">
                <a-select v-model="form.meter" style="width: 250px;" @change="onMeterChange">
                    <a-select-option :value="100">100米</a-select-option>
                    <a-select-option :value="200">200米</a-select-option>
                    <a-select-option :value="300">300米</a-select-option>
                    <a-select-option :value="400">400米</a-select-option>
                    <a-select-option :value="500">500米</a-select-option>
                    <a-select-option :value="600">600米</a-select-option>
                    <a-select-option :value="700">700米</a-select-option>
                    <a-select-option :value="800">800米</a-select-option>
                    <a-select-option :value="900">900米</a-select-option>
                </a-select>
            </a-form-model-item>

            <a-form-model-item label="里程规则" required>
                <p>当距离在&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <a-input-number step="1" :min="0" :precision="0" v-model="form.start_meter" />&nbsp;&nbsp;
                    米内时，算起步价&nbsp;&nbsp;&nbsp;
                    <a-input-number step="1" :min="0" :precision="1" v-model="form.start_price" />
                    &nbsp;元
                </p>
                <p v-for="(item, index) in form.exceed_miles_rule">
                    在当超过&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <a-input-number v-model="item.meter" step="1" :min="0" :precision="0" />&nbsp;&nbsp;&nbsp;
                    米时，每{{ form.meter_name }}计&nbsp;&nbsp;&nbsp;
                    <a-input-number v-model="item.money" step="1" :min="0" :precision="1" />
                    &nbsp;元

                    <a-icon type="delete" :style="{ fontSize: '1.2rem', color: 'red', marginLeft: '0.5rem' }"
                        @click="removeMile(index)" v-if="index > 0" />
                    <a-icon type="plus-square" :style="{ fontSize: '1.2rem', color: '#1890ff', marginLeft: '0.5rem' }"
                        @click="addMile" v-if="index == form.exceed_miles_rule.length - 1" />
                </p>
            </a-form-model-item>

            <a-form-model-item label="重量规则" required>
                <p v-for="(item, index) in form.exceed_weight_rule" :key="index">
                    当重量在&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <a-input-number v-model="item.min" step="1" :min="0" /> -
                    <a-input-number v-model="item.max" step="1"
                        :min="0" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    公斤时，计价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <a-input-number v-model="item.money" step="1" :min="0" :precision="1" />
                    &nbsp;元
                    <a-icon type="delete" :style="{ fontSize: '1.2rem', color: 'red', marginLeft: '0.5rem' }"
                        @click="removeWeight(index)" v-if="index > 0" />
                    <a-icon type="plus-square" :style="{ fontSize: '1.2rem', color: '#1890ff', marginLeft: '0.5rem' }"
                        @click="addWeight" v-if="index == form.exceed_weight_rule.length - 1" />
                </p>
                <p>
                    重量超出阶梯最大重量，每公斤加价&nbsp;&nbsp;&nbsp;
                    <a-input-number step="1" :min="0" :precision="1" v-model="form.weight_range_add_price" />&nbsp;元
                </p>
            </a-form-model-item>

            <a-form-model-item label="绑定业务" required>
                <a-select v-model="form.bind_business" :disabled="form.id > 0" style="width: 250px;">
                    <a-select-option :value="1">
                        帮我买
                    </a-select-option>
                    <a-select-option :value="2">
                        帮我送
                    </a-select-option>
                    <a-select-option :value="3">
                        帮我送（商家）
                    </a-select-option>
                </a-select>
            </a-form-model-item>

            <a-form-model-item label="是否为专送" v-if="form.bind_business == 3">
                <a-switch checked-children="是" un-checked-children="否" v-model="form.special_delivery" />
                <p style="margin-top: 0.5rem;color: #999!important;">
                    “专送”状态变更时，商家需要重新绑定到该模板，才能生效。
                </p>
            </a-form-model-item>
            <a-form-model-item label="专送接单限制数量" v-if="form.special_delivery && form.bind_business == 3">
                <a-input-number step="1" :min="0" :precision="0" v-model="form.special_delivery_count" />
                <p style="margin-top: 0.5rem;color: #999!important;">
                    限制骑手当前订单数量不超过某个数量情况下，才可接专送订单。0为不限制。
                </p>
            </a-form-model-item>

        </a-form-model>


    </a-modal>
</template>
<script>
import paotuiPlatformApi from '@/api/paotui/index'

const formData = {
    name: '',
    type: 1,
    meter_name: '公里', //默认里程中文名称
    meter: 1000, //默认自定义里程 1000m
    start_meter: '',
    start_price: '',
    exceed_miles_rule: [
        { meter: '', money: '' }
    ],
    max_weight_range_start: '',
    max_weight_range_end: '',
    weight_range_add_price: '',
    exceed_weight_rule: [
        { min: '', max: '', money: '' }
    ],
    bind_business: 1,
    special_delivery: 0,  //专送  1：是  0：否
    special_delivery_count: 0, //专送接单数量限制
}

export default {
    name: 'addPriceTemplate',
    data() {
        return {
            id: 0,
            visible: false,
            title: '新增价格模板',
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
            form: { ...formData },
        }
    },
    created() {

    },
    methods: {
        add() {
            this.visible = true
            this.title = '新增价格模板'
            this.form = {
                ...formData,
            }
        },
        edit(item) {
            this.visible = true
            this.title = '编辑价格模板'
            this.form = {
                ...formData,
                ...item
            }
            if(this.form.meter == 1000){
                this.form.meter_name = '公里';
            }else{
                this.form.meter_name = this.form.meter + '米';
            }
        },
        handleCancle() {
            this.visible = false
            this.title = ''
            this.form = {
                ...formData,
            }
        },
        onTypeChange(e) {
            if (e.target.value == 1) {
                //1公里
                this.form.meter = 1000;
                this.form.meter_name = '公里';
            } else {
                //自定义
                this.form.meter = 500;
                this.form.meter_name = '500米';
            }
        },
        onMeterChange(value) {
            this.form.meter = value;
            this.form.meter_name = value + '米';
        },
        //删除里程规则
        removeMile(index) {
            console.log('removeMile', index)
            if (this.form.exceed_miles_rule.length > 1) {
                this.form.exceed_miles_rule.splice(index, 1);
            }
        },
        //增加里程规则
        addMile() {
            this.form.exceed_miles_rule.push({
                meter: '',
                money: '',
            })
        },
        //删除重量规则
        removeWeight(index) {
            console.log('removeWeight', index)
            if (this.form.exceed_weight_rule.length > 1) {
                this.form.exceed_weight_rule.splice(index, 1);
            }
        },
        //添加重量规则
        addWeight() {
            this.form.exceed_weight_rule.push({ min: '', max: '', money: '' })
        },
        //提交表单
        handleOk() {
            this.request(paotuiPlatformApi.savePriceTemplate, this.form).then((res) => {
                this.$message.success('操作成功')
                this.handleCancle()
                this.$emit('ok');
            })
        },
    },
}

</script>
