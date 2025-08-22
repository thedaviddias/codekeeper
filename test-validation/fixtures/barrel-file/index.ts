/**
 * Test barrel file - should be detected
 * This has multiple re-exports (barrel pattern)
 */

export * from './component1';
export * from './component2';
export * from './component3';
export { Button } from './ui/button';
export { Card } from './ui/card';
export { Modal } from './ui/modal';