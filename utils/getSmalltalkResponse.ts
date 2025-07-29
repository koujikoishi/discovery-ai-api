const getSmalltalkResponse = (message: string): string => {
  const lower = (message || '').toLowerCase();

  if (lower.includes('こんにちは') || lower.includes('はじめまして')) {
    const options = [
      'こんにちは。こちらこそ、どうぞよろしくお願いいたします。何か気になる点があれば、何でもお知らせくださいね。',
      'はじめまして。サポートに関して、気になることがあればいつでもお伺いします。',
    ];
    return options[Math.floor(Math.random() * options.length)];
  }

  if (lower.includes('元気') || lower.includes('調子')) {
    const options = [
      'ありがとうございます。おかげさまで快調です。何かお力になれることがあれば、すぐにご案内いたしますね。',
      '元気に稼働中です。もし導入やプラン選びでお困りでしたら、お気軽にご相談ください。',
    ];
    return options[Math.floor(Math.random() * options.length)];
  }

  if (lower.includes('好き') || lower.includes('すごい')) {
    const options = [
      'そう言っていただけて光栄です。ご期待に応えられるよう、より良いご提案ができるように努めますね。',
      'ありがとうございます。もしよければ、具体的に何に興味をお持ちか教えていただけますか？より深くご案内できます。',
    ];
    return options[Math.floor(Math.random() * options.length)];
  }

  // fallback（少し踏み込んだ提案付き）
  const fallback = [
    'ありがとうございます。もしよければ、今気になっていることや課題をお聞かせいただけますか？',
    '恐縮です。今の段階で、何かご検討中のことなどあれば、ぜひお伺いしたいです。',
    '嬉しいです。たとえば「料金」「導入方法」「おすすめプラン」など、どのあたりをご案内しましょうか？',
  ];
  return fallback[Math.floor(Math.random() * fallback.length)];
};

export default getSmalltalkResponse;
