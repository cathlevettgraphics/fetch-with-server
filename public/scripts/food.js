/*************************
 *
 * FOOD APP + LOCAL SERVER HOOKUP
 *
 *************************/

// get form
const foodForm = document.forms['food-form'];

// get data from form
foodForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(foodForm);
  const foodData = Object.fromEntries(formData);
  // console.log('searching for  in ', foodData);

  const foodDataValue = Object.values(foodData);

  fetchFood(foodDataValue);
});

// send data from form to the server
async function fetchFood(foodDataValue) {
  try {
    const response = await fetch('/api/v1/get-meal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(foodDataValue),
    });

    if (response.ok) {
      // pass food we receive from the server to render function
      const food = await response.json();
      console.log('food response is', food);

      console.log({ food });
      renderFoodList(food);
    } else {
      throw new Error(response);
    }
  } catch (err) {
    console.log('error', err.sendMessage || err.statusText);
  }
}

// render the data
const mountNodeFood = document.getElementById('target-food');

// Data passed to this function inside the fetch call
function renderFoodList(food) {
  if (food.meals === null) {
    mountNodeFood.innerHTML = 'No meals found ... please search again';
  } else {
    const list = document.createElement('ul');
    list.classList.add('food-list-wrapper');

    // Build list for each food option
    for (const { strMeal, strMealThumb, strYoutube } of food.meals) {
      const li = document.createElement('li');
      li.classList.add('food-list-grid');
      li.innerHTML = `
        <div class="food-wrapper">
        <h3 class="food-headline">${strMeal}</h3>
        <a href=${strYoutube}"><img src="${strMealThumb}" class="food-image"></a>
        <a href="${strYoutube}" class="food-link">Watch the recipie here</a>
        </div>
        `;
      list.append(li);
    }
    mountNodeFood.innerHTML = '';
    mountNodeFood.append(list);
  }
}
