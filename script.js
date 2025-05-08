const form = document.querySelector(".top-banner form");
const input = document.querySelector("input"); // Select the input element
const msg = document.querySelector(".msg"); // Select the msg element to display errors
const list = document.querySelector(".cities"); // Select the ul element where cities will be appended

form.addEventListener("submit", e => {
  e.preventDefault();
  
  const inputVal = input.value; // Get the value from the input field
  if (!inputVal) {
    msg.textContent = "Please enter a city name!";
    return;
  }

  const apiKey = "17dd5f010a900d64b7bec79715fc809a";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  // Check if city already exists in the list
  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);
  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter(el => {
      let content = "";
      if (inputVal.includes(",")) {
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0]; // Get only the city name (remove invalid country)
          content = el.querySelector(".city-name span").textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase(); // If valid country code
        }
      } else {
        content = el.querySelector(".city-name span").textContent.toLowerCase(); // Without country code
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
      } ...otherwise be more specific by providing the country code as well 😉`;
      form.reset();
      input.focus();
      return;
    }
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.cod !== 200) {
        msg.textContent = "City not found 😩";
        return;
      }

      const { main, name, sys, weather } = data;
      const icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

      const li = document.createElement("li");
      li.classList.add("city");

      const markup = ` 
        <h2 class="city-name" data-name="${name},${sys.country}"> 
          <span>${name}</span> 
          <sup>${sys.country}</sup> 
        </h2> 
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div> 
        <figure> 
          <img class="city-icon" src="${icon}" alt="${weather[0].main}"> 
          <figcaption>${weather[0].description}</figcaption> 
        </figure>
      `;
      
      li.innerHTML = markup;
      list.appendChild(li); // Append the new city info to the list

      msg.textContent = ""; // Clear any error messages
      form.reset(); // Reset the form
      input.focus(); // Focus on the input field for next search
    })
    .catch(() => {
      msg.textContent = "Please search for a valid city 😩";
    });
});
