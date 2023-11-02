/**
 * @name CollapsibleUI
 * @author TenorTheHusky
 * @authorId 563652755814875146
 * @description A feature-rich BetterDiscord plugin that reworks the Discord UI to be significantly more modular
 * @version 7.4.2
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
      version: '7.4.2',
      description: 'A feature-rich BetterDiscord plugin that reworks the Discord UI to be significantly more modular',
      github: 'https://github.com/programmer2514/BetterDiscord-CollapsibleUI',
      github_raw: 'https://raw.githubusercontent.com/programmer2514/BetterDiscord-CollapsibleUI/main/CollapsibleUI.plugin.js'
    },
    changelog: [{
        title: '7.4.2',
        items: [
          'Fix for recent Discord sweeping classes/elements changes'
        ]
      }, {
        title: '7.4.1',
        items: [
          'Hotfix for newest Discord release (breaks plugin on Discord versions <238110)',
          'Fixed Call Container button appearing when it shouldn\'t',
          'Improved compatibility with certain themes'
        ]
      }, {
        title: '1.0.0 - 7.4.0',
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

      // Append main settings to Main subgroup
      groupMain.append(settingDisableTransitions);
      groupMain.append(settingTransitionSpeed);
      groupMain.append(settingDisableToolbarCollapse);
      groupMain.append(settingDisableSettingsCollapse);
      groupMain.append(settingDisableMsgBarBtnCollapse);
      groupMain.append(settingEnableFullToolbarCollapse);
      groupMain.append(settingResizableChannelList);
      groupMain.append(settingResizableMembersList);

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
      var settingProfilePanelMaxWidth =
        new zps.Textbox('User Profile - Max Width',
          null,
          BdApi.getData('CollapsibleUI', 'profilePanelMaxWidth'),
          null, { placeholder: 'Default: 340' });
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
      groupAdvanced.append(settingProfilePanelMaxWidth);
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
      settingProfilePanelMaxWidth.onChange = function (result) {
        BdApi.setData('CollapsibleUI', 'profilePanelMaxWidth', result);
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
        }
        if (this.serverList) {
          this.serverList.style.removeProperty('width');
          this.serverList.style.removeProperty('transition');
          this.serverList.style.removeProperty('display');
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
          this.profilePanel.style.removeProperty('overflow');
          this.profilePanel.style.removeProperty('transition');
          this.profilePanel.style.removeProperty('display');
        }
        if (this.profilePanelWrapper)
          this.profilePanel.style.removeProperty('width');
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
      this.classTooltipLayerContainer = 'layerContainer_d5a653';
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
      this.profilePanelWrapper = document.querySelector('.'
        + this.classProfilePanelWrapper);
      this.membersList = document.querySelector('.' + this.classMembersList);
      this.serverList = document.querySelector('.' + this.classServerList);
      this.channelList = document.querySelector('.' + this.classChannelList);
      this.settingsContainerBase = document.querySelector('.container_ca50b9');
      this.settingsContainer = this.settingsContainerBase
        .querySelector('.flex_f5fbb7');
      this.spotifyContainer = document.querySelector('.container_6sXIoE');
      this.appWrapper = document.querySelector('.app_b1f720');
      this.avatarWrapper = document.querySelector('.avatarWrapper_ba5175');
      this.moreButton = this.toolBar.querySelector('[d="M7 12.001C7 10.8964 '
        + '6.10457 10.001 5 10.001C3.89543 10.001 3 10.8964 3 12.001C3 13.1055 '
        + '3.89543 14.001 5 14.001C6.10457 14.001 7 13.1055 7 12.001ZM14 '
        + '12.001C14 10.8964 13.1046 10.001 12 10.001C10.8954 10.001 10 10.8964 '
        + '10 12.001C10 13.1055 10.8954 14.001 12 14.001C13.1046 14.001 14 '
        + '13.1055 14 12.001ZM19 10.001C20.1046 10.001 21 10.8964 21 12.001C21 '
        + '13.1055 20.1046 14.001 19 14.001C17.8954 14.001 17 13.1055 17 '
        + '12.001C17 10.8964 17.8954 10.001 19 10.001Z"]');
      this.membersListButton = this.toolBar.querySelector('[d="M14 8.00598C14 '
        + '10.211 12.206 12.006 10 12.006C7.795 12.006 6 10.211 6 8.00598C6 '
        + '5.80098 7.794 4.00598 10 4.00598C12.206 4.00598 14 5.80098 14 '
        + '8.00598ZM2 19.006C2 15.473 5.29 13.006 10 13.006C14.711 13.006 18 '
        + '15.473 18 19.006V20.006H2V19.006Z"]')?.parentElement.parentElement;
      this.profilePanelButton = this.toolBar.querySelector('[d="M12 22C12.4883 '
        + '22 12.9684 21.965 13.438 21.8974C12.5414 20.8489 12 19.4877 12 18C12 '
        + '17.6593 12.0284 17.3252 12.083 17H6V16.0244C6 14.0732 10 13 12 '
        + '13C12.6215 13 13.436 13.1036 14.2637 13.305C15.2888 12.4882 16.5874 '
        + '12 18 12C19.4877 12 20.8489 12.5414 21.8974 13.438C21.965 12.9684 22 '
        + '12.4883 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 '
        + '17.5228 6.47715 22 12 22ZM12 12C13.66 12 15 10.66 15 9C15 7.34 13.66 '
        + '6 12 6C10.34 6 9 7.34 9 9C9 10.66 10.34 12 12 12Z"]')?.parentElement
        .parentElement.parentElement;
      this.fullscreenButton =
        document.querySelector('[d="M19,3H14V5h5v5h2V5A2,2,0,0,0,19,3Z"]')
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
            cui.profilePanel.style.maxWidth = cui.collapsedDistance + 'px';
            cui.profilePanel.style.minWidth = '0px';
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
      newTooltip.classList.add(this.classTooltipWrapper);
      newTooltip.classList.add(this.classTooltipWrapperDPE);
      newTooltip.classList.add('collapsible-ui-element');
      newTooltip.style.position = 'fixed';
      newTooltip.style.textAlign = 'center';
      newTooltip.innerHTML = `<div class="${this.classTooltip} `
        + `${this.classTooltipBottom} ${this.classTooltipPrimary} `
        + `${this.classTooltipDPE}" style="opacity: 1; transform: none;">`
        + `<div class="${this.classTooltipPointer}"></div>`
        + `<div class="${this.classTooltipContent}">${msg}</div></div>`;

      // Insert tooltip into tooltip layer
      document.querySelectorAll('.' + this.classTooltipLayerContainer)[1]
        .appendChild(newTooltip);

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
            // Prevent UI jumping when user presses Shift
            if (!mutationList[0].target.classList.contains(cui.classMsgButtons))
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
      this.dynamicUncollapseDistance = [30, 30, 30, 30, 30, 30, 30, 30];
      this.dynamicUncollapseCloseDistance = [30, 30, 30, 30, 30, 30, 30, 30];
      this.dynamicUncollapseDelay = 15;

      this.autoCollapse = false;
      this.autoCollapseThreshold = [500, 600, 400, 200, 950, 400, 550, 1000];
      this.conditionalAutoCollapse = false;
      this.autoCollapseConditionals = ['', '', '', '', '', '', '', ''];

      this.resizableChannelList = true;
      this.resizableMembersList = true;
      this.channelListWidth = 0;
      this.membersListWidth = 0;

      this.buttonsOrder = [1, 2, 4, 6, 7, 3, 5, 8];
      this.dynamicUncollapseEnabled = [true, true, true, true, true, true, true, true];
      this.disabledButtonsStayCollapsed = false;

      this.keyBindsEnabled = true;
      this.keyStringList = ["Alt+S", "Alt+C", "Alt+T", "Alt+W", "Alt+M", "Alt+U", "Alt+P", "Alt+I"];

      this.settingsButtonsMaxWidth = 100;
      this.messageBarButtonsMaxWidth = 200;
      this.messageBarButtonsMinWidth = 40;
      this.toolbarIconMaxWidth = 300;
      this.profilePanelMaxWidth = 340;
      this.toolbarMaxWidth = 800;
      this.userAreaMaxHeight = 300;
      this.msgBarMaxHeight = 400;
      this.windowBarHeight = 18;
      this.collapsedDistance = 0;
      this.buttonCollapseFudgeFactor = 10;

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

        // Set new settings version
        BdApi.setData('CollapsibleUI', 'cuiSettingsVersion', '10');
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
        BdApi.setData('CollapsibleUI', 'channelListWidth',
          this.channelListWidth.toString());

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

      // profilePanelMaxWidth [Default: 340]
      if (typeof(BdApi.getData('CollapsibleUI', 'profilePanelMaxWidth')) === 'string')
        this.profilePanelMaxWidth = parseInt(BdApi.getData('CollapsibleUI',
          'profilePanelMaxWidth'));
      else
        BdApi.setData('CollapsibleUI', 'profilePanelMaxWidth',
          this.profilePanelMaxWidth.toString());

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
      // Icons are part of the Bootstrap Icons library, which can be found at https://icons.getbootstrap.com/
      var buttonsActive = this.buttonsOrder;
      for (var i = 1; i <= this.buttonsOrder.length; i++) { // lgtm[js/unused-index-variable]
        if (i == this.buttonsOrder[this.I_SERVER_LIST]) {
          if (this.buttonsOrder[this.I_SERVER_LIST]) {
            this.serverListButton = this.addToolbarIcon(this.localeLabels.serverList,
              '<path fill="currentColor" d="M-3.429,0.857C-3.429-0.72-2.149-2-0.'
              + '571-2h17.143c1.578,0,2.857,1.28,2.857,2.857v14.286c0,1.578-1.'
              + '279,2.857-2.857,2.857H-0.571c-1.578,0-2.857-1.279-2.857-2.857V0.'
              + '857z M3.714-0.571v17.143h12.857c0.789,0,1.429-0.64,1.429-1.429V0.'
              + '857c0-0.789-0.64-1.428-1.429-1.428H3.714z M2.286-0.571h-2.857C-1.'
              + '36-0.571-2,0.068-2,0.857v14.286c0,0.789,0.64,1.429,1.429,1.429h2.'
              + '857V-0.571z"/>', '-4 -4 24 24');
          } else {
            this.serverListButton = false;
            buttonsActive[this.I_SERVER_LIST] = 0;
          }
        }
        if (i == this.buttonsOrder[this.I_CHANNEL_LIST]) {
          if (this.buttonsOrder[this.I_CHANNEL_LIST]) {
            this.channelListButton = this.addToolbarIcon(this.localeLabels.channelList,
              '<path fill="currentColor" d="M3.5,13.5c0-0.414,0.335-0.75,0.75-0.'
              + '75h13.5c0.414,0,0.75,0.336,0.75,0.75s-0.336,0.75-0.75,0.75H4.'
              + '25C3.835,14.25,3.5,13.914,3.5,13.5z M3.5,7.5c0-0.415,0.335-0.'
              + '75,0.75-0.75h13.5c0.414,0,0.75,0.335,0.75,0.75s-0.336,0.75-0.'
              + '75,0.75H4.25C3.835,8.25,3.5,7.915,3.5,7.5z M3.5,1.5c0-0.415,0.'
              + '335-0.75,0.75-0.75h13.5c0.414,0,0.75,0.335,0.75,0.75s-0.336,0.'
              + '75-0.75,0.75H4.25C3.835,2.25,3.5,1.915,3.5,1.5z M-1,3c0.828,0,1.'
              + '5-0.672,1.5-1.5S-0.172,0-1,0s-1.5,0.672-1.5,1.5S-1.828,3-1,3z '
              + 'M-1,9c0.828,0,1.5-0.672,1.5-1.5S-0.172,6-1,6s-1.5,0.672-1.5,1.'
              + '5S-1.828,9-1,9z M-1,15c0.828,0,1.5-0.671,1.5-1.5S-0.172,12-1,'
              + '12s-1.5,0.671-1.5,1.5S-1.828,15-1,15z"/>', '-4 -4 24 24');
          } else {
            this.channelListButton = false;
            buttonsActive[this.I_CHANNEL_LIST] = 0;
          }
        }
        if (i == this.buttonsOrder[this.I_MSG_BAR]) {
          if (this.buttonsOrder[this.I_MSG_BAR] && this.msgBar) {
            this.msgBarButton = this.addToolbarIcon(this.localeLabels.msgBar,
              '<path fill="currentColor" d="M7.5,3c0-0.415,0.335-0.75,0.75-0.75c1.'
              + '293,0,2.359,0.431,3.09,0.85c0.261,0.147,0.48,0.296,0.66,0.428c0.'
              + '178-0.132,0.398-0.28,0.66-0.428c0.939-0.548,2.002-0.841,3.09-0.'
              + '85c0.414,0,0.75,0.335,0.75,0.75c0,0.414-0.336,0.75-0.75,0.75c-0.'
              + '959,0-1.766,0.319-2.348,0.65c-0.229,0.132-0.446,0.278-0.652,0.'
              + '442v6.407h0.75c0.414,0,0.75,0.335,0.75,0.75c0,0.414-0.336,0.75-0.'
              + '75,0.75h-0.75v6.407c0.148,0.12,0.371,0.281,0.652,0.442c0.582,0.'
              + '331,1.389,0.65,2.348,0.65c0.414,0,0.75,0.335,0.75,0.75c0,0.414-0.'
              + '336,0.75-0.75,0.75c-1.088-0.01-2.15-0.302-3.09-0.85c-0.229-0.'
              + '129-0.449-0.271-0.66-0.425c-0.212,0.155-0.433,0.297-0.66,0.428c-0.'
              + '939,0.546-2.004,0.837-3.09,0.848c-0.415,0-0.75-0.335-0.75-0.75c0-0.'
              + '414,0.335-0.75,0.75-0.75c0.957,0,1.765-0.319,2.346-0.651c0.281-0.'
              + '16,0.502-0.319,0.654-0.439v-6.41H10.5c-0.415,0-0.75-0.336-0.75-0.'
              + '75c0-0.415,0.335-0.75,0.75-0.75h0.75V4.843c-0.207-0.164-0.426-0.'
              + '311-0.654-0.442C9.884,3.984,9.075,3.759,8.25,3.75C7.835,3.75,7.5,3.'
              + '414,7.5,3z"/><path fill="currentColor" d="M15,7.5h6c0.828,0,1.5,0.'
              + '671,1.5,1.5v6c0,0.829-0.672,1.5-1.5,1.5h-6V18h6c1.656,0,3-1.344,'
              + '3-3V9c0-1.657-1.344-3-3-3h-6V7.5z M9,7.5V6H3C1.343,6,0,7.343,0,'
              + '9v6c0,1.656,1.343,3,3,3h6v-1.5H3c-0.829,0-1.5-0.671-1.5-1.5V9c0-0.'
              + '829,0.671-1.5,1.5-1.5H9z"/>', '0 0 24 24');
          } else {
            this.msgBarButton = false;
            buttonsActive[this.I_MSG_BAR] = 0;
          }
        }
        if (i == this.buttonsOrder[this.I_WINDOW_BAR]) {
          if (this.buttonsOrder[this.I_WINDOW_BAR] && this.windowBar
            && !(BdApi.Plugins.isEnabled('OldTitleBar'))) {

            this.windowBarButton = this.addToolbarIcon(this.localeLabels.windowBar,
              '<path fill="currentColor" d="M0.143,2.286c0.395,0,0.714-0.319,0.'
              + '714-0.714c0-0.395-0.319-0.714-0.714-0.714c-0.395,0-0.714,0.32-0.'
              + '714,0.714C-0.571,1.966-0.252,2.286,0.143,2.286z M3,1.571c0,0.'
              + '395-0.319,0.714-0.714,0.714c-0.395,0-0.714-0.319-0.714-0.714c0-0.'
              + '395,0.32-0.714,0.714-0.714C2.681,0.857,3,1.177,3,1.571z M4.429,2.'
              + '286c0.395,0,0.714-0.319,0.714-0.714c0-0.395-0.32-0.714-0.714-0.'
              + '714c-0.395,0-0.714,0.32-0.714,0.714C3.714,1.966,4.034,2.286,4.'
              + '429,2.286z"/><path fill="currentColor" d="M-0.571-2c-1.578,0-2.'
              + '857,1.279-2.857,2.857v14.286c0,1.578,1.279,2.857,2.857,2.857h17.'
              + '143c1.577,0,2.857-1.279,2.857-2.857V0.857c0-1.578-1.28-2.857-2.'
              + '857-2.857H-0.571z M18,0.857v2.857H-2V0.857c0-0.789,0.64-1.428,1.'
              + '429-1.428h17.143C17.361-0.571,18,0.068,18,0.857z M-0.571,16.'
              + '571C-1.36,16.571-2,15.933-2,15.143v-10h20v10c0,0.79-0.639,1.'
              + '429-1.429,1.429H-0.571z"/>', '-4 -4 24 24');
          } else {
            this.windowBarButton = false;
            buttonsActive[this.I_WINDOW_BAR] = 0;
          }
        }
        if (i == this.buttonsOrder[this.I_MEMBERS_LIST]) {
          if (this.buttonsOrder[this.I_MEMBERS_LIST] && this.membersList) {
            this.membersListButton = this.addToolbarIcon(this.localeLabels.membersList,
              '<path fill="currentColor" d="M6.5,17c0,0-1.5,0-1.5-1.5s1.5-6,7.'
              + '5-6s7.5,4.5,7.5,6S18.5,17,18.5,17H6.5z M12.5,8C14.984,8,17,5.'
              + '985,17,3.5S14.984-1,12.5-1S8,1.015,8,3.5S10.016,8,12.5,8z"/>'
              + '<path fill="currentColor" d="M3.824,17C3.602,16.531,3.49,16.'
              + '019,3.5,15.5c0-2.033,1.021-4.125,2.904-5.58C5.464,9.631,4.483,9.'
              + '488,3.5,9.5c-6,0-7.5,4.5-7.5,6S-2.5,17-2.5,17H3.824z"/>'
              + '<path fill="currentColor" d="M2.75,8C4.821,8,6.5,6.321,6.5,4.'
              + '25S4.821,0.5,2.75,0.5S-1,2.179-1,4.25S0.679,8,2.75,8z"/>',
              '-4 -4 24 24');
          } else {
            this.membersListButton = false;
            buttonsActive[this.I_MEMBERS_LIST] = 0;
          }
        }
        if (i == this.buttonsOrder[this.I_USER_AREA]) {
          if (this.buttonsOrder[this.I_USER_AREA] && this.userArea) {
            this.userAreaButton = this.addToolbarIcon(this.localeLabels.userArea,
              '<path fill="currentColor" d="M-2.5,4.25c-0.829,0-1.5,0.672-1.5,1.'
              + '5v4.5c0,0.829,0.671,1.5,1.5,1.5h21c0.83,0,1.5-0.671,1.5-1.5v-4.'
              + '5 c0-0.828-0.67-1.5-1.5-1.5H-2.5z M14.75,5.75c0.415,0,0.75,0.'
              + '335,0.75,0.75s-0.335,0.75-0.75,0.75S14,6.915,14,6.5 S14.335,5.'
              + '75,14.75,5.75z M17.75,5.75c0.415,0,0.75,0.335,0.75,0.75s-0.335,'
              + '0.75-0.75,0.75S17,6.915,17,6.5S17.335,5.75,17.75,5.75z M-2.5,6.'
              + '5c0-0.415,0.335-0.75,0.75-0.75h7.5c0.415,0,0.75,0.335,0.75,0.'
              + '75S6.165,7.25,5.75,7.25h-7.5 C-2.165,7.25-2.5,6.915-2.5,6.5z '
              + 'M-2.125,8.75h8.25C6.333,8.75,6.5,8.917,6.5,9.125S6.333,9.5,6.'
              + '125,9.5h-8.25 C-2.333,9.5-2.5,9.333-2.5,9.125S-2.333,8.75-2.'
              + '125,8.75z"/>', '-4 -4 24 24');
          } else {
            this.userAreaButton = false;
            buttonsActive[this.I_USER_AREA] = 0;
          }
        }
        if (i == this.buttonsOrder[this.I_CALL_CONTAINER]) {
          if (this.buttonsOrder[this.I_CALL_CONTAINER]
            && document.querySelector('.' + this.classCallContainer)) {

            this.callContainerButton = this.addToolbarIcon(this.localeLabels.callContainer,
              '<path fill="currentColor" d="M2.567-0.34c-0.287-0.37-0.82-0.436-1.'
              + '189-0.149c-0.028,0.021-0.055,0.045-0.079,0.07L0.006,0.875C-0.597,'
              + '1.48-0.82,2.336-0.556,3.087c1.095,3.11,2.875,5.933,5.21,8.259c2.'
              + '328,2.336,5.15,4.116,8.26,5.21c0.752,0.264,1.606,0.042,2.212-0.'
              + '562l1.292-1.294c0.332-0.329,0.332-0.866,0.002-1.196c-0.024-0.'
              + '026-0.052-0.049-0.08-0.07l-2.884-2.244c-0.205-0.158-0.474-0.'
              + '215-0.725-0.151l-2.737,0.684c-0.744,0.186-1.53-0.032-2.071-0.'
              + '573l-3.07-3.072C4.311,7.536,4.092,6.75,4.278,6.007l0.685-2.738C5'
              + '.026,3.017,4.97,2.75,4.81,2.543L2.567-0.34z M0.354-1.361c0.'
              + '852-0.852,2.234-0.852,3.085,0C3.504-1.297,3.564-1.229,3.62-1.'
              + '158l2.242,2.883c0.412,0.529,0.557,1.218,0.394,1.868L5.573,6.33C5.'
              + '501,6.618,5.585,6.923,5.795,7.134l3.071,3.071c0.21,0.21,0.516,0.'
              + '295,0.806,0.222l2.734-0.684c0.651-0.161,1.34-0.017,1.868,0.395l2.'
              + '883,2.242c1.035,0.806,1.131,2.338,0.204,3.264l-1.293,1.292c-0.'
              + '925,0.925-2.307,1.332-3.596,0.879c-3.299-1.162-6.293-3.05-8.'
              + '763-5.525C1.234,9.82-0.654,6.826-1.815,3.527C-2.267,2.24-1.'
              + '861,0.856-0.936-0.069l1.292-1.292H0.354z"/>', '-4 -4 24 24');
          } else {
            this.callContainerButton = false;
            buttonsActive[this.I_CALL_CONTAINER] = 0;
          }
        }
        if (i == this.buttonsOrder[this.I_USER_PROFILE]) {
          if (this.buttonsOrder[this.I_USER_PROFILE] && this.profilePanel) {
            this.profilePanelButton = this.addToolbarIcon(this.localeLabels.profilePanel,
              '<path fill="currentColor" d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>'
              + '<path fill="currentColor" fill-rule="evenodd" d="M0 8a8 8 0 1 1 '
              + '16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 '
              + '10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>', '-1 -1 18 18');
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
          this.contentWindow.style.maxWidth = 'calc(100% - var(--cui-members-width))';
          this.membersList.style.width = 'var(--cui-members-width)';
          this.membersList.style.minHeight = '100%';
          this.membersList.style.flexBasis = 'auto';
        }
        if (this.membersListNotices) {
          this.membersListNotices.style.width = '0px';
          this.membersListNotices.style.overflow = 'visible';
        }
        if (this.profilePanel) {
          this.profilePanel.style.overflow = 'hidden';
          this.profilePanel.style.maxWidth = this.profilePanelMaxWidth + 'px';
          this.profilePanel.style.minHeight = '100%';
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
        if (this.buttonsOrder[this.I_USER_PROFILE] || this.disabledButtonsStayCollapsed) {
          if (BdApi.getData('CollapsibleUI', 'profilePanelButtonActive') === 'false') {
            if (this.profilePanelButton)
              this.profilePanelButton.classList.remove(this.classSelected);
            if (this.disableTransitions) {
              this.profilePanel.style.display = 'none';
            } else {
              this.profilePanel.style.maxWidth = this.collapsedDistance + 'px';
              this.profilePanel.style.minWidth = '0px';
            }
          } else if (BdApi.getData('CollapsibleUI', 'profilePanelButtonActive') === 'true') {
            if (this.profilePanelButton)
              this.profilePanelButton.classList.add(this.classSelected);
          } else {
            BdApi.setData('CollapsibleUI', 'profilePanelButtonActive', 'true');
            if (this.profilePanelButton)
              this.profilePanelButton.classList.add(this.classSelected);
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

        // Handle resizing channel list
        if (this.resizableChannelList) {
          this.channelList.style.resize = 'horizontal';
          this.channelList.style.maxWidth = '80vw';

          // Hide webkit resizer
          this.pluginStyle.sheet.insertRule("::-webkit-resizer {display: none;}", 1);

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
              this.pluginStyle.sheet.insertRule("::-webkit-resizer {display: none;}", 1);
            }

            // DateViewer compatibility
            this.pluginStyle.sheet.insertRule("#dv-mount {transform: scaleX(-1);}", 2);

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
              cui.contentWindow.style.maxWidth = 'calc(100% - var(--cui-members-width))';
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
                    cui.contentWindow.style.maxWidth = 'calc(100% - ' + cui.membersListWidth + 'px)';
                  } else if (cui.membersListWidth != 0) {
                    cui.membersList.style.transition = 'none';
                    cui.contentWindow.style.transition = 'none';
                    cui.membersList.style.width = cui.membersListWidth + 'px';
                    cui.membersList.style.minWidth = cui.membersListWidth + 'px';
                    cui.contentWindow.style.maxWidth = 'calc(100% - ' + cui.membersListWidth + 'px)';
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
            this.contentWindow.style.maxWidth = 'calc(100% - ' + this.membersListWidth + 'px)';
          }

          this.membersList.style.transition = 'none';
          this.contentWindow.style.transition = 'none';
        }

        if (this.profilePanel)
          this.profilePanel.style.transition = 'max-width '
            + this.transitionSpeed + 'ms, min-width ' + this.transitionSpeed + 'ms';

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
        if (this.dynamicUncollapseEnabled[this.I_CHANNEL_LIST]
          && this.isCollapsed[this.I_CHANNEL_LIST] && this.isNear(this.channelList,
          this.dynamicUncollapseDistance[this.I_CHANNEL_LIST], this.mouseX, this.mouseY)
          && !(this.isNear(this.msgBar, 0, this.mouseX, this.mouseY))) {

          if (this.channelDUDelay) {
            clearTimeout(this.channelDUDelay);
            this.channelDUDelay = false;
          }
          this.channelDUDelay = setTimeout(() => {
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
              cui.contentWindow.style.maxWidth = 'calc(100% - ' + cui.membersListWidth + 'px)';
            } else {
              cui.membersList.style.width = 'var(--cui-members-width)';
              cui.membersList.style.minWidth = 'var(--cui-members-width)';
              cui.contentWindow.style.maxWidth = 'calc(100% - var(--cui-members-width))';
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
          this.contentWindow.style.maxWidth = 'calc(100% - ' + this.collapsedDistance + 'px)';
          this.isCollapsed[this.I_MEMBERS_LIST] = true;
        }
      }

      // Profile Panel
      if ((BdApi.getData('CollapsibleUI', 'profilePanelButtonActive') === 'false') && this.profilePanel) {
        if (this.dynamicUncollapseEnabled[this.I_USER_PROFILE]
          && this.isCollapsed[this.I_USER_PROFILE] && this.isNear(this.profilePanel,
          this.dynamicUncollapseDistance[this.I_USER_PROFILE], this.mouseX,
          this.mouseY) && !(this.isNear(this.msgBar, 0,
          this.mouseX, this.mouseY))) {

          if (this.panelDUDelay) {
            clearTimeout(this.panelDUDelay);
            this.panelDUDelay = false;
          }
          this.panelDUDelay = setTimeout(() => {
            cui.profilePanel.style.maxWidth = cui.profilePanelMaxWidth + 'px';
            cui.profilePanel.style.removeProperty('min-width');
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
          this.profilePanel.style.maxWidth = this.collapsedDistance + 'px';
          this.profilePanel.style.minWidth = '0px';
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
        if (BdApi.getData('CollapsibleUI', 'profilePanelButtonActive') === 'true') {
          if (this.disableTransitions) {
            this.profilePanel.style.display = 'none';
          } else {
            this.profilePanel.style.maxWidth = this.collapsedDistance + 'px';
            this.profilePanel.style.minWidth = '0px';
          }
          BdApi.setData('CollapsibleUI', 'profilePanelButtonActive', 'false');
          this.profilePanelButton.classList.remove(this.classSelected);
        } else {
          if (this.disableTransitions) {
            this.profilePanel.style.removeProperty('display');
          } else {
            this.profilePanel.style.maxWidth = this.profilePanelMaxWidth + 'px';
            this.profilePanel.style.removeProperty('min-width');
          }
          BdApi.setData('CollapsibleUI', 'profilePanelButtonActive', 'true');
          this.profilePanelButton.classList.add(this.classSelected);
        }
        break;

      default:
        break;
      }
    }
  };
})();
