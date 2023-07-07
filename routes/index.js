var express = require('express');
var router = express.Router();

const { createClient } = require("@supabase/supabase-js");

async function getData() {
  const supabaseUrl = 'https://nkzqjyyupuffvgqcrcxy.supabase.co';
  const supabaseKey = process.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);
  let { data, error } = await supabase
    .from("poems")
    .select("*");
  console.log(data, error);
  if (data) {
    data.forEach(entry => {
      const createdAt = entry.created_at;
      if (createdAt) {
        const date = new Date(createdAt);
        console.log(date);
        entry.created_at = date;
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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/archive', async (req, res, next) => {
  const { data, error } = await getData();
  console.log("gotten", data, error);
  res.render('archive', { data, error });
});

module.exports = router;
