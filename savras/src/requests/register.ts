export default async function registerUser(login: string, password: string) {
    try {
        return fetch('http://178.250.246.144:8000/api/v1/user/registration/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Origin': 'http://127.0.0.1:3000',
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
