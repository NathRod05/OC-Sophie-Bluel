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

async function deleteWork(body) {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5678/api/works/${body.workId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    return response.ok

}

async function addWork(body) {
    const response = await fetch('http://localhost:5678/api/works', {
        method: "Post",
        headers: { "Content-Type": "application/json" },
        body: body
    })
    if (response.ok) {
        const generateWork = await response.json()
        return generateWork
    }
}