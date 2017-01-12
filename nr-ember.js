

(function(Ember, NREUM) {
  
  if (typeof NREUM === 'undefined' && typeof NREUM.interaction !== 'function' ) {
    console.log('api missing');
    return;
  }
  var myInteraction;


  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  };

  var NewrelicTiming = function() {
    this.marks = {};
    this.NREUM = NREUM;
    var _this = this;
    this.debounceTime = 500;
    this.mark = function(name) {
      this.marks[name] = +new Date();
    };

    this.measure = function(markName, against) {
      var compareTime, referenceTime;

      if (against) {
        referenceTime = this.marks[against];
        compareTime = this.marks[markName];
      } else {
        referenceTime = this.marks[markName];
        compareTime = +new Date();
      }

      return compareTime - referenceTime;
    };

    this.sendNRBeacon = function(fragmentName) {
      if (!this.checkBeaconRequirements()) {
        return;
      }

      fragmentName || (fragmentName = window.location.hash.substring(1));

      fragmentName = fragmentName.replace(/\/[0-9]+\//g, '/*/').replace(/\/[0-9]+$/, '/*');
      myInteraction.setName(fragmentName);
      var navEnd = this.measure('navEnd', 'navStart');
      var renderTime = this.measure('pageRendered', 'navStart');
      myInteraction.setAttribute(appTime, navEnd);
      myInteraction.setAttribute(renderTime, renderTime - this.debounceTime);
      this.marks['navStart'] = null;
    };

  };

  if (typeof Ember === 'undefined') {
    return;
  }

  

  

 

  var newrelicTiming = new NewrelicTiming();

  

  Ember.onLoad('Ember.Application', function(Application) {
    var loaded = debounce(function(){
      newrelicTiming.mark('pageRendered');
      newrelicTiming.sendNRBeacon(window.location.href.replace(window.location.origin, ''));
    }, newrelicTiming.debounceTime);

      newrelicTiming.mark('navStart');


      Ember.Router.reopen({
        nrNavEnd: function() {
          newrelicTiming.mark('navEnd');
          return;
        }.on('didTransition'),
        nrNavStart: function() {
          myInteraction = newrelic.interaction();
          newrelicTiming.mark('navStart');
          return;
        }.on('willTransition')
      });
      Ember.View.reopen({
        nrRendered: function() {
          loaded();
          return;
        }.on('didInsertElement')
      });
      Ember.onerror = function (error) {
        NREUM.noticeError(error);
      };
       
      Ember.RSVP.on('error', function(error) {
        NREUM.noticeError(error);
      });
  });



    

})(window.Ember, window.NREUM);