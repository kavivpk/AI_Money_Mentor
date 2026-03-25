
# ============================================================
#  AI Money Mentor - Flask Backend Server
#  app.py — API server with CORS enabled
# ============================================================

from flask import Flask, request, jsonify
from flask_cors import CORS
from logic import analyze_finances

app = Flask(__name__)
CORS(app)  # Allow React frontend to connect

# ── Health Check ──────────────────────────────────────────
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "AI Money Mentor API is running!",
        "version": "1.0.0",
        "endpoints": ["/analyze (POST)"]
    })

# ── Main Analytics Endpoint ───────────────────────────────
@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json()

        # Validate required fields
        required = ["salary", "expenses", "age"]
        for field in required:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        salary   = float(data["salary"])
        expenses = float(data["expenses"])
        age      = int(data["age"])

        # Basic validation
        if salary <= 0:
            return jsonify({"error": "Salary must be greater than 0"}), 400
        if expenses < 0:
            return jsonify({"error": "Expenses cannot be negative"}), 400
        if age < 18 or age > 100:
            return jsonify({"error": "Age must be between 18 and 100"}), 400

        # Run analytics engine
        result = analyze_finances(salary, expenses, age)

        return jsonify(result), 200

    except ValueError:
        return jsonify({"error": "Invalid data types. Provide numbers for salary, expenses, and age."}), 400
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# ── Sample Test Route (GET) ────────────────────────────────
@app.route("/test", methods=["GET"])
def test():
    """Quick test with sample data"""
    result = analyze_finances(50000, 38000, 27)
    return jsonify(result), 200

if __name__ == "__main__":
    print("=" * 50)
    print("  AI Money Mentor Backend is starting...")
    print("  API available at: http://localhost:5000")
    print("  Test endpoint:    http://localhost:5000/test")
    print("=" * 50)
    app.run(debug=True, port=5000)
