export interface IPost {
  user: {
    id: string;
    username: string;
    image: string;
  };
  id: string;
  image: string;
  likes: number;
  dislikes: number;
}
export interface IComment {
  id: string;
  content: string;
  date: Date;
}

export interface IImage {
  id: string;
  date: Date;
  content: string;
  sasToken: string;
  likes: number;
  dislikes: number;
  comments: number;
}

export interface IPostUpload {
  image: File;
  personId: string;
  caption: string;
}
