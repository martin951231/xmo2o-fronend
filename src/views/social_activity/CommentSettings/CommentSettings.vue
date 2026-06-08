<template>
    <div class="comment-settings">
        <a-tabs v-model="activeTab" @change="handleTabChange">
            <a-tab-pane tab="评论设置" key="settings">
                <div class="settings-form">
                    <a-form-model ref="formRef" :model="formData" :label-col="{ span: 4 }" :wrapper-col="{ span: 8 }">
                        <a-form-model-item label="评论别名" required prop="comment_alias">
                            <a-input v-model="formData.comment_alias" placeholder="请输入评论别名" />
                        </a-form-model-item>
                        
                        <a-form-model-item label="评论是否审核" required prop="share_audit">
                            <a-radio-group v-model="formData.share_audit">
                                <a-radio :value="1">是</a-radio>
                                <a-radio :value="0">否</a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                       
                        <a-form-model-item :wrapper-col="{ span: 8, offset: 4 }">
                            <a-button type="primary" @click="handleSubmit">保存</a-button>
                        </a-form-model-item>
                    </a-form-model>
                </div>
            </a-tab-pane>
            
            <a-tab-pane tab="敏感词词库" key="sensitive">
                <SensitiveWords />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
import socialActivityApi from '@/api/social_activity/index'
import SensitiveWords from './modules/SensitiveWords.vue'

export default {
    name: 'CommentSettings',
    components: {
        SensitiveWords
    },
    data() {
        return {
            activeTab: 'settings',
            formData: {
                comment_alias: '',
                share_audit: 1,
                enable_sensitive: 1
            }
        }
    },
    created() {
        this.getSettings()
    },
    methods: {
        handleTabChange(key) {
            this.activeTab = key
        },
        
        getSettings() {
            this.request(socialActivityApi.getCommentSettings, {}).then((res) => {
                this.formData = {
                    comment_alias: res.comment_alias || '',
                    share_audit: res.share_audit !== undefined ? res.share_audit : 1,
                    enable_sensitive: res.enable_sensitive !== undefined ? res.enable_sensitive : 1
                }
            })
        },
        
        handleSubmit() {
            this.request(socialActivityApi.saveCommentSettings, this.formData).then((res) => {
                this.$message.success('保存成功')
            })
        }
    }
}
</script>

<style lang="less" scoped>
.comment-settings {
    margin: 10px 0;
    padding: 16px;
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    
    .settings-form {
        padding: 24px;
        
        .form-tip {
            margin-top: 8px;
            font-size: 12px;
            color: #999;
        }
    }
}
</style>
