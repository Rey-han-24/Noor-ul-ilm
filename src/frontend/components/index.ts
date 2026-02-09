/**
 * Frontend Components Index
 *
 * Central export file for all reusable components.
 * Import components from '@/frontend/components' for cleaner imports.
 */

// Layout components
export { default as Header } from "./Header";
export { default as Footer } from "./Footer";
export { default as HeaderMobileMenu } from "./HeaderMobileMenu";
export { ThemeProvider } from "./ThemeProvider";
export { default as LogoutButton } from "./LogoutButton";

// History components
export { default as HistoryRecorder } from "./HistoryRecorder";
export * from "./HistoryCard";
export * from "./BookmarkCard";
