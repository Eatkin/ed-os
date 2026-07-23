import { useState, useEffect } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StyleSheet,
} from "react-native";
import { useAppState } from "../../context/AppStateContext";
import SelectButtons from "./form/SelectButtons";
import TextEntryField from "./form/TextEntryField";
import TrajectoryPickerField from "./form/TrajectoryPickerField";
import AttributeWeightField from "./form/AttributeWeightField";
import MilestonePickerField from "./form/MilestonePickerField";

const FIELD_COMPONENTS = {
  select: SelectButtons,
  text: TextEntryField,
  trajectoryPicker: TrajectoryPickerField,
  attributeWeights: AttributeWeightField,
  milestonePicker: MilestonePickerField,
};

// fields: [{ key, type, label, required, ...props for that field type }]
// prefill: optional { [key]: value } to seed initial values (e.g. trajectoryId from context)
const FormModal = ({
  visible,
  title,
  fields,
  onClose,
  onSubmit,
  prefill = {},
  headerExtra = null,
  submitLabel = "SUBMIT",
}) => {
  const { styles } = useAppState();
  const [values, setValues] = useState(prefill);
  const [submitting, setSubmitting] = useState(false);

  // Re-seed values whenever the modal opens with fresh prefill data
  useEffect(() => {
    if (visible) setValues(prefill);
  }, [visible]);

  const setFieldValue = (key, val) =>
    setValues((prev) => ({ ...prev, [key]: val }));

  const missingRequired = fields.some((f) => f.required && !values[f.key]);

  const handleSubmit = async () => {
    if (missingRequired) return;
    setSubmitting(true);
    try {
      await onSubmit(values);
      setValues({});
      onClose();
    } catch (e) {
      console.error(`Failed to submit ${title}:`, e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setValues({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => {
              Keyboard.dismiss();
              handleClose();
            }}
          />

          <View
            style={{
              backgroundColor: "#111",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              paddingBottom: Platform.OS === "ios" ? 40 : 20,
              maxHeight: "85%",
            }}
          >
            <Text style={styles.title}>{title}</Text>
            {headerExtra}

            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={true}
            >
              {fields.map((field) => {
                const FieldComponent = FIELD_COMPONENTS[field.type];
                if (!FieldComponent) return null;

                const { key, ...fieldProps } = field;
                const helper = field.helperText?.(values);

                return (
                  <View key={key}>
                    <FieldComponent
                      {...fieldProps}
                      value={values[key]}
                      onChange={(val) => setFieldValue(key, val)}
                    />
                    {helper && (
                      <Text
                        style={[
                          styles.statLabel,
                          { color: "#555", marginTop: 4 },
                        ]}
                      >
                        {helper}
                      </Text>
                    )}
                  </View>
                );
              })}

              <TouchableOpacity
                style={[
                  styles.card,
                  {
                    marginTop: 20,
                    opacity: !missingRequired && !submitting ? 1 : 0.4,
                  },
                ]}
                onPress={handleSubmit}
                disabled={missingRequired || submitting}
              >
                <Text style={[styles.statValue, { textAlign: "center" }]}>
                  {submitting ? "SAVING..." : submitLabel}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default FormModal;
