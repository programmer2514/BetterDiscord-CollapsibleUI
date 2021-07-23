/**
 * @name CollapsibleUI
 * @author programmer2514
 * @description A simple plugin that allows collapsing various sections of the Discord UI.
 * @version 1.1.0
 * @website https://github.com/programmer2514/BetterDiscord-CollapsibleUI
 * @source https://raw.githubusercontent.com/programmer2514/BetterDiscord-CollapsibleUI/main/CollapsibleUI.plugin.js
 */

module.exports = class CollapsibleUI {

    // Main plugin code, called by start() and onSwitch()
    initialize() {

        // Purge CollapsibleUI toolbar icons
        document.querySelectorAll('.collapsible-ui-element').forEach(e => e.remove());

        // Define & add new toolbar icons
        var serverListButton = this.addToolbarIcon('Server List', '<path fill="currentColor" d="M2,3v18c0,0.6,0.4,1,1,1h5V2H3C2.4,2,2,2.4,2,3z M21,2H10v9h12V3C22,2.4,21.6,2,21,2z M10,22h11c0.6,0,1-0.4,1-1v-8H10V22z"/>', '0 0 24 24');
        var channelListButton = this.addToolbarIcon('Channel List', '<path fill="currentColor" d="M7,8h14c0.6,0,1-0.4,1-1s-0.4-1-1-1H7C6.4,6,6,6.4,6,7S6.4,8,7,8z M21,11H7c-0.6,0-1,0.4-1,1s0.4,1,1,1h14c0.6,0,1-0.4,1-1S21.6,11,21,11z M21,16H7c-0.6,0-1,0.4-1,1s0.4,1,1,1h14c0.6,0,1-0.4,1-1S21.6,16,21,16z M3.7,6.3C3.6,6.2,3.5,6.1,3.4,6.1C3,5.9,2.6,6,2.3,6.3C2.2,6.4,2.1,6.5,2.1,6.6C2,6.9,2,7.1,2.1,7.4c0.1,0.1,0.1,0.2,0.2,0.3c0.1,0.1,0.2,0.2,0.3,0.2C2.7,8,2.9,8,3,8c0.3,0,0.5-0.1,0.7-0.3c0.1-0.1,0.2-0.2,0.2-0.3C4,7.1,4,6.9,3.9,6.6C3.9,6.5,3.8,6.4,3.7,6.3z M3.7,11.3C3.4,11,3,10.9,2.6,11.1c-0.1,0.1-0.2,0.1-0.3,0.2c-0.1,0.1-0.2,0.2-0.2,0.3c-0.1,0.2-0.1,0.5,0,0.8c0.1,0.1,0.1,0.2,0.2,0.3c0.1,0.1,0.2,0.2,0.3,0.2C2.7,13,2.9,13,3,13c0.1,0,0.3,0,0.4-0.1c0.1-0.1,0.2-0.1,0.3-0.2c0.1-0.1,0.2-0.2,0.2-0.3c0.1-0.2,0.1-0.5,0-0.8C3.9,11.5,3.8,11.4,3.7,11.3z M3.7,16.3c-0.1-0.1-0.2-0.2-0.3-0.2c-0.2-0.1-0.5-0.1-0.8,0c-0.1,0-0.2,0.1-0.3,0.2c-0.1,0.1-0.2,0.2-0.2,0.3C1.9,17,2,17.4,2.3,17.7c0.1,0.1,0.2,0.2,0.3,0.2C2.7,18,2.9,18,3,18c0.1,0,0.3,0,0.4-0.1c0.1-0.1,0.2-0.1,0.3-0.2C4,17.4,4.1,17,3.9,16.6C3.9,16.5,3.8,16.4,3.7,16.3z"/>', '0 0 24 24');

        // Read stored user data to decide active state of Server List button
        if (BdApi.getData('CollapsibleUI', 'serverListButtonActive') === true) {
            serverListButton.classList.add('selected-1GqIat');
        } else {
            serverListButton.classList.remove('selected-1GqIat');
            document.querySelector('[aria-label="Servers sidebar"]').style.display = "none";
        }

        // Read stored user data to decide active state of Channel List button
        if (BdApi.getData('CollapsibleUI', 'channelListButtonActive') === true) {
            channelListButton.classList.add('selected-1GqIat');
        } else {
            channelListButton.classList.remove('selected-1GqIat');
            document.querySelector('.sidebar-2K8pFh').style.display = "none";
        }

        // Add event listener to the Server List button to update the icon, UI, & settings on click
        serverListButton.addEventListener('click', function(){
            if (BdApi.getData('CollapsibleUI', 'serverListButtonActive') === true) {
                document.querySelector('[aria-label="Servers sidebar"]').style.display = "none";
                BdApi.setData('CollapsibleUI', 'serverListButtonActive', false);
                this.classList.remove('selected-1GqIat');
            } else {
                document.querySelector('[aria-label="Servers sidebar"]').style.display = "initial";
                BdApi.setData('CollapsibleUI', 'serverListButtonActive', true);
                this.classList.add('selected-1GqIat');
            }
        });

        // Add event listener to the Channel List button to update the icon, UI, & settings on click
        channelListButton.addEventListener('click', function(){
            if (BdApi.getData('CollapsibleUI', 'channelListButtonActive')) {
                document.querySelector('.sidebar-2K8pFh').style.display = "none";
                BdApi.setData('CollapsibleUI', 'channelListButtonActive', false);
                this.classList.remove('selected-1GqIat');
            } else {
                document.querySelector('.sidebar-2K8pFh').style.display = "flex";
                BdApi.setData('CollapsibleUI', 'channelListButtonActive', true);
                this.classList.add('selected-1GqIat');
            }
        });
    }

    // Initialize the plugin when it is enabled
    start() {
        this.initialize();
        console.log("[CollapsibleUI] version 1.0.0 has started.");
    }

    // Remove the icons created by the plugin when it is disabled
    stop() {
        document.querySelectorAll('.collapsible-ui-element').forEach(e => e.remove());
        console.log("[CollapsibleUI] version 1.0.0 has stopped.");
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

        var memberListIcon = document.querySelector('[aria-label="Member List"]');

        // Check for existence of "Member List" icon to decide where to insert the new icon
        // This maintains logical order of icons between servers, group chats, and DMs
        if (memberListIcon !== null) {
            document.querySelector('.toolbar-1t6TWx').insertBefore(newToolbarIcon, memberListIcon);
        } else {
            document.querySelector('.toolbar-1t6TWx').insertBefore(newToolbarIcon, document.querySelector('.search-36MZv-'));
        }

        // Return DOM Element of newly-created toolbar icon
        return newToolbarIcon;

    }

}