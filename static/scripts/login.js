const sendLoginRequest = body => {
    const URL = 'http://127.0.0.1:3000/api/login';

    const xhr = new XMLHttpRequest();
    xhr.open('post', URL);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(body));

    xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) {
            return;
        }

        if (xhr.status !== 200) {
            alert(JSON.parse(xhr.response).message);

            return;
        }

        const token = xhr.getResponseHeader('access-token');
        const response = JSON.parse(xhr.responseText);

        localStorage.setItem('access-token', token);
        alert(`Welcome ${response.firstName} ${response.lastName}`);
        window.location.href = './blog.html';
    }
};

const onSubmit = event => {
    event.preventDefault();

    const login = event.target.login.value;
    const password = event.target.password.value;

    sendLoginRequest({ login, password });
};

const main = () => {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', onSubmit);
};

document.addEventListener("DOMContentLoaded", main);
