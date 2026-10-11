# SauceDemo Core User Operations Test Plan

## Application Overview

Exploration-based browser test plan for the SauceDemo e-commerce demo (Swag Labs). The storefront supports sign-in, sorting and inspecting six products, adding/removing cart items, entering checkout information, reviewing order totals, and completing an order. All tests begin from a fresh browser context and use the documented standard_user / secret_sauce demo credentials unless explicitly testing authentication failure. Tests should not depend on state left by another test.

## Test Scenarios

### 1. 1. Account access

**Seed:** `tests\seed.spec.ts`

#### 1.1. Reject invalid credentials and sign in with the standard demo account

**File:** `tests\core\account-access.spec.ts`

**Steps:**
  1. Open https://www.saucedemo.com/ in a fresh browser context.
    - expect: The Swag Labs login form is visible with Username, Password, and Login controls.
  2. Submit the login form with both fields empty.
    - expect: The user remains on the login page and a visible required-username validation message appears.
  3. Enter an unsupported username and an incorrect password, then submit.
    - expect: The user remains unauthenticated on the login page and a visible authentication error appears.
  4. Enter username standard_user and password secret_sauce, then submit.
    - expect: Navigation reaches /inventory.html and the Products catalog is visible.

### 2. 2. Product discovery

**Seed:** `tests\seed.spec.ts`

#### 2.1. Sort the catalog and inspect product details

**File:** `tests\core\product-discovery.spec.ts`

**Steps:**
  1. Sign in as standard_user / secret_sauce from a fresh browser context.
    - expect: The catalog displays six products and the default sort is Name (A to Z).
  2. Select Price (low to high) in the Sort products control.
    - expect: The catalog is ordered by ascending price; Sauce Labs Onesie ($7.99) appears first and Sauce Labs Fleece Jacket ($49.99) appears last.
  3. Select Name (Z to A), then open the Sauce Labs Backpack details from its product image or title.
    - expect: The product ordering changes to descending name order.
    - expect: The detail page identifies Sauce Labs Backpack and shows its description, $29.99 price, and Add to cart control.
  4. Use Back to products to return to the catalog.
    - expect: The catalog is displayed again and can be used without losing the active session.

### 3. 3. Cart management

**Seed:** `tests\seed.spec.ts`

#### 3.1. Add and remove products from the cart

**File:** `tests\core\cart-management.spec.ts`

**Steps:**
  1. Sign in as standard_user / secret_sauce from a fresh browser context.
    - expect: The catalog is visible and the cart badge is empty.
  2. Add Sauce Labs Backpack and Sauce Labs Bike Light to the cart.
    - expect: Each product control changes to Remove.
    - expect: The cart badge shows 2.
  3. Open the cart.
    - expect: The cart contains one row each for Sauce Labs Backpack ($29.99) and Sauce Labs Bike Light ($9.99), each with quantity 1 and a Remove control.
  4. Remove the Bike Light, then remove the Backpack.
    - expect: The corresponding rows are removed and the cart badge updates after each removal.
    - expect: The cart shows its empty state after the final removal.
  5. Choose Continue Shopping.
    - expect: The user returns to the Products catalog and the cart remains empty.

### 4. 4. Checkout information

**Seed:** `tests\seed.spec.ts`

#### 4.1. Validate checkout fields and review order details

**File:** `tests\core\checkout-information.spec.ts`

**Steps:**
  1. Sign in as standard_user / secret_sauce, add Sauce Labs Backpack to the cart, open the cart, and select Checkout.
    - expect: The Checkout: Your Information form displays First Name, Last Name, Zip/Postal Code, Cancel, and Continue.
  2. Submit the form with all fields blank.
    - expect: The user remains on the information step and sees a visible required-field validation error.
  3. Enter First Name Alex, Last Name Tester, and Zip/Postal Code 90210, then select Continue.
    - expect: The Checkout: Overview step appears and lists the Backpack at quantity 1 and $29.99.
  4. Verify the displayed payment, shipping, item subtotal, tax, and total.
    - expect: Payment Information and Shipping Information are present.
    - expect: For the $29.99 Backpack, item total is $29.99, tax is $2.40, and total is $32.39.

### 5. 5. Order placement

**Seed:** `tests\seed.spec.ts`

#### 5.1. Complete a multi-item purchase and verify confirmation

**File:** `tests\core\order-placement.spec.ts`

**Steps:**
  1. Sign in as standard_user / secret_sauce in a fresh browser context and add Sauce Labs Backpack ($29.99) and Sauce Labs Bike Light ($9.99) to the cart.
    - expect: The cart badge shows 2 and both selected products are present in the cart.
  2. Proceed through checkout with First Name Alex, Last Name Tester, and Zip/Postal Code 90210.
    - expect: The Overview page contains both products at quantity 1 each.
    - expect: Item total is $39.98, tax is $3.20, and total is $43.18.
  3. Select Finish.
    - expect: Navigation reaches /checkout-complete.html.
    - expect: A Thank you for your order! confirmation and dispatch message are visible.
    - expect: The cart badge is empty.
  4. Select Back Home.
    - expect: The user returns to the Products catalog with the completed order no longer in the cart.
