import http from "../http/http-common";

class ProfileServices {
    static async editProfile(req) {
        if( req.mode === 'add' ) {
            return await http.post(`/${req.url}`, req.data, {
                headers: { 
                    'Authorization': `Bearer ${req.token}`, 
                    'Content-Type': 'multipart/form-data'
                }
            });
        } else if( req.mode === 'edit' ) {
            return await http.put(`/${req.url}`, req.data, {
                headers:{ 'Authorization': `Bearer ${req.token}` }
            });
        } else if( req.mode === 'delete' ) {
            return await http.delete(`/${req.url}`, {
                headers:{ 'Authorization': `Bearer ${req.token}` }
            });
        }
    }

    static async getCompanies({ token }) {
        return await http.get(`/companies`, {
            headers:{ 'Authorization': `Bearer ${token}` }
        })
    }

    static async getColleges({ token }) {
        return await http.get(`/colleges`, {
            headers:{ 'Authorization': `Bearer ${token}` }
        })
    }

    static async getPosts(token, pageParam ) {
        return await http.get(`/profile/posts?page=${pageParam}`, {
            headers:{ 'Authorization': `Bearer ${token}` }
        })
    }

    static async getProfile(token, user_id, pageParam) {
        return await http.get(`/users/${user_id}?page=${pageParam}`, {
            headers:{ 'Authorization': `Bearer ${token}` }
        })
    }
}

export default ProfileServices;