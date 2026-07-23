import { useAppState } from "../../context/AppStateContext";
import { ApiService } from "../../services/ApiService/ApiService";
import { RESISTANCE_MULTIPLIERS } from "../../services/ApiService/DB.constants";
import FormModal from "../shared/FormModal";

const RESISTANCE_OPTIONS = Object.keys(RESISTANCE_MULTIPLIERS);

const LogActivityModal = () => {
  const {
    logModalVisible,
    closeLogModal,
    logModalTrajectoryId,
    logModalCommitmentId,
    logModalEditingId,
    logs,
    refreshAll,
  } = useAppState();

  const editing = !!logModalEditingId;
  const editingLog = editing
    ? logs.find((l) => l.id === logModalEditingId)
    : null;

  if (editing && !editingLog) return null;

  const fields = editing
    ? [
        {
          key: "note",
          type: "text",
          label: "NOTE",
          placeholder: "What did you work on?",
        },
      ]
    : [
        // Only show the picker when no trajectory was pre-selected
        ...(!logModalTrajectoryId
          ? [
              {
                key: "trajectoryId",
                type: "trajectoryPicker",
                label: "PICK A TRAJECTORY",
                required: true,
              },
            ]
          : []),
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
          placeholder: "What did you work on?",
        },
      ];

  const prefill = editing
    ? { note: editingLog.note }
    : { trajectoryId: logModalTrajectoryId ?? undefined };

  const handleSubmit = async (payload) => {
    if (editing) {
      await ApiService.updateLog(editingLog.id, { note: payload.note });
    } else {
      const trajectoryId = logModalTrajectoryId || payload.trajectoryId;
      const commitmentId = logModalCommitmentId;
      await ApiService.saveActivityLog(
        trajectoryId,
        payload.resistance,
        payload.note,
        commitmentId,
      );
    }
    await refreshAll?.();
  };

  return (
    <FormModal
      visible={logModalVisible}
      title={editing ? "// EDIT LOG NOTE" : "// LOG ACTIVITY"}
      submitLabel={editing ? "UPDATE" : "SUBMIT"}
      fields={fields}
      prefill={prefill}
      onClose={closeLogModal}
      onSubmit={handleSubmit}
    />
  );
};

export default LogActivityModal;
