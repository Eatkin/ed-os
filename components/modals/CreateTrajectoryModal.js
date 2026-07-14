import { useAppState } from "../../context/AppStateContext";
import { ApiService } from "../../services/ApiService/ApiService";
import FormModal from "../shared/FormModal";

const FRICTION_OPTIONS = ["low", "medium", "high"];

const CreateTrajectoryModal = () => {
  const {
    createTrajectoryModalVisible,
    closeCreateTrajectoryModal,
    refreshAll,
  } = useAppState();

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

  const handleSubmit = async (payload) => {
    // Drop any attribute left at 0 — no point storing zero-weight entries
    const attributeWeights = Object.fromEntries(
      Object.entries(payload.attributeWeights ?? {}).filter(([, w]) => w > 0),
    );

    await ApiService.createTrajectory({
      name: payload.name,
      description: payload.description || "",
      friction: payload.friction,
      weeklyTarget: payload.weeklyTarget?.trim()
        ? parseInt(payload.weeklyTarget, 10)
        : 0,
      minimumUnit: payload.minimumUnit || "",
      attributeWeights,
    });
    await refreshAll();
  };

  return (
    <FormModal
      visible={createTrajectoryModalVisible}
      title="// NEW TRAJECTORY"
      fields={fields}
      onClose={closeCreateTrajectoryModal}
      onSubmit={handleSubmit}
    />
  );
};

export default CreateTrajectoryModal;
