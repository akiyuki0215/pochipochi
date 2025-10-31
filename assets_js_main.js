// Progressive enhancement: only enhance for mobile
(function(){
  var burger = document.querySelector('.hamburger');
  var nav = document.getElementById('mainnav');
  if (!burger || !nav) return;
  burger.addEventListener('click', function(){
    var expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });
})();
