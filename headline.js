(function($) {
    $.headline = function(element, options) {
        var defaults = {
            inputMarkup: '<input type="text" />',
            lineClass: 'line',
            inputContainer: '#inputContainer'
        };

        var plugin = this;

        plugin.settings = {};

        var $element = $(element);
        var lines, inputContainer;

        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);

            lines = $('.' + plugin.settings.lineClass, $element);
            inputContainer = $(plugin.settings.inputContainer);

            for(var i = 0; i < lines.length; i++) {
                var $input = $(plugin.settings.inputMarkup);
                    $input.addClass('headlineInput_' + i);

                inputContainer.append($input);
            }

        };

        plugin.init();

    }

})(jQuery);

$().ready(function() {
    var $headline = $('.myHeadline');
    $.headline($headline, {});
});