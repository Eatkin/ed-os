import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import { VectorSword } from "../../assets/vectors";
import HomeScreen from "../screens/HomeScreen";
import { useAppState } from "../../context/AppStateContext";

const Tab = createBottomTabNavigator();

// Custom button component for the center Tab.Screen
const CustomCenterButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      top: -20, // Elevates the button out of the navigation bar
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
      {children}
    </View>
  </TouchableOpacity>
);

export function NavigationShell() {
  const { styles } = useAppState();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar, // styled with height: 70, etc.
          tabBarActiveTintColor: "#FFB300",
          tabBarInactiveTintColor: "#555555",
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tab.Screen name="Goals" component={HomeScreen} />

        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            // Replace the standard button with our floating circular container
            tabBarButton: (props) => (
              <CustomCenterButton {...props}>
                <VectorSword color="#FFB300" size={28} />
              </CustomCenterButton>
            ),
          }}
        />

        <Tab.Screen name="Vault" component={HomeScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
