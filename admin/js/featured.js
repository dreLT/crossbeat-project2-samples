$(document).ready(function() {
  
  var model;
  // var getContentData = function(fn) {
    $.ajax({
      url: 'http://alpha.propitup.com/v1/content',
      dataType: 'json',
      success: function(data) {

        Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
                if (arguments.length < 3) {
                    throw new Error('Handlebars Helper equal needs 2 parameters');
                }
                if( lvalue!==rvalue ) {
                    return options.inverse(this);
                } else {
                    return options.fn(this);
                }
            });

        Handlebars.registerHelper('ifString', function(item, options) {
          if(typeof item === "string") {
          return options.fn(this);
          } else {
          return options.inverse(this);
          }
        });

        // Grab the template script
        var theTemplateScript = $("#content-template").html();

        // Compile the template
        var theTemplate = Handlebars.compile(theTemplateScript);

        var context = data;

        var theCompiledHtml = theTemplate(context);

        $("body").html(theCompiledHtml);

        $(".featured-checkbox").prop("checked", true);

        console.log(data);
        model = data;

        $("tr").on("change", "input", function() {
          var elementIndex = $(this).parents("tr").index();
          var contentId = data[elementIndex].content_id;
          if (this.checked) {
            $.ajax({
              type: 'PUT',
              url: 'http://alpha.propitup.com/v1/content/' + contentId + '/featured',
              dataType: 'json',
              success: function(data) {
                console.log('added');
                // $.ajax({
                //   url: 'http://alpha.propitup.com/v1/content',
                //   dataType: 'json',
                //   success: function(data) {
                //     console.log(data);
                //   }
                // });
              },
              error: function() {
                console.log('not added');
              }
            });
          }
          else if (!this.checked) {
            $.ajax({
              type: 'DELETE',
              url: 'http://alpha.propitup.com/v1/content/' + contentId + '/featured',
              dataType: 'json',
              success: function(data) {
                console.log('deleted');
                console.log(model);
              },
              error: function() {
                console.log('not deleted');
                console.log(model);
              }
            });
          }
        });
         
      },
      error: function() {
         console.log('no');
      }
    });

    // $.ajax({
    //   url: 'http://alpha.propitup.com/v1/content/',
    //   dataType: 'json',
    //   success: function(data) {

    //     // Grab the template script
    //     var theTemplateScript = $("#content-template").html();

    //     // Compile the template
    //     var theTemplate = Handlebars.compile(theTemplateScript);

    //     var context = data;

    //     var theCompiledHtml = theTemplate(context);

    //     $("body").html(theCompiledHtml);

    //     console.log(data);
         
    //   },
    //   error: function() {
    //      console.log('no');
    //   }
    // });
  });

  // }

  // $.ajax({
  //     type: GET,
  //     url: 'http://alpha.propitup.com/v1/content/1',
  //     dataType: 'json',
  //     contentType: 'application/json',
  //     success: function(data){
  //         callback(data);
  //     }
  // })

///v1/content/{id}/featured
