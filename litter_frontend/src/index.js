import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { AuthProvider } from '@propelauth/react';
import { RequiredAuthProvider } from '@propelauth/react';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <RequiredAuthProvider authUrl={process.env.REACT_APP_AUTH_URL}>
        <App/>
    </RequiredAuthProvider>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
