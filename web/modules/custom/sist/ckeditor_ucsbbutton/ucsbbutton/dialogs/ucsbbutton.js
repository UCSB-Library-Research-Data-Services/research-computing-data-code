CKEDITOR.dialog.add( 'ucsbbuttonDialog', function( editor ) {
	return {
		title: 'UCSB Button',
		minWidth: 400,
		minHeight: 200,
		contents: [
			{
				id: 'tab-basic',
				elements: [
					{
						type: 'text',
						id: 'button-text',
						label: 'Text',
						validate: CKEDITOR.dialog.validate.notEmpty( "Text field cannot be empty." ),
						setup: function( element, preview ) {
							this.preview_button = preview;
							this.setValue( element.getText() );
						},
						commit: function( element ) {
							element.setText( this.getValue() );
						},
						onChange: function() {
							this.preview_button.setText( this.getValue() );
						}
					},
					{
						type: 'text',
						id: 'button-url',
						label: 'URL',
						setup: function( element ) {
							this.setValue( element.getAttribute( "href" ) );
						},
						commit: function( element ) {
							element.setAttribute( "href", this.getValue() );
							element.removeAttribute('data-cke-saved-href');
						}
					},
					{
						type: 'text',
						id: 'font-size',
						label: 'Font Size (\'px\' are default)',
						validate: CKEDITOR.dialog.validate.regex( /^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/, "Font size is not valid." ),
						setup: function( element, preview ) {
							this.preview_button = preview;
							this.setValue( element.getStyle('font-size').split('px')[0] );
						},
						commit: function( element ) {
							element.setStyle( 'font-size', this.getValue() + 'px' );
						},
						onChange: function() {
							var valid = this.getValue().match( /^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/ );
							if (valid) {
								this.preview_button.setStyle( 'font-size', this.getValue() + 'px' );
							}
						}
					},
					{
						type: 'text',
						id: 'btn-width',
						label: 'Button Width (\'px\' are default, add \'%\' for percentages)',
						validate: CKEDITOR.dialog.validate.regex( /^\+?(0|[1-9]\d*)?(%)?$/, "Button Width is not valid." ),
						setup: function( element, preview ) {
							this.preview_button = preview;
								
							if( element.getStyle('width').slice(1) == '%') {
								this.setValue( element.getStyle('width') );
							}
							else {
								this.setValue( element.getStyle('width').split('px')[0] );
							}
						},
						commit: function( element ) {
							
							if(this.getValue().length >0){
								if( this.getValue().slice(1) == '%') {
									element.setStyle( 'width', this.getValue());
								}
								else {
									element.setStyle( 'width', this.getValue() + 'px' );
								}
							}
							else {
								element.removeStyle('width');
							}
						},
						onChange: function() {
							var valid = this.getValue().match( /^\+?(0|[1-9]\d*)?(%)?$/ );

							if(this.getValue().length >0){
								if (valid) {
									if( this.getValue().slice(1) == '%') {
										this.preview_button.setStyle( 'width', this.getValue());
									}
									else {
										this.preview_button.setStyle( 'width', this.getValue() + 'px' );
									}
								}
							}
							else {
								this.preview_button.removeStyle('width');
							}
						}
					},
					{
						type : 'html',
						html : '<p>Background</p><table class="color-buttons-table"><tbody><tr class="color-preset-caption"><td colspan="3">Primary Colors</td></tr><tr class="color-presets"><td class="color-button btn-default">Primary</td><td class="color-button btn-secondary" >Secondary</td><td class="color-button btn-tertiary" >Tertiary</td><td/></tr><tr class="color-preset-caption"><td colspan="4">Additional Colors</td></tr><tr class="color-presets"><td class="color-button navy-btn">Navy</td><td class="color-button gold-btn" >Gold</td><td class="color-button light-gray-darken-btn" >Gray darken 80</td><td class="color-button light-gray-btn" >Light Gray</td></tr><tr class="color-presets"><td class="color-button light-light-gray-btn" >Light light gray</td><td class="color-button sea-green-web-btn" >Sea green web</td><td class="color-button aqua-web-btn" >Aqua web</td><td class="color-button moss-web-btn" >Moss web</td></tr><tr class="color-presets"><td class="color-button coral-btn" >Coral</td><td class="color-button dark-coral-btn" >Dark Coral</td><td class="color-button clay-btn" >Clay</td><td class="color-button light-clay-btn" >Light Clay</td></tr><tr class="color-presets"><td class="color-button sandstone-btn" >Sandstone</td><td class="color-button light-sandstone-btn" >Light Sandstone</td><td class="color-button mist-btn" >Mist</td><td class="color-button light-mist-btn" >Light Mist</td></tr></tbody></table>'
					},
					{
						type : 'html',
						html : '<p>Preview</p><div style="background-color: #fff;border: 1px solid #bbb;padding: 10px;text-align: center;"><a class="preview-button"></a></div>',
						setup: function( element, preview ) {
							

							var _table = this.getElement().getAscendant('table');
							var color_buttons = _table.find('.color-button').$;
							for (var i = 0; i < color_buttons.length; i++) {
								var cssclass = color_buttons[i].getAttribute('class').replace("color-button","");

								color_buttons[i].setAttribute(
									'onclick',
									'var row = this.closest(".color-buttons-table").parentNode;' +
									'var preview_button = row.closest("table").querySelector(".preview-button"); ' +
									'preview_button.setAttribute("class","preview-button ucsb-button btn ' + cssclass + '");' +
									'row.querySelector(".color-text-input").value = "' + cssclass + '";'
								);
							}
							
							preview.setAttribute("class", preview.getAttribute("class") + " " + element.getAttribute( "class" ));
							preview.setText( element.getText() );
						},
						commit: function( element ) {
							var preview = this.getElement().getAscendant('table').findOne('.preview-button');

							element.setAttribute("class", preview.getAttribute("class").replace("preview-button",""));
						}
					}
				]
			}
		],

		onShow: function() {
			var selection = editor.getSelection();
			var element = selection.getStartElement();
			var btn_text = "Button"; 

			if ( !element || !element.hasClass('ucsb-button') ) {
				if(element.$.innerText.length > 1) 
				{
					btn_text = element.$.innerText;
				} 
				element = editor.document.createElement( 'a' );
				element.setAttribute('class','ucsb-button');
				var style_button = 'font-size:16px;';
				element.setAttribute( "style", style_button );
				element.setText( btn_text );
				this.insertMode = true;
			}
			else
				this.insertMode = false;

			this.element = element;

			var preview_button = this.getElement().findOne(".preview-button");
			this.setupContent( this.element, preview_button );
		},

		onOk: function() {
			var dialog = this;
			var ucsb_btn = this.element;
			this.commitContent( ucsb_btn );

			if ( this.insertMode )
				editor.insertElement( ucsb_btn );

			// remove the assigned CSS classes 
			var preview_button = this.getElement().findOne(".preview-button");
			preview_button.setAttribute("class","preview-button");
		}
	};
});
