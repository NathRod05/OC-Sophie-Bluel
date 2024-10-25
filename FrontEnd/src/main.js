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
    const works = await fetchWorks()
    works.forEach(work => {
        const imageElement = document.createElement('img');
        const descritpionElement = document.createElement('article');
        imageElement.src = work.imageUrl;
        descritpionElement.textContent = work.title;
        descritpionElement.appendChild(imageElement)
        gallery.appendChild(descritpionElement);
    });

}

generateWork()


// Ajout band noir edition
// Ajout btn modifier
if (isLoggedIn()) {
    updatePageForConnectedUser()
    addEditionMode()
}


function updatePageForConnectedUser() {
    const loginButton = document.querySelector(".login-button")
    loginButton.innerHTML = 'Log Out';
    loginButton.setAttribute('href', "#")
    loginButton.addEventListener('click', logOutUser)
}

function addEditionMode() {
    const blackboard = document.querySelector('.blackboard')
    const filter = document.querySelector('.filters-contenair')
    const modify = document.querySelector('.modal-btn')
    blackboard.style.display = 'block'
    filter.style.display = 'none'
    modify.style.display = 'flex'
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
    const trashs = document.querySelectorAll(".fa-trash-can");
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

function addListenerButtonValidate() {
    const buttonValidate = document.querySelector(".validate")
    buttonValidate.addEventListener("submit", async function (event) {
        event.preventDefault()
        const work = {
            file: event.target.querySelector("#file").value,
            title: event.target.querySelector("#title").value,
            category: event.target.querySelector("#category").value
        }
        const body = JSON.stringify(work)
        const res = await addWork(body)

        if (res) {
            window.localStorage.setItem('token', res.token)
            window.location.href = './index.html';
        } else {
            alert('L');
        }

    })
}


function previousModal() {
    const backtToModal1 = document.querySelector('.previews-page')
    backtToModal1.addEventListener('click', goBackModalDeleteWork)
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










