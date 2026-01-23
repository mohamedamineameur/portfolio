import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./contexts/AppProvider.tsx";
import { Routes } from "./config/routes.tsx";

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
