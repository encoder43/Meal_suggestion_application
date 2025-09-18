from langchain_core.tools import tool
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
EDAMAM_APP_ID = os.getenv("EDAMAM_APP_ID")
EDAMAM_APP_KEY = os.getenv("EDAMAM_APP_KEY")

class RecipeSearchTool:
    def __init__(self):
        if not EDAMAM_APP_ID or not EDAMAM_APP_KEY:
            raise ValueError("Edamam API credentials not found in environment variables.")
        self.tool_list = [self.search_recipe]

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
        base_url = "https://api.edamam.com/search"
        diet_filter = ""
        if dietary_pref.lower() in ["vegetarian", "vegan"]:
            diet_filter = f"&health={dietary_pref.lower()}"
        
        params = {
            "q": query,
            "app_id": EDAMAM_APP_ID,
            "app_key": EDAMAM_APP_KEY,
            "from": 0,
            "to": 3  # top 3 recipes
        }

        try:
            response = requests.get(base_url, params=params)
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
