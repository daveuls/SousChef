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
import { Alert, TextInput, TouchableOpacity, View } from "react-native";

export default function RecipesScreen() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [ingredientsByRecipe, setIngredientsByRecipe] = useState<Record<number, string[]>>({});
  const [instructionsByRecipe, setInstructionsByRecipe] = useState<Record<number, { stepNumber: number | string; instructionText?: string; videoURL?: string}[]>>({});
  const [openRecipeIds, setOpenRecipeIds] = useState<Record<number, boolean>>({});
  const [newRecipeName, setNewRecipeName] = useState("");
  const [newRecipeType, setNewRecipeType] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newInstructionText, setNewInstructionText] = useState("");
  const [entryMode, setEntryMode] = useState<"manual" | "upload">("manual");
  const [showCreateRecipeForm, setShowCreateRecipeForm] = useState(false);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [showEmbeddedUrl, setShowEmbeddedUrl] = useState(false);

  const { addItems } = useGroceryList();

  const handleAddToGroceryList = (recipeId: number) => {
    const recipeIngredients = ingredientsByRecipe[recipeId] || [];
    addItems(recipeIngredients);
    Alert.alert("Ingredients Added", "The ingredients for this meal have been added to your grocery list.", 
    [
      {text: "Okay"}, {onPress: () => console.log("Ingredients added to grocery list.")}
    ]);
  }

  const handleCreateRecipe = async () => {
    if (!newRecipeName || !newRecipeType) {
      Alert.alert("Missing fields", "Please provide both the reciupe name and type of recipe before saving.");
      return;
    }

    const payload: any = {
      recipeName: newRecipeName,
      recipeType: newRecipeType,
    };

    if (newVideoUrl.trim()) {
      payload.videoUrl = newVideoUrl.trim();
    } 

    // eventually need to update backend to accept manually entered instructions
    // if (entryMode === "manual" && newInstructionText.trim()) {
    //   payload.Instructions = newInstructionText.trim();
    // }

    try {
      const response = await fetch (`${API_BASE_URI}/recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save recipe: ${errorText}`);
      }

      setNewRecipeName("");
      setNewRecipeType("");
      setNewVideoUrl("");
      setNewInstructionText("");

      Alert.alert("Recipe Saved", "Your recipe has been saved successfully.");

      await loadRecipes();
    } catch (error) {
      console.error("Failed to create recipe:", error);
      Alert.alert("Error", "Failed to create recipe. Please try again later.");
    }
  }

  const getEmbeddedUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      const host = parsedUrl.hostname.toLowerCase();

      // Youtube video URLs
      if (host.includes("youtube.com") && parsedUrl.searchParams.get("v")) {
        return `https://www.youtube.com/embed/${parsedUrl.searchParams.get("v")}`;
      }

      if (host.includes("youtu.be")) {
        return `https://www.youtube.com/embed/${parsedUrl.pathname.slice(1)}`;
      }

      // handle TikToks
      if (host.includes("tiktok.com")) {
        const parts = parsedUrl.pathname.split("/").filter(Boolean);
        const id = parts[parts.length - 1];

        if (id) {
          return `https://www.tiktok.com/embed/vs/${id}`;
        }

        return url;
      }

      
      if (host.includes("instagram.com")) {
        const parts = parsedUrl.pathname.split("/").filter(Boolean);

        if (parts[0] === "reel" && parts[1]) {
          return `https://www.instagram.com/reel/${parts[1]}/embed/`;
        }

        if (parts[0] === "p" && parts[1]) {
          return `https://www.instagram.com/p/${parts[1]}/embed/`;
        }

        return url;
      }

      return url;
    } catch {
      return url;
    }
  };

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
                  const videoUrl = item.video_url || null;

                  return {stepNumber, instructionText, videoUrl};
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

  useEffect(() => {
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
      <TouchableOpacity style={GlobalStyles.buttonStyle} onPress={() => setShowCreateRecipeForm((prev) => !prev)}>
        <ThemedText style={GlobalStyles.buttonText}>
          {showCreateRecipeForm ? "Hide recipe form" : "Create a new recipe"}
        </ThemedText>
      </TouchableOpacity>
      {showCreateRecipeForm && (
        <ThemedView style={[GlobalStyles.textContainer, { gap: 12 }]}>
          <ThemedText style={{ fontWeight: "700" }}>Create a new recipe</ThemedText>
          <TextInput 
            value={newRecipeName} 
            onChangeText={setNewRecipeName} 
            placeholder="Recipe Name" 
            style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, color: "#eeead7" }}
          />
          <TextInput 
            value={newRecipeType} 
            onChangeText={setNewRecipeType} 
            placeholder="Recipe Type" 
            style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, color: "#eeead7" }}
          />
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "center" }}>
            <TouchableOpacity 
              onPress={() => setEntryMode("manual")} 
              style={[
                GlobalStyles.buttonStyle, 
                { 
                  flex: 0.5,
                  paddingHorizontal: 12,
                  minHeight: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: entryMode === "manual" ? "#6a9c5a" : "#8ba185" 
                }, 
              ]}
            >
              <ThemedText style={GlobalStyles.buttonText}>Enter recipe</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setEntryMode("upload")} 
              style={[
                GlobalStyles.buttonStyle, 
                { 
                  flex: 0.5,
                  paddingHorizontal: 12,
                  minHeight: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: entryMode === "upload" ? "#6a9c5a" : "#8ba185" 
                }, 
              ]}
            >
              <ThemedText style={GlobalStyles.buttonText}>Upload video</ThemedText>
            </TouchableOpacity>
          </View>
          <TextInput
            value={newVideoUrl}
            onChangeText={setNewVideoUrl}
            placeholder="Paste TikTTok/Instagram Reel/YouTube Video here"
            style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, color: "#eeead7" }}
          />
          {entryMode === "manual" && (
            <TextInput
              value={newInstructionText}
              onChangeText={setNewInstructionText}
              placeholder="Type the recipe steps here"
              multiline
              numberOfLines={4}
              style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, minHeight: 100, color: "#eeead7" }}
            />
          )}
          <TouchableOpacity style={[GlobalStyles.buttonStyle, { marginTop: 20 }]} onPress={handleCreateRecipe}>
            <ThemedText style={GlobalStyles.buttonText}>Save Recipe</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
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
                    step: any,
                    index: number,
                  ) => {
                    if (step.stepNumber === 1 && step.videoUrl) {
                      return (
                        <ThemedView key={`${recipe.id}-${index}`} style={{ marginBottom: 8, paddingLeft: 6 }}>
                          <ThemedText style={{ fontWeight: "600", marginBottom: 6 }}>
                            Recipe Video
                          </ThemedText>
                          <TouchableOpacity onPress={() => {
                            import("expo-linking").then((Linking) => {
                              Linking.openURL(step.videoUrl);
                            });
                          }}
                          style={{ backgroundColor: "#8ba185", padding: 10, borderRadius: 6 }}>
                            <ThemedText style={{ color: "#fff", fontWeight: "600" }}>
                              Watch Video
                              </ThemedText>
                          </TouchableOpacity>
                        </ThemedView>
                      );
                    }
                    return (
                      <ThemedView key={`${recipe.id}-${index}`} style={{ marginBottom: 8, paddingLeft: 6 }}>
                        <ThemedText style={{ fontWeight: "600", marginBottom: 2 }}>
                          Step {step.stepNumber}
                        </ThemedText>
                        <ThemedText style={{ lineHeight: 20, paddingLeft: 8 }}>
                          {step.instructionText}
                        </ThemedText>
                      </ThemedView>
                    );
                  },
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
