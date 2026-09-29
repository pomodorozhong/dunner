# Rent sharing: MVP implementation plan

This plan follows the [product brief](rent-sharing-brief.md). The interactive chart and exported chart image are core features. Wen brings firsthand rent-sharing expertise and leads design. Jonathan leads marketing, cost management, delivery coordination, and iOS development.

| Phase | Jonathan | Wen |
| --- | --- | --- |
| **1. Agree on the feature set** | Identify the competition requirements, target audience, budget, and time available. Help recruit roommates for interviews. Estimate the iOS work and flag technical constraints before the scope is set. Set dates for the chart decision, TestFlight build, tester feedback, and competition submission, with time for fixes.<br><br>**Deliverable:** MVP effort and cost estimate, delivery constraints, feasibility notes, and dated milestone schedule.<br><br>**Done when:** The agreed feature set fits the available resources and schedule. | Describe Wen’s real rent-sharing workflow and interview other coordinators and roommates. Decide whether v1 covers collecting before landlord payment or reimbursement afterward, define contribution statuses, and choose what belongs in the MVP. Agree on rules for partial contributions, corrections versus refunds, share changes after contributions, roommate removal, and coordinator changes within that scope.<br><br>**Deliverable:** Prioritized feature list, monthly user flow, written contribution rules with example calculations, and realistic rent scenarios.<br><br>**Done when:** Both teammates can explain the monthly task, every contribution status, and how the agreed rules apply to the example scenarios. |
| **2. Agree on the chart design** | Check how the chart will be presented in the competition and shared with potential testers. Assess iOS rendering and image-export feasibility, and note questions to test with the working MVP.<br><br>**Deliverable:** Implementation constraints, cost check, and questions for TestFlight testers.<br><br>**Done when:** The chosen direction can be built and tested within the MVP budget. | Lead the visual direction. Prototype the interactive chart and phone-sized exported image with uneven shares, partial contributions, and duplicate privacy-adjusted labels. Check that the prototype shows each roommate’s amount, who to pay, due date, and recorded status.<br><br>**Deliverable:** Approved chart concept, interaction prototype, and export design.<br><br>**Done when:** Wen approves a design that shows the required information clearly and is feasible for the MVP. |
| **3. Deliver an MVP downloadable from TestFlight** | Build and test the agreed iOS flow, money rules, interactive chart, and image export. Manage the build budget and schedule, recruit testers, organize TestFlight distribution, collect feedback from coordinators and image recipients, and prepare outreach and competition materials.<br><br>**Deliverable:** Working TestFlight build, tester feedback, and a concise account of costs and scope decisions.<br><br>**Done when:** Invited testers can download the app and complete a rent month through sharing an accurate chart image. | Review the running app against the agreed workflow and money rules. Supply final visual assets, resolve design issues, and test the build on a phone.<br><br>**Deliverable:** Final visual assets, design QA findings, and a representative exported image.<br><br>**Done when:** Wen has reviewed the TestFlight build against the agreed design and the rent-sharing cases identified during discovery. |

## Deliverables

### Phase 1: Feature set and delivery plan

- **Prioritized feature list (Wen):** Name what the MVP must include and what can wait, based on the chosen rent-collection flow and the coordinator and roommate interviews. Record decisions that change the monthly task or what appears in the shared image.
- **Monthly flow, contribution rules, and scenarios (Wen):** Show the steps from preparing a rent month through recording contributions and sharing an update. Define each contribution status and how partial amounts, entry corrections, actual refunds, and later share changes affect the recorded and remaining amounts. State how the MVP handles roommate removal and coordinator changes. Include worked examples that make the rules checkable.
- **Effort, cost, and feasibility estimate (Jonathan):** Estimate the iOS work and likely costs, including the interactive chart, image export, and TestFlight delivery. Note technical constraints and assumptions that could change the scope or schedule.
- **Dated milestone schedule (Jonathan):** Set dates for the chart decision, TestFlight build, tester feedback, and competition submission, with time to address issues found before submission.

### Phase 2: Chart design

- **Chart concept, interaction prototype, and export design (Wen):** Show how the live chart responds to contributions and how its phone-sized image presents the rent month, each share, who to pay, the due date, and recorded status. Include uneven shares, partial contributions, and duplicate privacy-adjusted labels. This is the design direction for the MVP; the main recipient feedback comes from the TestFlight build.
- **Implementation constraints and cost check (Jonathan):** Check whether the chosen interactions and image design can be built and exported on iOS within the Phase 1 budget and schedule. Record any design changes needed for implementation.
- **TestFlight feedback questions (Jonathan):** Prepare a short set of tasks and questions for coordinators using the app and roommates viewing the exported image, including whether they can identify their own obligation and whether the shared information feels appropriate.

### Phase 3: TestFlight MVP

- **Working TestFlight build (Jonathan):** Deliver an installable app that follows the agreed monthly flow, contribution rules, chart design, and image export so invited testers can complete a rent month and share its chart image.
- **Final visual assets, design QA findings, and representative export (Wen):** Supply the assets used by the build, review the app on a phone against the approved design and discovery scenarios, record issues, and provide an image produced by the app for review and presentation.
- **Tester feedback (Jonathan):** Use a realistic household example to capture what coordinators do in the TestFlight app and how roommates interpret the image they receive. Record concrete observations as **task → expected result → actual result → impact** to inform the plan made after the MVP.
- **Cost and scope account (Jonathan):** Summarize actual spending and effort against the Phase 1 estimate, what was included or deferred, and the reasons for material scope decisions. Use it alongside the build and representative image for competition and outreach materials.

Review the scope and budget together after Phase 1, and the chart prototype after Phase 2.

Before inviting testers, Jonathan and Wen review the release together. Wen makes the final product-scope decision when tradeoffs arise.

Contribution-tracking implementation depends on the Phase 1 flow decision; final chart implementation depends on the Phase 2 design decision.
