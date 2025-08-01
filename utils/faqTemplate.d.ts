// utils/faqTemplate.d.ts

export interface AnswerTemplate {
  answer: string;
  relatedQuestions: string[];
}

export function getOverviewTemplate(): AnswerTemplate;
export function getPricingTemplate(): AnswerTemplate;
export function getCancelTemplate(): AnswerTemplate;
export function getContractTemplate(): AnswerTemplate;
export function getOnboardingTemplate(): AnswerTemplate;
export function getFreePlanTemplate(): AnswerTemplate;
export function getRecommendationStarterTemplate(): AnswerTemplate;
export function getRecommendationGrowthTemplate(): AnswerTemplate;
export function getRecommendationEnterpriseTemplate(): AnswerTemplate;
export function getFunctionTemplate(): AnswerTemplate;
export function getIndustryTemplate(): AnswerTemplate;
export function getSupportTemplate(): AnswerTemplate;
export function getLoginIssueTemplate(): AnswerTemplate;
export function getSecurityTemplate(): AnswerTemplate;
export function getIntegrationTemplate(): AnswerTemplate;
export function getComplianceTemplate(): AnswerTemplate;
export function getBillingTemplate(): AnswerTemplate;
export function getDifferenceTemplate(): AnswerTemplate;
export function getLayoutTestTemplate(): AnswerTemplate;
