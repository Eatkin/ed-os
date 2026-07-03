import { StyleSheet } from "react-native";

const baseStyles = StyleSheet.create({
  // General
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    padding: 16,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  content: {
    flex: 1,
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
    color: "#FFB300",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "monospace",
    marginBottom: 8,
  },
  monospaceText: {
    color: "#E0E0E0",
    fontFamily: "monospace",
    fontSize: 16,
  },
  monospaceSmall: {
    color: "#999999",
    fontFamily: "monospace",
    fontSize: 14,
  },
  label: {
    color: "#999999",
    fontFamily: "monospace",
    fontSize: 14,
    textTransform: "uppercase",
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
  profileCard: {
    backgroundColor: "#121212",
    borderWidth: 1,
    borderColor: "#FFB300",
    borderRadius: 4,
    padding: 16,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
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

  // Trajectories Grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  gridItem: {
    width: "48%",
    backgroundColor: "#121212",
    borderWidth: 1,
    borderColor: "#222222",
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
  },
  trajectoryName: {
    color: "#E0E0E0",
    fontFamily: "monospace",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
  },
  trajectoryHeat: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  heatIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  heatHot: {
    backgroundColor: "#FF6B6B", // Red
  },
  heatWarm: {
    backgroundColor: "#FFB300", // Amber
  },
  heatCold: {
    backgroundColor: "#4A90E2", // Blue
  },
  heatFrozen: {
    backgroundColor: "#555555", // Gray
  },
  heatLabel: {
    color: "#999999",
    fontFamily: "monospace",
    fontSize: 13,
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

  // Buttons & Interactions
  button: {
    backgroundColor: "#FFB300",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginTop: 12,
  },
  buttonText: {
    color: "#0A0A0A",
    fontFamily: "monospace",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonSecondary: {
    backgroundColor: "#222222",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginTop: 12,
  },
  buttonSecondaryText: {
    color: "#FFB300",
    fontFamily: "monospace",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default baseStyles;
