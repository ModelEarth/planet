import { getGoogleSheetData, updateFeed } from './services/googleSheetsService.js';

window.updateFeed = updateFeed;

document.addEventListener("DOMContentLoaded", () => {
  console.log("Module loaded");
  getGoogleSheetData();
});
