/**
 * Editor view
 *
 * Displays an editor to change the configuration
 *
 * Depends on the ace editor: http://ace.ajax.org/
 */
 RKB.Views.Editor = Backbone.View.extend({
    initialize: function(){
        this.$el = $('#editor');
        this.editor = ace.edit("editor");
        this.editor.setTheme("ace/theme/twilight");
        this.editor.getSession().setMode("ace/mode/javascript");

        this.$el.css('display', 'none');

        this.model.on('change', this.render, this);
    },

    getCode: function(){
        return JSON.parse(this.editor.getValue());
    },

    render: function(){
        this.$el.css('display', 'block');

        this.editor.setValue(JSON.stringify(this.model.toJSON(), undefined, 2));

        return this;
    }
 });