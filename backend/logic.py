
# ============================================================
#  AI Money Mentor - Data Analytics Engine
#  logic.py — All financial calculations happen here
# ============================================================

def analyze_finances(salary: float, expenses: float, age: int) -> dict:
    """
    Core analytics function.
    Accepts salary, expenses, age → returns full financial analysis.
    """

    # ── 1. Basic Calculations ──────────────────────────────
    savings = salary - expenses
    savings_percentage = (savings / salary) * 100 if salary > 0 else 0
    expense_ratio = (expenses / salary) * 100 if salary > 0 else 0

    # ── 2. Financial Health Score (0 – 100) ───────────────
    score = _calculate_score(savings_percentage, expense_ratio, age)

    # ── 3. Category ────────────────────────────────────────
    category = _classify_user(savings_percentage)

    # ── 4. AI-Like Rule-Based Advice ──────────────────────
    advice = _generate_advice(savings_percentage, expense_ratio, savings, salary, age)

    # ── 5. Investment Suggestion (age-aware) ──────────────
    investment_suggestion = _suggest_investment(savings_percentage, age)

    # ── 6. Future Projections ─────────────────────────────
    yearly_savings = savings * 12
    five_year_savings = yearly_savings * 5

    # ── 7. Impact Message ─────────────────────────────────
    impact_text = _generate_impact_text(savings_percentage)

    # ── 8. Emergency Fund Insight ─────────────────────────
    emergency_fund_goal = expenses * 6

    return {
        "salary": round(salary, 2),
        "expenses": round(expenses, 2),
        "savings": round(savings, 2),
        "savings_percentage": round(savings_percentage, 2),
        "expense_ratio": round(expense_ratio, 2),
        "financial_score": score,
        "category": category,
        "advice": advice,
        "investment_suggestion": investment_suggestion,
        "yearly_savings": round(yearly_savings, 2),
        "five_year_savings": round(five_year_savings, 2),
        "impact_text": impact_text,
        "emergency_fund_goal": round(emergency_fund_goal, 2),
    }


# ── Helper: Impact Text Generator ──────────────────────────
def _generate_impact_text(savings_pct: float) -> str:
    if savings_pct < 10:
        return "You can improve your savings by 30% with better planning"
    elif savings_pct <= 20:
        return "You can improve your savings by 15% with small changes"
    else:
        return "Great! You are already saving efficiently"


# ── Helper: Score Calculator ───────────────────────────────
def _calculate_score(savings_pct: float, expense_ratio: float, age: int) -> int:
    base_score = 0

    # Savings percentage contributes 60 points
    if savings_pct < 0:
        base_score += 0
    elif savings_pct < 10:
        base_score += 20
    elif savings_pct < 20:
        base_score += 40
    elif savings_pct < 30:
        base_score += 50
    else:
        base_score += 60

    # Expense ratio contributes 25 points (lower ratio = better)
    if expense_ratio < 50:
        base_score += 25
    elif expense_ratio < 70:
        base_score += 15
    elif expense_ratio < 85:
        base_score += 8
    else:
        base_score += 0

    # Age-adjusted bonus (15 points max)
    # Younger savers get more credit; older savers need higher savings urgency
    if age < 25:
        base_score += 15  # Great head start
    elif age < 35:
        base_score += 10
    elif age < 45:
        base_score += 7
    elif age < 55:
        base_score += 4
    else:
        base_score += 1  # Late saver — needs discipline

    return min(base_score, 100)


# ── Helper: Category Classifier ───────────────────────────
def _classify_user(savings_pct: float) -> str:
    if savings_pct < 0:
        return "Critical – You are spending more than you earn!"
    elif savings_pct < 10:
        return "Overspending – Immediate action needed"
    elif savings_pct < 20:
        return "Moderate – Room for significant improvement"
    elif savings_pct < 35:
        return "Good Saver – You are on the right track"
    else:
        return "Excellent Saver – Keep up the great work!"


# ── Helper: Advice Generator ──────────────────────────────
def _generate_advice(savings_pct, expense_ratio, savings, salary, age):
    tips = []

    # Overspending alerts
    if savings < 0:
        tips.append("🚨 ALERT: You are spending MORE than you earn — this leads to debt. Cut expenses immediately.")
    elif savings_pct < 10:
        tips.append("⚠️ You are spending too much compared to your income. Try to save at least 20% of your salary.")
        tips.append(f"💡 Reduce monthly expenses by at least ₹{abs(savings - salary * 0.20):,.0f} to hit a healthy savings rate.")

    # Mid-range advice
    if 10 <= savings_pct < 20:
        tips.append("📊 Your savings rate is average. Aim for 20% to build a solid financial foundation.")
        tips.append("💡 Try the 50-30-20 Rule: 50% Needs, 30% Wants, 20% Savings.")

    # Good savers
    if savings_pct >= 20:
        tips.append("✅ Excellent! You are saving more than 20% — a key milestone in financial health.")
        tips.append("📈 Consider investing your surplus to grow your wealth over time.")

    # High expense ratio
    if expense_ratio > 80:
        tips.append("🔴 Your expenses consume over 80% of your income. Review and cut non-essential spending.")

    # Age-based advice
    if age < 25:
        tips.append("🎓 You are young — start investing early. Even ₹500/month in SIP can grow to lakhs in 20 years.")
    elif age < 35:
        tips.append("🏡 In your prime earning years — prioritize emergency fund (3–6 months' expenses) and investments.")
    elif age < 45:
        tips.append("📅 Mid-career — balance between investments, insurance, and retirement savings (NPS recommended).")
    elif age < 55:
        tips.append("🔒 Approaching peak years — focus on debt-free living and low-risk stable investments.")
    else:
        tips.append("🏖️ Near retirement — shift to capital preservation: FDs, Senior Citizen Savings Scheme, Debt Funds.")

    # Emergency fund reminder
    tips.append(f"🛡️ Emergency Fund Goal: Build ₹{salary * 6:,.0f} (6 months' salary) as a financial safety net.")

    return tips


# ── Helper: Investment Suggester ──────────────────────────
def _suggest_investment(savings_pct: float, age: int) -> dict:
    if savings_pct < 10:
        return {
            "risk_profile": "Conservative",
            "options": [
                {"type": "Low Risk", "name": "Fixed Deposit (FD)", "reason": "Safe, guaranteed returns 6–7% p.a."},
                {"type": "Low Risk", "name": "Recurring Deposit (RD)", "reason": "Build discipline with small monthly deposits"},
                {"type": "Low Risk", "name": "Savings Account", "reason": "Keep liquid emergency fund here"},
            ],
            "note": "⚠️ Focus on saving first before investing. Build at least 3 months' expenses as emergency fund.",
        }
    elif savings_pct < 25:
        return {
            "risk_profile": "Moderate",
            "options": [
                {"type": "Low Risk", "name": "FD / PPF", "reason": "Stable base — 7–8% returns, tax-saving with PPF"},
                {"type": "Medium Risk", "name": "Mutual Funds (SIP)", "reason": "Start a SIP with ₹500–₹2000/month for long-term growth"},
                {"type": "Medium Risk", "name": "Index Funds", "reason": "Low-cost, tracks Nifty 50 / Sensex — 10–12% historical CAGR"},
            ],
            "note": "💡 Allocate 70% to low risk, 30% to medium risk for balanced growth.",
        }
    else:
        if age < 35:
            return {
                "risk_profile": "Aggressive Growth",
                "options": [
                    {"type": "Medium Risk", "name": "Equity Mutual Funds (SIP)", "reason": "Long-term compounding — best for young investors"},
                    {"type": "High Risk", "name": "Direct Stocks", "reason": "High returns possible — research before investing"},
                    {"type": "Medium Risk", "name": "NPS (Tier 1)", "reason": "Retirement planning + tax benefit under 80CCD"},
                    {"type": "Low Risk", "name": "PPF", "reason": "15-year lock-in with 7.1% tax-free returns"},
                ],
                "note": "🚀 You save well and are young — take calculated risks for wealth creation.",
            }
        else:
            return {
                "risk_profile": "Balanced",
                "options": [
                    {"type": "Low Risk", "name": "PPF / Senior Citizen Savings Scheme", "reason": "Guaranteed, tax-efficient returns"},
                    {"type": "Medium Risk", "name": "Balanced Mutual Funds", "reason": "Mix of equity and debt for growth with safety"},
                    {"type": "Medium Risk", "name": "Debt Funds", "reason": "Better returns than FD with moderate risk"},
                    {"type": "High Risk", "name": "Blue-chip Stocks (5–10%)", "reason": "Small allocation in stable, dividend-paying companies"},
                ],
                "note": "⚖️ Balance growth and capital preservation as you approach financial goals.",
            }
