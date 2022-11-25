
async function setUser() {
    try {
        const response = await fetch('http://178.250.246.144:8000/api/v1/user/registration/', {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'JohnSmith',
                password: 'manager',
            }),
            mode: 'no-cors'
        });
        return await response;
    } catch (error) {
        if (error instanceof Error) {
            console.log('error message: ', error.message);
            return error.message;
        } else {
            console.log('unexpected error: ', error);
            return 'An unexpected error occurred';
        }
    }
}


async function getUsers() {
    try {
        const response = await fetch('http://178.250.246.144:8000/api/v1/user/authentication/', {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': 'Accept',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: "username=Johnith&password=manager",
            mode: 'no-cors'
        });
        return await response
    } catch (error) {
        if (error instanceof Error) {
            console.log('error message: ', error.message);
            return error.message;
        } else {
            console.log('unexpected error: ', error);
            return 'An unexpected error occurred';
        }
    }
}

setUser().then(obj => console.log(obj));

getUsers().then(obj => console.log(obj));
