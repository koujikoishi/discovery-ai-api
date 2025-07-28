export function getSuggestedQuestions(intent) {
  switch (intent) {
    case 'pricing':
      return [
        'Discovery AIは無料で使えますか？',
        '料金プランについて教えてください',
        '支払い方法には何がありますか？',
        '初期費用はかかりますか？',
      ];
    case 'onboarding':
      return [
        '導入の流れを教えてください',
        'アカウントはどこで作れますか？',
        'どのような準備が必要ですか？',
        '最短でどれくらいで始められますか？',
      ];
    case 'cancel':
      return [
        '解約方法を教えてください',
        '契約期間の縛りはありますか？',
        '解約後も使えますか？',
        'キャンセル料はかかりますか？',
      ];
    case 'recommendation':
      return [
        'おすすめのプランを教えてください',
        '自分に合ったプランを知りたい',
        'チーム人数で選ぶとどうなりますか？',
        '目的別に最適な使い方は？',
      ];
    case 'support':
      return [
        'サポート体制について教えてください',
        'チャットサポートは何時まで使えますか？',
        '有人対応はありますか？',
      ];
    case 'function':
      return [
        'どんな機能がありますか？',
        'AIは何ができますか？',
        'できないことはありますか？',
      ];
    case 'industry':
      return [
        '他の業界でも使えますか？',
        '医療業界では使えますか？',
        '教育現場にも対応していますか？',
      ];
    case 'faq':
    default:
      return [
        'Discovery AIとは何ですか？',
        'ログインできません',
        'メールが届きません',
        '使い方を教えてください',
      ];
  }
}
