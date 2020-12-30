# JavaScript Challenge

## Overview

In this assignment, you're given some dummy data about UFO sightings from 2010. The first goal is to use JavaScript to populate an HTML table from that data, and the second goal is to create form fields and use the inputs to filter the data and rebuild the table.

![ufo page screenshot](images/ufo-home.png)

## JavaScript

### Frameworks

When it came to frameworks, I decided to go with [Vanilla JS](http://vanilla-js.com/), because it's simple, fast, and comes pre-loaded on all web browsers. It can handle DOM traversal and manipulation, plus AJAX, which is all I really needed.

### Fetch API

Instead of loading the dummy data from a JS file, I converted it into JSON to make it a little more realistic, then used the Fetch API to retrieve it, used the json() method to extract the data, then cleaned it up a little by doing title and upper-casing where appropriate. I then chained a few more then() methods to call the function that builds the table, plus another function to populate the filter category dropdowns.

### Forms

Lastly, I built out a form that allows the user to filter by date range, city, state, country, and shape. There's an apply button of type="submit" and a clear button of type="reset". I then added event listeners to the form and gave them handlers. Each destroys the table, does logic to determine what data to put in the rebuilt table, and calls the original makeTable() function. And they have the preventDefault() method so that only the table refreshes, not the whole page.