type LanguageModel = {
  name: string;
  image: string;
};

export const languageModels: LanguageModel[] = [
  {
    name: 'GPT',
    image: '/chat-gpt.png',
  },
  {
    name: 'Deep Seek',
    image: '/deep-seek.png',
  },
  {
    name: 'Claude',
    image: '/claude.png',
  },
  {
    name: 'Grok',
    image: '/grok.png',
  },
];
