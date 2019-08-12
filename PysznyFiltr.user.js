// ==UserScript==
// @name         PyszneplFilter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Filtr na Pysznepl
// @author       fri
// @match        https://www.pyszne.pl/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const infoAndFav = "#menu-tab-content .info-and-fav";
    const restaurantInfoButton = infoAndFav + " button.info.info-icon";
    const restaurantFavButton = infoAndFav + " button.fav.favorite-icon";
    const pysznyFiltrDiv = infoAndFav + " div.pyszny-filtr";
    const pysznyFiltrWantedInput = pysznyFiltrDiv + " input.wanted";
    const pysznyFiltrUnwantedInput = pysznyFiltrDiv + " input.unwanted";

    const mealContainer = "div.meal-container";
    const ingredientsDiv = "div.meal__description-additional-info";

    const cssRules = `
    ${infoAndFav} {
        border: none;
    }
    ${restaurantInfoButton} {
        border: 1px solid #ebebeb;
        border-top-left-radius: 2px;
        border-bottom-left-radius: 2px;
        margin: 0 -1px 0 5px;
        height: 48px;
    }
    ${restaurantFavButton} {
        border: 1px solid #ebebeb;
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;
        height: 48px;
    }
    ${pysznyFiltrDiv} input {
        border: 1px solid #ebebeb;
        width: 150px;
        height: 48px;
        font-size: 120%;
        padding: 5px;
    }
    ${pysznyFiltrDiv} input:first-child {
        margin-right: -1px;
        border-top-left-radius: 2px;
        border-bottom-left-radius: 2px;
    }
    ${pysznyFiltrDiv} input:last-child {
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;
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
        constructor(direction, callback) {
            this.direction = direction;
            this.callback = callback;
        }

        createInputElement() {
            let elem = document.createElement("input");
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
            return this.input.value.split(/\s*,\s*/).filter(nonEmpty => nonEmpty);
        }
    }

    class FiltersHolder {
        constructor() {
            this.meals = getMeals();
            this.wanted = new IngredientFilter("wanted");
            this.unwanted = new IngredientFilter("unwanted");

            this.wanted.input.addEventListener("input", () => this.filter());
            this.unwanted.input.addEventListener("input", () => this.filter());
        }

        filter() {
            let wanted = this.wanted.value;
            let unwanted = this.unwanted.value;

            for (let meal of this.meals) {
                let ingredients = (meal.querySelector(ingredientsDiv) || {}).textContent || "";
                const show = wanted.every(ingredient => ingredients.includes(ingredient))
                          && unwanted.every(ingredient => !ingredients.includes(ingredient));
                meal.style.display = (show ? "block" : "none");
            }
        }
    }

    function addInputs() {
        let container = document.createElement("div");
        container.classList.add("pyszny-filtr");
        insertDomBefore(container, document.querySelector(restaurantInfoButton));
        let filters = new FiltersHolder();
        container.appendChild(filters.wanted.input);
        container.appendChild(filters.unwanted.input);
    }

    function loadDefaultValues() {}

    function getMeals() {
        return document.querySelectorAll(mealContainer);
    }

    function run() {
        applyCss(cssRules);
        addInputs();
        loadDefaultValues();
    }

    function isInRestaurantMenuView() {
        return document.querySelector(restaurantInfoButton) !== null;
    }

    if (isInRestaurantMenuView()) run();

})();
