<template>
    <!-- 标题组件 -->
    <div class="question-wrap" :class="isSelect ? 'selected' : ''" @click="componentCallBack('componentClick', form,index)">
        <div class="question-wrap-item">
            <div class="question-title flex align-center" v-if="form">
                <div class="title-before-line"></div>
                <a-input style="font-size: 14px !important;" v-model="form.value" :disabled="false" :placeholder="form.placeholder" class="form-input mr-10" />
                <a-input-number style="width: 120px" v-model="form.style.fontSize" :min="1" :formatter="value => `${value}px`" :parser="value => value.replace('px', '')" />
                <color-picker :color.sync="form.style.color" />
            </div>
            <!-- 页脚操作 -->
            <slot name="footerActions"></slot>
        </div>
        <!-- 右侧复制删除操作 -->
        <slot name="rightActions"></slot>
    </div>
</template>

<script>
import ColorPicker from '@/components/ColorPicker/ColorPicker'
import myMixin from './Mixin'
export default {
    mixins: [myMixin],
    components: { ColorPicker },
}
</script>

<style lang="less" scoped>
.question-title {
    font-size: 14px !important;
}
.title-before-line {
    width: 6px;
    border-radius: 10px;
    height: 12px;
    background-color: rgb(0, 0, 0);
    box-sizing: border-box;
    margin-right: 2px;
}
</style>