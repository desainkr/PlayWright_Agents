# TodoMVC End-to-End Test Plan

## Application and Scope

- **Application:** TodoMVC React demo
- **URL:** <https://demo.playwright.dev/todomvc/>
- **Page title:** `React • TodoMVC`
- **Test type:** Browser end-to-end
- **Suggested test stack:** Playwright Test with TypeScript
- **Scope:** The visible TodoMVC workflows in this demo: adding, completing, filtering, editing, deleting, clearing completed tasks, and retaining state after reload.

The application was explored in a browser. The page starts with the `todos` heading and a textbox labeled `What needs to be done?`. Once tasks exist, it shows a mark-all checkbox, task list, active-item count, `All` / `Active` / `Completed` filters, and (when completed tasks exist) a `Clear completed` button. The UI explicitly says to double-click a task to edit it.

This plan does not cover sign-in, server-side data synchronization, or other features not present in the observed interface. Tests should use unique task titles and an isolated browser context or clear TodoMVC's persisted browser state before each scenario, so cases do not depend on another test's data.

## Test Scenarios

### 1. Initial empty state

**Priority:** P1  
**Type:** Positive / boundary  
**Suggested test file:** `tests/todomvc/initial-state.spec.ts`

**Steps and expected results**

1. Open the application URL in a fresh browser context.
   - **Expected:** The page title is `React • TodoMVC`, and the `todos` heading is visible.
2. Inspect the new-task textbox.
   - **Expected:** A textbox with the accessible name `What needs to be done?` is visible and empty.
3. Inspect the task area and task controls.
   - **Expected:** No task rows, active-item count, filters, mark-all checkbox, or `Clear completed` control are shown while there are no tasks.
4. Inspect the page footer.
   - **Expected:** The demo notice and the `Double-click to edit a todo` instruction are visible.

### 2. Add tasks and reject empty submissions

**Priority:** P1  
**Type:** Positive / negative / boundary  
**Suggested test file:** `tests/todomvc/task-creation.spec.ts`

**Steps and expected results**

1. Enter a non-empty title such as `Buy groceries` in `What needs to be done?` and press Enter.
   - **Expected:** One task with that exact title appears in the list; the textbox is cleared; the count reads `1 item left`.
2. Enter and submit two more distinct titles, such as `Pay bills` and `Walk dog`.
   - **Expected:** All three tasks appear in entry order, each initially active, and the count reads `3 items left`.
3. Leave the textbox empty and press Enter.
   - **Expected:** No blank task is added and the list/count do not change.
4. Enter only whitespace and press Enter.
   - **Expected:** No whitespace-only task is added and the existing list/count do not change.

### 3. Complete and reactivate an individual task

**Priority:** P1  
**Type:** Positive / boundary  
**Suggested test file:** `tests/todomvc/task-completion.spec.ts`

**Steps and expected results**

1. Create two tasks and confirm both are active.
   - **Expected:** Both task checkboxes are unchecked and the count is `2 items left`.
2. Check the completion checkbox for the first task.
   - **Expected:** That task is marked completed; the other stays active; the count becomes `1 item left`.
3. Uncheck the same task.
   - **Expected:** It becomes active again and the count returns to `2 items left`.
4. Complete both tasks individually.
   - **Expected:** The count reads `0 items left`, both tasks are completed, and `Clear completed` is available.

### 4. Toggle completion for all tasks

**Priority:** P1  
**Type:** Positive / boundary  
**Suggested test file:** `tests/todomvc/bulk-completion.spec.ts`

**Steps and expected results**

1. Create at least two active tasks.
   - **Expected:** The `Mark all as complete` checkbox is visible and unchecked.
2. Check `Mark all as complete`.
   - **Expected:** Every task becomes completed, the bulk checkbox is checked, and the active-item count is zero.
3. Uncheck `Mark all as complete`.
   - **Expected:** Every task becomes active, the bulk checkbox is unchecked, and the count equals the number of tasks.
4. Start from the empty state and inspect the task controls.
   - **Expected:** The mark-all checkbox is not available when there are no tasks.

### 5. Filter tasks by status and return to all tasks

**Priority:** P1  
**Type:** Positive / boundary  
**Suggested test file:** `tests/todomvc/task-filters.spec.ts`

**Steps and expected results**

1. Create three distinct tasks and complete exactly one.
   - **Expected:** `All`, `Active`, and `Completed` filters are visible; all three tasks are shown; the active count reflects the two active tasks.
2. Select `Active`.
   - **Expected:** The URL hash is `#/active`; only the two active tasks are shown; the completed task is hidden.
3. Select `Completed`.
   - **Expected:** The URL hash is `#/completed`; only the completed task is shown; the active tasks are hidden.
4. Select `All`.
   - **Expected:** The URL hash is `#/`; all three tasks are shown again with their existing completion states intact.
5. While a filter is selected, verify the active count.
   - **Expected:** The count represents active tasks in the whole list, not merely the tasks currently visible in the filtered view.

### 6. Edit a task, save changes, and cancel an edit

**Priority:** P1  
**Type:** Positive / negative / boundary  
**Suggested test file:** `tests/todomvc/task-editing.spec.ts`

**Steps and expected results**

1. Add an active task titled `Pay bills`.
   - **Expected:** The task is displayed in the list.
2. Double-click the task title.
   - **Expected:** An inline textbox labeled `Edit` appears with the current title.
3. Replace the title with `Pay rent` and press Enter.
   - **Expected:** The inline editor closes, `Pay rent` is displayed, and `Pay bills` is no longer displayed.
4. Double-click `Pay rent`, change the text to `Temporary change`, and press Escape.
   - **Expected:** The edit is cancelled, the task remains `Pay rent`, and `Temporary change` is not displayed.
5. Double-click `Pay rent`, clear the edit textbox, and press Enter.
   - **Expected:** The task is removed from the list; with no remaining tasks, the task controls and count are no longer shown.

### 7. Delete one task without affecting other tasks

**Priority:** P1  
**Type:** Positive / boundary  
**Suggested test file:** `tests/todomvc/task-deletion.spec.ts`

**Steps and expected results**

1. Create two tasks with distinct titles.
   - **Expected:** Both tasks appear and the count is `2 items left`.
2. Reveal and activate the row's `Delete` (×) control for the first task.
   - **Expected:** Only the selected task is removed; the other task remains; the count becomes `1 item left`.
3. Delete the remaining task.
   - **Expected:** The list, count, filters, and task controls disappear, returning the page to its empty state.

### 8. Clear completed tasks while retaining active tasks

**Priority:** P1  
**Type:** Positive / boundary  
**Suggested test file:** `tests/todomvc/clear-completed.spec.ts`

**Steps and expected results**

1. Create two tasks, complete one, and leave the other active.
   - **Expected:** The completed and active tasks are both present, the active count is `1 item left`, and `Clear completed` is visible.
2. Select `Clear completed`.
   - **Expected:** The completed task is removed; the active task remains; the active count stays `1 item left`; the `Clear completed` button is no longer shown.
3. Complete the remaining task and select `Clear completed` again.
   - **Expected:** The final task is removed and the page returns to the empty state.
4. In a fresh empty state, inspect the footer controls.
   - **Expected:** `Clear completed` is unavailable when there are no completed tasks to clear.

### 9. Preserve task state after reload

**Priority:** P1  
**Type:** Positive / persistence  
**Suggested test file:** `tests/todomvc/task-persistence.spec.ts`

**Steps and expected results**

1. Create at least two tasks and complete one of them.
   - **Expected:** Both task titles and their different completion states are visible; the active count is correct.
2. Reload the page at the TodoMVC URL.
   - **Expected:** The tasks remain present with the same completion states and the count remains correct.
3. Select `Active`, then `Completed`.
   - **Expected:** Each filter still shows the correct persisted task(s) after the reload.

## Execution Notes

- Use independent browser contexts and unique task titles for test isolation.
- For the persistence scenario, keep the same browser context across reload; do not clear browser storage between the setup and reload steps.
- Prefer accessible roles and names for the heading, textbox, checkboxes, filter links, and buttons. The per-task completion checkbox is exposed as `Toggle Todo`; scope it to the task row by its title.
- The delete control is presented as an × on each task row and is exposed as `Delete` when available; hover the target row if the control is not currently revealed.
- Assert both visible task titles and the active-item count; filter tests should also assert the URL hash.
- No test code is included in this document.
