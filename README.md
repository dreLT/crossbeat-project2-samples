# Code from PRoPS project at CrossbeatNY  
Included here are code samples from ___________, a project I worked on at _____________

## Profile Page
Details a user's profile and creative pieces:  

HTML - `public/scripts/templates/profile-view.hbs`, `public/scripts/templates/profile-portfolio-piece.hbs`, `public/scripts/templates/profile-user-blurb.hbs`, `public/scripts/templates/profile-footer.hbs`  
SASS - `public/styles/pages/_profile.scss`

## Settings Page 
The app's user settings page:  

HTML - `public/scripts/templates/settings-view.hbs`  
SASS - `public/styles/pages/_settings.scss`

## Responsification of Homepage Grid Feed  

SASS - `public/styles/pages/_feed.scss` lines 697-972

## Bookmarks Page
Lists other users' pieces the user has bookmarked:  

HTML - `public/scripts/templates/bookmark-list.hbs`  
SASS - `public/styles/pages/_profile.scss`  

## Custom JS for limiting display of specific data on homepage grid feed items  

JS - `public/scripts/views/feed-content-view.js`  
Lines 48-49  
Prevent tags number over 10 to appear in the List View (click on list view icon in top right corner of homepage feed)  

Lines 66-76  
Apply ellipses to piece titles if characters number greater than 13 without spaces
