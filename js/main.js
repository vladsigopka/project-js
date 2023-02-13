

Vue.component('producta', {
    template: `
   <div class="product">
	 <div class="product-image">
            <img :src="image" :alt="altText"/>
        </div>
        <div class="product-info">
            <h1>{{ title }}</h1>
            <br>
            <p v-if="variants.variantQuantity >= 10">In stock</p>
            <p v-else-if="variants.variantQuantity <= 10 && variants.variantQuantity > 0">Almost sold out!</p>
            <p v-else
            style=" text-decoration: line-through"
            >Out of stock</p>
           
            <div
                    class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor:variant.variantColor }"

                    @mouseover="updateProduct(index)"
            ></div>
            <div v-for="size in sizes">
                <p>{{size}}</p>
            </div>

            <span v-if="onSale">  {{Sale}} </span><br>
           
            <button
                    v-on:click="addToCart"
                    :disabled="!inStock"
                    :class="{disabledButton : !inStock}"
            >
                Add to cart
            </button>

            <button v-on:click="removeToCart">Remove to cart</button>

            <p>Shipping: {{ shipping }}</p>
             <div>
                <h2>Reviews</h2>
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                  <li v-for="review in reviews">
                  <p>{{ review.name }}</p>
                  <p>Rating: {{ review.rating }}</p>
                  <p>{{ review.review }}</p>
                  </li>
                </ul>
                </div>

           
            <product-review @review-submitted="addReview"></product-review>

            
            
               
</div>

        </div>
        </div>
   </div>
 `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',

            altText: "A pair of socks",

            selectedVariant: 0,

            onSale: true,

            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 1
                }
            ],

            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            reviews: []

        }
    },
    methods: {
        addToCart() {
                this.$emit('add-to-cart',
            this.variants[this.selectedVariant].variantId);

        },
        addReview(productReview) {
            this.reviews.push(productReview)
        },

        removeToCart(){
            this.$emit( 'remove-to-cart',
        this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },



    },
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },

    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        Sale(){
            return  this.brand + ' ' + this.product + ' ' + 'сейчас по скидке'
        }
    }
})
Vue.component('product-details', {
    template: ` <div class = 'det'>
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
            </div>
`,data() {
        return {
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
        }
    }
})
Vue.component('product-review', {
    template: `

  <form class="review-form" @submit.prevent="onSubmit">
 <p>
   <label for="name">Name:</label>
   <input id="name" v-model="name" placeholder="name">
 </p>

 <p>
   <label for="review">Review:</label>
   <textarea id="review" v-model="review"></textarea>
 </p>

 <p>
   <label for="rating">Rating:</label>
   <select id="rating" v-model.number="rating">
     <option>5</option>
     <option>4</option>
     <option>3</option>
     <option>2</option>
     <option>1</option>
   </select>
 </p>

 <p>
   <input type="submit" value="Submit"> 
 </p>
</form>

 `,
    data() {
            return {
                name: null,
                review: null,
                rating: null,

            }

    },

    methods:{
        onSubmit() {
            let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating
            }
            this.$emit('review-submitted', productReview)
            this.name = null
            this.review = null
            this.rating = null
        }
    }


})


let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);

        },
        removeToCart(){
            this.cart.pop();
        }
    }


});
