# Detailed Test Cases for TodoMVC Priority Scenarios

## Application Overview

Execution-ready manual test cases derived only from the existing specs/todomvc-top-10-scenarios.plan.md. The two selected scenarios are Scenario 1, “Create tasks and reject empty submissions,” and Scenario 2, “Complete and reactivate individual tasks.” Both are marked P1 and are first and second in the ranked source document. All cases use a fresh isolated browser context and the observed app URL. No application re-exploration or test code is included. Test case IDs are TC-TODO-001 through TC-TODO-003; scenario IDs refer to the numbered scenario headings in the source document.

## Test Scenarios

### 1. Scenario 1 — Create tasks and reject empty submissions

**Seed:** `No seed file. Start each test case in a fresh browser context with no TodoMVC state.`

#### 1.1. TC-TODO-001 | Scenario 1 | Create multiple tasks and verify their initial state | Priority: P1

**File:** `Manual test case — no automated test file`

**Steps:**
  1. Preconditions: Open https://demo.playwright.dev/todomvc/ in a fresh isolated browser context. Confirm no existing tasks are present.
    - expect: The TodoMVC page is open in the clean initial state.
  2. Test data: Use these task titles in order: “Buy groceries”, “Pay bills”, and “Walk dog”.
    - expect: All titles are distinct and non-empty.
  3. Enter “Buy groceries” in the textbox labeled “What needs to be done?” and press Enter.
    - expect: The task appears in the list with the exact title.
    - expect: The textbox is cleared.
    - expect: The task is initially active and the count reads “1 item left”.
  4. Enter “Pay bills” in the same textbox and press Enter, then repeat with “Walk dog”.
    - expect: All three tasks appear in entry order and are initially active.
    - expect: The textbox is cleared after each submission.
    - expect: The count reads “3 items left”.

#### 1.2. TC-TODO-002 | Scenario 1 | Ignore empty and whitespace-only task submissions | Priority: P1

**File:** `Manual test case — no automated test file`

**Steps:**
  1. Preconditions: Open https://demo.playwright.dev/todomvc/ in a fresh isolated browser context. Add “Baseline task” and verify it is displayed before continuing.
    - expect: Exactly one baseline task is present and the count reads “1 item left”.
  2. Test data: Empty string; three spaces (“   ”).
    - expect: The values contain no non-whitespace task title.
  3. Leave the task textbox empty and press Enter.
    - expect: No additional task is created.
    - expect: “Baseline task” remains displayed and the count remains “1 item left”.
  4. Enter only three spaces in the task textbox and press Enter.
    - expect: No whitespace-only task is created.
    - expect: “Baseline task” remains the only task and the count remains “1 item left”.

### 2. Scenario 2 — Complete and reactivate individual tasks

**Seed:** `No seed file. Start this test case in a fresh browser context with no TodoMVC state.`

#### 2.1. TC-TODO-003 | Scenario 2 | Complete, reactivate, and complete individual tasks | Priority: P1

**File:** `Manual test case — no automated test file`

**Steps:**
  1. Preconditions: Open https://demo.playwright.dev/todomvc/ in a fresh isolated browser context.
    - expect: The TodoMVC app opens with no pre-existing tasks.
  2. Test data: Add two distinct task titles: “Prepare report” and “Send invoice”.
    - expect: Both tasks are displayed as active, with unchecked completion checkboxes.
    - expect: The count reads “2 items left”.
  3. Check the completion checkbox for “Prepare report”.
    - expect: “Prepare report” is completed while “Send invoice” remains active.
    - expect: The count reads “1 item left”.
  4. Uncheck the completion checkbox for “Prepare report”.
    - expect: “Prepare report” is active again and “Send invoice” remains active.
    - expect: The count returns to “2 items left”.
  5. Check the completion checkbox for “Prepare report”, then check the completion checkbox for “Send invoice”.
    - expect: Both tasks are completed.
    - expect: The count reads “0 items left”.
    - expect: The “Clear completed” control is available.
