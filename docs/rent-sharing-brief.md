# Product Brief: Rent Sharing

**Owner:** NRF4\
**Status:** Draft\
**Last updated:** 2026-09-30

## 1. Summary

We propose an iOS app for the roommate who coordinates a household's monthly rent, built around a distinctive interactive chart and a beautifully designed, shareable chart image. It would help them prepare a clear request, track contributions, and share a dated update in the household chat, while other roommates can understand what to send without creating an account for the app. This narrows the [earlier single-bill concept](archive/bill-split/bill-split-what-it-is.md) to a recurring task and gives the team a design-led competition piece.

## 2. Problem

- **User:** A roommate who coordinates rent, and the roommates asked to contribute.
- **Pain point:** Each month the coordinator has to confirm amounts and dates, communicate individual shares, track what arrived, and follow up without causing confusion or discomfort.
- **Impact:** An unclear request can lead to incorrect amounts, repeated messages, and uncertainty about who still needs to contribute. We have not yet measured how often this occurs for the intended users.

## 3. Target Users

The primary user is one roommate who handles rent coordination for a shared household with agreed individual shares. The recipients are their roommates, who see a request in an existing chat and may never open the app. Landlords collecting rent directly are outside the initial audience.

## 4. Desired Outcome

Coordinators can prepare the next month's request with little repeated entry and keep an accurate record of contributions. Recipients can identify their own amount, whom to pay, when it is due, and what has been recorded as received; they feel comfortable receiving the request in a household chat.

## 5. Proposed Solution

Save a household's roommates and agreed shares, then create a separate request for each rent month. The centerpiece is an interactive chart that shows each share and contribution progress; a polished static version anchors the dated image sent to the household chat. The coordinator reviews the total, due date, individual amounts, and recipient before exporting, then records partial or full contributions and can export an updated snapshot. Typography, color, pattern, and motion should make the chart memorable while exact amounts and status labels remain readable.

## 6. Scope

### In scope

- One household, one coordinator, one currency, agreed equal or custom shares, and a separate record for each rent month.
- A “create next month” action that copies roommates and default shares but resets contribution records; local month-by-month history.
- Manual contribution tracking, partial amounts, correction, exact reconciliation, and a clear distinction between changes to the current month and future defaults.
- A live, interactive chart and a previewed, dated chart image that include the rent month, due date, recipient, recognizable individual labels, shares, and recorded status. Resolve duplicate privacy-adjusted labels before export.
- An equivalent accessible text view and clear invalid-amount, correction, fully received, and failed-export states.

### Out of scope for v1

- Accounts, backend synchronization, bank connections, payment processing, automatic reminders, and live shared status.
- Cross-month balances, utilities, groceries, deposits, move-out adjustments, and rent-fairness calculations.
- Receipt scanning, multiple payers or currencies, and debt simplification.

## 7. Constraints and Risks

- Bills are saved locally and payments happen outside the app. The coordinator's records do not verify a bank transfer; exported images are dated snapshots, not live status.
- The payment model is unresolved: collecting contributions before paying the landlord and asking for reimbursement afterward require different status and owed-amount rules. The first release should support one clearly defined flow unless research shows both are essential.
- Edits after contributions can produce excess payments. The product must preserve actual recorded contributions, distinguish an incorrect entry from a real refund, and define how share reductions, roommate removal, and coordinator changes work.
- Privacy-adjusted labels can collide or leave recipients unable to identify themselves. Group-wide status could feel uncomfortable even when the amounts are accurate.
- The chart is central to the product and the competition presentation. Its visual encoding must remain understandable in a static, phone-sized export, including uneven shares and partial contributions.

## 8. Open Questions and Next Steps

- Which flow is most common for the initial audience: collecting before landlord payment or reimbursing after it? Observe several coordinators' last rent cycles before choosing the status model.
- Do roommates want household-wide contribution status in a group image, or only their own obligation? Test recognition, accuracy, and comfort with actual recipients.
- Which chart treatment makes shares and contribution progress immediately understandable while delivering a distinctive visual identity? Test static phone-sized exports, grayscale viewing, uneven shares, and partial contributions with recipients.
- How should the coordinator handle a changed share after money was received, a roommate leaving, or a changed coordinator? Define these rules before implementation.

The [archived implementation plan](archive/bill-split/bill-split-how-do-we-make-it.md) remains background context for the original direction.
