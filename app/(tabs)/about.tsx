import ParalaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { GlobalStyles } from "@/constants/style";
import { Fonts } from "@/constants/theme";

export default function AboutScreen() {
  return (
    <ParalaxScrollView
      headerBackgroundColor={{ light: "#8ba185", dark: "#202b1d" }}
      headerImage={
        <IconSymbol size={310} color="#8ba185" name="info.circle.fill" style={GlobalStyles.headerImage}/>
      }
    >
      <ThemedView style={GlobalStyles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          About
        </ThemedText>
      </ThemedView>
      <ThemedView style={GlobalStyles.textContainer}>
        <ThemedText>
          I created this app because I love to cook. However, creating a weekly
          grocery list and meal plan can be time consuming.
        </ThemedText>
        <ThemedText>
          I have spent a lot of time reading through recipes, saving recipes,
          putting together grocery lists based on those recipes, discovering
          delicious food content and recipes on Instagram and TikTok, only for
          them to fall by the wayside once I&apos;ve moved on past them.
        </ThemedText>
        <ThemedText>
          I wanted to be able to save recipes from what I found on all corners
          of the internet and have them readily available in one place, and
          easily add the ingredients from those recipes to my weekly grocery
          list.
        </ThemedText>
        <ThemedText>
          I came up with the idea for this app that would allow me to save
          recipes I find online, add them to my weekly menu, and generate a
          grocery list based on the recipes in my weekly menu.
        </ThemedText>
      </ThemedView>
    </ParalaxScrollView>
  );
}
