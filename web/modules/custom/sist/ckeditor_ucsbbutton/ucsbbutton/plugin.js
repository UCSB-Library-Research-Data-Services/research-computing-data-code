(function (CKEDITOR) {
	CKEDITOR.plugins.add( 'ucsbbutton', {
		init: function( editor ) {
			editor.addCommand( 'ucsbbutton', new CKEDITOR.dialogCommand( 'ucsbbuttonDialog' ) );
			editor.ui.addButton( 'ucsbbutton', {
				label: 'UCSB Button',
				command: 'ucsbbutton',
				icon: this.path + 'icons/button.png'
			});
			editor.on( 'doubleclick', function( evt ) {
				var element = evt.data.element;
				if ( element.hasClass('ucsb-button') ) {
					evt.data.dialog = 'ucsbbuttonDialog';
				}
			});
			editor.addContentsCss( this.path + 'css/ucsbbutton.css' );
			CKEDITOR.dialog.add( 'ucsbbuttonDialog', this.path + 'dialogs/ucsbbutton.js' );
		}
	});
})(CKEDITOR);
