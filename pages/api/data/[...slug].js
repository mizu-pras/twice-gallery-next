export default function handler(req, res) {
    const { slug: [menu, name] } = req.query

    const validMenu = [
        "twice", 
        "nayeon", 
        "jeongyeon", 
        "momo", 
        "sana", 
        "jihyo", 
        "mina", 
        "dahyun", 
        "chaeyoung", 
        "tzuyu"
    ]

    if (!validMenu.includes(menu))
        return res.status(404).json({
            message: "Page Not Found"
        })

    // if only return slug
    if (!name) {
        return showSlug(res, menu)
    }

    const page = req.query.slug[2] || 1
    return showData(res, menu, name, page)
    
}

const showSlug = async (res, menu) => {
    try {
        const { default: slugs } = await import(`../../../json/slug/${menu}.json`, {
            assert: {
                type: "json"
            }
        })
    
        return res.json(slugs)

    } catch (error) {
        return res.status(404).json({
            message: "Page Not Found",
            error: error.message
        })
    }
}

const showData = async (res, menu, slug, page) => {
    try {
        const { default: data } = await import(`../../../json/data/${menu}/${slug}/${page}.js`)

        return res.json(data)

    } catch (error) {
        return res.status(404).json({
            message: "Page Not Found",
            error: error.message
        })
    }
}