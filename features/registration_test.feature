Feature: User Registration and Checkout

  Scenario: Register a new user and complete checkout
    Given Open the demo webshop site
    When Register and proceed to checkout
    Then I should see the checkout page
