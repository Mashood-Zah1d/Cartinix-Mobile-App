import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Platform, Text } from "react-native";

const C = {
  bg: "#FAFAF8",
  ink: "#1A1A1A",
  gold: "#B8975A",
  goldFaint: "#F0E8D8",
  border: "#E8E4DE",
  sub: "#9A9690",
};

function TabIcon({ name, label, focused }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      {focused && <View style={styles.activeDot} />}
      <Ionicons
        name={name}
        color={focused ? C.gold : C.sub}
        size={21}
      />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.gold,
        tabBarInactiveTintColor: C.sub,
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: "700",
          letterSpacing: 1.2,
          marginTop: 0,
          marginBottom: Platform.OS === "ios" ? 0 : 4,
        },
        tabBarStyle: {
          height: Platform.OS === "ios" ? 82 : 68,
          paddingBottom: Platform.OS === "ios" ? 24 : 10,
          paddingTop: 8,
          backgroundColor: "#FAFAF8",
          borderTopWidth: 1,
          borderTopColor: "#E8E4DE",
          elevation: 0,
          shadowColor: "#B8975A",
          shadowOpacity: 0.06,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -4 },
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "HOME",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="Products"
        options={{
          title: "WATCHES",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="watch-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="Chatbot"
        options={{
          title: "Chatbot",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="information-circle-outline" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="About"
        options={{
          title: "ABOUT",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="information-circle-outline" focused={focused} />
          ),
        }}
      />

    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 42,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  iconWrapActive: {
    backgroundColor: "#F0E8D8",
    borderWidth: 1,
    borderColor: "#D4B48330",
  },
  activeDot: {
    position: "absolute",
    top: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#B8975A",
  },
});