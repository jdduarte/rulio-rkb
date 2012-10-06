/**
 * Config model
 *
 * Responsible for handling the configuration handling
 */
 RKB.Models.Config = Backbone.Model.extend({
    urlRoot: '/config',

    initialize: function(){
        this.on('change', this.save, this);
    },

    getConfig: function(){
        this.fetch();
    }

 });