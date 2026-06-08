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
                    <a-upload-dragger name="file" :disabled="disabled">
                        <p class="ant-upload-drag-icon">
                            <a-icon type="inbox" />
                        </p>
                        <p class="ant-upload-text">{{L('单击或拖动文件到此区域进行上传')}}</p>
                        <p class="ant-upload-hint">{{L('请上传jpg/png/pdf文件')}}</p>
                    </a-upload-dragger>
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