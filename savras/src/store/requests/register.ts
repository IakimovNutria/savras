import {BACKEND_URL, FRONT_SERVER_PATH} from "./configuration";
import authorizationInfoType from "../../types/authorizationInfoType";

export default async function registerUser(authorizationInfo: authorizationInfoType) {
    try {
        return fetch(`${BACKEND_URL}/api/v1/user/registration/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Origin': FRONT_SERVER_PATH,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: authorizationInfo.login,
                password: authorizationInfo.password,
            }),
            credentials: 'include'
        });
    } catch (error) {
        return null;
    }
}
