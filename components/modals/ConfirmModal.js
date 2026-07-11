import { Modal, View, Text, TouchableOpacity } from "react-native";
import { useAppState } from "../../context/AppStateContext";

const ConfirmModal = () => {
  const { styles, confirmModalVisible, confirmModalData, closeConfirmModal } = useAppState();

  if (!confirmModalData) return null;

  const { title, message, confirmLabel, onConfirm } = confirmModalData;

  const handleConfirm = async () => {
    closeConfirmModal();
    await onConfirm();
  };

  return (
    <Modal
      visible={confirmModalVisible}
      animationType="fade"
      transparent
      onRequestClose={closeConfirmModal}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
        activeOpacity={1}
        onPress={closeConfirmModal}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={{
            backgroundColor: "#111",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#333",
            padding: 20,
            width: "100%",
          }}
        >
          <Text style={styles.title}>{title}</Text>
          {message && (
            <Text style={[styles.statLabel, { marginTop: 8, marginBottom: 20 }]}>
              {message}
            </Text>
          )}

          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={[styles.card, { flex: 1, marginRight: 8 }]}
              onPress={closeConfirmModal}
            >
              <Text style={[styles.statValue, { textAlign: "center" }]}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.card, { flex: 1, borderColor: "#FFB300", borderWidth: 1 }]}
              onPress={handleConfirm}
            >
              <Text style={[styles.statValue, { textAlign: "center", color: "#FFB300" }]}>
                {confirmLabel.toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default ConfirmModal;
