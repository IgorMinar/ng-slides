angular.widget('body', function(templateEl) {
  var ctrlEl = angular.element('<div ng:controller="SlideCtrl"></div>')
    , counterEl = angular.element('<div id="slideCounter">{{currentSlide}} / {{slideCount}}</div>')
    , styleSheet = document.styleSheets[0]

  templateEl.append(ctrlEl)
  ctrlEl.append(counterEl)

  addCssRules(styleSheet, {
    'body': {
      'overflow-x': 'hidden',
      'overflow-y': 'auto',
      'margin': 0,
      'padding': 0,
      'background-color': 'rgb(215, 215, 215)',
/*
      'background': '-o-radial-gradient(rgb(240, 240, 240), rgb(190, 190, 190))',
      'background': '-moz-radial-gradient(rgb(240, 240, 240), rgb(190, 190, 190))',
      'background': '-webkit-radial-gradient(rgb(240, 240, 240), rgb(190, 190, 190))',
      'background': '-webkit-gradient(radial, 50% 50%, 0, 50% 50%, 500, from(rgb(240, 240, 240)), to(rgb(190, 190, 190)))',
*/

      'font-size': '16px',
    },
    'slide': {
      'width': '55em',
      'height': '44em',
      'position': 'absolute',
      'top': '50%',
      'left': '50%',
      'margin-top': '-22em',
      'margin-left': '1000em',


      'border': '1px solid rgba(0, 0, 0, .3)',
      'border-radius': '10px',
      'box-shadow': '0 2px 6px rgba(0, 0, 0, .1)',
      'background-color': 'white',

      'white-space': 'pre-line',
      'text-align': 'center',
      'vertical-align': 'middle',

      'font-family': "'Open Sans', Arial, sans-serif",
      'color': 'rgb(102, 102, 102)',
      'text-shadow': '0 1px 1px rgba(0, 0, 0, .1)',
      'line-height': '36px',
      'letter-spacing': '-1px'
    },
    '.current': {
      'margin-left': '-27.5em',
      'transition': 'margin, 0.5s',
    },
    '.previous': {
      'margin-left': '-95em',
      'transition': 'margin, 0.5s',
      'opacity': '30%',
    },
    '.next': {
      'margin-left': '40em',
      'transition': 'margin, 0.5s',
      'opacity': '30%',
    },
    '.past': {
      'margin-left': '-162.5em',
      'transition': 'margin, 0.5s',
    },
    '.future': {
      'margin-left': '107.5em',
      'transition': 'margin, 0.5s',
    },
    '#slideCounter': {
      'position': 'absolute',
      'top': '50%',
      'left': '50%',
      'width': '55em',
      'margin-top': '22.5em',
      'margin-left': '-28.5em',
      'text-align': 'center',
    }
  })


  this.directives(true)
  this.descend(true)

  return function(instanceEl) {
    var scope = this

    window.$root = scope

    scope.slideCount = 0

    angular.element(window).bind('keydown', function(e) {
      switch (e.keyCode) {
        case 37: {
          if (scope.currentSlide > 1)
            scope.currentSlide--
          break
        }
        case 39: {
          if (scope.currentSlide < scope.slideCount)
            scope.currentSlide++
          break
        }
      }
      scope.$eval();
    })
  }
})


angular.widget('slide', function(templateEl) {
  this.descend(true);
  this.directives(true);
  return function(instanceEl) {
    var scope = this
      , slideId = ++scope.slideCount
      , slideState

    instanceEl.attr('slide-id', slideId)

    scope.$watch('currentSlide', function() {
      if (slideState)
        instanceEl.removeClass(slideState)

      switch (scope.currentSlide) {
        case (slideId + 1): {
          slideState = 'previous'
          break
        }
        case (slideId): {
          slideState = 'current'
          break
        }
        case (slideId - 1): {
          slideState = 'next'
          break
        }
        default: {
          slideState = (scope.currentSlide > slideId)
            ? 'past'
            : 'future'
        }
      }

      instanceEl.addClass(slideState)
    })
  }
})


function SlideCtrl($location) {
  var scope = this.$parent
    , oldHash = $location.hash
    , oldCurrentSlide

  if ($location.hash) {
    scope.currentSlide = oldCurrentSlide = parseInt($location.hash, 10)
  } else if (scope.slideCount > 0) {
    scope.currentSlide = oldCurrentSlide = 1
  }

  //priority must be lower than PRIORITY_WATCH so that currentSlide watch runs afterwards
  scope.$onEval(-1001, function() {
    if (($location.hash || 1) == scope.currentSlide) return

    if ($location.hash != oldHash) {
      scope.currentSlide = parseInt($location.hash, 10) || 1
    } else if (scope.currentSlide != oldCurrentSlide){
      $location.hash = (scope.currentSlide > 1) ? scope.currentSlide : ''
    }

    oldHash = $location.hash
    oldCurrentSlide = scope.currentSlide
  })
}


function addCssRules(stylesheet, rules) {
  angular.forEach(rules, function(rule, selector) {
    var ruleString = ''

    angular.forEach(rule, function(value, property) {
      if (property.match(/transition.*/)) {
        ruleString += '-webkit-' + property + ': ' + value + '; '
        ruleString += '-moz-' + property + ': ' + value + '; '
        ruleString += '-o-' + property + ': ' + value + '; '
      }
      ruleString += property + ': ' + value + '; '
    })
    addCssRule(stylesheet, selector, ruleString)
  })
}

function addCssRule(styleSheet, selector, rule) {
  if (styleSheet.insertRule) {
    styleSheet.insertRule(selector + '{' + rule + '}', styleSheet.cssRules.length)
  }
  else { /* IE */
    styleSheet.addRule(selector, rule, -1)
  }
}

///////////////////////////////////////////////

/* http://docs.angularjs.org/#!angular.widget */

angular.widget('pre', function(template){
  this.descend(true);
  this.directives(true);
  if (template.hasClass('code')){
    // since we are emulating jQuery we need to defer it.
    var pre = template;
    var html = pre.html();
    var script = '';
    pre.html('');
    pre.css('display', 'block');
    pre.css('white-space', 'normal');
    pre.css('font-family', 'inherit');
    pre.css('font-size', 'inherit');

    html = html
      .replace(/===script===([\s\S]*)===\/script===/mg, function(_, code){
        script = code;
        return '###SCRIPT###'
      })
      .replace(/&lt;/mg, '<')
      .replace(/&gt;/mg, '>')
      .replace(/&amp;/mg, '&');

    // turns out that <script> tag is removed in .html()
    // so we have to code it as p:script and the rename it.
    var example = angular.element('<fieldset>')
      .addClass('example')
      .append('<legend>Example Output</legend>')
      .append(angular.element('<div>').html(html.replace('###SCRIPT###', '')));

    var code = angular.element('<fieldset>')
      .addClass('code')
      .append('<legend>Example Source</legend>')
      .append(angular.element('<pre>')
          .addClass('brush: js; html-script: true; toolbar: false;')
          .text(html.replace('###SCRIPT###', '<script>' + script + '</script>')));

    pre.append(example);
    pre.append(code);
    
    window.eval(script);
    if (document.fireEvent) {
      document.fireEvent('onload');
    } else {
      var evnt = document.createEvent('HTMLEvents');
      evnt.initEvent('load', true, false);
      document.dispatchEvent(evnt);
    }
    
    return highlight;
  } else if (template.hasClass('code-only')){
    template.addClass('brush: js; html-script: true; toolbar: false;');
    return highlight;
  }

  function highlight(){
    SyntaxHighlighter.highlight();
  }
});

