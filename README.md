# JavaScript Challenge

## Overview

In this assignment, you're given some dummy data about UFO sightings from 2010. There are 2 main goals: first, use JavaScript to populate an HTML table from the data; and second, create a form with some filter options (date, city, UFO shape, etc) and implement event listeners/handlers to selectively rebuild the table.

The final result looks something like this:

![ufo page screenshot](images/ufo-home.png)

## Part 1 - Creating the Table

### HTML

The actual `index.html` file has a navbar (for display purposes only), a hero (or jumbotron in Bootstrap lingo), and a footer. In between, there are 2 columns: The filter form and the table.

To start out with, the table only has a `<thead>` element filled out with column names and an empty `<tbody>` element. The form has 2 `<input>` elements for start and end date with no initial values, and 4 `<select>` elements for city, state, country, and shape that each only have a single `<option>` tag with the category name, but no value.

All the rows in the table body, the initial values for start and end date, and the options in the category dropdowns get populated using JavaScript.

### JavaScript

When `app.js` loads, the first thing it needs to do is get the data before it can start building DOM elements with.

When it came to frameworks, I decided to go with [Vanilla JS](http://vanilla-js.com/), because it's simple, fast, and comes pre-loaded on all web browsers. It can handle DOM traversal and manipulation, plus AJAX, which is all I really needed. (Yes, I'm being tongue-in-cheek.)

### Fetch API

Instead of loading the dummy data from a JS file, I converted it into JSON to make it a little more realistic, then used the Fetch API to retrieve it. It's a simple promise-based interface for making web requests, and it's native to ES6.

Fetch gets called as soon as the script loads. Once the promise is fulfilled, it gets passed through a pipeline of `then()` methods, starting with `res => res.json()` to extract the JSON data and returns it as an array of POJOs.

### Cleaning the data

The first custom callback in the pipeline is `cleanData`, which upper-cases the state and country codes and title-cases cities and shapes for presentational purposes.

Upper-casing is easy, since JavaScript strings have a `toUpperCase` method. But unlike Python, there's no built-in method to convert a string to title case, so `cleanData` contains a custom nested function:

```
function toTitleCase(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
}
```

It then maps over the data to do the cleaning. The supplied callback function first destructures the sighting object:

```
let {
    datetime,
    city,
    state,
    country,
    shape,
    durationMinutes,
    comments,
} = sighting;
```

This isn't necessary, it just makes it easier to deal with in the return statement, where the actual cleaning occurs:

```
return {
    datetime,
    city: toTitleCase(city),
    state: state.toUpperCase(),
    country: country.toUpperCase(),
    shape: toTitleCase(shape),
    durationMinutes,
    comments,
};
```

As you can see, by destructuring I no longer need to write `sighting.city`, `sighting.country`, etc, and I also don't need to write `datetime: datetime`. (JavaScript has a ton of cool shorthands like this, and using them makes your code more _JavaScriptic_, to steal a term from Python.)

Finally, it assigns the resulting array of cleaned data to the global `jsonData` variable so it can be accessed later by the `applyFilters` and `clearFilters` functions, then returns it so it can be used by the next callback in the pipeline.

### Creating the table

The next callback in the pipeline is `makeTable`, which runs a `forEach` loop that calls `makeRow` on each UFO sighting.

`makeRow` takes in the sighting object, as well as its index in the data array. First it creates a `<tr>` element and adds a `<th>` element with `index + 1` as its `innerHTML` to add some helpful row numbering. Next, it runs a `forEach` loop on an array of all the column keys:

```
["datetime", "city", "state", "country", "shape", durationMinutes", "comments"].forEach((column) => {...})
```

Each iteration creates a `<td>` element, sets its `innerHTML` to the value in the sighting object, and appends it to the `<tr>`. Once it's looped through all the columns, it returns the `<tr>`.

As it loops through, `makeTable` appends each returned `<tr>` to the `<tbody>` element. Finally, it returns the data so it can be passed to the next callback in the pipeline.

### Populating date input initial values

The final 2 callbacks use the data to set initial values and options for the filter form.

The first is `setStartEndDates`, which sets the initial values of the start and end date inputs to the earliest and latest dates in the dataset, respectively. I put this in because the dataset only covers the first 2 weeks of 2010, whereas the datepicker will default to the current day. In terms of user experience, having to go change the year and month every time is tedious.

In order to do this, `setStartEndDates` takes in the data, then maps it to an array of sighting dates as JavaScript `Date` objects:

```
const dates = data.map((sighting) => new Date(sighting.datetime));
```

It then finds the min and max dates and converts them into an ISO string, then slices them to just get the date part:

```
const minDate = new Date(Math.min.apply(null, dates))
    .toISOString()
    .slice(0, 10);
```

That spits out the date string formatted as `'YYYY-MM-DD'`, which is the exact (and only) format HTML date inputs will accept as a value. It then sets the values of the start and end date inputs to `minDate` and `maxDate`, respectively, and once again returns the data.

### Populating the dropdown menus

The final callback is `makeDropdowns`, which populates the dropdowns in the filter form for the 4 categories (city, state, country, and shape).

First, it needs to find all the unique values in the dataset. It runs a `forEach` loop on an array of the 4 categories:

```
["city", "state", "country", "shape"].forEach((category) => {...})
```

Each iteration maps the dataset to get an array of all values for that category. To get unique values, it passes the array into the `Set` constructor, then uses the spread operator to convert the set back to an array:

```
[...new Set(data.map((sighting) => sighting[category]))]
```

It then passes each array of unique values into the `makeDropdown` function, along with the ID of their target `<select>` element.

That function gets the `<select>` element by ID, then runs a `forEach` loop that creates an `<option>` element for each choice, sets its `value` and `innerHTML`, and appends it to the `<select>` element.

## Part 2 - Dispatch, Listen, Handle, Filter, Rebuild

### Event listening and handling

At the bottom of the form, there are 2 buttons:

```
<button type="submit">Apply</button>
...
<button type="reset">Clear</button>
```

Instead of attaching `click` handlers to the buttons themselves, I just gave them a `type` attribute to tell them what kind of event to dispatch. They don't care what those events do - instead, all the real logic is handled by their grandparent `<form>` element, where the event listeners are attached:

```
const filterForm = document.getElementById("filterForm");
filterForm.addEventListener("submit", applyFilters);
filterForm.addEventListener("reset", clearFilters);
```

When a user clicks on a button, the event bubbles up to the `<form>` element, and when one of those listeners hears an event with the matching type, it fires its respective handler function.

It's important to stop the event from bubbling up any further, because if it reaches the top level of the DOM, it triggers an unwanted page refresh. To do that, both handler functions take in the event as an argument and call its `preventDefault()` method to stop it dead in its tracks.

### Applying the filters

The `applyFilters` function isn't super elegant, but it works. First, it creates a shallow copy of the global `jsonData` array using a spread operator and assigns it to a variable called `filteredData`.

Next, it loops over the 4 dropdown categories and checks to see if its `<select>` element has a value, and if it does, it filters `filteredData` to find matches, then reassigns `filteredData` to the returned array and moves on to the next category. (I specifically used `let` to declare `filteredData` so I could keep reassigning it.)

For the date range, it takes the value from each date input and passes it into the `Date` constructor, then does the same for each sighting date inside the filter loop and returns a simple conditional:

```
filteredData = filteredData.filter((sighting) => {
    const sightingDate = new Date(sighting.datetime);
    return sightingDate >= startDate &&
            sightingDate <= endDate;
});
```

However, I noticed a slight bug where the returned data was not inclusive of the end date, even though I used `<=`, so to get around this I added a day to `endDate`:

```
endDate.setDate(endDate.getDate() + 1);
```

At this point, all the user's filters have been applied. The last line of `applyFilters` calls the `rebuildTable` function and passes it `filteredData`.

### Rebuilding the table

The `rebuildTable` function does 2 things: First, it loops through the table body using a `while` loop, which keeps removing its children (ie, the `<tr>` elements) until there are none left:

```
const tbody = document.getElementById("tbody");
while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
}
```

Second, it calls `makeTable` and passes it whatever data was initially passed to it.

### Clearing the filters

I also gave the user the option to clear all filters, which was fairly easy to implement.

The `clearFilters` function loops over an array of IDs for all the `<select>` elements and sets their value to an empty string. Then to reset the date inputs, it calls `setStartEndDates` and passes it the original `jsonData` array. Finally, it calls `rebuildTable`, again passing it `jsonData`.

## Summary

There are probably more than a few not-so-best practices in here, but one of the nice things about a small project like this is you're a little more free to experiment. And when you don't use any frameworks - especially the bigger ones like React or Vue - you don't have that layer of abstraction over what JavaScript is doing, which forces you to think more carefully to be economical.

It's also nice to come back to JavaScript, the first language I really learned. People often don't appreciate how much there is to like about it, so I tried to showcase a few of my favorites. If you have any questions or suggestions, feel free to reach out.

Cheers.
