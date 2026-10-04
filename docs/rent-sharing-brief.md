# Product Brief: Rent Sharing

**Owner:** NRF4\
**Status:** Draft\
**Last updated:** 2026-09-30

## 1. Summary

Build a browser-based rent-sharing tool for the roommate who coordinates a household's monthly rent. A web launch supports faster iteration without a prelaunch review gate. An interactive Sankey diagram makes shares and contributions inspectable, and a dated image can be shared in the household chat.

## 2. Problem

- **User:** A roommate who coordinates rent, and the roommates asked to contribute.
- **Pain point:** Each month the coordinator must confirm amounts and dates, communicate shares, track what arrived, and follow up without confusion or discomfort.
- **Impact:** Unclear requests can cause incorrect amounts, repeated messages, and uncertainty about who still needs to contribute. We have not measured the frequency for intended users.

## 3. Target Users

The primary user is one roommate who handles rent coordination for a shared household with agreed individual shares. Recipients see a request in an existing chat and may never open the website. Landlords collecting rent directly are outside the initial audience.

## 4. Desired Outcome

Coordinators can prepare the next month's request with little repeated entry and keep an accurate contribution record. Recipients can identify their amount, whom to pay, when it is due, and what has been recorded as received.

## 5. Proposed Solution

Save a household's roommates and agreed shares in the coordinator's browser, then create a separate request for each rent month. An interactive Sankey diagram shows shares and contribution progress. The coordinator can collapse selected branches into an “Others” group and expand it to inspect individual amounts. Grouping changes only the view, never the underlying amounts or records. A static, dated image can be shared in the household chat. The coordinator reviews exact amounts before export, records contributions, and can export an updated snapshot. Full data export and import provide backup and transfer between browsers or devices without an account.

## 6. Scope

### In scope

- A responsive website with no user login, one household, one coordinator, one currency, equal or custom shares, and a separate record for each rent month.
- A “create next month” action that copies roommates and default shares but resets contribution records; month-by-month history stored locally in the browser.
- Manual contribution tracking, partial amounts, correction, exact reconciliation, and a clear distinction between current-month edits and future defaults.
- An interactive Sankey with inspectable branches and a collapsible “Others” group that shows its aggregate amount and member count. Individual details remain available when expanded and in an equivalent text view.
- A previewed, dated chart image that remains understandable without interaction, including when branches are grouped. It includes the rent month, due date, recipient, recognizable individual labels and amounts, and recorded status. Resolve duplicate privacy-adjusted labels before export.
- Full local-data export and import, with file validation, an import preview, and clear handling of conflicts with data already in the browser.
- An equivalent accessible text view and clear invalid-amount, correction, fully received, failed-import, and failed-export states.

### Out of scope for v1

- Accounts, backend storage or synchronization, bank connections, payment processing, and live shared status.
- Payment-chasing reminders and all other reminders or notifications.
- Ad hoc expense splitting for one-off meals, gatherings, or similar events outside the recurring household cycle.
- Expenses that do not align with monthly settlement, such as quarterly electricity or water billed every two months; no separate item schedules for them.
- Cross-month balances, utilities, groceries, deposits, move-out adjustments, and rent-fairness calculations.
- Receipt scanning, multiple payers or currencies, and debt simplification.

## 7. Success Metrics

- Coordinators who can create a rent month, record a partial contribution, and export an accurate update without help — baseline and target to be set during testing.
- Recipients who can identify their share, recorded contribution, and remaining amount from a phone-sized image — baseline and target to be set during testing.
- Coordinators who can export records and restore them in a fresh browser without losing a rent month — baseline and target to be set during testing.

## 8. Constraints and Risks

- Browser data can be lost if site data is cleared, the device changes, or private browsing is used. Explain the local-only model and make backup export easy to find. Exported files may contain sensitive household information.
- Payments happen outside the website. The coordinator's records do not verify a bank transfer; exported images are dated snapshots, not live status.
- The payment model is unresolved: collecting before landlord payment and reimbursing afterward require different status and owed-amount rules. The first release should support one defined flow unless research shows both are essential.
- Edits after contributions can produce excess payments. Preserve actual recorded contributions, distinguish a mistaken entry from a real refund, and define share reduction, roommate removal, and coordinator-change rules.
- Privacy-adjusted labels can collide or leave recipients unable to identify themselves. Group-wide status could feel uncomfortable even when accurate.
- The Sankey must remain understandable with uneven shares, small branches, partial contributions, and “Others” grouping. Exact amounts and statuses must remain readable in text and in a static, phone-sized export.

## 9. Open Questions and Next Steps

- Which flow is most common for the initial audience: collecting before landlord payment or reimbursing afterward? Observe several coordinators' last rent cycles.
- Do roommates want household-wide status in a group image, or only their own obligation? Test recognition, accuracy, and comfort.
- Which Sankey flow and grouping rules make shares and progress understandable? Test uneven shares, partial contributions, small branches, “Others” expansion, grayscale viewing, and static phone-sized exports.
- How should a changed share after money was received, a roommate leaving, or a changed coordinator be handled? Define these rules before implementation.
- What should import do when the browser already contains a household or overlapping months? Choose and test a clear conflict flow before launch.

The [archived implementation plan](archive/bill-split/bill-split-how-do-we-make-it.md) remains background context for the original direction.
