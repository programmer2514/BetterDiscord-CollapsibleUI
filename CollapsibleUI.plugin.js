/**
 * @name CollapsibleUI
 * @author programmer2514
 * @authorId 563652755814875146
 * @description A simple plugin that allows collapsing various sections of the Discord UI.
 * @version 3.0.1
 * @website https://github.com/programmer2514/BetterDiscord-CollapsibleUI
 * @source https://raw.githubusercontent.com/programmer2514/BetterDiscord-CollapsibleUI/main/CollapsibleUI.plugin.js
 */

module.exports = (() => {

    // Define plugin configuration
    const config = {
        info: {
            name: 'CollapsibleUI',
            authors: [{
                name: 'programmer2514',
                discord_id: '563652755814875146',
                github_username: 'programmer2514'
            }],
            version: '3.0.1',
            description: 'A simple plugin that allows collapsing various sections of the Discord UI.',
            github: 'https://github.com/programmer2514/BetterDiscord-CollapsibleUI',
            github_raw: 'https://raw.githubusercontent.com/programmer2514/BetterDiscord-CollapsibleUI/main/CollapsibleUI.plugin.js'
        },
        changelog: [{
            title: '3.0.1',
            items: [
                'Fixed BetterDiscord repo integration'
            ]
        }, {
            title: '3.0.0',
            items: [
                'Added GNU/Linux support',
                'Added theme support',
                'Added thread support',
                'Made channel list resizable',
                'Added collapsible button panel feature',
                'Added settings options in JSON file for advanced tweaking',
                'Fixed styles on new Discord update',
                'Fixed many, many bugs'
            ]
        }, {
            title: '2.1.1',
            items: [
                'Added ZeresPluginLibrary support'
            ]
        }, {
            title: '2.0.1',
            items: [
                'Adjusted some pixel measurements to prevent cutting off the message bar while typing multiline messages'
            ]
        }, {
            title: '2.0.0',
            items: [
                'Added a button to collapse the window title bar',
                'Updated the button icons to be more consistent',
                'Finished adding transitions to collapsible elements',
                'Fixed issues with persistent button states',
                'Actually fixed plugin crashing on reload',
                'Fixed handling of plugin being disabled'
            ]
        }, {
            title: '1.2.1',
            items: [
                'Added a button to collapse the message bar',
                'Added transitions to some elements',
                'Improved support for non-english locales',
                'Improved handling of missing config'
            ]
        }, {
            title: '1.1.1',
            items: [
                'Fixed plugin crashing on reload (sorta)'
            ]
        }, {
            title: '1.1.0',
            items: [
                'Added persistent button states'
            ]
        }, {
            title: '1.0.0',
            items: [
                'Initial release'
            ]
        }]
    };

    // Check for ZeresPluginLibrary
    if (!window.ZeresPluginLibrary) {
        return class {
            constructor() { this._config = config; }
            getName() { return config.info.name; }
            getAuthor() { return config.info.authors.map(a => a.name).join(', '); }
            getDescription() { return config.info.description; }
            getVersion() { return config.info.version; }
            load() {
                BdApi.showConfirmationModal(
                    'Library Missing',
                    `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`,
                    {
                        confirmText: 'Download Now',
                        cancelText: 'Cancel',
                        onConfirm: () => {
                            require('request').get('https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js', async (err, _response, body) => {
                                if (err) {
                                    return require('electron').shell.openExternal('https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js');
                                }
                                await new Promise(r => require('fs').writeFile(require('path').join(BdApi.Plugins.folder, '0PluginLibrary.plugin.js'), body, r));
                            });
                        }
                });
            }
            start() { }
            stop() { }
        }
    }

    // Build plugin
    const [Plugin, Api] = ZeresPluginLibrary.buildPlugin(config);

    // Define plugin class
    return class CollapsibleUI extends Plugin {

        // Main plugin code, called by start() and onSwitch()
        initialize() {
            
            // Initialize settings variables
            
            /* BUTTON INDEX:         *
             *-----------------------*
             * 0 - serverListButton  *
             * 1 - channelListButton *
             * 2 - msgBarButton      *
             * 3 - windowBarButton   *
             * 4 - membersListButton *
             * 5 - userAreaButton    *
             *-----------------------*/
            let disableTransitions = false;
            let transitionSpeed = 300;
            
            let disableToolbarCollapse = false;
            let disableSettingsCollapse = false;
            
            let resizableChannelList = true;
            
            let buttonsOrder = [1,2,4,5,6,3];
            
            let settingsButtonsMaxWidth = 100;
            let toolbarIconMaxWidth = 100;
            let membersListMaxWidth = 240;
            let userAreaMaxHeight = 100;
            let msgBarMaxHeight = 400;
            let windowBarHeight = 18;
            
            // disableTransitions [Default: false]
            if (BdApi.getData('CollapsibleUI', 'disableTransitions') === 'false') {
                disableTransitions = false;
            } else if (BdApi.getData('CollapsibleUI', 'disableTransitions') === 'true') {
                disableTransitions = true;
            } else {
                BdApi.setData('CollapsibleUI', 'disableTransitions', 'false');
            }
            
            // transitionSpeed [Default: 300]
            if (typeof(BdApi.getData('CollapsibleUI', 'transitionSpeed')) === 'string') {
                transitionSpeed = parseInt(BdApi.getData('CollapsibleUI', 'transitionSpeed'));
            } else {
                BdApi.setData('CollapsibleUI', 'transitionSpeed', transitionSpeed.toString());
            }
            
            // disableToolbarCollapse [Default: false]
            if (BdApi.getData('CollapsibleUI', 'disableToolbarCollapse') === 'false') {
                disableToolbarCollapse = false;
            } else if (BdApi.getData('CollapsibleUI', 'disableToolbarCollapse') === 'true') {
                disableToolbarCollapse = true;
            } else {
                BdApi.setData('CollapsibleUI', 'disableToolbarCollapse', 'false');
            }
            
            // disableSettingsCollapse [Default: false]
            if (BdApi.getData('CollapsibleUI', 'disableSettingsCollapse') === 'false') {
                disableSettingsCollapse = false;
            } else if (BdApi.getData('CollapsibleUI', 'disableSettingsCollapse') === 'true') {
                disableSettingsCollapse = true;
            } else {
                BdApi.setData('CollapsibleUI', 'disableSettingsCollapse', 'false');
            }
            
            // resizableChannelList [Default: true]
            if (BdApi.getData('CollapsibleUI', 'resizableChannelList') === 'false') {
                resizableChannelList = false;
            } else if (BdApi.getData('CollapsibleUI', 'resizableChannelList') === 'true') {
                resizableChannelList = true;
            } else {
                BdApi.setData('CollapsibleUI', 'resizableChannelList', 'true');
            }
            
            // buttonsOrder [Default: [1,2,4,5,6,3]]
            if (typeof(BdApi.getData('CollapsibleUI', 'buttonsOrder')) === 'string') {
                buttonsOrder = BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',').map(Number);
            } else {
                BdApi.setData('CollapsibleUI', 'buttonsOrder', buttonsOrder.toString());
            }
            
            // settingsButtonsMaxWidth [Default: 100]
            if (typeof(BdApi.getData('CollapsibleUI', 'settingsButtonsMaxWidth')) === 'string') {
                settingsButtonsMaxWidth = parseInt(BdApi.getData('CollapsibleUI', 'settingsButtonsMaxWidth'));
            } else {
                BdApi.setData('CollapsibleUI', 'settingsButtonsMaxWidth', settingsButtonsMaxWidth.toString());
            }
            
            // toolbarIconMaxWidth [Default: 100]
            if (typeof(BdApi.getData('CollapsibleUI', 'toolbarIconMaxWidth')) === 'string') {
                toolbarIconMaxWidth = parseInt(BdApi.getData('CollapsibleUI', 'toolbarIconMaxWidth'));
            } else {
                BdApi.setData('CollapsibleUI', 'toolbarIconMaxWidth', toolbarIconMaxWidth.toString());
            }
            
            // membersListMaxWidth [Default: 240]
            if (typeof(BdApi.getData('CollapsibleUI', 'membersListMaxWidth')) === 'string') {
                membersListMaxWidth = parseInt(BdApi.getData('CollapsibleUI', 'membersListMaxWidth'));
            } else {
                BdApi.setData('CollapsibleUI', 'membersListMaxWidth', membersListMaxWidth.toString());
            }
            
            // userAreaMaxHeight [Default: 100]
            if (typeof(BdApi.getData('CollapsibleUI', 'userAreaMaxHeight')) === 'string') {
                userAreaMaxHeight = parseInt(BdApi.getData('CollapsibleUI', 'userAreaMaxHeight'));
            } else {
                BdApi.setData('CollapsibleUI', 'userAreaMaxHeight', userAreaMaxHeight.toString());
            }
            
            // msgBarMaxHeight [Default: 400]
            if (typeof(BdApi.getData('CollapsibleUI', 'msgBarMaxHeight')) === 'string') {
                msgBarMaxHeight = parseInt(BdApi.getData('CollapsibleUI', 'msgBarMaxHeight'));
            } else {
                BdApi.setData('CollapsibleUI', 'msgBarMaxHeight', msgBarMaxHeight.toString());
            }
            
            // windowBarHeight [Default: 18]
            if (typeof(BdApi.getData('CollapsibleUI', 'windowBarHeight')) === 'string') {
                windowBarHeight = parseInt(BdApi.getData('CollapsibleUI', 'windowBarHeight'));
            } else {
                BdApi.setData('CollapsibleUI', 'windowBarHeight', windowBarHeight.toString());
            }
            
            

            // Purge CollapsibleUI toolbar icons
            document.querySelectorAll('.collapsible-ui-element').forEach(e => e.remove());
            
            // Hide default Members List button
            if (document.querySelector('.membersWrap-3NUR2t')) {
                if (document.querySelector('.search-39IXmY').previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.classList.contains('icon-1ELUnB')) {
                document.querySelector('.search-39IXmY').previousElementSibling.style.display = 'none';
                } else {
                    document.querySelector('.search-39IXmY').previousElementSibling.previousElementSibling.style.display = 'none';
                }
            }
            
            // Define & add toolbar container
            var toolbarContainer = document.createElement('div');
                toolbarContainer.setAttribute('id', 'cui-toolbar-container');
                toolbarContainer.classList.add('collapsible-ui-element');
                toolbarContainer.style.alignItems = 'right';
                toolbarContainer.style.display = 'flex';
                toolbarContainer.style.padding = '0';
                toolbarContainer.style.margin = '0';
                toolbarContainer.style.border = '0';
                toolbarContainer.innerHTML = '<div id="cui-icon-insert-point" style="display: none;"></div>';

            // Insert icon to the left of the search bar
            document.querySelector('.toolbar-3_r2xA').insertBefore(toolbarContainer, document.querySelector('.search-39IXmY'));

            // Define & add new toolbar icons
            // Icons are part of the Bootstrap Icons library, which can be found at https://icons.getbootstrap.com/
            var buttonsActive = buttonsOrder;
            for (let i = 1; i <= buttonsOrder.length; i++) {
                if (i == buttonsOrder[0]) {
                    if (buttonsOrder[0]) {
                        var serverListButton = this.addToolbarIcon('Server List', '<path fill="currentColor" d="M-3.429,0.857C-3.429-0.72-2.149-2-0.571-2h17.143c1.578,0,2.857,1.28,2.857,2.857v14.286c0,1.578-1.279,2.857-2.857,2.857H-0.571c-1.578,0-2.857-1.279-2.857-2.857V0.857z M3.714-0.571v17.143h12.857c0.789,0,1.429-0.64,1.429-1.429V0.857c0-0.789-0.64-1.428-1.429-1.428H3.714z M2.286-0.571h-2.857C-1.36-0.571-2,0.068-2,0.857v14.286c0,0.789,0.64,1.429,1.429,1.429h2.857V-0.571z"/>', '-4 -4 24 24');
                    } else {
                        serverListButton = false;
                        buttonsActive[0] = 0;
                    }
                }
                if (i == buttonsOrder[1]) {
                    if (buttonsOrder[1]) {
                        var channelListButton = this.addToolbarIcon('Channel List', '<path fill="currentColor" d="M3.5,13.5c0-0.414,0.335-0.75,0.75-0.75h13.5c0.414,0,0.75,0.336,0.75,0.75s-0.336,0.75-0.75,0.75H4.25C3.835,14.25,3.5,13.914,3.5,13.5z M3.5,7.5c0-0.415,0.335-0.75,0.75-0.75h13.5c0.414,0,0.75,0.335,0.75,0.75s-0.336,0.75-0.75,0.75H4.25C3.835,8.25,3.5,7.915,3.5,7.5z M3.5,1.5c0-0.415,0.335-0.75,0.75-0.75h13.5c0.414,0,0.75,0.335,0.75,0.75s-0.336,0.75-0.75,0.75H4.25C3.835,2.25,3.5,1.915,3.5,1.5z M-1,3c0.828,0,1.5-0.672,1.5-1.5S-0.172,0-1,0s-1.5,0.672-1.5,1.5S-1.828,3-1,3z M-1,9c0.828,0,1.5-0.672,1.5-1.5S-0.172,6-1,6s-1.5,0.672-1.5,1.5S-1.828,9-1,9z M-1,15c0.828,0,1.5-0.671,1.5-1.5S-0.172,12-1,12s-1.5,0.671-1.5,1.5S-1.828,15-1,15z"/>', '-4 -4 24 24');
                    } else {
                        channelListButton = false;
                        buttonsActive[1] = 0;
                    }
                }
                if (i == buttonsOrder[2]) {
                    if (buttonsOrder[2] && document.querySelector('.form-3gdLxP')) {
                        var msgBarButton = this.addToolbarIcon('Message Bar', '<path fill="currentColor" d="M7.5,3c0-0.415,0.335-0.75,0.75-0.75c1.293,0,2.359,0.431,3.09,0.85c0.261,0.147,0.48,0.296,0.66,0.428c0.178-0.132,0.398-0.28,0.66-0.428c0.939-0.548,2.002-0.841,3.09-0.85c0.414,0,0.75,0.335,0.75,0.75c0,0.414-0.336,0.75-0.75,0.75c-0.959,0-1.766,0.319-2.348,0.65c-0.229,0.132-0.446,0.278-0.652,0.442v6.407h0.75c0.414,0,0.75,0.335,0.75,0.75c0,0.414-0.336,0.75-0.75,0.75h-0.75v6.407c0.148,0.12,0.371,0.281,0.652,0.442c0.582,0.331,1.389,0.65,2.348,0.65c0.414,0,0.75,0.335,0.75,0.75c0,0.414-0.336,0.75-0.75,0.75c-1.088-0.01-2.15-0.302-3.09-0.85c-0.229-0.129-0.449-0.271-0.66-0.425c-0.212,0.155-0.433,0.297-0.66,0.428c-0.939,0.546-2.004,0.837-3.09,0.848c-0.415,0-0.75-0.335-0.75-0.75c0-0.414,0.335-0.75,0.75-0.75c0.957,0,1.765-0.319,2.346-0.651c0.281-0.16,0.502-0.319,0.654-0.439v-6.41H10.5c-0.415,0-0.75-0.336-0.75-0.75c0-0.415,0.335-0.75,0.75-0.75h0.75V4.843c-0.207-0.164-0.426-0.311-0.654-0.442C9.884,3.984,9.075,3.759,8.25,3.75C7.835,3.75,7.5,3.414,7.5,3z"/><path fill="currentColor" d="M15,7.5h6c0.828,0,1.5,0.671,1.5,1.5v6c0,0.829-0.672,1.5-1.5,1.5h-6V18h6c1.656,0,3-1.344,3-3V9c0-1.657-1.344-3-3-3h-6V7.5z M9,7.5V6H3C1.343,6,0,7.343,0,9v6c0,1.656,1.343,3,3,3h6v-1.5H3c-0.829,0-1.5-0.671-1.5-1.5V9c0-0.829,0.671-1.5,1.5-1.5H9z"/>', '0 0 24 24');
                    } else {
                        var msgBarButton = false;
                        buttonsActive[2] = 0;
                    }
                }
                if (i == buttonsOrder[3]) {
                    if (buttonsOrder[3] && document.querySelector('.typeWindows-2-g3UY')) {
                        var windowBarButton = this.addToolbarIcon('Window Bar', '<path fill="currentColor" d="M0.143,2.286c0.395,0,0.714-0.319,0.714-0.714c0-0.395-0.319-0.714-0.714-0.714c-0.395,0-0.714,0.32-0.714,0.714C-0.571,1.966-0.252,2.286,0.143,2.286z M3,1.571c0,0.395-0.319,0.714-0.714,0.714c-0.395,0-0.714-0.319-0.714-0.714c0-0.395,0.32-0.714,0.714-0.714C2.681,0.857,3,1.177,3,1.571z M4.429,2.286c0.395,0,0.714-0.319,0.714-0.714c0-0.395-0.32-0.714-0.714-0.714c-0.395,0-0.714,0.32-0.714,0.714C3.714,1.966,4.034,2.286,4.429,2.286z"/><path fill="currentColor" d="M-0.571-2c-1.578,0-2.857,1.279-2.857,2.857v14.286c0,1.578,1.279,2.857,2.857,2.857h17.143c1.577,0,2.857-1.279,2.857-2.857V0.857c0-1.578-1.28-2.857-2.857-2.857H-0.571z M18,0.857v2.857H-2V0.857c0-0.789,0.64-1.428,1.429-1.428h17.143C17.361-0.571,18,0.068,18,0.857z M-0.571,16.571C-1.36,16.571-2,15.933-2,15.143v-10h20v10c0,0.79-0.639,1.429-1.429,1.429H-0.571z"/>', '-4 -4 24 24');
                    } else {
                        var windowBarButton = false;
                        buttonsActive[3] = 0;
                    }
                }
                if (i == buttonsOrder[4]) {
                    if (buttonsOrder[4] && document.querySelector('.membersWrap-3NUR2t')) {
                        var membersListButton = this.addToolbarIcon('Members List', '<path fill="currentColor" d="M6.5,17c0,0-1.5,0-1.5-1.5s1.5-6,7.5-6s7.5,4.5,7.5,6S18.5,17,18.5,17H6.5z M12.5,8C14.984,8,17,5.985,17,3.5S14.984-1,12.5-1S8,1.015,8,3.5S10.016,8,12.5,8z"/><path fill="currentColor" d="M3.824,17C3.602,16.531,3.49,16.019,3.5,15.5c0-2.033,1.021-4.125,2.904-5.58C5.464,9.631,4.483,9.488,3.5,9.5c-6,0-7.5,4.5-7.5,6S-2.5,17-2.5,17H3.824z"/><path fill="currentColor" d="M2.75,8C4.821,8,6.5,6.321,6.5,4.25S4.821,0.5,2.75,0.5S-1,2.179-1,4.25S0.679,8,2.75,8z"/>', '-4 -4 24 24');
                    } else {
                        var membersListButton = false;
                        buttonsActive[4] = 0;
                    }
                }
                if (i == buttonsOrder[5]) {
                    if (buttonsOrder[5] && document.querySelector('.panels-3wFtMD')) {
                        var userAreaButton = this.addToolbarIcon('User Area', '<path fill="currentColor" d="M-2.5,4.25c-0.829,0-1.5,0.672-1.5,1.5v4.5c0,0.829,0.671,1.5,1.5,1.5h21c0.83,0,1.5-0.671,1.5-1.5v-4.5 c0-0.828-0.67-1.5-1.5-1.5H-2.5z M14.75,5.75c0.415,0,0.75,0.335,0.75,0.75s-0.335,0.75-0.75,0.75S14,6.915,14,6.5 S14.335,5.75,14.75,5.75z M17.75,5.75c0.415,0,0.75,0.335,0.75,0.75s-0.335,0.75-0.75,0.75S17,6.915,17,6.5S17.335,5.75,17.75,5.75z M-2.5,6.5c0-0.415,0.335-0.75,0.75-0.75h7.5c0.415,0,0.75,0.335,0.75,0.75S6.165,7.25,5.75,7.25h-7.5 C-2.165,7.25-2.5,6.915-2.5,6.5z M-2.125,8.75h8.25C6.333,8.75,6.5,8.917,6.5,9.125S6.333,9.5,6.125,9.5h-8.25 C-2.333,9.5-2.5,9.333-2.5,9.125S-2.333,8.75-2.125,8.75z"/>', '-4 -4 24 24');
                    } else {
                        var userAreaButton = false;
                        buttonsActive[5] = 0;
                    }
                }
            }
            
            // Collapse toolbar buttons
            if (!disableToolbarCollapse) {
                if (serverListButton) {
                    serverListButton.style.maxWidth = '0px';
                    serverListButton.style.margin = '0';
                    serverListButton.style.padding = '0';
                }
                if (channelListButton) {
                    channelListButton.style.maxWidth = '0px';
                    channelListButton.style.margin = '0';
                    channelListButton.style.padding = '0';
                }
                if (msgBarButton) {
                    msgBarButton.style.maxWidth = '0px';
                    msgBarButton.style.margin = '0';
                    msgBarButton.style.padding = '0';
                }
                if (windowBarButton) {
                    windowBarButton.style.maxWidth = '0px';
                    windowBarButton.style.margin = '0';
                    windowBarButton.style.padding = '0';
                }
                if (membersListButton) {
                    membersListButton.style.maxWidth = '0px';
                    membersListButton.style.margin = '0';
                    membersListButton.style.padding = '0';
                }
                if (userAreaButton) {
                    userAreaButton.style.maxWidth = '0px';
                    userAreaButton.style.margin = '0';
                    userAreaButton.style.padding = '0';
                }
                
                if (membersListButton && (buttonsActive[4] == Math.max.apply(Math, buttonsActive))) {
                    membersListButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                    membersListButton.style.removeProperty('margin');
                    membersListButton.style.removeProperty('padding');
                } else if (windowBarButton && (buttonsActive[3] == Math.max.apply(Math, buttonsActive))) {
                    windowBarButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                    windowBarButton.style.removeProperty('margin');
                    windowBarButton.style.removeProperty('padding');
                } else if (msgBarButton && (buttonsActive[2] == Math.max.apply(Math, buttonsActive))) {
                    msgBarButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                    msgBarButton.style.removeProperty('margin');
                    msgBarButton.style.removeProperty('padding');
                } else if (channelListButton && (buttonsActive[1] == Math.max.apply(Math, buttonsActive))) {
                    channelListButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                    channelListButton.style.removeProperty('margin');
                    channelListButton.style.removeProperty('padding');
                } else if (serverListButton && (buttonsActive[0] == Math.max.apply(Math, buttonsActive))) {
                    serverListButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                    serverListButton.style.removeProperty('margin');
                    serverListButton.style.removeProperty('padding');
                } else if (userAreaButton && (buttonsActive[5] == Math.max.apply(Math, buttonsActive))) {
                    userAreaButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                    userAreaButton.style.removeProperty('margin');
                    userAreaButton.style.removeProperty('padding');
                } else {
                    document.querySelectorAll('.collapsible-ui-element').forEach(e => e.style.display = 'none');
                }
            }
            
            // Collapse settings buttons
            if (!disableSettingsCollapse) {
                // Define settings buttons array and container
                var settingsContainer = document.querySelector('.flex-2S1XBF')
                var settingsButtons = settingsContainer.children;
                
                // Collapse settings buttons
                for (let i = 0; i < (settingsButtons.length - 1); i++) {
                    settingsButtons[i].style.maxWidth = '0px';
                    if (!disableTransitions)
                        settingsButtons[i].style.transition = 'max-width ' + transitionSpeed + 'ms';
                    settingsButtons[i].style.overflow = 'hidden';
                }
            }
            
            if (!disableTransitions) {
                document.querySelectorAll('.collapsible-ui-element').forEach(e => e.style.transition = 'max-width ' + transitionSpeed + 'ms, margin ' + transitionSpeed + 'ms, padding ' + transitionSpeed + 'ms');
            }
            
            // Adjust UI element styling in preparation for transitions
            if (!disableTransitions) {
                if (document.querySelector('.typeWindows-2-g3UY')) {
                    document.querySelector('.typeWindows-2-g3UY').style.overflow = 'hidden';
                    document.querySelector('.typeWindows-2-g3UY').style.height = windowBarHeight + 'px';
                }
                if (document.querySelector('.membersWrap-3NUR2t')) {
                    document.querySelector('.membersWrap-3NUR2t').style.overflow = 'hidden';
                    document.querySelector('.membersWrap-3NUR2t').style.maxWidth = membersListMaxWidth + 'px';
                }

                if (document.querySelector('.form-3gdLxP')) {
                    document.querySelector('.form-3gdLxP').style.maxHeight = msgBarMaxHeight + 'px';
                }
            }

            // Read stored user data to decide active state of Server List button
            if (serverListButton) {
                if (BdApi.getData('CollapsibleUI', 'serverListButtonActive') === 'false') {
                    serverListButton.classList.remove('selected-29KTGM');
                    if (disableTransitions) {
                        document.querySelector('.wrapper-1_HaEi').style.display = 'none';
                    } else {
                        document.querySelector('.wrapper-1_HaEi').style.width = '0px';
                    }
                } else if (BdApi.getData('CollapsibleUI', 'serverListButtonActive') === 'true') {
                    serverListButton.classList.add('selected-29KTGM');
                } else {
                    BdApi.setData('CollapsibleUI', 'serverListButtonActive', 'true');
                    serverListButton.classList.add('selected-29KTGM');
                }
            }

            // Read stored user data to decide active state of Channel List button
            if (channelListButton) {
                if (BdApi.getData('CollapsibleUI', 'channelListButtonActive') === 'false') {
                    channelListButton.classList.remove('selected-29KTGM');
                    if (disableTransitions) {
                        document.querySelector('.sidebar-1tnWFu').style.display = 'none';
                    } else {
                        document.querySelector('.sidebar-1tnWFu').style.width = '0px';
                    }
                } else if (BdApi.getData('CollapsibleUI', 'channelListButtonActive') === 'true') {
                    channelListButton.classList.add('selected-29KTGM');
                } else {
                    BdApi.setData('CollapsibleUI', 'channelListButtonActive', 'true');
                    channelListButton.classList.add('selected-29KTGM');
                }
            }

            // Read stored user data to decide active state of Message Bar button
            if (msgBarButton) {
                if (BdApi.getData('CollapsibleUI', 'msgBarButtonActive') === 'false') {
                    msgBarButton.classList.remove('selected-29KTGM');
                    if (disableTransitions) {
                        document.querySelector('.form-3gdLxP').style.display = 'none';
                    } else {
                        document.querySelector('.form-3gdLxP').style.maxHeight = '0px';
                    }
                } else if (BdApi.getData('CollapsibleUI', 'msgBarButtonActive') === 'true') {
                    msgBarButton.classList.add('selected-29KTGM');
                } else {
                    BdApi.setData('CollapsibleUI', 'msgBarButtonActive', 'true');
                    msgBarButton.classList.add('selected-29KTGM');
                }
            }

            // Read stored user data to decide active state of Window Bar button
            if (windowBarButton) {
                if (BdApi.getData('CollapsibleUI', 'windowBarButtonActive') === 'false') {
                    windowBarButton.classList.remove('selected-29KTGM');
                    if (disableTransitions) {
                        document.querySelector('.typeWindows-2-g3UY').style.display = 'none';
                    } else {
                        document.querySelector('.typeWindows-2-g3UY').style.height = '0px';
                        document.querySelector('.typeWindows-2-g3UY').style.padding = '0';
                        document.querySelector('.typeWindows-2-g3UY').style.margin = '0';
                        document.querySelector('.wordmark-2u86JB').style.display = 'none';
                    }
                } else if (BdApi.getData('CollapsibleUI', 'windowBarButtonActive') === 'true') {
                    windowBarButton.classList.add('selected-29KTGM');
                } else {
                    BdApi.setData('CollapsibleUI', 'windowBarButtonActive', 'true');
                    windowBarButton.classList.add('selected-29KTGM');
                }
            }

            // Read stored user data to decide active state of Members List button
            if (membersListButton) {
                if (BdApi.getData('CollapsibleUI', 'membersListButtonActive') === 'false') {
                    membersListButton.classList.remove('selected-29KTGM');
                    if (disableTransitions) {
                        document.querySelector('.membersWrap-3NUR2t').style.display = 'none';
                    } else {
                        document.querySelector('.membersWrap-3NUR2t').style.maxWidth = '0px';
                        document.querySelector('.membersWrap-3NUR2t').style.minWidth = '0px';
                    }
                } else if (BdApi.getData('CollapsibleUI', 'membersListButtonActive') === 'true') {
                    membersListButton.classList.add('selected-29KTGM');
                } else {
                    BdApi.setData('CollapsibleUI', 'membersListButtonActive', 'true');
                    membersListButton.classList.add('selected-29KTGM');
                }
            }

            // Read stored user data to decide active state of User Area button
            if (userAreaButton) {
                if (BdApi.getData('CollapsibleUI', 'userAreaButtonActive') === 'false') {
                    userAreaButton.classList.remove('selected-29KTGM');
                    if (disableTransitions) {
                        document.querySelector('.panels-3wFtMD').style.display = 'none';
                    } else {
                        document.querySelector('.panels-3wFtMD').style.maxHeight = '0px';
                    }
                } else if (BdApi.getData('CollapsibleUI', 'userAreaButtonActive') === 'true') {
                    userAreaButton.classList.add('selected-29KTGM');
                } else {
                    BdApi.setData('CollapsibleUI', 'userAreaButtonActive', 'true');
                    userAreaButton.classList.add('selected-29KTGM');
                }
            }

            // Apply transitions to UI elements
            if (!disableTransitions) {
                document.querySelector('.sidebar-1tnWFu').style.transition = 'width ' + transitionSpeed + 'ms';
                if (resizableChannelList) {
                    document.querySelector('.sidebar-1tnWFu').style.resize = 'horizontal';
                    document.querySelector('.sidebar-1tnWFu').addEventListener('mouseenter', function (){
                        document.querySelector('.sidebar-1tnWFu').style.transition = 'none';
                    });
                    document.querySelector('.sidebar-1tnWFu').addEventListener('mouseleave', function (){
                        document.querySelector('.sidebar-1tnWFu').style.transition = 'width ' + transitionSpeed + 'ms';
                    });
                }
                
                document.querySelector('.wrapper-1_HaEi').style.transition = 'width ' + transitionSpeed + 'ms';
                if (document.querySelector('.typeWindows-2-g3UY')) {
                    document.querySelector('.typeWindows-2-g3UY').style.transition = 'height ' + transitionSpeed + 'ms';
                }
                if (document.querySelector('.membersWrap-3NUR2t')) {
                    document.querySelector('.membersWrap-3NUR2t').style.transition = 'max-width ' + transitionSpeed + 'ms, min-width ' + transitionSpeed + 'ms';
                }

                if (document.querySelector('.form-3gdLxP')) {
                    document.querySelector('.form-3gdLxP').style.transition = 'max-height ' + transitionSpeed + 'ms';
                }

                if (document.querySelector('.panels-3wFtMD')) {
                    document.querySelector('.panels-3wFtMD').style.transition = 'max-height ' + transitionSpeed + 'ms';
                }
            }
            
            // Add event listeners to the Toolbar Container to update on hover
            if (!disableToolbarCollapse) {
                toolbarContainer.addEventListener('mouseenter', function(){
                    if (serverListButton) {
                        serverListButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        serverListButton.style.removeProperty('margin');
                        serverListButton.style.removeProperty('padding');
                    }
                    if (channelListButton) {
                        channelListButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        channelListButton.style.removeProperty('margin');
                        channelListButton.style.removeProperty('padding');
                    }
                    if (msgBarButton) {
                        msgBarButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        msgBarButton.style.removeProperty('margin');
                        msgBarButton.style.removeProperty('padding');
                    }
                    if (windowBarButton) {
                        windowBarButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        windowBarButton.style.removeProperty('margin');
                        windowBarButton.style.removeProperty('padding');
                    }
                    if (membersListButton) {
                        membersListButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        membersListButton.style.removeProperty('margin');
                        membersListButton.style.removeProperty('padding');
                    }
                    if (userAreaButton) {
                        userAreaButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        userAreaButton.style.removeProperty('margin');
                        userAreaButton.style.removeProperty('padding');
                    }
                });
                toolbarContainer.addEventListener('mouseleave', function(){
                    if (serverListButton) {
                        serverListButton.style.maxWidth = '0px';
                        serverListButton.style.margin = '0';
                        serverListButton.style.padding = '0';
                    }
                    if (channelListButton) {
                        channelListButton.style.maxWidth = '0px';
                        channelListButton.style.margin = '0';
                        channelListButton.style.padding = '0';
                    }
                    if (msgBarButton) {
                        msgBarButton.style.maxWidth = '0px';
                        msgBarButton.style.margin = '0';
                        msgBarButton.style.padding = '0';
                    }
                    if (windowBarButton) {
                        windowBarButton.style.maxWidth = '0px';
                        windowBarButton.style.margin = '0';
                        windowBarButton.style.padding = '0';
                    }
                    if (membersListButton) {
                        membersListButton.style.maxWidth = '0px';
                        membersListButton.style.margin = '0';
                        membersListButton.style.padding = '0';
                    }
                    if (userAreaButton) {
                        userAreaButton.style.maxWidth = '0px';
                        userAreaButton.style.margin = '0';
                        userAreaButton.style.padding = '0';
                    }
                
                    if (membersListButton && (buttonsActive[4] == Math.max.apply(Math, buttonsActive))) {
                        membersListButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        membersListButton.style.removeProperty('margin');
                        membersListButton.style.removeProperty('padding');
                    } else if (windowBarButton && (buttonsActive[3] == Math.max.apply(Math, buttonsActive))) {
                        windowBarButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        windowBarButton.style.removeProperty('margin');
                        windowBarButton.style.removeProperty('padding');
                    } else if (msgBarButton && (buttonsActive[2] == Math.max.apply(Math, buttonsActive))) {
                        msgBarButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        msgBarButton.style.removeProperty('margin');
                        msgBarButton.style.removeProperty('padding');
                    } else if (channelListButton && (buttonsActive[1] == Math.max.apply(Math, buttonsActive))) {
                        channelListButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        channelListButton.style.removeProperty('margin');
                        channelListButton.style.removeProperty('padding');
                    } else if (serverListButton && (buttonsActive[0] == Math.max.apply(Math, buttonsActive))) {
                        serverListButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        serverListButton.style.removeProperty('margin');
                        serverListButton.style.removeProperty('padding');
                    } else if (userAreaButton && (buttonsActive[5] == Math.max.apply(Math, buttonsActive))) {
                        userAreaButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        userAreaButton.style.removeProperty('margin');
                        userAreaButton.style.removeProperty('padding');
                    } else {
                        document.querySelectorAll('.collapsible-ui-element').forEach(e => e.style.display = 'none');
                    }
                });
            }
            
            // Add event listeners to the Settings Container to update on hover
            if (!disableSettingsCollapse) {
                settingsContainer.addEventListener('mouseenter', function(){
                    for (let i = 0; i < (settingsButtons.length - 1); i++) {
                        settingsButtons[i].style.maxWidth = settingsButtonsMaxWidth + 'px';
                    }
                });
                settingsContainer.addEventListener('mouseleave', function(){
                    for (let i = 0; i < (settingsButtons.length - 1); i++) {
                        settingsButtons[i].style.maxWidth = '0px';
                    }
                });
            }

            // Add event listener to the Server List button to update the icon, UI, & settings on click
            if (serverListButton) {
                serverListButton.addEventListener('click', function(){
                    if (BdApi.getData('CollapsibleUI', 'serverListButtonActive') === 'true') {
                        if (disableTransitions) {
                            document.querySelector('.wrapper-1_HaEi').style.display = 'none';
                        } else {
                            document.querySelector('.wrapper-1_HaEi').style.width = '0px';
                        }
                        BdApi.setData('CollapsibleUI', 'serverListButtonActive', 'false');
                        this.classList.remove('selected-29KTGM');
                    } else {
                        if (disableTransitions) {
                            document.querySelector('.wrapper-1_HaEi').style.display = 'initial';
                        } else {
                            document.querySelector('.wrapper-1_HaEi').style.removeProperty('width');
                        }
                        BdApi.setData('CollapsibleUI', 'serverListButtonActive', 'true');
                        this.classList.add('selected-29KTGM');
                    }
                });
            }

            // Add event listener to the Channel List button to update the icon, UI, & settings on click
            if (channelListButton) {
                channelListButton.addEventListener('click', function(){
                    if (BdApi.getData('CollapsibleUI', 'channelListButtonActive') === 'true') {
                        if (disableTransitions) {
                            document.querySelector('.sidebar-1tnWFu').style.display = 'none';
                        } else {
                            document.querySelector('.sidebar-1tnWFu').style.width = '0px';
                        }
                        BdApi.setData('CollapsibleUI', 'channelListButtonActive', 'false');
                        this.classList.remove('selected-29KTGM');
                    } else {
                        if (disableTransitions) {
                            document.querySelector('.sidebar-1tnWFu').style.display = 'initial';
                        } else {
                            document.querySelector('.sidebar-1tnWFu').style.removeProperty('width');
                        }
                        BdApi.setData('CollapsibleUI', 'channelListButtonActive', 'true');
                        this.classList.add('selected-29KTGM');
                    }
                });
            }

            // Add event listener to the Message Bar button to update the icon, UI, & settings on click
            if (msgBarButton) {
                msgBarButton.addEventListener('click', function(){
                    if (BdApi.getData('CollapsibleUI', 'msgBarButtonActive') === 'true') {
                        if (disableTransitions) {
                            document.querySelector('.form-3gdLxP').style.display = 'none';
                        } else {
                            document.querySelector('.form-3gdLxP').style.maxHeight = '0px';
                        }
                        BdApi.setData('CollapsibleUI', 'msgBarButtonActive', 'false');
                        this.classList.remove('selected-29KTGM');
                    } else {
                        if (disableTransitions) {
                            document.querySelector('.form-3gdLxP').style.display = 'initial';
                        } else {
                            document.querySelector('.form-3gdLxP').style.maxHeight = msgBarMaxHeight + 'px';
                        }
                        BdApi.setData('CollapsibleUI', 'msgBarButtonActive', 'true');
                        this.classList.add('selected-29KTGM');
                    }
                });
            }

            // Add event listener to the Window Bar button to update the icon, UI, & settings on click
            if (windowBarButton) {
                windowBarButton.addEventListener('click', function(){
                    if (BdApi.getData('CollapsibleUI', 'windowBarButtonActive') === 'true') {
                        if (disableTransitions) {
                            document.querySelector('.typeWindows-2-g3UY').style.display = 'none';
                        } else {
                            document.querySelector('.typeWindows-2-g3UY').style.height = '0px';
                            document.querySelector('.typeWindows-2-g3UY').style.padding = '0';
                            document.querySelector('.typeWindows-2-g3UY').style.margin = '0';
                            document.querySelector('.wordmark-2u86JB').style.display = 'none';
                        }
                        BdApi.setData('CollapsibleUI', 'windowBarButtonActive', 'false');
                        this.classList.remove('selected-29KTGM');
                    } else {
                        if (disableTransitions) {
                            document.querySelector('.typeWindows-2-g3UY').style.display = 'flex';
                        } else {
                            document.querySelector('.typeWindows-2-g3UY').style.height = windowBarHeight + 'px';
                            document.querySelector('.typeWindows-2-g3UY').style.removeProperty('padding');
                            document.querySelector('.typeWindows-2-g3UY').style.removeProperty('margin');
                            document.querySelector('.wordmark-2u86JB').style.removeProperty('display');
                        }
                        BdApi.setData('CollapsibleUI', 'windowBarButtonActive', 'true');
                        this.classList.add('selected-29KTGM');
                    }
                });
            }

            // Add event listener to the Members List button to update the icon, UI, & settings on click
            if (membersListButton) {
                membersListButton.addEventListener('click', function(){
                    if (BdApi.getData('CollapsibleUI', 'membersListButtonActive') === 'true') {
                        if (disableTransitions) {
                            document.querySelector('.membersWrap-3NUR2t').style.display = 'none';
                        } else {
                            document.querySelector('.membersWrap-3NUR2t').style.maxWidth = '0px';
                            document.querySelector('.membersWrap-3NUR2t').style.minWidth = '0px';
                        }
                        BdApi.setData('CollapsibleUI', 'membersListButtonActive', 'false');
                        this.classList.remove('selected-29KTGM');
                    } else {
                        if (disableTransitions) {
                            document.querySelector('.membersWrap-3NUR2t').style.removeProperty('display');
                        } else {
                            document.querySelector('.membersWrap-3NUR2t').style.maxWidth = membersListMaxWidth + 'px';
                            document.querySelector('.membersWrap-3NUR2t').style.removeProperty('min-width');
                        }
                        BdApi.setData('CollapsibleUI', 'membersListButtonActive', 'true');
                        this.classList.add('selected-29KTGM');
                    }
                });
            }

            // Add event listener to the User Area button to update the icon, UI, & settings on click
            if (userAreaButton) {
                userAreaButton.addEventListener('click', function(){
                    if (BdApi.getData('CollapsibleUI', 'userAreaButtonActive') === 'true') {
                        if (disableTransitions) {
                            document.querySelector('.panels-3wFtMD').style.display = 'none';
                        } else {
                            document.querySelector('.panels-3wFtMD').style.maxHeight = '0px';
                        }
                        BdApi.setData('CollapsibleUI', 'userAreaButtonActive', 'false');
                        this.classList.remove('selected-29KTGM');
                    } else {
                        if (disableTransitions) {
                            document.querySelector('.panels-3wFtMD').style.removeProperty('display');
                        } else {
                            document.querySelector('.panels-3wFtMD').style.maxHeight = userAreaMaxHeight + 'px';
                        }
                        BdApi.setData('CollapsibleUI', 'userAreaButtonActive', 'true');
                        this.classList.add('selected-29KTGM');
                    }
                });
            }
        }

        // Initialize the plugin when it is enabled
        async start() {

            // Wait for current user session to finish loading
            while (!document.body.hasAttribute('data-current-user-id')) {
                await new Promise(resolve => requestAnimationFrame(resolve));
            }

            // Wait for an additional second because FSR the message bar won't collapse correctly otherwise
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            try {
                this.initialize();
            } catch(e) {
                console.warn('[CollapsibleUI] Could not initialize toolbar\n  - ' + e.message);
            }
            
            console.log('[CollapsibleUI] version 3.0.1 has started.');
        }

        // Restore the default UI when the plugin is disabled
        stop() {

            // Remove CollapsibleUI icons
            document.querySelectorAll('.collapsible-ui-element').forEach(e => e.remove());

            // Re-enable the original Members List icon
            try {
                document.querySelector('.search-39IXmY').previousElementSibling.style.removeProperty('display');
            } catch {
                console.warn('[CollapsibleUI] Failed to restore Members List button. Are you sure it exists?');
            }

            // Expand any collapsed elements & remove transitions
            document.querySelector('.sidebar-1tnWFu').style.removeProperty('width');
            document.querySelector('.sidebar-1tnWFu').style.removeProperty('transition');
            document.querySelector('.sidebar-1tnWFu').style.removeProperty('resize');
            document.querySelector('.sidebar-1tnWFu').style.removeProperty('display');
            document.querySelector('.wrapper-1_HaEi').style.removeProperty('width');
            document.querySelector('.wrapper-1_HaEi').style.removeProperty('transition');
            document.querySelector('.wrapper-1_HaEi').style.removeProperty('display');
            if (document.querySelector('.typeWindows-2-g3UY')) {
                document.querySelector('.wordmark-2u86JB').style.removeProperty('display');
                document.querySelector('.typeWindows-2-g3UY').style.removeProperty('height');
                document.querySelector('.typeWindows-2-g3UY').style.removeProperty('padding');
                document.querySelector('.typeWindows-2-g3UY').style.removeProperty('margin');
                document.querySelector('.typeWindows-2-g3UY').style.removeProperty('overflow');
                document.querySelector('.typeWindows-2-g3UY').style.removeProperty('transition');
                document.querySelector('.typeWindows-2-g3UY').style.removeProperty('display');
            }
            if (document.querySelector('.membersWrap-3NUR2t')) {
                document.querySelector('.membersWrap-3NUR2t').style.removeProperty('max-width');
                document.querySelector('.membersWrap-3NUR2t').style.removeProperty('min-width');
                document.querySelector('.membersWrap-3NUR2t').style.removeProperty('overflow');
                document.querySelector('.membersWrap-3NUR2t').style.removeProperty('transition');
                document.querySelector('.membersWrap-3NUR2t').style.removeProperty('display');
            }
            if (document.querySelector('.form-3gdLxP')) {
                document.querySelector('.form-3gdLxP').style.removeProperty('max-height');
                document.querySelector('.form-3gdLxP').style.removeProperty('transition');
                document.querySelector('.form-3gdLxP').style.removeProperty('display');
            }
            if (document.querySelector('.flex-1xMQg5')) {
                for (let i = 0; i < (document.querySelector('.flex-1xMQg5').children.length - 1); i++) {
                    document.querySelector('.flex-1xMQg5').children[i].style.removeProperty('max-width');
                    document.querySelector('.flex-1xMQg5').children[i].style.removeProperty('transition');
                    document.querySelector('.flex-1xMQg5').children[i].style.removeProperty('overflow');
                    document.querySelector('.flex-1xMQg5').children[i].style.removeProperty('display');
                }
            }
            if (document.querySelector('.panels-3wFtMD')) {
                document.querySelector('.panels-3wFtMD').style.removeProperty('height');
                document.querySelector('.panels-3wFtMD').style.removeProperty('transition');
                document.querySelector('.panels-3wFtMD').style.removeProperty('display');
            }
            

            console.log('[CollapsibleUI] version 3.0.1 has stopped.');
        }

        // Re-initialize the plugin on channel/server switch to maintain icon availability
        onSwitch() {
            try {
                this.initialize();
            } catch(e) {
                console.warn('[CollapsibleUI] Could not initialize toolbar\n  - ' + e.message);
            }
        }

        // Adds a new SVG icon to the toolbar
        addToolbarIcon(ariaLabel, rawSVGData, viewBox) {

            // Create the icon and define properties
            var newToolbarIcon = document.createElement('div');
                newToolbarIcon.classList.add('iconWrapper-2awDjA');
                newToolbarIcon.classList.add('clickable-ZD7xvu');
                newToolbarIcon.classList.add('collapsible-ui-element');
                newToolbarIcon.setAttribute('role', 'button');
                newToolbarIcon.setAttribute('aria-label', ariaLabel);
                newToolbarIcon.setAttribute('tabindex', '0');
                newToolbarIcon.style.display = 'inline-block';
                newToolbarIcon.style.overflow = 'hidden';
                newToolbarIcon.innerHTML = '<svg x="0" y="0" class="icon-2xnN2Y" aria-hidden="false" width="24" height="24" viewBox="' + viewBox + '">' + rawSVGData + '</svg>';

            // Insert icon to the left of the search bar
            document.getElementById('cui-toolbar-container').insertBefore(newToolbarIcon, document.getElementById('cui-icon-insert-point'));

            // Return DOM Element of newly-created toolbar icon
            return newToolbarIcon;

        }
    }

})();