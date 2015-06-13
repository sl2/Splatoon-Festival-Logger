var r = require('request');
var CronJob = require('cron').CronJob;
var fs = require('fs');

var url = 'http://s3-ap-northeast-1.amazonaws.com/splatoon-data.nintendo.net/';
var info = 'fes_info.json?';
var result = 'fes_result.json?';
var results = 'recent_results.json?';
var rank = 'contribution_ranking.json?';

function get_result(date) {
  var rice = 0;
  var bread = 0;
  var req_url = url + result + date;

  r(req_url,function(err,res,body){
      var result = JSON.parse(body);
      out(date, result);
  });
}

function get_info(date) {
  var rice = 0;
  var bread = 0;
  var req_url = url + info + date;

  r(req_url,function(err,res,body){
      var info = JSON.parse(body);
      out(date, info);
  });
}


function get_results(date){
    var rice = 0;
    var bread = 0;
    var req_url = url + results + date;
   
    out(date, "date," + new Date());

    r(req_url,function(err,res,body){
        var arr = JSON.parse(body);
        for (i in arr){
            var json = arr[i];

            var result = date+","+json['win_team_name']+","+json['win_team_mvp'];
            out(date, result);

            var win = json['win_team_name'];
            if (win === 'ごはん'){
                rice++;
            } else if (win === 'パン'){
                bread++;
            } else {
                console.log("error:"+win);
            }
        }

        var winrate_rice = Math.round((rice / (rice+bread))*100,2);
        var winrate_bread = Math.round((bread / (rice+bread))*100,2);
        var r = "Result Rice ," + date + "," + rice + "," + winrate_rice;
        var b = "Result Bread," + date + "," + bread + "," + winrate_bread;
        out(date, r);
        out(date, b);
    });
}

function single() {
    var c = parseInt(new Date()/1000)
    get_results(c);
}

function out(date, text){
    console.log(text);
    fs.appendFileSync('./out/result_' + date + '.txt', text+'\n');
}

var interval = "*/3 * * * *";

var job = new CronJob({
    cronTime:interval,
    onTick:single
});

job.start();


