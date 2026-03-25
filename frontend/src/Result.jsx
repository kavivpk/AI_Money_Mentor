// ============================================================
//  AI Money Mentor — Premium Result Dashboard
//  Result.jsx
// ============================================================
import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ── Helpers ───────────────────────────────────────────────────
const getScoreTheme = (s) => {
  if (s >= 80) return { color: "#4ade80", emoji: "🏆", label: "Financial Master", badge: "Excellent" };
  if (s >= 65) return { color: "#60a5fa", emoji: "💎", label: "Smart Saver",     badge: "Good" };
  if (s >= 45) return { color: "#facc15", emoji: "⚖️", label: "Balanced",        badge: "Average" };
  return             { color: "#f87171", emoji: "🚨", label: "Attention Needed", badge: "Poor" };
};

const formatCurrency = (n, forPdf = false) => {
  const symbol = forPdf ? "Rs. " : "₹";
  return `${symbol}${Math.abs(n).toLocaleString("en-IN")}`;
};

// ── Components ────────────────────────────────────────────────

// Custom count-up hook for numbers
const useCountUp = (end, duration = 1500) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);
  return count;
};

const ScoreRing = ({ score }) => {
  const theme = getScoreTheme(score);
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);
  const animatedScore = useCountUp(score);

  useEffect(() => {
    const progressOffset = circumference - (score / 100) * circumference;
    const timer = setTimeout(() => setOffset(progressOffset), 100);
    return () => clearTimeout(timer);
  }, [score, circumference]);

  return (
    <div className="score-ring-outer">
      <svg className="score-svg">
        <circle className="score-track" cx="100" cy="100" r={radius} />
        <circle
          className="score-fill"
          cx="100" cy="100" r={radius}
          stroke={theme.color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="score-center">
        <div className="score-number" style={{ color: theme.color }}>{animatedScore}</div>
        <div className="score-of">Out of 100</div>
        <div className="score-emoji">{theme.emoji}</div>
      </div>
    </div>
  );
};

const Result = ({ data, onReset }) => {
  const {
    salary, expenses, savings, savings_percentage, expense_ratio,
    financial_score, category, advice, investment_suggestion,
    yearly_savings, five_year_savings, impact_text,
    emergency_fund_goal,
  } = data;

  const theme = getScoreTheme(financial_score);

  const pieData = [
    { name: "Expenses", value: expenses, fill: "#f87171" },
    { name: "Savings",  value: Math.max(savings, 0), fill: "#4ade80" },
  ];

  const barData = [
    { name: "Income",   amount: salary,   fill: "#60a5fa" },
    { name: "Expenses", amount: expenses, fill: "#f87171" },
    { name: "Savings",  amount: Math.max(savings, 0), fill: "#4ade80" },
  ];

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(59, 130, 246);
    doc.text("AI Money Mentor - Financial Report", 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Financial Score: ${financial_score} / 100`, 20, 36);
    
    // Stats Table
    autoTable(doc, {
      startY: 45,
      head: [['Metric', 'Value']],
      body: [
        ['Monthly Salary', formatCurrency(salary, true)],
        ['Monthly Expenses', formatCurrency(expenses, true)],
        ['Monthly Savings', formatCurrency(savings, true)],
        ['Savings Percentage', `${savings_percentage}%`],
        ['Expense Ratio', `${expense_ratio}%`],
        ['Emergency Fund Goal', formatCurrency(emergency_fund_goal, true)],
      ],
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    // Advice Section
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 100;
    doc.setFontSize(16);
    doc.text("Personalized Advice", 20, finalY);
    
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    advice.slice(0, 10).forEach((tip, idx) => {
      // Remove emojis and special characters for PDF compatibility
      const cleanTip = tip.replace(/[^\x00-\x7F]/g, "").replace(/\s\s+/g, ' ').trim();
      doc.text(`- ${cleanTip}`, 20, finalY + 10 + (idx * 7));
    });
    
    // Branding Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text("Powered by AI Money Mentor Analytics", 105, 285, { align: 'center' });
    }
    
    doc.save("Financial_Analysis_Report.pdf");
  };

  return (
    <div className="results-wrapper">

      {/* Hero Banner */}
      <div className="results-hero">
        <h2>Your Financial Analysis Report</h2>
        <p>Instant insights powered by our data analytics engine</p>
        
        <div className="hero-actions">
          <button className="download-btn" onClick={generatePDF}>
            <span>📥</span> Download Full PDF Report
          </button>
        </div>
      </div>

      {/* Score Section */}
      <div className="glass-card score-section">
        <ScoreRing score={financial_score} />
        <div className="score-label-text">{theme.label}</div>
        <div className="score-badge" style={{ color: theme.color, borderColor: theme.color + "44" }}>
          <span>✨</span> {category}
        </div>

        {/* Impact Message */}
        <div className="impact-message" style={{ color: theme.color }}>
          <span className="impact-icon">💡</span> {impact_text}
        </div>

        <div className="score-meter">
          <div className="meter-labels">
            <span>Poor</span>
            <span>Average</span>
            <span>Good</span>
            <span>Excellent</span>
          </div>
          <div className="meter-track">
            <div
              className="meter-fill"
              style={{
                width: `${financial_score}%`,
                background: `linear-gradient(90deg, #f87171, ${theme.color})`
              }}
            />
          </div>
          <div className="meter-ticks">
            <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <div className="stat-icon-wrap">💼</div>
          <div className="stat-value">{formatCurrency(salary)}</div>
          <div className="stat-name">Monthly Salary</div>
        </div>
        <div className="stat-card stat-red">
          <div className="stat-icon-wrap">🛒</div>
          <div className="stat-value">{formatCurrency(expenses)}</div>
          <div className="stat-name">Monthly Expenses</div>
        </div>
        <div className={`stat-card ${savings >= 0 ? 'stat-green' : 'stat-red'}`}>
          <div className="stat-icon-wrap">{savings >= 0 ? '💵' : '⚠️'}</div>
          <div className="stat-value">{(savings < 0 ? '-' : '') + formatCurrency(savings)}</div>
          <div className="stat-name">Monthly Savings</div>
        </div>
        <div className="stat-card stat-yellow">
          <div className="stat-icon-wrap">📊</div>
          <div className="stat-value">{savings_percentage.toFixed(1)}%</div>
          <div className="stat-name">Savings Rate</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="glass-card chart-section">
        <div className="section-header">
          <div className="section-title">
            <div className="section-icon">📈</div>
            Income Breakdown & Comparison
          </div>
          <div className="section-pill">Live Data</div>
        </div>

        <div className="charts-grid">
          <div>
            <div className="chart-label">Distribution</div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "10px" }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <div className="chart-label">Comparison (₹)</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "10px" }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="ratio-bar-section">
          <div className="ratio-row">
            <span className="ratio-label">📊 Expense Ratio</span>
            <span className="ratio-value" style={{ color: expense_ratio > 80 ? '#f87171' : '#facc15' }}>
              {expense_ratio.toFixed(1)}%
            </span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(expense_ratio, 100)}%`,
                background: expense_ratio > 80 ? 'var(--red)' : 'var(--yellow)'
              }}
            />
          </div>
          <div className="ratio-hint">Ideal: keep expenses below 80% of income</div>
        </div>
      </div>

      {/* Future Savings Prediction Section */}
      <div className="glass-card savings-projection-section">
        <div className="section-header">
          <div className="section-title">
            <div className="section-icon">🔮</div>
            Future Savings Prediction
          </div>
          <div className="section-pill">Data Projection</div>
        </div>

        <div className="projection-grid">
          <div className="projection-card">
            <div className="proj-time">After 1 Year</div>
            <div className="proj-value">{formatCurrency(yearly_savings)}</div>
            <div className="proj-label">Estimated Savings</div>
          </div>
          <div className="projection-card highlight">
            <div className="proj-time">After 5 Years</div>
            <div className="proj-value">{formatCurrency(five_year_savings)}</div>
            <div className="proj-label">Estimated Savings</div>
            <div className="proj-growth-tag">5x growth</div>
          </div>
        </div>
        <p className="proj-note">
          ⚠️ Note: Predictions assume constant monthly savings and no interest/inflation.
        </p>
      </div>

      {/* Financial Safety Net - Emergency Fund Section */}
      <div className="glass-card emergency-fund-section">
        <div className="section-header">
          <div className="section-title">
            <div className="section-icon">🛡️</div>
            Financial Safety Net
          </div>
          <div className="section-pill">6-Month Target</div>
        </div>

        <div className="emergency-fund-body">
          <div className="ef-stats-row">
            <div className="ef-stat">
              <span className="ef-label">Target Goal</span>
              <span className="ef-value">{formatCurrency(emergency_fund_goal)}</span>
            </div>
            <div className="ef-stat">
              <span className="ef-label">Monthly Expenses</span>
              <span className="ef-value">{formatCurrency(expenses)}</span>
            </div>
          </div>

          <div className="ef-tracker">
            <div className="ef-track-header">
              <span>Goal Progress (Estimated)</span>
              <span className="ef-percent">
                {savings > 0 ? `${Math.min(((savings / expenses) * 100), 100).toFixed(0)}% monthly coverage` : "0% coverage"}
              </span>
            </div>
            <div className="meter-track">
              <div 
                className="meter-fill" 
                style={{ 
                  width: `${Math.min(((savings / expenses) * 100), 100)}%`,
                  background: 'var(--grad-green)' 
                }} 
              />
            </div>
            <p className="ef-info">
              💡 Experts recommend saving at least <strong>6 months</strong> of expenses for emergencies.
            </p>
          </div>
        </div>
      </div>

      {/* Advice Section */}
      <div className="glass-card advice-section">
        <div className="section-header">
          <div className="section-title">
            <div className="section-icon">🤖</div>
            AI-Powered Personalized Advice
          </div>
          <div className="section-pill">{advice.length} tips</div>
        </div>
        <ul className="advice-list">
          {advice.map((tip, idx) => (
            <li className="advice-item" key={idx} style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="advice-dot" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Investment Section */}
      <div className="glass-card investment-section">
        <div className="section-header">
          <div className="section-title">
            <div className="section-icon">🎯</div>
            Investment Strategy
          </div>
        </div>

        <div className="risk-profile-row">
          <span className="ratio-label">Target Profile:</span>
          <span className={`risk-badge risk-${investment_suggestion.risk_profile.split(' ')[0].toLowerCase()}`}>
            {investment_suggestion.risk_profile}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--dim)' }}>Based on your age & savings rate</span>
        </div>

        <div className="investment-grid">
          {investment_suggestion.options.map((option, idx) => (
            <div className="investment-card" key={idx} style={{ animationDelay: `${idx * 0.15}s` }}>
              <span className={`inv-type-chip ${option.type.toLowerCase().replace(' ', '-')}`}>
                {option.type}
              </span>
              <div className="inv-name">{option.name}</div>
              <div className="inv-reason">Smart allocation for long-term growth and stability.</div>
            </div>
          ))}
        </div>

        <div className="inv-note">
          <strong>Pro Tip:</strong> {investment_suggestion.note}
        </div>
      </div>

      {/* Reset Button */}
      <div className="reset-section">
        <button id="reset-btn" className="reset-btn" onClick={onReset}>
          <span>←</span> Analyze Different Numbers
        </button>
      </div>

    </div>
  );
};

export default Result;
