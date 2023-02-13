let eventBus = new Vue()


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
            <div 

            v-for="size in sizes"

        >
            <li>{{ size }}</li>

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

            
            

           <product-tabs 
           :reviews="reviews"
           :premium="premium"
           >
           
           
</product-tabs> 
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
                    variantQuantity: 0
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



        removeToCart(){
            this.$emit( 'remove-to-cart',
        this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },



    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)

        })
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
  <p v-if="errors.length">
 <b>Please correct the following error(s):</b>
 <ul>
   <li v-for="error in errors">{{ error }}</li>
 </ul>
</p>
<p>
<div class="picked">

        <p>Would you recommend this product?</p>
         <input type="radio" id="Yes" value="Yes" name="picked"  v-model="picked" />
          <label for="Yes">Yes</label>
          <br />
          <input type="radio" id="No" value="No" name="picked" v-model="picked" />
          <label for="No">No</label>
          <br />

        </div>  
         <label for="name">Name:</label>
   <input required id="name" v-model="name" placeholder="name">
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
                picked: '',
                errors: []

            }

    },

    methods:{
        onSubmit() {
            if (this.name && this.review && this.rating && this.picked) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    picked: this.picked
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.picked = null
            } else {
                if (!this.name) this.errors.push("Name required.")
                if (!this.review) this.errors.push("Review required.")
                if (!this.rating) this.errors.push("Rating required.")
                if (!this.picked) this.errors.push("Question required.")
            }
        }

}

    })

Vue.component('product-tabs', {
    template: `
     <div>   
       <ul>
         <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="(tab, index) in tabs"
               @click="selectedTab = tab"
         >{{ tab }}</span>
       </ul>
       <div v-show="selectedTab === 'Reviews'"
    > 
    <h2>Reviews</h2>
         <p v-if="!reviews.length">There are no reviews yet.</p>
         <ul>
                  <li v-for="review in reviews">
                  <p>Name:{{ review.name }}</p>
                  <p>Rating: {{ review.rating }}</p>
                  <p>Review:{{ review.review }}</p>
                  <span>Picked: {{ review.picked }}</span>
                  </li>
                </ul>
       </div>
       <div v-show="selectedTab === 'Make a Review'">
<product-review></product-review>

</div>
<div v-show="selectedTab === 'details'">
        <product-details></product-details>

</div>
<div v-show="selectedTab === 'Shipping'">
<p>Shipping: {{ shipping }}</p>
</div>
     </div>
`,
    props: {
        reviews: {
            type: Array,
            required: false
        },
        premium: {
            type: Boolean,
            required: true
        }
    },

    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'details', 'Shipping' ],
            selectedTab: 'Reviews'  // устанавливается с помощью @click
        }
    },
    computed: {
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
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
