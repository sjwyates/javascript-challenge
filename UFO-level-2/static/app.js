// -------------------------------------
// FETCH JSON DATA
// -------------------------------------
const data = fetch('../../data.json')
    .then(res => res.json())
    .then(cleanData)
    .then(makeTable)
    .then(makeDropdowns)
    .catch(err => console.error(err));
    

function cleanData(data) {
    function toTitleCase(str) {
        return str.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return data.map(sighting => {
        let { datetime, city, state, country, shape, durationMinutes, comments } = sighting;
        return {
            datetime,
            city: toTitleCase(city),
            state: state.toUpperCase(),
            country: country.toUpperCase(),
            shape: toTitleCase(shape),
            durationMinutes,
            comments
        }
    })
}

// -------------------------------------
// MAKE TABLE
// -------------------------------------
function makeTable(data) {
    const tbody = document.getElementById('tbody');
    const trows = data.map(makeRow);
    trows.forEach(trow => tbody.append(trow));
    document.querySelectorAll('th').forEach(th => th.style.color = 'white');
    return data;
}

function makeRow(sighting, index) {
    const tr = document.createElement('tr');
    // striping
    if (index % 2 == 0) {
        tr.classList.add('has-background-grey')
    }
    // index the rows
    const th = document.createElement('th');
    th.innerHTML = index + 1;
    tr.append(th);
    // create each table cell
    ['datetime', 'city', 'state', 'country', 'shape', 'durationMinutes', 'comments'].forEach(column => {
        const td = document.createElement('td');
        let text = sighting[column];
        // set max width for comments column
        if (column = 'comments') {
            td.style.maxWidth = '300px';
        }
        // add the text and append the cell
        td.innerHTML = text;
        tr.append(td);
    })
    return tr;
}

// -------------------------------------
// DROPDOWNS
// -------------------------------------
function makeDropdowns(data) {
    // get all unique values
    const cities = [...new Set(data.map(sighting => sighting.city))]
    const states = [...new Set(data.map(sighting => sighting.state))]
    const countries = [...new Set(data.map(sighting => sighting.country))]
    const shapes = [...new Set(data.map(sighting => sighting.shape))]
    return data;
}

function makeDropdown(name, options) {
    const control = document.createElement('div');

}

// -------------------------------------
// EVENT HANDLING
// -------------------------------------
document.getElementById('applyFilters').addEventListener(applyFilters);
document.getElementById('clearFilters').addEventListener(clearFilters);


function applyFilters(e) {
    e.preventDefault();
    
}

function clearFilters(e) {
    e.preventDefault();
}

function rebuildTable(data) {

}
