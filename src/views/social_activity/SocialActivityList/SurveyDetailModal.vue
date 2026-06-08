<template>
    <a-modal
        :visible="visible"
        title="报名表单"
        :width="500"
        :footer="null"
        @cancel="$emit('close')"
    >
        <div class="survey-detail">
            <div v-for="(item, index) in surveyData" :key="index" class="detail-row">
                <div class="detail-label">{{ item.title }}</div>
                <div v-if="item.type == 'image'" class="detail-value">
                    <img v-for="(img, index) in item.answer" :key="index" :src="img" alt="图片" class="detail-img" />
                </div>
                <div v-else-if="item.type == 'file'" class="detail-value">
                    <a v-for="(file, index) in item.answer" :key="index" :href="file" target="_blank" class="detail-file">附件{{ index+1 }}: {{ file }}<br/></a>
                </div>
                <div v-else class="detail-value">{{ item.answer }}</div>
            </div>
        </div>
    </a-modal>
</template>

<script>
import socialActivityApi from '@/api/social_activity'
export default {
    name: 'SurveyDetailModal',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        orderId: {
            type: Number,
            default: 0
        }
    },
    watch: {
        visible(val) {
            if (val) {
                this.getSurveyDetail()
            }
        }
    },
    data() {
        return {
            surveyData: []
        }
    },
    methods: {
        getSurveyDetail() {
            this.request(socialActivityApi.getOrderSurveyForm, {id: this.orderId}).then(res => {
                this.surveyData = res.list || []
            })
        }
    }
}
</script>

<style scoped>
.survey-detail {
    padding: 16px;
}

.detail-row {
    display: flex;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
    border-bottom: none;
}

.detail-label {
    width: 120px;
    font-weight: 500;
    color: #666;
    flex-shrink: 0;
}

.detail-value {
    flex: 1;
    color: #333;
    word-break: break-all;
}

.detail-img {
    max-width: 200px;
    max-height: 200px;
    margin-right: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
}

.detail-file {
    color: #1890ff;
    text-decoration: underline;
}
</style>