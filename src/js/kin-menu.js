/**
 * @preserve: Kin Menu, v1.0
 * @url: https://github.com/madebygrant/kin-menu
 * @author: Grant, https://madebygrant.com
 */

const 
// Selector individual
_ = (selector, scope) => {
    scope = scope ? scope : document;
    return scope.querySelector(selector);
},
// Selector all
__ = (selector, scope) => {
    scope = scope ? scope : document;
    return scope.querySelectorAll(selector);
},
// Selector ID
_id = (selector, scope) => {
    scope = scope ? scope : document;
    return scope.getElementById(selector);
},
// When document is ready
ready = (callback) => {
    document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading" ? callback() : document.addEventListener('DOMContentLoaded', callback);
};

// Kin Menu class
class KinMenu {
    
    // Class constructor
    constructor(options){

        // Default plugin options
        const defaults = {
            windowWidth: 960,
            lockPage: false,
            pageContent: document.getElementsByTagName('main')[0],
            groups: false,
            toggleButton: {
                spans: 3,
                text: '',
                hasWrapper: false,
                wrapperContent: false
            }
        };

        // Plugin options
        options.toggleButton = Object.assign(defaults.toggleButton, options.toggleButton); // Merge toggle button related options
        this._options = Object.assign(defaults, options); // Merge options
        
        // Cloned items array
        this._AllItems = [];

        // Page content
        this._content = typeof this._options.pageContent == 'string' ? _(this._options.pageContent) : ( typeof this._options.pageContent == 'object' ? this._options.pageContent : false );

        this._body = document.body; // Document body
        this._prefix = 'kin'; // Plugin's prefix, used throughout the plugin
        
    }

    // Helper functions
    helper(){
        return {

            // Sanitize the text
            safeText: (html) => {
                let element = document.createElement('div');
                element.textContent = html;
                return element.innerText;
            },

            // Add elements to a specific position on the page
            addElement : (el, position, html) => {
                if(typeof html === 'string'){
                    let pos;
                    switch(position){
                        case 'append':
                            pos = 'beforeend';
                            break;
                        case 'prepend':
                            pos = 'afterbegin';
                            break;
                        case 'before':
                            pos = 'beforebegin';
                            break;
                        case 'after':
                            pos = 'afterend';
                            break;
                    }
                    html = this.helper().safeText(html);
                    el.insertAdjacentHTML(pos, html);
                }
                else if(typeof html === 'object'){
                    switch(position){
                        case 'append':
                            el.append(html);
                            break;
                        case 'prepend':
                            el.prepend(html);
                            break;
                        case 'before':
                            el.parentNode.insertBefore(html, el);
                            break;
                        case 'after':
                            el.parentNode.insertBefore(html, el.nextSibling);
                            break;
                    }
        
                }
            },

            // Next sibling
            nextSibling: (el, selector) => {
                let sibling = el.nextElementSibling;
                if (!selector) return sibling;
                while (sibling) {
                    if (sibling.matches(selector)) return sibling;
                    sibling = sibling.nextElementSibling
                }
            },

        }
    }

    // The wrapper around the toggle button
    createToggleWrapper(){
        const _this = this,
            prefix = this._prefix,
            options = this._options,
            content = options.toggleButton.wrapperContent;

        if( Array.isArray(content) ){
            content.forEach((item) => {
                let _content = typeof item == 'string' ? __(item) : item;
                _content.forEach((el) => {
                    let node = el.cloneNode(true);
                    node.classList.add(prefix + '-toggle__item');
                    _this.helper().addElement( _id(prefix + '-toggle'), 'append', node);
                });
            });
        }
        else if(content != false){
            let _content = typeof content == 'string' ? __(content) : content;
            _content.forEach((el) => {
                let node = el.cloneNode(true);
                node.classList.add(prefix + '-toggle__item');
                _this.helper().addElement( _id(prefix + '-toggle'), 'append', node);
            });
        }
    }

    // Create a group and it's children
    createGroup(data, index){
        let group,
            _this = this,
            prefix = this._prefix,
            classes = typeof data.class == 'string' ? [data.class] : Array.isArray(data.class) ? data.class : [];

        // Create a group wrapper
        if( data.element ){
            group = document.createElement(data.element);
            
            // Add classes to the group
            group.classList.add(prefix + '__group', prefix + '__group--' + index, ...classes);
        
            // Add the clones to the group
            data.clones.forEach((cloned) => {
                let elements = document.querySelectorAll(cloned);
                elements.forEach( (el) => {
                    let node, nodeID;
                    node = el.cloneNode(true);
                    nodeID = node.getAttribute('id');
                    node.classList.add(prefix + '__item');
                    nodeID ? node.setAttribute('id', prefix + '__' + nodeID) : '';
                    _this.helper().addElement( group, 'append', node );
                    el.classList.add(prefix + '-selected');
                })
            });

        }

        return group;
    }

    createBase(){
        const _this = this,
            prefix = this._prefix,
            options = this._options;

        let buttonHTML,
            buttonText = options.toggleButton.text != '' ? _this.helper().safeText(options.toggleButton.text) : '';

        // Button's HTML
        if( !options.toggleButton.hasWrapper ){
            buttonHTML = `<button type="button" id="${prefix}-toggle-button" class="${prefix}-toggle-button" aria-controls="${prefix}" aria-label="Toggle Menu" aria-expanded="false">${buttonText}</button>`;
        }
        else{
            buttonHTML = `<div id="${prefix}-toggle" class="${prefix}-toggle"><button type="button" id="${prefix}-toggle-button" class="${prefix}-toggle-button ${prefix}-toggle__button" aria-controls="${prefix}" aria-label="Toggle Menu" aria-expanded="false">${buttonText}</button></div>`;
        }

        // Create the toggle button & menu
        _this.helper().addElement( this._body, 'prepend', 
            buttonHTML +  `<div id="${prefix}" class="${prefix}"><div id="${prefix}__inner" class="${prefix}__inner"></div>`
        );

        // Add the toggle button's spans and their classes
        if( Number.isInteger(options.toggleButton.spans) && options.toggleButton.spans !== 0 ){
            const toggleButton = _id(prefix + '-toggle-button');
            for( var i = 0; i < options.toggleButton.spans; i++ ){
                let span = document.createElement('span');
                span.classList.add(prefix + '-toggle-button__span', prefix + '-toggle-button__span--' + i);
                _this.helper().addElement( toggleButton, 'append',  span);
            }
            toggleButton.classList.add(prefix + '-toggle-button--spans-' + toggleButton.children.length );
        }

        // Create a wrapper around the toggle button
        if( options.toggleButton.hasWrapper ){
            _this.createToggleWrapper();
        }

    }

    create(){

        if( Array.isArray(this._options.groups) && !this._body.classList.contains(this._prefix + '-is--loaded') ){

            const _this = this,
                prefix = this._prefix,
                options = this._options;

            // Setup classes
            _this._body.classList.add(prefix + '-is--loaded', prefix + '-is--closed');

            if( !document.contains( _id(prefix) ) ){

                // Create the menu container and toggle button
                _this.createBase();

                const menuElements = {
                    base: _id(prefix),
                    inner: _id(prefix + '__inner'),
                    toggleButton: _id(prefix + '-toggle-button')
                }

                // Add a class to the main page content
                this._content.classList.add(prefix + '-content');

                // Create the groups
                options.groups.forEach( (item, index) => {
                    let created = _this.createGroup(item, index);
                    _this.helper().addElement( menuElements.inner, 'append', created );
                    _this._AllItems = [..._this._AllItems, ...item.clones];
                });

                // Current page links
                let currentLinks = __('a[href="' + window.location + '"]', menuElements.inner);
                if( currentLinks.length > 0 ){
                    currentLinks.forEach( (link) => {
                        link.classList.add('is-current-page');
                        link.parentNode.classList.add('child-is-current-page');
                        link.closest('.' + prefix + '__item').classList.add(prefix + '__item--has-current-page');
                    });
                }

                // Drop-downs
                __('ul li, .has-dropdowns', menuElements.inner).forEach( (item, index) => {
                    let submenu = item.getElementsByTagName('ul');

                    if( submenu[0] ){

                        // Add dropdown class
                        submenu[0].classList.add(prefix + '__drop');

                        // Add checkboxes
                        _this.helper().addElement( item, 'prepend', 
                        `<input aria-hidden="true" class="${prefix}__checkbox" type="checkbox" name="sub-group--${index}" id="sub-group--${index}"/><label class="${prefix}__label" for="sub-group--${index}"></label>` 
                        );

                        // Add 'multi' class
                        if( !menuElements.base.classList.contains(prefix + '--multi') ){
                            menuElements.base.classList.add(prefix + '--multi');
                        }
                    }
                    
                });

                // Drop-down Checkboxes
                menuElements.inner.querySelectorAll(`.${prefix}__checkbox`).forEach( (checkbox) => {

                    checkbox.addEventListener('change', (e) => {
                        let subMenu = _this.helper().nextSibling(checkbox, `.${prefix}__drop`);
                        let subLabel = _this.helper().nextSibling(checkbox, `.${prefix}__label`);

                        if( subMenu.classList.contains(prefix + '__drop--active') === false ){
                            subLabel.classList.add(prefix + '__label--active');
                            subMenu.classList.add(prefix + '__drop--active');
                        }
                        else{
                            subLabel.classList.remove(prefix + '__label--active');
                            subMenu.classList.remove(prefix + '__drop--active');
                        }
                        
                    }, false);
                });

                // Toggle Button
                if( document.contains( menuElements.toggleButton ) ){
                    menuElements.toggleButton.addEventListener("click", (e) => {
                        _this.toggle();
                        e.preventDefault();
                    });
                }

            }

        }
    }

    toggle(){
        const body = this._body,
            prefix = this._prefix,
            menuElements = {
                base: _id(prefix),
                content: _('.' + prefix + '-content'),
                toggleButton: _id(prefix + '-toggle-button')
            }

        // Toggle classes
        body.classList.toggle(prefix + '-is--open');
        body.classList.toggle(prefix + '-is--closed');
        menuElements.base.classList.toggle(prefix + '--active');
        menuElements.toggleButton.classList.toggle(prefix + '-toggle-button--active');
        menuElements.content.classList.toggle(prefix + '-content--active');
        
        // Accessibility
        if(menuElements.toggleButton.getAttribute('aria-expanded') == 'false'){
            menuElements.toggleButton.setAttribute('aria-expanded', 'true');
        }
        else{
            menuElements.toggleButton.setAttribute('aria-expanded', 'false');
        }
    }

    // Destroy and revert back to previous state
    destroy(){
        const _this = this,
            body = this._body,
            content = this._content,
            prefix = this._prefix;

        if( body.classList.contains(prefix + '-is--loaded') ){

            const menu = _id(prefix),
                toggleButton = _id(prefix + '-toggle-button'),
                toggleWrapper = _id(prefix + '-toggle'),
                removeClassList = [prefix + '-is--loaded', prefix + '-is--closed', prefix + '-is--open'];

            // Remove classes & styles
            body.classList.remove(...removeClassList);
            content.classList.remove(prefix + '-content', prefix + '-content--active');

            // Remove menu
            menu.parentNode.removeChild(menu);

            // Remove Toggle wrapper or button
            !_this._options.toggleButton.hasWrapper ? toggleButton.parentNode.removeChild(toggleButton) : toggleWrapper.parentNode.removeChild(toggleWrapper);

            // Remove cloned items
            _this._AllItems.forEach( (selectedItem) => {
                __(selectedItem).forEach( (selected) => {
                    selected.classList.remove(prefix + '-selected');
                });
            });

            // Clear the cloned items array
            _this._AllItems = [];
        }
    }

    setStyle(style){
        if( typeof style == 'string' ){
            document.body.setAttribute('data-' + this._prefix, style);
        }
    }

    // Initialise the plugin
    init(){
        const _this = this,
            options = this._options;

        // On document ready, plugin activate/destroy based on given screen width in the plugin options
        ready(() =>{
            let windowWidth = document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
            windowWidth <= options.windowWidth && _this.create();
        });

        // When window is resized, plugin activate/destroy based on given screen width in the plugin options
        window.addEventListener("resize", () => {
            let windowWidth = document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
            windowWidth >= options.windowWidth ? _this.destroy() : _this.create();
        })
    }

}