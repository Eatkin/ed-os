import { useAppState } from "../../context/AppStateContext";
import { ApiService } from "../../services/ApiService/ApiService";
import FormModal from "../shared/FormModal";

const FRICTION_OPTIONS = ["low", "medium", "high"];

const CreateTrajectoryModal = () => {
  const {
    createTrajectoryModalVisible,
    createTrajectoryModalEditingId,
    closeCreateTrajectoryModal,
    trajectories,
    refreshAll,
  } = useAppState();

  const editingTraj = createTrajectoryModalEditingId
    ? trajectories[createTrajectoryModalEditingId]
    : null;

  if (createTrajectoryModalEditingId && !editingTraj) return null;

  const fields = [
    {
      key: "name",
      type: "text",
      label: "NAME",
      placeholder: "e.g. Pen Spinning",
      required: true,
      multiline: false,
    },
    {
      key: "description",
      type: "text",
      label: "DESCRIPTION",
      placeholder: "What's this about?",
    },
    {
      key: "friction",
      type: "select",
      label: "FRICTION",
      options: FRICTION_OPTIONS,
      required: true,
    },
    {
      key: "attributeWeights",
      type: "attributeWeights",
      label: "ATTRIBUTE WEIGHTS (0 = none, 5 = primary)",
    },
    {
      key: "weeklyTarget",
      type: "text",
      label: "WEEKLY TARGET",
      placeholder: "e.g. 2",
      multiline: false,
    },
    {
      key: "minimumUnit",
      type: "text",
      label: "MINIMUM UNIT (BARE-MINIMUM SESSION)",
      placeholder: "e.g. Just pick it up for 5 minutes",
    },
  ];

  const prefill = editingTraj
    ? {
        name: editingTraj.name,
        description: editingTraj.description,
        friction: editingTraj.friction,
        attributeWeights: editingTraj.attributeWeights ?? {},
        weeklyTarget:
          editingTraj.weeklyTarget != null ? String(editingTraj.weeklyTarget) : "",
        minimumUnit: editingTraj.minimumUnit,
      }
    : {};

  const handleSubmit = async (payload) => {
    // Drop any attribute left at 0 — no point storing zero-weight entries
    const attributeWeights = Object.fromEntries(
      Object.entries(payload.attributeWeights ?? {}).filter(([, w]) => w > 0),
    );

    const trajectoryData = {
      name: payload.name,
      description: payload.description || "",
      friction: payload.friction,
      weeklyTarget: payload.weeklyTarget?.trim()
        ? parseInt(payload.weeklyTarget, 10)
        : 0,
      minimumUnit: payload.minimumUnit || "",
      attributeWeights,
    };

    if (editingTraj) {
      await ApiService.updateTrajectory(editingTraj.id, trajectoryData);
    } else {
      await ApiService.createTrajectory(trajectoryData);
    }
    await refreshAll();
  };

  return (
    <FormModal
      visible={createTrajectoryModalVisible}
      title={editingTraj ? "// EDIT TRAJECTORY" : "// NEW TRAJECTORY"}
      submitLabel={editingTraj ? "UPDATE" : "SUBMIT"}
      fields={fields}
      prefill={prefill}
      onClose={closeCreateTrajectoryModal}
      onSubmit={handleSubmit}
    />
  );
};

export default CreateTrajectoryModal;
