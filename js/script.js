const nSearch = document.querySelector("#nSearch");
const nCategorie = document.querySelector("#nCategorie");
const nArea = document.querySelector("#nArea");
const nIngredients = document.querySelector("#nIngredients");
const nContact = document.querySelector("#nContact");

const openIcon = document.querySelector("#openIcon");
const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".navbar ul li span");
const animation = document.querySelectorAll(".animation");
const loading = document.querySelector(".loading");
const search = document.querySelector("#search");

function one() {
  navbar.classList.add("Meals");
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    openIcon.classList.remove("fa-xmark");
    navbar.classList.remove("show");

    animation.forEach((el) => {
      el.classList.remove("animaT");
      el.classList.add("animaD");
    });
  });
});

openIcon.addEventListener("click", (e) => {
  openIcon.classList.toggle("fa-xmark");
  navbar.classList.toggle("show");
  animation.forEach((el) => {
    el.classList.toggle("animaD");
    el.classList.toggle("animaT");
  });
});

function showSection(section) {
  meals.classList.add("d-none");
  categorie.classList.add("d-none");
  area.classList.add("d-none");
  ingredients.classList.add("d-none");
  contact.classList.add("d-none");
  search.classList.add("d-none");
  loading.classList.remove("d-none");
  document.body.classList.remove("overflow-hidden");
  setTimeout(() => {
    loading.classList.add("d-none");
    section.classList.remove("d-none");
  }, 300);
}

nCategorie.addEventListener("click", () => showSection(categorie));
nArea.addEventListener("click", () => showSection(area));
nIngredients.addEventListener("click", () => showSection(ingredients));
nContact.addEventListener("click", () => showSection(contact));
nSearch.addEventListener("click", () => showSection(search));

function hideDetails() {
  detailsMail.classList.add("d-none");
}

nCategorie.addEventListener("click", hideDetails);
nArea.addEventListener("click", hideDetails);
nIngredients.addEventListener("click", hideDetails);
nSearch.addEventListener("click", () => {
  hideDetails();
  searchBy.value = "";
  firstLetter.value = "";
  navbar.classList.add("h-index");
});
nContact.addEventListener("click", hideDetails);

// ---------- Start Fetch Meals ----------
const meals = document.querySelector("#meals");

async function getMeals() {
  loading.classList.remove("d-none");
  one();
  navbar.classList.add("z-index");
  let response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s="
  );
  let data = await response.json();
  setTimeout(() => {
    loading.classList.add("d-none");
    navbar.classList.remove("Meals");
  }, 200);
  navbar.classList.remove("z-index");
  displayMeals(data);
}
getMeals();

function displayMeals(data) {
  let allMeals = "";
  for (let i = 0; i < data.meals.length; i++) {
    allMeals += `
      <div class="col-lg-3">
        <div class="meal-photo rounded-3" id="${data.meals[i].idMeal}">
          <img
            src="${data.meals[i].strMealThumb || ""}"
            class="w-100"
            alt="${data.meals[i].strMeal || ""}"
          />
          <div class="meal-content">
            <h2>${data.meals[i].strMeal}</h2>
          </div>
        </div>
      </div>
    `;
  }

  meals.innerHTML = allMeals;
  meals.classList.remove("d-none");
  categorie.classList.add("d-none");
}

const mailList = document.querySelector("#mailList");
const detailsMail = document.querySelector(".detailsMail");

meals.addEventListener("click", (e) => {
  const mealsID = e.target.closest(".meal-photo").id;
  getDetails(mealsID);
});

function mealsDetails(data) {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = data[`strIngredient${i}`];
    const measure = data[`strMeasure${i}`];

    if (ingredient && ingredient !== "") {
      ingredientsList += `<li class="p-1 m-1 badge badge-bg">${measure} ${ingredient}</li>`;
    }
  }
  const content = `
     <div class="col-lg-4">
    <img
      src=${data.strMealThumb}
      class="w-100"
      alt=""
    />
    <h2 class="text-white">${data.strCategory}</h2>
  </div>
  <div class="col-lg-8">
    <h2 class="h3 text-white">Instructions</h2>
    <p class="text-white">
    ${data.strInstructions}
    </p>
    <h3 class="text-white"><span> Area : ${data.strArea}  </span></h3>
    <h3 class="text-white"><span> Category : ${data.strCategory} </span></h3>
    <h3 class="text-white">
      <span>
        Recipes :
        <ul class="d-flex list-unstyled g-3 flex-wrap mt-3">
          ${ingredientsList}
        </ul>
      </span>
    </h3>
    <h3 class="text-white">Tags :</h3>
    <div class="mt-3">
      <a href="${data.strSource}" class="btn btn-success" target="_blank">Source</a>
      <a href="${data.strYoutube}" class="btn btn-danger" target="_blank">Youtube</a>
    </div>
  </div>
  `;
  mailList.innerHTML = content;
  detailsMail.classList.remove("d-none");
  search.classList.add("d-none");
  document.body.classList.add("overflow-hidden");
}

// ---------- Start Fetch Details ----------

async function getDetails(idMeals) {
  loading.classList.remove("d-none");
  const url = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeals}`
  );

  const data_2 = await url.json();
  console.log(data_2);
  setTimeout(() => {
    loading.classList.add("d-none");
  }, 300);
  mealsDetails(data_2.meals[0]);
}

// ---------- End Fetch Meals ----------

// ---------- Start Fetch Categories ----------
const categorie = document.querySelector("#categorie");

async function getCategories() {
  let response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  let data = await response.json();
  displayCategories(data);
}
getCategories();

function displayCategories(data) {
  let allCategories = "";
  for (let i = 0; i < data.categories.length; i++) {
    allCategories += `
    <div class="col-lg-3">
          <div class="meal-photo rounded-3" id="${
            data.categories[i].strCategory
          }">
            <img
              src=${data.categories[i].strCategoryThumb}
              class="w-100"
              alt=${data.categories[i].strCategory}
            />
            <div class="meal-content">
              <h2 class="text-center">${data.categories[i].strCategory}</h2>
              <P>${data.categories[i].strCategoryDescription
                .split(" ", 20)
                .join(" ")}</P>
            </div>
          </div>
        </div>
`;
  }

  categorie.innerHTML = allCategories;
}

categorie.addEventListener("click", (e) => {
  const mealsName = e.target.closest(".meal-photo").id;
  filterCategories(mealsName);
});

async function filterCategories(categoriesName) {
  loading.classList.remove("d-none");
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoriesName}`
  );
  let data = await response.json();
  setTimeout(() => {
    loading.classList.add("d-none");
  }, 300);
  if (data.meals) {
    displayMeals({ meals: data.meals.slice(0, 20) });
  }
}

// ---------- End Fetch Categories ----------

// ---------- Start Fetch Area ----------

const area = document.querySelector("#area");

async function getArea() {
  let response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  let data = await response.json();
  displayArea(data);
}
getArea();

function displayArea(data) {
  let allArea = "";
  for (let i = 0; i < data.meals.length; i++) {
    allArea += `

    <div class="col-lg-3">
            <div class="pointer text-center text-white" id="${data.meals[i].strArea}">
              <i class="fa-solid fa-house-laptop"></i>
              <h3>${data.meals[i].strArea}</h3>
            </div>
          </div>
    `;
  }
  area.innerHTML = allArea;
}

area.addEventListener("click", (e) => {
  const areaName = e.target.closest(".pointer").id;

  filterArea(areaName);
});

async function filterArea(areaName) {
  loading.classList.remove("d-none");
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`
  );
  let data = await response.json();
  setTimeout(() => {
    loading.classList.add("d-none");
  }, 300);
  area.classList.add("d-none");
  displayMeals(data);
}

// ---------- End Fetch Area ----------

// ---------- Start Fetch Ingredients ----------

const ingredients = document.querySelector("#ingredients");

async function getIngredients() {
  let response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
  );
  let data = await response.json();
  if (data.meals) {
    displayIngredients({ meals: data.meals.slice(0, 20) });
  }
}
getIngredients();

function displayIngredients(data) {
  let allIngredients = "";
  for (let i = 0; i < data.meals.length; i++) {
    allIngredients += `

    <div class="col-lg-3">
            <div class="pointer text-center text-white" id="${
              data.meals[i].strIngredient
            }">
              <i class="fa-solid fa-drumstick-bite"></i>
              <h3>${data.meals[i].strIngredient}</h3>
              <p>
               ${data.meals[i].strDescription.split(" ", 20).join(" ")}
              </p>
            </div>
          </div>
    `;
  }
  ingredients.innerHTML = allIngredients;
}

ingredients.addEventListener("click", (e) => {
  const ingredientsName = e.target.closest(".pointer").id;
  filterIngredients(ingredientsName);
});

async function filterIngredients(ingredientsName) {
  loading.classList.remove("d-none");
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientsName}`
  );
  let data = await response.json();
  setTimeout(() => {
    loading.classList.add("d-none");
  }, 300);
  area.classList.add("d-none");
  displayMeals(data);
}

// ---------- End Fetch Ingredients ----------

// ---------- Start Fetch Search ----------
const firstLetter = document.querySelector("#firstLetter");
firstLetter.addEventListener("input", (e) => {
  const searchLetter = firstLetter.value;
  if (searchLetter.length === 1) {
    searchFirstLetter(searchLetter);
  } else if (searchLetter.length === 0) {
    searchFirstLetter("a");
  }
});
async function searchFirstLetter(letter) {
  loading.classList.remove("d-none");
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  );
  let data = await response.json();
  setTimeout(() => {
    loading.classList.add("d-none");
  }, 300);
  displayMeals(data);
}
// ---------- End Fetch Search ----------

// ---------- Start Fetch Search ----------
const searchBy = document.querySelector("#searchBy");
searchBy.addEventListener("input", (e) => {
  const searchName = searchBy.value;
  searchByName(searchName);
});

async function searchByName(name) {
  loading.classList.remove("d-none");
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
  );
  let data = await response.json();
  setTimeout(() => {
    loading.classList.add("d-none");
  }, 300);
  displayMeals(data);
}
// ---------- End Fetch Search ----------

//Start Contact Us

function displayContacts() {
  rowData.innerHTML = `
    <div class="col-lg-6 my-2">
      <input type="text" class="form-control" placeholder="Enter Your Name" id="name"   oninput="validateInput(this); checkForm();" />
      <div class="bg-transparent-75 d-none my-2">
        <p class="error m-0">Must contain at least 3 letters and only letters and spaces are allowed.</p>
      </div>
    </div>

    <div class="col-lg-6 my-2">
      <input type="email" class="form-control" placeholder="Enter Your Email" id="email"   oninput="validateInput(this); checkForm();" />
      <div class="bg-transparent-75 d-none p-3 my-2">
        <p class="error m-0">Please enter a valid email address.</p>
      </div>
    </div>

    <div class="col-lg-6 my-2">
      <input type="tel" class="form-control" placeholder="Enter Your Phone" id="phone"   oninput="validateInput(this); checkForm();" />
      <div class="bg-transparent-75 d-none p-3 my-2">
        <p class="error m-0">Phone number must be a valid Egyptian number.</p>
      </div>
    </div>

    <div class="col-lg-6 my-2">
      <input type="number" class="form-control" placeholder="Enter Your Age" id="age"   oninput="validateInput(this); checkForm();" />
      <div class="bg-transparent-75 d-none p-3 my-2">
        <p class="error m-0">Age must be a number between 10 and 80.</p>
      </div>
    </div>

    <div class="col-lg-6 my-2">
      <input type="password" class="form-control" placeholder="Enter Your Password" id="password"   oninput="validateInput(this); checkForm();" />
      <div class="bg-transparent-75 d-none my-2">
        <p class="error m-0">Password must start with a letter and contain at least 6 characters including digits.</p>
      </div>
    </div>

    <div class="col-lg-6 my-2">
      <input type="password" class="form-control" placeholder="Enter Your Repassword" id="repassword"  oninput="touched.repassword=true; checkForm();"  />
      <div class="bg-transparent-75 d-none p-3 my-2">
        <p class="error m-0">Re-entered password must match the password.</p>
      </div>
    </div>

    <button class="btn btn-outline-danger mt-3 mx-auto" id="submit" disabled>Submit</button>
  `;
}

displayContacts();

const inputName = document.querySelector("#name");
const inputEmail = document.querySelector("#email");
const inputPhone = document.querySelector("#phone");
const inputAge = document.querySelector("#age");
const inputPassword = document.querySelector("#password");
const inputRepassword = document.querySelector("#repassword");
const btnSubmit = document.querySelector("#submit");
const allInput = document.querySelectorAll("input");

let touched = {
  name: false,
  email: false,
  phone: false,
  age: false,
  password: false,
  repassword: false,
};

function validateInput(element) {
  let regex = {
    name: /^[A-Za-z]{3,}(?:\s[A-Za-z]+)*$/,
    email: /^(?!.*\s)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^(01[0125][0-9]{8})$/,
    age: /^(?:[1-7][0-9]|80)$/,
    password: /^[A-Za-z]\d{5,}\s*$/,
  };

  touched[element.id] = true;

  if (!touched[element.id]) return false;

  if (regex[element.id].test(element.value)) {
    element.nextElementSibling.classList.add("d-none");
    return true;
  } else {
    element.nextElementSibling.classList.remove("d-none");
    return false;
  }
}

function checkForm() {
  let passMatch =
    inputRepassword.value === inputPassword.value &&
    inputRepassword.value !== "";
  if (touched.repassword) {
    if (passMatch) {
      inputRepassword.nextElementSibling.classList.add("d-none");
    } else {
      inputRepassword.nextElementSibling.classList.remove("d-none");
    }
  } else {
    inputRepassword.nextElementSibling.classList.add("d-none");
  }

  if (
    (!touched.name || validateInput(inputName)) &&
    (!touched.email || validateInput(inputEmail)) &&
    (!touched.phone || validateInput(inputPhone)) &&
    (!touched.age || validateInput(inputAge)) &&
    (!touched.password || validateInput(inputPassword)) &&
    passMatch
  ) {
    btnSubmit.removeAttribute("disabled");
  } else {
    btnSubmit.setAttribute("disabled", true);
  }
}

//End Contact Us
