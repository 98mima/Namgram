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

export interface IPostUpload{
    image: File,
    personId: string,
    caption: string
}