from utils.model_loader import ModelLoader
from prompt_library.prompt import SYSTEM_PROMPT
from langgraph.graph import StateGraph, MessagesState, END, START
from langgraph.prebuilt import ToolNode, tools_condition

from tools.food_db_tool import FoodDBTool
from tools.recipe_search_tool import RecipeSearchTool
from tools.calorie_calculator_tool import CalorieCalculatorTool
from tools.nutrition_conversion_tool import NutritionConverterTool

class GraphBuilder():
    def __init__(self, model_provider: str = "groq"):
        self.model_loader = ModelLoader(model_provider=model_provider)
        self.llm = self.model_loader.load_llm()

        # Tools placeholder (expand later)
        self.tools = []
        
        # Example of how we’ll extend later:
        self.food_db_tools = FoodDBTool()
        self.recipe_search_tools = RecipeSearchTool()
        self.calorie_tools = CalorieCalculatorTool()
        self.converter_tools = NutritionConverterTool()
        
        self.tools.extend([
             *self.food_db_tools.tool_list,
             *self.recipe_search_tools.tool_list,
             *self.calorie_tools.tool_list,
             *self.converter_tools.tool_list
         ])

        self.llm_with_tools = self.llm.bind_tools(tools=self.tools) if self.tools else self.llm
        self.graph = None
        self.system_prompt = SYSTEM_PROMPT

    def _format_structured_input(self, state):
        """
        Turn structured nutrition fields into a user prompt.
        Expects JSON from frontend matching the nutrition schema (flat keys).
        """
        data = state.get("structured_input")
        if not data:
            return None

        # Extract flat fields with sensible defaults
        age = data.get('age')
        gender = data.get('gender')
        height_cm = data.get('height_cm')
        weight_kg = data.get('weight_kg')
        activity_level = data.get('activity_level')
        sleep_hours = data.get('sleep_hours')

        medical_conditions = data.get('medical_conditions') or []
        medications = data.get('medications') or []
        allergies = data.get('allergies') or []

        dietary_pattern = data.get('dietary_pattern')
        dislikes = data.get('dislikes') or []
        likes = data.get('likes') or []
        religious_restrictions = data.get('religious_restrictions') or []

        meals_per_day = data.get('meals_per_day')
        eating_window = data.get('eating_window')
        budget = data.get('budget')
        cooking_skill = data.get('cooking_skill')
        output_wants = data.get('output_wants') or ["calories", "macros", "recipes"]
        goals = data.get('goals') or ["wellness"]
        dietary_preferences = data.get('dietary_preferences') or []
        cuisine_preferences = data.get('cuisine_preferences') or []

        # Build structured user input string
        return f"""
Here are my details for a personalized meal plan request:

- Age: {age}
- Gender: {gender}
- Height: {height_cm} cm
- Weight: {weight_kg} kg
- Activity level: {activity_level}
- Sleep hours: {sleep_hours}

Medical & Health:
- Conditions: {medical_conditions}
- Medications: {medications}
- Allergies: {allergies}

Dietary:
- Pattern: {dietary_pattern}
- Preferences: {dietary_preferences}
- Dislikes: {dislikes}
- Likes: {likes}
- Religious restrictions: {religious_restrictions}

Cuisine Preferences: {cuisine_preferences}

Lifestyle & Preferences:
- Meals per day: {meals_per_day}
- Eating window: {eating_window}
- Budget: {budget}
- Cooking skill: {cooking_skill}
- Output wants: {output_wants}
- Goals: {goals}

Please respond with a concise JSON only (no markdown fences) using this schema:
{{
  "meal_plan": [
    {{
      "day": 1,
      "meals": {{
        "breakfast": {{"items": [{{"dish": "...","ingredients": [{{"name":"...","quantity":0,"unit":"g","calories":0,"macros":{{"protein":0,"carbs":0,"fat":0}}}}],"calories":0,"macros":{{"protein":0,"carbs":0,"fat":0}},"substitutions":["..."]}}]}},
        "snack_1": {{"items": [ ... ]}},
        "lunch": {{"items": [ ... ]}},
        "snack_2": {{"items": [ ... ]}},
        "dinner": {{"items": [ ... ]}}
      }},
      "daily_summary": {{
        "total_calories": 0,
        "macros": {{"protein": 0, "carbs": 0, "fat": 0}},
        "hydration_tips": "...",
        "lifestyle_tips": "..."
      }}
    }}
  ],
  "notes": "..."
}}
        """

    def agent_function(self, state: MessagesState):
        """Main nutritionist agent function"""
        structured_prompt = self._format_structured_input(state)
        if structured_prompt:
            user_question = [{"role": "user", "content": structured_prompt}]
        else:
            user_question = state["messages"]  # fallback

        input_question = [self.system_prompt] + user_question
        response = self.llm_with_tools.invoke(input_question)
        return {"messages": [response]}

    def build_graph(self):
        graph_builder = StateGraph(MessagesState)
        graph_builder.add_node("agent", self.agent_function)

        if self.tools:
            graph_builder.add_node("tools", ToolNode(tools=self.tools))
            graph_builder.add_edge(START, "agent")
            graph_builder.add_conditional_edges("agent", tools_condition)
            graph_builder.add_edge("tools", "agent")
            graph_builder.add_edge("agent", END)
        else:
            graph_builder.add_edge(START, "agent")
            graph_builder.add_edge("agent", END)

        self.graph = graph_builder.compile()
        return self.graph

    def __call__(self):
        return self.build_graph()
