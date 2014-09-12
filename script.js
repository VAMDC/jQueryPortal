$(document).ready(function(){
    var valdurl = 'http://vald.astro.uu.se/atoms-12.07/tap/sync';
    $('#selel').html('Be');
    function hideall(){
        $('#transitionsbox').hide();
        $('#statesbox').hide();
        $('#plotbox').hide();
        $('#buttons2').hide();
    }
    hideall();
    $('#statsbox').hide();

    $('#go').click(function(){
        hideall();
        var element = $('#selel').html();
        var lowave = $('#lower-input').val()
        var upwave = $('#upper-input').val()
        var querystring = 'select all where AtomSymbol = \''+element+
            '\' and RadTranswavelength < '+ upwave +
            ' and RadTranswavelength > ' + lowave;
        $('#querystring').text(querystring);

        var request = $.ajax({
            url: valdurl,
            data: {'QUERY':querystring},
            type: "HEAD",
            beforeSend: function(xhr){xhr.setRequestHeader('VAMDC', 'vamdc');},
            });
        request.done(function(data, textStatus, jqXHR ){
            var ions = jqXHR.getResponseHeader('VAMDC-COUNT-ATOMS')
            var states = jqXHR.getResponseHeader('VAMDC-COUNT-STATES')
            var transitions = jqXHR.getResponseHeader('VAMDC-COUNT-RADIATIVE')
            var size = jqXHR.getResponseHeader('VAMDC-APPROX-SIZE')
            $('ul#results > li').each(function(){
                this.style.color = "#999";
            });
            $('ul#results').append('<li>'+ element + ' ('+lowave+'-'+upwave+'&Aring;): ' +
                transitions + ' transitions between ' +
                states +' states in '+ ions + ' ions/isotopes.'
                +' ('+size+'MB)</li>')
            $('#statsbox').show(200);
            $('#buttons2').show();
            $('html, body').animate({scrollTop: $("#go").offset().top}, 1000);

        });
        request.fail(function( jqXHR, textStatus ){
            alert( "Request failed: " + textStatus );
        });
    });

    var options = {
			lines: {
				show: true,
			},
			points: {
				show: true
			},
			xaxis: {
				//tickDecimals: 0,
				//tickSize: 1,
                //autoscaleMargin: 0.002
			},
        selection: {
				mode: "x"
			}
		};


    $('#plotbtn').click(function(){
        hideall();
        var queryurl=valdurl + '?QUERY=' + escape($('#querystring').text());
        //console.log(queryurl);
        var request = $.ajax({
            //url:'http://localhost:8001/specsynth/result/spec_21.json',
            url:'http://localhost:8001/specsynth/service',
            type:"POST",
            data: {'url':queryurl},
            dataType: "json",
			success: PlotData,
        });
        $('#plot1').empty();
        $('#plotbox').show(200);
        $('html, body').animate({scrollTop: $("#go").offset().top}, 1000);
    });


    var placeholder = $("#plot1");
    var data = [];
    var plot = $.plot(placeholder, data, options);

    function PlotData(rdata){
        data = [];
        for (var i = 0; i < rdata.length; i++) {
            data.push([rdata[i][0],0.0])
            data.push(rdata[i]);
            data.push([rdata[i][0],0.0])
        }
        plot = $.plot(placeholder, [data], options);
    }

	placeholder.bind("plotselected", function (event, ranges) {

		$("#selection").text(ranges.xaxis.from.toFixed(1) + " to " + ranges.xaxis.to.toFixed(1));

		$.each(plot.getXAxes(), function(_, axis) {
			var opts = axis.options;
			opts.min = ranges.xaxis.from;
			opts.max = ranges.xaxis.to;
		});
		plot.setupGrid();
		plot.draw();
		plot.clearSelection();
    });

	placeholder.dblclick(function () {
		plot = $.plot(placeholder, [data], options);
	});


    $('#fetch').click(function(){
        hideall();
        var element = $('#selel').html();
        var lowave = $('#lower-input').val()
        var upwave = $('#upper-input').val()
        var request = $.ajax({
            url: valdurl,
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
            $('#transitionsbox').show(200);
            $('#statesbox').show();
            $('html, body').animate({scrollTop: $("#transitionsbox").offset().top}, 1000);
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
    start: [500, 1650],
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
