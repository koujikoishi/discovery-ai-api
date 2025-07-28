// utils/getSuggestedQuestions.ts

export type Intent =
  | 'pricing'
  | 'onboarding'
  | 'cancel'
  | 'recommendation'
  | 'support'
  | '';

export function getSuggestedQuestions(intent: Intent = ''): string[] {
  switch (intent) {
    case 'pricing':
      return [
        '無料プランはありますか？',
        '支払い方法を教えてください',
        'プランごとの違いを知りたい',
      ];
    case 'onboarding':
      return [
        '導入のステップを教えてください',
        '申し込み方法は？',
        'すぐに使い始められますか？',
      ];
    case 'cancel':
      return [
        '解約はすぐにできますか？',
        '解約手順を教えてください',
        'キャンセル時の注意点はありますか？',
      ];
    case 'recommendation':
      return [
        'チームに最適なプランは？',
        'どのプランがおすすめですか？',
        '利用目的に合わせて提案してほしい',
      ];
    case 'support':
      return [
        '問い合わせ先を教えてください',
        'どんなサポートがありますか？',
        '対応時間はいつですか？',
      ];
    default:
      return [
        'Discovery AIの料金を教えてください',
        'どうやって導入を始めればいいですか？',
        'どのプランが自分に合っていますか？',
      ];
  }
}
