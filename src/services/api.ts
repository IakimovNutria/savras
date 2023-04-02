import axios, { AxiosInstance } from 'axios';

const FRONT_SERVER_PATH = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:8000/api/v1';

const REQUEST_TIMEOUT = 10000;

export const createAPI = (): AxiosInstance => axios.create({
	baseURL: BACKEND_URL,
	timeout: REQUEST_TIMEOUT,
	headers: {
		'Access-Control-Allow-Origin': FRONT_SERVER_PATH,
		'Access-Control-Allow-Credentials': true,
	},
	withCredentials: true,
});
