<template>
    <div>
        <QuestionnaireSurveyList actionType="signup" />
    </div>
</template>

<script>
import QuestionnaireSurveyList from '@/views/common/platform/QuestionnaireSurvey/QuestionnaireSurveyList.vue'
export default {
    name: 'RegistrationForm',
    components: {
        QuestionnaireSurveyList,
    },
    data() {
        return {}
    }
}
</script>