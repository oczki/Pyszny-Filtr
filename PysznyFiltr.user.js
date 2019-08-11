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

    const mealContainer = "div.meal_container";
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

    function filterByWanted() {}

    function filterByUnwanted() {}

    function createWantedIngredientsInput() {
        let elem = document.createElement("input");
        elem.classList.add("pyszny-filtr");
        elem.classList.add("wanted");
        elem.addEventListener("input", function(event) {
                                           event.stopPropagation();
                                           filterByWanted();
                                       });
        return elem;
    }

    function createUnwantedIngredientsInput() {
        let elem = document.createElement("input");
        elem.classList.add("pyszny-filtr");
        elem.classList.add("unwanted");
        elem.addEventListener("input", function(event) {
                                           event.stopPropagation();
                                           filterByUnwanted();
                                       });
        return elem;
    }

    function addInputs() {
        let container = document.createElement("div");
        container.classList.add("pyszny-filtr");
        insertDomBefore(container, document.querySelector(restaurantInfoButton));
        container.appendChild(createWantedIngredientsInput());
        container.appendChild(createUnwantedIngredientsInput());
    }

    function loadDefaultValues() {}

    function startFiltering() {}

    function run() {
        applyCss(cssRules);
        addInputs();
        loadDefaultValues();
        startFiltering();
    }

    function isInRestaurantMenuView() {
        return document.querySelector(restaurantInfoButton) !== null;
    }

    if (isInRestaurantMenuView()) run();

})();
