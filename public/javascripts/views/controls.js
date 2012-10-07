/**
 * Controls View
 *
 * Updates or retrieves the configuration from the server
 */
 RKB.Views.Controls = Backbone.View.extend({
    editor: null,

    events: {
        'click #get_config': 'getConfig',
        'click #set_config': 'setConfig'
    },

    setEditor: function(editor){
        this.editor = editor;
    },

    getConfig: function(){
        this.model.getConfig();
    },

    setConfig: function(){
        var config = this.editor.getCode();
        this.model.clear({silent: true});
        this.model.set(config);
    },

    render: function(){
        this.$el.html($('#controlsTemplate').html());

        return this;
    }
 });