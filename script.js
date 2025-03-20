const fileInput = document.getElementById('fileInput');
const keywordInput = document.getElementById('keywordInput');
const textInput = document.getElementById('textInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const themeToggle = document.getElementById('themeToggle');
let chart;

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// Analyze Button
analyzeBtn.addEventListener('click', () => {
    const keyword = keywordInput.value.trim().toLowerCase();
    const inputText = textInput.value.trim();

    if (fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const csv = e.target.result;
            const rows = csv.split(/\r?\n/);
            const filtered = keyword ? rows.filter(r => r.toLowerCase().includes(keyword)) : rows;
            analyzeReviews(filtered);
        };
        reader.readAsText(fileInput.files[0]);
    } else if (inputText) {
        const reviews = inputText.split(/[.!?]/).filter(r => r.trim() !== '');
        analyzeReviews(reviews);
    } else {
        alert('Please upload a CSV or enter text.');
    }
});

// Analyze Sentiment
function analyzeReviews(reviews) {
    let positive = 0, negative = 0, neutral = 0;

    reviews.forEach(review => {
        const r = review.toLowerCase();
        if (r.includes('good') || r.includes('great') || r.includes('love')) {
            positive++;
        } else if (r.includes('bad') || r.includes('poor') || r.includes('hate')) {
            negative++;
        } else {
            neutral++;
        }
    });

    renderChart(positive, negative, neutral);
}

// Render Chart
function renderChart(positive, negative, neutral) {
    const ctx = document.getElementById('sentimentChart').getContext('2d');
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Positive', 'Negative', 'Neutral'],
            datasets: [{
                label: 'Sentiment Count',
                data: [positive, negative, neutral],
                backgroundColor: ['#4CAF50', '#f44336', '#FFC107']
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
