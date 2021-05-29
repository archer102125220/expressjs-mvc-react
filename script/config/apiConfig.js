const apiConfig = {
  API_PREFIX: process.env.API_PREFIX || '',
  API_PORT: process.env.API_PORT || 3000,
  API_HOST: process.env.API_HOST || 'localhost',
  API_PROTOCOL: process.env.API_PROTOCOL || 'http'
};

export const api = apiConfig.API_PROTOCOL + '://' + apiConfig.API_HOST + ':' + apiConfig.API_PORT + '/' + apiConfig.API_PREFIX;
export const socket = apiConfig.API_PROTOCOL + '://' + apiConfig.API_HOST + ':' + apiConfig.API_PORT;