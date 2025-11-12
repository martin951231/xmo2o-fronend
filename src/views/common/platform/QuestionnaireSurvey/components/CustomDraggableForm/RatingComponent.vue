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
                    <a-rate :disabled="true" style="fontSize: 36px" />
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