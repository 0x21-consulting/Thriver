//UI Helper Functions
Thriver.util = {
    //Add Class
    addClass : function (element, className) {
        check(element, Element);
        check(className, String);

        element.classList.add(className);
    },
    //Remove Class
    removeClass : function (element, className) {
        check(element, Element);
        check(className, String);

        element.classList.remove(className);
    },
    //Remove Class (by Prefix)
    removeClassByPrefix : function (element, prefix) {
        check(element, Element);
        check(prefix, String);

        var regx = new RegExp('\\b' + prefix + '.*?\\b', 'g');
        element.className = element.className.replace(regx, '');
        return element;
    },
    hide : function (element, state) {
        check(element, Element);
        check(state, Match.Maybe(Boolean) );

        if (state === false)
            element.setAttribute('aria-hidden', 'false');
        else
            element.setAttribute('aria-hidden', 'true');  
    },
    makeActive : function (element, state) {
        check(element, Element);
        check(state, Match.Maybe(Boolean) );

        if (state === false)
            element.setAttribute('aria-expanded', 'false');  
        else
            element.setAttribute('aria-expanded', 'true');
    },
    findAncestor : function (element, className) {
        check(element, Element);
        check(className, String);

        // TODO: Infinite loop possibility here?
        while ((element = element.parentElement) && !element.classList.contains(className));
        return element;
    }
};
