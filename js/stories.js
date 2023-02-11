"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove(); /* removes the loading message */

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 * - showDeleteBtn: show delete button?
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  // if a user is logged in, show favorite/not-favorite star
  const showStar =
    Boolean(
      currentUser
    ); /* Boolean() returns true or false based on currentUser status */

  // this is where we create new <li> elements to host the actual stories in them
  // we are going to create a <li> with the href set to the story URL- also when clicked the link will open in new tab
  // we are then going to give it a ID- display its hostname, author, and username
  // we are then going to add a delete button and a star next to the story
  return $(`
      <li id="${story.storyId}">
        ${showDeleteBtn ? getDeleteBtnHTML() : ""}
        ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Make delete button HTML for story */
// we are using a third party website 'fontawesome' to include a trash can ICON
function getDeleteBtnHTML() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}

/** Make favorite/not-favorite star for story */
// we are also using that same third party library to get a star ICON
// two options for star- either clicked(favorited) or not clicked(unfavorited)
function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty(); /* a <ol> of all stories */

  // loop through all of our stories and generate HTML for them
  // then append that to the allStoriesList on the main page

  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Handle deleting a story. */

async function deleteStory(evt) {
  console.debug("deleteStory");

  // .closest() finds the 1st element that matches the param- In this case find the closest <li>
  // it will be the closest <li> to the trashcan - because thats what our event listener is on
  const $closestLi = $(evt.target).closest("li");
  const storyId =
    $closestLi.attr("id"); /* we then grab that ID of that closest <li> */

  await storyList.removeStory(currentUser, storyId);

  // re-generate story list
  await putUserStoriesOnPage();
}

$ownStories.on("click", ".trash-can", deleteStory);

/** Handle submitting new story form. */

async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();

  // grab all info from form
  const title = $("#create-title").val(); /* input for title */
  const url = $("#create-url").val(); /* input for url */
  const author = $("#create-author").val(); /* input for author */
  const username = currentUser.username;
  const storyData = { title, url, author, username };

  const story = await storyList.addStory(currentUser, storyData);

  const $story =
    generateStoryMarkup(story); /* this is the HTML for the story */
  $allStoriesList.prepend(
    $story
  ); /* prepending this story first- so that it shows at top of page */

  // hide the form and reset it
  // slideUp()-- Hides the matched elements with a sliding motion- similar to hide()
  $submitForm.slideUp("slow");
  $submitForm.trigger("reset"); /* reset the inputs */
}

$submitForm.on("submit", submitNewStory);

/******************************************************************************
 * Functionality for list of user's own stories
 */

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $ownStories.empty(); /* <ol> of user created stories */

  // checking to see if the user has 0 of their own stories. If that is the case- append this html
  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added by user yet!</h5>");
  } else {
    // loop through all of users stories and generate HTML for them
    // then append that story to the <ol>
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }

  $ownStories.show();
}

/******************************************************************************
 * Functionality for favorites list and starr/un-starr a story
 */

/** Put favorites list on page. */

function putFavoritesListOnPage() {
  console.debug("putFavoritesListOnPage");

  $favoritedStories.empty(); /* <ol> of favorited stories*/

  // if there are 0 facorited stories we are going to append this HTML
  if (currentUser.favorites.length === 0) {
    $favoritedStories.append("<h5>No favorites added!</h5>");
  } else {
    // loop through all of users favorites and generate HTML for them
    // append the story to the <ol>
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }

  $favoritedStories.show();
}

/** Handle favorite/un-favorite a story */

async function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite");

  const $tgt = $(
    evt.target
  ); /* Where clicked-- we will be referring to the star icon here */
  const $closestLi =
    $tgt.closest(
      "li"
    ); /* again the closest <li> to the clicked target or in this case the closest <li> to the star */
  const storyId = $closestLi.attr("id"); /* grabbing that ID */
  const story = storyList.stories.find(
    (s) => s.storyId === storyId
  ); /* we then loop through our storyList to find an id that matches- and then set story */

  // see if the item is already favorited (checking by presence of star)
  if ($tgt.hasClass("fas")) {
    // currently a favorite: remove from user's fav list and change star
    // turn off favorite class
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    // currently not a favorite: do the opposite
    // turn on the favorite class
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}
// when we click on the star- run this function
$storiesLists.on("click", ".star", toggleStoryFavorite);
