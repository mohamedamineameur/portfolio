import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./contexts/AppProvider.tsx";
import { Routes } from "./config/routes.tsx";
import { Toast } from "./components/ui/Toast.tsx";
import { ProfileMetaImage } from "./components/common/ProfileMetaImage.tsx";

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ProfileMetaImage />
        <Routes />
        <Toast />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
