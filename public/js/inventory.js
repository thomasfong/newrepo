// Build inventory items into HTML table components and inject into DOM
function buildInventoryList(data) {
    let inventoryDisplay = document.getElementById("inventoryDisplay");
    
    // Clear previous contents
    inventoryDisplay.innerHTML = '';
    
    // If no data, show message
    if (!data || data.length === 0) {
        inventoryDisplay.innerHTML = '<tr><td colspan="5">No vehicles found for this classification</td></tr>';
        return;
    }
    
    // Set up table structure
    let tableHead = '<thead>';
    tableHead += '<tr><th>Vehicle</th><th>Year</th><th>Price</th><th>Miles</th><th>Action</th></tr>';
    tableHead += '</thead>';
    
    // Set up table body
    let tableBody = '<tbody>';
    
    // Loop through inventory items
    data.forEach(function(vehicle) {
        tableBody += `<tr>
            <td>${vehicle.inv_make} ${vehicle.inv_model}</td>
            <td>${vehicle.inv_year}</td>
            <td>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</td>
            <td>${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)}</td>
            <td>
                <a href="/inv/edit/${vehicle.inv_id}" class="btn btn-sm btn-primary">Edit</a>
                <a href="/inv/delete/${vehicle.inv_id}" class="btn btn-sm btn-danger">Delete</a>
            </td>
        </tr>`;
    });
    
    tableBody += '</tbody>';
    
    // Combine and insert into table
    inventoryDisplay.innerHTML = tableHead + tableBody;
}

// Event listener for classification select list
document.addEventListener("DOMContentLoaded", function() {
    let classificationList = document.querySelector("#classificationList");
    
    if (classificationList) {
        classificationList.addEventListener("change", function() {
            let classification_id = this.value;
            
            if (classification_id === "") {
                document.getElementById("inventoryDisplay").innerHTML = "";
                return;
            }
            
            let classIdURL = "/inv/getInventory/" + classification_id;
            
            fetch(classIdURL)
                .then(function(response) {
                    if (response.ok) {
                        return response.json();
                    }
                    throw Error("Network response was not OK");
                })
                .then(function(data) {
                    buildInventoryList(data);
                })
                .catch(function(error) {
                    console.log('There was a problem:', error.message);
                    document.getElementById("inventoryDisplay").innerHTML = 
                        '<tr><td colspan="5">Error loading inventory data</td></tr>';
                });
        });
    }
});