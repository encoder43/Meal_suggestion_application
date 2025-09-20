from langchain_core.tools import tool
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class FoodDBTool:
    def __init__(self):
        self.api_key = os.getenv("USDA_API_KEY")
        # Degrade gracefully if missing
        self.tool_list = [self.lookup_food] if self.api_key else []

    @tool
    def lookup_food(self, food_name: str) -> dict:
        """
        Look up nutritional information for a food item using USDA FoodData Central API.
        Args:
            food_name (str): Name of the food (e.g., 'banana', 'boiled egg').
        Returns:
            dict: Nutritional profile with calories, protein, carbs, fats, or error message.
        """
        if not self.api_key:
            return {"error": "USDA API key is not configured."}

        base_url = "https://api.nal.usda.gov/fdc/v1/foods/search"
        params = {
            "query": food_name,
            "apiKey": self.api_key,
            "dataType": ["Foundation Foods", "Branded Foods"]
        }

        try:
            response = requests.get(base_url, params=params, timeout=20)
            response.raise_for_status()
        except requests.RequestException as e:
            return {"error": f"API request failed: {str(e)}"}

        data = response.json()
        if not data.get("foods"):
            return {"error": "Food not found"}

        # Take the first matched food item
        food_data = data["foods"][0]
        nutrients = {nutrient["nutrientName"]: nutrient["value"]
                     for nutrient in food_data.get("foodNutrients", [])}
        
        # Optional: simplify key names for easier usage
        simplified = {
            "calories": nutrients.get("Energy", 0),
            "protein": nutrients.get("Protein", 0),
            "carbs": nutrients.get("Carbohydrate, by difference", 0),
            "fat": nutrients.get("Total lipid (fat)", 0)
        }

        return simplified
