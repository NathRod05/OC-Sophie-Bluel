
function addListenerLogin() {
    const loginForm = document.querySelector(".form")
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault()
        const login = {
            email: event.target.querySelector("#email").value,
            password: event.target.querySelector("#password").value
        }
        const body = JSON.stringify(login)
        const res = await logUser(body)

        if (res) {
            window.localStorage.setItem('token', res.token)
            window.location.href = './index.html';
        } else {
            alert('Identifiants invalides. Veuillez réessayer.');
        }

    })
}

addListenerLogin()

