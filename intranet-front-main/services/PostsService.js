import http from "../http/http-common";

class PostsService {
    static async Posts(token, pageParam) {
        return await http.get(`/posts?page=${pageParam}`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static async getPost(token, id) {
        return await http.get(`/posts/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static async addPost(token, data) {
        return await http.post(`/posts`, data, {
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'multipart/form-data'
            }
        })
    }

    static async editPost(token, data, post_id) {
        return await http.post(`/posts/${post_id}`, data, {
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'multipart/form-data'
            }
        })
    }

    static async DeletePost(token, postId) {
        return await http.delete(`/posts/${postId}`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }
}

export default PostsService;