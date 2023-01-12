let productModal = null;
let deleteModal = null;

const app = Vue.createApp({
  data() {
    return {
      products: [],
      isNew: false,
      addImg: false,
      newImg: "",
      selectProduct: {
        data: {
          title: "",
          category: "",
          origin_price: null,
          price: null,
          unit: "",
          description: "",
          content: "",
          is_enabled: 0,
          imageUrl: "",
          imagesUrl:['']
        },
      },
    };
  },
  methods: {
    checkAdmin() {
      axios
        .post(`${apiUrl}v2/api/user/check`)
        .then((res) => {
          this.renderData();
        })
        .catch((err) => {
          alert(`您不是後台管理員`);
          window.location = "login.html";
        });
    },
    renderData() {
      axios
        .get(`${apiUrl}v2/api/${path}/admin/products`)
        .then((res) => {
          this.products = res.data.products;
          this.clearProduct();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    updateProduct(e) {
      if (this.isNew) {
        axios
          .post(`${apiUrl}v2/api/${path}/admin/product`, this.selectProduct)
          .then((res) => {
            alert(res.data.message);
            this.renderData();
            productModal.hide();
            this.isNew = false;
          })
          .catch((err) => {
            alert(err.data.message)
          });
      } else {
        let id = this.selectProduct.data.id;
        axios
          .put(
            `${apiUrl}v2/api/${path}/admin/product/${id}`,
            this.selectProduct
          )
          .then((res) => {
            alert(res.data.message);
            productModal.hide();
            this.renderData();
          })
          .catch((err) => alert("產品更新失敗"));
      }
    },
    deleteProduct() {
      let id = this.selectProduct.data.id;
      axios
        .delete(`${apiUrl}v2/api/${path}/admin/product/${id}`)
        .then((res) => {
          alert(res.data.message);
          deleteModal.hide();
          this.renderData();
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
    openModal(status, product) {
      if (status == "new") {
        this.selectProduct.data = {};
        this.isNew = true;
        this.newImg = '';
        productModal.show();
        this.selectProduct.data.imagesUrl = [];
      } else if (status == "edit") {
        this.selectProduct.data = { ...product };
        productModal.show();
      } else if (status == "delete") {
        this.selectProduct.data = { ...product };
        deleteModal.show();
      }
    },
    clearProduct() {
      this.selectProduct.data = {};
      this.isNew = false;
      this.clearImg();
    },
    addNewImg() {
      if(!this.selectProduct.data.hasOwnProperty('imagesUrl')){
        this.selectProduct.data.imagesUrl = [];
      }
      this.selectProduct.data.imagesUrl.push(this.newImg);
      this.clearImg();
    },
    clearImg() {
      this.newImg = "";
      this.addImg = false;
    },
    deleteImg(key) {
      this.selectProduct.data.imagesUrl.splice(key, 1);
    },
  },
  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexschool\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;
    this.checkAdmin();
    productModal = new bootstrap.Modal(document.getElementById("productModal"));
    deleteModal = new bootstrap.Modal(
      document.getElementById("delProductModal")
    );
  },
});

app.mount("#app");
