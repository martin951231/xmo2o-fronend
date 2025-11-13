<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-form-model ref="form" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" @submit="handleSubmit">
            <a-form-model-item label="佣金来源" required>
                <a-radio-group v-model="form.commission_type">
                    <a-radio :value="1">动态佣金</a-radio>
                    <a-radio :value="2">固定佣金</a-radio>
                </a-radio-group>

                <p style="margin-top: 0.5rem;color: #999!important;">
                    用户支付一定的配送费，除去平台抽佣，其余归骑手所得。
                </p>
            </a-form-model-item>

            <a-form-model-item label="佣金设置" required v-if="form.commission_type == 1">
                <a-button @click="add_dynamics_commission_ladder()">
                    <a-icon type="plus" />添加佣金阶梯
                </a-button>
                <p v-for="(item, index) in form.dynamics_commission_ladder">
                    配送费金额小于等于
                    <a-input-number v-model="item.price" :min="0.01" :step="1" :precision="2" />
                    元，抽佣比例
                    <a-input-number v-model="item.commission" :min="0" :step="1" :precision="2" />
                    %

                    <a-icon type="delete" :style="{ fontSize: '1.2rem', color: 'red', marginLeft: '0.5rem' }"
                        @click="delete_dynamics_commission_ladder(index)" />
                </p>

                <p>配送费金额固定抽成 <a-input-number :min="0" :step="1" :precision="2" v-model="form.dynamics_commission" /> %
                </p>
            </a-form-model-item>

            <a-form-model-item label="固定佣金" required v-if="form.commission_type == 2">
                <p>
                    配送距离在
                    <a-input-number :min="0" :step="1" :precision="2" v-model="form.within_distance" />
                    米内，骑手得
                    <a-input-number :min="0" :step="1" :precision="2" v-model="form.within_distance_money" />
                    元
                </p>
                <p v-for="(item, index) in form.fixed_commission_distance_ladder">
                    配送距离超出
                    <a-input-number :min="0" v-model="item.distance" :step="1" :precision="2" />
                    米外，每公里多得
                    <a-input-number :min="0" v-model="item.price" :step="1" :precision="2" />
                    元

                    <a-icon type="delete" @click="delete_fixed_commission_distance_ladder(index)"
                        :style="{ fontSize: '1.2rem', color: 'red', marginLeft: '0.5rem' }" v-if="index > 0" />
                    <a-icon type="plus-square" :style="{ fontSize: '1.2rem', color: '#1890ff', marginLeft: '0.5rem' }"
                        v-if="index == form.fixed_commission_distance_ladder.length - 1"
                        @click="add_fixed_commission_distance_ladder()" />
                </p>

                <p style="margin-top: 0.5rem;color: #999!important;">
                    重量佣金：请按照从小到大的顺序录入重量阶梯。
                </p>

                <p v-for="(item, index) in form.fixed_commission_weight_ladder">
                    当重量在
                    <a-input-number :min="0" :step="1" :precision="2" v-model="item.min_weight" /> -
                    <a-input-number :min="item.min_weight" :step="1" :precision="2" v-model="item.max_weight" /> -
                    公斤时，计价
                    <a-input-number :min="0" :step="1" :precision="2" v-model="item.price" />
                    元

                    <a-icon type="delete" :style="{ fontSize: '1.2rem', color: 'red', marginLeft: '0.5rem' }"
                        v-if="index > 0" @click="delete_fixed_commission_weight_ladder(index)" />
                    <a-icon type="plus-square" :style="{ fontSize: '1.2rem', color: '#1890ff', marginLeft: '0.5rem' }"
                        v-if="index == form.fixed_commission_weight_ladder.length - 1"
                        @click="add_fixed_commission_weight_ladder()" />
                </p>
                <p>
                    重量超出
                    <a-input-number :min="0" :step="1" :precision="2" v-model="exceed_weight" disabled />
                    公斤时，每公斤加价
                    <a-input-number :min="0" :step="1" :precision="2" v-model="form.exceed_weight_add_money" />
                    元
                </p>
            </a-form-model-item>

            <a-form-model-item label="增值服务费抽成率" required>
                <a-input-number :min="0" :step="1" :precision="2" v-model="form.added_services_commission" /> %
            </a-form-model-item>

            <a-form-model-item label="专送服务费抽成率" required>
                <a-input-number :min="0" :step="1" :precision="2" v-model="form.special_services_commission" /> %
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 15, offset: 6 }">
                <a-button type="primary" html-type="submit" styl>保存</a-button>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>

<script>

import PaotuiPlatformApi from '@/api/paotui/index'

export default {
    data() {
        return {
            labelCol: { span: 6 },
            wrapperCol: { span: 15 },
            form: {
                deliver_uid: 0,
                commission_type: 1,  //佣金来源
                dynamics_commission: 0, //动态佣金配送费固定抽成
                dynamics_commission_ladder: [

                ], //动态佣金阶梯
                fixed_commission_distance_ladder: [
                    {
                        distance: 0,
                        price: 0
                    }
                ],//固定佣金配送费金额阶梯
                fixed_commission_weight_ladder: [
                    {
                        min_weight: 0,
                        max_weight: 0,
                        price: 0
                    }
                ],//固定佣金重量阶梯
                within_distance: 0, //固定佣金X配送距离内
                within_distance_money: 0, //固定佣金X配送距离内骑手应得多少元
                exceed_weight: 0, //最大重量
                exceed_weight_add_money: 0,   //超出最大重量每公斤加价多少元

                added_services_commission: 0, //增值服务费抽成率
                special_services_commission: 0, //专送服务费抽成率
            }
        }
    },
    created() {
        if (typeof this.$route.query.uid == 'undefined' || this.$route.query.uid < 1) {
            this.$message.error('参数有误')
            return;
        }
        this.form.deliver_uid = this.$route.query.uid;
        this.getSetting();
    },
    computed: {
        exceed_weight() {
            let max_weight = 0;
            for (let i = 0; i < this.form.fixed_commission_weight_ladder.length; i++) {
                if (this.form.fixed_commission_weight_ladder[i].max_weight > max_weight) {
                    max_weight = this.form.fixed_commission_weight_ladder[i].max_weight;
                }
            }
            this.form.exceed_weight = max_weight;
            return max_weight;
        }
    },
    methods: {
        //动态佣金-添加佣金阶梯
        add_dynamics_commission_ladder() {
            this.form.dynamics_commission_ladder.push({
                price: 0,
                commission: 0
            })
        },
        //动态佣金-删除佣金阶梯
        delete_dynamics_commission_ladder(index) {
            this.form.dynamics_commission_ladder.splice(index, 1)
        },

        //固定佣金-添加距离阶梯
        add_fixed_commission_distance_ladder() {
            this.form.fixed_commission_distance_ladder.push({
                distance: 0,
                price: 0
            })
        },
        //固定佣金-删除距离阶梯
        delete_fixed_commission_distance_ladder(index) {
            this.form.fixed_commission_distance_ladder.splice(index, 1)
        },
        //固定佣金-添加重量阶梯
        add_fixed_commission_weight_ladder() {
            this.form.fixed_commission_weight_ladder.push({
                min_weight: 0,
                max_weight: 0,
                price: 0
            })
        },
        //固定佣金-删除重量阶梯
        delete_fixed_commission_weight_ladder(index) {
            this.form.fixed_commission_weight_ladder.splice(index, 1)
        },

        getSetting() {
            this.request(PaotuiPlatformApi.getRiderCommissionSetting, { deliver_uid: this.form.deliver_uid }).then((res) => {
                if (typeof res.deliver_uid != 'undefined') {
                    this.form = res
                }
            })
        },

        //保存提交
        handleSubmit() {
            this.request(PaotuiPlatformApi.saveRiderCommissionSetting, this.form).then((res) => {
                this.$message.success('保存成功');
                return;
            })
        }
    }
}
</script>