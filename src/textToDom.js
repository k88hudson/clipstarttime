define([], function() {
  return function( html) {
    var domFragmentContainer = document.createElement( "div" );
    domFragmentContainer.innerHTML = html;
    return domFragmentContainer;
  };
});
