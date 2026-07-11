import { Modal, Text, TouchableOpacity } from "react-native";
import { useAppState } from "../context/AppStateContext";
import { PlusIcon, TargetIcon, VaultIcon, BulbIcon } from "../assets/vectors";

const QuickActionSheet = () => {
  const {
    styles,
    quickActionsVisible,
    closeQuickActions,
    openLogModal,
    openCommitmentModal,
  } = useAppState();

  const actions = [
    {
      label: "Log Something",
      icon: (color) => <PlusIcon color={color} size={20} />,
      onPress: () => openLogModal(),
    },
    {
      label: "Make a Commitment",
      icon: (color) => <TargetIcon color={color} size={20} />,
      onPress: () => openCommitmentModal(),
    },
    {
      label: "Create a Milestone",
      icon: (color) => <TargetIcon color={color} size={20} />,
      onPress: () => console.log("create milestone — not wired yet"),
    },
    {
      label: "Add Vault Item",
      icon: (color) => <VaultIcon color={color} size={20} />,
      onPress: () => console.log("add vault item — not wired yet"),
    },
    {
      label: "Add Loot",
      icon: (color) => <VaultIcon color={color} size={20} />,
      onPress: () => console.log("add loot — not wired yet"),
    },
    {
      label: "Add a Note",
      icon: (color) => <BulbIcon color={color} size={20} />,
      onPress: () => console.log("add note — not wired yet"),
    },
    // TODO: View all milestones, view notes
  ];

  const handlePress = (action) => {
    closeQuickActions();
    action.onPress();
  };

  return (
    <Modal
      visible={quickActionsVisible}
      animationType="slide"
      transparent
      onRequestClose={closeQuickActions}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }}
        activeOpacity={1}
        onPress={closeQuickActions}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={{
            marginTop: "auto",
            backgroundColor: "#111",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingVertical: 20,
            paddingHorizontal: 16,
          }}
        >
          <Text style={[styles.title, { marginBottom: 8 }]}>// QUICK ACTIONS</Text>
          {actions.map((action) => (
            <TouchableOpacity
              key={action.label}
              onPress={() => handlePress(action)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: "#222",
              }}
            >
              {action.icon("#FFB300")}
              <Text style={[styles.statValue, { marginLeft: 12 }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default QuickActionSheet;
