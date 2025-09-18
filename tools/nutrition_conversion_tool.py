from langchain_core.tools import tool
import os
from dotenv import load_dotenv

load_dotenv()
USDA_API_KEY = os.getenv("USDA_API_KEY")  # optional for later API expansion

class NutritionConverterTool:
    def __init__(self):
        self.tool_list = [self.convert_units]

        # Basic portion conversion data (grams + calories per unit)
        self.conversions = {
            "rice": {
                "cup": {"grams": 195, "calories": 206},
                "tbsp": {"grams": 14, "calories": 15},
                "gram": {"grams": 1, "calories": 1.06}  # approximate
            },
            "milk": {
                "cup": {"grams": 240, "calories": 122},
                "tbsp": {"grams": 15, "calories": 7.6},
                "ml": {"grams": 1, "calories": 0.51}  # approximate
            },
            "egg": {
                "large": {"grams": 50, "calories": 78},
                "medium": {"grams": 44, "calories": 68},
                "gram": {"grams": 1, "calories": 1.56}  # approximate
            }
            # add more items as needed
        }

    @tool
    def convert_units(self, item: str, quantity: float, unit: str) -> dict:
        """
        Convert portion sizes to standard grams + calories.
        Args:
            item (str): e.g., 'rice'
            quantity (float): e.g., 1
            unit (str): e.g., 'cup', 'tbsp', 'slice'
        Returns:
            dict: Standardized weight in grams + estimated calories.
        """
        item_data = self.conversions.get(item.lower())
        if not item_data:
            return {"error": f"No conversion data found for item '{item}'."}

        unit_data = item_data.get(unit.lower())
        if not unit_data:
            return {"error": f"No conversion data found for unit '{unit}' for item '{item}'."}

        grams = unit_data["grams"] * quantity
        calories = unit_data["calories"] * quantity

        return {
            "item": item,
            "unit": unit,
            "quantity": quantity,
            "grams": grams,
            "calories": calories
        }
