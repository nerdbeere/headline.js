(function($) {
    $.headline = function(element, options) {

        // default settings
        var defaults = {
            inputMarkup: '<input type="text" />',
            inputWrapperMarkup: '<p />',
            lineClass: 'line',
			lineMarkup: '<h2 />',
            inputContainer: 'inputContainer',
            inputClass: 'headlineInput',
			headlineContainerClass: 'headlineContainer',
            draggable: true,
			editable: false,
			lines: [
				{
					text: '',
					offset: 0
				},
				{
					text: '',
					offset: 0
				}
			]
        };

        var plugin = this;

        plugin.settings = {};

        var $element = $(element);
        var inputContainer;

        // initital 
        plugin.init = function() {
            // merge user options with default options
            plugin.settings = $.extend({}, defaults, options);

            // get all lines
			var lines = plugin.settings.lines;
			for(var i = 0; i < lines.length; i++){
				var $line = $(plugin.settings.lineMarkup);
				$line.addClass(plugin.settings.lineClass);

				$span = $('<span />');
				$span.text(lines[i].text);
				$span.css('left', lines[i].offset);
				$span.css('top', '0px !important');
				$span.css('position', 'relative');

				$line.append($span);

				$('.' + plugin.settings.headlineContainerClass, $element).append($line);
			}

			if(plugin.settings.editable) {
				initEditMode();
			}

            bindEvents();
        };

		function initEditMode() {
			$element.addClass('editable');
			inputContainer = $('.' + plugin.settings.inputContainer, $element);
			var lines = $('.' + plugin.settings.lineClass, $element);

			// loop through each line and build the necessary DOM
			for(var i = 0; i < lines.length; i++) {

				// get some DOM elements
				var $input = $(plugin.settings.inputMarkup);
				var $line = $(lines[i]);
				var $inputWrapper = $(plugin.settings.inputWrapperMarkup);
				var lineText = $('span', $line).text();

				$input.data('key', i);
				$input.addClass(plugin.settings.inputClass);
				$input.attr('placeholder', 'Line ' + Number(i + 1))

				$inputWrapper.append($input);

				$input.val(lineText);

				$line.addClass(plugin.settings.lineClass + '_' + i);
				inputContainer.append($inputWrapper);
			}

			// init dragging
			if(plugin.settings.draggable) {
				$('span', '.line').draggable({
					containment: 'parent'
				});
			}
		}

        function bindEvents() {

            $('.' + plugin.settings.inputClass).on('keydown', function(e) {
                var $elem = $(this);

				/**
				 * This is a hack to make sure we already
				 * have the content in the input element.
				 */
				window.setTimeout(function() {
					addText($elem);
				}, 0);

				return true;
            });
        }

        function addText($elem) {
            var $headlineElem = $('.' + plugin.settings.lineClass + '_' + $elem.data('key') + ' span', $element);
            var $tmpHeadline = $headlineElem.clone();

            $tmpHeadline.text($elem.val());
            $headlineElem.append($tmpHeadline);
            var textWidth = $tmpHeadline.width();
            var lineWidth = $headlineElem.parent().width();
            $tmpHeadline.remove();

            if(textWidth + getOffset($headlineElem) < lineWidth) {
                $headlineElem.text($elem.val());
				setNewValue($elem, $headlineElem, $headlineElem.text(), textWidth, lineWidth);
				return true;
            }
			setNewValue($elem, $headlineElem, $headlineElem.text(), textWidth, lineWidth);
			return false;
        }

		var prevVal = '';
		function setNewValue($elem, $headlineElem, val, textWidth, lineWidth) {
			if(val !== prevVal || textWidth + getOffset($headlineElem) > lineWidth) {
				prevVal = val;
				$elem.val(val);
			}
		}

        function getOffset($line) {
            return Number($line.css('left').split('px')[0]) || 0;
        }

        plugin.init();

        // return an object with public methods
        return {
            getData: function() {
                var linesArr = [];
				var lines = $('.' + plugin.settings.lineClass, $element);
                for(var i = 0; i < lines.length; i++) {
                    var $line = $('span', $(lines[i]));
                    var offset = getOffset($line);
                    var text = $line.text();

                    var lineObj = {
                        text: text,
                        offset: offset
                    }

                    linesArr.push(lineObj);
                }

                return linesArr;
            }
        }
    }

})(jQuery);