fetch('../../data.json')
    .then(res => res.json())
    .then(data => populateTable(data))
    .catch(err => console.error(err))


function populateTable(data) {
    console.log(data[0])
}