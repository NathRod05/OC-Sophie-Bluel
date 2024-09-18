async function createFilters() {
    const categories = await fetchCategories()

    console.log(categories)
}

createFilters()