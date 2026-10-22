from rest_framework.decorators import api_view
from rest_framework.response import Response

from .services import LlmNotConfiguredError, generate_reply


@api_view(["POST"])
def chat(request):
    message = request.data.get("message", "")
    history = request.data.get("history", [])
    if not message:
        return Response({"error": "Missing required 'message' field"}, status=400)

    try:
        reply = generate_reply(message, history)
    except LlmNotConfiguredError as exc:
        return Response({"error": str(exc)}, status=503)
    except Exception as exc:  # upstream provider failure
        return Response({"error": f"LLM request failed: {exc}"}, status=502)

    return Response({"reply": reply})
