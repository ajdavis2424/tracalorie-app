class CalorieTracker {
  constructor() {
    this._calorieLimit = 2000;
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];

    //Constructor runs immediately when you instantiate the class, so display calories etc
    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }
  //Public Methods/API
  addMeal(meal) {
    //push meal obj
    this._meals.push(meal);

    //account for calories in meal obj-- total calories = total calories plus meal calories
    this._totalCalories += meal.calories;
    //render everytime you add a meal
    this._render();
  }

  addworkout(workout) {
    this._workouts.push(workout);
    //account for calories in workout -- total calories = total calories minus workout calories
    this._totalCalories -= workout.calories;
    //render everytime you add a workout
    this._render();
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

const tracker = new CalorieTracker();

//create new meal & workout
const breakfast = new Meal('Breakfast', 400);
const lunch = new Meal('Lunch', 350);
tracker.addMeal(breakfast);
tracker.addMeal(lunch);

const run = new Workout('Morning Run', 300);

tracker.addworkout(run);
console.log(tracker._meals);
console.log(tracker._meals);
console.log(tracker._totalCalories);
