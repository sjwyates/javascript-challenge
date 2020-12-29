// use fetch API to get data from json file, then populate table
fetch('../../data.json')
    .then(res => res.json())
    .then(data => makeTable(data))
    .catch(err => console.error(err));


function makeTable(data) {
    const tbody = document.getElementById('tbody');
    const trows = data.map(makeRow);
    trows.forEach(trow => tbody.append(trow));
    document.querySelectorAll('th').forEach(th => th.style.color = 'white')
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
        // clean up the casing
        if (column == 'state' || column == 'country') {
            text = text.toUpperCase();
        }
        if (column == 'city' || column == 'shape') {
            text = text.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }
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