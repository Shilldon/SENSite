# SEN Consultant Website

## Overview

### Brief
This website was created from a brief provided by a fictional Special Educational Needs (SEN) Consultant, Anne Trainer.

Anne's objectives are to:<br>
1 - provide a web presence to her existing and clients on a single page;<br>
2 - despite limiting site to one page to provide several different experiences/information for clients;<br>
3 - attract new clients;<br>
4 - briefly showcase the services offered;<br>
5 - provide data to actual and potential clients on schools local to their area or nationally to help them identify a school suitable for their child;<br>
6 - provide information on schools size, SEN offering, pupil ratios, funding types, and Ofted ratings from national government database;<br>
7 - enable clients, to an extent, self-diagnose learning difficulties in the areas of literacy, numeracy and memory;<br>
8 - show locations of and information about schools locally and nationally to actual and potential clients and provide links to those schools; 
9 - maintain consistent branding across the webpage;<br>
10 - keep actual and potential clients on the site by offering an interactive experience; <br>
11 - enable actual and potential clients to easily contact her with bookings or enquiries;<br>
12 - link to her social media (Facebook, Twitter and Youtube)

### User Stories
As well as accommodating Anne's objectives consideration has been given to the needs of prospective users of the website:

#### Clients
- I would like to:
    - contact Anne for information<br>
    - book a consultancy appointment<br>
    - check Anne's availability for an appointment<br>
    - understand if I have actual or potential SENs<br>
    - locate schools suitable for my SENs<br>
    - find information about schools (location, funding, schools size, ofsted rating) to see whether they would be appropriate for me<br>

#### Potential Clients 
- I would like to:
    - understand what services are offered by Anne<br>
    - easily make contact with Anne<br>
    - ask the band a question about their music<br>

#### Referrers
- I would like to 
    - understand Anne's services<br>
    - see her qualifications<br>
    - easily make contact with Anne<br>

### Purpose
This website is designed as an interactive front-end only website to achieve the above, in a style unique to Anne's brand. The site contains one page with 4 drop down tabs, each of which can be accessed from a central animated menu bar that indicates clearly with drop down arrow which current tab is open. When all tabs are closed a contact form is automatically shown achieving Anne's objective of encouraging actual and potential clients to make contact.<br>
Each of the tabs centres of one of Anne's main objectives:

- About tab - contact information, services offered and qualifications.
- School Data tab - enables clients to search schools by postcode and shows by use of charts information about schools in the chosen postcode:<br>
  - School sizes
  - Pupil gender ratios
  - SEN support offered
  - Ofsted Rating
  - Number of schools in area of specific educational phase - to understand the cachement area
  - Pupil density per funding type - to understand the relative wealth of the area 
- Test tab - Enables clients to test their literacy, numeracy and memory skills in three simple tests displaying their results against the national average in a chart.
- School Map tab - Enables clients to search against postcodes for local schools returning (from local government downloaded CSV):
  - School name
  - Contact details
  - Head teacher information
  - Website link
  - Ofsted Rating
  - SENs supported

### Style
Anne's branding empahsises purple colouring. A gradiated purple hue is used throughout the site with subtle colour differences for each different tab from dark purple (About Tab) to light purple (Schools tab).<br>
Animated tabs and (on desktop) landing page logos brings life to the page.<br>
Image backdrops are used for the top part of the page to clearly identify the current tab displayed.<br>
Anne's company logo (Sparkle Pix Consultancy) is prominently displayed at the top of the page for each tab.<br>
Converse to the purple brand throughout orange icons are used in the memory test to make the icons more prominent.<br>
The background and font colours are off-white throughout. SEN studies have show it is easier for those with SENs to focus on screen text if the contrast between back and foreground color is reduced.<br> 
The site is likely to be accessed by individuals with SENs and, therefore, large easily identified buttons have been used throughout.<br>

### How does it work?
The site is styled using **Bootstrap 3.3.7**.<br>
**Javascript** and **jquery** used to implement major features of site:<br>
Menu animations<br>
Button functionality<br>
Data processing from external APIs and local csv<br>
Educational Tests - Memory, literacy and numeracy<br>
Rendering of charts<br>


## Features

### Existing 
- Branded style;
- Animated landing page;
- Animated tabs and buttons;
- Interactive graphical display in charts of information from local schools database;
- Interactive tests of literacy, numeracy and memory;
- Interactive map search using Google Maps API for local schools;
- Map logos styled to match with brand;
- Responsive page design for different screen sizes;
- Tooltips for SEN icons;
- Graphical display of school Ofsted ratings;
- Animated icons with links to social media.

### Features Left To Implement
- Email submission of contact form;
- Link to calendar for booking appointments

### Potential Features
- Included on the page is a button to link to Anne's appointment calendar. Such calendar does not yet exist and would need to be implemented
- Submit button for contact form is implemented but does not submit as email contact information for Anne does not yet exist.
- Additional tab with a blog

## Tech Information
- Languages used:
    - HTML
    - Javascript
    - jquery
    - SCSS

## Testing
Code was written through the Cloud9 IDE.
The website has been tested on IE, Google Chrome, Safari and Opera browsers.
See additional document for specific testing undertaken.

## Initial Wireframes
Wireframes were designed using MarvelApp and can be located here:<br>
https://marvelapp.com/af24fga 

## Deployment
A repository was created through the GitHub console under folder SENSite.<br>
The project, develoeped through the Cloud9 IDE was then commited to the GitHub repository using standard bash commit and push commands.<br>
Commits were made at each major development stage or as issues were identified and fixed.<br>
The project was then deployed to GitHub pages through the GitHub online console using the following steps:<br>
- Through the console settings tab the master branch was set to the default branch<br>
- The master branch was then selected as the source for GitHub pages and the settings saved<br>

To edit/run the code locally it is necessary to pull the code from the GitHub repository. This can be achieved through the GitHub console using the following steps: 
- Navigate to the main page of the repository
- Click 'clone/download' under the repository name
- To clone with HTTPS click the copy icon to copy the URL for the repository
- Locally open Git Bash and navigate the working directory to the location where the repository should be cloned
- Use the git clone command and paste the cloned URL.
<br>
- Alternatively, directly through Git Bash type the command:<br>
      $git clone https://github/Shilldon/SENSite.git

There are no differences between the development and deployed versions.<br>
Other than a standard browser no further software or implementation is required and a link is provided on GitHub Pages.<br>

## Credits

### Media
#### Logo:<br>
Sparkle image - https://svgsilh.com/image/1076611.html. This image is released under Creative Commons licence CC0 - https://creativecommons.org/publicdomain/zero/1.0/deed.en
#### Backdrop Images:<br>
Landing page - children playing - https://commons.wikimedia.org/wiki/File:Children_playing_at_Children%27s_Book_Festival_(40285498720).jpg<br>
About Tab - blackboard image - https://www.pexels.com/photo/ascent-blackboard-board-business-162560/<br>
Data Tab - cubes image - https://pixabay.com/en/cubes-assorted-random-toys-677092/<br>
Test Tab - book image - https://pxhere.com/en/photo/1214676<br>
Schools Tab - school sign - http://www.picpedia.org/highway-signs/s/school.html - This image is licensed by R M Media Ltd under a Creative Commons Attribution-ShareAlike licence (Creative Commons 3 - CC BY-SA 3.0). The original image is available on http://alphastockimages.com/ . The original author is Nick Youngson - http://www.nyphotographic.com/<br>
#### Test Tab Images:<br>
Literacy and Numeracy - Tick - https://pixabay.com/en/check-mark-tick-mark-check-correct-1292787/<br>
Literacy and Numeracy - Cross - https://www.maxpixel.net/Remove-Incorrect-Symbol-Sign-Red-Delete-Cancel-294245<br>
Memory - Icons - https://pixabay.com/vectors/icons-transportation-computer-156784/<br>
#### Schools Tab Images:<br>
Map - Ofsted star rating - https://commons.wikimedia.org/wiki/File:Star_rating_1_of_5.png<br>
#### Data tab:<br>
Loading gif - https://en.wikipedia.org/wiki/File:InternetSlowdown_Day.gif<br>

### Code
#### Individual functions:
- Function to colour bars in charts in data tab based on:
  - https://gist.github.com/renancouto/4675192 
- Shuffle array function based on:
  - https://github.com/coolaj86/knuth-shuffle

#### Libraries:
Chart processing:
- dimensional charting - https://d3js.org/

Dataset processing and dimension filtering:
- crossfilter - https://square.github.io/crossfilter/
- dc - https://dc-js.github.io/dc.js/

Automatic testing:
- Jasmine - https://jasmine.github.io/

### APIs
Postcode geographic information - https://api.postcodes.io/postcodes<br>
Maps - https://developers.google.com/maps/documentation/

### School Information
Local csv database - Adapted from https://get-information-schools.service.gov.uk/Downloads

### Fonts/Icons
Google Fonts - [fonts.google.com](fonts.google.com)<br>
Font Awesome - https://fontawesome.com/v4.7.0/icons/<br>

### Framework
Bootstrap v3.3.7 - https://getbootstrap.com/<br>

