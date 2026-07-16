import { Modal, Text, TouchableOpacity } from "react-native";
import { useAppState } from "../context/AppStateContext";
import { getAllMilestones } from "../utils/trajectories";
import { navigate } from "../navigation/navigationRef";
import MilestoneItem from "./shared/MilestoneItem";
import { Coins, Crosshair, GalleryHorizontalEnd, LandPlot, NotebookPen, Route, ScrollText, Vault } from "lucide-react-native";

const QuickActionSheet = () => {
  const {
    styles,
    trajectories,
    quickActionsVisible,
    closeQuickActions,
    openLogModal,
    openCommitmentModal,
    openNoteModal,
    openMilestoneAdderModal,
    openLootAdderModal,
    openCreateTrajectoryModal,
  } = useAppState();

  const actions = [
    {
      label: "Log Something",
      icon: (colour) => <ScrollText color={colour} size={20} />,
      onPress: () => openLogModal(),
    },
    {
      label: "Make a Commitment",
      icon: (colour) => <Crosshair color={colour} size={20}/>,
      onPress: () => openCommitmentModal(),
    },
    {
      label: "Create a Trajectory",
      icon: (colour) => <Route color={colour} size={20}/>,
      onPress: () => openCreateTrajectoryModal(),
    },
    {
      label: "Create a Milestone",
      icon: (colour) => <LandPlot color={colour} size={20} />,
      onPress: () => openMilestoneAdderModal(),
    },
    {
      label: "Add Vault Item",
      icon: (colour) => <Vault color={colour} size={20} />,
      onPress: () => console.log("add vault item — not wired yet"),
    },
    {
      label: "Add Loot",
      icon: (colour) => <Coins color={colour} size={20} />,
      onPress: () => openLootAdderModal(),
    },
    {
      label: "Add a Note",
      icon: (colour) => <NotebookPen color={colour} size={20} />,
      onPress: () => openNoteModal(),
    },
    {
      label: "View all Milestones",
      icon: (colour) => <GalleryHorizontalEnd color={colour} size={20} />,
      onPress: () =>
        navigate("ListScreen", {
          title: "// ALL MILESTONES",
          computeData: () => getAllMilestones(trajectories),
          ItemComponent: MilestoneItem,
          itemProp: "milestone",
          emptyLabel: "NO_MILESTONES_YET",
        }),
    },
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
          <Text style={[styles.title, { marginBottom: 8 }]}>
            // QUICK ACTIONS
          </Text>
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
              <Text style={[styles.statValue, { marginLeft: 12 }]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default QuickActionSheet;
