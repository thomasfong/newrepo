// Example of importing modules into index.js
import { loadNavigation } from './nav.js';
import { renderReviews } from './reviews.js';

document.addEventListener('DOMContentLoaded', () => {
  loadNavigation();
  renderReviews();
});
