let categories = () => {
  fetch("https://sophie-bluel-backend-h0j6.onrender.com/api/categories")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      let category = document.getElementsByClassName("categories")[0];
      category.innerHTML = "";
      let allBtn = document.createElement("button");
      allBtn.textContent = "All";
      allBtn.dataset.id = "all";
      allBtn.classList.add("category-button", "active");
      category.appendChild(allBtn);
      dropDownList(data);

      data.forEach((element) => {
        let buttons = document.createElement("button");
        buttons.classList.add("category-button");
        buttons.textContent = element.name;
        buttons.dataset.id = element.id;
        buttons.addEventListener("click", () => addCategoryEventListener());

        category.appendChild(buttons);
      });
    })

    .catch((error) => console.log(error));
};

categories();

let loadGallery = () => {
  fetch("https://sophie-bluel-backend-h0j6.onrender.com/api/works")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      let gallery = document.getElementsByClassName("gallery")[0];
      let modalImages = document.getElementsByClassName("images")[0];
      modalImages.innerHTML = "";
      gallery.innerHTML = "";
      data.forEach((element) => {
        let figure = document.createElement("figure");
        let image = document.createElement("img");
        let figcaption = document.createElement("figcaption");
        image.src = element.imageUrl;
        figcaption.textContent = element.title;
        figure.style.display = "block";
        figure.dataset.categoryId = element.categoryId;
        figure.dataset.Id = element.id;

        figure.appendChild(image);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);

        let trash = document.createElement("i");
        trash.classList.add("fa-solid", "fa-trash-can");
        let wrapper = document.createElement("div");
        wrapper.classList.add("wrapper");

        trash.addEventListener("click", (e) => {
          e.target.closest(".wrapper").remove();
          deleteImage(element.id);
        });

        wrapper.appendChild(image.cloneNode(true));
        wrapper.appendChild(trash);
        modalImages.appendChild(wrapper);
      });
    })

    .catch((error) => console.log("works fetch error", error));
};
loadGallery();

async function deleteImage(id) {
  console.log(id);

  try {
    const res = await fetch(`https://sophie-bluel-backend-h0j6.onrender.com/api/works/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      return;
    }
    console.log(data);
  } catch (error) {
    console.log(error);
  }

  loadGallery();
}

function addCategoryEventListener() {
  const buttons = document.querySelectorAll(".category-button");
  const figures = document.querySelectorAll(".gallery figure");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((button) => button.classList.remove("active"));
      button.classList.add("active");

      if (button.dataset.id === "all") {
        figures.forEach((figure) => (figure.style.display = "block"));
      } else {
        figures.forEach((figure) => {
          if (figure.dataset.categoryId == button.dataset.id) {
            figure.style.display = "block";
          } else {
            figure.style.display = "none";
          }
        });
      }
    });
  });
}

const loginUser = () => {
  const token = localStorage.getItem("token");
  const loginButton = document.querySelector(".login-btn");

  if (token) {
    const categoryContainer = document.querySelector(".categories");
    const editingMode = document.getElementById("ed");
    const edit = document.getElementById("edit");
    const penEdit = document.getElementById("pen");

    console.log("User logged, token:", token);

    if (loginButton) {
      loginButton.textContent = "logout";
      loginButton.addEventListener("click", () => {
        localStorage.removeItem("token");
        location.reload();
      });
    }

    if (categoryContainer) {
      categoryContainer.style.display = "none";
    }
    if (editingMode) {
      editingMode.style.display = "flex";
    }
    if (edit) {
      edit.style.display = "flex";
    }
    if (penEdit) {
      penEdit.style.display = "flex";
    }
  }
  if (token == null) {
    addCategoryEventListener();
    loginButton.addEventListener("click", () => {
      location.href = "/FrontEnd/login.html";
    });
  }
};

loginUser();

function openModal() {
  const edits = document.querySelectorAll(".open-modal");
  const modalWindow = document.querySelector(".modal-container");
  const exit = document.querySelectorAll(".fa-xmark");
  const newPhoto = document.getElementById("add");
  const secondWindow = document.querySelector(".second-modal-container");
  const arrow = document.querySelector(".fa-arrow-left");
  const body = document.getElementById("body");

  edits.forEach((edit) => {
    edit.addEventListener("click", () => {
      modalWindow.style.display = "flex";
      body.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    });

    exit.forEach((x) => {
      x.addEventListener("click", () => {
        modalWindow.style.display = "none";
        secondWindow.style.display = "none";
        body.style.backgroundColor = "white";
      });
    });

    newPhoto.addEventListener("click", () => {
      modalWindow.style.display = "none";
      secondWindow.style.display = "flex";
      body.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    });

    arrow.addEventListener("click", () => {
      secondWindow.style.display = "none";
      modalWindow.style.display = "flex";
      body.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    });

    modalWindow.addEventListener("click", (e) => {
      if (e.target === modalWindow) {
        modalWindow.style.display = "none";
        secondWindow.style.display = "none";
        body.style.backgroundColor = "white";
      }
    });
    secondWindow.addEventListener("click", (e) => {
      if (e.target === secondWindow) {
        modalWindow.style.display = "none";
        secondWindow.style.display = "none";
        body.style.backgroundColor = "white";
      }
    });

    body.addEventListener("click", (e) => {
      if (e.target.closest(".open-modal") || e.target.closest(".fa-trash-can"))
        return;
      {
        if (
          !modalWindow.contains(e.target) &&
          !secondWindow.contains(e.target)
        ) {
          modalWindow.style.display = "none";
          secondWindow.style.display = "none";
          body.style.backgroundColor = "white";
        }
      }
    });
  });
}

openModal();

const imageButton = document.getElementById("image");
const imageInput = document.getElementById("imageInput");
const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("category");

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;

  const preview = document.getElementById("previewImage");
  const newImage = document.querySelector(".add-image");

  preview.src = URL.createObjectURL(file);
  newImage.style.display = "none";
  loadGallery();
});

imageButton.addEventListener("click", (e) => {
  e.preventDefault();
  imageInput.click();
});

async function newProject() {
  let formData = new FormData();

  formData.append("image", imageInput.files[0]);
  formData.append("title", titleInput.value);
  formData.append("category", categorySelect.value);

  let response = await fetch("https://sophie-bluel-backend-h0j6.onrender.com/api/works", {
    method: "POST",
    headers: {
      Authorization: `bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  });

  let result = await response.json().catch((error) => console.log(error));
}

const confirmButton = document.getElementById("confirm");

confirmButton.addEventListener("click", async (e) => {
  e.preventDefault();
  await newProject();
  await loadGallery();
  location.reload();
});

function dropDownList(categories) {
  const categoriesList = document.getElementById("category");

  categoriesList.innerHTML = "";
  categories.forEach((element) => {
    categoriesList.innerHTML += `<option value="${element.id}">${element.name}</option>`;
  });
}
