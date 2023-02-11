"use strict";

// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $("body");

// all of these first 4 variables have a class of 'stories-list'
const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list"); /* <ol> of all stories */
const $favoritedStories =
  $("#favorited-stories"); /* <ol> of all favorited stories */
const $ownStories = $("#my-stories"); /* <ol> of all user created stories */

// selector that finds all three story lists-ie allstoriesList,favoritedStories,ownStories
const $storiesLists = $(".stories-list");

const $loginForm =
  $(
    "#login-form"
  ); /* loging form with username and password inputs plus a submit button */
const $signupForm = $("#signup-form"); /* Signup form with the same as above */

const $submitForm =
  $(
    "#submit-form"
  ); /* form for new submitted story- has input for title, author, and url */

const $navSubmitStory = $("#nav-submit-story"); /* <a> with submit */
const $navLogin = $("#nav-login"); /* <a> login/signup */
const $navUserProfile =
  $("#nav-user-profile"); /* empty <a> to be filled by the DOM later */
const $navLogOut = $("#nav-logout"); /* <a> with logout */

const $userProfile =
  $(
    "#user-profile"
  ); /* <section> for user profile which has name, username, password, acount created all in <div>s */

/*** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
  // save all the stories and forms
  const components = [
    $storiesLists,
    $submitForm,
    $loginForm,
    $signupForm,
    $userProfile,
  ];
  // taking components and looping through each one.
  // for each iteam in array- we run the jquery method of hide()
  // hide() ---- hides all lsited elements on screen . Can pass in a time for transistion. ex hide(1000)--hides everything in 1 s
  components.forEach((c) => c.hide());
}

/** Overall function to kick off the app. */

async function start() {
  console.debug("start");

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart(); /* get stories, removes loading msg, puts the stories on page */

  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
}

// Once the DOM is entirely loaded, begin the app

console.warn(
  "HEY STUDENT: This program sends many debug messages to" +
    " the console. If you don't see the message 'start' below this, you're not" +
    " seeing those helpful debug messages. In your browser console, click on" +
    " menu 'Default Levels' and add Verbose"
);
$(start);
