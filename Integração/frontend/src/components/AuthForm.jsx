import { useState } from "react"
import {
    cadastrarUsuario,
    fazerLogin
} from "../services/api"

export default function AuthForm({ onLogin }) {

    const [modo, setModo] = useState("login")

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [mensagem, setMensagem] = useState("")
    const [carregando, setCarregando] = useState(false)


    async function handleSubmit(event) {

        event.preventDefault()

        setMensagem("")
        setCarregando(true)

        try {

            if (modo === "cadastro") {

                await cadastrarUsuario({
                    name,
                    email,
                    password
                })

                setMensagem("Cadastro realizado. Agora faça login.")
                setModo("login")
                setName("")
                setPassword("")

                return
            }

            const result = await fazerLogin({
                email,
                password
            })

            onLogin(result.user, result.token)

        } catch (error) {

            setMensagem(error.message)

        } finally {

            setCarregando(false)
        }
    }


    return (
        <section className="card auth-card">

            <h2>
                {modo === "login" ? "Entrar" : "Criar conta"}
            </h2>

            <form onSubmit={handleSubmit}>

                {modo === "cadastro" && (
                    <label>
                        Nome

                        <input
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                        />
                    </label>
                )}

                <label>
                    E-mail

                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                </label>

                <label>
                    Senha

                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                </label>

                <button type="submit" disabled={carregando}>
                    {
                        carregando
                            ? "Aguarde..."
                            : modo === "login"
                                ? "Entrar"
                                : "Cadastrar"
                    }
                </button>

            </form>

            {mensagem && (
                <p className="message">
                    {mensagem}
                </p>
            )}

            <button
                className="link-button"
                onClick={() => {
                    setModo(modo === "login" ? "cadastro" : "login")
                    setMensagem("")
                }}
            >
                {
                    modo === "login"
                        ? "Ainda não tenho conta"
                        : "Já tenho uma conta"
                }
            </button>

        </section>
    )
}
