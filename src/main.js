require([
  "jquery",
  "jquery-ui",
  "jquery.beacon"
], function( $ ) {
  $(function() {

    function toHHMMSS( n ) {
        n = parseInt( n );
        var hours = Math.floor( n / 3600);
        var minutes = Math.floor(( n - (hours * 3600)) / 60);
        var seconds =  n - (hours * 3600) - (minutes * 60);

        if ( minutes < 10 && hours ) { minutes = "0"+ minutes; }
        if ( seconds < 10 ) { seconds = "0" + seconds; }
        var time = ( hours > 0 && ( hours +':' ) || "" ) + minutes + ':' + seconds;
        return time;
    }

    function turnOffEditing( target ) {
      var f = function ( e ) {
        console.log( "turnOff" );
        if ( e.target === target || $.contains( target, e.target ) ) {
          return;
        }
        turnOffEditing( target );
        $( target ).draggable( "enable" );
        target.classList.remove( "editing" );
        target.addEventListener( "mouseup", onMouseUp, false );
        $( ".clip", te1 ).resizable("destroy").draggable("destroy");
        document.removeEventListener( "click", f, false );
      }
      return f;
    }

    var $eHandle,
        $wHandle,
        $tooltipTemplate =  $( '<div class="tooltip"><span class="tooltip-content"></span><span class="tooltip-tip"><span></span></span></div>' ),
        $startTooltip = $tooltipTemplate.clone(),
        $endTooltip = $tooltipTemplate.clone(),
        $tooltips = [ $startTooltip, $endTooltip ],
        $trayTe = $( "#te-eg" );

    $trayTe.css( "width", $( ".clip-section" ).width() + "px" ).removeClass( "hide" );

    $( ".clip-section" ).resizable({
      handles: "w, e",
      containment: "parent",
      create: function( e, ui ) {

        $.each( $tooltips, function( i, $el ) {
          $el.css({
            width: "60px",
            marginLeft: "-32px",
            marginTop: "16px"
          });
        });

        $( ".tooltip-content", $startTooltip ).html( "0:00" );
        $( ".tooltip-content", $endTooltip ).html( "0:00" );

        $eHandle = $( ".ui-resizable-e", ui.element );
        $wHandle = $( ".ui-resizable-w", ui.element );

        $wHandle.append( $startTooltip ).attr( "data-tooltip", true );
        $eHandle.append( $endTooltip ).attr( "data-tooltip", true );

      },
      start: function( e, ui ) {
        ui.element.addClass( "tooltip-on" );

      },
      resize: function( e, ui ) {
        $( ".tooltip-content", $startTooltip ).html( toHHMMSS( ui.position.left ) );
        $( ".tooltip-content", $endTooltip ).html( toHHMMSS( ui.size.width + ui.position.left ) );
        $trayTe.css( "width", ui.size.width + "px" );
      },
      stop: function( e, ui ) {
        ui.element.removeClass( "tooltip-on" );
      }
    });

    $( ".proto-note" ).slideDown( "medium" );

  });
});
