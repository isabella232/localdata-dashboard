/*jslint nomen: true */
/*globals define: true */

define([
  'jquery',
  'lib/lodash',
  'backbone',
  'lib/tinypubsub',

  // LocalData
  'settings',
  'api',

  // Models
  'models/responses',

  // Templates
  'text!templates/responses/item.html'
],

function($, _, Backbone, events, settings, api, Responses, template) {
  'use strict';

  var ResponseView = Backbone.View.extend({
    className: 'response',

    template: _.template(template),

    events: {
      'click .confirm': 'confirm',
      'click .delete': 'destroy',
      'click .cancel': 'cancel',

      'click .flag': 'flag',
      'click .accept': 'accept'
    },

    initialize: function(options) {
      this.listenTo(this.model, "change", this.render);
      this.listenTo(this.model, "destroy", this.remove);

      this.labels = options.labels;
      this.showReviewTools = options.showReviewTools;
    },

    render: function() {
      var $el = $(this.el);

      var options = {
        r: this.model.toJSON(),
        labels: this.labels
      };

      if(this.showReviewTools) {
        options.showReviewTools = true;
      }

      $el.html(this.template(options));
      return this;
    },

    confirm: function(event) {
      event.preventDefault();
      this.$('.confirm').hide();
      this.$('.confirm-delete').show();
    },

    cancel: function(event) {
      event.preventDefault();
      this.$('.confirm-delete').hide();
      this.$('.confirm').show();
    },

    destroy: function(event) {
      event.preventDefault();

      function success(model, repsonse) {
      }

      function error(model, xhr, options) {
        console.log("Error destroying", xhr, options);
        console.log($('.error'));
        $('.error').show();
      }

      this.model.destroy({
        success: success,
        error: error
      });
    },

    flag: function(event) {
      event.preventDefault();
      this.model.patch({
        review: 'flagged'
      });
    },

    accept: function(event) {
      event.preventDefault();
      this.model.patch({
        review: 'accepted'
      });
    }

  });

  return ResponseView;
});
