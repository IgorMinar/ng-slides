angular.widget('body', function(templateEl) {
  var ctrlEl = angular.element('<div ng:controller="SlideCtrl"></div>')
    , counterEl = angular.element('<div id="slideCounter">{{currentSlide}} / {{slideCount}}</div>')
    , styleSheet = document.styleSheets[0]

  templateEl.append(ctrlEl)
  ctrlEl.append(counterEl)
  
  addCssRules(styleSheet, {
    'body': {
      'overflow': 'hidden'
    },
    'slide': {
      'position': 'absolute',
      'top': '50%',
      'left': '50%',
      'width': '55em',
      'margin-top': '-22em',
      'margin-left': '1000em',
      'height': '44em',
      'border': '1px solid black',
      'text-align': 'center',
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


function SlideCtrl() {
  var scope = this.$parent
  
  if (scope.slideCount > 0) {
    scope.currentSlide = 1
  }
}


function addCssRules(stylesheet, rules) {
  angular.forEach(rules, function(rule, selector) {
    var ruleString = ''

    angular.forEach(rule, function(value, property) {
      ruleString += property + ': ' + value + '; '
      if (property.match(/transition.*/)) {
        ruleString += '-webkit-' + property + ': ' + value + '; '
        ruleString += '-moz-' + property + ': ' + value + '; '
        ruleString += '-o-' + property + ': ' + value + '; '                
      }
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