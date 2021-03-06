var request = require('request')
  , ig = require('instagram-node').instagram();


exports.index = function(req, res){
  res.render('index', { title: 'Cooper Union Instagram Proxy' });
};

exports.json = function(req, res, next) {
  res.set({
    'Content-Type':'application/json',
    'Access-Control-Allow-Origin':'*'
  });

  next();
};

exports.instagram_search = function(req, res) {

  ig.use({ client_id: process.env.CLIENT_ID, client_secret: process.env.CLIENT_SECRET});
  ig.tag_media_recent(req.params.search, function(err, medias, pagination, remaining, limit) {

    res.end(JSON.stringify(medias));
  });


};

exports.instagram_location = function(req, res) {
  ig.use({ client_id: process.env.CLIENT_ID, client_secret: process.env.CLIENT_SECRET});

  ig.location_search({ lat: parseFloat(req.params.lat), lng: parseFloat(req.params.long) }, function(err, result, remaining, limit) {

    var resultCache = [];
    for(i in result) {
      ig.location_media_recent(result[i].id, {min_timestamp:1388534400}, function(err, result, pagination, remaining, limit) {
        // console.log(err, result);
        for(j in result) {
          resultCache.push(result[j]);
        }

        if(i = result.length -1 ){
          res.end(JSON.stringify(resultCache));
        }
      });

    }

  });

};


exports.instagram_user_search = function(req, res) {
  ig.use({ client_id: process.env.CLIENT_ID, client_secret: process.env.CLIENT_SECRET});
  ig.user_search(req.params.username, function(err, users, remaining, limit) {

    res.end(JSON.stringify(users));
  });
};

exports.instagram_user_info = function(req, res) {
  ig.use({ client_id: process.env.CLIENT_ID, client_secret: process.env.CLIENT_SECRET});
  ig.user(req.params.username, function(err, result, remaining, limit) {

    res.end(JSON.stringify(result));
  });
};

exports.instagram_tag_media_recent = function(req, res) {
  ig.use({ client_id: process.env.CLIENT_ID, client_secret: process.env.CLIENT_SECRET});
  var count = (req.query.count && (req.query.count <= 100)) ? req.query.count : 15;
  var max_tag_id = (req.query.max_tag_id) ? req.query.max_tag_id : null;
  var min_tag_id = (req.query.min_tag_id) ? req.query.min_tag_id : null;
  ig.tag_media_recent(req.params.tag, {count:count, min_tag_id: min_tag_id, max_tag_id: max_tag_id}, function(err, medias, pagination, remaining, limit) {
    if(max_tag_id || min_tag_id) {
      res.end(JSON.stringify({media:medias,pagination:pagination}));
    } else {
      res.end(JSON.stringify(medias));
    }

  });
};

exports.instagram_location_venue = function(req, res) {

  console.log("debugging")
  ig.use({ client_id: process.env.CLIENT_ID, client_secret: process.env.CLIENT_SECRET});

  ig.location(req.params.id, function(err, result, remaining, limit) {
    console.log(err);
    res.end(JSON.stringify(result));
  });

};

exports.instagram_media_search = function(req, res) {

  ig.use({ client_id: process.env.CLIENT_ID, client_secret: process.env.CLIENT_SECRET});

  // $.getJSON("https://api.instagram.com/v1/media/search?lat=48.858844&lng=2.294351&access_token=ACCESS-TOKEN",function(response)

  var lat = parseFloat(req.query.lat);
  var lng = parseFloat(req.query.lng);

  var max_timestamp = (req.query.max_timestamp) ? req.query.max_timestamp : null;
  var min_timestamp = (req.query.min_timestamp) ? req.query.min_timestamp: null;
  var count = (req.query.count && (req.query.count <= 100)) ? req.query.count : 15;

  var options = {
    max_timestamp: max_timestamp,
    min_timestamp: min_timestamp,
    count: count
  };

  ig.media_search(lat, lng, options, function(err, medias, remaining, limit) {
  // ig.media_search(48.4335645654, 2.345645645, function(err, medias, remaining, limit) {

    console.log(err);
    res.end(JSON.stringify(medias));
  });

};

exports.instagram_user_media_recent = function(req, res) {

  ig.use({ client_id: process.env.CLIENT_ID, client_secret: process.env.CLIENT_SECRET});

  ig.user_media_recent(req.params.username, function(err, medias, pagination, remaining, limit) {
  // ig.media_search(48.4335645654, 2.345645645, function(err, medias, remaining, limit) {

    console.log(err);
    res.end(JSON.stringify(medias));
  });

};



// ig.tag_media_recent('tag', [options,] function(err, medias, pagination, remaining, limit) {});
