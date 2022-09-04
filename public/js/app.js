// For Login form
const login = document.getElementById('login-form');
const signup = document.querySelector('.signup');
//Error Message Box
const firstnameError = document.querySelector('.error.firstname');
const lastnameError = document.querySelector('.error.lastname');
const usernameError = document.querySelector('.error.username');
const emailError = document.querySelector('.error.email');
const passwordError = document.querySelector('.error.password');
const aboutError = document.querySelector('.error.about');
// login.addEventListener('submit', async(e) => {
//     e.preventDefault();
//     const email = login.email.value;
//     const password = login.password.value;

//     try {
//         const res = await fetch('/login', {
//             headers: {
//                 'Content-type': 'application/json'
//             },
//             method: 'POST',
//             body: JSON.stringify({
//                 email: email,
//                 password: password
//             })
//         });
//         const data = await res.json();
//         console.log(data);

//     } catch (error) {
//         console.log(error);

//     }
// });


signup.addEventListener('submit', async(e) => {
    e.preventDefault();
    const firstname = signup.firstname.value;
    const lastname = signup.lastname.value;
    const username = signup.username.value;
    const about = signup.about.value;
    const email = signup.email.value;
    const password = signup.password.value;
    firstnameError.textContent = '';
    lastnameError.textContent = '';
    usernameError.textContent = '';
    aboutError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';
    try {
        const res = await fetch('/signup', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                firstname: firstname,
                lastname: lastname,
                username: username,
                about: about,
                email: email,
                password: password,
            })
        });
        const data = await res.json();
        // const err = data.errors[0].msg;
        // console.log(data.errors.email);
        // if (data.errors.email) {
        //     emailError.textContent = data.errors.email;
        //     return;
        // }
        if (data.success !== 'Ok') {


            for (let i = 0; i < data.errors.length; i++) {
                if (data.errors[i].param === 'firstname') {
                    firstnameError.textContent = data.errors[i].msg;
                } else if (data.errors[i].param === 'lastname') {
                    lastnameError.textContent = data.errors[i].msg;
                } else if (data.errors[i].param === 'username') {
                    usernameError.textContent = data.errors[i].msg;
                } else if (data.errors[i].param === 'email') {
                    emailError.textContent = data.errors[i].msg;
                } else if (data.errors[i].param === 'password') {
                    passwordError.textContent = data.errors[i].msg;
                } else if (data.errors[i].param === 'about') {
                    aboutError.textContent = data.errors[i].msg;
                }
            }
        }
        // console.log(err);

        // console.log(data);
        if (data.user) {

            location.assign('/login');
        }
    } catch (error) {
        console.log(error);

    }
});