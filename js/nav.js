"use strict";

/*******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents(); /* hides all forms and stories list- calling from main.js */
  putStoriesOnPage(); /*  function in stories.js that puts user's stories into a <ol> on the DOM */
}

// child selector specifies that the event handler should only be attached to this specific child element
// #nav-all is a <a> on top of site - once clicked it displays all stories and hides everything else- essentially a home page button
$body.on("click", "#nav-all", navAllStories);

/** Show story submit form on clicking story "submit" */

function navSubmitStoryClick(evt) {
  console.debug("navSubmitStoryClick", evt);
  hidePageComponents();
  $allStoriesList.show(); /* Shows in DOM all stories */
  $submitForm.show(); /* Then shows submit form for stories to be created. */
}

$navSubmitStory.on("click", navSubmitStoryClick);

/** Show favorite stories on click on "favorites" */

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  putFavoritesListOnPage(); /* function to put favorites on page */
}

$body.on("click", "#nav-favorites", navFavoritesClick);

/** Show My Stories on clicking "my stories" */

function navMyStories(evt) {
  console.debug("navMyStories", evt);
  hidePageComponents();
  putUserStoriesOnPage();
  $ownStories.show(); /* <ol> of user created stories */
}

$body.on("click", "#nav-my-stories", navMyStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show(); /* a form to log in */
  $signupForm.show(); /*  a form to sign up*/
}

$navLogin.on("click", navLoginClick);

/** Hide everything but profile on click on "profile" */

function navProfileClick(evt) {
  console.debug("navProfileClick", evt);
  hidePageComponents();
  $userProfile.show(); /* <section> tag that displays name,username, account created */
}

$navUserProfile.on("click", navProfileClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show(); /* show the <div> with all the nav links  */
  $navLogin.hide(); /* hide login button and show logout button beacuse there is now a user signed in. */
  $navLogOut.show();
  $navUserProfile
    .text(`${currentUser.username}`)
    .show(); /* the <a> tag that is empty in HTML- With JS we change the current text to the current User */
}
