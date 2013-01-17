(function($) {
    $.headline = function(element, options) {

        // default settings
        var defaults = {
            inputMarkup: '<input type="text" />',
            inputWrapperMarkup: '<p />',
            lineClass: 'line',
            inputContainer: '#inputContainer',
            inputClass: 'headlineInput',
            draggable: true
        };

        var plugin = this;

        plugin.settings = {};

        var $element = $(element);
        var lines, inputContainer;

        // initital 
        plugin.init = function() {
            // merge user options with default options
            plugin.settings = $.extend({}, defaults, options);

            // get all lines
            lines = $('.' + plugin.settings.lineClass, $element);

            inputContainer = $(plugin.settings.inputContainer);

            // loop through each line and build the necessary DOM
            for(var i = 0; i < lines.length; i++) {

                // get some DOM elements
                var $input = $(plugin.settings.inputMarkup);
                var $line = $(lines[i]);
                var $inputWrapper = $(plugin.settings.inputWrapperMarkup);

                $input.data('key', i);
                $input.addClass(plugin.settings.inputClass);

                $inputWrapper.append($input);

                $line.attr('id', plugin.settings.lineClass + '_' + i);
                $line.append($('<span />'));
                inputContainer.append($inputWrapper);
            }

            // init dragging
            if(plugin.settings.draggable) {
                $('span', '.line').draggable({
                    containment: 'parent'
                });
            }

            bindEvents();
        };

        function bindEvents() {
            $('.' + plugin.settings.inputClass).on('keydown', function(e) {
                var $elem = $(this);
                window.setTimeout(function() {
                    addText($elem);
                }, 0);
                return true;
            });
        }

        function addText($elem) {
            var $headlineElem = $('span', '#' + plugin.settings.lineClass + '_' + $elem.data('key'));
            var $tmpHeadline = $headlineElem.clone();

            $tmpHeadline.text($elem.val());
            $headlineElem.append($tmpHeadline);
            var textWidth = $tmpHeadline.width();
            var lineWidth = $headlineElem.parent().width();
            $tmpHeadline.remove();

            if(textWidth < lineWidth) {
                $headlineElem.text($elem.val());
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

var myHeadline;
$().ready(function() {
    var $headline = $('.myHeadline');
    myHeadline = $.headline($headline, {});

    console.log(myHeadline.getData())
});