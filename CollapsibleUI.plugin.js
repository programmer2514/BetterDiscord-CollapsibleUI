/**
 * @name CollapsibleUI
 * @author TenorTheHusky
 * @authorId 563652755814875146
 * @description A feature-rich BetterDiscord plugin that reworks the Discord UI to be significantly more modular
 * @version 8.0.0
 * @donate https://ko-fi.com/benjaminpryor
 * @patreon https://www.patreon.com/BenjaminPryor
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
        }
      ],
      version: '8.0.0',
      description: 'A feature-rich BetterDiscord plugin that reworks the Discord UI to be significantly more modular',
      github: 'https://github.com/programmer2514/BetterDiscord-CollapsibleUI',
      github_raw: 'https://raw.githubusercontent.com/programmer2514/BetterDiscord-CollapsibleUI/main/CollapsibleUI.plugin.js'
    },
    changelog: [{
        title: '8.0.0',
        items: [
          'Fix for more Discord class/element changes',
          'Fixed elements occasionally collapsing on scroll',
          'Made User Profile panel resizable',
          'Updated plugin icons to match Discord\'s new theme more closely',
          'Made uncollapsed elements float instead of shifting other elements over (can be disabled in Settings > Dynamic Uncollapse)',
          'Added a persistent badge in the top-left showing a total of unread DMs (can be disabled in Settings > Main)'
        ]
      }, {
        title: '1.0.0 - 7.4.2',
        items: [
          `See the full changelog here:
https://programmer2514.github.io/?l=cui-changelog`
        ]
      }
    ]
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
          `The library plugin needed for ${config.info.name} is missing. \
            Please click Download Now to install it.`, {
          confirmText: 'Download Now',
          cancelText: 'Cancel',
          onConfirm: () => {
            require('request')
              .get('https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js',
              async(err, _response, body) => {
              if (err) {
                return require('electron').shell
                  .openExternal('https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js');
              }
              await new Promise(r => require('fs').writeFile(require('path')
        .join(BdApi.Plugins.folder, '0PluginLibrary.plugin.js'), body, r));
            });
          }
        });
      }
      start() {}
      stop() {}
    };
  }

  // Build plugin
  const [Plugin, Library] = ZeresPluginLibrary.buildPlugin(config);

  // Define plugin class
  return class CollapsibleUI extends Plugin {

    // Initialize the plugin when it is enabled
    start = () => {
      this.getJSON('https://api.github.com/repos/programmer2514/BetterDiscord-CollapsibleUI/releases')
      .then((data) => {
        if (data[0].tag_name.substring(1) != BdApi.Plugins.get('CollapsibleUI').version)
          BdApi.UI.showNotice(`Your version \
            (v${BdApi.Plugins.get('CollapsibleUI').version}) \
            of CollapsibleUI is outdated and may be missing features! You can \
            either wait for v${data[0].tag_name.substring(1)} to be approved, \
            or download it manually.`, { timeout: '0' });
      });

      if (Library.DiscordModules.UserStore.getCurrentUser()) {
        console.log('%c[CollapsibleUI] ' + '%cAttempting pre-load...',
          'color: #3a71c1; font-weight: 700;', '');
        this.initialize();
      }
      Library.DiscordModules.Dispatcher.subscribe('POST_CONNECTION_OPEN',
        this.initialize);
      console.log('%c[CollapsibleUI] '
        + `%c(v${BdApi.Plugins.get('CollapsibleUI').version}) `
        + '%chas started.', 'color: #3a71c1; font-weight: 700;',
        'color: #666; font-weight: 600;', '');
    }

    // Restore the default UI when the plugin is disabled
    stop = () => {
      this.terminate();
      console.log('%c[CollapsibleUI] '
        + `%c(v${BdApi.Plugins.get('CollapsibleUI').version}) `
        + '%chas stopped.', 'color: #3a71c1; font-weight: 700;',
        'color: #666; font-weight: 600;', '');
    }

    // Re-initialize the plugin on switch
    onSwitch = () => { this.initialize(); }

    // Add settings panel
    getSettingsPanel = () => {
      var zps = Library.Settings;
      var cui = this;

      // Create root settings node
      var settingsRoot = new zps.SettingPanel();

      this.settingsHandle = settingsRoot.getElement();

      // Create Main subgroup
      var groupMain = new zps.SettingGroup('Main');

      // Create main settings
      var settingDisableTransitions =
        new zps.Switch('Disable UI Transitions',
          'Disables all UI animations, but also disables Dynamic Uncollapse',
          BdApi.getData('CollapsibleUI', 'disableTransitions') === 'true');
      var settingTransitionSpeed =
        new zps.Textbox('UI Transition Speed (ms)',
          'Sets the speed of UI animations',
          BdApi.getData('CollapsibleUI', 'transitionSpeed'),
          null, { placeholder: 'Default: 250' });
      var settingDisableToolbarCollapse =
        new zps.Switch('Disable Toolbar Auto-collapse',
          'Disables the automatic collapsing of CollapsibleUI\'s toolbar icons',
          BdApi.getData('CollapsibleUI', 'disableToolbarCollapse') === 'true');
      var settingDisableSettingsCollapse =
        new zps.Switch('Disable User Settings Auto-collapse',
          'Disables the automatic collapsing of the mute/deafen and call buttons',
          BdApi.getData('CollapsibleUI', 'disableSettingsCollapse') === 'true');
      var settingDisableMsgBarBtnCollapse =
        new zps.Switch('Disable Message Bar Button Auto-collapse',
          'Disables the automatic collapsing of the GIF, sticker, emoji, and \
            gift buttons',
          BdApi.getData('CollapsibleUI', 'disableMsgBarBtnCollapse') === 'true');
      var settingEnableFullToolbarCollapse =
        new zps.Switch('Enable Full Toolbar Auto-collapse',
          'Enables the automatic collapsing of the full vanilla Discord toolbar',
          BdApi.getData('CollapsibleUI', 'enableFullToolbarCollapse') === 'true');
      var settingResizableChannelList =
        new zps.Switch('Resizable Channel List',
          'Allows the channel list to be resized horizontally by \
            clicking-and-dragging on its bottom-right corner',
          BdApi.getData('CollapsibleUI', 'resizableChannelList') === 'true');
      var settingResizableMembersList =
        new zps.Switch('Resizable Members List',
          'Allows the members list to be resized horizontally by \
            clicking-and-dragging on its bottom-left corner',
          BdApi.getData('CollapsibleUI', 'resizableMembersList') === 'true');
      var settingResizableUserProfile =
        new zps.Switch('Resizable User Profile',
          'Allows the user profile to be resized horizontally by \
            clicking-and-dragging on its bottom-left corner',
          BdApi.getData('CollapsibleUI', 'resizableUserProfile') === 'true');
      var settingPersistentUnreadBadge =
        new zps.Switch('Persistent Unread DM Badge',
          'Displays a badge next to the Discord wordmark showing the number of \
            unread DMs',
          BdApi.getData('CollapsibleUI', 'persistentUnreadBadge') === 'true');

      // Append main settings to Main subgroup
      groupMain.append(settingDisableTransitions);
      groupMain.append(settingTransitionSpeed);
      groupMain.append(settingDisableToolbarCollapse);
      groupMain.append(settingDisableSettingsCollapse);
      groupMain.append(settingDisableMsgBarBtnCollapse);
      groupMain.append(settingEnableFullToolbarCollapse);
      groupMain.append(settingResizableChannelList);
      groupMain.append(settingResizableMembersList);
      groupMain.append(settingResizableUserProfile);
      groupMain.append(settingPersistentUnreadBadge);

      // Create Keyboard Shortcuts subgroup
      var groupKB = new zps.SettingGroup('Keyboard Shortcuts');

      // Create keyboard shortcut settings
      var settingKBEnabled = new zps.Switch('Keyboard Shortcuts Enabled',
          'Enables shortcuts to collapse UI elements',
          BdApi.getData('CollapsibleUI', 'keyBindsEnabled') === 'true');
      var settingKBServerList = new zps.Textbox('Toggle Server List - Shortcut',
          'Case-insensitive. Do not use spaces. Valid modifiers are Ctrl, Alt, \
            and Shift. Ctrl+Alt cannot be combined in any order due to a \
            JavaScript limitation',
          BdApi.getData('CollapsibleUI', 'keyStringList')
            .split(',')[this.I_SERVER_LIST],
          null, { placeholder: 'Default: Alt+S' });
      var settingKBChannelList =
        new zps.Textbox('Toggle Channel List - Shortcut',
          null,
          BdApi.getData('CollapsibleUI', 'keyStringList')
            .split(',')[this.I_CHANNEL_LIST],
          null, { placeholder: 'Default: Alt+C' });
      var settingKBUserArea = new zps.Textbox('Toggle User Area - Shortcut',
          null,
          BdApi.getData('CollapsibleUI', 'keyStringList')
            .split(',')[this.I_USER_AREA],
          null, { placeholder: 'Default: Alt+U' });
      var settingKBMsgBar = new zps.Textbox('Toggle Message Bar - Shortcut',
          null,
          BdApi.getData('CollapsibleUI', 'keyStringList')
            .split(',')[this.I_MSG_BAR],
          null, { placeholder: 'Default: Alt+T' });
      var settingKBCallContainer =
        new zps.Textbox('Toggle Call Container - Shortcut',
          null,
          BdApi.getData('CollapsibleUI', 'keyStringList')
            .split(',')[this.I_CALL_CONTAINER],
          null, { placeholder: 'Default: Alt+P' });
      var settingKBWindowBar = new zps.Textbox('Toggle Window Bar - Shortcut',
          null,
          BdApi.getData('CollapsibleUI', 'keyStringList')
            .split(',')[this.I_WINDOW_BAR],
          null, { placeholder: 'Default: Alt+W' });
      var settingKBMembersList = new zps.Textbox('Toggle Members List - Shortcut',
          null,
          BdApi.getData('CollapsibleUI', 'keyStringList')
            .split(',')[this.I_MEMBERS_LIST],
          null, { placeholder: 'Default: Alt+M' });
      var settingKBProfilePanel = new zps.Textbox('Toggle User Profile - Shortcut',
          null,
          BdApi.getData('CollapsibleUI', 'keyStringList')
            .split(',')[this.I_USER_PROFILE],
          null, { placeholder: 'Default: Alt+I' });

      // Append keyboard shortcut settings to Keyboard Shortcuts subgroup
      groupKB.append(settingKBEnabled);
      groupKB.append(settingKBServerList);
      groupKB.append(settingKBChannelList);
      groupKB.append(settingKBUserArea);
      groupKB.append(settingKBMsgBar);
      groupKB.append(settingKBCallContainer);
      groupKB.append(settingKBWindowBar);
      groupKB.append(settingKBMembersList);
      groupKB.append(settingKBProfilePanel);

      // Create Dynamic Uncollapse subgroup
      var groupDU = new zps.SettingGroup('Dynamic Uncollapse');

      // Create dynamic uncollapse settings
      var settingDynamicUncollapse = new zps.Switch('Dynamic Uncollapse',
          'Makes collapsed UI elements expand when the mouse is near them. \
            When disabled, autocollapse is also disabled. Does not work with \
            transitions disabled',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapse') === 'true');
      var settingFloatingDynamicUncollapse = new zps.Switch('Floating Dynamic Uncollapse',
          'Makes dynamically uncollapsed UI elements float above other elements, \
            instead of pushing them aside',
          BdApi.getData('CollapsibleUI', 'floatingDynamicUncollapse') === 'true');
      var settingCollapsedDistance = new zps.Textbox('Collapsed Element Distance',
          'Sets the size (px) of UI elements when they are collapsed',
          BdApi.getData('CollapsibleUI', 'collapsedDistance'),
          null, { placeholder: 'Default: 0' });
      var settingButtonCollapseFudgeFactor =
        new zps.Textbox('Button Collapse Fudge Factor',
          'Sets (in px) how far the mouse has to be from a set of collapsible \
            buttons before they collapse',
          BdApi.getData('CollapsibleUI', 'buttonCollapseFudgeFactor'),
          null, { placeholder: 'Default: 10' });
      var settingDynamicUncollapseDelay =
        new zps.Textbox('Dynamic Uncollapse Delay (ms)',
          'Sets the delay before a UI element uncollapses on hover',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapseDelay'),
          null, { placeholder: 'Default: 15' });
      var settingDUDistServerList =
        new zps.Textbox('Server List - Opening Distance (px)',
          'Distance that mouse must be from element in order for it to expand',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapseDistance')
            .split(',')[this.I_SERVER_LIST],
          null, { placeholder: 'Default: 30' });
      var settingDUDistCServerList =
        new zps.Textbox('Server List - Closing Distance (px)',
          'Distance that mouse must be from element in order for it to collapse',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapseCloseDistance')
            .split(',')[this.I_SERVER_LIST],
          null, { placeholder: 'Default: 30' });
      var settingDUDistChannelList =
        new zps.Textbox('Channel List - Opening Distance (px)',
          'Distance that mouse must be from element in order for it to expand',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapseDistance')
            .split(',')[this.I_CHANNEL_LIST],
          null, { placeholder: 'Default: 30' });
      var settingDUDistCChannelList =
        new zps.Textbox('Channel List - Closing Distance (px)',
          'Distance that mouse must be from element in order for it to collapse',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapseCloseDistance')
            .split(',')[this.I_CHANNEL_LIST],
          null, { placeholder: 'Default: 30' });
      var settingDUDistUserArea =
        new zps.Textbox('User Area - Opening Distance (px)',
          'Distance that mouse must be from element in order for it to expand',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapseDistance')
            .split(',')[this.I_USER_AREA],
          null, { placeholder: 'Default: 30' });
      var settingDUDistCUserArea =
        new zps.Textbox('User Area - Closing Distance (px)',
          'Distance that mouse must be from element in order for it to collapse',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapseCloseDistance')
            .split(',')[this.I_USER_AREA],
          null, { placeholder: 'Default: 30' });
      var settingDUDistMsgBar =
        new zps.Textbox('Message Bar - Opening Distance (px)',
          'Distance that mouse must be from element in order for it to expand',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapseDistance')
            .split(',')[this.I_MSG_BAR],
          null, { placeholder: 'Default: 30' });
      var settingDUDistCMsgBar =
        new zps.Textbox('Message Bar - Closing Distance (px)',
          'Distance that mouse must be from element in order for it to collapse',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapseCloseDistance')
            .split(',')[this.I_MSG_BAR],
          null, { placeholder: 'Default: 30' });
      var settingDUDistCallContainer =
        new zps.Textbox('Call Container - Opening Distance (px)',
          'Distance that mouse must be from element in order for it to expand',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapseDistance')
            .split(',')[this.I_CALL_CONTAINER],
          null, { placeholder: 'Default: 30' });
      var settingDUDistCCallContainer =
        new zps.Textbox('Call Container - Closing Distance (px)',
          'Distance that mouse must be from element in order for it to collapse',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapseCloseDistance')
            .split(',')[this.I_CALL_CONTAINER],
          null, { placeholder: 'Default: 30' });
      var settingDUDistWindowBar =
        new zps.Textbox('Window Bar - Opening Distance (px)',
          'Distance that mouse must be from element in order for it to expand',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapseDistance')
            .split(',')[this.I_WINDOW_BAR],
          null, { placeholder: 'Default: 30' });
      var settingDUDistCWindowBar =
        new zps.Textbox('Window Bar - Closing Distance (px)',
          'Distance that mouse must be from element in order for it to collapse',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapseCloseDistance')
            .split(',')[this.I_WINDOW_BAR],
          null, { placeholder: 'Default: 30' });
      var settingDUDistMembersList =
        new zps.Textbox('Members List - Opening Distance (px)',
          'Distance that mouse must be from element in order for it to expand',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapseDistance')
            .split(',')[this.I_MEMBERS_LIST],
          null, { placeholder: 'Default: 30' });
      var settingDUDistCMembersList =
        new zps.Textbox('Members List - Closing Distance (px)',
          'Distance that mouse must be from element in order for it to collapse',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapseCloseDistance')
            .split(',')[this.I_MEMBERS_LIST],
          null, { placeholder: 'Default: 30' });
      var settingDUDistProfilePanel =
        new zps.Textbox('User Profile - Opening Distance (px)',
          'Distance that mouse must be from element in order for it to expand',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapseDistance')
            .split(',')[this.I_USER_PROFILE],
          null, { placeholder: 'Default: 30' });
      var settingDUDistCProfilePanel =
        new zps.Textbox('User Profile - Closing Distance (px)',
          'Distance that mouse must be from element in order for it to collapse',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapseCloseDistance')
            .split(',')[this.I_USER_PROFILE],
          null, { placeholder: 'Default: 30' });

      // Append autocollapse settings to Autocollapse subgroup
      groupDU.append(settingDynamicUncollapse);
      groupDU.append(settingFloatingDynamicUncollapse);
      groupDU.append(settingCollapsedDistance);
      groupDU.append(settingButtonCollapseFudgeFactor);
      groupDU.append(settingDynamicUncollapseDelay);
      groupDU.append(settingDUDistServerList);
      groupDU.append(settingDUDistCServerList);
      groupDU.append(settingDUDistChannelList);
      groupDU.append(settingDUDistCChannelList);
      groupDU.append(settingDUDistUserArea);
      groupDU.append(settingDUDistCUserArea);
      groupDU.append(settingDUDistMsgBar);
      groupDU.append(settingDUDistCMsgBar);
      groupDU.append(settingDUDistCallContainer);
      groupDU.append(settingDUDistCCallContainer);
      groupDU.append(settingDUDistWindowBar);
      groupDU.append(settingDUDistCWindowBar);
      groupDU.append(settingDUDistMembersList);
      groupDU.append(settingDUDistCMembersList);
      groupDU.append(settingDUDistProfilePanel);
      groupDU.append(settingDUDistCProfilePanel);

      // Create Selective Dynamic Uncollapse subgroup
      var groupSDU = new zps.SettingGroup('Selective Dynamic Uncollapse');

      // Create selective dynamic uncollapse settings
      var settingDUServerList = new zps.Switch('Server List',
          'Toggles Dynamic Uncollapse for the server list',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled')
            .split(',')[this.I_SERVER_LIST] === 'true');
      var settingDUChannelList = new zps.Switch('Channel List',
          'Toggles Dynamic Uncollapse for the channel list',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled')
            .split(',')[this.I_CHANNEL_LIST] === 'true');
      var settingDUUserArea = new zps.Switch('User Area',
          'Toggles Dynamic Uncollapse for the user area',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled')
            .split(',')[this.I_USER_AREA] === 'true');
      var settingDUMsgBar = new zps.Switch('Message Bar',
          'Toggles Dynamic Uncollapse for the message bar',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled')
            .split(',')[this.I_MSG_BAR] === 'true');
      var settingDUCallContainer = new zps.Switch('Call Container',
          'Toggles Dynamic Uncollapse for the call container',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled')
            .split(',')[this.I_CALL_CONTAINER] === 'true');
      var settingDUWindowBar = new zps.Switch('Window Bar',
          'Toggles Dynamic Uncollapse for the window bar',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled')
            .split(',')[this.I_WINDOW_BAR] === 'true');
      var settingDUMembersList = new zps.Switch('Members List',
          'Toggles Dynamic Uncollapse for the members list',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled')
            .split(',')[this.I_MEMBERS_LIST] === 'true');
      var settingDUProfilePanel = new zps.Switch('User Profile',
          'Toggles Dynamic Uncollapse for the user profile',
          BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled')
            .split(',')[this.I_USER_PROFILE] === 'true');

      // Append selective dynamic uncollapse settings to
      //   Selective Dynamic Uncollapse subgroup
      groupSDU.append(settingDUServerList);
      groupSDU.append(settingDUChannelList);
      groupSDU.append(settingDUUserArea);
      groupSDU.append(settingDUMsgBar);
      groupSDU.append(settingDUCallContainer);
      groupSDU.append(settingDUWindowBar);
      groupSDU.append(settingDUMembersList);
      groupSDU.append(settingDUProfilePanel);

      // Create Autocollapse subgroup
      var groupAC = new zps.SettingGroup('Autocollapse');

      // Create autocollapse settings
      var settingACEnabled = new zps.Switch('Autocollapse Enabled',
          'Enables auto-collapse of UI elements based on window size. Does not \
            work with dynamic uncollapse disabled',
          BdApi.getData('CollapsibleUI', 'autoCollapse') === 'true');
      var settingACServerList = new zps.Textbox('Server List - Threshold',
          'Maximum width for element to remain uncollapsed. Specifies height \
            if Horizontal Server List is enabled',
          BdApi.getData('CollapsibleUI', 'autoCollapseThreshold')
            .split(',')[this.I_SERVER_LIST],
          null, { placeholder: 'Default: 500' });
      var settingACChannelList = new zps.Textbox('Channel List - Threshold',
          'Maximum width for element to remain uncollapsed',
          BdApi.getData('CollapsibleUI', 'autoCollapseThreshold')
            .split(',')[this.I_CHANNEL_LIST],
          null, { placeholder: 'Default: 600' });
      var settingACUserArea = new zps.Textbox('User Area - Threshold',
          'Maximum height for element to remain uncollapsed',
          BdApi.getData('CollapsibleUI', 'autoCollapseThreshold')
            .split(',')[this.I_USER_AREA],
          null, { placeholder: 'Default: 400' });
      var settingACMsgBar = new zps.Textbox('Message Bar - Threshold',
          'Maximum height for element to remain uncollapsed',
          BdApi.getData('CollapsibleUI', 'autoCollapseThreshold')
            .split(',')[this.I_MSG_BAR],
          null, { placeholder: 'Default: 400' });
      var settingACCallContainer = new zps.Textbox('Call Container - Threshold',
          'Maximum height for element to remain uncollapsed',
          BdApi.getData('CollapsibleUI', 'autoCollapseThreshold')
            .split(',')[this.I_CALL_CONTAINER],
          null, { placeholder: 'Default: 550' });
      var settingACWindowBar = new zps.Textbox('Window Bar - Threshold',
          'Maximum height for element to remain uncollapsed',
          BdApi.getData('CollapsibleUI', 'autoCollapseThreshold')
            .split(',')[this.I_WINDOW_BAR],
          null, { placeholder: 'Default: 200' });
      var settingACMembersList = new zps.Textbox('Members List - Threshold',
          'Maximum width for element to remain uncollapsed',
          BdApi.getData('CollapsibleUI', 'autoCollapseThreshold')
            .split(',')[this.I_MEMBERS_LIST],
          null, { placeholder: 'Default: 950' });
      var settingACProfilePanel = new zps.Textbox('User Profile - Threshold',
          'Maximum width for element to remain uncollapsed',
          BdApi.getData('CollapsibleUI', 'autoCollapseThreshold')
            .split(',')[this.I_USER_PROFILE],
          null, { placeholder: 'Default: 1000' });

      // Append autocollapse settings to Autocollapse subgroup
      groupAC.append(settingACEnabled);
      groupAC.append(settingACServerList);
      groupAC.append(settingACChannelList);
      groupAC.append(settingACUserArea);
      groupAC.append(settingACMsgBar);
      groupAC.append(settingACCallContainer);
      groupAC.append(settingACWindowBar);
      groupAC.append(settingACMembersList);
      groupAC.append(settingACProfilePanel);

      // Create Conditional Autocollapse subgroup
      var groupCA = new zps.SettingGroup('Conditional Autocollapse');

      // Create conditional autocollapse settings
      var settingCAEnabled = new zps.Switch('Conditional Autocollapse Enabled',
          'Enables auto-collapse of UI elements based on custom conditionals',
          BdApi.getData('CollapsibleUI', 'conditionalAutoCollapse') === 'true');
      var settingCAServerList = new zps.Textbox('Server List',
          'A conditional expression which, when evaluated, will cause the \
            element to collapse if it is true. When set, overrides traditional \
            autocollapse.',
          BdApi.getData('CollapsibleUI', 'autoCollapseConditionals')
            .split(',')[this.I_SERVER_LIST],
          null, { placeholder: 'Default: <blank>' });
      var settingCAChannelList = new zps.Textbox('Channel List',
          null,
          BdApi.getData('CollapsibleUI', 'autoCollapseConditionals')
            .split(',')[this.I_CHANNEL_LIST],
          null, { placeholder: 'Default: <blank>' });
      var settingCAUserArea = new zps.Textbox('User Area',
          null,
          BdApi.getData('CollapsibleUI', 'autoCollapseConditionals')
            .split(',')[this.I_USER_AREA],
          null, { placeholder: 'Default: <blank>' });
      var settingCAMsgBar = new zps.Textbox('Message Bar',
          null,
          BdApi.getData('CollapsibleUI', 'autoCollapseConditionals')
            .split(',')[this.I_MSG_BAR],
          null, { placeholder: 'Default: <blank>' });
      var settingCACallContainer = new zps.Textbox('Call Container',
          null,
          BdApi.getData('CollapsibleUI', 'autoCollapseConditionals')
            .split(',')[this.I_CALL_CONTAINER],
          null, { placeholder: 'Default: <blank>' });
      var settingCAWindowBar = new zps.Textbox('Window Bar',
          null,
          BdApi.getData('CollapsibleUI', 'autoCollapseConditionals')
            .split(',')[this.I_WINDOW_BAR],
          null, { placeholder: 'Default: <blank>' });
      var settingCAMembersList = new zps.Textbox('Members List',
          null,
          BdApi.getData('CollapsibleUI', 'autoCollapseConditionals')
            .split(',')[this.I_MEMBERS_LIST],
          null, { placeholder: 'Default: <blank>' });
      var settingCAProfilePanel = new zps.Textbox('User Profile',
          null,
          BdApi.getData('CollapsibleUI', 'autoCollapseConditionals')
            .split(',')[this.I_USER_PROFILE],
          null, { placeholder: 'Default: <blank>' });

      // Append conditional autocollapse settings to Conditional AC subgroup
      groupCA.append(settingCAEnabled);
      groupCA.append(settingCAServerList);
      groupCA.append(settingCAChannelList);
      groupCA.append(settingCAUserArea);
      groupCA.append(settingCAMsgBar);
      groupCA.append(settingCACallContainer);
      groupCA.append(settingCAWindowBar);
      groupCA.append(settingCAMembersList);
      groupCA.append(settingCAProfilePanel);

      // Create Button Customization subgroup
      var groupButtons = new zps.SettingGroup('Button Customization');

      // Create button settings
      var settingDisabledButtonsStayCollapsed =
        new zps.Switch('Disabled Buttons Stay Collapsed?',
          'When enabled, elements will remain collapsed when their \
            corresponding buttons are disabled',
          BdApi.getData('CollapsibleUI', 'disabledButtonsStayCollapsed') === 'true');
      var settingServerList = new zps.Slider('Server List',
          '[Default = 1, Disabled = 0] - Sets order index of the Server List \
            button (far left panel)',
          0,
          8,
          BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',')
            .map(Number)[this.I_SERVER_LIST],
          null, {
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          stickToMarkers: true,
          equidistant: true
        });
      var settingChannelList = new zps.Slider('Channel List',
          '[Default = 2, Disabled = 0] - Sets order index of the Channel List \
            button (big left panel)',
          0,
          8,
          BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',')
            .map(Number)[this.I_CHANNEL_LIST],
          null, {
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          stickToMarkers: true,
          equidistant: true
        });
      var settingUserArea = new zps.Slider('User Area',
          '[Default = 3, Disabled = 0] - Sets order index of the User Area \
            button (username/handle, call controls)',
          0,
          8,
          BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',')
            .map(Number)[this.I_USER_AREA],
          null, {
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          stickToMarkers: true,
          equidistant: true
        });
      var settingMsgBar = new zps.Slider('Message Bar',
          '[Default = 4, Disabled = 0] - Sets order index of the Message Bar \
            button (typing area)',
          0,
          8,
          BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',')
            .map(Number)[this.I_MSG_BAR],
          null, {
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          stickToMarkers: true,
          equidistant: true
        });
      var settingCallContainer = new zps.Slider('Call Container',
          '[Default = 5, Disabled = 0] - Sets order index of the Call \
            Container button (video chat/call controls panel)',
          0,
          8,
          BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',')
            .map(Number)[this.I_CALL_CONTAINER],
          null, {
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          stickToMarkers: true,
          equidistant: true
        });
      var settingWindowBar = new zps.Slider('Window Bar',
          '[Default = 6, Disabled = 0] - Sets order index of the Window bar \
            button (maximize/minimize/close buttons)',
          0,
          8,
          BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',')
            .map(Number)[this.I_WINDOW_BAR],
          null, {
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          stickToMarkers: true,
          equidistant: true
        });
      var settingMembersList = new zps.Slider('Members List',
          '[Default = 7, Disabled = 0] - Sets order index of the Members List \
            button (right panel)',
          0,
          8,
          BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',')
            .map(Number)[this.I_MEMBERS_LIST],
          null, {
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          stickToMarkers: true,
          equidistant: true
        });
      var settingProfilePanel = new zps.Slider('User Profile',
          '[Default = 8, Disabled = 0] - Sets order index of the User Profile \
            button (right panel in DMs)',
          0,
          8,
          BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',')
            .map(Number)[this.I_USER_PROFILE],
          null, {
          markers: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          stickToMarkers: true,
          equidistant: true
        });

      // Append button settings to Button Customization subgroup
      groupButtons.append(settingDisabledButtonsStayCollapsed);
      groupButtons.append(settingServerList);
      groupButtons.append(settingChannelList);
      groupButtons.append(settingUserArea);
      groupButtons.append(settingMsgBar);
      groupButtons.append(settingCallContainer);
      groupButtons.append(settingWindowBar);
      groupButtons.append(settingMembersList);
      groupButtons.append(settingProfilePanel);

      // Create Advanced subgroup
      var groupAdvanced = new zps.SettingGroup('Advanced');

      // Create advanced settings
      var settingSettingsButtonsMaxWidth =
        new zps.Textbox('Settings Buttons - Max Width',
          null,
          BdApi.getData('CollapsibleUI', 'settingsButtonsMaxWidth'),
          null, { placeholder: 'Default: 100' });
      var settingMessageBarButtonsMaxWidth =
        new zps.Textbox('Message Bar Buttons - Max Width',
          null,
          BdApi.getData('CollapsibleUI', 'messageBarButtonsMaxWidth'),
          null, { placeholder: 'Default: 200' });
      var settingMessageBarButtonsMinWidth =
        new zps.Textbox('Message Bar Buttons - Collapsed Width',
          null,
          BdApi.getData('CollapsibleUI', 'messageBarButtonsMinWidth'),
          null, { placeholder: 'Default: 40' });
      var settingToolbarIconMaxWidth =
        new zps.Textbox('Toolbar Icons - Max Width',
          null,
          BdApi.getData('CollapsibleUI', 'toolbarIconMaxWidth'),
          null, { placeholder: 'Default: 300' });
      var settingToolbarMaxWidth = new zps.Textbox('Toolbar - Max Width',
          null,
          BdApi.getData('CollapsibleUI', 'toolbarMaxWidth'),
          null, { placeholder: 'Default: 800' });
      var settingUserAreaMaxHeight = new zps.Textbox('User Area - Max Height',
          null,
          BdApi.getData('CollapsibleUI', 'userAreaMaxHeight'),
          null, { placeholder: 'Default: 300' });
      var settingMsgBarMaxHeight = new zps.Textbox('Message Bar - Max Height',
          null,
          BdApi.getData('CollapsibleUI', 'msgBarMaxHeight'),
          null, { placeholder: 'Default: 400' });
      var settingWindowBarHeight = new zps.Textbox('Window Bar - Height',
          null,
          BdApi.getData('CollapsibleUI', 'windowBarHeight'),
          null, { placeholder: 'Default: 18' });

      // Append advanced settings to Advanced subgroup
      groupAdvanced.append(settingSettingsButtonsMaxWidth);
      groupAdvanced.append(settingMessageBarButtonsMaxWidth);
      groupAdvanced.append(settingMessageBarButtonsMinWidth);
      groupAdvanced.append(settingToolbarIconMaxWidth);
      groupAdvanced.append(settingToolbarMaxWidth);
      groupAdvanced.append(settingUserAreaMaxHeight);
      groupAdvanced.append(settingMsgBarMaxHeight);
      groupAdvanced.append(settingWindowBarHeight);

      // Append subgroups to root node
      settingsRoot.append(groupMain);
      settingsRoot.append(groupAC);
      settingsRoot.append(groupKB);
      settingsRoot.append(groupDU);
      settingsRoot.append(groupButtons);
      settingsRoot.append(groupSDU);
      settingsRoot.append(groupCA);
      settingsRoot.append(groupAdvanced);

      var cui = this;

      // Register main settings onChange events
      settingDisableTransitions.onChange = function (result) {
        if (result)
          BdApi.setData('CollapsibleUI', 'disableTransitions', 'true');
        else
          BdApi.setData('CollapsibleUI', 'disableTransitions', 'false');
      };
      settingTransitionSpeed.onChange = function (result) {
        BdApi.setData('CollapsibleUI', 'transitionSpeed', result);
      };
      settingDisableToolbarCollapse.onChange = function (result) {
        if (result)
          BdApi.setData('CollapsibleUI', 'disableToolbarCollapse', 'true');
        else
          BdApi.setData('CollapsibleUI', 'disableToolbarCollapse', 'false');
      };
      settingDisableSettingsCollapse.onChange = function (result) {
        if (result)
          BdApi.setData('CollapsibleUI', 'disableSettingsCollapse', 'true');
        else
          BdApi.setData('CollapsibleUI', 'disableSettingsCollapse', 'false');
      };
      settingDisableMsgBarBtnCollapse.onChange = function (result) {
        if (result)
          BdApi.setData('CollapsibleUI', 'disableMsgBarBtnCollapse', 'true');
        else
          BdApi.setData('CollapsibleUI', 'disableMsgBarBtnCollapse', 'false');
      };
      settingEnableFullToolbarCollapse.onChange = function (result) {
        if (result)
          BdApi.setData('CollapsibleUI', 'enableFullToolbarCollapse', 'true');
        else
          BdApi.setData('CollapsibleUI', 'enableFullToolbarCollapse', 'false');
      };
      settingResizableChannelList.onChange = function (result) {
        if (result)
          BdApi.setData('CollapsibleUI', 'resizableChannelList', 'true');
        else
          BdApi.setData('CollapsibleUI', 'resizableChannelList', 'false');
      };
      settingResizableMembersList.onChange = function (result) {
        if (result)
          BdApi.setData('CollapsibleUI', 'resizableMembersList', 'true');
        else
          BdApi.setData('CollapsibleUI', 'resizableMembersList', 'false');
      };
      settingResizableUserProfile.onChange = function (result) {
        if (result)
          BdApi.setData('CollapsibleUI', 'resizableUserProfile', 'true');
        else
          BdApi.setData('CollapsibleUI', 'resizableUserProfile', 'false');
      };
      settingPersistentUnreadBadge.onChange = function (result) {
        cui.updateDMBadge(!result);
        if (result)
          BdApi.setData('CollapsibleUI', 'persistentUnreadBadge', 'true');
        else
          BdApi.setData('CollapsibleUI', 'persistentUnreadBadge', 'false');
      };

      // Register button settings onChange events
      settingDisabledButtonsStayCollapsed.onChange = function (result) {
        if (result)
          BdApi.setData('CollapsibleUI', 'disabledButtonsStayCollapsed', 'true');
        else
          BdApi.setData('CollapsibleUI', 'disabledButtonsStayCollapsed', 'false');
      };
      settingServerList.onChange = function (result) {
        var newButtonsOrder = BdApi.getData('CollapsibleUI', 'buttonsOrder')
          .split(',').map(Number);
        newButtonsOrder[cui.I_SERVER_LIST] = result;
        BdApi.setData('CollapsibleUI', 'buttonsOrder', newButtonsOrder.toString());
      };
      settingChannelList.onChange = function (result) {
        var newButtonsOrder = BdApi.getData('CollapsibleUI', 'buttonsOrder')
          .split(',').map(Number);
        newButtonsOrder[cui.I_CHANNEL_LIST] = result;
        BdApi.setData('CollapsibleUI', 'buttonsOrder', newButtonsOrder.toString());
      };
      settingUserArea.onChange = function (result) {
        var newButtonsOrder = BdApi.getData('CollapsibleUI', 'buttonsOrder')
          .split(',').map(Number);
        newButtonsOrder[cui.I_USER_AREA] = result;
        BdApi.setData('CollapsibleUI', 'buttonsOrder', newButtonsOrder.toString());
      };
      settingMsgBar.onChange = function (result) {
        var newButtonsOrder = BdApi.getData('CollapsibleUI', 'buttonsOrder')
          .split(',').map(Number);
        newButtonsOrder[cui.I_MSG_BAR] = result;
        BdApi.setData('CollapsibleUI', 'buttonsOrder', newButtonsOrder.toString());
      };
      settingCallContainer.onChange = function (result) {
        var newButtonsOrder = BdApi.getData('CollapsibleUI', 'buttonsOrder')
          .split(',').map(Number);
        newButtonsOrder[cui.I_CALL_CONTAINER] = result;
        BdApi.setData('CollapsibleUI', 'buttonsOrder', newButtonsOrder.toString());
      };
      settingWindowBar.onChange = function (result) {
        var newButtonsOrder = BdApi.getData('CollapsibleUI', 'buttonsOrder')
          .split(',').map(Number);
        newButtonsOrder[cui.I_WINDOW_BAR] = result;
        BdApi.setData('CollapsibleUI', 'buttonsOrder', newButtonsOrder.toString());
      };
      settingMembersList.onChange = function (result) {
        var newButtonsOrder = BdApi.getData('CollapsibleUI', 'buttonsOrder')
          .split(',').map(Number);
        newButtonsOrder[cui.I_MEMBERS_LIST] = result;
        BdApi.setData('CollapsibleUI', 'buttonsOrder', newButtonsOrder.toString());
      };
      settingProfilePanel.onChange = function (result) {
        var newButtonsOrder = BdApi.getData('CollapsibleUI', 'buttonsOrder')
          .split(',').map(Number);
        newButtonsOrder[cui.I_USER_PROFILE] = result;
        BdApi.setData('CollapsibleUI', 'buttonsOrder', newButtonsOrder.toString());
      };

      // Register dynamic uncollapse settings onChange events
      settingDynamicUncollapse.onChange = function (result) {
        if (result)
          BdApi.setData('CollapsibleUI', 'dynamicUncollapse', 'true');
        else
          BdApi.setData('CollapsibleUI', 'dynamicUncollapse', 'false');
      };
      settingFloatingDynamicUncollapse.onChange = function (result) {
        if (result)
          BdApi.setData('CollapsibleUI', 'floatingDynamicUncollapse', 'true');
        else
          BdApi.setData('CollapsibleUI', 'floatingDynamicUncollapse', 'false');
      };
      settingCollapsedDistance.onChange = function (result) {
        BdApi.setData('CollapsibleUI', 'collapsedDistance', result);
      };
      settingButtonCollapseFudgeFactor.onChange = function (result) {
        BdApi.setData('CollapsibleUI', 'buttonCollapseFudgeFactor', result);
      };
      settingDynamicUncollapseDelay.onChange = function (result) {
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseDelay', result);
      };
      settingDUDistServerList.onChange = function (result) {
        cui.dynamicUncollapseDistance = BdApi.getData('CollapsibleUI',
          'dynamicUncollapseDistance').split(',');
        cui.dynamicUncollapseDistance[cui.I_SERVER_LIST] = result;
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseDistance',
          cui.dynamicUncollapseDistance.toString());
      };
      settingDUDistCServerList.onChange = function (result) {
        cui.dynamicUncollapseCloseDistance = BdApi.getData('CollapsibleUI',
          'dynamicUncollapseCloseDistance').split(',');
        cui.dynamicUncollapseCloseDistance[cui.I_SERVER_LIST] = result;
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseCloseDistance',
          cui.dynamicUncollapseCloseDistance.toString());
      };
      settingDUDistChannelList.onChange = function (result) {
        cui.dynamicUncollapseDistance = BdApi.getData('CollapsibleUI',
          'dynamicUncollapseDistance').split(',');
        cui.dynamicUncollapseDistance[cui.I_CHANNEL_LIST] = result;
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseDistance',
          cui.dynamicUncollapseDistance.toString());
      };
      settingDUDistCChannelList.onChange = function (result) {
        cui.dynamicUncollapseCloseDistance = BdApi.getData('CollapsibleUI',
          'dynamicUncollapseCloseDistance').split(',');
        cui.dynamicUncollapseCloseDistance[cui.I_CHANNEL_LIST] = result;
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseCloseDistance',
          cui.dynamicUncollapseCloseDistance.toString());
      };
      settingDUDistUserArea.onChange = function (result) {
        cui.dynamicUncollapseDistance = BdApi.getData('CollapsibleUI',
          'dynamicUncollapseDistance').split(',');
        cui.dynamicUncollapseDistance[cui.I_USER_AREA] = result;
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseDistance',
          cui.dynamicUncollapseDistance.toString());
      };
      settingDUDistCUserArea.onChange = function (result) {
        cui.dynamicUncollapseCloseDistance = BdApi.getData('CollapsibleUI',
          'dynamicUncollapseCloseDistance').split(',');
        cui.dynamicUncollapseCloseDistance[cui.I_USER_AREA] = result;
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseCloseDistance',
          cui.dynamicUncollapseCloseDistance.toString());
      };
      settingDUDistMsgBar.onChange = function (result) {
        cui.dynamicUncollapseDistance = BdApi.getData('CollapsibleUI',
          'dynamicUncollapseDistance').split(',');
        cui.dynamicUncollapseDistance[cui.I_MSG_BAR] = result;
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseDistance',
          cui.dynamicUncollapseDistance.toString());
      };
      settingDUDistCMsgBar.onChange = function (result) {
        cui.dynamicUncollapseCloseDistance = BdApi.getData('CollapsibleUI',
          'dynamicUncollapseCloseDistance').split(',');
        cui.dynamicUncollapseCloseDistance[cui.I_MSG_BAR] = result;
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseCloseDistance',
          cui.dynamicUncollapseCloseDistance.toString());
      };
      settingDUDistCallContainer.onChange = function (result) {
        cui.dynamicUncollapseDistance = BdApi.getData('CollapsibleUI',
          'dynamicUncollapseDistance').split(',');
        cui.dynamicUncollapseDistance[cui.I_CALL_CONTAINER] = result;
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseDistance',
          cui.dynamicUncollapseDistance.toString());
      };
      settingDUDistCCallContainer.onChange = function (result) {
        cui.dynamicUncollapseCloseDistance = BdApi.getData('CollapsibleUI',
          'dynamicUncollapseCloseDistance').split(',');
        cui.dynamicUncollapseCloseDistance[cui.I_CALL_CONTAINER] = result;
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseCloseDistance',
          cui.dynamicUncollapseCloseDistance.toString());
      };
      settingDUDistWindowBar.onChange = function (result) {
        cui.dynamicUncollapseDistance = BdApi.getData('CollapsibleUI',
          'dynamicUncollapseDistance').split(',');
        cui.dynamicUncollapseDistance[cui.I_WINDOW_BAR] = result;
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseDistance',
          cui.dynamicUncollapseDistance.toString());
      };
      settingDUDistCWindowBar.onChange = function (result) {
        cui.dynamicUncollapseCloseDistance = BdApi.getData('CollapsibleUI',
          'dynamicUncollapseCloseDistance').split(',');
        cui.dynamicUncollapseCloseDistance[cui.I_WINDOW_BAR] = result;
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseCloseDistance',
          cui.dynamicUncollapseCloseDistance.toString());
      };
      settingDUDistMembersList.onChange = function (result) {
        cui.dynamicUncollapseDistance = BdApi.getData('CollapsibleUI',
          'dynamicUncollapseDistance').split(',');
        cui.dynamicUncollapseDistance[cui.I_MEMBERS_LIST] = result;
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseDistance',
          cui.dynamicUncollapseDistance.toString());
      };
      settingDUDistCMembersList.onChange = function (result) {
        cui.dynamicUncollapseCloseDistance = BdApi.getData('CollapsibleUI',
          'dynamicUncollapseCloseDistance').split(',');
        cui.dynamicUncollapseCloseDistance[cui.I_MEMBERS_LIST] = result;
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseCloseDistance',
          cui.dynamicUncollapseCloseDistance.toString());
      };
      settingDUDistProfilePanel.onChange = function (result) {
        cui.dynamicUncollapseDistance = BdApi.getData('CollapsibleUI',
          'dynamicUncollapseDistance').split(',');
        cui.dynamicUncollapseDistance[cui.I_USER_PROFILE] = result;
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseDistance',
          cui.dynamicUncollapseDistance.toString());
      };
      settingDUDistCProfilePanel.onChange = function (result) {
        cui.dynamicUncollapseCloseDistance = BdApi.getData('CollapsibleUI',
          'dynamicUncollapseCloseDistance').split(',');
        cui.dynamicUncollapseCloseDistance[cui.I_USER_PROFILE] = result;
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseCloseDistance',
          cui.dynamicUncollapseCloseDistance.toString());
      };

      // Register keyboard shortcut settings onChange events
      settingKBEnabled.onChange = function (result) {
        if (result)
          BdApi.setData('CollapsibleUI', 'keyBindsEnabled', 'true');
        else
          BdApi.setData('CollapsibleUI', 'keyBindsEnabled', 'false');
      };
      settingKBServerList.onChange = function (result) {
        cui.keyStringList = BdApi.getData('CollapsibleUI',
          'keyStringList').split(',');
        cui.keyStringList[cui.I_SERVER_LIST] = result;
        BdApi.setData('CollapsibleUI', 'keyStringList',
          cui.keyStringList.toString());
      };
      settingKBChannelList.onChange = function (result) {
        cui.keyStringList = BdApi.getData('CollapsibleUI',
          'keyStringList').split(',');
        cui.keyStringList[cui.I_CHANNEL_LIST] = result;
        BdApi.setData('CollapsibleUI', 'keyStringList',
          cui.keyStringList.toString());
      };
      settingKBUserArea.onChange = function (result) {
        cui.keyStringList = BdApi.getData('CollapsibleUI',
          'keyStringList').split(',');
        cui.keyStringList[cui.I_USER_AREA] = result;
        BdApi.setData('CollapsibleUI', 'keyStringList',
          cui.keyStringList.toString());
      };
      settingKBMsgBar.onChange = function (result) {
        cui.keyStringList = BdApi.getData('CollapsibleUI',
          'keyStringList').split(',');
        cui.keyStringList[cui.I_MSG_BAR] = result;
        BdApi.setData('CollapsibleUI', 'keyStringList',
          cui.keyStringList.toString());
      };
      settingKBCallContainer.onChange = function (result) {
        cui.keyStringList = BdApi.getData('CollapsibleUI',
          'keyStringList').split(',');
        cui.keyStringList[cui.I_CALL_CONTAINER] = result;
        BdApi.setData('CollapsibleUI', 'keyStringList',
          cui.keyStringList.toString());
      };
      settingKBWindowBar.onChange = function (result) {
        cui.keyStringList = BdApi.getData('CollapsibleUI',
          'keyStringList').split(',');
        cui.keyStringList[cui.I_WINDOW_BAR] = result;
        BdApi.setData('CollapsibleUI', 'keyStringList',
          cui.keyStringList.toString());
      };
      settingKBMembersList.onChange = function (result) {
        cui.keyStringList = BdApi.getData('CollapsibleUI',
          'keyStringList').split(',');
        cui.keyStringList[cui.I_MEMBERS_LIST] = result;
        BdApi.setData('CollapsibleUI', 'keyStringList',
          cui.keyStringList.toString());
      };
      settingKBProfilePanel.onChange = function (result) {
        cui.keyStringList = BdApi.getData('CollapsibleUI',
          'keyStringList').split(',');
        cui.keyStringList[cui.I_USER_PROFILE] = result;
        BdApi.setData('CollapsibleUI', 'keyStringList',
          cui.keyStringList.toString());
      };

      // Register conditional autocollapse settings onChange events
      settingCAEnabled.onChange = function (result) {
        if (result)
          BdApi.setData('CollapsibleUI', 'conditionalAutoCollapse', 'true');
        else
          BdApi.setData('CollapsibleUI', 'conditionalAutoCollapse', 'false');
      };
      settingCAServerList.onChange = function (result) {
        cui.autoCollapseConditionals = BdApi.getData('CollapsibleUI',
          'autoCollapseConditionals').split(',');
        cui.autoCollapseConditionals[cui.I_SERVER_LIST] = result;
        BdApi.setData('CollapsibleUI', 'autoCollapseConditionals',
          cui.autoCollapseConditionals.toString());
      };
      settingCAChannelList.onChange = function (result) {
        cui.autoCollapseConditionals = BdApi.getData('CollapsibleUI',
          'autoCollapseConditionals').split(',');
        cui.autoCollapseConditionals[cui.I_CHANNEL_LIST] = result;
        BdApi.setData('CollapsibleUI', 'autoCollapseConditionals',
          cui.autoCollapseConditionals.toString());
      };
      settingCAUserArea.onChange = function (result) {
        cui.autoCollapseConditionals = BdApi.getData('CollapsibleUI',
          'autoCollapseConditionals').split(',');
        cui.autoCollapseConditionals[cui.I_USER_AREA] = result;
        BdApi.setData('CollapsibleUI', 'autoCollapseConditionals',
          cui.autoCollapseConditionals.toString());
      };
      settingCAMsgBar.onChange = function (result) {
        cui.autoCollapseConditionals = BdApi.getData('CollapsibleUI',
          'autoCollapseConditionals').split(',');
        cui.autoCollapseConditionals[cui.I_MSG_BAR] = result;
        BdApi.setData('CollapsibleUI', 'autoCollapseConditionals',
          cui.autoCollapseConditionals.toString());
      };
      settingCACallContainer.onChange = function (result) {
        cui.autoCollapseConditionals = BdApi.getData('CollapsibleUI',
          'autoCollapseConditionals').split(',');
        cui.autoCollapseConditionals[cui.I_CALL_CONTAINER] = result;
        BdApi.setData('CollapsibleUI', 'autoCollapseConditionals',
          cui.autoCollapseConditionals.toString());
      };
      settingCAWindowBar.onChange = function (result) {
        cui.autoCollapseConditionals = BdApi.getData('CollapsibleUI',
          'autoCollapseConditionals').split(',');
        cui.autoCollapseConditionals[cui.I_WINDOW_BAR] = result;
        BdApi.setData('CollapsibleUI', 'autoCollapseConditionals',
          cui.autoCollapseConditionals.toString());
      };
      settingCAMembersList.onChange = function (result) {
        cui.autoCollapseConditionals = BdApi.getData('CollapsibleUI',
          'autoCollapseConditionals').split(',');
        cui.autoCollapseConditionals[cui.I_MEMBERS_LIST] = result;
        BdApi.setData('CollapsibleUI', 'autoCollapseConditionals',
          cui.autoCollapseConditionals.toString());
      };
      settingCAProfilePanel.onChange = function (result) {
        cui.autoCollapseConditionals = BdApi.getData('CollapsibleUI',
          'autoCollapseConditionals').split(',');
        cui.autoCollapseConditionals[cui.I_USER_PROFILE] = result;
        BdApi.setData('CollapsibleUI', 'autoCollapseConditionals',
          cui.autoCollapseConditionals.toString());
      };

      // Register selective dynamic uncollapse settings onChange events
      settingDUServerList.onChange = function (result) {
        cui.dynamicUncollapseEnabled = BdApi.getData('CollapsibleUI',
          'dynamicUncollapseEnabled').split(',')
          .map(x => (x == 'true') ? true : false);
        cui.dynamicUncollapseEnabled[cui.I_SERVER_LIST] = result;
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseEnabled',
          cui.dynamicUncollapseEnabled.toString());
      };
      settingDUChannelList.onChange = function (result) {
        cui.dynamicUncollapseEnabled = BdApi.getData('CollapsibleUI',
          'dynamicUncollapseEnabled').split(',')
          .map(x => (x == 'true') ? true : false);
        cui.dynamicUncollapseEnabled[cui.I_CHANNEL_LIST] = result;
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseEnabled',
          cui.dynamicUncollapseEnabled.toString());
      };
      settingDUUserArea.onChange = function (result) {
        cui.dynamicUncollapseEnabled = BdApi.getData('CollapsibleUI',
          'dynamicUncollapseEnabled').split(',')
          .map(x => (x == 'true') ? true : false);
        cui.dynamicUncollapseEnabled[cui.I_USER_AREA] = result;
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseEnabled',
          cui.dynamicUncollapseEnabled.toString());
      };
      settingDUMsgBar.onChange = function (result) {
        cui.dynamicUncollapseEnabled = BdApi.getData('CollapsibleUI',
          'dynamicUncollapseEnabled').split(',')
          .map(x => (x == 'true') ? true : false);
        cui.dynamicUncollapseEnabled[cui.I_MSG_BAR] = result;
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseEnabled',
          cui.dynamicUncollapseEnabled.toString());
      };
      settingDUCallContainer.onChange = function (result) {
        cui.dynamicUncollapseEnabled = BdApi.getData('CollapsibleUI',
          'dynamicUncollapseEnabled').split(',')
          .map(x => (x == 'true') ? true : false);
        cui.dynamicUncollapseEnabled[cui.I_CALL_CONTAINER] = result;
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseEnabled',
          cui.dynamicUncollapseEnabled.toString());
      };
      settingDUWindowBar.onChange = function (result) {
        cui.dynamicUncollapseEnabled = BdApi.getData('CollapsibleUI',
          'dynamicUncollapseEnabled').split(',')
          .map(x => (x == 'true') ? true : false);
        cui.dynamicUncollapseEnabled[cui.I_WINDOW_BAR] = result;
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseEnabled',
          cui.dynamicUncollapseEnabled.toString());
      };
      settingDUMembersList.onChange = function (result) {
        cui.dynamicUncollapseEnabled = BdApi.getData('CollapsibleUI',
          'dynamicUncollapseEnabled').split(',')
          .map(x => (x == 'true') ? true : false);
        cui.dynamicUncollapseEnabled[cui.I_MEMBERS_LIST] = result;
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseEnabled',
          cui.dynamicUncollapseEnabled.toString());
      };
      settingDUProfilePanel.onChange = function (result) {
        cui.dynamicUncollapseEnabled = BdApi.getData('CollapsibleUI',
          'dynamicUncollapseEnabled').split(',')
          .map(x => (x == 'true') ? true : false);
        cui.dynamicUncollapseEnabled[cui.I_USER_PROFILE] = result;
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseEnabled',
          cui.dynamicUncollapseEnabled.toString());
      };

      // Register autocollapse settings onChange events
      settingACEnabled.onChange = function (result) {
        if (result)
          BdApi.setData('CollapsibleUI', 'autoCollapse', 'true');
        else
          BdApi.setData('CollapsibleUI', 'autoCollapse', 'false');
      };
      settingACServerList.onChange = function (result) {
        cui.autoCollapseThreshold = BdApi.getData('CollapsibleUI',
          'autoCollapseThreshold').split(',');
        cui.autoCollapseThreshold[cui.I_SERVER_LIST] = result;
        BdApi.setData('CollapsibleUI', 'autoCollapseThreshold',
          cui.autoCollapseThreshold.toString());
      };
      settingACChannelList.onChange = function (result) {
        cui.autoCollapseThreshold = BdApi.getData('CollapsibleUI',
          'autoCollapseThreshold').split(',');
        cui.autoCollapseThreshold[cui.I_CHANNEL_LIST] = result;
        BdApi.setData('CollapsibleUI', 'autoCollapseThreshold',
          cui.autoCollapseThreshold.toString());
      };
      settingACUserArea.onChange = function (result) {
        cui.autoCollapseThreshold = BdApi.getData('CollapsibleUI',
          'autoCollapseThreshold').split(',');
        cui.autoCollapseThreshold[cui.I_USER_AREA] = result;
        BdApi.setData('CollapsibleUI', 'autoCollapseThreshold',
          cui.autoCollapseThreshold.toString());
      };
      settingACMsgBar.onChange = function (result) {
        cui.autoCollapseThreshold = BdApi.getData('CollapsibleUI',
          'autoCollapseThreshold').split(',');
        cui.autoCollapseThreshold[cui.I_MSG_BAR] = result;
        BdApi.setData('CollapsibleUI', 'autoCollapseThreshold',
          cui.autoCollapseThreshold.toString());
      };
      settingACCallContainer.onChange = function (result) {
        cui.autoCollapseThreshold = BdApi.getData('CollapsibleUI',
          'autoCollapseThreshold').split(',');
        cui.autoCollapseThreshold[cui.I_CALL_CONTAINER] = result;
        BdApi.setData('CollapsibleUI', 'autoCollapseThreshold',
          cui.autoCollapseThreshold.toString());
      };
      settingACWindowBar.onChange = function (result) {
        cui.autoCollapseThreshold = BdApi.getData('CollapsibleUI',
          'autoCollapseThreshold').split(',');
        cui.autoCollapseThreshold[cui.I_WINDOW_BAR] = result;
        BdApi.setData('CollapsibleUI', 'autoCollapseThreshold',
          cui.autoCollapseThreshold.toString());
      };
      settingACMembersList.onChange = function (result) {
        cui.autoCollapseThreshold = BdApi.getData('CollapsibleUI',
          'autoCollapseThreshold').split(',');
        cui.autoCollapseThreshold[cui.I_MEMBERS_LIST] = result;
        BdApi.setData('CollapsibleUI', 'autoCollapseThreshold',
          cui.autoCollapseThreshold.toString());
      };
      settingACProfilePanel.onChange = function (result) {
        cui.autoCollapseThreshold = BdApi.getData('CollapsibleUI',
          'autoCollapseThreshold').split(',');
        cui.autoCollapseThreshold[cui.I_USER_PROFILE] = result;
        BdApi.setData('CollapsibleUI', 'autoCollapseThreshold',
          cui.autoCollapseThreshold.toString());
      };

      // Register advanced settings onChange events
      settingSettingsButtonsMaxWidth.onChange = function (result) {
        BdApi.setData('CollapsibleUI', 'settingsButtonsMaxWidth', result);
      };
      settingMessageBarButtonsMaxWidth.onChange = function (result) {
        BdApi.setData('CollapsibleUI', 'messageBarButtonsMaxWidth', result);
      };
      settingMessageBarButtonsMinWidth.onChange = function (result) {
        BdApi.setData('CollapsibleUI', 'messageBarButtonsMinWidth', result);
      };
      settingToolbarIconMaxWidth.onChange = function (result) {
        BdApi.setData('CollapsibleUI', 'toolbarIconMaxWidth', result);
      };
      settingToolbarMaxWidth.onChange = function (result) {
        BdApi.setData('CollapsibleUI', 'toolbarMaxWidth', result);
      };
      settingUserAreaMaxHeight.onChange = function (result) {
        BdApi.setData('CollapsibleUI', 'userAreaMaxHeight', result);
      };
      settingMsgBarMaxHeight.onChange = function (result) {
        BdApi.setData('CollapsibleUI', 'msgBarMaxHeight', result);
      };
      settingWindowBarHeight.onChange = function (result) {
        BdApi.setData('CollapsibleUI', 'windowBarHeight', result);
      };

      // Return final settings page
      return this.settingsHandle;
    }

    // Main plugin code
    initialize = () => {
      try {
        this.terminate(); // Clean up UI

        // Display reloading message (dev only)
        // console.log('%c[CollapsibleUI] ' + '%cReloading...', 'color: #3a71c1; font-weight: 700;', '');

        // Constants
        this.MAX_ITER_MUTATIONS = 35;
        this.TOOLTIP_OFFSET_PX = 8;

        this.I_SERVER_LIST = 0;
        this.I_CHANNEL_LIST = 1;
        this.I_MSG_BAR = 2;
        this.I_WINDOW_BAR = 3;
        this.I_MEMBERS_LIST = 4;
        this.I_USER_AREA = 5;
        this.I_CALL_CONTAINER = 6;
        this.I_USER_PROFILE = 7;

        // Volatile variables
        this.mouseX = 0;
        this.mouseY = 0;
        this.isCollapsed = [true, true, true, true, true, true, true, true];

        // Delay handlers
        this.serverDUDelay = false;
        this.channelDUDelay = false;
        this.messageDUDelay = false;
        this.windowDUDelay = false;
        this.membersDUDelay = false;
        this.userDUDelay = false;
        this.callDUDelay = false;
        this.panelDUDelay = false;

        // Event listener handler
        this.eventListenerController = new AbortController();
        this.eventListenerSignal = this.eventListenerController.signal;

        this.abstractClassesAndElements();
        this.initPluginSettings();
        this.initThemeIntegration();
        this.initObservers();
        this.getLabels();

        // Hide default Members List/Profile Panel buttons
        if (this.membersListButton && this.membersList)
          this.membersListButton.style.display = 'none';
        if (this.profilePanelButton && this.profilePanel)
          this.profilePanelButton.style.display = 'none';

        var buttonsActive = this.initToolbar();

        if (this.dynamicUncollapse && !this.disableTransitions) {

          // Collapse vanilla toolbar
          if (this.enableFullToolbarCollapse) {
            var singleButtonWidth = this.serverListButton.getBoundingClientRect()
              .width + parseInt(window.getComputedStyle(this.serverListButton)
              .marginRight) + 'px';
            this.toolBar.style.maxWidth = singleButtonWidth;
          }

          // Collapse toolbar buttons
          if (!this.disableToolbarCollapse)
            this.collapseToolbarIcons(buttonsActive);

          // Fix settings button alignment
          if (this.settingsContainerBase)
            this.settingsContainerBase.style.justifyContent = "space-between";

          // Collapse settings buttons
          if (!this.disableSettingsCollapse) {
            // Define settings buttons array
            var settingsButtons = this.settingsContainer.children;

            // Collapse settings buttons
            for (var i = 0; i < (settingsButtons.length - 1); i++) {
              settingsButtons[i].style.maxWidth = '0px';
              if (!this.disableTransitions)
                settingsButtons[i].style.transition = 'max-width '
                  + this.transitionSpeed + 'ms';
              settingsButtons[i].style.overflow = 'hidden';
            }
          }

          // Collapse message bar buttons
          if ((!this.disableMsgBarBtnCollapse) && this.msgBarBtnContainer) {
            this.msgBarBtnContainer.style.maxWidth =
              this.messageBarButtonsMinWidth + 'px';
            if (!this.disableTransitions)
              this.msgBarBtnContainer.style.transition = 'max-width '
                + this.transitionSpeed + 'ms';
          }
        }

        this.initUI();
        this.addMiscEventListeners(buttonsActive,
          settingsButtons, singleButtonWidth);
        this.addButtonClickHandlers();

      } catch (e) {
        console.warn('%c[CollapsibleUI] ' + '%cCould not initialize toolbar! \
          (see below)  ', 'color: #3a71c1; font-weight: 700;', '');
        console.warn(e);
      }
    }

    // Terminate the plugin and undo its effects
    terminate = () => {
      try {

        // Remove CollapsibleUI icons
        document.querySelectorAll('.collapsible-ui-element')
          .forEach(e => e.remove());

        document.querySelectorAll('.' + this.classMembersListMember)
          .forEach(e => e.style.removeProperty('max-width'));

        // Re-enable the original Members List icon
        try {
          this.searchBar.previousElementSibling.style.removeProperty('display');
        } catch {}

        // Expand any collapsed elements & remove transitions
        if (this.channelList) {
          this.channelList.style.removeProperty('width');
          this.channelList.style.removeProperty('transition');
          this.channelList.style.removeProperty('resize');
          this.channelList.style.removeProperty('max-width');
          this.channelList.style.removeProperty('display');
          this.channelList.style.removeProperty('overflow');
          this.channelList.style.removeProperty('position');
          this.channelList.style.removeProperty('z-index');
          this.channelList.style.removeProperty('max-height');
          this.channelList.style.removeProperty('height');
        }
        if (this.serverList) {
          this.serverList.style.removeProperty('width');
          this.serverList.style.removeProperty('transition');
          this.serverList.style.removeProperty('display');
          this.serverList.style.removeProperty('position');
          this.serverList.style.removeProperty('z-index');
          this.serverList.style.removeProperty('max-height');
          this.serverList.style.removeProperty('overflow-y');
        }
        if (this.windowBar) {
          this.wordMark.style.removeProperty('display');
          this.windowBar.style.removeProperty('height');
          this.windowBar.style.removeProperty('opacity');
          this.windowBar.style.removeProperty('padding');
          this.windowBar.style.removeProperty('margin');
          this.windowBar.style.removeProperty('overflow');
          this.windowBar.style.removeProperty('transition');
          this.windowBar.style.removeProperty('display');
        }
        if (this.membersList) {
          this.channelList.style.removeProperty('width');
          this.channelList.style.removeProperty('resize');
          this.membersList.style.removeProperty('max-width');
          this.membersList.style.removeProperty('min-width');
          this.membersList.style.removeProperty('overflow');
          this.membersList.style.removeProperty('transition');
          this.membersList.style.removeProperty('display');
          this.membersList.style.removeProperty('transform');
          this.membersList.style.removeProperty('flex-basis');
          this.membersList.style.removeProperty('position');
          this.membersList.style.removeProperty('z-index');
          this.membersList.style.removeProperty('max-height');
          this.membersList.style.removeProperty('height');
          this.membersList.style.removeProperty('right');
        }
        if (this.membersListInner) {
          this.membersListInner.style.removeProperty('max-width');
          this.membersListInner.style.removeProperty('min-width');
          this.membersListInner.style.removeProperty('transform');
        }
        if (this.contentWindow) {
          this.contentWindow.style.removeProperty('transition');
          this.contentWindow.style.removeProperty('max-width');
        }
        if (this.profilePanel) {
          this.profilePanel.style.removeProperty('max-width');
          this.profilePanel.style.removeProperty('min-width');
          this.profilePanel.style.removeProperty('width');
          this.profilePanel.style.removeProperty('overflow');
          this.profilePanel.style.removeProperty('resize');
          this.profilePanel.style.removeProperty('transition');
          this.profilePanel.style.removeProperty('transform');
          this.profilePanel.style.removeProperty('display');
          this.profilePanel.style.removeProperty('position');
          this.profilePanel.style.removeProperty('z-index');
          this.profilePanel.style.removeProperty('max-height');
          this.profilePanel.style.removeProperty('height');
          this.profilePanel.style.removeProperty('right');
        }
        if (this.profilePanelWrapper) {
          this.profilePanelWrapper.style.removeProperty('width');
        }
        if (this.profilePanelInner) {
          this.profilePanelInner.style.removeProperty('max-width');
          this.profilePanelInner.style.removeProperty('width');
          this.profilePanelInner.style.removeProperty('transform');
        }
        if (this.profileBannerSVGWrapper) {
          this.profileBannerSVGWrapper.style.removeProperty('max-height');
          this.profileBannerSVGWrapper.style.removeProperty('min-width');
          this.profileBannerSVGWrapper.querySelector('mask rect')
            .setAttribute('width', '100%')
          this.profileBannerSVGWrapper.setAttribute('viewBox', '0 0 340 120');
        }
        if (this.msgBar) {
          this.msgBar.style.removeProperty('max-height');
          this.msgBar.style.removeProperty('overflow');
          this.msgBar.style.removeProperty('transition');
          this.msgBar.style.removeProperty('display');
        }
        if (this.settingsContainer) {
          for (var i = 0; i < (this.settingsContainer.children.length - 1); i++) {
            this.settingsContainer.children[i].style.removeProperty('max-width');
            this.settingsContainer.children[i].style.removeProperty('transition');
            this.settingsContainer.children[i].style.removeProperty('overflow');
            this.settingsContainer.children[i].style.removeProperty('display');
          }
          this.settingsContainer.style.removeProperty('display');
        }
        if (this.msgBarBtnContainer) {
          this.msgBarBtnContainer.style.removeProperty('transition');
          this.msgBarBtnContainer.style.removeProperty('max-width');
        }
        if (this.spotifyContainer) {
          this.spotifyContainer.style.removeProperty('display');
        }
        if (this.userArea) {
          this.userArea.style.removeProperty('max-height');
          this.userArea.style.removeProperty('transition');
          this.userArea.style.removeProperty('display');
          this.userArea.style.removeProperty('overflow');
        }
        if (document.querySelector('.' + this.classCallContainer)) {
          if (document.querySelector('.' + this.classNoChat))
            document.querySelector('.' + this.classCallContainer)
              .style.maxHeight = BdApi.DOM.screenHeight + 'px';
          else
            document.querySelector('.' + this.classCallContainer)
              .style.maxHeight = (BdApi.DOM.screenHeight - 222) + 'px';
          document.querySelector('.' + this.classCallContainer)
            .style.removeProperty('transition');
          document.querySelector('.' + this.classCallContainer)
            .style.removeProperty('display');
          if (document.querySelector('.' + this.classCallUserWrapper))
            document.querySelector('.' + this.classCallUserWrapper)
            .style.removeProperty('display');
        }
        if (this.windowBase) {
          this.windowBase.style.removeProperty('top');
          this.windowBase.style.removeProperty('min-width');
          this.windowBase.style.removeProperty('transition');
        }
        if (this.toolBar) {
          this.toolBar.style.removeProperty('max-width');
          this.toolBar.style.removeProperty('transition');
        }

        if (this.settingsContainerBase) {
          this.settingsContainerBase.style.removeProperty('left');
          this.settingsContainerBase.style.removeProperty('width');
          this.settingsContainerBase.style.removeProperty('transition');
        }
        if (this.avatarWrapper) {
          this.avatarWrapper.style.removeProperty('min-width');
        }

        if (this.wordMark) {
          this.wordMark.style.removeProperty('margin-left');
        }

        // Delete plugin stylesheet
        this.pluginStyle?.parentNode?.removeChild(this.pluginStyle);

        // Abort listeners & observers
        if (this.eventListenerController)
          this.eventListenerController.abort();
        if (this.settingsObserver)
          this.settingsObserver.disconnect();
        if (this.appObserver)
          this.appObserver.disconnect();
        if (this.channelListWidthObserver)
          this.channelListWidthObserver.disconnect();
        if (this.membersListWidthObserver)
          this.membersListWidthObserver.disconnect();
        if (this.profilePanelWidthObserver)
          this.profilePanelWidthObserver.disconnect();

      } catch (e) {
        console.warn('%c[CollapsibleUI] ' + '%cCould not successfully terminate \
          plugin! (see below) ', 'color: #3a71c1; font-weight: 700;', '');
        console.warn(e);
      }
    }

    // Abstracts Discord's confusing class structure
    abstractClassesAndElements = () => {
      // Classes
      this.classSelected = 'selected_be2668';
      this.classIconWrapper = 'iconWrapper_af9215';
      this.classClickable = 'clickable_d23a1a';
      this.classCallContainer = 'wrapper_bd2abe';
      this.classCallUserWrapper = 'voiceCallWrapper_a36a80';
      this.classDMElement = 'channel_c21703';
      this.classTooltipWrapper = 'layer_ec16dd';
      this.classTooltipWrapperDPE = 'disabledPointerEvents_bb5546';
      this.classTooltip = 'tooltip__01384';
      this.classTooltipBottom = 'tooltipBottom_ba4564';
      this.classTooltipPrimary = 'tooltipPrimary_e5c00d';
      this.classTooltipDPE = 'tooltipDisablePointerEvents__14727';
      this.classTooltipPointer = 'tooltipPointer_a79354';
      this.classTooltipContent = 'tooltipContent__79a2d';
      this.classAppWrapper = 'app_de4237';
      this.classLayers = 'layers_a23c37';
      this.classChannelList = 'sidebar_ded4b5';
      this.classServerList = 'wrapper_a7e7a8';
      this.classUserPopout = 'userPopoutOuter_d739b2';
      this.classMembersListWrapper = 'container_b2ce9c';
      this.classMembersListMember = 'member_aa4760';
      this.classProfilePanelWrapper = 'profilePanel__12596';
      this.classTextInput = '[data-slate-string="true"]';
      this.classNoChat = 'noChat_ce920d';
      this.classMsgButtons = 'wrapper_c727b6';
      this.classEphemeralContent = 'content__23cab';
      this.classUnreadDMBadge = 'numberBadge__50328';
      this.classUnreadDmBadgeBase = 'base__92a12';
      this.classUnreadDmBadgeEyebrow = 'eyebrow__60985';
      this.classUnreadDmBadgeShape = 'baseShapeRound__95d0f';
      this.classUnreadDmBadgeLocation = 'unreadMentionsIndicatorTop_ada847';


      if (BdApi.Plugins.isEnabled('ChannelDms')
        && document.querySelector('.ChannelDms-channelmembers-wrap')) {
        this.classMembersList = 'ChannelDms-channelmembers-wrap';
      } else this.classMembersList = 'membersWrap__90226';

      // Elements
      this.windowBase = document.querySelector('.base__3e6af');
      this.baseLayer = document.querySelector('.baseLayer__8fda3');
      this.toolBar = document.querySelector('.toolbar__88c63');
      this.searchBar = document.querySelector('.search__07df0');
      this.inviteToolbar = document.querySelector('.inviteToolbar_e74dc0');
      this.windowBar = document.querySelector('.typeWindows__5fa63');
      this.wordMark = document.querySelector('.wordmark__0d178');
      this.msgBar = document.querySelector('.form__13a2c');
      this.userArea = document.querySelector('.panels__58331');
      this.profilePanel = document.querySelector('.userPanelOuter__880e5');
      this.profilePanelInner = document.querySelector('.userPanelInner_eddf4c')
        ?.firstElementChild;
      this.profilePanelWrapper = document.querySelector('.'
        + this.classProfilePanelWrapper);
      this.profileBannerSVGWrapper = document.querySelector('.bannerSVGWrapper__3e7b0');
      this.membersList = document.querySelector('.' + this.classMembersList);
      this.serverList = document.querySelector('.' + this.classServerList);
      this.channelList = document.querySelector('.' + this.classChannelList);
      this.settingsContainerBase = document.querySelector('.container_ca50b9');
      this.settingsContainer = this.settingsContainerBase
        .querySelector('.flex_f5fbb7');
      this.spotifyContainer = document.querySelector('.container_6sXIoE');
      this.appWrapper = document.querySelector('.app_b1f720');
      this.avatarWrapper = document.querySelector('.avatarWrapper_ba5175');
      this.moreButton = this.toolBar.querySelector('[d="M4 14a2 2 0 1 0 0-4 2 2'
        + ' 0 0 0 0 4Zm10-2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 '
        + '0 0 1 4 0Z"]');
      this.membersListButton = this.toolBar.querySelector('[d="M14.5 8a3 3 0 1 '
        + '0-2.7-4.3c-.2.4.06.86.44 1.12a5 5 0 0 1 2.14 3.08c.01.06.06.1.12.1ZM'
        + '18.44 17.27c.15.43.54.73 1 .73h1.06c.83 0 1.5-.67 1.5-1.5a7.5 7.5 0 '
        + '0 0-6.5-7.43c-.55-.08-.99.38-1.1.92-.06.3-.15.6-.26.87-.23.58-.05 1.'
        + '3.47 1.63a9.53 9.53 0 0 1 3.83 4.78ZM12.5 9a3 3 0 1 1-6 0 3 3 0 0 1 '
        + '6 0ZM2 20.5a7.5 7.5 0 0 1 15 0c0 .83-.67 1.5-1.5 1.5a.2.2 0 0 1-.2-.'
        + '16c-.2-.96-.56-1.87-.88-2.54-.1-.23-.42-.15-.42.1v2.1a.5.5 0 0 1-.5.'
        + '5h-8a.5.5 0 0 1-.5-.5v-2.1c0-.25-.31-.33-.42-.1-.32.67-.67 1.58-.88 '
        + '2.54a.2.2 0 0 1-.2.16A1.5 1.5 0 0 1 2 20.5Z"]')?.parentElement.parentElement;
      this.profilePanelButton = this.toolBar.querySelector('[d="M23 12.38c-.02.'
        + '38-.45.58-.78.4a6.97 6.97 0 0 0-6.27-.08.54.54 0 0 1-.44 0 8.97 8.97'
        + ' 0 0 0-11.16 3.55c-.1.15-.1.35 0 .5.37.58.8 1.13 1.28 1.61.24.24.64.'
        + '15.8-.15.19-.38.39-.73.58-1.02.14-.21.43-.1.4.15l-.19 1.96c-.02.19.0'
        + '7.37.23.47A8.96 8.96 0 0 0 12 21a.4.4 0 0 1 .38.27c.1.33.25.65.4.95.'
        + '18.34-.02.76-.4.77L12 23a11 11 0 1 1 11-10.62ZM15.5 7.5a3.5 3.5 0 1 '
        + '1-7 0 3.5 3.5 0 0 1 7 0Z"]')?.parentElement.parentElement;
      this.fullscreenButton = document.querySelector('[d="M4 6c0-1.1.9-2 2-2h3a'
        + '1 1 0 0 0 0-2H6a4 4 0 0 0-4 4v3a1 1 0 0 0 2 0V6ZM4 18c0 1.1.9 2 2 2h'
        + '3a1 1 0 1 1 0 2H6a4 4 0 0 1-4-4v-3a1 1 0 1 1 2 0v3ZM18 4a2 2 0 0 1 2'
        + ' 2v3a1 1 0 1 0 2 0V6a4 4 0 0 0-4-4h-3a1 1 0 1 0 0 2h3ZM20 18a2 2 0 0'
        + ' 1-2 2h-3a1 1 0 1 0 0 2h3a4 4 0 0 0 4-4v-3a1 1 0 1 0-2 0v3Z"]')
        ?.parentElement.parentElement.parentElement;
      this.msgBarBtnContainer = document.querySelector('.buttons_ce5b56');
      this.membersListInner = document.querySelector('.members__9f47b');
      this.membersListNotices = document.querySelector('.membersListNotices_a4cb13');
      this.contentWindow = document.querySelector('.container__93316');

      this.callContainerExists = (document.querySelector('.'
        + this.classCallContainer));
    }

    // Adds click handlers to toolbar icons
    addButtonClickHandlers = () => {
      var cui = this; // Abstract CollapsibleUI as a variable

      // Add event listener to the Server List button to
      //   update the icon, UI, & settings on click
      if (this.serverListButton) {
        this.serverListButton.addEventListener('click', function () {
          cui.toggleButton(cui.I_SERVER_LIST);
        }, { signal: this.eventListenerSignal });

        this.serverListButton.addEventListener('mouseenter', function () {
          this.tooltip = cui.createTooltip(cui.localeLabels.serverList
            + ` (${cui.keyStringList[cui.I_SERVER_LIST]})`, this);
        }, { signal: this.eventListenerSignal });

        this.serverListButton.addEventListener('mouseleave', function () {
          this.tooltip.remove();
        }, { signal: this.eventListenerSignal });
      }

      // Add event listener to the Channel List button to
      //   update the icon, UI, & settings on click
      if (this.channelListButton) {
        this.channelListButton.addEventListener('click', function () {
          cui.toggleButton(cui.I_CHANNEL_LIST);
        }, { signal: this.eventListenerSignal });

        this.channelListButton.addEventListener('mouseenter', function () {
          this.tooltip = cui.createTooltip(cui.localeLabels.channelList
            + ` (${cui.keyStringList[cui.I_CHANNEL_LIST]})`, this);
        }, { signal: this.eventListenerSignal });

        this.channelListButton.addEventListener('mouseleave', function () {
          this.tooltip.remove();
        }, { signal: this.eventListenerSignal });
      }

      // Add event listener to the Message Bar button to
      //   update the icon, UI, & settings on click
      if (this.msgBarButton) {
        this.msgBarButton.addEventListener('click', function () {
          cui.toggleButton(cui.I_MSG_BAR);
        }, { signal: this.eventListenerSignal });

        this.msgBarButton.addEventListener('mouseenter', function () {
          this.tooltip = cui.createTooltip(cui.localeLabels.msgBar
            + ` (${cui.keyStringList[cui.I_MSG_BAR]})`, this);
        }, { signal: this.eventListenerSignal });

        this.msgBarButton.addEventListener('mouseleave', function () {
          this.tooltip.remove();
        }, { signal: this.eventListenerSignal });
      }

      // Add event listener to the Window Bar button to
      //   update the icon, UI, & settings on click
      if (this.windowBarButton) {
        this.windowBarButton.addEventListener('click', function () {
          cui.toggleButton(cui.I_WINDOW_BAR);
        }, { signal: this.eventListenerSignal });

        this.windowBarButton.addEventListener('mouseenter', function () {
          this.tooltip = cui.createTooltip(cui.localeLabels.windowBar
            + ` (${cui.keyStringList[cui.I_WINDOW_BAR]})`, this);
        }, { signal: this.eventListenerSignal });

        this.windowBarButton.addEventListener('mouseleave', function () {
          this.tooltip.remove();
        }, { signal: this.eventListenerSignal });
      }

      // Add event listener to the Members List button to
      //   update the icon, UI, & settings on click
      if (this.membersListButton) {
        this.membersListButton.addEventListener('click', function () {
          cui.toggleButton(cui.I_MEMBERS_LIST);
        }, { signal: this.eventListenerSignal });

        this.membersListButton.addEventListener('mouseenter', function () {
          this.tooltip = cui.createTooltip(cui.localeLabels.membersList
            + ` (${cui.keyStringList[cui.I_MEMBERS_LIST]})`, this);
        }, { signal: this.eventListenerSignal });

        this.membersListButton.addEventListener('mouseleave', function () {
          this.tooltip.remove();
        }, { signal: this.eventListenerSignal });
      }

      // Add event listener to the User Profile button to
      //   update the icon, UI, & settings on click
      if (this.profilePanelButton) {
        this.profilePanelButton.addEventListener('click', function () {
          cui.toggleButton(cui.I_USER_PROFILE);
        }, { signal: this.eventListenerSignal });

        this.profilePanelButton.addEventListener('mouseenter', function () {
          this.tooltip = cui.createTooltip(cui.localeLabels.profilePanel
            + ` (${cui.keyStringList[cui.I_USER_PROFILE]})`, this);
        }, { signal: this.eventListenerSignal });

        this.profilePanelButton.addEventListener('mouseleave', function () {
          this.tooltip.remove();
        }, { signal: this.eventListenerSignal });
      }

      // Add event listener to the User Area button to
      //   update the icon, UI, & settings on click
      if (this.userAreaButton) {
        this.userAreaButton.addEventListener('click', function () {
          cui.toggleButton(cui.I_USER_AREA);
        }, { signal: this.eventListenerSignal });

        this.userAreaButton.addEventListener('mouseenter', function () {
          this.tooltip = cui.createTooltip(cui.localeLabels.userArea
            + ` (${cui.keyStringList[cui.I_USER_AREA]})`, this);
        }, { signal: this.eventListenerSignal });

        this.userAreaButton.addEventListener('mouseleave', function () {
          this.tooltip.remove();
        }, { signal: this.eventListenerSignal });
      }

      // Add event listener to the Call Container button to
      //   update the icon, UI, & settings on click
      if (this.callContainerButton) {
        this.callContainerButton.addEventListener('click', function () {
          cui.toggleButton(cui.I_CALL_CONTAINER);
        }, { signal: this.eventListenerSignal });

        this.callContainerButton.addEventListener('mouseenter', function () {
          this.tooltip = cui.createTooltip(cui.localeLabels.callContainer
            + ` (${cui.keyStringList[cui.I_CALL_CONTAINER]})`, this);
        }, { signal: this.eventListenerSignal });

        this.callContainerButton.addEventListener('mouseleave', function () {
          this.tooltip.remove();
        }, { signal: this.eventListenerSignal });
      }
    }

    // Adds miscellaneous event listeners
    addMiscEventListeners = (buttonsActive, settingsButtons, singleButtonWidth) => {
      var cui = this; // Abstract CollapsibleUI as a variable

      // Implement dynamic uncollapse features
      if (this.dynamicUncollapse && !this.disableTransitions) {

        // Update autocollapse conditionals
        this.applyAutocollapseConditionals();

        // Add event listener to window to autocollapse elements if window becomes too small
        // If you have to read this, I'm so sorry
        if (this.autoCollapse) {
          window.addEventListener('resize', function (event) {
            if (cui.serverListButton &&
              ((cui.autoCollapseConditionals[cui.I_SERVER_LIST] === '')
              || !(cui.conditionalAutoCollapse)) &&
              (((cui.isHSLLoaded ? BdApi.DOM.screenHeight : BdApi.DOM.screenWidth)
              < cui.autoCollapseThreshold[cui.I_SERVER_LIST]
              && BdApi.getData('CollapsibleUI', 'serverListButtonActive') === 'true') ||
              ((cui.isHSLLoaded ? BdApi.DOM.screenHeight : BdApi.DOM.screenWidth)
              > cui.autoCollapseThreshold[cui.I_SERVER_LIST]
              && BdApi.getData('CollapsibleUI', 'serverListButtonActive') === 'false'))) {

              cui.toggleButton(cui.I_SERVER_LIST);
            }
            if (cui.channelListButton &&
              ((cui.autoCollapseConditionals[cui.I_CHANNEL_LIST] === '')
              || !(cui.conditionalAutoCollapse)) &&
              ((BdApi.DOM.screenWidth < cui.autoCollapseThreshold[cui.I_CHANNEL_LIST]
              && BdApi.getData('CollapsibleUI', 'channelListButtonActive') === 'true') ||
              (BdApi.DOM.screenWidth > cui.autoCollapseThreshold[cui.I_CHANNEL_LIST]
              && BdApi.getData('CollapsibleUI', 'channelListButtonActive') === 'false'))) {

              cui.toggleButton(cui.I_CHANNEL_LIST);
            }
            if (cui.msgBarButton &&
              ((cui.autoCollapseConditionals[cui.I_MSG_BAR] === '')
              || !(cui.conditionalAutoCollapse)) &&
              ((BdApi.DOM.screenHeight < cui.autoCollapseThreshold[cui.I_MSG_BAR]
              && BdApi.getData('CollapsibleUI', 'msgBarButtonActive') === 'true') ||
              (BdApi.DOM.screenHeight > cui.autoCollapseThreshold[cui.I_MSG_BAR]
              && BdApi.getData('CollapsibleUI', 'msgBarButtonActive') === 'false'))) {

              cui.toggleButton(cui.I_MSG_BAR);
            }
            if (cui.windowBarButton &&
              ((cui.autoCollapseConditionals[cui.I_WINDOW_BAR] === '')
              || !(cui.conditionalAutoCollapse)) &&
              ((BdApi.DOM.screenHeight < cui.autoCollapseThreshold[cui.I_WINDOW_BAR]
              && BdApi.getData('CollapsibleUI', 'windowBarButtonActive') === 'true') ||
              (BdApi.DOM.screenHeight > cui.autoCollapseThreshold[cui.I_WINDOW_BAR]
              && BdApi.getData('CollapsibleUI', 'windowBarButtonActive') === 'false'))) {

              cui.toggleButton(cui.I_WINDOW_BAR);
            }
            if (cui.membersListButton &&
              ((cui.autoCollapseConditionals[cui.I_MEMBERS_LIST] === '')
              || !(cui.conditionalAutoCollapse)) &&
              ((BdApi.DOM.screenWidth < cui.autoCollapseThreshold[cui.I_MEMBERS_LIST]
              && BdApi.getData('CollapsibleUI', 'membersListButtonActive') === 'true') ||
              (BdApi.DOM.screenWidth > cui.autoCollapseThreshold[cui.I_MEMBERS_LIST]
              && BdApi.getData('CollapsibleUI', 'membersListButtonActive') === 'false'))) {

              cui.toggleButton(cui.I_MEMBERS_LIST);
            }
            if (cui.profilePanelButton &&
              ((cui.autoCollapseConditionals[cui.I_USER_PROFILE] === '')
              || !(cui.conditionalAutoCollapse)) &&
              ((BdApi.DOM.screenWidth < cui.autoCollapseThreshold[cui.I_USER_PROFILE]
              && BdApi.getData('CollapsibleUI', 'profilePanelButtonActive') === 'true') ||
              (BdApi.DOM.screenWidth > cui.autoCollapseThreshold[cui.I_USER_PROFILE]
              && BdApi.getData('CollapsibleUI', 'profilePanelButtonActive') === 'false'))) {

              cui.toggleButton(cui.I_USER_PROFILE);
            }
            if (cui.userAreaButton &&
              ((cui.autoCollapseConditionals[cui.I_USER_AREA] === '')
              || !(cui.conditionalAutoCollapse)) &&
              ((BdApi.DOM.screenHeight < cui.autoCollapseThreshold[cui.I_USER_AREA]
              && BdApi.getData('CollapsibleUI', 'userAreaButtonActive') === 'true') ||
              (BdApi.DOM.screenHeight > cui.autoCollapseThreshold[cui.I_USER_AREA]
              && BdApi.getData('CollapsibleUI', 'userAreaButtonActive') === 'false'))) {

              cui.toggleButton(cui.I_USER_AREA);
            }
            if (cui.callContainerButton &&
              ((cui.autoCollapseConditionals[cui.I_CALL_CONTAINER] === '')
              || !(cui.conditionalAutoCollapse)) &&
              ((BdApi.DOM.screenHeight < cui.autoCollapseThreshold[cui.I_CALL_CONTAINER]
              && BdApi.getData('CollapsibleUI', 'callContainerButtonActive') === 'true') ||
              (BdApi.DOM.screenHeight > cui.autoCollapseThreshold[cui.I_CALL_CONTAINER]
              && BdApi.getData('CollapsibleUI', 'callContainerButtonActive') === 'false'))) {

              cui.toggleButton(cui.I_CALL_CONTAINER);
            }
          }, { signal: this.eventListenerSignal });
        }

        // Add event listener to document body to track cursor location
        //   and check if it is near collapsed elements
        document.body.addEventListener('mousemove', function (event) {

          cui.mouseX = event.pageX;
          cui.mouseY = event.pageY;

          cui.initThemeIntegration();
          cui.tickDynamicUncollapse(settingsButtons, buttonsActive, singleButtonWidth);

        }, { signal: this.eventListenerSignal });

        document.body.addEventListener('mouseleave', function () {
          // Server List
          if ((BdApi.getData('CollapsibleUI', 'serverListButtonActive') === 'false')
            && cui.serverList) {

            if (cui.serverDUDelay) {
              clearTimeout(cui.serverDUDelay);
              cui.serverDUDelay = false;
            }
            if (!cui.isHSLLoaded) {
              cui.serverList.style.width = cui.collapsedDistance + 'px';
              if (cui.isDarkMatterLoaded) {
                cui.settingsContainerBase.style.width = '100%';
                cui.settingsContainerBase.style.left = '0px';
                cui.windowBase.style.minWidth = '100vw';
              }
              cui.isCollapsed[cui.I_SERVER_LIST] = true;
            }
          }

          // Channel List
          if ((BdApi.getData('CollapsibleUI', 'channelListButtonActive') === 'false')
            && cui.channelList) {

            if (cui.channelDUDelay) {
              clearTimeout(cui.channelDUDelay);
              cui.channelDUDelay = false;
            }
            cui.channelList.style.transition = 'width ' + cui.transitionSpeed + 'ms';
            cui.channelList.style.width = cui.collapsedDistance + 'px';
            if (cui.isDarkMatterLoaded) {
              cui.settingsContainer.style.display = 'none';
              if (cui.spotifyContainer)
                cui.spotifyContainer.style.display = 'none';
            }
            cui.isCollapsed[cui.I_CHANNEL_LIST] = true;
          }

          // Message Bar
          if ((BdApi.getData('CollapsibleUI', 'msgBarButtonActive') === 'false')
            && cui.msgBar && !(document.querySelector(cui.classTextInput)?.innerHTML)) {

            if (cui.messageDUDelay) {
              clearTimeout(cui.messageDUDelay);
              cui.messageDUDelay = false;
            }
            cui.msgBar.style.maxHeight = cui.collapsedDistance + 'px';
            cui.msgBar.style.overflow = 'hidden';
            cui.isCollapsed[cui.I_MSG_BAR] = true;
          }

          // Window Bar
          if ((BdApi.getData('CollapsibleUI', 'windowBarButtonActive') === 'false')
            && cui.windowBar && (cui.mouseY > cui.windowBarHeight
            + cui.dynamicUncollapseCloseDistance[cui.I_WINDOW_BAR])) {

            if (cui.windowDUDelay) {
              clearTimeout(cui.windowDUDelay);
              cui.windowDUDelay = false;
            }
            cui.windowBar.style.height = '0px';
            if (cui.isDarkMatterLoaded)
              cui.windowBar.style.opacity = '0';
            cui.windowBar.style.padding = '0px';
            cui.windowBar.style.margin = '0px';
            cui.windowBar.style.overflow = 'hidden';
            cui.wordMark.style.display = 'none';
            cui.isCollapsed[cui.I_WINDOW_BAR] = true;
          }

          // Members List
          if ((BdApi.getData('CollapsibleUI', 'membersListButtonActive') === 'false')
            && cui.membersList && !(cui.isNear(document.querySelector('.'
            + cui.classUserPopout), 10000, cui.mouseX, cui.mouseY))) {

            if (cui.membersDUDelay) {
              clearTimeout(cui.membersDUDelay);
              cui.membersDUDelay = false;
            }
            cui.membersList.style.transition = 'width ' + cui.transitionSpeed
              + 'ms, min-width ' + cui.transitionSpeed + 'ms';
            cui.contentWindow.style.transition = 'max-width ' + cui.transitionSpeed + 'ms';
            cui.membersList.style.width = cui.collapsedDistance + 'px';
            cui.membersList.style.minWidth = cui.collapsedDistance + 'px';
            cui.contentWindow.style.maxWidth = 'calc(100% - ' + cui.collapsedDistance + 'px)';
            cui.isCollapsed[cui.I_MEMBERS_LIST] = true;
          }

          // Profile Panel
          if ((BdApi.getData('CollapsibleUI', 'profilePanelButtonActive') === 'false')
            && cui.profilePanel && !(cui.isNear(document.querySelector('.'
            + cui.classUserPopout), 10000, cui.mouseX, cui.mouseY))) {

            if (cui.panelDUDelay) {
              clearTimeout(cui.panelDUDelay);
              cui.panelDUDelay = false;
            }
            cui.profilePanel.style.transition = 'width ' + cui.transitionSpeed
              + 'ms, min-width ' + cui.transitionSpeed + 'ms';
            cui.profilePanel.style.width = cui.collapsedDistance + 'px';
            cui.isCollapsed[cui.I_USER_PROFILE] = true;
          }

          // User Area
          if ((BdApi.getData('CollapsibleUI', 'userAreaButtonActive') === 'false')
            && cui.userArea) {

            if (cui.userDUDelay) {
              clearTimeout(cui.userDUDelay);
              cui.userDUDelay = false;
            }
            cui.userArea.style.maxHeight = cui.collapsedDistance + 'px';
            cui.isCollapsed[cui.I_USER_AREA] = true;
          }

          // Call Container
          if ((BdApi.getData('CollapsibleUI', 'callContainerButtonActive') === 'false')
            && document.querySelector('.' + cui.classCallContainer)) {

            if (cui.callDUDelay) {
              clearTimeout(cui.callDUDelay);
              cui.callDUDelay = false;
            }
            document.querySelector('.' + cui.classCallContainer).style.maxHeight = '0px';
            cui.isCollapsed[cui.I_CALL_CONTAINER] = true;
          }
        }, { signal: this.eventListenerSignal });

        window.addEventListener('keyup', function (e) {
          if ((BdApi.getData('CollapsibleUI', 'msgBarButtonActive') === 'false')
            && cui.msgBar && cui.dynamicUncollapseEnabled[cui.I_MSG_BAR]) {

            if (cui.isCollapsed[cui.I_MSG_BAR]
              && document.querySelector(cui.classTextInput)?.innerHTML) {

              if (cui.messageDUDelay) {
                clearTimeout(cui.messageDUDelay);
                cui.messageDUDelay = false;
              }
              cui.msgBar.style.maxHeight = cui.msgBarMaxHeight + 'px';
              cui.msgBar.style.removeProperty('overflow');
              cui.isCollapsed[cui.I_MSG_BAR] = false;
            } else if (!(cui.isCollapsed[cui.I_MSG_BAR])
              && !(document.querySelector(cui.classTextInput)?.innerHTML)) {

              if (cui.messageDUDelay) {
                clearTimeout(cui.messageDUDelay);
                cui.messageDUDelay = false;
              }
              cui.msgBar.style.maxHeight = cui.collapsedDistance + 'px';
              cui.msgBar.style.overflow = 'hidden';
              cui.isCollapsed[cui.I_MSG_BAR] = true;
            }
          }
        }, { signal: this.eventListenerSignal });

        // Add event listeners to the Toolbar to update on hover
        if (this.enableFullToolbarCollapse) {
          this.toolBar.addEventListener('mouseenter', function () {
            this.style.maxWidth = cui.toolbarMaxWidth + 'px';
          }, { signal: this.eventListenerSignal });
        }

        // Add event listeners to the Toolbar Container to update on hover
        if (!this.disableToolbarCollapse) {
          this.toolbarContainer.addEventListener('mouseenter', function () {
            if (cui.serverListButton) {
              cui.serverListButton.style.maxWidth = cui.toolbarIconMaxWidth + 'px';
              cui.serverListButton.style.removeProperty('margin');
              cui.serverListButton.style.removeProperty('padding');
            }
            if (cui.channelListButton) {
              cui.channelListButton.style.maxWidth = cui.toolbarIconMaxWidth + 'px';
              cui.channelListButton.style.removeProperty('margin');
              cui.channelListButton.style.removeProperty('padding');
            }
            if (cui.msgBarButton) {
              cui.msgBarButton.style.maxWidth = cui.toolbarIconMaxWidth + 'px';
              cui.msgBarButton.style.removeProperty('margin');
              cui.msgBarButton.style.removeProperty('padding');
            }
            if (cui.windowBarButton) {
              cui.windowBarButton.style.maxWidth = cui.toolbarIconMaxWidth + 'px';
              cui.windowBarButton.style.removeProperty('margin');
              cui.windowBarButton.style.removeProperty('padding');
            }
            if (cui.membersListButton) {
              cui.membersListButton.style.maxWidth = cui.toolbarIconMaxWidth + 'px';
              cui.membersListButton.style.removeProperty('margin');
              cui.membersListButton.style.removeProperty('padding');
            }
            if (cui.userAreaButton) {
              cui.userAreaButton.style.maxWidth = cui.toolbarIconMaxWidth + 'px';
              cui.userAreaButton.style.removeProperty('margin');
              cui.userAreaButton.style.removeProperty('padding');
            }
            if (cui.callContainerButton) {
              cui.callContainerButton.style.maxWidth = cui.toolbarIconMaxWidth + 'px';
              cui.callContainerButton.style.removeProperty('margin');
              cui.callContainerButton.style.removeProperty('padding');
            }
            if (cui.profilePanelButton) {
              cui.profilePanelButton.style.maxWidth = cui.toolbarIconMaxWidth + 'px';
              cui.profilePanelButton.style.removeProperty('margin');
              cui.profilePanelButton.style.removeProperty('padding');
            }
          }, { signal: this.eventListenerSignal });
        }

        // Add event listeners to the Settings Container to update on hover
        if (!this.disableSettingsCollapse) {
          this.settingsContainer.addEventListener('mouseenter', function () {
            for (var i = 0; i < (settingsButtons.length - 1); i++) {
              settingsButtons[i].style.maxWidth = cui.settingsButtonsMaxWidth + 'px';
            }
          }, { signal: this.eventListenerSignal });
        }

        // Add event listeners to the Message Bar Button Container to update on hover
        if ((!this.disableMsgBarBtnCollapse) && this.msgBarBtnContainer) {
          this.msgBarBtnContainer.addEventListener('mouseenter', function () {
            this.style.maxWidth = cui.messageBarButtonsMaxWidth + 'px';
          }, { signal: this.eventListenerSignal });
        }
      }

      // Add event listener to detect keyboard shortcuts
      if (this.keyBindsEnabled) {
        window.addEventListener('keydown', function (e) {
          if ((e.ctrlKey || e.altKey || e.shiftKey) && (e.key != 'Dead')) {
            navigator.keyboard.getLayoutMap().then((kbMap) => {
              for (var i = 0; i < cui.buttonsOrder.length; i++) {
                var ksParsed = cui.getShortcutFromKeystring(cui.keyStringList[i]);

                if (e.ctrlKey == ksParsed[0] && e.altKey == ksParsed[1]
                  && e.shiftKey == ksParsed[2] && kbMap.get(e.code) == ksParsed[3]) {

                  cui.toggleButton(i);
                  e.preventDefault();
                }
              }
            });
          }
        }, { signal: this.eventListenerSignal });
      }
    }

    // Adds a new SVG icon to the toolbar
    addToolbarIcon = (ariaLabel, rawSVGData, viewBox) => {
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
      newToolbarIcon.innerHTML = '<svg x="0" y="0" class="icon__4cb88" '
        + 'aria-hidden="false" width="24" height="24" viewBox="'
        + viewBox + '">' + rawSVGData + '</svg>';

      // Insert icon to the left of the search bar
      document.getElementById('cui-toolbar-container').insertBefore(newToolbarIcon,
        document.getElementById('cui-icon-insert-point'));

      // Return DOM Element of newly-created toolbar icon
      return newToolbarIcon;
    }

    // Collapses elements if user-specified conditionals are met
    applyAutocollapseConditionals = () => {
      if (this.conditionalAutoCollapse) {
        if ((this.autoCollapseConditionals[this.I_SERVER_LIST] !== '')
          && ((eval(this.autoCollapseConditionals[this.I_SERVER_LIST])
          && (BdApi.getData('CollapsibleUI', 'serverListButtonActive') === 'true'))
          || (!eval(this.autoCollapseConditionals[this.I_SERVER_LIST])
          && (BdApi.getData('CollapsibleUI', 'serverListButtonActive') === 'false'))))
            this.toggleButton(this.I_SERVER_LIST);

        if ((this.autoCollapseConditionals[this.I_CHANNEL_LIST] !== '')
          && ((eval(this.autoCollapseConditionals[this.I_CHANNEL_LIST])
          && (BdApi.getData('CollapsibleUI', 'channelListButtonActive') === 'true'))
          || (!eval(this.autoCollapseConditionals[this.I_CHANNEL_LIST])
          && (BdApi.getData('CollapsibleUI', 'channelListButtonActive') === 'false'))))
            this.toggleButton(this.I_CHANNEL_LIST);

        if ((this.autoCollapseConditionals[this.I_MSG_BAR] !== '')
          && ((eval(this.autoCollapseConditionals[this.I_MSG_BAR])
          && (BdApi.getData('CollapsibleUI', 'msgBarButtonActive') === 'true'))
          || (!eval(this.autoCollapseConditionals[this.I_MSG_BAR])
          && (BdApi.getData('CollapsibleUI', 'msgBarButtonActive') === 'false'))))
            this.toggleButton(this.I_MSG_BAR);

        if ((this.autoCollapseConditionals[this.I_WINDOW_BAR] !== '')
          && ((eval(this.autoCollapseConditionals[this.I_WINDOW_BAR])
          && (BdApi.getData('CollapsibleUI', 'windowBarButtonActive') === 'true'))
          || (!eval(this.autoCollapseConditionals[this.I_WINDOW_BAR])
          && (BdApi.getData('CollapsibleUI', 'windowBarButtonActive') === 'false'))))
            this.toggleButton(this.I_WINDOW_BAR);

        if ((this.autoCollapseConditionals[this.I_MEMBERS_LIST] !== '')
          && ((eval(this.autoCollapseConditionals[this.I_MEMBERS_LIST])
          && (BdApi.getData('CollapsibleUI', 'membersListButtonActive') === 'true'))
          || (!eval(this.autoCollapseConditionals[this.I_MEMBERS_LIST])
          && (BdApi.getData('CollapsibleUI', 'membersListButtonActive') === 'false'))))
            this.toggleButton(this.I_MEMBERS_LIST);

        if ((this.autoCollapseConditionals[this.I_USER_PROFILE] !== '')
          && ((eval(this.autoCollapseConditionals[this.I_USER_PROFILE])
          && (BdApi.getData('CollapsibleUI', 'profilePanelButtonActive') === 'true'))
          || (!eval(this.autoCollapseConditionals[this.I_USER_PROFILE])
          && (BdApi.getData('CollapsibleUI', 'profilePanelButtonActive') === 'false'))))
            this.toggleButton(this.I_USER_PROFILE);

        if ((this.autoCollapseConditionals[this.I_USER_AREA] !== '')
          && ((eval(this.autoCollapseConditionals[this.I_USER_AREA])
          && (BdApi.getData('CollapsibleUI', 'userAreaButtonActive') === 'true'))
          || (!eval(this.autoCollapseConditionals[this.I_USER_AREA])
          && (BdApi.getData('CollapsibleUI', 'userAreaButtonActive') === 'false'))))
            this.toggleButton(this.I_USER_AREA);

        if ((this.autoCollapseConditionals[this.I_CALL_CONTAINER] !== '')
          && ((eval(this.autoCollapseConditionals[this.I_CALL_CONTAINER])
          && (BdApi.getData('CollapsibleUI', 'callContainerButtonActive') === 'true'))
          || (!eval(this.autoCollapseConditionals[this.I_CALL_CONTAINER])
          && (BdApi.getData('CollapsibleUI', 'callContainerButtonActive') === 'false'))))
            this.toggleButton(this.I_CALL_CONTAINER);
      }
    }

    // Collapses toolbar icons
    collapseToolbarIcons = (buttonsActive) => {
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
      if (this.profilePanelButton) {
        this.profilePanelButton.style.maxWidth = '0px';
        this.profilePanelButton.style.margin = '0px';
        this.profilePanelButton.style.padding = '0px';
      }

      if (this.membersListButton && (buttonsActive[this.I_MEMBERS_LIST]
        == Math.max.apply(Math, buttonsActive))) {

        this.membersListButton.style.maxWidth = this.toolbarIconMaxWidth + 'px';
        this.membersListButton.style.removeProperty('margin');
        this.membersListButton.style.removeProperty('padding');

      } else if (this.windowBarButton && (buttonsActive[this.I_WINDOW_BAR]
        == Math.max.apply(Math, buttonsActive))) {

        this.windowBarButton.style.maxWidth = this.toolbarIconMaxWidth + 'px';
        this.windowBarButton.style.removeProperty('margin');
        this.windowBarButton.style.removeProperty('padding');

      } else if (this.msgBarButton && (buttonsActive[this.I_MSG_BAR]
        == Math.max.apply(Math, buttonsActive))) {

        this.msgBarButton.style.maxWidth = this.toolbarIconMaxWidth + 'px';
        this.msgBarButton.style.removeProperty('margin');
        this.msgBarButton.style.removeProperty('padding');

      } else if (this.channelListButton && (buttonsActive[this.I_CHANNEL_LIST]
        == Math.max.apply(Math, buttonsActive))) {

        this.channelListButton.style.maxWidth = this.toolbarIconMaxWidth + 'px';
        this.channelListButton.style.removeProperty('margin');
        this.channelListButton.style.removeProperty('padding');

      } else if (this.serverListButton && (buttonsActive[this.I_SERVER_LIST]
        == Math.max.apply(Math, buttonsActive))) {

        this.serverListButton.style.maxWidth = this.toolbarIconMaxWidth + 'px';
        this.serverListButton.style.removeProperty('margin');
        this.serverListButton.style.removeProperty('padding');

      } else if (this.userAreaButton && (buttonsActive[this.I_USER_AREA]
        == Math.max.apply(Math, buttonsActive))) {

        this.userAreaButton.style.maxWidth = this.toolbarIconMaxWidth + 'px';
        this.userAreaButton.style.removeProperty('margin');
        this.userAreaButton.style.removeProperty('padding');

      } else if (this.callContainerButton && (buttonsActive[this.I_CALL_CONTAINER]
        == Math.max.apply(Math, buttonsActive))) {

        this.callContainerButton.style.maxWidth = this.toolbarIconMaxWidth + 'px';
        this.callContainerButton.style.removeProperty('margin');
        this.callContainerButton.style.removeProperty('padding');

      } else if (this.profilePanelButton && (buttonsActive[this.I_USER_PROFILE]
        == Math.max.apply(Math, buttonsActive))) {

        this.profilePanelButton.style.maxWidth = this.toolbarIconMaxWidth + 'px';
        this.profilePanelButton.style.removeProperty('margin');
        this.profilePanelButton.style.removeProperty('padding');

      } else {
        document.querySelectorAll('.collapsible-ui-element')
          .forEach(e => e.style.display = 'none');
      }
    }

    // Creates a tooltip under the specified element
    createTooltip = (msg, elem) => {
      // Get location of selected element
      var left = elem.getBoundingClientRect().left,
      top = elem.getBoundingClientRect().top,
      width = elem.getBoundingClientRect().width,
      height = elem.getBoundingClientRect().height;

      // Create tooltip
      var newTooltip = document.createElement('div');
      newTooltip.classList.add('collapsible-ui-element');
      newTooltip.classList.add(this.classTooltipWrapper);
      newTooltip.classList.add(this.classTooltipWrapperDPE);
      newTooltip.style.position = 'fixed';
      newTooltip.style.zIndex = '10000';
      newTooltip.style.textAlign = 'center';
      newTooltip.innerHTML = `<div class="${this.classTooltip} `
        + `${this.classTooltipBottom} ${this.classTooltipPrimary} `
        + `${this.classTooltipDPE}" style="opacity: 1; transform: none;">`
        + `<div class="${this.classTooltipPointer}"></div>`
        + `<div class="${this.classTooltipContent}">${msg}</div></div>`;

      // Insert tooltip into window
      document.body.appendChild(newTooltip);

      // Get tooltip dimensions
      var ttwidth = newTooltip.getBoundingClientRect().width;

      // Extrapolate tooltip location
      var x = left + (width / 2) - (ttwidth / 2),
      y = top + height + this.TOOLTIP_OFFSET_PX;

      // Set tooltip location
      newTooltip.style.left = x + 'px';
      newTooltip.style.top = y + 'px';

      // Return DOM element of newly-created tooltip
      return newTooltip;
    }

    // Sets the floating status of an element by index
    floatElement = (index, floating) => {
      switch (index) {
      case 0: // I_SERVER_LIST
        if (floating && this.floatingDynamicUncollapse) {
          this.serverList.style.position = 'absolute';
          this.serverList.style.zIndex = '191';
          this.serverList.style.maxHeight = '100%';
          this.serverList.style.overflowY = 'scroll';
        } else {
          this.serverList.style.removeProperty('position');
          this.serverList.style.removeProperty('z-index');
          this.serverList.style.removeProperty('max-height');
          this.serverList.style.removeProperty('overflow-y');
        }
        break;

      case 1: // I_CHANNEL_LIST
        if (floating && this.floatingDynamicUncollapse) {
          this.channelList.style.position = 'absolute';
          this.channelList.style.zIndex = '190';
          this.channelList.style.maxHeight = '100%';
          this.channelList.style.height = '100%';
        } else {
          this.channelList.style.removeProperty('position');
          this.channelList.style.removeProperty('z-index');
          this.channelList.style.removeProperty('max-height');
          this.channelList.style.removeProperty('height');
        }
        break;

      case 2: // I_MSG_BAR
        // Element is unable to be properly floated
        break;

      case 3: // I_WINDOW_BAR
        // Floating this element doesn't make sense
        break;

      case 4: // I_MEMBERS_LIST
        if (floating && this.floatingDynamicUncollapse) {
          this.membersList.style.position = 'absolute';
          this.membersList.style.zIndex = '190';
          this.membersList.style.maxHeight = '100%';
          this.membersList.style.height = '100%';
          this.membersList.style.right = '0';
        } else {
          this.membersList.style.removeProperty('position');
          this.membersList.style.removeProperty('z-index');
          this.membersList.style.removeProperty('max-height');
          this.membersList.style.removeProperty('height');
          this.membersList.style.removeProperty('right');
        }
        break;

      case 5: // I_USER_AREA
        // Element already floats
        break;

      case 6: // I_CALL_CONTAINER
        // Element already floats
        break;

      case 7: // I_USER_PROFILE
        if (floating && this.floatingDynamicUncollapse) {
          this.profilePanel.style.position = 'absolute';
          this.profilePanel.style.zIndex = '190';
          this.profilePanel.style.maxHeight = '100%';
          this.profilePanel.style.height = '100%';
          this.profilePanel.style.right = '0';
        } else {
          this.profilePanel.style.removeProperty('position');
          this.profilePanel.style.removeProperty('z-index');
          this.profilePanel.style.removeProperty('max-height');
          this.profilePanel.style.removeProperty('height');
          this.profilePanel.style.removeProperty('right');
        }
        break;

      default:
        break;
      }
    }

    // Returns a JSON object from a specified URL
    getJSON = async(url) => {
      const response = await fetch(url);
      return response.json();
    }

    // Returns the correct language strings for each locale
    getLabels = () => {
      switch (document.documentElement.getAttribute("lang")) {
      case "da":
        this.localeLabels = {
          serverList: 'Serverliste',
          channelList: 'Kanalliste',
          msgBar: 'Meddelelsesbjælke',
          windowBar: 'Vinduesbjælke',
          membersList: 'Medlemmerliste',
          userArea: 'Brugerområdet',
          callContainer: 'Opkaldsbeholder',
          profilePanel: 'Brugerprofil'
        };
        break;
      case "de":
        this.localeLabels = {
          serverList: 'Server-Liste',
          channelList: 'Kanal-Liste',
          msgBar: 'Nachrichten-Bar',
          windowBar: 'Fenster-Bar',
          membersList: 'Mitglieder-Liste',
          userArea: 'Benutzer-Bereich',
          callContainer: 'Anruf-Container',
          profilePanel: 'Benutzerprofil'
        };
        break;
      case "es-ES":
        this.localeLabels = {
          serverList: 'Lista de Servidores',
          channelList: 'Lista de Canales',
          msgBar: 'Barra de Mensajes',
          windowBar: 'Barra de Ventana',
          membersList: 'Lista de Miembros',
          userArea: 'Área de Usuario',
          callContainer: 'Contenedor Llamadas',
          profilePanel: 'Perfil del Usuario'
        };
        break;
      case "fr":
        this.localeLabels = {
          serverList: 'Liste des Serveurs',
          channelList: 'Liste des Chaînes',
          msgBar: 'Barre de Messages',
          windowBar: 'Barre de Fenêtre',
          membersList: 'Liste des Membres',
          userArea: 'Espace Utilisateur',
          callContainer: 'Conteneur D&apos;appel',
          profilePanel: 'Profil de L&apos;utilisateur'
        };
        break;
      case "hr":
        this.localeLabels = {
          serverList: 'Popis Poslužitelja',
          channelList: 'Popis Kanala',
          msgBar: 'Traka Poruke',
          windowBar: 'Traka Prozora',
          membersList: 'Popis Članova',
          userArea: 'Korisničko Područje',
          callContainer: 'Spremnik Poziva',
          profilePanel: 'Korisnički Profil'
        };
        break;
      case "it":
        this.localeLabels = {
          serverList: 'Elenco Server',
          channelList: 'Elenco Canali',
          msgBar: 'Barra Messaggi',
          windowBar: 'Barra Finestra',
          membersList: 'Elenco Membri',
          userArea: 'Area Utente',
          callContainer: 'Chiama Contenitore',
          profilePanel: 'Profilo Utente'
        };
        break;
      case "lt":
        this.localeLabels = {
          serverList: 'Serverių Sąrašas',
          channelList: 'Kanalų Sąrašas',
          msgBar: 'Žinučių Juosta',
          windowBar: 'Langų Juosta',
          membersList: 'Narių Sąrašas',
          userArea: 'Naudotojo Sritis',
          callContainer: 'Skambučių Konteineris',
          profilePanel: 'Naudotojo Profilis'
        };
        break;
      case "hu":
        this.localeLabels = {
          serverList: 'Szerver Lista',
          channelList: 'Csatorna Lista',
          msgBar: 'Üzenetsáv',
          windowBar: 'Ablaksáv',
          membersList: 'Tagok Lista',
          userArea: 'Felhasználói Rész',
          callContainer: 'Hívás Konténer',
          profilePanel: 'Felhasználói Profil'
        };
        break;
      case "nl":
        this.localeLabels = {
          serverList: 'Serverlijst',
          channelList: 'Kanaallijst',
          msgBar: 'Berichtbar',
          windowBar: 'Vensterbar',
          membersList: 'Ledenlijst',
          userArea: 'Gebruikersgebied',
          callContainer: 'Bel Container',
          profilePanel: 'Gebruikersprofiel'
        };
        break;
      case "no":
        this.localeLabels = {
          serverList: 'Liste over Servere',
          channelList: 'Liste over Kanaler',
          msgBar: 'Meldingsfelt',
          windowBar: 'Vinduslinje',
          membersList: 'Liste over Medlemmer',
          userArea: 'Bruker-Området',
          callContainer: 'Kall Beholder',
          profilePanel: 'Brukerprofil'
        };
        break;
      case "pl":
        this.localeLabels = {
          serverList: 'Lista Serwerów',
          channelList: 'Lista Kanałów',
          msgBar: 'Pasek Komunikatów',
          windowBar: 'Pasek Okna',
          membersList: 'Lista Członków',
          userArea: 'Obszar Użytkownika',
          callContainer: 'Pojemnik na Telefony',
          profilePanel: 'Profil Użytkownika'
        };
        break;
      case "pt-BR":
        this.localeLabels = {
          serverList: 'Lista de Servidores',
          channelList: 'Lista de Canais',
          msgBar: 'Barra de Mensagens',
          windowBar: 'Barra de Janela',
          membersList: 'Lista de Membros',
          userArea: 'Área do Usuário',
          callContainer: 'Container de Chamadas',
          profilePanel: 'Perfil do Usuário'
        };
        break;
      case "ro":
        this.localeLabels = {
          serverList: 'Lista de Servere',
          channelList: 'Lista de Canale',
          msgBar: 'Bara de Mesaje',
          windowBar: 'Bara de Fereastră',
          membersList: 'Lista Membrilor',
          userArea: 'Zona de Utilizator',
          callContainer: 'Apelare Container',
          profilePanel: 'Profil de Utilizator'
        };
        break;
      case "fi":
        this.localeLabels = {
          serverList: 'Palvelinluettelo',
          channelList: 'Kanavaluettelo',
          msgBar: 'Viestipalkki',
          windowBar: 'Ikkunapalkki',
          membersList: 'Jäsenluettelo',
          userArea: 'Käyttäjäalue',
          callContainer: 'Kutsukontti',
          profilePanel: 'Käyttäjäprofiili'
        };
        break;
      case "sv-SE":
        this.localeLabels = {
          serverList: 'Serverlista',
          channelList: 'Kanallista',
          msgBar: 'Meddelandefält',
          windowBar: 'Fönsterfält',
          membersList: 'Medlemslista',
          userArea: 'Användarområde',
          callContainer: 'Samtalsbehållare',
          profilePanel: 'Användarprofil'
        };
        break;
      case "vi":
        this.localeLabels = {
          serverList: 'Danh sách Máy Chủ',
          channelList: 'Danh sách Kênh',
          msgBar: 'Thanh Thông Báo',
          windowBar: 'Thanh Cửa Sổ',
          membersList: 'Danh sách Thành Viên',
          userArea: 'Vùng Người Dùng',
          callContainer: 'Container Cuộc Gọi',
          profilePanel: 'Thông tin người dùng'
        };
        break;
      case "tr":
        this.localeLabels = {
          serverList: 'Sunucu Listesi',
          channelList: 'Kanal Listesi',
          msgBar: 'İleti Çubuğu',
          windowBar: 'Pencere Çubuğu',
          membersList: 'Üye Listesi',
          userArea: 'Kullanıcı Alanı',
          callContainer: 'Arama Kapsayıcısı',
          profilePanel: 'Kullanıcı Profili'
        };
        break;
      case "cs":
        this.localeLabels = {
          serverList: 'Seznam Serverů',
          channelList: 'Seznam Kanálů',
          msgBar: 'Panel Zpráv',
          windowBar: 'Panel Oken',
          membersList: 'Seznam Členů',
          userArea: 'Uživatelská Oblast',
          callContainer: 'Kontejner Volání',
          profilePanel: 'Uživatelský Profil'
        };
        break;
      case "el":
        this.localeLabels = {
          serverList: 'Λίστα Διακομιστών',
          channelList: 'Λίστα Καναλιών',
          msgBar: 'Γραμμή Μηνυμάτων',
          windowBar: 'Γραμμή Παραθύρων',
          membersList: 'Λίστα Μελών',
          userArea: 'Περιοχή Χρήστη',
          callContainer: 'Δοχείο Κλήσεων',
          profilePanel: 'Προφίλ Χρήστη'
        };
        break;
      case "bg":
        this.localeLabels = {
          serverList: 'Списък на Сървърите',
          channelList: 'Списък на Каналите',
          msgBar: 'Лента за Съобщения',
          windowBar: 'Лента на Прозореца',
          membersList: 'Списък на Членовете',
          userArea: 'Потребителска Зона',
          callContainer: 'Контейнер за Повиквания',
          profilePanel: 'Потребителски Профил'
        };
        break;
      case "ru":
        this.localeLabels = {
          serverList: 'Список Серверов',
          channelList: 'Список Каналов',
          msgBar: 'Панель Сообщений',
          windowBar: 'Панель Окон',
          membersList: 'Список Участников',
          userArea: 'Область Пользователя',
          callContainer: 'Контейнер Вызовов',
          profilePanel: 'Профиль Пользователя'
        };
        break;
      case "uk":
        this.localeLabels = {
          serverList: 'Список Серверів',
          channelList: 'Список Каналів',
          msgBar: 'Рядок Повідомлень',
          windowBar: 'Рядок Вікна',
          membersList: 'Список Учасників',
          userArea: 'Область Користувача',
          callContainer: 'Контейнер Викликів',
          profilePanel: 'Профіль Користувача'
        };
        break;
      case "hi":
        this.localeLabels = {
          serverList: 'सर्वर सूची',
          channelList: 'चैनल सूची',
          msgBar: 'संदेश पट्टी',
          windowBar: 'विंडो पट्टी',
          membersList: 'सदस्यों की सूची',
          userArea: 'उपयोगकर्ता क्षेत्र',
          callContainer: 'कॉल कंटेनर',
          profilePanel: 'उपयोगकर्ता प्रोफ़ाइल'
        };
        break;
      case "th":
        this.localeLabels = {
          serverList: 'รายการเซิร์ฟเวอร์',
          channelList: 'รายการแชนเนล',
          msgBar: 'แถบข้อความ',
          windowBar: 'แถบหน้าต่าง',
          membersList: 'รายชื่อสมาชิก',
          userArea: 'พื้นที่ผู้ใช้',
          callContainer: 'คอนเทนเนอร์การโทร',
          profilePanel: 'โปรไฟล์ผู้ใช้'
        };
        break;
      case "zh-CN":
        this.localeLabels = {
          serverList: '服务器列表',
          channelList: '频道列表',
          msgBar: '信息栏',
          windowBar: '窗口栏',
          membersList: '成员列表',
          userArea: '用户区',
          callContainer: '呼叫容器',
          profilePanel: '用户资料'
        };
        break;
      case "ja":
        this.localeLabels = {
          serverList: 'サーバー一覧',
          channelList: 'チャンネル一覧',
          msgBar: 'メッセージバー',
          windowBar: 'ウィンドウズ・バー',
          membersList: 'メンバーリスト',
          userArea: 'ユーザーエリア',
          callContainer: 'コールコンテナ',
          profilePanel: 'ユーザープロフィール'
        };
        break;
      case "zh-TW":
        this.localeLabels = {
          serverList: '伺服器清單',
          channelList: '通道清單',
          msgBar: '消息列',
          windowBar: '視窗列',
          membersList: '成員清單',
          userArea: '用戶區',
          callContainer: '呼叫容器',
          profilePanel: '用戶資料'
        };
        break;
      case "ko":
        this.localeLabels = {
          serverList: '서버 목록',
          channelList: '채널 목록',
          msgBar: '메시지 표시줄',
          windowBar: '창 바',
          membersList: '멤버 목록',
          userArea: '사용자 영역',
          callContainer: '통화 컨테이너',
          profilePanel: '사용자 프로필'
        };
        break;
      default:
        this.localeLabels = {
          serverList: 'Server List',
          channelList: 'Channel List',
          msgBar: 'Message Bar',
          windowBar: 'Window Bar',
          membersList: 'Members List',
          userArea: 'User Area',
          callContainer: 'Call Container',
          profilePanel: 'User Profile'
        };
      }
    }

    // Converts a keystring to a list containing modifier states and the key being pressed
    getShortcutFromKeystring = (string) => {
      var keyStates = [false, false, false, null];
      var modifierStates = string.match(/^(ctrl\+|alt\+|shift\+)?(ctrl\+|alt\+|shift\+)?(ctrl\+|alt\+|shift\+)?([A-Z])$/i);

      try {
        for (var i = 1; i < 4; i++) {
          if (modifierStates[i]) {
            switch (modifierStates[i].toLowerCase()) {
            case "ctrl+":
              keyStates[0] = true;
              break;

            case "alt+":
              keyStates[1] = true;
              break;

            case "shift+":
              keyStates[2] = true;
              break;

            default:
              break;
            }
          }
        }

        keyStates[3] = modifierStates[4].toLowerCase();
      } catch {}
      return keyStates;
    }

    // Kicks off various mutationObservers to improve plugin presence
    initObservers = () => {
      var cui = this; // Abstract CollapsibleUI as a variable

      // Add mutation observer to reload when user closes settings page
      this.settingsObserver = new MutationObserver((mutationList) => {
        try {
          if (mutationList[0].target.ariaHidden == 'false') {
            cui.initialize();
            return;
          }
        } catch (e) {
          console.warn('%c[CollapsibleUI] ' + '%cFailed to trigger \
            mutationObserver reload! (see below)',
            'color: #3a71c1; font-weight: 700;', '');
          console.warn(e);
        }
      });
      this.settingsObserver.observe(this.baseLayer,
        { attributeFilter: ['aria-hidden'] });

      // Add mutation observer to reload my plugin when necessary
      this.appObserver = new MutationObserver((mutationList) => {
        try {
          // If there are a lot of mutations, assume we need to reload
          // This increases performance a lot when switching views
          // In some cases, this can trigger several times in a row
          // This is intentional, as it maintains the user's preferences throughout transitions
          // This in turn prevents collapsed elements from "jumping" while the plugin reloads
          if (mutationList.length > cui.MAX_ITER_MUTATIONS) {
            // Prevent UI jumping when user presses Shift or unimportant data is reloaded
            if ((!mutationList[0].target.classList.contains(cui.classMsgButtons))
              && (!mutationList[0].target.classList.contains(cui.classEphemeralContent)))
              cui.initialize();
            return;
          }

          // Checks for a variety of small mutations and reloads if necessary
          // This is required for BDFDB compatibility
          for (var i = 0; i < mutationList.length; i++) {
            if (mutationList[i].addedNodes[0]?.classList?.contains(cui.classAppWrapper)
               || mutationList[i].addedNodes[0]?.classList?.contains(cui.classLayers)
               || mutationList[i].addedNodes[0]?.classList?.contains(cui.classChannelList)
               || mutationList[i].addedNodes[0]?.classList?.contains(cui.classServerList)
               || mutationList[i].addedNodes[0]?.classList?.contains(cui.classMembersList)
               || mutationList[i].addedNodes[0]?.classList?.contains(cui.classMembersListWrapper)
               || mutationList[i].addedNodes[0]?.classList?.contains(cui.classProfilePanel)
               || mutationList[i].addedNodes[0]?.classList?.contains(cui.classProfilePanelWrapper)
               || mutationList[i].addedNodes[0]?.classList?.contains(cui.classCallContainer)
               || mutationList[i].removedNodes[0]?.classList?.contains(cui.classCallContainer)) {
              cui.initialize();
              return;
            }
          }

          // If mutations are noncritical, just update autocollapse conditionals
          if (cui.dynamicUncollapse && !cui.disableTransitions)
            cui.applyAutocollapseConditionals();

          // Update DM badge
          if (this.persistentUnreadBadge)
            this.updateDMBadge();
          else
            this.updateDMBadge(true);

        } catch (e) {
          console.warn('%c[CollapsibleUI] ' + '%cFailed to trigger \
            mutationObserver reload! (see below)',
            'color: #3a71c1; font-weight: 700;', '');
          console.warn(e);
        }
      });
      this.appObserver.observe(this.appWrapper, {
        childList: true,
        subtree: true,
        attributes: false
      });
    }

    // Initializes all global plugin settings
    initPluginSettings = () => {
      // Initialize settings variables
      this.disableTransitions = false;
      this.transitionSpeed = 250;

      this.disableToolbarCollapse = false;
      this.disableSettingsCollapse = false;
      this.disableMsgBarBtnCollapse = false;
      this.enableFullToolbarCollapse = false;

      this.dynamicUncollapse = true;
      this.floatingDynamicUncollapse = true;
      this.dynamicUncollapseDistance = [30, 30, 30, 30, 30, 30, 30, 30];
      this.dynamicUncollapseCloseDistance = [30, 30, 30, 30, 30, 30, 30, 30];
      this.dynamicUncollapseDelay = 15;

      this.autoCollapse = false;
      this.autoCollapseThreshold = [500, 600, 400, 200, 950, 400, 550, 1000];
      this.conditionalAutoCollapse = false;
      this.autoCollapseConditionals = ['', '', '', '', '', '', '', ''];

      this.resizableChannelList = true;
      this.resizableMembersList = true;
      this.resizableUserProfile = true;
      this.channelListWidth = 0;
      this.membersListWidth = 0;
      this.profilePanelWidth = 0;

      this.buttonsOrder = [1, 2, 4, 6, 7, 3, 5, 8];
      this.dynamicUncollapseEnabled = [true, true, true, true, true, true, true, true];
      this.disabledButtonsStayCollapsed = false;

      this.keyBindsEnabled = true;
      this.keyStringList = ["Alt+S", "Alt+C", "Alt+T", "Alt+W", "Alt+M", "Alt+U", "Alt+P", "Alt+I"];

      this.settingsButtonsMaxWidth = 100;
      this.messageBarButtonsMaxWidth = 200;
      this.messageBarButtonsMinWidth = 40;
      this.toolbarIconMaxWidth = 300;
      this.toolbarMaxWidth = 800;
      this.userAreaMaxHeight = 300;
      this.msgBarMaxHeight = 400;
      this.windowBarHeight = 18;
      this.collapsedDistance = 0;
      this.buttonCollapseFudgeFactor = 10;

      this.persistentUnreadBadge = true;

      // Make sure settings version is set
      if (!BdApi.getData('CollapsibleUI', 'cuiSettingsVersion'))
        BdApi.setData('CollapsibleUI', 'cuiSettingsVersion', '0');

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
        BdApi.deleteData('CollapsibleUI', 'serverListButtonActive');
        BdApi.deleteData('CollapsibleUI', 'channelListButtonActive');
        BdApi.deleteData('CollapsibleUI', 'msgBarButtonActive');
        BdApi.deleteData('CollapsibleUI', 'windowBarButtonActive');
        BdApi.deleteData('CollapsibleUI', 'membersListButtonActive');
        BdApi.deleteData('CollapsibleUI', 'userAreaButtonActive');
        BdApi.deleteData('CollapsibleUI', 'callContainerButtonActive');
      }
      if (parseInt(BdApi.getData('CollapsibleUI', 'cuiSettingsVersion')) < 3) {
        // Clean up (v3)
        BdApi.deleteData('CollapsibleUI', 'dynamicUncollapseDistance');
      }
      if (parseInt(BdApi.getData('CollapsibleUI', 'cuiSettingsVersion')) < 4) {
        // Clean up (v4)
        BdApi.deleteData('CollapsibleUI', 'userAreaMaxHeight');
      }
      if (parseInt(BdApi.getData('CollapsibleUI', 'cuiSettingsVersion')) < 5) {
        // Clean up (v5)
        BdApi.deleteData('CollapsibleUI', 'transitionSpeed');
        BdApi.deleteData('CollapsibleUI', 'dynamicUncollapseDistance');
      }
      if (parseInt(BdApi.getData('CollapsibleUI', 'cuiSettingsVersion')) < 6) {
        // Clean up (v6)
        BdApi.deleteData('CollapsibleUI', 'dynamicUncollapseDistance');
        BdApi.deleteData('CollapsibleUI', 'dynamicUncollapseDelay');
      }
      if (parseInt(BdApi.getData('CollapsibleUI', 'cuiSettingsVersion')) < 7) {
        // Clean up (v7)
        BdApi.deleteData('CollapsibleUI', 'cui.serverListButtonActive');
        BdApi.deleteData('CollapsibleUI', 'cui.channelListButtonActive');
        BdApi.deleteData('CollapsibleUI', 'cui.msgBarButtonActive');
        BdApi.deleteData('CollapsibleUI', 'cui.windowBarButtonActive');
        BdApi.deleteData('CollapsibleUI', 'cui.membersListButtonActive');
        BdApi.deleteData('CollapsibleUI', 'cui.userAreaButtonActive');
        BdApi.deleteData('CollapsibleUI', 'cui.callContainerButtonActive');
      }
      if (parseInt(BdApi.getData('CollapsibleUI', 'cuiSettingsVersion')) < 8) {
        // Clean up (v8)
        BdApi.deleteData('CollapsibleUI', 'dynamicUncollapseDistance');
      }
      if (parseInt(BdApi.getData('CollapsibleUI', 'cuiSettingsVersion')) < 9) {
        // Clean up (v9)
        BdApi.deleteData('CollapsibleUI', 'dynamicUncollapseDistance');
        BdApi.deleteData('CollapsibleUI', 'dynamicUncollapseCloseDistance');
        BdApi.deleteData('CollapsibleUI', 'autoCollapseThreshold');
        BdApi.deleteData('CollapsibleUI', 'autoCollapseConditionals');
        BdApi.deleteData('CollapsibleUI', 'buttonsOrder');
        BdApi.deleteData('CollapsibleUI', 'dynamicUncollapseEnabled');
        BdApi.deleteData('CollapsibleUI', 'keyStringList');

        // Set new settings version
        BdApi.setData('CollapsibleUI', 'cuiSettingsVersion', '9');
      }
      if (parseInt(BdApi.getData('CollapsibleUI', 'cuiSettingsVersion')) < 10) {
        // Clean up (v10)
        BdApi.deleteData('CollapsibleUI', 'membersListMaxWidth');
      }
      if (parseInt(BdApi.getData('CollapsibleUI', 'cuiSettingsVersion')) < 11) {
        // Clean up (v11)
        BdApi.deleteData('CollapsibleUI', 'profilePanelMaxWidth');

        // Set new settings version
        BdApi.setData('CollapsibleUI', 'cuiSettingsVersion', '11');
      }

      // disableTransitions [Default: false]
      if (BdApi.getData('CollapsibleUI', 'disableTransitions') === 'false')
        this.disableTransitions = false;
      else if (BdApi.getData('CollapsibleUI', 'disableTransitions') === 'true')
        this.disableTransitions = true;
      else
        BdApi.setData('CollapsibleUI', 'disableTransitions', 'false');

      // transitionSpeed [Default: 250]
      if (typeof(BdApi.getData('CollapsibleUI', 'transitionSpeed')) === 'string')
        this.transitionSpeed = parseInt(BdApi.getData('CollapsibleUI', 'transitionSpeed'));
      else
        BdApi.setData('CollapsibleUI', 'transitionSpeed', this.transitionSpeed.toString());

      // disableToolbarCollapse [Default: false]
      if (BdApi.getData('CollapsibleUI', 'disableToolbarCollapse') === 'false')
        this.disableToolbarCollapse = false;
      else if (BdApi.getData('CollapsibleUI', 'disableToolbarCollapse') === 'true')
        this.disableToolbarCollapse = true;
      else
        BdApi.setData('CollapsibleUI', 'disableToolbarCollapse', 'false');

      // disableSettingsCollapse [Default: false]
      if (BdApi.getData('CollapsibleUI', 'disableSettingsCollapse') === 'false')
        this.disableSettingsCollapse = false;
      else if (BdApi.getData('CollapsibleUI', 'disableSettingsCollapse') === 'true')
        this.disableSettingsCollapse = true;
      else
        BdApi.setData('CollapsibleUI', 'disableSettingsCollapse', 'false');

      // disableMsgBarBtnCollapse [Default: false]
      if (BdApi.getData('CollapsibleUI', 'disableMsgBarBtnCollapse') === 'false')
        this.disableMsgBarBtnCollapse = false;
      else if (BdApi.getData('CollapsibleUI', 'disableMsgBarBtnCollapse') === 'true')
        this.disableMsgBarBtnCollapse = true;
      else
        BdApi.setData('CollapsibleUI', 'disableMsgBarBtnCollapse', 'false');

      // enableFullToolbarCollapse [Default: false]
      if (BdApi.getData('CollapsibleUI', 'enableFullToolbarCollapse') === 'false')
        this.enableFullToolbarCollapse = false;
      else if (BdApi.getData('CollapsibleUI', 'enableFullToolbarCollapse') === 'true')
        this.enableFullToolbarCollapse = true;
      else
        BdApi.setData('CollapsibleUI', 'enableFullToolbarCollapse', 'false');

      // dynamicUncollapse [Default: true]
      if (BdApi.getData('CollapsibleUI', 'dynamicUncollapse') === 'false')
        this.dynamicUncollapse = false;
      else if (BdApi.getData('CollapsibleUI', 'dynamicUncollapse') === 'true')
        this.dynamicUncollapse = true;
      else
        BdApi.setData('CollapsibleUI', 'dynamicUncollapse', 'true');

      // floatingDynamicUncollapse [Default: true]
      if (BdApi.getData('CollapsibleUI', 'floatingDynamicUncollapse') === 'false')
        this.floatingDynamicUncollapse = false;
      else if (BdApi.getData('CollapsibleUI', 'floatingDynamicUncollapse') === 'true')
        this.floatingDynamicUncollapse = true;
      else
        BdApi.setData('CollapsibleUI', 'floatingDynamicUncollapse', 'true');

      // dynamicUncollapseDistance [Default: [30, 30, 30, 30, 30, 30, 30, 30]]
      if (typeof(BdApi.getData('CollapsibleUI', 'dynamicUncollapseDistance')) === 'string') {
        if (BdApi.getData('CollapsibleUI', 'dynamicUncollapseDistance').split(',')
          .map(Number).length = this.dynamicUncollapseDistance.length)

          this.dynamicUncollapseDistance = BdApi.getData('CollapsibleUI',
            'dynamicUncollapseDistance').split(',').map(Number);
        else
          BdApi.setData('CollapsibleUI', 'dynamicUncollapseDistance',
            this.dynamicUncollapseDistance.toString());
      } else
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseDistance',
          this.dynamicUncollapseDistance.toString());

      // dynamicUncollapseCloseDistance [Default: [30, 30, 30, 30, 30, 30, 30, 30]]
      if (typeof(BdApi.getData('CollapsibleUI', 'dynamicUncollapseCloseDistance')) === 'string') {
        if (BdApi.getData('CollapsibleUI', 'dynamicUncollapseCloseDistance').split(',')
          .map(Number).length = this.dynamicUncollapseCloseDistance.length)

          this.dynamicUncollapseCloseDistance = BdApi.getData('CollapsibleUI',
            'dynamicUncollapseCloseDistance').split(',').map(Number);
        else
          BdApi.setData('CollapsibleUI', 'dynamicUncollapseCloseDistance',
            this.dynamicUncollapseCloseDistance.toString());
      } else
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseCloseDistance',
          this.dynamicUncollapseCloseDistance.toString());

      // dynamicUncollapseDelay [Default: 15]
      if (typeof(BdApi.getData('CollapsibleUI', 'dynamicUncollapseDelay')) === 'string')
        this.dynamicUncollapseDelay = parseInt(BdApi.getData('CollapsibleUI',
          'dynamicUncollapseDelay'));
      else
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseDelay',
          this.dynamicUncollapseDelay.toString());

      // autoCollapse [Default: false]
      if (BdApi.getData('CollapsibleUI', 'autoCollapse') === 'false')
        this.autoCollapse = false;
      else if (BdApi.getData('CollapsibleUI', 'autoCollapse') === 'true')
        this.autoCollapse = true;
      else
        BdApi.setData('CollapsibleUI', 'autoCollapse', 'false');

      // autoCollapseThreshold [Default: [500, 600, 400, 200, 950, 400, 550, 1000]]
      if (typeof(BdApi.getData('CollapsibleUI', 'autoCollapseThreshold')) === 'string') {
        if (BdApi.getData('CollapsibleUI', 'autoCollapseThreshold').split(',')
          .map(Number).length = this.autoCollapseThreshold.length)

          this.autoCollapseThreshold = BdApi.getData('CollapsibleUI',
            'autoCollapseThreshold').split(',').map(Number);
        else
          BdApi.setData('CollapsibleUI', 'autoCollapseThreshold',
            this.autoCollapseThreshold.toString());
      } else
        BdApi.setData('CollapsibleUI', 'autoCollapseThreshold',
          this.autoCollapseThreshold.toString());

      // conditionalAutoCollapse [Default: false]
      if (BdApi.getData('CollapsibleUI', 'conditionalAutoCollapse') === 'false')
        this.conditionalAutoCollapse = false;
      else if (BdApi.getData('CollapsibleUI', 'conditionalAutoCollapse') === 'true')
        this.conditionalAutoCollapse = true;
      else
        BdApi.setData('CollapsibleUI', 'conditionalAutoCollapse', 'false');

      // autoCollapseConditionals [Default: ['', '', '', '', '', '', '', '']]
      if (typeof(BdApi.getData('CollapsibleUI', 'autoCollapseConditionals')) === 'string') {
        if (BdApi.getData('CollapsibleUI', 'autoCollapseConditionals').split(',')
          .length = this.autoCollapseConditionals.length)

          this.autoCollapseConditionals = BdApi.getData('CollapsibleUI',
            'autoCollapseConditionals').split(',');
        else
          BdApi.setData('CollapsibleUI', 'autoCollapseConditionals',
            this.autoCollapseConditionals.toString());
      } else
        BdApi.setData('CollapsibleUI', 'autoCollapseConditionals',
          this.autoCollapseConditionals.toString());

      // resizableChannelList [Default: true]
      if (BdApi.getData('CollapsibleUI', 'resizableChannelList') === 'false')
        this.resizableChannelList = false;
      else if (BdApi.getData('CollapsibleUI', 'resizableChannelList') === 'true')
        this.resizableChannelList = true;
      else
        BdApi.setData('CollapsibleUI', 'resizableChannelList', 'true');

      // resizableMembersList [Default: true]
      if (BdApi.getData('CollapsibleUI', 'resizableMembersList') === 'false')
        this.resizableMembersList = false;
      else if (BdApi.getData('CollapsibleUI', 'resizableMembersList') === 'true')
        this.resizableMembersList = true;
      else
        BdApi.setData('CollapsibleUI', 'resizableMembersList', 'true');

      // resizableUserProfile [Default: true]
      if (BdApi.getData('CollapsibleUI', 'resizableUserProfile') === 'false')
        this.resizableUserProfile = false;
      else if (BdApi.getData('CollapsibleUI', 'resizableUserProfile') === 'true')
        this.resizableUserProfile = true;
      else
        BdApi.setData('CollapsibleUI', 'resizableUserProfile', 'true');

      // channelListWidth [Default: 0]
      if (typeof(BdApi.getData('CollapsibleUI', 'channelListWidth')) === 'string')
        this.channelListWidth = parseInt(BdApi.getData('CollapsibleUI',
          'channelListWidth'));
      else
        BdApi.setData('CollapsibleUI', 'channelListWidth',
          this.channelListWidth.toString());

      // membersListWidth [Default: 0]
      if (typeof(BdApi.getData('CollapsibleUI', 'membersListWidth')) === 'string')
        this.membersListWidth = parseInt(BdApi.getData('CollapsibleUI',
          'membersListWidth'));
      else
        BdApi.setData('CollapsibleUI', 'membersListWidth',
          this.membersListWidth.toString());

      // profilePanelWidth [Default: 0]
      if (typeof(BdApi.getData('CollapsibleUI', 'profilePanelWidth')) === 'string')
        this.profilePanelWidth = parseInt(BdApi.getData('CollapsibleUI',
          'profilePanelWidth'));
      else
        BdApi.setData('CollapsibleUI', 'profilePanelWidth',
          this.profilePanelWidth.toString());

      // buttonsOrder [Default: [1, 2, 4, 6, 7, 3, 5, 8]]
      if (typeof(BdApi.getData('CollapsibleUI', 'buttonsOrder')) === 'string') {
        if (BdApi.getData('CollapsibleUI', 'buttonsOrder').split(',')
          .map(Number).length = this.buttonsOrder.length)

          this.buttonsOrder = BdApi.getData('CollapsibleUI', 'buttonsOrder')
            .split(',').map(Number);
        else
          BdApi.setData('CollapsibleUI', 'buttonsOrder',
            this.buttonsOrder.toString());
      } else
        BdApi.setData('CollapsibleUI', 'buttonsOrder',
          this.buttonsOrder.toString());

      // dynamicUncollapseEnabled [Default: [true, true, true, true, true, true, true, true]]
      if (typeof(BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled')) === 'string') {
        if (BdApi.getData('CollapsibleUI', 'dynamicUncollapseEnabled').split(',')
          .map(x => (x == 'true') ? true : false)
          .length = this.dynamicUncollapseEnabled.length)

          this.dynamicUncollapseEnabled = BdApi.getData('CollapsibleUI',
            'dynamicUncollapseEnabled').split(',')
            .map(x => (x == 'true') ? true : false);
        else
          BdApi.setData('CollapsibleUI', 'dynamicUncollapseEnabled',
            this.dynamicUncollapseEnabled.toString());
      } else
        BdApi.setData('CollapsibleUI', 'dynamicUncollapseEnabled',
          this.dynamicUncollapseEnabled.toString());

      // disabledButtonsStayCollapsed [Default: false]
      if (BdApi.getData('CollapsibleUI', 'disabledButtonsStayCollapsed') === 'false')
        this.disabledButtonsStayCollapsed = false;
      else if (BdApi.getData('CollapsibleUI', 'disabledButtonsStayCollapsed') === 'true')
        this.disabledButtonsStayCollapsed = true;
      else
        BdApi.setData('CollapsibleUI', 'disabledButtonsStayCollapsed', 'false');

      // keyBindsEnabled [Default: true]
      if (BdApi.getData('CollapsibleUI', 'keyBindsEnabled') === 'false')
        this.keyBindsEnabled = false;
      else if (BdApi.getData('CollapsibleUI', 'keyBindsEnabled') === 'true')
        this.keyBindsEnabled = true;
      else
        BdApi.setData('CollapsibleUI', 'keyBindsEnabled', 'true');

      // keyStringList [Default: ["Alt+S", "Alt+C", "Alt+T", "Alt+W", "Alt+M", "Alt+U", "Alt+P", "Alt+I"]]
      if (typeof(BdApi.getData('CollapsibleUI', 'keyStringList')) === 'string') {
        if (BdApi.getData('CollapsibleUI', 'keyStringList')
          .split(',').length = this.keyStringList.length)

          this.keyStringList = BdApi.getData('CollapsibleUI',
            'keyStringList').split(',');
        else
          BdApi.setData('CollapsibleUI', 'keyStringList',
            this.keyStringList.toString());
      } else
        BdApi.setData('CollapsibleUI', 'keyStringList',
          this.keyStringList.toString());

      // settingsButtonsMaxWidth [Default: 100]
      if (typeof(BdApi.getData('CollapsibleUI', 'settingsButtonsMaxWidth')) === 'string')
        this.settingsButtonsMaxWidth = parseInt(BdApi.getData('CollapsibleUI',
          'settingsButtonsMaxWidth'));
      else
        BdApi.setData('CollapsibleUI', 'settingsButtonsMaxWidth',
          this.settingsButtonsMaxWidth.toString());

      // messageBarButtonsMaxWidth [Default: 200]
      if (typeof(BdApi.getData('CollapsibleUI', 'messageBarButtonsMaxWidth')) === 'string')
        this.messageBarButtonsMaxWidth = parseInt(BdApi.getData('CollapsibleUI',
          'messageBarButtonsMaxWidth'));
      else
        BdApi.setData('CollapsibleUI', 'messageBarButtonsMaxWidth',
          this.messageBarButtonsMaxWidth.toString());

      // messageBarButtonsMinWidth [Default: 40]
      if (typeof(BdApi.getData('CollapsibleUI', 'messageBarButtonsMinWidth')) === 'string')
        this.messageBarButtonsMinWidth = parseInt(BdApi.getData('CollapsibleUI',
          'messageBarButtonsMinWidth'));
      else
        BdApi.setData('CollapsibleUI', 'messageBarButtonsMinWidth',
          this.messageBarButtonsMinWidth.toString());

      // toolbarIconMaxWidth [Default: 300]
      if (typeof(BdApi.getData('CollapsibleUI', 'toolbarIconMaxWidth')) === 'string')
        this.toolbarIconMaxWidth = parseInt(BdApi.getData('CollapsibleUI',
          'toolbarIconMaxWidth'));
      else
        BdApi.setData('CollapsibleUI', 'toolbarIconMaxWidth',
          this.toolbarIconMaxWidth.toString());

      // toolbarMaxWidth [Default: 800]
      if (typeof(BdApi.getData('CollapsibleUI', 'toolbarMaxWidth')) === 'string')
        this.toolbarMaxWidth = parseInt(BdApi.getData('CollapsibleUI',
          'toolbarMaxWidth'));
      else
        BdApi.setData('CollapsibleUI', 'toolbarMaxWidth',
          this.toolbarMaxWidth.toString());

      // userAreaMaxHeight [Default: 300]
      if (typeof(BdApi.getData('CollapsibleUI', 'userAreaMaxHeight')) === 'string')
        this.userAreaMaxHeight = parseInt(BdApi.getData('CollapsibleUI',
          'userAreaMaxHeight'));
      else
        BdApi.setData('CollapsibleUI', 'userAreaMaxHeight',
          this.userAreaMaxHeight.toString());

      // msgBarMaxHeight [Default: 400]
      if (typeof(BdApi.getData('CollapsibleUI', 'msgBarMaxHeight')) === 'string')
        this.msgBarMaxHeight = parseInt(BdApi.getData('CollapsibleUI',
          'msgBarMaxHeight'));
      else
        BdApi.setData('CollapsibleUI', 'msgBarMaxHeight',
          this.msgBarMaxHeight.toString());

      // windowBarHeight [Default: 18]
      if (typeof(BdApi.getData('CollapsibleUI', 'windowBarHeight')) === 'string')
        this.windowBarHeight = parseInt(BdApi.getData('CollapsibleUI',
          'windowBarHeight'));
      else
        BdApi.setData('CollapsibleUI', 'windowBarHeight',
          this.windowBarHeight.toString());

      // collapsedDistance [Default: 0]
      if (typeof(BdApi.getData('CollapsibleUI', 'collapsedDistance')) === 'string')
        this.collapsedDistance = parseInt(BdApi.getData('CollapsibleUI',
          'collapsedDistance'));
      else
        BdApi.setData('CollapsibleUI', 'collapsedDistance',
          this.collapsedDistance.toString());

      // buttonCollapseFudgeFactor [Default: 10]
      if (typeof(BdApi.getData('CollapsibleUI', 'buttonCollapseFudgeFactor')) === 'string')
        this.buttonCollapseFudgeFactor = parseInt(BdApi.getData('CollapsibleUI',
          'buttonCollapseFudgeFactor'));
      else
        BdApi.setData('CollapsibleUI', 'buttonCollapseFudgeFactor',
          this.buttonCollapseFudgeFactor.toString());

      // persistentUnreadBadge [Default: true]
      if (BdApi.getData('CollapsibleUI', 'persistentUnreadBadge') === 'false')
        this.persistentUnreadBadge = false;
      else if (BdApi.getData('CollapsibleUI', 'persistentUnreadBadge') === 'true')
        this.persistentUnreadBadge = true;
      else
        BdApi.setData('CollapsibleUI', 'persistentUnreadBadge', 'true');
    }

    // Initializes integration with various themes
    initThemeIntegration = () => {
      // Initialize Horizontal Server List integration
      this.isHSLLoaded = false;
      try {
        for (var i = 0; i < document.styleSheets.length; i++) {
          try {
            if (document.styleSheets[i].ownerNode.getAttribute('id') == 'HorizontalServerList-theme-container')
              this.isHSLLoaded = true;
          } catch {}
        }
      } catch {}

      // Initialize Dark Matter List integration
      this.isDarkMatterLoaded = false;
      try {
        for (var i = 0; i < document.styleSheets.length; i++) {
          try {
            if (document.styleSheets[i].ownerNode.getAttribute('id') == 'Dark-Matter')
              this.isDarkMatterLoaded = true;
          } catch {}
        }
      } catch {}

      // Fix incompatibility between HSL and Dark Matter
      if (this.isHSLLoaded && this.isDarkMatterLoaded) {
        this.settingsContainerBase.style.width = '100%';
        this.settingsContainerBase.style.left = '0px';
        this.windowBase.style.minWidth = '100vw';
      }
    }

    // Creates and inserts CollapsibleUI toolbar
    initToolbar = () => {
      // Define & add toolbar container
      // Original icon sources:
      //   - Discord (Some icons are identical to their vanilla counterparts)
      //   - Bootstrap Icons: https://icons.getbootstrap.com/
      //   - Jam Icons: https://jam-icons.com/
      // Icons modified to fit Discord's theme by me
      this.toolbarContainer = document.createElement('div');
      this.toolbarContainer.setAttribute('id', 'cui-toolbar-container');
      this.toolbarContainer.classList.add('collapsible-ui-element');
      this.toolbarContainer.style.alignItems = 'right';
      this.toolbarContainer.style.display = 'flex';
      this.toolbarContainer.style.padding = '0px';
      this.toolbarContainer.style.margin = '0px';
      this.toolbarContainer.style.border = '0px';
      this.toolbarContainer.innerHTML = '<div id="cui-icon-insert-point" style="display: none;"></div>';

      // Insert icons in the correct spot
      try {
        if (this.inviteToolbar || this.searchBar) {
          if (this.moreButton)
            this.toolBar.insertBefore(this.toolbarContainer,
              this.moreButton.parentElement.parentElement);
          else
            this.toolBar.insertBefore(this.toolbarContainer, (this.inviteToolbar)
              ? this.inviteToolbar.nextElementSibling
              : this.searchBar);
        } else
          this.toolBar.insertBefore(this.toolbarContainer,
            this.toolBar.childNodes[this.toolBar.childNodes.length - 2]);
      } catch {
        this.toolBar.appendChild(this.toolbarContainer);
      }

      // Define & add new toolbar icons
      var buttonsActive = this.buttonsOrder;
      for (var i = 1; i <= this.buttonsOrder.length; i++) { // lgtm[js/unused-index-variable]
        if (i == this.buttonsOrder[this.I_SERVER_LIST]) {
          if (this.buttonsOrder[this.I_SERVER_LIST]) {
            this.serverListButton = this.addToolbarIcon(this.localeLabels.serverList,
              '<path fill="currentColor" d="M18.9,2.5H5.1C2.8,2.5,1,4.3,1,6.6v1'
              + '0.8c0,2.3,1.8,4.1,4.1,4.1h13.7c2.3,0,4.1-1.8,4.1-4.1V6.6C23,4.'
              + '3,21.2,2.5,18.9,2.5z M21.6,17.4c0,1.5-1.2,2.7-2.8,2.7H8.3c-1.5'
              + ',0-2.7-1.2-2.7-2.7V6.6c0-1.5,1.2-2.7,2.8-2.7h10.5c1.5,0,2.8,1.'
              + '2,2.8,2.7V17.4z"/>', '0 0 24 24');
          } else {
            this.serverListButton = false;
            buttonsActive[this.I_SERVER_LIST] = 0;
          }
        }
        if (i == this.buttonsOrder[this.I_CHANNEL_LIST]) {
          if (this.buttonsOrder[this.I_CHANNEL_LIST]) {
            this.channelListButton = this.addToolbarIcon(this.localeLabels.channelList,
              '<path fill="currentColor" d="M4.1,12c0,0.9-0.7,1.6-1.6,1.6S1,12.'
              + '9,1,12s0.7-1.6,1.6-1.6S4.1,11.1,4.1,12z M2.6,16.4c-0.9,0-1.6,0'
              + '.7-1.6,1.6c0,0.9,0.7,1.6,1.6,1.6s1.6-0.7,1.6-1.6C4.1,17.1,3.4,'
              + '16.4,2.6,16.4z M2.6,4.5C1.7,4.5,1,5.2,1,6.1s0.7,1.6,1.6,1.6s1.'
              + '6-0.7,1.6-1.6S3.4,4.5,2.6,4.5z M7.4,7C7.5,7,7.5,7,7.4,7C7.5,7,'
              + '7.5,7,7.4,7H22c0,0,0,0,0,0c0,0,0,0,0,0c0.6,0,1-0.4,1-1c0-0.5-0'
              + '.4-1-1-1c0,0,0,0,0,0c0,0,0,0,0,0H7.5c0,0,0,0,0,0c0,0,0,0,0,0c-'
              + '0.6,0-1,0.4-1,1C6.4,6.6,6.9,7,7.4,7z M7.4,13C7.5,13,7.5,13,7.4'
              + ',13C7.5,13,7.5,13,7.4,13h9c0,0,0,0,0,0c0,0,0,0,0,0c0.6,0,1-0.4'
              + ',1-1c0-0.5-0.4-1-1-1c0,0,0,0,0,0c0,0,0,0,0,0H7.5c0,0,0,0,0,0c0'
              + ',0,0,0,0,0c-0.6,0-1,0.4-1,1C6.4,12.5,6.9,13,7.4,13z M7.4,18.9C'
              + '7.5,18.9,7.5,18.9,7.4,18.9C7.5,18.9,7.5,18.9,7.4,18.9l12.4,0c0'
              + ',0,0,0,0,0c0,0,0,0,0,0c0.6,0,1-0.4,1-1c0-0.5-0.4-1-1-1c0,0,0,0'
              + ',0,0c0,0,0,0,0,0L7.5,17c0,0,0,0,0,0c0,0,0,0,0,0c-0.6,0-1,0.4-1'
              + ',1C6.4,18.5,6.9,18.9,7.4,18.9z"/>', '0 0 24 24');
          } else {
            this.channelListButton = false;
            buttonsActive[this.I_CHANNEL_LIST] = 0;
          }
        }
        if (i == this.buttonsOrder[this.I_MSG_BAR]) {
          if (this.buttonsOrder[this.I_MSG_BAR] && this.msgBar) {
            this.msgBarButton = this.addToolbarIcon(this.localeLabels.msgBar,
              '<path fill="currentColor" d="M7.5,3c0-0.4,0.3-0.8,0.8-0.8c1.3,0,'
              + '2.4,0.4,3.1,0.8c0.3,0.1,0.5,0.3,0.7,0.4c0.2-0.1,0.4-0.3,0.7-0.'
              + '4c0.9-0.5,2-0.8,3.1-0.8c0.4,0,0.8,0.3,0.8,0.8c0,0.4-0.3,0.8-0.'
              + '8,0.8c-1,0-1.8,0.3-2.3,0.7c-0.2,0.1-0.4,0.3-0.7,0.4v6.4h0.8c0.'
              + '4,0,0.8,0.3,0.8,0.8c0,0.4-0.3,0.8-0.8,0.8h-0.8v6.4c0.1,0.1,0.4'
              + ',0.3,0.7,0.4c0.6,0.3,1.4,0.6,2.3,0.6c0.4,0,0.8,0.3,0.8,0.8c0,0'
              + '.4-0.3,0.8-0.8,0.8c-1.1,0-2.1-0.3-3.1-0.9c-0.2-0.1-0.4-0.3-0.7'
              + '-0.4c-0.2,0.2-0.4,0.3-0.7,0.4c-0.9,0.5-2,0.8-3.1,0.8c-0.4,0-0.'
              + '8-0.3-0.8-0.8c0-0.4,0.3-0.8,0.8-0.8c1,0,1.8-0.3,2.3-0.7c0.3-0.'
              + '2,0.5-0.3,0.7-0.4v-6.4h-0.8c-0.4,0-0.8-0.3-0.8-0.8c0-0.4,0.3-0'
              + '.8,0.8-0.8h0.8V4.8c-0.2-0.2-0.4-0.3-0.7-0.4C9.9,4,9.1,3.8,8.2,'
              + '3.8C7.8,3.8,7.5,3.4,7.5,3z"/><path fill="currentColor" d="M15.'
              + '7,7.5h4.5c1.2,0,2.2,1,2.2,2.2v4.5c0,1.2-1,2.2-2.2,2.2h-4.5c-0.'
              + '4,0-0.7,0.3-0.7,0.8l0,0c0,0.4,0.3,0.8,0.7,0.8h4.5c2.1,0,3.8-1.'
              + '7,3.8-3.7V9.7C24,7.7,22.3,6,20.2,6h-4.5C15.3,6,15,6.3,15,6.7v0'
              + 'C15,7.2,15.3,7.5,15.7,7.5z M9,6.8L9,6.8C9,6.3,8.7,6,8.3,6H3.7C'
              + '1.7,6,0,7.7,0,9.7v4.5C0,16.3,1.7,18,3.7,18h4.5C8.7,18,9,17.7,9'
              + ',17.2l0,0c0-0.4-0.3-0.8-0.7-0.8H3.7c-1.2,0-2.2-1-2.2-2.2V9.7c0'
              + '-1.2,1-2.2,2.2-2.2h4.5C8.7,7.5,9,7.2,9,6.8z"/>', '0 0 24 24');
          } else {
            this.msgBarButton = false;
            buttonsActive[this.I_MSG_BAR] = 0;
          }
        }
        if (i == this.buttonsOrder[this.I_WINDOW_BAR]) {
          if (this.buttonsOrder[this.I_WINDOW_BAR] && this.windowBar
            && !(BdApi.Plugins.isEnabled('OldTitleBar'))) {

            this.windowBarButton = this.addToolbarIcon(this.localeLabels.windowBar,
              '<path fill="currentColor" d="M22.3,4.3C22,3.8,21.5,3.4,21,3.1c-0'
              + '.6-0.4-1.4-0.6-2.2-0.6H5.1C4.3,2.5,3.6,2.7,3,3.1C2.6,3.3,2.2,3'
              + '.6,1.9,4C1.3,4.7,1,5.6,1,6.6v10.9c0,2.2,1.8,4.1,4.1,4.1h13.7c2'
              + '.3,0,4.1-1.8,4.1-4.1V6.6C23,5.7,22.8,5,22.3,4.3z M10.5,3.6c0.5'
              + ',0,0.9,0.4,0.9,0.9c0,0.5-0.4,0.9-0.9,0.9c-0.5,0-1-0.4-1-0.9C9.'
              + '5,4,9.9,3.6,10.5,3.6z M7.6,3.6c0.5,0,0.9,0.4,0.9,0.9c0,0.5-0.4'
              + ',0.9-0.9,0.9c-0.5,0-1-0.4-1-0.9C6.7,4,7.1,3.6,7.6,3.6z M4.8,3.'
              + '6c0.5,0,1,0.4,1,0.9c0,0.5-0.4,0.9-1,0.9c-0.5,0-0.9-0.4-0.9-0.9'
              + 'C3.9,4,4.3,3.6,4.8,3.6z M21.6,17.4c0,0.7-0.3,1.4-0.8,1.9c-0.1,'
              + '0.1-0.1,0.1-0.2,0.2c-0.1,0.1-0.1,0.1-0.2,0.2c-0.2,0.2-0.5,0.3-'
              + '0.7,0.3c-0.3,0.1-0.5,0.1-0.8,0.1H5.1c-0.3,0-0.6,0-0.8-0.1c-0.3'
              + '-0.1-0.5-0.2-0.7-0.3c-0.1,0-0.2-0.1-0.2-0.2c-0.1-0.1-0.1-0.1-0'
              + '.2-0.2c-0.5-0.5-0.8-1.2-0.8-1.9V9.3c0-1.5,1.2-2.8,2.8-2.8h13.8'
              + 'c1.5,0,2.7,1.2,2.7,2.7V17.4z"/>', '0 0 24 24');
          } else {
            this.windowBarButton = false;
            buttonsActive[this.I_WINDOW_BAR] = 0;
          }
        }
        if (i == this.buttonsOrder[this.I_MEMBERS_LIST]) {
          if (this.buttonsOrder[this.I_MEMBERS_LIST] && this.membersList) {
            this.membersListButton = this.addToolbarIcon(this.localeLabels.membersList,
              '<path fill="currentColor" d="M14.5 8a3 3 0 1 0-2.7-4.3c-.2.4.06.'
              + '86.44 1.12a5 5 0 0 1 2.14 3.08c.01.06.06.1.12.1ZM18.44 17.27c.'
              + '15.43.54.73 1 .73h1.06c.83 0 1.5-.67 1.5-1.5a7.5 7.5 0 0 0-6.5'
              + '-7.43c-.55-.08-.99.38-1.1.92-.06.3-.15.6-.26.87-.23.58-.05 1.3'
              + '.47 1.63a9.53 9.53 0 0 1 3.83 4.78ZM12.5 9a3 3 0 1 1-6 0 3 3 0'
              + ' 0 1 6 0ZM2 20.5a7.5 7.5 0 0 1 15 0c0 .83-.67 1.5-1.5 1.5a.2.2'
              + ' 0 0 1-.2-.16c-.2-.96-.56-1.87-.88-2.54-.1-.23-.42-.15-.42.1v2'
              + '.1a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2.1c0-.25-.31-.33-.42-'
              + '.1-.32.67-.67 1.58-.88 2.54a.2.2 0 0 1-.2.16A1.5 1.5 0 0 1 2 '
              + '20.5Z"/>', '0 0 24 24');
          } else {
            this.membersListButton = false;
            buttonsActive[this.I_MEMBERS_LIST] = 0;
          }
        }
        if (i == this.buttonsOrder[this.I_USER_AREA]) {
          if (this.buttonsOrder[this.I_USER_AREA] && this.userArea) {
            this.userAreaButton = this.addToolbarIcon(this.localeLabels.userArea,
              '<path fill="currentColor" d="M21.2,7.6H2.8C1.3,7.6,0,8.8,0,10.3v'
              + '3.3c0,1.5,1.3,2.8,2.8,2.8h18.4c1.5,0,2.8-1.3,2.8-2.8v-3.3C24,8'
              + '.8,22.7,7.6,21.2,7.6z M17.4,10.7c0.7,0,1.3,0.6,1.3,1.3s-0.6,1.'
              + '3-1.3,1.3s-1.3-0.6-1.3-1.3S16.7,10.7,17.4,10.7z M3.9,10.1c1.1,'
              + '0,1.9,0.9,1.9,1.9S5,13.9,3.9,13.9S2,13.1,2,12S2.9,10.1,3.9,10.'
              + '1z M20.7,10.7c0.7,0,1.3,0.6,1.3,1.3s-0.6,1.3-1.3,1.3s-1.3-0.6-'
              + '1.3-1.3S20,10.7,20.7,10.7z M6.5,10.8C6.5,10.8,6.5,10.8,6.5,10.'
              + '8c0-0.4,0.3-0.7,0.8-0.7h6.3c0.4,0,0.7,0.3,0.8,0.7c0,0,0,0,0,0v'
              + '0c0,0.4-0.3,0.8-0.8,0.8H7.2C6.8,11.6,6.5,11.2,6.5,10.8L6.5,10.'
              + '8z M7.2,12.4h6.3c0.4,0,0.8,0.3,0.8,0.8c0,0,0,0,0,0.1c0,0.4-0.4'
              + ',0.7-0.7,0.7H7.2c-0.4,0-0.7-0.3-0.7-0.7c0,0,0,0,0-0.1C6.5,12.8'
              + ',6.8,12.4,7.2,12.4z"/>', '0 0 24 24');
          } else {
            this.userAreaButton = false;
            buttonsActive[this.I_USER_AREA] = 0;
          }
        }
        if (i == this.buttonsOrder[this.I_CALL_CONTAINER]) {
          if (this.buttonsOrder[this.I_CALL_CONTAINER]
            && document.querySelector('.' + this.classCallContainer)) {

            this.callContainerButton = this.addToolbarIcon(this.localeLabels.callContainer,
              '<path fill="currentColor" d="M20.7,16.2c-0.1-0.1-0.2-0.2-0.3-0.'
              + '2c-0.5-0.4-1-0.8-1.6-1.1l-0.3-0.2c-0.7-0.5-1.3-0.7-1.8-0.7c-0.'
              + '8,0-1.4,0.4-2,1.2c-0.2,0.4-0.5,0.5-0.9,0.5c-0.3,0-0.5-0.1-0.7-'
              + '0.2c-2.2-1-3.7-2.5-4.6-4.4C8,10.2,8.2,9.5,8.9,9c0.4-0.3,1.2-0.'
              + '8,1.2-1.8C10,6,7.4,2.5,6.3,2.1C5.9,2,5.4,2,4.9,2.1C3.7,2.5,2.8'
              + ',3.3,2.3,4.2c-0.4,0.9-0.4,2,0.1,3.2C3.7,10.7,5.6,13.6,8,16c2.4'
              + ',2.3,5.2,4.2,8.6,5.7c0.3,0.1,0.6,0.2,0.9,0.3c0.1,0,0.1,0,0.2,0'
              + 'c0,0,0.1,0,0.1,0h0c1.6,0,3.5-1.4,4.1-3.1C22.4,17.5,21.4,16.8,'
              + '20.7,16.2z"/>', '0 0 24 24');
          } else {
            this.callContainerButton = false;
            buttonsActive[this.I_CALL_CONTAINER] = 0;
          }
        }
        if (i == this.buttonsOrder[this.I_USER_PROFILE]) {
          if (this.buttonsOrder[this.I_USER_PROFILE] && this.profilePanel) {
            this.profilePanelButton = this.addToolbarIcon(this.localeLabels.profilePanel,
              '<path fill="currentColor" fill-rule="evenodd" d="M23 12.38c-.02.'
              + '38-.45.58-.78.4a6.97 6.97 0 0 0-6.27-.08.54.54 0 0 1-.44 0 8.97'
              + ' 8.97 0 0 0-11.16 3.55c-.1.15-.1.35 0 .5.37.58.8 1.13 1.28 1.61'
              + '.24.24.64.15.8-.15.19-.38.39-.73.58-1.02.14-.21.43-.1.4.15l-.19'
              + ' 1.96c-.02.19.07.37.23.47A8.96 8.96 0 0 0 12 21a.4.4 0 0 1 .38'
              + '.27c.1.33.25.65.4.95.18.34-.02.76-.4.77L12 23a11 11 0 1 1 11-10'
              + '.62ZM15.5 7.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule='
              + '"evenodd"></path><path fill="currentColor" d="M24 19a5 5 0 1 1'
              + '-10 0 5 5 0 0 1 10 0Z"></path>', '0 0 24 24');
          } else {
            this.profilePanelButton = false;
            buttonsActive[this.I_USER_PROFILE] = 0;
          }
        }
      }

      return buttonsActive;
    }

    // Initializes UI styles, transitions, and collapsed elements
    initUI = () => {
      var cui = this; // Abstract CollapsibleUI as a variable

      // Adjust targeted elements if UI transitions are disabled
      if (this.disableTransitions)
        this.profilePanel = this.profilePanelWrapper;

      // Adjust UI element styling in preparation for transitions
      if (!this.disableTransitions) {
        document.querySelectorAll('.collapsible-ui-element')
          .forEach(e => e.style.transition = 'max-width ' + this.transitionSpeed
          + 'ms, margin ' + this.transitionSpeed + 'ms, padding '
          + this.transitionSpeed + 'ms');
        this.toolBar.style.transition = 'max-width ' + this.transitionSpeed + 'ms';

        if (this.windowBar) {
          if (this.isDarkMatterLoaded)
            this.windowBar.style.height = '26px';
          else
            this.windowBar.style.height = this.windowBarHeight + 'px';
        }
        if (this.membersList) {
          this.membersList.style.overflow = 'hidden';
          this.membersList.style.minWidth = 'var(--cui-members-width)';
          this.membersList.style.minHeight = '100%';
          this.membersList.style.flexBasis = 'auto';
        }
        if (this.membersListNotices) {
          this.membersListNotices.style.width = '0px';
          this.membersListNotices.style.overflow = 'visible';
        }
        if (this.profilePanel) {
          this.profilePanel.style.overflow = 'hidden';
          this.profilePanel.style.minHeight = '100%';
          this.profilePanel.style.width = 'var(--cui-profile-width)';
        }
        if (this.profilePanelWrapper)
          this.profilePanelWrapper.style.width = 'auto';
        if (this.msgBar)
          this.msgBar.style.maxHeight = this.msgBarMaxHeight + 'px';
        if (this.callContainerExists)
          document.querySelector('.' + this.classCallContainer)
            .style.minHeight = '0px';
        if (document.querySelector('.' + this.classDMElement))
          document.querySelectorAll('.' + this.classDMElement)
            .forEach(e => e.style.maxWidth = '200000px');
        if (this.avatarWrapper)
          this.avatarWrapper.style.minWidth = '0';
        if (this.userArea)
          this.userArea.style.overflow = 'hidden';
        if (this.channelList)
          this.channelList.style.overflow = 'hidden';
      }

      // Read stored user data to decide active state of Server List button
      if (this.serverList) {
        this.floatElement(this.I_SERVER_LIST, false);
        if (this.buttonsOrder[this.I_SERVER_LIST] || this.disabledButtonsStayCollapsed) {
          if (BdApi.getData('CollapsibleUI', 'serverListButtonActive') === 'false') {
            if (this.serverListButton)
              this.serverListButton.classList.remove(this.classSelected);
            if (this.disableTransitions) {
              this.serverList.style.display = 'none';
            } else {
              this.serverList.style.width = this.collapsedDistance + 'px';
              if (this.isDarkMatterLoaded) {
                this.settingsContainerBase.style.width = '100%';
                this.settingsContainerBase.style.left = '0px';
                this.windowBase.style.minWidth = '100vw';
              }
            }
            if (this.isHSLLoaded) {
              this.windowBase.style.setProperty('top', '0px', 'important');
            }
          } else if (BdApi.getData('CollapsibleUI', 'serverListButtonActive') === 'true') {
            if (this.serverListButton)
              this.serverListButton.classList.add(this.classSelected);
          } else {
            BdApi.setData('CollapsibleUI', 'serverListButtonActive', 'true');
            if (this.serverListButton)
              this.serverListButton.classList.add(this.classSelected);
          }
        } else
          BdApi.setData('CollapsibleUI', 'serverListButtonActive', 'true');
      }

      // Read stored user data to decide active state of Channel List button
      if (this.channelList) {
        this.floatElement(this.I_CHANNEL_LIST, false);
        if (this.buttonsOrder[this.I_CHANNEL_LIST] || this.disabledButtonsStayCollapsed) {
          if (BdApi.getData('CollapsibleUI', 'channelListButtonActive') === 'false') {
            if (this.channelListButton)
              this.channelListButton.classList.remove(this.classSelected);
            if (this.disableTransitions) {
              this.channelList.style.display = 'none';
            } else {
              this.channelList.style.transition = 'width ' + this.transitionSpeed + 'ms';
              this.channelList.style.width = this.collapsedDistance + 'px';
              if (this.isDarkMatterLoaded) {
                this.settingsContainer.style.display = 'none';
                if (this.spotifyContainer)
                  this.spotifyContainer.style.display = 'none';
              }
            }
          } else if (BdApi.getData('CollapsibleUI', 'channelListButtonActive') === 'true') {
            if (this.channelListButton)
              this.channelListButton.classList.add(this.classSelected);
          } else {
            BdApi.setData('CollapsibleUI', 'channelListButtonActive', 'true');
            if (this.channelListButton)
              this.channelListButton.classList.add(this.classSelected);
          }
        } else
          BdApi.setData('CollapsibleUI', 'channelListButtonActive', 'true');
      }

      // Read stored user data to decide active state of Message Bar button
      if (this.msgBar) {
        if (this.buttonsOrder[this.I_MSG_BAR] || this.disabledButtonsStayCollapsed) {
          if (BdApi.getData('CollapsibleUI', 'msgBarButtonActive') === 'false') {
            if (this.msgBarButton)
              this.msgBarButton.classList.remove(this.classSelected);
            if (!(document.querySelector(this.classTextInput)?.innerHTML)) {
              if (this.disableTransitions) {
                this.msgBar.style.display = 'none';
              } else {
                this.msgBar.style.maxHeight = this.collapsedDistance + 'px';
                this.msgBar.style.overflow = 'hidden';
              }
            }
          } else if (BdApi.getData('CollapsibleUI', 'msgBarButtonActive') === 'true') {
            if (this.msgBarButton)
              this.msgBarButton.classList.add(this.classSelected);
          } else {
            BdApi.setData('CollapsibleUI', 'msgBarButtonActive', 'true');
            if (this.msgBarButton)
              this.msgBarButton.classList.add(this.classSelected);
          }
        } else
          BdApi.setData('CollapsibleUI', 'msgBarButtonActive', 'true');
      }

      // Read stored user data to decide active state of Window Bar button
      if (this.windowBar) {
        if (this.buttonsOrder[this.I_WINDOW_BAR] || this.disabledButtonsStayCollapsed) {
          if (BdApi.getData('CollapsibleUI', 'windowBarButtonActive') === 'false') {
            if (this.windowBarButton)
              this.windowBarButton.classList.remove(this.classSelected);
            if (this.disableTransitions) {
              this.windowBar.style.display = 'none';
            } else {
              this.windowBar.style.height = '0px';
              if (this.isDarkMatterLoaded)
                this.windowBar.style.opacity = '0';
              this.windowBar.style.padding = '0px';
              this.windowBar.style.margin = '0px';
              this.windowBar.style.overflow = 'hidden';
              this.wordMark.style.display = 'none';
            }
          } else if (BdApi.getData('CollapsibleUI', 'windowBarButtonActive') === 'true') {
            if (this.windowBarButton)
              this.windowBarButton.classList.add(this.classSelected);
          } else {
            BdApi.setData('CollapsibleUI', 'windowBarButtonActive', 'true');
            if (this.windowBarButton)
              this.windowBarButton.classList.add(this.classSelected);
          }
        } else
          BdApi.setData('CollapsibleUI', 'windowBarButtonActive', 'true');
      }

      // Read stored user data to decide active state of Members List button
      if (this.membersList) {
        this.floatElement(this.I_MEMBERS_LIST, false);
        if (this.buttonsOrder[this.I_MEMBERS_LIST] || this.disabledButtonsStayCollapsed) {
          if (BdApi.getData('CollapsibleUI', 'membersListButtonActive') === 'false') {
            if (this.membersListButton)
              this.membersListButton.classList.remove(this.classSelected);
            if (this.disableTransitions) {
              this.membersList.style.display = 'none';
            } else {
              this.membersList.style.transition = 'width ' + this.transitionSpeed
                + 'ms, min-width ' + this.transitionSpeed + 'ms';
              this.contentWindow.style.transition = 'max-width ' + this.transitionSpeed + 'ms';
              this.membersList.style.width = this.collapsedDistance + 'px';
              this.membersList.style.minWidth = this.collapsedDistance + 'px';
              this.contentWindow.style.maxWidth = 'calc(100% - ' + this.collapsedDistance + 'px)';
            }
          } else if (BdApi.getData('CollapsibleUI', 'membersListButtonActive') === 'true') {
            if (this.membersListButton)
              this.membersListButton.classList.add(this.classSelected);
            if (this.membersListWidth != 0) {
              this.membersList.style.width = this.membersListWidth + 'px';
              this.membersList.style.minWidth = this.membersListWidth + 'px';
              this.contentWindow.style.maxWidth = 'calc(100% - ' + this.membersListWidth + 'px)';
            } else {
              this.membersList.style.width = 'var(--cui-members-width)';
              this.membersList.style.minWidth = 'var(--cui-members-width)';
              this.contentWindow.style.maxWidth = 'calc(100% - var(--cui-members-width))';
            }
          } else {
            BdApi.setData('CollapsibleUI', 'membersListButtonActive', 'true');
            if (this.membersListButton)
              this.membersListButton.classList.add(this.classSelected);
            if (this.membersListWidth != 0) {
              this.membersList.style.width = this.membersListWidth + 'px';
              this.membersList.style.minWidth = this.membersListWidth + 'px';
              this.contentWindow.style.maxWidth = 'calc(100% - ' + this.membersListWidth + 'px)';
            } else {
              this.membersList.style.width = 'var(--cui-members-width)';
              this.membersList.style.minWidth = 'var(--cui-members-width)';
              this.contentWindow.style.maxWidth = 'calc(100% - var(--cui-members-width))';
            }
          }
        } else
          BdApi.setData('CollapsibleUI', 'membersListButtonActive', 'true');
      }

      // Read stored user data to decide active state of Profile Panel button
      if (this.profilePanel) {
        this.floatElement(this.I_USER_PROFILE, false);
        if (this.buttonsOrder[this.I_USER_PROFILE] || this.disabledButtonsStayCollapsed) {
          if (BdApi.getData('CollapsibleUI', 'profilePanelButtonActive') === 'false') {
            if (this.profilePanelButton)
              this.profilePanelButton.classList.remove(this.classSelected);
            if (this.disableTransitions) {
              this.profilePanel.style.display = 'none';
            } else {
              this.profilePanel.style.transition = 'width ' + this.transitionSpeed
                + 'ms, min-width ' + this.transitionSpeed + 'ms';
              this.profilePanel.style.width = this.collapsedDistance + 'px';
            }
          } else if (BdApi.getData('CollapsibleUI', 'profilePanelButtonActive') === 'true') {
            if (this.profilePanelButton)
              this.profilePanelButton.classList.add(this.classSelected);
            if (this.profilePanelWidth != 0)
              this.profilePanel.style.width = this.profilePanelWidth + 'px';
            else
              this.profilePanel.style.width = 'var(--cui-profile-width)';
          } else {
            BdApi.setData('CollapsibleUI', 'profilePanelButtonActive', 'true');
            if (this.profilePanelButton)
              this.profilePanelButton.classList.add(this.classSelected);
            if (this.profilePanelWidth != 0)
              this.profilePanel.style.width = this.profilePanelWidth + 'px';
            else
              this.profilePanel.style.width = 'var(--cui-profile-width)';
          }
        } else
          BdApi.setData('CollapsibleUI', 'profilePanelButtonActive', 'true');
      }

      // Read stored user data to decide active state of User Area button
      if (this.userArea) {
        if (this.buttonsOrder[this.I_USER_AREA] || this.disabledButtonsStayCollapsed) {
          if (BdApi.getData('CollapsibleUI', 'userAreaButtonActive') === 'false') {
            if (this.userAreaButton)
              this.userAreaButton.classList.remove(this.classSelected);
            if (this.disableTransitions) {
              this.userArea.style.display = 'none';
            } else {
              this.userArea.style.maxHeight = this.collapsedDistance + 'px';
            }
          } else if (BdApi.getData('CollapsibleUI', 'userAreaButtonActive') === 'true') {
            if (this.userAreaButton)
              this.userAreaButton.classList.add(this.classSelected);
          } else {
            BdApi.setData('CollapsibleUI', 'userAreaButtonActive', 'true');
            if (this.userAreaButton)
              this.userAreaButton.classList.add(this.classSelected);
          }
        } else
          BdApi.setData('CollapsibleUI', 'userAreaButtonActive', 'true');
      }

      // Read stored user data to decide active state of Call Container button
      if (document.querySelector('.' + this.classCallContainer)) {
        if (this.buttonsOrder[this.I_CALL_CONTAINER] || this.disabledButtonsStayCollapsed) {
          if (BdApi.getData('CollapsibleUI', 'callContainerButtonActive') === 'false') {
            if (this.callContainerButton)
              this.callContainerButton.classList.remove(this.classSelected);
            if (document.querySelector('.' + this.classCallContainer)) {
              if (this.disableTransitions) {
                document.querySelector('.' + this.classCallContainer).style.display = 'none';
              } else {
                document.querySelector('.' + this.classCallContainer).style.maxHeight = '0px';
                if (document.querySelector('.' + this.classCallUserWrapper))
                  document.querySelector('.' + this.classCallUserWrapper).style.display = 'none';
              }
            }
          } else if (BdApi.getData('CollapsibleUI', 'callContainerButtonActive') === 'true') {
            if (this.callContainerButton)
              this.callContainerButton.classList.add(this.classSelected);
          } else {
            BdApi.setData('CollapsibleUI', 'callContainerButtonActive', 'true');
            if (this.callContainerButton)
              this.callContainerButton.classList.add(this.classSelected);
          }
        } else
          BdApi.setData('CollapsibleUI', 'callContainerButtonActive', 'true');
      }

      // Apply transitions to UI elements
      if (!this.disableTransitions) {

        // Create plugin stylesheet
        this.pluginStyle = document.createElement("style");
        this.pluginStyle.setAttribute('id', 'cui-stylesheet');
        this.pluginStyle.appendChild(document.createTextNode(""));
        document.head.appendChild(this.pluginStyle);
        this.pluginStyle.sheet.insertRule(":root {--cui-members-width: 240px}", 0);
        this.pluginStyle.sheet.insertRule(":root {--cui-profile-width: 340px}", 1);
        this.pluginStyle.sheet.insertRule("::-webkit-scrollbar {width: 0px; background: transparent;}", 2);

        // Handle resizing channel list
        if (this.resizableChannelList) {
          this.channelList.style.resize = 'horizontal';
          this.channelList.style.maxWidth = '80vw';

          // Hide webkit resizer
          this.pluginStyle.sheet.insertRule("::-webkit-resizer {display: none;}", 3);

          document.body.addEventListener('mousedown', function () {
            cui.channelList.style.transition = 'none';
          }, { signal: this.eventListenerSignal });

          if (this.fullscreenButton) {
            this.fullscreenButton.addEventListener('click', function () {
              if (document.fullscreen)
                cui.channelList.style.maxWidth = '80vw';
              else
                cui.channelList.style.maxWidth = '0px';
            }, { signal: this.eventListenerSignal });
          }

          this.channelList.addEventListener('contextmenu', function (event) {
            if (event.target !== event.currentTarget)
              return;
            try { cui.channelListWidthObserver.disconnect(); } catch {}
            cui.channelListWidth = 0;
            BdApi.setData('CollapsibleUI', 'channelListWidth',
              cui.channelListWidth.toString());
            cui.channelList.style.transition = 'width ' + cui.transitionSpeed + 'ms';
            cui.channelList.style.removeProperty('width');
            try {
              cui.channelListWidthObserver.observe(cui.channelList,
                { attributeFilter: ['style'] });
            } catch {}
            event.preventDefault();

          }, { signal: this.eventListenerSignal });

          this.channelListWidthObserver = new MutationObserver((mutationList) => {
            try {
              if (((!cui.isCollapsed[cui.I_CHANNEL_LIST])
                || (BdApi.getData('CollapsibleUI', 'channelListButtonActive') === 'true'))
                && !document.fullscreen) {

                var oldChannelListWidth = cui.channelListWidth;
                if (parseInt(cui.channelList.style.width)) {
                  cui.channelListWidth = parseInt(cui.channelList.style.width);
                } else if (cui.channelListWidth != 0) {
                  cui.channelList.style.transition = 'none';
                  cui.channelList.style.width = cui.channelListWidth + 'px';
                  cui.channelList.style.transition = 'width ' + cui.transitionSpeed + 'ms';
                } else {
                  cui.channelList.style.removeProperty('width');
                }
                if (oldChannelListWidth != cui.channelListWidth)
                  BdApi.setData('CollapsibleUI', 'channelListWidth',
                    cui.channelListWidth.toString());
              }
            } catch (e) {
              console.warn('%c[CollapsibleUI] ' + '%cFailed to trigger \
                mutationObserver width update! (see below)',
                'color: #3a71c1; font-weight: 700;', '');
              console.warn(e);
            }
          });
          this.channelListWidthObserver.observe(this.channelList,
            { attributeFilter: ['style'] });
        }
        if (((!this.isCollapsed[this.I_CHANNEL_LIST])
          || (BdApi.getData('CollapsibleUI', 'channelListButtonActive') === 'true'))
          && this.channelListWidth != 0) {

          this.channelList.style.transition = 'none';
          this.channelList.style.width = this.channelListWidth + 'px';
        }

        this.channelList.style.transition = 'none';
        this.serverList.style.transition = 'width ' + this.transitionSpeed + 'ms';

        if (this.windowBar)
          this.windowBar.style.transition = 'height ' + this.transitionSpeed + 'ms';

        if (this.membersList && this.membersListInner) {

          // Handle resizing members list
          if (this.resizableMembersList) {
            this.membersList.style.resize = 'horizontal';
            this.membersList.style.maxWidth = '80vw';

            // Flip members list outer wrapper, then flip inner wrapper back
            // This moves the webkit resize handle to the bottom left
            // Without affecting the elements inside
            this.membersList.style.transform = 'scaleX(-1)';
            this.membersListInner.style.transform = 'scaleX(-1)';

            this.membersListInner.style.minWidth = '100%';
            this.membersListInner.style.maxWidth = '100%';
            document.querySelectorAll('.' + this.classMembersListMember)
              .forEach(e => e.style.maxWidth = '100%');

            // Hide webkit resizer
            if (!this.resizableChannelList) {
              this.pluginStyle.sheet.insertRule("::-webkit-resizer {display: none;}", 3);
            }

            // DateViewer compatibility
            this.pluginStyle.sheet.insertRule("#dv-mount {transform: scaleX(-1);}", 4);

            document.body.addEventListener('mousedown', function () {
              cui.membersList.style.transition = 'none';
              cui.contentWindow.style.transition = 'none';
              cui.membersList.style.minWidth = '0';
              //cui.contentWindow.style.maxWidth = '100%';
            }, { signal: this.eventListenerSignal });

            if (this.fullscreenButton) {
              this.fullscreenButton.addEventListener('click', function () {
                if (document.fullscreen)
                  cui.membersList.style.maxWidth = '80vw';
                else
                  cui.membersList.style.maxWidth = '0px';
              }, { signal: this.eventListenerSignal });
            }

            this.membersList.addEventListener('contextmenu', function (event) {
              if (event.target !== event.currentTarget)
                return;
              try { cui.membersListWidthObserver.disconnect(); } catch {}
              cui.membersListWidth = 0;
              BdApi.setData('CollapsibleUI', 'membersListWidth',
                cui.membersListWidth.toString());
              cui.membersList.style.transition = 'width ' + cui.transitionSpeed
                + 'ms, min-width ' + cui.transitionSpeed + 'ms';
              cui.contentWindow.style.transition = 'max-width ' + cui.transitionSpeed + 'ms';
              cui.membersList.style.width = 'var(--cui-members-width)';
              cui.membersList.style.minWidth = 'var(--cui-members-width)';
              if ((!cui.floatingDynamicUncollapse) || (BdApi.getData('CollapsibleUI',
                'membersListButtonActive') === 'true'))
                cui.contentWindow.style.maxWidth = 'calc(100% - var(--cui-members-width))';
              else
                cui.contentWindow.style.maxWidth = '100%';
              try {
                cui.membersListWidthObserver.observe(cui.membersList,
                  { attributeFilter: ['style'] });
              } catch {}
              event.preventDefault();

            }, { signal: this.eventListenerSignal });

            this.membersListWidthObserver = new MutationObserver((mutationList) => {
              try {
                if (((!cui.isCollapsed[cui.I_MEMBERS_LIST])
                  || (BdApi.getData('CollapsibleUI', 'membersListButtonActive') === 'true'))
                  && !document.fullscreen) {

                  var oldMembersListWidth = cui.membersListWidth;
                  if (parseInt(cui.membersList.style.width)) {
                    cui.membersListWidth = parseInt(cui.membersList.style.width);
                    if ((!cui.floatingDynamicUncollapse) || (BdApi.getData('CollapsibleUI',
                      'membersListButtonActive') === 'true'))
                      cui.contentWindow.style.maxWidth = 'calc(100% - ' + cui.membersListWidth + 'px)';
                    else
                      cui.contentWindow.style.maxWidth = '100%';
                  } else if (cui.membersListWidth != 0) {
                    cui.membersList.style.transition = 'none';
                    cui.contentWindow.style.transition = 'none';
                    cui.membersList.style.width = cui.membersListWidth + 'px';
                    cui.membersList.style.minWidth = cui.membersListWidth + 'px';
                    if ((!cui.floatingDynamicUncollapse) || (BdApi.getData('CollapsibleUI',
                      'membersListButtonActive') === 'true'))
                      cui.contentWindow.style.maxWidth = 'calc(100% - ' + cui.membersListWidth + 'px)';
                    else
                      cui.contentWindow.style.maxWidth = '100%';
                    cui.membersList.style.transition = 'width ' + cui.transitionSpeed
                      + 'ms, min-width ' + cui.transitionSpeed + 'ms';
                    cui.contentWindow.style.transition = 'max-width ' + cui.transitionSpeed + 'ms';
                  }
                  if (oldMembersListWidth != cui.membersListWidth)
                    BdApi.setData('CollapsibleUI', 'membersListWidth',
                      cui.membersListWidth.toString());
                }
              } catch (e) {
                console.warn('%c[CollapsibleUI] ' + '%cFailed to trigger \
                  mutationObserver width update! (see below)',
                  'color: #3a71c1; font-weight: 700;', '');
                console.warn(e);
              }
            });
            this.membersListWidthObserver.observe(this.membersList,
              { attributeFilter: ['style'] });
          }
          if (((!this.isCollapsed[this.I_MEMBERS_LIST])
            || (BdApi.getData('CollapsibleUI', 'membersListButtonActive') === 'true'))
            && this.membersListWidth != 0) {

            this.membersList.style.transition = 'none';
            this.contentWindow.style.transition = 'none';
            this.membersList.style.width = this.membersListWidth + 'px';
            this.membersList.style.minWidth = this.membersListWidth + 'px';
            if ((!this.floatingDynamicUncollapse) || (BdApi.getData('CollapsibleUI',
              'membersListButtonActive') === 'true'))
              this.contentWindow.style.maxWidth = 'calc(100% - ' + this.membersListWidth + 'px)';
            else
              this.contentWindow.style.maxWidth = '100%';
          }

          this.membersList.style.transition = 'none';
          this.contentWindow.style.transition = 'none';
        }

        if (this.profilePanel && this.profilePanelInner) {

          // Handle resizing profile panel
          if (this.resizableUserProfile) {
            this.profilePanel.style.resize = 'horizontal';
            this.profilePanel.style.maxWidth = '80vw';
            this.profilePanel.style.minWidth = '0';
            this.profilePanelInner.style.maxWidth = '80vw';
            this.profilePanelInner.style.width = '100%';
            this.profileBannerSVGWrapper.style.maxHeight =
              this.profileBannerSVGWrapper.style.minHeight;
            this.profileBannerSVGWrapper.style.minWidth = '100%';
            this.profileBannerSVGWrapper.querySelector('mask rect')
              .setAttribute('width', '500%')
            this.profileBannerSVGWrapper.setAttribute('viewBox', '');

            // Flip profile panel outer wrapper, then flip inner wrapper back
            // This moves the webkit resize handle to the bottom left
            // Without affecting the elements inside
            this.profilePanel.style.transform = 'scaleX(-1)';
            this.profilePanelInner.style.transform = 'scaleX(-1)';

            // Hide webkit resizer
            if (!this.resizableChannelList) {
              this.pluginStyle.sheet.insertRule("::-webkit-resizer {display: none;}", 3);
            }

            document.body.addEventListener('mousedown', function () {
              cui.profilePanel.style.transition = 'none';
            }, { signal: this.eventListenerSignal });

            if (this.fullscreenButton) {
              this.fullscreenButton.addEventListener('click', function () {
                if (document.fullscreen)
                  cui.profilePanel.style.maxWidth = '80vw';
                else
                  cui.profilePanel.style.maxWidth = '0px';
              }, { signal: this.eventListenerSignal });
            }

            this.profilePanel.addEventListener('contextmenu', function (event) {
              if (event.target !== event.currentTarget)
                return;
              try { cui.profilePanelWidthObserver.disconnect(); } catch {}
              cui.profilePanelWidth = 0;
              BdApi.setData('CollapsibleUI', 'profilePanelWidth',
                cui.profilePanelWidth.toString());
              cui.profilePanel.style.transition = 'width ' + cui.transitionSpeed
                + 'ms, min-width ' + cui.transitionSpeed + 'ms';
              cui.profilePanel.style.width = 'var(--cui-profile-width)';
              try {
                cui.profilePanelWidthObserver.observe(cui.profilePanel,
                  { attributeFilter: ['style'] });
              } catch {}
              event.preventDefault();

            }, { signal: this.eventListenerSignal });

            this.profilePanelWidthObserver = new MutationObserver((mutationList) => {
              try {
                if (((!cui.isCollapsed[cui.I_USER_PROFILE])
                  || (BdApi.getData('CollapsibleUI', 'profilePanelButtonActive') === 'true'))
                  && !document.fullscreen) {

                  var oldProfilePanelWidth = cui.profilePanelWidth;
                  if (parseInt(cui.profilePanel.style.width)) {
                    cui.profilePanelWidth = parseInt(cui.profilePanel.style.width);
                  } else if (cui.profilePanelWidth != 0) {
                    cui.profilePanel.style.transition = 'none';
                    cui.profilePanel.style.width = cui.profilePanelWidth + 'px';
                    cui.profilePanel.style.transition = 'width ' + cui.transitionSpeed
                      + 'ms, min-width ' + cui.transitionSpeed + 'ms';
                  }
                  if (oldProfilePanelWidth != cui.profilePanelWidth)
                    BdApi.setData('CollapsibleUI', 'profilePanelWidth',
                      cui.profilePanelWidth.toString());
                }
              } catch (e) {
                console.warn('%c[CollapsibleUI] ' + '%cFailed to trigger \
                  mutationObserver width update! (see below)',
                  'color: #3a71c1; font-weight: 700;', '');
                console.warn(e);
              }
            });
            this.profilePanelWidthObserver.observe(this.profilePanel,
              { attributeFilter: ['style'] });
          }
          if (((!this.isCollapsed[this.I_USER_PROFILE])
            || (BdApi.getData('CollapsibleUI', 'profilePanelButtonActive') === 'true'))
            && this.profilePanelWidth != 0) {

            this.profilePanel.style.transition = 'none';
            this.profilePanel.style.width = this.profilePanelWidth + 'px';
          }

          this.profilePanel.style.transition = 'none';
        }

        if (this.msgBar)
          this.msgBar.style.transition = 'max-height ' + this.transitionSpeed + 'ms';

        if (this.userArea)
          this.userArea.style.transition = 'max-height ' + this.transitionSpeed + 'ms';

        if (document.querySelector('.' + this.classCallContainer))
          document.querySelector('.' + this.classCallContainer).style.transition =
            'max-height ' + this.transitionSpeed + 'ms';

        if (this.windowBase) {
          if (this.isDarkMatterLoaded)
            this.windowBase.style.transition = 'top ' + this.transitionSpeed
              + 'ms, min-width ' + this.transitionSpeed + 'ms';
          else
            this.windowBase.style.transition = 'top ' + this.transitionSpeed + 'ms';
        }

        if (this.isDarkMatterLoaded)
          this.settingsContainerBase.style.transition = 'width '
            + this.transitionSpeed + 'ms, left ' + this.transitionSpeed + 'ms';
      }
    }

    // Checks if cursor is near an element
    isNear = (element, distance, x, y) => {
      try {
        if (this.isHSLLoaded && (element === this.serverList)) {
          var top = 0,
          left = element.getBoundingClientRect().left - distance,
          right = left + element.getBoundingClientRect().width + 2 * distance,
          bottom = parseInt(BdApi.getData('CollapsibleUI', 'windowBarHeight'))
            + element.getBoundingClientRect().height + distance;
        } else {
          var top = element.getBoundingClientRect().top - distance,
          left = element.getBoundingClientRect().left - distance,
          right = left + element.getBoundingClientRect().width + 2 * distance,
          bottom = top + element.getBoundingClientRect().height + 2 * distance;
        }
      } catch {
        var left = -1000,
        top = -1000,
        right = -1000,
        bottom = -1000;
      }
      return (x > left && x < right && y > top && y < bottom);
    }

    // Updates UI for dynamic uncollapse
    tickDynamicUncollapse = (settingsButtons, buttonsActive, singleButtonWidth) => {
      var cui = this; // Abstract CollapsibleUI as a variable

      // Toolbar
      if (this.enableFullToolbarCollapse) {
        if (!this.isNear(this.toolBar, this.buttonCollapseFudgeFactor,
          this.mouseX, this.mouseY))

          this.toolBar.style.maxWidth = singleButtonWidth;
      }

      // Toolbar Container
      if (!this.disableToolbarCollapse) {
        if (!this.isNear(this.toolbarContainer, this.buttonCollapseFudgeFactor,
          this.mouseX, this.mouseY))

          this.collapseToolbarIcons(buttonsActive);
      }

      // Settings Container
      if (!this.disableSettingsCollapse) {
        if (!this.isNear(this.settingsContainer, this.buttonCollapseFudgeFactor,
          this.mouseX, this.mouseY)) {

          for (var i = 0; i < (settingsButtons.length - 1); i++) {
            settingsButtons[i].style.maxWidth = '0px';
          }
        }
      }

      // Message Bar Button Container
      if ((!this.disableMsgBarBtnCollapse) && this.msgBarBtnContainer) {
        if (!this.isNear(this.msgBarBtnContainer, this.buttonCollapseFudgeFactor,
          this.mouseX, this.mouseY))

          this.msgBarBtnContainer.style.maxWidth = this.messageBarButtonsMinWidth + 'px';
      }

      // Server List
      if ((BdApi.getData('CollapsibleUI', 'serverListButtonActive') === 'false') && this.serverList) {
        this.floatElement(this.I_SERVER_LIST, true);
        if (this.dynamicUncollapseEnabled[this.I_SERVER_LIST]
          && this.isCollapsed[this.I_SERVER_LIST] && this.isNear(this.serverList,
          this.dynamicUncollapseDistance[this.I_SERVER_LIST], this.mouseX,
          this.mouseY) && !(this.isNear(this.msgBar, 0, this.mouseX, this.mouseY))) {

          if (this.serverDUDelay) {
            clearTimeout(this.serverDUDelay);
            this.serverDUDelay = false;
          }
          this.serverDUDelay = setTimeout(() => {
            cui.serverList.style.removeProperty('width');
            if (cui.isHSLLoaded)
              cui.windowBase.style.removeProperty('top');
            else if (cui.isDarkMatterLoaded) {
              cui.settingsContainerBase.style.width = 'calc(100% + 72px)';
              cui.settingsContainerBase.style.left = '-72px';
              cui.windowBase.style.minWidth = 'calc(100vw - 72px)';
            }
            cui.isCollapsed[cui.I_SERVER_LIST] = false;
            cui.serverDUDelay = false;
          }, this.dynamicUncollapseDelay);
        } else if (!this.dynamicUncollapseEnabled[this.I_SERVER_LIST] ||
          ((!(this.isCollapsed[this.I_SERVER_LIST]) || this.serverDUDelay)
          && !(this.isNear(this.serverList, this.dynamicUncollapseCloseDistance[this.I_SERVER_LIST],
          this.mouseX, this.mouseY)))) {

          if (this.serverDUDelay) {
            clearTimeout(this.serverDUDelay);
            this.serverDUDelay = false;
          }
          this.serverList.style.width = this.collapsedDistance + 'px';
          if (this.isHSLLoaded)
            this.windowBase.style.setProperty('top', '0px', 'important');
          if (this.isDarkMatterLoaded) {
            this.settingsContainerBase.style.width = '100%';
            this.settingsContainerBase.style.left = '0px';
            this.windowBase.style.minWidth = '100vw';
          }
          this.isCollapsed[this.I_SERVER_LIST] = true;
        }
      }

      // Channel List
      if ((BdApi.getData('CollapsibleUI', 'channelListButtonActive') === 'false') && this.channelList) {
        this.floatElement(this.I_CHANNEL_LIST, true);
        if (this.dynamicUncollapseEnabled[this.I_CHANNEL_LIST]
          && this.isCollapsed[this.I_CHANNEL_LIST] && this.isNear(this.channelList,
          this.dynamicUncollapseDistance[this.I_CHANNEL_LIST], this.mouseX, this.mouseY)
          && !(this.isNear(this.msgBar, 0, this.mouseX, this.mouseY))) {

          if (this.channelDUDelay) {
            clearTimeout(this.channelDUDelay);
            this.channelDUDelay = false;
          }
          this.channelDUDelay = setTimeout(() => {
            cui.channelList.style.transition = 'width '
              + cui.transitionSpeed + 'ms';
            cui.channelList.style.removeProperty('width');
            if (cui.isDarkMatterLoaded) {
              cui.settingsContainer.style.removeProperty('display');
              if (cui.spotifyContainer)
                cui.spotifyContainer.style.removeProperty('display');
            }
            cui.isCollapsed[cui.I_CHANNEL_LIST] = false;
            cui.channelDUDelay = false;
          }, this.dynamicUncollapseDelay);
        } else if (!this.dynamicUncollapseEnabled[this.I_CHANNEL_LIST]
          || (!(this.isCollapsed[this.I_CHANNEL_LIST]) && !(this.isNear(this.channelList,
          this.dynamicUncollapseCloseDistance[this.I_CHANNEL_LIST],
          this.mouseX, this.mouseY)))) {

          if (this.channelDUDelay) {
            clearTimeout(this.channelDUDelay);
            this.channelDUDelay = false;
          }
          this.channelList.style.transition = 'width '
            + this.transitionSpeed + 'ms';
          this.channelList.style.width = this.collapsedDistance + 'px';
          if (this.isDarkMatterLoaded) {
            this.settingsContainer.style.display = 'none';
            if (this.spotifyContainer)
              this.spotifyContainer.style.display = 'none';
          }
          this.isCollapsed[this.I_CHANNEL_LIST] = true;
        }
      }

      // Message Bar
      if ((BdApi.getData('CollapsibleUI', 'msgBarButtonActive') === 'false') && this.msgBar) {
        if (this.dynamicUncollapseEnabled[this.I_MSG_BAR]
          && this.isCollapsed[this.I_MSG_BAR] && this.isNear(this.msgBar,
          this.dynamicUncollapseDistance[this.I_MSG_BAR], this.mouseX, this.mouseY)) {

          if (this.messageDUDelay) {
            clearTimeout(this.messageDUDelay);
            this.messageDUDelay = false;
          }
          this.messageDUDelay = setTimeout(() => {
            cui.msgBar.style.maxHeight = cui.msgBarMaxHeight + 'px';
            cui.msgBar.style.removeProperty('overflow');
            cui.isCollapsed[cui.I_MSG_BAR] = false;
            cui.messageDUDelay = false;
          }, this.dynamicUncollapseDelay);
        } else if (!this.dynamicUncollapseEnabled[this.I_MSG_BAR]
          || (!(this.isCollapsed[this.I_MSG_BAR]) && !(this.isNear(this.msgBar,
          this.dynamicUncollapseCloseDistance[this.I_MSG_BAR], this.mouseX,
          this.mouseY)) && !(document.querySelector(this.classTextInput)?.innerHTML))) {

          if (this.messageDUDelay) {
            clearTimeout(this.messageDUDelay);
            this.messageDUDelay = false;
          }
          this.msgBar.style.maxHeight = this.collapsedDistance + 'px';
          this.msgBar.style.overflow = 'hidden';
          this.isCollapsed[this.I_MSG_BAR] = true;
        }
      }

      // Window Bar
      if ((BdApi.getData('CollapsibleUI', 'windowBarButtonActive') === 'false') && this.windowBar) {
        if (this.dynamicUncollapseEnabled[this.I_WINDOW_BAR]
          && this.isCollapsed[this.I_WINDOW_BAR] && this.isNear(this.windowBar,
          this.dynamicUncollapseDistance[this.I_WINDOW_BAR],
          this.mouseX, this.mouseY)) {

          if (this.windowDUDelay) {
            clearTimeout(this.windowDUDelay);
            this.windowDUDelay = false;
          }
          this.windowDUDelay = setTimeout(() => {
            if (cui.isDarkMatterLoaded) {
              cui.windowBar.style.height = '26px';
              cui.windowBar.style.removeProperty('opacity');
            } else
              cui.windowBar.style.height = cui.windowBarHeight + 'px';
            cui.windowBar.style.removeProperty('padding');
            cui.windowBar.style.removeProperty('margin');
            cui.wordMark.style.removeProperty('display');
            cui.windowBar.style.removeProperty('overflow');
            cui.isCollapsed[cui.I_WINDOW_BAR] = false;
            cui.windowDUDelay = false;
          }, this.dynamicUncollapseDelay);
        } else if (!this.dynamicUncollapseEnabled[this.I_WINDOW_BAR]
          || (!(this.isCollapsed[this.I_WINDOW_BAR]) && !(this.isNear(this.windowBar,
          this.dynamicUncollapseCloseDistance[this.I_WINDOW_BAR],
          this.mouseX, this.mouseY)))) {

          if (this.windowDUDelay) {
            clearTimeout(this.windowDUDelay);
            this.windowDUDelay = false;
          }
          this.windowBar.style.height = '0px';
          if (this.isDarkMatterLoaded)
            this.windowBar.style.opacity = '0';
          this.windowBar.style.padding = '0px';
          this.windowBar.style.margin = '0px';
          this.windowBar.style.overflow = 'hidden';
          this.wordMark.style.display = 'none';
          this.isCollapsed[this.I_WINDOW_BAR] = true;
        }
      }

      // Members List
      if ((BdApi.getData('CollapsibleUI', 'membersListButtonActive') === 'false') && this.membersList) {
        this.floatElement(this.I_MEMBERS_LIST, true);
        if (this.dynamicUncollapseEnabled[this.I_MEMBERS_LIST]
          && this.isCollapsed[this.I_MEMBERS_LIST] && this.isNear(this.membersList,
          this.dynamicUncollapseDistance[this.I_MEMBERS_LIST], this.mouseX,
          this.mouseY) && !(this.isNear(this.msgBar, 0, this.mouseX, this.mouseY))) {

          if (this.membersDUDelay) {
            clearTimeout(this.membersDUDelay);
            this.membersDUDelay = false;
          }
          this.membersDUDelay = setTimeout(() => {
            cui.membersList.style.transition = 'width ' + cui.transitionSpeed
              + 'ms, min-width ' + cui.transitionSpeed + 'ms';
            cui.contentWindow.style.transition = 'max-width ' + cui.transitionSpeed + 'ms';
            if (cui.membersListWidth != 0) {
              cui.membersList.style.width = cui.membersListWidth + 'px';
              cui.membersList.style.minWidth = cui.membersListWidth + 'px';
              if (!cui.floatingDynamicUncollapse)
                cui.contentWindow.style.maxWidth = 'calc(100% - ' + cui.membersListWidth + 'px)';
              else
                cui.contentWindow.style.maxWidth = '100%';
            } else {
              cui.membersList.style.width = 'var(--cui-members-width)';
              cui.membersList.style.minWidth = 'var(--cui-members-width)';
              if (!cui.floatingDynamicUncollapse)
                cui.contentWindow.style.maxWidth = 'calc(100% - var(--cui-members-width))';
              else
                cui.contentWindow.style.maxWidth = '100%';
            }
            cui.isCollapsed[cui.I_MEMBERS_LIST] = false;
            cui.membersDUDelay = false;
          }, this.dynamicUncollapseDelay);
        } else if (!this.dynamicUncollapseEnabled[this.I_MEMBERS_LIST]
          || (!(this.isCollapsed[this.I_MEMBERS_LIST]) && !(this.isNear(this.membersList,
          this.dynamicUncollapseCloseDistance[this.I_MEMBERS_LIST], this.mouseX,
          this.mouseY)) && !(this.isNear(document.querySelector('.' +
          this.classUserPopout), 10000, this.mouseX, this.mouseY)))) {

          if (this.membersDUDelay) {
            clearTimeout(this.membersDUDelay);
            this.membersDUDelay = false;
          }
          this.membersList.style.transition = 'width ' + this.transitionSpeed
            + 'ms, min-width ' + this.transitionSpeed + 'ms';
          this.contentWindow.style.transition = 'max-width ' + this.transitionSpeed + 'ms';
          this.membersList.style.width = this.collapsedDistance + 'px';
          this.membersList.style.minWidth = this.collapsedDistance + 'px';
          if (!this.floatingDynamicUncollapse)
            this.contentWindow.style.maxWidth = 'calc(100% - ' + this.collapsedDistance + 'px)';
          else
            this.contentWindow.style.maxWidth = '100%';
          this.isCollapsed[this.I_MEMBERS_LIST] = true;
        }
      }

      // Profile Panel
      if ((BdApi.getData('CollapsibleUI', 'profilePanelButtonActive') === 'false') && this.profilePanel) {
        this.floatElement(this.I_USER_PROFILE, true);
        if (this.dynamicUncollapseEnabled[this.I_USER_PROFILE]
          && this.isCollapsed[this.I_USER_PROFILE] && this.isNear(this.profilePanel,
          this.dynamicUncollapseDistance[this.I_USER_PROFILE], this.mouseX,
          this.mouseY) && !(this.isNear(this.msgBar, 0, this.mouseX, this.mouseY))) {

          if (this.panelDUDelay) {
            clearTimeout(this.panelDUDelay);
            this.panelDUDelay = false;
          }
          this.panelDUDelay = setTimeout(() => {
            cui.profilePanel.style.transition = 'width ' + cui.transitionSpeed
              + 'ms, min-width ' + cui.transitionSpeed + 'ms';
            if (cui.profilePanelWidth != 0)
              cui.profilePanel.style.width = cui.profilePanelWidth + 'px';
            else
              cui.profilePanel.style.width = 'var(--cui-profile-width)';
            cui.isCollapsed[cui.I_USER_PROFILE] = false;
            cui.panelDUDelay = false;
          }, this.dynamicUncollapseDelay);
        } else if (!this.dynamicUncollapseEnabled[this.I_USER_PROFILE]
          || (!(this.isCollapsed[this.I_USER_PROFILE]) && !(this.isNear(this.profilePanel,
          this.dynamicUncollapseCloseDistance[this.I_USER_PROFILE], this.mouseX,
          this.mouseY)) && !(this.isNear(document.querySelector('.' +
          this.classUserPopout), 10000, this.mouseX, this.mouseY)))) {

          if (this.panelDUDelay) {
            clearTimeout(this.panelDUDelay);
            this.panelDUDelay = false;
          }
          this.profilePanel.style.transition = 'width ' + this.transitionSpeed
            + 'ms, min-width ' + this.transitionSpeed + 'ms';
          this.profilePanel.style.width = this.collapsedDistance + 'px';
          this.isCollapsed[this.I_USER_PROFILE] = true;
        }
      }

      // User Area
      if ((BdApi.getData('CollapsibleUI', 'userAreaButtonActive') === 'false') && this.userArea) {
        if (this.dynamicUncollapseEnabled[this.I_USER_AREA]
          && this.isCollapsed[this.I_USER_AREA] && this.isNear(this.userArea,
          this.dynamicUncollapseDistance[this.I_USER_AREA],
          this.mouseX, this.mouseY)) {

          if (this.userDUDelay) {
            clearTimeout(this.userDUDelay);
            this.userDUDelay = false;
          }
          this.userDUDelay = setTimeout(() => {
            cui.userArea.style.maxHeight = cui.userAreaMaxHeight + 'px';
            cui.isCollapsed[cui.I_USER_AREA] = false;
            cui.userDUDelay = false;
          }, this.dynamicUncollapseDelay);
        } else if (!this.dynamicUncollapseEnabled[this.I_USER_AREA]
          || (!(this.isCollapsed[this.I_USER_AREA]) && !(this.isNear(this.userArea,
          this.dynamicUncollapseCloseDistance[this.I_USER_AREA],
          this.mouseX, this.mouseY)))) {

          if (this.userDUDelay) {
            clearTimeout(this.userDUDelay);
            this.userDUDelay = false;
          }
          this.userArea.style.maxHeight = this.collapsedDistance + 'px';
          this.isCollapsed[this.I_USER_AREA] = true;
        }
      }

      // Call Container
      if ((BdApi.getData('CollapsibleUI', 'callContainerButtonActive') === 'false')
        && document.querySelector('.' + this.classCallContainer)) {

        if (this.dynamicUncollapseEnabled[this.I_CALL_CONTAINER]
          && this.isCollapsed[this.I_CALL_CONTAINER]
          && this.isNear(document.querySelector('.' + this.classCallContainer),
          this.dynamicUncollapseDistance[this.I_CALL_CONTAINER],
          this.mouseX, this.mouseY)) {

          if (this.callDUDelay) {
            clearTimeout(this.callDUDelay);
            this.callDUDelay = false;
          }
          this.callDUDelay = setTimeout(() => {
            if (document.querySelector('.' + cui.classNoChat))
              document.querySelector('.' + cui.classCallContainer)
                .style.maxHeight = BdApi.DOM.screenHeight + 'px';
            else
              document.querySelector('.' + cui.classCallContainer)
                .style.maxHeight = (BdApi.DOM.screenHeight - 222) + 'px';
            if (document.querySelector('.' + cui.classCallUserWrapper))
              document.querySelector('.' + cui.classCallUserWrapper)
                .style.removeProperty('display');
            cui.isCollapsed[cui.I_CALL_CONTAINER] = false;
            cui.callDUDelay = false;
          }, this.dynamicUncollapseDelay);
        } else if (!this.dynamicUncollapseEnabled[this.I_CALL_CONTAINER]
          || (!(this.isCollapsed[this.I_CALL_CONTAINER])
          && !(this.isNear(document.querySelector('.' + this.classCallContainer),
          this.dynamicUncollapseCloseDistance[this.I_CALL_CONTAINER],
          this.mouseX, this.mouseY)))) {

          if (this.callDUDelay) {
            clearTimeout(this.callDUDelay);
            this.callDUDelay = false;
          }
          document.querySelector('.' + this.classCallContainer).style.maxHeight = '0px';
          if (document.querySelector('.' + this.classCallUserWrapper))
            document.querySelector('.' + this.classCallUserWrapper)
              .style.display = 'none';
          this.isCollapsed[this.I_CALL_CONTAINER] = true;
        }
      }
    }

    // Toggles a button at the specified index
    toggleButton = (index) => {
      switch (index) {
      case 0: // I_SERVER_LIST
        this.floatElement(this.I_SERVER_LIST, false);
        if (BdApi.getData('CollapsibleUI', 'serverListButtonActive') === 'true') {
          if (this.disableTransitions) {
            this.serverList.style.display = 'none';
          } else {
            this.serverList.style.width = this.collapsedDistance + 'px';
            if (this.isDarkMatterLoaded) {
              this.settingsContainerBase.style.width = '100%';
              this.settingsContainerBase.style.left = '0px';
              this.windowBase.style.minWidth = '100vw';
            }
          }
          if (this.isHSLLoaded) {
            this.windowBase.style.setProperty('top', '0px', 'important');
          }
          BdApi.setData('CollapsibleUI', 'serverListButtonActive', 'false');
          this.serverListButton.classList.remove(this.classSelected);
        } else {
          if (this.disableTransitions) {
            this.serverList.style.removeProperty('display');
          } else {
            this.serverList.style.removeProperty('width');
            if ((!this.isHSLLoaded) && this.isDarkMatterLoaded) {
              this.settingsContainerBase.style.width = 'calc(100% + 72px)';
              this.settingsContainerBase.style.left = '-72px';
              this.windowBase.style.minWidth = 'calc(100vw - 72px)';
            }
          }
          if (this.isHSLLoaded) {
            this.windowBase.style.removeProperty('top');
          }
          BdApi.setData('CollapsibleUI', 'serverListButtonActive', 'true');
          this.serverListButton.classList.add(this.classSelected);
        }
        break;

      case 1: // I_CHANNEL_LIST
        this.floatElement(this.I_CHANNEL_LIST, false);
        if (BdApi.getData('CollapsibleUI', 'channelListButtonActive') === 'true') {
          if (this.disableTransitions) {
            this.channelList.style.display = 'none';
          } else {
            this.channelList.style.transition = 'width '
              + this.transitionSpeed + 'ms';
            this.channelList.style.width = this.collapsedDistance + 'px';
            if (this.isDarkMatterLoaded) {
              this.settingsContainer.style.display = 'none';
              if (this.spotifyContainer)
                this.spotifyContainer.style.display = 'none';
            }
          }
          BdApi.setData('CollapsibleUI', 'channelListButtonActive', 'false');
          this.channelListButton.classList.remove(this.classSelected);
        } else {
          if (this.disableTransitions) {
            this.channelList.style.removeProperty('display');
          } else {
            this.channelList.style.transition = 'width '
              + this.transitionSpeed + 'ms';
            this.channelList.style.removeProperty('width');
            if (this.isDarkMatterLoaded) {
              this.settingsContainer.style.removeProperty('display');
              if (this.spotifyContainer)
                this.spotifyContainer.style.removeProperty('display');
            }
          }
          BdApi.setData('CollapsibleUI', 'channelListButtonActive', 'true');
          this.channelListButton.classList.add(this.classSelected);
        }
        break;

      case 2: // I_MSG_BAR
        if (BdApi.getData('CollapsibleUI', 'msgBarButtonActive') === 'true') {
          if (!(document.querySelector(this.classTextInput)?.innerHTML)) {
            if (this.disableTransitions) {
              this.msgBar.style.display = 'none';
            } else {
              this.msgBar.style.maxHeight = this.collapsedDistance + 'px';
              this.msgBar.style.overflow = 'hidden';
            }
          }
          BdApi.setData('CollapsibleUI', 'msgBarButtonActive', 'false');
          this.msgBarButton.classList.remove(this.classSelected);
        } else {
          if (this.disableTransitions) {
            this.msgBar.style.removeProperty('display');
          } else {
            this.msgBar.style.maxHeight = this.msgBarMaxHeight + 'px';
            this.msgBar.style.removeProperty('overflow');
          }
          BdApi.setData('CollapsibleUI', 'msgBarButtonActive', 'true');
          this.msgBarButton.classList.add(this.classSelected);
        }
        break;

      case 3: // I_WINDOW_BAR
        if (BdApi.getData('CollapsibleUI', 'windowBarButtonActive') === 'true') {
          if (this.disableTransitions) {
            this.windowBar.style.display = 'none';
          } else {
            this.windowBar.style.height = '0px';
            if (this.isDarkMatterLoaded)
              this.windowBar.style.opacity = '0';
            this.windowBar.style.padding = '0px';
            this.windowBar.style.margin = '0px';
            this.windowBar.style.overflow = 'hidden';
            this.wordMark.style.display = 'none';
          }
          BdApi.setData('CollapsibleUI', 'windowBarButtonActive', 'false');
          this.windowBarButton.classList.remove(this.classSelected);
        } else {
          if (this.disableTransitions) {
            this.windowBar.style.removeProperty('display');
          } else {
            if (this.isDarkMatterLoaded) {
              this.windowBar.style.height = '26px';
              this.windowBar.style.removeProperty('opacity');
            } else
              this.windowBar.style.height = this.windowBarHeight + 'px';
            this.windowBar.style.removeProperty('padding');
            this.windowBar.style.removeProperty('margin');
            this.windowBar.style.removeProperty('overflow');
            this.wordMark.style.removeProperty('display');
          }
          BdApi.setData('CollapsibleUI', 'windowBarButtonActive', 'true');
          this.windowBarButton.classList.add(this.classSelected);
        }
        break;

      case 4: // I_MEMBERS_LIST
        this.floatElement(this.I_MEMBERS_LIST, false);
        if (BdApi.getData('CollapsibleUI', 'membersListButtonActive') === 'true') {
          if (this.disableTransitions) {
            this.membersList.style.display = 'none';
          } else {
            this.membersList.style.transition = 'width ' + this.transitionSpeed
              + 'ms, min-width ' + this.transitionSpeed + 'ms';
            this.contentWindow.style.transition = 'max-width ' + this.transitionSpeed + 'ms';
            this.membersList.style.width = this.collapsedDistance + 'px';
            this.membersList.style.minWidth = this.collapsedDistance + 'px';
            this.contentWindow.style.maxWidth = 'calc(100% - ' + this.collapsedDistance + 'px)';
          }
          BdApi.setData('CollapsibleUI', 'membersListButtonActive', 'false');
          this.membersListButton.classList.remove(this.classSelected);
        } else {
          if (this.disableTransitions) {
            this.membersList.style.removeProperty('display');
          } else {
            this.membersList.style.transition = 'width ' + this.transitionSpeed
              + 'ms, min-width ' + this.transitionSpeed + 'ms';
            this.contentWindow.style.transition = 'max-width ' + this.transitionSpeed + 'ms';
            if (this.membersListWidth != 0) {
              this.membersList.style.width = this.membersListWidth + 'px';
              this.membersList.style.minWidth = this.membersListWidth + 'px';
              this.contentWindow.style.maxWidth = 'calc(100% - ' + this.membersListWidth + 'px)';
            } else {
              this.membersList.style.width = 'var(--cui-members-width)';
              this.membersList.style.minWidth = 'var(--cui-members-width)';
              this.contentWindow.style.maxWidth = 'calc(100% - var(--cui-members-width))';
            }
          }
          BdApi.setData('CollapsibleUI', 'membersListButtonActive', 'true');
          this.membersListButton.classList.add(this.classSelected);
        }
        break;

      case 5: // I_USER_AREA
        if (BdApi.getData('CollapsibleUI', 'userAreaButtonActive') === 'true') {
          if (this.disableTransitions) {
            this.userArea.style.display = 'none';
          } else {
            this.userArea.style.maxHeight = this.collapsedDistance + 'px';
          }
          BdApi.setData('CollapsibleUI', 'userAreaButtonActive', 'false');
          this.userAreaButton.classList.remove(this.classSelected);
        } else {
          if (this.disableTransitions) {
            this.userArea.style.removeProperty('display');
          } else {
            this.userArea.style.maxHeight = this.userAreaMaxHeight + 'px';
          }
          BdApi.setData('CollapsibleUI', 'userAreaButtonActive', 'true');
          this.userAreaButton.classList.add(this.classSelected);
        }
        break;

      case 6: // I_CALL_CONTAINER
        if (BdApi.getData('CollapsibleUI', 'callContainerButtonActive') === 'true') {
          if (document.querySelector('.' + this.classCallContainer)) {
            if (this.disableTransitions) {
              document.querySelector('.' + this.classCallContainer).style.display = 'none';
            } else {
              document.querySelector('.' + this.classCallContainer).style.maxHeight = '0px';
              if (document.querySelector('.' + this.classCallUserWrapper))
                document.querySelector('.' + this.classCallUserWrapper)
                  .style.display = 'none';
            }
          }
          BdApi.setData('CollapsibleUI', 'callContainerButtonActive', 'false');
          this.callContainerButton.classList.remove(this.classSelected);
        } else {
          if (document.querySelector('.' + this.classCallContainer)) {
            if (this.disableTransitions) {
              document.querySelector('.' + this.classCallContainer)
                .style.removeProperty('display');
            } else {
              if (document.querySelector('.' + this.classNoChat))
                document.querySelector('.' + this.classCallContainer)
                  .style.maxHeight = BdApi.DOM.screenHeight + 'px';
              else
                document.querySelector('.' + this.classCallContainer)
                  .style.maxHeight = (BdApi.DOM.screenHeight - 222) + 'px';
              if (document.querySelector('.' + this.classCallUserWrapper))
                document.querySelector('.' + this.classCallUserWrapper)
                  .style.removeProperty('display');
            }
          }
          BdApi.setData('CollapsibleUI', 'callContainerButtonActive', 'true');
          this.callContainerButton.classList.add(this.classSelected);
        }
        break;

      case 7: // I_USER_PROFILE
        this.floatElement(this.I_USER_PROFILE, false);
        if (BdApi.getData('CollapsibleUI', 'profilePanelButtonActive') === 'true') {
          if (this.disableTransitions) {
            this.profilePanel.style.display = 'none';
          } else {
            this.profilePanel.style.transition = 'width ' + this.transitionSpeed
              + 'ms, min-width ' + this.transitionSpeed + 'ms';
            this.profilePanel.style.width = this.collapsedDistance + 'px';
          }
          BdApi.setData('CollapsibleUI', 'profilePanelButtonActive', 'false');
          this.profilePanelButton.classList.remove(this.classSelected);
        } else {
          if (this.disableTransitions) {
            this.profilePanel.style.removeProperty('display');
          } else {
            this.profilePanel.style.transition = 'width ' + this.transitionSpeed
              + 'ms, min-width ' + this.transitionSpeed + 'ms';
            if (this.profilePanelWidth != 0)
              this.profilePanel.style.width = this.profilePanelWidth + 'px';
            else
              this.profilePanel.style.width = 'var(--cui-profile-width)';
          }
          BdApi.setData('CollapsibleUI', 'profilePanelButtonActive', 'true');
          this.profilePanelButton.classList.add(this.classSelected);
        }
        break;

      default:
        break;
      }
    }

    // Sends/clears a persistent notification for unread DMs
    updateDMBadge = (clear) => {

      // Clear old notification if it exists
      document.querySelectorAll('.collapsible-ui-notif')
        .forEach(e => e.remove());
      this.wordMark.style.removeProperty('margin-left');

      // Count DM notifications
      var dmNotifs = 0;
      document.querySelectorAll('.' + this.classUnreadDMBadge)
        .forEach(e => dmNotifs += parseInt(e.innerHTML));

      // Return if a new notification doesn't need to be created
      if (clear || (dmNotifs == 0)) return;

      // Create new notification
      var dmBadge = document.createElement('div');
      dmBadge.classList.add('collapsible-ui-element');
      dmBadge.classList.add('collapsible-ui-notif');
      dmBadge.classList.add(this.classUnreadDMBadge);
      dmBadge.classList.add(this.classUnreadDmBadgeBase);
      dmBadge.classList.add(this.classUnreadDmBadgeEyebrow);
      dmBadge.classList.add(this.classUnreadDmBadgeShape);
      dmBadge.style.backgroundColor = 'var(--status-danger)';
      dmBadge.style.padding = '4px';
      dmBadge.style.maxHeight = (this.wordMark.getBoundingClientRect().height
        - 6) + 'px';
      dmBadge.style.minHeight = '0px';
      dmBadge.style.marginLeft = (parseInt(getComputedStyle(this.wordMark, null)
        .getPropertyValue('padding-left')) * 2 / 3) + 'px';
      dmBadge.style.marginTop = getComputedStyle(this.wordMark, null)
        .getPropertyValue('padding-top');
      dmBadge.style.position = 'fixed';
      dmBadge.style.zIndex = '10000';
      dmBadge.innerHTML = `${dmNotifs}`;

      // Insert into document
      document.body.appendChild(dmBadge);

      // Display notification
      dmBadge.style.left = this.wordMark.getBoundingClientRect().left + 'px';
      dmBadge.style.top = this.wordMark.getBoundingClientRect().top + 'px';
      this.wordMark.style.marginLeft = `${dmBadge.getBoundingClientRect().width}px`;
    }

  };
})();
