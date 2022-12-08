import {BACKEND_URL, FRONT_SERVER_PATH} from "./configuration";

export default async function deletePipeline(id: string) {
    try {
        return fetch(`${BACKEND_URL}/api/v1/pipelines`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Origin': FRONT_SERVER_PATH,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pipeline_id: id
            }),
            credentials: 'include'
        });
    } catch (error) {
        return null;
    }
}
