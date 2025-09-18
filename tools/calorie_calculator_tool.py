import os
import requests
from langchain_core.tools import tool
from dotenv import load_dotenv

load_dotenv()  # Loads variables from .env

class CalorieCalculatorTool:
    def __init__(self):
        self.app_id = os.getenv("NUTRITIONIX_APP_ID")
        self.api_key = os.getenv("NUTRITIONIX_API_KEY")
        self.tool_list = [self.get_nutrition_info]

    @tool
    def get_nutrition_info(food_query: str) -> dict:
        """
        Get nutrition info for a food item using Nutritionix API.
        Args:
            food_query (str): Description of food (e.g., '2 eggs and toast')
        Returns:
            dict: Calories, protein (g), carbs (g), fats (g)
        """
        app_id = os.getenv("NUTRITIONIX_APP_ID")
        api_key = os.getenv("NUTRITIONIX_API_KEY")
        url = "https://trackapi.nutritionix.com/v2/natural/nutrients"
        headers = {
            "x-app-id": app_id,
            "x-app-key": api_key,
            "Content-Type": "application/json"
        }
        data = {"query": food_query}
        response = requests.post(url, headers=headers, json=data)
        if response.status_code != 200:
            return {"error": "API request failed", "status_code": response.status_code}
        result = response.json()
        if "foods" not in result or not result["foods"]:
            return {"error": "No food data found"}
        food = result["foods"][0]
        return {
            "calories": food.get("nf_calories", 0),
            "protein_g": food.get("nf_protein", 0),
            "carbs_g": food.get("nf_total_carbohydrate", 0),
            "fats_g": food.get("nf_total_fat", 0)
        }