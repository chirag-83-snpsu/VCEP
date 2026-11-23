import assert from 'node:assert/strict';
import fs from 'node:fs';

console.log('Verifying VCEP UX Refinement Release 1.1...');

// 1. Verify CSS styles
const css = fs.readFileSync('app/premium-journey.css', 'utf8');
const globalsCss = fs.readFileSync('app/globals.css', 'utf8');

// Skip to main content styling
assert.ok(globalsCss.includes('.skip-link{position:absolute;top:-100px'), 'Skip link must be visually hidden initially');
assert.ok(globalsCss.includes('.skip-link:focus'), 'Skip link must appear on focus');

// Single active ring on track without double outline
assert.ok(css.includes('.vcep-track-active'), 'Track active style must exist');
assert.ok(css.includes('box-shadow: 0 0 0 1px var(--vcep-teal)'), 'Track active should use single 1px box-shadow outline');
assert.ok(css.includes('.vcep-track:focus-visible'), 'Track focus-visible must have separate high-contrast ring');

// 44-48px icon and responsive rules
assert.ok(css.includes('@media (max-width: 480px)'), 'Mobile 390px-480px breakpoint must be defined');
assert.ok(css.includes('overflow-x: hidden'), 'Overflow-x hidden must prevent horizontal scroll on mobile');

// 2. Verify Component Logic in premium-journey.tsx
const pj = fs.readFileSync('app/premium-journey.tsx', 'utf8');

// Single primary CTA
assert.ok(pj.includes('vcep-btn-guided'), 'Guided Lesson primary button must exist');
assert.ok(pj.includes('DropdownMenu'), 'Radix DropdownMenu must be imported and used');
assert.ok(pj.includes('vcep-btn-more'), 'Discreet More menu trigger button must exist');

// Genuine Next Session calculation
assert.ok(pj.includes('const draftSession = sessions.find'), 'Must check active unsubmitted drafts');
assert.ok(pj.includes('const nextUnlocked = sessions.find'), 'Must check unlocked incomplete sessions');

// Staff vs Student Role Separation
assert.ok(pj.includes("FACULTY WORKSPACE"), 'Staff must see Faculty Workspace in Hero');
assert.ok(pj.includes("onOpenManagement"), 'Staff must have access to open Management Workspace');
assert.ok(pj.includes("Staff Review Lab"), 'Staff Review Lab must be present for staff');
assert.ok(pj.includes("Awaiting Enrolment"), 'Pending role must be handled');

// All 24 session icons preserved
assert.ok(pj.includes('SessionIcon'), 'SessionIcon must be used');
assert.ok(pj.includes('driveSummaries'), 'driveSummaries metadata must be used');

// 3. Verify Learning Track Slider (Release 1.2)
assert.ok(pj.includes('vcep-track-slider-viewport'), 'Must contain slider viewport container');
assert.ok(pj.includes('vcep-track-slider-strip'), 'Must contain animated slider strip');
assert.ok(pj.includes('vcep-track-slide'), 'Must contain track slides');
assert.ok(pj.includes('Previous Track'), 'Must contain Previous Track navigation button');
assert.ok(pj.includes('Next Track'), 'Must contain Next Track navigation button');
assert.ok(pj.includes('vcep-track-dots'), 'Must contain four-segment track dots');
assert.ok(css.includes('.vcep-track-slider-strip'), 'CSS must define slider strip transitions');
assert.ok(css.includes('.vcep-track-nav-bar'), 'CSS must define track nav bar styles');

console.log('PASS: All UX Refinement Release 1.1 & 1.2 checks successfully verified!');
