require([
  "jquery",
  "jquery-ui",
  "jquery.beacon"
], function( $ ) {
  $(function() {
    var te1 = document.getElementById( "te1" ),
        $te = $( ".te" ),
        isDragging;

    $te.draggable({
      handle: ".clip",
      axis: "x",
      start: function() {
        isDragging = true;
        console.log( isDragging );
      }
    });

    String.prototype.toHHMMSS = function () {
        sec_numb    = parseInt(this);
        var hours   = Math.floor(sec_numb / 3600);
        var minutes = Math.floor((sec_numb - (hours * 3600)) / 60);
        var seconds = sec_numb - (hours * 3600) - (minutes * 60);

        if ( minutes < 10 && hours ) {minutes = "0"+ minutes;}
        if ( seconds < 10 ) {seconds = "0" + seconds;}
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

    function onMouseUp( e ) {
      if ( isDragging ) {
        isDragging = false;
        console.log( isDragging );
        return;
      }
      $( te1 ).draggable( "disable" );
      te1.classList.add( "editing" );
      te1.removeEventListener( "mouseup", onMouseUp, false );
      $( ".clip", te1 ).resizable({handles: "e, w"}).draggable({axis: "x"});
      document.addEventListener( "click", turnOffEditing( te1 ), false );
    }

    te1.addEventListener( "mouseup", onMouseUp, false );


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
        $( ".tooltip-content", $startTooltip ).html( (ui.position.left + "" ).toHHMMSS() );
        $( ".tooltip-content", $endTooltip ).html( (ui.size.width + ui.position.left + "").toHHMMSS() );
        $trayTe.css( "width", ui.size.width + "px" );
      },
      stop: function( e, ui ) {
        ui.element.removeClass( "tooltip-on" );
      }
    });

    $( ".proto-note" ).slideDown( "medium" );
  });
});
