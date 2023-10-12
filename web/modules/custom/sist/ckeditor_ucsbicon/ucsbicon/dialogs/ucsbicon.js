
(function ($, Drupal, CKEDITOR) {

	CKEDITOR.dialog.add( 'ucsbiconDialog', function( editor ) {
		return {
			title: 'UCSB Icon',
			minWidth: 600,
			minHeight: 400,
			contents: [
				{
					id: 'tab-basic',
					elements: [	
						{
							type: 'text',
							id: 'icon-url',
							label: 'URL',
							setup: function(element, preview) {
								try {
									var dom = new DOMParser().parseFromString(element.getHtml(), "text/xml");
									var icon_link = dom.getElementsByTagName("a")[0];
									if (icon_link != undefined)
									{
										this.setValue(icon_link.getAttribute("href"));
									}
								}
								catch(err) {

								}

							},
							commit: function( element ) {

								if( this.getValue()){	
									var icon_link = editor.document.createElement( 'a' );
									icon_link.setAttribute( "class", "ucsb-icon-lnk" );
									icon_link.setAttribute( "href", this.getValue() );
									icon_link.removeAttribute('data-cke-saved-href');

									var preview = this.getElement().getAscendant('table').findOne('.preview-icon');
									var previewIcon = preview.getHtml();
									icon_link.appendHtml(previewIcon);

									preview.setHtml(icon_link.getOuterHtml());
								}
							}
						},
						{
							type: 'text',
							id: 'icon-width',
							label: 'Icon Width (\'px\' are default, add \'%\' for percentages)',
							validate: CKEDITOR.dialog.validate.regex( /^\+?(0|[1-9]\d*)?(%)?$/, "Icon Width is not valid." ),
							'default': '100',
							setup: function( element, preview ) {
								this.preview_icon = preview;

								try {
									if (element.getStyle('width').length > 0) {
										if (element.getStyle('width').includes('%')) {
											this.setValue(element.getStyle('width'));
										}
										else {
											this.setValue(element.getStyle('width').split('px')[0]);
										}

									}
								}
								catch(err) {
									
								}

							},
							commit: function( element ) {
								
								if(this.getValue().length >0){
									if( this.getValue().includes('%')) {
										element.setAttribute(  'style', 'width:' + this.getValue() + ";");
									}
									else {
										element.setAttribute(  'style', 'width:' + this.getValue()+ 'px');
									}
								}
								else {
									console.error('Width is missing!');
									alert("Width is missing!");
									this.preview_icon.removeStyle('width');
								}
							},
							onChange: function() {
								var valid = this.getValue().match( /^\+?(0|[1-9]\d*)?(%)?$/ );

								if(this.getValue().length >0){
									if (valid) {
										if (this.getValue().includes('%')) {
											this.preview_icon.setStyle(  'width', this.getValue());
										}
										else {
											this.preview_icon.setStyle( 'width', this.getValue() + 'px' );
										}
									}
								}
								else {
									console.error('Width is missing!');
									alert("Width is missing!");
									this.preview_icon.removeStyle('width');
								}
							}
						},
						{
							type: 'radio',
							id: 'icon-alignment',
							label: 'Select the icon alignment',
							items: [ [ 'Left', 'float-left' ], [ 'Center', 'float-middle' ], [ 'Right', 'float-right' ] ],
							style: 'color: green',
							'default': 'float-left',
							setup: function( element, preview ) {

								try {
									var options = []; 
									this.items.forEach(function get(x){ options.push(x[1]); });
	
									this.preview_icon = preview;
	
									var positionClass = element.getAttribute("class").replace("ucsb-icon","").trim();
									if(options.includes(positionClass)){
										this.setValue(positionClass);
									}
								}
								catch(err) {
									
								}								
							},
							commit: function( element ) {
								var classes = ["ucsb-icon", this.getValue() ];
								
								element.setAttribute("class", classes.join(" "));								
							},
							onClick: function() {
								var classes = ["preview-icon", this.getValue() ];

								this.preview_icon.setAttribute("class", classes.join(" "));
								
							}
						},
						
						{
							type : 'html',
							html : '<p>Icons</p><div class="scrollable"><table class="icon-container"><tr><td>Loading... <img alt="Loading Gif" src="/modules/custom/sist/ckeditor_ucsbicon/ucsbicon/icons/loading.gif"/></td></tr></table></div>'
						},
						
						{
							type : 'html',
							html : '<p>Color</p><table class="color-buttons-table"><tbody><tr class="color-presets"><td class="color-button navy-btn">Navy</td><td class="color-button gold-btn" >Gold</td><td class="color-button light-gray-darken-btn" >Gray darken 80</td><td class="color-button light-gray-btn" >Light Gray</td></tr><tr class="color-presets"><td class="color-button light-light-gray-btn" >Light light gray</td><td class="color-button sea-green-web-btn" >Sea green web</td><td class="color-button aqua-web-btn" >Aqua web</td><td class="color-button moss-web-btn" >Moss web</td></tr><tr class="color-presets"><td class="color-button coral-btn" >Coral</td><td class="color-button dark-coral-btn" >Dark Coral</td><td class="color-button clay-btn" >Clay</td><td class="color-button light-clay-btn" >Light Clay</td></tr><tr class="color-presets"><td class="color-button sandstone-btn" >Sandstone</td><td class="color-button light-sandstone-btn" >Light Sandstone</td><td class="color-button mist-btn" >Mist</td><td class="color-button light-mist-btn" >Light Mist</td></tr></tbody></table>'
						},
						{
							type : 'html',
							html : '<p>Icon Preview</p><div style="background-color: #fff;border: 1px solid #bbb;padding: 10px;text-align: center;"><div class="preview-icon"></div></div>',
							setup: function( element, preview ) {								
								
								try {
									preview.setAttribute("class", element.getAttribute("class").replace("ucsb-icon","preview-icon"));								
									
									var svg = element.getHtml();
									if(svg != null)
									{
										preview.setHtml( svg );
									}	
								}
								catch(err) {
									
								}	
							},
							commit: function( element ) {
								var preview = this.getElement().getAscendant('table').findOne('.preview-icon');

								var link = this.getElement().getAscendant('table').findOne('.preview-icon');

								element.setHtml(preview.getHtml());
								
							}
						}
					]
				}
			],

			onShow: function() {
				var selection = editor.getSelection();
				var icon_Html = editor.document.$.getElementsByClassName('ucsb-icon')[0];
				var element = new CKEDITOR.dom.element();	

				//created by this plugin ?
				if (icon_Html != undefined) {
					element = new CKEDITOR.dom.element(icon_Html);
					this.insertMode = false;
				}
				else
				{					
					element = editor.document.createElement( 'div' );
					element.setAttribute('class','ucsb-icon');
					this.insertMode = true;
				}

				
				this.element = element;

				var preview_icon = this.getElement().findOne(".preview-icon");

				this.setupContent( this.element, preview_icon );
				
				//Get the Icons 
				loadIcons();				
											
			},

			onLoad: function(){
				
				
			},

			onOk: function (event, a, b) {
				var dialog = this;
				var ucsb_icon = this.element;
				
				this.commitContent(ucsb_icon);
				if (ucsb_icon.getStyle('width').length > 0) {
					
					if ( this.insertMode ){
						editor.insertElement( ucsb_icon );
					} 

					// remove the assigned CSS classes 
					var preview_icon = this.getElement().findOne(".preview-icon");
					if (preview_icon != null)
						preview_icon.setAttribute("class","preview-icon");

				} else {

					console.error('Width is missing!');
					alert("Width is missing!");
					event.data.hide = false;
				}

			}
		};
	});

	
	function assignIconClickEvent(){

		document.querySelectorAll('.icon-img').forEach(item => {
			item.addEventListener('click', function(){					
				var previewIcons = document.getElementsByClassName("preview-icon");
				var itemHTML = item.innerHTML.replace(/title/g,"label");
				
				for (let previewIcon of previewIcons) {
					previewIcon.innerHTML = itemHTML;
					previewIcon.getElementsByTagName("label")[0].setAttribute("class", "sr-only");
					previewIcon.getElementsByTagName("label")[0].innerHTML = previewIcon.getElementsByTagName("label")[0].innerHTML.replace(/-/g," ");
					var groupTags = previewIcon.getElementsByTagName("g");
					for (let gtag of groupTags){
						gtag.removeAttribute("id");
					}

				}
			}, false);
		});
	}

	function assignColorButtonClickEvent(){
		
		
		document.querySelectorAll('.color-button').forEach(item => {
			item.addEventListener('click', function(){	
				
				var bckg_color = window.getComputedStyle(item, null).backgroundColor;
				
				var previewIcons = document.getElementsByClassName("preview-icon");
						
				for (let previewIcon of previewIcons) {
					var svgIcon = previewIcon.getElementsByTagName("svg")[0];
					if (svgIcon != undefined){

						var paths = svgIcon.getElementsByTagName("path");
						for(let path of paths){

							var fill = path.style.fill;
							if(fill != "none"){
								path.style.fill = bckg_color;
							}

							var stroke = path.style.stroke;
							if(stroke != ""){
								path.style.stroke = bckg_color;
							}

						}						
					}
				}
			}, false);
		});
		
	}

	function loadIcons(){
		var iconList = document.getElementById("iconlist");	
		if (iconList == undefined){

			//Load the icons
			$.ajax({
				url: "/ckeditorucsbicon/loadicons"
			})
			.done(function( data ) {
				if(data) {
					
					// Prepare the container
					var iconList = document.createElement("div");
					iconList.setAttribute("id","iconlist");
					iconList.style.display = "none";

					var icon_table = document.createElement("table");
					icon_table.setAttribute("id","iconTable");

					var count = 10;

					// Get the categories
					var icons_categories = [...new Set(data.files.map(item => item.category))];
					var icons_arrays = data.files.reduce(function (memo, x) {
						if (!memo[x['category']]) { memo[x['category']] = []; }
						memo[x['category']].push(x);
						return memo;
					}, {});

					for (var indx = 0; indx < icons_categories.length; indx++){
						var category = icons_categories[indx];
						var category_files = icons_arrays[category];


						var row = document.createElement("tr");
						var cell = document.createElement("th");
						cell.colSpan = "10";
						cell.innerText = category;
						row.appendChild(cell);
						icon_table.appendChild(row);

						var rows = Math.ceil(category_files.length / count);

						for (var i = 0; i < rows; i++) {
							if (i * count < category_files.length)
								var row = document.createElement("tr");
							for (var j = 0; j < count; j++) {
								var cell = document.createElement("td");


								if ((i * count + j) < (category_files.length - 1)) {
									var img = document.createElement("div");
									img.setAttribute("class", "icon-img");
									img.innerHTML = category_files[i * count + j]['content'];

									cell.appendChild(img);
								}
								row.appendChild(cell);

							}
							icon_table.appendChild(row);
						}
					}

					

					iconList.appendChild(icon_table);
					document.body.appendChild(iconList);

					//populate CKEditor dialogs
					var icon_containers = document.getElementsByClassName("icon-container");
					for (let element of icon_containers) {
						element.innerHTML = iconTable.innerHTML;
					}

					
					assignIconClickEvent();
					assignColorButtonClickEvent();
				}
				
			});
		} else {
			
			//populate CKEditor dialogs
			var icon_containers = document.getElementsByClassName("icon-container");
			for (let element of icon_containers) {
				element.innerHTML = iconTable.innerHTML;
			}

			assignIconClickEvent();
			assignColorButtonClickEvent();
			
		}
	}

})(jQuery, Drupal, CKEDITOR);