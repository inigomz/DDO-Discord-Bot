// Import the required modules
const axios = require('axios');      // For making HTTP requests to the website
const cheerio = require('cheerio');  // For parsing and querying the HTML like jQuery
const fs = require('fs');            // For saving data to a file on your computer

// Define the main scraping function
async function scrapeHandwraps() {
  // The DDO Wiki category page that lists all handwraps
  // TODO: use a var instead of a const and create a generator for different item types
  const url = 'https://ddowiki.com/page/Category:Handwraps';

  try {
    // Fetch the raw HTML content of the page using axios
    const { data } = await axios.get(url);

    // Load the HTML into cheerio so we can use jQuery-like selectors
    const $ = cheerio.load(data);

    // Create an empty array to store the scraped items
    const items = [];

    // Select all <a> tags inside <li> elements under the .mw-category-group class
    $('.mw-category-group ul li a').each((_, el) => {
      const name = $(el).text().trim(); // Get the visible text (item name)
      const link = 'https://ddowiki.com' + $(el).attr('href'); // Construct the full link
      if (link.includes('/Category:')) return; //If the link leads to another index, skip the entry.

      // Push the item into the array
      items.push({ name, link });
    });

    // Save the array to a file named handwraps.json
    fs.writeFileSync('greataxes.json', JSON.stringify(items, null, 2));
    console.log(' Saved handwraps.json with', items.length, 'items');
  } catch (err) {
    // Print any error that occurs during the request or processing
    console.error(' Error scraping category:', err.message);
  }
}

// Call the function to run the scraper once
scrapeHandwraps();
