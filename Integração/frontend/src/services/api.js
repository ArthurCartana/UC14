const API_URL = "http://localhost:3000"


// =========================================================
// CADASTRO
// =========================================================

export async function cadastrarUsuario(data) {
    const response = await fetch(`${API_URL}/users`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(data)
    })
// guarda a resposta do servidor
    const result = await response.json()

    if (!response.ok) {
        throw new Error(result.message || "Erro ao cadastrar usuário.")
    }

    return result
}


// =========================================================
// LOGIN
// =========================================================

export async function fazerLogin(data) {

    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(data)
    })

    const result = await response.json()

    if (!response.ok) {
        throw new Error(result.message || "Erro ao fazer login.")
    }

    return result
}


// =========================================================
// LISTAR post
// =========================================================

export async function listarPosts() {

    const response = await fetch(`${API_URL}/post`)

    const result = await response.json()

    if (!response.ok) {
        throw new Error(result.message || "Erro ao carregar post.")
    }

    return result
}


// =========================================================
// CRIAR POST
// =========================================================

export async function criarPost(data, token) {

    const response = await fetch(`${API_URL}/post`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",

            // O backend espera:
            // Authorization: Bearer TOKEN
            "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify(data)
    })

    const result = await response.json()

    if (!response.ok) {
        throw new Error(result.message || "Erro ao criar post.")
    }

    return result
}


// =========================================================
// ATUALIZAR POST
// =========================================================

export async function atualizarPost(id, data, token) {

    const response = await fetch(`${API_URL}/post/${id}`, {
        method: "PUT",

        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify(data)
    })

    const result = await response.json()

    if (!response.ok) {
        throw new Error(result.message || "Erro ao atualizar post.")
    }

    return result
}


// =========================================================
// EXCLUIR POST
// =========================================================

export async function excluirPost(id, token) {

    const response = await fetch(`${API_URL}/post/${id}`, {
        method: "DELETE",

        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    // DELETE retorna 204 No Content.
    // Nesse caso não existe JSON no corpo da resposta.
    if (!response.ok) {

        const result = await response.json()

        throw new Error(result.message || "Erro ao excluir post.")
    }
}
