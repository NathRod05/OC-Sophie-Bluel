async function generateFilters() {
    try {
        const categories = await fetchCategories();
        categories.unshift({
            id: null,
            name: 'Tous'
        })
        const filtersContainer = document.querySelector('.filters-contenair');
        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.name;
            button.classList.add('filter-button');
            if (category.id == null) {
                button.classList.add('filter-active');
            }
            button.dataset.categoryId = category.id;
            button.addEventListener('click', handleFilterButtonClick);
            filtersContainer.appendChild(button);
        });
    }
    catch (error) {
        console.error('Une erreur est survenue lors de la génération des filtres :', error);
    }
}

function handleFilterButtonClick(event) {
    const categoryId = event.target.dataset.categoryId;
    const activeFilter = document.querySelector('.filter-active')
    activeFilter.classList.remove('filter-active')
    event.target.classList.add('filter-active')
    console.log(event)

    filterWorksByCategory(categoryId)
}

async function filterWorksByCategory(categoryId) {
    const gallery = document.querySelector('.gallery');
    const works = await fetchWorks()
    gallery.innerHTML = '';
    const filteredWorks = works.filter(work => {
        return categoryId === 'null' || work.categoryId == categoryId;
    });

    filteredWorks.forEach(work => {

        const imageElement = document.createElement('img');
        imageElement.src = work.imageUrl;
        const descriptionElement = document.createElement('article');
        descriptionElement.textContent = work.title;
        descriptionElement.appendChild(imageElement);
        gallery.appendChild(descriptionElement);
    });
}

generateFilters()

async function generateWork() {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ""
    const works = await fetchWorks()
    works.forEach(work => {
        const imageElement = document.createElement('img');
        const descritpionElement = document.createElement('article');
        descritpionElement.dataset.id = work.id
        imageElement.src = work.imageUrl;
        descritpionElement.textContent = work.title;
        descritpionElement.appendChild(imageElement)
        gallery.appendChild(descritpionElement);
    });

}

generateWork()

if (isLoggedIn()) {
    updatePageForConnectedUser();
} else {
    toggleEditionMode();
}
function updatePageForConnectedUser() {
    const loginButton = document.querySelector(".login-button");
    loginButton.innerHTML = 'Log Out';
    loginButton.setAttribute('href', "#");
    loginButton.addEventListener('click', function () {
        logOutUser();
    });
    toggleEditionMode()
}

function toggleEditionMode() {
    const isLoggedIn = localStorage.getItem("token") !== null;
    const blackboard = document.querySelector('.blackboard');
    const filter = document.querySelector('.filters-contenair');
    const modify = document.querySelector('.modal-btn');

    if (isLoggedIn) {
        blackboard.style.display = 'block';
        filter.style.display = 'none';
        modify.style.display = 'flex';
        document.body.classList.add('mode-edition');
    } else {
        document.body.classList.remove('mode-edition');
    }
}

function logOutUser() {
    localStorage.clear()
    window.location.reload()
}
function isLoggedIn() {
    return (localStorage.getItem("token") != null)
}

function openModalDeleteWork() {
    const modalButton = document.querySelector('.modal-btn')
    modalButton.addEventListener('click', getModalDeleteWork)
}
function getModalDeleteWork() {
    const modalDeleteWork = document.querySelector('.modal-delete-work')
    modalDeleteWork.style.display = 'block'
}
openModalDeleteWork()

async function generateWorkModal() {
    const gallery = document.querySelector('.gallery-modal');
    gallery.innerHTML = ""
    const works = await fetchWorks()
    works.forEach(work => {
        const imageElement = document.createElement('img');
        const descritpionElement = document.createElement('article');
        const trashCanElement = document.createElement('i')

        imageElement.src = work.imageUrl;
        trashCanElement.classList.add('fa-solid', 'fa-trash-can')
        trashCanElement.dataset.id = work.id;

        descritpionElement.appendChild(trashCanElement)
        descritpionElement.appendChild(imageElement)
        gallery.appendChild(descritpionElement);
    });
    addListenerButtonTrash()
}

generateWorkModal()

async function addListenerButtonTrash() {
    const trashs = document.querySelectorAll(".fa-trash-can")
    const gallery = document.querySelector('.gallery')
    trashs.forEach((trash) => {
        trash.addEventListener("click", async function (event) {
            event.preventDefault();

            const workId = event.target.dataset.id;
            const parentElement = event.target.closest('article');
            if (!confirm("Êtes-vous sûr de vouloir supprimer ce travail ?")) {
                return;
            }

            if (!workId) {
                alert("Invalid work ID.");
                return;
            }

            const body = { workId };
            if (await deleteWork(body)) {
                parentElement.remove();
                const galleryElement = Array.from(gallery.children).find((elem) => {
                    return elem.dataset.id == workId
                })
                galleryElement.remove()
                console.log(`Work with ID ${workId} was deleted.`);
            }

            else {
                alert('error')
            }

        });
    });
}


function openModalAddWork() {
    const addPicturesModal = document.querySelector('.add-picture-modal')
    addPicturesModal.addEventListener('click', getModalAddWork)
}
function getModalAddWork() {
    const modalDeleteWork = document.querySelector('.modal-delete-work')
    const modalAddWork = document.querySelector('.modal-add-work')
    modalDeleteWork.style.display = 'none'
    modalAddWork.style.display = 'block'
}
openModalAddWork()

function previewImage() {
    const fileInput = document.querySelector("#file");
    const preview = document.querySelector("#preview");
    const previewPicture = document.querySelector('.preview-picture')
    const fileInfo = document.querySelector('.file-info')

    fileInput.addEventListener("change", function () {
        const file = fileInput.files[0];
        if (file) {
            preview.src = URL.createObjectURL(file);
            preview.onload = function () {
                URL.revokeObjectURL(preview.src);
                previewPicture.style.display = 'none'
                fileInfo.style.display = 'none'
            };
        }
    });
}

function checkFormCompletion() {
    const buttonValidate = document.querySelector(".validate");
    const file = document.querySelector("#file").files[0];
    const title = document.querySelector("#title").value;
    const category = document.querySelector("#category").value;

    if (file && title && category) {
        buttonValidate.style.backgroundColor = "#1D6154";
    } else {
        buttonValidate.style.backgroundColor = "";
    }
}
document.querySelectorAll("input, select").forEach(filled => {
    filled.addEventListener("input", checkFormCompletion);
});

async function addListenerButtonValidate() {
    const form = document.querySelector("form")
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const file = document.querySelector("#file").files[0];
        const title = document.querySelector("#title").value;
        const category = document.querySelector("#category").value;

        if (!file || !title || !category) {
            alert("Veuillez remplir tous les champs.");
            return;
        }
        const work = {
            file: file,
            title: title,
            category: category
        };

        const formData = new FormData();
        formData.append("image", file);
        formData.append("title", title);
        formData.append("category", category);

        const res = await addWork(formData);

        if (res) {
            generateWork()
            generateWorkModal()
            const modal = document.querySelector('.modal-add-work')
            modal.style.display = 'none'
            form.reset()
            resetFileInput()
        }
        else {
            alert('Erreur lors de la validation');
        }

    })
}

function resetFileInput() {
    const preview = document.querySelector("#preview");
    const previewPicture = document.querySelector('.preview-picture')
    const fileInfo = document.querySelector('.file-info')
    preview.src = ''
    previewPicture.style.display = 'initial'
    fileInfo.style.display = 'initial'
}


previewImage()
checkFormCompletion()
addListenerButtonValidate()


function previousModal() {
    const backtToModalDeleteWork = document.querySelector('.previews-page')
    backtToModalDeleteWork.addEventListener('click', goBackModalDeleteWork)
}
function goBackModalDeleteWork() {
    const modalDeleteWork = document.querySelector('.modal-delete-work')
    const modalAddWork = document.querySelector('.modal-add-work')
    modalDeleteWork.style.display = 'block'
    modalAddWork.style.display = 'none'
}
previousModal()

function bindEventsModal() {
    const closeModalElements = document.querySelectorAll('.close-modal')
    closeModalElements.forEach(
        (closeModalElement) => {
            closeModalElement.addEventListener('click', (event) => {
                event.target.closest('.modal').style.display = 'none'
            })
        }
    )
}

bindEventsModal()

function addRemoveImageButton() {
    const previewContainer = document.querySelector('.add-picture');
    const preview = document.querySelector("#preview");
    const previewPicture = document.querySelector('.preview-picture');
    const fileInfo = document.querySelector('.file-info');
    const fileInput = document.querySelector("#file");
    const removeButton = document.createElement("i");
    removeButton.className = "fa-solid fa-xmark remove-image-btn";
    previewContainer.appendChild(removeButton);
    removeButton.style.display = "none"
    fileInput.addEventListener("change", function () {
        if (file) {
            {
                URL.revokeObjectURL(preview.src);
                previewPicture.style.display = 'none';
                fileInfo.style.display = 'none';
                removeButton.style.display = "block";
            };
        } else {
            removeButton.style.display = "none";
        }
    });
    removeButton.addEventListener("click", function () {
        preview.src = '';
        fileInput.value = '';
        previewPicture.style.display = 'block';
        fileInfo.style.display = 'block';
        removeButton.style.display = "none";
    });
}

addRemoveImageButton();
