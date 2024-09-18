async function fetchCategories() {
    const res = await fetch("http://localhost:5678/api/categories")
    const categories = await res.json()
    return categories
}