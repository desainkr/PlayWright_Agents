# TodoMVC Top 10 End-to-End Test Scenarios

## Application Overview

Ranked selection of the ten highest-priority TodoMVC browser test scenarios, derived only from the existing functional test plan in specs/todomvc-test-plan.md. Prioritizes core task creation, completion, filtering, editing, deletion, clearing, and persistence workflows. Uses the observed React • TodoMVC interface at https://demo.playwright.dev/todomvc/. TypeScript with Playwright Test is the intended automation stack; this deliverable is documentation only and does not create test code or files.

## Test Scenarios

### 1. TodoMVC Critical User Workflows

**Seed:** `Fresh isolated browser context per scenario; no test code or seed file is created.`

#### 1.1. 1. Create tasks and reject empty submissions

**File:** `Documentation only — no test file created`

**Steps:**
  1. Open https://demo.playwright.dev/todomvc/ in a fresh browser context.
    - expect: The React • TodoMVC page appears with the todos heading and an empty What needs to be done? textbox.
    - expect: No task rows, active-item count, filters, mark-all checkbox, or Clear completed control are shown.
  2. Enter Buy groceries in the task textbox and press Enter, then add Pay bills and Walk dog the same way.
    - expect: All three tasks appear in entry order and are initially active.
    - expect: The input clears after each successful submission.
    - expect: The active-item count displays 3 items left.
  3. Press Enter with an empty textbox, then enter only whitespace and press Enter.
    - expect: Neither submission creates a task.
    - expect: The existing three tasks and count remain unchanged.

#### 1.2. 2. Complete and reactivate individual tasks

**File:** `Documentation only — no test file created`

**Steps:**
  1. Create two distinct active tasks.
    - expect: Both task checkboxes are unchecked and the count is 2 items left.
  2. Check the completion checkbox for the first task.
    - expect: The selected task becomes completed, the other remains active, and the count becomes 1 item left.
  3. Uncheck the same task, then complete both tasks individually.
    - expect: Unchecking restores the task to active and the count returns to 2 items left.
    - expect: After completing both, the count displays 0 items left and Clear completed is available.

#### 1.3. 3. Complete and reactivate all tasks with the bulk control

**File:** `Documentation only — no test file created`

**Steps:**
  1. Create at least two active tasks.
    - expect: The Mark all as complete checkbox is visible and unchecked.
  2. Check Mark all as complete.
    - expect: Every task becomes completed, the bulk checkbox is checked, and the active-item count is zero.
  3. Uncheck Mark all as complete.
    - expect: Every task becomes active, the bulk checkbox is unchecked, and the active-item count equals the number of tasks.

#### 1.4. 4. Filter tasks by All, Active, and Completed

**File:** `Documentation only — no test file created`

**Steps:**
  1. Create three distinct tasks and complete exactly one.
    - expect: All, Active, and Completed filters are visible; all three tasks appear; the active count reflects two active tasks.
  2. Select Active, then Completed, then All.
    - expect: Active sets the URL hash to #/active and shows only the two active tasks.
    - expect: Completed sets the URL hash to #/completed and shows only the completed task.
    - expect: All sets the URL hash to #/ and restores all three tasks with completion states intact.
  3. Check the active-item count while a filter is selected.
    - expect: The count reflects active tasks in the full list, rather than only rows visible under the current filter.

#### 1.5. 5. Edit a task title and save the change

**File:** `Documentation only — no test file created`

**Steps:**
  1. Add a task titled Pay bills and double-click its title.
    - expect: An inline textbox labeled Edit appears with the current title.
  2. Replace the title with Pay rent and press Enter.
    - expect: The editor closes, Pay rent appears in the list, and Pay bills is no longer displayed.

#### 1.6. 6. Cancel an edit and remove a task with an empty title

**File:** `Documentation only — no test file created`

**Steps:**
  1. Create a task titled Pay rent, double-click the title, replace it with Temporary change, and press Escape.
    - expect: Editing is cancelled and the task remains Pay rent; Temporary change is not displayed.
  2. Double-click Pay rent again, clear the Edit textbox, and press Enter.
    - expect: The task is removed from the list.
    - expect: When no tasks remain, the task controls and count disappear and the empty state is restored.

#### 1.7. 7. Delete a single task without affecting other tasks

**File:** `Documentation only — no test file created`

**Steps:**
  1. Create two tasks with distinct titles and hover over the first task row.
    - expect: Both tasks appear and the count is 2 items left.
    - expect: The hovered row exposes its Delete (×) control.
  2. Activate Delete for the first row, then delete the remaining row.
    - expect: Deleting the first task leaves the other intact and updates the count to 1 item left.
    - expect: Deleting the final task restores the empty state and hides list controls.

#### 1.8. 8. Clear completed tasks while retaining active tasks

**File:** `Documentation only — no test file created`

**Steps:**
  1. Create two tasks, complete one, and leave the other active.
    - expect: Both tasks are shown, the count reads 1 item left, and Clear completed is visible.
  2. Select Clear completed.
    - expect: The completed task is removed; the active task remains; the count remains 1 item left; Clear completed is no longer shown.
  3. Complete the remaining task and select Clear completed again.
    - expect: The final task is removed and the empty state is restored.

#### 1.9. 9. Persist task titles and completion states after reload

**File:** `Documentation only — no test file created`

**Steps:**
  1. In one browser context, create at least two tasks and complete one.
    - expect: Both task titles and their different completion states appear, with the correct active count.
  2. Reload the application without clearing browser storage.
    - expect: Tasks remain present with the same titles and completion states, and the count remains correct.
  3. Select Active and Completed after reload.
    - expect: Each filter shows the task or tasks matching its state.

#### 1.10. 10. Verify the initial empty state and available guidance

**File:** `Documentation only — no test file created`

**Steps:**
  1. Open the application in a fresh browser context with no TodoMVC state.
    - expect: The page title is React • TodoMVC, the todos heading appears, and the What needs to be done? textbox is visible and empty.
  2. Inspect the task area and footer.
    - expect: No tasks, item count, filters, bulk checkbox, or Clear completed control are displayed.
    - expect: The demo notice and Double-click to edit a todo instruction are visible.
