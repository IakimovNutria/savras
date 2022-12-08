import {BACKEND_URL, FRONT_SERVER_PATH} from "./configuration";

export default async function uploadFile(file: string) {
    try {
        return fetch(`${BACKEND_URL}/api/v1/files/upload`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Origin': FRONT_SERVER_PATH,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                file: file
            }),
            credentials: 'include'
        });
    } catch (error) {
        return null;
    }
}
