// Next.js API route support: https://nextjs.org/docs/api-routes/introduction



export default async function handler(req, res) {
    const { default: menus } = await import('../../json/menu.json')

    res.status(200).json(menus)
}