# Task: Add per-field validation + error messages (show on submit only)

Previous task: Register design matching login ✅

## Steps:
- [x] 1. Update TODO.md with new plan
- [x] 2. Add validation logic + errors to app.ts (login/register submitted flags, per-field errors, updated login/register methods, clear on toggle)
- [x] 3. Update app.html with login error divs (*ngIf="submitted && loginErrors.field")
- [x] 4. Add @Input registerErrors/registerSubmitted to register.component.ts
- [x] 5. Update register.component.html with error divs below each input
- [x] 6. Style .error-message in styles.css (red glassmorphism, animation)
- [x] 7. Test on http://localhost:51832/ (hot-reloads show errors only on submit)
- [x] 8. Complete

## Current Progress: ✅ All validation + per-field errors implemented. Test: Enter invalid data, click Sign In/Create Account - errors appear below fields. Toggle forms clears. Success proceeds.

Validations: required fields, email regex, password (8+ upper/lower/number).
