import { useAppState } from "../../context/AppStateContext";
import { ApiService } from "../../services/ApiService/ApiService";
import FormModal from "../shared/FormModal";

const NoteModal = () => {
  const {
    noteModalVisible,
    closeNoteModal,
    noteModalTrajectoryId,
    refreshAll,
  } = useAppState();

  const fields = [
    ...(!noteModalTrajectoryId
      ? [
          {
            key: "trajectoryId",
            type: "trajectoryPicker",
            label: "TRAJECTORY (OPTIONAL)",
            allowNone: true,
          },
        ]
      : []),
    {
      key: "note",
      type: "text",
      label: "NOTE",
      placeholder: "What do you want to remember?",
      required: true,
    },
  ];

  const handleSubmit = async (payload) => {
    const trajectoryId = noteModalTrajectoryId ?? payload.trajectoryId ?? null;
    await ApiService.addNote(trajectoryId, payload.note);
    await refreshAll();
  };

  return (
    <FormModal
      visible={noteModalVisible}
      title="// ADD NOTE"
      fields={fields}
      prefill={{ trajectoryId: noteModalTrajectoryId ?? null }}
      onClose={closeNoteModal}
      onSubmit={handleSubmit}
    />
  );
};

export default NoteModal;
