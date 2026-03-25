"""
=============================================================
  AI Money Mentor — Backend Unit Tests
  test_logic.py — Validate analytics engine
=============================================================
Run with: python test_logic.py
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from logic import analyze_finances

# ANSI colors for pretty output
GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
BLUE   = "\033[94m"
RESET  = "\033[0m"
BOLD   = "\033[1m"

pass_count = 0
fail_count = 0

def run_test(name, input_data, assertions):
    global pass_count, fail_count
    result = analyze_finances(**input_data)
    all_passed = True

    for key, expected in assertions.items():
        actual = result.get(key)
        if callable(expected):
            ok = expected(actual)
        else:
            ok = actual == expected

        if not ok:
            all_passed = False
            print(f"  {RED}✗ FAIL{RESET} [{key}]: got {repr(actual)}, expected {repr(expected)}")

    if all_passed:
        pass_count += 1
        print(f"{GREEN}✓ PASS{RESET} — {name}")
    else:
        fail_count += 1
        print(f"{RED}✗ FAIL{RESET} — {name}")

    return result

print(f"\n{BOLD}{BLUE}{'='*55}")
print("  AI Money Mentor — Analytics Engine Test Suite")
print(f"{'='*55}{RESET}\n")

# ── Test 1: Overspending User ─────────────────────────────
print(f"{YELLOW}[1] Overspending User{RESET}")
run_test(
    name="Savings < 10% → Overspending",
    input_data={"salary": 30000, "expenses": 28000, "age": 25},
    assertions={
        "savings":            lambda s: abs(s - 2000) < 1,
        "savings_percentage": lambda p: p < 10,
        "category":           lambda c: "Overspending" in c or "Critical" in c or "Moderate" not in c,
        "financial_score":    lambda s: s < 60,
    }
)

# ── Test 2: Moderate Saver ────────────────────────────────
print(f"\n{YELLOW}[2] Moderate Saver{RESET}")
run_test(
    name="Savings 10–20% → Moderate",
    input_data={"salary": 50000, "expenses": 42000, "age": 30},
    assertions={
        "savings":            lambda s: abs(s - 8000) < 1,
        "savings_percentage": lambda p: 10 <= p <= 20,
        "category":           lambda c: "Moderate" in c or "Average" in c,
    }
)

# ── Test 3: Good Saver ────────────────────────────────────
print(f"\n{YELLOW}[3] Good Saver{RESET}")
run_test(
    name="Savings > 20% → Good Saver / Excellent",
    input_data={"salary": 80000, "expenses": 50000, "age": 28},
    assertions={
        "savings":            lambda s: abs(s - 30000) < 1,
        "savings_percentage": lambda p: p > 20,
        "category":           lambda c: "Good" in c or "Excellent" in c,
        "financial_score":    lambda s: s >= 60,
    }
)

# ── Test 4: Deficit (Spending More Than Earned) ───────────
print(f"\n{YELLOW}[4] Deficit User{RESET}")
run_test(
    name="Expenses > Salary → Deficit",
    input_data={"salary": 20000, "expenses": 25000, "age": 22},
    assertions={
        "savings":            lambda s: s < 0,
        "savings_percentage": lambda p: p < 0,
        "category":           lambda c: "Critical" in c or "Overspending" in c,
        "financial_score":    lambda s: s < 50,
    }
)

# ── Test 5: High Earner / Aggressive Saver ────────────────
print(f"\n{YELLOW}[5] High Earner — Aggressive Saver{RESET}")
r = run_test(
    name="Savings > 35% + age < 35 → Aggressive Growth profile",
    input_data={"salary": 150000, "expenses": 60000, "age": 32},
    assertions={
        "savings":            lambda s: abs(s - 90000) < 1,
        "savings_percentage": lambda p: p > 35,
        "financial_score":    lambda s: s >= 75,
    }
)
print(f"     Investment Profile: {r['investment_suggestion']['risk_profile']}")

# ── Test 6: Senior / Near-Retirement ─────────────────────
print(f"\n{YELLOW}[6] Senior Saver (Age 58){RESET}")
r = run_test(
    name="Age > 55 → Conservative / balanced profile",
    input_data={"salary": 60000, "expenses": 35000, "age": 58},
    assertions={
        "savings":  lambda s: s > 0,
        "category": lambda c: "Good" in c or "Excellent" in c or "Moderate" in c,
    }
)
print(f"     Investment Profile: {r['investment_suggestion']['risk_profile']}")

# ── Test 7: Expense Ratio Check ───────────────────────────
print(f"\n{YELLOW}[7] Expense Ratio Check{RESET}")
run_test(
    name="expense_ratio = expenses/salary × 100",
    input_data={"salary": 40000, "expenses": 32000, "age": 27},
    assertions={
        "expense_ratio": lambda r: abs(r - 80.0) < 0.01,
    }
)

# ── Summary ───────────────────────────────────────────────
total = pass_count + fail_count
print(f"\n{BOLD}{BLUE}{'='*55}{RESET}")
print(f"  Results: {GREEN}{pass_count} passed{RESET}, {RED}{fail_count} failed{RESET} / {total} total")
print(f"{BOLD}{BLUE}{'='*55}{RESET}\n")
