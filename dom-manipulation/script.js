// Array to store quotes
let quotes = [
    { text: 'The only limit to our realization of tomorrow is our doubts of today.', category: 'inspiration' },
    { text: 'The future belongs to those who believe in the beauty of their dreams.', category: 'dreams' }
];

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById('quoteDisplay').innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
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

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuote').addEventListener('click', addQuote);

// Initialize quotes
loadQuotes();
showRandomQuote();

// Save last viewed quote to sessionStorage
function saveLastViewedQuote(quote) {
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Retrieve last viewed quote from sessionStorage
function loadLastViewedQuote() {
    const storedQuote = sessionStorage.getItem('lastViewedQuote');
    if (storedQuote) {
        document.getElementById('quoteDisplay').innerHTML = JSON.parse(storedQuote);
    }
}

// Update `showRandomQuote` to save last viewed quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    const quoteHtml = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
    document.getElementById('quoteDisplay').innerHTML = quoteHtml;
    saveLastViewedQuote(quoteHtml);
}

// Initialize with last viewed quote
loadLastViewedQuote();

function exportToJson() {
    const json = JSON.stringify(quotes);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Add an export button to HTML
// <button id="exportJson">Export Quotes to JSON</button>

// Event listener
document.getElementById('exportJson').addEventListener('click', exportToJson);

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        const importedQuotes = JSON.parse(e.target.result);
        quotes = importedQuotes;
        saveQuotes();
        showRandomQuote();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Add an import file input to HTML
// <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />

function populateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))];
    const select = document.getElementById('categoryFilter');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
}

// Update `showRandomQuote` to call `populateCategories`
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    const quoteHtml = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
    document.getElementById('quoteDisplay').innerHTML = quoteHtml;
    saveLastViewedQuote(quoteHtml);
}

// Initialize categories
populateCategories();

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

// Initialize filter on page load
restoreFilter();

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

const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock API URL

function fetchQuotesFromServer() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            // Simulate data processing
            console.log('Fetched data:', data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function syncWithServer() {
    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quotes)
    })
    .then(response => response.json())
    .then(data => console.log('Data synced with server:', data))
    .catch(error => console.error('Error syncing data:', error));
}

// Call `syncWithServer` when needed

function resolveConflicts() {
    // Example logic: Server data takes precedence
    fetchQuotesFromServer().then(serverQuotes => {
        // Update local storage with server quotes
        quotes = serverQuotes;
        saveQuotes();
    });
}
