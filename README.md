# Kin Menu

Create a menu for small screen devices using elements within the page. Example, from your website's main navigation.

### Contents

 - [Usage](#usage)
 - [Options](#options)
 - [Adding items to the Kin Menu](#adding-items-to-the-kin-menu)
 - [Toggle Button Options](#toggle-button-options)
 - [Styles](#styles)
 - [Methods](#methods)

## Usage

#### Add the JS file

```html
<script defer src="https://cdn.jsdelivr.net/gh/madebygrant/kin-menu@1.0/dist/js/kin-menu.min.js">
```

#### Add the CSS stylesheet
*The CSS is optional but ideally at least include the base css file to build off from.*

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/madebygrant/kin-menu@1.0/dist/css/kin-menu.all.css">
```

If you want just want to use the base css stylesheet without the included styles:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/madebygrant/kin-menu@1.0/dist/css/kin-menu.base.css">
```

#### Initialise Kin Menu

```javascript
const kinOptions = {
	// Your options go here.   
}
const kin = new KinMenu(kinOptions);
kin.init();
```

#### Hide items when the menu is active
Within your website's CSS stylesheet, include a rule similar to the example below, for when the `kin-is--loaded` class has been added to the `<body>` tag.

```css
body.kin-is--loaded { 
    .top-menu{
        display: none;
    }
}
```

## Options

Option | Type | Description| Defaults
-------|------|------------|--------
windowWidth | integer | The maximum width of the window size to activate the plugin | 960
pageContent | string, node | The element where the main content of the website is located within. | First \<main> tag in the page.
toggleButton | object | Where you can modify the toggle button | `{ spans: 3, text: '', hasWrapper: false,  wrapperContent: false }`
groups | array | The items you want to add into the Kin Menu

## Adding items to the Kin Menu
- groups: Set groups for your cloned elements to be added within Kin Menu.
	- element: Determine which element type to wrap the clones in.
	- class: Apply class to your group wrap element. For multiple classes, do so with an array.
	- clones: Select the items within the page to be added into the group.

*The example below, it adds the \<li> items from a \<nav> (`nav.top-menu`) in the page into a group (`ul.side-menu`) in the Kin Menu.*

```javascript
const kinOptions = {
    groups: [
        {
            element: 'ul',
            class: 'side-menu',
            clones: [
                'nav.top-menu > ul > li'
            ]
        },
    ]
};

const kin = new KinMenu(kinOptions);
kin.init();
```

*The example below, shows how to add multiple groups and items into the Kin Menu.*

```javascript
const kinOptions = {
    windowWidth: 1024,
    groups: [
        {
            element: 'header',
            class: 'side-header',
            clones: [
                'figure.site-logo',
                'h1.site-heading'
            ]
        },
        {
            element: 'ul',
            class: 'side-menu',
            clones: [
                'nav.top-menu > ul > li'
            ]
        },
        {
            element: 'div',
            class: 'side-social-media',
            clones: [
                'div.social-media a'
            ]
        },
    ]
};

const kin = new KinMenu(kinOptions);
kin.init();
```

## Toggle Button Options

Option | Type | Description| Defaults
-------|------|------------|--------
spans | integer | Number of \<span> elements to generate in the button for styling purposes | 3
text | string | Text to include inside of the button | ''
hasWrapper | boolean | Create a \<div> wrapper around the button. | false
wrapperContent | array | Select items within the page to be added into in the wrapper

*The example below, adds a \<figure> (`figure.site-logo`) element from the page into the toggle button's wrapper, next to the button.*

```javascript
const kinOptions = {
    groups: [
        {
            element: 'ul',
            class: 'side-menu',
            clones: [
                'nav.top-menu > ul > li'
            ],
        },
    ],
    toggleButton: {
        hasWrapper: true,
        wrapperContent: [
            'figure.site-logo'
        ]
    }
};

const kin = new KinMenu(kinOptions);
kin.init();
```

## Styles

Currently has four loosely styled styles but totally optional. It requires the `kin-menu.all.css` stylesheet to be loaded.

You can preview the styles at: <https://madebygrant.com/kin-menu/examples.html>

To apply a style, either:
- Add a `data-kin` attribute to the \<body> tag with the corresponding option value.
- Apply the `setStyle()` method to the initialised Kin Menu object and give it the corresponding option value. \
Example: `kin.setStyle('side-angled);`

Style | Option Value | Description
-------|------|------------
Side | side | A basic side menu that slides in from the left.
Angled Side | side-angled | A angled side menu that slides in from the left
Circle Expand | circle-expand | The toggle button's background expands to full screen and the menu appears afterwards.
Transition | transition | An animated, full width that menu slides down from the top.

*Note: The .scss files are located in the 'src' directory in the repository*

## Methods

### init

Initialise the menu

`kin.init();`

### create

Create and render the menu

`kin.create();`

### destroy

Destroy the menu

`kin.destroy();`

### setStyle

Apply a style to the menu

`kin.setStyle();`

## License
This project is available under the [MIT](https://opensource.org/licenses/mit-license.php) license.