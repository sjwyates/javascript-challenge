// use fetch API to get data from json file, then populate table
fetch('../../data.json')
    .then(res => res.json())
    .then(data => populateTable(data))
    .catch(err => console.error(err));


function populateTable(data) {
    const tbody = document.getElementById('sightings');
    const trows = data.map(makeRow);
    trows.forEach(trow => tbody.append(trow));
}

function makeRow(sighting, index) {
    const tr = document.createElement('tr');
    // index the rows
    const th = document.createElement('th');
    th.innerHTML = index + 1;
    tr.append(th);
    // create each table cell
    ['datetime', 'city', 'state', 'country', 'shape', 'durationMinutes', 'comments'].forEach(column => {
        const td = document.createElement('td');
        let text = sighting[column];
        // clean up the casing
        if (column == 'state' || column == 'country') {
            text = text.toUpperCase();
        }
        if (column == 'city' || column == 'shape') {
            text = text.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }
        // add the text and append the cell
        td.innerHTML = text;
        tr.append(td);
    })
    return tr;
}