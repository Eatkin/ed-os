import { AppStateProvider } from "./context/AppStateContext";
import { NavigationShell } from "./components/nav/NavBar";
import LogActivityModal from "./components/modals/LogActivityModal";

export default function App() {
  return (
    <AppStateProvider>
      <NavigationShell />
    <LogActivityModal />
    </AppStateProvider>
  );
}
