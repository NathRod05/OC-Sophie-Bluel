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
    gallery.innerHTML = ''; // Vider la galerie avant d'ajouter les nouveaux travaux filtrés
    const filteredWorks = works.filter(work => {
        return categoryId === 'null' || work.categoryId == categoryId;
    });

    // Générer les travaux filtrés
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

