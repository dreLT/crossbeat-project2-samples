$(document).ready(function() {
  
  var model;
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

  });