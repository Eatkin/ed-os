import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import {
  PlusIcon,
  SwordIcon,
  TargetIcon,
  VaultIcon,
  BulbIcon,
} from "../../assets/vectors";
import HomeScreen from "../screens/HomeScreen";
import GoalsScreen from "../screens/GoalsScreen";
import WantsScreen from "../screens/WantsScreen";
import PromptsScreen from "../screens/PromptsScreen";
import { useAppState } from "../../context/AppStateContext";
import NullScreen from "../screens/NullScreen";

const Tab = createBottomTabNavigator();

const CustomCenterButton = ({ onPress }) => (
  <TouchableOpacity
    style={{
      top: -20,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#FFB300",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
    }}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View
      style={{
        width: 65,
        height: 65,
        borderRadius: 33,
        backgroundColor: "#111111",
        borderWidth: 2,
        borderColor: "#FFB300",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PlusIcon color="#FFB300" size={28} />
    </View>
  </TouchableOpacity>
);

export function NavigationShell() {
  const { styles, openLogModal } = useAppState(); // openLogModal: fn that shows the Add Log modal

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: "#FFB300",
          tabBarInactiveTintColor: "#555555",
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <SwordIcon color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Goals"
          component={GoalsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <TargetIcon color={color} size={size} />
            ),
          }}
        />
        {/* Center "screen" is never actually navigated to — it just triggers the modal */}
        <Tab.Screen
          name="AddLog"
          component={NullScreen} // placeholder, unreachable
          options={{
            tabBarButton: () => <CustomCenterButton onPress={openLogModal} />,
          }}
          listeners={{
            tabPress: (e) => e.preventDefault(), // block default nav to placeholder
          }}
        />
        <Tab.Screen
          name="Wants"
          component={WantsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <VaultIcon color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Prompts"
          component={PromptsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <BulbIcon color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
