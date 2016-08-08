'use strict';

var UIEngine = {
  _elements:{
    splash: $('.splash-screen'),
    windowObj: $(window)
  },

  // private funtions and methods

  init: function() {
    this.addListeners();
  },

  addListeners: function(){
    //nav list
    this.HEADER._elements.navList.on('click', 'li', function(e){
      UIEngine.HEADER.updateActive($(e.currentTarget));
    });
  },

  HEADER: {
    // private objects
    _elements: {
      headNav: $('.site-nav .navbar'),
      navList: $('.site-nav .navbar-collapse'),
      currentSelected: $('.site-nav .navbar-nav .active'),
      breadcrumb: $('.site-nav .navbar-heading')
    },
    // private fucntions and methods
    _closeNav: function(){
      this._elements.navList.collapse('toggle');
    },

    // public functions and methods
    updateActive: function(targetObj){
      this.updateBreadcrumb(targetObj.find('a').html());
      UIEngine.CONTENT.openView(targetObj.attr('data-view'));
      this._elements.currentSelected.removeClass('active');
      targetObj.addClass('active');
      this._elements.currentSelected = targetObj;
      this._closeNav();
    },
    updateBreadcrumb: function(titleString){
      this._elements.breadcrumb.html(titleString);
    }
  },

  CONTENT: {

    // private objects
    _elements: {
      viewWindow: $('.view'),
      newsView: $('.view .view_news'),
      alertView: $('.view .view_alert'),
      aboutView: $('.view .view_about'),
      currentView: $('.view .activeView')
    },

    // public functions and methods
    openView: function(viewString) {
      this._elements.currentView.removeClass('activeView');
      switch (viewString){
        case 'news':
          this._elements.currentView = this._elements.newsView.addClass('activeView');
          break;
        case 'alert':
          this._elements.currentView = this._elements.alertView.addClass('activeView');
          //UIEngine.CONTENT.ALERT.init();
          break;
        case 'about':
          this._elements.currentView = this._elements.aboutView.addClass('activeView');
          break;
      }
    }
  }
};

$(document).ready(function() {
  UIEngine.init();
});
