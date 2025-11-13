<template>
    <!-- 标题组件 -->
    <div class="question-wrap" :class="isSelect ? 'selected' : ''" @click="componentCallBack('componentClick', form,index)">
        <div class="question-wrap-item" v-if="form">
            <div class="question-title flex align-center">
                <div class="no" :class="form.required ? 'required' : ''" v-if="no">{{no}}.</div>
                <a-textarea v-model="form.title" :placeholder="L('请输入标题')" auto-size class="form-input" />
            </div>
            <div class="question-wrap-center">
                <a-form-model-item>
                    <a-radio-group v-model="form.value">
                        <draggable v-model="form.question_options" :sort="true" animation="200" style="margin-left: -25px">
                            <div class="question-wrap-center-input flex align-center form-input" v-for="item in form.question_options" :key="item.value">
                                <div class="move-icon">
                                    <a-icon type="more" />
                                    <a-icon type="more" />
                                </div>
                                <a-input v-model="item.label" :placeholder="L('请输入')" size="large">
                                    <a-radio :style="radioStyle" :disabled="disabled" slot="prefix" :value="item.value"></a-radio>
                                </a-input>
                                <div class="delete-icon pl-10 cursor-pointer" @click="componentCallBack('deleteOption', item, index)">
                                    <a-icon type="delete" />
                                </div>
                            </div>
                        </draggable>

                        <div class="question-wrap-center-input flex align-center form-input" v-if="form.extra_config.is_other">
                            <a-input v-model="form.extra_config.is_other_name" :placeholder="L('请输入')" size="large">
                                <a-radio :style="radioStyle" :disabled="disabled" slot="prefix"></a-radio>
                            </a-input>
                            <div class="delete-icon pl-10 cursor-pointer" @click="deleteOther">
                                <a-icon type="delete" />
                            </div>
                        </div>
                        <div class="other-input" v-if="form.extra_config.is_other">
                            <a-input :placeholder="L('请输入')" :disabled="disabled"></a-input>
                        </div>
                    </a-radio-group>
                </a-form-model-item>
            </div>
            <!-- 页脚操作 -->
            <slot name="footerActions"></slot>
        </div>
        <!-- 右侧复制删除操作 -->
        <slot name="rightActions"></slot>
    </div>
</template>

<script>
import myMixin from './Mixin'
export default {
    mixins: [myMixin],
}
</script>

<style lang="less" scoped>
</style>