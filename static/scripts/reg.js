const sendRegisterRequest = body => {
    const URl = 'http://127.0.0.1:3000/api/register';

    fetch(URl, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        body
    })
        .then(response => {
            if (response.ok) {
               alert('Successfully registered!');
               return;
            }

            return response.json().then(res => alert(res.message))
        })
        .catch(error => {
            console.log(`Error while fetching ${error}`);
        });
};

const onSubmit = event => {
    event.preventDefault();

    const login = event.target.login.value;
    const password = event.target.password.value;
    const firstName = event.target.firstName.value;
    const lastName = event.target.lastName.value;

    sendRegisterRequest(JSON.stringify({ login, password, firstName, lastName }));
};

const main = () => {
    const form = document.getElementById('regForm');
    form.addEventListener('submit', onSubmit);
};

document.addEventListener("DOMContentLoaded", main);
