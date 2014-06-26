$(document).ready(function(){
    var url = 'http://vald.astro.uu.se/atoms-12.07/tap/sync';
    $('#selel').html('Li');

    $('#go').click(function(){
        var element = $('#selel').html();
        var lowave = $('#lower-input').val()
        var upwave = $('#upper-input').val()
        var request = $.ajax({
            url: url,
            data: {'QUERY':'select all where AtomSymbol = \''+element+
                '\' and RadTranswavelength < '+ upwave + 
                ' and RadTranswavelength > ' + lowave},
            type: "HEAD",
            beforeSend: function(xhr){xhr.setRequestHeader('VAMDC', 'vamdc');},
            });
        request.done(function(data, textStatus, jqXHR ){
            var ions = jqXHR.getResponseHeader('VAMDC-COUNT-ATOMS')
            var states = jqXHR.getResponseHeader('VAMDC-COUNT-STATES')
            var transitions = jqXHR.getResponseHeader('VAMDC-COUNT-RADIATIVE')
            var size = jqXHR.getResponseHeader('VAMDC-APPROX-SIZE')
            $('ul#results').append('<li>'+ element + ' ('+lowave+'-'+upwave+'&Aring;): ' +
                transitions + ' transitions between ' +
                states +' states in '+ ions + ' ions/isotopes.'
                +' ('+size+'MB)</li>')
        });
        request.fail(function( jqXHR, textStatus ){
            alert( "Request failed: " + textStatus );
        });
    });

    $('#fetch').click(function(){
        var element = $('#selel').html();
        var lowave = $('#lower-input').val()
        var upwave = $('#upper-input').val()
        var request = $.ajax({
            url: url,
            data: {'QUERY':'select all where AtomSymbol = \''+element+
                '\' and RadTranswavelength < '+ upwave + 
                ' and RadTranswavelength > ' + lowave},
            type: "GET",
            beforeSend: function(xhr){xhr.setRequestHeader('VAMDC', 'vamdc');},
            });
        request.done(function(data, textStatus, jqXHR ){
            $('table#statab').html('<tr><th>Element</th><th>Ionization</th><th>State ID</th><th>State Energy</th><th>Description</th></tr>');
            $('table#transtab').html('<tr><th>Wavelength</th><th>log(gf)</th><th>Lower State</th><th>Upper State</th></tr>');
            $(data).find('AtomicState').each(function(index){
                $('table#statab').append('<tr><td>'+
                $(this).parents('Atom').find('ElementSymbol').text()+
                '</td><td>'+$(this).parents('Atom').find('IonCharge').text()+
                '</td><td>'+$(this).attr('stateID')+'</td><td>'+
                $(this).find('StateEnergy Value').text()+'</td><td>'+
                $(this).find('Description').text()+'</td></tr>'
                );

            });
            $(data).find('RadiativeTransition').each(function(index){
                $('table#transtab').append('<tr><td>'+$(this).find('Wavelength Value').first().text()+'</td><td>'+$(this).find('Log10WeightedOscillatorStrength Value').text()+'</td><td>'+$(this).find('LowerStateRef').text()+'</td><td>'+$(this).find('UpperStateRef').text()+'</td></tr>');

            });
        });
        request.fail(function( jqXHR, textStatus ){
            alert( "Request failed: " + textStatus );
        });
    });


    function select_element(element){
                // alert(element.ATOMIC_NUMBER + ' : ' + element.SYMBOL);
        element = element.SYMBOL
        $('#selel').html(element);
            }
    $('#my_periodic').pte({ data : 'jquery.pte.lite.json', config : {size:34,spacing:2,x:60}, clickHandler : select_element });

$("#waveslider").noUiSlider({
    start: [400, 1000],
    step: 1,
    margin: 1,
    connect: true,
    orientation: 'horizontal',
    behaviour: 'tap-drag',
    range: {
        'min': 0,
        'max': 10000
    },
    serialization: {
        lower: [
            $.Link({
                target: $("#lower-input"),
            })
        ],
        upper: [
            $.Link({
                target: $("#upper-input"),
            })
        ],
        format: {
            mark: ',',
            decimals: 0,
        }
    }
});

});
