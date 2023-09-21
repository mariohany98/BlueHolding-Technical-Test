import http from "../http/http-common";

class AuthServices {
    static async Login(data) {
        return await http.post(`/login`,data)
    }
    static async Logout(config) {
        return await http.post(`/logout`,config)
    }
    static async RefreshAccessToken(config) {
        return await http.post(`/refresh`,config)
    }
}

export default AuthServices;