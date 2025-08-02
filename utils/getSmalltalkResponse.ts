const getSmalltalkResponse = (message: string): string => {
  const lower = (message || '').toLowerCase();

  if (lower.includes('こんにちは') || lower.includes('はじめまして')) {
    const options = [
      'こんにちは。何か気になる点があれば、いつでもお知らせください。',
      'はじめまして。必要な情報があれば、すぐにご案内いたします。',
      'こんにちは。サポートが必要でしたら、遠慮なくお申し付けください。',
      'はじめまして。ご不明な点があれば、丁寧にお答えいたします。',
    ];
    return options[Math.floor(Math.random() * options.length)];
  }

  if (lower.includes('元気') || lower.includes('調子')) {
    const options = [
      'おかげさまで、順調に稼働しております。何かございましたらお知らせください。',
      '問題なく動いています。導入に関するご相談などあれば承ります。',
      'はい、大丈夫です。もし何かお困りごとがあれば、お聞かせください。',
      'ありがとうございます。必要な情報があればすぐにお伝えします。',
    ];
    return options[Math.floor(Math.random() * options.length)];
  }

  if (lower.includes('好き') || lower.includes('すごい')) {
    const options = [
      'ご関心をお寄せいただき、ありがとうございます。より詳しい情報が必要でしたらご案内いたします。',
      'ご評価いただき光栄です。どのような点にご興味をお持ちかお聞かせいただけますと、的確なご提案が可能です。',
      'そう言っていただけると励みになります。必要に応じて詳細をご案内します。',
      'ありがとうございます。ご利用の目的などもお聞かせいただけると、より適した提案ができるかと思います。',
    ];
    return options[Math.floor(Math.random() * options.length)];
  }

  if (lower.includes('ありがとう') || lower.includes('助かる')) {
    const options = [
      'お役に立てたようで何よりです。引き続きご不明な点があればお知らせください。',
      'ご丁寧にありがとうございます。今後も必要に応じてご支援いたします。',
      'お力になれたようでうれしく思います。他にも気になる点があればご相談ください。',
      'こちらこそ、ありがとうございます。どのような内容でもお気軽にどうぞ。',
    ];
    return options[Math.floor(Math.random() * options.length)];
  }

  // fallback（控えめなトーンで提案）
  const fallback = [
    'よろしければ、今ご検討中の内容や気になることをお聞かせください。',
    '必要に応じて、導入の流れや料金体系などもご案内可能です。',
    'どのような内容をご希望か、差し支えなければ教えていただけますか？',
    'ご希望のトピック（導入方法・料金・プランなど）があれば、お知らせください。',
    'もしまだ方向性が決まっていない場合も、気軽にご相談ください。',
  ];
  return fallback[Math.floor(Math.random() * fallback.length)];
};

export default getSmalltalkResponse;
