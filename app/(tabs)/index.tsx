import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Collapsible } from "@/components/ui/collapsible";
import { IconSymbol } from "@/components/ui/icon-symbol.ios";
import { GlobalStyles } from "@/constants/style";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export default function HomeScreen() {
  const [isRecipesOpen, setIsRecipesOpen] = useState(false);
  const [isGroceryListOpen, setIsGroceryListOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsRecipesOpen(false);
      setIsGroceryListOpen(false);
    }, [])
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#8ba185", dark: "#202b1d" }}
      headerImage={
        <IconSymbol size={310} color="#8ba185" name="fork.knife.circle.fill" style={GlobalStyles.headerImage}/>
      }
    >
      <ThemedView style={GlobalStyles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={[GlobalStyles.stepContainer, { marginBottom: 16 }]}>
        <ThemedText type="subtitle" style={GlobalStyles.textPaddingBottom}>
          Let&apos;s get started by selecting one of the options below
        </ThemedText>
        <Collapsible title="Recipes" isOpen={isRecipesOpen} onToggle={() => setIsRecipesOpen((value) => !value)}>
          <ThemedText style={GlobalStyles.textPaddingBottom}>
            Any recipe you upload or create will be saved here. Just tap the
            link below to go to the Recipes tab.
          </ThemedText>
          <ThemedText>
            <Link href="/recipes" asChild>
              <ThemedText type="defaultSemiBold">
                View or Upload new recipes{" "}
              </ThemedText>
            </Link>
          </ThemedText>
        </Collapsible>
      </ThemedView>
      <ThemedView style={[GlobalStyles.stepContainer, { marginBottom: 16 }]}>
        <Collapsible title="Grocery List" isOpen={isGroceryListOpen} onToggle={() => setIsGroceryListOpen((value) => !value)}>
          <ThemedText style={GlobalStyles.textPaddingBottom}>
            This is where you can view your grocery list and modify it. Tap the
            link below to go to the Grocery List tab.
          </ThemedText>
          <ThemedText>
            <Link href="/list" asChild>
              <ThemedText type="defaultSemiBold">
                Look at my grocery list{" "}
              </ThemedText>
            </Link>
          </ThemedText>
        </Collapsible>
      </ThemedView>
    </ParallaxScrollView>
  );
}
