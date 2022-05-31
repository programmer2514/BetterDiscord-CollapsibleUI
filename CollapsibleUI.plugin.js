/**
 * @name CollapsibleUI
 * @author TenorTheHusky
 * @authorId 563652755814875146
 * @description A simple plugin that allows collapsing various sections of the Discord UI.
 * @version 5.2.9
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
            version: '5.2.9',
            description: 'A simple plugin that allows collapsing various sections of the Discord UI.',
            github: 'https://github.com/programmer2514/BetterDiscord-CollapsibleUI',
            github_raw: 'https://raw.githubusercontent.com/programmer2514/BetterDiscord-CollapsibleUI/main/CollapsibleUI.plugin.js'
        },
        changelog: [{
            title: '5.2.9',
            items: [
                'Suppress false code security errors'
            ]
        }, {
            title: '5.2.6 - 5.2.8',
            items: [
                'Fixed unintentional console spam',
                'Fixed incorrect settings indices for Selective Dynamic Uncollapse',
                'Fixed plugin failing to load if a collapsed element does not exist',
                'Fixed plugin breaking on GNU/Linux'
            ]
        }, {
            title: '5.0.0 - 5.1.6',
            items: [
                'Cleaned up code',
                'Stopped relying on aria labels for tooltips',
                'Fixed minor security vulnerability with tooltips',
                'Added KeywordTracker compatibility',
                'Added OldTitleBar compatibility',
                'Fixed elements not collapsing when their respective button is hidden',
                'Fixed call container issues',
                'Decreased number of writes to the config file',
                'Fixed plugin animations and events while on a call',
                'Added ability to reset channel list size to default',
                'Added ability to selectively enable Dynamic Uncollapse',
                'Added option to make vanilla Discord toolbar collapsible as well as CollapsibleUI\'s'
            ]
        }, {
            title: '4.0.0 - 4.4.2',
            items: [
                'Added settings panel',
                'Small animation tweaks',
                'Added dynamic uncollapse feature',
                'Made call container collapsible',
                'With settings collapse enabled, now collapses call area buttons correctly',
                'Fixed a lot of bugs',
                'Fixed patch notes',
                'Fixed UI elements not collapsing on mouse leaving the window',
                'Fixed settings collapse malfunction when in a voice call',
                'Disabled call area buttons collapsing via settings collapse',
                'Fixed dynamic uncollapse',
                'Fixed tooltips not showing',
                'Fixed window bar dynamic uncollapse',
                'Prevented sidebars from uncollapsing while hovering over message bar',
                'Used more robust message bar hover detection (fixes some themes)',
                'Implemented rudimentary Horizontal Server List support',
                'Finished implementing Horizontal Server List support',
                'Default settings tweaks (reset dynamic uncollapse distance)',
                'Fixed dynamic enabling of Horizontal Server List',
                'Added startup/shutdown logging',
                'Fixed user area not fully uncollapsing while in a call',
                'Fixed collapsing call container hiding the toolbar',
                'Added new advanced option to leave elements partially uncollapsed',
                'Added language localization',
                'Fixed small tooltip error',
                'Made channel list resize state persistent',
                'Fixed channel list not collapsing'
            ]
        }, {
            title: '3.0.0 - 3.0.1',
            items: [
                'Added GNU/Linux support',
                'Added theme support',
                'Added thread support',
                'Made channel list resizable',
                'Added collapsible button panel feature',
                'Added settings options in JSON file for advanced tweaking',
                'Fixed styles on new Discord update',
                'Fixed many, many bugs',
                'Fixed BetterDiscord repo integration'
            ]
        }, {
            title: '2.0.0 - 2.1.1',
            items: [
                'Added a button to collapse the window title bar',
                'Updated the button icons to be more consistent',
                'Finished adding transitions to collapsible elements',
                'Fixed issues with persistent button states',
                'Actually fixed plugin crashing on reload',
                'Fixed handling of plugin being disabled',
                'Adjusted some pixel measurements to prevent cutting off the message bar while typing multiline messages',
                'Added ZeresPluginLibrary support'
            ]
        }, {
            title: '1.0.0 - 1.2.1',
            items: [
                'Initial release',
                'Added persistent button states',
                'Fixed plugin crashing on reload (sorta)',
                'Added a button to collapse the message bar',
                'Added transitions to some elements',
                'Improved support for non-english locales',
                'Improved handling of missing config'
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
            let enableFullToolbarCollapse = false;

            let dynamicUncollapse = true;
            let dynamicUncollapseDistance = 35;

            let resizableChannelList = true;
            let channelListWidth = 0;

            let buttonsOrder = [1,2,4,6,7,3,5];
            let dynamicUncollapseEnabled = [true,true,true,true,true,true,true];

            let settingsButtonsMaxWidth = 100;
            let toolbarIconMaxWidth = 300;
            let membersListMaxWidth = 240;
            let toolbarMaxWidth = 800;
            let userAreaMaxHeight = 300;
            let msgBarMaxHeight = 400;
            let windowBarHeight = 18;
            let collapsedDistance = 0;

            // Define mouse tracking variables
            this.mouseX = 0;
            this.mouseY = 0;

            this.tooltipOffset = 8;
            this.isCollapsed = [true, true, true, true, true, true, true];

            // Abstract used classes
            this.classSelected = 'selected-29KTGM';
            this.classIconWrapper = 'iconWrapper-2awDjA';
            this.classClickable = 'clickable-ZD7xvu';
            this.classCallContainer = 'wrapper-1gVUIN';
            this.classCallHeaderWrapper = 'headerWrapper-1ULEPv';
            this.classCallUserWrapper = 'voiceCallWrapper-3UtDiC';
            this.classConnectionArea = 'connection-3k9QeF';
            this.classDMElement = 'channel-1Shao0';
            this.classTooltipWrapper = 'layer-2aCOJ3';
            this.classTooltipWrapperDPE = 'disabledPointerEvents-2AmYRc';
            this.classTooltip = 'tooltip-14MtrL';
            this.classTooltipBottom = 'tooltipBottom-2WzfVx';
            this.classTooltipPrimary = 'tooltipPrimary-3qLMbS';
            this.classTooltipDPE = 'tooltipDisablePointerEvents-1huO19';
            this.classTooltipPointer = 'tooltipPointer-3L49xb';
            this.classTooltipContent = 'tooltipContent-Nejnvh';


            // Abstract modified elements
            this.windowBase = document.querySelector('.base-2jDfDU');
            this.toolBar = document.querySelector('.toolbar-3_r2xA');
            this.searchBar = document.querySelector('.search-39IXmY');
            this.inviteToolbar = document.querySelector('.inviteToolbar-2k2nqz');
            this.settingsContainer = document.querySelector('.container-YkUktl').querySelector('.flex-2S1XBF');
            this.windowBar = document.querySelector('.typeWindows-2-g3UY');
            this.wordMark = document.querySelector('.wordmark-2u86JB');
            this.msgBar = document.querySelector('.form-3gdLxP');
            this.userArea = document.querySelector('.panels-3wFtMD');
            this.membersList = document.querySelector('.membersWrap-3NUR2t');
            this.serverList = document.querySelector('.wrapper-1_HaEi');
            this.channelList = document.querySelector('.sidebar-1tnWFu');

            this.callContainerExists = (document.querySelector('.' + this.classCallContainer));

            this.localeLabels = {
                                serverList: 'Server List',
                                channelList: 'Channel List',
                                msgBar: 'Message Bar',
                                windowBar: 'Window Bar',
                                membersList: 'Members List',
                                userArea: 'User Area',
                                callContainer: 'Call Container'};

            // Abstract CollapsibleUI as a variable
            let cui = this;

            console.log('%c[CollapsibleUI] ' + '%cReloading...', 'color: #3a71c1; font-weight: 700;', '');

            // Clean up UI
            this.terminate();

            // Store eventListeners in an array
            this.eventListenerController = new AbortController();
            this.eventListenerSignal = this.eventListenerController.signal;

            // Initialize Horizontal Server List integration
            this.isHSLLoaded = false;
            try {
                for (let i = 0; i < document.styleSheets.length; i++) {
                    try {
                        if (document.styleSheets[i].ownerNode.getAttribute('id') == 'Horizontal-Server-List')
                            this.isHSLLoaded = true;
                    } catch {}
                }
            } catch {}

            // Clean up old settings
            if (parseInt(BdApi.getData('CollapsibleUI', 'cuiSettingsVersion')) < 2) {
                // Clean up (v1)
                BdApi.deleteData('CollapsibleUI', 'serverListButtonActive');
                BdApi.deleteData('CollapsibleUI', 'channelListButtonActive');
                BdApi.deleteData('CollapsibleUI', 'msgBarButtonActive');
                BdApi.deleteData('CollapsibleUI', 'windowBarButtonActive');
                BdApi.deleteData('CollapsibleUI', 'membersListButtonActive');
                BdApi.deleteData('CollapsibleUI', 'userAreaButtonActive');

                // Clean up (v2)
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
            }
            if (parseInt(BdApi.getData('CollapsibleUI', 'cuiSettingsVersion')) < 3) {
                // Clean up (v3)
                BdApi.deleteData('CollapsibleUI', 'dynamicUncollapseDistance');

                // Set new settings version
                BdApi.setData('CollapsibleUI', 'cuiSettingsVersion', '3');
            }
            if (parseInt(BdApi.getData('CollapsibleUI', 'cuiSettingsVersion')) < 4) {
                // Clean up (v4)
                BdApi.deleteData('CollapsibleUI', 'userAreaMaxHeight');

                // Set new settings version
                BdApi.setData('CollapsibleUI', 'cuiSettingsVersion', '4');
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

            // enableFullToolbarCollapse [Default: false]
            if (BdApi.getData('CollapsibleUI', 'enableFullToolbarCollapse') === 'false') {
                enableFullToolbarCollapse = false;
            } else if (BdApi.getData('CollapsibleUI', 'enableFullToolbarCollapse') === 'true') {
                enableFullToolbarCollapse = true;
            } else {
                BdApi.setData('CollapsibleUI', 'enableFullToolbarCollapse', 'false');
            }

            // dynamicUncollapse [Default: true]
            if (BdApi.getData('CollapsibleUI', 'dynamicUncollapse') === 'false') {
                dynamicUncollapse = false;
            } else if (BdApi.getData('CollapsibleUI', 'dynamicUncollapse') === 'true') {
                dynamicUncollapse = true;
            } else {
                BdApi.setData('CollapsibleUI', 'dynamicUncollapse', 'true');
            }

            // dynamicUncollapseDistance [Default: 35]
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

            // channelListWidth [Default: 0]
            if (typeof(BdApi.getData('CollapsibleUI', 'channelListWidth')) === 'string') {
                channelListWidth = parseInt(BdApi.getData('CollapsibleUI', 'channelListWidth'));
            } else {
                BdApi.setData('CollapsibleUI', 'channelListWidth', channelListWidth.toString());
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

            // dynamicUncollapseEnabled [Default: [true,true,true,true,true,true,true]]
            if (typeof(BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled')) === 'string') {
                if (BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled').split(',').map(x => (x == 'true') ? true : false).length = dynamicUncollapseEnabled.length)
                    dynamicUncollapseEnabled = BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled').split(',').map(x => (x == 'true') ? true : false);
                else
                    BdApi.setData('CollapsibleUI', 'dynamicUncollapseEnabled', dynamicUncollapseEnabled.toString());
            } else {
                BdApi.setData('CollapsibleUI', 'dynamicUncollapseEnabled', dynamicUncollapseEnabled.toString());
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

            // toolbarMaxWidth [Default: 800]
            if (typeof(BdApi.getData('CollapsibleUI', 'toolbarMaxWidth')) === 'string') {
                toolbarMaxWidth = parseInt(BdApi.getData('CollapsibleUI', 'toolbarMaxWidth'));
            } else {
                BdApi.setData('CollapsibleUI', 'toolbarMaxWidth', toolbarMaxWidth.toString());
            }

            // userAreaMaxHeight [Default: 300]
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

            // collapsedDistance [Default: 0]
            if (typeof(BdApi.getData('CollapsibleUI', 'collapsedDistance')) === 'string') {
                collapsedDistance = parseInt(BdApi.getData('CollapsibleUI', 'collapsedDistance'));
            } else {
                BdApi.setData('CollapsibleUI', 'collapsedDistance', collapsedDistance.toString());
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
                    if ((!BdApi.Plugins.isEnabled('KeywordTracker')) && (this.searchBar.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling) && (this.searchBar.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.classList.contains('icon-1ELUnB'))) {
                        this.searchBar.previousElementSibling.previousElementSibling.style.display = 'none';
                    } else if (BdApi.Plugins.isEnabled('KeywordTracker') && (this.searchBar.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling) && (this.searchBar.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.classList.contains('icon-1ELUnB'))) {
                        this.searchBar.previousElementSibling.previousElementSibling.previousElementSibling.style.display = 'none';
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
                toolbarContainer.style.padding = '0px';
                toolbarContainer.style.margin = '0px';
                toolbarContainer.style.border = '0px';
                toolbarContainer.innerHTML = '<div id="cui-icon-insert-point" style="display: none;"></div>';

            // Insert icons in the correct spot
            if (this.inviteToolbar || this.searchBar)
                this.toolBar.insertBefore(toolbarContainer, (this.inviteToolbar) ? this.inviteToolbar.nextElementSibling : this.searchBar);

            // Update locale strings
            this.getLabels();

            // Define & add new toolbar icons
            // Icons are part of the Bootstrap Icons library, which can be found at https://icons.getbootstrap.com/
            var buttonsActive = buttonsOrder;
            for (let i = 1; i <= buttonsOrder.length; i++) { // lgtm[js/unused-index-variable]
                if (i == buttonsOrder[0]) {
                    if (buttonsOrder[0]) {
                        this.serverListButton = this.addToolbarIcon(this.localeLabels.serverList, '<path fill="currentColor" d="M-3.429,0.857C-3.429-0.72-2.149-2-0.571-2h17.143c1.578,0,2.857,1.28,2.857,2.857v14.286c0,1.578-1.279,2.857-2.857,2.857H-0.571c-1.578,0-2.857-1.279-2.857-2.857V0.857z M3.714-0.571v17.143h12.857c0.789,0,1.429-0.64,1.429-1.429V0.857c0-0.789-0.64-1.428-1.429-1.428H3.714z M2.286-0.571h-2.857C-1.36-0.571-2,0.068-2,0.857v14.286c0,0.789,0.64,1.429,1.429,1.429h2.857V-0.571z"/>', '-4 -4 24 24');
                    } else {
                        this.serverListButton = false;
                        buttonsActive[0] = 0;
                    }
                }
                if (i == buttonsOrder[1]) {
                    if (buttonsOrder[1]) {
                        this.channelListButton = this.addToolbarIcon(this.localeLabels.channelList, '<path fill="currentColor" d="M3.5,13.5c0-0.414,0.335-0.75,0.75-0.75h13.5c0.414,0,0.75,0.336,0.75,0.75s-0.336,0.75-0.75,0.75H4.25C3.835,14.25,3.5,13.914,3.5,13.5z M3.5,7.5c0-0.415,0.335-0.75,0.75-0.75h13.5c0.414,0,0.75,0.335,0.75,0.75s-0.336,0.75-0.75,0.75H4.25C3.835,8.25,3.5,7.915,3.5,7.5z M3.5,1.5c0-0.415,0.335-0.75,0.75-0.75h13.5c0.414,0,0.75,0.335,0.75,0.75s-0.336,0.75-0.75,0.75H4.25C3.835,2.25,3.5,1.915,3.5,1.5z M-1,3c0.828,0,1.5-0.672,1.5-1.5S-0.172,0-1,0s-1.5,0.672-1.5,1.5S-1.828,3-1,3z M-1,9c0.828,0,1.5-0.672,1.5-1.5S-0.172,6-1,6s-1.5,0.672-1.5,1.5S-1.828,9-1,9z M-1,15c0.828,0,1.5-0.671,1.5-1.5S-0.172,12-1,12s-1.5,0.671-1.5,1.5S-1.828,15-1,15z"/>', '-4 -4 24 24');
                    } else {
                        this.channelListButton = false;
                        buttonsActive[1] = 0;
                    }
                }
                if (i == buttonsOrder[2]) {
                    if (buttonsOrder[2] && this.msgBar) {
                        this.msgBarButton = this.addToolbarIcon(this.localeLabels.msgBar, '<path fill="currentColor" d="M7.5,3c0-0.415,0.335-0.75,0.75-0.75c1.293,0,2.359,0.431,3.09,0.85c0.261,0.147,0.48,0.296,0.66,0.428c0.178-0.132,0.398-0.28,0.66-0.428c0.939-0.548,2.002-0.841,3.09-0.85c0.414,0,0.75,0.335,0.75,0.75c0,0.414-0.336,0.75-0.75,0.75c-0.959,0-1.766,0.319-2.348,0.65c-0.229,0.132-0.446,0.278-0.652,0.442v6.407h0.75c0.414,0,0.75,0.335,0.75,0.75c0,0.414-0.336,0.75-0.75,0.75h-0.75v6.407c0.148,0.12,0.371,0.281,0.652,0.442c0.582,0.331,1.389,0.65,2.348,0.65c0.414,0,0.75,0.335,0.75,0.75c0,0.414-0.336,0.75-0.75,0.75c-1.088-0.01-2.15-0.302-3.09-0.85c-0.229-0.129-0.449-0.271-0.66-0.425c-0.212,0.155-0.433,0.297-0.66,0.428c-0.939,0.546-2.004,0.837-3.09,0.848c-0.415,0-0.75-0.335-0.75-0.75c0-0.414,0.335-0.75,0.75-0.75c0.957,0,1.765-0.319,2.346-0.651c0.281-0.16,0.502-0.319,0.654-0.439v-6.41H10.5c-0.415,0-0.75-0.336-0.75-0.75c0-0.415,0.335-0.75,0.75-0.75h0.75V4.843c-0.207-0.164-0.426-0.311-0.654-0.442C9.884,3.984,9.075,3.759,8.25,3.75C7.835,3.75,7.5,3.414,7.5,3z"/><path fill="currentColor" d="M15,7.5h6c0.828,0,1.5,0.671,1.5,1.5v6c0,0.829-0.672,1.5-1.5,1.5h-6V18h6c1.656,0,3-1.344,3-3V9c0-1.657-1.344-3-3-3h-6V7.5z M9,7.5V6H3C1.343,6,0,7.343,0,9v6c0,1.656,1.343,3,3,3h6v-1.5H3c-0.829,0-1.5-0.671-1.5-1.5V9c0-0.829,0.671-1.5,1.5-1.5H9z"/>', '0 0 24 24');
                    } else {
                        this.msgBarButton = false;
                        buttonsActive[2] = 0;
                    }
                }
                if (i == buttonsOrder[3]) {
                    if (buttonsOrder[3] && this.windowBar && !(BdApi.Plugins.isEnabled('OldTitleBar'))) {
                        this.windowBarButton = this.addToolbarIcon(this.localeLabels.windowBar, '<path fill="currentColor" d="M0.143,2.286c0.395,0,0.714-0.319,0.714-0.714c0-0.395-0.319-0.714-0.714-0.714c-0.395,0-0.714,0.32-0.714,0.714C-0.571,1.966-0.252,2.286,0.143,2.286z M3,1.571c0,0.395-0.319,0.714-0.714,0.714c-0.395,0-0.714-0.319-0.714-0.714c0-0.395,0.32-0.714,0.714-0.714C2.681,0.857,3,1.177,3,1.571z M4.429,2.286c0.395,0,0.714-0.319,0.714-0.714c0-0.395-0.32-0.714-0.714-0.714c-0.395,0-0.714,0.32-0.714,0.714C3.714,1.966,4.034,2.286,4.429,2.286z"/><path fill="currentColor" d="M-0.571-2c-1.578,0-2.857,1.279-2.857,2.857v14.286c0,1.578,1.279,2.857,2.857,2.857h17.143c1.577,0,2.857-1.279,2.857-2.857V0.857c0-1.578-1.28-2.857-2.857-2.857H-0.571z M18,0.857v2.857H-2V0.857c0-0.789,0.64-1.428,1.429-1.428h17.143C17.361-0.571,18,0.068,18,0.857z M-0.571,16.571C-1.36,16.571-2,15.933-2,15.143v-10h20v10c0,0.79-0.639,1.429-1.429,1.429H-0.571z"/>', '-4 -4 24 24');
                    } else {
                        this.windowBarButton = false;
                        buttonsActive[3] = 0;
                    }
                }
                if (i == buttonsOrder[4]) {
                    if (buttonsOrder[4] && this.membersList) {
                        this.membersListButton = this.addToolbarIcon(this.localeLabels.membersList, '<path fill="currentColor" d="M6.5,17c0,0-1.5,0-1.5-1.5s1.5-6,7.5-6s7.5,4.5,7.5,6S18.5,17,18.5,17H6.5z M12.5,8C14.984,8,17,5.985,17,3.5S14.984-1,12.5-1S8,1.015,8,3.5S10.016,8,12.5,8z"/><path fill="currentColor" d="M3.824,17C3.602,16.531,3.49,16.019,3.5,15.5c0-2.033,1.021-4.125,2.904-5.58C5.464,9.631,4.483,9.488,3.5,9.5c-6,0-7.5,4.5-7.5,6S-2.5,17-2.5,17H3.824z"/><path fill="currentColor" d="M2.75,8C4.821,8,6.5,6.321,6.5,4.25S4.821,0.5,2.75,0.5S-1,2.179-1,4.25S0.679,8,2.75,8z"/>', '-4 -4 24 24');
                    } else {
                        this.membersListButton = false;
                        buttonsActive[4] = 0;
                    }
                }
                if (i == buttonsOrder[5]) {
                    if (buttonsOrder[5] && this.userArea) {
                        this.userAreaButton = this.addToolbarIcon(this.localeLabels.userArea, '<path fill="currentColor" d="M-2.5,4.25c-0.829,0-1.5,0.672-1.5,1.5v4.5c0,0.829,0.671,1.5,1.5,1.5h21c0.83,0,1.5-0.671,1.5-1.5v-4.5 c0-0.828-0.67-1.5-1.5-1.5H-2.5z M14.75,5.75c0.415,0,0.75,0.335,0.75,0.75s-0.335,0.75-0.75,0.75S14,6.915,14,6.5 S14.335,5.75,14.75,5.75z M17.75,5.75c0.415,0,0.75,0.335,0.75,0.75s-0.335,0.75-0.75,0.75S17,6.915,17,6.5S17.335,5.75,17.75,5.75z M-2.5,6.5c0-0.415,0.335-0.75,0.75-0.75h7.5c0.415,0,0.75,0.335,0.75,0.75S6.165,7.25,5.75,7.25h-7.5 C-2.165,7.25-2.5,6.915-2.5,6.5z M-2.125,8.75h8.25C6.333,8.75,6.5,8.917,6.5,9.125S6.333,9.5,6.125,9.5h-8.25 C-2.333,9.5-2.5,9.333-2.5,9.125S-2.333,8.75-2.125,8.75z"/>', '-4 -4 24 24');
                    } else {
                        this.userAreaButton = false;
                        buttonsActive[5] = 0;
                    }
                }
                if (i == buttonsOrder[6]) {
                    if (buttonsOrder[6] && document.querySelector('.' + cui.classConnectionArea)) {
                        this.callContainerButton = this.addToolbarIcon(this.localeLabels.callContainer, '<path fill="currentColor" d="M2.567-0.34c-0.287-0.37-0.82-0.436-1.189-0.149c-0.028,0.021-0.055,0.045-0.079,0.07L0.006,0.875C-0.597,1.48-0.82,2.336-0.556,3.087c1.095,3.11,2.875,5.933,5.21,8.259c2.328,2.336,5.15,4.116,8.26,5.21c0.752,0.264,1.606,0.042,2.212-0.562l1.292-1.294c0.332-0.329,0.332-0.866,0.002-1.196c-0.024-0.026-0.052-0.049-0.08-0.07l-2.884-2.244c-0.205-0.158-0.474-0.215-0.725-0.151l-2.737,0.684c-0.744,0.186-1.53-0.032-2.071-0.573l-3.07-3.072C4.311,7.536,4.092,6.75,4.278,6.007l0.685-2.738C5.026,3.017,4.97,2.75,4.81,2.543L2.567-0.34z M0.354-1.361c0.852-0.852,2.234-0.852,3.085,0C3.504-1.297,3.564-1.229,3.62-1.158l2.242,2.883c0.412,0.529,0.557,1.218,0.394,1.868L5.573,6.33C5.501,6.618,5.585,6.923,5.795,7.134l3.071,3.071c0.21,0.21,0.516,0.295,0.806,0.222l2.734-0.684c0.651-0.161,1.34-0.017,1.868,0.395l2.883,2.242c1.035,0.806,1.131,2.338,0.204,3.264l-1.293,1.292c-0.925,0.925-2.307,1.332-3.596,0.879c-3.299-1.162-6.293-3.05-8.763-5.525C1.234,9.82-0.654,6.826-1.815,3.527C-2.267,2.24-1.861,0.856-0.936-0.069l1.292-1.292H0.354z"/>', '-4 -4 24 24');
                    } else {
                        this.callContainerButton = false;
                        buttonsActive[6] = 0;
                    }
                }
            }

            // Collapse toolbar
            if (enableFullToolbarCollapse) {
                var singleButtonWidth = this.serverListButton.getBoundingClientRect().width + parseInt(window.getComputedStyle(this.serverListButton).marginRight) + 'px';
                this.toolBar.style.maxWidth = singleButtonWidth;
            }

            // Collapse toolbar buttons
            if (!disableToolbarCollapse) {
                if (this.serverListButton) {
                    this.serverListButton.style.maxWidth = '0px';
                    this.serverListButton.style.margin = '0px';
                    this.serverListButton.style.padding = '0px';
                }
                if (this.channelListButton) {
                    this.channelListButton.style.maxWidth = '0px';
                    this.channelListButton.style.margin = '0px';
                    this.channelListButton.style.padding = '0px';
                }
                if (this.msgBarButton) {
                    this.msgBarButton.style.maxWidth = '0px';
                    this.msgBarButton.style.margin = '0px';
                    this.msgBarButton.style.padding = '0px';
                }
                if (this.windowBarButton) {
                    this.windowBarButton.style.maxWidth = '0px';
                    this.windowBarButton.style.margin = '0px';
                    this.windowBarButton.style.padding = '0px';
                }
                if (this.membersListButton) {
                    this.membersListButton.style.maxWidth = '0px';
                    this.membersListButton.style.margin = '0px';
                    this.membersListButton.style.padding = '0px';
                }
                if (this.userAreaButton) {
                    this.userAreaButton.style.maxWidth = '0px';
                    this.userAreaButton.style.margin = '0px';
                    this.userAreaButton.style.padding = '0px';
                }
                if (this.callContainerButton) {
                    this.callContainerButton.style.maxWidth = '0px';
                    this.callContainerButton.style.margin = '0px';
                    this.callContainerButton.style.padding = '0px';
                }

                if (this.membersListButton && (buttonsActive[4] == Math.max.apply(Math, buttonsActive))) {
                    this.membersListButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                    this.membersListButton.style.removeProperty('margin');
                    this.membersListButton.style.removeProperty('padding');
                } else if (this.windowBarButton && (buttonsActive[3] == Math.max.apply(Math, buttonsActive))) {
                    this.windowBarButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                    this.windowBarButton.style.removeProperty('margin');
                    this.windowBarButton.style.removeProperty('padding');
                } else if (this.msgBarButton && (buttonsActive[2] == Math.max.apply(Math, buttonsActive))) {
                    this.msgBarButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                    this.msgBarButton.style.removeProperty('margin');
                    this.msgBarButton.style.removeProperty('padding');
                } else if (this.channelListButton && (buttonsActive[1] == Math.max.apply(Math, buttonsActive))) {
                    this.channelListButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                    this.channelListButton.style.removeProperty('margin');
                    this.channelListButton.style.removeProperty('padding');
                } else if (this.serverListButton && (buttonsActive[0] == Math.max.apply(Math, buttonsActive))) {
                    this.serverListButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                    this.serverListButton.style.removeProperty('margin');
                    this.serverListButton.style.removeProperty('padding');
                } else if (this.userAreaButton && (buttonsActive[5] == Math.max.apply(Math, buttonsActive))) {
                    this.userAreaButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                    this.userAreaButton.style.removeProperty('margin');
                    this.userAreaButton.style.removeProperty('padding');
                } else if (this.callContainerButton && (buttonsActive[6] == Math.max.apply(Math, buttonsActive))) {
                    this.callContainerButton.style.maxWidth = toolbarIconMaxWidth + 'px';
                    this.callContainerButton.style.removeProperty('margin');
                    this.callContainerButton.style.removeProperty('padding');
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

            // Adjust UI element styling in preparation for transitions
            if (!disableTransitions) {
                document.querySelectorAll('.collapsible-ui-element').forEach(e => e.style.transition = 'max-width ' + transitionSpeed + 'ms, margin ' + transitionSpeed + 'ms, padding ' + transitionSpeed + 'ms');
                this.toolBar.style.transition = 'max-width ' + transitionSpeed + 'ms';

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

                if (this.callContainerExists) {
                    document.querySelector('.' + this.classCallContainer).style.minHeight = '0px';
                }

                if (document.querySelector('.' + this.classDMElement)) {
                    document.querySelectorAll('.' + this.classDMElement).forEach(e => e.style.maxWidth = '200000px');
                }
            }

            // Read stored user data to decide active state of Server List button
            if (this.serverList) {
                if (BdApi.getData('CollapsibleUI', 'cui.serverListButtonActive') === 'false') {
                    if (this.serverListButton) this.serverListButton.classList.remove(this.classSelected);
                    if (disableTransitions) {
                        this.serverList.style.display = 'none';
                    } else {
                        this.serverList.style.width = collapsedDistance + 'px';
                    }
                    if (this.isHSLLoaded) {
                        this.windowBase.style.setProperty('top', '0px', 'important');
                    }
                } else if (BdApi.getData('CollapsibleUI', 'cui.serverListButtonActive') === 'true') {
                    if (this.serverListButton) this.serverListButton.classList.add(this.classSelected);
                } else {
                    BdApi.setData('CollapsibleUI', 'cui.serverListButtonActive', 'true');
                    if (this.serverListButton) this.serverListButton.classList.add(this.classSelected);
                }
            }

            // Read stored user data to decide active state of Channel List button
            if (this.channelList) {
                if (BdApi.getData('CollapsibleUI', 'cui.channelListButtonActive') === 'false') {
                    if (this.channelListButton) this.channelListButton.classList.remove(this.classSelected);
                    if (disableTransitions) {
                        this.channelList.style.display = 'none';
                    } else {
                        this.channelList.style.width = collapsedDistance + 'px';
                    }
                } else if (BdApi.getData('CollapsibleUI', 'cui.channelListButtonActive') === 'true') {
                    if (this.channelListButton) this.channelListButton.classList.add(this.classSelected);
                } else {
                    BdApi.setData('CollapsibleUI', 'cui.channelListButtonActive', 'true');
                    if (this.channelListButton) this.channelListButton.classList.add(this.classSelected);
                }
            }

            // Read stored user data to decide active state of Message Bar button
            if (this.msgBar) {
                if (BdApi.getData('CollapsibleUI', 'cui.msgBarButtonActive') === 'false') {
                    if (this.msgBarButton) this.msgBarButton.classList.remove(this.classSelected);
                    if (disableTransitions) {
                        this.msgBar.style.display = 'none';
                    } else {
                        this.msgBar.style.maxHeight = collapsedDistance + 'px';
                    }
                } else if (BdApi.getData('CollapsibleUI', 'cui.msgBarButtonActive') === 'true') {
                    if (this.msgBarButton) this.msgBarButton.classList.add(this.classSelected);
                } else {
                    BdApi.setData('CollapsibleUI', 'cui.msgBarButtonActive', 'true');
                    if (this.msgBarButton) this.msgBarButton.classList.add(this.classSelected);
                }
            }

            // Read stored user data to decide active state of Window Bar button
            if (this.windowBar) {
                if (BdApi.getData('CollapsibleUI', 'cui.windowBarButtonActive') === 'false') {
                    if (this.windowBarButton) this.windowBarButton.classList.remove(this.classSelected);
                    if (disableTransitions) {
                        this.windowBar.style.display = 'none';
                    } else {
                        this.windowBar.style.height = '0px';
                        this.windowBar.style.padding = '0px';
                        this.windowBar.style.margin = '0px';
                        this.wordMark.style.display = 'none';
                    }
                } else if (BdApi.getData('CollapsibleUI', 'cui.windowBarButtonActive') === 'true') {
                    if (this.windowBarButton) this.windowBarButton.classList.add(this.classSelected);
                } else {
                    BdApi.setData('CollapsibleUI', 'cui.windowBarButtonActive', 'true');
                    if (this.windowBarButton) this.windowBarButton.classList.add(this.classSelected);
                }
            }

            // Read stored user data to decide active state of Members List button
            if (this.membersList) {
                if (BdApi.getData('CollapsibleUI', 'cui.membersListButtonActive') === 'false') {
                    if (this.membersListButton) this.membersListButton.classList.remove(this.classSelected);
                    if (disableTransitions) {
                        this.membersList.style.display = 'none';
                    } else {
                        this.membersList.style.maxWidth = collapsedDistance + 'px';
                        this.membersList.style.minWidth = '0px';
                    }
                } else if (BdApi.getData('CollapsibleUI', 'cui.membersListButtonActive') === 'true') {
                    if (this.membersListButton) this.membersListButton.classList.add(this.classSelected);
                } else {
                    BdApi.setData('CollapsibleUI', 'cui.membersListButtonActive', 'true');
                    if (this.membersListButton) this.membersListButton.classList.add(this.classSelected);
                }
            }

            // Read stored user data to decide active state of User Area button
            if (this.userArea) {
                if (BdApi.getData('CollapsibleUI', 'cui.userAreaButtonActive') === 'false') {
                    if (this.userAreaButton) this.userAreaButton.classList.remove(this.classSelected);
                    if (disableTransitions) {
                        this.userArea.style.display = 'none';
                    } else {
                        this.userArea.style.maxHeight = collapsedDistance + 'px';
                    }
                } else if (BdApi.getData('CollapsibleUI', 'cui.userAreaButtonActive') === 'true') {
                    if (this.userAreaButton) this.userAreaButton.classList.add(this.classSelected);
                } else {
                    BdApi.setData('CollapsibleUI', 'cui.userAreaButtonActive', 'true');
                    if (this.userAreaButton) this.userAreaButton.classList.add(this.classSelected);
                }
            }

            // Read stored user data to decide active state of Call Container button
            if (document.querySelector('.' + this.classCallContainer)) {
                if (BdApi.getData('CollapsibleUI', 'cui.callContainerButtonActive') === 'false') {
                    if (this.callContainerButton) this.callContainerButton.classList.remove(this.classSelected);
                    if (document.querySelector('.' + this.classCallContainer)) {
                        if (disableTransitions) {
                            document.querySelector('.' + this.classCallContainer).style.display = 'none';
                        } else {
                            document.querySelector('.' + this.classCallContainer).style.height = document.querySelector('.' + this.classCallHeaderWrapper).getBoundingClientRect().height + 'px';
                            if (document.querySelector('.' + this.classCallUserWrapper))
                                document.querySelector('.' + this.classCallUserWrapper).style.display = 'none';
                        }
                    }
                } else if (BdApi.getData('CollapsibleUI', 'cui.callContainerButtonActive') === 'true') {
                    if (this.callContainerButton) this.callContainerButton.classList.add(this.classSelected);
                } else {
                    BdApi.setData('CollapsibleUI', 'cui.callContainerButtonActive', 'true');
                    if (this.callContainerButton) this.callContainerButton.classList.add(this.classSelected);
                }
            }

            // Apply transitions to UI elements
            if (!disableTransitions) {

                // Handle resizing channel list
                if (resizableChannelList) {
                    this.channelList.style.resize = 'horizontal';
                    document.body.addEventListener('mousedown', function (){
                        cui.channelList.style.transition = 'none';
                    }, {signal: cui.eventListenerSignal});
                    document.body.addEventListener('mouseup', function (){
                        cui.channelList.style.transition = 'width ' + transitionSpeed + 'ms';
                    }, {signal: cui.eventListenerSignal});
                    this.channelList.addEventListener('contextmenu', function (event){
                        if(event.target !== event.currentTarget) return;
                        clearInterval(cui.channelListWidthChecker);
                        channelListWidth = 0;
                        BdApi.setData('CollapsibleUI', 'channelListWidth', channelListWidth.toString());
                        cui.channelList.style.removeProperty('width');
                        cui.channelListWidthChecker = setInterval(function(){
                            if ((!cui.isCollapsed[1]) || (BdApi.getData('CollapsibleUI', 'cui.channelListButtonActive') === 'true')) {
                                let oldChannelListWidth = channelListWidth;
                                if (parseInt(cui.channelList.style.width)) {
                                    channelListWidth = parseInt(cui.channelList.style.width);
                                } else if (channelListWidth != 0) {
                                    cui.channelList.style.transition = 'none';
                                    cui.channelList.style.width = channelListWidth + 'px';
                                    cui.channelList.style.transition = 'width ' + transitionSpeed + 'ms';
                                } else {
                                    cui.channelList.style.removeProperty('width');
                                }
                                if (oldChannelListWidth != channelListWidth)
                                    BdApi.setData('CollapsibleUI', 'channelListWidth', channelListWidth.toString());
                            }
                        }, 100);
                        event.preventDefault();
                    }, {signal: cui.eventListenerSignal});
                    this.channelListWidthChecker = setInterval(function(){
                        if ((!cui.isCollapsed[1]) || (BdApi.getData('CollapsibleUI', 'cui.channelListButtonActive') === 'true')) {
                            let oldChannelListWidth = channelListWidth;
                            if (parseInt(cui.channelList.style.width)) {
                                channelListWidth = parseInt(cui.channelList.style.width);
                            } else if (channelListWidth != 0) {
                                cui.channelList.style.transition = 'none';
                                cui.channelList.style.width = channelListWidth + 'px';
                                cui.channelList.style.transition = 'width ' + transitionSpeed + 'ms';
                            } else {
                                cui.channelList.style.removeProperty('width');
                            }
                            if (oldChannelListWidth != channelListWidth)
                                BdApi.setData('CollapsibleUI', 'channelListWidth', channelListWidth.toString());
                        }
                    }, 100);
                }
                if (channelListWidth != 0) {
                    this.channelList.style.transition = 'none';
                    this.channelList.style.width = channelListWidth + 'px';
                }
                this.channelList.style.transition = 'width ' + transitionSpeed + 'ms';

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
                if (this.windowBase) {
                    this.windowBase.style.transition = 'top ' + transitionSpeed + 'ms';
                }
            }

            // Add call checking event
            this.callContainerChecker = setInterval(function() {
                if ((cui.callContainerExists && !(document.querySelector('.' + cui.classCallContainer))) || (document.querySelector('.' + cui.classCallContainer) && !(cui.callContainerExists)))
                    cui.initialize();
            }, 100);

            // Implement dynamic uncollapse feature
            if (dynamicUncollapse && !disableTransitions) {
                // Add event listener to document body to track cursor location & check if it is near collapsed elements
                document.body.addEventListener('mousemove', function(event){
                    cui.mouseX = event.pageX;
                    cui.mouseY = event.pageY;

                    // Reiterate Horizontal Server List integration
                    cui.isHSLLoaded = false;
                    try {
                        for (let i = 0; i < document.styleSheets.length; i++) {
                            try {
                                if (document.styleSheets[i].ownerNode.getAttribute('id') == 'Horizontal-Server-List')
                                    cui.isHSLLoaded = true;
                            } catch {}
                        }
                    } catch {}

                    // Server List
                    if ((BdApi.getData('CollapsibleUI', 'cui.serverListButtonActive') === 'false') && cui.serverList) {
                        if (dynamicUncollapseEnabled[0] && cui.isCollapsed[0] && cui.isNear(cui.serverList, dynamicUncollapseDistance, cui.mouseX, cui.mouseY) && !(cui.isNear(cui.msgBar, 0, cui.mouseX, cui.mouseY))) {
                            cui.serverList.style.removeProperty('width');
                            if (cui.isHSLLoaded) {
                                cui.windowBase.style.removeProperty('top');
                            }
                            cui.isCollapsed[0] = false;
                        } else if (!dynamicUncollapseEnabled[0] || (!(cui.isCollapsed[0]) && !(cui.isNear(cui.serverList, dynamicUncollapseDistance, cui.mouseX, cui.mouseY)))) {
                            cui.serverList.style.width = collapsedDistance + 'px';
                            if (cui.isHSLLoaded) {
                                cui.windowBase.style.setProperty('top', '0px', 'important');
                            }
                            cui.isCollapsed[0] = true;
                        }
                    }

                    // Channel List
                    if ((BdApi.getData('CollapsibleUI', 'cui.channelListButtonActive') === 'false') && cui.channelList) {
                        if (dynamicUncollapseEnabled[1] && cui.isCollapsed[1] && cui.isNear(cui.channelList, dynamicUncollapseDistance, cui.mouseX, cui.mouseY) && !(cui.isNear(cui.msgBar, 0, cui.mouseX, cui.mouseY))) {
                            cui.channelList.style.removeProperty('width');
                            cui.isCollapsed[1] = false;
                        } else if (!dynamicUncollapseEnabled[1] || (!(cui.isCollapsed[1]) && !(cui.isNear(cui.channelList, dynamicUncollapseDistance, cui.mouseX, cui.mouseY)))) {
                            cui.channelList.style.width = collapsedDistance + 'px';
                            cui.isCollapsed[1] = true;
                        }
                    }

                    // Message Bar
                    if ((BdApi.getData('CollapsibleUI', 'cui.msgBarButtonActive') === 'false') && cui.msgBar) {
                        if (dynamicUncollapseEnabled[2] && cui.isCollapsed[2] && cui.isNear(cui.msgBar, dynamicUncollapseDistance, cui.mouseX, cui.mouseY)) {
                            cui.msgBar.style.maxHeight = msgBarMaxHeight + 'px';
                            cui.isCollapsed[2] = false;
                        } else if (!dynamicUncollapseEnabled[2] || (!(cui.isCollapsed[2]) && !(cui.isNear(cui.msgBar, dynamicUncollapseDistance, cui.mouseX, cui.mouseY)))) {
                            cui.msgBar.style.maxHeight = collapsedDistance + 'px';
                            cui.isCollapsed[2] = true;
                        }
                    }

                    // Window Bar
                    if ((BdApi.getData('CollapsibleUI', 'cui.windowBarButtonActive') === 'false') && cui.windowBar) {
                        if (dynamicUncollapseEnabled[3] && cui.isCollapsed[3] && cui.isNear(cui.windowBar, dynamicUncollapseDistance, cui.mouseX, cui.mouseY)) {
                            cui.windowBar.style.height = windowBarHeight + 'px';
                            cui.windowBar.style.removeProperty('padding');
                            cui.windowBar.style.removeProperty('margin');
                            cui.wordMark.style.removeProperty('display');
                            cui.isCollapsed[3] = false;
                        } else if (!dynamicUncollapseEnabled[3] || (!(cui.isCollapsed[3]) && !(cui.isNear(cui.windowBar, dynamicUncollapseDistance, cui.mouseX, cui.mouseY)))) {
                            cui.windowBar.style.height = '0px';
                            cui.windowBar.style.padding = '0px';
                            cui.windowBar.style.margin = '0px';
                            cui.wordMark.style.display = 'none';
                            cui.isCollapsed[3] = true;
                        }
                    }

                    // Members List
                    if ((BdApi.getData('CollapsibleUI', 'cui.membersListButtonActive') === 'false') && cui.membersList) {
                        if (dynamicUncollapseEnabled[4] && cui.isCollapsed[4] && cui.isNear(cui.membersList, dynamicUncollapseDistance, cui.mouseX, cui.mouseY) && !(cui.isNear(cui.msgBar, 0, cui.mouseX, cui.mouseY))) {
                            cui.membersList.style.maxWidth = membersListMaxWidth + 'px';
                            cui.membersList.style.removeProperty('min-width');
                            cui.isCollapsed[4] = false;
                        } else if (!dynamicUncollapseEnabled[4] || (!(cui.isCollapsed[4]) && !(cui.isNear(cui.membersList, dynamicUncollapseDistance, cui.mouseX, cui.mouseY)))) {
                            cui.membersList.style.maxWidth = collapsedDistance + 'px';
                            cui.membersList.style.minWidth = '0px';
                            cui.isCollapsed[4] = true;
                        }
                    }

                    // User Area
                    if ((BdApi.getData('CollapsibleUI', 'cui.userAreaButtonActive') === 'false') && cui.userArea) {
                        if (dynamicUncollapseEnabled[5] && cui.isCollapsed[5] && cui.isNear(cui.userArea, dynamicUncollapseDistance, cui.mouseX, cui.mouseY)) {
                            cui.userArea.style.maxHeight = userAreaMaxHeight + 'px';
                            cui.isCollapsed[5] = false;
                        } else if (!dynamicUncollapseEnabled[5] || (!(cui.isCollapsed[5]) && !(cui.isNear(cui.userArea, dynamicUncollapseDistance, cui.mouseX, cui.mouseY)))) {
                            cui.userArea.style.maxHeight = collapsedDistance + 'px';
                            cui.isCollapsed[5] = true;
                        }
                    }

                    // Call Container
                    if ((BdApi.getData('CollapsibleUI', 'cui.callContainerButtonActive') === 'false') && document.querySelector('.' + cui.classCallContainer)) {
                        if (dynamicUncollapseEnabled[6] && cui.isCollapsed[6] && cui.isNear(document.querySelector('.' + cui.classCallContainer), dynamicUncollapseDistance, cui.mouseX, cui.mouseY)) {
                            document.querySelector('.' + cui.classCallContainer).style.removeProperty('height');
                            if (document.querySelector('.' + cui.classCallUserWrapper))
                                document.querySelector('.' + cui.classCallUserWrapper).style.removeProperty('display');
                            cui.isCollapsed[6] = false;
                        } else if (!dynamicUncollapseEnabled[6] || (!(cui.isCollapsed[6]) && !(cui.isNear(document.querySelector('.' + cui.classCallContainer), dynamicUncollapseDistance, cui.mouseX, cui.mouseY)))) {
                            if (document.querySelector('.' + cui.classCallHeaderWrapper))
                                document.querySelector('.' + cui.classCallContainer).style.height = document.querySelector('.' + cui.classCallHeaderWrapper).getBoundingClientRect().height + 'px';
                            if (document.querySelector('.' + cui.classCallUserWrapper))
                                document.querySelector('.' + cui.classCallUserWrapper).style.display = 'none';
                            cui.isCollapsed[6] = true;
                        }
                    }
                }, {signal: cui.eventListenerSignal});
                document.body.addEventListener('mouseleave', function(){
                    // Server List
                    if ((BdApi.getData('CollapsibleUI', 'cui.serverListButtonActive') === 'false') && cui.serverList) {
                        if (!cui.isHSLLoaded) {
                            cui.serverList.style.width = collapsedDistance + 'px';
                            cui.isCollapsed[0] = true;
                        }
                    }

                    // Channel List
                    if ((BdApi.getData('CollapsibleUI', 'cui.channelListButtonActive') === 'false') && cui.channelList) {
                        cui.channelList.style.width = collapsedDistance + 'px';
                        cui.isCollapsed[1] = true;
                    }

                    // Message Bar
                    if ((BdApi.getData('CollapsibleUI', 'cui.msgBarButtonActive') === 'false') && cui.msgBar) {
                        cui.msgBar.style.maxHeight = collapsedDistance + 'px';
                        cui.isCollapsed[2] = true;
                    }

                    // Window Bar
                    if ((BdApi.getData('CollapsibleUI', 'cui.windowBarButtonActive') === 'false') && cui.windowBar && (cui.mouseY > windowBarHeight + dynamicUncollapseDistance)) {
                        cui.windowBar.style.height = '0px';
                        cui.windowBar.style.padding = '0px';
                        cui.windowBar.style.margin = '0px';
                        cui.wordMark.style.display = 'none';
                        cui.isCollapsed[3] = true;
                    }

                    // Members List
                    if ((BdApi.getData('CollapsibleUI', 'cui.membersListButtonActive') === 'false') && cui.membersList) {
                        cui.membersList.style.maxWidth = collapsedDistance + 'px';
                        cui.membersList.style.minWidth = '0px';
                        cui.isCollapsed[4] = true;
                    }

                    // User Area
                    if ((BdApi.getData('CollapsibleUI', 'cui.userAreaButtonActive') === 'false') && cui.userArea) {
                        cui.userArea.style.maxHeight = collapsedDistance + 'px';
                        cui.isCollapsed[5] = true;
                    }

                    // Call Container
                    if ((BdApi.getData('CollapsibleUI', 'cui.callContainerButtonActive') === 'false') && document.querySelector('.' + cui.classCallContainer)) {
                        document.querySelector('.' + cui.classCallContainer).style.height = document.querySelector('.' + cui.classCallHeaderWrapper).getBoundingClientRect().height + 'px';
                        cui.isCollapsed[6] = true;
                    }
                }, {signal: cui.eventListenerSignal});
            }

            // Add event listeners to the Toolbar to update on hover
            if (enableFullToolbarCollapse) {
                this.toolBar.addEventListener('mouseenter', function(){
                    this.style.maxWidth = toolbarMaxWidth + 'px';
                }, {signal: cui.eventListenerSignal});
                this.toolBar.addEventListener('mouseleave', function(){
                    this.style.maxWidth = singleButtonWidth;
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
                        cui.serverListButton.style.margin = '0px';
                        cui.serverListButton.style.padding = '0px';
                    }
                    if (cui.channelListButton) {
                        cui.channelListButton.style.maxWidth = '0px';
                        cui.channelListButton.style.margin = '0px';
                        cui.channelListButton.style.padding = '0px';
                    }
                    if (cui.msgBarButton) {
                        cui.msgBarButton.style.maxWidth = '0px';
                        cui.msgBarButton.style.margin = '0px';
                        cui.msgBarButton.style.padding = '0px';
                    }
                    if (cui.windowBarButton) {
                        cui.windowBarButton.style.maxWidth = '0px';
                        cui.windowBarButton.style.margin = '0px';
                        cui.windowBarButton.style.padding = '0px';
                    }
                    if (cui.membersListButton) {
                        cui.membersListButton.style.maxWidth = '0px';
                        cui.membersListButton.style.margin = '0px';
                        cui.membersListButton.style.padding = '0px';
                    }
                    if (cui.userAreaButton) {
                        cui.userAreaButton.style.maxWidth = '0px';
                        cui.userAreaButton.style.margin = '0px';
                        cui.userAreaButton.style.padding = '0px';
                    }
                    if (cui.callContainerButton) {
                        cui.callContainerButton.style.maxWidth = '0px';
                        cui.callContainerButton.style.margin = '0px';
                        cui.callContainerButton.style.padding = '0px';
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
                            cui.serverList.style.width = collapsedDistance + 'px';
                        }
                        if (cui.isHSLLoaded) {
                            cui.windowBase.style.setProperty('top', '0px', 'important');
                        }
                        BdApi.setData('CollapsibleUI', 'cui.serverListButtonActive', 'false');
                        this.classList.remove(cui.classSelected);
                    } else {
                        if (disableTransitions) {
                            cui.serverList.style.display = 'initial';
                        } else {
                            cui.serverList.style.removeProperty('width');
                        }
                        if (cui.isHSLLoaded) {
                            cui.windowBase.style.removeProperty('top');
                        }
                        BdApi.setData('CollapsibleUI', 'cui.serverListButtonActive', 'true');
                        this.classList.add(cui.classSelected);
                    }
                }, {signal: cui.eventListenerSignal});

                cui.serverListButton.addEventListener('mouseenter', function(){
                    this.tooltip = cui.createTooltip(cui.localeLabels.serverList, this);
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
                            cui.channelList.style.width = collapsedDistance + 'px';
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
                    this.tooltip = cui.createTooltip(cui.localeLabels.channelList, this);
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
                            cui.msgBar.style.maxHeight = collapsedDistance + 'px';
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
                    this.tooltip = cui.createTooltip(cui.localeLabels.msgBar, this);
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
                            cui.windowBar.style.padding = '0px';
                            cui.windowBar.style.margin = '0px';
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
                    this.tooltip = cui.createTooltip(cui.localeLabels.windowBar, this);
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
                            cui.membersList.style.maxWidth = collapsedDistance + 'px';
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
                    this.tooltip = cui.createTooltip(cui.localeLabels.membersList, this);
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
                            cui.userArea.style.maxHeight = collapsedDistance + 'px';
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
                    this.tooltip = cui.createTooltip(cui.localeLabels.userArea, this);
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
                                document.querySelector('.' + cui.classCallContainer).style.height = document.querySelector('.' + cui.classCallHeaderWrapper).getBoundingClientRect().height + 'px';
                                if (document.querySelector('.' + cui.classCallUserWrapper))
                                    document.querySelector('.' + cui.classCallUserWrapper).style.display = 'none';
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
                                if (document.querySelector('.' + cui.classCallUserWrapper))
                                    document.querySelector('.' + cui.classCallUserWrapper).style.removeProperty('display');
                            }
                        }
                        BdApi.setData('CollapsibleUI', 'cui.callContainerButtonActive', 'true');
                        this.classList.add(cui.classSelected);
                    }
                }, {signal: cui.eventListenerSignal});

                cui.callContainerButton.addEventListener('mouseenter', function(){
                    this.tooltip = cui.createTooltip(cui.localeLabels.callContainer, this);
                }, {signal: cui.eventListenerSignal});

                cui.callContainerButton.addEventListener('mouseleave', function(){
                    this.tooltip.remove();
                }, {signal: cui.eventListenerSignal});
            }
        }

        // Terminate the plugin and undo its effects
        terminate() {

            // Remove CollapsibleUI icons
            document.querySelectorAll('.collapsible-ui-element').forEach(e => e.remove());

            // Re-enable the original Members List icon
            try {
                this.searchBar.previousElementSibling.style.removeProperty('display');
            } catch {
                console.warn('%c[CollapsibleUI] ' + '%cFailed to restore Members List button. Are you sure it exists?', 'color: #3a71c1; font-weight: 700;', '');
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
                if (document.querySelector('.' + this.classCallUserWrapper))
                    document.querySelector('.' + this.classCallUserWrapper).style.removeProperty('display');
            }
            if (this.windowBase) {
                this.windowBase.style.removeProperty('top');
                this.windowBase.style.removeProperty('transition');
            }
            if (this.toolBar) {
                this.toolBar.style.removeProperty('max-width');
                this.toolBar.style.removeProperty('transition');
            }

            // Restore default ZeresPluginLibrary logger functionality
            BdApi.Plugins.get('ZeresPluginLibrary').exports.Logger.warn = this.zeresWarnOld;

            // Abort event listeners
            if (this.eventListenerController)
                this.eventListenerController.abort();
            if (this.channelListWidthChecker)
                clearInterval(this.channelListWidthChecker);
            if (this.callContainerChecker)
                clearInterval(this.callContainerChecker);
        }

        // Initialize the plugin when it is enabled
        async start() {

            // Wait for current user session to finish loading
            while (!document.body.hasAttribute('data-current-user-id')) {
                await new Promise(resolve => requestAnimationFrame(resolve));
            }

            // Wait for an additional second because FSR the message bar won't collapse correctly otherwise
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Send startup message
            console.log('%c[CollapsibleUI] ' + `%c(v${BdApi.Plugins.get('CollapsibleUI').version}) ` + '%chas started.', 'color: #3a71c1; font-weight: 700;', 'color: #666; font-weight: 600;', '');

            try {
                this.initialize();
            } catch(e) {
                console.warn('%c[CollapsibleUI] ' + '%cCould not initialize toolbar! (see below)	', 'color: #3a71c1; font-weight: 700;', '');
                console.warn(e);
            }
        }

        // Restore the default UI when the plugin is disabled
        stop() {
            // Terminate CollapsibleUI
            this.terminate();

            // Send shutdown message
            console.log('%c[CollapsibleUI] ' + `%c(v${BdApi.Plugins.get('CollapsibleUI').version}) ` + '%chas stopped.', 'color: #3a71c1; font-weight: 700;', 'color: #666; font-weight: 600;', '');
        }

        // Re-initialize the plugin on channel/server switch
        onSwitch() {
            try {
                this.initialize();
            } catch(e) {
                console.warn('%c[CollapsibleUI] ' + '%cCould not initialize toolbar! (see below)', 'color: #3a71c1; font-weight: 700;', '');
                console.warn(e);
            }
        }

        // Add settings panel
        getSettingsPanel() {
            let zps = Api.Settings;

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
            var settingEnableFullToolbarCollapse = new zps.Switch('Enable Full Toolbar Auto-collapse',
                                                                  'Enables the automatic collapsing of the full vanilla Discord toolbar',
                                                                  BdApi.getData('CollapsibleUI', 'enableFullToolbarCollapse') === 'true');
            var settingDynamicUncollapse = new zps.Switch('Dynamic Uncollapse',
                                                          'Makes collapsed UI elements expand when the mouse is near them. Does not work with transitions disabled',
                                                          BdApi.getData('CollapsibleUI', 'dynamicUncollapse') === 'true');
            var settingDynamicUncollapseDistance = new zps.Textbox('Dynamic Uncollapse Distance (px)',
                                                                   'Sets the distance that the mouse must be from a UI element in order for it to expand',
                                                                   BdApi.getData('CollapsibleUI', 'dynamicUncollapseDistance'),
                                                                   null,
                                                                   {placeholder: 'Default: 35'});
            var settingResizableChannelList = new zps.Switch('Resizable Channel List',
                                                             'Allows the channel list to be resized horizontally by clicking-and-dragging on its bottom-right corner',
                                                             BdApi.getData('CollapsibleUI', 'resizableChannelList') === 'true');

            // Append main settings to Main subgroup
            groupMain.append(settingDisableTransitions);
            groupMain.append(settingTransitionSpeed);
            groupMain.append(settingDisableToolbarCollapse);
            groupMain.append(settingDisableSettingsCollapse);
            groupMain.append(settingEnableFullToolbarCollapse);
            groupMain.append(settingDynamicUncollapse);
            groupMain.append(settingDynamicUncollapseDistance);
            groupMain.append(settingResizableChannelList);

            // Create Selective Dynamic Uncollapse subgroup
            var groupSDU = new zps.SettingGroup('Selective Dynamic Uncollapse');

            // Create selective dynamic uncollapse settings
            var settingDUServerList = new zps.Switch('Server List',
                                                           'Toggles Dynamic Uncollapse for the server list',
                                                           BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled').split(',')[0] === 'true');
            var settingDUChannelList = new zps.Switch('Channel List',
                                                           'Toggles Dynamic Uncollapse for the channel list',
                                                           BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled').split(',')[1] === 'true');
            var settingDUUserArea = new zps.Switch('User Area',
                                                           'Toggles Dynamic Uncollapse for the user area',
                                                           BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled').split(',')[5] === 'true');
            var settingDUMsgBar = new zps.Switch('Message Bar',
                                                           'Toggles Dynamic Uncollapse for the message bar',
                                                           BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled').split(',')[2] === 'true');
            var settingDUCallContainer = new zps.Switch('Call Container',
                                                           'Toggles Dynamic Uncollapse for the call container',
                                                           BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled').split(',')[6] === 'true');
            var settingDUWindowBar = new zps.Switch('Window Bar',
                                                           'Toggles Dynamic Uncollapse for the window bar',
                                                           BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled').split(',')[3] === 'true');
            var settingDUMembersList = new zps.Switch('Members List',
                                                           'Toggles Dynamic Uncollapse for the members list',
                                                           BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled').split(',')[4] === 'true');

            // Append selective dynamic uncollapse settings to Selective Dynamic Uncollapse subgroup
            groupSDU.append(settingDUServerList);
            groupSDU.append(settingDUChannelList);
            groupSDU.append(settingDUUserArea);
            groupSDU.append(settingDUMsgBar);
            groupSDU.append(settingDUCallContainer);
            groupSDU.append(settingDUWindowBar);
            groupSDU.append(settingDUMembersList);

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
            var settingToolbarMaxWidth = new zps.Textbox('Toolbar - Max Width',
                                                         null,
                                                         BdApi.getData('CollapsibleUI', 'toolbarMaxWidth'),
                                                         null,
                                                         {placeholder: 'Default: 800'});
            var settingUserAreaMaxHeight = new zps.Textbox('User Area - Max Height',
                                                           null,
                                                           BdApi.getData('CollapsibleUI', 'userAreaMaxHeight'),
                                                           null,
                                                           {placeholder: 'Default: 300'});
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
            var settingCollapsedDistance = new zps.Textbox('Collapsed Element Distance',
                                                         null,
                                                         BdApi.getData('CollapsibleUI', 'collapsedDistance'),
                                                         null,
                                                         {placeholder: 'Default: 0'});

            // Append advanced settings to Advanced subgroup
            groupAdvanced.append(settingSettingsButtonsMaxWidth);
            groupAdvanced.append(settingToolbarIconMaxWidth);
            groupAdvanced.append(settingMembersListMaxWidth);
            groupAdvanced.append(settingToolbarMaxWidth);
            groupAdvanced.append(settingUserAreaMaxHeight);
            groupAdvanced.append(settingMsgBarMaxHeight);
            groupAdvanced.append(settingWindowBarHeight);
            groupAdvanced.append(settingCollapsedDistance);

            // Append subgroups to root node
            settingsRoot.append(groupMain);
            settingsRoot.append(groupSDU);
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
            settingEnableFullToolbarCollapse.onChange = function(result) {
                if (result)
                    BdApi.setData('CollapsibleUI', 'enableFullToolbarCollapse', 'true');
                else
                    BdApi.setData('CollapsibleUI', 'enableFullToolbarCollapse', 'false');
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

            // Register selective dynamic uncollapse settings onChange events
            settingDUServerList.onChange = function(result) {
                let dynamicUncollapseEnabled = BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled').split(',').map(x => (x == 'true') ? true : false);
                dynamicUncollapseEnabled[0] = result;
                BdApi.setData('CollapsibleUI', 'dynamicUncollapseEnabled', dynamicUncollapseEnabled.toString());
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };
            settingDUChannelList.onChange = function(result) {
                let dynamicUncollapseEnabled = BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled').split(',').map(x => (x == 'true') ? true : false);
                dynamicUncollapseEnabled[1] = result;
                BdApi.setData('CollapsibleUI', 'dynamicUncollapseEnabled', dynamicUncollapseEnabled.toString());
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };
            settingDUUserArea.onChange = function(result) {
                let dynamicUncollapseEnabled = BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled').split(',').map(x => (x == 'true') ? true : false);
                dynamicUncollapseEnabled[5] = result;
                BdApi.setData('CollapsibleUI', 'dynamicUncollapseEnabled', dynamicUncollapseEnabled.toString());
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };
            settingDUMsgBar.onChange = function(result) {
                let dynamicUncollapseEnabled = BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled').split(',').map(x => (x == 'true') ? true : false);
                dynamicUncollapseEnabled[2] = result;
                BdApi.setData('CollapsibleUI', 'dynamicUncollapseEnabled', dynamicUncollapseEnabled.toString());
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };
            settingDUCallContainer.onChange = function(result) {
                let dynamicUncollapseEnabled = BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled').split(',').map(x => (x == 'true') ? true : false);
                dynamicUncollapseEnabled[6] = result;
                BdApi.setData('CollapsibleUI', 'dynamicUncollapseEnabled', dynamicUncollapseEnabled.toString());
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };
            settingDUWindowBar.onChange = function(result) {
                let dynamicUncollapseEnabled = BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled').split(',').map(x => (x == 'true') ? true : false);
                dynamicUncollapseEnabled[3] = result;
                BdApi.setData('CollapsibleUI', 'dynamicUncollapseEnabled', dynamicUncollapseEnabled.toString());
                BdApi.Plugins.get('CollapsibleUI').instance.initialize();
            };
            settingDUMembersList.onChange = function(result) {
                let dynamicUncollapseEnabled = BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled').split(',').map(x => (x == 'true') ? true : false);
                dynamicUncollapseEnabled[4] = result;
                BdApi.setData('CollapsibleUI', 'dynamicUncollapseEnabled', dynamicUncollapseEnabled.toString());
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
            settingToolbarMaxWidth.onChange = function(result) {
                BdApi.setData('CollapsibleUI', 'toolbarMaxWidth', result);
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
            settingCollapsedDistance.onChange = function(result) {
                BdApi.setData('CollapsibleUI', 'collapsedDistance', result);
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
                newTooltip.style.position = 'fixed';
                newTooltip.style.textAlign = 'center';
                newTooltip.innerHTML = `<div class="${this.classTooltip} ${this.classTooltipBottom} ${this.classTooltipPrimary} ${this.classTooltipDPE}" style="opacity: 1; transform: none;"><div class="${this.classTooltipPointer}"></div><div class="${this.classTooltipContent}">${msg}</div></div>`;

            // Insert tooltip into tooltip layer
            document.querySelectorAll('.layerContainer-2v_Sit')[1].appendChild(newTooltip);

            // Get tooltip dimensions
            var ttwidth = newTooltip.getBoundingClientRect().width;

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
            try {
                if (this.isHSLLoaded && (element === this.serverList)) {
                    var top = 0,
                        left = element.getBoundingClientRect().left - distance,
                        right = left + element.getBoundingClientRect().width + 2*distance,
                        bottom = parseInt(BdApi.getData('CollapsibleUI', 'windowBarHeight')) + element.getBoundingClientRect().height + distance;
                } else {
                    var top = element.getBoundingClientRect().top - distance,
                        left = element.getBoundingClientRect().left - distance,
                        right = left + element.getBoundingClientRect().width + 2*distance,
                        bottom = top + element.getBoundingClientRect().height + 2*distance;
                }
            } catch {
                var left = -1000, top = -1000, right = -1000, bottom = -1000;
            }
            return (x > left && x < right && y > top && y < bottom);
        }

        // Returns the correct language strings for each locale
        getLabels() {
            switch (document.documentElement.getAttribute("lang")) {
                case "da":
                    this.localeLabels = {
                        serverList: 'Serverliste',
                        channelList: 'Kanalliste',
                        msgBar: 'Meddelelsesbjælke',
                        windowBar: 'Vinduesbjælke',
                        membersList: 'Medlemmerliste',
                        userArea: 'Brugerområdet',
                        callContainer: 'Opkaldsbeholder'};
                    break;
                case "de":
                    this.localeLabels = {
                        serverList: 'Server-Liste',
                        channelList: 'Kanal-Liste',
                        msgBar: 'Nachrichten-Bar',
                        windowBar: 'Fenster-Bar',
                        membersList: 'Mitglieder-Liste',
                        userArea: 'Benutzer-Bereich',
                        callContainer: 'Anruf-Container'};
                    break;
                case "es-ES":
                    this.localeLabels = {
                        serverList: 'Lista de Servidores',
                        channelList: 'Lista de Canales',
                        msgBar: 'Barra de Mensajes',
                        windowBar: 'Barra de Ventana',
                        membersList: 'Lista de Miembros',
                        userArea: 'Área de Usuario',
                        callContainer: 'Contenedor Llamadas'};
                    break;
                case "fr":
                    this.localeLabels = {
                        serverList: 'Liste des Serveurs',
                        channelList: 'Liste des Chaînes',
                        msgBar: 'Barre de Messages',
                        windowBar: 'Barre de Fenêtre',
                        membersList: 'Liste des Membres',
                        userArea: 'Espace Utilisateur',
                        callContainer: 'Conteneur D&apos;appel'};
                    break;
                case "hr":
                    this.localeLabels = {
                        serverList: 'Popis Poslužitelja',
                        channelList: 'Popis Kanala',
                        msgBar: 'Traka Poruke',
                        windowBar: 'Traka Prozora',
                        membersList: 'Popis Članova',
                        userArea: 'Korisničko Područje',
                        callContainer: 'Spremnik Poziva'};
                    break;
                case "it":
                    this.localeLabels = {
                        serverList: 'Elenco Server',
                        channelList: 'Elenco Canali',
                        msgBar: 'Barra Messaggi',
                        windowBar: 'Barra Finestra',
                        membersList: 'Elenco Membri',
                        userArea: 'Area Utente',
                        callContainer: 'Chiama Contenitore'};
                    break;
                case "lt":
                    this.localeLabels = {
                        serverList: 'Serverių Sąrašas',
                        channelList: 'Kanalų Sąrašas',
                        msgBar: 'Žinučių Juosta',
                        windowBar: 'Langų Juosta',
                        membersList: 'Narių Sąrašas',
                        userArea: 'Naudotojo Sritis',
                        callContainer: 'Skambučių Konteineris'};
                    break;
                case "hu":
                    this.localeLabels = {
                        serverList: 'Szerver Lista',
                        channelList: 'Csatorna Lista',
                        msgBar: 'Üzenetsáv',
                        windowBar: 'Ablaksáv',
                        membersList: 'Tagok Lista',
                        userArea: 'Felhasználói Rész',
                        callContainer: 'Hívás Konténer'};
                    break;
                case "nl":
                    this.localeLabels = {
                        serverList: 'Serverlijst',
                        channelList: 'Kanaallijst',
                        msgBar: 'Berichtbar',
                        windowBar: 'Vensterbar',
                        membersList: 'Ledenlijst',
                        userArea: 'Gebruikersgebied',
                        callContainer: 'Bel Container'};
                    break;
                case "no":
                    this.localeLabels = {
                        serverList: 'Liste over Servere',
                        channelList: 'Liste over Kanaler',
                        msgBar: 'Meldingsfelt',
                        windowBar: 'Vinduslinje',
                        membersList: 'Liste over Medlemmer',
                        userArea: 'Bruker-Området',
                        callContainer: 'Kall Beholder'};
                    break;
                case "pl":
                    this.localeLabels = {
                        serverList: 'Lista Serwerów',
                        channelList: 'Lista Kanałów',
                        msgBar: 'Pasek Komunikatów',
                        windowBar: 'Pasek Okna',
                        membersList: 'Lista Członków',
                        userArea: 'Obszar Użytkownika',
                        callContainer: 'Pojemnik na Telefony'};
                    break;
                case "pt-BR":
                    this.localeLabels = {
                        serverList: 'Lista de Servidores',
                        channelList: 'Lista de Canais',
                        msgBar: 'Barra de Mensagens',
                        windowBar: 'Barra de Janela',
                        membersList: 'Lista de Membros',
                        userArea: 'Área do Usuário',
                        callContainer: 'Container de Chamadas'};
                    break;
                case "ro":
                    this.localeLabels = {
                        serverList: 'Lista de Servere',
                        channelList: 'Lista de Canale',
                        msgBar: 'Bara de Mesaje',
                        windowBar: 'Bara de Fereastră',
                        membersList: 'Lista Membrilor',
                        userArea: 'Zona de Utilizator',
                        callContainer: 'Apelare Container'};
                    break;
                case "fi":
                    this.localeLabels = {
                        serverList: 'Palvelinluettelo',
                        channelList: 'Kanavaluettelo',
                        msgBar: 'Viestipalkki',
                        windowBar: 'Ikkunapalkki',
                        membersList: 'Jäsenluettelo',
                        userArea: 'Käyttäjäalue',
                        callContainer: 'Kutsukontti'};
                    break;
                case "sv-SE":
                    this.localeLabels = {
                        serverList: 'Serverlista',
                        channelList: 'Kanallista',
                        msgBar: 'Meddelandefält',
                        windowBar: 'Fönsterfält',
                        membersList: 'Medlemslista',
                        userArea: 'Användarområde',
                        callContainer: 'Samtalsbehållare'};
                    break;
                case "vi":
                    this.localeLabels = {
                        serverList: 'Danh sách Máy Chủ',
                        channelList: 'Danh sách Kênh',
                        msgBar: 'Thanh Thông Báo',
                        windowBar: 'Thanh Cửa Sổ',
                        membersList: 'Danh sách Thành Viên',
                        userArea: 'Vùng Người Dùng',
                        callContainer: 'Container Cuộc Gọi'};
                    break;
                case "tr":
                    this.localeLabels = {
                        serverList: 'Sunucu Listesi',
                        channelList: 'Kanal Listesi',
                        msgBar: 'İleti Çubuğu',
                        windowBar: 'Pencere Çubuğu',
                        membersList: 'Üye Listesi',
                        userArea: 'Kullanıcı Alanı',
                        callContainer: 'Arama Kapsayıcısı'};
                    break;
                case "cs":
                    this.localeLabels = {
                        serverList: 'Seznam Serverů',
                        channelList: 'Seznam Kanálů',
                        msgBar: 'Panel Zpráv',
                        windowBar: 'Panel Oken',
                        membersList: 'Seznam Členů',
                        userArea: 'Uživatelská Oblast',
                        callContainer: 'Kontejner Volání'};
                    break;
                case "el":
                    this.localeLabels = {
                        serverList: 'Λίστα Διακομιστών',
                        channelList: 'Λίστα Καναλιών',
                        msgBar: 'Γραμμή Μηνυμάτων',
                        windowBar: 'Γραμμή Παραθύρων',
                        membersList: 'Λίστα Μελών',
                        userArea: 'Περιοχή Χρήστη',
                        callContainer: 'Δοχείο Κλήσεων'};
                    break;
                case "bg":
                    this.localeLabels = {
                        serverList: 'Списък на Сървърите',
                        channelList: 'Списък на Каналите',
                        msgBar: 'Лента за Съобщения',
                        windowBar: 'Лента на Прозореца',
                        membersList: 'Списък на Членовете',
                        userArea: 'Потребителска Зона',
                        callContainer: 'Контейнер за Повиквания'};
                    break;
                case "ru":
                    this.localeLabels = {
                        serverList: 'Список Серверов',
                        channelList: 'Список Каналов',
                        msgBar: 'Панель Сообщений',
                        windowBar: 'Панель Окон',
                        membersList: 'Список Участников',
                        userArea: 'Область Пользователя',
                        callContainer: 'Контейнер Вызовов'};
                    break;
                case "uk":
                    this.localeLabels = {
                        serverList: 'Список Серверів',
                        channelList: 'Список Каналів',
                        msgBar: 'Рядок Повідомлень',
                        windowBar: 'Рядок Вікна',
                        membersList: 'Список Учасників',
                        userArea: 'Область Користувача',
                        callContainer: 'Контейнер Викликів'};
                    break;
                case "hi":
                    this.localeLabels = {
                        serverList: 'सर्वर सूची',
                        channelList: 'चैनल सूची',
                        msgBar: 'संदेश पट्टी',
                        windowBar: 'विंडो पट्टी',
                        membersList: 'सदस्यों की सूची',
                        userArea: 'उपयोगकर्ता क्षेत्र',
                        callContainer: 'कॉल कंटेनर'};
                    break;
                case "th":
                    this.localeLabels = {
                        serverList: 'รายการเซิร์ฟเวอร์',
                        channelList: 'รายการแชนเนล',
                        msgBar: 'แถบข้อความ',
                        windowBar: 'แถบหน้าต่าง',
                        membersList: 'รายชื่อสมาชิก',
                        userArea: 'พื้นที่ผู้ใช้',
                        callContainer: 'คอนเทนเนอร์การโทร'};
                    break;
                case "zh-CN":
                    this.localeLabels = {
                        serverList: '服务器列表',
                        channelList: '频道列表',
                        msgBar: '信息栏',
                        windowBar: '窗口栏',
                        membersList: '成员列表',
                        userArea: '用户区',
                        callContainer: '呼叫容器'};
                    break;
                case "ja":
                    this.localeLabels = {
                        serverList: 'サーバー一覧',
                        channelList: 'チャンネル一覧',
                        msgBar: 'メッセージバー',
                        windowBar: 'ウィンドウズ・バー',
                        membersList: 'メンバーリスト',
                        userArea: 'ユーザーエリア',
                        callContainer: 'コールコンテナ'};
                    break;
                case "zh-TW":
                    this.localeLabels = {
                        serverList: '伺服器清單',
                        channelList: '通道清單',
                        msgBar: '消息列',
                        windowBar: '視窗列',
                        membersList: '成員清單',
                        userArea: '用戶區',
                        callContainer: '呼叫容器'};
                    break;
                case "ko":
                    this.localeLabels = {
                        serverList: '서버 목록',
                        channelList: '채널 목록',
                        msgBar: '메시지 표시줄',
                        windowBar: '창 바',
                        membersList: '멤버 목록',
                        userArea: '사용자 영역',
                        callContainer: '통화 컨테이너'};
                    break;
                default:
                    this.localeLabels = {
                        serverList: 'Server List',
                        channelList: 'Channel List',
                        msgBar: 'Message Bar',
                        windowBar: 'Window Bar',
                        membersList: 'Members List',
                        userArea: 'User Area',
                        callContainer: 'Call Container'};
            }
        }
    }

})();
