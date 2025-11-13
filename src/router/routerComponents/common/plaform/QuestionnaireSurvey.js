/**
 *******************
 *   @description 问卷调查
 *******************
 */
 const robotPlaformComponents = {
    // 你需要动态引入的页面组件
    'QuestionnaireSurveyList': () => import('@/views/common/platform/QuestionnaireSurvey/QuestionnaireSurveyList'),
    'QuestionnaireSurveyDetail': () => import('@/views/common/platform/QuestionnaireSurvey/QuestionnaireSurveyDetail'),
}
  export default robotPlaformComponents
  