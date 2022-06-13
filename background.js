// function to identify a valid twitter profile page
function getProfileNameIfValidURL(url) {
    // https://twitter.com/mipsytipsy
    // https://twitter.com/_breeeeen_
    // https://twitter.com/77777666X

    const profileNameMatches = url.match(/https:\/\/twitter.com\/([\w\d\-]+$)/)
    if (profileNameMatches) {
        // first match is always the full URL
        return profileNameMatches[1]
    }

    return profileNameMatches
}