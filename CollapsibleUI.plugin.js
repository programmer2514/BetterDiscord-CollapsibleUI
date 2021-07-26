/**
 * @name CollapsibleUI
 * @author programmer2514
 * @description A simple plugin that allows collapsing various sections of the Discord UI.
 * @version 2.0.0
 * @website https://github.com/programmer2514/BetterDiscord-CollapsibleUI
 * @source https://raw.githubusercontent.com/programmer2514/BetterDiscord-CollapsibleUI/main/CollapsibleUI.plugin.js
 */

module.exports = class CollapsibleUI {

    // Main plugin code, called by start() and onSwitch()
    initialize() {

        // Purge CollapsibleUI toolbar icons
        document.querySelectorAll('.collapsible-ui-element').forEach(e => e.remove());
        
        // Apply transitions to UI elements
        document.querySelector('.sidebar-2K8pFh').style.transition = 'width 500ms';
        document.querySelector('.wrapper-3NnKdC').style.transition = 'width 500ms';
        document.querySelector('.typeWindows-1za-n7').style.overflow = 'hidden';
        document.querySelector('.typeWindows-1za-n7').style.height = '18px';
        document.querySelector('.typeWindows-1za-n7').style.transition = 'height 500ms';
        if (document.querySelector('.membersWrap-2h-GB4')) {
            document.querySelector('.membersWrap-2h-GB4').style.overflow = 'hidden';
            document.querySelector('.membersWrap-2h-GB4').style.maxWidth = '240px';
            document.querySelector('.membersWrap-2h-GB4').style.transition = 'max-width 500ms, min-width 500ms';
            document.querySelector('.search-36MZv-').previousElementSibling.style.display = 'none';
        }
        
        if (document.querySelector('.form-2fGMdU')) {
            document.querySelector('.form-2fGMdU').style.maxHeight = '80px';
            document.querySelector('.form-2fGMdU').style.transition = 'max-height 555ms';
        }

        // Define & add new toolbar icons
        // Icons are part of the Bootstrap Icons library, which can be found at https://icons.getbootstrap.com/
        var serverListButton = this.addToolbarIcon('Server List', '<path fill="currentColor" d="M-3.429,0.857C-3.429-0.72-2.149-2-0.571-2h17.143c1.578,0,2.857,1.28,2.857,2.857v14.286c0,1.578-1.279,2.857-2.857,2.857H-0.571c-1.578,0-2.857-1.279-2.857-2.857V0.857z M3.714-0.571v17.143h12.857c0.789,0,1.429-0.64,1.429-1.429V0.857c0-0.789-0.64-1.428-1.429-1.428H3.714z M2.286-0.571h-2.857C-1.36-0.571-2,0.068-2,0.857v14.286c0,0.789,0.64,1.429,1.429,1.429h2.857V-0.571z"/>', '-4 -4 24 24');
        var channelListButton = this.addToolbarIcon('Channel List', '<path fill="currentColor" d="M3.5,13.5c0-0.414,0.335-0.75,0.75-0.75h13.5c0.414,0,0.75,0.336,0.75,0.75s-0.336,0.75-0.75,0.75H4.25C3.835,14.25,3.5,13.914,3.5,13.5z M3.5,7.5c0-0.415,0.335-0.75,0.75-0.75h13.5c0.414,0,0.75,0.335,0.75,0.75s-0.336,0.75-0.75,0.75H4.25C3.835,8.25,3.5,7.915,3.5,7.5z M3.5,1.5c0-0.415,0.335-0.75,0.75-0.75h13.5c0.414,0,0.75,0.335,0.75,0.75s-0.336,0.75-0.75,0.75H4.25C3.835,2.25,3.5,1.915,3.5,1.5z M-1,3c0.828,0,1.5-0.672,1.5-1.5S-0.172,0-1,0s-1.5,0.672-1.5,1.5S-1.828,3-1,3z M-1,9c0.828,0,1.5-0.672,1.5-1.5S-0.172,6-1,6s-1.5,0.672-1.5,1.5S-1.828,9-1,9z M-1,15c0.828,0,1.5-0.671,1.5-1.5S-0.172,12-1,12s-1.5,0.671-1.5,1.5S-1.828,15-1,15z"/>', '-4 -4 24 24');
        if (document.querySelector('.form-2fGMdU')) {
            var msgBarButton = this.addToolbarIcon('Message Bar', '<path fill="currentColor" d="M7.5,3c0-0.415,0.335-0.75,0.75-0.75c1.293,0,2.359,0.431,3.09,0.85c0.261,0.147,0.48,0.296,0.66,0.428c0.178-0.132,0.398-0.28,0.66-0.428c0.939-0.548,2.002-0.841,3.09-0.85c0.414,0,0.75,0.335,0.75,0.75c0,0.414-0.336,0.75-0.75,0.75c-0.959,0-1.766,0.319-2.348,0.65c-0.229,0.132-0.446,0.278-0.652,0.442v6.407h0.75c0.414,0,0.75,0.335,0.75,0.75c0,0.414-0.336,0.75-0.75,0.75h-0.75v6.407c0.148,0.12,0.371,0.281,0.652,0.442c0.582,0.331,1.389,0.65,2.348,0.65c0.414,0,0.75,0.335,0.75,0.75c0,0.414-0.336,0.75-0.75,0.75c-1.088-0.01-2.15-0.302-3.09-0.85c-0.229-0.129-0.449-0.271-0.66-0.425c-0.212,0.155-0.433,0.297-0.66,0.428c-0.939,0.546-2.004,0.837-3.09,0.848c-0.415,0-0.75-0.335-0.75-0.75c0-0.414,0.335-0.75,0.75-0.75c0.957,0,1.765-0.319,2.346-0.651c0.281-0.16,0.502-0.319,0.654-0.439v-6.41H10.5c-0.415,0-0.75-0.336-0.75-0.75c0-0.415,0.335-0.75,0.75-0.75h0.75V4.843c-0.207-0.164-0.426-0.311-0.654-0.442C9.884,3.984,9.075,3.759,8.25,3.75C7.835,3.75,7.5,3.414,7.5,3z"/><path fill="currentColor" d="M15,7.5h6c0.828,0,1.5,0.671,1.5,1.5v6c0,0.829-0.672,1.5-1.5,1.5h-6V18h6c1.656,0,3-1.344,3-3V9c0-1.657-1.344-3-3-3h-6V7.5z M9,7.5V6H3C1.343,6,0,7.343,0,9v6c0,1.656,1.343,3,3,3h6v-1.5H3c-0.829,0-1.5-0.671-1.5-1.5V9c0-0.829,0.671-1.5,1.5-1.5H9z"/>', '0 0 24 24');
        } else {
            var msgBarButton = false;
        }
        if (document.querySelector('.membersWrap-2h-GB4')) {
            var membersListButton = this.addToolbarIcon('Members List', '<path fill="currentColor" d="M6.5,17c0,0-1.5,0-1.5-1.5s1.5-6,7.5-6s7.5,4.5,7.5,6S18.5,17,18.5,17H6.5z M12.5,8C14.984,8,17,5.985,17,3.5S14.984-1,12.5-1S8,1.015,8,3.5S10.016,8,12.5,8z"/><path fill="currentColor" d="M3.824,17C3.602,16.531,3.49,16.019,3.5,15.5c0-2.033,1.021-4.125,2.904-5.58C5.464,9.631,4.483,9.488,3.5,9.5c-6,0-7.5,4.5-7.5,6S-2.5,17-2.5,17H3.824z"/><path fill="currentColor" d="M2.75,8C4.821,8,6.5,6.321,6.5,4.25S4.821,0.5,2.75,0.5S-1,2.179-1,4.25S0.679,8,2.75,8z"/>', '-4 -4 24 24');
        } else {
            var membersListButton = false;
        }
        var windowBarButton = this.addToolbarIcon('Window Bar', '<path fill="currentColor" d="M0.143,2.286c0.395,0,0.714-0.319,0.714-0.714c0-0.395-0.319-0.714-0.714-0.714c-0.395,0-0.714,0.32-0.714,0.714C-0.571,1.966-0.252,2.286,0.143,2.286z M3,1.571c0,0.395-0.319,0.714-0.714,0.714c-0.395,0-0.714-0.319-0.714-0.714c0-0.395,0.32-0.714,0.714-0.714C2.681,0.857,3,1.177,3,1.571z M4.429,2.286c0.395,0,0.714-0.319,0.714-0.714c0-0.395-0.32-0.714-0.714-0.714c-0.395,0-0.714,0.32-0.714,0.714C3.714,1.966,4.034,2.286,4.429,2.286z"/><path fill="currentColor" d="M-0.571-2c-1.578,0-2.857,1.279-2.857,2.857v14.286c0,1.578,1.279,2.857,2.857,2.857h17.143c1.577,0,2.857-1.279,2.857-2.857V0.857c0-1.578-1.28-2.857-2.857-2.857H-0.571z M18,0.857v2.857H-2V0.857c0-0.789,0.64-1.428,1.429-1.428h17.143C17.361-0.571,18,0.068,18,0.857z M-0.571,16.571C-1.36,16.571-2,15.933-2,15.143v-10h20v10c0,0.79-0.639,1.429-1.429,1.429H-0.571z"/>', '-4 -4 24 24');
        
        // Read stored user data to decide active state of Server List button
        if (BdApi.getData('CollapsibleUI', 'serverListButtonActive') === 'false') {
            serverListButton.classList.remove('selected-1GqIat');
            document.querySelector('.wrapper-3NnKdC').style.width = '0px';
        } else if (BdApi.getData('CollapsibleUI', 'serverListButtonActive') === 'true') {
            serverListButton.classList.add('selected-1GqIat');
        } else {
            BdApi.setData('CollapsibleUI', 'serverListButtonActive', 'true');
            serverListButton.classList.add('selected-1GqIat');
        }

        // Read stored user data to decide active state of Channel List button
        if (BdApi.getData('CollapsibleUI', 'channelListButtonActive') === 'false') {
            channelListButton.classList.remove('selected-1GqIat');
            document.querySelector('.sidebar-2K8pFh').style.width = '0px';
        } else if (BdApi.getData('CollapsibleUI', 'channelListButtonActive') === 'true') {
            channelListButton.classList.add('selected-1GqIat');
        } else {
            BdApi.setData('CollapsibleUI', 'channelListButtonActive', 'true');
            channelListButton.classList.add('selected-1GqIat');
        }

        // Read stored user data to decide active state of Message Bar button
        if (msgBarButton) {
            if (BdApi.getData('CollapsibleUI', 'msgBarButtonActive') === 'false') {
                msgBarButton.classList.remove('selected-1GqIat');
                document.querySelector('.form-2fGMdU').style.maxHeight = '0px';
            } else if (BdApi.getData('CollapsibleUI', 'msgBarButtonActive') === 'true') {
                msgBarButton.classList.add('selected-1GqIat');
            } else {
                BdApi.setData('CollapsibleUI', 'msgBarButtonActive', 'true');
                msgBarButton.classList.add('selected-1GqIat');
            }
        }

        // Read stored user data to decide active state of Members List button
        if (membersListButton) {
            if (BdApi.getData('CollapsibleUI', 'membersListButtonActive') === 'false') {
                membersListButton.classList.remove('selected-1GqIat');
                document.querySelector('.membersWrap-2h-GB4').style.maxWidth = '0px';
                document.querySelector('.membersWrap-2h-GB4').style.minWidth = '0px';
            } else if (BdApi.getData('CollapsibleUI', 'membersListButtonActive') === 'true') {
                membersListButton.classList.add('selected-1GqIat');
            } else {
                BdApi.setData('CollapsibleUI', 'membersListButtonActive', 'true');
                membersListButton.classList.add('selected-1GqIat');
            }
        }

        // Read stored user data to decide active state of Window Bar button
        if (BdApi.getData('CollapsibleUI', 'windowBarButtonActive') === 'false') {
            windowBarButton.classList.remove('selected-1GqIat');
            document.querySelector('.typeWindows-1za-n7').style.height = '0px';
            document.querySelector('.typeWindows-1za-n7').style.padding = '0';
            document.querySelector('.typeWindows-1za-n7').style.margin = '0';
            document.querySelector('.wordmark-2iDDfm').style.display = 'none';
        } else if (BdApi.getData('CollapsibleUI', 'windowBarButtonActive') === 'true') {
            windowBarButton.classList.add('selected-1GqIat');
        } else {
            BdApi.setData('CollapsibleUI', 'windowBarButtonActive', 'true');
            windowBarButton.classList.add('selected-1GqIat');
        }

        // Add event listener to the Server List button to update the icon, UI, & settings on click
        serverListButton.addEventListener('click', function(){
            if (BdApi.getData('CollapsibleUI', 'serverListButtonActive') === 'true') {
                document.querySelector('.wrapper-3NnKdC').style.width = '0px';
                BdApi.setData('CollapsibleUI', 'serverListButtonActive', 'false');
                this.classList.remove('selected-1GqIat');
            } else {
                document.querySelector('.wrapper-3NnKdC').style.removeProperty('width');
                BdApi.setData('CollapsibleUI', 'serverListButtonActive', 'true');
                this.classList.add('selected-1GqIat');
            }
        });

        // Add event listener to the Channel List button to update the icon, UI, & settings on click
        channelListButton.addEventListener('click', function(){
            if (BdApi.getData('CollapsibleUI', 'channelListButtonActive') === 'true') {
                document.querySelector('.sidebar-2K8pFh').style.width = '0px';
                BdApi.setData('CollapsibleUI', 'channelListButtonActive', 'false');
                this.classList.remove('selected-1GqIat');
            } else {
                document.querySelector('.sidebar-2K8pFh').style.removeProperty('width');
                BdApi.setData('CollapsibleUI', 'channelListButtonActive', 'true');
                this.classList.add('selected-1GqIat');
            }
        });

        // Add event listener to the Message Bar button to update the icon, UI, & settings on click
        if (msgBarButton) {
            msgBarButton.addEventListener('click', function(){
                if (BdApi.getData('CollapsibleUI', 'msgBarButtonActive') === 'true') {
                    document.querySelector('.form-2fGMdU').style.maxHeight = '0px';
                    BdApi.setData('CollapsibleUI', 'msgBarButtonActive', 'false');
                    this.classList.remove('selected-1GqIat');
                } else {
                    document.querySelector('.form-2fGMdU').style.maxHeight = '80px';
                    BdApi.setData('CollapsibleUI', 'msgBarButtonActive', 'true');
                    this.classList.add('selected-1GqIat');
                }
            });
        }

        // Add event listener to the Members List button to update the icon, UI, & settings on click
        if (membersListButton) {
            membersListButton.addEventListener('click', function(){
                if (BdApi.getData('CollapsibleUI', 'membersListButtonActive') === 'true') {
                    document.querySelector('.membersWrap-2h-GB4').style.maxWidth = '0px';
                    document.querySelector('.membersWrap-2h-GB4').style.minWidth = '0px';
                    BdApi.setData('CollapsibleUI', 'membersListButtonActive', 'false');
                    this.classList.remove('selected-1GqIat');
                } else {
                    document.querySelector('.membersWrap-2h-GB4').style.maxWidth = '240px';
                    document.querySelector('.membersWrap-2h-GB4').style.removeProperty('min-width');
                    BdApi.setData('CollapsibleUI', 'membersListButtonActive', 'true');
                    this.classList.add('selected-1GqIat');
                }
            });
        }

        // Add event listener to the Window Bar button to update the icon, UI, & settings on click
        windowBarButton.addEventListener('click', function(){
            if (BdApi.getData('CollapsibleUI', 'windowBarButtonActive') === 'true') {
                document.querySelector('.typeWindows-1za-n7').style.height = '0px';
                document.querySelector('.typeWindows-1za-n7').style.padding = '0';
                document.querySelector('.typeWindows-1za-n7').style.margin = '0';
                document.querySelector('.wordmark-2iDDfm').style.display = 'none';
                BdApi.setData('CollapsibleUI', 'windowBarButtonActive', 'false');
                this.classList.remove('selected-1GqIat');
            } else {
                document.querySelector('.typeWindows-1za-n7').style.height = '18px';
                document.querySelector('.typeWindows-1za-n7').style.removeProperty('padding');
                document.querySelector('.typeWindows-1za-n7').style.removeProperty('margin');
                document.querySelector('.wordmark-2iDDfm').style.removeProperty('display');
                BdApi.setData('CollapsibleUI', 'windowBarButtonActive', 'true');
                this.classList.add('selected-1GqIat');
            }
        });
    }

    // Initialize the plugin when it is enabled
    async start() {
        
        // Wait for current user session to finish loading
        while (!document.body.hasAttribute('data-current-user-id')) {
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
        
        // Wait for an additional second because FSR the message bar won't collapse correctly otherwise
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.initialize();
        console.log('[CollapsibleUI] version 2.0.0 has started.');
    }

    // Restore the default UI when the plugin is disabled
    stop() {
        
        // Remove CollapsibleUI icons
        document.querySelectorAll('.collapsible-ui-element').forEach(e => e.remove());
        
        // Re-enable the original Members List icon
        document.querySelector('.search-36MZv-').previousElementSibling.style.removeProperty('display');
        
        // Expand any collapsed elements & remove transitions
        document.querySelector('.wordmark-2iDDfm').style.removeProperty('display');
        document.querySelector('.sidebar-2K8pFh').style.removeProperty('width');
        document.querySelector('.sidebar-2K8pFh').style.removeProperty('transition');
        document.querySelector('.wrapper-3NnKdC').style.removeProperty('width');
        document.querySelector('.wrapper-3NnKdC').style.removeProperty('transition');
        document.querySelector('.typeWindows-1za-n7').style.removeProperty('height');
        document.querySelector('.typeWindows-1za-n7').style.removeProperty('padding');
        document.querySelector('.typeWindows-1za-n7').style.removeProperty('margin');
        document.querySelector('.typeWindows-1za-n7').style.removeProperty('overflow');
        document.querySelector('.typeWindows-1za-n7').style.removeProperty('transition');
        if (document.querySelector('.membersWrap-2h-GB4')) {
            document.querySelector('.membersWrap-2h-GB4').style.removeProperty('max-width');
            document.querySelector('.membersWrap-2h-GB4').style.removeProperty('min-width');
            document.querySelector('.membersWrap-2h-GB4').style.removeProperty('overflow');
            document.querySelector('.membersWrap-2h-GB4').style.removeProperty('transition');
        }
        if (document.querySelector('.form-2fGMdU')) {
            document.querySelector('.form-2fGMdU').style.removeProperty('max-height');
            document.querySelector('.form-2fGMdU').style.removeProperty('transition');
        }
        
        console.log('[CollapsibleUI] version 2.0.0 has stopped.');
    }

    // Re-initialize the plugin on channel/server switch to maintain icon availability
    onSwitch() {
        this.initialize();
    }

    // Adds a new SVG icon to the toolbar
    addToolbarIcon(ariaLabel, rawSVGData, viewBox) {

        // Create the icon and define properties
        var newToolbarIcon = document.createElement('div');
            newToolbarIcon.classList.add('iconWrapper-2OrFZ1');
            newToolbarIcon.classList.add('clickable-3rdHwn');
            newToolbarIcon.classList.add('collapsible-ui-element');
            newToolbarIcon.setAttribute('role', 'button');
            newToolbarIcon.setAttribute('aria-label', ariaLabel);
            newToolbarIcon.setAttribute('tabindex', '0');
            newToolbarIcon.innerHTML = '<svg x="0" y="0" class="icon-22AiRD" aria-hidden="false" width="24" height="24" viewBox="' + viewBox + '">' + rawSVGData + '</svg>';
        
        // Insert icon to the left of the search bar
        document.querySelector('.toolbar-1t6TWx').insertBefore(newToolbarIcon, document.querySelector('.search-36MZv-'));

        // Return DOM Element of newly-created toolbar icon
        return newToolbarIcon;

    }

}