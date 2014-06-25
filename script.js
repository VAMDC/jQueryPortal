$(document).ready(function(){
    $('#go').click(function(){
        var query = $('input[name=querystring]').val();
        var url = 'http://vald.astro.uu.se/atoms-12.07/tap/sync?QUERY=select+all+where+AtomSymbol+%3D+%27U%27'
        var request = $.ajax({
url: url,
type: "GET",
});
request.done(function(data, textStatus, jqXHR ) {
        var headers = jqXHR.getAllResponseHeaders()
        var headers = jqXHR.getResponseHeader('VAMDC-COUNT-ATOMS')
        $('ul#results').append('<li>'+ data + headers +'</li>')
});
request.fail(function( jqXHR, textStatus ) {
alert( "Request failed: " + textStatus );
});
        });
    });
