document.addEventListener("DOMContentLoaded", () => {
    fetchVenues();
    
    document.getElementById("book-btn").addEventListener("click", () => {
        const date = document.getElementById("event-date").value;
        const description = document.getElementById("event-description").value;

        if (!date || !description) {
            alert("Please fill in all fields.");
            return;
        }

        alert(`Your event on ${date} has been booked!`);
    });

    document.getElementById("venue-search").addEventListener("input", filterVenues);
    document.getElementById("price-filter").addEventListener("change", filterVenues);
});

function fetchVenues() {
    fetch("http://localhost:3000/venues")
        .then(response => response.json())
        .then(data => {
            window.venuesData = data; 
            displayVenues(data);
        })
        .catch(error => console.error("Error fetching venues:", error));
}

function displayVenues(data) {
    const venuesContainer = document.getElementById("venues-list");
    venuesContainer.innerHTML = "";
    const groupedVenues = {};

    data.forEach(venue => {
        if (!groupedVenues[venue.location]) {
            groupedVenues[venue.location] = [];
        }
        groupedVenues[venue.location].push(venue);
    });

    Object.keys(groupedVenues).forEach(location => {
        const locationDiv = document.createElement("div");
        locationDiv.classList.add("location-group");
        locationDiv.innerHTML = `<h2>${location}</h2>`;
        
        const venueRow = document.createElement("div");
        venueRow.classList.add("venue-row");

        groupedVenues[location].forEach(venue => {
            const venueDiv = document.createElement("div");
            venueDiv.classList.add("venue-card");

            venueDiv.innerHTML = `
                <h3>${venue.name}</h3>
                <p>Price: ${venue.price ? venue.price : "Not available"}</p>
                <p>Convenience: ${venue.convenience ? venue.convenience : "No details provided."}</p>
                <button class="book-now">Book Now</button>
                <button class="learn-more">Learn More</button>
            `;
            
            venueDiv.addEventListener("mouseover", () => {
                venueDiv.style.backgroundColor = "#ffccff";
            });
            
            venueDiv.addEventListener("mouseleave", () => {
                venueDiv.style.backgroundColor = "white";
            });
            
            venueDiv.querySelector(".book-now").addEventListener("click", () => {
                alert(`You booked ${venue.name}!`);
            });

            venueRow.appendChild(venueDiv);
        });

        locationDiv.appendChild(venueRow);
        venuesContainer.appendChild(locationDiv);
    });
}

function filterVenues() {
    const searchQuery = document.getElementById("venue-search").value.toLowerCase();
    const maxPrice = document.getElementById("price-filter").value;
    
    let filteredData = window.venuesData.filter(venue =>
        venue.name.toLowerCase().includes(searchQuery) &&
        (maxPrice === "all" || venue.price <= parseInt(maxPrice))
    );

    displayVenues(filteredData);
}
