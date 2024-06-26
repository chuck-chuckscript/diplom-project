import axios from "axios";

const host = 'http://z96603x3.beget.tech/server/'


class ApiBlog{

    static async login(data){
        try{
            let response = await axios.postForm(host + 'login', {data});
          
            return response;
        }
        catch(e){
            return e;
        }
    }
    static async logout(){
        try{
            let response = await axios.postForm(host + 'logout', {
                refresh_token: localStorage.getItem('refresh_token')
            });

            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');

            return response;
        }
        catch(e){
            return e;
        }
    }
    static async sendComment(data){
        let response = await axios.postForm(host + 'createComment/'+data.post_id, data);
        return response.data;
    }
    static async getComments(id){
        let response = await axios.get(host + 'getComments/'+id);
        return response.data;
    }

    static async sendCode(data){
        try{
            let response = await axios.postForm(host + 'changePass/', data);
            return response;
        }
        catch(e){
            return e;
        }
    }

    static async verifyCode(code){
        try{
            let response = await axios.postForm(host + 'updatePass/', {
                code: code,
            });

            return response;
        }
        catch(e){
            return e;
        }
    }

    static async checkIsAuth(){
        try{
            let response = await axios.postForm(host + 'checkAuth/', {
                access_token: localStorage.getItem('access_token'),
                refresh_token: localStorage.getItem('refresh_token')
            });
          
            return response;
        }
        catch(e){
            return e;
        }
    }

    static async registration(data){
        try{
            let response = await axios.postForm(host + 'register', data);
          
            return response;
        }
        catch(e){
            return e;
        }
    }

    static async login(data){
        try{
            let response = await axios.postForm(host + 'login', data);
          
            return response;
        }
        catch(e){
            return e;
        }
    }
    static async uploadAvatar(data){
        try{
            let response = await axios.postForm(host + 'uploadAvatar/', {
                file: data.file,
                access_token: localStorage.getItem('access_token')
            });
          
            return response;
        }
        catch(e){
            return e;
        }
    }
    static async changeUserData(data){
        try{
            let response = await axios.postForm(host + 'changeData/', {
                name: data.name,
                email: data.email,
                access_token: localStorage.getItem('access_token')
            });
          
            return response;
        }
        catch(e){
            return e;
        }
    }
    static async getPosts(data){
        let response = await axios.postForm(host + 'searchPost/'+data.limit +'/'+data.page, {
            search: data.search
        });
      
        return response.data;
    }
    static async getSubInfo(url, id, data){
        try{
            let response = await axios.postForm(host + `${url}/${id}`, data);
          
            return response;
        }
        catch(e){
            return e;
        }
    }

    static async checkSub(id){
        try{
            let response = await axios.postForm(host + `checkSub/${id}`, {
                access_token: localStorage.getItem('access_token')
            });
          
            return response;
        }
        catch(e){
            return e;
        }
    }
    static async subscribe(id){
        try{
            let response = await axios.postForm(host + `subscribe/${id}`, {
                access_token: localStorage.getItem('access_token')
            });
          
            return response;
        }
        catch(e){
            return e;
        }
    }
    
    static async comeOff(commOffId){
        try{
            let response = await axios.postForm(host + `comeOff/${commOffId}`, {
                access_token: localStorage.getItem('access_token')
            });
          
            return response;
        }
        catch(e){
            return e;
        }
    }

    static async getUserById(id){
        try{
            let response = await axios.get(host + 'user/'+id);
          
            return response;
        }
        catch(e){
            return e;
        }
    }
    static async getUserPostsById(id){
        try{
            let response = await axios.get(host + 'userPosts/'+id);
          
            return response;
        }
        catch(e){
            return e;
        }
    }
    static async getUserPostsWithSearch(id, search){
        try{
            let response = await axios.postForm(host + 'userPosts/'+id, {
                search: search
            });
          
            return response;
        }
        catch(e){
            return e;
        }
    }
    static async getPostById(id){
        try{
            let response = await axios.get(host + 'post/'+id);
          
            return response;
        }
        catch(e){
            return e;
        }
    }

    static async createPost(data){
        try{
            let response = await axios.postForm(host + 'addPost/', data);
          
            return response;
        }
        catch(e){
            return e;
        }
    }
    static async editPost(data){
        try {
            let response = await axios.postForm(host + 'editPost/', data);
            return response;
        } 
        catch (e) {
            return e;
        }
    }
    static async createReport(data){
        let response = await axios.postForm(host + 'reportComment/'+data.comment_id, data)
        return response.data
    }

    static async createPostReport(data){
        let response = await axios.postForm(host + 'reportPost/'+data.post_id, data)
        return response.data
    }
    static async getReportsComments(data){
        let response = await axios.postForm(host + 'getReportsComments/'+data.limit+'/'+data.page, {
            search: data.search
        })
        return response.data
    }
    static async getReportsPosts(data){
        let response = await axios.postForm(host + 'getReportsPosts/'+data.limit+'/'+data.page, {
            search: data.search
        })
        return response.data
    }
    static async deleteReportComment(id){
        let response = await axios.postForm(host + 'deleteReportComment/'+id, {
            access_token: localStorage.getItem('access_token')
        })
        return response.data
    }
    static async deleteReportPost(id){
        let response = await axios.postForm(host + 'deleteReportPost/'+id, {
            access_token: localStorage.getItem('access_token')
        })
        return response.data
    }
    static async deleteComment(id){
        let response = await axios.postForm(host + 'deleteComment/'+id, {
            access_token: localStorage.getItem('access_token')
        })
        return response.data
    }
    static async getCommentById(id){
        let response = await axios.get(host + 'comment/'+id)
        return response.data
    }
    static async fetchAllposts(data){
        let response = await axios.postForm(host + 'searchPostMD/'+data.limit+'/'+data.page, {
            search: data.search,
            access_token: localStorage.getItem('access_token')
        });
        return response.data;
    }

    static async sendLike(id){
        let response = await axios.postForm(host + 'like/'+id, {
            access_token: localStorage.getItem('access_token')
        });
        return response.data;
    }
    static async unLike(id){
        let response = await axios.postForm(host + 'unlike/'+id, {
            access_token: localStorage.getItem('access_token')
        });
        return response.data;
    }

    static async sendDislike(id){
        let response = await axios.postForm(host + 'dislike/'+id, {
            access_token: localStorage.getItem('access_token')
        });
        return response.data;
    }
    static async unDislike(id){
        let response = await axios.postForm(host + 'undislike/'+id, {
            access_token: localStorage.getItem('access_token')
        });
        return response.data;
    }
    static async checkLikeStatus(id){
        let response = await axios.postForm(host + 'checkLikes/'+id, {
            access_token: localStorage.getItem('access_token')
        });
        return response.data;
    }


    static async deletePost(data){
        let response = await axios.postForm(host + 'deletePost/', {
            post_id: data.post_id,
            post_parent_dir: data.post_parent_dir,
            access_token: localStorage.getItem('access_token')
        });
        return response.data;
    }
    static async getUsersList(data){
        let response = await axios.postForm(host + 'searchUserA/'+data.limit+'/'+data.page, {
            search: data.search,
            access_token: localStorage.getItem('access_token')
        })

        return response.data;
    }

    static async addModerator(data){
        let response = await axios.postForm(host + 'regMod/', data);
        return response.data;
    }
    static async deleteUser(data){
        let response = await axios.postForm(host + 'deleteUser/', data);
        return response.data;
    }
    static async setBan(data){
        let response = await axios.postForm(host + 'ban/', data);
        return response.data;
    }
    static async checkBanStatus(id){
        let response = await axios.postForm(host + 'checkBanStatus/', {
            access_token: localStorage.getItem('access_token')
        });
        return response.data;
    }



}
export default ApiBlog;

