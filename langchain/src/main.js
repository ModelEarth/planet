// ------------------------------------------------------------
// MAIN APPLICATION FILE
// ------------------------------------------------------------

import { getGoogleSheetData, updateFeed } from './services/googleSheetsService.js';
import { pullData, generateResponse, checkPulledData } from './services/dataService.js';
import { checkOtherAPIKeyRequirement, setLoadingState } from './utils/uiHelpers.js';

// ------------------------------------------------------------
// EVENT LISTENERS AND INITIALIZATION
// ------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  // Initialize UI elements
  const submitButton = document.getElementById('submitButton');
  const chosenService = document.getElementById('aiModel');
  // const contextBtn = document.getElementById('contextBtn'); //REMOVED contextBtn
  const feedSelector = document.getElementById('apiFeeds');

  // Add event listeners
  // contextBtn.addEventListener('click', checkPulledData);  //REMOVED contextBtn
  chosenService.addEventListener('change', checkOtherAPIKeyRequirement);
  feedSelector.addEventListener('change', (e) => updateFeed(e.target.value));
  
  // Initialize API key field visibility
  checkOtherAPIKeyRequirement();


  // Set up submit button
  submitButton.addEventListener('click', async () => {
    await generateResponse();
  });
  
  // Initialize Google Sheets data
  getGoogleSheetData();
});

// Listen for CORS refresh button click event
document.addEventListener('click', function(event) {
  if (event.target.id === 'corsLink' && event.target.tagName === 'A') {
    alert("CORS passthrough enabled. Please refresh the page.");
  }
});

// Get the input element
const sourceUrlInput = document.getElementById('sourceUrl');

// Function to validate GitHub URL
function isValidGitHubUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname === 'github.com' || parsedUrl.hostname.endsWith('.github.com');
  } catch (e) {
    return false;
  }
}

// Function to process the GitHub URL
function processGitHubUrl(url) {
  console.log(`Processing GitHub URL: ${url}`);
  pullData();
}

// Add event listener for input changes
sourceUrlInput.addEventListener('input', function() {
  const url = this.value.trim();
  
  // Visual feedback on input
  if (url === '') {
    this.classList.remove('border-red-500', 'border-green-500');
    return;
  }
  
  if (isValidGitHubUrl(url)) {
    this.classList.remove('border-red-500');
    this.classList.add('border-green-500');
  } else {
    this.classList.remove('border-green-500');
    this.classList.add('border-red-500');
  }
});

// Add event listener for when the user completes input (on blur or Enter key)
sourceUrlInput.addEventListener('blur', function() {
  const url = this.value.trim();
  if (isValidGitHubUrl(url)) {
    processGitHubUrl(url);
  }
});

sourceUrlInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    const url = this.value.trim();
    if (isValidGitHubUrl(url)) {
      processGitHubUrl(url);
    }
  }
});