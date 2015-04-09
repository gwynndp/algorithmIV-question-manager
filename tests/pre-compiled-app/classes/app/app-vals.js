  /**
   * -----------------------------------------------------
   * Public Class (AppVals)
   * -----------------------------------------------------
   * @desc The app's current values.
   * @param {number} quesLen - The number of questions for the app.
   * @constructor
   */
  var AppVals = function(quesLen) {

    /** @type {number} */
    var i;

    // $s$
    /**
     * ---------------------------------------------------
     * Public Property (AppVals.debug)
     * ---------------------------------------------------
     * @desc The Debug instance for the AppVals class.
     * @type {Debug}
     */
    this.debug = aIV.debug('AppVals');

    this.debug.start('init');
    this.debug.args('init', quesLen, 'number');
    // $e$
    /**
     * ----------------------------------------------- 
     * Protected Property (AppVals.ids)
     * -----------------------------------------------
     * @desc The ids of the questions that match the current search
     *   criteria.
     * @type {nums}
     * @private
     */
    var ids;

    /**
     * ----------------------------------------------- 
     * Protected Property (AppVals.len)
     * -----------------------------------------------
     * @desc The number of questions that match the current search
     *   criteria.
     * @type {num}
     * @private
     */
    var len;

    /**
     * ----------------------------------------------- 
     * Protected Property (AppVals.index)
     * -----------------------------------------------
     * @desc The current index of the ids array being displayed.
     *   If the view = 'all' or no ids match then index = -1.
     * @type {num}
     * @private
     */
    var index;

    /**
     * ----------------------------------------------- 
     * Public Method (AppVals.get)
     * -----------------------------------------------
     * @desc Gets an app value.
     * @param {string} prop - The name of the value to get.
     * @return {(num|nums)}
     */
    this.get = function(prop) {

      var debugMsg;
      this.debug.start('get', prop);
      this.debug.args('get', prop, 'string');

      /** @type {Object<string, (num|nums)>} */
      var values = {
        ids  : ids,
        len  : len,
        index: index
      };

      debugMsg = 'Error: The given property does not exist. property= $$';
      this.debug.fail('get', values.hasOwnProperty(prop), debugMsg, prop);

      return values[prop];
    };
    Object.freeze(this.get);

    /**
     * ----------------------------------------------- 
     * Public Method (AppVals.reset)
     * -----------------------------------------------
     * @desc Resets the app values.
     * @param {nums} newIds - The new matching question ids.
     * @param {num=} newIndex - The starting index.
     */
    this.reset = function(newIds, newIndex) {

      this.debug.start('reset', newIds, newIndex);
      this.debug.args('reset', newIds, 'numbers', newIndex, 'number=');

      /**
       * @type {num}
       * private
       */
      var newLen;

      newLen = newIds.length || 0;

      // Set newIndex
      if (app.searchBar.vals.view === 'all') {
        newIndex = -1;
      }
      else {
        if (newLen) {
          if (typeof newIndex !== 'number' ||
              newIndex < 0 || newIndex >= newLen) {
            newIndex = 0;
          }
        }
        else {
          newIndex = -1;
        }
      }

      // Reset the values
      ids = (newLen) ? newIds.slice(0) : [];
      len = newLen;
      index = newIndex;
    };
    Object.freeze(this.reset);

    /**
     * ----------------------------------------------- 
     * Public Method (AppVals.move)
     * -----------------------------------------------
     * @desc Go to the prev, next, or a specific index.
     * @param {(string|number)} way - The location to move the index.
     *   The options are 'prev', 'next', or a question id.
     * @return {num} The new index.
     */
    this.move = function(way) {

      var debugMsg, debugCheck;
      this.debug.start('move', way);
      this.debug.args('move', way, 'string|number');
      // Debug message for initial value checks
      debugMsg = 'Error: An incorrect value was given for way. way= $$';

      /**
       * @type {string}
       * private
       */
      var view;
      /**
       * @type {num}
       * private
       */
      var last;

      // Check the value for way
      if (typeof way === 'string' &&
          way !== 'prev' && way !== 'next') {
        way = way.replace(/[^0-9]/g, '');
        this.debug.fail('move', !!way, debugMsg, way);
        way = Number(way);
      }
      // $s$
      if (typeof way !== 'string') {
        debugCheck = (way > 0 && way <= app.questions.len);
        this.debug.fail('move', debugCheck, debugMsg, way);
      }
      // $e$

      // Save the value of the current view
      view = app.searchBar.vals.view;

      if (typeof way === 'number') {
        if (view !== 'one') {
          app.searchBar.vals.view = 'one';
        }
        index = ids.indexOf(way);
        this.debug.fail('move', (index !== -1), debugMsg, way);
        return index;
      }

      debugMsg = 'Error: This method should not have been called now. ';
      debugMsg += 'The nav elements should be hidden.';

      // Save the last index
      last = len - 1;

      // The single view actions
      if (view === 'one') {

        this.debug.fail('move', (len > 1), debugMsg);

        if (way === 'prev') {
          index = (index === 0) ? last : --index;
        }
        else if (way === 'next') {
          index = (index === last) ? 0 : ++index;
        }

        return index;
      }

      // The ten view actions
      if (view === 'ten') {

        this.debug.fail('move', (len > 10), debugMsg);

        // Update the last index
        last -= (last % 10);

        if (way === 'prev') {
          index = (index === 0) ? last : (index - 10);
        }
        else if (way === 'next') {
          index = (index === last) ? 0 : (index + 10);
        }

        return index;
      }

      debugMsg = 'Error: An incorrect view was parsed. ';
      debugMsg += 'app.searchBar.vals.view= $$';
      this.debug.fail('move', false, debugMsg, view);
    };
    Object.freeze(this.move);


    // Setup the properties
    ids = new Array(quesLen);
    len = quesLen;
    index = 0;

    i = quesLen;
    while (i--) {
      ids[i] = i + 1;
    }
  };

  // Ensure constructor is set to this class.
  AppVals.prototype.constructor = AppVals;
