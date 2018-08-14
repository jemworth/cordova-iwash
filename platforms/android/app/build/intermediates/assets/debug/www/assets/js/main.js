// Initialize app and store it to myApp variable for futher access to its methods
var myApp = new Framework7();

// We need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;



// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

});

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'home') {
        // Following code will be executed for page with data-page attribute equal to "about"
        //myApp.alert('Here comes About page');
        //console.log("home page");
        var token= $$('meta[name="token"]').attr("content");
        //console.log("this is a token",token);


       /* var listHTML = '<ul>';
        for (var i = 0; i < 5; i++) {
            listHTML += '<li>' + i + '</li>';
        }
        listHTML += '</ul>';*/

        var url = "http://192.168.1.224/iwash/api/order";
        $$.ajax({
            type: "GET",
            dataType: "json",
            url: url,
            headers: {
                'Authorization': token,
            },
            success: function (data) {
                //console.log(data.data);
                //var listHTML = '';
                $$.each(data.data, function(k, v) {
                    /// do stuff
                    console.log("data for v");
                    console.log(v.branch_name);
                        var listHTML = '<div class = "list-block cards-list">';
                        listHTML += '<ul>';
                        listHTML += '<li class = "card">';
                        listHTML += '<div class = "card-header">'+ v.fname +" "+v.mname+" "+v.lname+'</div>';
                        listHTML += '<div class = "card-content">';
                        listHTML += '<div class = "card-content-inner">'+ v.service_type +'</div>';
                        listHTML += '</div>';
                        listHTML += '<div class = "card-footer">'+ v.date +'</div>';
                        listHTML += '</div>';
                        listHTML += '</li>';
                        listHTML += '</div>';
                        listHTML += '</ul>';
                        listHTML += '</div>';

                    $$(page.container).find('.page-content').append(listHTML);
                });



                // data.data.foreach(function(data){
                //     console.log(data);
                // });
            },
            error: function (error) {
                console.log("error");
                console.log(error);
            }
        });




        // for (var i = 0; i < 5; i++) {
        //     var listHTML = '<div class = "list-block cards-list">';
        //     listHTML += '<ul>';
        //     listHTML += '<li class = "card">';
        //     listHTML += '<div class = "card-header">Card Header</div>';
        //     listHTML += '<div class = "card-content">';
        //     listHTML += '<div class = "card-content-inner">Content</div>';
        //     listHTML += '</div>';
        //     listHTML += '<div class = "card-footer">Card footer</div>';
        //     listHTML += '</div>';
        //     listHTML += '</li>';
        //     listHTML += '</div>';
        //     listHTML += '</ul>';
        //     listHTML += '</div>';
        // }

        //$$(page.container).find('.page-content').append(listHTML);
    }
});

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    //myApp.alert('Here comes About page');
});

$$('#login').on('click', function(){
    console.log("add me");
    var username = $$("#username").val();
    console.log(username);
    //mainView.router.loadContent($$('#dashboard').html());
});

$$('.form-to-data').on('click', function(){
    var formData = myApp.formToData('#my-form');
    var username = formData.username;
    var password = formData.password;
    var data = {"username": username, "password": password };
    //console.log("meta data");
    //var meta = $$('meta[name="token"]').attr("content");
    //console.log(meta);
    //alert(data);



     $$.ajax({
        type: "POST",
        dataType: "json",
        url: "http://192.168.1.224/iwash/api/login",
        data: data,
        success: function (data) {
           //console.log(data);
           //console.log("token");
           //console.log(data.data.token);
              //app.addView('.view-main');


            $$('meta[name="token"]').attr("content", data.data.token);
            //var meta = $$('meta[name="token"]').attr("content");
            //console.log(meta);


            mainView.router.loadContent($$('#dashboard').html());

        },
        error: function (error) {
             //console.log(error);
             var response_message = "";
             var message = JSON.parse(error.responseText);
            //console.log(message);
           // if(typeof message.error.username !== undefined) {
          if (typeof(message.error) != "undefined"){
                 var username_error = (message.error.username) ? message.error.username : "";
                   var password_error = (message.error.password) ? message.error.password : "";
                   response_message = username_error +" "+ password_error;
            }
            else {
                 response_message = message.message;
            }
             myApp.alert(response_message, "Iwash", function () {
                //app.closeModal('.login-screen');
             });
        }
    });
});

