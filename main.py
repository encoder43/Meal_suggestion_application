import json
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List, Optional, Dict

# This assumes your agent is in this location.
from agent.agentic_workflow import GraphBuilder

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI(title="Nutritionist Meal Suggestion App")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model to validate the incoming data from the frontend form
class NutritionQueryRequest(BaseModel):
    age: int
    gender: str
    height_cm: float
    weight_kg: float
    activity_level: str
    sleep_hours: Optional[float] = None
    medical_conditions: Optional[List[str]] = []
    medications: Optional[List[str]] = []
    allergies: Optional[List[str]] = []
    dietary_pattern: str
    dislikes: Optional[List[str]] = []
    likes: Optional[List[str]] = []
    religious_restrictions: Optional[List[str]] = []
    meals_per_day: int
    eating_window: Optional[Dict[str, str]] = None
    budget: str
    cooking_skill: str
    output_wants: Optional[List[str]] = ["calories", "macros", "recipes"]
    goals: Optional[List[str]] = ["wellness"]
    dietary_preferences: Optional[List[str]] = []
    cuisine_preferences: Optional[List[str]] = []

@app.post("/query")
async def query_nutritionist(query: NutritionQueryRequest):
    """
    This endpoint receives user data, generates a natural language prompt,
    invokes the AI agent, and returns the agent's final response.
    """
    try:
        query_data = query.dict()
        logger.info(f"📥 Received Nutrition Query: {json.dumps(query_data, indent=2)}")

        # --- 1. BUILD A CLEAN, NATURAL LANGUAGE PROMPT ---
        # This follows the pattern of your reference Trip Planner app.
        user_prompt = f"""
Generate a personalized single-day meal plan for the user as a complete HTML block with Tailwind CSS. Include:
- Cards for Breakfast, Lunch, Dinner, Snack 1, Snack 2
- Tables for ingredients, calories, protein, carbs, fat
- Bullet points for substitutions and tips
-Use Tailwind CSS for headings, tables, etc., directly in HTML. No Markdown or code fences.


User Profile:
- Age: {query.age} years
- Gender: {query.gender}
- Height: {query.height_cm} cm
- Weight: {query.weight_kg} kg
- Activity Level: {query.activity_level}
- Meals per day: {query.meals_per_day}
- Diet: {query.dietary_pattern}
- Allergies: {', '.join(query.allergies) or 'None'}
- Dislikes: {', '.join(query.dislikes) or 'None'}
- Goals: {', '.join(query.goals)}
- Budget: {query.budget}
- Cooking Skill: {query.cooking_skill}

**Strict rules:**
- Only produce **HTML**.  
- Do **NOT** include JSON, Markdown, reasoning, or explanations.  
- Include all meals, macros, substitutions, and daily summary.
- Ensure the HTML is clean and ready to be rendered directly in a web page.
"""

        logger.info("💡 Generated User Prompt for Agent.")

        # --- 2. INITIALIZE AND INVOKE THE AGENT ---
        graph_builder = GraphBuilder(model_provider="groq")
        nutrition_app = graph_builder.build_graph()
        
        # The agent expects the prompt in this message format
        messages = {"messages": [("user", user_prompt)]}

        logger.info("🚀 Invoking agent...")
        output_state = await nutrition_app.ainvoke(messages)
        logger.info("✅ Agent run complete.")

        # --- 3. EXTRACT THE FINAL RESPONSE ---
        final_output = ""
        if isinstance(output_state, dict) and "messages" in output_state and output_state["messages"]:
            # Get the content from the very last message in the agent's state
            last_message = output_state["messages"][-1]
            if hasattr(last_message, 'content'):
                final_output = last_message.content

        if not final_output:
            raise ValueError("AI agent did not produce a final response.")

        logger.info("✅ Successfully extracted final response from agent.")
        
        # Return the response in the format the frontend expects
        return {"html_content": final_output}

    except Exception as e:
        logger.error(f"❌ An error occurred in the endpoint: {e}", exc_info=True)
        return JSONResponse(status_code=500, content={"error": "An unexpected server error occurred."})

@app.get("/")
async def root():
    """A simple health check endpoint to confirm the server is running."""
    return {"message": "✅ Nutritionist Meal Suggestion App API is running."}