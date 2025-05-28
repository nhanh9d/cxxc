import { ConfigContext } from 'expo/config';

module.exports = ({ config }: ConfigContext) => {
  if (process.env.MY_ENVIRONMENT === 'production') {
    return {
      ...config
    };
  } else {
    return {
      ...config,
    };
  }
};