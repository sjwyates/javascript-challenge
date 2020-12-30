# JavaScript Challenge

## Overview

In this assignment, you're given some dummy data about UFO sightings from 2010. The assignment has 2 parts: first, use JavaScript to populate an HTML table from that data; and second, create a form with some filter options (date, city, UFO shape, etc) and implement event listeners/handlers to selectively rebuild the table.

![ufo page screenshot](images/ufo-home.png)

When it came to frameworks, I decided to go with [Vanilla JS](http://vanilla-js.com/), because it's simple, fast, and comes pre-loaded on all web browsers. It can handle DOM traversal and manipulation, plus AJAX, which is all I really needed.

## Part 1 - Creating the Table

### Fetching and cleaning the data

Instead of loading the dummy data from a JS file, I converted it into JSON to make it a little more realistic, then used the Fetch API to retrieve it. Once the promise is fulfilled, it gets passed through a pipeline of `then()` methods.

First, `res => res.json()` extracts the JSON data and returns it as a POJO, then `cleanData` returns a mapped array with upper-cased the state and country codes and title-cased cities and shapes. (It also assigns the array to the global `jsonData` variable so it can be accessed later by the `applyFilters` and `clearFilters` functions.)

### Creating the table

The next callback in the promise pipeline is `makeTable`, which runs a `forEach` loop that calls `makeRow` on each UFO sighting. That function creates a `<tr>` element, then runs a `forEach` loop on an array of all the column keys:

```
["datetime", "city", "state", "country", "shape", durationMinutes", "comments"].forEach()
```

Each iteration creates a `<td>` element, sets its `innerHTML` to the value in the sighting object, and appends it to the `<tr>`. Once it's looped through all the columns, it returns the `<tr>`.

Finally, `makeTable` appends each returned `<tr>` to the `<tbody>` element, then returns the data so it can be passed to the final callback in the pipeline.

## Part 2 - Listen, Handle, Filter, Rebuild

### Populating the dropdown menus

Picking up where we left off in part 1, the last callback is `makeDropdowns`, which populates the dropdowns in the filter form for the 4 categories (city, state, country, and shape).

First, it needs to find all the unique values in the dataset. It runs a `forEach` loop on an array of the 4 categories:

```
["city", "state", "country", "shape"].forEach()
```

Each iteration maps the dataset to get an array of all values for that category. To get unique values, it passes the array into the `Set` constructor, then uses the spread operator to convert the set back to an array:

```
[...new Set(data.map((sighting) => sighting[category]))]
```

It then passes each array of unique values into the `makeDropdown` function, along with the id of their target `<select>` element.

That function gets the `<select>` element by ID, then runs a `forEach` loop that creates an `<option>` element for each choice, sets its `value` and `innerHTML`, and appends it to the `<select>` element.

### The filter form

In addition to those 4 category dropdowns, the filter form contains 2 `<input>` elements of `type="date"` so the user can choose a start and end date. I didn't implement anything custom for this, I just left it up to the browser's native date picker. Because all the data is from January 2010, I set their initial values to `2010-01-01` and `2020-01-31`, respectively, so that when the user opens the date picker they won't have to navigate to

At the bottom of the form, there are 2 buttons: the Apply button with `type="submit"`, and the Clear button with `type="reset"`.

### Event listening and handling

There are 2 event listeners, both applied to the form:

- `submit` triggers the `applyFilters` handler
- `reset` triggers the `clearFilters` handler

Both handlers take in the event and call `preventDefault()` on it to stop the event from bubbling up to the top level of the DOM, since that would trigger an unwanted page refresh.

### Applying the filters

The `applyFilters` handler isn't super elegant, but it works. First, it creates a shallow copy of the global `jsonData` array using a spread operator and assigns it to a variable called `filteredData`. I used `let` to declare it so I could keep reassigning it to a filtered version of itself.

Next, it loops over the 4 dropdown categories and checks to see if its `<select>` element has a value, and if it does, it filters `filteredData` to find matches, then reassigns it to the filtered array and moves on to the next category.

For the date range, it takes the value from each date input and passes them into the `Date` constructor, then does the same for each sighting date inside the filter loop and returns a simple conditional:

```
filteredData = filteredData.filter((sighting) => {
    const sightingDate = new Date(sighting.datetime);
    return sightingDate >= startDate &&
            sightingDate <= endDate;
});
```

However, I noticed a slight bug where the returned data was not inclusive of the end date, even though I used `<=`, so I added a day to the end date:

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

Second, it calls `makeTable` and passes it whatever data was passed to it.

### Clearing the filters
