import React, { useState } from "react";

const FIELDS = [
  {
    id:          "salary",
    label:       "Monthly Salary",
    icon:        "💰",
    placeholder: "e.g. 50,000",
    hint:        "Your take-home monthly salary",
    prefix:      "₹",
    min:         1,
  },
  {
    id:          "expenses",
    label:       "Monthly Expenses",
    icon:        "🛒",
    placeholder: "e.g. 35,000",
    hint:        "Rent, food, transport, utilities & more",
    prefix:      "₹",
    min:         0,
  },
  {
    id:          "age",
    label:       "Your Age",
    icon:        "🎂",
    placeholder: "e.g. 27",
    hint:        "Age shapes your investment risk profile",
    prefix:      null,
    min:         18,
    max:         100,
  },
];

const Form = ({ onSubmit, loading }) => {
  const [values, setValues]   = useState({ salary: "", expenses: "", age: "" });
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  const validate = (vals = values) => {
    const e = {};
    const s = parseFloat(vals.salary);
    const x = parseFloat(vals.expenses);
    const a = parseInt(vals.age);

    if (!vals.salary || isNaN(s) || s <= 0)
      e.salary = "Enter a valid salary greater than ₹0";
    if (!vals.expenses || isNaN(x) || x < 0)
      e.expenses = "Enter valid expenses (₹0 or more)";
    if (!vals.age || isNaN(a) || a < 18 || a > 100)
      e.age = "Age must be between 18 and 100";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name]) {
      setErrors(validate(next));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = { salary: true, expenses: true, age: true };
    setTouched(allTouched);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSubmit({
      salary:   parseFloat(values.salary),
      expenses: parseFloat(values.expenses),
      age:      parseInt(values.age),
    });
  };

  const filled = Object.values(values).filter(Boolean).length;
  const progress = (filled / 3) * 100;

  return (
    <div className="form-wrapper glass-card">
      {/* Header */}
      <div className="form-header">
        <div className="form-header-icon">📊</div>
        <h2 className="form-title">Financial Information</h2>
        <p className="form-subtitle">
          Fill in your details below — we'll run a full analytics report in seconds.
        </p>

        {/* Step progress */}
        <div style={{ marginTop: 20 }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontSize: "0.72rem", color: "var(--dim)", marginBottom: 8,
          }}>
            <span style={{ fontWeight: 600, color: "var(--muted)" }}>
              {filled === 0 ? "Let's get started" : filled === 3 ? "All set! 🎉" : `${filled} of 3 fields filled`}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="meter-track">
            <div
              className="meter-fill"
              style={{
                width:      `${progress}%`,
                background: progress === 100
                  ? "linear-gradient(90deg, #22c55e, #4ade80)"
                  : "linear-gradient(90deg, #3b82f6, #06b6d4)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="form-body" noValidate>
        {FIELDS.map((field, idx) => (
          <div className="form-group" key={field.id} style={{ animationDelay: `${idx * 0.08}s` }}>
            <label className="form-label" htmlFor={field.id}>
              <span className="lbl-icon">{field.icon}</span>
              {field.label}
            </label>
            <div className="input-wrap">
              {field.prefix && (
                <span className="input-prefix">{field.prefix}</span>
              )}
              <input
                id={field.id}
                name={field.id}
                type="number"
                className={`form-input${field.prefix ? "" : " no-prefix"}`}
                placeholder={field.placeholder}
                value={values[field.id]}
                onChange={handleChange}
                onBlur={handleBlur}
                min={field.min}
                max={field.max}
                step="any"
                disabled={loading}
                autoComplete="off"
              />
              <div className="input-bar" />
            </div>

            {errors[field.id] && touched[field.id] ? (
              <div className="field-error">
                <span>⚠️</span> {errors[field.id]}
              </div>
            ) : (
              <div className="field-hint">{field.hint}</div>
            )}
          </div>
        ))}

        {/* Submit */}
        <button
          id="analyze-btn"
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          <div className="btn-inner">
            {loading ? (
              <>
                <span className="spinner" />
                Analyzing your finances...
              </>
            ) : (
              <>
                <span></span>
                Analyze My Finances
              </>
            )}
          </div>
        </button>
      </form>
    </div>
  );
};

export default Form;
