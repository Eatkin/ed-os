import { Text } from "react-native";
import { useAppState } from "../../context/AppStateContext";
import { RESISTANCE_MULTIPLIERS } from "../../services/ApiService/DB.constants";
import { ApiService } from "../../services/ApiService/ApiService";
import FormModal from "../shared/FormModal";

const RESISTANCE_OPTIONS = Object.keys(RESISTANCE_MULTIPLIERS);

const MilestoneCompleteModal = () => {
  const {
    styles,
    milestoneModalVisible,
    closeMilestoneModal,
    milestoneModalData,
    trajectories,
    refreshAll,
  } = useAppState();

  const traj = milestoneModalData
    ? trajectories[milestoneModalData.trajectoryId]
    : null;
  const milestone = traj?.milestones.find(
    (m) => m.id === milestoneModalData?.milestoneId,
  );

  if (!milestone) return null;

  const fields = [
    {
      key: "resistance",
      type: "select",
      label: "RESISTANCE",
      options: RESISTANCE_OPTIONS,
      required: true,
    },
    {
      key: "note",
      type: "text",
      label: "NOTE (OPTIONAL)",
      placeholder: "How did it go?",
    },
  ];

  const handleSubmit = async (payload) => {
    await ApiService.clearMilestoneWithLog(
      milestoneModalData.trajectoryId,
      milestoneModalData.milestoneId,
      payload.resistance,
      payload.note,
    );
    await refreshAll();
  };

  return (
    <FormModal
      visible={milestoneModalVisible}
      title="// MILESTONE CLEARED"
      fields={fields}
      onClose={closeMilestoneModal}
      onSubmit={handleSubmit}
      headerExtra={<Text style={styles.subtitle}>{milestone.text}</Text>}
    />
  );
};

export default MilestoneCompleteModal;
