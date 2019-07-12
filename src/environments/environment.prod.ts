// `.env.ts` is generated by the `npm run env` command
// `npm run env` exposes environment variables as JSON for any usage you might
// want, like displaying the version or getting extra config from your CI bot, etc.
// This is useful for granularity you might need beyond just the environment.
// Note that as usual, any environment variables you expose through it will end up in your
// bundle, and you should not use it for any sensitive information like passwords or keys.
import env from './.env';

export const environment = {
  production: true,
  version: env.npm_package_version,
  serverUrl: 'http://ec2-52-91-72-157.compute-1.amazonaws.com/api/',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US', 'fr-FR'],
  showLogo: true,
  payStackBaseUrl: 'https://api.paystack.co/',
  // publicKey: 'pk_test_e338dfb13a1bc3e711759520fb73202a5491b0ba',
  publicKey: 'pk_live_2342b6e05e7a95f7edf9d0a37ccf6238c9366645',
  initailDebt: '5000',
  featureLoan: 2
};
