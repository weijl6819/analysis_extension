(function(){

	// ---------------------------------  Class OPTIONS
	var Options = function(){

	}

	Options.prototype = {

		_app: null,

		than: null,

		paramsOptions: {},

		list_source: [],

		init: function( v ){
			that = this;

			console.log('--init-options--')

			this.refreshOptionValues();

			this._listenOptions();

		},

		// ------------------------------------------   
		refreshOptionValues: function( callback ){
			var that = this;

			var options = document.querySelectorAll( "[sname]" );
			for (var i = 0; i != options.length; i++)
			{
				var option = options[i];
				this.setOptionVal( option, coinFeed.Prefs.get( option.getAttribute( "sname" ) ) );
			}
		},

		// ----------------------------------------------
		_listenOptions: function(){

			var bl = $('#sourceSelect');
			var ee = $('option', bl);
			for (var i=0; i<ee.length; i++) {
				var v = ee[i].value;
				this.list_source.push(v);
			}

			$('#sourceSelect').ultraselect({ selectAll: true })

			var from = coinFeed.Prefs.get( "show_source" );
			if (from == 'all') {
				$('#sourceSelect').val(this.list_source);
			}
			else {
				$('#sourceSelect').val(JSON.parse(from));
			}


		},

		// ------------------------------------------------
		close: function(){
			window.close();
		},

		// ------------------------------------------------
		getOptionVal: function( option ){

			if( option.tagName == "INPUT" )	{
				if( option.type == "checkbox" )	{
					return option.checked;
				}
				else if( option.type == "radio" )	{
					var name = option.name;
					return document.querySelector( "[name="+name+"]:checked" ).value;
				}
			}
			return option.value;
		},

		// ------------------------------------------------
		setOptionVal: function( option, value ){

			try	{
				if( option.tagName == "INPUT" )	{
					if( option.className == "color" )	{
						if( option.color )		option.color.fromString(value);
									else		option.value = value;
						return;
					}
					else if( option.type == "checkbox" ) {
						option.checked = _b(value);
						return;
					}
					else if( option.type == "radio" ) {
						var name = option.name;
						document.querySelector( "[name="+name+"][value="+value+"]" ).checked = true;
						return;
					}
				}
				option.value = value;
			}
			catch( ex ){	console.log(ex);	}
		},


		// ------------------------------------------------
		changeOption: function( option ){
			var settingName = option.getAttribute( "sname" );
			var newValue = this.getOptionVal( option );
		},

		// ------------------------------------------------
		applyChanges: function( ){

			$('#save_proccess').show();
			setTimeout(function(){
				$('#save_proccess').hide();
			}, 2000);

			var settedOptions = [];
			var setOptions = [];
			var options = document.querySelectorAll( "[sname]" );

			var params = {};

			for( var i = 0; i != options.length; i++ )	{
				var name = options[i].getAttribute( "sname" );
				if( settedOptions.indexOf(name) != -1 )			continue;
				settedOptions.push( name );
				var v = this.getOptionVal( options[i] );
				params[name] = v;
				setOptions[name] = v;
				coinFeed.Prefs.set( name, v );
			}

			// ultraselect
			var from = $('#sourceSelect').val();
			if (from.length == that.list_source.length ) from = 'all';
			else from = JSON.stringify(from);
			coinFeed.Prefs.set( "show_source", from );

			chrome.runtime.sendMessage({akse: 'ApplyOptions', params: params});

		},

		// ------------------------------------------------
		display_show_display_alert: function( str ){
			alert(str);
		},

		// -----------------------------------------------


	};

	this.Options = new Options();


}).apply( coinFeed );
