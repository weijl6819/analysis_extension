define(['jquery', 'lib/js/tools'], function($, tools) {

    var dom = {};

    dom.text = function(text) {
        return document.createTextNode(text);
    };

    dom.$node = function(tagName, attr) {
        var node, $node;
        var i, value;

        if(typeof tagName === 'string') {
            node = document.createElement(tagName);
            $node = $(node);
        }
        else {
            $node = $(tagName);
            node = $node[0];
        }

        // Attributes
        attr = attr || {};

        if(tools.isArray(attr))
            attr = { children: attr };

        for(var key in attr) {
            value = attr[key];

            switch(key.toLowerCase()) {

                case 'children':
                    for(i = 0; i < value.length; ++i) {
                        if(tools.isArray(value[i]))
                            node.appendChild(dom.node.apply(null, value[i]));
                        else if(typeof value[i] === 'string')
                            node.appendChild(dom.text(value[i]));
                        else
                            node.appendChild(value[i]);
                    }
                    break;

                case 'class':
                case 'classes':
                case 'classname':
                case 'classlist':
                case 'klass':
                    if(tools.isJson(value)) {
                        for(i in value)
                            $node.toggleClass(i, value[i]);
                    }
                    else if(tools.isArray(value)) {
                        node.className = value.join(' ');
                    }
                    else if(typeof value === 'string')
                        node.className = value;
                    break;

                case 'css':
                    $node.css(value);
                    break;

                case 'data':
                    $node.data(value);
                    break;

                case 'on':
                case 'event':
                case 'events':
                    for(i in value)
                        $node.on(i, value[i]);
                    break;

                case 'text':
                    node.appendChild(dom.text(value));
                    break;

                case 'val':
                case 'value':
                    $node.val(value);
                    break;

                default:
                    node.setAttribute(key, value);
            }

        }

        return $node;
    };

    dom.node = function() {
        return dom.$node.apply(null, arguments)[0];
    };

    return dom;

});
