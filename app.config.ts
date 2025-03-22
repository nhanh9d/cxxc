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
        ...config.extra,
        "apiUrl": "https://96ca-2401-d800-91c1-d3f1-c449-6648-7c0a-aee2.ngrok-free.app",
        "fileUrl": "https://288b-2401-d800-91c1-d3f1-c449-6648-7c0a-aee2.ngrok-free.app",
        "fileUser": "cxxc",
        "filePassword": "cxxc@123",
        "minio": {
          "accessKey": "IxuuYWSIdf8XFpw6WvAD",
          "secretKey": "jD4Z79wGwD1Va5DO4sO487LzUyl12vhwYQwWxthN",
          "useSSL": true,
          "endPoint": "https://288b-2401-d800-91c1-d3f1-c449-6648-7c0a-aee2.ngrok-free.app",
          "port": 443
        },
      }
    };
  }
};