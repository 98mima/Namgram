import { IPost } from "../models/post";

const delay = (ms: number) => { return new Promise(res => setTimeout(res, ms)) }

export async function getPosts(userId: string): Promise<IPost[]> {
    await delay(1);
    return new Promise(res => res([
        {
            id: "1", user: { id: "1", username: "zlatkovnik", image: "https://pbs.twimg.com/profile_images/949787136030539782/LnRrYf6e.jpg" },
            dislikes: 30, likes: 50, image: "https://pbs.twimg.com/profile_images/949787136030539782/LnRrYf6e.jpg"
        },
        {
            id: "2", user: { id: "2", username: "zlatkovnik", image: "https://pbs.twimg.com/profile_images/949787136030539782/LnRrYf6e.jpg" },
            dislikes: 30, likes: 50, image: "https://preview.redd.it/tib5ul9c41l41.png?auto=webp&s=d29bdd750ae7451e7251d5d03f12bbff2e095eb1"
        }

    ]));
}