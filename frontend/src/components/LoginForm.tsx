import React, { ChangeEventHandler, FormEventHandler, MouseEventHandler, useReducer } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserLoginDetails } from "../types/User";
import { useAuth } from "../services/AuthContext";
import AuthService from "../services/AuthService";
import { LoginState } from "../types/LoginState";
import { Button, Checkbox, FormControlLabel, Link, TextField, Typography } from "@mui/material";
import theme from "../theme";

const initialState: LoginState = {
    username: "",
    password: "",
    isLogin: true,
};

type ACTIONTYPE =
    | { type: "field"; fieldName: string; payload: string }
    | { type: "toggle"; toggleName: string };

function reducer(state: LoginState, action: ACTIONTYPE) {
    switch (action.type) {
        case "field":
            return {
                ...state,
                [action.fieldName]: action.payload,
            };
        case "toggle":
            return {
                ...state,
                [action.toggleName]: !state[action.toggleName as keyof LoginState]
            };
        default:
            throw new Error();
    }
}

export default function LoginForm() {
    const [state, dispatch] = useReducer(reducer, initialState);

    let navigate = useNavigate();
    let location = useLocation();
    let auth = useAuth();
    let from = location.state?.from?.pathname || "/";

    const onUsernameChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        dispatch({ type: 'field', fieldName: 'username', payload: e.currentTarget.value })
    }

    const onPasswordChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        dispatch({ type: 'field', fieldName: 'password', payload: e.currentTarget.value })
    }

    const onLoginToggle: MouseEventHandler<HTMLAnchorElement> = (e) => {
        dispatch({ type: 'field', fieldName: 'username', payload: '' })
        dispatch({ type: 'field', fieldName: 'password', payload: '' })
        dispatch({ type: 'toggle', toggleName: 'isLogin' })
    }

    const handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();

        const user: UserLoginDetails = {
            id: state.username,
            password: state.password
        }
        if (state.isLogin) {
            auth.login(
                user,
                // Navigates user back to where they were redirected
                () => { navigate(from, { replace: true }) }
            )
        } else {
            AuthService.registerApi(user)
        }
    }

    return (
        <form>
            <Typography variant="h4" mb={1}>{state.isLogin ? "Log In" : "Register"}</Typography>
            <TextField fullWidth onChange={onUsernameChange}
                value={state.username}
                id="username-field"
                label="Username"
                variant="outlined"
                margin="dense"
            />
            <TextField fullWidth onChange={onPasswordChange}
                value={state.password}
                id="password-field"
                label="Password"
                type="password"
                autoComplete="current-password"
                margin="dense"
            />
            <Button fullWidth onClick={handleSubmit}
                variant="contained" 
                sx={{ marginY: theme.spacing(1) }}>
                {state.isLogin ? "Login" : "Register"}
            </Button>
            {
                state.isLogin
                    ? <Typography variant="body1">New to Sakura? <Link onClick={onLoginToggle}>Register</Link></Typography>
                    : <Typography variant="body1">Already registered? <Link onClick={onLoginToggle}>Log In</Link></Typography>
            }
        </form>
        // <form onSubmit={handleSubmit}>
        //     <input type="button" name="logreg" onClick={onLoginToggle} value={`${state.isLogin ? "Login" : "Register"}`} /><br />
        //     <label>
        //         username:
        //         <input type="text" name="username" id="username" value={state.username} onChange={onUsernameChange} />
        //     </label>
        //     <br></br>
        //     <label>
        //         password:
        //         <input type="password" name="password" id="password" value={state.password} onChange={onPasswordChange} />
        //     </label><br />
        //     {state.isLogin &&
        //         <label>Remember me
        //             <input type="button" name="rememberme" onClick={onRememberToggle} value={`${state.isRemember}`} />
        //         </label>
        //     }
        //     <br />
        //     <input type="submit" value="Submit" />
        // </form>
    );
}