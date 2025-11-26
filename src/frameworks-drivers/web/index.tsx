import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "@/frameworks-drivers/shared/styles/index.css";

// Render web app (standalone dev build)
const el = document.getElementById("root");
if (!el) {
    throw new Error("root element not found");
}
const root = ReactDOM.createRoot(el);
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
