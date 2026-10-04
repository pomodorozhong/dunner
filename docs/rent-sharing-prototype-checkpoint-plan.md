# Rent sharing: working prototype checkpoint plan

Companion: [Meeting prototype review guide](rent-sharing-prototype-review-guide.md). This plan builds on the [product brief](rent-sharing-brief.md) and [MVP plan](rent-sharing-mvp-implementation-plan.md).

## Goal and boundary

Build a runnable browser prototype that lets the next meeting discuss the actual monthly rent workflow, contribution rules, interactive Sankey, grouped branches, and shareable output. It should work with realistic data on a laptop and phone. The repository currently contains documents but no app code, so scaffolding is part of the work.

The prototype uses one household, one currency, monthly rent, browser-local data, no login, and full data export/import. It excludes reminders, ad hoc splits, nonmonthly expense schedules, payments, and synchronization. It is a discussion artifact, not a commitment to a public launch. The existing decision to launch the eventual web MVP without a prelaunch team review remains in place; the checkpoints below are for steering the prototype during implementation.

**Working assumption to confirm at checkpoint 1:** Roommates send their shares to the coordinator before the coordinator pays the landlord. Implement one money flow in the prototype. The alternative reimbursement flow can be discussed with the same examples, but should not silently share its status wording or calculations.

## Phase 1 — Scenario and money-rule card

**Deliverable:** A one-page scenario card with a three-roommate rent month, unequal shares, one partial contribution, an edited share after payment, and the precise meaning of “recorded,” “remaining,” and “fully received.” Include a simple flow sketch and a second, unimplemented reimbursement example for comparison. Use integer minor currency units for calculations and define where rounding differences go.

**Dependencies:** The current brief and one realistic household example. No application code depends on the answer yet.

**Completion condition:** Every displayed amount can be calculated by hand; the scenario states who pays whom, when, and how corrections differ from refunds.

### Checkpoint 1: choose the story the prototype tells

- **Implementer prepares:** The card and two worked examples with their exact totals, plus any unresolved rule choices.
- **User tries or decides:** Explain the flow back in their own words and choose collection before landlord payment or reimbursement afterward. Check whether the status words match the household's real language. About 10 minutes.
- **Feedback that changes Phase 2:** A different payer flow, interpretation of partial payments, or rule for excess contributions changes calculations and labels. Update the card before building those rules.
- **Work that can continue:** Project scaffolding, visual layout, and sample-data setup. Money calculations and status labels wait for this response.

## Phase 2 — Usable monthly flow

**Deliverable:** A local web app with editable household members and shares, rent month and due date, a review of the total, contribution entry and correction, “create next month,” persistent browser-local history, and an accessible amount/status list. Include a clear local-data notice and a way to reset sample data. Start with the agreed scenario preloaded for quick demonstration.

**Dependencies:** Checkpoint 1 for money rules and wording. The app shell can be built earlier.

**Completion condition:** In a fresh browser, the coordinator can enter or load a household, create a month, record a partial contribution, reload without losing data, correct the entry, and create the next month without carrying over contributions. The implementer verifies exact reconciliation, invalid input, and the agreed edit/refund cases with focused tests.

### Checkpoint 2: use the monthly task without coaching

- **Implementer prepares:** A runnable local URL, sample and blank starting states, a reset action, and the scenario card.
- **User tries:** Create a month, change one share, record and correct a partial contribution, then create the next month. Say what you expect to happen before each action. About 10–15 minutes.
- **Feedback that changes Phase 3:** Missing fields, confusing status words, or an incorrect mental model of current-month versus future defaults should be resolved in the flow before adding the Sankey.
- **Work that can continue:** Sankey rendering experiments using fixed sample data. Binding the diagram to final status wording waits for resolved feedback.

## Phase 3 — Interactive Sankey

**Deliverable:** A Sankey driven by the same data and calculations as the text list. Show shares and recorded/remaining amounts with exact values available on selection or focus. Let the user collapse selected branches into “Others,” display the aggregate and member count, and expand the group again. Keep the underlying data unchanged and let keyboard users perform the same inspection and grouping actions.

**Dependencies:** Phase 2 data model and resolved checkpoint 2 findings.

**Completion condition:** Individual branches, the “Others” aggregate, and the text list reconcile exactly for unequal shares and partial contributions. Collapsing and expanding preserve the stored records. The implementer checks narrow phone width, long and duplicate labels, zero/fully received states, and keyboard operation.

### Checkpoint 3: see whether the diagram explains the money

- **Implementer prepares:** A live diagram with at least three distinct states: unpaid, partially received, and fully received; one crowded example where “Others” helps. Provide the same figures in the text list.
- **User tries:** Without reading the list first, identify each person's share and remaining amount, collapse two branches, explain what “Others” means, and expand it. Repeat at phone width. About 10–15 minutes.
- **Feedback that changes Phase 4:** Misread flow direction, hidden individual obligations, or an unclear aggregate changes the labels, grouping control, or export composition before image export is finalized.
- **Work that can continue:** File export/import plumbing and static image rendering experiments. Final chart composition waits for resolved feedback.

## Phase 4 — Portable data and meeting-ready output

**Deliverable:** Full data export and import, an import preview with an explicit replace-or-cancel choice for existing browser data, and a dated chart image export with a preview. The image contains the rent month, due date, recipient, totals, status, and each person's exact amount in readable text even when the Sankey shows “Others.” Prepare a short demo script and one backup sample file. The prototype can run locally for an in-person meeting; if others need remote access, arrange a shareable web preview separately.

**Dependencies:** Phase 3 diagram and agreed money terminology. Image composition depends on checkpoint 3 findings.

**Completion condition:** Exporting and importing into a fresh browser reproduces the household, months, shares, and contributions. Invalid files are rejected without altering saved data. Image amounts match the app; the image is legible on a phone without interaction. The implementer verifies the round trip and a representative end-to-end path.

### Checkpoint 4: rehearse the meeting

- **Implementer prepares:** A runnable build, sample file, exported image, and a 5-minute demo path; confirm the target meeting laptop/browser can run it.
- **User tries:** Run the demo without coaching, hand the image to someone unfamiliar with the project, and ask them to state one person's share and remaining amount. Import the sample file into a fresh browser. About 15–20 minutes.
- **Feedback that changes the meeting artifact:** Any broken task, misunderstood amount, unreadable image, or uncertain import result gets fixed and rehearsed again. Editorial preferences can be prioritized for later iteration.
- **Work that can continue:** Meeting notes and discussion prompts. The prototype is ready for the meeting when the critical path works and the remaining questions are listed explicitly.

## Verification and feedback handling

The implementer owns calculation tests, persistence and import/export round trips, keyboard checks, responsive checks, and a clean demo setup. At each checkpoint, record feedback as **task → expected result → actual result → impact**, fix material issues, and return the revised artifact for the same task when needed. A checkpoint is complete when its decision or finding is reflected in the working prototype, not merely when someone has viewed it.

The next meeting should use the prototype to validate or revisit the chosen money flow, assess the Sankey and what the exported image reveals, and decide the next slice of work. Do not add the excluded features to make the demo look more complete.
