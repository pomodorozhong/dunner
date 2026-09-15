# Fintech Portfolio Project Ideas — Consolidated Ranking

This is the consolidated ranking of the ideas in the three source documents in this folder. Similar ideas are merged, and the ranking is based on the best balance of:

1. A recurring problem that can be validated with real users
2. A focused MVP that a designer and a PM/programmer can ship
3. Strong portfolio evidence: trust, data clarity, edge cases, and product judgment
4. A credible path to paid usage
5. Low regulatory and operational exposure

The ranking is for a real, testable product—not merely a polished mockup. Use real imports where practical, but avoid holding money, moving money, or giving personalized financial advice.

## Executive ranking

Rows are sorted by estimated MVP duration in ascending order. The original overall portfolio ranking is retained in the first column. All timeline values are numeric weeks, using one midpoint estimate per idea.

| Portfolio rank | Consolidated idea | MVP weeks (estimate) | Best evidence of value | Recommendation |
| ---: | --- | --- | --- | --- |
| 3 | Subscription cost auditor | 1.5 | Recurring spend found, explained, and cancelled | Fastest credible launch |
| 11 | Bill split and shared-expense app | 1.5 | Fewer calculation and settlement misunderstandings | Useful practice project; crowded category |
| 8 | Investment watchlist and trading sandbox | 2.5 | Risk and order states made understandable | Good visual/data-viz option; simulated only |
| 9 | Savings goals and rule-based budgeting simulator | 3.0 | Progress and automation made visible | Good systems and interaction-design option |
| 10 | Neobank onboarding and card dashboard | 3.0 | Trust, safety, and account-state UX demonstrated | Good portfolio piece, weaker standalone product |
| 12 | Cross-border P2P transfer and split pay | 3.5 | Fees, rates, and confirmation risk made explicit | Use mock money movement only |
| 13 | Lending or credit-decision explainer | 4.0 | Complex decision factors and APR made legible | Compliance-heavy and should use fictional data |
| 2 | Freelancer payment tracker | 4.5 | Better visibility into overdue, partial, and expected payments | Best if freelancers are easy to recruit |
| 1 | Stripe payout reconciler | 5.0 | Faster month-end reconciliation and fewer unexplained deposits | Best overall choice |
| 4 | Marketplace fee auditor | 6.0 | Missing payouts and margin leakage identified | Strongest seller-focused alternative |
| 5 | Receipt collection workspace | 6.0 | Less time chasing missing supporting documents | Strong B2B workflow case study |
| 6 | Chargeback evidence builder | 6.0 | Complete evidence packages produced before deadlines | Strong operations and responsible-AI case study |
| 7 | Multi-currency profitability tracker | 7.0 | Difference between quoted and received money explained | Good international-freelancer niche |
| 14 | Family wallet and allowance | 8.0 | Parent/teen roles and approvals handled clearly | Interesting permissions problem, slower validation |
| 15 | Real bank aggregation | 8.0 | Accounts unified in one view | Deprioritize; integrations will dominate the work |
| 16 | Marketplace lending or investing | 10.0 | Matching, underwriting, or portfolio mechanics | Avoid as a first portfolio product |

## Recommended decision

Start with the **Stripe payout reconciler** if the team can reach at least five Stripe merchants, bookkeepers, or accountants. It combines real financial data, reconciliation logic, privacy, error handling, and a focused business workflow without requiring money movement.

Choose the **freelancer payment tracker** instead if freelancer access is materially better. Recruitability is more important than a theoretically larger market for a first product.

Choose the **subscription cost auditor** if the priority is to ship a credible vertical slice in one or two weeks and use it as a foundation for a larger case study.

## Detailed ranking

### 1. Stripe payout reconciler

**Target user:** Small online businesses and bookkeepers that need to explain Stripe deposits.

**Core problem:** One payout can combine charges, fees, refunds, disputes, and other balance activity. Users need to reconcile the final deposit before closing the books or answering an accountant’s questions.

**Focused MVP:** Upload one supported Stripe CSV export, list payouts, inspect the underlying transactions, flag unmatched items, add resolution notes, and export a monthly reconciliation report.

**Why it ranks first:** It has the best combination of real workflow value, differentiated fintech complexity, manageable scope, and a clear path from CSV import to a read-only integration. It also produces strong case-study material: data modeling, explanations, exceptions, privacy, and failure states.

**Keep out of v1:** Bank connections, general-ledger functionality, automatic accounting entries, multiple currencies, and automated money movement.

### 2. Freelancer payment tracker

**Target user:** Freelancers and small agencies with roughly 5–30 active invoices.

**Core problem:** The difficult part of invoicing often comes after the invoice is sent: partial payments, promised dates, polite follow-ups, and uncertainty about near-term cash.

**Focused MVP:** Add or import invoices, track sent/due/promised dates, record partial payments, show expected receipts for the next 30 days, draft follow-ups, and export outstanding invoices.

**Why it ranks second:** The audience is accessible, the pain is easy to demonstrate, and the workflow has a natural endpoint. It is more likely to get real user feedback than a concept that depends on financial integrations.

**Keep out of v1:** Invoice generation, payment processing, automatic email sending, and full cash-flow accounting.

### 3. Subscription cost auditor

**Target user:** Individuals, freelancers, or small teams with recurring software and service charges.

**Core problem:** Recurring spending is scattered across statements and often remains invisible until renewal or a price increase.

**Focused MVP:** Import a CSV or add recurring items manually, detect recurring charges, show monthly and annual burn, display upcoming renewals, flag low-value or unused items, and guide the user through cancellation.

**Why it ranks third:** It is the fastest idea to validate and build while still demonstrating data visualization, recurring schedules, progressive disclosure, and action-oriented UX. Its weakness is differentiation, so the case study must show real research and a sharp audience rather than a generic dashboard.

**Keep out of v1:** Bank aggregation, automatic cancellation, subscription negotiation, and unsupported claims about savings.

### 4. Marketplace fee auditor

**Target user:** Sellers on one selected marketplace or commerce platform.

**Core problem:** Revenue is visible, but fees, refunds, advertising, withholding, and currency conversion can hide the seller’s actual margin.

**Focused MVP:** Import order and payout exports from one platform, match orders to payouts, calculate gross sales/fees/refunds/net proceeds, flag missing or unexpected amounts, and export an exception report.

**Why it ranks fourth:** The value proposition is measurable: explain margin and find missing money. It is especially strong if the team can recruit active sellers and use their anonymized exports.

**Keep out of v1:** Inventory, tax filing, tax advice, and support for multiple platforms.

### 5. Receipt collection workspace

**Target user:** Independent bookkeepers and small accounting practices.

**Core problem:** Transaction records arrive without the receipts and supporting documents needed to review or substantiate expenses.

**Focused MVP:** Import transactions, upload documents, suggest matches by date and amount, let a bookkeeper confirm or correct them, show missing documents, create a secure client upload page, and export a status report.

**Why it ranks fifth:** It creates a rich multi-user workflow with clear metrics: collection time, missing-document rate, and confirmed-match rate. It is more operationally complex than the first four because permissions and secure uploads matter.

**Keep out of v1:** Tax categorization, advanced OCR, accounting replacement, and multi-client workspace complexity.

### 6. Chargeback evidence builder

**Target user:** Small SaaS companies, agencies, educators, and digital-product sellers.

**Core problem:** Evidence for a payment dispute is scattered across invoices, contracts, messages, access logs, and refund policies, often under a deadline.

**Focused MVP:** Create a case, capture the dispute reason and deadline, show a reason-specific checklist, upload evidence, arrange events on a timeline, identify gaps, draft an editable summary, and export an evidence package.

**Why it ranks sixth:** It demonstrates deadline management, document handling, structured workflows, and responsible AI. It ranks below reconciliation and fee auditing because dispute volume is less frequent and evidence quality is harder to validate.

**Keep out of v1:** Automatic submission, outcome guarantees, broad dispute coverage, and uneditable AI-generated text.

### 7. Multi-currency profitability tracker

**Target user:** Freelancers and small agencies invoicing international clients through several payment services.

**Core problem:** The amount quoted to a client differs from the amount received after exchange-rate movement, processor fees, withdrawal fees, and intermediary charges.

**Focused MVP:** Record the invoice currency and rate, import or enter the actual payment, record fees, calculate home-currency proceeds, and explain the difference by client, currency, or payment method.

**Why it ranks seventh:** The problem is emotionally clear and financially concrete, but the product needs careful rate provenance and more edge-case handling than a normal invoice tracker.

**Keep out of v1:** Transfers, currency conversion, exchange-timing recommendations, and support for many currencies.

### 8. Investment watchlist and trading sandbox

**Target user:** People learning to evaluate investments or practice trading without real money.

**Core problem:** Price movements, risk, fees, and order states are often difficult for newer investors to interpret.

**Focused MVP:** Use seeded or delayed market data, create a watchlist, add thesis notes, show simple time ranges and risk labels, and simulate pending/filled/failed/slippage states.

**Why it ranks eighth:** It is a strong visual and interaction-design project, especially for charts and safety messaging. It ranks below the operational products because simulated trading has weaker evidence of willingness to pay and must avoid appearing to provide investment advice.

**Keep out of v1:** Real trades, personalized recommendations, live-money accounts, and claims of predictive performance.

### 9. Savings goals and rule-based budgeting simulator

**Target user:** People who want to turn budgeting into visible goals and repeatable rules.

**Core problem:** Users can set a goal but often cannot understand whether their current saving behavior will reach it or what an automation rule will do.

**Focused MVP:** Create goals, model contributions, show projected completion dates, define simple rules such as “allocate 10% of income,” and simulate outcomes with seeded data.

**Why it ranks ninth:** It offers strong interaction and systems-design work without real transfers. It is less compelling as a first product because the audience is broad and success depends on sustained behavior change.

**Keep out of v1:** Bank linking, automated transfers, financial advice, and complex rule chains.

### 10. Neobank onboarding and card dashboard

**Target user:** A fictional consumer banking customer.

**Core problem:** New financial products must explain identity checks, card controls, transactions, limits, and security without creating uncertainty.

**Focused MVP:** Build an onboarding flow and a seeded account dashboard with card freeze/unfreeze, transaction details, limits, masked data, session timeout, and declined-transaction states.

**Why it ranks tenth:** It is a good portfolio exercise for trust, safety, and state design. It ranks lower as a product idea because mock banking experiences are common and do not prove that a real user problem was solved.

### 11. Bill split and shared-expense app

**Target user:** Friends, roommates, or small groups sharing recurring expenses.

**Core problem:** Manual calculations and reminders create confusion about who owes what and whether a payment has been settled.

**Focused MVP:** Add expenses, split equally or by item/percentage, show balances, record settlements, and handle edits or disputes.

**Why it ranks eleventh:** It is easy to demonstrate and useful for practicing empty states, calculations, and trust cues. The category is crowded, so it needs a specific audience or novel workflow to stand out.

### 12. Cross-border P2P transfer and split pay

**Target user:** Groups sharing expenses across currencies, using a simulated transfer flow.

**Core problem:** Users need to understand exchange rates, fees, recipient details, and the final amount before confirming a transfer.

**Focused MVP:** Show a transparent rate and fee breakdown, calculate itemized splits, support confirmation and correction steps, and model pending/failed/reversed states.

**Why it ranks twelfth:** It demonstrates high-value safety UX and multi-currency clarity, but real money movement introduces operational and regulatory complexity. Keep it entirely simulated for a portfolio project.

### 13. Lending or credit-decision explainer

**Target user:** Applicants trying to understand a fictional credit or lending decision.

**Core problem:** Decisions, APR comparisons, and contributing factors are often opaque and intimidating.

**Focused MVP:** Use fictional applications, explain a decision with clearly labeled factors, compare APR and repayment scenarios, and provide appeal or correction paths.

**Why it ranks thirteenth:** It can demonstrate explainability, accessibility, and compliance-aware design, but the subject is high stakes. Avoid real underwriting, sensitive data, and claims that the interface represents a regulated decision process.

### 14. Family wallet and allowance

**Target user:** Parents and teenagers managing allowances and spending permissions.

**Core problem:** Families need shared visibility while preserving appropriate control, autonomy, and approval boundaries.

**Focused MVP:** Model parent/teen roles, allowance schedules, spending limits, approval requests, and activity history with seeded data.

**Why it ranks fourteenth:** Permissions and relationship design are interesting, but the product requires more roles, edge cases, and trust work than its initial portfolio value justifies.

### 15. Real bank aggregation

**Target user:** Consumers who want a unified view of accounts.

**Core problem:** Financial information is split across institutions and is difficult to see in one place.

**Why it ranks fifteenth:** The idea is familiar, but integration, consent, credential, refresh, institution-coverage, and failure-state problems dominate the work. A CSV-based analytics problem is a better first project.

### 16. Marketplace lending or investing

**Target user:** Borrowers, lenders, or investors using a two-sided financial marketplace.

**Core problem:** Matching, underwriting, risk disclosure, funding, servicing, and portfolio management all need to work together.

**Why it ranks last:** It is far too broad for a first portfolio product and introduces substantial regulatory, trust, and operational complexity. Extract one narrow learning problem instead, such as a fictional credit-decision explainer or investment education sandbox.

## Suggested first-release plan for the top choice

### Week 1 — Validate

- Interview five merchants, bookkeepers, or accountants
- Observe how they reconcile a real or anonymized export
- Collect sample files with permission
- Identify the most common unexplained differences
- Choose one primary success metric

### Week 2 — Define and prototype

- Select one export format and one currency
- Map the current workflow and terminology
- Prototype upload, payout detail, exception, and export flows
- Test the prototype with three users
- Write explicit import and reconciliation rules

### Weeks 3–4 — Build the vertical slice

- Authentication and workspace
- Secure CSV upload and validation
- Payout and transaction data model
- Reconciliation engine
- Payout list, detail, and exception views

### Weeks 5–6 — Pilot and learn

- Add notes, resolution states, report export, and deletion
- Test empty, invalid-file, partial-match, and failure states
- Onboard five users manually
- Measure completion time and unmatched-item rate
- Interview users after they generate a report

## Success metrics

Use one primary metric and a few supporting measures. For the Stripe reconciler, a good primary metric is **the percentage of imported payouts successfully reconciled**. Supporting measures can include:

- Time to complete a monthly reconciliation
- Percentage of transactions requiring manual intervention
- Number of unresolved exceptions
- Percentage of users returning the following month
- Number of reports exported
- User-reported confidence in the final numbers

Sign-ups and page views are weak evidence on their own. The portfolio case study should show a real workflow, the deliberate scope cuts, the system’s edge cases, and measurable user outcomes.

## Source consolidation notes

- “Invoice / freelancing cashflow” and “Freelancer payment tracker” are one idea.
- “Subscription cost auditor” and “Subscription & Micro-SaaS Expense Manager” are one idea.
- “Investment watchlist,” “Micro-Investing & Fractional Assets,” and “Trading education sandbox” are grouped into a simulated investment experience; real investing is excluded from the recommended scope.
- “Savings goals + round-up simulator” and “Smart Digital Wallet & Rule-Based Budgeting Engine” are grouped into a savings and rule-based budgeting simulator.
- “P2P payments,” “Cross-Border P2P Transfer & Split Pay,” and “Bill split” remain separate because ordinary shared expenses and cross-border money movement have different risk and complexity.
- “Real bank aggregation” and “marketplace lending/investing” are retained as explicit deprioritized ideas rather than silently removed.

The original source documents remain available for their detailed alternatives and framing:

- [Codex source](codex-fintech-portfolio-project-ideas.md)
- [Cursor source](cursor-fintech-portfolio-project-ideas.md)
- [Gemini source](gemini-fintech_portfolio_projects.md)
