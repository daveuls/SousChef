import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Collapsible } from "@/components/ui/collapsible";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { API_BASE_URI } from "@/constants/api";
import { GlobalStyles } from "@/constants/style";
import { Fonts } from "@/constants/theme";
import { useGroceryList } from "@/contexts/grocery-list-context";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";

export default function RecipesScreen() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [ingredientsByRecipe, setIngredientsByRecipe] = useState<Record<number, string[]>>({});
  const [instructionsByRecipe, setInstructionsByRecipe] = useState<Record<number, { stepNumber: number | string; instructionText: string}[]>>({});
  const [openRecipeIds, setOpenRecipeIds] = useState<Record<number, boolean>>({});
  
  const { addItems } = useGroceryList();

  const handleAddToGroceryList = (recipeId: number) => {
    const recipeIngredients = ingredientsByRecipe[recipeId] || [];
    addItems(recipeIngredients);
  }

  useEffect(() => {
    async function loadRecipes() {
      try {
        const response = await fetch(`${API_BASE_URI}/recipes`);
        const data = await response.json();

        setRecipes(data);

        for (const recipe of data) {
          try {
            const ingredientsResponse = await fetch(`${API_BASE_URI}/recipes/ingredients/${recipe.id}`);
            const ingredientsData = await ingredientsResponse.json();

            setIngredientsByRecipe((prev) => ({
              ...prev,
              [recipe.id]: ingredientsData.map(
                (item: any) => item.ingredient || "Mystery Ingredient",
              ),
            }));
          } catch (err) {
            console.log(`Failed to load ingredients for recipe ${recipe.recipe_name}`, err);
          }
          try {
            const instructionsResponse = await fetch(`${API_BASE_URI}/recipes/instructions/${recipe.id}`);
            const instructionsData = await instructionsResponse.json();

            setInstructionsByRecipe((prev) => ({
              ...prev,
              [recipe.id]: instructionsData.map(
                (item: any) => {
                  const stepNumber = item.step;
                  const instructionText = item.instruction || "Unknown Instruction";

                  return {stepNumber, instructionText};
              }),
            }));
          } catch (e) {
            console.log(`Failed to load the instructions for ${recipe.recipe_name}`, e);
          }
        }
      } catch (error) {
        console.error("Failed to load recipes:", error);
      }
    }

    loadRecipes();
  }, []);

  useEffect(() => {
    const validRecipeIds = new Set(recipes.map((recipe) => recipe.id));

    setOpenRecipeIds((prev) => {
      const next: Record<number, boolean> = {};

      Object.entries(prev).forEach(([id, isOpen]) => {
        const numericId = Number(id);

        if (validRecipeIds.has(numericId)) {
          next[numericId] = isOpen;
        }
      });

      return next;
    });
  }, [recipes]);

  useFocusEffect(
    useCallback(() => {
      setOpenRecipeIds({});

      return () => {
        setOpenRecipeIds({});
      };
    }, [])
  );

  const toggleRecipe = (recipeId: number) => {
    setOpenRecipeIds((prev) => ({
      ...prev,
      [recipeId]: !prev[recipeId],
    }));
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#8ba185", dark: "#202b1d" }}
      headerImage={
        <IconSymbol size={310} color="#8ba185" name="menucard.fill" style={GlobalStyles.headerImage}/>
      }
    >
      <ThemedView style={GlobalStyles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Recipes
        </ThemedText>
      </ThemedView>
      <ThemedText>
        Here you can find your saved recipes or create a new one.
      </ThemedText>
      <ThemedText>
        You can upload an existing one or start from scratch (manual input).
      </ThemedText>
      <ThemedView style={[GlobalStyles.textContainer, { gap: 16 }]}>
        {recipes.map((recipe: any) => (
          <Collapsible
            key={recipe.id}
            title={recipe.recipe_name || "Untitled recipe"}
            isOpen={Boolean(openRecipeIds[recipe.id])}
            onToggle={() => toggleRecipe(recipe.id)}
          >
            <ThemedText style={GlobalStyles.textContainer}>
              Eat this for {recipe.recipe_type}. Below is everything you&apos;ll need
              to make it.
            </ThemedText>
            <ThemedText style={GlobalStyles.textContainer}>
              Ingredients:
            </ThemedText>
            <ThemedView
              style={{ marginLeft: 14, marginTop: 6, paddingBottom: 10 }}
            >
              {(ingredientsByRecipe[recipe.id] || []).length > 0 ? (
                (ingredientsByRecipe[recipe.id] || []).map(
                  (ingredient: string, index: number) => (
                    <ThemedText key={`${recipe.id}-${index}`} style={{ marginBottom: 6, paddingLeft: 6, lineHeight: 20 }} >
                      - {ingredient}
                    </ThemedText>
                  ),
                )
              ) : (
                <ThemedText style={{ marginTop: 4, fontStyle: "italic", paddingBottom: 10 }}>
                  No ingredients found for {recipe.recipe_name}
                </ThemedText>
              )}
            </ThemedView>
            <TouchableOpacity style={GlobalStyles.buttonStyle} onPress={() => handleAddToGroceryList(recipe.id)}>
              <ThemedText style={GlobalStyles.buttonText}>
                Add ingredients to grocery list
              </ThemedText>
            </TouchableOpacity>
            <ThemedText style={GlobalStyles.textContainer}>Steps:</ThemedText>
            <ThemedView
              style={{ marginLeft: 14, marginTop: 6, paddingBottom: 10 }}
            >
              {(instructionsByRecipe[recipe.id] || []).length > 0 ? (
                (instructionsByRecipe[recipe.id] || []).map(
                  (
                    step: {
                      stepNumber: number | string;
                      instructionText: string;
                    },
                    index: number,
                  ) => (
                    <ThemedView key={`${recipe.id}-${index}`} style={{ marginBottom: 8, paddingLeft: 6 }}>
                      <ThemedText style={{ fontWeight: "600", marginBottom: 2 }}>
                        Step {step.stepNumber}
                      </ThemedText>
                      <ThemedText style={{ lineHeight: 20, paddingLeft: 8 }}>
                        {step.instructionText}
                      </ThemedText>
                    </ThemedView>
                  ),
                )
              ) : (
                <ThemedText
                  style={{ marginTop: 4, fontStyle: "italic", paddingBottom: 10 }}>
                  No instructions found for {recipe.recipe_name}
                </ThemedText>
              )}
            </ThemedView>
          </Collapsible>
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}
