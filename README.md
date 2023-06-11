![twitter-profile-search-logo](gosearch.png)

Twitter Profile Search does exactly what it implies. It brings the profile search button to Twitter web, which has always been there on Twitter mobile.

I think the feature is useful, hope you find value!

### Working

The Chrome extension gets triggered when a Twitter user profile page gets opened. It adds an extra search button to the **top right** of the profile area. The behaviour is intended to be same as on mobile.

### Get going

#### Chrome Web Store
[![ChromeWebStore](https://i.imgur.com/Yns6w2k.png)](https://chrome.google.com/webstore/detail/twitter-profile-search/gpogcjnlbgnmjofdlkegafcnnplddmnh)

#### Build from source
- Download as ZIP
- Load as unpackaged extension

### Improvements

- [x] The process of building the search button starts 2s after the page is loaded. We can do better by waiting till the DOM is loaded, instead of the arbitrary *2s*.
- [ ] The search button is not clearly visible at all times - especially when there's a bright colour in the header image. Having a dynamically adjusted contrast should be better.
