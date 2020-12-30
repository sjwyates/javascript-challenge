// -------------------------------------
// FETCH JSON DATA
// -------------------------------------
let jsonData = [];

fetch("../../data.json")
  .then((res) => res.json())
  .then(cleanData)
  .then(makeTable)
  .then(makeDropdowns)
  .catch((err) => console.error(err));

function cleanData(data) {
  function toTitleCase(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  jsonData = data.map((sighting) => {
    let {
      datetime,
      city,
      state,
      country,
      shape,
      durationMinutes,
      comments,
    } = sighting;
    return {
      datetime,
      city: toTitleCase(city),
      state: state.toUpperCase(),
      country: country.toUpperCase(),
      shape: toTitleCase(shape),
      durationMinutes,
      comments,
    };
  });
  return jsonData;
}

// -------------------------------------
// MAKE TABLE
// -------------------------------------
function makeTable(data) {
  const tbody = document.getElementById("tbody");
  const trows = data.map(makeRow);
  trows.forEach((trow) => tbody.append(trow));
  document.querySelectorAll("th").forEach((th) => (th.style.color = "white"));
  return data;
}

function makeRow(sighting, index) {
  const tr = document.createElement("tr");
  // striping
  if (index % 2 == 0) {
    tr.classList.add("has-background-grey");
  }
  // index the rows
  const th = document.createElement("th");
  th.innerHTML = index + 1;
  tr.append(th);
  // create each table cell
  [
    "datetime",
    "city",
    "state",
    "country",
    "shape",
    "durationMinutes",
    "comments",
  ].forEach((column) => {
    const td = document.createElement("td");
    // set max width for comments column
    if (column == "comments") {
      td.style.maxWidth = "300px";
    }
    // add the text and append the cell
    td.innerHTML = sighting[column];
    tr.append(td);
  });
  return tr;
}

// -------------------------------------
// DROPDOWNS
// -------------------------------------
function makeDropdowns(data) {
  // get all unique values
  ["city", "state", "country", "shape"].forEach((category) => {
    const id = category + "Select";
    const choices = [...new Set(data.map((sighting) => sighting[category]))];
    makeDropdown(id, choices);
  });
  return data;
}

function makeDropdown(id, choices) {
  const select = document.getElementById(id);
  choices.forEach((choice) => {
    const option = document.createElement("option");
    option.value = choice;
    option.innerHTML = choice;
    select.append(option);
  });
}

// -------------------------------------
// EVENT HANDLING
// -------------------------------------
const filterForm = document.getElementById("filterForm");
filterForm.addEventListener("submit", applyFilters);
filterForm.addEventListener("reset", clearFilters);

function applyFilters(e) {
  e.preventDefault();
  let filteredData = [...jsonData];
  ["city", "state", "country", "shape"].forEach((category) => {
    const value = document.getElementById(category + "Select").value;
    if (value) {
      filteredData = filteredData.filter(
        (sighting) => sighting[category] == value
      );
    }
  });
  const startDate = new Date(document.getElementById("startDate").value);
  const endDate = new Date(document.getElementById("endDate").value);
  // need to add a day because for whatever reason it's not inclusive of the end date:
  endDate.setDate(endDate.getDate() + 1);
  filteredData = filteredData.filter((sighting) => {
    const sightingDate = new Date(sighting.datetime);
    return sightingDate >= startDate && sightingDate <= endDate;
  });
  rebuildTable(filteredData);
}

function clearFilters(e) {
  e.preventDefault();
  document.getElementById("startDate").value = "2010-01-01";
  document.getElementById("endDate").value = "2010-01-30";
  ["citySelect", "stateSelect", "countrySelect", "shapeSelect"].forEach(
    (id) => (document.getElementById(id).value = "")
  );
  rebuildTable(jsonData);
}

function rebuildTable(data) {
  const tbody = document.getElementById("tbody");
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  makeTable(data);
}
