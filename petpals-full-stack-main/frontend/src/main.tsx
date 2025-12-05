import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import './index.css'; 
import AuthUserProvider from './auth/AuthUserProvider.tsx'; 
import { auth } from './firebaseClient'; 
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter> 
            <AuthUserProvider auth={auth}>
                <App />
            </AuthUserProvider>
        </BrowserRouter>
    </React.StrictMode>
);