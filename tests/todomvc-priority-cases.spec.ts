import { expect, Page, Locator, test } from '@playwright/test';

const TODO_MVC_URL = 'https://demo.playwright.dev/todomvc/';

class TodoMvcPage {
  readonly newTodoInput: Locator;
  readonly taskList: Locator;

  constructor(private readonly page: Page) {
    this.newTodoInput = page.getByRole('textbox', { name: 'What needs to be done?' });
    this.taskList = page.getByRole('list').first();
  }

  async open(): Promise<void> {
    await this.page.goto(TODO_MVC_URL);
  }

  async addTodo(title: string): Promise<void> {
    await this.newTodoInput.fill(title);
    await this.newTodoInput.press('Enter');
  }

  todoRow(title: string): Locator {
    return this.taskList.getByRole('listitem').filter({ hasText: title });
  }

  activeCount(count: number): Locator {
    const itemLabel = count === 1 ? 'item' : 'items';
    return this.page.getByText(`${count} ${itemLabel} left`, { exact: true });
  }
}

test.describe('TodoMVC priority test cases', () => {
  test('TC-TODO-001: create multiple tasks and verify their initial state', async ({ page }) => {
    const todoMvc = new TodoMvcPage(page);
    const titles = ['Buy groceries', 'Pay bills', 'Walk dog'];

    await todoMvc.open();

    for (const [index, title] of titles.entries()) {
      await todoMvc.addTodo(title);

      const row = todoMvc.taskList.getByRole('listitem').nth(index);
      await expect(row).toContainText(title);
      await expect(row.getByRole('checkbox', { name: 'Toggle Todo' })).not.toBeChecked();
      await expect(todoMvc.newTodoInput).toBeEmpty();

      if (index === 0) {
        await expect(todoMvc.activeCount(1)).toBeVisible();
      }
    }

    await expect(todoMvc.taskList.getByRole('listitem')).toHaveCount(titles.length);
    await expect(todoMvc.activeCount(3)).toBeVisible();
  });

  test('TC-TODO-002: ignore empty and whitespace-only task submissions', async ({ page }) => {
    const todoMvc = new TodoMvcPage(page);

    await todoMvc.open();
    await todoMvc.addTodo('Baseline task');

    await expect(todoMvc.taskList.getByRole('listitem')).toHaveCount(1);
    await expect(todoMvc.todoRow('Baseline task')).toBeVisible();
    await expect(todoMvc.activeCount(1)).toBeVisible();

    await todoMvc.newTodoInput.fill('');
    await todoMvc.newTodoInput.press('Enter');
    await expect(todoMvc.taskList.getByRole('listitem')).toHaveCount(1);
    await expect(todoMvc.todoRow('Baseline task')).toBeVisible();
    await expect(todoMvc.activeCount(1)).toBeVisible();

    await todoMvc.newTodoInput.fill('   ');
    await todoMvc.newTodoInput.press('Enter');
    await expect(todoMvc.taskList.getByRole('listitem')).toHaveCount(1);
    await expect(todoMvc.todoRow('Baseline task')).toBeVisible();
    await expect(todoMvc.activeCount(1)).toBeVisible();
  });

  test('TC-TODO-003: complete, reactivate, and complete individual tasks', async ({ page }) => {
    const todoMvc = new TodoMvcPage(page);

    await todoMvc.open();
    await todoMvc.addTodo('Prepare report');
    await todoMvc.addTodo('Send invoice');

    const prepareReportRow = todoMvc.todoRow('Prepare report');
    const sendInvoiceRow = todoMvc.todoRow('Send invoice');
    const prepareReportCheckbox = prepareReportRow.getByRole('checkbox', { name: 'Toggle Todo' });
    const sendInvoiceCheckbox = sendInvoiceRow.getByRole('checkbox', { name: 'Toggle Todo' });

    await expect(todoMvc.taskList.getByRole('listitem')).toHaveCount(2);
    await expect(prepareReportCheckbox).not.toBeChecked();
    await expect(sendInvoiceCheckbox).not.toBeChecked();
    await expect(todoMvc.activeCount(2)).toBeVisible();

    await prepareReportCheckbox.check();
    await expect(prepareReportCheckbox).toBeChecked();
    await expect(sendInvoiceCheckbox).not.toBeChecked();
    await expect(todoMvc.activeCount(1)).toBeVisible();

    await prepareReportCheckbox.uncheck();
    await expect(prepareReportCheckbox).not.toBeChecked();
    await expect(sendInvoiceCheckbox).not.toBeChecked();
    await expect(todoMvc.activeCount(2)).toBeVisible();

    await prepareReportCheckbox.check();
    await sendInvoiceCheckbox.check();
    await expect(prepareReportCheckbox).toBeChecked();
    await expect(sendInvoiceCheckbox).toBeChecked();
    await expect(todoMvc.activeCount(0)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Clear completed' })).toBeVisible();
  });
});
