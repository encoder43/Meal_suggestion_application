# agentic_workflow.py
from utils.model_loader import ModelLoader
from prompt_library.prompt import SYSTEM_PROMPT
from langgraph.graph import StateGraph, MessagesState, END, START
from langchain_core.messages import SystemMessage

class GraphBuilder:
    def __init__(self, model_provider: str = "groq"):
        """
        Initializes the GraphBuilder with a model loader and prepares the LLM.
        """
        self.model_loader = ModelLoader(model_provider=model_provider)
        self.llm = self.model_loader.load_llm()
        self.graph = None
        # System prompt instructs the AI to generate ready-to-render HTML
        self.system_prompt = SystemMessage(content=SYSTEM_PROMPT)

    def agent_function(self, state: MessagesState):
        """
        Core agent logic: takes conversation state, sends messages to the LLM, 
        and ensures HTML output is extracted properly.
        """
        # Combine system prompt with all previous messages
        messages = [self.system_prompt] + state["messages"]
        
        # Invoke the LLM to generate HTML
        response = self.llm.invoke(messages)

        # Safely extract the HTML content from AI response
        if hasattr(response, "content"):
            html_content = response.content
        elif isinstance(response, dict) and "content" in response:
            html_content = response["content"]
        else:
            html_content = str(response)

        # Return the HTML as the assistant's message
        return {"messages": [{"role": "assistant", "content": html_content}]}

    def build_graph(self):
        """
        Builds a simple, single-step graph for generating AI content.
        Ideal for returning ready-to-render HTML.
        """
        workflow = StateGraph(MessagesState)

        # Add a single agent node
        workflow.add_node("agent", self.agent_function)

        # Connect start -> agent -> end
        workflow.add_edge(START, "agent")
        workflow.add_edge("agent", END)

        self.graph = workflow.compile()
        return self.graph

    def __call__(self):
        """Allow the class instance to be called directly."""
        return self.build_graph()
