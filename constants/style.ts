import { StyleSheet } from "react-native";

export const GlobalStyles = StyleSheet.create({
  headerImage: {
    color: "#8ba185",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  textContainer: {
    gap: 8,
    marginBottom: 8,
  },
  textPaddingBottom: {
    paddingBottom: 10,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
    color: "#8ba185",
  },
});

export const TabBarStyles = {
  light: {
    activeTintColor: "#8ba185",
    inactiveTintColor: "#525f4e",
    tabBarStyle: {
      backgroundColor: "#fff",
      borderTopColor: "Transparent",
      height: 64,
      paddingBottom: 8,
    },
  },
  dark: {
    activeTintColor: "#c5f3bc",
    inactiveTintColor: "#eeead7",
    tabBarStyle: {
      backgroundColor: "#202b1d",
      borderTopColor: "Transparent",
      height: 64,
      paddingBottom: 8,
    },
  },
  labelStyle: {
    fontSize: 12,
  },
};
