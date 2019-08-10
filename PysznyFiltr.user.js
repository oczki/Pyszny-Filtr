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

    const restaurantInfoButton = "#menu-tab-content button.info.info-icon";

    const cssRules = `
    input.pyszny-filtr {
        border-right: 1px solid #ebebeb;
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

    function addWantedIngredientsInput() {
        let elem = document.createElement("input");
        elem.classList.add("pyszny-filtr");
        elem.classList.add("wanted");
        elem.addEventListener("input", function(event) {
                                           event.stopPropagation();
                                           filterByWanted();
                                       });
        insertDomBefore(elem, document.querySelector(restaurantInfoButton));
    }

    function addUnwantedIngredientsInput() {
        let elem = document.createElement("input");
        elem.classList.add("pyszny-filtr");
        elem.classList.add("unwanted");
        elem.addEventListener("input", function(event) {
                                           event.stopPropagation();
                                           filterByUnwanted();
                                       });
        insertDomBefore(elem, document.querySelector(restaurantInfoButton));
    }

    function addInputs() {
        addUnwantedIngredientsInput();
        addWantedIngredientsInput();
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
