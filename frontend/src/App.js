// ============================================================
//  AI Money Mentor — Root App
//  App.js
// ============================================================
import React, { useState } from "react";
import Form   from "./Form";
import Result from "./Result";
import "./styles.css";

const App = () => {
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const handleAnalyze = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch("/analyze", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot reach the backend. Make sure Flask is running on port 5000."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setResult(null); setError(null); };

  return (
    <div className="app">
      {/* ── Header ──────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-badge">
          <span className="dot" />
          AI Analytics Engine · v1.0
        </div>

        <div className="header-logo-container">
          <img src="/favicon.png" alt="AI Money Mentor Logo" className="app-logo" />
        </div>
        <h1>AI Money Mentor</h1>

        <div className="header-tagline">
          <p>Smart data analytics that turns your numbers into a personalised financial roadmap.</p>

          <div className="header-stats">
            {[
              { val: "0.1s",  lbl: "Analysis Time" },
              { val: "100%",  lbl: "Privacy First" },
              { val: "Free",  lbl: "No API Costs"  },
              { val: "6+",    lbl: "Data Metrics"  },
            ].map((s) => (
              <div key={s.lbl} className="hstat">
                <span className="hstat-val">{s.val}</span>
                <span className="hstat-lbl">{s.lbl}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="header-divider" />
      </header>

      {/* ── Content ─────────────────────────────────────── */}
      <main className="main-content">
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {!result
          ? <Form onSubmit={handleAnalyze} loading={loading} />
          : <Result data={result} onReset={handleReset} />
        }
      </main>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="app-footer">
        <strong>AI Money Mentor</strong> &nbsp;·&nbsp;
        Data Analytics Based Financial Advisor &nbsp;·&nbsp;
        Hackathon 2026 &nbsp;·&nbsp; No data stored — all processing is local
      </footer>
    </div>
  );
};

export default App;
