import http from "../http/http-common";

class blogService {
    static async retrieveBlog() {
        return await http.get(`/page/blogs`)
    }
    static async retrieveBlog(index) {
        return await http.get(`/page/blogs?page=${index}`)
    }
    static async retrieveBlogSlugs() {
        return await http.get(`/page/blogs/all`)
    }

}

export default blogService;