const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const credentials = require('./credentials.json')


const app = express();
app.use(cors());
app.use(express.json())

const con = mysql.createConnection(credentials)
con.connect();
// const credentials = JSON.parse(fs.readFileSync)

const productMapper = (e) => {
    return {
        id: e.id,
        name: e.name,
        price: e.price,
        quantity: e.quantity,
        category: e.category,
        checked: false
    }
}

const table = 'cart'

app.get('/products', (req, res) => {
    const query = `SELECT * FROM ${table} ORDER BY id`;
    con.query(query, [], (err, rows) => {
        let mobiles = rows.filter((row) => {
            return row.category === 'mobile'
        }).map(productMapper)

        let computers = rows.filter((row) => {
            return row.category === 'computer'
        }).map(productMapper)

        let books = rows.filter((row) => {
            return row.category === 'book'
        }).map(productMapper)
        return res.json({ ok: true, mobiles, computers, books })
    })
})

app.put('/product/:id/:quantity', (req, res) => {
    const { id, quantity } = req.params;
    const query = `UPDATE ${table} SET quantity=? WHERE id=?`;
    con.query(query, [quantity, id], (err, data) => {
        if (err)
            return res.status(500).send({ err })
        console.log(data)
        res.send({ ok: true, data });
    })
})

app.delete('/product/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM ${table} WHERE id=?`;
    console.log(query)
    con.query(query, [id], (err, data) => {
        if (err)
            return res.status(500).send({ err })
        console.log(data)
        res.send({ ok: true, data });
    })
})

app.post('/product', (req, res) => {
    console.log(req.body)
    const { name, price, category } = req.body;

    con.query("SELECT * FROM cart WHERE name=?", [name], (err, products) => {

        if (err)
            return res.status(500).send({ err })

        if (products.length > 0)
            return res.send({ ok: false, msg: "Name already exist!" });

        const query = `INSERT INTO ${table}(name, price, quantity, category) VALUES (?,?,?,?)`
        con.query(query, [name, parseFloat(price), 1, category], (err, data) => {
            // console.log(data)
            if (err)
                return res.status(500).send({ err })
            res.send({ ok: true, id: data.insertId });
        })
    })


})

const port = 3443;
app.listen(port, () => {
    console.log(`Listen on port ${port}`);
})
