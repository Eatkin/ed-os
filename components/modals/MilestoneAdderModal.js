import { useAppState } from "../../context/AppStateContext";
import { ApiService } from "../../services/ApiService/ApiService";
import FormModal from "../shared/FormModal";

const MilestoneAdderModal = () => {
  const {
    milestoneAdderModalVisible,
    closeMilestoneAdderModal,
    milestoneAdderModalTrajectoryId,
    refreshAll,
  } = useAppState();

  const fields = [
    ...(!milestoneAdderModalTrajectoryId
      ? [
          {
            key: "trajectoryId",
            type: "trajectoryPicker",
            label: "TRAJECTORY",
            required: true,
          },
        ]
      : []),
    {
      key: "text",
      type: "text",
      label: "MILESTONE",
      placeholder: "What are you working toward?",
      required: true,
    },
  ];

  const handleSubmit = async (payload) => {
    const trajectoryId = milestoneAdderModalTrajectoryId || payload.trajectoryId;
    await ApiService.createMilestone(trajectoryId, payload.text);
    await refreshAll();
  };

  return (
    <FormModal
      visible={milestoneAdderModalVisible}
      title="// CREATE MILESTONE"
      fields={fields}
      prefill={{ trajectoryId: milestoneAdderModalTrajectoryId ?? undefined }}
      onClose={closeMilestoneAdderModal}
      onSubmit={handleSubmit}
    />
  );
};

export default MilestoneAdderModal;
