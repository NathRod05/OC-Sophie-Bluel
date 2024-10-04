async function fetchCategories() {
    const response = await fetch("http://localhost:5678/api/categories")
    const categories = await response.json()
    return categories
}



async function fetchWorks() {
    const response = await fetch("http://localhost:5678/api/works")
    const works = await response.json()
    return works
}

async function logUser(body) {
    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "Post",
        headers: { "Content-Type": "application/json" },
        body: body
    })
    if (response.ok) {
        const loginInfo = await response.json()
        return loginInfo
    }
}
