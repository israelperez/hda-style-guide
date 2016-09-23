'use strict';

var UIEngine = {
  // shell based on code by Codrops
  // http://tympanus.net/codrops/2013/08/28/transitions-for-off-canvas-navigations/

  _elements:{
    windowObj: $(window),
    site: $('body'),
    siteContainer: $('.site_container'),
    menuButton: $('.menu-button'),
    menuItems: $('.site_container-menu-nav a'),
    menuGroupBtns: $('.site_container-menu-nav input'),
    siteContent: $('.site_container-pusher-content'),
    mainContent: $('.content_main'),
    views: $('.content_main-view'),
    throbber: $('.site-throbber')
  },
  _animationSmallTime: 500,
  _loadedPage: null,
  _transitionEvent: null,
  eventtype: null,

  // private funtions and methods
  _loadRoutes: function(){
    $.routes.add('/home/',function(){
      console.log('asdsa');
    });
  },
  _addListeners: function(){
    this._elements.menuButton.on('touchstart click', function(e){
      e.stopPropagation();
      e.preventDefault();

      setTimeout( function() {
        UIEngine._elements.siteContainer.toggleClass('site_container-menu__is-open');
      }, 25 );
    });
    this._elements.site.on('touchstart click', function(e) {
      if($(e.target).is('.site_container, .site_container-pusher')) {UIEngine._closeNav();}
    });
    this._elements.menuItems.on('touchstart click', function(e) {
      var clickedLink = $(e.target),
        targetPage = clickedLink.attr('data-page') + '.html',
        scrollTo = clickedLink.attr('href');

      e.stopPropagation();
      e.preventDefault();

      UIEngine._closeNav();

      $('.site_container-pusher').one(UIEngine._transitionEvent, function(){
        UIEngine._loadPage(targetPage, scrollTo);
      });
    });

    this._elements.menuGroupBtns.on('change', function(){
      var input = $(this);
      if(input.prop('checked')){
        input.siblings('ul').slideDown(UIEngine._animationSmallTime);
      }else{
        input.siblings('ul').slideUp(UIEngine._animationSmallTime);
      }
    });
    UIEngine._elements.siteContent.on('touchstart click', '.content_main-nav-back, .content_main-nav-next', function(e){
      var clickedLink = $(e.target),
        targetPage = clickedLink.attr('data-page') + '.html',
        scrollTo = clickedLink.attr('href');

      e.stopPropagation();
      e.preventDefault();
      UIEngine._loadPage(targetPage, scrollTo);
    });
  },
  _showThrobber: function(){
    this._elements.throbber.addClass('site-throbber__is-visible');
  },
  _hideThrobber: function(){
    this._elements.throbber.removeClass('site-throbber__is-visible');
  },
  _whichTransitionEvent:function(){
    var t,
      el = document.createElement("fakeelement"),
      transitions = {
        "transition":       "transitionend",
        "OTransition":      "oTransitionEnd",
        "MozTransition":    "transitionend",
        "WebkitTransition": "webkitTransitionEnd"
      };

    for (t in transitions){
      if (el.style[t] !== undefined){
        return transitions[t];
      }
    }
  },
  _loadPage:function(pageToLoad, bookmark){
    if (pageToLoad === null || pageToLoad === undefined ) { return; }
    if (bookmark === null || bookmark === undefined ) { bookmark = '#'; }
    var bookmarkPos = 0;


    if(UIEngine._loadedPage === pageToLoad){
      if(bookmark !== '#'){
        bookmarkPos = $(bookmark).position().top;
      }
      UIEngine._scrollToPos(bookmarkPos);
    }else{
      //start throbber
      this._showThrobber();
      //fadeout page
      UIEngine._elements.mainContent.animate({opacity: 0}, function(){
        // once animation is finished load new content
        // jump to top
        UIEngine._scrollToPos(0, false, function(){
          //load new content
          UIEngine._elements.views.load('views/'+pageToLoad, function(){
            // once content is loaded
            // stop trobber
            UIEngine._hideThrobber();
            UIEngine._loadedPage = pageToLoad;
            // animate in new content
            UIEngine._elements.mainContent.animate({opacity: 1}, function(){
              //once new content is animated in, scroll to bookmark
              if(bookmark !== '#'){
                bookmarkPos = $(bookmark).position().top;
              }
              UIEngine._scrollToPos(bookmarkPos);
            });
          });
        });
      });
    }
  },
  _scrollToPos: function(scrollPos, willAnimate, callBack){
    var duration = 1000;
    if(willAnimate === undefined){willAnimate = true;}

    if(willAnimate){
      duration = 1000;
    }else{
      duration = 0;
    }
    UIEngine._elements.siteContent.animate({ scrollTop: scrollPos - 80}, duration, callBack);
  },
  _closeNav: function() {
    this._elements.siteContainer.removeClass('site_container-menu__is-open');
  },

  // public functions and methods
  init: function() {
    this._loadRoutes();
    this._addListeners();
    if(this.checkIsMobile()){
      this.eventtype = 'touchstart';
    }else{
      this.eventtype = 'click';
    }
    this._transitionEvent = this._whichTransitionEvent();
    //UIEngine._elements.views.load('views/intro.html');
    this._loadPage('intro.html');
  },
  checkIsMobile: function() {
		var check = false;
    (function(a, b) {
      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {window.location = b;}
    })(navigator.userAgent || navigator.vendor || window.opera, 'http://detectmobilebrowser.com/mobile');
		return check;
	}
};

$(document).ready(function() {
  UIEngine.init();
});
