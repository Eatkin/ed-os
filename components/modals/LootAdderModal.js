import { useAppState } from "../../context/AppStateContext";
import { ApiService } from "../../services/ApiService/ApiService";
import FormModal from "../shared/FormModal";

const LootAdderModal = () => {
  const {
    lootAdderModalVisible,
    lootAdderModalEditingId,
    closeLootAdderModal,
    loot,
    refreshAll,
  } = useAppState();

  const editingItem = lootAdderModalEditingId
    ? loot.find((l) => l.id === lootAdderModalEditingId)
    : null;

  if (lootAdderModalEditingId && !editingItem) return null;

  const fields = [
    {
      key: "name",
      type: "text",
      label: "ITEM NAME",
      required: true,
      multiline: false,
    },
    {
      key: "category",
      type: "text",
      label: "CATEGORY",
      placeholder: "e.g. cubing, juggling",
      multiline: false,
    },
    {
      key: "cost",
      type: "text",
      label: "COST (HERO POINTS, BLANK = FREE)",
      placeholder: "e.g. 500",
      multiline: false,
    },
    { key: "notes", type: "text", label: "NOTES" },
    {
      key: "requiredMilestoneId",
      type: "milestonePicker",
      label: "REQUIRED MILESTONE",
    },
    {
      key: "recurring",
      type: "select",
      label: "TYPE",
      options: [
        { value: false, label: "ONE-TIME" },
        { value: true, label: "RECURRING" },
      ],
    },
  ];

  const prefill = editingItem
    ? {
        name: editingItem.name,
        category: editingItem.category,
        cost: editingItem.cost != null ? String(editingItem.cost) : "",
        notes: editingItem.notes,
        requiredMilestoneId: editingItem.requiredMilestoneId ?? null,
        recurring: editingItem.recurring ?? false,
      }
    : { recurring: false };

  const handleSubmit = async (payload) => {
    const cost = payload.cost?.trim() ? parseInt(payload.cost, 10) : null;

    if (editingItem) {
      await ApiService.updateLootItem(editingItem.id, {
        name: payload.name,
        category: payload.category || "misc",
        cost,
        requiredMilestoneId: payload.requiredMilestoneId ?? null,
        notes: payload.notes,
        recurring: payload.recurring ?? false,
      });
    } else {
      await ApiService.createLootItem({
        name: payload.name,
        category: payload.category || "misc",
        cost,
        requiredMilestoneId: payload.requiredMilestoneId ?? null,
        notes: payload.notes,
        recurring: payload.recurring ?? false,
      });
    }
    await refreshAll();
  };

  return (
    <FormModal
      visible={lootAdderModalVisible}
      title={editingItem ? "// EDIT LOOT" : "// ADD LOOT"}
      submitLabel={editingItem ? "UPDATE" : "SUBMIT"}
      fields={fields}
      prefill={prefill}
      onClose={closeLootAdderModal}
      onSubmit={handleSubmit}
    />
  );
};

export default LootAdderModal;
