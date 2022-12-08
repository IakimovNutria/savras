import {FRONT_SERVER_PATH, BACKEND_URL} from "./configuration";
import authorizationInfoType from "../../types/authorizationInfoType";

export default async function authenticateUser(authorizationInfo: authorizationInfoType) {
    try {
        return fetch(`${BACKEND_URL}/api/v1/user/authentication/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Origin': FRONT_SERVER_PATH,
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: `username=${authorizationInfo.login}&password=${authorizationInfo.password}`,
            credentials: 'include'
        });
    } catch (error) {
        return null;
    }
}
