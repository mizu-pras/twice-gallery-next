import { useRouter } from "next/router"

const Slug = () => {
    const router = useRouter()
    const { menu, slug } = router.query

    return (
        <div>
            {menu}
            {slug}
        </div>
    )
}

export default Slug