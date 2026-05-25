export const initAnalytics = () => {
  console.log('Menu Africa — Analytics Initialized securely.');
};

export const sendEvent = (eventName: string, params?: Record<string, any>) => {
  console.log(`[Analytics Event] ${eventName}:`, params);
};
