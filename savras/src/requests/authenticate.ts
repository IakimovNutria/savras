export default async function authenticateUser(login: string, password: string) {
    try {
        return fetch('http://178.250.246.144:8000/api/v1/user/authentication/', {
            method: 'POST',
            headers: {
                'Accept': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Origin': 'http://127.0.0.1:3000',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: `username=${login}&password=${password}`,
            credentials: 'include'
        });
    } catch (error) {
        return null;
    }
}
