import ParalaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { GlobalStyles } from "@/constants/style";
import { Fonts } from "@/constants/theme";
import { useGroceryList } from "@/contexts/grocery-list-context";
import { TouchableOpacity } from "react-native";

export default function GroceryListScreen() {
  const { items, toggleItem } = useGroceryList();

  return (
    <ParalaxScrollView
      headerBackgroundColor={{ light: "#8ba185", dark: "#202b1d" }}
      headerImage={
        <IconSymbol size={310} color="#8ba185" name="list.dash.header.rectangle.fill" style={GlobalStyles.headerImage}/>
      }
    >
      <ThemedView style={GlobalStyles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Groceries
        </ThemedText>
      </ThemedView>
      <ThemedText style={GlobalStyles.textContainer}>
        Here is your current grocery list. You can modify it by clicking the &quot;Modify&quot; button.
      </ThemedText>
      <TouchableOpacity style={[GlobalStyles.buttonStyle, { width: 150 }]}>
        <ThemedText style={GlobalStyles.buttonText}>
          Modify
        </ThemedText>
      </TouchableOpacity>
      <ThemedView style={GlobalStyles.textContainer}>
        {items.length > 0 ? (
          items.map((item) => (
            <ThemedView key={item.id} style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <TouchableOpacity onPress={() => toggleItem(item.id)} style={[GlobalStyles.listCheck, { backgroundColor: item.checked ? "#8ba185" : "transparent" }]}>
                {item.checked ? (
                  <ThemedText style={{ color: "#fff", fontSize: 12 }}>✓</ThemedText>
                ) : null}
              </TouchableOpacity>
              <ThemedText style={{ textDecorationLine: item.checked ? "line-through" : "none", color: item.checked ? "#aaaaa9" : "#eeead7" }}>
                {item.name}
              </ThemedText>
            </ThemedView>
          ))
        ) : (
          <ThemedText>No items yet</ThemedText>
        )}
      </ThemedView>
    </ParalaxScrollView>
  );
}
