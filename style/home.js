import { StyleSheet } from "react-native";

const homeStyles = StyleSheet.create({
  logEntry: {
    marginBottom: 12,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: "#333333", // Subtle divider
  },
  logHeader: {
    color: "#FFB300",
    fontWeight: "bold",
    fontSize: 15,
  },
  logBody: {
    color: "#DDDDDD",
    fontSize: 14,
    marginVertical: 2,
  },
  logFooter: {
    color: "#666666", // Dims the metadata
    fontSize: 12,
    fontStyle: "italic",
  },
});

export default homeStyles;
