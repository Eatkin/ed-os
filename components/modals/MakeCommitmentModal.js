import { Text } from "react-native";
import { COMMITMENT_RELUCTANCE_BONUS } from "../../services/ApiService/DB.constants";
import { useAppState } from "../../context/AppStateContext";
import { getExpiryPreset } from "../../utils/commitments";
import { ApiService } from "../../services/ApiService/ApiService";
import FormModal from "../shared/FormModal";

const RELUCTANCE_OPTIONS = Object.keys(COMMITMENT_RELUCTANCE_BONUS);
const EXPIRY_PRESETS = [
  { value: "today", label: "By end of today" },
  { value: "tomorrow", label: "By end of tomorrow" },
  { value: "week", label: "By end of the week" },
];

const CommitmentModal = () => {
  const {
    styles,
    commitmentModalVisible,
    closeCommitmentModal,
    commitmentModalTrajectoryId,
    trajectories,
    refreshAll,
  } = useAppState();

  const preselectedTraj = commitmentModalTrajectoryId
    ? trajectories[commitmentModalTrajectoryId]
    : null;

  const fields = [
    ...(!commitmentModalTrajectoryId
      ? [
          {
            key: "trajectoryId",
            type: "trajectoryPicker",
            label: "PICK A TRAJECTORY",
            required: true,
            helperText: (values) => {
              const traj = values.trajectoryId
                ? trajectories[values.trajectoryId]
                : null;
              return traj?.minimumUnit
                ? `Suggested minimum: ${traj.minimumUnit}`
                : null;
            },
          },
        ]
      : []),
    {
      key: "reluctance",
      type: "select",
      label: "HOW MUCH DO YOU NOT WANT TO DO THIS?",
      options: RELUCTANCE_OPTIONS,
      optionSubtext: (opt) => `+${COMMITMENT_RELUCTANCE_BONUS[opt]} XP bonus`,
      required: true,
    },
    {
      key: "expiryPreset",
      type: "select",
      label: "COMPLETE BY",
      options: EXPIRY_PRESETS,
      required: true,
    },
    {
      key: "notes",
      type: "text",
      label: "REQUIREMENT",
      placeholder: "What are you committing to?",
      required: true,
    },
  ];

  const handleSubmit = async (payload) => {
    const trajectoryId = commitmentModalTrajectoryId || payload.trajectoryId;
    const bonusXP = COMMITMENT_RELUCTANCE_BONUS[payload.reluctance];
    const expiresAt = getExpiryPreset(payload.expiryPreset);
    await ApiService.createCommitment(
      trajectoryId,
      payload.notes,
      expiresAt,
      bonusXP,
    );
    await refreshAll();
  };

  return (
    <FormModal
      visible={commitmentModalVisible}
      title="// MAKE A COMMITMENT"
      fields={fields}
      prefill={{
        trajectoryId: commitmentModalTrajectoryId ?? undefined,
        expiryPreset: "tomorrow",
      }}
      onClose={closeCommitmentModal}
      onSubmit={handleSubmit}
      headerExtra={
        preselectedTraj?.minimumUnit ? (
          <Text
            style={[
              styles.statLabel,
              { color: "#555", marginTop: 4, marginBottom: 8 },
            ]}
          >
            Suggested minimum: {preselectedTraj.minimumUnit}
          </Text>
        ) : null
      }
    />
  );
};

export default CommitmentModal;
