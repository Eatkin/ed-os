import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GoalsScreen from "./GoalsScreen";
import TrajectoryDetailScreen from "../TrajectoryDetailScreen";

const Stack = createNativeStackNavigator();

export function GoalsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GoalsList" component={GoalsScreen} />
      <Stack.Screen
        name="TrajectoryDetail"
        component={TrajectoryDetailScreen}
      />
    </Stack.Navigator>
  );
}
