$(document).ready(function(){
    $('#go').click(function(){
        var query = $('input[name=querystring]').val();
        var url = 'http://vald.astro.uu.se/atoms-12.07/tap/sync?QUERY=select+all+where+AtomSymbol+%3D+%27U%27';
        var request = $.ajax({
            url: url,
            type: "HEAD",
            beforeSend: function(xhr){xhr.setRequestHeader('VAMDC', 'vamdc');},
            });
        request.done(function(data, textStatus, jqXHR ){
            var header = jqXHR.getResponseHeader('X-VAMDC-COUNT-ATOMS')
            var header = jqXHR.getAllResponseHeaders()
            $('ul#results').append('<li>'+ header +'</li>')
        });
        request.fail(function( jqXHR, textStatus ){
            alert( "Request failed: " + textStatus );
        });
    });

    $('#infopop').click(function(){
        $('#infopop').popover('toggle')
    });

});
