const express = require('express')
const cors = require('cors')
const app = express()
const stripe = require('stripe')("key")
// const uuid = require('uuid/v5');
const uuid = require('uuid').v4


app.use(express.json())
app.use(cors())

app.post('/payment',(req,res) => {

    const {product,token} = req.body
    console.log("PRODUCT", product)
    console.log("PRICE",product.price)
    const idempotencyKey = uuid()

    return stripe.customers.create({
        email : token.email,
        source : token.id
    }).then(customer => {
        stripe.charges.create({
            amount : product.price*100,
            currency: 'INR',
            customer: customer.id,
            receipt_email: token.email,
            description: `purchase of product.name`,
            shipping: {
                name : token.card.name,
                address : {
                    country : token.card.address_country
                }
            } 
        }, {idempotencyKey})
    })
    .then(result => res.status(200).json(result))
    .catch(err => console.log(err))
})   

app.listen(5000,()=>{
    console.log('Server Listening to Port Number 5000...')
})