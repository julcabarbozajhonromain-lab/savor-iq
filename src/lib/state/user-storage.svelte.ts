import { browser } from '$app/environment';
import type { Recipe, NutritionAnalysis, MealPlan } from '$lib/types/ai-schemas';

export interface LoggedMeal {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  dishName: string;
  mealType: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  healthScore: number;
}

export interface SavedRecipe extends Recipe {
  id: string;
  savedAt: number;
}

export interface UserProfile {
  gender: 'Hombre' | 'Mujer';
  age: number;
  weightKg: number;
  heightCm: number;
  activityLevel: 'sedentario' | 'ligero' | 'moderado' | 'activo';
  fitnessGoal: 'perder' | 'mantener' | 'ganar';
  dietPreference: string;
  allergies: string[];
}

const DEFAULT_PROFILE: UserProfile = {
  gender: 'Hombre',
  age: 28,
  weightKg: 72,
  heightCm: 175,
  activityLevel: 'moderado',
  fitnessGoal: 'mantener',
  dietPreference: 'Equilibrada',
  allergies: [],
};

class UserDataManager {
  savedRecipes: SavedRecipe[] = $state([]);
  loggedMeals: LoggedMeal[] = $state([]);
  calorieGoal: number = $state(2000);
  activePlan: MealPlan | null = $state(null);
  profile: UserProfile = $state(DEFAULT_PROFILE);
  isLoaded: boolean = $state(false);

  constructor() {
    if (browser) {
      this.loadFromStorage();
    }
  }

  loadFromStorage() {
    try {
      const recipes = localStorage.getItem('savor_saved_recipes');
      if (recipes) this.savedRecipes = JSON.parse(recipes);

      const meals = localStorage.getItem('savor_logged_meals');
      if (meals) this.loggedMeals = JSON.parse(meals);

      const goal = localStorage.getItem('savor_calorie_goal');
      if (goal) this.calorieGoal = parseInt(goal, 10) || 2000;

      const plan = localStorage.getItem('savor_saved_meal_plan');
      if (plan) this.activePlan = JSON.parse(plan);

      const userProf = localStorage.getItem('savor_user_profile');
      if (userProf) this.profile = { ...DEFAULT_PROFILE, ...JSON.parse(userProf) };
    } catch (e) {
      console.warn('Error cargando datos de localStorage:', e);
    } finally {
      this.isLoaded = true;
    }
  }

  calculateRecommendedCalories(prof = this.profile): number {
    const { gender, weightKg, heightCm, age, activityLevel, fitnessGoal } = prof;

    // Fórmula Mifflin-St Jeor para Tasa Metabólica Basal (BMR)
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
    bmr += gender === 'Hombre' ? 5 : -161;

    // Factor de actividad
    const activityMultipliers: Record<string, number> = {
      sedentario: 1.2,
      ligero: 1.375,
      moderado: 1.55,
      activo: 1.725,
    };
    const factor = activityMultipliers[activityLevel] || 1.375;
    let tdee = Math.round(bmr * factor);

    // Ajuste según meta
    if (fitnessGoal === 'perder') {
      tdee -= 400; // Déficit moderado y sostenible
    } else if (fitnessGoal === 'ganar') {
      tdee += 350; // Superávit para masa muscular
    }

    return Math.max(1200, Math.min(4200, tdee));
  }

  saveProfile(updated: UserProfile) {
    this.profile = { ...updated };
    const recCal = this.calculateRecommendedCalories(updated);
    this.calorieGoal = recCal;

    if (browser) {
      localStorage.setItem('savor_user_profile', JSON.stringify(this.profile));
      localStorage.setItem('savor_calorie_goal', recCal.toString());
    }
  }

  saveRecipe(recipe: Recipe): boolean {
    const existingIndex = this.savedRecipes.findIndex((r) => r.name === recipe.name);
    if (existingIndex >= 0) {
      this.savedRecipes.splice(existingIndex, 1);
      this.persistRecipes();
      return false;
    } else {
      const newRecipe: SavedRecipe = {
        ...recipe,
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        savedAt: Date.now(),
      };
      this.savedRecipes.unshift(newRecipe);
      this.persistRecipes();
      return true;
    }
  }

  isRecipeSaved(recipeName: string): boolean {
    return this.savedRecipes.some((r) => r.name === recipeName);
  }

  removeRecipe(id: string) {
    this.savedRecipes = this.savedRecipes.filter((r) => r.id !== id);
    this.persistRecipes();
  }

  private persistRecipes() {
    if (browser) {
      localStorage.setItem('savor_saved_recipes', JSON.stringify(this.savedRecipes));
    }
  }

  logMealFromAnalysis(
    analysis: NutritionAnalysis,
    mealType: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack' = 'Almuerzo'
  ) {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMeal: LoggedMeal = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      date: dateStr,
      time: timeStr,
      dishName: analysis.dishName,
      mealType,
      calories: analysis.estimatedCalories,
      protein: analysis.macronutrients.protein,
      carbs: analysis.macronutrients.carbs,
      fat: analysis.macronutrients.fat,
      fiber: analysis.macronutrients.fiber,
      healthScore: analysis.healthScore,
    };

    this.loggedMeals.unshift(newMeal);
    if (browser) {
      localStorage.setItem('savor_logged_meals', JSON.stringify(this.loggedMeals));
    }
  }

  removeLoggedMeal(id: string) {
    this.loggedMeals = this.loggedMeals.filter((m) => m.id !== id);
    if (browser) {
      localStorage.setItem('savor_logged_meals', JSON.stringify(this.loggedMeals));
    }
  }

  getTodayMeals(): LoggedMeal[] {
    const todayStr = new Date().toISOString().split('T')[0];
    return this.loggedMeals.filter((m) => m.date === todayStr);
  }

  getTodayNutritionSummary() {
    const todayMeals = this.getTodayMeals();
    return todayMeals.reduce(
      (acc, m) => {
        acc.calories += m.calories;
        acc.protein += m.protein;
        acc.carbs += m.carbs;
        acc.fat += m.fat;
        acc.fiber += m.fiber;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  }

  setCalorieGoal(goal: number) {
    this.calorieGoal = goal;
    if (browser) {
      localStorage.setItem('savor_calorie_goal', goal.toString());
    }
  }

  clearAllData() {
    if (browser) {
      localStorage.removeItem('savor_saved_recipes');
      localStorage.removeItem('savor_logged_meals');
      localStorage.removeItem('savor_saved_meal_plan');
      localStorage.removeItem('savor_user_profile');
      localStorage.removeItem('savor_calorie_goal');
    }
    this.savedRecipes = [];
    this.loggedMeals = [];
    this.activePlan = null;
    this.profile = { ...DEFAULT_PROFILE };
    this.calorieGoal = 2000;
  }
}

export const userData = new UserDataManager();
