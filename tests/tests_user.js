/**
 * Authentication tests.
 * Author: aandre@mit.edu
 */

test('User - Empoyee Account Creation', function () {
  // Create Test Employer Account if DNE
  client_signup_employer({
    first_name: "Employer",
    last_name: "One",
    email: "employer-one@andreaboulian.com",
    schedule_name: "Test Schedule",
    password: "thisPasswd"
  });

  // Login Employer and Deep Clean Schedule (Including Employees)
  test_employer_login();
  clear_employer(true);

  // Register Three Test Employee Accounts
  ok(client_signup_employee({
    first_name: "Employee",
    last_name: "One",
    email: "employee-one@andreaboulian.com"
  }).success, "Employee Account Creation - I");

  ok(client_signup_employee({
    first_name: "Employee",
    last_name: "Two",
    email: "employee-two@andreaboulian.com"
  }).success, "Employee Account Creation - II");

  ok(client_signup_employee({
    first_name: "Employee",
    last_name: "One",
    email: "employee-three@andreaboulian.com"
  }).success, "Employee Account Creation - III");

  ok(client_signup_employee({
    first_name: "Employee",
    last_name: "Two",
    email: "employee-two@andreaboulian.com"
  }).success === false, "Employee Account Creation - Reject Duplicate");

  // Logout Employer
  client_logout();
});


test('User - Login/Logout', function () {
  ok(test_employer_login(), "Account Login - /login");
  ok(client_logout().success, "Account Logout - /logout");
});