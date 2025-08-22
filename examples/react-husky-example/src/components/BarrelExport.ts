// ❌ BAD: This is a barrel file that CodeKeeper will detect and flag
// Barrel files prevent tree-shaking and slow down builds

// Problem: Exports everything, even unused components
export * from './BadComponent';
export * from './GoodComponent';

// This pattern forces bundlers to include ALL components
// even if you only import one of them in your app
// Result: Larger bundle sizes and slower builds

// ❌ This makes imports look clean but hurts performance:
// import { BadComponent } from './components/BarrelExport';  // Imports EVERYTHING

// ✅ Better approach - direct imports:
// import BadComponent from './components/BadComponent';      // Only imports what's needed