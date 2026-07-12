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
import PromptsScreen from "../screens/PromptsScreen";
import { useAppState } from "../../context/AppStateContext";
import NullScreen from "../screens/NullScreen";
import { GoalsStack } from "../goalsScreen/GoalsStack";
import { HomeStack } from "../homeScreen/HomeStack";
import WantsScreen from "../wantsScreen/WantsScreen";
import { navigationRef } from "../../navigation/navigationRef";

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
  const { styles, openQuickActions } = useAppState(); // openLogModal: fn that shows the Add Log modal

  return (
    <NavigationContainer ref={navigationRef}>
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
          component={HomeStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <SwordIcon color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Goals"
          component={GoalsStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <TargetIcon color={color} size={size} />
            ),
          }}
        />
        {/* Center "screen" is never actually navigated to — it just triggers the modal */}
        <Tab.Screen
          name="AddLog"
          component={NullScreen}
          options={{
            tabBarButton: () => (
              <CustomCenterButton onPress={() => openQuickActions()} />
            ),
          }}
          listeners={{
            tabPress: (e) => e.preventDefault(),
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
