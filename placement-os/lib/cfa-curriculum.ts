// 2027 CFA Level I Curriculum — structured from official topic outline
// Each topic has a weight band (CFA Institute exam weightings) and reading modules.

export interface CFAReading {
  id: string
  title: string
  los: string[] // learning outcome statements
}

export interface CFATopic {
  id: string
  name: string
  weightLow: number
  weightHigh: number
  color: string
  // tied to interview relevance for placement prep
  interviewRelevance: 'high' | 'medium' | 'low'
  readings: CFAReading[]
}

export const CFA_CURRICULUM: CFATopic[] = [
  {
    id: 'quant',
    name: 'Quantitative Methods',
    weightLow: 6, weightHigh: 9, color: '#3b82f6', interviewRelevance: 'high',
    readings: [
      { id: 'q1', title: 'Returns of Financial Assets and Instruments', los: ['Describe, compare, and interpret returns', 'Required rates of return, risk-free rates, risk premia, inflation'] },
      { id: 'q2', title: 'Types of Financial Returns', los: ['Calculate, compare, interpret different types of returns'] },
      { id: 'q3', title: 'Benchmarking Returns', los: ['Money-weighted vs time-weighted rates of return', 'Index construction and weighting methods'] },
      { id: 'q4', title: 'The Time Value of Money in Finance', los: ['PV of fixed-income and equity instruments', 'Implied return, implied growth', 'Cash flow additivity & no-arbitrage'] },
      { id: 'q5', title: 'Statistical Characteristics of Asset Returns', los: ['Central tendency & dispersion', 'Skewness and kurtosis', 'Covariance and correlation', 'Semi-deviation, coefficient of variation'] },
      { id: 'q6', title: 'Statistical Distributions for Asset Prices and Returns', los: ['Unconditional expected values', 'Principal moments of key distributions', 'Conditional expectations', 'Bayesian updating'] },
      { id: 'q7', title: 'Estimation and Hypothesis Testing', los: ['Central limit theorem & confidence intervals', 'Hypothesis testing, Type I/II errors, power of a test', 'Parametric vs non-parametric tests'] },
      { id: 'q8', title: 'The Return and Risk of a Financial Portfolio', los: ['Portfolio expected return, variance, covariance', 'Minimum-variance portfolio & efficient frontier', 'Optimal portfolio, CAL, CML'] },
      { id: 'q9', title: 'Simulation of Financial Asset Prices and Returns', los: ['Historical simulation', 'Bootstrap resampling', 'Monte Carlo simulation'] },
      { id: 'q10', title: 'Applications of Simple Linear Regression in Finance', los: ['Least squares estimation', 'Regression assumptions & residual analysis, ANOVA', 'Predicted values, standard error, prediction intervals', 'CAPM variable estimates'] },
      { id: 'q11', title: 'Introduction to Financial Data Science', los: ['Big data, ML, and AI in financial data science & fintech'] },
    ],
  },
  {
    id: 'econ',
    name: 'Economics',
    weightLow: 6, weightHigh: 9, color: '#8b5cf6', interviewRelevance: 'high',
    readings: [
      { id: 'e1', title: 'The Firm and Market Structures', los: ['Breakeven & shutdown points', 'Perfect/monopolistic competition, oligopoly, monopoly', 'Pricing strategy under different structures', 'Concentration measures'] },
      { id: 'e2', title: 'Understanding Business Cycles', los: ['Business cycle & phases', 'Credit cycles', 'Economic indicators'] },
      { id: 'e3', title: 'Fiscal Policy', los: ['Monetary vs fiscal policy', 'Roles, objectives, national debt/GDP', 'Tools of fiscal policy', 'Expansionary vs contractionary'] },
      { id: 'e4', title: 'Monetary Policy', los: ['Roles & objectives of central banks', 'Monetary policy tools & transmission', 'Inflation/interest/exchange rate targeting', 'Monetary-fiscal interaction'] },
      { id: 'e5', title: 'Introduction to Geopolitics', los: ['Cooperation vs competition', 'Globalization', 'World Bank, IMF, WTO', 'Geopolitical risk & impact on investments'] },
      { id: 'e6', title: 'International Trade', los: ['Benefits & costs of trade', 'Tariffs, quotas, export subsidies', 'Trading blocs, common markets'] },
      { id: 'e7', title: 'Capital Flows and the FX Market', los: ['FX market functions & participants', 'Nominal vs real exchange rates', 'Exchange rate regimes', 'Capital restrictions'] },
      { id: 'e8', title: 'Exchange Rate Calculations', los: ['Currency cross-rates', 'Spot-forward arbitrage, forward points, discount/premium'] },
    ],
  },
  {
    id: 'fsa',
    name: 'Financial Statement Analysis',
    weightLow: 11, weightHigh: 14, color: '#f59e0b', interviewRelevance: 'high',
    readings: [
      { id: 'f1', title: 'Introduction to Financial Statement Analysis', los: ['FSA framework steps', 'Roles of FSA', 'Regulatory filings, notes, MD&A, audit reports', 'Alternative reporting systems'] },
      { id: 'f2', title: 'Analyzing Income Statements', los: ['Revenue recognition principles', 'Expense recognition, capitalize vs expense', 'Non-recurring items', 'Basic & diluted EPS', 'Common-size income statements'] },
      { id: 'f3', title: 'Analyzing Balance Sheets', los: ['Intangible assets & goodwill', 'Financial instruments', 'Non-current liabilities', 'Common-size balance sheets'] },
      { id: 'f4', title: 'Analyzing Statements of Cash Flows I', los: ['CF statement links to IS & BS', 'Direct vs indirect method', 'IFRS vs US GAAP'] },
      { id: 'f5', title: 'Analyzing Statements of Cash Flows II', los: ['Common-size cash flow analysis', 'FCFF, FCFE, coverage ratios'] },
      { id: 'f6', title: 'Analysis of Inventories', los: ['Lower of cost & NRV', 'Inflation/deflation effects, LIFO vs FIFO', 'Inventory disclosures'] },
      { id: 'f7', title: 'Analysis of Long-Term Assets', los: ['Intangible asset reporting', 'Impairment & derecognition of PP&E', 'PP&E disclosures'] },
      { id: 'f8', title: 'Topics in Long-Term Liabilities and Equity', los: ['Leases (lessor/lessee)', 'Pension plans & stock-based comp', 'Long-term liability disclosures'] },
      { id: 'f9', title: 'Analysis of Income Taxes', los: ['Accounting profit vs taxable income', 'Deferred tax assets & liabilities', 'Effective vs statutory vs cash tax rate'] },
      { id: 'f10', title: 'Financial Reporting Quality', los: ['Reporting quality vs results quality', 'Conservative vs aggressive accounting', 'Earnings manipulation warning signs', 'Non-GAAP measures'] },
      { id: 'f11', title: 'Financial Analysis Techniques', los: ['Activity, liquidity, solvency, profitability ratios', 'DuPont analysis', 'Industry-specific ratios', 'Forecasting earnings'] },
      { id: 'f12', title: 'Introduction to Financial Statement Modeling', los: ['Sales-based pro forma model', 'Behavioral factors & analyst biases', "Porter's five forces", 'Forecast horizon choices'] },
    ],
  },
  {
    id: 'corp',
    name: 'Corporate Issuers',
    weightLow: 6, weightHigh: 9, color: '#00d4aa', interviewRelevance: 'high',
    readings: [
      { id: 'c1', title: 'Organizational Forms, Features, and Ownership', los: ['Organizational forms', 'Key features of corporate issuers', 'Public vs private issuers'] },
      { id: 'c2', title: 'Investors and Other Stakeholders', los: ['Lenders vs shareholders', 'Stakeholder groups & interests', 'ESG factors'] },
      { id: 'c3', title: 'Corporate Governance', los: ['Principal-agent conflicts', 'Governance mechanisms', 'Risks of poor governance'] },
      { id: 'c4', title: 'Working Capital and Liquidity', los: ['Cash conversion cycle', 'Liquidity levels', 'Managing working capital'] },
      { id: 'c5', title: 'Capital Investments and Capital Allocation', los: ['Types of capital investments', 'NPV, IRR, ROIC', 'Capital allocation pitfalls', 'Real options'] },
      { id: 'c6', title: 'Capital Structure', los: ['WACC calculation', 'Factors affecting capital structure', 'Modigliani-Miller propositions', 'Optimal/target capital structures'] },
      { id: 'c7', title: 'Business Models', los: ['Key features of business models', 'Types of business models'] },
    ],
  },
  {
    id: 'equity',
    name: 'Equity Investments',
    weightLow: 11, weightHigh: 14, color: '#f43f5e', interviewRelevance: 'high',
    readings: [
      { id: 'eq1', title: 'Equity Instrument Features', los: ['Basic features & types of equity', 'Public vs private equity securities'] },
      { id: 'eq2', title: 'Equity Jurisdictions, Classes, and Voting', los: ['Economic & voting rights across jurisdictions', 'Voting process & roles'] },
      { id: 'eq3', title: 'Equity Issuance and Trading', los: ['Primary & secondary markets', 'Exchange vs OTC trading', 'Liquidity measures, float, ADV', 'Equity indexes'] },
      { id: 'eq4', title: 'Sources of Equity Returns', los: ['Dividends, repurchases, splits', 'Dividend payment chronology', 'Price & total return'] },
      { id: 'eq5', title: 'Introduction to Equity Valuation', los: ['Price vs value', 'Book value, market cap, enterprise value', 'Categories of valuation models'] },
      { id: 'eq6', title: 'Discounted Cash Flow (DCF) and Growth Models', los: ['DDM, FCFE, FCFF, residual income inputs', 'Constant & multistage growth intrinsic value', 'Shortcomings of growth assumptions', 'Preferred stock valuation'] },
      { id: 'eq7', title: 'Relative Value Equity Valuation Approaches', los: ['Method of comparables & forecasted fundamentals', 'Price & enterprise value multiples', 'Peer group determination'] },
      { id: 'eq8', title: 'Financial Statement Forecasting in Equity Valuation', los: ['Forecast model construction & uses', 'Model evaluation', 'Estimating value from forecast outputs'] },
      { id: 'eq9', title: 'Industry and Competitive Analysis', los: ['Industry & competitive analysis process', 'Industry classification methods', "Porter's Five Forces & PESTLE"] },
      { id: 'eq10', title: 'Company Analysis: Past, Present, and Future', los: ['Competitive strategy & position', 'Revenue drivers, profitability, pricing power', 'Working capital & capital structure'] },
      { id: 'eq11', title: 'Equity Analyst Research Reports', los: ['Elements of a research report', 'Sell-side vs buy-side reports', 'Why value estimates differ'] },
      { id: 'eq12', title: 'CAPM, Market Model, and Factor-Based Models', los: ['CAPM & market model for required return', 'Arbitrage pricing theory & multi-factor models'] },
    ],
  },
  {
    id: 'fixed',
    name: 'Fixed Income',
    weightLow: 11, weightHigh: 14, color: '#06b6d4', interviewRelevance: 'medium',
    readings: [
      { id: 'fi1', title: 'Fixed-Income Instrument Features', los: ['Features of fixed-income securities', 'Bond indenture, affirmative vs negative covenants'] },
      { id: 'fi2', title: 'Fixed-Income Cash Flows and Types', los: ['Common cash flow structures', 'Legal, regulatory, tax considerations'] },
      { id: 'fi3', title: 'Fixed-Income Issuance and Trading', los: ['Market segments & participants', 'Fixed-income indexes', 'Primary vs secondary markets'] },
      { id: 'fi4', title: 'Markets for Corporate Issuers', los: ['Short-term funding alternatives', 'Repurchase agreements (repos)', 'Investment-grade vs high-yield'] },
      { id: 'fi5', title: 'Markets for Government Issuers', los: ['Sovereign & non-sovereign funding', 'Government vs corporate issuance'] },
      { id: 'fi6', title: 'Bond Valuation: Prices and Yields', los: ["Bond price given YTM", 'Price/coupon/maturity/yield relationships', 'Matrix pricing'] },
      { id: 'fi7', title: 'Yield and Yield Spread Measures (Fixed-Rate)', los: ['Annual yield for varying compounding', 'Yield & spread measures'] },
      { id: 'fi8', title: 'Yield Measures (Floating-Rate)', los: ['Yield spreads for floating-rate', 'Money market yield measures'] },
      { id: 'fi9', title: 'Term Structure: Spot, Par, Forward Curves', los: ['Spot rates & spot curve', 'Par & forward rates', 'Curve comparison'] },
      { id: 'fi10', title: 'Interest Rate Risk and Return', los: ['Sources of return from fixed-rate bonds', 'Holding period return & Macaulay duration'] },
      { id: 'fi11', title: 'Yield-Based Duration Measures', los: ['Modified duration, money duration, PVBP', 'Maturity/coupon/yield effects on risk'] },
      { id: 'fi12', title: 'Convexity and Portfolio Properties', los: ['Convexity & convexity adjustment', 'Price change from duration + convexity', 'Portfolio duration & convexity'] },
      { id: 'fi13', title: 'Curve-Based and Empirical Risk Measures', los: ['Effective duration & convexity', 'Key rate duration', 'Empirical vs analytical duration'] },
      { id: 'fi14', title: 'Credit Risk', los: ['Credit risk components: PD & LGD', 'Credit rating agencies', 'Factors influencing yield spreads'] },
      { id: 'fi15', title: 'Credit Analysis (Government & Corporate)', los: ['Sovereign/non-sovereign credit', 'Corporate creditworthiness factors', 'Seniority & priority of claims'] },
      { id: 'fi16', title: 'Securitization, ABS & MBS', los: ['Benefits of securitization', 'Credit enhancement structures', 'ABS, CDO, RMBS, CMBS features & risks', 'Prepayment risk & time tranching'] },
    ],
  },
  {
    id: 'deriv',
    name: 'Derivatives',
    weightLow: 5, weightHigh: 8, color: '#a855f7', interviewRelevance: 'medium',
    readings: [
      { id: 'd1', title: 'Derivative Instrument and Market Features', los: ['Define derivative & basic features', 'OTC vs exchange-traded markets'] },
      { id: 'd2', title: 'Forward Commitment and Contingent Claim Features', los: ['Forwards, futures, swaps, options, credit derivatives', 'Option value at expiration & profit', 'Forward commitments vs contingent claims'] },
      { id: 'd3', title: 'Derivative Benefits, Risks, and Uses', los: ['Benefits & risks of derivatives', 'Issuer vs investor uses'] },
      { id: 'd4', title: 'Arbitrage, Replication, and Cost of Carry', los: ['Arbitrage & replication in pricing', 'Spot vs expected future price, cost of carry'] },
      { id: 'd5', title: 'Pricing/Valuation of Forward Contracts', los: ['Forward value & price at initiation/life/expiration', 'Interest rate forward contracts'] },
      { id: 'd6', title: 'Pricing/Valuation of Futures Contracts', los: ['Forward vs futures value & price', 'Why forward & futures prices differ'] },
      { id: 'd7', title: 'Pricing/Valuation of Swaps', los: ['Swaps vs series of forwards', 'Value vs price of swaps'] },
      { id: 'd8', title: 'Pricing/Valuation of Options', los: ['Exercise value, moneyness, time value', 'Arbitrage & replication for options', 'Factors determining option value'] },
      { id: 'd9', title: 'Option Replication Using Put-Call Parity', los: ['Put-call parity for European options', 'Put-call forward parity'] },
      { id: 'd10', title: 'Valuing a Derivative Using Binomial Model', los: ['One-period binomial model', 'Risk neutrality in pricing'] },
    ],
  },
  {
    id: 'alts',
    name: 'Alternative Investments',
    weightLow: 7, weightHigh: 10, color: '#10b981', interviewRelevance: 'medium',
    readings: [
      { id: 'a1', title: 'Alternative Investment Features, Methods, Structures', los: ['Features & categories of alts', 'Direct, co-investment, fund methods', 'Ownership & compensation structures'] },
      { id: 'a2', title: 'Alternative Investment Performance and Returns', los: ['Performance appraisal', 'Returns before & after fees'] },
      { id: 'a3', title: 'Investments in Private Capital: Equity and Debt', los: ['Private equity features', 'Private debt features', 'Diversification benefits'] },
      { id: 'a4', title: 'Real Estate and Infrastructure', los: ['Real estate features & characteristics', 'Infrastructure features & characteristics'] },
      { id: 'a5', title: 'Natural Resources', los: ['Raw land, timberland, farmland', 'Commodities', 'Risk, return, diversification'] },
      { id: 'a6', title: 'Hedge Funds', los: ['Hedge fund features', 'Investment forms & vehicles', 'Risk, return, diversification'] },
      { id: 'a7', title: 'Introduction to Digital Assets', los: ['DLT financial applications', 'Digital asset investment features', 'Investment forms & vehicles', 'Risk & diversification'] },
    ],
  },
  {
    id: 'pm',
    name: 'Portfolio Management',
    weightLow: 8, weightHigh: 12, color: '#eab308', interviewRelevance: 'high',
    readings: [
      { id: 'p1', title: 'Portfolio Risk and Return: Part I', los: ['Major asset class characteristics', 'Risk aversion & portfolio selection', 'Optimal portfolio & CAL', 'Mean, variance, covariance', 'Portfolio standard deviation', 'Efficient frontier & GMV portfolio'] },
      { id: 'p2', title: 'Portfolio Risk and Return: Part II', los: ['Risk-free asset + risky portfolio', 'CAL and CML', 'Systematic vs nonsystematic risk', 'Return generating models, beta', 'CAPM, SML, expected return', 'Sharpe, Treynor, M2, Jensens alpha'] },
      { id: 'p3', title: 'Portfolio Management: An Overview', los: ['Portfolio approach to investing', 'Portfolio management process steps', 'Types of investors', 'DC & DB pension plans', 'Mutual funds & pooled products'] },
      { id: 'p4', title: 'Basics of Portfolio Planning and Construction', los: ['Investment policy statement (IPS)', 'Risk & return objectives', 'Willingness vs ability to take risk', 'Investment constraints', 'Asset allocation & ESG integration'] },
      { id: 'p5', title: 'The Behavioral Biases of Individuals', los: ['Cognitive errors vs emotional biases', 'Common behavioral biases', 'Market implications'] },
      { id: 'p6', title: 'Introduction to Risk Management', los: ['Define risk management', 'Risk management framework', 'Risk governance & budgeting', 'Sources of risk', 'Measuring & modifying risk exposures'] },
    ],
  },
  {
    id: 'ethics',
    name: 'Ethical & Professional Standards',
    weightLow: 15, weightHigh: 20, color: '#ec4899', interviewRelevance: 'low',
    readings: [
      { id: 'et1', title: 'Ethics and Trust in the Investment Profession', los: ['Explain ethics', 'Role of a code of ethics', 'How professions establish trust', 'Framework for ethical decision-making'] },
      { id: 'et2', title: 'Code of Ethics and Standards of Professional Conduct', los: ['Professional Conduct Program structure', 'Six components of Code, seven Standards', 'Ethical responsibilities & sub-sections'] },
      { id: 'et3', title: 'Standard I: Professionalism', los: ['Application to professional integrity issues', 'Preventive practices & procedures', 'Conforming vs violating conduct'] },
      { id: 'et4', title: 'Standard II: Integrity of Capital Markets', los: ['Application to integrity issues', 'Preventive practices', 'Conforming vs violating conduct'] },
      { id: 'et5', title: 'Standard III: Duties to Clients', los: ['Application to integrity issues', 'Preventive practices', 'Conforming vs violating conduct'] },
      { id: 'et6', title: 'Standard IV: Duties to Employers', los: ['Application to integrity issues', 'Preventive practices', 'Conforming vs violating conduct'] },
      { id: 'et7', title: 'Standard V: Investment Analysis, Recommendations, Actions', los: ['Application to integrity issues', 'Preventive practices', 'Conforming vs violating conduct'] },
      { id: 'et8', title: 'Standard VI: Conflicts of Interest', los: ['Application to integrity issues', 'Preventive practices', 'Conforming vs violating conduct'] },
      { id: 'et9', title: 'Standard VII: Responsibilities as Member/Candidate', los: ['Thorough knowledge of Code & Standards', 'Preventive practices & procedures'] },
      { id: 'et10', title: 'Application of the Code and Standards: Level I', los: ['Evaluate practices, policies, conduct', 'Explain violations of Code & Standards'] },
    ],
  },
]

export const TOTAL_READINGS = CFA_CURRICULUM.reduce((sum, t) => sum + t.readings.length, 0)
export const TOTAL_LOS = CFA_CURRICULUM.reduce((sum, t) => sum + t.readings.reduce((s, r) => s + r.los.length, 0), 0)
