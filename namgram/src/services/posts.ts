import { IPost } from "../models/post";

const delay = (ms: number) => {return new Promise(res => setTimeout(res, ms))}

export async function getPosts (userId: string): Promise<IPost[]> {
    await delay(2000);
    return new Promise(res => res([
        {id: "1", user: {id: "1", username: "zlatkovnik", image: "https://pbs.twimg.com/profile_images/949787136030539782/LnRrYf6e.jpg"},
    dislikes: 30, likes: 50, image: "https://pbs.twimg.com/profile_images/949787136030539782/LnRrYf6e.jpg"}
    ]));
}