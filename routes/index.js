const express = require('express');
const router = express.Router();

const fs = require('fs/promises');

const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = 'https://nkzqjyyupuffvgqcrcxy.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const formatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short"
});

let words = null;
let links = null;

async function getData() {
  const { data, error } = await supabase
    .from("poems")
    .select("*");
  
  if (data) {
    console.log(data);
    data.forEach(entry => {
      const createdAt = entry.created_at;
      if (createdAt) {
        const date = new Date(createdAt);
        const dateStr = formatter.format(date);
        entry.created_at = dateStr;
      }

      const text = entry.text;
      if (text) {
        const lines = text.split("\n").map(line => line.split(" "));
        entry.text = lines;
      }
    });
  }

  return { data, error };
}

async function submitData(body) {
  const { data, error } = await supabase
    .from("poems")
    .insert([body])
    .select();
  
  return { data, error };
}

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/archive', (req, res, next) => {
  res.render('archive');
});

router.get('/fetch', async (req, res, next) => {
  const { data, error } = await getData();
  console.log("gotten", { data, error });
  res.send({ data, error });
});

router.get('/about', async (req, res, next) => {
  res.render('about');
});

router.post('/submit', async (req, res, next) => {
  const body = req.body;
  const { data, error } = await submitData(body);
  res.send({ data, error });
});

module.exports = router;
