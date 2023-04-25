$(document).ready(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const restaurantId = urlParams.get("id");


  // Datenbank lesen und Restaurantinfos befüllen
  fetch(`http://localhost:3000/restaurants/${restaurantId}`)
    .then((response) => response.json())
    .then((restaurant) => {
      document.querySelector("#restaurantName").value = restaurant.restaurant_name;
      document.querySelector("#ownerFirstName").value = restaurant.owner_firstname;
      document.querySelector("#ownerLastName").value = restaurant.owner_lastname;
      document.querySelector("#phone").value = restaurant.phone;
      document.querySelector("#address").value = restaurant.address;
    })
    .catch((error) => {
      console.log(error);
    });

  // Button übernehmen
  const editForm = document.querySelector("#editForm");
  editForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const restaurantData = {
      restaurant_name: document.querySelector("#restaurantName").value,
      owner_firstname: document.querySelector("#ownerFirstName").value,
      owner_lastname: document.querySelector("#ownerLastName").value,
      phone: document.querySelector("#phone").value,
      address: document.querySelector("#address").value,
    };

    fetch(`http://localhost:3000/restaurants/${restaurantId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: restaurantData ? JSON.stringify(restaurantData) : null,
    })
      .then((response) => {
        if (!response.ok) {
          console.log(restaurantData)
          throw new Error("Network response was not ok"+ restaurantData);
        }
        return response.json();
      })
      .then(() => {
        alert("Restaurant erfolgreich aktualisiert");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  });

  // Gericht hinzufügen
  const addDishButton = document.querySelector("#addDishBtn");
  const dishList = document.querySelector("#dishList");

  addDishButton.addEventListener("click", () => {
    const newDish = document.createElement("li");
    newDish.innerHTML = `
      <input type="text" placeholder="Gerichtsname" class="dishName">
      <input type="text" placeholder="Preis" class="dishPrice">
      <button class="deleteDishButton">Löschen</button>
    `;
    dishList.appendChild(newDish);
  });

  dishList.addEventListener("click", (event) => {
    if (event.target.classList.contains("deleteDishButton")) {
      event.target.parentElement.remove();
    }
  });

  



});