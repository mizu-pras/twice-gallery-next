// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const { default: menus } = await import('../../json/menu.json', {
    assert: {
        type: "json"
    }
})

export default function handler(req, res) {
    res.status(200).json(menus)
}