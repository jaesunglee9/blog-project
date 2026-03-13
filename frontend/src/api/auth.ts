// src/api/auth.ts
import api from './config';

export type ApiResponse = { detail?: string };

export type LikeResponse = {
  post_id: number;
  like_count: number;
  liked_by_me: boolean;
};

export async function loginApi(username: string, password: string): Promise<ApiResponse> {
  return await api.post('/user/login/', { username, password });
}

export async function logoutApi(): Promise<ApiResponse> {
  return await api.post('/user/logout/');
}

export type Post = {
    id: number;
    title: string;
    content: string;
    preview?: string;      
    author: string;        
    created_at: string;    
    like_count: number;    
    liked_by_me: boolean;  
    likes?: number;
    likedByUser?: boolean;
    is_mine?: boolean;
    isUserPost?: boolean; 
    comments: any[];       
};
  
export type PostsListResponse = {
    count?: number;
    next?: string | null;
    previous?: string | null;
    results: Post[];
};

export type CreatePostBody = { title?: string; content: string; };
export type UpdatePostBody = { title?: string; content?: string; };

export async function getPostsApi(): Promise<Post[]> {
    const data = await api.get<any, PostsListResponse | Post[]>('/posts/');
    // Handle both paginated and non-paginated responses
    return Array.isArray(data) ? data : data.results;
}

export async function getPostDetailApi(id: number | string): Promise<Post> {
    return await api.get(`/posts/${id}/`);
}

export async function getMyPostsApi(): Promise<Post[]> {
    const data = await api.get('/posts/me/');
    return Array.isArray(data) ? data : []; 
}

export async function createPostApi(body: CreatePostBody): Promise<Post> {
    return await api.post('/posts/', body);
}

export async function updatePostApi(id: number | string, body: UpdatePostBody): Promise<Post> {
    return await api.patch(`/posts/${id}/`, body);
}

export async function deletePostApi(id: number | string): Promise<ApiResponse> {
    // Axios returns empty data as empty string "", we can type cast it or let interceptor handle it
    return await api.delete(`/posts/${id}/`);
}

export type Comment = {
    id: number;
    post: number;
    content: string;
    author: string | number;
    created_at?: string;
};

export type CreateCommentBody = { post: number; content: string; };

export async function getCommentsApi(postId: number | string): Promise<Comment[]> {
    const data = await api.get<any, { results?: Comment[] } | Comment[]>(`/posts/${postId}/comments/`);
    return Array.isArray(data) ? data : (data.results || []);
}

export async function createCommentApi(body: CreateCommentBody): Promise<Comment> {
    return await api.post(`/posts/${body.post}/comments/`, { content: body.content });
}

export async function updateCommentApi(id: number | string, content: string): Promise<Comment> {
    return await api.patch(`/interactions/comments/${id}/`, { content });
}

export async function deleteCommentApi(id: number | string): Promise<ApiResponse> {
    return await api.delete(`/interactions/comments/${id}/`);
}

export async function likePostApi(postId: number | string): Promise<LikeResponse> {
    return await api.post(`/posts/${postId}/likes/`);
}

export async function unlikePostApi(postId: number | string): Promise<LikeResponse> {
    return await api.delete(`/posts/${postId}/likes/`);
}
