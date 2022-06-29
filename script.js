const PROFILE_PANEL_CLASS = "css-1dbjc4n r-1habvwh r-18u37iz r-1w6e6rj r-1wtj0ep"
const HEADER_PANEL_CLASS = "css-1dbjc4n r-1p0dtai r-1mlwlqe r-1d2f490 r-1udh08x r-u8s1d r-zchlnj r-ipm5af r-417010"
const BLANK_HEADER_PANEL_CLASS = "r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-ipm5af r-13qz1uu"
const SEARCH_INPUT_ATTRIBUTE = "SearchBox_Search_Input_label"

// transparent background for search button
const WHITE_BACKGROUND_COLOR = "rgba(0, 0, 0, 0)"
const TRANSPARENT_BACKGROUND_COLOR = "rgb(255 255 255 / 0%)"

// function to identify a valid twitter profile page
function getProfileNameIfValidURL(url) {
    // https://twitter.com/mipsytipsy
    // https://twitter.com/_breeeeen_
    // https://twitter.com/77777666X

    const profileNameMatches = url.match(/https:\/\/twitter.com\/([\w\d\-]+$)/)
    if (profileNameMatches && profileNameMatches.length > 1) {
        // first match is always the full URL   
        // and second the profile username
        return profileNameMatches[1]
    }

    return ""
}

function getHeaderPhotoRelativeURL(username) {
    return `/${username}/header_photo`
}

function getSearchPageURL(username) {
    let searchResultsURL = `https://twitter.com/search?q=from:@${username} &f=top`
    return encodeURI(searchResultsURL)
}

function getSearchSVG() {
    let searchIconIdentifier = `[data-testid="${SEARCH_INPUT_ATTRIBUTE}"]`
    // the search box constitutes of (svg) div and (input box) div
    return document.querySelectorAll(searchIconIdentifier)[0].children[0].children[0].cloneNode(true)
}

function styleAndFunctionalizeSearchButton(searchButton, username) {
    const searchSVG = getSearchSVG()

    // replace the icon in-place
    searchButton.children[0].children[0].replaceWith(searchSVG)

    // set background color
    searchButton.style.backgroundColor = WHITE_BACKGROUND_COLOR

    // nevertheless this is required only in case of self-profiles where there is a white border
    searchButton.style.borderColor = TRANSPARENT_BACKGROUND_COLOR

    // remove existing onClick actions
    searchButton.removeAttribute('data-testid')

    // build the search URL and take there upon click
    const searchPageURL = getSearchPageURL(username)
    searchButton.addEventListener("click", function (event) {
        event.preventDefault()
        window.location.assign(searchPageURL)
    });
}

function cloneProfilePanelToHeader(username) {
    let profilePanelLookalikes = document.getElementsByClassName(PROFILE_PANEL_CLASS)

    if (profilePanelLookalikes.length == 0) {
        return null
    }

    const profilePanelClone = profilePanelLookalikes[0].cloneNode(true)

    let headerPhotoUrl = getHeaderPhotoRelativeURL(username)
    let baseHeaderPanelIdentifier = `[href="${headerPhotoUrl}"]`


    // locate the header panel base div, and append the profile panel clone to it
    let headerArea = document.querySelectorAll(baseHeaderPanelIdentifier)
    let headerPanel = null;

    if (headerArea.length == 0) {
        // case of blank header-photo profiles
        headerArea = document.querySelectorAll('[aria-label="Home timeline"]')
        headerPanel = headerArea[0].getElementsByClassName(BLANK_HEADER_PANEL_CLASS)[0]
    } else {
        headerPanel = headerArea[0].getElementsByClassName(HEADER_PANEL_CLASS)[0]
    }

    headerPanel.appendChild(profilePanelClone)

    return headerPanel
}

function transformItemsInHeaderPanel(headerPanel, username) {
    const headerActionPanel = headerPanel.getElementsByClassName(PROFILE_PANEL_CLASS)[0]

    // hide the profile picture (first) item
    headerActionPanel.children[0].style.visibility = "hidden"

    let actionButtons = headerActionPanel.children[1].querySelectorAll('[role="button"]')

    // handle self-profile case
    if (actionButtons.length == 0) {
        actionButtons = headerActionPanel.children[1].querySelectorAll('[data-testid="editProfileButton"]')
    }

    // mark all but last action button as completely hidden
    for (let i = 0; i < actionButtons.length - 1; i++) {
        actionButtons[i].style.display = "none"
    }

    let toBeSearchButton = actionButtons[actionButtons.length - 1]
    styleAndFunctionalizeSearchButton(toBeSearchButton, username)
}

function act(currentURL) {
    const username = getProfileNameIfValidURL(currentURL)
    // null check

    let headerPanel = cloneProfilePanelToHeader(username)
    if (headerPanel == null) {
        return
    }
    transformItemsInHeaderPanel(headerPanel, username)
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === 'BUILD_TWITTER_PROFILE_SEARCH') {
            window.setTimeout(function () {
                act(request.url)
            }, 2000) // TODO: trigger this only after page completely loads
        }
    });
