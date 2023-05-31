class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories(0);
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();

    //Constructor runs immediately when you instantiate the class, so display calories etc
    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();

    document.getElementById('limit').value = this._calorieLimit;
  }
  //Public Methods/API
  addMeal(meal) {
    //push meal obj
    this._meals.push(meal);

    //account for calories in meal obj-- total calories = total calories plus meal calories
    this._totalCalories += meal.calories;
    Storage.updateTotalCalories(this._totalCalories);
    //add to local storage
    Storage.saveMeal(meal);
    this._displayNewMeal(meal);

    //render everytime you add a meal
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    //account for calories in workout -- total calories = total calories minus workout calories
    this._totalCalories -= workout.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveWorkout(workout);
    this._displayNewWorkout(workout);

    //render everytime you add a workout
    this._render();
  }

  removeMeal(id) {
    //find index of the meal we want to remove w/findIndex--for each meal; where the meal.id === the id thats passed in
    const index = this._meals.findIndex((meal) => meal.id === id);
    //check to make sure its a match- w/findIndex if no math will return -1
    if (index !== -1) {
      const meal = this._meals[index];
      this._totalCalories -= meal.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._meals.splice(index, 1);
      Storage.removeMeal(id);
      this._render();
    }
  }
  removeWorkout(id) {
    //find index of workout we want to remove w/findIndex--for each meal; where the meal.id === the id thats passed in
    const index = this._workouts.findIndex((workout) => workout.id === id);
    //check to make sure its a match- w/findIndex if no math will return -1
    if (index !== -1) {
      const workout = this._workouts[index];
      this._totalCalories += workout.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._workouts.splice(index, 1);
      Storage.removeWorkout(id);
      this._render();
    }
  }

  reset() {
    //set total calories to 0
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    Storage.clearAll();
    this._render();
  }

  setLimit(calorieLimit) {
    this._calorieLimit = calorieLimit;
    //display calorie limit
    Storage.setCalorieLimit(calorieLimit);
    this._displayCaloriesLimit();
    this._render();
  }

  loadItems() {
    this._meals.forEach((meal) => this._displayNewMeal(meal));
    this._workouts.forEach((workout) => this._displayNewWorkout(workout));
  }

  //Private Methods
  _displayCaloriesTotal() {
    const totalCaloriesElement = document.getElementById('calories-total');
    totalCaloriesElement.innerHTML = this._totalCalories;
  }
  _displayCaloriesLimit() {
    const calorieLimitElement = document.getElementById('calories-limit');
    calorieLimitElement.innerHTML = this._calorieLimit;
  }

  _displayCaloriesConsumed() {
    const caloriesConsumedElement =
      document.getElementById('calories-consumed');
    //take all calories in our consumed array to get 1 value

    const consumed = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );
    caloriesConsumedElement.innerHTML = consumed;
  }
  _displayCaloriesBurned() {
    const caloriesBurnedElement = document.getElementById('calories-burned');
    //take all calories in our consumed array to get 1 value
    const burned = this._workouts.reduce(
      (total, workout) => total + workout.calories,
      0
    );
    caloriesBurnedElement.innerHTML = burned;
  }

  _displayCaloriesRemaining() {
    //total calories from calorie limit
    const caloriesRemainingElement =
      document.getElementById('calories-remaining');

    const progressElement = document.getElementById('calorie-progress');

    const remaining = this._calorieLimit - this._totalCalories;

    caloriesRemainingElement.innerHTML = remaining;

    if (remaining <= 0) {
      caloriesRemainingElement.parentElement.parentElement.classList.remove(
        'bg-light'
      );
      caloriesRemainingElement.parentElement.parentElement.classList.add(
        'bg-danger'
      );
      progressElement.classList.remove('bg-success');
      progressElement.classList.add('bg-danger');
    } else {
      caloriesRemainingElement.parentElement.parentElement.classList.remove(
        'bg-danger'
      );
      caloriesRemainingElement.parentElement.parentElement.classList.add(
        'bg-light'
      );
      progressElement.classList.remove('bg-danger');
      progressElement.classList.add('bg-success');
    }
  }

  _displayCaloriesProgress() {
    const progressElement = document.getElementById('calorie-progress');
    const percentage = (this._totalCalories / this._calorieLimit) * 100;
    const width = Math.min(percentage, 100);
    progressElement.style.width = `${width}%`;
  }

  _displayNewMeal(meal) {
    const mealsElement = document.getElementById('meal-items');
    //create div
    const mealElement = document.createElement('div');
    //add 2 classes
    mealElement.classList.add('card', 'my-2');
    mealElement.setAttribute('data-id', meal.id);
    mealElement.innerHTML = `
<div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${meal.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
`;

    //add to DOM
    mealsElement.appendChild(mealElement);
  }
  _displayNewWorkout(workout) {
    const workoutsElement = document.getElementById('workout-items');
    //create div
    const workoutElement = document.createElement('div');
    //add 2 classes
    workoutElement.classList.add('card', 'my-2');
    workoutElement.setAttribute('data-id', workout.id);
    workoutElement.innerHTML = `
<div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name}</h4>
                  <div
                    class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
`;

    //add to DOM
    workoutsElement.appendChild(workoutElement);
  }

  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}
class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

//Storage Class-- methods will be static bc we don't need multiple instance... just 1 entity
class Storage {
  static getCalorieLimit(defaultLimit = 2000) {
    let calorieLimit;
    if (localStorage.getItem('calorie-limit') === null) {
      calorieLimit = defaultLimit;
    } else {
      calorieLimit = +localStorage.getItem('calorie-limit');
    }
    return calorieLimit;
  }
  static setCalorieLimit(calorieLimit) {
    localStorage.setItem('calorieLimit', calorieLimit);
  }

  static getTotalCalories(defaultCalories = 0) {
    let totalCalories;
    if (localStorage.getItem('totalCalories') === null) {
      totalCalories = defaultCalories;
    } else {
      totalCalories = +localStorage.getItem('totalCalories');
    }
    return totalCalories;
  }

  static updateTotalCalories(calories) {
    localStorage.setItem('totalCalories', calories);
  }

  static getMeals() {
    let meals;
    if (localStorage.getItem('meals') === null) {
      meals = [];
    } else {
      meals = JSON.parse(localStorage.getItem('meals'));
    }
    return meals;
  }

  static saveMeal(meal) {
    const meals = Storage.getMeals();
    //Push to array then put into lacal storage
    meals.push(meal);
    localStorage.setItem('meals', JSON.stringify(meals));
  }
  static removeMeal(id) {
    const meals = Storage.getMeals();
    meals.forEach((meal, index) => {
      if (meal.id === id) {
        meals.splice(index, 1);
      }
    });

    localStorage.setItem('meals', JSON.stringify(meals));
  }
  static removeMeal(id) {
    //get meal from local storage
    const meals = Storage.getMeals();
    meals.forEach((meal, index) => {
      if (meal.id === id) {
        meals.splice(index, 1);
      }
    });
    localStorage.setItem('meals', JSON.stringify(meals));
  }

  static getWorkouts() {
    let workouts;
    if (localStorage.getItem('workouts') === null) {
      workouts = [];
    } else {
      workouts = JSON.parse(localStorage.getItem('workouts'));
    }
    return workouts;
  }

  static saveWorkout(workout) {
    const workouts = Storage.getWorkouts();
    workouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }

  static removeWorkout(id) {
    //get meal from local storage
    const workouts = Storage.getWorkouts();
    workouts.forEach((meal, index) => {
      if (meal.id === id) {
        workouts.splice(index, 1);
      }
    });
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }

  static removeWorkout(id) {
    const workouts = Storage.getWorkouts();
    workouts.forEach((workout, index) => {
      if (workout.id === id) {
        workouts.splice(index, 1);
      }
    });

    localStorage.setItem('workouts', JSON.stringify(workouts));
  }

  static clearAll() {
    localStorage.removeItem('totalCalories');
    localStorage.removeItem('meals');
    localStorage.removeItem('workouts');

    // If you want to clear the limit
    // localStorage.clear();
  }
}

// App Class to handle events
class App {
  constructor() {
    /*set tracker to property in constructor, now we can access public methods. 
    event listners will go in to the constructor as well */
    this._tracker = new CalorieTracker();
    this._loadEventListners();
    this._tracker.loadItems();
  }

  _loadEventListners() {
    document
      .getElementById('meal-form')
      .addEventListener('submit', this._newItem.bind(this, 'meal'));
    document
      .getElementById('workout-form')
      .addEventListener('submit', this._newItem.bind(this, 'workout'));

    //use event delegation to target meal-items the parent class of all the items. When we click we call
    //remove items-- need this keyword to be the actual object, so we bind and pass in this & type
    document
      .getElementById('meal-items')
      .addEventListener('click', this._removeItem.bind(this, 'meal'));
    document
      .getElementById('workout-items')
      .addEventListener('click', this._removeItem.bind(this, 'workout'));

    //filtering
    document
      .getElementById('filter-meals')
      .addEventListener('keyup', this._filterItems.bind(this, 'meal'));
    document
      .getElementById('filter-workouts')
      .addEventListener('keyup', this._filterItems.bind(this, 'workout'));

    //reset
    document
      .getElementById('reset')
      .addEventListener('click', this._reset.bind(this));
    //set calorie limie
    document
      .getElementById('limit-form')
      .addEventListener('submit', this._setLimit.bind(this));
  }

  _newItem(type, e) {
    e.preventDefault();
    //get input fields
    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);

    //Validate inputs and make sure they're there
    if (name.value === '' || calories.value === '') {
      alert(`Please complete all fields`);
      return;
    }

    //Create a new meal or a new workout
    if (type === 'meal') {
      //+ on +calories turns string into a number
      const meal = new Meal(name.value, +calories.value);
      this._tracker.addMeal(meal);
    } else {
      const workout = new Workout(name.value, +calories.value);
      this._tracker.addWorkout(workout);
    }

    //clear form
    name.value = '';
    calories.value = '';

    const collapseItem = document.getElementById(`collapse-${type}`);
    const bsCollapse = new bootstrap.Collapse(collapseItem, { toggle: true });
  }
  _removeItem(type, e) {
    //target the button
    if (
      e.target.classList.contains('delete') ||
      e.target.classList.contains('fa-xmark')
    ) {
      if (confirm('Are you sure?')) {
        //get id of "item"
        const id = e.target.closest('.card').getAttribute('data-id');
        type === 'meal'
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout(id);

        const item = e.target.closest('.card').remove();
      }
    }
  }
  _filterItems(type, e) {
    //get text from input
    const text = e.target.value.toLowerCase();
    //now that we have text we loop through the items
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent;

      if (name.toLowerCase().indexOf(text) !== -1) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  _reset() {
    this._tracker.reset();
    //clear up any meal or workout items in DOM
    document.getElementById('meal-items').innerHTML = '';
    document.getElementById('workout-items').innerHTML = '';
    document.getElementById('filter-meals').value = '';
    document.getElementById('filter-workouts').value = '';
  }

  _setLimit(e) {
    e.preventDefault();
    //get actual limit
    const limit = document.getElementById('limit');

    if (limit.value === '') {
      alert('Please add a calorie limit');
      return;
    }
    this._tracker.setLimit(+limit.value);
    //clear limit form
    limit.value = '';

    //close bootstrap modal
    const modalElement = document.getElementById('limit-modal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }
}

//Runs the app
const app = new App();
