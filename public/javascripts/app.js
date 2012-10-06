/**
 * RKB web app
 */
 $(function(){
 	var config = new RKB.Models.Config();
 	var editor = new RKB.Views.Editor({
 		model: config
 	});
 	var controls = new RKB.Views.Controls({
 		model: config
 	});
 	controls.setEditor(editor);

 	editor.render();
 	controls.render().$el.appendTo('body');

 });