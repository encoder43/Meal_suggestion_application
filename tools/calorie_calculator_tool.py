import os
import requests
from langchain_core.tools import tool
from dotenv import load_dotenv

load_dotenv()  # Loads variables from .env


class CalorieCalculatorTool:
    def __init__(self):
        self.app_id = os.getenv("NUTRITIONIX_APP_ID")
        self.api_key = os.getenv("NUTRITIONIX_API_KEY")

        # If credentials are missing, do not register the tool to avoid crashing the graph
        self.tool_list = [self.get_nutrition_info] if self.app_id and self.api_key else []

    @tool
    def get_nutrition_info(self, food_query: str) -> dict:
        """
        Get nutrition info for a food item using Nutritionix API.
        Args:
            food_query (str): Description of food (e.g., '2 eggs and toast')
        Returns:
            dict: Calories, protein (g), carbs (g), fats (g)
        """
        if not self.app_id or not self.api_key:
            return {"error": "Nutritionix credentials are not configured."}

        url = "https://trackapi.nutritionix.com/v2/natural/nutrients"
        headers = {
            "x-app-id": self.app_id,
            "x-app-key": self.api_key,
            "Content-Type": "application/json",
        }
        data = {"query": food_query}

        try:
            response = requests.post(url, headers=headers, json=data, timeout=20)
            response.raise_for_status()
        except requests.RequestException as e:
            return {"error": f"API request failed: {e}"}

        result = response.json()
        if "foods" not in result or not result["foods"]:
            return {"error": "No food data found"}
        food = result["foods"][0]
        return {
            "calories": food.get("nf_calories", 0),
            "protein_g": food.get("nf_protein", 0),
            "carbs_g": food.get("nf_total_carbohydrate", 0),
            "fats_g": food.get("nf_total_fat", 0),
        }