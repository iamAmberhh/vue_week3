const app = Vue.createApp({
    data(){
        return{
            user:{
                username:'',
                password:''
            }
        }
    },
    methods:{
        submit(){
            axios.post(`${apiUrl}v2/admin/signin`,this.user)
            .then(res=>{
                const {token,expires} = res.data
                document.cookie =`hexschool=${token}; expires=${expires};`;
                window.location = 'product.html';
            })
            .catch(err=>{
                alert(`登入失敗，請確認帳號密碼`)
            })
        }
    },
})
app.mount('#app');