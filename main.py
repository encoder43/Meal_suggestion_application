from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from agent.agentic_workflow import GraphBuilder
from starlette.responses import JSONResponse
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List, Optional, Dict

load_dotenv()

app = FastAPI(title="Nutritionist Meal Suggestion App")

# ✅ Allow frontend apps to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Request schema for nutrition app
# -------------------------------
class NutritionQueryRequest(BaseModel):
    age: int
    gender: str
    height_cm: float
    weight_kg: float
    activity_level: str  # sedentary | light | moderate | very_active
    sleep_hours: Optional[float] = None

    medical_conditions: Optional[List[str]] = []
    medications: Optional[List[str]] = []
    allergies: Optional[List[str]] = []

    dietary_pattern: str  # omnivore | vegetarian | vegan | pescatarian | eggetarian
    dislikes: Optional[List[str]] = []
    likes: Optional[List[str]] = []
    religious_restrictions: Optional[List[str]] = []

    meals_per_day: int
    eating_window: Optional[Dict[str, str]] = None  # {"start": "08:00", "end": "20:00"}
    budget: str  # low | medium | high
    cooking_skill: str  # beginner | intermediate | advanced
    output_wants: Optional[List[str]] = ["calories", "macros", "recipes"]
    goals: Optional[List[str]] = ["wellness"]
    dietary_preferences: Optional[List[str]] = []  # Additional dietary preferences
    cuisine_preferences: Optional[List[str]] = []  # Preferred cuisines/countries


# -------------------------------
# API route for nutrition queries
# -------------------------------
@app.post("/query")
async def query_nutritionist(query: NutritionQueryRequest):
    try:
        print("📥 Received Nutrition Query:", query.dict())

        # Initialize graph with Groq model
        graph = GraphBuilder(model_provider="groq")
        nutrition_app = graph()  # compiled StateGraph

        # Pass structured form input to graph
        messages = {
            "structured_input": query.dict()
        }

        # Run graph asynchronously (LangGraph + LLM)
        output = await nutrition_app.ainvoke(messages)

        # Extract final response content
        if isinstance(output, dict) and "messages" in output:
            final_output = output["messages"][-1].content
        else:
            final_output = str(output)

        return {"answer": final_output}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


# -------------------------------
# Root health check
# -------------------------------
@app.get("/")
async def root():
    return {"message": "✅ Nutritionist Meal Suggestion App API is running."}
