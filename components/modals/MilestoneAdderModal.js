import { useAppState } from "../../context/AppStateContext";
import { ApiService } from "../../services/ApiService/ApiService";
import FormModal from "../shared/FormModal";

const MilestoneAdderModal = () => {
  const {
    milestoneAdderModalVisible,
    closeMilestoneAdderModal,
    milestoneAdderModalTrajectoryId,
    milestoneAdderModalEditingId,
    trajectories,
    refreshAll,
  } = useAppState();

  const editing = !!milestoneAdderModalEditingId;
  const editingMilestone = editing
    ? trajectories[milestoneAdderModalTrajectoryId]?.milestones.find(
        (m) => m.id === milestoneAdderModalEditingId,
      )
    : null;

  if (editing && !editingMilestone) return null;

  const fields = editing
    ? [
        {
          key: "text",
          type: "text",
          label: "MILESTONE",
          placeholder: "What are you working toward?",
          required: true,
        },
      ]
    : [
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

  const prefill = editing
    ? { text: editingMilestone.text }
    : { trajectoryId: milestoneAdderModalTrajectoryId ?? undefined };

  const handleSubmit = async (payload) => {
    if (editing) {
      await ApiService.updateMilestone(
        milestoneAdderModalTrajectoryId,
        milestoneAdderModalEditingId,
        { text: payload.text },
      );
    } else {
      const trajectoryId =
        milestoneAdderModalTrajectoryId || payload.trajectoryId;
      await ApiService.createMilestone(trajectoryId, payload.text);
    }
    await refreshAll();
  };

  return (
    <FormModal
      visible={milestoneAdderModalVisible}
      title={editing ? "// EDIT MILESTONE" : "// CREATE MILESTONE"}
      submitLabel={editing ? "UPDATE" : "SUBMIT"}
      fields={fields}
      prefill={prefill}
      onClose={closeMilestoneAdderModal}
      onSubmit={handleSubmit}
    />
  );
};

export default MilestoneAdderModal;
