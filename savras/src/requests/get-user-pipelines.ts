import {back_server_path, front_server_path} from "../configuration";

export default async function getUserPipelines() {
    try {
        return fetch(`${back_server_path}/api/v1/pipelines/own`, {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Origin': front_server_path,
            },
            credentials: 'same-origin'
        });
    } catch (error) {
        return null;
    }
}
