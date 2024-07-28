// Array to store quotes
let quotes = [];

// Constants for mock API
const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock API URL

// Function to display a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        document.getElementById('quoteDisplay').innerHTML = '<p>No quotes available.</p>';
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById('quoteDisplay').innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
    saveLastViewedQuote({ text: quote.text, category: quote.category });
}

// Function to add a new quote
function addQuote() {
    const text = document.getElementById('newQuoteText').value;
    const category = document.getElementById('newQuoteCategory').value;
    if (text && category) {
        quotes.push({ text, category });
        saveQuotes();
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        populateCategories();
        showRandomQuote();
    }
}

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Load quotes from localStorage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

// Save last viewed quote to sessionStorage
function saveLastViewedQuote(quote) {
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Retrieve last viewed quote from sessionStorage
function loadLastViewedQuote() {
    const storedQuote = sessionStorage.getItem('lastViewedQuote');
    if (storedQuote) {
        const quote = JSON.parse(storedQuote);
        document.getElementById('quoteDisplay').innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
    }
}

// Export quotes to JSON file
function exportToJsonFile() {
    const json = JSON.stringify(quotes);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        const importedQuotes = JSON.parse(e.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        showRandomQuote();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Populate category filter dropdown
function populateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))];
    const select = document.getElementById('categoryFilter');
    select.innerHTML = '<option value="all">All Categories</option>'; // Reset options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
}

// Filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(q => q.category === selectedCategory);

    if (filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const quote = filteredQuotes[randomIndex];
        document.getElementById('quoteDisplay').innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
    } else {
        document.getElementById('quoteDisplay').innerHTML = '<p>No quotes available for this category.</p>';
    }
    
    // Save filter preference
    localStorage.setItem('selectedCategory', selectedCategory);
}

// Restore last selected filter on load
function restoreFilter() {
    const lastCategory = localStorage.getItem('selectedCategory') || 'all';
    document.getElementById('categoryFilter').value = lastCategory;
    filterQuotes();
}

// Sync quotes with server
async function syncQuotes() {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quotes)
        });
        const data = await response.json();
        console.log('Data synced with server:', data);
    } catch (error) {
        console.error('Error syncing data:', error);
    }
}

// Fetch quotes from server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        // Update quotes array with server data
        quotes = data.map(item => ({
            text: item.title, // Adjust according to your API response
            category: 'general' // Default category or extract from API response
        }));
        saveQuotes();
        showRandomQuote();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Initialize quotes and categories
function initialize() {
    loadQuotes();
    populateCategories();
    restoreFilter();
    loadLastViewedQuote();
    showRandomQuote();
}

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuote').addEventListener('click', addQuote);
document.getElementById('exportJson').addEventListener('click', exportToJsonFile);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

// Initialize application
initialize();

// Periodically check for new quotes from the server
setInterval(fetchQuotesFromServer, 60000); // Fetch every 60 seconds

// Periodically sync local quotes with the server
setInterval(syncQuotes, 60000); // Sync every 60 seconds

