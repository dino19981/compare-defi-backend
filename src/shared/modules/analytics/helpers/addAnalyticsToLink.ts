export const addAnalyticsToLink = (link: string) => {
  const query = link.split('?')?.[1] || '';

  const connector = query ? '&' : '?';

  return `${link}${connector}utm_source=compare-defi&utm_medium=referral&utm_campaign=compare-defi`;
};
