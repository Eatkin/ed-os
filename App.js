import { AppStateProvider } from "./context/AppStateContext";
import { NavigationShell } from "./components/nav/NavBar";

export default function App() {
  return (
    <AppStateProvider>
      <NavigationShell />
    </AppStateProvider>
  );
}
