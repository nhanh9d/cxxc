import { ConfigContext } from 'expo/config';

module.exports = ({ config }: ConfigContext) => {
  if (process.env.MY_ENVIRONMENT === 'production') {
    return {
      ...config
    };
  } else {
    return {
      ...config,
      extra: {
        apiUrl: 'https://6669-14-232-206-135.ngrok-free.app',
        fileUrl: 'https://1cfc-14-232-206-135.ngrok-free.app',
        fileUser: 'cxxc',
        filePassword: 'cxxc@123',
        minio: {
          accessKey: 'IxuuYWSIdf8XFpw6WvAD',
          secretKey: 'jD4Z79wGwD1Va5DO4sO487LzUyl12vhwYQwWxthN',
          useSSL: true,
          endPoint: 'https://1cfc-14-232-206-135.ngrok-free.app',
          port: 443
        }
      }
    };
  }
};