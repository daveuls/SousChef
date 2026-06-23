import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { GlobalStyles } from "@/constants/style";
import { Fonts } from "@/constants/theme";
import { useEffect, useState } from "react";

export default function RecipesScreen() {
  const [recipes, setRecipes] = useState<any[]>([]);

  useEffect(() => {
    async function loadRecipes() {
      try {
        const response = await fetch("http://192.168.1.10:3000/recipes");
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Failed to load recipes:", error);
      }
    }
    loadRecipes();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#8ba185", dark: "#202b1d" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#8ba185"
          name="menucard.fill"
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
          Recipes
        </ThemedText>
      </ThemedView>
      <ThemedText>
        Here you can find your saved recipes or create a new one.
      </ThemedText>
      <ThemedText>
        You can upload an existing one or start from scratch (manual input).
      </ThemedText>

      {recipes.map((recipe: any) => (
        <ThemedText key={recipe.id}>{recipe.name}</ThemedText>
      ))}
    </ParallaxScrollView>
  );
}
