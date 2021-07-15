const { SiteClient } = require("datocms-client");

export default async function cadastrarComunidades(request, response) {
    if (request.method === 'POST') {
        const client = new SiteClient("1637f836ad8453152c79e2c00729ab");

        response.json(client.items.create({
            itemType: '967633',
            ...request.body
        }))
    }

    response.status(404).json({
        message: "Use o método POST!"
    })
}