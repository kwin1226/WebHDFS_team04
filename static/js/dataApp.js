$(function() {
    var cur_loca = "";
    var myAJAX = new initAJAX();   //new ajax object
    myAJAX.ajaxHandle.init();       //init ajax

    // $('#panel').on('click', 'table tr', function(){
    // e.preventDefault();
    // // var getLocation = this.name;
    // alert('hi');
    // // tempthis.DeleteDir(getLocation);
    // });

  //   $('button#calculate').bind('click', function() {
  //     // .getJSON() 等於用 'json'資料類型的 .ajax()
  //     $.getJSON($SCRIPT_ROOT + '/_add_numbers', {
  //       a: $('input[name="a"]').val(),
  //       b: $('input[name="b"]').val()
  //     }, function(data) {
  //       $("#result").text(data.result);
  //     });
  });


 function initAJAX(){

   this.ajaxHandle = {

       init: function(){
            var tempthis = this ;
            // this.GetDirList();
            // $('div#panel').find('table a').click(function(e){
            // e.preventDefault();
            // var getLocation = this.name;
            // alert(getLocation);
            // // tempthis.DeleteDir(getLocation);
            // });
            $("button#del_list").click(function(e){
            e.preventDefault();
             var getLocation = this.name;
             console.log(getLocation);
             tempthis.DeleteDir(getLocation);
            });

            $("button#get_list").click(function(e){
            e.preventDefault();
            tempthis.GetDirList();
            });
       },
       DeleteDir: function(getLocation){
        var tempthis = this ;
         $.ajax({
           type:"GET",
           url: $SCRIPT_ROOT + "/_del_list",
           dataType: 'json', 
           data: { 
                    cur_url: getLocation
                 },
           success: function(data) 
                 {
                    alert("Delete File success: " + data.boolean);
                    tempthis.GetDirList();
                   // $('#result1').text(data.result); //result對應response JSON名稱
                 },
           error: function(xhr, ajaxOptions, thrownError) 
                 {
                   console.log(xhr.status);
                   console.log(thrownError);
                 }
        });
      },
       GetDirList: function(){
         $.ajax({
           type:"GET",
           url: $SCRIPT_ROOT + "/_get_list",
           dataType: 'json', 

           data: { 
                    cur_url: $('input[name="cur_url"]').val()
                 },
           success: function(data) 
                 {
                   var resObj = data.FileStatuses.FileStatus;
                   cur_loca = $('input[name="cur_url"]').val();
                   ListDirCallback(resObj);
                   // alert("success:" + cur_loca);
                 },
           error: function(xhr, ajaxOptions, thrownError) 
                 {
                   console.log(xhr.status);
                   console.log(thrownError);
                 }
        });
      }

    }
  }

  function ListDirCallback(resObj){
    $('div#panel').find('table').remove();
    var t0 ='<div id=panel style="font-size: 18px;"><table class="table"><thead><tr>'+
            '<th style="text-align:center;">Permission</th>'+
            '<th style="text-align:center;">Owner</th>'+
            '<th style="text-align:center;">Group</th>'+
            '<th style="text-align:center;">Size(bytes)</th>'+
            '<th style="text-align:center;">Last Modified</th>'+
            '<th style="text-align:center;">Replication</th>'+
            '<th style="text-align:center;">Block Size</th>'+
            '<th style="text-align:center;">Name</th>'+
            '</tr></thead><tbody>';
    // $('#result2').text(resObj[1].accessTime); //result對應response JSON名稱
    $.each(resObj, function(index, data){
     t0 += '<tr><td id=dataRow' + index + '>'+data.permission +'</td><td id=dataRow' + index + '>' + data.owner + '</td><td id=dataRow' + index + '>' + data.group + '</td><td id=dataRow' + index + '>' +  Sizecul(data.length) + '</td><td id=dataRow' + index + '>' + moment(data.modificationTime).format('YYYY/MM/DD HH:MM') + '</td><td id=dataRow' + index + '>'+  data.replication + '</td><td id=dataRow' + index + '>' + Sizecul(data.blockSize) + '</td><td id=dataRow' + index + '>' + data.pathSuffix +'</td><td id=dataRow' + index + '>'+'<button href="#" id="delete_btn" class="btn btn-outline" name='+ cur_loca+'/'+ data.pathSuffix + ' style="margin-top: 0px;padding:3px 5px;font-size:10px" >' +'delete'+'</button>'+'</td></tr>';
    });
    t0+= '</tbody></table></div>'
    $('#result2').after(t0);
  }

 function Sizecul (v) {
      var UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'ZB'];
      var prev = 0, i = 0;
      while (Math.floor(v) > 0 && i < UNITS.length) {
        prev = v;
        v /= 1024;
        i += 1;
      }

      if (i > 0 && i < UNITS.length) {
        v = prev;
        i -= 1;
      }
      return Math.round(v * 100) / 100 + ' ' + UNITS[i];
    }