// utils/faqTemplates/faqTemplateMap.ts

import {
  getPricingTemplate,
  getFreePlanTemplate,
  getOverviewTemplate,
  getBillingTemplate,
  getContractTemplate,
  getCancelTemplate,
  getOnboardingTemplate,
} from './';

type FaqTemplateEntry = {
  intent: string;
  keywords: string[];
  template: () => { answer: string; relatedQuestions?: string[] };
  description: string;
  weight: number;
};

export const faqTemplateMap: Record<string, FaqTemplateEntry> = {
  pricing: {
    intent: 'pricing',
    keywords: ['料金', '価格', '費用', 'いくら', '有料', '値段', 'プラン', '月額', '利用料'],
    template: getPricingTemplate,
    description: '料金プラン全体に関する質問（Starter / Growth / Enterprise）',
    weight: 1.0,
  },
  freeplan: {
    intent: 'freeplan',
    keywords: ['無料', '0円', 'フリープラン', 'ただで', '無料で使える', '無料の範囲'],
    template: getFreePlanTemplate,
    description: '無料で使えるかどうかに関する質問',
    weight: 1.0,
  },
  overview: {
    intent: 'overview',
    keywords: ['どんなサービス', 'サービス内容', '何ができる', 'どういうこと', '全体像', '特徴', 'できること'],
    template: getOverviewTemplate,
    description: 'Discovery AI の概要や特長に関する質問',
    weight: 1.0,
  },
  billing: {
    intent: 'billing',
    keywords: ['請求', '支払い', '決済', '課金', '締め日', 'タイミング', '引き落とし'],
    template: getBillingTemplate,
    description: '支払い・請求に関する質問',
    weight: 1.0,
  },
  contract: {
    intent: 'contract',
    keywords: ['契約', '期間', '縛り', '更新', '最低利用期間', '自動更新'],
    template: getContractTemplate,
    description: '契約期間や更新などに関する質問',
    weight: 1.0,
  },
  cancel: {
    intent: 'cancel',
    keywords: ['解約', 'キャンセル', 'やめたい', '停止', '退会'],
    template: getCancelTemplate,
    description: 'サービスの解約に関する質問',
    weight: 1.0,
  },
  onboarding: {
    intent: 'onboarding',
    keywords: ['始め方', '導入', '登録', '申し込み', 'はじめて', 'セットアップ'],
    template: getOnboardingTemplate,
    description: '導入や利用開始方法に関する質問',
    weight: 1.0,
  },
};
