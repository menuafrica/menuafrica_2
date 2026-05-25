export interface AnalyticsEvent {
  category: 'Builder' | 'Menu_Client' | 'System';
  action: string;
  label?: string;
  value?: number;
}

export const useMenuAnalytics = () => {
  const track = (event: AnalyticsEvent) => {
    // Log Local Console (Mocking GA4/PostHog)
    console.log(`[Analytics] ${event.category} - ${event.action}`, event);
  };

  const trackTemplateSelect = (templateId: string) => {
    track({ category: 'Builder', action: 'select_template', label: templateId });
  };

  const trackPublishTime = (seconds: number) => {
    track({ category: 'Builder', action: 'publish_duration', value: seconds });
  };

  const trackDishView = (dishName: string, dishId: string) => {
    track({ category: 'Menu_Client', action: 'view_dish', label: `${dishName} (${dishId})` });
  };

  const trackCategoryScroll = (categoryName: string) => {
    track({ category: 'Menu_Client', action: 'scroll_category', label: categoryName });
  };

  return {
    track,
    trackTemplateSelect,
    trackPublishTime,
    trackDishView,
    trackCategoryScroll
  };
};
