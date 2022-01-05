// const DOMAIN = 'https://api.transcript.hungthinhit.com';
const DOMAIN = 'http://127.0.0.1:8080' // Localhost Only | DO NOT USE FOR PRODUCTION !!
const VERSION_API = '/api/';
const API_CLIENT = DOMAIN + VERSION_API + 'client/';
const API_ADMIN = DOMAIN + VERSION_API + 'admin/';

export const CLIENT_LOGIN = API_CLIENT + 'auth/login';
export const CLIENT_REGISTER = API_CLIENT + 'auth/register';
export const CLIENT_CHECK_VALID_TOKEN = API_CLIENT + 'is-valid-token';

// Organization
export const CLIENT_GET_ORG_USER = API_CLIENT + 'organization/users';
export const CLIENT_GET_ORG_SETTING = API_CLIENT + 'organization/setting';
export const CLIENT_CHANGE_ORG_SETTING = API_CLIENT + 'organization/setting';


// Classes
export const CLIENT_GET_CLASSES = API_CLIENT + 'classrooms';
export const CLIENT_UPDATE_CLASSES = API_CLIENT + 'classrooms/';
export const CLIENT_CREATE_CLASSES = API_CLIENT + 'classrooms/';

// Transcript
export const CLIENT_GET_TRANSCRIPT = API_CLIENT + 'transcripts/get-all';
export const CLIENT_GET_DETAIL_TRANSCRIPT_BY_TRXID = API_CLIENT + 'transcripts/get-by-trxid';
export const CLIENT_SUBMIT_TRANSCRIPT = API_CLIENT + 'transcripts/submit';
export const CLIENT_UPDATE_TRANSCRIPT = API_CLIENT + 'transcripts/update';
export const CLIENT_TRACE_TRANSCRIPT = API_CLIENT + 'transcripts/history';

// Major
export const CLIENT_MAJOR_MANAGEMENT = API_CLIENT + 'majors';
export const CLIENT_MAJOR_ASSIGN_SUBJECT = API_CLIENT + 'majors/assign';

// Subject
export const CLIENT_SUBJECT_MANAGEMENT = API_CLIENT + 'subjects';

// Users
export const CLIENT_GET_USER = API_CLIENT + 'users';

// Roles
export const CLIENT_GET_ORGANIZATION_ROLE = API_CLIENT + 'roles';
