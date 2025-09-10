import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setupGlobalErrorHandler } from "./utils/errorHandler";

// Setup global error handling for wallet extension conflicts
setupGlobalErrorHandler();

createRoot(document.getElementById("root")!).render(<App />);
