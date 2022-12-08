import {BACKEND_URL, FRONT_SERVER_PATH} from "./configuration";

export default async function getFiles() {
    try {
        return fetch(`${BACKEND_URL}/api/v1/files/`, {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Origin': FRONT_SERVER_PATH,
            },
            credentials: 'include'
        });
    } catch (error) {
        return null;
    }
}
