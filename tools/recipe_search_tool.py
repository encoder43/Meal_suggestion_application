from langchain_core.tools import tool
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class RecipeSearchTool:
    def __init__(self):
        self.app_id = os.getenv("EDAMAM_APP_ID")
        self.app_key = os.getenv("EDAMAM_APP_KEY")
        # Only register the tool when credentials exist, otherwise degrade gracefully
        self.tool_list = [self.search_recipe] if self.app_id and self.app_key else []

    @tool
    def search_recipe(self, query: str, dietary_pref: str = "any") -> dict:
        """
        Search for recipes using Edamam Recipe Search API.
        Args:
            query (str): e.g., "high protein breakfast with oats"
            dietary_pref (str): 'vegetarian', 'vegan', 'non-veg' (Edamam supports 'vegetarian'/'vegan')
        Returns:
            dict: Recipe suggestions with title, ingredients, instructions, and dietary info.
        """
        if not self.app_id or not self.app_key:
            return {"error": "Edamam credentials are not configured."}

        base_url = "https://api.edamam.com/search"
        params = {
            "q": query,
            "app_id": self.app_id,
            "app_key": self.app_key,
            "from": 0,
            "to": 3,  # top 3 recipes
        }

        # Apply dietary filter if supported by Edamam via 'health' parameter
        if dietary_pref and dietary_pref.lower() in ["vegetarian", "vegan"]:
            params["health"] = dietary_pref.lower()

        try:
            response = requests.get(base_url, params=params, timeout=20)
            response.raise_for_status()
        except requests.RequestException as e:
            return {"error": f"API request failed: {str(e)}"}

        data = response.json()
        if not data.get("hits"):
            return {"error": "No recipes found"}

        # Extract top 3 recipes
        recipes = []
        for hit in data["hits"]:
            recipe = hit["recipe"]
            recipes.append({
                "recipe_title": recipe.get("label"),
                "ingredients": recipe.get("ingredientLines"),
                "instructions_url": recipe.get("url"),  # Edamam provides URL, not full instructions
                "dietary_pref": dietary_pref
            })

        return {"recipes": recipes}
