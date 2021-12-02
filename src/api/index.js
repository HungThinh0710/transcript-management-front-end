// const DOMAIN = 'https://api.vnjob.work';
const DOMAIN = 'http://127.0.0.1:8080' // Localhost Only | NOT USING FOR PRODUCTION !!
const VERSION_API = '/api/';
const API_CLIENT = DOMAIN + VERSION_API + 'client/';
const API_ADMIN = DOMAIN + VERSION_API + 'admin/';

export const CLIENT_LOGIN = API_CLIENT + 'auth/login';
export const CLIENT_REGISTER = API_CLIENT + 'auth/register';
export const CLIENT_CHECK_VALID_TOKEN = API_CLIENT + 'is-valid-token';
