async function searchFood() {
  const apiKey = config.apiKey;
    const query = document.getElementById('search').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    
    if (!query) {
        resultsDiv.innerHTML = '<p>Please enter a search term.</p>';
        return;
    }
    
    const response = await fetch(`https://www.themealdb.com/api/json/v1/${apiKey}/search.php?s=${query}`);
    const data = await response.json();
    
    if (!data.meals) {
        resultsDiv.innerHTML = '<p>No results found.</p>';
        return;
    }
    
    data.meals.forEach(meal => {
        const mealDiv = document.createElement('div');
        mealDiv.classList.add('meal');
        
        mealDiv.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div>
                <h4>${meal.strMeal}</h4>
                <p><strong>Category:</strong> ${meal.strCategory}</p>
                <p><strong>Area:</strong> ${meal.strArea}</p>
            </div>
        `;
        
        resultsDiv.appendChild(mealDiv);
    });
}