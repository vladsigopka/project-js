

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
