import { Pencil, Trash2 } from "lucide-react"
import { excluirPost } from "../services/api"

export default function PostList({
    posts,
    usuario,
    token,
    onEditar,
    onExcluido
}) {

    async function handleExcluir(post) {

        const confirmou = window.confirm(
            `Deseja realmente excluir "${post.title}"?`
        )

        if (!confirmou) {
            return
        }

        try {

            await excluirPost(post.id, token)

            onExcluido()

        } catch (error) {

            alert(error.message)
        }
    }


    if (posts.length === 0) {
        return (
            <section className="card">
                <p>Nenhum post cadastrado ainda.</p>
            </section>
        )
    }


    return (
        <section className="posts">

            {posts.map(post => {

                const ehDono =
                    usuario &&
                    post.user &&
                    post.user.id === usuario.id

                return (
                    <article className="card post" key={post.id}>

                        <div className="post-header">

                            <div>
                                <h2>{post.title}</h2>

                                <small>
                                    por {post.user?.name || "Usuário"}
                                </small>
                            </div>

                            {ehDono && (
                                <div className="post-actions">

                                    <button
                                        className="icon-button"
                                        onClick={() => onEditar(post)}
                                        title="Editar"
                                    >
                                        <Pencil size={18} />
                                    </button>

                                    <button
                                        className="icon-button danger"
                                        onClick={() => handleExcluir(post)}
                                        title="Excluir"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                </div>
                            )}

                        </div>

                        <p className="post-content">
                            {post.content}
                        </p>

                    </article>
                )
            })}

        </section>
    )
}
