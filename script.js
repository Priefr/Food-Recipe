const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
document.getElementById('meal').classList.add('loaded');

// Event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    const mealDetails = document.querySelector('.meal-details');
    if (mealDetails) {
        mealDetails.style.display = 'none';
        mealDetails.classList.remove('showRecipe'); 
    }
});
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

// Get meal list from the database
function getMealList() {
    const searchInputTxt = document.getElementById('search-input').value.trim();

    fetch(`http://localhost:3000/meals`) // Fetch from your server
        .then(response => response.json())
        .then(data => {
            let html = "";
            if (data.length > 0) {
                data.forEach(meal => {
                    html += `
                        <div class="meal-item" data-id="${meal.id}">
                            <div class="meal-img">
                                <img src="${meal.strMealThumb}" alt="food">
                            </div>
                            <div class="meal-name">
                                <h3>${meal.name}</h3>
                                <a href="#" class="recipe-btn">Get Recipe</a>
                            </div>
                        </div>
                    `;
                });
                mealList.classList.remove('notFound');
            } else {
                html = "Sorry, we didn't find any meal!";
                mealList.classList.add('notFound');
            }

            mealList.innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching meals:', error);
            mealList.innerHTML = "Error fetching meals.";
            mealList.classList.add('notFound');
        });
}

function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`http://localhost:3000/meals/${mealItem.dataset.id}`) // Endpoint for specific meal details (to be created)
            .then(response => response.json())
            .then(data => showRecipeDetails(data));
    }
}

function showRecipeDetails(meal) {
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient) {
            ingredients.push(`${measure} ${ingredient}`);
        }
    }

    const ingredientList = ingredients.map(ingredient => `<li>${ingredient}</li>`).join('');

    const mealDetailsContent = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Ingredients:</h3>
            <ol>${ingredientList}</ol>
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
    `;

    document.querySelector('.meal-details-content').innerHTML = mealDetailsContent;
    document.querySelector('.meal-details').style.display = 'block';
}
// Get the modal and login button elements
const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('login-btn');
const closeBtn = document.querySelector('.close');

// Open the modal when login button is clicked
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
});

// Close the modal when the 'x' is clicked
closeBtn.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

// Close the modal if the user clicks outside of it
window.addEventListener('click', (event) => {
    if (event.target == loginModal) {
        loginModal.style.display = 'none';
    }
});

// Check if the user is already logged in when the page loads
window.onload = function() {
    const userRole = localStorage.getItem('userRole');
    if (userRole) {
        // Hide the login button and show the logout button
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'block';
        updateSidebar(userRole); // Update the sidebar based on the role
    }
};

// Handle the login process
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form submission
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Example users
    const users = [
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'user1', password: 'user123', role: 'user' }
    ];

    // Find the user
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // If the user exists and credentials match
        console.log(`${user.role} logged in`);

        // Save user role in localStorage
        localStorage.setItem('userRole', user.role);

        // Hide the login modal
        loginModal.style.display = 'none';

        // Update UI based on role
        updateSidebar(user.role);

        // Show logout button and hide login button
        loginBtn.style.display = 'none';
        document.getElementById('logout-btn').style.display = 'block';

        // Show login success notification
        showLoginSuccess();
    } else {
        // If credentials don't match, show an alert
        alert('Invalid username or password');
    }
});

// Update sidebar based on the role
function updateSidebar(role) {
    if (role === 'admin') {
        document.getElementById('admin-menu').style.display = 'block';
        document.getElementById('user-menu').style.display = 'none';
    } else if (role === 'user') {
        document.getElementById('admin-menu').style.display = 'none';
        document.getElementById('user-menu').style.display = 'block';
    }
}

// Show login success message
function showLoginSuccess() {
    const successMessage = document.createElement('div');
    successMessage.textContent = 'Login successful!';
    successMessage.classList.add('login-success-message'); // Add your custom styles here
    document.body.insertAdjacentElement('afterbegin', successMessage);

    // Remove the message after 3 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}

// Handle logout
function logout() {
    localStorage.removeItem('userRole');
    location.reload(); // Refresh the page to reset the UI
}

// Get all elements with the class 'dropdown-btn' and add event listeners to them
const dropdown = document.querySelectorAll('.dropdown-btn');

dropdown.forEach(button => {
  button.addEventListener('click', function() {
    this.classList.toggle('active');
    const dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === 'block') {
      dropdownContent.style.display = 'none';
    } else {
      dropdownContent.style.display = 'block';
    }
  });
});
// Opening the Add Meal Modal
document.getElementById('addMealBtn').addEventListener('click', () => {
    // Open the modal (assuming the modal setup is from the previous code)
    modal.style.display = 'block';
  });
  
  // Delete Meal functionality
  document.getElementById('deleteMealBtn').addEventListener('click', () => {
    // Fetch meals to display to delete (or open a delete meal form)
    fetch('/meals')
      .then(response => response.json())
      .then(meals => {
        // Display a list of meals with delete buttons
        let mealListHtml = '<h3>Delete a Meal</h3><ul>';
        meals.forEach(meal => {
          mealListHtml += `
            <li>
              ${meal.name} 
              <button onclick="deleteMeal(${meal.id})">Delete</button>
            </li>`;
        });
        mealListHtml += '</ul>';
  
        // Insert this HTML into the page
        document.getElementById('mealListContainer').innerHTML = mealListHtml;
      });
  });
  
  // Function to handle meal deletion
  function deleteMeal(mealId) {
    if (confirm('Are you sure you want to delete this meal?')) {
      fetch(`/meals/${mealId}`, {
        method: 'DELETE'
      })
      .then(() => {
        alert('Meal deleted successfully');
        // Optionally refresh the meal list
      });
    }
  }
  