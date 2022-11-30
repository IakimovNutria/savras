import {front_server_path, back_server_path} from "../configuration";

export default async function authenticateUser(login: string, password: string) {
    try {
        return fetch(`${back_server_path}/api/v1/user/authentication/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Origin': front_server_path,
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: `username=${login}&password=${password}`,
            credentials: 'include'
        });
    } catch (error) {
        return null;
    }
}
