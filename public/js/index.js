
var PeanutsCal = PeanutsCal || {};

PeanutsCal.Home = function() {

  function setComicStrip() {
    var date = new Date();
    console.log(date.getDay());
    var comicSrc;
    if (date.getDay() === 0)
    {
      comicSrc = 'http://www.peanuts.com/wp-content/comic-strip/color-low-resolution/desktop/' + 
          moment().format('YYYY') + '/Sundays/pe' + moment().format('YYMMDD') + 'comb_hs.jpg';
    }
    else
    {
      comicSrc = 'http://www.peanuts.com/wp-content/comic-strip/color-low-resolution/desktop/' + 
          moment().format('YYYY') + '/daily/pe_c' + moment().format('YYMMDD') + '.jpg';
    }
    $('#comic-image').attr('src', comicSrc);
  }

  function setDate() {
    $('#date').text(moment().format('D'));
    $('#day').text(moment().format('dddd'));
    $('#month').text(moment().format('MMMM'));
  }

  return {
    init: function() {
      setComicStrip();
      setDate();
    }
  }

}
