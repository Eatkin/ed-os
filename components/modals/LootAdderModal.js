import { useAppState } from "../../context/AppStateContext";
import { ApiService } from "../../services/ApiService/ApiService";
import FormModal from "../shared/FormModal";

const LootAdderModal = () => {
  const { lootAdderModalVisible, closeLootAdderModal, refreshAll } = useAppState();

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
  ];

  const handleSubmit = async (payload) => {
    const cost = payload.cost?.trim() ? parseInt(payload.cost, 10) : null;
    await ApiService.createLootItem({
      name: payload.name,
      category: payload.category || "misc",
      cost,
      requiredMilestoneId: payload.requiredMilestoneId ?? null,
      notes: payload.notes,
    });
    await refreshAll();
  };

  return (
    <FormModal
      visible={lootAdderModalVisible}
      title="// ADD LOOT"
      fields={fields}
      onClose={closeLootAdderModal}
      onSubmit={handleSubmit}
    />
  );
};

export default LootAdderModal;
