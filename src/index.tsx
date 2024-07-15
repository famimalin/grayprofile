/*=====================================
    Index

    Author: Gray
    CreateTime: 2024 / 04 / 05
=====================================*/
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HelmetProvider } from "react-helmet-async";
import { HashRouter } from "react-router-dom";

/*--------------------------
    Main
--------------------------*/

const dom = (
    <React.StrictMode>
        <HelmetProvider>
            <HashRouter>
                <App />
            </HashRouter>
        </HelmetProvider>
    </React.StrictMode>
);

const isDevMode = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

if (isDevMode || true) {
    const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
    root.render(dom);
} else {
    ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, dom);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
