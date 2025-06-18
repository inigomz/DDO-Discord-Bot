// Import required modules
const readline = require('readline');                 // For CLI input
const { scrapeCategory } = require('./scraper');      // Import the scraper function

// Set up readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// List of scrapeable DDO categories
const categories = ['Handwraps', 'Great Axes', 'Daggers', 'Long Bows', 'Short Bows', 'Repeating Heavy Crossbows', 'Quarterstaffs'];

// Display a numbered menu to the user
console.log('Select a category to scrape:');
categories.forEach((cat, i) => console.log(`${i + 1}) ${cat}`));

// Ask user to choose a category
rl.question('Enter a number: ', async (answer) => {
  const index = parseInt(answer, 10) - 1;     // Convert input to array index
  const selected = categories[index];         // Get the selected category

  if (!selected) {
    console.log('Invalid selection.');
    rl.close(); // Exit input mode
    return;
  }

  try {
    // Call the scrape function and wait for the result
    const { filename, count } = await scrapeCategory(selected);
    console.log(`SUCCESS: Saved ${filename} with ${count} items`);
  } catch (err) {
    // Display any error that occurred during scraping
    console.error('ERROR:', err.message);
  }

  rl.close(); // Clean up the readline interface
});

