import {back_server_path, front_server_path} from "../configuration";

export default async function registerUser(login: string, password: string) {
    try {
        return fetch(`${back_server_path}/api/v1/user/registration/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Origin': front_server_path,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: login,
                password: password,
            }),
            credentials: 'include'
        });
    } catch (error) {
        return null;
    }
}
