import axios, {AxiosInstance} from 'axios';

const FRONT_SERVER_PATH = "178.250.246.144:3000";
const BACKEND_URL = "http://178.250.246.144:8000/api/v1";

const REQUEST_TIMEOUT = 100000;

export const createAPI = (): AxiosInstance => {
    return axios.create({
        baseURL: BACKEND_URL,
        timeout: REQUEST_TIMEOUT,
        headers: {
            'Access-Control-Allow-Origin': FRONT_SERVER_PATH,
            'Access-Control-Allow-Credentials': true,
        },
        withCredentials: true
    });
};
