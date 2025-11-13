
const questionnaireSurveyApi = {
    getSurveyList: '/survey/platform.SurveyForm/index', //调查列表
    getSurveyDetail: '/survey/platform.SurveyForm/detail', //问卷详情
    saveSurvey: '/survey/platform.SurveyForm/save', //保存问卷
    changeForm: '/survey/platform.SurveyForm/changeForm', //更改问卷
    overview: '/survey/platform.SurveyStatistics/overview', //问卷统计
    formSubmitList: '/survey/platform.Submit/formSubmitList', //问卷提交列表
}

export default questionnaireSurveyApi
