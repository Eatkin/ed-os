import { AppStateProvider } from "./context/AppStateContext";
import { NavigationShell } from "./components/nav/NavBar";
import LogActivityModal from "./components/modals/LogActivityModal";
import MilestoneCompleteModal from "./components/modals/MilestoneCompleteModal";
import QuickActionSheet from "./components/QuickActionSheet";
import ConfirmModal from "./components/modals/ConfirmModal";
import CommitmentModal from "./components/modals/MakeCommitmentModal";

export default function App() {
  return (
    <AppStateProvider>
      <NavigationShell />
      <LogActivityModal />
      <MilestoneCompleteModal />
      <QuickActionSheet />
      <ConfirmModal />
    <CommitmentModal />
    </AppStateProvider>
  );
}
