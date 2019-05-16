
# SEN Consultant Website

## Testing
### Automated testing:
Automated testing using Jasmine was conducted of the numeracy-test calculator functions and objects.
The calculator is limited to three operators (+,- and *).
Calculator logic was tested manually ensuring multiplication function undertaken before subtraction and addition. e.g. 5 - 5 * 5 = -20
Error modals for numeracy test tested using Jasmine.
Other modal displays tested manually to ensure appropriately displaying with correct text.

### Manual testing undertaken for
#### Buttons:
    Main tab    - About, Data, Test and Schools - all link to correct landing pages for each tab       
                - On mobile screen size DISCOVER menu button appropriately shows/hides menu and changes button text.
                - Submit form and calendar booking - intentionally non-functional - to be implemented
    All tabs    - appropriately show/hide when clicked
    Data tab    - opens chart tab on Search click
    Test tab    - opens literacy/Numeracy/Memory test pages as appropriately
    Data/Test tabs - appropriately return to landing tabs on clicking 'back' buttons
    Test tabs   - OK buttons correctly start tests
    Data/Schools tabs - search and go buttons display map and chart results (or error modals) as expected
    
#### Links
All buttons and links tested to ensure correct targets. NB links to facebook, Youtube, and Twitter included but not implemented.<br>

#### Chart results
Initial tests were undertaken against small subsets of the main csv database to ensure postcodes were correctly filtered and correct number of results were generated
by comparing number of data entries against array length.
Various real and fake postcodes were entered to ensure error modal responded correctly
Chart results comapared against database entries to ensure correct reporting of data.
On introduction of main csv further testing was undertaken against random fake and real postcodes.
Test functions were implemented to print out to console JSON objects for crossfilter and dimension data to ensure correct data passed from csv to chart rendering.

#### Test results
Due to randomising test questions for all literacy, numeracy and memory tests automated testing was not possible accurately.
Manual testing undertaken to ensure results were marked correct/incorrect as appropriate and scores tallied correctly using console.log of appropriate variables.
The numeracy test, as well and checking through Jasmine, was verified using a calculator manually on questions on a random basis.
The literacy test is generated from a fixed database of questions although the order of the sentences is randomised. Positioning of words checked by undertaking literacy test manually
many times.
The memory test generated several issues during testing process, in particular paired icons being clicked on a second time generating a higher score,
and clicking on one already paired icon followed by non-paired leaving one unpaired icon remaining through test - issue by deactivating click function for
already paired icons.

#### Schools
Again initial tests were undertaken against small subsets of main csv database to ensure postcodes were correctly filtered and correct results returned.
Data shown for schools on maps and sidebar checked against random samples from CSV database to ensure correct data rows were returned.
On introduction of main csv further testing was undertaken against random fake and real postcodes.

### Mobile first design
Site tested using Google Developer Tools and screenfly (http://quirktools.com/screenfly), resizing viewport to various resolutions:<br>
 - Desktop - 1280x1024,
 - Galaxy S5 360x640, 
 - iPad - vertical 768x1024, 
 - iPad - horizontal 1024x768,
 - iPhone5 320x568,
 - iPhone7/6/8 375x667,
 - iPhoneX 375x812,
 - Laptop 1366x768

to ensure design responded appropriately.
NB data tab chart responsiveness while appearing correctly on tested screen sizes does not respond on changing screen size due to limitation of D3 charting.
Further due to limitations on smaller screens charts do not display well and desktop/laptop is recommended for viewing.

### External Feedback
After publishing to GitHub pages user feedback was requested and acted upon. Feedback included:
- Poor display on Laptop (1366x768)
- Renaming of tabs for better user understanding
- Buttons appearing offscreen
- Incorrect instructions for literacy test
- Relabelling buttons for better user experience and to avoid confusion
- Adding interpretation of results graph for tests