import ParalaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { GlobalStyles } from "@/constants/style";
import { Fonts } from "@/constants/theme";

export default function GroceryListScreen() {
  return (
    <ParalaxScrollView
      headerBackgroundColor={{ light: "#8ba185", dark: "#202b1d" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#8ba185"
          name="list.dash.header.rectangle.fill"
          style={GlobalStyles.headerImage}
        />
      }
    >
      <ThemedView style={GlobalStyles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Groceries
        </ThemedText>
      </ThemedView>
      <ThemedView style={GlobalStyles.textContainer}>
        <ThemedText>
          GROCERY LIST HERE - A GROCERY LIST WILL APPEAR HERE
        </ThemedText>
      </ThemedView>
    </ParalaxScrollView>
  );
}
