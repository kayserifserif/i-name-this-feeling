var express = require('express');
var router = express.Router();

const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = 'https://nkzqjyyupuffvgqcrcxy.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const formatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short"
});

async function getData() {
  const { data, error } = await supabase
    .from("poems")
    .select("*");
  
  if (data) {
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
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/archive', async (req, res, next) => {
  const { data, error } = await getData();
  console.log("gotten", data, error);
  res.render('archive', { data, error });
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
