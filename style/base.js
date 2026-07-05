import { StyleSheet } from "react-native";

const baseStyles = StyleSheet.create({
  // General
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    padding: 16,
  },
  // Typography
  title: {
    color: "#FFB300",
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "monospace",
    marginBottom: 12,
  },
  subtitle: {
    color: "#AAAAAA",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "monospace",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  monospaceText: {
    color: "#E0E0E0",
    fontFamily: "monospace",
    fontSize: 16,
  },

  // Cards & Layout
  card: {
    backgroundColor: "#121212",
    borderWidth: 1,
    borderColor: "#222222",
    borderRadius: 4,
    padding: 16,
    marginBottom: 12,
  },
  statLabel: {
    color: "#999999",
    fontFamily: "monospace",
    fontSize: 14,
  },
  statValue: {
    color: "#FFB300",
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: "600",
  },

  // Navigation
  tabBar: {
    backgroundColor: "#121212",
    borderTopWidth: 1,
    borderTopColor: "#222222",
    paddingBottom: 5,
    height: 60,
  },
  tabLabel: {
    fontFamily: "monospace",
    fontSize: 13,
    textTransform: "uppercase",
  },

  // progress bar for xp (or whatever)
  progressBarBg: {
    width: "100%",
    height: 6,
    backgroundColor: "#333",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 6,
    backgroundColor: "#FFB300",
    borderRadius: 3,
  },
backButton: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 12,
  paddingHorizontal: 4,
  marginBottom: 8,
},
backButtonText: {
  color: "#FFB300",
  fontSize: 16,
  fontFamily: "monospace",
  fontWeight: "bold",
},
});

export default baseStyles;
