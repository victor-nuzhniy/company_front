import React from 'react';
import axios from 'axios';

const Login = (props) => {
    const [login, setLogin] = React.useState({
        email: "",
        password: ""
    });
    const [message, setMessage] = React.useState({
        message: ""
    })
    let sendLogin = async () => {
        await axios.post(
            `${props.host}/auth/login/`, login
        ).then((response) => {
            console.log("Everything ok", response, response.data.data)
            localStorage.setItem('token', response.data.data)
            window.location.reload(false)
        }).catch((error) => {
            console.log("Something went wrong.")
            setMessage({
                "message": "Something went wrong. Try again."
            })
        });
    };
    function handleChange(event) {
        const {name, value} = event.target
        setLogin(prevLogin => ({
            ...prevLogin,
            [name]: value
        }))
    };
    function handleSubmit(event) {
        event.preventDefault()
        sendLogin()
        setLogin({
            email: "",
            password: ""
        })
    };
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="email"
                maxLength="120"
                required
                id="id_email"
                placeholder="Email"
                onChange={handleChange}
                value={login.email}
            />
            <input
                type="text"
                name="password"
                maxLength="120"
                required
                id="id_password"
                placeholder="Password"
                onChange={handleChange}
                value={login.password}
            />

            {message.message && <p>{message.message}</p>}
            <button type="submit">Sign in</button>
        </form>

    )
}

export default Login;
