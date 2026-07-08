import { AppStateProvider } from "./context/AppStateContext";
import { NavigationShell } from "./components/nav/NavBar";
import LogActivityModal from "./components/modals/LogActivityModal";
import MilestoneCompleteModal from "./components/modals/MilestoneCompleteModal";

export default function App() {
  return (
    <AppStateProvider>
      <NavigationShell />
      <LogActivityModal />
      <MilestoneCompleteModal />
    </AppStateProvider>
  );
}
