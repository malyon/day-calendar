
var PeanutsCal = PeanutsCal || {};

PeanutsCal.Home = function() {

  function setComicStrip() {

    $.get('/comic', function(comicSrc) {
      if (comicSrc.url != null)
      {
        $('#comic-image').attr('src', comicSrc.url);
      }
    });
  }

  function setDate() {
    $('#date').text(moment().format('D'));
    $('#day').text(moment().format('dddd'));
    $('#month').text(moment().format('MMMM'));
  }

  return {
    init: function() {
      console.log('Setting comic strip');
      setComicStrip();
      setDate();
    }
  }

}
