from langgraph.graph import StateGraph
from typing import TypedDict
from app.steps import preprocess_input, rag_retrieve_context, call_ai, save_result, return_output

class TravelState(TypedDict):
    user_input: str
    prompt: str
    itinerary: str
    output: str
    ai_provider: str
    history: list  # Danh sách các tin nhắn chat (dict: {role, content})

def build_travel_graph():
    """Build and compile the travel planning graph"""
    graph = StateGraph(TravelState)

    # Add nodes
    graph.add_node("PreprocessInput", preprocess_input)
    graph.add_node("RAGRetrieveContext", rag_retrieve_context)
    graph.add_node("CallAI", call_ai)
    graph.add_node("SaveResult", save_result)
    graph.add_node("ReturnOutput", return_output)

    # Set entry and finish nodes
    graph.set_entry_point("PreprocessInput")
    graph.set_finish_point("ReturnOutput")

    # Add edges
    graph.add_edge("PreprocessInput", "RAGRetrieveContext")
    graph.add_edge("RAGRetrieveContext", "CallAI")
    graph.add_edge("CallAI", "SaveResult")
    graph.add_edge("SaveResult", "ReturnOutput")

    return graph.compile() 