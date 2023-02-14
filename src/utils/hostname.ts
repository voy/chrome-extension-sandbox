export const isChromeTab = (url: string): boolean => {
  return url.startsWith("chrome://") ?? false;
};
