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
    body { }
`;

    function applyCss(rules) {
        let styleElem = document.createElement("style");
        styleElem.type = "text/css";
        if (styleElem.styleSheet) styleElem.styleSheet.cssText = rules;
        else styleElem.innerHTML = rules;
        document.head.appendChild(styleElem);
    }

    function addInputs() {}

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
