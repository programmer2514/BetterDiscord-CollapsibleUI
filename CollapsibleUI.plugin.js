/**
 * @name CollapsibleUI
 * @author programmer2514
 * @authorId 563652755814875146
 * @description A simple plugin that allows collapsing various sections of the Discord UI.
 * @version 4.0.6
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
            version: '4.0.6',
            description: 'A simple plugin that allows collapsing various sections of the Discord UI.',
            github: 'https://github.com/programmer2514/BetterDiscord-CollapsibleUI',
            github_raw: 'https://raw.githubusercontent.com/programmer2514/BetterDiscord-CollapsibleUI/main/CollapsibleUI.plugin.js'
        },
        changelog: [{
            title: '4.0.6',
            items: [
                'Prevent sidebars from uncollapsing while hovering over message bar'
            ]
        }, {
            title: '4.0.5',
            items: [
                'Fixed window bar dynamic uncollapse'
            ]
        }, {
            title: '4.0.4',
            items: [
                'Fixed dynamic uncollapse',
                'Fixed tooltips not showing'
            ]
        }, {
            title: '4.0.3',
            items: [
                'Fixed settings collapse malfunction when in a voice call',
                'Disabled call area buttons collapsing via settings collapse'
            ]
        }, {
            title: '4.0.2',
            items: [
                'Fixed UI elements not collapsing on mouse leaving the window'
            ]
        }, {
            title: '4.0.1',
            items: [
                'Fixed patch notes'
            ]
        }, {
            title: '4.0.0',
            items: [
                'Added settings panel',
                'Small animation tweaks',
                'Added dynamic uncollapse feature',
                'Made call container collapsible',
                'With settings collapse enabled, now collapses call area buttons correctly',
                'Fixed a lot of bugs'
            ]
        }, {
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

            /* BUTTON INDEX:               *
             *-----------------------------*
             * 0 - cui.serverListButton    *
             * 1 - cui.channelListButton   *
             * 2 - cui.msgBarButton        *
             * 3 - cui.windowBarButton     *
             * 4 - cui.membersListButton   *
             * 5 - cui.userAreaButton      *
             * 6 - cui.callContainerButton *
             *-----------------------------*/

            let disableTransitions = false;
            let transitionSpeed = 300;

            let disableToolbarCollapse = false;
            let disableSettingsCollapse = false;

            let dynamicUncollapse = true;
            let dynamicUncollapseDistance = 20;

            let resizableChannelList = true;

            let buttonsOrder = [1,2,4,6,7,3,5];

            let settingsButtonsMaxWidth = 100;
            let toolbarIconMaxWidth = 300;
            let membersListMaxWidth = 240;
            let userAreaMaxHeight = 100;
            let msgBarMaxHeight = 400;
            let windowBarHeight = 18;

            // Load isNear function into local scope and define mouse tracking variables
            this.mouseX = 0;
            this.mouseY = 0;

            this.tooltipOffset = 8;
            this.isCollapsed = [true, true, true, true, true, true, true];

            // Abstract used classes
            this.classSelected = 'selected-29KTGM';
            this.classIconWrapper = 'iconWrapper-2awDjA';
            this.classClickable = 'clickable-ZD7xvu';
            this.classCallContainer = 'wrapper-1gVUIN';
            this.classConnectionArea = 'connection-3k9QeF';
            this.classTooltipWrapper = 'layer-2aCOJ3';
            this.classTooltipWrapperDPE = 'disabledPointerEvents-2AmYRc';
            this.classTooltip = 'tooltip-14MtrL';
            this.classTooltipBottom = 'tooltipBottom-2WzfVx';
            this.classTooltipPrimary = 'tooltipPrimary-3qLMbS';
            this.classTooltipDPE = 'tooltipDisablePointerEvents-1huO19';
            this.classTooltipPointer = 'tooltipPointer-3L49xb';
            this.classTooltipContent = 'tooltipContent-Nejnvh';


            // Abstract modified elements
            this.toolBar = document.querySelector('.toolbar-3_r2xA');
            this.searchBar = document.querySelector('.search-39IXmY');
            this.settingsContainer = document.querySelector('.container-YkUktl').querySelector('.flex-2S1XBF');
            this.windowBar = document.querySelector('.typeWindows-2-g3UY');
            this.wordMark = document.querySelector('.wordmark-2u86JB');
            this.msgBar = document.querySelector('.form-3gdLxP');
            this.userArea = document.querySelector('.panels-3wFtMD');
            this.membersList = document.querySelector('.membersWrap-3NUR2t');
            this.serverList = document.querySelector('.wrapper-1_HaEi');
            this.channelList = document.querySelector('.sidebar-1tnWFu');

            this.callContainerExists = (document.querySelector('.' + this.classCallContainer));

            // Abstract CollapsibleUI as a variable
            let cui = this;

            // Clean up UI
            this.stop();

            // Store eventListeners in an array
            this.eventListenerController = new AbortController();
            this.eventListenerSignal = this.eventListenerController.signal;

            // Clean up old settings
            if (BdApi.getData('CollapsibleUI', 'cuiSettingsVersion') !== '2') {
                // Clean up v1
                BdApi.deleteData('CollapsibleUI', 'serverListButtonActive');
                BdApi.deleteData('CollapsibleUI', 'channelListButtonActive');
                BdApi.deleteData('CollapsibleUI', 'msgBarButtonActive');
                BdApi.deleteData('CollapsibleUI', 'windowBarButtonActive');
                BdApi.deleteData('CollapsibleUI', 'membersListButtonActive');
                BdApi.deleteData('CollapsibleUI', 'userAreaButtonActive');

                // Clean up v2
                BdApi.deleteData('CollapsibleUI', 'disableTransitions');
                BdApi.deleteData('CollapsibleUI', 'transitionSpeed');
                BdApi.deleteData('CollapsibleUI', 'disableToolbarCollapse');
                BdApi.deleteData('CollapsibleUI', 'disableSettingsCollapse');
                BdApi.deleteData('CollapsibleUI', 'dynamicUncollapse');
                BdApi.deleteData('CollapsibleUI', 'dynamicUncollapseDistance');
                BdApi.deleteData('CollapsibleUI', 'resizableChannelList');
                BdApi.deleteData('CollapsibleUI', 'buttonsOrder');
                BdApi.deleteData('CollapsibleUI', 'settingsButtonsMaxWidth');
                BdApi.deleteData('CollapsibleUI', 'toolbarIconMaxWidth');
                BdApi.deleteData('CollapsibleUI', 'membersListMaxWidth');
                BdApi.deleteData('CollapsibleUI', 'userAreaMaxHeight');
                BdApi.deleteData('CollapsibleUI', 'msgBarMaxHeight');
                BdApi.deleteData('CollapsibleUI', 'windowBarHeight');
                BdApi.deleteData('CollapsibleUI', 'cui.serverListButtonActive');
                BdApi.deleteData('CollapsibleUI', 'cui.channelListButtonActive');
                BdApi.deleteData('CollapsibleUI', 'cui.msgBarButtonActive');
                BdApi.deleteData('CollapsibleUI', 'cui.windowBarButtonActive');
                BdApi.deleteData('CollapsibleUI', 'cui.membersListButtonActive');
                BdApi.deleteData('CollapsibleUI', 'cui.userAreaButtonActive');
                BdApi.deleteData('CollapsibleUI', 'cui.callContainerButtonActive');

                // Set new settings version
                BdApi.setData('CollapsibleUI', 'cuiSettingsVersion', '2');
            }

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

            // dynamicUncollapse [Default: true]
            if (BdApi.getData('CollapsibleUI', 'dynamicUncollapse') === 'false') {
                dynamicUncollapse = false;
            } else if (BdApi.getData('CollapsibleUI', 'dynamicUncollapse') === 'true') {
                dynamicUncollapse = true;
            } else {
                BdApi.setData('CollapsibleUI', 'dynamicUncollapse', 'true');
            }

            // dynamicUncollapseDistance [Default: 20]
            if (typeof(BdApi.getData('CollapsibleUI', 'dynamicUncollapseDistance')) === 'string') {
                dynamicUncollapseDistance = parseInt(BdApi.getData('CollapsibleUI', 'dynamicUncollapseDistance'));
            } else {
                BdApi.setData('CollapsibleUI', 'dynamicUncollapseDistance', dynamicUncollapseDistance.toString());
            }

            // resizableChannelList [Default: true]
            if (BdApi.getData('CollapsibleUI', 'resizableChannelList') === 'false') {
                resizableChannelList = false;
            } else if (BdApi.getData('CollapsibleUI', 'resizableChannelList') === 'true') {
                resizableChannelList = true;
            } else {
                BdApi.setData('CollapsibleUI', 'resizableChannelList', 'true');
            }

            // buttonsOrder [Default: [1,2,4,6,7,3,5]]
            if (typeof(BdApi.getData('CollapsibleUI', 'buttonsOrder')) === 'string') {
                if (BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',').map(Number).length = buttonsOrder.length)
                    buttonsOrder = BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',').map(Number);
                else
                    BdApi.setData('CollapsibleUI', 'buttonsOrder', buttonsOrder.toString());
            } else {
                BdApi.setData('CollapsibleUI', 'buttonsOrder', buttonsOrder.toString());
            }

            // settingsButtonsMaxWidth [Default: 100]
            if (typeof(BdApi.getData('CollapsibleUI', 'settingsButtonsMaxWidth')) === 'string') {
                settingsButtonsMaxWidth = parseInt(BdApi.getData('CollapsibleUI', 'settingsButtonsMaxWidth'));
            } else {
                BdApi.setData('CollapsibleUI', 'settingsButtonsMaxWidth', settingsButtonsMaxWidth.toString());
            }

            // toolbarIconMaxWidth [Default: 300]
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

            // Surpress obnoxious ZeresPluginLibrary spam
            this.zeresWarnOld = BdApi.Plugins.get('ZeresPluginLibrary').exports.Logger.warn;
            BdApi.Plugins.get('ZeresPluginLibrary').exports.Logger.warn = function (module, ...message) {
                if (module !== 'DOMTools' && !message.includes('These custom functions on HTMLElement will be removed.')) {
                    this.zeresWarnOld(module, message);
                }
            };

            // Hide default Members List button
            if (this.membersList) {
                try {
                    if (this.searchBar.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling) {
                        if (this.searchBar.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.classList.contains('icon-1ELUnB')) {
                            this.searchBar.previousElementSibling.previousElementSibling.style.display = 'none';
                        } else {
                            this.searchBar.previousElementSibling.style.display = 'none';
                        }
                    } else {
                        this.searchBar.previousElementSibling.style.display = 'none';
                    }
                } catch {
                    this.searchBar.previousElementSibling.style.display = 'none';
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
            this.toolBar.insertBefore(toolbarContainer, this.searchBar);

            // Define & add new toolbar icons
            // Icons are part of the Bootstrap Icons library, which can be found at https://icons.getbootstrap.com/
            var buttonsActive = buttonsOrder;
            for (let i = 1; i <= buttonsOrder.length; i++) {
                if (i == buttonsOrder[0]) {
                    if (buttonsOrder[0]) {
                        this.serverListButton = this.addToolbarIcon('Server List', '<path fill="currentColor" d="M-3.429,0.857C-3.429-0.72-2.149-2-0.571-2h17.143c1.578,0,2.857,1.28,2.857,2.857v14.286c0,1.578-1.279,2.857-2.857,2.857H-0.571c-1.578,0-2.857-1.279-2.857-2.857V0.857z M3.714-0.571v17.143h12.857c0.789,0,1.429-0.64,1.429-1.429V0.857c0-0.789-0.64-1.428-1.429-1.428H3.714z M2.286-0.571h-2.857C-1.36-0.571-2,0.068-2,0.857v14.286c0,0.789,0.64,1.429,1.429,1.429h2.857V-0.571z"/>', '-4 -4 24 24');
                    } else {
                        this.serverListButton = false;
                        buttonsActive[0] = 0;
                    }
                }
                if (i == buttonsOrder[1]) {
                    if (buttonsOrder[1]) {
                        this.channelListButton = this.addToolbarIcon('Channel List', '<path fill="currentColor" d="M3.5,13.5c0-0.414,0.335-0.75,0.75-0.75h13.5c0.414,0,0.75,0.336,0.75,0.75s-0.336,0.75-0.75,0.75H4.25C3.835,14.25,3.5,13.914,3.5,13.5z M3.5,7.5c0-0.415,0.335-0.75,0.75-0.75h13.5c0.414,0,0.75,0.335,0.75,0.75s-0.336,0.75-0.75,0.75H4.25C3.835,8.25,3.5,7.915,3.5,7.5z M3.5,1.5c0-0.415,0.335-0.75,0.75-0.75h13.5c0.414,0,0.75,0.335,0.75,0.75s-0.336,0.75-0.75,0.75H4.25C3.835,2.25,3.5,1.915,3.5,1.5z M-1,3c0.828,0,1.5-0.672,1.5-1.5S-0.172,0-1,0s-1.5,0.672-1.5,1.5S-1.828,3-1,3z M-1,9c0.828,0,1.5-0.672,1.5-1.5S-0.172,6-1,6s-1.5,0.672-1.5,1.5S-1.828,9-1,9z M-1,15c0.828,0,1.5-0.671,1.5-1.5S-0.172,12-1,12s-1.5,0.671-1.5,1.5S-1.828,15-1,15z"/>', '-4 -4 24 24');
                    } else {
                        this.channelListButton = false;
                        buttonsActive[1] = 0;
                    }
                }
                if (i == buttonsOrder[2]) {
                    if (buttonsOrder[2] && this.msgBar) {
                        this.msgBarButton = this.addToolbarIcon('Message Bar', '<path fill="currentColor" d="M7.5,3c0-0.415,0.335-0.75,0.75-0.75c1.293,0,2.359,0.431,3.09,0.85c0.261,0.147,0.48,0.296,0.66,0.428c0.178-0.132,0.398-0.28,0.66-0.428c0.939-0.548,2.002-0.841,3.09-0.85c0.414,0,0.75,0.335,0.75,0.75c0,0.414-0.336,0.75-0.75,0.75c-0.959,0-1.766,0.319-2.348,0.65c-0.229,0.132-0.446,0.278-0.652,0.442v6.407h0.75c0.414,0,0.75,0.335,0.75,0.75c0,0.414-0.336,0.75-0.75,0.75h-0.75v6.407c0.148,0.12,0.371,0.281,0.652,0.442c0.582,0.331,1.389,0.65,2.348,0.65c0.414,0,0.75,0.335,0.75,0.75c0,0.414-0.336,0.75-0.75,0.75c-1.088-0.01-2.15-0.302-3.09-0.85c-0.229-0.129-0.449-0.271-0.66-0.425c-0.212,0.155-0.433,0.297-0.66,0.428c-0.939,0.546-2.004,0.837-3.09,0.848c-0.415,0-0.75-0.335-0.75-0.75c0-0.414,0.335-0.75,0.75-0.75c0.957,0,1.765-0.319,2.346-0.651c0.281-0.16,0.502-0.319,0.654-0.439v-6.41H10.5c-0.415,0-0.75-0.336-0.75-0.75c0-0.415,0.335-0.75,0.75-0.75h0.75V4.843c-0.207-0.164-0.426-0.311-0.654-0.442C9.884,3.984,9.075,3.759,8.25,3.75C7.835,3.75,7.5,3.414,7.5,3z"/><path fill="currentColor" d="M15,7.5h6c0.828,0,1.5,0.671,1.5,1.5v6c0,0.829-0.672,1.5-1.5,1.5h-6V18h6c1.656,0,3-1.344,3-3V9c0-1.657-1.344-3-3-3h-6V7.5z M9,7.5V6H3C1.343,6,0,7.343,0,9v6c0,1.656,1.343,3,3,3h6v-1.5H3c-0.829,0-1.5-0.671-1.5-1.5V9c0-0.829,0.671-1.5,1.5-1.5H9z"/>', '0 0 24 24');
                    } else {
                        this.msgBarButton = false;
                        buttonsActive[2] = 0;
                    }
                }
                if (i == buttonsOrder[3]) {
                    if (buttonsOrder[3] && this.windowBar) {
                        this.windowBarButton = this.addToolbarIcon('Window Bar', '<path fill="currentColor" d="M0.143,2.286c0.395,0,0.714-0.319,0.714-0.714c0-0.395-0.319-0.714-0.714-0.714c-0.395,0-0.714,0.32-0.714,0.714C-0.571,1.966-0.252,2.286,0.143,2.286z M3,1.571c0,0.395-0.319,0.714-0.714,0.714c-0.395,0-0.714-0.319-0.714-0.714c0-0.395,0.32-0.714,0.714-0.714C2.681,0.857,3,1.177,3,1.571z M4.429,2.286c0.395,0,0.714-0.319,0.714-0.714c0-0.395-0.32-0.714-0.714-0.714c-0.395,0-0.714,0.32-0.714,0.714C3.714,1.966,4.034,2.286,4.429,2.286z"/><path fill="currentColor" d="M-0.571-2c-1.578,0-2.857,1.279-2.857,2.857v14.286c0,1.578,1.279,2.857,2.857,2.857h17.143c1.577,0,2.857-1.279,2.857-2.857V0.857c0-1.578-1.28-2.857-2.857-2.857H-0.571z M18,0.857v2.857H-2V0.857c0-0.789,0.64-1.428,1.429-1.428h17.143C17.361-0.571,18,0.068,18,0.857z M-0.571,16.571C-1.36,16.571-2,15.933-2,15.143v-10h20v10c0,0.79-0.639,1.429-1.429,1.429H-0.571z"/>', '-4 -4 24 24');
                    } else {
                        this.windowBarButton = false;
                        buttonsActive[3] = 0;
                    }
                }
                if (i == buttonsOrder[4]) {
                    if (buttonsOrder[4] && this.membersList) {
                        this.membersListButton = this.addToolbarIcon('Members List', '<path fill="currentColor" d="M6.5,17c0,0-1.5,0-1.5-1.5s1.5-6,7.5-6s7.5,4.5,7.5,6S18.5,17,18.5,17H6.5z M12.5,8C14.984,8,17,5.985,17,3.5S14.984-1,12.5-1S8,1.015,8,3.5S10.016,8,12.5,8z"/><path fill="currentColor" d="M3.824,17C3.602,16.531,3.49,16.019,3.5,15.5c0-2.033,1.021-4.125,2.904-5.58C5.464,9.631,4.483,9.488,3.5,9.5c-6,0-7.5,4.5-7.5,6S-2.5,17-2.5,17H3.824z"/><path fill="currentColor" d="M2.75,8C4.821,8,6.5,6.321,6.5,4.25S4.821,0.5,2.75,0.5S-1,2.179-1,4.25S0.679,8,2.75,8z"/>', '-4 -4 24 24');
                    } else {
                        this.membersListButton = false;
                        buttonsActive[4] = 0;
                    }
                }
                if (i == buttonsOrder[5]) {
                    if (buttonsOrder[5] && this.userArea) {
                        this.userAreaButton = this.addToolbarIcon('User Area', '<path fill="currentColor" d="M-2.5,4.25c-0.829,0-1.5,0.672-1.5,1.5v4.5c0,0.829,0.671,1.5,1.5,1.5h21c0.83,0,1.5-0.671,1.5-1.5v-4.5 c0-0.828-0.67-1.5-1.5-1.5H-2.5z M14.75,5.75c0.415,0,0.75,0.335,0.75,0.75s-0.335,0.75-0.75,0.75S14,6.915,14,6.5 S14.335,5.75,14.75,5.75z M17.75,5.75c0.415,0,0.75,0.335,0.75,0.75s-0.335,0.75-0.75,0.75S17,6.915,17,6.5S17.335,5.75,17.75,5.75z M-2.5,6.5c0-0.415,0.335-0.75,0.75-0.75h7.5c0.415,0,0.75,0.335,0.75,0.75S6.165,7.25,5.75,7.25h-7.5 C-2.165,7.25-2.5,6.915-2.5,6.5z M-2.125,8.75h8.25C6.333,8.75,6.5,8.917,6.5,9.125S6.333,9.5,6.125,9.5h-8.25 C-2.333,9.5-2.5,9.333-2.5,9.125S-2.333,8.75-2.125,8.75z"/>', '-4 -4 24 24');
                    } else {
                        this.userAreaButton = false;
                        buttonsActive[5] = 0;
                    }
                }
                if (i == buttonsOrder[6]) {
                    if (buttonsOrder[6] && document.querySelector('.' + cui.classConnectionArea)) {
                        this.callContainerButton = this.addToolbarIcon('Call Container', '<path fill="currentColor" d="M2.567-0.34c-0.287-0.37-0.82-0.436-1.189-0.149c-0.028,0.021-0.055,0.045-0.079,0.07L0.006,0.875C-0.597,1.48-0.82,2.336-0.556,3.087c1.095,3.11,2.875,5.933,5.21,8.259c2.328,2.336,5.15,4.116,8.26,5.21c0.752,0.264,1.606,0.042,2.212-0.562l1.292-1.294c0.332-0.329,0.332-0.866,0.002-1.196c-0.024-0.026-0.052-0.049-0.08-0.07l-2.884-2.244c-0.205-0.158-0.474-0.215-0.725-0.151l-2.737,0.684c-0.744,0.186-1.53-0.032-2.071-0.573l-3.07-3.072C4.311,7.536,4.092,6.75,4.278,6.007l0.685-2.738C5.026,3.017,4.97,2.75,4.81,2.543L2.567-0.34z M0.354-1.361c0.852-0.852,2.234-0.852,3.085,0C3.504-1.297,3.564-1.229,3.62-1.158l2.242,2.883c0.412,0.529,0.557,1.218,0.394,1.868L5.573,6.33C5.501,6.618,5.585,6.923,5.795,7.134l3.071,3.071c0.21,0.21,0.516,0.295,0.806,0.222l2.734-0.684c0.651-0.161,1.34-0.017,1.868,0.395l2.883,2.242c1.035,0.806,1.131,2.338,0.204,3.264l-1.293,1.292c-0.925,0.925-2.307,1.332-3.596,0.879c-3.299-1.162-6.293-3.05-8.763-5.525C1.234,9.82-0.654,6.826-1.815,3.527C-2.267,2.24-1.861,0.856-0.936-0.069l1.292-1.292H0.354z"/>', '-4 -4 24 24');
                    } else {
                        this.callContainerButton = false;
                        buttonsActive[6] = 0;
                    }
                }
            }

            // Collapse toolbar buttons
            if (!disableToolbarCollapse) {
                if (cui.serverListButton) {
                    cui.serverListButton.style.maxWidth = '0px';
                    cui.serverListButton.style.margin = '0';
                    cui.serverListButton.style.padding = '0';
                }
                if (cui.channelListButton) {
                    cui.channelListButton.style.maxWidth = '0px';
                    cui.channelListButton.style.margin = '0';
                    cui.channelListButton.style.padding = '0';
                }
                if (cui.msgBarButton) {
                    cui.msgBarButton.style.maxWidth = '0px';
                    cui.msgBarButton.style.margin = '0';
                    cui.msgBarButton.style.padding = '0';
                }
                if (cui.windowBarButton) {
                    cui.windowBarButton.style.maxWidth = '0px';
                    cui.windowBarButton.style.margin = '0';
                    cui.windowBarButton.style.padding = '0';
                }
                if (cui.membersListButton) {
                    cui.membersListButton.style.maxWidth = '0px';
                    cui.membersListButton.style.margin = '0';
                    cui.membersListButton.style.padding = '0';
                }
                if (cui.userAreaButton) {
                    cui.userAreaButton.style.maxWidth = '0px';
                    cui.userAreaButton.style.margin = '0';
                    cui.userAreaButton.style.padding = '0';
                }
                if (cui.callContainerButton) {
                    cui.callContainerButton.style.maxWidth = '0px';
                    cui.callContainerButton.style.margin = '0';
                    cui.callContainerButton.style.padding = '0';
                }

                if (cui.membersListButton && (buttonsActive[4] == Math.max.apply(Math, buttonsActive))) {
                    cui.membersListButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                    cui.membersListButton.style.removeProperty('margin');
                    cui.membersListButton.style.removeProperty('padding');
                } else if (cui.windowBarButton && (buttonsActive[3] == Math.max.apply(Math, buttonsActive))) {
                    cui.windowBarButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                    cui.windowBarButton.style.removeProperty('margin');
                    cui.windowBarButton.style.removeProperty('padding');
                } else if (cui.msgBarButton && (buttonsActive[2] == Math.max.apply(Math, buttonsActive))) {
                    cui.msgBarButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                    cui.msgBarButton.style.removeProperty('margin');
                    cui.msgBarButton.style.removeProperty('padding');
                } else if (cui.channelListButton && (buttonsActive[1] == Math.max.apply(Math, buttonsActive))) {
                    cui.channelListButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                    cui.channelListButton.style.removeProperty('margin');
                    cui.channelListButton.style.removeProperty('padding');
                } else if (cui.serverListButton && (buttonsActive[0] == Math.max.apply(Math, buttonsActive))) {
                    cui.serverListButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                    cui.serverListButton.style.removeProperty('margin');
                    cui.serverListButton.style.removeProperty('padding');
                } else if (cui.userAreaButton && (buttonsActive[5] == Math.max.apply(Math, buttonsActive))) {
                    cui.userAreaButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                    cui.userAreaButton.style.removeProperty('margin');
                    cui.userAreaButton.style.removeProperty('padding');
                } else if (cui.callContainerButton && (buttonsActive[6] == Math.max.apply(Math, buttonsActive))) {
                    cui.callContainerButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                    cui.callContainerButton.style.removeProperty('margin');
                    cui.callContainerButton.style.removeProperty('padding');
                } else {
                    document.querySelectorAll('.collapsible-ui-element').forEach(e => e.style.display = 'none');
                }
            }

            // Collapse settings buttons
            if (!disableSettingsCollapse) {
                // Define settings buttons array
                var settingsButtons = this.settingsContainer.children;

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
                if (this.windowBar) {
                    this.windowBar.style.overflow = 'hidden';
                    this.windowBar.style.height = windowBarHeight + 'px';
                }
                if (this.membersList) {
                    this.membersList.style.overflow = 'hidden';
                    this.membersList.style.maxWidth = membersListMaxWidth + 'px';
                    this.membersList.style.minHeight = '100%';
                }

                if (this.msgBar) {
                    this.msgBar.style.maxHeight = msgBarMaxHeight + 'px';
                }
            }

            // Read stored user data to decide active state of Server List button
            if (cui.serverListButton) {
                if (BdApi.getData('CollapsibleUI', 'cui.serverListButtonActive') === 'false') {
                    cui.serverListButton.classList.remove(this.classSelected);
                    if (disableTransitions) {
                        this.serverList.style.display = 'none';
                    } else {
                        this.serverList.style.width = '0px';
                    }
                } else if (BdApi.getData('CollapsibleUI', 'cui.serverListButtonActive') === 'true') {
                    cui.serverListButton.classList.add(this.classSelected);
                } else {
                    BdApi.setData('CollapsibleUI', 'cui.serverListButtonActive', 'true');
                    cui.serverListButton.classList.add(this.classSelected);
                }
            }

            // Read stored user data to decide active state of Channel List button
            if (cui.channelListButton) {
                if (BdApi.getData('CollapsibleUI', 'cui.channelListButtonActive') === 'false') {
                    cui.channelListButton.classList.remove(this.classSelected);
                    if (disableTransitions) {
                        this.channelList.style.display = 'none';
                    } else {
                        this.channelList.style.width = '0px';
                    }
                } else if (BdApi.getData('CollapsibleUI', 'cui.channelListButtonActive') === 'true') {
                    cui.channelListButton.classList.add(this.classSelected);
                } else {
                    BdApi.setData('CollapsibleUI', 'cui.channelListButtonActive', 'true');
                    cui.channelListButton.classList.add(this.classSelected);
                }
            }

            // Read stored user data to decide active state of Message Bar button
            if (cui.msgBarButton) {
                if (BdApi.getData('CollapsibleUI', 'cui.msgBarButtonActive') === 'false') {
                    cui.msgBarButton.classList.remove(this.classSelected);
                    if (disableTransitions) {
                        this.msgBar.style.display = 'none';
                    } else {
                        this.msgBar.style.maxHeight = '0px';
                    }
                } else if (BdApi.getData('CollapsibleUI', 'cui.msgBarButtonActive') === 'true') {
                    cui.msgBarButton.classList.add(this.classSelected);
                } else {
                    BdApi.setData('CollapsibleUI', 'cui.msgBarButtonActive', 'true');
                    cui.msgBarButton.classList.add(this.classSelected);
                }
            }

            // Read stored user data to decide active state of Window Bar button
            if (cui.windowBarButton) {
                if (BdApi.getData('CollapsibleUI', 'cui.windowBarButtonActive') === 'false') {
                    cui.windowBarButton.classList.remove(this.classSelected);
                    if (disableTransitions) {
                        this.windowBar.style.display = 'none';
                    } else {
                        this.windowBar.style.height = '0px';
                        this.windowBar.style.padding = '0';
                        this.windowBar.style.margin = '0';
                        this.wordMark.style.display = 'none';
                    }
                } else if (BdApi.getData('CollapsibleUI', 'cui.windowBarButtonActive') === 'true') {
                    cui.windowBarButton.classList.add(this.classSelected);
                } else {
                    BdApi.setData('CollapsibleUI', 'cui.windowBarButtonActive', 'true');
                    cui.windowBarButton.classList.add(this.classSelected);
                }
            }

            // Read stored user data to decide active state of Members List button
            if (cui.membersListButton) {
                if (BdApi.getData('CollapsibleUI', 'cui.membersListButtonActive') === 'false') {
                    cui.membersListButton.classList.remove(this.classSelected);
                    if (disableTransitions) {
                        this.membersList.style.display = 'none';
                    } else {
                        this.membersList.style.maxWidth = '0px';
                        this.membersList.style.minWidth = '0px';
                    }
                } else if (BdApi.getData('CollapsibleUI', 'cui.membersListButtonActive') === 'true') {
                    cui.membersListButton.classList.add(this.classSelected);
                } else {
                    BdApi.setData('CollapsibleUI', 'cui.membersListButtonActive', 'true');
                    cui.membersListButton.classList.add(this.classSelected);
                }
            }

            // Read stored user data to decide active state of User Area button
            if (cui.userAreaButton) {
                if (BdApi.getData('CollapsibleUI', 'cui.userAreaButtonActive') === 'false') {
                    cui.userAreaButton.classList.remove(this.classSelected);
                    if (disableTransitions) {
                        this.userArea.style.display = 'none';
                    } else {
                        this.userArea.style.maxHeight = '0px';
                    }
                } else if (BdApi.getData('CollapsibleUI', 'cui.userAreaButtonActive') === 'true') {
                    cui.userAreaButton.classList.add(this.classSelected);
                } else {
                    BdApi.setData('CollapsibleUI', 'cui.userAreaButtonActive', 'true');
                    cui.userAreaButton.classList.add(this.classSelected);
                }
            }

            // Read stored user data to decide active state of Call Container button
            if (cui.callContainerButton) {
                if (BdApi.getData('CollapsibleUI', 'cui.callContainerButtonActive') === 'false') {
                    cui.callContainerButton.classList.remove(this.classSelected);
                    if (document.querySelector('.' + this.classCallContainer)) {
                        if (disableTransitions) {
                            document.querySelector('.' + this.classCallContainer).style.display = 'none';
                        } else {
                            document.querySelector('.' + this.classCallContainer).style.height = '0px';
                        }
                    }
                } else if (BdApi.getData('CollapsibleUI', 'cui.callContainerButtonActive') === 'true') {
                    cui.callContainerButton.classList.add(this.classSelected);
                } else {
                    BdApi.setData('CollapsibleUI', 'cui.callContainerButtonActive', 'true');
                    cui.callContainerButton.classList.add(this.classSelected);
                }
            }

            // Apply transitions to UI elements
            if (!disableTransitions) {
                this.channelList.style.transition = 'width ' + transitionSpeed + 'ms';
                if (resizableChannelList) {
                    this.channelList.style.resize = 'horizontal';
                    this.channelList.addEventListener('mouseenter', function (){
                        this.style.transition = 'none';
                    }, {signal: cui.eventListenerSignal});
                    this.channelList.addEventListener('mouseleave', function (){
                        this.style.transition = 'width ' + transitionSpeed + 'ms';
                    }, {signal: cui.eventListenerSignal});
                }

                this.serverList.style.transition = 'width ' + transitionSpeed + 'ms';
                if (this.windowBar) {
                    this.windowBar.style.transition = 'height ' + transitionSpeed + 'ms';
                }
                if (this.membersList) {
                    this.membersList.style.transition = 'max-width ' + transitionSpeed + 'ms, min-width ' + transitionSpeed + 'ms';
                }

                if (this.msgBar) {
                    this.msgBar.style.transition = 'max-height ' + transitionSpeed + 'ms';
                }

                if (this.userArea) {
                    this.userArea.style.transition = 'max-height ' + transitionSpeed + 'ms';
                }
                if (document.querySelector('.' + this.classCallContainer)) {
                    document.querySelector('.' + this.classCallContainer).style.transition = 'height ' + transitionSpeed + 'ms';
                }
            }

            // Add call checking event
            setInterval(function() {
                if ((cui.callContainerExists && !(document.querySelector('.' + cui.classCallContainer))) || (document.querySelector('.' + cui.classCallContainer) && !(cui.callContainerExists)))
                    cui.initialize();
            }, 250);

            // Implement dynamic uncollapse feature
            if (dynamicUncollapse && !disableTransitions) {
                // Add event listener to document body to track cursor location & check if it is near collapsed elements
                document.body.addEventListener('mousemove', function(event){
                    cui.mouseX = event.pageX;
                    cui.mouseY = event.pageY;

                    // Server List
                    if ((BdApi.getData('CollapsibleUI', 'cui.serverListButtonActive') === 'false') && cui.serverListButton) {
                        if (cui.isCollapsed[0] && cui.isNear(cui.serverList, dynamicUncollapseDistance, cui.mouseX, cui.mouseY) && cui.isCollapsed[2]) {
                            cui.serverList.style.removeProperty('width');
                            cui.isCollapsed[0] = false;
                        }
                        if (!(cui.isCollapsed[0]) && !(cui.isNear(cui.serverList, dynamicUncollapseDistance, cui.mouseX, cui.mouseY))) {
                            cui.serverList.style.width = '0px';
                            cui.isCollapsed[0] = true;
                        }
                    }

                    // Channel List
                    if ((BdApi.getData('CollapsibleUI', 'cui.channelListButtonActive') === 'false') && cui.channelListButton) {
                        if (cui.isCollapsed[1] && cui.isNear(cui.channelList, dynamicUncollapseDistance, cui.mouseX, cui.mouseY) && cui.isCollapsed[2]) {
                            cui.channelList.style.removeProperty('width');
                            cui.isCollapsed[1] = false;
                        }
                        if (!(cui.isCollapsed[1]) && !(cui.isNear(cui.channelList, dynamicUncollapseDistance, cui.mouseX, cui.mouseY))) {
                            cui.channelList.style.width = '0px';
                            cui.isCollapsed[1] = true;
                        }
                    }

                    // Message Bar
                    if ((BdApi.getData('CollapsibleUI', 'cui.msgBarButtonActive') === 'false') && cui.msgBarButton) {
                        if (cui.isCollapsed[2] && cui.isNear(cui.msgBar, dynamicUncollapseDistance, cui.mouseX, cui.mouseY)) {
                            cui.msgBar.style.maxHeight = msgBarMaxHeight + 'px';
                            cui.isCollapsed[2] = false;
                        }
                        if (!(cui.isCollapsed[2]) && !(cui.isNear(cui.msgBar, dynamicUncollapseDistance, cui.mouseX, cui.mouseY))) {
                            cui.msgBar.style.maxHeight = '0px';
                            cui.isCollapsed[2] = true;
                        }
                    }

                    // Window Bar
                    if ((BdApi.getData('CollapsibleUI', 'cui.windowBarButtonActive') === 'false') && cui.windowBarButton) {
                        if (cui.isCollapsed[3] && cui.isNear(cui.windowBar, dynamicUncollapseDistance, cui.mouseX, cui.mouseY)) {
                            cui.windowBar.style.height = windowBarHeight + 'px';
                            cui.windowBar.style.removeProperty('padding');
                            cui.windowBar.style.removeProperty('margin');
                            cui.wordMark.style.removeProperty('display');
                            cui.isCollapsed[3] = false;
                        }
                        if (!(cui.isCollapsed[3]) && !(cui.isNear(cui.windowBar, dynamicUncollapseDistance, cui.mouseX, cui.mouseY))) {
                            cui.windowBar.style.height = '0px';
                            cui.windowBar.style.padding = '0';
                            cui.windowBar.style.margin = '0';
                            cui.wordMark.style.display = 'none';
                            cui.isCollapsed[3] = true;
                        }
                    }

                    // Members List
                    if ((BdApi.getData('CollapsibleUI', 'cui.membersListButtonActive') === 'false') && cui.membersListButton) {
                        if (cui.isCollapsed[4] && cui.isNear(cui.membersList, dynamicUncollapseDistance, cui.mouseX, cui.mouseY) && cui.isCollapsed[2]) {
                            cui.membersList.style.maxWidth = membersListMaxWidth + 'px';
                            cui.membersList.style.removeProperty('min-width');
                            cui.isCollapsed[4] = false;
                        }
                        if (!(cui.isCollapsed[4]) && !(cui.isNear(cui.membersList, dynamicUncollapseDistance, cui.mouseX, cui.mouseY))) {
                            cui.membersList.style.maxWidth = '0px';
                            cui.membersList.style.minWidth = '0px';
                            cui.isCollapsed[4] = true;
                        }
                    }

                    // User Area
                    if ((BdApi.getData('CollapsibleUI', 'cui.userAreaButtonActive') === 'false') && cui.userAreaButton) {
                        if (cui.isCollapsed[5] && cui.isNear(cui.userArea, dynamicUncollapseDistance, cui.mouseX, cui.mouseY)) {
                            cui.userArea.style.maxHeight = userAreaMaxHeight + 'px';
                            cui.isCollapsed[5] = false;
                        }
                        if (!(cui.isCollapsed[5]) && !(cui.isNear(cui.userArea, dynamicUncollapseDistance, cui.mouseX, cui.mouseY))) {
                            cui.userArea.style.maxHeight = '0px';
                            cui.isCollapsed[5] = true;
                        }
                    }

                    // Call Container
                    if ((BdApi.getData('CollapsibleUI', 'cui.callContainerButtonActive') === 'false') && document.querySelector('.' + cui.classCallContainer)) {
                        if (cui.isCollapsed[6] && cui.isNear(document.querySelector('.' + cui.classCallContainer), dynamicUncollapseDistance, cui.mouseX, cui.mouseY)) {
                            document.querySelector('.' + cui.classCallContainer).style.removeProperty('height');
                            cui.isCollapsed[6] = false;
                        }
                        if (!(cui.isCollapsed[6]) && !(cui.isNear(document.querySelector('.' + cui.classCallContainer), dynamicUncollapseDistance, cui.mouseX, cui.mouseY))) {
                            document.querySelector('.' + cui.classCallContainer).style.height = '0px';
                            cui.isCollapsed[6] = true;
                        }
                    }
                }, {signal: cui.eventListenerSignal});
                document.body.addEventListener('mouseleave', function(){
                    // Server List
                    if ((BdApi.getData('CollapsibleUI', 'cui.serverListButtonActive') === 'false') && cui.serverListButton) {
                        cui.serverList.style.width = '0px';
                        cui.isCollapsed[0] = true;
                    }

                    // Channel List
                    if ((BdApi.getData('CollapsibleUI', 'cui.channelListButtonActive') === 'false') && cui.channelListButton) {
                        cui.channelList.style.width = '0px';
                        cui.isCollapsed[1] = true;
                    }

                    // Message Bar
                    if ((BdApi.getData('CollapsibleUI', 'cui.msgBarButtonActive') === 'false') && cui.msgBarButton) {
                        cui.msgBar.style.maxHeight = '0px';
                        cui.isCollapsed[2] = true;
                    }

                    // Window Bar
                    if ((BdApi.getData('CollapsibleUI', 'cui.windowBarButtonActive') === 'false') && cui.windowBarButton && (cui.mouseY > windowBarHeight + dynamicUncollapseDistance)) {
                        cui.windowBar.style.height = '0px';
                        cui.windowBar.style.padding = '0';
                        cui.windowBar.style.margin = '0';
                        cui.wordMark.style.display = 'none';
                        cui.isCollapsed[3] = true;
                    }

                    // Members List
                    if ((BdApi.getData('CollapsibleUI', 'cui.membersListButtonActive') === 'false') && cui.membersListButton) {
                        cui.membersList.style.maxWidth = '0px';
                        cui.membersList.style.minWidth = '0px';
                        cui.isCollapsed[4] = true;
                    }

                    // User Area
                    if ((BdApi.getData('CollapsibleUI', 'cui.userAreaButtonActive') === 'false') && cui.userAreaButton) {
                        cui.userArea.style.maxHeight = '0px';
                        cui.isCollapsed[5] = true;
                    }

                    // Call Container
                    if ((BdApi.getData('CollapsibleUI', 'cui.callContainerButtonActive') === 'false') && document.querySelector('.' + cui.classCallContainer)) {
                        document.querySelector('.' + cui.classCallContainer).style.height = '0px';
                        cui.isCollapsed[6] = true;
                    }
                }, {signal: cui.eventListenerSignal});
            }

            // Add event listeners to the Toolbar Container to update on hover
            if (!disableToolbarCollapse) {
                toolbarContainer.addEventListener('mouseenter', function(){
                    if (cui.serverListButton) {
                        cui.serverListButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        cui.serverListButton.style.removeProperty('margin');
                        cui.serverListButton.style.removeProperty('padding');
                    }
                    if (cui.channelListButton) {
                        cui.channelListButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        cui.channelListButton.style.removeProperty('margin');
                        cui.channelListButton.style.removeProperty('padding');
                    }
                    if (cui.msgBarButton) {
                        cui.msgBarButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        cui.msgBarButton.style.removeProperty('margin');
                        cui.msgBarButton.style.removeProperty('padding');
                    }
                    if (cui.windowBarButton) {
                        cui.windowBarButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        cui.windowBarButton.style.removeProperty('margin');
                        cui.windowBarButton.style.removeProperty('padding');
                    }
                    if (cui.membersListButton) {
                        cui.membersListButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        cui.membersListButton.style.removeProperty('margin');
                        cui.membersListButton.style.removeProperty('padding');
                    }
                    if (cui.userAreaButton) {
                        cui.userAreaButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        cui.userAreaButton.style.removeProperty('margin');
                        cui.userAreaButton.style.removeProperty('padding');
                    }
                    if (cui.callContainerButton) {
                        cui.callContainerButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        cui.callContainerButton.style.removeProperty('margin');
                        cui.callContainerButton.style.removeProperty('padding');
                    }
                }, {signal: cui.eventListenerSignal});
                toolbarContainer.addEventListener('mouseleave', function(){
                    if (cui.serverListButton) {
                        cui.serverListButton.style.maxWidth = '0px';
                        cui.serverListButton.style.margin = '0';
                        cui.serverListButton.style.padding = '0';
                    }
                    if (cui.channelListButton) {
                        cui.channelListButton.style.maxWidth = '0px';
                        cui.channelListButton.style.margin = '0';
                        cui.channelListButton.style.padding = '0';
                    }
                    if (cui.msgBarButton) {
                        cui.msgBarButton.style.maxWidth = '0px';
                        cui.msgBarButton.style.margin = '0';
                        cui.msgBarButton.style.padding = '0';
                    }
                    if (cui.windowBarButton) {
                        cui.windowBarButton.style.maxWidth = '0px';
                        cui.windowBarButton.style.margin = '0';
                        cui.windowBarButton.style.padding = '0';
                    }
                    if (cui.membersListButton) {
                        cui.membersListButton.style.maxWidth = '0px';
                        cui.membersListButton.style.margin = '0';
                        cui.membersListButton.style.padding = '0';
                    }
                    if (cui.userAreaButton) {
                        cui.userAreaButton.style.maxWidth = '0px';
                        cui.userAreaButton.style.margin = '0';
                        cui.userAreaButton.style.padding = '0';
                    }
                    if (cui.callContainerButton) {
                        cui.callContainerButton.style.maxWidth = '0px';
                        cui.callContainerButton.style.margin = '0';
                        cui.callContainerButton.style.padding = '0';
                    }

                    if (cui.membersListButton && (buttonsActive[4] == Math.max.apply(Math, buttonsActive))) {
                        cui.membersListButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        cui.membersListButton.style.removeProperty('margin');
                        cui.membersListButton.style.removeProperty('padding');
                    } else if (cui.windowBarButton && (buttonsActive[3] == Math.max.apply(Math, buttonsActive))) {
                        cui.windowBarButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        cui.windowBarButton.style.removeProperty('margin');
                        cui.windowBarButton.style.removeProperty('padding');
                    } else if (cui.msgBarButton && (buttonsActive[2] == Math.max.apply(Math, buttonsActive))) {
                        cui.msgBarButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        cui.msgBarButton.style.removeProperty('margin');
                        cui.msgBarButton.style.removeProperty('padding');
                    } else if (cui.channelListButton && (buttonsActive[1] == Math.max.apply(Math, buttonsActive))) {
                        cui.channelListButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        cui.channelListButton.style.removeProperty('margin');
                        cui.channelListButton.style.removeProperty('padding');
                    } else if (cui.serverListButton && (buttonsActive[0] == Math.max.apply(Math, buttonsActive))) {
                        cui.serverListButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        cui.serverListButton.style.removeProperty('margin');
                        cui.serverListButton.style.removeProperty('padding');
                    } else if (cui.userAreaButton && (buttonsActive[5] == Math.max.apply(Math, buttonsActive))) {
                        cui.userAreaButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        cui.userAreaButton.style.removeProperty('margin');
                        cui.userAreaButton.style.removeProperty('padding');
                    } else if (cui.callContainerButton && (buttonsActive[6] == Math.max.apply(Math, buttonsActive))) {
                        cui.callContainerButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                        cui.callContainerButton.style.removeProperty('margin');
                        cui.callContainerButton.style.removeProperty('padding');
                    } else {
                        document.querySelectorAll('.collapsible-ui-element').forEach(e => e.style.display = 'none');
                    }
                }, {signal: cui.eventListenerSignal});
            }

            // Add event listeners to the Settings Container to update on hover
            if (!disableSettingsCollapse) {
                this.settingsContainer.addEventListener('mouseenter', function(){
                    for (let i = 0; i < (settingsButtons.length - 1); i++) {
                        settingsButtons[i].style.maxWidth = settingsButtonsMaxWidth + 'px';
                    }
                }, {signal: cui.eventListenerSignal});
                this.settingsContainer.addEventListener('mouseleave', function(){
                    for (let i = 0; i < (settingsButtons.length - 1); i++) {
                        settingsButtons[i].style.maxWidth = '0px';
                    }
                }, {signal: cui.eventListenerSignal});
            }

            // Add event listener to the Server List button to update the icon, UI, & settings on click
            if (cui.serverListButton) {
                cui.serverListButton.addEventListener('click', function(){
                    if (BdApi.getData('CollapsibleUI', 'cui.serverListButtonActive') === 'true') {
                        if (disableTransitions) {
                            cui.serverList.style.display = 'none';
                        } else {
                            cui.serverList.style.width = '0px';
                        }
                        BdApi.setData('CollapsibleUI', 'cui.serverListButtonActive', 'false');
                        this.classList.remove(cui.classSelected);
                    } else {
                        if (disableTransitions) {
                            cui.serverList.style.display = 'initial';
                        } else {
                            cui.serverList.style.removeProperty('width');
                        }
                        BdApi.setData('CollapsibleUI', 'cui.serverListButtonActive', 'true');
                        this.classList.add(cui.classSelected);
                    }
                }, {signal: cui.eventListenerSignal});

                cui.serverListButton.addEventListener('mouseenter', function(){
                    this.tooltip = cui.createTooltip(this.getAttribute('aria-label'), this);
                }, {signal: cui.eventListenerSignal});

                cui.serverListButton.addEventListener('mouseleave', function(){
                    this.tooltip.remove();
                }, {signal: cui.eventListenerSignal});
            }

            // Add event listener to the Channel List button to update the icon, UI, & settings on click
            if (cui.channelListButton) {
                cui.channelListButton.addEventListener('click', function(){
                    if (BdApi.getData('CollapsibleUI', 'cui.channelListButtonActive') === 'true') {
                        if (disableTransitions) {
                            cui.channelList.style.display = 'none';
                        } else {
                            cui.channelList.style.width = '0px';
                        }
                        BdApi.setData('CollapsibleUI', 'cui.channelListButtonActive', 'false');
                        this.classList.remove(cui.classSelected);
                    } else {
                        if (disableTransitions) {
                            cui.channelList.style.display = 'initial';
                        } else {
                            cui.channelList.style.removeProperty('width');
                        }
                        BdApi.setData('CollapsibleUI', 'cui.channelListButtonActive', 'true');
                        this.classList.add(cui.classSelected);
                    }
                }, {signal: cui.eventListenerSignal});

                cui.channelListButton.addEventListener('mouseenter', function(){
                    this.tooltip = cui.createTooltip(this.getAttribute('aria-label'), this);
                }, {signal: cui.eventListenerSignal});

                cui.channelListButton.addEventListener('mouseleave', function(){
                    this.tooltip.remove();
                }, {signal: cui.eventListenerSignal});
            }

            // Add event listener to the Message Bar button to update the icon, UI, & settings on click
            if (cui.msgBarButton) {
                cui.msgBarButton.addEventListener('click', function(){
                    if (BdApi.getData('CollapsibleUI', 'cui.msgBarButtonActive') === 'true') {
                        if (disableTransitions) {
                            cui.msgBar.style.display = 'none';
                        } else {
                            cui.msgBar.style.maxHeight = '0px';
                        }
                        BdApi.setData('CollapsibleUI', 'cui.msgBarButtonActive', 'false');
                        this.classList.remove(cui.classSelected);
                    } else {
                        if (disableTransitions) {
                            cui.msgBar.style.display = 'initial';
                        } else {
                            cui.msgBar.style.maxHeight = msgBarMaxHeight + 'px';
                        }
                        BdApi.setData('CollapsibleUI', 'cui.msgBarButtonActive', 'true');
                        this.classList.add(cui.classSelected);
                    }
                }, {signal: cui.eventListenerSignal});

                cui.msgBarButton.addEventListener('mouseenter', function(){
                    this.tooltip = cui.createTooltip(this.getAttribute('aria-label'), this);
                }, {signal: cui.eventListenerSignal});

                cui.msgBarButton.addEventListener('mouseleave', function(){
                    this.tooltip.remove();
                }, {signal: cui.eventListenerSignal});
            }

            // Add event listener to the Window Bar button to update the icon, UI, & settings on click
            if (cui.windowBarButton) {
                cui.windowBarButton.addEventListener('click', function(){
                    if (BdApi.getData('CollapsibleUI', 'cui.windowBarButtonActive') === 'true') {
                        if (disableTransitions) {
                            cui.windowBar.style.display = 'none';
                        } else {
                            cui.windowBar.style.height = '0px';
                            cui.windowBar.style.padding = '0';
                            cui.windowBar.style.margin = '0';
                            cui.wordMark.style.display = 'none';
                        }
                        BdApi.setData('CollapsibleUI', 'cui.windowBarButtonActive', 'false');
                        this.classList.remove(cui.classSelected);
                    } else {
                        if (disableTransitions) {
                            cui.windowBar.style.display = 'flex';
                        } else {
                            cui.windowBar.style.height = windowBarHeight + 'px';
                            cui.windowBar.style.removeProperty('padding');
                            cui.windowBar.style.removeProperty('margin');
                            cui.wordMark.style.removeProperty('display');
                        }
                        BdApi.setData('CollapsibleUI', 'cui.windowBarButtonActive', 'true');
                        this.classList.add(cui.classSelected);
                    }
                }, {signal: cui.eventListenerSignal});

                cui.windowBarButton.addEventListener('mouseenter', function(){
                    this.tooltip = cui.createTooltip(this.getAttribute('aria-label'), this);
                }, {signal: cui.eventListenerSignal});

                cui.windowBarButton.addEventListener('mouseleave', function(){
                    this.tooltip.remove();
                }, {signal: cui.eventListenerSignal});
            }

            // Add event listener to the Members List button to update the icon, UI, & settings on click
            if (cui.membersListButton) {
                cui.membersListButton.addEventListener('click', function(){
                    if (BdApi.getData('CollapsibleUI', 'cui.membersListButtonActive') === 'true') {
                        if (disableTransitions) {
                            cui.membersList.style.display = 'none';
                        } else {
                            cui.membersList.style.maxWidth = '0px';
                            cui.membersList.style.minWidth = '0px';
                        }
                        BdApi.setData('CollapsibleUI', 'cui.membersListButtonActive', 'false');
                        this.classList.remove(cui.classSelected);
                    } else {
                        if (disableTransitions) {
                            cui.membersList.style.removeProperty('display');
                        } else {
                            cui.membersList.style.maxWidth = membersListMaxWidth + 'px';
                            cui.membersList.style.removeProperty('min-width');
                        }
                        BdApi.setData('CollapsibleUI', 'cui.membersListButtonActive', 'true');
                        this.classList.add(cui.classSelected);
                    }
                }, {signal: cui.eventListenerSignal});

                cui.membersListButton.addEventListener('mouseenter', function(){
                    this.tooltip = cui.createTooltip(this.getAttribute('aria-label'), this);
                }, {signal: cui.eventListenerSignal});

                cui.membersListButton.addEventListener('mouseleave', function(){
                    this.tooltip.remove();
                }, {signal: cui.eventListenerSignal});
            }

            // Add event listener to the User Area button to update the icon, UI, & settings on click
            if (cui.userAreaButton) {
                cui.userAreaButton.addEventListener('click', function(){
                    if (BdApi.getData('CollapsibleUI', 'cui.userAreaButtonActive') === 'true') {
                        if (disableTransitions) {
                            cui.userArea.style.display = 'none';
                        } else {
                            cui.userArea.style.maxHeight = '0px';
                        }
                        BdApi.setData('CollapsibleUI', 'cui.userAreaButtonActive', 'false');
                        this.classList.remove(cui.classSelected);
                    } else {
                        if (disableTransitions) {
                            cui.userArea.style.removeProperty('display');
                        } else {
                            cui.userArea.style.maxHeight = userAreaMaxHeight + 'px';
                        }
                        BdApi.setData('CollapsibleUI', 'cui.userAreaButtonActive', 'true');
                        this.classList.add(cui.classSelected);
                    }
                }, {signal: cui.eventListenerSignal});

                cui.userAreaButton.addEventListener('mouseenter', function(){
                    this.tooltip = cui.createTooltip(this.getAttribute('aria-label'), this);
                }, {signal: cui.eventListenerSignal});

                cui.userAreaButton.addEventListener('mouseleave', function(){
                    this.tooltip.remove();
                }, {signal: cui.eventListenerSignal});
            }

            // Add event listener to the Call Container button to update the icon, UI, & settings on click
            if (cui.callContainerButton) {
                cui.callContainerButton.addEventListener('click', function(){
                    if (BdApi.getData('CollapsibleUI', 'cui.callContainerButtonActive') === 'true') {
                        if (document.querySelector('.' + cui.classCallContainer)) {
                            if (disableTransitions) {
                                document.querySelector('.' + cui.classCallContainer).style.display = 'none';
                            } else {
                                document.querySelector('.' + cui.classCallContainer).style.height = '0px';
                            }
                        }
                        BdApi.setData('CollapsibleUI', 'cui.callContainerButtonActive', 'false');
                        this.classList.remove(cui.classSelected);
                    } else {
                        if (document.querySelector('.' + cui.classCallContainer)) {
                            if (disableTransitions) {
                                document.querySelector('.' + cui.classCallContainer).style.removeProperty('display');
                            } else {
                                document.querySelector('.' + cui.classCallContainer).style.removeProperty('height');
                            }
                        }
                        BdApi.setData('CollapsibleUI', 'cui.callContainerButtonActive', 'true');
                        this.classList.add(cui.classSelected);
                    }
                }, {signal: cui.eventListenerSignal});

                cui.callContainerButton.addEventListener('mouseenter', function(){
                    this.tooltip = cui.createTooltip(this.getAttribute('aria-label'), this);
                }, {signal: cui.eventListenerSignal});

                cui.callContainerButton.addEventListener('mouseleave', function(){
                    this.tooltip.remove();
                }, {signal: cui.eventListenerSignal});
            }

            // console.log('[CollapsibleUI] version 4.0.0 has started.');
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
                console.warn('[CollapsibleUI] Could not initialize toolbar\n  - ' + e);
            }
        }

        // Restore the default UI when the plugin is disabled
        stop() {

            // Remove CollapsibleUI icons
            document.querySelectorAll('.collapsible-ui-element').forEach(e => e.remove());

            // Re-enable the original Members List icon
            try {
                this.searchBar.previousElementSibling.style.removeProperty('display');
            } catch {
                console.warn('[CollapsibleUI] Failed to restore Members List button. Are you sure it exists?');
            }

            // Expand any collapsed elements & remove transitions
            this.channelList.style.removeProperty('width');
            this.channelList.style.removeProperty('transition');
            this.channelList.style.removeProperty('resize');
            this.channelList.style.removeProperty('display');
            this.serverList.style.removeProperty('width');
            this.serverList.style.removeProperty('transition');
            this.serverList.style.removeProperty('display');
            if (this.windowBar) {
                this.wordMark.style.removeProperty('display');
                this.windowBar.style.removeProperty('height');
                this.windowBar.style.removeProperty('padding');
                this.windowBar.style.removeProperty('margin');
                this.windowBar.style.removeProperty('overflow');
                this.windowBar.style.removeProperty('transition');
                this.windowBar.style.removeProperty('display');
            }
            if (this.membersList) {
                this.membersList.style.removeProperty('max-width');
                this.membersList.style.removeProperty('min-width');
                this.membersList.style.removeProperty('overflow');
                this.membersList.style.removeProperty('transition');
                this.membersList.style.removeProperty('display');
            }
            if (this.msgBar) {
                this.msgBar.style.removeProperty('max-height');
                this.msgBar.style.removeProperty('transition');
                this.msgBar.style.removeProperty('display');
            }
            if (this.settingsContainer) {
                for (let i = 0; i < (this.settingsContainer.children.length - 1); i++) {
                    this.settingsContainer.children[i].style.removeProperty('max-width');
                    this.settingsContainer.children[i].style.removeProperty('transition');
                    this.settingsContainer.children[i].style.removeProperty('overflow');
                    this.settingsContainer.children[i].style.removeProperty('display');
                }
            }
            if (this.userArea) {
                this.userArea.style.removeProperty('max-height');
                this.userArea.style.removeProperty('transition');
                this.userArea.style.removeProperty('display');
            }
            if (document.querySelector('.' + this.classCallContainer)) {
                document.querySelector('.' + this.classCallContainer).style.removeProperty('height');
                document.querySelector('.' + this.classCallContainer).style.removeProperty('transition');
                document.querySelector('.' + this.classCallContainer).style.removeProperty('display');
            }

            // Restore default ZeresPluginLibrary logger functionality
            BdApi.Plugins.get('ZeresPluginLibrary').exports.Logger.warn = this.zeresWarnOld;

            // Abort event listeners
            if (this.eventListenerController)
                this.eventListenerController.abort();


            // console.log('[CollapsibleUI] version 4.0.0 has stopped.');
        }

        // Re-initialize the plugin on channel/server switch to maintain icon availability
        onSwitch() {
            try {
                this.initialize();
            } catch(e) {
                console.warn('[CollapsibleUI] Could not initialize toolbar\n  - ' + e);
            }
        }

        // Add settings panel
        getSettingsPanel() {
            let zps = ZeresPluginLibrary.Settings;

            // Create root settings node
            var settingsRoot = new zps.SettingPanel();
            this.settingsHandle = settingsRoot.getElement();

            // Create Main subgroup
            var groupMain = new zps.SettingGroup('Main');

            // Create main settings
            var settingDisableTransitions = new zps.Switch('Disable UI Transitions',
                                                           'Disables all UI animations, but also disables Dynamic Uncollapse',
                                                           BdApi.getData('CollapsibleUI', 'disableTransitions') === 'true');
            var settingTransitionSpeed = new zps.Textbox('UI Transition Speed (ms)',
                                                         'Sets the speed of UI animations',
                                                         BdApi.getData('CollapsibleUI', 'transitionSpeed'),
                                                         null,
                                                         {placeholder: 'Default: 300'});
            var settingDisableToolbarCollapse = new zps.Switch('Disable Toolbar Auto-collapse',
                                                               'Disables the automatic collapsing of CollapsibleUI\'s toolbar icons',
                                                               BdApi.getData('CollapsibleUI', 'disableToolbarCollapse') === 'true');
            var settingDisableSettingsCollapse = new zps.Switch('Disable User Settings Auto-collapse',
                                                                'Disables the automatic collapsing of the mute/deafen and call buttons',
                                                                BdApi.getData('CollapsibleUI', 'disableSettingsCollapse') === 'true');
            var settingDynamicUncollapse = new zps.Switch('Dynamic Uncollapse',
                                                          'Makes collapsed UI elements expand when the mouse is near them. Does not work with transitions disabled',
                                                          BdApi.getData('CollapsibleUI', 'dynamicUncollapse') === 'true');
            var settingDynamicUncollapseDistance = new zps.Textbox('Dynamic Uncollapse Distance (px)',
                                                                   'Sets the distance that the mouse must be from a UI element in order for it to expand',
                                                                   BdApi.getData('CollapsibleUI', 'dynamicUncollapseDistance'),
                                                                   null,
                                                                   {placeholder: 'Default: 20'});
            var settingResizableChannelList = new zps.Switch('Resizable Channel List',
                                                          'Allows the channel list to be resized horizontally by clicking-and-dragging on its bottom-right corner',
                                                          BdApi.getData('CollapsibleUI', 'resizableChannelList') === 'true');

            // Append main settings to Main subgroup
            groupMain.append(settingDisableTransitions);
            groupMain.append(settingTransitionSpeed);
            groupMain.append(settingDisableToolbarCollapse);
            groupMain.append(settingDisableSettingsCollapse);
            groupMain.append(settingDynamicUncollapse);
            groupMain.append(settingDynamicUncollapseDistance);
            groupMain.append(settingResizableChannelList);

            // Create Button Customization subgroup
            var groupButtons = new zps.SettingGroup('Button Customization');

            // Create button settings
            var settingServerList = new zps.Slider('Server List',
                                                   '[Default = 1, Disabled = 0] - Sets order index of the Server List button (far left panel)',
                                                   0,
                                                   7,
                                                   BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',').map(Number)[0],
                                                   null,
                                                   {markers:[0,1,2,3,4,5,6,7], stickToMarkers: true, equidistant: true});
            var settingChannelList = new zps.Slider('Channel List',
                                                    '[Default = 2, Disabled = 0] - Sets order index of the Channel List button (big left panel)',
                                                    0,
                                                    7,
                                                    BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',').map(Number)[1],
                                                    null,
                                                    {markers:[0,1,2,3,4,5,6,7], stickToMarkers: true, equidistant: true});
            var settingUserArea = new zps.Slider('User Area',
                                                 '[Default = 3, Disabled = 0] - Sets order index of the User Area button (username/handle, call controls)',
                                                 0,
                                                 7,
                                                 BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',').map(Number)[5],
                                                 null,
                                                 {markers:[0,1,2,3,4,5,6,7], stickToMarkers: true, equidistant: true});
            var settingMsgBar = new zps.Slider('Message Bar',
                                               '[Default = 4, Disabled = 0] - Sets order index of the Message Bar button (typing area)',
                                               0,
                                               7,
                                               BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',').map(Number)[2],
                                               null,
                                               {markers:[0,1,2,3,4,5,6,7], stickToMarkers: true, equidistant: true});
            var settingCallContainer = new zps.Slider('Call Container',
                                                      '[Default = 5, Disabled = 0] - Sets order index of the Call Container button (video chat/call controls panel)',
                                                      0,
                                                      7,
                                                      BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',').map(Number)[6],
                                                      null,
                                                      {markers:[0,1,2,3,4,5,6,7], stickToMarkers: true, equidistant: true});
            var settingWindowBar = new zps.Slider('Window Bar',
                                                  '[Default = 6, Disabled = 0] - Sets order index of the Window bar button (maximize/minimize/close buttons)',
                                                  0,
                                                  7,
                                                  BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',').map(Number)[3],
                                                  null,
                                                  {markers:[0,1,2,3,4,5,6,7], stickToMarkers: true, equidistant: true});
            var settingMembersList = new zps.Slider('Members List',
                                                    '[Default = 7, Disabled = 0] - Sets order index of the Members List button (right panel)',
                                                    0,
                                                    7,
                                                    BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',').map(Number)[4],
                                                    null,
                                                    {markers:[0,1,2,3,4,5,6,7], stickToMarkers: true, equidistant: true});

            // Append button settings to Button Customization subgroup
            groupButtons.append(settingServerList);
            groupButtons.append(settingChannelList);
            groupButtons.append(settingUserArea);
            groupButtons.append(settingMsgBar);
            groupButtons.append(settingCallContainer);
            groupButtons.append(settingWindowBar);
            groupButtons.append(settingMembersList);

            // Create Advanced subgroup
            var groupAdvanced = new zps.SettingGroup('Advanced');

            // Create advanced settings
            var settingSettingsButtonsMaxWidth = new zps.Textbox('Settings Buttons - Max Width',
                                                                 null,
                                                                 BdApi.getData('CollapsibleUI', 'settingsButtonsMaxWidth'),
                                                                 null,
                                                                 {placeholder: 'Default: 100'});
            var settingToolbarIconMaxWidth = new zps.Textbox('Toolbar Icons - Max Width',
                                                             null,
                                                             BdApi.getData('CollapsibleUI', 'toolbarIconMaxWidth'),
                                                             null,
                                                             {placeholder: 'Default: 300'});
            var settingMembersListMaxWidth = new zps.Textbox('Members List - Max Width',
                                                             null,
                                                             BdApi.getData('CollapsibleUI', 'membersListMaxWidth'),
                                                             null,
                                                             {placeholder: 'Default: 240'});
            var settingUserAreaMaxHeight = new zps.Textbox('User Area - Max Height',
                                                           null,
                                                           BdApi.getData('CollapsibleUI', 'userAreaMaxHeight'),
                                                           null,
                                                           {placeholder: 'Default: 100'});
            var settingMsgBarMaxHeight = new zps.Textbox('Message Bar - Max Height',
                                                         null,
                                                         BdApi.getData('CollapsibleUI', 'msgBarMaxHeight'),
                                                         null,
                                                         {placeholder: 'Default: 400'});
            var settingWindowBarHeight = new zps.Textbox('Window Bar - Height',
                                                         null,
                                                         BdApi.getData('CollapsibleUI', 'windowBarHeight'),
                                                         null,
                                                         {placeholder: 'Default: 18'});

            // Append advanced settings to Advanced subgroup
            groupAdvanced.append(settingSettingsButtonsMaxWidth);
            groupAdvanced.append(settingToolbarIconMaxWidth);
            groupAdvanced.append(settingMembersListMaxWidth);
            groupAdvanced.append(settingUserAreaMaxHeight);
            groupAdvanced.append(settingMsgBarMaxHeight);
            groupAdvanced.append(settingWindowBarHeight);

            // Append subgroups to root node
            settingsRoot.append(groupMain);
            settingsRoot.append(groupButtons);
            settingsRoot.append(groupAdvanced);

            // Register main settings onChange events
            settingDisableTransitions.onChange = function(result) {
                if (result)
                    BdApi.setData('CollapsibleUI', 'disableTransitions', 'true');
                else
                    BdApi.setData('CollapsibleUI', 'disableTransitions', 'false');
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };
            settingTransitionSpeed.onChange = function(result) {
                BdApi.setData('CollapsibleUI', 'transitionSpeed', result);
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };
            settingDisableToolbarCollapse.onChange = function(result) {
                if (result)
                    BdApi.setData('CollapsibleUI', 'disableToolbarCollapse', 'true');
                else
                    BdApi.setData('CollapsibleUI', 'disableToolbarCollapse', 'false');
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };
            settingDisableSettingsCollapse.onChange = function(result) {
                if (result)
                    BdApi.setData('CollapsibleUI', 'disableSettingsCollapse', 'true');
                else
                    BdApi.setData('CollapsibleUI', 'disableSettingsCollapse', 'false');
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };
            settingDynamicUncollapse.onChange = function(result) {
                if (result)
                    BdApi.setData('CollapsibleUI', 'dynamicUncollapse', 'true');
                else
                    BdApi.setData('CollapsibleUI', 'dynamicUncollapse', 'false');
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };
            settingDynamicUncollapseDistance.onChange = function(result) {
                BdApi.setData('CollapsibleUI', 'dynamicUncollapseDistance', result);
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };
            settingResizableChannelList.onChange = function(result) {
                if (result)
                    BdApi.setData('CollapsibleUI', 'resizableChannelList', 'true');
                else
                    BdApi.setData('CollapsibleUI', 'resizableChannelList', 'false');
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };

            // Register button settings onChange events
            settingServerList.onChange = function(result) {
                var newButtonsOrder = BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',').map(Number);
                newButtonsOrder[0] = result;
                BdApi.setData('CollapsibleUI', 'buttonsOrder', newButtonsOrder.toString());
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };
            settingChannelList.onChange = function(result) {
                var newButtonsOrder = BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',').map(Number);
                newButtonsOrder[1] = result;
                BdApi.setData('CollapsibleUI', 'buttonsOrder', newButtonsOrder.toString());
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };
            settingUserArea.onChange = function(result) {
                var newButtonsOrder = BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',').map(Number);
                newButtonsOrder[5] = result;
                BdApi.setData('CollapsibleUI', 'buttonsOrder', newButtonsOrder.toString());
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };
            settingMsgBar.onChange = function(result) {
                var newButtonsOrder = BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',').map(Number);
                newButtonsOrder[2] = result;
                BdApi.setData('CollapsibleUI', 'buttonsOrder', newButtonsOrder.toString());
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };
            settingCallContainer.onChange = function(result) {
                var newButtonsOrder = BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',').map(Number);
                newButtonsOrder[6] = result;
                BdApi.setData('CollapsibleUI', 'buttonsOrder', newButtonsOrder.toString());
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };
            settingWindowBar.onChange = function(result) {
                var newButtonsOrder = BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',').map(Number);
                newButtonsOrder[3] = result;
                BdApi.setData('CollapsibleUI', 'buttonsOrder', newButtonsOrder.toString());
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };
            settingMembersList.onChange = function(result) {
                var newButtonsOrder = BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',').map(Number);
                newButtonsOrder[4] = result;
                BdApi.setData('CollapsibleUI', 'buttonsOrder', newButtonsOrder.toString());
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };

            // Register advanced settings onChange events
            settingSettingsButtonsMaxWidth.onChange = function(result) {
                BdApi.setData('CollapsibleUI', 'settingsButtonsMaxWidth', result);
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };
            settingToolbarIconMaxWidth.onChange = function(result) {
                BdApi.setData('CollapsibleUI', 'toolbarIconMaxWidth', result);
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };
            settingMembersListMaxWidth.onChange = function(result) {
                BdApi.setData('CollapsibleUI', 'membersListMaxWidth', result);
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };
            settingUserAreaMaxHeight.onChange = function(result) {
                BdApi.setData('CollapsibleUI', 'userAreaMaxHeight', result);
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };
            settingMsgBarMaxHeight.onChange = function(result) {
                BdApi.setData('CollapsibleUI', 'msgBarMaxHeight', result);
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };
            settingWindowBarHeight.onChange = function(result) {
                BdApi.setData('CollapsibleUI', 'windowBarHeight', result);
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };

            // Return final settings page
            return this.settingsHandle;
        }

        // Adds a new SVG icon to the toolbar
        addToolbarIcon(ariaLabel, rawSVGData, viewBox) {

            // Create the icon and define properties
            var newToolbarIcon = document.createElement('div');
                newToolbarIcon.classList.add(this.classIconWrapper);
                newToolbarIcon.classList.add(this.classClickable);
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

        createTooltip(msg, elem) {

            // Get location of selected element
            var left = elem.getBoundingClientRect().left,
                top = elem.getBoundingClientRect().top,
                width = elem.getBoundingClientRect().width,
                height = elem.getBoundingClientRect().height;

            // Create tooltip
            var newTooltip = document.createElement('div');
                newTooltip.classList.add(this.classTooltipWrapper);
                newTooltip.classList.add(this.classTooltipWrapperDPE);
                newTooltip.style.position = 'absolute';
                newTooltip.innerHTML = '<div class="' + this.classTooltip + ' ' + this.classTooltipBottom + ' ' + this.classTooltipPrimary + ' ' + this.classTooltipDPE + '" style="opacity: 1; transform: none;"><div class="' + this.classTooltipPointer + '"></div><div class="' + this.classTooltipContent + '">' + msg + '</div></div>';

            // Insert tooltip into tooltip layer
            document.querySelectorAll('.layerContainer-2v_Sit')[1].appendChild(newTooltip);

            // Get tooltip dimensions
            var ttwidth = newTooltip.getBoundingClientRect().width,
                ttheight = newTooltip.getBoundingClientRect().height;

            // Extrapolate tooltip location
            var x = left + (width/2) - (ttwidth/2),
                y = top + height + this.tooltipOffset;

            // Set tooltip location
            newTooltip.style.left = x + 'px';
            newTooltip.style.top = y + 'px';

            // Return DOM element of newly-created tooltip
            return newTooltip;
        }

        // Checks if cursor is near an element
        isNear(element, distance, x, y) {
            var left = element.getBoundingClientRect().left - distance,
                top = element.getBoundingClientRect().top - distance,
                right = left + element.getBoundingClientRect().width + 2*distance,
                bottom = top + element.getBoundingClientRect().height + 2*distance;

            return (x > left && x < right && y > top && y < bottom);
        }
    }

})();
