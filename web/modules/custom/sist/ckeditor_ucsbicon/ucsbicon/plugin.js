(function ($, CKEDITOR) {
// (function (CKEDITOR) {
	CKEDITOR.plugins.add( 'ucsbicon', {
		init: function( editor ) {
			editor.addCommand( 'ucsbicon', new CKEDITOR.dialogCommand( 'ucsbiconDialog' ) );
			editor.ui.addButton( 'ucsbicon', {
				label: 'UCSB Icon',
				command: 'ucsbicon',
				icon: this.path + 'icons/icon.png'
			});
			editor.on( 'doubleclick', function( evt ) {
				var element = evt.data.element;
				if ( element.hasClass('ucsb-icon') ) {
					evt.data.dialog = 'ucsbiconDialog';
				}
			});
			editor.addContentsCss( this.path + 'css/style.css' );
			CKEDITOR.dialog.add( 'ucsbiconDialog', this.path + 'dialogs/ucsbicon.js' );

			
			CKEDITOR.config.customConfig = this.path + 'dialogs/ckeditor_config.js';	
		}
	});


	CKEDITOR.on('instanceReady', function (e) { 
		
		// var i = 1; 
		// var icons = e.editor.document.$.getElementsByClassName('ucsb-icon')[0];
		// $(icons).resizable();

		var iFrameDOM = $(".cke_wysiwyg_frame").contents();
		var icons = iFrameDOM.find(".ucsb-icon")
		// icons.forEach(icon => console.log(icon));
		icons.each(function( index ) {
			// $(this).resizable();
		  });
	});


})(jQuery, CKEDITOR);
