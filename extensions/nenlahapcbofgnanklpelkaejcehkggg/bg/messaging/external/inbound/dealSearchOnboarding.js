import onboarding from 'logic/onboarding';

export default async () => {
  return onboarding().then(results => {
    if (!results) {
      return {
        error: 'no results found',
        suggestions: results.suggestions
      };
    } else {
      return {
        items: results.history,
        suggestions: results.suggestions
      };
    }
  });
};
