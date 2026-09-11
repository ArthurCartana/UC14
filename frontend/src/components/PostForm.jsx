import { useEffect, useState } from "react"
import {
    atualizarPost,
    criarPost
} from "../services/api"

export default function PostForm({
    token,
    postEmEdicao,
    onSalvo,
    onCancelar
}) {

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [mensagem, setMensagem] = useState("")
    const [carregando, setCarregando] = useState(false)


    useEffect(() => {

        if (postEmEdicao) {

            setTitle(postEmEdicao.title)
            setContent(postEmEdicao.content)

        } else {

            setTitle("")
            setContent("")
        }

    }, [postEmEdicao])


    async function handleSubmit(event) {

        event.preventDefault()

        setMensagem("")
        setCarregando(true)

        try {

            if (postEmEdicao) {

                await atualizarPost(
                    postEmEdicao.id,
                    {
                        title,
                        content
                    },
                    token
                )

            } else {

                await criarPost(
                    {
                        title,
                        content
                    },
                    token
                )
            }

            setTitle("")
            setContent("")

            onSalvo()

        } catch (error) {

            setMensagem(error.message)

        } finally {

            setCarregando(false)
        }
    }


    return (
        <section className="card">

            <h2>
                {postEmEdicao ? "Editar post" : "Novo post"}
            </h2>

            <form onSubmit={handleSubmit}>

                <label>
                    Título

                    <input
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        required
                    />
                </label>

                <label>
                    Conteúdo

                    <textarea
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        required
                        rows="6"
                    />
                </label>

                <div className="actions">

                    <button
                        type="submit"
                        disabled={carregando}
                    >
                        {
                            carregando
                                ? "Salvando..."
                                : postEmEdicao
                                    ? "Salvar alterações"
                                    : "Publicar"
                        }
                    </button>

                    {postEmEdicao && (
                        <button
                            type="button"
                            className="secondary"
                            onClick={onCancelar}
                        >
                            Cancelar
                        </button>
                    )}

                </div>

            </form>

            {mensagem && (
                <p className="message">
                    {mensagem}
                </p>
            )}

        </section>
    )
}
