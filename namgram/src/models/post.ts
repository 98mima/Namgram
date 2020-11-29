export interface IPost{
    user: {
        id: string,
        username: string,
        image: string
    },
    id: string,
    image: string,
    likes: number,
    dislikes: number
}