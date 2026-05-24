export const getGeminiClient = (isPublicContext: boolean) => {
  return {
    models: {
      generateContent: async ({ model, contents, config }: any) => {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, contents, config, isPublicContext })
        });
        if (!response.ok) throw new Error('AI Error');
        const data = await response.json();
        return { text: data.text };
      }
    }
  };
};
