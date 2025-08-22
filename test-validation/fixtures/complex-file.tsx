/**
 * Test file with high complexity - should trigger violations
 * Too many lines, functions, and deep nesting
 */

import React from 'react';

// Function 1
function helper1() { return true; }

// Function 2  
function helper2() { return false; }

// Function 3
function helper3() { return null; }

// Function 4
function helper4() { return undefined; }

// Function 5
function helper5() { return 0; }

// Function 6
function helper6() { return ''; }

// Function 7
function helper7() { return []; }

// Function 8
function helper8() { return {}; }

// Function 9
function helper9() { return new Date(); }

// Function 10
function helper10() { return Math.random(); }

// Function 11
function helper11() { return Promise.resolve(); }

// Function 12
function helper12() { return setTimeout(() => {}, 1000); }

// Function 13
function helper13() { return setInterval(() => {}, 1000); }

// Function 14
function helper14() { return clearTimeout(0); }

// Function 15
function helper15() { return clearInterval(0); }

// Function 16 - This should push us over the limit
function deeplyNestedFunction() {
  if (true) {
    if (true) {
      if (true) {
        if (true) {
          if (true) {
            // This is 5 levels deep (should trigger nesting violation)
            return "too deep";
          }
        }
      }
    }
  }
}

// Function 17
const anotherFunction = () => {
  return "more functions";
};

export default function ComplexComponent() {
  return <div>Complex component with too many functions</div>;
}

// Adding more lines to trigger line count violation
// Line 1
// Line 2
// Line 3
// Line 4
// Line 5
// Line 6
// Line 7
// Line 8
// Line 9
// Line 10
// Line 11
// Line 12
// Line 13
// Line 14
// Line 15
// Line 16
// Line 17
// Line 18
// Line 19
// Line 20