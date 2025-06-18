const axios = require('axios');      // For making HTTP requests
const cheerio = require('cheerio');  // For parsing HTML
const fs = require('fs');            // For saving JSON to disk

// Main function to scrape a specific item category
async function scrapeCategory(categoryName) {
  // Construct the URL to the DDO Wiki Category page
  const url = `https://ddowiki.com/page/Category:${encodeURIComponent(categoryName)}`;

  try {
    const { data } = await axios.get(url); // Download page HTML
    const $ = cheerio.load(data);          // Load it into cheerio
    const items = [];                      // Hold the final scraped results

    // Go through each row of the first wikitable
    $('table.wikitable tr').each((_, row) => {
      const cols = $(row).find('td');
      if (cols.length < 3) return; // Skip headers or malformed rows

      // Extract name and link
      const anchor = $(cols[0]).find('a');
      const name = anchor.text().trim();
      const link = 'https://ddowiki.com' + anchor.attr('href');

      // Skip category redirects
      if (link.includes('/Category:')) return;

      // Extract minimum level
      const minLevel = $(cols[2]).text().trim();

      // Extract enhancements from <href> tags inside column 2
      
      const enhancements = [];

      $(cols[1]).find('li').each((_, li) => {
        const a = $(li).find('a[href]').first();
        const text = a.text().trim();

        // Skip if no valid text or href
        if (!a.length || !text) return;

        // Skip anything with "Category:" in it
        if (text.toLowerCase().includes('category:')) return;

        enhancements.push(text);
      });

      // Save all info into the items list
      items.push({ name, link, minLevel, enhancements });
    });

    // Create a filename like 'handwraps.json'
    const filename = `${categoryName.toLowerCase().replace(/\s+/g, '_')}.json`;

    // Write the full item list to disk
    fs.writeFileSync(filename, JSON.stringify(items, null, 2));
    console.log(`SUCCESS: Saved ${filename} with ${items.length} items`);

    // Return useful metadata
    return { filename, count: items.length };
  } catch (err) {
    throw new Error(`ERROR: Failed to scrape ${categoryName}: ${err.message}`);
  }
}

// Export the function so other files (like menu.js) can use it
module.exports = { scrapeCategory };
