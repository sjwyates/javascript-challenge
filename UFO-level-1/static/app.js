fetch('../../data.json')
    .then(res => res.json())
    .then(data => populateTable(data))
    .catch(err => console.error(err));


function populateTable(data) {
    const tbody = document.getElementById('sightings');
    data.forEach(sighting => tbody.append(makeRow(sighting)));
}

function makeRow(sighting) {
    const tr = document.createElement('tr');
    ['datetime', 'city', 'state', 'country', 'shape', 'durationMinutes', 'comments'].forEach(column => {
        const td = document.createElement('td');
        td.innerHTML = sighting[column];
        tr.append(td);
    })
    return tr;
}