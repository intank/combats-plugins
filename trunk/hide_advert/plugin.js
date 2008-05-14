(function(){
  var imgs = top.frames['bottom'].document.images;
  for(var i=0; i<imgs.length; i++) {
    if (imgs[i].src.search('a___dlr.gif')>=0) {
      imgs[i].style.display='none';
      break;
    }
  }
})();