import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppState } from "../../context/AppStateContext";
import BackButton from "../shared/BackButton";

// title, data, ItemComponent, itemProp (the prop name ItemComponent expects, e.g. "log")
const ListScreen = ({ navigation, route }) => {
  const {
    title,
    dataKey,
    computeData,
    ItemComponent,
    itemProp = "item",
    emptyLabel,
  } = route.params;
  const appState = useAppState();
  const { styles } = appState;

  const data = computeData ? computeData(appState) : (appState[dataKey] ?? []);

  return (
    <SafeAreaView style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} />
      <Text style={styles.title}>{title}</Text>
      <ScrollView>
        {data.length > 0 ? (
          data.map((entry) => (
            <ItemComponent key={entry.id} {...{ [itemProp]: entry }} />
          ))
        ) : (
          <Text style={styles.monospaceText}>&gt; {emptyLabel}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ListScreen;
