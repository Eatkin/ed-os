import { useAppState } from "../../context/AppStateContext";
import { ApiService } from "../../services/ApiService/ApiService";
import FormModal from "../shared/FormModal";

const NoteModal = () => {
  const {
    noteModalVisible,
    closeNoteModal,
    noteModalTrajectoryId,
    noteModalEditingId,
    notes,
    refreshAll,
  } = useAppState();

  const editing = !!noteModalEditingId;
  const editingNote = editing
    ? notes.find((n) => n.id === noteModalEditingId)
    : null;

  if (editing && !editingNote) return null;

  const fields = [
    ...(editing || !noteModalTrajectoryId
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

  const prefill = editing
    ? { trajectoryId: editingNote.trajectoryId ?? null, note: editingNote.note }
    : { trajectoryId: noteModalTrajectoryId ?? null };

  const handleSubmit = async (payload) => {
    if (editing) {
      await ApiService.updateNote(editingNote.id, {
        note: payload.note,
        trajectoryId: payload.trajectoryId ?? null,
      });
    } else {
      const trajectoryId =
        noteModalTrajectoryId ?? payload.trajectoryId ?? null;
      await ApiService.addNote(trajectoryId, payload.note);
    }
    await refreshAll();
  };

  return (
    <FormModal
      visible={noteModalVisible}
      title={editing ? "// EDIT NOTE" : "// ADD NOTE"}
      submitLabel={editing ? "UPDATE" : "SUBMIT"}
      fields={fields}
      prefill={prefill}
      onClose={closeNoteModal}
      onSubmit={handleSubmit}
    />
  );
};

export default NoteModal;
