const { SiteClient } = require("datocms-client");

export default async function getComunidades(request, response) {
    const client = new SiteClient("1637f836ad8453152c79e2c00729ab");

    const info_comunidades = await client.items.all({ filter: {id: 'community'} })
    response.json(
        info_comunidades.map((itemAtual) => {
            return {
                "id": itemAtual.id,
                "link": itemAtual.pageUrl,
                "title": itemAtual.title,
                "image": itemAtual.imageUrl
            }
        })
    )
}