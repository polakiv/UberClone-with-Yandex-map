import {memo} from 'react';
import { Button } from '@material-ui/core';
import { auth, provider } from './firebase';
import './Login.css'

function Login() {
    const signIn = () => {
        auth.signInWithRedirect(provider).catch(e => alert(e.message))
    }

    return (
        <div className="login">
            <div className="login__container">
                <img
                    src="/logo.png"
                    alt="UberClone"
                />
                <div className="login__text">
                    <h1>Войдите в UberClone</h1>
                </div>

                <Button onClick={signIn}>
                    вместе с Гугл
                </Button>
            </div>
        </div>
    )
}

export default memo(Login)