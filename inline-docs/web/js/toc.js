var toc = function (nav, selector){
  nav = nav || document.querySelector('nav ul.toc');
  var i$, ref$, len$, span, txt, li, a, results$ = [];
  for (i$ = 0, len$ = (ref$ = selector || document.querySelectorAll('code span.entity.function,span.function.name,span.meta.function-call')).length; i$ < len$; ++i$) {
    span = ref$[i$];
    txt = span.textContent || span.innerHTML;
    txt = txt.replace(/\W/g, "");
    var spanid = txt + '-id';
    span.id = spanid;
    span.setAttribute && span.setAttribute('id', spanid);
    // nav.innerHTML += '<li><a href=#' + spanid + '>' + txt + '</a></li>'
    li = document.createElement('li');
    a = document.createElement('a');
    a.href = "#" + spanid;
    a.innerHTML = txt
    li.appendChild(a);
    nav.appendChild(li)
    results$.push(txt);
  }
  return results$;
}

if (this.Rainbow) {
    var nav = document.querySelector('nav ul.toc');
    this.Rainbow.done = function (code, language) {
        toc(nav, code.querySelectorAll ? code.querySelectorAll('span.entity.function,span.function.name,span.meta.function-call') : '');
    };
}
