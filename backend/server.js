const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

const app = express();
const cors = require('cors');

app.use(cors({
  origin: 'https://expenstrck.netlify.app',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));
app.use(bodyParser.json());

app.post('/api/expenses', (req,res)=>{
    const{amount, category, date} = req.body;
    console.log(req.body);
    const sql = 'INSERT into expenses(amount,category,date)VALUES(?,?,?)';
    db.query(sql, [amount,category,date], (err, result)=>{
        if(err) return res.status(500).json({error:err});
        res.status(201).json({id: result.insertId,amount,category,date});
    });
});

app.get('/api/expenses', (req,res)=>{
    db.query('SELECT *from expenses ORDER by date DESC', (err,results)=>{
        if(err) return res.status(500).json({error:err});
        res.json(results);
    });
});

app.delete('/api/expenses/:id', (req,res)=>{
    const id = req.params.id;
    db.query('DELETE from expenses WHERE id = ?',[id],(err)=>{
        if(err) return res.status(500).json({error:err});
        res.json({message: 'Expense deleted'});
    });
});

app.listen(5000, ()=>{
    console.log('Server is running on port 5000');
});