/**
 * Tristan Engine 3.0 lite/core, alpha
 *
 * @date 2017.03.03 3.0.7
 * @date 2016.10.08 3.0.6
 * @date 2016.09.22 3.0.5
 * @date 2016.09.11 3.0.4
 * @date 2016.09.07 3.0.3
 * @date 2016.09.06 3.0.2
 * @date 2016.08.28 3.0.1
 * @date 2016.08.20 3.0.0
 *
 */
 
(function(taneni, $){
	"use strict";
	
	/**
	 * Main TN encapsulator.
	 */
	if( !($ = taneni.tnC ) )
		$ = taneni.tnC = function(a, b, c){
			// Function
			if( typeof(a)=="function" ){
				a($);
			}
		};
		
	/**
	 * Basic vars and shortcut helper functions.
	 */
	var i, ii, j, jj, t, u,
		blankFunc = function(){ }, // <- in case kelangan natin
		tnObj,
		tnCla,
		tnStdCla,
		tnBasicCounter,
		
		/**
		 * shortcut so they become one letter when minified.
		 */
		konsole = console,
		//dokument = document,
		
		/**
		 * Shortcut to instanceOf. Will be incorporated
		 * to TN as $.is
		 *
		 * @param mixed  obj - The object to check 
		 *
		 * @param mixed  cla - The class to determine if obj is an instance of.
		 */
		isA = function(obj, cla){
			return obj instanceof cla
		},
		
		/**
		 * Sample object of plain javascript object.
		 * Formerly on tn.array module
		 */
		jsArray = [],
		
		/**
		 * JSArray has native indexOf?
		 * Formerly on tn.array module.
		 */
		jsArrayHasIndexOf = !!jsArray.indexOf,
		
		/**
		 * Shortcut to the jsArray.slice function.
		 *
		 */
		jsSlice = jsArray.slice,

		/**
		 * Shortcut to convert some compatible list (such as argument) to javascript array,
		 * if it is not a JS Array.
		 *
		 * @return the js array.
		 */
		toJsArray = function( wada ){ 
			return ($.isArray(wada)) ? wada : jsSlice.call(wada || []);
		},
		/**
		 * merges arrays, shortcut (pampaliit ng size kapag mininify)
		 *
		 * est minified code size = 46 bytes
		 *
		 * @return param 
		 */
		/*merge = function(){ 
			return jsArray.concat.apply([], arguments||[]);
		},*/
		/**
		 * Shortcut:
		 * Makes an alias function from an existing function.
		 */
		makeAlias = function(scope, fn){
			var fnFin = scope[fn],
				alias = function(){ return fnFin.apply(scope, arguments||[]); }
			return alias;
		}
		;
	
		
	/**
	 * Core functions here 
	 */
	$(function(){
		/**
		 * Function and other objects to be placed
		 */
		t = {
			/**
			 * Expando property to be used.
			 */
			expando : "tn" + ('' + ((Math.random() * 1E9) + 1E10)).replace(/[^\d]+/g, "_"),
			
			/**
			 * The cache. 
			 *
			 */
			cache : {},
			
			/**
			 * is
			 */
			is : isA,
			
			/**
			 * Is function
			 */
			isFunction : function( obj ){ 
				return typeof(obj) == "function";
			},
			/**
			 * Is function
			 */
			isString : function( obj ){ 
				return typeof(obj) == "string";
			},
			/**
			 * Is boolean 
			 */
			isBoolean : function( obj ){
				return obj === true || obj === false;
			},
			/**
			 * Is null
			 */
			isNull : function( obj ){
				return obj === null;
			},
			/**
			 * Is undefined
			 */
			isUndefined : function( obj ){
				return obj === undefined;
			},
			/**
			 * Is object
			 */
			isObject : function( obj ){
				return obj && typeof(obj) == "object";
			},
			/**
			 * Tells if this is an array.
			 */
			isArray : function( obj ){
				return isA(obj, Array);
			},
			/**
			 * Tells if this is a TN array.
			 *
			 */
			isTNArray : function( obj ){
				return $.BaseArray && (isA(obj, $.BaseArray) || isA(obj, $.Collection));
			},
			/**
			 * Tells if this is an instance of Array or any of TN arrays.
			 */
			isArrayLike : function( obj ){
				return $.isArray( obj ) || $.isTNArray( obj );
			},
			/**
			 * Is TN class
			 */
			isTNClass : function( obj ){
				return $.isFunction(obj) && ( isA(obj.prototype, tnStdCla) || obj.prototype.$TNHAJDUL);
			},
			/**
			 * Is TN Callback?
			 */
			isTNCallback : function( obj ){
				return $.Callback && isA( obj, $.Callback );
			}
		}; for(i in t) $[i] = t[i]; 
	});
	
	/**
	 * Core TN object 
	 */
	$(function(){
		tnObj = $.obj = function(){};

		
		/********************
		 * Private vars
		 *
		 */
		var 
		/**
		 * The default walker object.
		 */
		defaultWalkExtend = function(itemToAdd, itemIndex, destObject, isDeep){
			// Deep mode, deep extend the object. No matter if this 
			// is an array, basta deep extend natin.
			if( isDeep ){
				if( $.isObject(itemToAdd) ){
					if( ! $.isObject( destObject[itemIndex] ) )
						destObject[itemIndex] = {};
					
					tnObj.extend( destObject[itemIndex], isDeep, itemToAdd );
					
					return;
				}
			}
			destObject[itemIndex] = itemToAdd;
		}
		;
		 
		/*
		 * end private vars 
		\********************/
		
		/**
		 * Properties in tnC.obj = tnObj.
		 */
		t = {
			/**
			 * Adds/extends property of said object. Plain extension.
			 *
			 * @usage f(obj, isDeep, struct[, struct2...])
			 * @usage f(obj, struct[, struct2...])
			 *
			 * @param object obj - The object to extend 
			 *
			 * @param bool isDeep - Tells if we have to do deep extension
			 *
			 * @param object struct - The structure containing properties to be added to the object.
			 *
			 * @param object struct2.. - The structure containing properties to be added to the object.
			 *
			 * @return The extended object.
			 */
			extend : function(obj, isDeep, struct){
				var ii, i, args = arguments||[];

				// Determine deep extension?
				if( ! $.isBoolean(isDeep) ){
					isDeep = false;
				}
				else 
					jsArray.splice.call(args, 1, 1);
				
				// Argumentos
				for( i = 1; i < args.length; i++ ){
					tnObj.walkExtend(obj, args[i], defaultWalkExtend, [isDeep]);
				}
				
				// Return
				return obj;
			},
			/**
			 * Adds/extends property with using a walker.
			 *
			 * @param object obj - The object to extend 
			 *
			 * @param object struct - The structure containing properties to be added to the object.
			 *
			 * @param callback walker - The walker to run, must contain the params 
			 *     (itemToAdd, itemIndex, destObject, walkerParamN...)
			 *
			 * @return The obj.
			 */
			walkExtend : function(obj, struct, walker, walkerParams){
				var i, j, u;
				
				// Compile the argument to be passed to the walker.
				var argTotal = [u, u, obj].concat( toJsArray( walkerParams ) );
				/*if( walkerParams ){
					for( j = 0; j < walkerParams.length; j++ ){
						argTotal.push(walkerParams[j]);
					}
				}*/
				
				// main extension here.
				for(i in struct){
					argTotal[0] = struct[i];
					argTotal[1] = i;
				
					walker.apply(null, argTotal)
					//obj[i] = struct[i];
				};
				
				return obj;
			},
			/**
			 * Provides a clone of the object.
			 *
			 * @usage f( obj )
			 * @usage f( obj, isDeep )
			 * @usage f( obj, newStruct )
			 * @usage f( obj, isDeep, newStruct )
			 *
			 * @param object obj - The object to clone.
			 *
			 * @param bool isDeep - Tells if to deeply clone the objects. THat means, 
			 *     if this is true, any objects encountered here will be deepcloned as well.
			 *
			 *     When deep cloning, every object is cloned as well. The array-like 
			 *     will also be cloned but as a plain JS array, if the tn.array is loaded.
			 *
			 * @param object newStruct - Optional. The structure to add to the cloned object.
			 */
			clone : function(obj, isDeep, newStruct){
				var newObj = {}, i,
					fn,
					hasProcess = false;
				
				// argument processing, if isDeep is a boolean.
				if( ! $.isBoolean(isDeep) ) {
					newStruct = isDeep || {};
					isDeep = false;
				}
				
				// start scanning
				for(i in obj){
					// If this is still false we can proceed with normal clone.
					// Or we can use 'continue'.
					// For the sake of minifying to as minimum as possible.
					hasProcess = false;
					
					// None in the TN past the Array maker will run this.
					if( isDeep ){
						// For javascript arrays.
						if( (fn = $.isArrayLike) && fn(obj[i]) ){
							newObj[i] = jsSlice.call( $.plainList(obj[i]) );
							hasProcess = true;
						}
						// Normal object.
						else if( $.isObject(obj[i]) ){
							//konsole.log( i );
							newObj[i] = tnObj.clone( obj[i], true );
							hasProcess = true;
						}
					}
					
					// The normal method.
					if( ! hasProcess )
						newObj[i] = obj[i];
				}
				
				//if( newStruct )
				//	tnObj.extend(newObj, newStruct);
				return tnObj.extend( newObj, isDeep, newStruct || {});
			},
			/**
			 * Provides a prototype-style clone of the object.
			 *
			 * Any changes in the obj will automatically be reflected in the new function.
			 *
			 * @param object obj - The object to add.
			 *
			 * @param object newStruct - The new Structure.
			 *
			 * @return the new object.
			 */
			pclone : function(obj, newStruct){
				var blankClass = function(){};
				blankClass.prototype = obj;
				
				var newObj = new blankClass();
				
				//if( newStruct )
				//	tnObj.extend(newObj, newStruct);
				
				return tnObj.extend( newObj, newStruct || {});
			}
		};for(i in t) tnObj[i] = t[i];
		
		
		// ******************************
		// Aliases on TN
		$.extend = makeAlias(tnObj, 'extend');
	});
		
	/**
	 * Core TN class, part 1.
	 */
	$(function(){
		/**
		 * The TN class maker.
		 *
		 *
		 * @param mixed whatever - Object or function that contains the following properties.
		 *    If this is a function then it must return the object with the following properties.
		 *
		 *
		 *    @property class base - The base function 
		 *
		 *    @property array  mixins - The array containing objects that will be used 
		 *       added in the new class. Each of the mixins item must contain properties 
		 *       which include 'static' and 'struct' objects, which is similar to what 
		 *       must be contained in the static and struct objects passed from this code.
		 *
		 *    @property mixed  statik or k - The object or function containing static functions.
		 *       If this is a function it must return the object
		 *
		 *    @property mixed  struct or s - The object or function containing The structures.
		 *       If this is a function it must return the object
		 */
		tnCla = $.cla = function(whatever){
			return tnCla.create(whatever);
		};
		/**
		 * The actual function.
		 *
		 */
		tnCla.create = function(whatever){
			if( $.isFunction(whatever) ){
				try {
					whatever = whatever($);
				}catch(e){
					konsole.error(e);
				}
			}
			if( ! $.isObject(whatever) )
				whatever = {};
			
			
			
			
			
			// determine new class
			var ii, i,
				newClass = tnClaNew(), // -> new class.
				newClassP,             // -> prototype of new class 
				baseClass,             // -> base class
				mixins    = whatever.mixins,
				statik,
				struct;
			
			
			
			
			//newClass  = tnClaNew()
			
			// for extending the base class.
			// If no whatever.base is specified, extend from main TN Class.
			if( !(baseClass = whatever.base ) )
				  baseClass = tnStdCla;
			  
			// let's see if we have to TNhaj the base class.
			if( !$.isTNClass( baseClass ) && baseClass != tnStdCla ){
				//konsole.log( baseClass );
				
				// provide some dummy class for this.
				newClassP = newClass.prototype = tnObj.pclone(baseClass.prototype);
				newClassP.$TNBASE = baseClass;
				tnCla.struct( newClass, tnStdCla.prototype );
				//konsole.log( newClassP, tnStdCla.prototype );
				newClassP.$TNHAJDUL = true;
				newClassP._init = function(){
					return baseClass.apply(this, arguments||[]);
				};
			}
			// normal TN class.
			else {
				// extension.
				newClassP = newClass.prototype = tnObj.pclone(baseClass.prototype);
				newClassP.$TNBASE = baseClass;
			}
			
			
			
			
			// Mandatory prototype settings.
			newClassP.$TNSELF = newClass;
			newClassP.$super  = tnClaSuper;   // <- have to make a copy and not on the proto side, kung di mag-aabnormal ito.
			newClassP.$TNDEFPROP = {};        // <- Default properties for each items.

			
			
			
			// Determine mixins, if any. We will simulate in the end that 
			// the standard struct{} and statik{} is part of the mixins.
			if( ! $.isArray(mixins) ) mixins = [];
			else mixins = jsSlice.call(mixins);
			
			mixins.push({
				k : whatever.k || whatever.statik,
				s : whatever.s || whatever.struct,
			});
				
			// Process them all.
			for( i = 0; i < mixins.length; i++){
				ii = mixins[i];
				
				// determine statics
				if( $.isFunction(t = ii.k || ii.statik ) ) {
					try{ statik  = t(); }catch(e){ konsole.error(e); }
				}
				else if( $.isObject(t) ) {
					statik = t;
				}
				tnCla.statik( newClass, statik );
					
				// determine structures
				if( $.isFunction(t = ii.s || ii.struct) ) {
					try{ struct = t(); }catch(e){ konsole.error(e); }
				}
				else if( $.isObject(t) ) {
					struct = t;
				}
				tnCla.struct( newClass, struct );
			}
			
			// return
			return newClass;
		};
		
		
		var 
		/**
		 * TN Class Initializer. To be run by each of the TN initializers.
		 */
		tnClaInitializer = function(obj, args){
			var ii, i, jj, j;
			
			// Set the default values in $TNDEFPROP, from the base class.
			// 
			// mas mabilis ata ito
			var setVars = {};        // <- catalogue of set variables, where key are varname and value is true.
			ii = obj.$TNSELF;
			do {
				i = ii.prototype;
				
				for( j in i.$TNDEFPROP ){
					if( ! setVars[j] ){
						  setVars[j] = !0;
						  
						obj['_' + j] = i.$TNDEFPROP[j];
					}
				}
					
			}while( ii = ii.prototype.$TNBASE);
			
			/*
			var claTree = obj.classTree();
			
			// Set the default values in $TNDEFPROP, from the base class.
			for( i = claTree.length - 1; i >= 0; i-- ){
				ii = claTree[i].prototype
				
				for( j in ii.$TNDEFPROP ){
					obj[j] = ii.$TNDEFPROP[j];
				}
			}
			*/
			
			// Arguments: To be used by extensions.
			// (i used as tempvar here)
			if( (i = $.Arguments) && $.is(args[0], i) )
				args = args[0].toArray();
			
			// run initializer scripts.
			if( obj._init ){
				obj._init.apply(obj, args || []);
			};
		},
		/**
		 * Call the super function.
		 *
		 * usage $super(what[, param1[, paramN...]])
		 *
		 * @param string  what - The string to cal.
		 *
		 * @param mixed  param1, 
		 * @param mixed  paramN
		 */
		tnClaSuper = function( what, args ){
			// konsole.log( this );
			// konsole.log( this.$sup_ );
			if( this.$sup_ && this.$sup_[what] ){
				return this.$sup_[what].apply(this, jsSlice.call(arguments||[], 1));
			}
		},
		/**
		 * make a new base TN class (function object).
		 *
		 */
		tnClaNew = function(){
			/**
			 * The base TN Class constructor.
			 *
			 */
			var cla = function(){
				tnClaInitializer(this, arguments || []); 
			};
			return cla;
		},
		/**
		 * Structure walker.
		 *
		 * @param mixed  structFunc - The property from the source structure to inject
		 *
		 * @param mixed  claProp - The name of the property 
		 *
		 * @param object  claProto - The class prototype object where the structFunc is to be injected 
		 *
		 * @param tnClass  cla - The class that owns claProto 
		 *
		 * @param tnClass  claBase - The base class of the cla.
		 * 
		 */
		tnClaWalkStructure = function( structFunc, claProp, claProto, cla, claBase ){
			var //claProto     = cla.prototype,
			
				// Base class prototype
				claBaseProto = claBase ? claBase.prototype : null,
				
				// Extract the function or object that exists in claBaseProto, if any.
				claBaseFunc  = claBaseProto && claBaseProto[claProp];
				
			var ii, i, 
				isOK,
				//hasGetSet,
				hasDefault = false,
				tmp;
				
			// In case the structFunc contains getter and setter then do this.
			// The object must contain only get, set or default and nothing else.
			// The 'get' or 'set', at least one of them, is required. Default is optional.
			//
			// @date 2017.03.03 - Changed. When the 'get' or 'set' is valued as boolean `true`,
			// it will be assigned with the default setter function, where the value 
			// will be set to this._{name}.
			//
			// tnCla.structProcessors[] <- return true if it satisfies. NOT IMPLEMENTED
			//
			if( $.isObject(structFunc) ){
				isOK = true;
				
				// Validation of the structure. 
				for( i  in structFunc ){
					if( /^(get|set)$/.test(i) ){
						if( ! $.isFunction( structFunc[i] ) && structFunc[i] !== true ){
							isOK = false;
						}
						else {
							//hasGetSet = true;
						}
					}
					else if( i == "default" )
						hasDefault = true;
					else 
						isOK = false;
					
					if( ! isOK ) break;
				}

				// OK lahat, proceed.
				if( i && isOK ){ // && hasGetSet 
					var claPropCapitalized = claProp[0].toUpperCase() + claProp.substr(1);
					
					var getterFunc = structFunc.get,
						setterFunc = structFunc.set;
					
					// automatically make getset if they are valued true.
					//if( ! hasGetSet )
					{
						if( getterFunc === true ) getterFunc = new Function('return this["_' + claProp + '"]');
						if( setterFunc === true ) setterFunc = new Function('v', 'this["_' + claProp + '"] = v;');
					}
					
					// process the get functions
					if( getterFunc )
						tnClaWalkStructure( getterFunc, "get" + claPropCapitalized, claProto, cla, claBase );
					
					// process the set functions
					if( setterFunc )
						tnClaWalkStructure( setterFunc, "set" + claPropCapitalized, claProto, cla, claBase );
					
					// TODO : What to do with "default" value.
					if( hasDefault )
						claProto.$TNDEFPROP[ claProp ] = structFunc.default;
					
					return;
				}
			}
				
			// Legitimate function which might be extended, do this.
			// -> 
			if( claBase 
				&& $.isFunction( structFunc )
				&& ! $.isTNClass( structFunc )
			){
				// -- structure ninta
				// -- Super object will be in this.$sup_.
				claProto[claProp] = function(){
					
					// -- let's do this
					var	ret, oldsuper = this.$sup_;
					
					// -- new super
					this.$sup_ = claBaseProto;
					
					// -- ret
					ret = structFunc.apply(this, arguments||[]);
					
					// -- bringback
					this.$sup_ = oldsuper;
					
					// --
					return ret;
				};
				/* if( $.isFunction( claBaseFunc )
					&& ! $.isTNClass ( claBaseFunc )
				) {
					
				} */
			}
			/*
			if( claBase
				&& $.isFunction( structFunc )
				&& $.isFunction( claBaseFunc )
				&& ! $.isTNClass( structFunc )
				&& ! $.isTNClass( claBaseFunc )
			){
				// -- structure ninta
				claProto[claProp] = function(){
					// -- let's do this
					var	ret, oldsuperc = this.$superc;
					
					// -- new super
					this.$superc = claBaseFunc;
					
					// -- ret
					ret = structFunc.apply(this, arguments||[]);
					
					// -- bringback
					this.$superc = oldsuperc;
					
					// --
					return ret;
				};
			}
			*/
			// Normal
			else {
				claProto[claProp] = structFunc;
			}
		}
		;

		
		/**
		 * Prepare objects for the new class.
		 */
		$.extend(tnCla, {
			/**
			 * Provides structure for the class. The structure in the struct 
			 * shall be appended to the class statik.
			 *
			 */
			statik : function(cla, struct){
				// strictly dapat tnClass ang ito.
				if( $.isTNClass(cla) ) {
					if( ! $.isObject(struct) ) struct = {};
					for(var i in struct){
						cla[i] = struct[i];
					};
				}
			},
			/**
			 * Provides structure for the class. The structure in the struct 
			 * shall be appended to the class prototype.
			 *
			 * A struct item can include an object, containing at least a 'get' or 'set' functions, 
			 * and an optional 'default' object. Such object must strictly contain only those 
			 * properties. Otherwise, the system will treat it as a 'normal' object.
			 *
			 * Example:
			 *
			 * foo : { 
			 *     get : function(){ },
			 *     set : function(x){ }
			 * },
			 * bar : {
			 *     get : function() { }
			 * }
			 *
			 * the system will make a getter and setter function named 'getFoo' and 'setFoo',
			 * as well as 'getBar'. System will capitalize the first letter of the property,
			 * then will prepend the appropriate 'get' or 'set'.
			 *
			 *
			 * @usage f(cla, struct)
			 */
			struct : function(cla, struct){
				//if( $.isTNClass(cla) ) 
				{
					if( ! $.isObject(struct) ) struct = {};
					
					var //claProto     = cla.prototype,
						claBase      = cla.prototype.$TNBASE,
						//claBaseProto = claBase ? claBase.prototype : null,
						structFunc;
						
					tnObj.walkExtend(cla.prototype, struct, tnClaWalkStructure, [cla, claBase]);
					/*for(i in struct){
					//	structFunc = struct[i];
					//	tnClaWalkStructure( structFunc, i, cla, claBase );
					//*/
				}
			},
			/**
			 * Extends a class into a new class.
			 *
			 * @usage f(oldCla, struct)
			 * @usage f(oldCla, static, struct)
			 */
			extend : function(oldCla, statik, struct){
				if( ! struct ){
					struct = statik;
					statik = null;
				}
				
				return $.cla({
					base   : oldCla,
					k : statik,
					s : struct
				})
			}
		});
		
		
		/**
		 * Base TN class and their functions.
		 */
		tnStdCla = $.cla.Std = tnClaNew();//function(){};
		$.extend(tnStdCla.prototype, {
			/**
			 * By design 
			 */
			$TNSELF : tnStdCla,
			
			/**
			 * Initializer 
			 */
			_init : function(){
				
			},
			/**
			 * Uninitializer 
			 */
			_uninit : function(){
				// General cleanup.
				$.cleanup( this );
			},
			
			
			/**
			 * Get the class tree of this class, that is, the tree of
			 * how this class was inherited. Arrangement is from this class 
			 * up to the very base TN class.
			 *
			 * @return array
			 */
			classTree : function(){
				var ret = [], tcla = this.$TNSELF;
				
				do {
					ret.push( tcla );
				}while( tcla = tcla.prototype.$TNBASE);
				
				return ret;
			}
		});
	});
	
	/**
	 * Some other miscellaneous important thingies.
	 *
	 */
	$(function(){
		
		// Privates
		var tenPow15 = 1E15;
		
		/**
		 * Publics for Counter
		 */
		tnObj.extend($, {
			/**
			 * Basic Counter, from old tn code.
			 * numbers, hindi natin masabi kung kelangan natin ito, but at least
			 * ready na tayo.
			 * 
			 * external : $.BasicCounter
			 * internal : tnBasicCounter
			 *
			 */
			BasicCounter : tnBasicCounter = tnCla({
				s : {
					_init : function(){
						/**
						 * Constant: Upper bound 
						 */
						//this.ub = 1E16;
						// -- prefix
						//this._prefix = '';
						
						// -- The counter places.
						//	The lastmost number is the pinaka-ones place. carry natin siya, kapag 
						//	nag-exceed na number ng unang digit magke-carry sa pangalawa.
						this._n = [0];
					},
					/**
					 * increments the counter to one point.
					 * @return The new count number.
					 */
					add : function(){
						var	//splUBN= 15,
							splUB = tenPow15, // <- upper bound for each counter
							ly    = this._n,          // <- shortcut to the counter array.
							lyUE  = ly.length - 1,    // <- The index number of the upper bound.
							
							// -> temporary numadd, carry
							carry = 1,
							
							// increment
							ii, i = lyUE;
							
						// -- add the number.
						//	check for carry methods,
						for( ; i >= 0; i--){
							ii = ly[i] + carry;
							carry = 0;
							
							// -- check for carry signs, ii is more than the upperbound.
							if( ii >= splUB){
								carry = Math.floor(ii / splUB);
								ii = ii - splUB;
							}
							
							// -- record the new number.
							ly[i] = ii;
							
							// if there's no more carry then end the loop.
							if(!carry) break;
						};
						// -- check if there is still any carry mark. If there it is, then add to the element.
						if( carry )
							ly.unshift(carry);
						
						// -- return
						return this.c();
					},
					/**
					 * gets the current counter data, joined with the underscore.
					 */
					c : function(){
						var str = "", i, ii, l = this._n;
						for( i = 0; i < l.length; i++ ){
							ii = "" + l[i];
							str += (i == 0 ? "" : (''+tenPow15).slice(ii.length+1)) + ii;
						}
						return str;
						//return this._n.join('_')
					}
				}
			}),
			
			/**
			 * Runs the todo function upon the time the cond returns true.
			 * @usage f(timeout, cond, table)
			 * @usage f(cond, table)
			 * 
			 * @param int  timeout - The interval when to check for cond. Defaults to 1000 
			 * @param callback  cond - Callable, the condition to run. Return true if the condition is met.
			 * @param callback  todo - Callable, the action to run upon the cond returns true.
			 *
			 * @return handler
			 */
			upon : function(timeout, cond, todo){
				if( ! todo ){
					todo = cond;
					cond = timeout;
					timeout = 1000;
				}
				
				var handler = new $.UponHnd(timeout, cond, todo);
				handler.start();
				
				// return
				return handler;
			},
			/**
			 * Upon handler. Used by the upon function.
			 */
			UponHnd : tnCla(function(){
				var 
				/**
				 * Until counter 
				 */
				untilCounter = new tnBasicCounter();
				
				// To be returned
				return {
				k : {
					/**
					 * The handles. Keys are instances returned by until counter.
					 *
					 */
					handles : {}
				},
				s : {
					_init : function(timeout, cond, todo){
						var self = this;
						self.timeout   = timeout;
						self.condition = $.isTNCallback( cond ) ? cond : $.cb(self, cond);
						self.todo      = $.isTNCallback( todo ) ? todo : $.cb(self, todo);
						
						/**
						 * Interval handler 
						 */
						self.IH = null;
						
						/**
						 * Global handles.
						 */
						//self.n = untilCounter.add();
						this.$TNSELF.handles[ self.n = untilCounter.add() ] = this;
						self.nstr = "tnC.UponHnd.handles['" + self.n + "']";
					},
					_uninit : function(){
						delete this.$TNSELF.handles[this.n];
						
						// Baka kailangan ito, delikado.
						// this.condition = this.todo = null;
					},
					
					/**
					 * Start 
					 */
					start : function(){
						if( $.exec( this.condition ) ){
							$.exec( this.todo );
							this._uninit();
						}
						else {
							var self = this;
							this.IH = setInterval(self.nstr + ".check()", this.timeout);
						}
					},
					/**
					 * Stop. Also uninitializes this thing.
					 *
					 */
					stop : function(){
						clearInterval(this.IH);
						this._uninit();
					},
					/**
					 * Checkinerval
					 */
					check : function(){
						if( $.exec( this.condition ) ){
							clearInterval(this.IH);
							//this.stop();
							$.exec( this.todo );
							this._uninit();
						}
					}
				}
			}})
		});

				
		/** 
		 * Publics for Others 
		 */
		tnObj.extend($, {
			/**
			 * Generic TN callback. 
			 *
			 * Shortcut: $.cb
			 *
			 * @usage f( scope, funcOrString)
			 * @usage f( scope, funcOrString, args)
			 *
			 * @param mixed scope - Scope. To scope windows, you can indicate "null".
			 *
			 * @param mixed funcOrString - Function or string containing function name of the scope.
			 *
			 * @param array args - Arguments.
			 */
			callback : $.cb = function(a,b,c){
				return new $.Callback(a,b,c);
			},
			/**
			 * TN callback class.
			 */
			Callback : tnCla({
				s : {
					/** 
					 * Constructor.
					 *
					 * @usage f( scope, funcOrString)
					 * @usage f( scope, funcOrString, params)
					 *
					 * @param mixed scope - Scope. To scope windows, you can indicate "null".
					 *
					 * @param mixed funcOrString - Function or string containing function name of the scope.
					 *
					 * @param array params - Parameter
					 */
					_init : function( scope, funcOrString, params ){
						// Argument validation, para sa ganun madali na lang 
						// ang mga bagay-bagay,
						//
						// the funcOrString will be converted to function, that is, hopefully,
						// the function with the name funcOrString exists in scope.
						if( ! scope ) 
							scope = taneni;
						if( ! $.isFunction( funcOrString ) )
							funcOrString = scope[funcOrString];
					
						// set to here.
						this.fn = funcOrString;
						this.scope = scope;
						this.args = params;
					}
				}
			}),

			/**
			 * Executes the function.
			 *
			 * @usage f(tnCallback, args)
			 * @usage f(ignored, tnCallback, args)
			 * @param tnC.Callback tnCallback - The tnCallback 
			 * @param args - The args to pass.
			 *
			 * @usage f(scope, func)
			 * @usage f(scope, func, args)
			 *
			 * @param mixed scope 
			 * @param mixed func - String or function to contain function 
			 * @param array args - List of arguments to be passed.
			 *
			 * @return The return value of the executed callback.
			 */
			exec : function(scope, func, args){
				var ret;
				try {

					// Process if scope is a callback.
					// For the arguments, the scope.args takes priority over args.
					if( $.isTNCallback( scope ) ){
						args  = scope.args || func;
						func  = scope.fn;
						scope = scope.scope;
					}
					else if( $.isTNCallback( func ) ){
						scope = func.scope;
						args  = func.args || args;
						func  = func.fn;
					}
					
					// For normal functions do this.
					scope = scope || taneni;
					
					// Scope is function.
					if( $.isString(func) )
						func = scope[func];

					//konsole.log( func );
					//konsole.log( func.apply );
					
					// Execute now.
					if( func ) //return undefined;
						ret = func.apply(scope, args || []);
				}catch(e){ konsole.error(e) }
				
				return ret;
			},
			
			/**
			 * Proxy
			 *
			 * @param mixed scope - The scope of the function to run.
			 *
			 * @param function|string func - The function. If a string this assumes it is the functon
			 *     in the scope.
			 *
			 * @param array args - Optional. The arguments to pass. This will override any arguments 
			 *     that has been passed to here.
			 *
			 * @note Derived from jQuery.proxy code.
			 */
			hitch : function(scope, func, args ){
				if( $.isString(func) )
					func = scope[func];
				
				if( !$.isFunction(func) ) return undefined;
				
				var hitched = function(){
					return func.apply(scope, args||arguments||[]);
				};
				
				// So it can be removed daw sabi ng jquery.
				hitched.$TNID = func.$TNID = func.$TNID || $.counter.add();
				
				return hitched;
			},
			
			/**
			 * Alias of tnC.obj.fromString
			 */
			fromString : function(str){
				return tnObj.fromString(str)
			},
			/**
			 * Alias of tnC.obj.getDeepProp
			 */
			getDeepProp : function(obj, prop){
				return tnObj.getDeepProp(obj, prop)
			},
			/**
			 * Alias of tnC.obj.getDeepProp
			 */
			setDeepProp : function(obj, prop){
				return tnObj.setDeepProp(obj, prop)
			}
		});
		
		/**
		 * For resolving objects from strings.
		 *
		 */
		tnObj.extend( tnObj, {
			/**
			 * Get a global object from the string..
			 *
			 * @return the property value
			 */
			fromString : function(str){
				return tnObj.getDeepProp(window, str);
			},
			/**
			 * Normalize
			 *
			 * @param object obj - The object to grab the property.
			 *
			 * @param string prop - The property to get.
			 *
			 * @return array containing [obj, immediateProperty]
			 */
			getPropPair : function(obj, prop){
				var prop_sep = (prop||'').split("."),
					prop_sep_length = prop_sep.length,
					ii, i,
					curObj = obj;
					
				for( i = 0; i < prop_sep_length - 1; i++){
					ii = prop_sep[i];
					
					try{
						curObj = curObj[ii];
					}catch(e){ 
						curObj = undefined; 
						break;
					}
				}
				
				return [curObj, prop_sep[ prop_sep_length - 1 ]];
			},
			/**
			 * Get deep property of the particular object.
			 *
			 * @param object obj - The object to grab the property.
			 *
			 * @param string prop - The property to get.
			 *
			 * @return whatever
			 */
			getDeepProp : function(obj, prop){
				var propPair = tnObj.getPropPair( obj, prop );
				
				return propPair[0] && propPair[0][propPair[1]];
			},
			/**
			 * Set deep property of the particular object.
			 *
			 * @param object obj - The object to grab the property.
			 *
			 * @param string prop - The property to get.
			 */
			setDeepProp : function(obj, prop, value){
				var propPair = tnObj.getPropPair( obj, prop );
				
				propPair[0][propPair[1]] = value;
			}
		});
		
		
		
		/**
		 * Gets the expando of a specific object. This also creates the 
		 * expando of the object if it hasn't been made yet.
		 *
		 * @param object obj - The object to apply expando 
		 *
		 * @param bool autoCreate - If true then this will autocreate 
		 *     the expando if it does not exist yet.
		 * 
		 * @return the expando object.
		 *
		 * @date 2016.09.07
		 */
		$.getExpando = function( obj, autoCreate ){
			var expandoVar = $.expando,
				expandoObj = {},
				expandoCounter = undefined;
				
			// if the object is dom do this 
			if( $[t='isDomElement'] ? $[t]( obj ) : false )
			//if( $.isDom ? $.isDom( obj ) : false )
			{
				if( ! obj[ expandoVar ] && autoCreate ){
					expandoCounter = $.counter.add();
					obj[ expandoVar ] = expandoCounter;
					$.cache[ expandoCounter ] = expandoObj;
				}
				
				return $.cache[ obj[ expandoVar ] ];
			}
			// For normal 
			else {
				if( ! obj[ expandoVar ]  && autoCreate  )
					  obj[ expandoVar ] = expandoObj;
				  
				return obj[ expandoVar ];
			}
		};
		
		/**
		 * Performs general cleanup on this tn object.
		 *
		 * @param obj - The object
		 *
		 * The cleanup will go on as follows:
		 *
		 * -> Its expandos are cleaned and cleared.
		 * -> Its expando ref is purged.
		 */
		$.cleanup = function( obj ){
			var ii, i,
				expandoVar = $.expando,
				objExpando = $.getExpando(obj);
				
			if( objExpando ){
				//konsole.log( obj );
				
				for( i in objExpando ){
					ii = objExpando[i];
					
					if( $.isObject(ii) && (ii.$TNHAJDUL || ii instanceof $.cla.Std ) ){
						ii._uninit();
					}
				}
				
				// Delete the expando ref from the cache.
				if( ! $.isObject( obj[ expandoVar ] ) )
					delete $.cache[ obj[ expandoVar ] ];
			}
		};
		
		/**
		 * Get object expando data.
		 *
		 * @usage f( object, property, value)
		 *
		 * @usage f( object, property)
		 *
		 * @param object object 
		 *
		 * @param string property - The property.
		 *
		 * @param mixed value - The value to be placed.
		 *
		 * @date 2016.09.07
		 *
		 */
		$.data = function(object, property, value){
			var args = arguments||[],
				argl = args.length;
				
			// Autocreate expando only if args is 3
			var expd = $.getExpando( object, argl == 3 );
				
			if( expd ){
				if( argl == 3 ){
					expd[ property ] = value;
					//return this;
				}
				
				return expd[ property ];
			}
		};
		 
		/**
		 * Removes the data from the object.
		 *
		 * @param object  object -
		 *
		 * @param string  name - The name of the data to remove. If blank 
		 *     this will remove all the data from the lib.
		 */
		$.removeData = function(object, name){
			// Autocreate expando only if args is 3
			var i, expd = $.getExpando( object );
			
			if( expd ){
				// Single
				if( name ){
					isA( expd[name] ) && expd[name]._uninit();
					delete expd[name];
				}
				// Pakyawan
				else {
					for(i in expd){
						isA( expd[name] ) && expd[name]._uninit();
						delete expd[name];
					}
				}
			}
		};
		 
		/****************************************
		 * Make the global counter.
		 */
		$.counter = new tnBasicCounter();
	});

	/**
	 * Array Functions here.
	 */
	$(function(){
		var 
		/**
		 * javascript array 
		 */
		//jsArray = []
		
		/**
		 * JSArray has native indexOf?
		 *
		 */
		//, jsArrayHasIndexOf = !!jsArray.indexOf
		/**
		 * The base array.
		 *
		 * 
		 * @note This is the initial structure, many will be added later on.
		 */
		tnBaseArray = $.BaseArray = tnCla({
			s : function(){
				var struct = {};
				
				/**
				 * Initialize structure.
				 */
				struct._init = function(initialList){
					this.length = 0;
				};
				/**
				 * Returns the link to the main list.
				 *
				 */
				struct.list = function(){
					return this;
				};
				
				// copy some of the array's built-in functions 
				var t_mkArrayFunc = function(struct, jsArray, what){
					struct[what] = function(){ return jsArray[what].apply(this.list(), arguments||[]); }
				};
				//for(  t ='push pop shift unshift join map sort splice slice indexOf'.split(' '), i = 0; i < t.length; i++)
				for(  t ='join map sort slice indexOf'.split(' '), i = 0; i < t.length; i++)
					//struct[t[i]] = jsArray[t[i]];
					t_mkArrayFunc( struct, jsArray, t[i] );
				
				return struct;
			}
		});
		
		/**
		 * Private functions that are used by some of the functions
		 * in this library.
		 *
		 */
		var 
		/**
		 * The main callback.
		 *
		 * @return true if comparison succeeded.
		 */
		indexOfCheckEqual = function(item, index, comparison, argspa){
			if( $.isTNCallback( comparison ) ){
				return $.exec( null, comparison, [item, index].concat( toJsArray( argspa ) ));
			}
			return item == comparison;
		}
		
		/**
		 * The one that performs check on each item, and adds them 
		 * to the list if the callback returns true.
		 */
		, mapEachItemArray = function(item, index, list, callback, originalList, argspa){
			list.push( $.exec( null, callback, [item, index, originalList].concat(argspa) ) );
		}
		, mapEachItemObject = function(item, index, list, callback, argspa){
			list[index] = $.exec( null, callback, [item, index, originalList].concat(argspa) );
		}
		
		/**
		 * The one that performs check on each item, and adds them 
		 * to the list if the callback returns true.
		 */
		, grepEachItemArray = function(item, index, list, callback, argspa){
			if( $.exec( null, callback, [item, index].concat(argspa) ) )
				list.push( item );
		}
		, grepEachItemObject = function(item, index, list, callback, argspa){
			if( $.exec( null, callback, [item, index].concat(argspa) ) )
				list[index] = item;
		};
		;
		
		/**
		 * Base array functions.
		 *
		 */
		tnObj.extend($,{
			/**
			 * Get the plain list.
			 */
			plainList : function(list){
				if( $.isArrayLike(list) ){
					if( $.isTNArray(list) ) return list.list();
					
					return list;
				}
				return $.isObject(list) && list;
			},
			
			/**
			 * Convert the item to array.
			 *
			 * @param mixed what - The one to convert.
			 *
			 * @return the array
			 */
			toArray : toJsArray,
			
			/**
			 * Performs the callback in each item in list.
			 * 
			 * @usage f(list, startAt, endAt, callback, argspa)
			 * @usage f(list, startAt, endAt, callback)
			 * @usage f(list, startAt, callback, argspa)
			 * @usage f(list, startAt, callback)
			 * @usage f(list, callback, argspa)
			 * @usage f(list, callback)
			 *
			 *
			 * @param Array|Object list 
			 *
			 * @param Callable callback - The action to be done on each items.
			 *     Accepts (item, index).
			 *
			 *     Make the callback return false to break the loop.
			 *
			 * @param int startAt - Optional, the place where to start.
			 * 
			 */
			each : function(list, startAt, endAt, callback, argspa ){
				var ii, i, ret, u, 
					args = toJsArray(arguments).slice(1, 5),
					argl = args.length;
				
				// Callback is always the last element.
				// After this, the args shall have the first and last passed arguments removed.
				if( $.isArrayLike( args[argl - 1] ) ){
					argspa = args.pop();
				}
				callback = args.pop();
			
				// what remains.
				startAt = args[0];
				endAt   = args[1];
				
				
				// Process the list.
				argspa = argspa || [];
				if( $.isArrayLike(list) ){
					
					list = $.plainList(list);
					endAt = endAt || list.length;
					
					for( i = startAt||0; i < endAt; i++ ){
						if( $.exec(taneni, callback, [list[i], i].concat(argspa)) === false ) break;
					}
				}
				else if( $.isObject(list) ){
					for( i in list ){
						if( $.exec(taneni, callback, [list[i], i].concat(argspa)) === false ) break;
					}
				}
				// tnC.each([1,2,3,4,5,6,7,8,9,10], function(ii, i){ konsole.log( ii )})
			},
			
			/** 
			 * Gets the index of the item or callback in the list.
			 *
			 * @usage f(list, item[, startAt[, argspa]])
			 * @usage f(list, item[, startAt])
			 * @usage f(list, item[, argspa])
			 * @usage f(list, item)
			 *
			 * @param array|object list - The list to process.
			 *
			 * @param mixed list - The item to find. If this is tnC.Callback, the function that 
			 *     determines if this is the function being sought. Return true if the item 
			 *     has been sought.
			 *     
			 * @param int startAt - The place where to start the search 
			 *
			 * @param array argspa - The additional params to pass if the item is of type tnC.Callback.
			 *
			 * @return the index of the found item. If not found, this returns -1 if list is an 
			 *     array, undefined if list is object.
			 * 
			 */
			indexOf :  function(list, item, startAt, argspa){
				if( $.isArrayLike(list) 
					&& jsArrayHasIndexOf && !$.isTNCallback(item) 
					)
					return jsArray.indexOf.call($.plainList(list), item, startAt);
				
				
				// Process arguments.
				var i, ii,
					args = toJsArray( arguments ).slice(2),
					argl = args.length;
					
				// Process arguments dito.
				if( argl && $.isArray( args[argl - 1]) ) {
					argspa = args.pop();
				}
				startAt = (argl = args.length) ? args[0] : 0;
					
				
				// For array
				if( $.isArrayLike(list) ){
					list = $.plainList(list);
					
					startAt = (1 * startAt) || 0;
					
					for( i = startAt; i < list.length; i++ ){
						if( indexOfCheckEqual(list[i], i, item, argspa) ) return i;
					}
					return -1;
				}
				// For object
				if( $.isObject(list) ){
					for( i in list ){
						//konsole.log( i );
						if( indexOfCheckEqual(list[i], i, item, argspa) ) return i;
					}					
					return undefined;
				}
			},
			
			/**
			 * Pushes an item to the list. Only the ArrayLike will be processed here.
			 *
			 *
			 * @usage f(item)
			 * @usage f(item, where)
			 *
			 * @param mixed item - The item to push
			 * @param mixed where - The place where to place. Optional. If not specified 
			 *     this will be placed at the end of the list.
			 */
			push : function( list, item, where){
				// For array.
				if( $.isArrayLike(list) ){
					list = $.plainList(list);
					
					if( !$.isUndefined(where) && where===null ){
						where = (where * 1) || 0;
						where = (where < 0) ? 0 
							: where >= list.length ? undefined : where;
					}
					
					if( $.isUndefined(where) ){
						jsArray.push.call(list, item);
					}
					else {
						jsArray.splice.call(list, where, 0, item);
					}
				}
			},
			
			/**
			 * Removes the first instance of the item in the list.
			 *
			 * @param array|object list 
			 *
			 * @param mixed item 
			 *
			 * @param number start
			 * 
			 */
			removeItem : function( list, item, start){
				list = $.plainList(list);
				
				var indexOfItem = $.indexOf( list, item );
				if( $.isArrayLike(list) ? indexOfItem >= 0 : !$.isUndefined(indexOfItem) ){
					$.removeAt( list, indexOfItem );
					
					//if( $.isTNArray(list) ) list._doOnRemoveItem(item)
				}
			},
			/**
			 * Remove the item in the index.
			 *
			 */
			removeAt : function( list, index ){
				list = $.plainList(list);
				
				var itemRemoved = list[index];
				
				if( $.isArrayLike(list) ){
					jsArray.splice.call(list, index, 1);
					
					//if( $.isTNArray(list) ) list._doOnRemoveItem(item)
				}
				else if( $.isObject(list) ){
					delete list[ index ];
				}
			},
			
			/**
			 * Action when an item is removed.
			 *
			 */
			 
			/**
			 * Clears the list.
			 *
			 * @param array|object list - The list to be cleared.
			 * @param Callable callback - Internally used. The callback to call on each object 
			 *     prior to deletion.
			 *     Accepts item.
			 *
			 */
			clear : function( list, callback ){
				var i;
				if( $.isArrayLike(list) ){
					list = $.plainList( list );
					while( list.length ){
						$.exec(null, callback, [list[0]]);
						list.shift();
					}
				}
				else if( $.isObject(list) ){
					for( i in list ){
						$.exec( null, callback, [list[i]])
						delete list[i];
					}
				}
			},
			 
			/**
			 * Creates a new array with the results of calling a provided function on every element in this array.
			 *
			 * @param list - The list to be processed
			 *
			 * @param callback - The current element being processed as an array.
			 *
			 * @return the new array with the items being the result of the callback item
			 */
			map : function( list, callback, argspa ){

				var i, ii, 
					ret = null, // <- return function
					fncb;       // <- the callback to be used by forEach.
					
				argspa = toJsArray( argspa );
				
				// For array.
				if( $.isArrayLike( list ) ){
					ret = [];
					fncb = mapEachItemArray;
					
					//$.each( list, mapEachItemArray, [ret, callback, list, argspa])
				}
				// For object.
				else if( $.isObject( list ) ){
					ret = {};
					fncb = mapEachItemObject;
					
					//$.each( list, mapEachItemObject, [ret, callback, list, argspa])
				}
				
				if( fncb )
					$.each( list, fncb, [ret, callback, list, argspa])

				return ret;
			},
			 
			/**
			 * Grep
			 *
			 * @usage (list, callback)
			 *
			 * @param array|object list - List to be filtered.
			 *
			 * @param Callable callback - The one that evaluates if the item should be added 
			 *     to the resulting list. It must return true or false.
			 *
			 * @param argspa - Additional params to be passed 
			 *
			 * @return if list is an ArrayLike, returns the plan JS array of the items filtered.
			 *     If the list is an Object, returns the object just containing the items and 
			 *     their keys that has been filtered.
			 */
			grep : function( list, callback, argspa ){
				
				var i, ii, ret = null;
				
				argspa = toJsArray( argspa );
				
				//if( $.isArray(args[argl-1]) ) argspa = args.pop();
				
				// For array.
				if( $.isArrayLike( list ) ){
					ret = [];
					
					$.each( list, grepEachItemArray, [ret, callback, argspa])
				}
				// For object.
				else if( $.isObject( list ) ){
					ret = {};
					
					$.each( list, grepEachItemObject, [ret, callback, argspa])
				}
				
				return ret;
			}
		});
		
		/**
		 * Extend pa more the tnBaseArray.
		 *
		 */
		tnCla.struct(tnBaseArray, {
			/**
			 * Gets the number of items in this list.
			 *
			 * @return The number.
			 */
			getLength : function(){
				return this.length
			},
			
			/**
			 * Some implementation of indexOf here.
			 *
			 * @usage indexOf( item[, startAt[, argspa ] ] )
			 * @usage indexOf( item[, startAt ] )
			 * @usage indexOf( item[, argspa ] )
			 * @usage indexOf( item )
			 */
			indexOf : function( item, startAt ){
				return $.indexOf.apply( $, [this].concat( toJsArray( arguments ) ) );
			},

			/**
			 * Detaches an item from the list, without uninitializing them.
			 *
			 * 
			 */
			pull : function(item){
				var list = this.list(),
					indexOfItem = this.indexOf( item );
				
				if( $.isArrayLike(list) ? indexOfItem >= 0 : !$.isUndefined(indexOfItem) ){
					this.pullAt(indexOfItem);
				}
			},
			
			/**
			 * Performs action when item is removed.
			 *
			 * @param index - The index of the item to be removed.
			 */
			pullAt : function(index){
				$.removeAt( this, index );
			},
			
			/**
			 * Removes an item from the list.
			 *
			 * @param mixed item - The item to remove.
			 */
			removeItem : function(item){
				var list = this.list(),
					indexOfItem = this.indexOf( item );
				
				if( $.isArrayLike(list) ? indexOfItem >= 0 : !$.isUndefined(indexOfItem) ){
					this.removeAt(indexOfItem);
				}
			},
			
			/**
			 * Performs action when item is removed.
			 *
			 * @param index - The index of the item to be removed.
			 */
			removeAt : function(index){
				var itemRemoved = this.list()[index];
				
				this.pullAt(index);
				//$.removeAt( this, index );
				
				this._doOnRemoveItem(itemRemoved);
			},
			
			/**
			 * Pushes an item to the list.
			 *
			 *
			 * @return the added object
			 */
			push : function(item, where){
				var ret = $.push( this, item, where );
				
				this._doOnAddItem(item);
				
				return item;
			},
			
			/**
			 * Removes the first item in the list.
			 *
			 * This triggers _onRemoveItem().
			 *
			 * @return The removed item
			 *
			 * @date 2017.02.07
			 */
			unshift : function(item){
				jsArray.unshift.call( this.list(), item );
				
				this._doOnAddItem(item);
				
				return item;
			},
			
			/**
			 * Removes the first item in the list.
			 *
			 * This triggers _onRemoveItem().
			 *
			 * @return The removed item
			 *
			 * @date 2017.02.07
			 */
			shift : function(){
				var ret = jsArray.shift.call( this.list() );
				
				this._doOnRemoveItem(ret);
				
				return ret;
			},
			
			/**
			 * Removes the last item in the list.
			 * 
			 * This triggers _onRemoveItem().
			 *
			 * @return The removed item
			 */
			pop : function(){
				var ret = jsArray.pop.call( this.list() );
				
				this._doOnRemoveItem(ret);
				
				return ret;
			},
			
			/**
			 * Changes the contents of an array by removing existing elements and/or adding new elements.
			 *
			 * @param number  start - The starting position 
			 *
			 * @param number  deleteCount - Optional. The number items from the `start` to be removed.
			 *     If `deleteCount` is 0, no items will be removed.
			 *
			 * @param  param1, paramn... - Optional. The items to be added from the `start`.
			 */
			splice : function(start, deleteCount){
				var args = toJsArray(arguments),
					argl = args.length,
					i,
					
					added = args.slice(2),
					removed = jsArray.splice.apply(this, args);
				
				// Process removed items and added items
				for( i = 0; i < removed.length; i++)
					this._doOnRemoveItem(removed[i]);
				
				for( i = 0; i < added.length; i++)
					this._doOnAddItem(added[i]);
			},
			
			/**
			 * Clears the item.
			 *
			 */
			clear : function(){
				$.clear( this, $.callback( this, '_onRemoveItem') );
			},
			
			/**
			 * Internal: Performs action when item is added.
			 *
			 *
			 *
			 * @access private
			 */
			_doOnAddItem : function(itemAdded){
				this._onAddItem(itemAdded);
			},
			
			/**
			 * Internal add item. Performs action when item is removed.
			 *
			 * This is to be extended by the child classes.
			 *
			 */
			_onAddItem : function(itemAdded){
				
			},
			
			/**
			 * Internal: Performs action when item is removed.
			 *
			 *
			 *
			 * @access private
			 */
			_doOnRemoveItem : function(itemRemoved){
				this._onRemoveItem(itemRemoved);
			},
			
			/**
			 * Internal remove item. Performs action when item is removed.
			 *
			 * This is to be extended by the child classes.
			 *
			 */
			_onRemoveItem : function(itemRemoved){
				
			}
		})
		 
		/**
		 * Base TN collection
		 */
		var tnCollection = $.Collection = tnCla({
			base : tnBaseArray
		});
	});
	
	/**
	 * Event functions here. 
	 *
	 * @requires tn.Array
	 */
	$(function(){

		
		/**
		 * Event Repository.
		 *
		 */
		var tnEv = $.ev = function(){
			
		};
		
		/**
		 * Privates 
		 */
		var 
		
		/**
		 * Private counter.
		 *
		 */
		counter = new $.BasicCounter(),
		
		/**
		 * Data variable property used for event bag.
		 *
		 */
		expandoEventBagVar = 'eventBag',
		
		/**
		 * make native event function for the event.
		 *
		 * @param object obj 
		 *
		 * @param string name
		 */
		makeNativeEventFunction = function(obj, name ){
			var localEvent = function(){
				$.data(this, expandoEventBagVar).fire(name, arguments||[]);
			};
			
			// Two modes, one is the standard for DOM and another is for normal.
			if( obj.addEventListener ){
				obj.addEventListener(name.substr(2), localEvent);
			}
			// Normal.
			else {
				obj[ name ] = localEvent;
			}
			
			return localEvent;
		},
		/**
		 * make native event function for the event.
		 *
		 * @param object obj 
		 *
		 * @param string name
		 */
		removeNativeEventFunction = function(obj, name ){
			var expando = $.data(obj, expandoEventBagVar);
			
			if( expando ){
				if( obj.removeEventListener ){
					obj.removeEventListener( name.substr(2), expando.localEvents[ name ] );
				}
				else {
					delete obj[ name ];
				}
			}
		},
		/**
		 * Event collection. Contains functions for that 
		 * particular event.
		 *
		 */
		 
		
		/**
		 * Event collection. Contains functions for that 
		 * particular event.
		 *
		 */
		EventCollection = $.ev.evcol = $.cla({
			//base : $.Collection,
			s : {
				_init : function(){
					/**
					 * The list of the functions.
					 *
					 */
					this.list = {};
				},
				_uninit : function(){
					this.clear();
				},
				
				/**
				 * Adds an item to the list.
				 *
				 * @return the index of the new item.
				 *
				 */
				push : function( item, isOnce ){
					var index = counter.add();
					
					this.list[ index ] = {
						/**
						 * The function.
						 */
						fn   : item,
						
						/**
						 * Will run only once?
						 *
						 */
						once : isOnce
					};
										
					return index;
				},
				
				/**
				 * Removes an item to the list.
				 *
				 */
				remove : function( item ){
					var index = $.indexOf( this.list, $.cb(function(ii, i, item){ return ii == item }), [item]);
					index && this.removeAt( index );
				},
				
				/**
				 * Removes an item by its id.
				 *
				 * @param string id - The id previously returned by this.push
				 *
				 */
				removeAt : function( id ){
					$.removeAt( this.list, id );
				},
				
				/**
				 * Clear me.
				 *
				 */
				clear : function(){
					$.clear( this.list );
				},
				
				/**
				 * Fires the sequence of the events here.
				 *
				 * @usage f(scope)
				 * @usage f(scope, params)
				 *
				 * The parameters passed here shall be passed to each of the functions.
				 *
				 */
				fire : function( scope, params ){
					var i,ii;
					
					params = params || [];
					
					for( i in this.list ){
						$.exec( scope, (ii = this.list[i]).fn, params);
						
						// delete the "once" list from the list.
						ii.once && delete this.list[i];
					}
				}
			}
		}),
		
		/**
		 * Event bag. This will be assigned to the objects.
		 *
		 *
		 */
		EventBag = $.cla({
			s : {
				_init : function( obj ){
					/**
					 * The bound object.
					 *
					 */
					this.obj = obj;
					
					/**
					 * List of event list. Each is keyed by 
					 * the event name.
					 */
					this.ca = {};
					
					/**
					 * List of local functions.
					 *
					 *
					 */
					this.localEvents = {};
				},
				_uninit : function(){
					var i, ii, li, self = this;

					// Clear local events from the object.
					for( i in (li = self.localEvents) ){
						ii = li[i];
						
						if( self.obj[i] ){
							removeNativeEventFunction( self.obj, i );
						}
						
						delete li[i];
					}
					
					// Clear all
					self.clear();
					
					// Clear object, let's see if self is still necessary.
					self.obj = null;
					
					// Clear from super function.
					self.$super('_uninit');
				},
				
				/**
				 * Binds a function or a callable to the specific event name.
				 *
				 * @param string name - The name of the event to bind
				 *
				 * @param callable fn - The callback
				 *
				 * @return the id of the event that has been pushed in.
				 */
				bind : function(name, fn){
					return this._prepColn(name).push( fn );
				},
				
				/**
				 * Binds a function or a callable that will be bound once.
				 *
				 * @param string name - The name of the event to bind
				 *
				 * @param callable fn - The callback
				 *
				 * @return the id of the event that has been pushed in.
				 */
				once : function(name, fn){
					
					return this._prepColn(name).push( fn, true );
				},
				
				/**
				 * prepareCollection
				 *
				 * Returns the event collection of the given name, or create one if it doesn't exist yet.
				 *
				 *
				 * @param string  name - The name of the event.
				 *
				 * @return The EventCollection 
				 *
				 */
				_prepColn : function(name){
					var evCol;
					if( !(evCol = this.ca[name] ) ) 
						  evCol = this.ca[name] = new EventCollection();
					  
					return evCol;
				},
				
				/**
				 * Unbinds a function or a callable from the specified event name.
				 *
				 * If fnid is not specified, this clears the entire collection in the 
				 * specified event. 
				 * 
				 * @param string name - The event name 
				 *
				 * @param string fnId - The function id previously returned by bind.
				 *
				 *
				 */
				unbind : function( name, fnId ){
					var evCol = this.ca[name],
						args = arguments||[];
					
					if( evCol ){
						if( args.length == 1)
							evCol.clear();
						else 
							evCol.removeAt( fnId );
					}
				},
				
				/**
				 * Unbinds a function by its id.
				 *
				 * @param string fnId The function id previously returned by this.find.
				 * 
				 */
				unbindById : function( fnId ){
					var i, ii, j, jj;
					for( i in this.ca ){
						ii  = this.ca[i];
						
						if( j = $.indexOf( ii.list, fnId ) ){
							ii.removeAt( j );
							break;
						}
					}
				},
				
				/**
				 * Fires the event.
				 *
				 * @usage f( name, params)
				 *
				 * @param string name - The event name 
				 * @param array params - Optional. The params to be passed to the event.
				 */
				fire : function( name, params ){
					var evCol  = this.ca[name];
					
					if( evCol ){
						evCol.fire( this.obj, params );
					}
				},
				
				/**
				 * Clears all the events here.
				 *
				 */
				clear : function(){
					$.clear(this.ca, $.cb(this, function(ii, name){
						removeNativeEventFunction(this.obj, name);
						ii._uninit();
					}) );
				}
			}
		}),
		
		/**
		 * Gets the event bag of the object, or make one if it doesn't exist yet.
		 *
		 * Also prepares the localEvent thingy on the object if needed.
		 *
		 *
		 * @return the event bag
		 */
		prepareEventBag = function( obj, name ){
				// Make an event bag out of the data
				var eventBag = $.data(obj, expandoEventBagVar);
				if( ! eventBag )
					  eventBag = $.data(obj,expandoEventBagVar, new EventBag(obj));
				  
				  
				// Create local event runner here.
				var localEvent = eventBag.localEvents[name];
				if( ! localEvent ) {
					  localEvent = makeNativeEventFunction(obj, name);
					eventBag.localEvents[name] = localEvent;
				}

				return eventBag;
		};
		
		/**
		 * Event public functions.
		 *
		 */
		tnObj.extend( tnEv, {
			/**
			 * Performs bind.
			 *
			 *
			 * @return function name
			 */
			bind : function(obj, name, fn){
				// return value
				return prepareEventBag(obj, name).bind(name, fn);
			},
			/**
			 * Performs bind.
			 *
			 *
			 * @return function name
			 */
			once : function(obj, name, fn){
				// return value
				return prepareEventBag(obj, name).once(name, fn);
			},
			/**
			 * Performs unbind.
			 *
			 * @usage f(obj)
			 * @usage f(obj, name)
			 * @usage f(obj, name, fnid)
			 *
			 * @param object obj - The object 
			 *
			 * @param string name - The event name .
			 *
			 * @param string fnId - The function id, previously returned by $.bind, to remove.
			 *
			 */
			unbind : function(obj, name, fnId){
				var eventBag = $.data(obj, expandoEventBagVar);
				if( eventBag ){
					if( name ){
						return eventBag.unbind.apply(eventBag, toJsArray(arguments).slice(1)  );
					}
					else {
						eventBag.clear();
					}
				}
			},
			/**
			 * Performs unbind by id.
			 *
			 * @param object obj - The object 
			 *
			 * @param string fnId - The function id, previously returned by $.bind, to remove.
			 *
			 */
			unbindById : function(obj, fnId){
				if( name ){
					var eventBag = $.data(obj, expandoEventBagVar);
					if( eventBag ){
						return eventBag.unbindById( fnId );
					}
				}
			},
			/**
			 * Performs fire, or fires the event in the object.
			 *
			 * @usage f(obj, name[, param1[, paramN...]])
			 *
			 * @param object obj 
			 *
			 * @param string name - Event name 
			 *
			 * @param mixed param1, paramN - Parameters to pass.
			 */
			fire : function(obj, name, params){
				var eventBag = $.data(obj, expandoEventBagVar),
					args = toJsArray(arguments).slice(2);
					
				// Normal: By event bag
				if( eventBag ){
					return eventBag.fire(name, args);
				}
				
				// If this is a Callable then do this, this is to be compatible 
				// with oldschool event setting.
				if( $.isTNCallback( obj[name] ) || $.isFunction( obj[name] ) ){
					return $.exec( obj, name, args );
				}
			}
		});
		
		/**
		 * Shortcuts to base TN variables.
		 */
		tnObj.extend($, {
			once       : makeAlias(tnEv, 'once'), //function(){ return tnEv.bind.apply(tnEv, arguments||[]) },
			bind       : makeAlias(tnEv, 'bind'), //function(){ return tnEv.bind.apply(tnEv, arguments||[]) },
			unbind     : makeAlias(tnEv, 'unbind'), //function(){ return tnEv.unbind.apply(tnEv, arguments||[]) },
			unbindById : makeAlias(tnEv, 'unbindById'), //function(){ return tnEv.unbindById.apply(tnEv, arguments||[]) },
			fire       : makeAlias(tnEv, 'fire'), //function(){ return tnEv.fire.apply(tnEv, arguments||[]) },
		})
	});
})(window);