"use strict";

function detectFacebookLoginButton() {
  // Test for standard implementation (Example: Facebook Docs)
  const loginButton = document.querySelectorAll(".fb-login-button");
  for (let item of loginButton) {
    const fbcClassResetArr = ["fbc-overlay-small", "fbc-overlay"];
    const replacementClassArr = ["fbc-loginButton"];
    replacementClassArr.push("fbc-size-" + item.getAttribute("data-size"));
    replacementClassArr.push("fbc-button-type-" + item.getAttribute("data-button-type"));
    // Remove previous detection classes
    item.classList.remove(...fbcClassResetArr);
    // Add declared size values
    item.classList.add(...replacementClassArr);
    // Remeasure elements and add correct badge size
    item.classList.add(...itemWidthCheck(item));
  }
}

function itemWidthCheck (target) {
  const itemHeight = target.offsetHeight;
  const itemWidth = target.offsetWidth;
  const iconClassArr = ["fbc-overlay"];

  const ratioCheck = (itemWidth / itemHeight);

  if (ratioCheck < 1.1) {
    iconClassArr.push("fbc-overlay-small");
  } else if (itemHeight < 39) {
    iconClassArr.push("fbc-overlay-small");
  }
  return iconClassArr;
}

let htmlBadgeDiv;

function isFixed (elem) {
  do {
    if (getComputedStyle(elem).position == "fixed") return true;
  } while ( (elem = elem.offsetParent) );
  return false;
}


function addFacebookBadge(target, badgeClassUId){
  htmlBadgeDiv = document.createElement('div');
  htmlBadgeDiv.className = "fbc-badge " + badgeClassUId;
  document.body.appendChild(htmlBadgeDiv);

  const itemWidth = parseInt(target.offsetWidth,10);
  const itemHeight = parseInt(target.offsetHeight,10);

  console.log("isFixed: ", isFixed(target) );

  const ratioCheck = (itemWidth / itemHeight);
  let badgeSmallSwitch = false;

  if (ratioCheck < 1.1) {
    htmlBadgeDiv.classList.add("fbc-badge-small");
    badgeSmallSwitch = true;
  } else if (itemHeight < 39) {
    htmlBadgeDiv.classList.add("fbc-badge-small");
    badgeSmallSwitch = true;
  }

  positionFacebookBadge(target, badgeClassUId, itemWidth, badgeSmallSwitch);
}

function positionFacebookBadge( target, badgeClassUId, targetWidth, smallSwitch ) {

  // Check for Badge element and select it
  if (!badgeClassUId) {
    badgeClassUId = "js-" + target;
  }

  htmlBadgeDiv = document.querySelector("." + badgeClassUId);

  // Confirm target element is defined
  if ( target && typeof target === "object" ) {
    // TODO: Reverse IF Statement
  } else {
    target = document.querySelector("." + target);
  }

  // Set offset size based on large/small badge
  let elementSizeOffsetX = 20;
  let elementSizeOffsetY = 4;

  if ( typeof smallSwitch == "undefined" ) {
    if ( htmlBadgeDiv.classList.contains("fbc-badge-small") ) {
      smallSwitch = true;
    }
  }

  if (smallSwitch) {
    elementSizeOffsetX = 12;
    elementSizeOffsetY = 5;
  }

  // Define target element width
  if (!targetWidth) {
    targetWidth = parseInt(target.offsetWidth,10);
  }

  // Get position coordinates
  const bodyRect = document.body.getBoundingClientRect();
  const elemRect = target.getBoundingClientRect();

  let offsetPosX = elemRect.left - bodyRect.left;
  let offsetPosY = elemRect.top - bodyRect.top;

  if ( isFixed(target) ) {
    htmlBadgeDiv.classList.add("fbc-badge-fixed");
    offsetPosX = elemRect.left;
    offsetPosY = elemRect.top;
  } else {
    htmlBadgeDiv.classList.remove("fbc-badge-fixed");
  }

  const htmlBadgeDivPosX = (offsetPosX + targetWidth) - elementSizeOffsetX;
  const htmlBadgeDivPosY = offsetPosY - elementSizeOffsetY;

  // Set badge position based on target coordinates/size
  htmlBadgeDiv.style.left = htmlBadgeDivPosX + "px";
  htmlBadgeDiv.style.top = htmlBadgeDivPosY + "px";

}

// Use the following patterns to check for on-screen Facebook elements

const PATTERN_DETECTION_SELECTORS = [
  "[title*='Facebook']",
  "[title='Log in with Facebook']",
  "[class*='fb-login']",
  "[class*='FacebookConnectButton']",
  "[class*='facebook-connect-button']", // Twitch
  "[href*='facebook.com/share']", // Imgur Login
  "[href*='facebook.com/v2.3/dialog/oauth']", // Spotify
  "[href*='signin/facebook']",
  "[href*='facebook.com/dialog/share']",
  "[href*='facebook.com/sharer']", // Buzzfeed
  "[data-bfa-network*='facebook']",
  "[data-oauthserver*='facebook']", // Stackoverflow
  "[id*='facebook_connect_button']", // Quora
  "[aria-label*='Facebook']",
  "[aria-label*='share on facebook']", // MSN
  "[data-destination*='facebook']"
];

// List of badge-able in-page elements
const facebookDetectedElementsArr = [];

function detectFacebookOnPage () {

  for (let querySelector of PATTERN_DETECTION_SELECTORS) {
    for (let item of document.querySelectorAll(querySelector)) {
      // overlay the FBC icon badge on the item
      // TODO: Add fixed / fixed parent detection
      if ( !item.classList.contains("fbc-badged") ) {
        // console.log('true!');
        // item.classList.add(...itemWidthCheck(item));
        let itemUIDClassName = "fbc-badgeUID_" + (facebookDetectedElementsArr.length + 1);
        let itemUIDClassTarget = "js-" + itemUIDClassName;
        facebookDetectedElementsArr.push(itemUIDClassName);
        addFacebookBadge(item, itemUIDClassTarget);
        item.classList.add("fbc-badged");
        item.classList.add(itemUIDClassName);
        // console.log(...facebookDetectedElementsArr);

        item.addEventListener("click", (e) => {
          e.preventDefault();
          // addToolTipBlock(item);
          // browser.runtime.sendMessage("add-to-facebook-container");
        });
        item.addEventListener("mouseover", (e) => {
          e.preventDefault();
          addToolTipBlock(itemUIDClassName);
          // browser.runtime.sendMessage("add-to-facebook-container");
        });
      }

      // add click handler to addDomainToFBC and refresh

    }
  }
}


function addToolTipBlock(item) {
  // TODO: Make sure this only gets attached once per element
  // TODO: Make sure there's enough width on the right/bottom side of the element, or you have to drop it the other way.
  // On screen resize, dismiss the popup? (Or remap it to the element?)

  // console.log( item );
  const htmlModal = document.createElement('div');
  htmlModal.clasName = "fbc-toolTip";
  // htmlModal.classList.add("fbc-toolTip", targetClass);
  // htmlModal.dataset.selector = item;
  document.body.appendChild(htmlModal);

  const bodyRect = document.body.getBoundingClientRect();
  const elemRect = item.getBoundingClientRect();
  const itemPseudoStyle = window.getComputedStyle(item, ':after');
  // console.log(itemPseudoStyle);
  let offsetPosX   = elemRect.left - bodyRect.left;
  let offsetPosY   = elemRect.top - bodyRect.top;
  // console.log("Before: ", offsetPosY, offsetPosX);
  offsetPosY += parseInt(itemPseudoStyle.top,10);
  offsetPosX += parseInt(itemPseudoStyle.left,10);
  // console.log("After: ", offsetPosY, offsetPosX);
  const itemWidth = parseInt(itemPseudoStyle.width,10) + 8;
  const itemHeight = parseInt(itemPseudoStyle.height,10) * .5;
  const htmlModalPosX = offsetPosX + itemWidth;
  const htmlModalPosY = offsetPosY + itemHeight;

  // offsetX = offsetX + itemWidth;
  // console.log(htmlModalPos);

  // console.log("offset: ", htmlModalPosX, htmlModalPosY);
  htmlModal.style.left = htmlModalPosX + "px";
  htmlModal.style.top = htmlModalPosY + "px";

  // console.log(htmlBlock);

}

// Resize listener. Only fires after window stops resizing.
let resizeId;

window.addEventListener("resize", function() {
  clearTimeout(resizeId);
  resizeId = setTimeout(doneResizing, 25);
});

function doneResizing(){
  for (let item of facebookDetectedElementsArr) {
    positionFacebookBadge(item);
  }
}

// On Scroll, checking for position fixed on elements
let last_known_scroll_position = 0;
let ticking = false;

function doneScrolling() {
  for (let item of facebookDetectedElementsArr) {
    positionFacebookBadge(item);
    // console.log("scrollCheckInit");
    // let badgeClassUId = "js-" + item;
    // htmlBadgeDiv = document.querySelector("." + badgeClassUId);
    // if ( htmlBadgeDiv.classList.contains("fbc-badge-fixed") ) {
    //   positionFacebookBadge(item);
    // }
  }
}

window.addEventListener('scroll', function(e) {
  last_known_scroll_position = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(function() {
      doneScrolling(last_known_scroll_position);
      ticking = false;
    });

    ticking = true;
  }
});


browser.runtime.onMessage.addListener(message => {
  console.log("message from background script:", message);
  setTimeout( () => {
    detectFacebookOnPage();
    detectFacebookLoginButton();
  }, 10);
  return Promise.resolve({response: "content_script onMessage listener"});
});

setTimeout(detectFacebookOnPage, 150);
setTimeout(detectFacebookLoginButton, 150);
