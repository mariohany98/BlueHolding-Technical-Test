import http from "../http/http-common";

class PostsAndCommentsService {
    static async GetUsers(token) {
        return await http.get(`/users`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }
    static async AddComment(postId, token, data) {
        return await http.post(`/comments/${postId}`, data,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }
    static async editComment(token, comment_id, data) {
        return await http.put(`/comments/${comment_id}`, data, {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static async deleteComment(token, comment_id) {
        return await http.delete(`/comments/${comment_id}`, {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }
    static async React(url, token, data) {
        return await http.put(url, data,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }
    static async UndoReact(url, token ) {
        return await http.put(url,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static async Vote(url, token, data) {
        return await http.put(url, data,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static async Mentions(token, data) {
        return await http.post(`/mentions`, data,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }
}

export default PostsAndCommentsService;