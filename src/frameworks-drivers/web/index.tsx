import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "@/frameworks-drivers/shared/styles/index.css";

// Render web app (standalone dev build)
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
