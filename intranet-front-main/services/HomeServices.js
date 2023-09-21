import http from "../http/http-common";

class HomeServices {
    static async Events(token) {
        return await http.get(`/events`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }
    static async Birthdates(token) {
        return await http.get(`/birthdates`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }
    static async CompanyLeaderboards(token,page) {
        return await http.get(`/company/leaderboards?page=${page}`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }
    static async DepartmentLeaderboards(token) {
        return await http.get(`/department/leaderboards`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static async Serach(token, data) {
        return await http.post(`/search`, data,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }
    
    static async getNotifications(token) {
        return await http.get(`/notifications`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static async markNotificationAsRead(token, id) {
        return await http.put(`/notifications/${id}`,{},{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
    }
}

export default HomeServices;