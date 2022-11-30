import {back_server_path, front_server_path} from "../configuration";

export default async function createPipeline(name: string) {
    try {
        return fetch(`${back_server_path}/api/v1/pipelines/create`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Origin': front_server_path,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name
            }),
            credentials: 'same-origin'
        });
    } catch (error) {
        return null;
    }
}
