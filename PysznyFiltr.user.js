// ==UserScript==
// @name         Pyszny Filtr
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Ingredients filter for restaurants' menu items on Pyszne.pl.
// @author       fri
// @match        https://www.pyszne.pl/menu/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // These selectors can change if Pyszne updates their site:
  const categoryContainer = '[data-qa="meal-category"]';
  const mealContainer = '[data-qa="menu-list"] div[role="listitem"]';
  const ingredientsDiv = '[data-qa="text"] > [data-qa="text"]';
  const restaurantAvatar = '[data-qa="flex"] > [data-qa="avatar"]';
  const restaurantInfoButton = '[data-qa="restaurant-header-action-info"]';
  const restaurantFavButton = '[data-qa="restaurant-header-action-favourite"]';
  const borderColor = '#D7D7D7';
  
  // These selectors are internal for the script, there's no point changing them:
  const pysznyFiltrClassName = 'pyszny-filtr';
  const pysznyFiltrDiv = '.' + pysznyFiltrClassName;
  const pysznyFiltrWantedInput = pysznyFiltrDiv + ' input.wanted';
  const pysznyFiltrUnwantedInput = pysznyFiltrDiv + ' input.unwanted';
  const wantedColor = '#428542';
  const unwantedColor = '#D73C3C';
  

  const cssRules = `
    /* modify existing page elements */
    :root {
      --pyszny-filtr-color-wanted: ${wantedColor};
      --pyszny-filtr-color-unwanted: ${unwantedColor};
      --border-color: ${borderColor};
    }
    ${restaurantAvatar} {
      position: relative;
      top: -50px;
    }
    ${restaurantInfoButton} {
      border: 1px solid var(--border-color);
      border-top-left-radius: 2px;
      border-bottom-left-radius: 2px;
      margin: 0 -1px 0 5px;
      height: 48px;
    }
    ${restaurantFavButton} {
      border: 1px solid var(--border-color);
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
      height: 48px;
    }

    /* Pyszny Filtr input fields */
    ${pysznyFiltrDiv} {
      z-index: 10;
    }
    ${pysznyFiltrDiv} input {
      border: 1px solid var(--border-color);
      width: 180px;
      height: 48px;
      font-size: 120%;
      padding: 0.5em;
    }
    ${pysznyFiltrWantedInput} {
      margin-right: -1px;
      border-top-left-radius: 2px;
      border-bottom-left-radius: 2px;
      color: var(--pyszny-filtr-color-wanted);
    }
    ${pysznyFiltrWantedInput}::placeholder {
      color: var(--pyszny-filtr-color-wanted);
    }
    ${pysznyFiltrUnwantedInput} {
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
      color: var(--pyszny-filtr-color-unwanted);
    }
    ${pysznyFiltrUnwantedInput}::placeholder {
      color: var(--pyszny-filtr-color-unwanted);
    }
    ${pysznyFiltrWantedInput}:focus,
    ${pysznyFiltrUnwantedInput}:focus {
      z-index: 2;
      position: relative;
    }

    /* showing how many meals fit the criteria */
    ${pysznyFiltrDiv}:before {
      content: attr(shown-meals);
      margin-right: 1em;
      font-size: 120%;
      background: white;
    }
`;

  function applyCss(rules) {
    let styleElem = document.createElement("style");
    styleElem.type = "text/css";
    if (styleElem.styleSheet) styleElem.styleSheet.cssText = rules;
    else styleElem.innerHTML = rules;
    document.head.appendChild(styleElem);
  }

  function insertDomBefore(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode)
  }

  function insertDomAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  class IngredientFilter {
    constructor(direction, placeholder) {
      this.direction = direction;
      this.placeholder = placeholder;
    }

    createInputElement() {
      let elem = document.createElement("input");
      elem.placeholder = this.placeholder;
      elem.classList.add("pyszny-filtr");
      elem.classList.add(this.direction);
      return elem;
    }

    get input() {
      if (this.inputElement == undefined) {
        this.inputElement = this.createInputElement();
      }
      return this.inputElement;
    }

    get value() {
      return this.input.value.split(/\s*,\s*/).filter(nonEmpty => nonEmpty).map(x => x.toLowerCase());
    }
  }

  class FiltersHolder {
    constructor() {
      this.meals = getMeals();
      this.wanted = new IngredientFilter("wanted", "chcę to, to, …");
      this.unwanted = new IngredientFilter("unwanted", "nie chcę, bleh, …");

      this.wanted.input.addEventListener("input", () => this.filter());
      this.unwanted.input.addEventListener("input", () => this.filter());
    }

    filter() {
      let shownMeals = 0;
      for (let meal of this.meals) {
        let ingredients = ((meal.querySelector(ingredientsDiv) || {}).textContent || "").toLowerCase();
        const show = this.wanted.value.every(item => ingredients.includes(item))
          && this.unwanted.value.every(item => !ingredients.includes(item));
        meal.style.display = (show ? "block" : "none");
        shownMeals += show;
      }
      this.infobox = shownMeals;
      hideEmptyCategories();
    }

    set infobox(shownMeals) {
      let text = "Filtr składników";
      if (shownMeals !== this.meals.length) {
        text = shownMeals + " z " + this.meals.length + " dań";
      }
      document.querySelector(pysznyFiltrDiv).setAttribute("shown-meals", text);
    }
  }

  function hideEmptyCategories() {
    let categories = document.querySelectorAll(categoryContainer);
    for (let category of categories) {
      let meals = Array.from(category.querySelectorAll(mealContainer));
      const show = meals.some(meal => meal.style.display === "block");
      category.style.display = (show ? "block" : "none");
    }
  }

  function addInputs() {
    let container = document.createElement("div");
    container.classList.add(pysznyFiltrClassName);
    container.setAttribute("shown-meals", "Filtr składników");
    insertDomBefore(container, document.querySelector(restaurantInfoButton));
    let filters = new FiltersHolder();
    container.appendChild(filters.wanted.input);
    container.appendChild(filters.unwanted.input);
  }

  function loadDefaultValues() { }

  function getMeals() {
    return document.querySelectorAll(mealContainer);
  }

  function run() {
    applyCss(cssRules);
    addInputs();
    loadDefaultValues();
  }

  function shouldRun() {
    return document.querySelector(pysznyFiltrDiv) === null;
  }

  function isInRestaurantMenuView() {
    return document.querySelector(restaurantInfoButton) !== null;
  }

  function init() {
    if (!shouldRun()) {
      return;
    }
    if (isInRestaurantMenuView()) {
      run();
    }
  }

  setInterval(() => init(), 1000);

})();
