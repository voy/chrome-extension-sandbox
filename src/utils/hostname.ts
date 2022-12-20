const isIpAddress = (hostname: string): boolean => {
  return hostname.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/) !== null;
};

export const isChromeTab = (url: string): boolean => {
  return url.startsWith("chrome://") ?? false;
};

export const getSLD = (hostname: string): string => {
  if (isIpAddress(hostname)) return hostname;

  const parts = hostname.split(".");
  const tld = parts[parts.length - 1];
  const sld = parts[parts.length - 2];

  return `${sld}.${tld}`;
};
